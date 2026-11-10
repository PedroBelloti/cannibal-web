"""Renderiza a Sequência B (Cinematic): a foto 3 animada por camadas locais.

Uso: python render.py <foto-original> <still-16x9> <pasta-de-saida> [--verify] [--step=N]
Grava frame_0001.png a frame_0169.png em 1920x1080 (com --step=N, só um quadro a cada N, para
prévia). O atleta sai da foto original e só é escalado e deslocado; o still estendido entra como
fundo e recebe a perspectiva, a luz, a névoa e a poeira. Com --verify, confere que o atleta, fora
das caixas dos logos desfocados, é idêntico à foto original passada pela mesma transformação, e
conta o fundo preenchido que aparece e as bordas do fundo que ficariam descobertas.
Decisões e critérios: docs/plan-sequencia-b.md.
"""

import sys
from dataclasses import dataclass
from pathlib import Path

import cv2
import numpy as np

sys.path.append(str(Path(__file__).resolve().parents[1]))
from layered import (  # noqa: E402
    Particles,
    fill_holes,
    fractal_noise,
    keystone_matrix,
    make_particles,
    particle_layer,
    scale_matrix,
    scrolled,
    smoothstep,
    to_uint8,
    warp_projective,
    write_frame,
    zoom_matrix,
)

HERE = Path(__file__).parent

FRAME_COUNT = 169
OUT_SIZE = (1920, 1080)
# Área de trabalho = recorte 16:9 do still (a partir de x 21), no tamanho nativo.
WORK_SIZE = (2731, 1536)
STILL_CROP_X = 21
# Posição da foto original dentro da área de trabalho. Deslocamento inteiro: a foto é colada sem
# reamostrar, e é o still que se ajusta a ela (escala e posição medidas por SIFT, ver o PLAN).
PHOTO_OFFSET = (1303, 6)
STILL_SCALE = 0.99926
STILL_SHIFT = (1323.85, 6.1)
SEAM_FEATHER = 40

WORK_SCALE = WORK_SIZE[0] / OUT_SIZE[0]

# Base do pescoço, em pixels da saída: ponto fixo do zoom e pivô da perspectiva do fundo.
ANCHOR = (1244.0, 506.0)
# As duas camadas começam na mesma escala (a foto como ela é) e já com folga nas bordas, que a
# perspectiva e o deslocamento do fundo consomem.
ZOOM_START = 1.06
FG_ZOOM_END = 1.62
BG_ZOOM_END = 1.25
# Arco da câmera: ela anda para a esquerda e desce enquanto se aproxima. O fundo desliza para a
# esquerda em relação ao atleta, o que esconde o saco atrás dele e descobre só parede lisa.
ARC_START = 0.22
ARC_END = 0.80
ARC_LINEAR_SHARE = 0.3
YAW_RANGE = (-0.07, 0.17)
PITCH_RANGE = (0.0, -0.07)
BG_SLIDE = (-60.0, 20.0)
FG_SLIDE = (14.0, 6.0)
# Desfoque do fundo em pixels da saída: cresce com a aproximação e tem um pico na virada.
FOCUS_END = 1.8
FOCUS_PULSE = 2.4
FOCUS_PULSE_SPAN = (0.40, 0.66)

# Caixas (x0, y0, x1, y1) em pixels da foto original. As do atleta são as únicas áreas dele que
# mudam; a do saco fica no fundo e é desfocada depois de o atleta ser retirado.
ATHLETE_LOGO_BOXES = ((762, 1137, 868, 1221), (416, 1179, 536, 1249), (240, 1195, 310, 1258), (602, 1489, 685, 1530))
BAG_TEXT_BOX = (809, 579, 896, 803)
LOGO_BLUR_SIGMA = 14.0
LOGO_FEATHER = 21

# Retângulos deixados pelo outpaint na parede esquerda, em pixels da área de trabalho: os dois
# primeiros recebem a parede vizinha (caixa, deslocamento da origem), o terceiro só é nivelado.
WALL_CLONES = (((322, 395, 572, 865), (250, 0)), ((300, 868, 572, 1078), (262, 0)))
WALL_RELEVEL_BOX = (300, 1070, 570, 1250)

# A luz do fundo vira de fria para quente junto com a troca de título em CinematicReveal.tsx.
TURN_START = 0.48
TURN_END = 0.58
COLD_GAIN = np.float32((1.05, 0.97, 0.87))
WARM_GAIN = np.float32((0.82, 0.98, 1.12))
GLOW_CENTER = (0.30, 0.36)
GLOW_SIGMA = 0.26
COLD_GLOW = np.float32((26, 18, 12))
WARM_GLOW = np.float32((16, 42, 76))
SHIMMER = 0.12

# Feixe de luz preso à cena (coordenadas da saída no zoom 1): entra pelo alto à esquerda e gira
# alguns graus ao longo da sequência. A luz e a névoa são calculadas em meia resolução.
SCENE_DIV = 2
BEAM_SOURCE = (120.0, -420.0)
BEAM_ANGLES = (50.0, 38.0)
BEAM_SPREAD = 7.0
BEAM_REACH = 2300.0
BEAM_LEVELS = (0.6, 1.3)
COLD_BEAM = np.float32((74, 62, 52))
WARM_BEAM = np.float32((48, 104, 170))
STREAK_CONTRAST = 0.7

FOG_STRENGTH = 0.5
FOG_BEAM_BOOST = 0.8
FOG_DEPTH = 0.3
COLD_FOG = np.float32((96, 84, 74))
WARM_FOG = np.float32((70, 112, 156))
# Sombra do atleta na parede: deslocamento (em pixels da saída no zoom 1) no começo e no fim.
SHADOW_STRENGTH = 0.3
SHADOW_OFFSETS = ((54.0, 30.0), (86.0, 22.0))
SHADOW_BLUR = 14.0
VIGNETTE = 0.3
VIGNETTE_BREATH = 0.07

# Três planos de poeira entre a parede e o atleta: (profundidade de 0 a 1, quantidade, tamanho,
# ganho, desfoque extra). Quanto mais perto do atleta, maior, mais desfocada e mais rápida.
DUST_PLANES = (
    (0.12, 260, (0.5, 1.4), (0.2, 0.6), 0.0),
    (0.45, 150, (1.0, 2.6), (0.15, 0.5), 1.2),
    (0.80, 46, (3.5, 8.0), (0.05, 0.16), 3.5),
)
DUST_GAIN = 0.75
DUST_AMBIENT = 0.3
COLD_DUST = np.float32((255, 236, 222))
WARM_DUST = np.float32((168, 214, 255))
VERIFY_FRAMES = (1, 43, 85, 127, 169)
SEED = 4843


@dataclass(frozen=True)
class Layers:
    """Camadas na área de trabalho. `core` é a região do atleta que tem de sair intacta."""

    photo: np.ndarray
    plate: np.ndarray
    alpha: np.ndarray
    fill: np.ndarray
    core: np.ndarray


@dataclass(frozen=True)
class Ambience:
    """Texturas fixas da sequência; `angle` e `distance` são medidos a partir da fonte do feixe."""

    noises: tuple[np.ndarray, ...]
    streaks: np.ndarray
    glow: np.ndarray
    angle: np.ndarray
    distance: np.ndarray
    low: np.ndarray
    vignette: np.ndarray
    dust: tuple[Particles, ...]


@dataclass(frozen=True)
class Pose:
    """Câmera num instante: matrizes 3x3 da cena (saída no zoom 1) para a saída."""

    fg: np.ndarray
    bg: np.ndarray
    fg_zoom: float
    bg_zoom: float
    fg_shift: np.ndarray
    bg_shift: np.ndarray
    focus: float


def read_image(path: str) -> np.ndarray:
    image = cv2.imread(path, cv2.IMREAD_COLOR)
    if image is None:
        raise FileNotFoundError(f"não foi possível ler {path}")
    return image


def box_weight(shape: tuple[int, int], boxes, offset: tuple[int, int], feather: int) -> np.ndarray:
    """Peso suave (0 a 1) das caixas, deslocadas por `offset`."""
    weight = np.zeros(shape, np.float32)
    for x0, y0, x1, y1 in boxes:
        weight[y0 + offset[1] : y1 + offset[1], x0 + offset[0] : x1 + offset[0]] = 1.0
    return cv2.GaussianBlur(weight, (feather, feather), 0)[..., None]


def blur_boxes(image: np.ndarray, boxes, offset: tuple[int, int]) -> np.ndarray:
    """Desfoca só dentro das caixas; fora da borda suave a imagem volta idêntica."""
    weight = box_weight(image.shape[:2], boxes, offset, LOGO_FEATHER)
    source = image.astype(np.float32)
    mixed = source + (cv2.GaussianBlur(source, (0, 0), LOGO_BLUR_SIGMA) - source) * weight
    return np.where(weight > 0, mixed, source)


def clone_from_neighbour(image: np.ndarray, box, shift) -> np.ndarray:
    x0, y0, x1, y1 = box
    source = image[y0 + shift[1] : y1 + shift[1], x0 + shift[0] : x1 + shift[0]]
    mask = np.full(source.shape[:2], 255, np.uint8)
    return cv2.seamlessClone(source, image, mask, ((x0 + x1) // 2, (y0 + y1) // 2), cv2.NORMAL_CLONE)


def relevel(image: np.ndarray, box) -> np.ndarray:
    """Troca o claro-escuro geral da caixa pelo da vizinhança e mantém a textura."""
    x0, y0, x1, y1 = box
    hole = np.zeros(image.shape[:2], np.uint8)
    hole[y0:y1, x0:x1] = 255
    low = cv2.GaussianBlur(image.astype(np.float32), (0, 0), 30)
    target = cv2.GaussianBlur(fill_holes(image, hole), (0, 0), 30)
    weight = cv2.GaussianBlur(hole.astype(np.float32) / 255, (31, 31), 0)[..., None]
    return to_uint8(image + (target - low) * weight)


def still_background(still_path: str) -> np.ndarray:
    """Still alinhado à foto original na área de trabalho, com a parede esquerda corrigida."""
    k, (sx, sy), (ox, oy) = STILL_SCALE, STILL_SHIFT, PHOTO_OFFSET
    matrix = np.float32([[k, 0, sx - k * ox], [0, k, sy - k * oy]])
    flags = cv2.INTER_CUBIC | cv2.WARP_INVERSE_MAP
    wall = cv2.warpAffine(read_image(still_path), matrix, WORK_SIZE, flags=flags, borderMode=cv2.BORDER_REPLICATE)
    for box, shift in WALL_CLONES:
        wall = clone_from_neighbour(wall, box, shift)
    return relevel(wall, WALL_RELEVEL_BOX)


def paste_photo(wall: np.ndarray, photo: np.ndarray) -> np.ndarray:
    """Cola a foto original sobre o still; só as bordas laterais são misturadas."""
    ox, oy = PHOTO_OFFSET
    rows = min(photo.shape[0], wall.shape[0] - oy)
    width = photo.shape[1]
    ramp = np.minimum(np.arange(width), width - 1 - np.arange(width)) / SEAM_FEATHER
    weight = np.clip(ramp, 0, 1).astype(np.float32)[None, :, None]
    region = wall[oy : oy + rows, ox : ox + width].astype(np.float32)
    blended = np.where(weight >= 1, photo[:rows], to_uint8(region + (photo[:rows] - region) * weight))
    base = wall.copy()
    base[oy : oy + rows, ox : ox + width] = blended
    # As linhas do still acima da foto são mais claras e formavam um risco no topo do quadro.
    base[:oy, ox : ox + width] = blended[0]
    return base


def on_canvas(mask: np.ndarray) -> np.ndarray:
    ox, oy = PHOTO_OFFSET
    canvas = np.zeros(WORK_SIZE[::-1], np.uint8)
    rows = min(mask.shape[0], canvas.shape[0] - oy)
    canvas[oy : oy + rows, ox : ox + mask.shape[1]] = mask[:rows]
    return canvas


def build_layers(photo_path: str, still_path: str) -> Layers:
    original = read_image(photo_path)
    mask = cv2.imread(str(HERE / "mask-atleta.png"), cv2.IMREAD_GRAYSCALE)
    if mask is None or mask.shape != original.shape[:2]:
        raise ValueError("mask-atleta.png ausente ou de tamanho diferente da foto; rode make_mask.py")
    alpha = on_canvas(mask)
    base = paste_photo(still_background(still_path), original)
    photo = to_uint8(blur_boxes(base, ATHLETE_LOGO_BOXES, PHOTO_OFFSET))

    hole = cv2.dilate((alpha > 0).astype(np.uint8) * 255, np.ones((15, 15), np.uint8))
    plate = blur_boxes(fill_holes(photo, hole), (BAG_TEXT_BOX,), PHOTO_OFFSET)
    logos = box_weight(alpha.shape, ATHLETE_LOGO_BOXES, PHOTO_OFFSET, LOGO_FEATHER)[..., 0] > 0
    # Margem de 4 px: a interpolação cúbica lê 2 px além do ponto e pode saturar em 255 na borda.
    safe = ((alpha == 255) & ~logos).astype(np.uint8) * 255
    core = cv2.erode(safe, np.ones((9, 9), np.uint8))
    return Layers(photo=photo, plate=plate.astype(np.float32), alpha=alpha, fill=hole, core=core)


def lerp(ends, x: float):
    return ends[0] + (ends[1] - ends[0]) * x


def dust_plane(rng, depth: float, count: int, sizes, gains):
    """Poeira de um plano; os planos mais próximos da câmera derivam mais rápido."""
    speed = 0.6 + 1.2 * depth
    return make_particles(rng, count, OUT_SIZE, (46 * speed, -34 * speed), (44 * speed, 36 * speed), sizes, gains)


def build_ambience() -> Ambience:
    rng = np.random.default_rng(SEED)
    w, h = OUT_SIZE
    ys, xs = np.mgrid[0:h:SCENE_DIV, 0:w:SCENE_DIV].astype(np.float32)
    glow_distance = np.hypot(xs - GLOW_CENTER[0] * w, ys - GLOW_CENTER[1] * h) / (GLOW_SIGMA * w)
    dx, dy = xs - BEAM_SOURCE[0], ys - BEAM_SOURCE[1]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    edge = np.hypot(xx / w - 0.5, yy / h - 0.5) / np.hypot(0.5, 0.5)
    planes = tuple(dust_plane(rng, depth, count, sizes, gains) for depth, count, sizes, gains, _ in DUST_PLANES)
    return Ambience(
        noises=tuple(fractal_noise(rng, (480, 270), 2.2) for _ in range(3)),
        streaks=fractal_noise(rng, (1024, 8), 1.4)[0],
        glow=np.exp(-0.5 * glow_distance**2).astype(np.float32),
        angle=np.degrees(np.arctan2(dy, dx)),
        distance=np.hypot(dx, dy),
        low=smoothstep(0.25, 1.0, ys / h).astype(np.float32),
        vignette=(edge**2).astype(np.float32)[..., None],
        dust=planes,
    )


def camera_pose(t: float) -> Pose:
    """Câmera no instante t: aproximação contínua e arco concentrado no meio da sequência."""
    arc = ARC_LINEAR_SHARE * t + (1 - ARC_LINEAR_SHARE) * float(smoothstep(ARC_START, ARC_END, t))
    fg_zoom = ZOOM_START * (FG_ZOOM_END / ZOOM_START) ** t
    bg_zoom = ZOOM_START * (BG_ZOOM_END / ZOOM_START) ** t
    fg_shift = np.float64(FG_SLIDE) * arc
    bg_shift = fg_shift + np.float64(BG_SLIDE) * arc
    pivot = (ANCHOR[0] + bg_shift[0], ANCHOR[1] + bg_shift[1])
    tilt = keystone_matrix(lerp(YAW_RANGE, arc), lerp(PITCH_RANGE, arc), pivot, OUT_SIZE)
    span = np.clip((t - FOCUS_PULSE_SPAN[0]) / (FOCUS_PULSE_SPAN[1] - FOCUS_PULSE_SPAN[0]), 0, 1)
    return Pose(
        fg=zoom_matrix(fg_zoom, ANCHOR, fg_shift),
        bg=tilt @ zoom_matrix(bg_zoom, ANCHOR, bg_shift),
        fg_zoom=fg_zoom,
        bg_zoom=bg_zoom,
        fg_shift=fg_shift,
        bg_shift=bg_shift,
        focus=FOCUS_END * t + FOCUS_PULSE * float(np.sin(np.pi * span) ** 2),
    )


def place_athlete(image: np.ndarray, pose: Pose) -> np.ndarray:
    """Leva uma camada do atleta da área de trabalho para a saída: só escala e deslocamento."""
    matrix = (pose.fg @ scale_matrix(1 / WORK_SCALE))[:2].astype(np.float32)
    return cv2.warpAffine(image, matrix, OUT_SIZE, flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)


def place_background(image: np.ndarray, pose: Pose, border=cv2.BORDER_REPLICATE) -> np.ndarray:
    return warp_projective(image, pose.bg @ scale_matrix(1 / WORK_SCALE), OUT_SIZE, border)


def scene_to_screen(field: np.ndarray, matrix: np.ndarray) -> np.ndarray:
    """Leva um campo calculado na grade da cena (meia resolução) para a saída."""
    return np.clip(warp_projective(field, matrix @ scale_matrix(SCENE_DIV), OUT_SIZE), 0, None)


def plane_view(pose: Pose, depth: float) -> tuple[float, np.ndarray]:
    """Zoom e deslocamento de um plano entre a parede (0) e o atleta (1)."""
    zoom = pose.bg_zoom ** (1 - depth) * pose.fg_zoom**depth
    return zoom, pose.bg_shift + (pose.fg_shift - pose.bg_shift) * depth


def beam_field(amb: Ambience, t: float) -> np.ndarray:
    """Feixe de luz na grade da cena, com raios que derivam devagar."""
    core = np.exp(-0.5 * ((amb.angle - lerp(BEAM_ANGLES, t)) / BEAM_SPREAD) ** 2)
    count = len(amb.streaks)
    rays = np.interp(amb.angle * 24 + 90 * t, np.arange(count), amb.streaks, period=count)
    reach = np.clip(1 - amb.distance / BEAM_REACH, 0, 1)
    return (core * (1 - STREAK_CONTRAST * (1 - rays)) * reach).astype(np.float32)


def fog_field(amb: Ambience, t: float, pose: Pose, beam: np.ndarray) -> np.ndarray:
    """Névoa em dois ruídos que rolam em sentidos opostos, mais densa embaixo e dentro do feixe."""
    size = amb.low.shape[::-1]
    density = 0.5 * (scrolled(amb.noises[1], 130 * t, -24 * t, size) + scrolled(amb.noises[2], -80 * t, 36 * t, size))
    zoom, shift = plane_view(pose, FOG_DEPTH)
    fog = scene_to_screen(smoothstep(0.36, 0.82, density) * amb.low, zoom_matrix(zoom, ANCHOR, shift))
    return fog * (1 + FOG_BEAM_BOOST * beam)


def dust_field(amb: Ambience, t: float, pose: Pose) -> np.ndarray:
    total = np.zeros(OUT_SIZE[::-1], np.float32)
    for particles, (depth, _, _, _, blur) in zip(amb.dust, DUST_PLANES):
        zoom, shift = plane_view(pose, depth)
        offset = (ANCHOR[0] * (1 - zoom) + shift[0], ANCHOR[1] * (1 - zoom) + shift[1])
        layer = particle_layer(particles, t, OUT_SIZE, zoom, offset)
        total += cv2.GaussianBlur(layer, (0, 0), blur) if blur > 0 else layer
    return total


def shadow_field(layers: Layers, pose: Pose, t: float) -> np.ndarray:
    """Sombra suave do atleta na parede, feita da máscara; desloca-se com o giro do feixe."""
    dx, dy = lerp(np.float64(SHADOW_OFFSETS), t)
    move = np.float64([[1, 0, dx * pose.fg_zoom], [0, 1, dy * pose.fg_zoom], [0, 0, 1]])
    matrix = scale_matrix(1 / SCENE_DIV) @ move @ pose.fg @ scale_matrix(1 / WORK_SCALE)
    small = (OUT_SIZE[0] // SCENE_DIV, OUT_SIZE[1] // SCENE_DIV)
    shade = cv2.warpAffine(layers.alpha, matrix[:2].astype(np.float32), small, flags=cv2.INTER_LINEAR)
    soft = cv2.GaussianBlur(shade.astype(np.float32) / 255, (0, 0), SHADOW_BLUR * pose.fg_zoom / SCENE_DIV)
    return cv2.resize(soft, OUT_SIZE, interpolation=cv2.INTER_LINEAR)


def apply_ambience(bg: np.ndarray, layers: Layers, amb: Ambience, pose: Pose, t: float) -> np.ndarray:
    """Foco, luz, sombra, névoa, poeira e vinheta; tudo no fundo, antes de o atleta entrar por cima."""
    warm = float(smoothstep(TURN_START, TURN_END, t))
    if pose.focus > 0.05:
        bg = cv2.GaussianBlur(bg, (0, 0), pose.focus)
    lit = bg * (1 + SHIMMER * (scrolled(amb.noises[0], 230 * t, -90 * t, OUT_SIZE)[..., None] - 0.5))
    lit = lit * (COLD_GAIN + (WARM_GAIN - COLD_GAIN) * warm)
    lit = lit * (1 - SHADOW_STRENGTH * shadow_field(layers, pose, t)[..., None])

    glow = scene_to_screen(amb.glow, pose.bg)[..., None]
    beam = scene_to_screen(beam_field(amb, t), pose.bg)[..., None] * lerp(BEAM_LEVELS, warm)
    lit = lit + glow * lerp((COLD_GLOW, WARM_GLOW), warm) + beam * lerp((COLD_BEAM, WARM_BEAM), warm)

    fog = np.clip(FOG_STRENGTH * fog_field(amb, t, pose, beam[..., 0]), 0, 1)[..., None]
    lit = lit + (lerp((COLD_FOG, WARM_FOG), warm) - lit) * fog
    dust = dust_field(amb, t, pose)[..., None] * (DUST_AMBIENT + glow + 1.6 * beam)
    lit = lit + dust * DUST_GAIN * lerp((COLD_DUST, WARM_DUST), warm)
    breath = VIGNETTE + VIGNETTE_BREATH * np.sin(2 * np.pi * 2 * t)
    return lit * (1 - breath * amb.vignette)


def render_frame(layers: Layers, amb: Ambience, index: int) -> np.ndarray:
    """Quadro `index` (1 a FRAME_COUNT)."""
    t = (index - 1) / (FRAME_COUNT - 1)
    pose = camera_pose(t)
    bg = apply_ambience(place_background(layers.plate, pose), layers, amb, pose, t)
    fg = place_athlete(layers.photo, pose).astype(np.float32)
    alpha = (place_athlete(layers.alpha, pose).astype(np.float32) / 255)[..., None]
    return to_uint8(fg * alpha + bg * (1 - alpha))


def verify_frame(layers: Layers, frame: np.ndarray, index: int) -> dict[str, int]:
    """Conta, no atleta fora das caixas dos logos, os pixels diferentes da foto transformada."""
    pose = camera_pose((index - 1) / (FRAME_COUNT - 1))
    athlete = place_athlete(layers.core, pose) == 255
    diff = np.any(frame != place_athlete(layers.photo, pose), axis=2)
    return {"atleta_px": int(athlete.sum()), "atleta_diff": int((diff & athlete).sum())}


def coverage(layers: Layers, index: int) -> tuple[int, int]:
    """Pixels de fundo preenchido visíveis e pixels que o fundo deixaria descobertos na borda."""
    pose = camera_pose((index - 1) / (FRAME_COUNT - 1))
    alpha = place_athlete(layers.alpha, pose)
    revealed = (place_background(layers.fill, pose) > 0) & (alpha < 255)
    full = np.full(WORK_SIZE[::-1], 255, np.uint8)
    uncovered = (place_background(full, pose, cv2.BORDER_CONSTANT) < 255) & (alpha < 255)
    return int(revealed.sum()), int(uncovered.sum())


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    steps = [int(a.split("=", 1)[1]) for a in sys.argv[1:] if a.startswith("--step=")] or [1]
    if len(args) != 3 or steps[0] < 1:
        raise SystemExit(__doc__)
    verify = "--verify" in sys.argv
    out = Path(args[2])
    out.mkdir(parents=True, exist_ok=True)
    layers, amb = build_layers(args[0], args[1]), build_ambience()

    checks = []
    for index in range(1, FRAME_COUNT + 1, steps[0]):
        frame = render_frame(layers, amb, index)
        if verify:
            checks.append((index, *coverage(layers, index)))
        if verify and index in VERIFY_FRAMES:
            print(index, verify_frame(layers, frame, index))
        write_frame(out, index, frame)
    if verify:
        worst = max(checks, key=lambda c: c[1])
        print(f"fundo preenchido visível: máximo {worst[1]} px no quadro {worst[0]}; último quadro {checks[-1][1]} px")
        print(f"borda do fundo descoberta: máximo {max(c[2] for c in checks)} px")


if __name__ == "__main__":
    main()
