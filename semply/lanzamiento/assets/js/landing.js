/* Semply · portada del sitio en construcción (usa comun.js) */
(function () {
  var S = window.SMP, $ = S.$, $$ = S.$$, reducir = S.reducir, tactil = S.tactil;
  var estado3d = window.SEMPLY_ESCENA = window.SEMPLY_ESCENA || { p: 0 };

  /* ---------- carga ---------- */
  (function () {
    var n = 0, fin = false, el = $('.js-carga-n'), b = $('.js-carga-b'), carga = $('.js-carga');
    var listo3d = !!estado3d.listo, listoVentana = document.readyState === 'complete', t0 = Date.now();
    window.addEventListener('escena-lista', function () { listo3d = true; });
    window.addEventListener('load', function () { listoVentana = true; });
    function cerrar() { if (fin) return; fin = true; clearInterval(iv); el.textContent = 100; b.style.width = '100%'; setTimeout(function () { carga.classList.add('fuera'); document.documentElement.classList.add('cargado'); }, 180); }
    function paso() { var t = Date.now() - t0, tope = (listo3d && listoVentana && t > 1100) || t > 4000 ? 100 : 90; n += (tope - n) * 0.12 + 0.6; if (n > tope) n = tope; el.textContent = Math.floor(n); b.style.width = n + '%'; if (n >= 99.5) cerrar(); }
    if (reducir) { carga.classList.add('fuera'); document.documentElement.classList.add('cargado'); return; }
    var iv = setInterval(paso, 30); setTimeout(cerrar, 6000);
  })();

  /* ---------- scroll suave ---------- */
  var lenis = null;
  gsap.registerPlugin(ScrollTrigger);
  if (!reducir && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a || a.getAttribute('href').length < 2) return;
    var t = $(a.getAttribute('href')); if (!t) return; e.preventDefault();
    if (lenis) lenis.scrollTo(t, { offset: -70, duration: 1.4 }); else t.scrollIntoView({ behavior: 'smooth' });
  });
  var escenaEl = $('.js-escena');
  S.iniciarComun(function () { return escenaEl.offsetHeight - 90; });

  /* ---------- palabra que cambia ---------- */
  (function () {
    var P = ['sin complicarte la vida.', 'con tu negocio real.', 'de día o de noche.', 'presencial o virtual.'], k = 0, el = $('.js-palabra');
    // cada palabra va en su propio bloque sin cortes, para que la frase solo salte de línea entre palabras
    function pinta(w, cls) { var i = 0; el.innerHTML = w.split(' ').map(function (p) { return '<span class="pw">' + p.split('').map(function (l) { return '<span class="l ' + cls + '" style="--i:' + (i++) + '">' + l + '</span>'; }).join('') + '</span>'; }).join(' '); }
    pinta(P[0], '');
    if (reducir) return;
    setInterval(function () {
      if (document.hidden) return;
      $$('.l', el).forEach(function (s) { s.classList.add('sale'); });
      setTimeout(function () { k = (k + 1) % P.length; pinta(P[k], 'entra'); }, 360);
    }, 3000);
  })();

  /* ---------- cintas ---------- */
  $$('.js-cinta').forEach(function (c) { var t = c.dataset.t.split(' · '); var s = t.concat(t, t).map(function (x) { return '<span>' + x + '</span>'; }).join(''); c.innerHTML = s + s; });

  /* ---------- escena: avance del scroll ---------- */
  ScrollTrigger.create({ trigger: escenaEl, start: 'top top', end: 'bottom bottom', onUpdate: function (s) { estado3d.p = s.progress; $('.js-encaja').classList.toggle('on', s.progress > 0.62); } });
  $('.js-burst-hero').innerHTML = S.burst('1.200<small>horas</small>', '#FFC225', '#373435', 128);
  if (!reducir) {
    var tl = gsap.timeline({ scrollTrigger: { trigger: escenaEl, start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
    tl.to('.js-pista', { opacity: 0, duration: 0.06 }, 0)
      .to('.js-hero-copy', { y: -80, opacity: 0, duration: 0.18, ease: 'power1.in' }, 0.06)
      .to('.js-burst-hero', { y: -160, rotate: 40, opacity: 0, duration: 0.2 }, 0.04)
      .to('.escena-vel', { opacity: 0, duration: 0.2 }, 0.1)
      .fromTo('.js-encaja', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.14 }, 0.6)
      .to('.js-encaja', { opacity: 1, duration: 0.26 }, 0.74);
  }

  /* ---------- oferta académica: los dos semestres ---------- */
  $('.js-semestres').innerHTML = [1, 2].map(function (s) {
    return '<div class="semestre"><h3><span>Semestre ' + s + '</span><small>600 horas</small></h3><ol>' + S.MODULOS.filter(function (m) { return m.s === s; }).map(function (m, i) {
      return '<li class="mod con" style="--i:' + i + '" data-mira role="link" tabindex="0" data-href="' + m.plan + '"><b>' + String(m.num).padStart(2, '0') + '</b><span>' + m.n + '<small>' + m.d + '</small></span><em>Ver temario</em></li>';
    }).join('') + '</ol></div>';
  }).join('');
  // cada módulo abre su temario en el plan de estudios
  $('.js-semestres').addEventListener('click', function (e) { var li = e.target.closest('[data-href]'); if (li) location.href = li.dataset.href; });
  $('.js-semestres').addEventListener('keydown', function (e) { var li = e.target.closest('[data-href]'); if (li && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); location.href = li.dataset.href; } });

  /* ---------- videos ---------- */
  function autoplay(v) { new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); }); }, { threshold: 0.15 }).observe(v); }
  autoplay($('.marco video'));
  $('.js-clase').addEventListener('click', function () {
    var m = document.createElement('div'); m.className = 'modal';
    m.innerHTML = '<div class="modal-caja" role="dialog" aria-modal="true" aria-label="Clase de muestra"><button class="modal-x" aria-label="Cerrar">' + S.ico(S.I.x) + '</button><video controls autoplay playsinline poster="assets/media/leccion-poster.webp"><source src="assets/media/leccion-anatomia-prompt.mp4" type="video/mp4"><track kind="captions" srclang="es" label="Español" src="assets/media/leccion-anatomia-prompt.vtt" default></video></div>';
    function cerrar() { m.remove(); document.removeEventListener('keydown', k); if (lenis) lenis.start(); }
    function k(e) { if (e.key === 'Escape') cerrar(); }
    m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('.modal-x')) cerrar(); });
    document.addEventListener('keydown', k); document.body.appendChild(m); if (lenis) lenis.stop();
    $('.modal-x', m).focus();
  });
  $('.js-burst-cam').innerHTML = S.burst('3D<small>gírala</small>', '#F10E3B', '#fff', 96);

  /* ---------- plataforma ---------- */
  (function () {
    var CAP = ['Tu semana de un vistazo: avance, sesiones en vivo y entregas pendientes.', 'Reproductor propio: subtítulos, capítulos, notas al minuto y preguntas al docente.', 'Cada módulo con su temario, sus talleres y su proyecto.', 'Certificado con código de verificación, listo para PDF y LinkedIn.'];
    var imgs = $$('.js-pantalla img'), tabs = $$('.js-plat-tabs button'), k = 0, auto = true;
    function ir(i) { k = i; imgs.forEach(function (im, j) { im.classList.toggle('on', j === i); }); tabs.forEach(function (t, j) { t.classList.toggle('on', j === i); t.setAttribute('aria-selected', j === i); }); $('.js-plat-cap').textContent = CAP[i]; }
    tabs.forEach(function (t) { t.addEventListener('click', function () { auto = false; ir(+t.dataset.i); }); });
    setInterval(function () { if (auto && !document.hidden) ir((k + 1) % imgs.length); }, 4200);
    if (!reducir) gsap.fromTo('.js-portatil', { rotateX: 28, scale: 0.86, y: 40 }, { rotateX: 0, scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: '.js-portatil', start: 'top 95%', end: 'center 55%', scrub: 0.6 } });
  })();


  /* ---------- para qué te sirve: estudiante, trabajador, emprendedor ---------- */
  (function () {
    var PF = {
      est: { t: 'Un título técnico y una salida laboral.', p: 'Si terminaste el colegio, en dos semestres sales como Técnico Laboral en algo que todas las empresas necesitan: vender por internet.', b: ['Certificado de Técnico Laboral por Competencias.', 'Un portafolio con proyectos reales para mostrar en entrevistas.', 'Base para trabajar en redes, contenido o marketing, o para seguir estudiando.'], m: ['Fundamentos de Marketing', 'Gestión de Redes Sociales', 'Creación de Contenidos Digitales'], j: 'Diurna', img: 'reels' },
      tra: { t: 'Crece en tu trabajo o cambia de área.', p: 'Si ya trabajas, aprendes a usar la IA y las herramientas digitales que hoy piden en ventas, servicio al cliente, comunicaciones o administración.', b: ['Estudias de noche o el fin de semana, sin dejar tu empleo.', 'Aplicas en tu trabajo lo que ves en clase desde la primera unidad.', 'Un certificado técnico que suma en tu hoja de vida.'], m: ['Inteligencia Artificial Aplicada al Marketing', 'Analítica de Marketing Digital', 'Herramientas Digitales'], j: 'Nocturna o fin de semana', img: 'prompts' },
      emp: { t: 'Vende más sin depender de nadie.', p: 'Si tienes un negocio, el proyecto con el que practicas es el tuyo: lo que aprendes en clase lo aplicas esa misma semana.', b: ['Redes, contenido y pauta hechos por ti, con criterio.', 'Tu negocio visible en Google y en el mapa.', 'Automatizaciones con IA para responder y vender más rápido.'], m: ['Publicidad Digital', 'SEO y Posicionamiento Web', 'Comercio Electrónico'], j: 'La que te deje el negocio', img: 'producto' }
    };
    var caja = $('.js-perfil'), tabs = $$('.js-perfiles-tabs button');
    function pinta(k) {
      var f = PF[k];
      tabs.forEach(function (x) { x.classList.toggle('on', x.dataset.k === k); x.setAttribute('aria-selected', x.dataset.k === k); });
      caja.innerHTML = '<div class="perfil-in"><div class="perfil-img"><img src="assets/img/cursos/' + f.img + '-sm.webp" alt="" loading="lazy">' + S.burst(k === 'est' ? '¡Arranca!' : k === 'tra' ? '¡Sube!' : '¡Vende!', '#F10E3B', '#fff', 104) + '</div>' +
        '<div class="perfil-c"><h3>' + f.t + '</h3><p class="lead">' + f.p + '</p><ul class="chulos">' + f.b.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' +
        '<p class="perfil-l">Módulos que más vas a usar</p><div class="perfil-mods">' + f.m.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div>' +
        '<p class="perfil-j">' + S.ico(S.I.reloj) + 'Jornada que suele servir: <b>' + f.j + '</b></p><a class="btn" href="inscripcion.html" data-mira>Inscríbete ' + S.ico(S.I.flecha, 'ico-f') + '</a></div></div>';
    }
    tabs.forEach(function (bt) { bt.addEventListener('click', function () { pinta(bt.dataset.k); }); });
    pinta('est');
  })();

  /* ---------- tarjetas para rascar: seis módulos ---------- */
  (function () {
    var elegidos = ['Inteligencia Artificial Aplicada al Marketing', 'Creación de Contenidos Digitales', 'Publicidad Digital', 'SEO y Posicionamiento Web', 'Gestión de Redes Sociales', 'Comercio Electrónico'];
    var C = elegidos.map(function (n) { return S.MODULOS.filter(function (m) { return m.n === n; })[0]; });
    var cont = $('.js-rascas'), hechas = 0;
    cont.innerHTML = C.map(function (c, i) { return '<article class="rasca rv" style="--d:' + (i % 3 * 0.06) + 's"><div class="rasca-img"><img src="assets/img/cursos/' + c.img + '-sm.webp" alt="" loading="lazy"><canvas data-mira data-mira-t="Rasca" aria-label="Rasca para descubrir el módulo"></canvas>' + S.burst('¡Ahí<small>está!</small>', '#F10E3B', '#fff', 84) + '</div><div class="rasca-c"><b>' + c.n + '</b><small>Módulo · 100 horas · Semestre ' + c.s + '</small></div></article>'; }).join('');
    var patron = new Image();
    patron.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'><path d='M6 6h12v24h24v12H6z' fill='#F10E3B'/><path d='M90 6v36H78V18H54V6z' fill='#FFC225'/><path d='M6 90V54h12v24h24v12z' fill='#FFC225'/><path d='M90 90H54V78h24V54h12z' fill='#ffffff'/></svg>");
    $$('.rasca', cont).forEach(function (card) {
      var cv = $('canvas', card), ctx = cv.getContext('2d'), w, h, abajo = false, ult = null, cuenta = 0, lista = false;
      function prep() {
        var r = cv.getBoundingClientRect(); if (!r.width) return; w = cv.width = Math.round(r.width * 1.5); h = cv.height = Math.round(r.height * 1.5);
        ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#373435'; ctx.fillRect(0, 0, w, h);
        if (patron.complete) { ctx.globalAlpha = 0.16; ctx.fillStyle = ctx.createPattern(patron, 'repeat'); ctx.fillRect(0, 0, w, h); ctx.globalAlpha = 1; }
        ctx.fillStyle = '#FFC225'; ctx.font = '700 ' + Math.round(h * 0.16) + 'px Fredoka, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('RASCA AQUÍ', w / 2, h / 2);
      }
      function pos(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * w / r.width, y: (e.clientY - r.top) * h / r.height }; }
      function raya(p) {
        ctx.globalCompositeOperation = 'destination-out'; ctx.lineWidth = w * 0.13; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(ult ? ult.x : p.x, ult ? ult.y : p.y); ctx.lineTo(p.x, p.y); ctx.stroke(); ult = p;
        if (++cuenta % 8 === 0) medir();
      }
      function medir() {
        var d = ctx.getImageData(0, 0, w, h).data, vac = 0, tot = 0;
        for (var i = 3; i < d.length; i += 4 * 24) { tot++; if (d[i] < 40) vac++; }
        if (!lista && vac / tot > 0.5) { lista = true; card.classList.add('descubierta'); hechas++; $('.js-desc').innerHTML = 'Descubiertos: <b>' + hechas + '</b> de 6'; if (hechas === 6) { S.confeti(); S.aviso('<b>¡Los descubriste todos!</b><small>Y faltan seis más en el programa.</small>', '★'); } }
      }
      cv.addEventListener('pointerdown', function (e) { abajo = true; ult = null; cv.setPointerCapture(e.pointerId); raya(pos(e)); });
      cv.addEventListener('pointermove', function (e) { if (abajo || (!tactil && e.buttons === 0 && e.pointerType === 'mouse')) raya(pos(e)); });
      cv.addEventListener('pointerup', function () { abajo = false; ult = null; medir(); });
      cv.addEventListener('pointerleave', function () { ult = null; });
      patron.addEventListener('load', prep); prep(); if (document.fonts) document.fonts.ready.then(prep);
    });
  })();

  /* ---------- quiz: qué módulos te sirven más ---------- */
  (function () {
    var Q = [
      ['¿Qué te quita más tiempo hoy?', [['Crear contenido para redes', { con: 3 }], ['Que nadie me encuentre en Google', { seo: 3 }], ['Pautar sin saber si funciona', { pau: 3 }], ['Hacer todo a mano', { ia: 3 }]]],
      ['¿Para qué lo quieres aprender?', [['Para mi propio negocio', { ia: 1, con: 1 }], ['Para conseguir trabajo en marketing', { pau: 1, seo: 1 }], ['Para ofrecer servicios como freelance', { con: 1, pau: 1 }], ['Para crecer en la empresa donde trabajo', { ia: 1, seo: 1 }]]],
      ['¿Qué te emociona más?', [['Escribir, grabar y diseñar', { con: 2 }], ['Los números y los resultados', { pau: 1, seo: 1 }], ['Probar herramientas nuevas', { ia: 2 }], ['Vender por internet', { pau: 1, con: 1 }]]],
      ['En unos meses quieres mostrar…', [['Un mes de contenido hecho por mí', { con: 2, ia: 1 }], ['Mi negocio en el mapa y en Google', { seo: 3 }], ['Campañas con resultados medibles', { pau: 3 }], ['Un sistema que trabaja solo', { ia: 3 }]]]
    ];
    var R = {
      ia: { t: 'Inteligencia artificial', m: ['Inteligencia Artificial Aplicada al Marketing', 'Herramientas Digitales', 'Analítica de Marketing Digital'] },
      seo: { t: 'Posicionamiento', m: ['SEO y Posicionamiento Web', 'Analítica de Marketing Digital', 'Comercio Electrónico'] },
      con: { t: 'Contenido y redes', m: ['Creación de Contenidos Digitales', 'Gestión de Redes Sociales', 'Comunicación Digital'] },
      pau: { t: 'Pauta y ventas', m: ['Publicidad Digital', 'Marketing Digital', 'Comercio Electrónico'] }
    };
    var caja = $('.js-quiz'), i = 0, pts = {};
    function pinta() {
      if (i >= Q.length) return resultado();
      var q = Q[i];
      caja.innerHTML = '<div class="quiz-anim"><div class="quiz-barra">' + Q.map(function (_, j) { return '<i class="' + (j < i ? 'ok' : '') + '"></i>'; }).join('') + '</div><span class="ceja">Pregunta ' + (i + 1) + ' de ' + Q.length + '</span><h3>' + q[0] + '</h3><div class="ops">' + q[1].map(function (o, j) { return '<button class="op" data-j="' + j + '" data-mira><i>' + 'ABCD'[j] + '</i>' + o[0] + '</button>'; }).join('') + '</div></div>';
    }
    function resultado() {
      var tema = ['ia', 'seo', 'con', 'pau'].sort(function (a, b) { return (pts[b] || 0) - (pts[a] || 0); })[0], r = R[tema];
      var mods = r.m.map(function (n) { return S.MODULOS.filter(function (m) { return m.n === n; })[0]; });
      S.guardar('ruta', { tema: tema, nombre: r.t });
      caja.innerHTML = '<div class="quiz-anim"><div class="quiz-barra">' + Q.map(function () { return '<i class="ok"></i>'; }).join('') + '</div><span class="ceja">Tu perfil: ' + r.t + '</span><h3>Estos módulos van a ser tus favoritos</h3><ul class="res-mods">' +
        mods.map(function (m) { return '<li><img src="assets/img/cursos/' + m.img + '-sm.webp" alt=""><div><b>' + m.n + '</b><small>Semestre ' + m.s + ' · 100 horas · <a href="' + m.plan + '">Ver temario</a></small></div></li>'; }).join('') +
        '</ul><p class="tambien">Todos hacen parte del Técnico Laboral en Marketing Digital e IA, de 1.200 horas.</p><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px"><a class="btn" href="inscripcion.html?interes=' + tema + '" data-mira>Inscribirme</a><a class="btn btn-o btn-s" href="plan-de-estudios/#m' + mods[0].num + '" data-mira>Ver en el plan de estudios</a><button class="btn btn-o btn-s js-otra">Repetir</button></div></div>';
    }
    caja.addEventListener('click', function (e) {
      var o = e.target.closest('.op');
      if (o) { o.classList.add('sel'); var s = Q[i][1][+o.dataset.j][1]; Object.keys(s).forEach(function (k) { pts[k] = (pts[k] || 0) + s[k]; }); setTimeout(function () { i++; pinta(); }, 260); }
      if (e.target.closest('.js-otra')) { i = 0; pts = {}; pinta(); }
    });
    pinta();
  })();

  /* ---------- equipo directivo ---------- */
  $('.js-equipo').innerHTML = S.EQUIPO.map(S.tarjetaEquipo).join('');

  /* ---------- redes: los videos se mueven al pasar ---------- */
  $$('video[data-hover]').forEach(function (v) {
    if (tactil) { autoplay(v); return; }
    var r = v.closest('.reel'); r.addEventListener('mouseenter', function () { var p = v.play(); if (p && p.catch) p.catch(function () {}); }); r.addEventListener('mouseleave', function () { v.pause(); });
  });

  /* ---------- preguntas ---------- */
  S.acordeon($('.js-faq'), S.FAQ.filter(function (f) { return f[3] === 'inicio'; }).map(function (f) { return [f[1], f[2]]; }));

  /* ---------- texto cinético ---------- */
  $$('.js-kinetic > span').forEach(function (l) {
    l.innerHTML = l.textContent.split(' ').map(function (w) { return '<span class="w">' + w.split('').map(function (c) { return '<span class="c">' + c + '</span>'; }).join('') + '</span>'; }).join(' ');
  });
  if (!reducir) gsap.from('.js-kinetic .c', { yPercent: 110, opacity: 0, rotate: 8, stagger: 0.025, duration: 0.8, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.js-kinetic', start: 'top 80%' } });

  S.revelar();
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
