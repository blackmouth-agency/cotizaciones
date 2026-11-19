// SilemOS: un escritorio retro donde cada proyecto se abre funcionando
import { PROJECTS, JOBS, STACK } from './data.js?v=23';

export function initOS({ sfx, mode, mobile }) {
  const desk = document.getElementById('desk'), winsEl = document.getElementById('wins'), iconsEl = document.getElementById('icons');
  const tasksEl = document.getElementById('tasks'), menu = document.getElementById('startMenu');
  let z = 10, count = 0;
  const open = new Map();

  // ---------- aplicaciones ----------
  const apps = [
    ...PROJECTS.map((p, i) => ({ id: p.id, name: ({ agenda: 'Agenda', preanest: 'Preanestesia', market: 'Market Basket', ceedi: 'CEEDi UAO', tribunal: 'Tribunal', refil: 'Refil' })[p.id] || p.title, thumb: `shots/${p.shots[0]}.s.jpg`, kind: 'project', p, i })),
    { id: 'readme', name: 'LEEME.txt', glyph: '¶', kind: 'readme' },
    { id: 'terminal', name: 'Terminal', glyph: '>_', kind: 'terminal' },
    { id: 'bugs', name: 'Bug Hunter', glyph: '🐞', kind: 'bugs' },
    { id: 'stack', name: 'Stack', glyph: '▦', kind: 'stack' },
    { id: 'cv', name: 'CV.pdf', glyph: 'PDF', kind: 'cv' },
  ];
  iconsEl.innerHTML = apps.map(a => `<button type="button" class="ico" data-app="${a.id}">
    <span class="ico-img">${a.thumb ? `<img src="${a.thumb}" alt="">` : `<b>${a.glyph}</b>`}</span><span class="ico-t">${a.name}</span></button>`).join('');
  iconsEl.querySelectorAll('.ico').forEach(b => {
    b.addEventListener('click', () => { iconsEl.querySelectorAll('.ico').forEach(x => x.classList.toggle('sel', x === b)); sfx('tick'); if (mobile || matchMedia('(pointer: coarse)').matches) launch(b.dataset.app); });
    b.addEventListener('dblclick', () => launch(b.dataset.app));
    b.addEventListener('keydown', (e) => { if (e.key === 'Enter') launch(b.dataset.app); });
  });
  menu.innerHTML = apps.map(a => `<button type="button" data-app="${a.id}">${a.thumb ? '★' : a.glyph} ${a.name}</button>`).join('');
  menu.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { launch(b.dataset.app); menu.hidden = true; }));
  document.getElementById('startBtn').addEventListener('click', (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; sfx('blip'); });
  document.addEventListener('click', (e) => { if (!e.target.closest('#startMenu')) menu.hidden = true; });
  const clock = document.getElementById('clock');
  const tick = () => { clock.textContent = new Intl.DateTimeFormat('es-CO', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Bogota' }).format(new Date()); };
  tick(); setInterval(tick, 20000);

  // ---------- ventanas ----------
  function launch(id) {
    const app = apps.find(a => a.id === id); if (!app) return;
    if (open.has(id)) { const w = open.get(id); w.el.hidden = false; focus(w); sfx('blip'); return; }
    const el = document.createElement('div'); el.className = 'win'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', app.name);
    const dw = desk.clientWidth, dh = desk.clientHeight;
    const big = app.kind === 'project' || app.kind === 'cv';
    const w = Math.min(dw - 24, big ? Math.max(560, dw * 0.68) : app.kind === 'bugs' ? 520 : 460);
    const h = Math.min(dh - 24, big ? Math.max(380, dh * 0.8) : app.kind === 'bugs' ? 400 : 340);
    const off = (count++ % 5) * 26;
    el.style.width = w + 'px'; el.style.height = h + 'px';
    el.style.left = Math.max(8, Math.min(dw - w - 8, (dw - w) / 2 + off - 40)) + 'px';
    el.style.top = Math.max(8, Math.min(dh - h - 8, 18 + off)) + 'px';
    const tabs = app.p && app.p.alt ? `<div class="wtabs"><button type="button" class="on" data-u="${app.p.url}">${app.p.altMain}</button><button type="button" data-u="${app.p.alt[1]}">${app.p.alt[0]}</button></div>` : '';
    el.innerHTML = `<div class="wbar"><span class="wt">${app.p ? '★ ' : ''}${app.name}</span>${tabs}
      <span class="wbtns">${app.p ? `<a href="${app.p.live || app.p.url}" target="_blank" rel="noopener" title="Abrir aparte">↗</a><a href="${app.p.repo}" target="_blank" rel="noopener" title="Código">&lt;/&gt;</a>` : ''}
      <button type="button" data-a="min" title="Minimizar">_</button><button type="button" data-a="max" title="Agrandar">□</button><button type="button" data-a="close" title="Cerrar">✕</button></span></div>
      <div class="wbody"></div>`;
    const body = el.querySelector('.wbody');
    fill(app, body, el);
    winsEl.appendChild(el);
    const rec = { el, app };
    open.set(id, rec);
    const t = document.createElement('button'); t.type = 'button'; t.className = 'task'; t.textContent = app.name; tasksEl.appendChild(t); rec.task = t;
    t.addEventListener('click', () => { if (el.hidden) { el.hidden = false; focus(rec); } else if (rec.top) { el.hidden = true; t.classList.remove('on'); } else focus(rec); sfx('tick'); });
    el.querySelectorAll('.wtabs button').forEach(b => b.addEventListener('click', () => { el.querySelectorAll('.wtabs button').forEach(x => x.classList.toggle('on', x === b)); el.querySelector('iframe').src = b.dataset.u; sfx('tick'); }));
    el.querySelector('[data-a=close]').addEventListener('click', () => close(id));
    el.querySelector('[data-a=min]').addEventListener('click', () => { el.hidden = true; t.classList.remove('on'); sfx('tick'); });
    el.querySelector('[data-a=max]').addEventListener('click', () => { el.classList.toggle('max'); sfx('tick'); });
    el.addEventListener('pointerdown', () => focus(rec));
    drag(el, el.querySelector('.wbar'));
    if (mobile || desk.clientWidth < 620) el.classList.add('max');
    el.classList.add('pop'); focus(rec); sfx(app.kind === 'project' ? 'coin' : 'blip');
    return rec;
  }
  function focus(rec) { open.forEach(r => { r.top = false; r.el.classList.remove('top'); r.task && r.task.classList.remove('on'); }); rec.el.style.zIndex = ++z; rec.top = true; rec.el.classList.add('top'); rec.task && rec.task.classList.add('on'); }
  function close(id) { const r = open.get(id); if (!r) return; r.el.remove(); r.task.remove(); open.delete(id); if (r.stop) r.stop(); sfx('blip'); }
  function drag(el, handle) {
    let sx, sy, ox, oy, on = false;
    handle.addEventListener('pointerdown', (e) => { if (e.target.closest('button, a') || el.classList.contains('max')) return; on = true; sx = e.clientX; sy = e.clientY; ox = el.offsetLeft; oy = el.offsetTop; handle.setPointerCapture(e.pointerId); el.classList.add('dragging'); });
    handle.addEventListener('pointermove', (e) => { if (!on) return; el.style.left = Math.max(-el.offsetWidth + 80, Math.min(desk.clientWidth - 80, ox + e.clientX - sx)) + 'px'; el.style.top = Math.max(0, Math.min(desk.clientHeight - 30, oy + e.clientY - sy)) + 'px'; });
    const end = () => { on = false; el.classList.remove('dragging'); };
    handle.addEventListener('pointerup', end); handle.addEventListener('pointercancel', end);
    handle.addEventListener('dblclick', (e) => { if (!e.target.closest('button, a')) el.classList.toggle('max'); });
  }

  // ---------- contenido de cada ventana ----------
  function fill(app, body, el) {
    if (app.kind === 'project') {
      body.innerHTML = `<iframe src="${app.p.url}" title="${app.p.title}" loading="lazy"></iframe>`;
      if (app.p.note) { const n = document.createElement('p'); n.className = 'wnote'; n.textContent = app.p.note; body.appendChild(n); setTimeout(() => n.classList.add('gone'), 4500); }
    } else if (app.kind === 'cv') {
      body.innerHTML = `<iframe src="files/Silem-Nabib-CV.pdf" title="Hoja de vida de Silem"></iframe>`;
    } else if (app.kind === 'readme') {
      body.innerHTML = `<div class="readme"><p class="rt">LEEME.txt</p>
        <p>Hola. Soy Silem Nabib, ingeniero de sistemas (ICESI, 10.º semestre) en Cali.</p>
        <p>En este computador están mis proyectos de verdad: no son capturas, se abren y se usan. Empieza por el <b>modelo preanestésico</b> o la <b>agenda de citas</b>.</p>
        <p>¿Prefieres escribir? Abre la <b>Terminal</b> y escribe <code>help</code>.</p>
        <p>¿Cinco minutos libres? <b>Bug Hunter</b>: aplasta los bugs antes de que lleguen a producción.</p></div>`;
    } else if (app.kind === 'stack') {
      body.innerHTML = `<div class="stackapp">${STACK.map(c => `<div class="scat"><b>${c.cat}</b><ul>${c.items.map(it => `<li title="${it[2]}"><span>${it[0]}</span><em>${it[3] || it[2]}</em></li>`).join('')}</ul></div>`).join('')}</div>`;
    } else if (app.kind === 'terminal') terminal(body, el);
    else if (app.kind === 'bugs') { const stop = bugs(body); setTimeout(() => { const r = open.get('bugs'); if (r) r.stop = stop; }); }
  }

  // ---------- terminal ----------
  function terminal(body) {
    body.innerHTML = `<div class="term"><div class="tout"></div><label class="tline"><span>silem@b612:~$</span><input type="text" autocomplete="off" spellcheck="false" aria-label="Comando"></label></div>`;
    const out = body.querySelector('.tout'), inp = body.querySelector('input'); const hist = []; let hi = 0;
    const print = (t, cls = '') => { const p = document.createElement('pre'); p.className = cls; p.textContent = t; out.appendChild(p); out.scrollTop = out.scrollHeight; };
    print('SilemOS 1.0 · escribe "help" para ver los comandos.', 'dim');
    const cmds = {
      help: () => 'Comandos:\n  whoami        quién soy\n  ls            mis proyectos\n  open <n>      abre un proyecto (ej: open 2)\n  stack         lo que sé usar\n  experiencia   dónde he trabajado\n  contacto      cómo escribirme\n  cv            abre la hoja de vida\n  jugar         Bug Hunter\n  cat gatos.txt …\n  clear         limpia',
      whoami: () => 'Silem Nabib Villa Contreras\nIngeniero de sistemas (ICESI, 10.º semestre) · Cali, Colombia\nBackend: Java, Spring Boot, PostgreSQL · también Next.js, NestJS, Python.',
      ls: () => PROJECTS.map((p, i) => `  ${i + 1}. ${p.title}  (${p.kind})`).join('\n'),
      stack: () => STACK.map(c => `${c.cat.padEnd(9)} ${c.items.map(i => i[0]).join(', ')}`).join('\n'),
      experiencia: () => JOBS.map(j => `${j.when.padEnd(20)} ${j.title} · ${j.role}`).join('\n'),
      contacto: () => 'correo    silemnabib@gmail.com\nlinkedin  linkedin.com/in/silem-nabib\ngithub    github.com/SilemNabib',
      cv: () => { launch('cv'); return 'Abriendo CV.pdf…'; },
      jugar: () => { launch('bugs'); return 'Cargando Bug Hunter…'; },
      date: () => new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
      'cat gatos.txt': () => ' /\\_/\\   /\\_/\\\n( -.- ) ( ^.^ )\n > ^ <   > ^ <\nSon dos. El negro manda.',
      'sudo contratar': () => { sfx('reveal'); return '[sudo] contraseña: ********\nPermiso concedido. Escríbele: silemnabib@gmail.com ✓'; },
      clear: () => { out.innerHTML = ''; return null; },
    };
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') { hi = Math.max(0, hi - 1); inp.value = hist[hi] || ''; e.preventDefault(); return; }
      if (e.key === 'ArrowDown') { hi = Math.min(hist.length, hi + 1); inp.value = hist[hi] || ''; e.preventDefault(); return; }
      if (e.key !== 'Enter') { sfx('type'); return; }
      const v = inp.value.trim(); inp.value = ''; if (!v) return;
      hist.push(v); hi = hist.length;
      print('silem@b612:~$ ' + v, 'cmd');
      const m = v.match(/^open\s+(\d+)$/i);
      let r;
      if (m) { const p = PROJECTS[+m[1] - 1]; if (p) { launch(p.id); r = 'Abriendo ' + p.title + '…'; } else r = 'No existe ese número. Prueba "ls".'; }
      else if (cmds[v.toLowerCase()]) r = cmds[v.toLowerCase()]();
      else if (v.startsWith('sudo')) r = 'Buen intento. Prueba "sudo contratar".';
      else r = `comando no encontrado: ${v}. Escribe "help".`;
      if (r) print(r);
    });
    body.addEventListener('click', () => inp.focus());
    setTimeout(() => inp.focus({ preventScroll: true }), 50);
  }

  // ---------- Bug Hunter ----------
  function bugs(body) {
    body.innerHTML = `<div class="bugs"><canvas width="240" height="150"></canvas><div class="bhud"><span class="bs">0</span><span class="bl">♥♥♥</span><span class="bb">mejor: 0</span></div><div class="bmsg"><b>BUG HUNTER</b><span>Aplasta los bugs antes de que lleguen a producción.</span><button type="button" class="pxbtn gold sm">▶ Jugar</button></div></div>`;
    const cv = body.querySelector('canvas'), g = cv.getContext('2d');
    const msg = body.querySelector('.bmsg'), sEl = body.querySelector('.bs'), lEl = body.querySelector('.bl'), bEl = body.querySelector('.bb');
    let best = 0; try { best = +localStorage.getItem('silem-bugs') || 0; } catch {}
    bEl.textContent = 'mejor: ' + best;
    const KILLS = ['NullPointerException', 'off-by-one', 'race condition', 'N+1 query', 'CORS', 'timeout', 'deadlock', 'undefined is not a function', 'memory leak', 'zona horaria'];
    let bugsA = [], splats = [], texts = [], score = 0, lives = 3, run = false, t = 0, spawn = 0, raf = 0, last = 0;
    const draw = (b) => {
      const c = b.c; g.fillStyle = c; g.fillRect(b.x - 3, b.y - 2, 6, 5); g.fillStyle = '#111'; g.fillRect(b.x - 1, b.y - 2, 1, 5); g.fillRect(b.x - 2, b.y - 4, 4, 2);
      const leg = Math.floor(t * 10) % 2; g.fillStyle = '#111';
      for (const s of [-1, 1]) { g.fillRect(b.x + s * 4, b.y - 1 + leg, 1, 1); g.fillRect(b.x + s * 4, b.y + 2 - leg, 1, 1); }
    };
    const loop = (now) => {
      raf = requestAnimationFrame(loop); const dt = Math.min(0.05, (now - last) / 1000 || 0); last = now; t += dt;
      g.fillStyle = '#0d1020'; g.fillRect(0, 0, 240, 150);
      for (let y = 0; y < 150; y += 10) { g.fillStyle = '#141a33'; g.fillRect(0, y, 240, 1); }
      g.fillStyle = '#e2566a'; g.fillRect(0, 140, 240, 2); g.fillStyle = '#e2566a'; g.font = '8px "Silkscreen", monospace'; g.fillText('PRODUCCIÓN', 4, 149);
      if (run) {
        spawn -= dt; if (spawn < 0) { spawn = Math.max(0.35, 1.3 - t * 0.02); bugsA.push({ x: 10 + Math.random() * 220, y: -4, v: 14 + Math.random() * 10 + t * 0.6, w: Math.random() * 6, c: ['#9dff8a', '#ffd27a', '#7cc4ff', '#ff8ac8'][Math.floor(Math.random() * 4)] }); }
        bugsA.forEach(b => { b.y += b.v * dt; b.x += Math.sin(t * 3 + b.w) * 10 * dt; });
        const lost = bugsA.filter(b => b.y > 140); if (lost.length) { lives -= lost.length; sfx('whoosh'); bugsA = bugsA.filter(b => b.y <= 140); lEl.textContent = '♥'.repeat(Math.max(0, lives)); if (lives <= 0) over(); }
      }
      bugsA.forEach(draw);
      splats = splats.filter(s => (s.t -= dt) > 0); splats.forEach(s => { g.fillStyle = s.c; g.globalAlpha = s.t; g.fillRect(s.x - 4, s.y - 1, 8, 2); g.fillRect(s.x - 1, s.y - 4, 2, 8); g.globalAlpha = 1; });
      texts = texts.filter(s => (s.t -= dt) > 0); texts.forEach(s => { g.fillStyle = '#ffe279'; g.globalAlpha = Math.min(1, s.t); g.font = '7px "Silkscreen", monospace'; g.fillText(s.s, Math.min(240 - g.measureText(s.s).width - 2, s.x), s.y - (1 - s.t) * 10); g.globalAlpha = 1; });
    };
    const hit = (e) => {
      if (!run) return; const r = cv.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width * 240, y = (e.clientY - r.top) / r.height * 150;
      const i = bugsA.findIndex(b => Math.abs(b.x - x) < 8 && Math.abs(b.y - y) < 8);
      if (i >= 0) { const b = bugsA.splice(i, 1)[0]; score++; sEl.textContent = score; splats.push({ x: b.x, y: b.y, c: b.c, t: 0.6 }); texts.push({ x: b.x - 10, y: b.y, s: KILLS[Math.floor(Math.random() * KILLS.length)] + ' ✓', t: 1.2 }); sfx('blip'); }
    };
    const over = () => { run = false; bugsA = []; if (score > best) { best = score; try { localStorage.setItem('silem-bugs', best); } catch {} } bEl.textContent = 'mejor: ' + best;
      msg.innerHTML = `<b>FIN DEL TURNO</b><span>Aplastaste ${score} bugs. ${score >= 25 ? 'Nivel senior.' : score >= 12 ? 'Pasa a revisión de código.' : 'Producción sobrevivió… más o menos.'}</span><button type="button" class="pxbtn gold sm">↻ Otra vez</button>`; msg.hidden = false; bindStart(); sfx('reveal'); };
    const start = () => { score = 0; lives = 3; t = 0; spawn = 0.4; bugsA = []; sEl.textContent = 0; lEl.textContent = '♥♥♥'; msg.hidden = true; run = true; sfx('coin'); };
    const bindStart = () => msg.querySelector('button').addEventListener('click', start);
    bindStart(); cv.addEventListener('pointerdown', hit);
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }

  return { launch, openProject: (i) => launch(PROJECTS[i].id), apps };
}
