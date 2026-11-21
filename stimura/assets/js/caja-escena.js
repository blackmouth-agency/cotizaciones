// Conecta un .escenario con el módulo 3D de las cajas.
// Con mouse se descarga solo cuando el escenario se acerca; en celular, solo cuando la persona toca la caja
// (three.js pesa ~650 KB y mientras tanto se ve la foto plana de la caja).
import { $ } from './util.js';

const fino = matchMedia('(pointer: fine)').matches;

export function escenaCaja(escenario, velas, actual, reduce) {
  let api = null;
  const pista = $('.pista', escenario);
  const cargar = () => import('./caja3d.js')
    .then((m) => m.iniciar(escenario, { velas }, () => ({ v: actual() }), reduce))
    .then((a) => { if (a) { api = a; escenario.classList.add('con3d'); } })
    .catch(() => { /* sin WebGL: se queda la foto de la caja */ });
  if (fino) {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      cargar();
    }, { rootMargin: '500px 0px' });
    io.observe(escenario);
    escenario.addEventListener('pointerdown', () => pista?.classList.add('oculta'), { once: true });
  } else {
    escenario.classList.add('toca3d');
    if (pista && pista.lastChild) pista.lastChild.textContent = 'Toca para girarla en 3D';
    escenario.addEventListener('click', () => {
      escenario.classList.replace('toca3d', 'cargando');
      if (pista && pista.lastChild) pista.lastChild.textContent = 'Cargando…';
      cargar().then(() => {
        escenario.classList.remove('cargando');
        if (pista && pista.lastChild) pista.lastChild.textContent = 'Arrástrala para girarla';
        setTimeout(() => pista?.classList.add('oculta'), 2500);
      });
    }, { once: true });
  }
  return { mostrar: (v) => api?.mostrar(v) };
}
