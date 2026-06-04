#!/usr/bin/env python3
"""
Re-crop PNG assets from the BUZZQUIZ UI kit master sheet (bee1.png).

Usage:
  python3 -m venv .venv
  .venv/bin/pip install pillow
  .venv/bin/python scripts/extract-ui-kit-assets.py

Note: This repo already ships pre-cropped assets in public/assets/.
      Run this only if you replace bee1.png or need to refresh crops.
"""
from __future__ import annotations

from pathlib import Path

try:
    from PIL import Image
except ImportError as exc:
    raise SystemExit(
        "Install Pillow: python3 -m venv .venv && .venv/bin/pip install pillow"
    ) from exc

ROOT = Path(__file__).resolve().parents[1]
SHEET = ROOT.parent / "bee1.png"
OUT = ROOT / "public" / "assets"

# Regions for 1536×1024 master sheet (left, top, right, bottom) — tune if sheet changes
REGIONS: dict[str, tuple[int, int, int, int]] = {
    # Section 4 — bee feedback (approximate)
    "bee_happy_bucket.png": (40, 520, 280, 720),
    "bee_sad.png": (300, 520, 520, 720),
    "bee_cool_sunglasses.png": (540, 520, 760, 720),
    # Section 5 — reward banner sample
    "banner_reward_full.png": (800, 560, 1500, 980),
}


def main() -> None:
    if not SHEET.exists():
        raise SystemExit(f"Master sheet not found: {SHEET}")

    sheet = Image.open(SHEET).convert("RGBA")
    OUT.mkdir(parents=True, exist_ok=True)

    for name, box in REGIONS.items():
        crop = sheet.crop(box)
        crop.save(OUT / name)
        print(f"Wrote {name} ({crop.size[0]}×{crop.size[1]})")

    print(f"\nDone. Assets in {OUT}")
    print("Add more REGIONS entries for other crops, or use an image editor for precision.")


if __name__ == "__main__":
    main()
