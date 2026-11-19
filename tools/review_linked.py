"""Runs in GitHub Actions. For every Commons item stored as a link (not a local file), check that the thumbnail
URL answers, and build numbered contact sheets (plan/review/sheet-NN.jpg + index json) for a human-style review."""
import json, io, os, sys, time, requests
from PIL import Image, ImageDraw
UA = {'User-Agent': 'OpenLearningLab/1.0 (https://branlung0-svg.github.io/open-learning-lab/; educational review)'}
C = json.load(open('data/commons.json'))
only = sys.argv[1] if len(sys.argv) > 1 else ''
keys = [k for k, v in C.items() if str(v.get('t', '')).startswith('http') and (k.startswith(('c:a-ism2-', 'v:ism-')) if only == 'NEWSET' else k.startswith(only))]
s = requests.Session(); s.headers.update(UA)
ok, bad, thumbs = [], [], {}
for k in keys:
    u = C[k]['t']
    for i in range(3):
        try:
            r = s.get(u, timeout=30)
            if r.status_code == 200:
                im = Image.open(io.BytesIO(r.content)).convert('RGB'); im.thumbnail((240, 180)); thumbs[k] = im; ok.append(k); break
            if r.status_code == 429: time.sleep(5 * (i + 1)); continue
            bad.append([k, r.status_code, u]); break
        except Exception as e:
            if i == 2: bad.append([k, str(e)[:80], u])
            time.sleep(2)
    time.sleep(0.15)
os.makedirs("plan/review", exist_ok=True); print(len(ok), "ok", len(bad), "bad so far"); per = 30; idx = {}
for n in range(0, len(ok), per):
    chunk = ok[n:n + per]; sheet = Image.new('RGB', (6 * 250, 5 * 214), 'white'); d = ImageDraw.Draw(sheet)
    for j, k in enumerate(chunk):
        x, y = (j % 6) * 250, (j // 6) * 214; sheet.paste(thumbs[k], (x + 5, y + 5)); d.text((x + 5, y + 190), f'{j:02d} ' + k[2:34], fill='black')
    name = f'plan/review/sheet-{n // per:02d}.jpg'; sheet.save(name, quality=70); idx[name] = chunk
json.dump({'checked': len(keys), 'ok': len(ok), 'bad': bad, 'sheets': idx}, open('plan/review/index.json', 'w'), indent=1)
print(len(keys), 'checked', len(ok), 'ok', len(bad), 'bad')
