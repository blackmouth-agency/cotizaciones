// Lo común a todas las páginas: menú, cajón del carrito, botones de agregar y apariciones.
import { PRODUCTOS } from './datos.js';
import { carrito } from './carrito.js';
import { $, $$, esc, pesos, urlWhatsApp, aviso } from './util.js';
import { TIENDA } from './datos.js';
import './carrusel.js';
import './efectos.js';
import './v4.js';

const porId = new Map(PRODUCTOS.map((p) => [p.id, p]));

// ---------- menú móvil
const menu = $('#menu'), abrirMenu = $('#abrir-menu'), velo = $('#velo');
function cerrarTodo() {
  menu?.classList.remove('abierto'); $('#cajon')?.classList.remove('abierto'); velo?.classList.remove('visible');
  abrirMenu?.setAttribute('aria-expanded', 'false'); $('#abrir-carrito')?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  document.body.classList.remove('cajon-abierto');
}
abrirMenu?.addEventListener('click', () => {
  const abrir = !menu.classList.contains('abierto');
  cerrarTodo();
  if (abrir) { menu.classList.add('abierto'); velo.classList.add('visible'); abrirMenu.setAttribute('aria-expanded', 'true'); }
});
velo?.addEventListener('click', cerrarTodo);
addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarTodo(); });
$$('#menu a').forEach((a) => a.addEventListener('click', cerrarTodo));

// ---------- cajón del carrito
const cajon = $('#cajon');
export function abrirCarrito() {
  cerrarTodo();
  cajon.classList.add('abierto'); velo.classList.add('visible');
  $('#abrir-carrito')?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  document.body.classList.add('cajon-abierto');
  $('#cerrar-carrito')?.focus();
}
$('#abrir-carrito')?.addEventListener('click', abrirCarrito);
$('#cerrar-carrito')?.addEventListener('click', cerrarTodo);

function pintarCajon() {
  const lista = $('#cajon-lista'), pie = $('#cajon-pie');
  const lineas = carrito.lineas();
  if (!lineas.length) {
    lista.innerHTML = '<div class="vacio"><b>Tu carrito está vacío</b>Agrega una vela, un waxmelt o un jabón y aparece aquí.</div>';
    pie.hidden = true;
  } else {
    lista.innerHTML = lineas.map(({ producto: p, cantidad }) => `
      <div class="linea">
        <img src="${esc(p.mini)}" alt="" width="72" height="86">
        <div><b>${esc(p.nombre)}</b><small>${esc(pesos(p.precio))}</small>
          <div class="cantidad" data-id="${esc(p.id)}">
            <button type="button" data-paso="-1" aria-label="Quitar uno de ${esc(p.nombre)}">−</button>
            <output aria-live="polite">${cantidad}</output>
            <button type="button" data-paso="1" aria-label="Agregar uno de ${esc(p.nombre)}">+</button>
          </div>
          <button type="button" class="quitar" data-quitar="${esc(p.id)}">Quitar</button>
        </div>
        <span class="valor">${esc(pesos(p.precio * cantidad))}</span>
      </div>`).join('');
    pie.hidden = false;
    $('#cajon-subtotal').textContent = pesos(carrito.subtotal());
    const texto = 'Hola Stimura 👋 Quiero hacer este pedido:\n' + lineas.map(({ producto: p, cantidad }) => `• ${cantidad} × ${p.nombre}`).join('\n');
    $('#cajon-whatsapp').href = urlWhatsApp(texto);
  }
  const n = carrito.unidades();
  $$('.contador').forEach((c) => { c.textContent = n; c.hidden = n === 0; c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); });
  $('#abrir-carrito')?.setAttribute('aria-label', `Carrito, ${n} ${n === 1 ? 'producto' : 'productos'}`);
}
$('#cajon-lista')?.addEventListener('click', (e) => {
  const paso = e.target.closest('[data-paso]');
  if (paso) {
    const id = paso.closest('[data-id]').dataset.id;
    const actual = carrito.lineas().find((l) => l.producto.id === id)?.cantidad ?? 0;
    const p = porId.get(id);
    const nuevo = actual + Number(paso.dataset.paso);
    if (nuevo > p.max) { aviso(`Máximo ${p.max} por pedido`); return; }
    carrito.poner(id, nuevo);
  }
  const q = e.target.closest('[data-quitar]');
  if (q) carrito.quitar(q.dataset.quitar);
});
carrito.alCambiar(pintarCajon);
pintarCajon();

// ---------- botones «agregar» en cualquier página
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-agregar]');
  if (!b) return;
  e.preventDefault();
  const id = b.dataset.agregar;
  const n = Number(b.dataset.cantidad ?? 1);
  const p = porId.get(id);
  if (!p) return;
  if (carrito.agregar(id, n)) {
    aviso(`${p.nombre} está en tu carrito`);
    const texto = b.querySelector('span');
    if (texto) { const antes = texto.textContent; b.classList.add('ok'); texto.textContent = 'Agregado'; setTimeout(() => { b.classList.remove('ok'); texto.textContent = antes; }, 1400); }
    if (b.dataset.abrir !== 'no') abrirCarrito();
  } else aviso(`Máximo ${p.max} de ${p.nombre} por pedido`);
});

// ---------- apariciones al hacer scroll
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('si'); io.unobserve(e.target); } }), { threshold: 0.12 });
$$('.rv').forEach((el) => io.observe(el));

// ---------- boletín (pie de página)
$$('[data-boletin]').forEach((f) => f.addEventListener('submit', async (e) => {
  e.preventDefault();
  const estado = $('.estado', f);
  const correo = f.correo.value.trim();
  if (!/^[^\s@<>]+@[^\s@<>]+\.[a-z]{2,}$/i.test(correo)) { estado.textContent = 'Revisa tu correo.'; return; }
  if (!f.autoriza.checked) { estado.textContent = 'Marca la autorización para poder escribirte.'; return; }
  const b = $('button', f); b.disabled = true; estado.textContent = 'Enviando…';
  try {
    const r = await fetch(`${TIENDA.api}/suscribir`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ correo, autoriza: true }), credentials: 'omit' });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || 'No pudimos inscribirte.');
    estado.textContent = '¡Listo! Te contaremos las novedades primero.'; f.reset();
  } catch (err) { estado.textContent = err.message; }
  b.disabled = false;
}));
