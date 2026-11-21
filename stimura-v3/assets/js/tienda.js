import './ui.js';
import { $, $$ } from './util.js';

// filtros por categoría (solo en /tienda/); la URL guarda el filtro (/stimura-v3/tienda/?c=waxmelts)
const filtros = $('#filtros');
if (filtros) {
  const tarjetas = $$('.tarjeta[data-categoria]');
  const aplicar = (cat) => {
    $$('.filtro', filtros).forEach((f) => f.setAttribute('aria-pressed', String(f.dataset.c === cat)));
    tarjetas.forEach((t) => { t.hidden = cat !== 'todo' && t.dataset.categoria !== cat; });
    const u = new URL(location.href);
    if (cat === 'todo') u.searchParams.delete('c'); else u.searchParams.set('c', cat);
    history.replaceState(null, '', u);
  };
  filtros.addEventListener('click', (e) => { const f = e.target.closest('[data-c]'); if (f) aplicar(f.dataset.c); });
  const inicial = new URL(location.href).searchParams.get('c');
  const validas = $$('.filtro', filtros).map((f) => f.dataset.c);
  aplicar(validas.includes(inicial) ? inicial : 'todo');
}
