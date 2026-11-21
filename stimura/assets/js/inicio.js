import './ui.js';
import './heroe.js';
import { PRODUCTOS } from './datos.js';
import { $, $$, esc, pesos, reduceMovimiento } from './util.js';
import { escenaCaja } from './caja-escena.js';

// ---------- colección Olfactive Mind
const velas = PRODUCTOS.filter((p) => p.caja3d);
const cajas = velas.map((p) => ({ ...p.caja3d, id: p.caja3d.img }));
let actual = 0;
const escenario = $('#escenario');
if (escenario && velas.length) {
  const escena = escenaCaja(escenario, cajas, () => cajas[actual], reduceMovimiento);
  const barras = $('#barras');
  barras.innerHTML = velas.map((p, i) => `
    <button type="button" class="barra ${p.barra === '#FFFFFF' ? 'blanca' : ''} c-${esc(p.id)}" aria-pressed="${i === 0}" data-i="${i}">
      <img src="${esc(p.vela)}" alt="" width="120" height="150" loading="lazy">${esc(p.nombre)}</button>`).join('');
  const ficha = $('#ficha');
  function pintar() {
    const p = velas[actual];
    escenario.className = `escenario ${escenario.classList.contains('con3d') ? 'con3d' : ''} f-${p.id}`;
    $('.plano', escenario).src = `/stimura/assets/img/caja-${p.caja3d.img}-0.webp`;
    ficha.className = `ficha anim-in f-${p.id}`;
    ficha.innerHTML = `
      <p class="memoria">${esc(p.subtitulo)}</p>
      <h3>${esc(p.nombre)}</h3>
      <p class="frase">«${esc(p.frase)}»</p>
      <p class="historia">${esc(p.historia)}</p>
      <div class="chips"><span class="chip">Aroma: ${esc(p.aroma)}</span><span class="chip">${esc(p.perfil)}</span></div>
      <div class="comprar">
        <span class="precio">${esc(pesos(p.precio))}</span>
        <button type="button" class="boton" data-agregar="${esc(p.id)}"><span>Agregar al carrito</span></button>
        <a class="alterna" href="/stimura/tienda/${esc(p.slug)}/">Ver detalles →</a>
      </div>`;
    void ficha.offsetWidth;
    escena.mostrar(cajas[actual]);
  }
  barras.addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]'); if (!b) return;
    actual = Number(b.dataset.i);
    $$('.barra', barras).forEach((x, i) => x.setAttribute('aria-pressed', String(i === actual)));
    pintar();
  });
  pintar();
}
