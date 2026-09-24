#!/usr/bin/env python3
"""Prepara cotizaciones HTML de BlackMouth antes de publicarlas.

Uso: python3 _herramientas/preparar.py ruta/al/archivo.html [otro.html ...]
     python3 _herramientas/preparar.py --todo      (todos los .html del repo)

Hace tres cosas en cada archivo:
  1. Quita target="_blank" de los enlaces (y los .target='_blank' / window.open(...,'_blank') en JS).
  2. Reemplaza cualquier favicon por el logo de la empresa (/logo.ico).
  3. Revisa enlaces a otros HTML del repo: si la ruta no existe pero hay un
     archivo con ese nombre en otra carpeta, la corrige; si no, la reporta.
"""
import os, re, sys, glob
from urllib.parse import urlsplit, unquote

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FAVICON = '<link rel="icon" href="/logo.ico" sizes="any">'
DOMINIOS_PROPIOS = ('cotizaciones.blackmouth.agency', 'blackmouth-agency.github.io')
IGNORAR = {'.git', '_herramientas', 'node_modules'}

def todos_html():
    out = []
    for raiz, dirs, files in os.walk(REPO):
        dirs[:] = [d for d in dirs if d not in IGNORAR]
        out += [os.path.join(raiz, f) for f in files if f.lower().endswith(('.html', '.htm'))]
    return out

def indice_html():
    idx = {}
    for p in todos_html():
        idx.setdefault(os.path.basename(p).lower(), []).append(p)
    return idx

def quitar_blank(html, notas):
    n = 0
    def tag(m):
        nonlocal n
        t = m.group(0)
        t2 = re.sub(r'\s+target\s*=\s*(["\']?)_blank\1', '', t, flags=re.I)
        if t2 != t: n += 1
        return t2
    html = re.sub(r'<(a|form|area|base)\b[^>]*>', tag, html, flags=re.I)
    html, k = re.subn(r'[\w\.\]\)]+\.target\s*=\s*(["\'])_blank\1\s*;?', '', html)
    n += k
    html, k = re.subn(r'window\.open\(\s*([^,()]+?)\s*,\s*(["\'])_blank\2\s*(?:,[^()]*)?\)', r'(window.location.href = \1)', html)
    n += k
    if n: notas.append(f'_blank quitados: {n}')
    return html

def poner_favicon(html, notas):
    html, k = re.subn(r'\s*<link\b[^>]*\brel\s*=\s*["\'][^"\']*\bicon\b[^"\']*["\'][^>]*>', '', html, flags=re.I)
    if re.search(r'</head>', html, re.I):
        # justo despues de <title> si existe, si no antes de </head>
        m = re.search(r'</title>', html, re.I)
        pos = m.end() if m else re.search(r'</head>', html, re.I).start()
        html = html[:pos] + '\n' + FAVICON + html[pos:]
        notas.append(f'favicon: {k} eliminado(s), logo.ico puesto')
    else:
        notas.append('AVISO: no hay <head>, no se pudo poner el favicon')
    return html

def revisar_links(path, html, idx, notas):
    base = os.path.dirname(path)
    def fix(m):
        attr, q, url = m.group(1), m.group(2), m.group(3)
        u = urlsplit(url)
        if u.scheme in ('mailto', 'tel', 'data', 'javascript', 'whatsapp') or url.startswith('#'):
            return m.group(0)
        if u.scheme in ('http', 'https'):
            if u.netloc.lower() in DOMINIOS_PROPIOS:
                notas.append(f'AVISO: enlace absoluto al propio sitio (ok si es intencional): {url}')
            return m.group(0)
        ruta = unquote(u.path)
        if not ruta:
            return m.group(0)
        destino = os.path.normpath(os.path.join(REPO, ruta.lstrip('/')) if ruta.startswith('/') else os.path.join(base, ruta))
        if os.path.isdir(destino):
            destino_f = os.path.join(destino, 'index.html')
        else:
            destino_f = destino
        if os.path.exists(destino_f):
            return m.group(0)
        if not ruta.lower().endswith(('.html', '.htm')):
            if attr.lower() == 'href' and not os.path.splitext(ruta)[1]:
                notas.append(f'ROTO (carpeta sin index.html): {url}')
            elif attr.lower() in ('href', 'src'):
                notas.append(f'ROTO (recurso no existe): {url}')
            return m.group(0)
        candidatos = idx.get(os.path.basename(ruta).lower(), [])
        candidatos = [c for c in candidatos if os.path.abspath(c) != os.path.abspath(path)] or candidatos
        if len(candidatos) == 1:
            nueva = os.path.relpath(candidatos[0], base).replace(os.sep, '/')
            resto = (('?' + u.query) if u.query else '') + (('#' + u.fragment) if u.fragment else '')
            notas.append(f'CORREGIDO: {url} -> {nueva}{resto}')
            return f'{attr}={q}{nueva}{resto}{q}'
        if len(candidatos) > 1:
            notas.append(f'ROTO (varios candidatos, decidir a mano): {url} -> ' + ', '.join(os.path.relpath(c, REPO) for c in candidatos))
        else:
            notas.append(f'ROTO (no existe en el repo): {url}')
        return m.group(0)
    return re.sub(r'\b(href|src)\s*=\s*(["\'])([^"\']*)\2', fix, html, flags=re.I)

def procesar(path, idx):
    with open(path, encoding='utf-8') as f: orig = f.read()
    notas = []
    html = quitar_blank(orig, notas)
    html = poner_favicon(html, notas)
    html = revisar_links(path, html, idx, notas)
    if html != orig:
        with open(path, 'w', encoding='utf-8', newline='') as f: f.write(html)
    print(f'\n== {os.path.relpath(path, REPO)}')
    for n in notas: print('  -', n)
    return not any(n.startswith('ROTO') for n in notas)

if __name__ == '__main__':
    args = sys.argv[1:]
    if not args:
        print(__doc__); sys.exit(1)
    archivos = todos_html() if args == ['--todo'] else [os.path.abspath(a) for a in args]
    idx = indice_html()
    ok = all([procesar(a, idx) for a in archivos])
    print('\nTODO OK' if ok else '\nHAY ENLACES ROTOS: revisar arriba')
    sys.exit(0 if ok else 2)
