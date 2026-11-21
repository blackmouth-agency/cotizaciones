import './ui.js';
import { PRODUCTOS } from './datos.js';
import { $, $$, reduceMovimiento, aviso } from './util.js';
import { escenaCaja } from './caja-escena.js';

const raiz = $('[data-producto]');
const p = PRODUCTOS.find((x) => x.id === raiz?.dataset.producto);

// ---------- galería: miniaturas cambian la foto principal; la primera puede ser la caja 3D
const principal = $('#principal');
const foto = $('#foto-principal');
const escenario = $('#escenario');
let escena = null;
$('#miniaturas')?.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  $$('#miniaturas button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  if (b.dataset.tipo === '3d') {
    escenario.hidden = false; foto.hidden = true;
    if (!escena) escena = escenaCaja(escenario, [{ ...p.caja3d, id: p.caja3d.img }], () => ({ ...p.caja3d, id: p.caja3d.img }), reduceMovimiento);
  } else {
    escenario && (escenario.hidden = true); foto.hidden = false;
    foto.src = b.dataset.src; foto.alt = b.dataset.alt;
  }
});
if (escenario && !escenario.hidden) escena = escenaCaja(escenario, [{ ...p.caja3d, id: p.caja3d.img }], () => ({ ...p.caja3d, id: p.caja3d.img }), reduceMovimiento);

// ---------- cantidad
const salida = $('#cantidad'), boton = $('#agregar');
let n = 1;
$('#cantidad-caja')?.addEventListener('click', (e) => {
  const b = e.target.closest('[data-paso]'); if (!b) return;
  const nuevo = n + Number(b.dataset.paso);
  if (nuevo < 1) return;
  if (nuevo > p.max) { aviso(`Máximo ${p.max} por pedido`); return; }
  n = nuevo; salida.value = String(n); salida.textContent = String(n);
  boton.dataset.cantidad = String(n);
});
principal && principal.classList.add('listo');
