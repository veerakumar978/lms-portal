from PIL import Image
import os

img_path = 'logo.webp'
if not os.path.exists(img_path):
    print('logo.webp NOT found in project root.')
    exit(1)

img = Image.open(img_path)
print(f'Original dimensions: {img.size}')

# Ensure transparent alpha channel support
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# Target paths
os.makedirs('public/icons', exist_ok=True)

# 1. Save standard logo.png in public root and public/icons
img.save('public/logo.png', 'PNG')
img.save('public/icons/logo.png', 'PNG')
print('Saved public/logo.png and public/icons/logo.png')

# 2. Save favicon.ico
fav = img.resize((32, 32), Image.Resampling.LANCZOS)
fav.save('public/favicon.ico', 'ICO')
print('Saved public/favicon.ico')

# 3. Save PWA sizes
sizes = [72, 96, 128, 144, 152, 192, 384, 512]
for size in sizes:
    resized = img.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(f'public/icons/icon-{size}x{size}.png', 'PNG')
print(f'Saved PWA icons of sizes: {sizes}')

# 4. Save Apple touch icon
apple_icon = img.resize((180, 180), Image.Resampling.LANCZOS)
apple_icon.save('public/icons/apple-touch-icon.png', 'PNG')
print('Saved public/icons/apple-touch-icon.png')
