"""Crop front and back business card artwork from the reference mockup."""
from pathlib import Path

from PIL import Image, ImageFilter
import numpy as np

SRC = Path(
    r"C:\Users\vibha\.cursor\projects\e-visiting-card\assets"
    r"\c__Users_vibha_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"8749f1df9ebf21c39b43d6b6a120a8ce_images_WhatsApp_Image_2026-10-24_"
    r"at_4.27.05_PM-d1b322fd-25fb-4cbf-b513-7787713e079a.png"
)
OUT_DIR = Path(__file__).resolve().parents[1] / "public" / "textures"
TARGET_RATIO = 3.5 / 2.0
OUT_SIZE = (1400, 800)


def background_mask(region: np.ndarray) -> np.ndarray:
    """True where pixel looks like studio gray / soft shadow."""
    rr = region[:, :, 0].astype(np.int16)
    gg = region[:, :, 1].astype(np.int16)
    bb = region[:, :, 2].astype(np.int16)
    chroma = np.maximum(np.abs(rr - gg), np.maximum(np.abs(gg - bb), np.abs(rr - bb)))
    # Neutral grayish tones across a wide luminance band (bg + soft shadows)
    return (chroma < 22) & (rr > 95) & (rr < 225)


def find_card_bbox(region: np.ndarray, y_offset: int = 0):
    content = ~background_mask(region)
    # Remove speckles
    from PIL import Image as PILImage

    mask_img = PILImage.fromarray((content.astype(np.uint8) * 255))
    mask_img = mask_img.filter(ImageFilter.MaxFilter(3))
    mask_img = mask_img.filter(ImageFilter.MinFilter(3))
    content = np.array(mask_img) > 127

    rows = np.any(content, axis=1)
    cols = np.any(content, axis=0)
    if not rows.any() or not cols.any():
        return None

    ys = np.where(rows)[0]
    xs = np.where(cols)[0]
    y0, y1 = int(ys[0]), int(ys[-1])
    x0, x1 = int(xs[0]), int(xs[-1])
    return (x0, y0 + y_offset, x1, y1 + y_offset)


def force_ratio(card: Image.Image) -> Image.Image:
    cw, ch = card.size
    current = cw / ch
    if current > TARGET_RATIO:
        new_w = int(ch * TARGET_RATIO)
        left = (cw - new_w) // 2
        return card.crop((left, 0, left + new_w, ch))
    new_h = int(cw / TARGET_RATIO)
    top = (ch - new_h) // 2
    return card.crop((0, top, cw, top + new_h))


def crop_and_save(im: Image.Image, bbox, name: str, inset_frac=(0.008, 0.012)):
    x0, y0, x1, y1 = bbox
    card = im.crop((x0, y0, x1 + 1, y1 + 1))
    cw, ch = card.size
    inset_x = max(1, int(cw * inset_frac[0]))
    inset_y = max(1, int(ch * inset_frac[1]))
    card = card.crop((inset_x, inset_y, cw - inset_x, ch - inset_y))
    card = force_ratio(card)
    card = card.resize(OUT_SIZE, Image.Resampling.LANCZOS)
    out = OUT_DIR / f"{name}.png"
    card.save(out, "PNG")
    print(f"saved {out} {card.size}")


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    im = Image.open(SRC).convert("RGB")
    arr = np.array(im)
    h, _w = arr.shape[:2]

    # Split with a small gap so soft shadow between cards doesn't merge them
    gap = 8
    mid = h // 2
    bbox_top = find_card_bbox(arr[: mid - gap], 0)
    bbox_bot = find_card_bbox(arr[mid + gap :], mid + gap)
    print("top", bbox_top)
    print("bot", bbox_bot)

    if not bbox_top or not bbox_bot:
        bbox_top = (95, 28, 930, 305)
        bbox_bot = (95, 365, 930, 645)

    # Manual refinement from visual inspection of 1024x682 mockup —
    # prefer detected bbox but clamp extreme outliers
    crop_and_save(im, bbox_top, "card-front", inset_frac=(0.01, 0.02))
    crop_and_save(im, bbox_bot, "card-back", inset_frac=(0.01, 0.018))


if __name__ == "__main__":
    main()
