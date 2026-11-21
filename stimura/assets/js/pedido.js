import './ui.js';
import { TIENDA } from './datos.js';
import { carrito } from './carrito.js';
import { $, esc, pesos, urlWhatsApp } from './util.js';

const caja = $('#resultado');
const u = new URL(location.href);
const ref = u.searchParams.get('ref') ?? '';
const id = u.searchParams.get('id') ?? '';
let intentos = 0;

const VISTAS = {
  APROBADO: { icono: '✓', clase: 'ok', titulo: '¡Pago recibido!', texto: 'Gracias por tu compra. Ya estamos preparando tu pedido.' },
  PENDIENTE: { icono: '…', clase: 'espera', titulo: 'Estamos confirmando tu pago', texto: 'Algunos pagos (como PSE) tardan unos minutos. Esta página se actualiza sola.' },
  RECHAZADO: { icono: '×', clase: 'mal', titulo: 'El pago no se completó', texto: 'No se hizo ningún cobro. Tu carrito sigue guardado para que lo intentes de nuevo.' },
  ANULADO: { icono: '×', clase: 'mal', titulo: 'El pago fue anulado', texto: 'Si crees que es un error, escríbenos por WhatsApp con tu número de pedido.' },
  ERROR: { icono: '!', clase: 'mal', titulo: 'Hubo un problema con el pago', texto: 'Escríbenos por WhatsApp con tu número de pedido y lo revisamos.' },
};

function pintar(p) {
  const v = VISTAS[p.estado] ?? VISTAS.ERROR;
  const aviso = p.estado === 'APROBADO'
    ? `Hola Stimura 👋 Acabo de pagar el pedido ${p.referencia}.${p.envio_cotizar ? ' Quedo atento(a) al costo del envío.' : ''}`
    : `Hola Stimura 👋 Tengo una pregunta sobre el pedido ${p.referencia}.`;
  caja.innerHTML = `
    <div class="icono ${v.clase}" aria-hidden="true">${v.icono}</div>
    <h1>${esc(v.titulo)}</h1>
    <p>${esc(v.texto)}</p>
    ${p.estado === 'APROBADO' && p.envio_cotizar ? '<p><b>Envío:</b> te escribimos por WhatsApp con el costo del envío para coordinar la entrega.</p>' : ''}
    <div class="bloque">
      <p>Pedido <span class="ref">${esc(p.referencia)}</span></p>
      ${(p.items ?? []).map((i) => `<div class="totales"><div><span>${i.cantidad} × ${esc(i.nombre)}</span><span>${esc(pesos(i.subtotal))}</span></div></div>`).join('')}
      <div class="totales"><div><span>${esc(p.envio_nombre)}</span><span>${p.envio_cotizar ? 'Se cotiza aparte' : p.envio === 0 ? 'Gratis' : esc(pesos(p.envio))}</span></div>
      <div class="total"><span>Total</span><span>${esc(pesos(p.total))}</span></div></div>
    </div>
    <div class="acciones">
      <a class="boton" href="${esc(urlWhatsApp(aviso))}" rel="noopener">Escribir por WhatsApp</a>
      ${p.estado === 'RECHAZADO' ? '<a class="boton borde" href="/stimura/pagar/">Intentar de nuevo</a>' : '<a class="boton borde" href="/stimura/tienda/">Seguir viendo</a>'}
    </div>`;
  document.title = `${v.titulo} · Stimura`;
  if (p.estado === 'APROBADO' && sessionStorage.getItem('stimura-vaciado') !== p.referencia) {
    carrito.vaciar(); sessionStorage.setItem('stimura-vaciado', p.referencia);
  }
}

async function consultar() {
  if (!/^STM-[A-Z2-9]{12}$/.test(ref)) { caja.innerHTML = '<h1>No encontramos ese pedido</h1><p>Revisa el enlace o escríbenos por WhatsApp.</p>'; return; }
  try {
    const q = new URLSearchParams({ ref }); if (id) q.set('id', id);
    const r = await fetch(`${TIENDA.api}/estado-pedido?${q}`, { credentials: 'omit' });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error);
    pintar(j);
    if (j.estado === 'PENDIENTE' && ++intentos < 30) setTimeout(consultar, 4000);
  } catch {
    caja.innerHTML = '<h1>No pudimos consultar tu pedido</h1><p>Recarga la página en un momento. Si ya pagaste, tu pago está a salvo.</p>';
  }
}
consultar();
