// Stimura v4 (maqueta de Karol): portadas por capas, «¡Lo compro ya!», modelos 3D, carriles y la cabeza abierta.
import { carrito } from './carrito.js';
import { $, $$, reduceMovimiento } from './util.js';

const fino = matchMedia('(pointer: fine)').matches;

// ---------- fluidez: las animaciones continuas de una sección se pausan mientras no está en pantalla
{
  const SECCIONES = '.portada-k,.portada-hc,.lanz-k,.mente-sec,.lista-mente,.historia-om,.panel3d,.foto-sellos,.wax-escena,.beneficios-wax,'
    + '.kit-wax,.racimo-banner,.afro-venus,.afro-esp,.afro-ritual,.nos-aromas,.nos-sientas,.nos-vamos,.experiencia,.coleccion,.cab-cat,.aroma-intenso';
  const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('pausa', !e.isIntersecting)), { rootMargin: '120px 0px' });
  $$(SECCIONES).forEach((s) => io.observe(s));
}

// ---------- portadas por capas: las capas siguen el puntero (cada una a su profundidad)
$$('[data-lienzo]').forEach((l) => {
  if (reduceMovimiento || !fino) return;
  let raf = 0, mx = 0, my = 0;
  l.addEventListener('pointermove', (e) => {
    const r = l.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; l.style.setProperty('--mx', mx.toFixed(3)); l.style.setProperty('--my', my.toFixed(3)); });
  });
  l.addEventListener('pointerleave', () => { l.style.setProperty('--mx', '0'); l.style.setProperty('--my', '0'); });
});

// ---------- «¡Lo compro ya!»: agrega y va directo a pagar
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-comprar]');
  if (!b) return;
  const n = b.id === 'comprar-ya' ? Number($('#agregar')?.dataset.cantidad || 1) : 1;
  carrito.agregar(b.dataset.comprar, n);
  location.href = '/stimura/pagar/';
});

// ---------- modelos 3D de Karol: el visor solo se descarga si la página tiene alguno
if ($('[data-modelo]')) {
  if (fino) {
    import('./modelo3d.js').then((m) => m.conectarModelos(reduceMovimiento)).catch(() => {});
  } else {
    // en celular el modelo (~3 MB más three.js) solo se descarga si la persona lo pide
    $$('[data-modelo]').forEach((el) => {
      el.classList.add('toca3d');
      const pista = $('.pista3d', el);
      const decir = (t) => { if (pista && pista.lastChild) pista.lastChild.textContent = t; };
      decir('Toca para verlo en 3D');
      el.addEventListener('click', () => {
        el.classList.add('cargando');
        decir('Cargando…');
        import('./modelo3d.js').then((m) => m.iniciar(el, reduceMovimiento))
          .then(() => { el.classList.replace('toca3d', 'activo3d'); el.classList.toggle('cargando', false); decir('Arrástralo'); })
          .catch(() => { el.classList.add('sin3d'); decir('No se pudo cargar'); });
      }, { once: true });
    });
  }
}

// ---------- pistas pensadas para mouse, dichas para el dedo
if (!fino) {
  $$('.pista-juego').forEach((p) => { if (p.lastChild && /Pasa por/.test(p.lastChild.textContent)) p.lastChild.textContent = 'Toca cada vela'; });
}

// ---------- carriles horizontales («Otras sensaciones») con flechas
$$('[data-desliza]').forEach((f) => {
  const carril = $('.carril', f);
  const flecha = (dir) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = `flecha-k ${dir}`;
    b.setAttribute('aria-label', dir === 'ant' ? 'Anteriores' : 'Siguientes');
    b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${dir === 'ant' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}"/></svg>`;
    b.addEventListener('click', () => carril.scrollBy({ left: (dir === 'ant' ? -1 : 1) * carril.clientWidth * 0.8, behavior: reduceMovimiento ? 'auto' : 'smooth' }));
    return b;
  };
  f.append(flecha('ant'), flecha('sig'));
});

// ---------- efectos atados al scroll: la cabeza suelta los productos, los tazones giran
const atados = [...$$('[data-cabeza]'), ...$$('.aroma-duracion')];
if (atados.length && !reduceMovimiento) {
  let raf = 0;
  const pintar = () => {
    raf = 0;
    const h = innerHeight;
    atados.forEach((el) => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (h - r.top) / (h + r.height * 0.4)));
      el.style.setProperty('--p', p.toFixed(3));
    });
  };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(pintar); }, { passive: true });
  pintar();
} else {
  atados.forEach((el) => el.style.setProperty('--p', '0.8'));
}
