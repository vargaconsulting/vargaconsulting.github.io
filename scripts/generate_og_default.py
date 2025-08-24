from PIL import Image, ImageDraw, ImageFont
import os

# Image size: 1200x630
width, height = 1200, 630
bg_color = (10, 10, 10)      # dark background
text_color = (245, 245, 245) # near-white

# Create blank image
img = Image.new("RGB", (width, height), bg_color)
draw = ImageDraw.Draw(img)

# Load fonts (system fonts or adjust path if needed)
title_font = ImageFont.truetype("DejaVuSans-Bold.ttf", 80)
subtitle_font = ImageFont.truetype("DejaVuSans.ttf", 40)

# Helper: center text using textbbox
def draw_centered_text(y, text, font, fill):
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width, text_height = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (width - text_width) / 2
    draw.text((x, y), text, font=font, fill=fill)

# Title
draw_centered_text(height/2 - 100, "Steven Varga Blog", title_font, text_color)

# Subtitle
draw_centered_text(height/2 + 20, "HDF5 • C++ • Cryptography • Trading Systems",
                   subtitle_font, (180, 180, 180))

# Footer
draw_centered_text(height - 100, "steven-varga.ca", subtitle_font, (200, 200, 200))

# Save image
out_path = "docs/assets/images/og-default.png"
os.makedirs(os.path.dirname(out_path), exist_ok=True)
img.save(out_path)
print("Generated og-default.png")
