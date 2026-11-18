// El globo (Three.js y la textura de la Tierra) solo se descarga cuando el visitante se acerca a él.
let THREE, OrbitControls;
const caja = document.getElementById("globo");
if (caja) {
  const vigia = new IntersectionObserver(async (es) => {
    if (!es[0].isIntersecting) return;
    vigia.disconnect();
    try {
      THREE = await import("three");
      ({ OrbitControls } = await import("three/addons/controls/OrbitControls.js"));
    } catch (e) { const c = caja.querySelector(".globo-carga"); if (c) c.textContent = "Génova → Cali · 9.380 km"; return; }
    iniciar();
  }, { rootMargin: "600px 0px" });
  vigia.observe(caja);
}

function vec(lat, lon, r) {
  const phi = (90 - lat) * Math.PI / 180, th = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
}

function iniciar() {
  let ren;
  try { ren = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { caja.querySelector(".globo-carga").textContent = "Génova → Cali · 9.380 km"; return; }
  ren.setPixelRatio(Math.min(2, devicePixelRatio));
  caja.appendChild(ren.domElement);
  const esc = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  cam.position.set(0, 0.6, 3.4);
  const R = 1;
  const tex = new THREE.TextureLoader();
  tex.crossOrigin = "anonymous";
  const mat = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 12, specular: 0x222222 });
  tex.load("https://cdn.jsdelivr.net/npm/three-globe@2.31.0/example/img/earth-blue-marble.jpg", (t) => {
    t.colorSpace = THREE.SRGBColorSpace; mat.map = t; mat.needsUpdate = true; const c = caja.querySelector(".globo-carga"); if (c) c.remove();
  });
  const tierra = new THREE.Mesh(new THREE.SphereGeometry(R, 96, 96), mat);
  const grupo = new THREE.Group(); grupo.add(tierra); esc.add(grupo);
  // halo
  const halo = new THREE.Mesh(new THREE.SphereGeometry(R * 1.06, 64, 64), new THREE.ShaderMaterial({
    transparent: true, side: THREE.BackSide, depthWrite: false,
    vertexShader: "varying vec3 n; void main(){ n = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
    fragmentShader: "varying vec3 n; void main(){ float i = pow(0.75 - dot(n, vec3(0.0,0.0,1.0)), 3.0); gl_FragColor = vec4(1.0,0.86,0.55,1.0)*i; }"
  }));
  esc.add(halo);
  esc.add(new THREE.AmbientLight(0xffffff, 0.9));
  const sol = new THREE.DirectionalLight(0xfff2dd, 1.6); sol.position.set(4, 2, 3); esc.add(sol);

  const GEN = [44.4056, 8.9463], CAL = [3.4516, -76.532];
  const a = vec(...GEN, R), b = vec(...CAL, R);
  // arco por el círculo máximo, elevado
  const pts = [];
  for (let i = 0; i <= 120; i++) {
    const t = i / 120, v = new THREE.Vector3().copy(a).lerp(b, t).normalize();
    v.multiplyScalar(R * (1 + 0.32 * Math.sin(Math.PI * t))); pts.push(v);
  }
  const curva = new THREE.CatmullRomCurve3(pts);
  const tubo = new THREE.Mesh(new THREE.TubeGeometry(curva, 200, 0.008, 8, false), new THREE.MeshBasicMaterial({ color: 0xd7282f }));
  tubo.geometry.setDrawRange(0, 0);
  grupo.add(tubo);
  const total = tubo.geometry.index.count;
  function punto(v, color) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 16), new THREE.MeshBasicMaterial({ color }));
    m.position.copy(v); grupo.add(m);
    const anillo = new THREE.Mesh(new THREE.RingGeometry(0.03, 0.04, 32), new THREE.MeshBasicMaterial({ color, transparent: true, side: THREE.DoubleSide }));
    anillo.position.copy(v.clone().multiplyScalar(1.002)); anillo.lookAt(new THREE.Vector3(0, 0, 0)); grupo.add(anillo);
    return anillo;
  }
  const an1 = punto(a, 0xffffff), an2 = punto(b, 0xf9c846);
  const viajero = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 16), new THREE.MeshBasicMaterial({ color: 0xf9c846 }));
  grupo.add(viajero);

  // etiquetas HTML
  function etiqueta(txt) { const d = document.createElement("span"); d.className = "globo-etq"; d.textContent = txt; caja.appendChild(d); return d; }
  const eG = etiqueta("Génova"), eC = etiqueta("Cali");

  const ctl = new OrbitControls(cam, ren.domElement);
  ctl.enableZoom = false; ctl.enablePan = false; ctl.enableDamping = true; ctl.rotateSpeed = 0.5;
  ctl.autoRotate = false;
  // orientar para ver el Atlántico
  const medio = new THREE.Vector3().copy(a).add(b).normalize();
  grupo.quaternion.setFromUnitVectors(medio, new THREE.Vector3(0, 0.25, 1).normalize());

  function tam() { const w = caja.clientWidth, h = caja.clientHeight; ren.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix(); }
  tam(); addEventListener("resize", tam);

  let visible = false, t0 = 0;
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible && !t0) t0 = performance.now(); }, { threshold: 0.25 }).observe(caja);
  const tmp = new THREE.Vector3();
  function proy(v, el) {
    tmp.copy(v).applyMatrix4(grupo.matrixWorld);
    const cara = tmp.clone().normalize().dot(cam.position.clone().normalize()) > 0.1;
    tmp.project(cam);
    el.style.transform = `translate(${(tmp.x * 0.5 + 0.5) * caja.clientWidth}px, ${(-tmp.y * 0.5 + 0.5) * caja.clientHeight}px)`;
    el.style.opacity = cara ? 1 : 0;
  }
  function bucle(now) {
    requestAnimationFrame(bucle);
    if (!visible) return;
    const p = t0 ? Math.max(0, Math.min(1, (now - t0) / 2600)) : 0, e = 1 - Math.pow(1 - p, 3);
    tubo.geometry.setDrawRange(0, Math.floor(total * e / 3) * 3);
    viajero.position.copy(curva.getPoint(e));
    const s = 1 + 0.6 * ((now / 900) % 1); an1.scale.setScalar(s); an2.scale.setScalar(s);
    an1.material.opacity = an2.material.opacity = 1 - ((now / 900) % 1);
    if (!ctl.state || ctl.state === -1) grupo.rotation.y += 0.0008;
    ctl.update(); ren.render(esc, cam);
    proy(a, eG); proy(b, eC);
  }
  requestAnimationFrame(bucle);
}
