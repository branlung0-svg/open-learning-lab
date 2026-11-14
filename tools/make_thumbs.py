"""Make 520-px thumbnails (img/c/t/) for every Commons picture and record them in data/commons.json as 't'."""
import json, os
from PIL import Image
C = json.load(open('data/commons.json')); os.makedirs('img/c/t', exist_ok=True); n = 0
for k, m in C.items():
    f = m['f']; t = f.replace('img/c/', 'img/c/t/')
    if not os.path.exists(f): continue
    if not os.path.exists(t):
        im = Image.open(f).convert('RGB'); im.thumbnail((520, 520)); im.save(t, quality=72, optimize=True, progressive=True); n += 1
    m['t'] = t
json.dump(C, open('data/commons.json', 'w'), ensure_ascii=False, indent=1, sort_keys=True); print('thumbs made', n)
