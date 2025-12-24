import os
import struct

def png_info(path):
    with open(path, 'rb') as f:
        sig = f.read(8)
        if sig != b'\x89PNG\r\n\x1a\n':
            return None
        # skip length(4) and chunk type(4)
        f.read(8)
        ihdr = f.read(13)
        if len(ihdr) < 13:
            return None
        width, height = struct.unpack('>II', ihdr[0:8])
        bit_depth = ihdr[8]
        color_type = ihdr[9]
        return {
            'width': width,
            'height': height,
            'bit_depth': bit_depth,
            'color_type': color_type,
            'size_kb': os.path.getsize(path)/1024.0
        }

def main():
    exports_dir = os.path.join(os.path.dirname(__file__), '..', 'exports')
    exports_dir = os.path.abspath(exports_dir)
    if not os.path.isdir(exports_dir):
        print('exports/ not found at', exports_dir)
        return
    files = sorted([f for f in os.listdir(exports_dir) if f.lower().endswith('.png')])
    if not files:
        print('No PNGs found in', exports_dir)
        return
    for fn in files:
        p = os.path.join(exports_dir, fn)
        info = png_info(p)
        if not info:
            print(fn, '-> not a valid PNG or failed to read')
            continue
        ct = info['color_type']
        ct_desc = {
            0: 'Grayscale',
            2: 'RGB',
            3: 'Indexed-color',
            4: 'Grayscale with alpha',
            6: 'RGBA'
        }.get(ct, f'Unknown({ct})')
        print(f"{fn}: {info['width']}x{info['height']} px | {ct_desc} | {info['size_kb']:.1f} KB")

if __name__ == '__main__':
    main()
