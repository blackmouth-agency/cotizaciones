// Conecta un .escenario con el módulo 3D, que solo se descarga cuando el escenario se acerca.
import { $ } from './util.js';

export function escenaCaja(escenario, velas, actual, reduce) {
  let api = null;
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    import('./caja3d.js')
      .then((m) => m.iniciar(escenario, { velas }, () => ({ v: actual() }), reduce))
      .then((a) => { if (a) { api = a; escenario.classList.add('con3d'); } })
      .catch(() => { /* sin WebGL: se queda la foto de la caja */ });
  }, { rootMargin: '500px 0px' });
  io.observe(escenario);
  escenario.addEventListener('pointerdown', () => $('.pista', escenario)?.classList.add('oculta'), { once: true });
  return { mostrar: (v) => api?.mostrar(v) };
}
