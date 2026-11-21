import './ui.js';
import { TIENDA } from './datos.js';
import { carrito } from './carrito.js';
import { $, $$, esc, pesos, urlWhatsApp } from './util.js';

const form = $('#form-pago');
const resumen = $('#resumen-lista');
const errorGeneral = $('#error-general');
const boton = $('#pagar');

// ---------- opciones de entrega (vienen de la configuración; la tarifa real la pone el servidor)
$('#envios').innerHTML = TIENDA.envios.map((e, i) => `
  <label class="opcion">
    <input type="radio" name="envio" value="${esc(e.id)}" ${i === 0 ? 'checked' : ''} required>
    <div><b>${esc(e.nombre)}</b><span>${esc(e.detalle)}</span></div>
    <span class="costo">${e.tarifa === null ? 'Se cotiza' : e.tarifa === 0 ? 'Gratis' : esc(pesos(e.tarifa))}</span>
  </label>`).join('');

const envioActual = () => TIENDA.envios.find((e) => e.id === form.envio.value) ?? TIENDA.envios[0];
function pintarDireccion() {
  const pide = envioActual().pide_direccion;
  $('#direccion-campos').hidden = !pide;
  $$('#direccion-campos [data-requerido]').forEach((i) => { i.required = pide; });
  pintarResumen();
}
form.addEventListener('change', (e) => { if (e.target.name === 'envio') pintarDireccion(); });

// ---------- resumen
function pintarResumen() {
  const lineas = carrito.lineas();
  if (!lineas.length) {
    form.hidden = true; $('#pagar-vacio').hidden = false; return;
  }
  resumen.innerHTML = lineas.map(({ producto: p, cantidad }) => `
    <div class="linea"><img src="${esc(p.mini)}" alt="" width="56" height="66">
      <div><b>${esc(p.nombre)}</b><small>${cantidad} × ${esc(pesos(p.precio))}</small></div>
      <span class="valor">${esc(pesos(p.precio * cantidad))}</span></div>`).join('');
  const env = envioActual();
  const sub = carrito.subtotal();
  $('#t-subtotal').textContent = pesos(sub);
  $('#t-envio').textContent = env.tarifa === null ? 'Se cotiza aparte' : env.tarifa === 0 ? 'Gratis' : pesos(env.tarifa);
  $('#t-total').textContent = pesos(sub + (env.tarifa ?? 0));
  $('#nota-envio').hidden = env.tarifa !== null;
  $('#pagar-whatsapp').href = urlWhatsApp('Hola Stimura 👋 Quiero hacer este pedido:\n' + lineas.map(({ producto: p, cantidad }) => `• ${cantidad} × ${p.nombre}`).join('\n'));
}
carrito.alCambiar(pintarResumen);

// ---------- validación en el navegador (la de verdad la repite el servidor)
const reglas = {
  nombre: (v) => v.trim().length >= 3 || 'Escribe tu nombre completo.',
  correo: (v) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()) || 'Revisa tu correo.',
  celular: (v) => /^3\d{9}$/.test(v.replace(/[\s()-]/g, '').replace(/^\+?57/, '')) || 'Escribe un celular de 10 dígitos que empiece por 3.',
  direccion: (v) => v.trim().length >= 5 || 'Escribe la dirección de entrega.',
  ciudad: (v) => v.trim().length >= 2 || 'Escribe la ciudad.',
  departamento: (v) => v.trim().length >= 2 || 'Escribe el departamento.',
};
function revisar(campo) {
  const regla = reglas[campo.name];
  if (!regla || (campo.closest('[hidden]'))) return true;
  const r = regla(campo.value);
  const msg = r === true ? '' : r;
  campo.setAttribute('aria-invalid', String(!!msg));
  const err = $(`#err-${campo.name}`); if (err) err.textContent = msg;
  return !msg;
}
form.addEventListener('blur', (e) => { if (e.target.name in reglas) revisar(e.target); }, true);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorGeneral.hidden = true;
  const campos = $$('input, textarea', form).filter((c) => c.name in reglas);
  const malos = campos.filter((c) => !revisar(c));
  if (malos.length) { malos[0].focus(); return; }
  if (!form.terminos.checked || !form.datos.checked) {
    errorGeneral.textContent = 'Para continuar acepta los términos y autoriza el tratamiento de tus datos.';
    errorGeneral.hidden = false; return;
  }
  const v = (n) => (form[n]?.value ?? '').trim();
  const cuerpo = {
    items: carrito.paraServidor(), envio: form.envio.value,
    acepta_terminos: form.terminos.checked, autoriza_datos: form.datos.checked,
    cliente: { nombre: v('nombre'), correo: v('correo'), celular: v('celular'), direccion: v('direccion'), barrio: v('barrio'), ciudad: v('ciudad'), departamento: v('departamento'), notas: v('notas') },
  };
  if (!TIENDA.api) {
    errorGeneral.textContent = 'Versión de revisión: el pago con Wompi se activa cuando la tienda salga en stimura.co.';
    errorGeneral.hidden = false; return;
  }
  boton.disabled = true; boton.querySelector('span').textContent = 'Preparando tu pago…';
  try {
    const r = await fetch(`${TIENDA.api}/crear-pedido`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(cuerpo), credentials: 'omit',
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.checkout) throw new Error(j.error || 'No pudimos preparar el pago. Intenta de nuevo.');
    const destino = new URL(j.checkout);
    // solo se sale hacia el checkout de Wompi (o el simulador local en desarrollo)
    if (!TIENDA.checkoutPermitidos.includes(destino.origin)) throw new Error('Destino de pago no válido.');
    sessionStorage.setItem('stimura-ultimo-pedido', j.referencia);
    location.assign(destino.href);
  } catch (err) {
    errorGeneral.textContent = err.message;
    errorGeneral.hidden = false;
    boton.disabled = false; boton.querySelector('span').textContent = 'Pagar con Wompi';
  }
});

pintarDireccion();
