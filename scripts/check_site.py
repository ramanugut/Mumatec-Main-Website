"""Check generated links, semantics and demo isolation before a batched push."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import re
ROOT=Path(__file__).resolve().parents[1]
PUBLIC=ROOT/'public'
errors=[]
class Page(HTMLParser):
    def __init__(self,path):
        super().__init__(); self.path=path; self.ids=[]; self.refs=[]; self.h1=0; self.robots=False
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='h1': self.h1+=1
        if 'id' in a: self.ids.append(a['id'])
        if tag=='meta' and a.get('name')=='robots' and 'noindex' in a.get('content',''): self.robots=True
        for key in ('href','src','action'):
            if a.get(key) and not (tag=='link' and a.get('rel')=='canonical'): self.refs.append(a[key])
        if tag=='img' and ('alt' not in a or not a.get('width') or not a.get('height')): errors.append(f'{self.path}: image semantics')
        if tag=='iframe' and not a.get('title'): errors.append(f'{self.path}: iframe title')
pages={}
for path in PUBLIC.rglob('*.html'):
    page=Page(path); page.feed(path.read_text()); pages[path.resolve()]=page
    if len(page.ids)!=len(set(page.ids)): errors.append(f'{path}: duplicate IDs')
    if path.parent==PUBLIC and page.h1!=1: errors.append(f'{path}: {page.h1} h1 elements')
    if not page.robots: errors.append(f'{path}: demo must be noindex')
    if re.search(r'get a free website|apply for free website|free website program',path.read_text(),re.I): errors.append(f'{path}: retired offer')
for path,page in pages.items():
    for ref in page.refs:
        parsed=urlsplit(ref)
        if parsed.scheme in ('tel','mailto'): continue
        if parsed.scheme or parsed.netloc: errors.append(f'{path.name}: active external route {ref}'); continue
        target=(PUBLIC/unquote(parsed.path.lstrip('/')) if parsed.path.startswith('/') else path.parent/unquote(parsed.path)).resolve() if parsed.path else path
        if target.is_dir(): target/='index.html'
        if not target.exists() and not target.suffix: target=target.with_suffix('.html')
        if not target.exists(): errors.append(f'{path.name}: missing {ref}')
        elif parsed.fragment and target in pages and parsed.fragment not in pages[target].ids: errors.append(f'{path.name}: missing anchor {ref}')
for css in PUBLIC.rglob('*.css'):
    for ref in re.findall(r'url\([\'"]?([^\'"\)]+)',css.read_text()):
        if not ref.startswith('data:') and not (css.parent/ref).exists(): errors.append(f'{css}: missing CSS asset {ref}')
config=json.loads((ROOT/'vercel.json').read_text())
if any(urlsplit(item['destination']).scheme for item in config['redirects']): errors.append('External deployment redirect')
if (PUBLIC/'design-preview').exists(): errors.append('Public review shell must not be published')
if errors: raise SystemExit('\n'.join(errors))
print(f'{len(pages)} HTML documents passed: local routes / assets / anchors, unique IDs, headings, noindex and isolation.')
