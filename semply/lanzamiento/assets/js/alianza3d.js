/* Semply · alianza con ADH Coaching en 3D (25-nov-2026).
   Dos piezas en L, la roja de Semply y la azul de ADH, llegan girando y al bajar encajan en un marco
   (el mismo corchete del logo, dos veces). Se arrastran para girarlas; un toque las separa y vuelven a encajar. */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const caja = document.querySelector('.js-alianza3d');
if (caja) iniciar();

function iniciar() {
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const movil = matchMedia('(max-width: 720px)').matches;
  const lienzo = document.createElement('canvas');
  lienzo.setAttribute('aria-hidden', 'true');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: lienzo, antialias: true, alpha: true, powerPreference: 'high-performance' }); }
  catch (e) { return; } // se queda el dibujo plano de respaldo
  caja.prepend(lienzo); caja.classList.add('a3d-ok');
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const escena = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  escena.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
  const camara = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camara.position.set(0, 0, 17);
  const clave = new THREE.DirectionalLight(0xfff3e0, 2.2); clave.position.set(6, 9, 10); escena.add(clave);
  const borde = new THREE.DirectionalLight(0x31a3ca, 2.4); borde.position.set(-9, 4, -6); escena.add(borde);
  const calida = new THREE.DirectionalLight(0xff3355, 1.1); calida.position.set(4, -8, 3); escena.add(calida);
  escena.add(new THREE.AmbientLight(0xffffff, 0.18));

  /* pieza en L: brazos de 3 x 1, con bisel como el corchete del logo; la esquina interior queda en el origen */
  function geometriaL() {
    const s = new THREE.Shape(), a = 3, w = 1, r = 0.12;
    s.moveTo(r, 0); s.lineTo(a - r, 0); s.quadraticCurveTo(a, 0, a, r); s.lineTo(a, w - r); s.quadraticCurveTo(a, w, a - r, w);
    s.lineTo(w, w); s.lineTo(w, a - r); s.quadraticCurveTo(w, a, w - r, a); s.lineTo(r, a); s.quadraticCurveTo(0, a, 0, a - r); s.lineTo(0, r); s.quadraticCurveTo(0, 0, r, 0);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.8, bevelEnabled: true, bevelThickness: 0.16, bevelSize: 0.12, bevelSegments: 6, curveSegments: 8 });
    g.translate(0, 0, -0.4);
    return g;
  }
  const geo = geometriaL();
  const material = (hex, rough) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(hex), roughness: rough, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.18, envMapIntensity: 0.7 });
  const cargador = new THREE.TextureLoader();
  function calco(url, ancho, alto, x, y, rot) {
    const t = cargador.load(url); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(ancho, alto), new THREE.MeshBasicMaterial({ map: t, transparent: true, toneMapped: false, depthWrite: false }));
    m.position.set(x, y, 0.57); m.rotation.z = rot || 0; return m;
  }
  // Semply: corchete abajo a la izquierda, logo blanco sobre el brazo horizontal
  const piezaS = new THREE.Group();
  piezaS.add(new THREE.Mesh(geo, material('#F10E3B', 0.3)));
  piezaS.add(calco('assets/img/logo-blanco.png', 2.05, 2.05 * 183 / 720, 1.62, 0.5));
  // ADH: la misma pieza girada 180°, con su logo blanco al derecho
  const piezaA = new THREE.Group();
  piezaA.add(new THREE.Mesh(geo, material('#285B8B', 0.28)));
  piezaA.add(calco('assets/img/aliado/adh-blanco.png', 0.86 * 356 / 233, 0.86, 1.72, 0.5, Math.PI));

  const grupo = new THREE.Group(); escena.add(grupo);
  grupo.add(piezaS, piezaA);
  // posición final: marco de 4 x 3 con el hueco en el centro (centro del marco = origen)
  const finS = { p: new THREE.Vector3(-2, -1.5, 0), r: new THREE.Euler(0, 0, 0) };
  const finA = { p: new THREE.Vector3(2, 1.5, 0), r: new THREE.Euler(0, 0, Math.PI) };
  const iniS = { p: new THREE.Vector3(-7.5, -5, 3), r: new THREE.Euler(0.9, -1.3, -0.6) };
  const iniA = { p: new THREE.Vector3(7.5, 5.5, -4), r: new THREE.Euler(-0.8, 1.5, Math.PI + 0.9) };

  // sombra suave de contacto
  const cs = document.createElement('canvas'); cs.width = cs.height = 128;
  const cx = cs.getContext('2d'), gr = cx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(0,0,0,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = gr; cx.fillRect(0, 0, 128, 128);
  const sombra = new THREE.Mesh(new THREE.PlaneGeometry(9, 2.6), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cs), transparent: true, depthWrite: false }));
  sombra.rotation.x = -Math.PI / 2; sombra.position.y = -3.6; escena.add(sombra);

  // aro de luz cuando encajan
  const aro = new THREE.Mesh(new THREE.RingGeometry(2.6, 2.75, 96), new THREE.MeshBasicMaterial({ color: 0x31a3ca, transparent: true, opacity: 0, toneMapped: false, side: THREE.DoubleSide }));
  escena.add(aro);

  function medir() {
    const w = caja.clientWidth, h = caja.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camara.aspect = w / h;
    const t = Math.tan(THREE.MathUtils.degToRad(camara.fov / 2));
    camara.position.z = Math.max(2.5 / t, (3.4 / t) / camara.aspect); camara.updateProjectionMatrix();
  }
  medir(); addEventListener('resize', medir);

  /* interacción: arrastrar gira, tocar separa */
  let yaw = 0, pitch = 0, vYaw = 0, arrastre = null, mx = 0, my = 0, separar = 0;
  caja.addEventListener('pointermove', (e) => {
    const r = caja.getBoundingClientRect(); mx = ((e.clientX - r.left) / r.width) * 2 - 1; my = ((e.clientY - r.top) / r.height) * 2 - 1;
    if (arrastre) { const dx = e.clientX - arrastre.x; vYaw = dx * 0.006; yaw += vYaw; pitch = Math.max(-0.6, Math.min(0.6, pitch + (e.clientY - arrastre.y) * 0.004)); arrastre.mov += Math.abs(dx); arrastre.x = e.clientX; arrastre.y = e.clientY; }
  });
  caja.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse' || e.isPrimary) arrastre = { x: e.clientX, y: e.clientY, mov: 0 }; });
  addEventListener('pointerup', () => { if (arrastre && arrastre.mov < 6) { separar = 1; encajado = false; } arrastre = null; });
  caja.addEventListener('pointerleave', () => { mx = 0; my = 0; });

  const suave = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const clamp = (x) => Math.max(0, Math.min(1, x));
  const qA = new THREE.Quaternion(), qB = new THREE.Quaternion();
  function colocar(pz, ini, fin, e, abre) {
    pz.position.lerpVectors(ini.p, fin.p, e);
    if (abre) pz.position.addScaledVector(fin.p.clone().normalize(), abre * 2.4).z += abre * 1.2;
    qA.setFromEuler(ini.r); qB.setFromEuler(fin.r); pz.quaternion.slerpQuaternions(qA, qB, e);
    if (abre) pz.rotateY(abre * 0.5 * Math.sign(fin.p.x));
  }
  // dibuja solo cuando algo se mueve (scroll, cursor, arrastre, golpe); quieta no gasta (optimización 25-nov-2026)
  let visible = false, corre = false, listo = false, ultimo = performance.now(), encajado = false, golpe = 0, avance = reducir ? 1 : 0;
  function despertar() { if (visible && listo && !corre) { corre = true; ultimo = performance.now(); requestAnimationFrame(cuadro); } }
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; despertar(); }, { rootMargin: '120px 0px' }).observe(caja);
  addEventListener('scroll', despertar, { passive: true });
  ['pointermove', 'pointerdown', 'pointerleave'].forEach((n) => caja.addEventListener(n, despertar, { passive: true }));
  addEventListener('pointerup', despertar);
  addEventListener('resize', despertar);
  // los materiales se compilan antes de la primera vista para que no traben el scroll
  colocar(piezaS, iniS, finS, 0, 0); colocar(piezaA, iniA, finA, 0, 0);
  (renderer.compileAsync ? renderer.compileAsync(escena, camara) : Promise.resolve()).catch(() => {}).then(() => { listo = true; despertar(); });

  function cuadro(ahora) {
    if (!visible) { corre = false; return; }
    const dt = Math.min(0.05, (ahora - ultimo) / 1000); ultimo = ahora;
    // avance según el scroll: desde que entra por abajo hasta que su centro llega a 55 % de la pantalla
    const r = caja.getBoundingClientRect(), vh = innerHeight;
    const meta = reducir ? 1 : clamp((vh - r.top) / (vh * 0.45 + r.height * 0.5));
    avance += (meta - avance) * Math.min(1, dt * 6);
    if (Math.abs(meta - avance) < 0.0005) avance = meta;
    const e = suave(clamp(avance));
    separar = Math.max(0, separar - dt * 0.9);
    const abre = Math.sin(Math.min(1, separar) * Math.PI) * (separar > 0 ? 1 : 0);
    colocar(piezaS, iniS, finS, e, abre); colocar(piezaA, iniA, finA, e, abre);
    if (e > 0.985 && separar === 0 && !encajado) { encajado = true; golpe = 1; caja.classList.add('unida'); }
    if (e < 0.9) { encajado = false; caja.classList.remove('unida'); }
    golpe = Math.max(0, golpe - dt * 1.6);
    grupo.scale.setScalar(1 + Math.sin(golpe * Math.PI) * 0.05);
    aro.material.opacity = golpe * 0.8; aro.scale.setScalar(1 + (1 - golpe) * 0.9);
    // giro: arrastre con inercia + inclinación hacia el cursor
    if (!arrastre) { vYaw *= 0.94; yaw += vYaw; yaw *= 0.985; pitch *= 0.96; if (Math.abs(vYaw) < 1e-4) vYaw = 0; if (Math.abs(yaw) < 1e-4) yaw = 0; if (Math.abs(pitch) < 1e-4) pitch = 0; }
    const objY = yaw + mx * 0.35, objX = pitch + my * 0.22 - 0.08;
    grupo.rotation.y += (objY - grupo.rotation.y) * 0.08;
    grupo.rotation.x += (objX - grupo.rotation.x) * 0.08;
    sombra.material.opacity = 0.25 + e * 0.6; sombra.scale.x = 0.7 + e * 0.3;
    renderer.render(escena, camara);
    const quieta = avance === meta && golpe === 0 && separar === 0 && !arrastre && vYaw === 0 && yaw === 0 && pitch === 0
      && Math.abs(objY - grupo.rotation.y) < 0.0008 && Math.abs(objX - grupo.rotation.x) < 0.0008;
    if (quieta) { corre = false; return; }
    requestAnimationFrame(cuadro);
  }
}
