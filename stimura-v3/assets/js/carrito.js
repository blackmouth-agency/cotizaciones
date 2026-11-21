// El carrito solo guarda qué productos y cuántos. Los precios que se ven aquí son informativos:
// el total que se cobra lo calcula el servidor con su propia lista de precios.
import { PRODUCTOS } from './datos.js';
import { guardar, leer } from './util.js';

const CLAVE = 'stimura-carrito';
const porId = new Map(PRODUCTOS.map((p) => [p.id, p]));
const oyentes = new Set();

function limpiar(crudo) {
  const items = {};
  if (crudo && crudo.v === 1 && crudo.items && typeof crudo.items === 'object') {
    for (const [id, n] of Object.entries(crudo.items)) {
      const p = porId.get(id);
      if (p && Number.isInteger(n) && n > 0) items[id] = Math.min(n, p.max);
    }
  }
  return items;
}

let items = limpiar(leer(CLAVE));
guardar(CLAVE, { v: 1, items }); // si alguien lo manipuló, queda guardado ya limpio

function cambio() {
  guardar(CLAVE, { v: 1, items });
  oyentes.forEach((f) => f());
}

export const carrito = {
  lineas: () => Object.entries(items).map(([id, cantidad]) => ({ producto: porId.get(id), cantidad })),
  unidades: () => Object.values(items).reduce((s, n) => s + n, 0),
  subtotal: () => Object.entries(items).reduce((s, [id, n]) => s + porId.get(id).precio * n, 0),
  agregar(id, n = 1) {
    const p = porId.get(id); if (!p) return false;
    const antes = items[id] ?? 0;
    items[id] = Math.min(antes + n, p.max);
    cambio();
    return items[id] > antes;
  },
  poner(id, n) {
    const p = porId.get(id); if (!p) return;
    if (n <= 0) delete items[id]; else items[id] = Math.min(n, p.max);
    cambio();
  },
  quitar(id) { delete items[id]; cambio(); },
  vaciar() { items = {}; cambio(); },
  alCambiar(f) { oyentes.add(f); },
  paraServidor: () => Object.entries(items).map(([id, cantidad]) => ({ id, cantidad })),
};

// otra pestaña cambió el carrito
addEventListener('storage', (e) => { if (e.key === CLAVE) { items = limpiar(leer(CLAVE)); oyentes.forEach((f) => f()); } });
