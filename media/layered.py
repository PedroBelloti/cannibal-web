"""Motor comum das sequências animadas por camadas locais.

Usado por media/seq-a/render.py e media/seq-b/render.py: cada sequência define a sua foto, as
suas camadas e o seu ambiente; aqui fica o que é igual nas duas (zoom por camada, matrizes de
câmera, preenchimento do fundo, ruído, partículas e limpeza da máscara). Requer numpy e OpenCV.
Decisões: docs/plan-sequencia-a.md e docs/plan-sequencia-b.md.
"""

from dataclasses import dataclass
from pathlib import Path

import cv2
import numpy as np


@dataclass(frozen=True)
class Rig:
    """Geometria de uma sequência: tamanhos, ponto de zoom e zoom final de cada camada.

    `anchor` é dado em pixels da saída. A área de trabalho deve ser maior que a saída, para a
    camada ser reduzida, e não ampliada, mesmo no zoom máximo.
    """

    frame_count: int
    out_size: tuple[int, int]
    work_size: tuple[int, int]
    anchor: tuple[float, float]
    fg_zoom_end: float
    bg_zoom_end: float

    @property
    def work_scale(self) -> float:
        return self.work_size[0] / self.out_size[0]

    def time(self, index: int) -> float:
        """Instante (0 a 1) do quadro `index` (1 a frame_count)."""
        return (index - 1) / (self.frame_count - 1)

    def zooms(self, t: float) -> tuple[float, float]:
        """Zoom do atleta e do fundo no instante t; exponencial dá velocidade aparente constante."""
        return self.fg_zoom_end**t, self.bg_zoom_end**t

    def warp(self, image: np.ndarray, zoom: float) -> np.ndarray:
        """Leva uma camada da área de trabalho para a saída, com zoom em torno de `anchor`."""
        k = zoom / self.work_scale
        ax, ay = self.anchor
        matrix = np.float32([[k, 0, ax * (1 - zoom)], [0, k, ay * (1 - zoom)]])
        return cv2.warpAffine(image, matrix, self.out_size, flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)


def zoom_matrix(zoom: float, anchor: tuple[float, float], shift: tuple[float, float] = (0.0, 0.0)) -> np.ndarray:
    """Matriz 3x3 de zoom em torno de `anchor` seguido de deslocamento, em pixels da saída."""
    ax, ay = anchor
    return np.float64([[zoom, 0, ax * (1 - zoom) + shift[0]], [0, zoom, ay * (1 - zoom) + shift[1]], [0, 0, 1]])


def keystone_matrix(yaw: float, pitch: float, pivot: tuple[float, float], size: tuple[int, int]) -> np.ndarray:
    """Matriz 3x3 de perspectiva que mantém `pivot` parado.

    `yaw` > 0 encolhe o lado direito e aumenta o esquerdo, como uma câmera que anda para a
    esquerda olhando para o pivô; `pitch` > 0 faz o mesmo com a parte de baixo. O valor é a
    variação de escala ao longo de uma largura (ou altura) inteira do quadro.
    """
    px, py = pivot
    to_pivot = np.float64([[1, 0, -px], [0, 1, -py], [0, 0, 1]])
    tilt = np.float64([[1, 0, 0], [0, 1, 0], [yaw / size[0], pitch / size[1], 1]])
    back = np.float64([[1, 0, px], [0, 1, py], [0, 0, 1]])
    return back @ tilt @ to_pivot


def scale_matrix(factor: float) -> np.ndarray:
    return np.diag([factor, factor, 1.0])


def warp_projective(image: np.ndarray, matrix: np.ndarray, out_size: tuple[int, int], border=cv2.BORDER_REPLICATE):
    """Aplica uma matriz 3x3 (origem para saída) com interpolação cúbica."""
    return cv2.warpPerspective(image, matrix, out_size, flags=cv2.INTER_CUBIC, borderMode=border)


@dataclass(frozen=True)
class Particles:
    """Partículas fixas da sequência, em pixels da saída; o tempo só as desloca."""

    pos: np.ndarray
    vel: np.ndarray
    size: np.ndarray
    gain: np.ndarray


def smoothstep(edge0: float, edge1: float, x):
    t = np.clip((x - edge0) / (edge1 - edge0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def feathered_weight(protected: np.ndarray, feather: int) -> np.ndarray:
    """Peso dos efeitos: 0 exato dentro de `protected`, subindo suave para 1 fora."""
    kernel = np.ones((feather, feather), np.uint8)
    grown = cv2.dilate(protected, kernel).astype(np.float32) / 255
    soft = cv2.GaussianBlur(grown, (feather, feather), 0)
    return np.where(protected > 0, 0.0, 1.0 - soft).astype(np.float32)


def fill_holes(image: np.ndarray, hole: np.ndarray) -> np.ndarray:
    """Preenche a área `hole` com a cor desfocada da vizinhança (convolução normalizada)."""
    result = image.astype(np.float32)
    valid = (hole == 0).astype(np.float32)
    sigma = 6.0
    while valid.min() < 1.0 and sigma < 4000:
        weight = cv2.GaussianBlur(valid, (0, 0), sigma)
        blurred = cv2.GaussianBlur(result * valid[..., None], (0, 0), sigma)
        fillable = (valid == 0) & (weight > 0.05)
        result[fillable] = blurred[fillable] / weight[fillable][..., None]
        valid = np.where(fillable, 1.0, valid).astype(np.float32)
        sigma *= 2
    soft = cv2.GaussianBlur(result, (0, 0), 10)
    return np.where(hole[..., None] > 0, soft, result).astype(np.float32)


def fractal_noise(rng: np.random.Generator, size: tuple[int, int], falloff: float) -> np.ndarray:
    """Ruído suave e periódico (0 a 1), gerado no domínio da frequência para rolar sem emenda."""
    w, h = size
    fy = np.fft.fftfreq(h)[:, None]
    fx = np.fft.rfftfreq(w)[None, :]
    radius = np.sqrt(fx * fx + fy * fy)
    radius[0, 0] = 1.0
    spectrum = rng.normal(size=radius.shape) + 1j * rng.normal(size=radius.shape)
    spectrum = spectrum / radius**falloff
    spectrum[0, 0] = 0
    noise = np.fft.irfft2(spectrum, s=(h, w))
    lo, hi = np.percentile(noise, (1, 99))
    return np.clip((noise - lo) / (hi - lo), 0, 1).astype(np.float32)


def scrolled(noise: np.ndarray, dx: float, dy: float, out_size: tuple[int, int]) -> np.ndarray:
    """Desloca um ruído periódico e o amplia para o tamanho da saída."""
    matrix = np.float32([[1, 0, dx], [0, 1, dy]])
    moved = cv2.warpAffine(noise, matrix, noise.shape[::-1], flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_WRAP)
    return cv2.resize(moved, out_size, interpolation=cv2.INTER_LINEAR)


def make_particles(
    rng: np.random.Generator,
    count: int,
    out_size: tuple[int, int],
    vel_mean: tuple[float, float],
    vel_std: tuple[float, float],
    size_range: tuple[float, float],
    gain_range: tuple[float, float],
) -> Particles:
    """Sorteia as partículas; a velocidade é o deslocamento, em pixels, ao longo da sequência."""
    return Particles(
        pos=rng.uniform((0, 0), out_size, (count, 2)),
        vel=rng.normal(vel_mean, vel_std, (count, 2)),
        size=rng.uniform(*size_range, count),
        gain=rng.uniform(*gain_range, count),
    )


def particle_layer(
    particles: Particles,
    t: float,
    out_size: tuple[int, int],
    scale: float = 1.0,
    offset: tuple[float, float] = (0.0, 0.0),
) -> np.ndarray:
    """Intensidade (0 a 1) das partículas no instante t; as que saem do quadro voltam pelo outro lado.

    `scale` e `offset` aplicam a câmera sobre as partículas, depois da volta pelo outro lado.
    """
    canvas = np.zeros(out_size[::-1], np.float32)
    positions = ((particles.pos + particles.vel * t) % np.array(out_size)) * scale + np.array(offset)
    for (x, y), size, gain in zip(positions, particles.size, particles.gain):
        center = (int(round(x * 16)), int(round(y * 16)))
        cv2.circle(canvas, center, int(round(size * scale * 16)), float(gain), -1, cv2.LINE_AA, shift=4)
    return cv2.GaussianBlur(canvas, (0, 0), 1.1)


def keep_main_body(mask: np.ndarray) -> np.ndarray:
    """Mantém só o maior componente de uma máscara de segmentação e fecha os furos internos."""
    binary = (mask > 127).astype(np.uint8)
    count, labels, stats, _ = cv2.connectedComponentsWithStats(binary)
    if count < 2:
        raise ValueError("a segmentação não encontrou nenhum objeto")
    main = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    body = (labels == main).astype(np.uint8)

    # Furo interno = fundo que não alcança a borda da imagem.
    padded = cv2.copyMakeBorder(1 - body, 1, 1, 1, 1, cv2.BORDER_CONSTANT, value=1)
    _, outside, _, _ = cv2.floodFill(padded.copy(), None, (0, 0), 2)
    solid = (outside[1:-1, 1:-1] != 2).astype(np.uint8)

    near = cv2.dilate(solid, np.ones((9, 9), np.uint8))
    core = cv2.erode(solid, np.ones((9, 9), np.uint8))
    return np.where(core == 1, 255, np.where(near == 1, mask, 0)).astype(np.uint8)


def to_uint8(frame: np.ndarray) -> np.ndarray:
    return np.clip(np.rint(frame), 0, 255).astype(np.uint8)


def write_frame(out_dir: Path, index: int, frame: np.ndarray) -> None:
    if not cv2.imwrite(str(out_dir / f"frame_{index:04d}.png"), frame):
        raise OSError(f"falha ao gravar o quadro {index} em {out_dir}")
