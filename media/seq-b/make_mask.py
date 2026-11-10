"""Gera a máscara do atleta da Sequência B a partir da foto 3 original.

Uso: python make_mask.py <foto-original> [saida=mask-atleta.png]
A máscara sai no tamanho da foto original (1023x1537). Requer rembg (modelo bria-rmbg),
OpenCV e Pillow. Ver docs/plan-sequencia-b.md.
"""

import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from rembg import new_session, remove

sys.path.append(str(Path(__file__).resolve().parents[1]))
from layered import keep_main_body  # noqa: E402

MODEL = "bria-rmbg"


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    out = Path(sys.argv[2] if len(sys.argv) > 2 else Path(__file__).with_name("mask-atleta.png"))
    photo = Image.open(sys.argv[1]).convert("RGB")
    raw = np.array(remove(photo, session=new_session(MODEL), only_mask=True))
    mask = keep_main_body(raw)
    if not cv2.imwrite(str(out), mask):
        raise OSError(f"não foi possível gravar {out}")
    print(f"{out.name}: {mask.shape[1]}x{mask.shape[0]}, cobertura {100 * (mask > 127).mean():.1f}%")


if __name__ == "__main__":
    main()
