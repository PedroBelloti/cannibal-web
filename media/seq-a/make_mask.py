"""Gera a máscara do atleta da Sequência A a partir da foto 1.

Uso: python make_mask.py <foto-original> [saida=mask-atleta.png]
Requer rembg (modelo bria-rmbg), OpenCV e Pillow. Ver docs/plan-sequencia-a.md.
"""

import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from rembg import new_session, remove

from render import CROP_BOX, WORK_SIZE

MODEL = "bria-rmbg"


def keep_main_body(mask: np.ndarray) -> np.ndarray:
    """Mantém só o maior componente da máscara e fecha os furos internos."""
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


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    out = Path(sys.argv[2] if len(sys.argv) > 2 else Path(__file__).with_name("mask-atleta.png"))
    photo = Image.open(sys.argv[1]).convert("RGB").crop(CROP_BOX)
    raw = np.array(remove(photo, session=new_session(MODEL), only_mask=True))
    mask = cv2.resize(keep_main_body(raw), WORK_SIZE, interpolation=cv2.INTER_AREA)
    if not cv2.imwrite(str(out), mask):
        raise OSError(f"não foi possível gravar {out}")
    print(f"{out.name}: {mask.shape[1]}x{mask.shape[0]}, cobertura {100 * (mask > 127).mean():.1f}%")


if __name__ == "__main__":
    main()
