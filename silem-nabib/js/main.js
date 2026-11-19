import { PROJECTS, JOBS, HOTSPOTS, NUMBERS, CAPS, STACK } from './data.js?v=23';
import { sfx, setSound, soundOn, music } from './sound.js?v=23';
import { initOS } from './os.js?v=23';

if (/[?&]og\b/.test(location.search)) document.documentElement.classList.add('og');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = matchMedia('(pointer: coarse)').matches || innerWidth < 760;
const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
let mode = store.get('silem-mode') || 'human';
// aparición al hacer scroll (se define antes porque las tarjetas se vuelven a dibujar al cambiar de modo)
const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
const reveal = (els) => els.forEach(el => { if (!el.classList.contains('in')) io.observe(el); });

// ---------- modo, sonido, menú ----------
function setMode(m) {
  mode = m; store.set('silem-mode', m);
  document.body.classList.toggle('mode-eng', m === 'eng'); document.body.classList.toggle('mode-human', m !== 'eng');
  $$('.mode button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === m)));
  renderCards(); renderCaps(); if (jobSel != null) showJob(jobSel);
}
$$('.mode button').forEach(b => b.addEventListener('click', () => { setMode(b.dataset.mode); sfx('blip'); }));
$('#soundBtn').addEventListener('click', () => { setSound(!soundOn()); $('#soundBtn').setAttribute('aria-pressed', String(soundOn())); sfx('blip'); });
$('#burger').addEventListener('click', () => { const o = document.body.classList.toggle('menu-open'); $('#burger').setAttribute('aria-expanded', String(o)); });
$$('.links a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));
document.addEventListener('pointerenter', (e) => { if (e.target.matches && e.target.matches('.pxbtn, .links a, .card, .ico, .hs, .timeline button')) sfx('tick'); }, true);
const secs = $$('section[id]');
const navIO = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) $$('.links a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
secs.forEach(s => navIO.observe(s));
addEventListener('scroll', () => document.body.classList.toggle('scrolled', scrollY > 40), { passive: true });

// ---------- cursor: etiqueta y efectos ----------
const ctip = $('#ctip');
let mx = innerWidth / 2, my = innerHeight / 2, nx = 0, ny = 0;
addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; ctip.style.transform = `translate(${mx + 16}px, ${my + 14}px)`; }, { passive: true });
function tip(text) { ctip.textContent = text || ''; ctip.classList.toggle('on', !!text); }
$$('[data-tip]').forEach(el => { el.addEventListener('pointerenter', () => tip(el.dataset.tip)); el.addEventListener('pointerleave', () => tip('')); });
function hearts(x, y) {
  for (let i = 0; i < 8; i++) { const h = document.createElement('i'); h.className = 'heart'; h.style.left = x + 'px'; h.style.top = y + 'px';
    h.style.setProperty('--dx', (Math.random() * 130 - 65) + 'px'); h.style.setProperty('--dy', (-70 - Math.random() * 100) + 'px'); h.style.animationDelay = i * 40 + 'ms';
    $('#fx').appendChild(h); setTimeout(() => h.remove(), 1500); }
  sfx('meow');
}
function toast(text, x, y) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = text; t.style.left = x + 'px'; t.style.top = y + 'px'; $('#fx').appendChild(t); setTimeout(() => t.remove(), 3400); }

// ---------- portada: capas con parallax y zoom a la ventana ----------
const stage = $('#stage'), hero = $('#inicio');
const layers = $$('.ly', stage).map(el => ({ el, d: +el.dataset.d }));
// edificios laterales repetidos hasta cubrir el ancho
function buildSides() {
  const tileW = $('#tile').offsetWidth, sideW = tileW * 0.335, need = Math.ceil((innerWidth * 0.75) / sideW) + 1;
  $$('.side').forEach(s => { s.innerHTML = ''; for (let i = 0; i < need; i++) { const im = document.createElement('img'); im.src = `img/side-${s.classList.contains('l') ? 'l' : 'r'}.png`; im.className = 'px'; im.alt = ''; s.appendChild(im); } });
}
// el nombre gigante se apoya en los techos: solo la base queda escondida detrás de los edificios
function placeName() {
  const sp = $('#bigname span'), tile = $('#tile'); if (!tile.offsetHeight) return;
  const roof = innerHeight * 1.03 - tile.offsetHeight, top = innerWidth < 700 ? 150 : 84;
  const fs = Math.min(innerWidth * (innerWidth < 700 ? 0.3 : 0.255), (roof - top) / 0.6);
  sp.style.fontSize = fs + 'px'; sp.style.top = (roof - 0.6 * fs - 0.05 * fs) + 'px';
}
buildSides(); placeName(); addEventListener('resize', () => { buildSides(); placeName(); });
$('.rowimg').addEventListener('load', placeName);
$('#winHit').addEventListener('pointerenter', () => tip('Entrar por la ventana ▸'));
$('#winHit').addEventListener('pointerleave', () => tip(''));
$('#winHit').addEventListener('click', () => { $('#sobre-mi').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); sfx('whoosh'); });
$('#wcats').addEventListener('click', (e) => { e.stopPropagation(); hearts(e.clientX, e.clientY); });
$('#wcats').addEventListener('pointerenter', () => tip('Los gatos de Silem'));
$('#wcats').addEventListener('pointerleave', () => tip(''));
let lampOn = true;
$('#lamp').addEventListener('click', () => { lampOn = !lampOn; $('#lamp').classList.toggle('off', !lampOn); sfx(lampOn ? 'blip' : 'tick'); });
$('#lamp').addEventListener('pointerenter', () => tip('Prender o apagar el farol')); $('#lamp').addEventListener('pointerleave', () => tip(''));

// estrellas que titilan y fugaces al hacer clic en el cielo
const sc = $('#stars'), sg = sc.getContext('2d'); let stars = [], shooting = [];
function sizeStars() { sc.width = Math.ceil(innerWidth / 3); sc.height = Math.ceil(innerHeight / 3); stars = Array.from({ length: 90 }, () => ({ x: Math.random() * sc.width, y: Math.random() * sc.height * 0.45, p: Math.random() * 6, s: Math.random() < .2 ? 2 : 1 })); }
sizeStars(); addEventListener('resize', sizeStars);
stage.addEventListener('click', (e) => { if (e.target.closest('a, button, img.px.wcats') || e.clientY > innerHeight * 0.5) return; shooting.push({ x: e.clientX / 3, y: e.clientY / 3, t: 0 }); sfx('reveal'); toast('✦ Deseo pedido', e.clientX, e.clientY); });

let origin = null;
addEventListener('resize', () => { origin = null; });
function heroLoop(now) {
  requestAnimationFrame(heroLoop);
  nx += ((mx / innerWidth - 0.5) - nx) * 0.06; ny += ((my / innerHeight - 0.5) - ny) * 0.06;
  const r = hero.getBoundingClientRect();
  if (r.bottom < 0) return;
  const p = Math.min(1, Math.max(0, -r.top / Math.max(1, hero.offsetHeight - innerHeight)));
  const e = p * p * (3 - 2 * p);
  // punto de fuga: el centro de la ventana, medido sin transformaciones
  if (!origin || origin.w !== innerWidth || origin.h !== innerHeight) {
    const st = $('#street'); const prev = st.style.transform; st.style.transform = 'none';
    const w = $('#winHit').getBoundingClientRect(), s = stage.getBoundingClientRect();
    origin = { x: w.left + w.width / 2 - s.left, y: w.top + w.height / 2 - s.top, w: innerWidth, h: innerHeight }; st.style.transform = prev;
  }
  const ox = origin.x, oy = origin.y;
  const zoom = { 6: 1 + e * 0.25, 10: 1 + e * 0.6, 12: 1 + e * 0.9, 16: 1 + e * e * 9, 34: 1 + e * 3 };
  layers.forEach(({ el, d }) => {
    const tx = -nx * d * (reduced ? 0 : 1), ty = -ny * d * 0.6 * (reduced ? 0 : 1);
    el.style.transformOrigin = `${ox}px ${oy}px`;
    el.style.transform = `translate(${tx}px, ${ty}px) scale(${zoom[d] || 1})`;
  });
  $('.fg', stage).style.opacity = 1 - e * 1.4;
  $('#heroCopy').style.opacity = 1 - p * 3; $('#heroCopy').style.transform = `translateY(${-p * 120}px)`;
  $('#heroMeta').style.opacity = 1 - p * 4; $('#heroMeta').style.transform = `translateY(${p * 80}px)`;
  $('#vname').style.opacity = 1 - p * 3; $('#bigname').style.opacity = Math.max(0, 1 - p * 3.2);
  stage.style.setProperty('--fade', Math.max(0, (e - 0.8) / 0.2));
  // estrellas
  sg.clearRect(0, 0, sc.width, sc.height);
  const t = now / 1000;
  stars.forEach(s => { sg.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.3 + s.p)); sg.fillStyle = '#dfe8ff'; sg.fillRect(s.x | 0, s.y | 0, s.s, s.s); });
  shooting = shooting.filter(s => (s.t += 0.02) < 1); shooting.forEach(s => { sg.globalAlpha = 1 - s.t; sg.fillStyle = '#fff'; for (let k = 0; k < 12; k++) sg.fillRect((s.x + s.t * 90 - k * 2) | 0, (s.y + s.t * 35 - k * 0.8) | 0, 1, 1); });
  if (Math.random() < 0.002) shooting.push({ x: Math.random() * sc.width * 0.6, y: Math.random() * sc.height * 0.2, t: 0 });
  sg.globalAlpha = 1;
}
requestAnimationFrame(heroLoop);

// ---------- sobre mí: el cuarto ----------
const hsBox = $('#hotspots');
HOTSPOTS.forEach(h => {
  const b = document.createElement('button'); b.type = 'button'; b.className = 'hs' + (h.u > .62 ? ' rt' : h.u < .38 ? ' lt' : ''); b.style.left = h.u * 100 + '%'; b.style.top = h.v * 100 + '%'; b.setAttribute('aria-label', h.t);
  b.innerHTML = `<i></i><span class="hs-tip"><b>${h.t}</b><span class="h">${h.h}</span><span class="e">${h.e}</span></span>`;
  b.addEventListener('click', () => { $$('.hs').forEach(x => x !== b && x.classList.remove('open')); b.classList.toggle('open'); sfx('blip');
    if (h.go === 'projects') setTimeout(() => $('#proyectos').scrollIntoView({ behavior: 'smooth' }), 500);
    if (h.page === 'stack') setTimeout(() => { $('#proyectos').scrollIntoView({ behavior: 'smooth' }); os && os.launch('stack'); }, 500); });
  hsBox.appendChild(b);
});
$('#roomCats').addEventListener('click', (e) => hearts(e.clientX, e.clientY));
const room = $('#room'), tilt = $('#roomTilt');
room.addEventListener('pointermove', (e) => { if (reduced) return; const r = room.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; tilt.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`; });
room.addEventListener('pointerleave', () => { tilt.style.transform = ''; });

// ---------- proyectos: SilemOS y tarjetas ----------
let os = null;
const host = (u) => { try { return new URL(u).host.replace(/^www\./, ''); } catch { return 'localhost'; } };
function renderCards() {
  $('#cards').innerHTML = PROJECTS.map((p, i) => `<article class="case">
    <div class="case-shot"><div class="bframe"><div class="bbar"><i></i><i></i><i></i><span>${p.live ? host(p.live) : 'github.com/SilemNabib'}</span></div>
      <button type="button" class="card-img" data-open="${i}" aria-label="Abrir ${p.title} en SilemOS"><img src="shots/${p.shots[0]}.jpg" alt="Captura de ${p.title}" loading="lazy"><span>▶ Abrir en SilemOS</span></button></div></div>
    <div class="case-b"><p class="case-n">P/${String(i + 1).padStart(2, '0')}</p><p class="card-k">${p.kind} · ${p.year}</p><h3>${p.title}</h3><p class="card-t">${mode === 'eng' ? p.e : p.h}</p>
    <dl class="cstats">${p.stats.map(([n, l]) => `<div><dt>${n}</dt><dd>${l}</dd></div>`).join('')}</dl>
    <dl class="cmeta"><div><dt>Rol</dt><dd>${p.role}</dd></div><div><dt>Con</dt><dd>${p.chips.join(' · ')}</dd></div></dl>
    <div class="card-a"><button type="button" class="pxbtn sm gold" data-open="${i}"><span>▶</span>Abrir aquí</button>${p.live ? `<a class="pxbtn sm" href="${p.live}" target="_blank" rel="noopener">En vivo ↗</a>` : ''}<a class="pxbtn sm" href="${p.repo}" target="_blank" rel="noopener">&lt;/&gt; Código</a></div></div></article>`).join('');
  $$('#cards [data-open]').forEach(b => b.addEventListener('click', () => openInOS(+b.dataset.open)));
  reveal($$('#cards .case'));
}
function openInOS(i) { $('#os').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' }); setTimeout(() => os && os.openProject(i), 450); }

// ---------- lo que hago: cifras y capacidades ----------
$('#bento').innerHTML = NUMBERS.map(x => `<div class="num${x.big ? ' big' : ''}"><b data-n="${x.n}">${x.n}</b><span>${x.l}</span>${x.big ? '<img src="img/cats.png" alt="" class="px">' : ''}</div>`).join('');
function renderCaps() {
  $('#caps').innerHTML = CAPS.map((c, i) => `<li><button type="button" class="cap" data-i="${i}">
    <span class="cap-n">0${i + 1}</span><span class="cap-b"><b>${c.t}</b><span class="cap-t">${mode === 'eng' ? c.e : c.h}</span><span class="cap-tags">${c.tags.map(t => `<i>${t}</i>`).join('')}</span></span>
    <span class="cap-p"><small>LA PRUEBA</small>${c.proof}<em>${c.go ? 'Ver dónde ▸' : 'Abrir el proyecto ▸'}</em></span></button></li>`).join('');
  $$('#caps .cap').forEach(b => b.addEventListener('click', () => { const c = CAPS[+b.dataset.i]; sfx('blip'); if (c.go) $('#' + c.go).scrollIntoView({ behavior: 'smooth' }); else openInOS(c.open); }));
}
renderCaps();
// vista previa que sigue al cursor sobre la lista de capacidades
const prev = document.createElement('div'); prev.className = 'capprev'; prev.innerHTML = '<img alt="">'; document.body.appendChild(prev);
let pvx = 0, pvy = 0, ptx = 0, pty = 0, pOn = false;
const capImg = (c) => c.go ? 'img/int-methodus.png' : `shots/${PROJECTS[c.open].shots[0]}.jpg`;
$('#caps').addEventListener('pointerover', (e) => { const b = e.target.closest('.cap'); if (!b || mobile) return; prev.querySelector('img').src = capImg(CAPS[+b.dataset.i]); prev.classList.add('on'); pOn = true; });
$('#caps').addEventListener('pointerleave', () => { prev.classList.remove('on'); pOn = false; });
addEventListener('pointermove', (e) => { ptx = e.clientX; pty = e.clientY; }, { passive: true });
(function pv() { requestAnimationFrame(pv); if (!pOn && !prev.classList.contains('on')) return; const dx = ptx - pvx; pvx += dx * 0.14; pvy += (pty - pvy) * 0.14; prev.style.transform = `translate(${pvx + 70}px, ${pvy - 150}px) rotate(${Math.max(-8, Math.min(8, dx * 0.08))}deg)`; })();
// cifras que cuentan al aparecer
const countIO = new IntersectionObserver((es) => es.forEach(e => { if (!e.isIntersecting) return; countIO.unobserve(e.target);
  const el = e.target, raw = el.dataset.n, m = raw.match(/^([\d.,]+)(.*)$/); if (!m || reduced) return;
  const dec = (m[1].split(',')[1] || '').length, target = parseFloat(m[1].replace(/\./g, '').replace(',', '.')), t0 = performance.now();
  const fmt = (v) => v.toLocaleString('es-CO', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + m[2];
  (function step(now) { const k = Math.min(1, (now - t0) / 1200), v = target * (1 - Math.pow(1 - k, 3)); el.textContent = fmt(v); if (k < 1) requestAnimationFrame(step); else el.textContent = raw; })(t0);
}), { threshold: 0.6 });
$$('#bento b').forEach(b => countIO.observe(b));

// ---------- cinta del stack ----------
const names = STACK.flatMap(c => c.items.map(i => i[0]));
const half = Math.ceil(names.length / 2);
const strip = (arr) => { const t = arr.map(n => `<span>${n}</span><i>✦</i>`).join(''); return `<div class="tk-in">${t}${t}</div>`; };
$('#tkA').innerHTML = strip(names.slice(0, half)); $('#tkB').innerHTML = strip(names.slice(half));

renderCards();
os = initOS({ sfx, mode, mobile });
let osOpened = false;
new IntersectionObserver((es) => { if (es[0].isIntersecting && !osOpened) { osOpened = true; os.launch('readme'); if (!mobile) setTimeout(() => os.launch('preanest'), 500); } }, { threshold: 0.35 }).observe($('#os'));

// ---------- experiencia: el planeta ----------
let jobSel = null;
$('#timeline').innerHTML = JOBS.map((j, k) => `<li><button type="button" data-k="${k}" style="--c:${j.color}"><time>${j.when}</time><b>${j.title}</b><span>${j.role}</span></button></li>`).join('');
function showJob(k) {
  jobSel = k; const j = JOBS[k];
  $('#job').innerHTML = `<div class="job-img"><img src="img/int-${j.id}.png" alt="" class="px"><span class="neon" style="--c:${j.color}">${j.sign}</span></div>
    <p class="tag">${j.when}</p><h3 class="h3">${j.title}</h3><p class="job-role">${j.role}</p>
    <p class="job-t">${mode === 'eng' ? j.e : j.h}</p><p class="gain"><b>LO QUE GANA TU EQUIPO</b>${j.gain}</p>
    <div class="job-nav"><button type="button" class="pxbtn sm" data-step="-1">◀ Anterior</button><button type="button" class="pxbtn sm gold" data-step="1">Siguiente ▶</button></div>`;
  $('#job').classList.remove('in'); void $('#job').offsetWidth; $('#job').classList.add('in');
  $$('#job [data-step]').forEach(b => b.addEventListener('click', () => planet && planet.select((k + +b.dataset.step + JOBS.length) % JOBS.length)));
  $$('#timeline button').forEach((b, i) => b.classList.toggle('on', i === k));
  sfx('arrive');
}
let planet = null;
$$('#timeline button').forEach(b => b.addEventListener('click', () => planet ? planet.select(+b.dataset.k) : showJob(+b.dataset.k)));
showJob(2);
new IntersectionObserver(async (es) => {
  if (!es[0].isIntersecting || planet) return;
  try {
    const { initPlanet } = await import('./planet.js?v=23');
    planet = await initPlanet({ canvas: $('#planet'), jobs: JOBS, reduced, onSelect: showJob, onHover: (j) => tip(j ? `Ver ${j.title} ▸` : '') });
    planet.select(jobSel ?? 2);
  } catch (err) { console.error(err); $('.planet-stage').classList.add('nogl'); }
}, { rootMargin: '300px' }).observe($('#planet'));

// ---------- contacto: la azotea ----------
const roof = $('#roofStage'), rlayers = $$('.ly', roof).map(el => ({ el, d: +el.dataset.d }));
function roofLoop() { requestAnimationFrame(roofLoop); const r = roof.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; rlayers.forEach(({ el, d }) => { el.style.translate = `${-nx * d}px ${-ny * d * 0.6}px`; }); }
requestAnimationFrame(roofLoop);
$('#ast').addEventListener('click', (e) => { sfx('reveal'); toast('«Lo esencial es invisible a los ojos.» Por eso hay que leer el código.', e.clientX, e.clientY); });
$('#ast').addEventListener('pointerenter', () => tip('Asteroide B-612')); $('#ast').addEventListener('pointerleave', () => tip(''));
$('#rcats').addEventListener('click', (e) => hearts(e.clientX, e.clientY));
let radioOn = false;
$('#radio').addEventListener('click', (e) => { radioOn = !radioOn; music(radioOn); $('#radio').classList.toggle('on', radioOn); toast(radioOn ? '♪ Radio prendida' : 'Radio apagada', e.clientX, e.clientY); });
$('#radio').addEventListener('pointerenter', () => tip(radioOn ? 'Apagar la radio' : '♪ Prender la radio')); $('#radio').addEventListener('pointerleave', () => tip(''));

// aparición al hacer scroll
reveal($$('.sec-head, .about-copy, .room, .monitor, .planet-wrap, .timeline, .contact-card, .bento, .caps'));
$('#copyMail').addEventListener('click', async (e) => { try { await navigator.clipboard.writeText('silemnabib@gmail.com'); toast('Correo copiado ✓', e.clientX, e.clientY); sfx('coin'); } catch { location.href = 'mailto:silemnabib@gmail.com'; } });
setMode(mode);
