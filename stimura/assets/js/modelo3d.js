// Visor de los modelos 3D de Karol (patito, mango, pocillo, gomitas).
// Se descarga solo cuando el panel se acerca a la pantalla; se gira con el dedo o el mouse.
import * as THREE from './three.module.min.js';
import { GLTFLoader } from './gltf-loader.js';
import { MeshoptDecoder } from './meshopt-decoder.js';
import { RoomEnvironment } from './room-environment.js';

export function iniciar(cont, reduce) {
  const url = cont.dataset.modelo;
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const escena = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  escena.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
  const luz = new THREE.DirectionalLight(0xffffff, 1.4);
  luz.position.set(2, 3, 2.5);
  escena.add(luz);
  const camara = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camara.position.set(0, 0.25, 4.2);
  camara.lookAt(0, 0, 0);
  const pivote = new THREE.Group();
  escena.add(pivote);

  const cargador = new GLTFLoader();
  cargador.setMeshoptDecoder(MeshoptDecoder);

  let rotY = Number(cont.dataset.giro || 0.5), rotX = 0.08, velY = 0, arrastrando = false, px = 0, py = 0, t0 = performance.now();
  let visible = true, vivo = true;

  function medir() {
    const r = cont.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camara.aspect = r.width / Math.max(r.height, 1);
    camara.updateProjectionMatrix();
  }

  return new Promise((ok, mal) => {
    cargador.load(url, (gltf) => {
      const m = gltf.scene;
      const caja = new THREE.Box3().setFromObject(m);
      const tam = caja.getSize(new THREE.Vector3());
      const centro = caja.getCenter(new THREE.Vector3());
      const escala = 1.9 / Math.max(tam.x, tam.y, tam.z);
      m.position.sub(centro);
      const envoltura = new THREE.Group();
      envoltura.add(m);
      envoltura.scale.setScalar(escala * Number(cont.dataset.escala || 1));
      pivote.add(envoltura);
      cont.appendChild(canvas);
      medir();
      new ResizeObserver(medir).observe(cont);
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(cont);

      cont.addEventListener('pointerdown', (e) => { arrastrando = true; px = e.clientX; py = e.clientY; velY = 0; cont.setPointerCapture(e.pointerId); cont.classList.add('tocado'); });
      cont.addEventListener('pointermove', (e) => {
        if (!arrastrando) return;
        const dx = e.clientX - px, dy = e.clientY - py;
        px = e.clientX; py = e.clientY;
        velY = dx * 0.012;
        rotY += velY;
        rotX = Math.max(-0.5, Math.min(0.6, rotX + dy * 0.006));
      });
      const soltar = () => { arrastrando = false; };
      cont.addEventListener('pointerup', soltar);
      cont.addEventListener('pointercancel', soltar);

      // Fluidez: girando solo dibuja a 30 cuadros/s (al arrastrarlo, 60); fuera de pantalla no dibuja nada;
      // si el equipo no da abasto, baja la resolución del lienzo una sola vez (calidad casi igual, mucho menos trabajo).
      let tPrev = performance.now(), tDibujo = 0, enCola = false;
      const lentos = [];
      let pr = Math.min(devicePixelRatio, 2);
      const pedir = () => { if (!enCola && vivo && visible) { enCola = true; requestAnimationFrame(cuadro); } };
      function cuadro(t) {
        enCola = false;
        if (!vivo || !visible) return;
        pedir();
        const ocioso = !arrastrando && Math.abs(velY) < 0.001;
        if (ocioso && t - tDibujo < 31) return;
        const dt = Math.min(0.05, (t - tPrev) / 1000); tPrev = t;
        if (tDibujo && dt > 0) {
          lentos.push(t - tDibujo);
          if (lentos.length > 40) lentos.shift();
          if (lentos.length === 40 && pr > 1 && lentos.slice().sort((a, b) => a - b)[20] > 48) {
            pr = 1; renderer.setPixelRatio(pr); medir(); lentos.length = 0;
          }
        }
        tDibujo = t;
        const s = (t - t0) / 1000;
        if (!arrastrando) {
          velY *= Math.pow(0.94, dt * 60);
          rotY += velY + (reduce ? 0 : 0.21 * dt);
        }
        pivote.rotation.y = rotY;
        pivote.rotation.x = rotX;
        pivote.position.y = reduce ? 0 : Math.sin(s * 1.3) * 0.05;
        renderer.render(escena, camara);
      }
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { tPrev = performance.now(); pedir(); } }).observe(cont);
      cont.addEventListener('pointerdown', pedir);
      pedir();
      cont.classList.add('listo');
      ok({ parar: () => { vivo = false; } });
    }, undefined, mal);
  });
}

// Conecta cada [data-modelo] de la página: descarga el visor solo al acercarse.
export function conectarModelos(reduce) {
  document.querySelectorAll('[data-modelo]').forEach((cont) => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      iniciar(cont, reduce).catch(() => cont.classList.add('sin3d'));
    }, { rootMargin: '400px 0px' });
    io.observe(cont);
  });
}
