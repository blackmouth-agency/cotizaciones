// Cajas de la colección Olfactive Mind en 3D. Se carga solo cuando la colección se acerca a la pantalla.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';

export function iniciar(cont, CFG, estado, reduce) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-label', 'Caja de la vela en 3D: arrastra para girarla');
  canvas.setAttribute('role', 'img');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (e) { return null; }
  cont.prepend(canvas);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const escena = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(28, 1, 0.1, 60);
  cam.position.set(0, 3.1, 10.6);
  cam.lookAt(0, -0.2, 0);

  escena.add(new THREE.HemisphereLight(0xffffff, 0xf3d6c6, 2.2));
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(2.5, 4, 5);
  escena.add(key);

  const carga = new THREE.TextureLoader();
  const cache = {};
  const tex = url => {
    if (!cache[url]) {
      cache[url] = carga.load(url, () => pedir());
      cache[url].colorSpace = THREE.SRGBColorSpace;
      cache[url].anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    }
    return cache[url];
  };

  // sombra suave en el piso
  const sc = document.createElement('canvas'); sc.width = sc.height = 128;
  const g = sc.getContext('2d'); const gr = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  gr.addColorStop(0, 'rgba(60,10,20,.36)'); gr.addColorStop(1, 'rgba(60,10,20,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const sombra = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
  sombra.rotation.x = -Math.PI / 2;
  sombra.position.y = -1.3;
  escena.add(sombra);

  // caras de 560 × 640; v.caras = [frente, derecha, atrás, izquierda] (null = sin foto)
  const W = 2.15, AL = 2.46;
  function crearCaja(v) {
    const liso = new THREE.MeshLambertMaterial({ color: new THREE.Color(v.tapa) });
    const cara = i => v.caras[i] == null ? liso : new THREE.MeshLambertMaterial({ map: tex(`img/caja-${v.id}-${v.caras[i]}.webp`) });
    // en la cara +y de BoxGeometry el borde de abajo de la foto queda del lado del frente:
    // la tapa se lee derecha mirando la caja de frente (comprobado con la de Sandía)
    const tapa = v.tapaImg ? new THREE.MeshLambertMaterial({ map: tex(v.tapaImg) }) : liso;
    // orden de BoxGeometry: +x derecha, -x izquierda, +y tapa, -y fondo, +z frente, -z atrás
    const caja = new THREE.Mesh(new THREE.BoxGeometry(W, AL, W), [cara(1), cara(3), tapa, liso, cara(0), cara(2)]);
    caja.position.y = AL / 2 - 1.3;
    const grupo = new THREE.Group();
    grupo.add(caja);
    return grupo;
  }

  let objeto = null, clave = '', entrando = 1, lim = null;
  function mostrar(v) {
    if (v.id === clave) return;
    clave = v.id;
    if (objeto) { escena.remove(objeto); objeto.traverse(o => o.geometry && o.geometry.dispose()); }
    objeto = crearCaja(v);
    lim = v.giro || null; // [mín, máx] en radianes cuando la caja no tiene foto de todas las caras
    if (lim) { rotY = Math.max(lim[0], Math.min(lim[1], rotY)); sentido = -1; }
    objeto.rotation.y = rotY;
    escena.add(objeto);
    entrando = 0;
    pedir();
  }

  // ---------- GIRO CON EL DEDO ----------
  let rotY = -0.55, vel = 0, tilt = 0, arrastrando = false, ultimoX = 0, ultimoY = 0, quieto = 0, sentido = -1;
  canvas.addEventListener('pointerdown', e => { arrastrando = true; ultimoX = e.clientX; ultimoY = e.clientY; vel = 0; canvas.setPointerCapture(e.pointerId); pedir(); });
  canvas.addEventListener('pointermove', e => {
    if (!arrastrando) return;
    const dx = e.clientX - ultimoX, dy = e.clientY - ultimoY;
    ultimoX = e.clientX; ultimoY = e.clientY;
    vel = dx * 0.012; rotY += vel;
    if (lim) rotY = Math.max(lim[0] - .15, Math.min(lim[1] + .15, rotY));
    tilt = Math.max(-.2, Math.min(.3, tilt + dy * 0.004));
    quieto = 0; pedir();
  });
  const soltar = () => { arrastrando = false; };
  canvas.addEventListener('pointerup', soltar);
  canvas.addEventListener('pointercancel', soltar);

  function medir() {
    const w = cont.clientWidth, hh = cont.clientHeight;
    renderer.setSize(w, hh, false);
    cam.aspect = w / hh;
    cam.fov = w / hh < .8 ? 30 : 26;
    cam.updateProjectionMatrix();
    pedir();
  }
  new ResizeObserver(medir).observe(cont);

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) pedir(); }).observe(cont);

  let pendiente = false, tPrev = performance.now();
  function pedir() { if (!pendiente) { pendiente = true; requestAnimationFrame(cuadro); } }
  function cuadro(t) {
    pendiente = false;
    const dt = Math.min(.05, (t - tPrev) / 1000); tPrev = t;
    let sigue = false;
    if (!arrastrando) {
      if (Math.abs(vel) > .0005) { rotY += vel; vel *= .94; sigue = true; }
      else if (!reduce) {
        quieto += dt;
        if (quieto > 1.5) {
          if (lim) { // va y viene entre las caras que tienen foto
            rotY += dt * .4 * sentido;
            if (rotY < lim[0]) sentido = 1; if (rotY > lim[1]) sentido = -1;
          } else rotY += dt * .45;
        }
        sigue = true;
      }
      if (lim) { // resorte de vuelta si se pasó del límite
        if (rotY < lim[0]) { rotY += (lim[0] - rotY) * .15; vel = 0; }
        if (rotY > lim[1]) { rotY += (lim[1] - rotY) * .15; vel = 0; }
      }
      tilt *= .92;
    }
    if (entrando < 1) { entrando = Math.min(1, entrando + dt * 3.2); sigue = true; }
    if (objeto) {
      const e = 1 - Math.pow(1 - entrando, 3);
      objeto.scale.setScalar(.82 + .18 * e);
      objeto.rotation.y = rotY - (1 - e) * .6;
      objeto.rotation.x = tilt;
    }
    renderer.render(escena, cam);
    if (sigue && visible) pedir();
  }

  medir();
  mostrar(estado().v);
  // precargar las demás caras cuando el navegador esté libre
  (window.requestIdleCallback || setTimeout)(() => CFG.velas.forEach(v => v.caras.forEach(c => c != null && tex(`img/caja-${v.id}-${c}.webp`))));
  return { mostrar };
}
