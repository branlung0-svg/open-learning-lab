"""Local copies of the pictures used in rebuilt lessons (lessons/src/**), so they load everywhere, including
private previews that block outside images. Runs in GitHub Actions (the build sandbox has no web access).
Usage: python tools/fetch_lesson_media.py [key-prefix]   (default c:math-l)
Reads data/media-wanted.json entries whose key starts with the prefix; writes img/c/<slug>.jpg and replaces
their data/commons.json entries with local paths and full credits. Same licence rules as tools/fetch_commons.py."""
import io, json, os, re, sys, time
os.environ['COMMONS_COPY'] = '1'
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import fetch_commons as fc
from PIL import Image

prefix = sys.argv[1] if len(sys.argv) > 1 else 'c:math-l'
wanted = [w for w in json.load(open('data/media-wanted.json')) if w['k'].startswith(prefix)]
out = json.load(open('data/commons.json')) if os.path.exists('data/commons.json') else {}
os.makedirs('img/c', exist_ok=True); n = 0
for w in wanted:
    k = w['k']
    if k in out and not str(out[k].get('f', '')).startswith('http') and os.path.exists(out[k]['f']): continue
    try:
        titles = ([w['file']] if w.get('file') else []) + (fc.candidates(w['q'], 'image') if w.get('q') else [])
        if not titles: print('NONE', k); continue
        I = fc.info(titles[:15], 1100)
        def ok(ii):  # same licence rule; a lesson may accept a smaller scan of a rare primary source ('minw')
            lic = fc.clean(ii.get('extmetadata', {}).get('LicenseShortName', {}).get('value'))
            return lic if fc.OK_LIC.match(lic) and ii.get('mime', '').startswith('image/') and ii.get('width', 0) >= int(w.get('minw', 640)) else None
        pick = next(((t, I[t], lic) for t in titles if t in I and (lic := ok(I[t]))), None)
        if not pick: print('NOFREE', k, titles[:3]); continue
        t, ii, lic = pick
        r = fc.s.get(ii.get('thumburl') or ii['url'], timeout=60); r.raise_for_status()
        im = Image.open(io.BytesIO(r.content)).convert('RGB'); im.thumbnail((1100, 1100))
        slug = re.sub(r'[^a-z0-9]+', '-', k.split(':', 1)[1].lower()).strip('-')
        path = f'img/c/{slug}.jpg'; im.save(path, quality=78, optimize=True, progressive=True)
        m = ii.get('extmetadata', {})
        out[k] = {'f': path, 'kind': 'image', 'title': t[5:], 'cap': w.get('cap', ''), 'desc': fc.clean(m.get('ImageDescription', {}).get('value'))[:400],
                  'artist': fc.clean(m.get('Artist', {}).get('value'))[:120], 'license': lic, 'date': fc.clean(m.get('DateTimeOriginal', {}).get('value'))[:40],
                  'page': ii.get('descriptionurl'), 'w': im.width, 'h': im.height, 'tags': w.get('tags', []), 'graphic': bool(w.get('graphic'))}
        n += 1; print('OK', k, '->', t, '|', lic); time.sleep(0.5)
    except Exception as e:
        print('ERR', k, e)
json.dump(out, open('data/commons.json', 'w'), ensure_ascii=False, indent=1, sort_keys=True)
print('saved', n)
