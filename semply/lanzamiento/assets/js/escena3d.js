/* Semply · escena 3D del inicio.
   Piezas en L (el corchete del logo y el patrón del manual) flotan sueltas, esquivan el cursor
   y, a medida que se baja, encajan en el patrón de la marca. El avance lo pone landing.js en window.SEMPLY_ESCENA.p */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const lienzo = document.querySelector('.js-lienzo');
const seccion = document.querySelector('.js-escena');
const estado = window.SEMPLY_ESCENA || (window.SEMPLY_ESCENA = { p: 0 });
const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
const movil = matchMedia('(max-width: 720px)').matches;

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas: lienzo, antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch (e) { estado.listo = true; window.dispatchEvent(new Event('escena-lista')); throw e; }
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, movil ? 1.5 : 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = 1.0;

const escena = new THREE.Scene();
escena.fog = new THREE.Fog(0x242122, 30, 70);
const pmrem = new THREE.PMREMGenerator(renderer);
escena.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

const camara = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
camara.position.set(0, 0, 26);
const luzClave = new THREE.DirectionalLight(0xfff0d0, 1.8); luzClave.position.set(8, 10, 12); escena.add(luzClave);
const luzRoja = new THREE.DirectionalLight(0xff3355, 1.4); luzRoja.position.set(-10, -6, -4); escena.add(luzRoja);
escena.add(new THREE.AmbientLight(0xffffff, 0.22));

/* pieza en L con bordes redondeados (como el corchete del logo) */
function geometriaL() {
  const s = new THREE.Shape(), a = 3, w = 1;
  s.moveTo(0, 0); s.lineTo(a, 0); s.lineTo(a, w); s.lineTo(w, w); s.lineTo(w, a); s.lineTo(0, a); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.75, bevelEnabled: true, bevelThickness: 0.18, bevelSize: 0.16, bevelSegments: 5, curveSegments: 6 });
  g.translate(-1.5, -1.5, -0.375);
  return g;
}
const geo = geometriaL();
const mat = (hex, rough) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(hex), roughness: rough, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.2, envMapIntensity: 0.55 });
const MATS = [mat('#F10E3B', 0.32), mat('#FFC225', 0.34), mat('#4a4647', 0.4), mat('#f4efe8', 0.36)];

/* rejilla del patrón */
const COLS = movil ? 3 : 8, FILAS = movil ? 7 : 4, CELDA = 3.35;
const N = COLS * FILAS;
const grupo = new THREE.Group(); escena.add(grupo);
const piezas = [];
const rnd = (a, b) => a + Math.random() * (b - a);
for (let i = 0; i < N; i++) {
  const c = i % COLS, f = Math.floor(i / COLS);
  const m = new THREE.Mesh(geo, MATS[(c + f * 3) % 4]);
  const rejPos = new THREE.Vector3((c - (COLS - 1) / 2) * CELDA, ((FILAS - 1) / 2 - f) * CELDA, 0);
  const rejQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, ((c + f * 2) % 4) * Math.PI / 2));
  piezas.push({ m, rejPos, rejQ, base: new THREE.Vector3(), rot0: new THREE.Euler(rnd(0, 6.28), rnd(0, 6.28), rnd(0, 6.28)), giro: new THREE.Vector3(rnd(-.4, .4), rnd(-.4, .4), rnd(-.3, .3)), fase: rnd(0, 6.28), empuje: new THREE.Vector3(), extra: new THREE.Vector3() });
  grupo.add(m);
}

/* tamaño visible y posiciones sueltas */
let anchoV = 20, altoV = 12;
function repartir() {
  const izq = !movil;
  piezas.forEach((p, i) => {
    const lejos = Math.random() < 0.3;
    const x = izq && !lejos ? rnd(-0.05, 1.05) * anchoV / 2 : rnd(-1.1, 1.1) * anchoV / 2;
    const y = movil ? rnd(-1.05, 0.15) * altoV / 2 : rnd(-1.05, 0.82) * altoV / 2;
    p.base.set(x, y, lejos ? rnd(-14, -6) : rnd(-6, 1.2));
  });
}
function medir() {
  const w = lienzo.clientWidth || window.innerWidth, h = lienzo.clientHeight || window.innerHeight;
  renderer.setSize(w, h, false);
  camara.aspect = w / h;
  const t = Math.tan(THREE.MathUtils.degToRad(camara.fov / 2));
  const gw = COLS * CELDA, gh = FILAS * CELDA;
  camara.position.z = Math.max((gw / 2) / t / camara.aspect, (gh / 2) / t) * (movil ? 1.02 : 0.98) + 1;
  camara.updateProjectionMatrix();
  altoV = 2 * camara.position.z * t; anchoV = altoV * camara.aspect;
}
medir(); repartir();
window.addEventListener('resize', () => { medir(); if (reducir) dibujar(0); });

/* cursor: las piezas lo esquivan; un clic las hace girar */
const raton = new THREE.Vector2(9, 9), rayo = new THREE.Raycaster(), plano = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), punto = new THREE.Vector3();
let mx = 0, my = 0, tmx = 0, tmy = 0, hayRaton = false;
seccion.addEventListener('pointermove', (e) => {
  const r = lienzo.getBoundingClientRect();
  raton.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  tmx = raton.x; tmy = raton.y; hayRaton = true;
});
seccion.addEventListener('pointerleave', () => { hayRaton = false; tmx = 0; tmy = 0; });
seccion.addEventListener('pointerdown', (e) => {
  if (e.target.closest('form, a, button, input')) return;
  rayo.setFromCamera(raton, camara); rayo.ray.intersectPlane(plano, punto);
  piezas.forEach((p) => { const d = p.m.position.distanceTo(punto); if (d < 7) p.extra.add(new THREE.Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)).multiplyScalar((7 - d) * 1.6)); });
});

/* animación */
const qSuelta = new THREE.Quaternion(), eTmp = new THREE.Euler(), vTmp = new THREE.Vector3();
const suave = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const clamp = (x) => Math.min(1, Math.max(0, x));
let tiempo = 0, ultimo = performance.now(), visible = true;
function dibujar(dt) {
  tiempo += dt;
  const p = estado.p || 0;
  const e = suave(clamp((p - 0.1) / 0.55));
  const inclina = suave(clamp((p - 0.62) / 0.38));
  mx += (tmx - mx) * 0.06; my += (tmy - my) * 0.06;
  if (hayRaton && e < 0.95) { rayo.setFromCamera(raton, camara); rayo.ray.intersectPlane(plano, punto); }
  piezas.forEach((pz, i) => {
    // posición suelta flotando
    vTmp.copy(pz.base); vTmp.y += Math.sin(tiempo * 0.6 + pz.fase) * 0.4; vTmp.x += Math.cos(tiempo * 0.4 + pz.fase) * 0.25;
    if (hayRaton && e < 0.95) {
      const dx = pz.m.position.x - punto.x, dy = pz.m.position.y - punto.y, d = Math.hypot(dx, dy);
      if (d < 3.6 && d > 0.001) pz.empuje.add(new THREE.Vector3(dx / d, dy / d, 0.4).multiplyScalar((3.6 - d) * 0.09));
    }
    pz.empuje.multiplyScalar(0.93);
    vTmp.add(pz.empuje);
    pz.m.position.lerpVectors(vTmp, pz.rejPos, e);
    // giro suelto + impulso del clic
    pz.extra.multiplyScalar(0.95);
    eTmp.set(pz.rot0.x + tiempo * pz.giro.x + pz.extra.x, pz.rot0.y + tiempo * pz.giro.y + pz.extra.y, pz.rot0.z + tiempo * pz.giro.z + pz.extra.z);
    qSuelta.setFromEuler(eTmp);
    pz.m.quaternion.slerpQuaternions(qSuelta, pz.rejQ, e);
    // al encajar, una ola recorre el patrón
    const ola = e > 0.98 ? Math.sin(tiempo * 2.2 - (pz.rejPos.x + pz.rejPos.y) * 0.25) * 0.35 * inclina : 0;
    pz.m.position.z += ola;
  });
  grupo.rotation.y = mx * 0.28 * (1 - e * 0.6) + inclina * 0.18 * Math.sin(tiempo * 0.5);
  grupo.rotation.x = -my * 0.16 * (1 - e * 0.6) - inclina * 0.32;
  grupo.position.y = inclina * altoV * (movil ? 0.1 : 0.12);
  grupo.scale.setScalar(1 - inclina * (movil ? 0.22 : 0.3));
  renderer.render(escena, camara);
}
function bucle(t) {
  const dt = Math.min(0.05, (t - ultimo) / 1000); ultimo = t;
  if (visible && !document.hidden) dibujar(dt);
  requestAnimationFrame(bucle);
}
new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { rootMargin: '100px' }).observe(seccion);

dibujar(0.016);
estado.listo = true;
window.dispatchEvent(new Event('escena-lista'));
if (!reducir) requestAnimationFrame(bucle);
