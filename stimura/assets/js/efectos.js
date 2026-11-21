// Interactividad de todo el sitio: parallax con el scroll, inclinación 3D con el puntero y
// bodegones que siguen el mouse. Nada de esto corre si la persona prefiere menos movimiento.
import { $$, reduceMovimiento } from './util.js';

const finos = matchMedia('(pointer: fine)').matches;

// ---------- parallax con el scroll: data-parallax="0.15" (positivo baja más lento, negativo sube)
const capas = $$('[data-parallax]');
if (capas.length && !reduceMovimiento) {
  const visibles = new Set();
  const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? visibles.add(e.target) : visibles.delete(e.target))), { rootMargin: '200px 0px' });
  capas.forEach((c) => io.observe(c));
  let pendiente = false;
  const mover = () => {
    pendiente = false;
    const mitad = innerHeight / 2;
    visibles.forEach((c) => {
      const r = c.getBoundingClientRect();
      const d = r.top + r.height / 2 - mitad;
      c.style.translate = `0 ${(-d * Number(c.dataset.parallax)).toFixed(1)}px`;
    });
  };
  addEventListener('scroll', () => { if (!pendiente) { pendiente = true; requestAnimationFrame(mover); } }, { passive: true });
  mover();
}

// ---------- inclinación 3D con el puntero: data-inclinar (grados máximos, por defecto 8)
if (finos && !reduceMovimiento) {
  $$('[data-inclinar]').forEach((el) => {
    const max = Number(el.dataset.inclinar) || 8;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${(x * max).toFixed(2)}deg) rotateX(${(-y * max).toFixed(2)}deg)`;
      el.style.setProperty('--luz-x', `${(x + 0.5) * 100}%`);
      el.style.setProperty('--luz-y', `${(y + 0.5) * 100}%`);
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

// ---------- bodegones que siguen el mouse: [data-bodegon] con hijos data-p (px de recorrido)
// solo con mouse: en celular no hay puntero que seguir y el ciclo solo gastaba batería
if (finos && !reduceMovimiento) {
  $$('[data-bodegon]').forEach((esc) => {
    const piezas = $$('[data-p]', esc);
    let tx = 0, ty = 0, x = 0, y = 0, vivo = false;
    addEventListener('pointermove', (e) => {
      const r = esc.getBoundingClientRect();
      tx = Math.max(-0.7, Math.min(0.7, (e.clientX - r.left) / r.width - 0.5));
      ty = Math.max(-0.7, Math.min(0.7, (e.clientY - r.top) / r.height - 0.5));
    }, { passive: true });
    const bucle = () => {
      x += (tx - x) * 0.07; y += (ty - y) * 0.07;
      piezas.forEach((p) => { const k = Number(p.dataset.p); p.style.translate = `${(x * k).toFixed(1)}px ${(y * k).toFixed(1)}px`; });
      if (vivo) requestAnimationFrame(bucle);
    };
    new IntersectionObserver(([e]) => { vivo = e.isIntersecting; if (vivo) requestAnimationFrame(bucle); }).observe(esc);
  });
}
