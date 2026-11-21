// Carrusel accesible: flechas, puntos, deslizar con el dedo, teclado y avance automático que se
// pausa al pasar el mouse, al tocar o si la persona prefiere menos movimiento.
import { $, $$, reduceMovimiento } from './util.js';

const FLECHA = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d === 'ant' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}"/></svg>`;

export function carrusel(raiz, { auto = 0 } = {}) {
  const pista = $('.pista-c', raiz);
  const diapos = $$('.diapo', pista);
  if (diapos.length < 2) return;
  raiz.setAttribute('role', 'region');
  raiz.setAttribute('aria-roledescription', 'carrusel');
  diapos.forEach((d, i) => { d.setAttribute('role', 'group'); d.setAttribute('aria-roledescription', 'diapositiva'); d.setAttribute('aria-label', `${i + 1} de ${diapos.length}`); });

  const puntos = document.createElement('div');
  puntos.className = 'puntos';
  puntos.innerHTML = diapos.map((_, i) => `<button type="button" aria-label="Ir a la diapositiva ${i + 1}"></button>`).join('');
  const ant = document.createElement('button'); ant.type = 'button'; ant.className = 'flecha ant'; ant.setAttribute('aria-label', 'Anterior'); ant.innerHTML = FLECHA('ant');
  const sig = document.createElement('button'); sig.type = 'button'; sig.className = 'flecha sig'; sig.setAttribute('aria-label', 'Siguiente'); sig.innerHTML = FLECHA('sig');
  raiz.append(puntos, ant, sig);

  let idx = 0;
  // si algo enfoca un elemento de otra diapositiva, el navegador no debe desplazar el contenedor
  raiz.addEventListener('scroll', () => { raiz.scrollLeft = 0; });
  function pintar(arrastre = 0) {
    pista.style.transform = `translateX(calc(${-idx * 100}% + ${arrastre}px))`;
    [...puntos.children].forEach((b, k) => b.setAttribute('aria-current', String(k === idx)));
    diapos.forEach((d, k) => { d.inert = k !== idx; });
  }
  const ir = (i) => { idx = (i + diapos.length) % diapos.length; pista.classList.remove('arrastrando'); pintar(); };

  ant.addEventListener('click', () => { ir(idx - 1); pausar(); });
  sig.addEventListener('click', () => { ir(idx + 1); pausar(); });
  puntos.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { ir([...puntos.children].indexOf(b)); pausar(); } });
  raiz.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { ir(idx + 1); pausar(); }
    if (e.key === 'ArrowLeft') { ir(idx - 1); pausar(); }
  });

  // deslizar con el dedo (el gesto vertical sigue haciendo scroll de la página)
  let x0 = null, y0 = 0, dx = 0, horizontal = null;
  pista.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') return; x0 = e.clientX; y0 = e.clientY; dx = 0; horizontal = null; pausar(); }, { passive: true });
  pista.addEventListener('pointermove', (e) => {
    if (x0 === null) return;
    dx = e.clientX - x0;
    if (horizontal === null && Math.abs(dx) + Math.abs(e.clientY - y0) > 8) horizontal = Math.abs(dx) > Math.abs(e.clientY - y0);
    if (horizontal) { pista.classList.add('arrastrando'); pintar(dx); }
  }, { passive: true });
  const soltar = () => {
    if (x0 === null) return;
    if (horizontal && Math.abs(dx) > 50) ir(idx + (dx < 0 ? 1 : -1)); else ir(idx);
    x0 = null;
  };
  pista.addEventListener('pointerup', soltar);
  pista.addEventListener('pointercancel', soltar);

  // avance automático
  let reloj = null, detenido = false;
  const arrancar = () => { if (!auto || reduceMovimiento || detenido) return; clearInterval(reloj); reloj = setInterval(() => { if (!document.hidden) ir(idx + 1); }, auto); };
  const pausar = () => { detenido = true; clearInterval(reloj); };
  raiz.addEventListener('mouseenter', () => clearInterval(reloj));
  raiz.addEventListener('mouseleave', arrancar);
  raiz.addEventListener('focusin', () => clearInterval(reloj));
  new IntersectionObserver(([e]) => (e.isIntersecting ? arrancar() : clearInterval(reloj))).observe(raiz);
  pintar();
}

$$('[data-carrusel]').forEach((r) => carrusel(r, { auto: Number(r.dataset.carrusel) || 0 }));
