"""Publish the client repo's synthetic fixtures in the site's isolated review area."""
import argparse
from pathlib import Path
from shutil import copytree
parser=argparse.ArgumentParser()
parser.add_argument('--client-root',type=Path,default=Path(__file__).resolve().parents[2]/'Mumatec-Client-Area')
args=parser.parse_args()
target=Path(__file__).resolve().parents[1]/'public/design-preview/client'
copytree(args.client_root/'preview',target,dirs_exist_ok=True)
for page in target.glob('*.html'):
    page.write_text(page.read_text().replace('<head>','<head><base href="/design-preview/client/">',1))
print('Synced client fixtures with a stable asset base for Vercel clean index routes.')
