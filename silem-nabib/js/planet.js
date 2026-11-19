// Un mundo pequeño que gira: los lugares de trabajo parados sobre un planeta en pixel art
import * as THREE from 'three';

export async function initPlanet({ canvas, jobs, onSelect, onHover, reduced }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  const PIX = 0.5; // se dibuja a media resolución: todo queda en píxeles
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2) * PIX);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 400);
  camera.position.set(0, 2, 40); camera.lookAt(0, -1, 0);

  const loader = new THREE.TextureLoader();
  const tex = (u) => new Promise(r => loader.load(u, t => { t.colorSpace = THREE.SRGBColorSpace; t.magFilter = t.minFilter = THREE.NearestFilter; t.generateMipmaps = false; r(t); }));

  // superficie del planeta: pasto, caminos de piedra y flores, dibujados en píxeles
  const R = 10;
  const sc = document.createElement('canvas'); sc.width = 256; sc.height = 128; const g = sc.getContext('2d');
  const greens = ['#3f7a3a', '#4b8a41', '#5a9a48', '#376b34', '#6aa852'];
  const rnd = (() => { let a = 7; return () => ((a = (a * 16807) % 2147483647) / 2147483647); })();
  for (let y = 0; y < 128; y++) for (let x = 0; x < 256; x++) { const n = Math.sin(x * 0.21) * Math.cos(y * 0.33) + rnd() * 1.6; g.fillStyle = greens[Math.max(0, Math.min(4, Math.floor(n + 2)))]; g.fillRect(x, y, 1, 1); }
  g.fillStyle = '#b8a07a'; for (let x = 0; x < 256; x++) { const y = 58 + Math.round(Math.sin(x / 256 * Math.PI * 4) * 3); g.fillRect(x, y, 1, 5); g.fillStyle = (x % 4) ? '#b8a07a' : '#a68d66'; }
  for (let i = 0; i < 260; i++) { g.fillStyle = ['#ffe279', '#ff8ac8', '#ffffff', '#7cc4ff'][i % 4]; g.fillRect(Math.random() * 256 | 0, Math.random() * 128 | 0, 1, 1); }
  g.fillStyle = '#2f5f2c'; for (let i = 0; i < 40; i++) g.fillRect(Math.random() * 256 | 0, Math.random() * 128 | 0, 2, 1);
  const st = new THREE.CanvasTexture(sc); st.magFilter = st.minFilter = THREE.NearestFilter; st.colorSpace = THREE.SRGBColorSpace; st.generateMipmaps = false;
  const world = new THREE.Group(); world.position.y = -9.5; scene.add(world);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(R, 48, 32), new THREE.MeshLambertMaterial({ map: st }));
  world.add(ball);
  scene.add(new THREE.HemisphereLight(0xb8c8ff, 0x2a1e40, 1.6));
  const sun = new THREE.DirectionalLight(0xffe2b0, 2.2); sun.position.set(-20, 25, 30); scene.add(sun);
  // halo
  const hc = document.createElement('canvas'); hc.width = hc.height = 64; const hg = hc.getContext('2d'); const gr = hg.createRadialGradient(32, 32, 18, 32, 32, 32);
  gr.addColorStop(0, 'rgba(124,196,255,.35)'); gr.addColorStop(1, 'rgba(124,196,255,0)'); hg.fillStyle = gr; hg.fillRect(0, 0, 64, 64);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(hc), transparent: true, depthWrite: false })); halo.scale.setScalar(R * 2.9); halo.position.set(0, -9.5, -2); scene.add(halo);
  // estrellas
  const sp = new Float32Array(600 * 3); for (let i = 0; i < 600; i++) sp.set([(Math.random() - .5) * 200, (Math.random() - .5) * 120, -60 - Math.random() * 60], i * 3);
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xdfe8ff, size: 2, sizeAttenuation: false })));

  // objetos de pie sobre el planeta (se orientan hacia la cámara alrededor de su vertical)
  const standers = [];
  // anillo frontal: el planeta gira como una rueda y lo que está arriba queda de pie contra el cielo
  const stand = (t, h, ang, zoff = 0) => {
    const w = h * t.image.width / t.image.height;
    const geo = new THREE.PlaneGeometry(w, h); geo.translate(0, h / 2, 0);
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide }));
    const a = ang * Math.PI / 180, z = Math.sin(zoff * Math.PI / 180);
    const n = new THREE.Vector3(Math.sin(a) * Math.cos(zoff * Math.PI / 180), Math.cos(a) * Math.cos(zoff * Math.PI / 180), z).normalize();
    m.userData.n = n; m.position.copy(n).multiplyScalar(R - 0.05); world.add(m); standers.push(m); return m;
  };
  const picks = [];
  const lons = [0, 90, 180, 270];
  const [palm, lamp, cats, ast] = await Promise.all(['img/palm.png', 'img/lamp.png', 'img/cats.png', 'img/asteroid.png'].map(tex));
  for (let k = 0; k < jobs.length; k++) {
    const t = await tex(`img/fac-${jobs[k].id}.png`);
    const b = stand(t, 5.2, lons[k], 0); b.userData.k = k; picks.push(b);
    stand(palm, 3.6, lons[k] + 32, 14); stand(lamp, 2.6, lons[k] + 22, -8); stand(palm, 2.8, lons[k] - 30, 18);
  }
  stand(cats, 1.7, 48, 22);
  const moon = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.6), new THREE.MeshBasicMaterial({ map: ast, transparent: true, alphaTest: 0.5 })); scene.add(moon);

  // ---------- interacción: arrastrar con inercia, tocar un edificio ----------
  let rotY = 0, rotX = 0, vel = 0.0025, target = null, dragging = false, px = 0, py = 0, moved = 0, hover = null;
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const toNdc = (e) => { const r = canvas.getBoundingClientRect(); ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); };
  const pick = () => { ray.setFromCamera(ndc, camera); const h = ray.intersectObjects(picks, false)[0]; if (!h) return null; // solo si está del lado visible
    return h.object; };
  canvas.addEventListener('pointerdown', (e) => { dragging = true; moved = 0; px = e.clientX; py = e.clientY; target = null; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', (e) => {
    toNdc(e);
    if (dragging) { const dx = e.clientX - px, dy = e.clientY - py; px = e.clientX; py = e.clientY; moved += Math.abs(dx) + Math.abs(dy); vel = -dx * 0.004; rotY += vel; }
    const h = pick(); if (h !== hover) { hover = h; canvas.style.cursor = h ? 'pointer' : 'grab'; onHover && onHover(h ? jobs[h.userData.k] : null); }
  });
  // al soltar: si fue un toque, se elige el edificio; si fue un giro, el planeta se detiene en el edificio más cercano
  const snap = () => { const q4 = Math.PI / 2; const k = ((Math.round((rotY + vel * 20) / q4) % 4) + 4) % 4; select(k); };
  const up = (e) => { if (!dragging) return; dragging = false; if (moved < 6) { toNdc(e); const h = pick(); if (h) select(h.userData.k); } else snap(); };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', () => { dragging = false; });
  canvas.addEventListener('pointerleave', () => { hover = null; onHover && onHover(null); });
  function select(k) { target = lons[k] * Math.PI / 180; vel = 0; onSelect && onSelect(k); }

  // ---------- bucle ----------
  let visible = false, raf = 0, t0 = performance.now();
  const resize = () => { const r = canvas.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); camera.aspect = r.width / r.height; camera.updateProjectionMatrix(); };
  resize(); addEventListener('resize', resize);
  const camW = new THREE.Vector3(), tmp = new THREE.Vector3(), fwd = new THREE.Vector3(), right = new THREE.Vector3(), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), wq = new THREE.Quaternion();
  function frame(now) {
    raf = requestAnimationFrame(frame); if (!visible) return;
    const t = (now - t0) / 1000;
    if (target != null) { let d = target - rotY; d = Math.atan2(Math.sin(d), Math.cos(d)); rotY += d * 0.08; if (Math.abs(d) < 0.002) target = null; }
    world.rotation.set(0, 0, rotY + (reduced || dragging ? 0 : Math.sin(t * 0.6) * 0.025));
    world.updateMatrixWorld();
    camera.getWorldPosition(camW);
    world.getWorldQuaternion(wq);
    standers.forEach(m => {
      // vertical = normal local; frente = hacia la cámara, proyectado en el plano tangente
      const up = m.userData.n; tmp.copy(camW); world.worldToLocal(tmp); fwd.copy(tmp).sub(m.position);
      fwd.addScaledVector(up, -fwd.dot(up)).normalize(); right.crossVectors(up, fwd).normalize();
      m4.makeBasis(right, up, fwd); m.quaternion.setFromRotationMatrix(m4);
      const s = m === hover ? 1.12 : 1; m.scale.x += (s - m.scale.x) * 0.2; m.scale.y = m.scale.z = m.scale.x;
    });
    moon.position.set(-11 + Math.cos(t * 0.3) * 2, 7 + Math.sin(t * 0.5) * 0.8, -6); moon.lookAt(camera.position);
    renderer.render(scene, camera);
  }
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { threshold: 0.05 }).observe(canvas);
  raf = requestAnimationFrame(frame);
  return { select, resize };
}
