/* Semply · plan de estudios: mapa del programa, la hora Semply, vitrina de proyectos, visor de los 12 módulos y cierre.
   Datos: ../assets/js/plan.js (window.SMP_MODULOS) y ../assets/js/comun.js (window.SMP: contacto y programa). */
(function () {
  var S = window.SMP || {}, M = window.SMP_MODULOS || [];
  var T = ['rec', 'live', 'prac', 'eval'];
  var TN = { rec: 'Grabado', live: 'En vivo', prac: 'Práctica', eval: 'Evaluación' };
  var BRK = '<svg viewBox="0 0 100 90" aria-hidden="true"><use href="#brk"/></svg>';
  var FLECHA = '<svg viewBox="0 0 100 90" aria-hidden="true"><use href="#brk" transform="rotate(90 50 45)"/></svg>';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function sum(a) { return a.reduce(function (x, y) { return x + y; }, 0); }
  function num(v) { return String(Math.round(v * 10) / 10).replace('.', ','); }
  function mil(v) { return String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function dos(n) { return (n < 10 ? '0' : '') + n; }
  // colores por módulo, en la secuencia rojo, amarillo, gris de la marca
  var TEMAS = ['th-ink', 'th-red', 'th-yel'], COL = { 'th-red': ['#F10E3B', '#fff'], 'th-yel': ['#FFC225', '#373435'], 'th-ink': ['#373435', '#fff'] };
  function tema(n) { return TEMAS[n % 3]; }
  function vars(n) { var c = COL[tema(n)]; return '--c:' + c[0] + ';--fc:' + c[1]; }
  function porN(n) { return M.filter(function (m) { return m.n === n; })[0]; }

  /* ---------- estallidos ---------- */
  function burst(n, r1, r2) { var p = []; for (var i = 0; i < n * 2; i++) { var a = Math.PI * i / n - Math.PI / 2, r = i % 2 ? r2 : r1; p.push((Math.cos(a) * r).toFixed(2) + ',' + (Math.sin(a) * r).toFixed(2)); } return p.join(' '); }
  function pintarBursts(raiz) { $$('[data-burst]', raiz).forEach(function (el) { var n = +el.getAttribute('data-burst'), pg = el.querySelector('polygon'); if (pg && !pg.getAttribute('points')) pg.setAttribute('points', burst(n, 50, n > 20 ? 42 : 37)); }); }
  var dpts = burst(14, 50, 36);
  function sello(txt, n) { return '<div class="seal"><svg viewBox="-50 -50 100 100"><polygon points="' + burst(n || 18, 50, 40) + '"/></svg><span>' + txt + '</span></div>'; }

  /* ---------- mapa del programa ---------- */
  var ruta = $('#ruta');
  ruta.innerHTML = [1, 2].map(function (s) {
    var ms = M.filter(function (m) { return m.s === s; });
    return '<div class="sem"><div class="sem-top"><h3>Semestre ' + (s === 1 ? 'I' : 'II') + '</h3><span>Módulos ' + dos(ms[0].n) + ' a ' + dos(ms[ms.length - 1].n) + ' · ' + mil(ms.length * 100) + ' horas</span></div><div class="track"><div class="fill"></div>' +
      ms.map(function (m, i) {
        return '<button class="stop" data-n="' + m.n + '" style="--i:' + i + ';' + vars(m.n) + '"><span class="num"><svg viewBox="-50 -50 100 100"><polygon points="' + burst(12 + (m.n % 3) * 3, 50, 40) + '"/></svg><b>' + dos(m.n) + '</b></span><h4>' + esc(m.corto) + '</h4><p>' + esc(m.lema) + '</p><span class="go">Ver módulo' + FLECHA + '</span></button>';
      }).join('') + '</div></div>';
  }).join('') +
    '<a class="ruta-fin" href="#titulo">' + sello('1.200<small>horas</small>', 20) + '<div><b>Técnico Laboral en Marketing Digital e IA</b><small>Al aprobar los 12 módulos recibes tu título. Cada módulo además te certifica por competencias.</small></div></a>';
  $$('.stop', ruta).forEach(function (b) { b.addEventListener('click', function (e) { elegir(+b.dataset.n, { ir: true, ev: e }); }); });

  /* ---------- tipos de hora y reparto ---------- */
  var base = M[0] ? M[0].horas : [15, 20, 50, 15];
  var TIPOS = [
    ['Clases grabadas', 'Cápsulas de 8 a 10 minutos con la teoría, casos reales y demostraciones. Las ves a tu ritmo.'],
    ['Sesiones en vivo', 'Talleres prácticos con el docente, 2 horas por unidad: dudas, co-creación con IA y tu proyecto.'],
    ['Práctica y Lab IA', 'Trabajo autónomo, de campo y en laboratorio de IA. Aquí construyes el entregable de cada unidad.'],
    ['Evaluación y feedback', 'Revisión de cada entregable con rúbrica y sustentación final ante el panel de mentores.']
  ];
  $('#types').innerHTML = TIPOS.map(function (t, k) { return '<article class="type rv"><i class="t-' + T[k] + '"></i><span class="pctt">' + base[k] + '<small>%</small></span><h3>' + t[0] + '</h3><p>' + t[1] + '</p></article>'; }).join('');
  var total = [0, 0, 0, 0]; M.forEach(function (m) { m.horas.forEach(function (v, k) { total[k] += v; }); });
  var bb = $('#bigbar').children, note = $('#splitnote');
  function reparto(k) {
    var t = k === 12 ? total : base;
    for (var i = 0; i < 4; i++) { bb[i].style.flexGrow = t[i]; bb[i].textContent = mil(t[i]) + ' h'; bb[i].title = TN[T[i]] + ': ' + mil(t[i]) + ' h'; }
    note.innerHTML = k === 12
      ? '<b>Todo el programa:</b> ' + mil(total[0]) + ' h grabadas, ' + mil(total[1]) + ' h en vivo, ' + mil(total[2]) + ' h de práctica y ' + mil(total[3]) + ' h de evaluación y feedback. Total ' + mil(sum(total)) + ' h.'
      : '<b>Cada módulo:</b> ' + base[0] + ' h grabadas (' + base[0] + ' %), ' + base[1] + ' h en vivo (' + base[1] + ' %), ' + base[2] + ' h de práctica (' + base[2] + ' %) y ' + base[3] + ' h de evaluación y feedback (' + base[3] + ' %).';
  }
  $$('#split .seg button').forEach(function (b) { b.addEventListener('click', function () { $$('#split .seg button').forEach(function (x) { x.setAttribute('aria-selected', x === b); }); reparto(+b.dataset.k); }); });
  reparto(1);

  /* ---------- una unidad típica ---------- */
  var hours = $('#hours');
  ['rec', 'half', 'live', 'live', 'prac', 'prac', 'prac', 'prac', 'prac', 'eval'].forEach(function (k) { var d = document.createElement('div'); if (k === 'half') { d.className = 'half'; d.dataset.k = 'rec prac'; } else { d.className = 't-' + k; d.dataset.k = k; } hours.appendChild(d); });
  $$('#wkeys button').forEach(function (b) {
    function on() { var cur = b.dataset.k; hours.classList.add('dim'); $$('div', hours).forEach(function (d) { d.classList.toggle('lit', d.dataset.k.split(' ').indexOf(cur) > -1); }); $$('#wkeys button').forEach(function (x) { x.classList.toggle('on', x === b); }); }
    b.addEventListener('mouseenter', on); b.addEventListener('focus', on); b.addEventListener('click', on);
  });
  $('#wkeys').addEventListener('mouseleave', function () { hours.classList.remove('dim'); $$('.lit', hours).forEach(function (d) { d.classList.remove('lit'); }); $$('#wkeys button').forEach(function (x) { x.classList.remove('on'); }); });

  /* ---------- vitrina de proyectos ---------- */
  $('#shelf').innerHTML = M.map(function (m, i) {
    return '<button class="proj rv" data-n="' + m.n + '" style="' + vars(m.n) + ';animation-delay:' + (i % 6 * 50) + 'ms"><span class="pn">' + dos(m.n) + '</span><span class="pt">' + esc(m.proyecto) + '</span><span class="pm">' + esc(m.corto) + '</span><svg class="pl" viewBox="0 0 100 90" aria-hidden="true"><use href="#brk"/></svg></button>';
  }).join('');
  $$('#shelf .proj').forEach(function (b) { b.addEventListener('click', function (e) { elegir(+b.dataset.n, { ir: true, ev: e }); }); });

  /* ---------- selector de módulos ---------- */
  var picker = $('#picker'), stage = $('#stage'), actual = 0;
  picker.innerHTML = '<div class="picker-in">' + [1, 2].map(function (s) {
    return '<span class="lab">Semestre ' + (s === 1 ? 'I' : 'II') + '</span>' + M.filter(function (m) { return m.s === s; }).map(function (m) {
      return '<button role="tab" data-n="' + m.n + '" aria-selected="false" style="' + vars(m.n) + '" title="' + esc(m.corto) + '">' + dos(m.n) + '<span>' + esc(m.corto) + '</span></button>';
    }).join('');
  }).join('<i class="sep" aria-hidden="true"></i>') + '</div>';
  $$('button', picker).forEach(function (b) { b.addEventListener('click', function (e) { elegir(+b.dataset.n, { ev: e, ir: stage.getBoundingClientRect().top < 0 }); }); });

  /* ---------- escenario del módulo ---------- */
  function piezasL(n) {
    var h = '';
    for (var i = 0; i < 5; i++) { var s = 40 + ((n * 37 + i * 53) % 70); h += '<svg viewBox="0 0 100 90" style="width:' + s + 'px;height:' + s + 'px;left:' + ((n * 17 + i * 23) % 92) + '%;top:' + ((n * 29 + i * 41) % 80) + '%;--r:' + ((n * 61 + i * 97) % 360) + 'deg" data-f="' + (0.04 + i % 3 * 0.04) + '"><use href="#brk"/></svg>'; }
    return '<div class="l-pieces" aria-hidden="true">' + h + '</div>';
  }
  function render(m) {
    var th = tema(m.n), U = m.unidades, ant = porN(m.n - 1), sig = porN(m.n + 1);
    stage.className = 'stage ' + th;
    stage.innerHTML =
      '<section class="mod-hero" id="m' + m.n + '"><div class="wipe"></div>' + piezasL(m.n) + '<div class="wrap"><div>' +
        '<span class="eyebrow">' + BRK.replace('<svg', '<svg style="width:18px;height:16px"') + 'Módulo ' + dos(m.n) + ' · Semestre ' + (m.s === 1 ? 'I' : 'II') + '</span>' +
        '<h2>' + esc(m.corto) + '</h2>' +
        '<p class="lede">' + esc(m.lema) + '</p>' +
        '<div class="chips"><span class="chip">100 horas</span><span class="chip">10 unidades</span><span class="chip">' + m.horas[1] + ' h en vivo</span><span class="chip">' + m.horas[2] + ' % práctica</span></div>' +
        '<div class="tags">' + m.enfoque.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' +
      '</div><div class="mod-num" aria-hidden="true">' + dos(m.n) + '</div></div></section>' +
      '<section class="mod-body"><div class="wrap">' +
        '<div class="profile" data-profile></div>' +
        '<div class="malla" data-malla></div>' +
        '<div class="proyecto rv">' + sello(dos(m.n), 16) + '<div><small>El proyecto del módulo</small><h3>' + esc(m.proyecto) + '</h3><p>Lo construyes unidad por unidad sobre tu negocio real y lo sustentas ante el panel de mentores al cerrar el módulo.</p>' +
          (m.certificacion ? '<span class="cert">' + BRK + esc(m.certificacion) + '</span>' : '') + '</div></div>' +
        '<div class="modnav"><button data-ir="' + (ant ? ant.n : '') + '"' + (ant ? '' : ' disabled') + '><small>Módulo anterior</small><b>' + (ant ? dos(ant.n) + ' · ' + esc(ant.corto) : '') + '</b></button>' +
          '<button data-ir="' + (sig ? sig.n : '') + '"' + (sig ? '' : ' disabled') + '><small>' + (sig ? 'Siguiente módulo' : '') + '</small><b>' + (sig ? dos(sig.n) + ' · ' + esc(sig.corto) : '') + '</b></button></div>' +
      '</div></section>';
    perfil($('[data-profile]', stage), m);
    malla($('[data-malla]', stage), U);
    $$('.modnav button', stage).forEach(function (b) { b.addEventListener('click', function (e) { if (b.dataset.ir) elegir(+b.dataset.ir, { ir: true, ev: e }); }); });
    observar($$('.rv', stage));
  }
  function perfil(host, m) {
    var tabs = [
      ['Para quién', function () { return '<p class="big">' + esc(m.paraQuien) + '</p>'; }],
      ['Lo que harás', function () { return '<p class="txt">' + esc(m.haras) + '</p>'; }],
      ['Qué necesitas', function () { return '<ul>' + m.necesitas.map(function (x, i) { return '<li style="animation-delay:' + (i * 50) + 'ms">' + esc(x) + '</li>'; }).join('') + '</ul>'; }],
      ['Herramientas', function () { return '<div class="tools">' + m.herramientas.map(function (x, i) { return '<span style="animation-delay:' + (i * 35) + 'ms">' + esc(x) + '</span>'; }).join('') + '</div>'; }],
      ['Las 100 horas', function () { return '<div class="hrows">' + m.horas.map(function (v, k) { return '<div class="hrow" style="animation-delay:' + (k * 60) + 'ms"><span class="hv"><i class="t-' + T[k] + '"></i>' + num(v) + ' h</span><div><b>' + esc(m.modalidades[k]) + '</b><p>' + esc(m.horasDesc[k]) + '</p></div></div>'; }).join('') + '</div>'; }]
    ];
    host.innerHTML = '<div class="ptabs" role="tablist" aria-label="Perfil del módulo">' + tabs.map(function (t, i) { return '<button role="tab" aria-selected="' + (i === 0) + '">' + t[0] + BRK + '</button>'; }).join('') + '</div><div class="ppanel" role="tabpanel"></div>';
    var panel = $('.ppanel', host), bs = $$('button', host);
    function show(i) { bs.forEach(function (b, j) { b.setAttribute('aria-selected', i === j); }); panel.innerHTML = tabs[i][1](); }
    bs.forEach(function (b, i) { b.addEventListener('click', function () { show(i); }); });
    show(0);
  }
  function malla(host, U) {
    host.innerHTML =
      '<div class="malla-head rv"><h3>Malla curricular</h3><p>Toca una unidad para ver de qué se trata, sus horas y lo que entregas. El ancho de cada bloque es proporcional a sus horas.</p></div>' +
      '<div class="ruler-wrap"><div class="ruler" role="tablist" aria-label="Unidades por horas">' + U.map(function (u, i) { return '<button role="tab" data-i="' + i + '" style="flex-grow:' + sum(u.h) + '" title="' + esc('U' + (i + 1) + ' · ' + u.t) + '"><b>U' + (i + 1) + '</b><small>' + num(sum(u.h)) + ' h</small></button>'; }).join('') + '</div>' +
      '<div class="ruler-scale">' + [0, 20, 40, 60, 80, 100].map(function (t) { return '<span>' + t + ' h</span>'; }).join('') + '</div></div>' +
      '<div class="unit"><div class="ulist" role="tablist" aria-label="Unidades">' + U.map(function (u, i) { return '<button role="tab" data-i="' + i + '"><span class="c">U' + (i + 1) + '</span><span class="n">' + esc(u.t) + '</span><span class="h">' + num(sum(u.h)) + ' h</span></button>'; }).join('') + '</div>' +
      '<div class="card" aria-live="polite"></div></div>';
    var card = $('.card', host), all = $$('[data-i]', host), idx = 0;
    function pintar(i, anim) {
      idx = i; var u = U[i], tot = sum(u.h), fin = i === U.length - 1;
      all.forEach(function (b) { b.setAttribute('aria-selected', +b.dataset.i === i); });
      card.innerHTML =
        '<div class="card-top"><div><span class="code">Unidad ' + (i + 1) + (fin ? ' · cierre del módulo' : '') + '</span><h4>' + esc(u.t) + '</h4></div><div class="hrs">' + num(tot) + ' h<small>de 100</small></div></div>' +
        '<div class="mini">' + u.h.map(function (v, k) { return v ? '<div class="t-' + T[k] + '" style="flex-grow:' + v + '"></div>' : ''; }).join('') + '</div>' +
        '<div class="mini-l">' + u.h.map(function (v, k) { return v ? '<span><i class="t-' + T[k] + '"></i>' + TN[T[k]] + ' ' + num(v) + ' h</span>' : ''; }).join('') + '</div>' +
        '<p class="ucont">' + esc(u.c) + '</p>' +
        '<div class="deliv"><div class="burst"><svg viewBox="-50 -50 100 100"><polygon points="' + dpts + '"/></svg><span>' + (fin ? '★' : '✓') + '</span></div><div><b>' + (fin ? 'Entregas y sustentas' : 'Entregable') + '</b><p>' + esc(u.e) + '</p></div></div>' +
        '<div class="nextprev"><button data-go="-1"' + (i === 0 ? ' disabled' : '') + '>Anterior</button><button data-go="1"' + (fin ? ' disabled' : '') + '>Siguiente unidad</button></div>';
      if (anim) { card.classList.remove('swap'); void card.offsetWidth; card.classList.add('swap'); }
      $$('[data-go]', card).forEach(function (b) { b.addEventListener('click', function () { pintar(idx + (+b.dataset.go), true); }); });
    }
    all.forEach(function (b) { b.addEventListener('click', function () { pintar(+b.dataset.i, true); }); });
    pintar(0, false);
  }

  function topStage() { return stage.getBoundingClientRect().top + scrollY - 64 - picker.offsetHeight + 1; }
  function elegir(n, o) {
    o = o || {}; var m = porN(n); if (!m) return;
    var cambio = n !== actual; actual = n;
    $$('button', picker).forEach(function (b) { var on = +b.dataset.n === n; b.setAttribute('aria-selected', on); if (on && b.scrollIntoView) { var pi = b.parentNode; pi.scrollTo({ left: b.offsetLeft - pi.clientWidth / 2 + b.offsetWidth / 2, behavior: reduce ? 'auto' : 'smooth' }); } });
    if (cambio) {
      render(m);
      if (!reduce && o.anim !== false) {
        stage.classList.remove('swap'); void stage.offsetWidth; stage.classList.add('swap');
        var w = $('.wipe', stage), hero = $('.mod-hero', stage), r = hero.getBoundingClientRect();
        var x = o.ev && o.ev.clientX ? Math.min(Math.max(o.ev.clientX - r.left, 0), r.width) : r.width / 2;
        w.style.setProperty('--wx', x + 'px'); w.style.setProperty('--wy', '0px');
        w.style.background = COL[tema(n)][0]; hero.style.background = COL[tema(prev)][0]; w.classList.add('go');
        setTimeout(function () { hero.style.background = ''; }, 820);
      }
      prev = n;
      if (history.replaceState) history.replaceState(null, '', '#m' + n);
    }
    if (o.ir) window.scrollTo({ top: topStage(), behavior: reduce ? 'auto' : 'smooth' });
    paralaje();
  }
  var prev = 1;

  // piezas en L del encabezado del módulo: se mueven a distinta velocidad con el scroll
  function paralaje() {
    var h = $('.mod-hero', stage); if (!h || reduce) return;
    var r = h.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    var c = r.top + r.height / 2 - innerHeight / 2;
    $$('.l-pieces svg', h).forEach(function (s) { s.style.setProperty('--y', (-c * parseFloat(s.dataset.f)).toFixed(1) + 'px'); });
  }

  /* ---------- certificación ---------- */
  ['sem1', 'sem2'].forEach(function (id, k) {
    $('#' + id).innerHTML = M.filter(function (m) { return m.s === k + 1; }).map(function (m) { return '<li><b>' + dos(m.n) + '</b><a href="#m' + m.n + '">' + esc(m.corto) + '</a></li>'; }).join('');
  });
  var P = S.PROGRAMA || {};
  if (P.cert) $('#cert-nombre').textContent = P.cert;
  $('#r-registro').textContent = P.registro ? 'Registrado ante la Secretaría de Educación de Yumbo: ' + P.registro + '.' : '';
  $('#r-licencia').textContent = P.licencia ? 'Semply es una institución de Educación para el Trabajo y el Desarrollo Humano. Licencia de funcionamiento: ' + P.licencia + '.' : '';
  $('#r-modalidad').textContent = P.metodologia ? P.metodologia + '. Jornadas ' + (P.jornadas || []).join(', ').toLowerCase().replace(/, ([^,]*)$/, ' y $1') + '.' : '';
  $('#legal').textContent = '© 2026 Semply SAS · ' + (P.nombre || '') + ' · ' + (P.registro || '');
  if (S.whatsapp) S.whatsapp();

  /* ---------- aparición, contadores y pesos ---------- */
  function contar(el) {
    var to = +el.dataset.count; if (reduce || to < 2) return;
    var t0 = null, f = el.hasAttribute('data-mil') ? mil : String;
    function paso(ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 1100); el.textContent = f(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(paso); }
    requestAnimationFrame(paso);
  }
  var io = 'IntersectionObserver' in window && !reduce ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return; var el = e.target; io.unobserve(el);
      if (el.classList.contains('rv') || el.classList.contains('sem')) el.classList.add('in');
      if (el.dataset.count) contar(el);
      if (el.id === 'weights') { el.classList.add('pending'); void el.offsetWidth; el.classList.remove('pending'); }
    });
  }, { threshold: 0.15 }) : null;
  function observar(els) {
    els.forEach(function (el, i) {
      if (!io) { el.classList.add('in'); return; }
      var r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) { el.classList.add('in'); return; }
      el.style.animationDelay = ((i % 4) * 70) + 'ms'; io.observe(el);
    });
  }
  $$('.sem').forEach(function (el) { if (io) io.observe(el); else el.classList.add('in'); });
  if (io) $$('[data-count]').forEach(function (el) { io.observe(el); });
  var w = $('#weights'); w.classList.remove('pending'); if (io && w.getBoundingClientRect().top > innerHeight) io.observe(w);

  /* ---------- enlaces internos ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var h = a.getAttribute('href'), mm = /^#m(\d+)$/.exec(h);
    if (mm) { e.preventDefault(); elegir(+mm[1], { ir: true, ev: e }); return; }
    var t = h.length > 1 && document.querySelector(h); if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: Math.max(0, t.getBoundingClientRect().top + scrollY - (t.id === 'inicio' ? 0 : 64)), behavior: reduce ? 'auto' : 'smooth' });
  });

  /* ---------- cierre: cinta, sellos y paralaje ---------- */
  (function () {
    var close = $('#cierre'), stamps = $('#stamps'), fin = $('#finale');
    var one = M.map(function (m) { return '<span>' + esc(m.corto) + BRK + '</span>'; }).join('') + '<span>Aprender es así de simple' + BRK + '</span>';
    $('#mq').innerHTML = one + one;
    var pal = [['var(--yellow)', 'var(--ink)'], ['#fff', 'var(--red)'], ['var(--ink)', 'var(--yellow)']];
    var txt = ['100 h', '¡Simple!', 'IA', 'SEO', 'ADS', 'GA4', 'CRO', '✓', '1.200 h', 'UX', '¡Así!'];
    var n = 0, live = [];
    function stamp(x, y, opt) {
      opt = opt || {}; var c = pal[n % 3], size = opt.size || Math.round(70 + Math.random() * 60);
      var d = document.createElement('div'); d.className = 'stamp';
      d.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + size + 'px;height:' + size + 'px;--r:' + (Math.random() * 40 - 20).toFixed(1) + 'deg';
      d.innerHTML = '<svg viewBox="-50 -50 100 100"><polygon fill="' + c[0] + '" points="' + burst(12 + (n % 3) * 4, 50, 38) + '"/></svg><b style="color:' + c[1] + ';font-size:' + Math.round(size * 0.22) + 'px">' + (opt.t || txt[n % txt.length]) + '</b>';
      if (reduce) d.style.animation = 'none';
      stamps.appendChild(d); n++;
      if (opt.keep) return;
      live.push(d); if (live.length > 18) live.shift().remove();
      setTimeout(function () { d.classList.add('bye'); setTimeout(function () { d.remove(); live = live.filter(function (z) { return z !== d; }); }, 600); }, 3800);
    }
    if (close.clientWidth > 760) { var cw = close.clientWidth, ch = close.clientHeight; stamp(cw * 0.84, ch * 0.7, { keep: true, size: 170, t: '1.200 h' }); stamp(cw * 0.64, ch * 0.86, { keep: true, size: 112, t: 'IA' }); stamp(cw * 0.92, ch * 0.38, { keep: true, size: 104, t: '12' }); }
    close.addEventListener('pointerdown', function (e) { if (e.target.closest('a,button,.marquee')) return; var r = close.getBoundingClientRect(); stamp(e.clientX - r.left, e.clientY - r.top); });
    var simple = fin.querySelector('.simple');
    simple.addEventListener('pointerdown', function () { simple.classList.remove('wig'); void simple.offsetWidth; simple.classList.add('wig'); setTimeout(function () { simple.classList.remove('wig'); }, 500); });
    if (!reduce) {
      close.addEventListener('pointermove', function (e) { var r = close.getBoundingClientRect(); close.style.setProperty('--px', (((e.clientX - r.left) / r.width - 0.5) * -40).toFixed(1) + 'px'); close.style.setProperty('--py', (((e.clientY - r.top) / r.height - 0.5) * -40).toFixed(1) + 'px'); });
      if ('IntersectionObserver' in window) { var fo = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { fin.classList.add('go'); fo.disconnect(); } }); }, { threshold: 0.35 }); fo.observe(fin); }
    }
  })();

  /* ---------- barra de progreso y sección activa ---------- */
  var prog = $('#progress'), links = $$('.nav ul a'), secs = links.map(function (a) { return $(a.getAttribute('href')); });
  function alBajar() {
    var h = document.documentElement, p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    prog.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    var y = h.scrollTop + 140, act = -1;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top + h.scrollTop <= y) act = i; });
    links.forEach(function (a, i) { a.classList.toggle('on', i === act); });
    paralaje();
  }
  addEventListener('scroll', alBajar, { passive: true });

  /* ---------- arranque ---------- */
  pintarBursts(document);
  var h0 = /^#m(\d+)$/.exec(location.hash), n0 = h0 && porN(+h0[1]) ? +h0[1] : 1;
  prev = n0; elegir(n0, { anim: false });
  if (!h0) { if (history.replaceState) history.replaceState(null, '', location.pathname + location.search); }
  observar($$('.rv'));
  alBajar();
  // llegada con #m8 desde la landing: se baja al módulo cuando ya cargaron fuentes e imágenes
  function irAlModulo() { window.scrollTo({ top: topStage(), behavior: 'instant' }); }
  if (h0) { if (document.readyState === 'complete') setTimeout(irAlModulo, 60); else addEventListener('load', function () { setTimeout(irAlModulo, 60); }); }
})();
