// Interactividad propia de cada diapositiva del héroe.
// 1) bodegón que sigue el mouse (efectos.js) · 2) enciéndela · 3) aromas · 4) waxmelts que se apartan · 5) racimos que se columpian
import { $, $$, reduceMovimiento } from './util.js';

const activa = (el) => !el.closest('.diapo')?.inert;

// ---------- 2. enciéndela: la vela se prende al tocarla (o sola a los pocos segundos) y la llama se
// inclina hacia donde está el puntero
$$('[data-enciende]').forEach((d) => {
  const vela = $('.enciende-vela', d);
  const estado = $('.enciende-estado', d);
  let tocada = false, reloj = null;
  const poner = (on) => {
    d.classList.toggle('encendida', on);
    vela.setAttribute('aria-pressed', String(on));
    vela.setAttribute('aria-label', on ? 'Apagar la vela' : 'Encender la vela');
    estado.textContent = on ? 'Así se siente un espacio con Stimura.' : 'Toca la vela para encenderla.';
  };
  vela.addEventListener('click', () => { tocada = true; clearTimeout(reloj); poner(!d.classList.contains('encendida')); });
  d.addEventListener('pointermove', (e) => {
    const r = vela.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width * 1.5);
    d.style.setProperty('--inclina', `${Math.max(-1, Math.min(1, dx)) * -28}deg`);
  });
  d.addEventListener('pointerleave', () => d.style.setProperty('--inclina', '0deg'));
  // cuando la diapositiva aparece, si nadie la toca, se enciende sola
  new MutationObserver(() => {
    clearTimeout(reloj);
    if (d.inert) { if (!tocada) poner(false); return; }
    if (!tocada) reloj = setTimeout(() => poner(true), 2200);
  }).observe(d, { attributes: true, attributeFilter: ['inert'] });
});

// ---------- 3. cuatro aromas: pasar o tocar una vela cambia color, objeto y recuerdo
$$('[data-aromas]').forEach((d) => {
  const botones = $$('.aroma-vela', d);
  const objetos = $$('.aroma-objeto', d);
  const recuerdo = $('.aroma-recuerdo b', d);
  const ver = $('.aroma-ver', d);
  const elegir = (b) => {
    const i = Number(b.dataset.i);
    botones.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    objetos.forEach((o) => o.classList.toggle('activo', Number(o.dataset.i) === i));
    d.style.setProperty('--fondo-aroma', b.dataset.fondo);
    d.style.setProperty('--tinta-aroma', b.dataset.tinta);
    recuerdo.textContent = b.dataset.recuerdo;
    ver.textContent = `Ver ${b.dataset.nombre}`;
    ver.href = b.dataset.href;
  };
  botones.forEach((b) => {
    b.addEventListener('pointerenter', () => elegir(b));
    b.addEventListener('focus', () => elegir(b));
    b.addEventListener('click', () => elegir(b));
  });
  elegir(botones[0]);
});

// ---------- 4. waxmelts que se apartan con suavidad
// Cada pieza tiene una posición de reposo medida una sola vez. Si el puntero se acerca, su destino es
// un desplazamiento acotado en dirección contraria; la pieza se desliza hacia él (interpolación, sin
// rebote) y vuelve igual de suave cuando el puntero se va.
$$('[data-repeler]').forEach((zona) => {
  if (reduceMovimiento) return;
  const diapo = zona.closest('.diapo');
  const piezas = $$('img', zona).map((el) => ({ el, ox: 0, oy: 0, radio: 0, x: 0, y: 0 }));
  let px = null, py = null, vivo = false;
  // posición de reposo relativa a la zona (offset de maquetación: no la afectan ni la animación del
  // carrusel ni el giro de la pieza)
  const medir = () => piezas.forEach((p) => {
    p.ox = p.el.offsetLeft + p.el.offsetWidth / 2; p.oy = p.el.offsetTop + p.el.offsetHeight / 2;
    p.radio = Math.max(p.el.offsetWidth, p.el.offsetHeight) * 0.75 + 70;
  });
  diapo.addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; });
  diapo.addEventListener('pointerleave', () => { px = py = null; });
  addEventListener('resize', medir);
  const paso = () => {
    const z = zona.getBoundingClientRect();
    piezas.forEach((p) => {
      let tx = 0, ty = 0;
      if (px !== null) {
        const dx = z.left + p.ox - px, dy = z.top + p.oy - py, d = Math.hypot(dx, dy) || 1;
        if (d < p.radio) {
          const fuerza = (1 - d / p.radio) ** 2;      // suave en el borde, más fuerte cerca
          const empuje = 70 * fuerza;                   // máximo 70 px
          tx = (dx / d) * empuje; ty = (dy / d) * empuje;
        }
      }
      p.x += (tx - p.x) * 0.09; p.y += (ty - p.y) * 0.09;
      p.el.style.translate = `${p.x.toFixed(2)}px ${p.y.toFixed(2)}px`;
      p.el.style.rotate = `${(p.x * 0.08).toFixed(2)}deg`;
    });
    if (vivo) requestAnimationFrame(paso);
  };
  const encender = () => { const antes = vivo; vivo = !diapo.inert; if (vivo && !antes) { medir(); requestAnimationFrame(paso); } };
  new IntersectionObserver(([e]) => { if (e.isIntersecting) encender(); else vivo = false; }).observe(zona);
  new MutationObserver(encender).observe(diapo, { attributes: true, attributeFilter: ['inert'] });
});

// ---------- 5. racimos colgados que se columpian como péndulos
// El puntero no empuja en cada evento: se guarda su velocidad suavizada y en cada cuadro se aplica un
// empujón pequeño y acotado al racimo que está cerca. El ángulo nunca pasa de ~18°.
$$('[data-columpio]').forEach((zona) => {
  const diapo = zona.closest('.diapo');
  const racimos = $$('img', zona).map((el, i) => ({ el, a: 0, va: 0, fase: i * 1.7 }));
  let px = null, py = null, ux = null, vel = 0, vivo = false, t = 0;
  diapo.addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; });
  diapo.addEventListener('pointerleave', () => { px = py = ux = null; });
  const MAX = 0.32;
  const paso = () => {
    t += 1 / 60;
    if (px !== null) { if (ux !== null) vel += ((px - ux) - vel) * 0.25; ux = px; } else vel *= 0.85;
    racimos.forEach((r) => {
      let empuje = 0;
      if (px !== null) {
        const b = r.el.getBoundingClientRect();
        const centro = b.left + b.width / 2;
        const cerca = Math.abs(px - centro) < b.width * 0.9 && py > b.top - 30 && py < b.bottom + 30;
        if (cerca) empuje = Math.max(-1, Math.min(1, vel / 22)) * 0.0045;
      }
      const brisa = reduceMovimiento ? 0 : Math.sin(t * 1.1 + r.fase) * 0.00025;
      r.va += -r.a * 0.012 + empuje + brisa;   // resorte de péndulo
      r.va *= 0.965;                            // amortiguación
      r.a += r.va;
      if (r.a > MAX) { r.a = MAX; r.va *= -0.3; }
      if (r.a < -MAX) { r.a = -MAX; r.va *= -0.3; }
      r.el.style.rotate = `${r.a.toFixed(4)}rad`;
    });
    if (vivo) requestAnimationFrame(paso);
  };
  if (reduceMovimiento) return;
  const encender = () => { const antes = vivo; vivo = !diapo.inert; if (vivo && !antes) requestAnimationFrame(paso); };
  new IntersectionObserver(([e]) => { if (e.isIntersecting) encender(); else vivo = false; }).observe(zona);
  new MutationObserver(encender).observe(diapo, { attributes: true, attributeFilter: ['inert'] });
});
