"""Fetch freely licensed pictures and archival film from Wikimedia Commons for the Lab.
Runs in GitHub Actions (the build sandbox has no web access). Reads data/media-wanted.json:
  [{"k": "c:key", "q": "search words" | "file": "File:Exact name.jpg", "kind": "image"|"video", "cap": "our caption"}]
Writes img/c/<slug>.jpg (pictures and video posters, max 1100 px) and data/commons.json with full credits.
Only public-domain and Creative Commons (CC0, BY, BY-SA) files are accepted."""
import json, os, re, sys, time, io, html
import requests
from PIL import Image

API = 'https://commons.wikimedia.org/w/api.php'
UA = {'User-Agent': 'OpenLearningLab/1.0 (https://branlung0-svg.github.io/open-learning-lab/; educational, non-commercial)'}
OK_LIC = re.compile(r'^(public domain|pd|cc0|cc[ -]by(-sa)?[ -]?\d|cc by(-sa)? \d)', re.I)
s = requests.Session(); s.headers.update(UA)

def clean(x):
    x = re.sub(r'<[^>]+>', '', html.unescape(x or '')); return re.sub(r'\s+', ' ', x).strip()

def api(**p):
    p.update(format='json', formatversion=2)
    for i in range(4):
        r = s.get(API, params=p, timeout=40)
        if r.status_code == 200: return r.json()
        time.sleep(3 * (i + 1))
    r.raise_for_status()

def info(titles, width):
    d = api(action='query', titles='|'.join(titles), prop='imageinfo', iiprop='url|size|mime|extmetadata', iiurlwidth=width)
    out = {}
    for pg in d.get('query', {}).get('pages', []):
        if 'imageinfo' in pg: out[pg['title']] = pg['imageinfo'][0]
    return out

def candidates(q, kind):
    ft = 'filetype:video' if kind == 'video' else 'filetype:bitmap'
    d = api(action='query', list='search', srnamespace=6, srlimit=15, srsearch=f'{q} {ft}')
    return [x['title'] for x in d.get('query', {}).get('search', [])]

def acceptable(ii, kind):
    m = ii.get('extmetadata', {}); lic = clean(m.get('LicenseShortName', {}).get('value'))
    if not OK_LIC.match(lic): return None
    if kind == 'image' and (ii.get('width', 0) < 640 or not ii.get('mime', '').startswith('image/')): return None
    if kind == 'video' and not ii.get('mime', '').startswith(('video/', 'application/ogg')): return None
    return lic

def main():
    wanted = json.load(open('data/media-wanted.json'))
    out = json.load(open('data/commons.json')) if os.path.exists('data/commons.json') else {}
    os.makedirs('img/c', exist_ok=True); n = 0
    for w in wanted:
        k, kind = w['k'], w.get('kind', 'image')
        if k in out and not w.get('force'): continue
        try:
            titles = [w['file']] if w.get('file') else candidates(w['q'], kind)
            if not titles: print('NONE', k); continue
            I = info(titles[:15], 1100)
            pick = None
            for t in titles:
                ii = I.get(t)
                if ii and (lic := acceptable(ii, kind)): pick = (t, ii, lic); break
            if not pick: print('NOFREE', k, titles[:3]); continue
            t, ii, lic = pick; m = ii.get('extmetadata', {})
            slug = re.sub(r'[^a-z0-9]+', '-', k.split(':', 1)[1].lower()).strip('-')
            r = s.get(ii.get('thumburl') or ii['url'], timeout=60); r.raise_for_status()
            im = Image.open(io.BytesIO(r.content)).convert('RGB'); im.thumbnail((1100, 1100))
            im.save(f'img/c/{slug}.jpg', quality=80, optimize=True, progressive=True)
            out[k] = {'f': f'img/c/{slug}.jpg', 'kind': kind, 'title': t[5:], 'cap': w.get('cap', ''),
                      'desc': clean(m.get('ImageDescription', {}).get('value'))[:400], 'artist': clean(m.get('Artist', {}).get('value'))[:120],
                      'license': lic, 'date': clean(m.get('DateTimeOriginal', {}).get('value'))[:40], 'page': ii.get('descriptionurl'),
                      'w': im.width, 'h': im.height}
            if kind == 'video': out[k]['video'] = ii['url']
            n += 1; print('OK', k, '->', t, '|', lic)
            time.sleep(0.5)
        except Exception as e:
            print('ERR', k, e)
    json.dump(out, open('data/commons.json', 'w'), ensure_ascii=False, indent=1, sort_keys=True)
    print('added', n, 'total', len(out))

if __name__ == '__main__': main()
