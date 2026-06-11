# Create Extension Icon

For packaging, you need a PNG icon (128x128 or larger).

## Quick Solution:

### Option 1: Use Online Converter
1. Go to https://cloudconvert.com/svg-to-png
2. Upload `media/icon.svg`
3. Set size to 128x128
4. Download as `icon.png`
5. Place in `media/icon.png`

### Option 2: Use ImageMagick (if installed)
```bash
magick convert media/icon.svg -resize 128x128 media/icon.png
```

### Option 3: Use Node.js Script
```bash
npm install -D sharp
node -e "require('sharp')('media/icon.svg').resize(128,128).toFile('media/icon.png')"
```

### Option 4: Create Simple Icon with Node Canvas
Run the command below to create a basic icon:
```bash
npm install -D canvas
```

Then create icon with the script in this folder.

## Temporary Solution (For Testing):
You can remove the icon field from package.json temporarily to package without an icon.
