/* Hologramas 3D de la propuesta Jam × BLACKMOUTH (three.js) */
import * as THREE from 'three';

const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DPR = Math.min(2, devicePixelRatio || 1);

const VERT = `
uniform float uTime; uniform float uSize; uniform float uScanAmp;
attribute float aRnd;
varying float vA;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float band = sin(uTime * 1.3) * uScanAmp;
  float scan = smoothstep(0.14, 0.0, abs(position.y - band));
  vA = 0.55 + 0.22 * sin(uTime * 3.0 + aRnd * 40.0) + scan * 0.9;
  gl_PointSize = uSize * (1.0 + scan * 1.4) * (${DPR.toFixed(1)} / -mv.z);
}`;
const FRAG = `
uniform float uOpacity;
varying float vA;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(vec3(0.96), smoothstep(0.5, 0.0, d) * vA * uOpacity);
}`;

function makeStage(canvas, camZ) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(DPR);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
  camera.position.z = camZ;
  function size() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  size(); new ResizeObserver(size).observe(canvas);
  let visible = false;
  new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(canvas);
  return { renderer, scene, camera, isVisible: () => visible };
}

function pointsMaterial(size, scanAmp) {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uSize: { value: size }, uOpacity: { value: 1 }, uScanAmp: { value: scanAmp } },
    vertexShader: VERT, fragmentShader: FRAG,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
}

/* ---------- formas (N puntos cada una) ---------- */
const N = 2400;
const rnd = (a, b) => a + Math.random() * (b - a);
function shapeSphere() {
  const a = new Float32Array(N * 3), g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), t = g * i;
    a.set([Math.cos(t) * r * .95, y * .95, Math.sin(t) * r * .95], i * 3);
  }
  return a;
}
function shapeTorus() {
  const a = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const u = Math.random() * Math.PI * 2, v = Math.random() * Math.PI * 2, R = .78, r = .3;
    a.set([(R + r * Math.cos(v)) * Math.cos(u), r * Math.sin(v), (R + r * Math.cos(v)) * Math.sin(u)], i * 3);
  }
  return a;
}
function shapeIcosa() {
  const geo = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.05, 1));
  const p = geo.attributes.position.array, segs = p.length / 6, a = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const s = (Math.random() * segs | 0) * 6, t = Math.random();
    a.set([p[s] + (p[s + 3] - p[s]) * t, p[s + 1] + (p[s + 4] - p[s + 1]) * t, p[s + 2] + (p[s + 5] - p[s + 2]) * t], i * 3);
  }
  return a;
}
function shapeKnot() {
  const a = new Float32Array(N * 3), P = 2, Q = 3;
  for (let i = 0; i < N; i++) {
    const t = Math.random() * Math.PI * 2, r = .48 + .22 * Math.cos(Q * t);
    const x = r * Math.cos(P * t), y = .22 * Math.sin(Q * t) * 1.6, z = r * Math.sin(P * t);
    a.set([x * 1.22 + rnd(-.04, .04), y * 1.22 + rnd(-.04, .04), z * 1.22 + rnd(-.04, .04)], i * 3);
  }
  return a;
}
function shapeDust() {
  const a = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const u = Math.random() * Math.PI * 2, v = Math.acos(rnd(-1, 1)), r = Math.cbrt(Math.random()) * .35;
    a.set([r * Math.sin(v) * Math.cos(u), r * Math.cos(v), r * Math.sin(v) * Math.sin(u)], i * 3);
  }
  return a;
}
function rndAttr(n) { const r = new Float32Array(n); for (let i = 0; i < n; i++) r[i] = Math.random(); return r; }

/* ================= 1 · HOLOGRAMA DEL NIVEL ================= */
(function nivel() {
  const canvas = document.getElementById('holoLvl'); if (!canvas) return;
  const { renderer, scene, camera, isVisible } = makeStage(canvas, 3.4);
  const SHAPES = [shapeSphere(), shapeTorus(), shapeIcosa(), shapeKnot()], DUST = shapeDust();
  const pos = new Float32Array(DUST);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aRnd', new THREE.BufferAttribute(rndAttr(N), 1));
  const mat = pointsMaterial(5.2, 1.0);
  const group = new THREE.Group();
  group.add(new THREE.Points(geo, mat));
  // anillos de órbita
  const ringMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .22 });
  const rings = [1.25, 1.42].map((r, i) => {
    const g = new THREE.BufferGeometry().setFromPoints(new THREE.Path().absarc(0, 0, r, 0, Math.PI * 2).getSpacedPoints(120));
    const l = new THREE.LineLoop(g, ringMat); l.rotation.x = Math.PI / 2 + (i ? .35 : -.2); group.add(l); return l;
  });
  scene.add(group);
  let target = DUST, scale = .8, tScale = .8, mx = 0, my = 0;
  function apply(d) {
    target = d.i < 0 ? DUST : SHAPES[d.i];
    tScale = .78 + Math.min(1, d.f) * .3;
    mat.uniforms.uOpacity.value = 1.6;                    // destello al cambiar
  }
  addEventListener('jam:nivel', e => apply(e.detail));
  if (window.JAM_NIVEL) apply(window.JAM_NIVEL);
  const panel = canvas.closest('.cot-panel');
  panel && panel.addEventListener('pointermove', e => { const r = panel.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5; });
  const clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    if (!isVisible() && !RM) return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < pos.length; i++) pos[i] += (target[i] - pos[i]) * (RM ? 1 : .07);
    geo.attributes.position.needsUpdate = true;
    scale += (tScale - scale) * .08;
    group.scale.setScalar(scale);
    group.rotation.y = t * .45 + mx * 1.2;
    group.rotation.x = .25 + my * .8;
    rings[0].rotation.z = t * .6; rings[1].rotation.z = -t * .4;
    mat.uniforms.uTime.value = t;
    mat.uniforms.uOpacity.value += (1 - mat.uniforms.uOpacity.value) * .05;
    renderer.render(scene, camera);
  })();
})();

/* ================= 2 · LOGO DE JAM EN PARTÍCULAS ================= */
(function logo() {
  const canvas = document.getElementById('holoLogo'); if (!canvas) return;
  const img = new Image();
  img.src = 'assets/img/jam-logo.png';
  img.onload = () => {
    const W = 260, H = Math.round(W * img.height / img.width);
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d'); x.drawImage(img, 0, 0, W, H);
    const d = x.getImageData(0, 0, W, H).data, pts = [];
    for (let y = 0; y < H; y += 2) for (let i = 0; i < W; i += 2) if (d[(y * W + i) * 4 + 3] > 120) pts.push(i, y);
    const n = pts.length / 2, S = 3.2 / W;
    const target = new Float32Array(n * 3), start = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      target.set([(pts[i * 2] - W / 2) * S, -(pts[i * 2 + 1] - H / 2) * S, rnd(-.04, .04)], i * 3);
      const u = Math.random() * Math.PI * 2, v = Math.acos(rnd(-1, 1)), r = rnd(2.2, 4.5);
      start.set([r * Math.sin(v) * Math.cos(u), r * Math.cos(v), r * Math.sin(v) * Math.sin(u) - 1], i * 3);
    }
    const { renderer, scene, camera, isVisible } = makeStage(canvas, 3.1);
    const pos = new Float32Array(RM ? target : start);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aRnd', new THREE.BufferAttribute(rndAttr(n), 1));
    const mat = pointsMaterial(6.5, .7);
    const pts3 = new THREE.Points(geo, mat);
    scene.add(pts3);
    let p = RM ? 1 : 0, started = RM, mx = 0, my = 0;
    addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });
    const clock = new THREE.Clock(); let t0 = 0;
    (function loop() {
      requestAnimationFrame(loop);
      const vis = isVisible();
      if (vis && !started) { started = true; t0 = clock.getElapsedTime(); }
      if (!vis && !RM) return;
      const t = clock.getElapsedTime();
      if (p < 1) {
        p = Math.min(1, (t - t0) / 2.4);
        const e = 1 - Math.pow(1 - p, 4);
        for (let i = 0; i < pos.length; i++) pos[i] = start[i] + (target[i] - start[i]) * e;
        geo.attributes.position.needsUpdate = true;
      }
      pts3.rotation.y += ((mx * .6 + Math.sin(t * .5) * .12) - pts3.rotation.y) * .05;
      pts3.rotation.x += ((my * .3) - pts3.rotation.x) * .05;
      mat.uniforms.uTime.value = t;
      renderer.render(scene, camera);
    })();
  };
})();
