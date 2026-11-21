import { TIENDA } from './datos.js';

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const MAPA = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
/** Todo texto que entra a una plantilla HTML pasa por aquí. */
export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => MAPA[c]);

export const pesos = (n) => '$' + Math.round(n).toLocaleString('es-CO').replace(/,/g, '.');

export const urlWhatsApp = (texto) => `https://wa.me/${TIENDA.whatsapp}?text=${encodeURIComponent(texto)}`;

export const reduceMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;

export function guardar(clave, valor) {
  try { localStorage.setItem(clave, JSON.stringify(valor)); } catch { /* modo privado: el carrito vive en la sesión */ }
}
export function leer(clave) {
  try { return JSON.parse(localStorage.getItem(clave) ?? 'null'); } catch { return null; }
}

let temporizador;
export function aviso(texto) {
  let a = $('#aviso');
  if (!a) { a = document.createElement('div'); a.id = 'aviso'; a.className = 'aviso'; a.setAttribute('role', 'status'); document.body.append(a); }
  a.textContent = texto;
  requestAnimationFrame(() => a.classList.add('visible'));
  clearTimeout(temporizador);
  temporizador = setTimeout(() => a.classList.remove('visible'), 2600);
}
