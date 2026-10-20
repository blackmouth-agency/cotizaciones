/* Jam × BLACKMOUTH — propuesta de alianza */
(() => {
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const GL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>';
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const cop = n => '$' + Math.round(n).toLocaleString('es-CO').replace(/,/g, '.');
const k = n => n >= 1e6 ? (n / 1e6).toLocaleString('es-CO', { maximumFractionDigits: 2 }) + ' M' : Math.round(n / 1e3) + ' mil';

/* ================= DATOS ================= */
// mk = rango de mercado freelance [min, max]; ag = tarifa de agencia BLACKMOUTH; al = precio aliado Jam (base)
const TARIFAS = {
  'Contenido': [
    { id: 'reel', n: 'Reel editado', d: 'Material del cliente, hasta 60 s: corte, subtítulos dinámicos, música, SFX y color.', mk: [60e3, 120e3], ag: 160e3, al: 85e3, u: 'reel' },
    { id: 'reelp', n: 'Reel producido', d: 'Guion, grabación en bloque (hasta 4 por jornada) y edición.', mk: [180e3, 350e3], ag: 380e3, al: 260e3, u: 'reel' },
    { id: 'ia', n: 'Video con IA', d: '15–30 s: guion, generación de imagen y video, edición y música. Incluye créditos.', mk: [300e3, 600e3], ag: 650e3, al: 450e3, u: 'video' },
    { id: 'carr', n: 'Carrusel', d: 'Hasta 8 láminas: diseño y copy.', mk: [50e3, 120e3], ag: 140e3, al: 85e3, u: 'carrusel' },
    { id: 'carra', n: 'Carrusel animado', d: 'Hasta 8 láminas con movimiento, como los de Jam.', mk: [120e3, 200e3], ag: 220e3, al: 150e3, u: 'carrusel' },
    { id: 'pieza', n: 'Pieza o historia', d: 'Estática para feed o historias.', mk: [25e3, 60e3], ag: 60e3, al: 35e3, u: 'pieza' },
    { id: 'motion', n: 'Motion graphics', d: 'Animación de logo o pieza de hasta 10 s.', mk: [150e3, 400e3], ag: 450e3, al: 300e3, u: 'pieza' },
    { id: 'jornada', n: 'Jornada de grabación', d: 'Hasta 4 h en Cali, con cámara, luz y sonido.', mk: [350e3, 700e3], ag: 650e3, al: 450e3, u: 'jornada' },
  ],
  'Planes mensuales': [
    { id: 'pe', n: 'Plan Esencial', d: '2 redes · 8 reels, 6 carruseles y 16 historias al mes.', mk: [800e3, 1.5e6], ag: 1.8e6, al: 1.3e6, u: 'mes' },
    { id: 'pc', n: 'Plan Crecimiento', d: '4 redes · 12 reels, 8 carruseles, 24 historias e informe mensual.', mk: [1.2e6, 2.5e6], ag: 2.6e6, al: 1.85e6, u: 'mes' },
    { id: 'pk', n: 'Plan Completo', d: 'Crecimiento + gestión de Google Ads.', mk: [2e6, 3.5e6], ag: 3.6e6, al: 2.6e6, u: 'mes' },
    { id: 'pauta', n: 'Gestión de pauta', d: 'Meta o Google Ads. No incluye la inversión.', mk: [300e3, 800e3], ag: 400e3, al: 280e3, u: 'mes' },
  ],
  'Proyectos': [
    { id: 'web', n: 'Página web', d: 'Landing o sitio corto, responsive y animado.', mk: [1e6, 3e6], ag: 2.2e6, al: 1.6e6, u: 'proyecto' },
    { id: 'manual', n: 'Manual de marca', d: 'Identidad, usos del logo, color, tipografía y aplicaciones.', mk: [600e3, 2e6], ag: 1.2e6, al: 860e3, u: 'proyecto' },
    { id: 'prop', n: 'Propuesta web interactiva', d: 'Como esta: cotizaciones, planes o estrategias para presentar.', mk: [500e3, 1.5e6], ag: 900e3, al: 600e3, u: 'proyecto' },
  ],
  'Talleres': [
    { id: 't1', n: 'T1 · Exprés', d: '3 h, hasta 15 personas.', mk: [750e3, 1.5e6], ag: 1.5e6, al: 1.05e6, u: 'taller' },
    { id: 't2', n: 'T2 · Intensivo', d: '8 h en 2 sesiones, hasta 15 personas.', mk: [2e6, 4e6], ag: 3.2e6, al: 2.25e6, u: 'taller' },
    { id: 't3', n: 'T3 · Programa', d: '4 sesiones de 3 h + 30 días de acompañamiento.', mk: [3e6, 6e6], ag: 5.5e6, al: 3.9e6, u: 'programa' },
  ],
};
const NIVELES = [
  { n: 'Arranque', min: 0, d: 0 },
  { n: 'Ritmo', min: 2.5e6, d: .05 },
  { n: 'Flujo', min: 5e6, d: .10 },
  { n: 'Escala', min: 9e6, d: .15 },
];
const PRESETS = {
  uno: { reel: 4, carr: 4, pieza: 8 },
  tres: { reel: 12, carr: 10, pieza: 20, ia: 1, pauta: 2 },
  fuerte: { pc: 2, reel: 16, ia: 3, carra: 4, motion: 1, t2: 1 },
  cero: {},
};
const LECTURA = [
  'Jam se presenta como agencia de IA: «Integramos la IA en todo tu negocio». La identidad es sobria —negro, blanco, una tipografía limpia y un guiño en la jota— y dice mucho de Jaime: serio, preciso y curioso.',
  'Conviven dos líneas. Una reinterpreta con IA personajes que todos conocemos (Tal Cual, «Alors on danse», el Tesla de Martín de Francisco) y es la que más alcance tiene. La otra enseña criterio: «La IA no hace magia». Y la spec ad de Cartier demuestra lo que puede lograr una campaña sin rodaje.',
  'Jam ya consigue clientes que valen la pena, como Vitajuz. Lo que limita crecer no es el criterio sino las horas de producción. Ahí entramos nosotros: un equipo que produce en silencio, con el estándar de Jam, para que Jaime venda, dirija y enseñe.',
];

/* ================= ARRANQUE ================= */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (!location.hash) scrollTo(0, 0);
const boot = $('#boot');
function ticks(svg, n, r1, r2, c = 100) {
  let h = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    h += `<line x1="${c + Math.cos(a) * r1}" y1="${c + Math.sin(a) * r1}" x2="${c + Math.cos(a) * r2}" y2="${c + Math.sin(a) * r2}"/>`;
  }
  svg.innerHTML = h;
  return $$('line', svg);
}
const bootLines = ticks($('#bootTicks'), 72, 80, 94);
const LOG = ['> cargando criterio de Jam', '> cargando capacidad BLACKMOUTH', '> cruzando precios de mercado', '> propuesta lista'];
let booted = false;
function endBoot() {
  if (booted) return; booted = true;
  boot.classList.add('off');
  document.body.style.overflow = '';
  intro();
}
if (RM || sessionStorageGet('jamBoot')) { boot.remove(); booted = true; requestAnimationFrame(intro); }
else {
  document.body.style.overflow = 'hidden';
  const t0 = performance.now(), D = 2600;
  const log = $('#bootLog'); let shown = 0;
  (function f(t) {
    const p = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - p, 2.2);
    $('#bootPct').textContent = String(Math.round(e * 100)).padStart(2, '0');
    const on = Math.round(e * bootLines.length);
    bootLines.forEach((l, i) => l.classList.toggle('on', i < on));
    const want = Math.min(LOG.length, Math.floor(p * LOG.length + .2));
    while (shown < want) { log.insertAdjacentHTML('beforeend', `<p>${LOG[shown]}… <b>OK</b></p>`); shown++; }
    if (p < 1) requestAnimationFrame(f); else setTimeout(endBoot, 350);
  })(t0);
  $('#bootSkip').addEventListener('click', endBoot);
  sessionStorageSet('jamBoot', 1);
}
function sessionStorageGet(k) { try { return sessionStorage.getItem(k); } catch { return null; } }
function sessionStorageSet(k, v) { try { sessionStorage.setItem(k, v); } catch {} }

/* ================= CURSOR ================= */
const cur = $('#cursor');
if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; });
  (function loop() { cx += (x - cx) * .22; cy += (y - cy) * .22; cur.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); })();
  document.addEventListener('pointerover', e => cur.classList.toggle('big', !!e.target.closest('a,button,.reel,.tcard')));
}

/* ================= SCROLL (Lenis + GSAP) ================= */
const hasG = window.gsap && window.ScrollTrigger;
let lenis = null;
if (hasG) gsap.registerPlugin(ScrollTrigger);
if (window.Lenis && !RM) {
  lenis = new Lenis({ lerp: .1 });
  if (hasG) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
  else (function r(t) { lenis.raf(t); requestAnimationFrame(r); })();
}
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const t = $(a.getAttribute('href')); if (!t) return;
  e.preventDefault();
  lenis ? lenis.scrollTo(t, { offset: -60, duration: 1.4 }) : t.scrollIntoView({ behavior: 'smooth' });
}));

// barra y sección actual
const secs = $$('main > section');
const bar = $('#hudBar'), num = $('#hudNum'), nm = $('#hudName'), links = $$('.hud-nav a');
function onScroll() {
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (scrollY / h * 100) + '%';
  let idx = 0;
  secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * .45) idx = i; });
  num.textContent = String(idx + 1).padStart(2, '0');
  if (nm.dataset.final !== secs[idx].dataset.name) { nm.dataset.final = secs[idx].dataset.name; scramble(nm); }
  links.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + secs[idx].id));
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();

/* ================= TEXTO QUE SE DESCIFRA ================= */
function scramble(el, dur = 700) {
  const fin = el.dataset.final || (el.dataset.final = el.textContent);
  if (RM) { el.textContent = fin; return; }
  const t0 = performance.now(), sid = el._sid = (el._sid || 0) + 1;
  (function f(t) {
    if (sid !== el._sid) return;
    const p = Math.min(1, (t - t0) / dur);
    el.textContent = [...fin].map((c, i) => c === ' ' || i < p * fin.length ? c : GL[Math.random() * GL.length | 0]).join('');
    if (p < 1) requestAnimationFrame(f);
  })(t0);
}

/* ================= INTRO + REVEALS ================= */
function intro() {
  $$('[data-scramble]').forEach(el => scramble(el, 1400));
  if (!hasG) { $$('.reveal').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; }); return; }
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.hero .kicker', { y: 20, opacity: 0, duration: .8 })
    .from('.title .ln', { yPercent: 60, opacity: 0, filter: 'blur(12px)', stagger: .14, duration: 1.3 }, '-=.5')
    .from('.lead, .hero-meta, .btn-scan', { y: 24, opacity: 0, stagger: .1, duration: 1 }, '-=.9')
    .from('.hero-head', { opacity: 0, scale: 1.08, duration: 2 }, 0)
    .from('.readout', { x: 30, opacity: 0, stagger: .15, duration: 1 }, .5);
  $$('.reveal').forEach(el => gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));
  gsap.to('.hero-head', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-copy', { y: -60, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: '40% top', end: 'bottom top', scrub: true } });
  // contadores
  $$('[data-count]').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => {
    const o = { v: 0 }; gsap.to(o, { v: +el.dataset.count, duration: 1.8, ease: 'power3.out', onUpdate: () => el.textContent = Math.round(o.v) });
  } }));
  // checklist
  $$('#checklist li').forEach((li, i) => ScrollTrigger.create({ trigger: li, start: 'top 82%', once: true, onEnter: () => setTimeout(() => li.classList.add('ok'), i % 3 * 120) }));
  ScrollTrigger.create({ trigger: '#win', start: 'top 75%', once: true, onEnter: () => typeTab(0) });
  ScrollTrigger.refresh();
}

/* ================= OLA DE PARTÍCULAS (hero) ================= */
(function wave() {
  const c = $('#wave'), x = c.getContext('2d');
  let W, H, dpr, mx = .5, my = .5, vis = true;
  function size() { dpr = Math.min(2, devicePixelRatio || 1); W = c.width = c.offsetWidth * dpr; H = c.height = c.offsetHeight * dpr; }
  size(); addEventListener('resize', size);
  addEventListener('pointermove', e => { mx = e.clientX / innerWidth; my = e.clientY / innerHeight; });
  new IntersectionObserver(([en]) => vis = en.isIntersecting).observe(c);
  const COLS = innerWidth < 700 ? 60 : 110, ROWS = 38;
  function draw(t) {
    requestAnimationFrame(draw);
    if (!vis) return;
    t *= .001;
    x.clearRect(0, 0, W, H);
    const hz = H * .58;
    for (let r = 0; r < ROWS; r++) {
      const z = r / ROWS, p = 1 / (1 + (1 - z) * 4);
      const y0 = hz + (H - hz) * Math.pow(z, 1.6) * 1.05;
      for (let i = 0; i < COLS; i++) {
        const u = i / (COLS - 1) - .5;
        const px = W / 2 + u * W * (0.6 + z * 1.6);
        const h = Math.sin(u * 9 + t * 1.1 + z * 4) * 18 + Math.sin(u * 4 - t * .7 + z * 8) * 26 + Math.cos((u - mx + .5) * 6) * (my * 30);
        const py = y0 - h * dpr * (0.4 + z);
        const a = (.08 + z * .7) * (1 - Math.abs(u) * 1.2);
        if (a <= 0) continue;
        x.fillStyle = `rgba(243,243,241,${a})`;
        const s = (0.6 + z * 1.6) * dpr;
        x.fillRect(px, py, s, s);
      }
    }
  }
  if (!RM) requestAnimationFrame(draw); else draw(0);
})();

/* ================= LECTURA: ventana con tipeo ================= */
let typing = 0;
function typeTab(i) {
  const el = $('#winText'), txt = LECTURA[i], id = ++typing;
  $$('.win-tabs button').forEach((b, j) => b.setAttribute('aria-selected', j === i));
  if (RM) { el.textContent = txt; return; }
  let n = 0;
  (function f() {
    if (id !== typing) return;
    n = Math.min(txt.length, n + 2 + (Math.random() * 3 | 0));
    el.innerHTML = txt.slice(0, n) + '<span class="caret"></span>';
    if (n < txt.length) setTimeout(f, 18);
  })();
}
$$('.win-tabs button').forEach(b => b.addEventListener('click', () => typeTab(+b.dataset.t)));
if (!hasG) typeTab(0);

/* ================= MODELOS ================= */
const tg = $('.toggle'), pill = $('.toggle-pill'), modelo = $('#modelo');
function setMode(btn) {
  $$('.toggle button').forEach(b => { b.classList.toggle('on', b === btn); b.setAttribute('aria-selected', b === btn); });
  pill.style.width = btn.offsetWidth + 'px';
  pill.style.transform = `translateX(${btn.offsetLeft - 5}px)`;
  modelo.dataset.mode = btn.dataset.m;
}
$$('.toggle button').forEach(b => b.addEventListener('click', () => setMode(b)));
const ro = new ResizeObserver(() => setMode($('.toggle button.on'))); ro.observe(tg);

/* ================= TARIFAS ================= */
const tabs = $('#tarTabs'), rows = $('#tarRows');
Object.keys(TARIFAS).forEach((g, i) => tabs.insertAdjacentHTML('beforeend', `<button role="tab" aria-selected="${i === 0}" data-g="${g}">${g}</button>`));
function renderTar(g) {
  const list = TARIFAS[g];
  const max = Math.max(...list.map(r => Math.max(r.mk[1], r.ag))) * 1.05;
  rows.innerHTML = list.map(r => {
    const pc = v => (v / max * 100).toFixed(1) + '%';
    return `<div class="t-row">
      <div class="srv"><h4>${r.n}</h4><p>${r.d}</p></div>
      <div class="v mk"><span class="lbl-m">Mercado</span>${k(r.mk[0])} – ${k(r.mk[1])}</div>
      <div class="v"><span class="lbl-m">Agencia</span>${cop(r.ag)}</div>
      <div class="v hl"><span class="lbl-m">Aliado Jam</span>${cop(r.al)}</div>
      <div class="bar" aria-hidden="true"><em style="left:${pc(r.mk[0])};width:calc(${pc(r.mk[1])} - ${pc(r.mk[0])})"></em><i class="a" style="left:${pc(r.ag)}"></i><i class="j" style="left:${pc(r.al)}"></i></div>
    </div>`;
  }).join('');
  if (hasG && !RM) gsap.from('#tarRows .t-row', { opacity: 0, x: -20, stagger: .05, duration: .6, ease: 'power3.out' });
}
tabs.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  $$('button', tabs).forEach(x => x.setAttribute('aria-selected', x === b));
  renderTar(b.dataset.g);
});
renderTar('Contenido');

/* ================= NIVELES + COTIZADOR ================= */
$('#niveles').innerHTML = NIVELES.map((l, i) => {
  const next = NIVELES[i + 1];
  const rango = next ? (l.min ? `${k(l.min)} a ${k(next.min)}` : `hasta ${k(next.min)}`) : `más de ${k(l.min)}`;
  return `<div class="nivel" data-i="${i}"><small class="mono">Nivel 0${i + 1}</small><b>${l.n}</b><span>${rango} al mes</span><em>${l.d ? '−' + l.d * 100 + '%' : '0%'}</em></div>`;
}).join('');

const ALL = Object.entries(TARIFAS).flatMap(([g, l]) => l.map(r => ({ ...r, g })));
const qty = Object.fromEntries(ALL.map(r => [r.id, 0]));
let html = '', lastG = '';
ALL.forEach(r => {
  if (r.g !== lastG) { html += `<p class="grp mono">${r.g}</p>`; lastG = r.g; }
  html += `<div class="item" data-id="${r.id}"><div><h5>${r.n}</h5><p>${cop(r.al)} / ${r.u}</p></div>
    <div class="pu" data-sub>—</div>
    <div class="step"><button type="button" data-d="-1" aria-label="Quitar ${r.n}">−</button><output>0</output><button type="button" data-d="1" aria-label="Agregar ${r.n}">+</button></div></div>`;
});
$('#cotItems').innerHTML = html;
$('#cotItems').addEventListener('click', e => {
  const b = e.target.closest('button[data-d]'); if (!b) return;
  const id = b.closest('.item').dataset.id;
  qty[id] = Math.max(0, Math.min(60, qty[id] + +b.dataset.d));
  calc();
});
$$('.presets button').forEach(b => b.addEventListener('click', () => {
  Object.keys(qty).forEach(id => qty[id] = PRESETS[b.dataset.p][id] || 0);
  calc();
}));
const cpLines = ticks($('#cpTicks'), 90, 92, 106, 110);
let shownTotal = 0;
function calc() {
  let base = 0, venta = 0;
  ALL.forEach(r => {
    const q = qty[r.id], it = $(`.item[data-id="${r.id}"]`);
    $('output', it).textContent = q;
    it.classList.toggle('has', q > 0);
    $('[data-sub]', it).textContent = q ? cop(q * r.al) : '—';
    base += q * r.al; venta += q * r.ag;
  });
  let li = 0; NIVELES.forEach((l, i) => { if (base >= l.min) li = i; });
  const L = NIVELES[li], off = base * L.d, total = base - off, margen = venta - total;
  $('#cpNivel').textContent = base ? L.n : '—';
  $('#cpDesc').textContent = base ? `${L.d * 100} % de descuento` : '0 % de descuento';
  $$('.nivel').forEach((n, i) => n.classList.toggle('on', base > 0 && i === li));
  $$('#cpSeg i').forEach((s, i) => {
    if (!s.firstChild) s.innerHTML = '<b></b>';
    const lo = NIVELES[i].min, hi = NIVELES[i + 1] ? NIVELES[i + 1].min : NIVELES[i].min * 1.6;
    s.firstChild.style.width = Math.max(0, Math.min(1, (base - lo) / (hi - lo))) * 100 + '%';
  });
  const nx = NIVELES[li + 1];
  $('#cpNext').textContent = !base ? 'Agrega servicios para empezar.' : nx ? `Te faltan ${cop(nx.min - base)} para subir a ${nx.n} (−${nx.d * 100} %).` : 'Nivel máximo: 15 % de descuento en todo el mes.';
  const fr = Math.min(1, base / 12e6);
  cpLines.forEach((l, i) => l.classList.toggle('on', i < Math.round(fr * cpLines.length)));
  $('#cpBase').textContent = cop(base);
  $('#cpOff').textContent = '−' + cop(off);
  $('#cpVenta').textContent = cop(venta);
  $('#cpMargen').textContent = cop(margen);
  $('#cpPct').textContent = venta ? `(${Math.round(margen / venta * 100)} %)` : '';
  const el = $('#cpTotal'), from = shownTotal; shownTotal = total;
  if (hasG && !RM) { const o = { v: from }; gsap.to(o, { v: total, duration: .6, ease: 'power2.out', onUpdate: () => el.textContent = cop(o.v) }); }
  else el.textContent = cop(total);
}
Object.assign(qty, PRESETS.tres); calc();

/* ================= TÚNEL (cierre) ================= */
(function tunnel() {
  const c = $('#tunnel'), x = c.getContext('2d');
  let W, H, dpr, vis = false;
  function size() { dpr = Math.min(2, devicePixelRatio || 1); W = c.width = c.offsetWidth * dpr; H = c.height = c.offsetHeight * dpr; }
  size(); addEventListener('resize', size);
  new IntersectionObserver(([en]) => vis = en.isIntersecting).observe(c);
  const N = 22;
  function draw(t) {
    requestAnimationFrame(draw);
    if (!vis && !RM) return;
    t *= .001;
    x.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H * .5, base = Math.max(W, H) * .55;
    // luz
    const g = x.createRadialGradient(cx, cy, 0, cx, cy, base * .35);
    g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(.25, 'rgba(255,255,255,.12)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (let i = 0; i < N; i++) {
      const z = ((i / N) + (RM ? 0 : t * .06)) % 1;          // 0 = fondo, 1 = cerca
      const s = Math.pow(z, 2.4);
      const w = base * (0.03 + s * 1.2), h = w * 1.25;
      const a = Math.min(1, z * 1.4) * (1 - Math.max(0, (z - .85) / .15));
      x.strokeStyle = `rgba(243,243,241,${a * .75})`;
      x.lineWidth = (0.6 + s * 2.2) * dpr;
      x.beginPath();
      x.moveTo(cx - w, cy + h * .7);
      x.lineTo(cx - w, cy);
      x.arc(cx, cy, w, Math.PI, 0);
      x.lineTo(cx + w, cy + h * .7);
      x.stroke();
    }
    // suelo
    x.strokeStyle = 'rgba(243,243,241,.08)'; x.lineWidth = dpr;
    for (let i = -10; i <= 10; i++) { x.beginPath(); x.moveTo(cx, cy + base * .02); x.lineTo(cx + i * W * .12, H); x.stroke(); }
  }
  requestAnimationFrame(draw);
})();

/* ================= BOTONES MAGNÉTICOS ================= */
if (matchMedia('(hover:hover)').matches && !RM) $$('.magnet').forEach(b => {
  b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .28}px)`; });
  b.addEventListener('pointerleave', () => b.style.transform = '');
});
})();
