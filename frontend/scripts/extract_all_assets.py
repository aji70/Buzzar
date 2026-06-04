#!/usr/bin/env python3
"""
Extract all Buzzar UI assets from the master BUZZQUIZ sheet (bee1.png, 1536×1024).
Run: .venv/bin/python scripts/extract_all_assets.py
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SHEET_PATH = ROOT.parent / "bee1.png"
OUT_DIR = ROOT / "public" / "assets"

# Master sheet background (dark brown)
BG_COLOR = (35, 26, 15)
BG_TOLERANCE = 48

# Crop boxes: (left, top, right, bottom) — tuned to exclude section labels
CROPS: dict[str, tuple[int, int, int, int]] = {
    # ── §1 Hex button states (exclude "Default/Hover/..." labels below) ──
    "hex_btn_default.png": (46, 92, 114, 162),
    "hex_btn_amber.png": (138, 92, 206, 162),
    "hex_btn_dark2.png": (230, 92, 298, 162),
    "hex_btn_green.png": (322, 92, 390, 162),
    "hex_btn_red.png": (414, 92, 482, 162),
    # Question strip + answer grid
    "banner_wood_wide.png": (28, 222, 498, 358),
    "hex_cell_empty.png": (44, 388, 118, 458),
    "hex_cell_filled.png": (128, 388, 202, 458),
    "hex_cell_half.png": (212, 388, 286, 458),
    "hex_cell_empty_sm.png": (44, 472, 118, 542),
    "hex_cell_filled_sm.png": (128, 472, 202, 542),
    "hex_large_1.png": (300, 388, 374, 458),
    "hex_large_2.png": (300, 472, 374, 542),
    "hex_med_1.png": (382, 388, 446, 452),
    "hex_med_2.png": (382, 472, 446, 536),
    "hex_med_3.png": (454, 388, 498, 452),
    "hex_med_4.png": (454, 472, 498, 536),
    # ── §2 Menus (center) ──
    "logo_buzzquiz.png": (538, 74, 718, 142),
    "nav_btn_home.png": (556, 174, 670, 200),
    "nav_btn_play.png": (556, 224, 670, 250),
    "nav_btn_profile.png": (556, 274, 670, 300),
    "nav_btn_shop.png": (556, 324, 670, 350),
    "nav_btn_leaderboard.png": (556, 374, 670, 400),
    "nav_btn_settings.png": (556, 424, 670, 450),
    "nav_btn_logout.png": (556, 474, 670, 500),
    "panel_wood_medium.png": (528, 58, 702, 512),
    "panel_wood_small_1.png": (718, 82, 898, 268),
    "panel_categories.png": (712, 288, 1012, 512),
    "panel_wood_small_2.png": (728, 108, 812, 198),
    "badge_hex_level.png": (748, 200, 818, 262),
    # ── §3 Progress bars (top-right) ──
    "progressbar_honeycomb.png": (1048, 82, 1510, 188),
    "progressbar_wax.png": (1048, 212, 1510, 318),
    "panel_hive_size.png": (1048, 342, 1510, 508),
    "honeycomb_cluster.png": (1088, 368, 1468, 488),
    "badge_level7.png": (1422, 228, 1502, 308),
    "hex_wood_1.png": (1120, 88, 1188, 148),
    "hex_wood_2.png": (1196, 88, 1264, 148),
    "hex_wood_3.png": (1272, 88, 1340, 148),
    "hex_wood_red.png": (1348, 88, 1416, 148),
    "hex_wood_green.png": (1424, 88, 1492, 148),
    "hex_large_3.png": (1200, 248, 1276, 308),
    "hex_large_4.png": (1284, 248, 1360, 308),
    # ── §4 Bee feedback (bees only; signs separate) ──
    "bee_happy_bucket.png": (118, 628, 228, 702),
    "bee_sad.png": (358, 628, 458, 702),
    "bee_cool_sunglasses.png": (585, 618, 705, 708),
    "effect_sparkles.png": (168, 582, 248, 662),
    "effect_green_swirl.png": (52, 582, 132, 662),
    "effect_golden_ring.png": (538, 548, 728, 728),
    "effect_smoke_clouds.png": (308, 592, 388, 672),
    "effect_ink_splats.png": (328, 648, 408, 708),
    "sign_wood_sm_1.png": (52, 708, 248, 752),
    "sign_wood_sm_2.png": (292, 708, 488, 752),
    "bee_silhouette_sm.png": (48, 848, 108, 908),
    "bee_silhouette_med.png": (168, 848, 248, 928),
    "bee_wink.png": (408, 848, 488, 928),
    # ── §5 Rewards (bottom-right) ──
    "chest_treasure.png": (848, 802, 1038, 992),
    "bee_wink_banner.png": (928, 838, 1028, 958),
    "trophy_hex_gold_full.png": (1158, 598, 1248, 688),
    "trophy_hex_honey1.png": (1268, 598, 1358, 688),
    "trophy_hex_honey2.png": (1368, 598, 1458, 688),
    "trophy_hex_empty.png": (1088, 598, 1148, 658),
    "leaf_gold.png": (848, 558, 918, 618),
    "leaf_green_1.png": (928, 558, 998, 618),
    "leaf_green_2.png": (1008, 558, 1078, 618),
}

CROPS["banner_wood_wide.png"] = (28, 228, 498, 352)
CROPS["banner_reward_full.png"] = (1025, 808, 1515, 1005)


def remove_background(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    pixels = img.load()
    w, h = img.size
    br, bg, bb = BG_COLOR
    tol = BG_TOLERANCE
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            is_bg = (
                abs(r - br) <= tol
                and abs(g - bg) <= tol
                and abs(b - bb) <= tol
            )
            is_dark = r < 28 and g < 28 and b < 22
            if is_bg or is_dark:
                pixels[x, y] = (0, 0, 0, 0)
    return img


def trim_transparent(img: Image.Image, padding: int = 2) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    left, top, right, bottom = bbox
    left = max(0, left - padding)
    top = max(0, top - padding)
    right = min(img.width, right + padding)
    bottom = min(img.height, bottom + padding)
    return img.crop((left, top, right, bottom))


def should_trim(name: str) -> bool:
    """Keep full panels/menus untrimmed for layout context."""
    skip = {
        "panel_wood_medium.png",
        "panel_categories.png",
        "panel_hive_size.png",
        "progressbar_honeycomb.png",
        "progressbar_wax.png",
        "banner_wood_wide.png",
        "banner_reward_full.png",
        "honeycomb_cluster.png",
    }
    return name not in skip


def main() -> None:
    if not SHEET_PATH.exists():
        raise SystemExit(f"Missing master sheet: {SHEET_PATH}")

    sheet = Image.open(SHEET_PATH)
    if sheet.size != (1536, 1024):
        print(f"Warning: expected 1536×1024, got {sheet.size}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    written: list[str] = []

    for filename, box in CROPS.items():
        crop = sheet.crop(box)
        crop = remove_background(crop)
        if should_trim(filename):
            crop = trim_transparent(crop)
        out_path = OUT_DIR / filename
        crop.save(out_path, "PNG", optimize=True)
        written.append(f"{filename} ({crop.size[0]}×{crop.size[1]})")

    print(f"Extracted {len(written)} assets to {OUT_DIR}\n")
    for line in sorted(written):
        print(f"  {line}")


if __name__ == "__main__":
    main()
