"""Renderiza a Sequência A (Hero): a foto 1 animada por camadas locais.

Uso: python render.py <foto-original> <pasta-de-saida> [--verify]
Grava frame_0001.png a frame_0169.png em 1920x1080. Com --verify, confere que o atleta e as
regiões protegidas são idênticos à foto original passada pela mesma escala, antes da revelação
pela luz, que só escurece o quadro inteiro no começo da sequência.
Decisões e critérios: docs/plan-sequencia-a.md.
"""

import sys
from dataclasses import dataclass
from pathlib import Path

import cv2
import numpy as np

sys.path.append(str(Path(__file__).resolve().parents[1]))
from layered import (  # noqa: E402
    Particles,
    Rig,
    feathered_weight,
    fill_holes,
    fractal_noise,
    make_particles,
    particle_layer,
    scrolled,
    smoothstep,
    to_uint8,
    write_frame,
)

HERE = Path(__file__).parent

FRAME_COUNT = 169
OUT_SIZE = (1920, 1080)
# Recorte 16:9 alinhado ao topo: a cabeça e o crédito do fotógrafo ficam no alto da foto.
CROP_BOX = (0, 0, 5056, 2844)
# Área de trabalho 1,5x a saída: no zoom máximo a camada ainda é reduzida, nunca ampliada.
WORK_SIZE = (2880, 1620)

# O atleta cresce mais que o fundo a partir de um ponto na base do pescoço (pixels da saída);
# assim ele só cobre mais fundo. Mais alto que isso, o ombro descobre uma faixa junto ao homem
# ao fundo, que teria de ser inventada.
ANCHOR = (900.0, 760.0)
FG_ZOOM_END = 1.38
BG_ZOOM_END = 1.12
RIG = Rig(FRAME_COUNT, OUT_SIZE, WORK_SIZE, ANCHOR, FG_ZOOM_END, BG_ZOOM_END)
warp = RIG.warp

# Regiões que não recebem efeito, em pixels do recorte original: o homem desfocado ao fundo e as
# formas desfocadas do canto inferior esquerdo, que não dá para afirmar que não são pessoas.
PROTECTED_POLYGONS = (
    ((3300, 400), (5056, 400), (5056, 2844), (3300, 2844)),
    ((0, 1550), (450, 1550), (450, 2050), (2000, 2050), (2000, 2844), (0, 2844)),
)
PROTECTED_FEATHER = 61
SIGNATURE_BOX = (0, 20, 560, 170)

FLOW_AMPLITUDE = 26.0
SMOKE_STRENGTH = 0.5
GLOW_STRENGTH = 0.4
GLOW_CENTER = (0.12, 0.45)
PARTICLE_COUNT = 380
FX_RAMP_END = 0.15

# Revelação pela luz: a cena começa quase na cor do site e a luz se espalha a partir do clarão
# vermelho. Depois de REVEAL_END o ganho é exatamente 1 e o quadro não é mais tocado.
REVEAL_END = 0.32
REVEAL_FLOOR = 0.07
REVEAL_SPREAD = 0.55
SITE_BACKGROUND = (11, 10, 10)
VERIFY_FRAMES = (1, 43, 85, 127, 169)
SEED = 4230


@dataclass(frozen=True)
class Layers:
    """Camadas na área de trabalho, prontas para serem escaladas a cada quadro."""

    photo: np.ndarray
    plate: np.ndarray
    alpha: np.ndarray
    fill: np.ndarray
    fx_weight: np.ndarray
    signature: np.ndarray


def load_photo(path: str) -> np.ndarray:
    image = cv2.imread(path, cv2.IMREAD_COLOR)
    if image is None:
        raise FileNotFoundError(f"não foi possível ler a foto: {path}")
    x0, y0, x1, y1 = CROP_BOX
    if image.shape[0] < y1 or image.shape[1] < x1:
        raise ValueError(f"foto menor que o recorte esperado {CROP_BOX}: {image.shape[1]}x{image.shape[0]}")
    return cv2.resize(image[y0:y1, x0:x1], WORK_SIZE, interpolation=cv2.INTER_AREA)


def to_work(points) -> np.ndarray:
    return np.int32(np.array(points) * WORK_SIZE[0] / CROP_BOX[2])


def protected_mask() -> np.ndarray:
    mask = np.zeros(WORK_SIZE[::-1], np.uint8)
    for polygon in PROTECTED_POLYGONS:
        cv2.fillPoly(mask, [to_work(polygon)], 255)
    return mask


def signature_alpha(photo: np.ndarray) -> np.ndarray:
    """Alfa do crédito do fotógrafo: texto branco sobre fundo escuro, dentro de SIGNATURE_BOX."""
    x0, y0, x1, y1 = to_work(SIGNATURE_BOX)
    gray = cv2.cvtColor(photo, cv2.COLOR_BGR2GRAY).astype(np.float32)
    alpha = np.zeros_like(gray)
    alpha[y0:y1, x0:x1] = np.clip((gray[y0:y1, x0:x1] - 110) / 90, 0, 1)
    return alpha


def build_layers(photo_path: str) -> Layers:
    photo = load_photo(photo_path)
    alpha = cv2.imread(str(HERE / "mask-atleta.png"), cv2.IMREAD_GRAYSCALE)
    if alpha is None or alpha.shape[::-1] != WORK_SIZE:
        raise FileNotFoundError("mask-atleta.png ausente ou em tamanho diferente; rode make_mask.py")

    signature = signature_alpha(photo)
    # Sem folga além do atleta: cada pixel a mais aqui é um pixel do fundo trocado por borrão.
    hole = (alpha > 0).astype(np.uint8)
    hole = np.maximum(hole, cv2.dilate((signature > 0).astype(np.uint8), np.ones((9, 9), np.uint8)))
    return Layers(
        photo=photo,
        plate=fill_holes(photo, hole),
        alpha=alpha,
        fill=hole * 255,
        fx_weight=feathered_weight(protected_mask(), PROTECTED_FEATHER),
        signature=signature,
    )


@dataclass(frozen=True)
class Ambience:
    """Texturas e partículas fixas da sequência; o tempo só desloca o que está aqui."""

    noises: tuple[np.ndarray, ...]
    glow: np.ndarray
    light_distance: np.ndarray
    particles: Particles


def build_ambience() -> Ambience:
    rng = np.random.default_rng(SEED)
    half = (OUT_SIZE[0] // 2, OUT_SIZE[1] // 2)
    w, h = OUT_SIZE
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    dist = np.hypot((xx / w - GLOW_CENTER[0]), (yy / h - GLOW_CENTER[1]) * h / w)
    return Ambience(
        noises=tuple(fractal_noise(rng, half, f) for f in (2.2, 2.2, 1.9, 1.9)),
        glow=np.clip(1 - dist / 0.55, 0, 1) ** 2,
        light_distance=dist / dist.max(),
        particles=make_particles(rng, PARTICLE_COUNT, OUT_SIZE, (70, -110), (60, 50), (0.7, 2.4), (0.25, 0.75)),
    )


def apply_ambience(bg: np.ndarray, weight: np.ndarray, amb: Ambience, t: float) -> np.ndarray:
    """Fumaça em movimento, brilho vermelho e partículas sobre o fundo, onde `weight` permite."""
    ramp = float(smoothstep(0.0, FX_RAMP_END, t))
    h, w = bg.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    n1, n2, n3, n4 = amb.noises

    # A fumaça que já existe na foto é deslocada por um campo de fluxo que rola com o tempo.
    push = FLOW_AMPLITUDE * ramp * weight
    map_x = xx + push * (scrolled(n3, 260 * t, -90 * t, OUT_SIZE) - 0.5) * 2
    map_y = yy + push * (scrolled(n4, -150 * t, -200 * t, OUT_SIZE) - 0.5) * 2
    moved = cv2.remap(bg, map_x, map_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)

    density = smoothstep(0.42, 0.85, 0.5 * (scrolled(n1, 340 * t, -120 * t, OUT_SIZE) + scrolled(n2, -180 * t, -260 * t, OUT_SIZE)))
    tint = cv2.GaussianBlur(moved, (0, 0), 40) * 1.6 + 18
    haze = (SMOKE_STRENGTH * ramp * weight * density)[..., None]
    lit = moved + (tint - moved) * haze

    glow = (GLOW_STRENGTH * t * weight * amb.glow)[..., None]
    lit = lit * (1 + glow * np.float32([0.25, 0.3, 1.0]))

    specks = (particle_layer(amb.particles, t, OUT_SIZE) * ramp * weight)[..., None]
    return lit + specks * np.float32([200, 205, 255])


def render_frame(layers: Layers, amb: Ambience, index: int) -> np.ndarray:
    """Quadro `index` (1 a FRAME_COUNT) antes da revelação. O quadro 1 é a foto recortada."""
    t = RIG.time(index)
    fg_zoom, bg_zoom = RIG.zooms(t)

    # O fundo preenchido só entra onde o atleta estava; fora dali o fundo é a foto, pixel a pixel.
    # No começo ele ainda é misturado com a foto, para o quadro 1 ser exato.
    mix = float(smoothstep(0.0, 0.05, t))
    filled = warp(layers.fill, bg_zoom)[..., None] > 0
    bg = warp(layers.photo, bg_zoom).astype(np.float32)
    bg = np.where(filled, bg * (1 - mix) + warp(layers.plate, bg_zoom) * mix, bg)
    weight = warp(layers.fx_weight, bg_zoom)
    bg = np.where(weight[..., None] > 0, apply_ambience(bg, weight, amb, t), bg)

    fg = warp(layers.photo, fg_zoom).astype(np.float32)
    alpha = (warp(layers.alpha, fg_zoom).astype(np.float32) / 255)[..., None]
    frame = fg * alpha + bg * (1 - alpha)

    sign = warp(layers.signature, 1.0)[..., None]
    frame = frame * (1 - sign) + warp(layers.photo, 1.0).astype(np.float32) * sign
    return to_uint8(frame)


def apply_reveal(frame: np.ndarray, amb: Ambience, t: float) -> np.ndarray:
    """Escurece o quadro em direção à cor do site enquanto a luz ainda não chegou a cada ponto."""
    if t >= REVEAL_END:
        return frame
    reach = float(smoothstep(0.0, 1.0, t / REVEAL_END)) * (1 + REVEAL_SPREAD)
    lit = smoothstep(0.0, 1.0, (reach - amb.light_distance) / REVEAL_SPREAD)
    gain = (REVEAL_FLOOR + (1 - REVEAL_FLOOR) * lit)[..., None]
    base = np.float32(SITE_BACKGROUND)
    return to_uint8(base + (frame.astype(np.float32) - base) * gain)


def verify_frame(layers: Layers, frame: np.ndarray, index: int) -> dict[str, int]:
    """Conta pixels diferentes da foto escalada no atleta e nas regiões protegidas."""
    t = RIG.time(index)
    fg_zoom, bg_zoom = RIG.zooms(t)
    alpha = warp(layers.alpha, fg_zoom)
    sign = warp(layers.signature, 1.0) > 0
    athlete = (cv2.erode(alpha, np.ones((5, 5), np.uint8)) == 255) & ~sign
    protected = (
        (warp(protected_mask(), bg_zoom) == 255) & (alpha == 0) & (warp(layers.fill, bg_zoom) == 0) & ~sign
    )
    diff_fg = np.any(frame != warp(layers.photo, fg_zoom), axis=2)
    diff_bg = np.any(frame != warp(layers.photo, bg_zoom), axis=2)
    return {
        "atleta_px": int(athlete.sum()),
        "atleta_diff": int((diff_fg & athlete).sum()),
        "protegida_px": int(protected.sum()),
        "protegida_diff": int((diff_bg & protected).sum()),
    }


def revealed_pixels(layers: Layers) -> tuple[int, int]:
    """Pixels de fundo preenchido visíveis no último quadro: total e dentro das regiões protegidas."""
    fg_zoom, bg_zoom = RIG.zooms(1.0)
    shown = (warp(layers.fill, bg_zoom) > 0) & (warp(layers.alpha, fg_zoom) < 255)
    shown &= warp(layers.signature, 1.0) < 1
    return int(shown.sum()), int((shown & (warp(protected_mask(), bg_zoom) > 0)).sum())


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) != 2:
        raise SystemExit(__doc__)
    out = Path(args[1])
    out.mkdir(parents=True, exist_ok=True)
    layers, amb = build_layers(args[0]), build_ambience()
    total, protected = revealed_pixels(layers)
    print(f"fundo preenchido visível no último quadro: {total} px, {protected} px em região protegida")

    for index in range(1, FRAME_COUNT + 1):
        frame = render_frame(layers, amb, index)
        if "--verify" in sys.argv and index in VERIFY_FRAMES:
            print(index, verify_frame(layers, frame, index))
        write_frame(out, index, apply_reveal(frame, amb, RIG.time(index)))
    if "--verify" in sys.argv and not cv2.imwrite(str(out / "ref_0001.png"), warp(layers.photo, 1.0)):
        raise OSError("falha ao gravar a referência do quadro 1")


if __name__ == "__main__":
    main()
