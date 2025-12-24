import os
import json
from math import floor

try:
    from PIL import Image
    import numpy as np
except Exception:
    print('Pillow or numpy not installed; please run: pip install pillow numpy')
    raise

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
EXPORTS = os.path.join(ROOT, 'exports')
THUMBS = os.path.join(EXPORTS, 'thumbs')

os.makedirs(THUMBS, exist_ok=True)

report = {'images': []}

for fn in sorted(os.listdir(EXPORTS)):
    if not fn.lower().endswith('.png'):
        continue
    src = os.path.join(EXPORTS, fn)
    try:
        img = Image.open(src).convert('RGBA')
    except Exception as e:
        print('failed open', fn, e)
        continue
    w,h = img.size
    # thumbnail width 360
    tw = 360
    th = int(h * (tw / w))
    thumb = img.resize((tw, th), Image.LANCZOS)
    out_path = os.path.join(THUMBS, fn)
    thumb.save(out_path, optimize=True)

    # compute luminance and contrast on RGB (ignore alpha)
    arr = np.array(img.convert('RGB'), dtype=np.float32)
    r,g,b = arr[:,:,0], arr[:,:,1], arr[:,:,2]
    lum = 0.2126*r + 0.7152*g + 0.0722*b
    mean_lum = float(lum.mean())
    std_lum = float(lum.std())

    size_kb = os.path.getsize(src)/1024.0

    report['images'].append({
        'file': fn,
        'width': w,
        'height': h,
        'size_kb': round(size_kb,1),
        'mean_luminance': round(mean_lum,1),
        'std_luminance': round(std_lum,1),
        'thumb': os.path.relpath(out_path, ROOT)
    })

report_path = os.path.join(THUMBS, 'report.json')
with open(report_path, 'w', encoding='utf-8') as f:
    json.dump(report, f, indent=2, ensure_ascii=False)

print('Generated', len(report['images']), 'thumbnails in', THUMBS)
print('Report:', report_path)
