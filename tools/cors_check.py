"""Runs in GitHub Actions: checks which open archive APIs answer browser requests from our site (CORS), and how many results they return."""
import json, requests
O = 'https://branlung0-svg.github.io'
Q = 'apartheid'
C = {
 'openverse': f'https://api.openverse.org/v1/images/?q={Q}&page_size=5',
 'met': f'https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q={Q}',
 'aic': f'https://api.artic.edu/api/v1/artworks/search?q={Q}&limit=5&fields=id,title,image_id',
 'europeana': f'https://api.europeana.eu/record/v2/search.json?wskey=api2demo&query={Q}&rows=5&media=true',
 'loc_search': f'https://www.loc.gov/search/?q={Q}&fo=json&c=5',
 'loc_newspapers': f'https://www.loc.gov/collections/chronicling-america/?q={Q}&fo=json&c=5',
 'chronam': f'https://chroniclingamerica.loc.gov/search/pages/results/?andtext={Q}&format=json&rows=5',
 'wellcome': f'https://api.wellcomecollection.org/catalogue/v2/images?query=cholera&pageSize=5',
 'ndl_japan': 'https://ndlsearch.ndl.go.jp/api/opensearch?any=%E5%8E%9F%E7%88%86&cnt=5',
 'nypl': f'https://api.repo.nypl.org/api/v2/items/search?q={Q}',
 'dpla': f'https://api.dp.la/v2/items?q={Q}',
 'smithsonian': f'https://api.si.edu/openaccess/api/v1.0/search?q={Q}&api_key=DEMO_KEY',
 'archive_org': f'https://archive.org/advancedsearch.php?q={Q}&fl[]=identifier&rows=5&output=json',
 'commons': f'https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={Q}&format=json&origin=*',
 'gallica': 'https://gallica.bnf.fr/SRU?operation=searchRetrieve&version=1.2&query=gallica%20all%20%22apartheid%22&maximumRecords=5',
 'rijks': 'https://data.rijksmuseum.nl/search/collection?title=Batavia',
 'cleveland': f'https://openaccess-api.clevelandart.org/api/artworks/?q={Q}&limit=5&has_image=1',
 'vam': f'https://api.vam.ac.uk/v2/objects/search?q={Q}&page_size=5',
 'harvard_lib': f'https://api.lib.harvard.edu/v2/items.json?q={Q}&limit=5',
 'trove': f'https://api.trove.nla.gov.au/v3/result?q={Q}&category=image',
 'digitalnz': f'https://api.digitalnz.org/records.json?text={Q}',
 'npm_taiwan': 'https://digitalarchive.npm.gov.tw/',
}
out = {}
for k, u in C.items():
    try:
        r = requests.get(u, headers={'Origin': O, 'User-Agent': 'OpenLearningLab/1.0 (educational; branlung0-svg.github.io)'}, timeout=25)
        out[k] = {'status': r.status_code, 'acao': r.headers.get('access-control-allow-origin'), 'type': r.headers.get('content-type', '')[:40], 'bytes': len(r.content), 'head': r.text[:160]}
    except Exception as e:
        out[k] = {'error': str(e)[:120]}
json.dump(out, open('plan/cors-check.json', 'w'), indent=1)
for k, v in out.items(): print(k, v.get('status'), v.get('acao'), v.get('type'), v.get('bytes'))
