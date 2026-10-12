/* Semply · landing de prelanzamiento. Prototipo sin servidor: la lista de espera se guarda en este navegador. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var movil = matchMedia('(max-width: 720px)').matches;
  var tactil = matchMedia('(pointer: coarse)').matches;
  var LANZA = new Date('2026-11-09T19:00:00-05:00');
  var estado3d = window.SEMPLY_ESCENA = window.SEMPLY_ESCENA || { p: 0 };
  function leer(k, d) { try { var v = localStorage.getItem('smpl.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function guardar(k, v) { try { localStorage.setItem('smpl.' + k, JSON.stringify(v)); } catch (e) {} }
  function ico(path) { return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' + path + '</svg>'; }
  var I = {
    set: '<path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-6h6v6"/>',
    cam: '<rect x="3" y="6" width="13" height="12" rx="3"/><path d="m16 10 5-3v10l-5-3"/>',
    plat: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    doc: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 4 6"/>',
    guia: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/>',
    check: '<path d="m5 12 5 5L20 7"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>', mas: '<path d="M12 5v14M5 12h14"/>',
    flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>', cal: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    copiar: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/>', reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>', candado: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'
  };
  function burst(txt, color, fg, s, cls) {
    var pts = [], n = 18;
    for (var i = 0; i < n * 2; i++) { var a = Math.PI * i / n - Math.PI / 2, r = i % 2 ? 41 : 50; pts.push((50 + r * Math.cos(a)).toFixed(1) + ',' + (50 + r * Math.sin(a)).toFixed(1)); }
    return '<div class="burst ' + (cls || '') + '" style="--s:' + s + 'px;color:' + fg + '"><svg viewBox="0 0 100 100" aria-hidden="true"><polygon points="' + pts.join(' ') + '" fill="' + color + '"/></svg><span>' + txt + '</span></div>';
  }
  function fmtN(n) { return Math.round(n).toLocaleString('es-CO'); }

  /* ---------- carga ---------- */
  (function () {
    var n = 0, fin = false, el = $('.js-carga-n'), b = $('.js-carga-b'), carga = $('.js-carga');
    var listo3d = !!estado3d.listo, listoVentana = document.readyState === 'complete';
    window.addEventListener('escena-lista', function () { listo3d = true; });
    window.addEventListener('load', function () { listoVentana = true; });
    var t0 = Date.now();
    function cerrar() { if (fin) return; fin = true; clearInterval(iv); el.textContent = 100; b.style.width = '100%'; setTimeout(function () { carga.classList.add('fuera'); document.documentElement.classList.add('cargado'); }, 180); }
    function paso() {
      var t = Date.now() - t0, tope = (listo3d && listoVentana && t > 1100) || t > 4000 ? 100 : 90;
      n += (tope - n) * 0.12 + 0.6; if (n > tope) n = tope;
      el.textContent = Math.floor(n); b.style.width = n + '%';
      if (n >= 99.5) cerrar();
    }
    if (reducir) { carga.classList.add('fuera'); document.documentElement.classList.add('cargado'); return; }
    var iv = setInterval(paso, 30);
    setTimeout(cerrar, 6000);
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
  function irA(sel) { var t = $(sel); if (!t) return; if (lenis) lenis.scrollTo(t, { offset: -70, duration: 1.4 }); else t.scrollIntoView({ behavior: 'smooth' }); }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a || a.getAttribute('href').length < 2) return;
    e.preventDefault(); irA(a.getAttribute('href'));
  });

  /* ---------- encabezado ---------- */
  var hdr = $('.js-hdr'), escenaEl = $('.js-escena');
  function cabecera() { var lim = escenaEl.offsetHeight - 90; hdr.classList.toggle('claro-h', window.scrollY > lim); }
  window.addEventListener('scroll', cabecera, { passive: true }); cabecera();

  /* ---------- cuenta regresiva ---------- */
  function strip(n) { var s = '<span>'; for (var i = 0; i < 10; i++) s += '<i>' + i + '</i>'; return '<span class="dig" data-d="' + n + '">' + s + '</span></span>'; }
  function armaCuenta(el) {
    el.innerHTML = [['d', 'días', 2], ['h', 'horas', 2], ['m', 'min', 2], ['s', 'seg', 2]].map(function (x) { var d = ''; for (var i = 0; i < x[2]; i++) d += strip(0); return '<div class="cuenta-box" data-u="' + x[0] + '"><div class="digitos">' + d + '</div><small>' + x[1] + '</small></div>'; }).join('');
  }
  var cuentas = [$('.js-cuenta'), $('.js-cuenta2')]; cuentas.forEach(armaCuenta);
  function tic() {
    var ms = Math.max(0, LANZA - Date.now()), v = { d: Math.floor(ms / 864e5), h: Math.floor(ms / 36e5) % 24, m: Math.floor(ms / 6e4) % 60, s: Math.floor(ms / 1e3) % 60 };
    cuentas.forEach(function (c) {
      $$('.cuenta-box', c).forEach(function (b) {
        var val = String(v[b.dataset.u]).padStart(2, '0'), ds = $$('.dig', b);
        if (val.length > ds.length) { $('.digitos', b).insertAdjacentHTML('afterbegin', strip(0)); ds = $$('.dig', b); }
        ds.forEach(function (dg, i) { var n = +val[i]; dg.firstChild.style.transform = 'translateY(' + (-n) + 'em)'; });
      });
    });
    $('.js-dias-h').textContent = v.d;
  }
  tic(); setInterval(tic, 1000);

  /* ---------- palabra que cambia ---------- */
  (function () {
    var P = ['construyendo.', 'grabando.', 'diseñando.', 'cocinando.', 'armando.'], k = 0, el = $('.js-palabra');
    function pinta(w, cls) { el.innerHTML = w.split('').map(function (l, i) { return '<span class="l ' + cls + '" style="--i:' + i + '">' + (l === ' ' ? '&nbsp;' : l) + '</span>'; }).join(''); }
    pinta(P[0], '');
    if (reducir) return;
    setInterval(function () {
      if (document.hidden) return;
      $$('.l', el).forEach(function (s) { s.classList.add('sale'); });
      setTimeout(function () { k = (k + 1) % P.length; pinta(P[k], 'entra'); }, 360);
    }, 2800);
  })();

  /* ---------- lista: contador y avisos ---------- */
  var base = 1284 + Math.max(0, Math.floor((Date.now() - new Date('2026-10-12T00:00:00-05:00')) / 864e5)) * 37;
  var enLista = base + (leer('extra', 0));
  function pintaLista() { $$('.js-lista-n').forEach(function (e) { e.textContent = fmtN(enLista); }); }
  pintaLista();
  var NOMBRES = [['Laura', 'Cali'], ['Andrés', 'Medellín'], ['Valentina', 'Bogotá'], ['Camilo', 'Pereira'], ['Daniela', 'Barranquilla'], ['Sebastián', 'Buga'], ['Juliana', 'Manizales'], ['Felipe', 'Bucaramanga']];
  function aviso(html, ini) {
    var box = $('.js-avisos'), a = document.createElement('div'); a.className = 'aviso';
    a.innerHTML = '<span class="av">' + ini + '</span><div>' + html + '</div>';
    box.appendChild(a); setTimeout(function () { a.classList.add('sale'); setTimeout(function () { a.remove(); }, 360); }, 4600);
  }
  (function () {
    var veces = 0;
    function siguiente() {
      if (veces >= 6) return;
      setTimeout(function () {
        if (!document.hidden && document.documentElement.classList.contains('cargado')) {
          var p = NOMBRES[(veces * 3 + 1) % NOMBRES.length]; enLista++; pintaLista(); veces++;
          aviso('<b>' + p[0] + ' de ' + p[1] + '</b> se unió a la lista<small>hace un momento · ya van ' + fmtN(enLista) + '</small>', p[0][0]);
        }
        siguiente();
      }, 14000 + Math.random() * 9000);
    }
    siguiente();
  })();

  /* ---------- cintas ---------- */
  $$('.js-cinta').forEach(function (c) { var t = c.dataset.t.split(' · '); var s = t.concat(t, t).map(function (x) { return '<span>' + x + '</span>'; }).join(''); c.innerHTML = s + s; });

  /* ---------- escena: avance del scroll ---------- */
  ScrollTrigger.create({ trigger: escenaEl, start: 'top top', end: 'bottom bottom', onUpdate: function (s) { estado3d.p = s.progress; $('.js-encaja').classList.toggle('on', s.progress > 0.62); } });
  $('.js-burst-hero').innerHTML = burst('9 nov<small>lanzamiento</small>', '#FFC225', '#373435', 128);
  if (!reducir) {
    var tl = gsap.timeline({ scrollTrigger: { trigger: escenaEl, start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
    tl.to('.js-pista', { opacity: 0, duration: 0.06 }, 0)
      .to('.js-hero-copy', { y: -80, opacity: 0, duration: 0.18, ease: 'power1.in' }, 0.06)
      .to('.js-burst-hero', { y: -160, rotate: 40, opacity: 0, duration: 0.2 }, 0.04)
      .to('.escena-vel', { opacity: 0, duration: 0.2 }, 0.1)
      .fromTo('.js-encaja', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.14 }, 0.6)
      .to('.js-encaja', { opacity: 1, duration: 0.26 }, 0.74);
  }

  /* ---------- así vamos ---------- */
  var FRENTES = [
    { n: 'Set de grabación', ic: I.set, v: 80, txt: 'Pared amarilla lista, luces colgadas y escritorio en su sitio. Falta el tratamiento acústico.', img: 'assets/img/bts/pintura.webp' },
    { n: 'Clases grabadas', ic: I.cam, v: 14, de: 97, txt: 'Unidades 0, 1 y 2 de IA aplicada al marketing. El 21 de octubre empieza la grabación de SEO.', img: 'assets/img/bts/monitor.webp' },
    { n: 'Plataforma', ic: I.plat, v: 92, txt: 'Campus, reproductor, entregas y constancias funcionando en pruebas. Falta conectar los pagos.', img: 'assets/img/plataforma/campus.webp' },
    { n: 'Docentes', ic: I.doc, v: 7, de: 7, txt: 'Equipo completo. Cinco ya están grabando; dos se presentan en las próximas semanas.', img: 'assets/img/bts/lampara.webp' },
    { n: 'Guías y talleres', ic: I.guia, v: 45, txt: 'Guías de 2 a 4 páginas por taller, con paso a paso y criterio de evaluación.', img: 'assets/img/bts/planeacion.webp' }
  ];
  var pctF = function (f) { return f.de ? Math.round(f.v / f.de * 100) : f.v; };
  var total = Math.round(FRENTES.reduce(function (a, f) { return a + pctF(f); }, 0) / FRENTES.length);
  $('.js-frentes').innerHTML = FRENTES.map(function (f, i) {
    var p = pctF(f);
    return '<div class="frente rv" style="--d:' + (i * 0.06) + 's"><button class="frente-bt" aria-expanded="false" data-mira><span class="frente-ico">' + ico(f.ic) + '</span><span><b>' + f.n + '</b><span class="barra' + (p === 100 ? ' lista' : '') + '"><i data-w="' + p + '"></i></span></span><span class="frente-pct">' + (f.de ? f.v + '<small>de ' + f.de + '</small>' : f.v + ' %<small>' + (p === 100 ? 'listo' : 'en obra') + '</small>') + '</span></button>' +
      '<div class="frente-det"><div><div class="in"><img src="' + f.img + '" alt="" loading="lazy"><p>' + f.txt + '</p></div></div></div></div>';
  }).join('');
  $('.js-burst-med').innerHTML = burst('En<small>obra</small>', '#F10E3B', '#fff', 104);
  $('.js-frentes').addEventListener('click', function (e) { var b = e.target.closest('.frente-bt'); if (!b) return; var f = b.parentNode, a = f.classList.toggle('abierto'); b.setAttribute('aria-expanded', a); });
  (function () {
    var C = 2 * Math.PI * 124, v = $('.js-medidor-v'); v.style.strokeDasharray = C; v.style.strokeDashoffset = C;
    var hecho = false;
    new IntersectionObserver(function (es, o) {
      if (!es[0].isIntersecting || hecho) return; hecho = true; o.disconnect();
      v.style.strokeDashoffset = C * (1 - total / 100);
      var n = { x: 0 }; gsap.to(n, { x: total, duration: 2.2, ease: 'power3.out', onUpdate: function () { $('.js-medidor-n').textContent = Math.round(n.x); } });
      $$('.barra i').forEach(function (b, i) { setTimeout(function () { b.style.width = b.dataset.w + '%'; }, 300 + i * 140); });
    }, { threshold: 0.4 }).observe($('.js-medidor'));
  })();

  /* ---------- bitácora ---------- */
  var HITOS = [
    { f: '18 sep 2026', t: 'Plan de estudios aprobado', p: 'Dos programas de 100 horas, la mitad en práctica con entregables.', img: 'assets/img/cursos/prog-ia-sm.webp' },
    { f: '29 sep 2026', t: 'Nace la marca', p: 'Rojo, amarillo, el corchete y un lema: serios, pero no aburridos.', img: 'assets/img/bts/estatua.webp' },
    { f: '3 oct 2026', t: 'Se arma el temario', p: '97 actividades en la pared, con hilo rojo y demasiadas notas amarillas.', img: 'assets/img/bts/planeacion.webp' },
    { f: '7 oct 2026', t: 'Primera clase grabada', p: '«Anatomía de un prompt», con Mariana Restrepo.', img: 'assets/media/leccion-poster.webp' },
    { f: '10 oct 2026', t: 'Plataforma en pruebas', p: 'Campus, reproductor y constancias funcionando.', img: 'assets/img/plataforma/clase.webp' },
    { f: '12 oct 2026', t: 'El set se pinta de amarillo', p: 'Luces colgadas, escritorio listo. Hoy vamos aquí.', img: 'assets/img/bts/lampara.webp', hoy: true },
    { f: '21 oct 2026', t: 'Arranca la grabación de SEO', p: 'Andrés Cifuentes entra al set con el segundo programa.', futuro: true },
    { f: '2 nov 2026', t: 'Preventa para la lista', p: 'La lista de espera compra primero, con precio de fundador.', futuro: true },
    { f: '9 nov 2026', t: '¡Abrimos!', p: 'Clase en vivo de lanzamiento a las 7:00 p. m. y primera cohorte.', final: true }
  ];
  $('.js-bita-pista').innerHTML = HITOS.map(function (h) {
    return '<article class="hito' + (h.hoy ? ' hoy' : '') + (h.futuro ? ' futuro' : '') + (h.final ? ' final' : '') + '">' +
      (h.final ? '<div class="hito-img" style="display:grid;place-items:center;background:var(--rojo-2)">' + burst('¡Abrimos!', '#FFC225', '#373435', 150, 'rel') + '</div>' : h.futuro ? '<div class="hito-img">' + ico(I.reloj) + '</div>' : '<div class="hito-img"><img src="' + h.img + '" alt="" loading="lazy"></div>') +
      (h.hoy ? '<span class="tag tag-y">Hoy</span>' : '') +
      '<div class="hito-c"><time>' + h.f + '</time><h3>' + h.t + '</h3><p>' + h.p + '</p></div></article>';
  }).join('');
  if (!reducir && !movil) {
    var pista = $('.js-bita-pista');
    var distancia = function () { return Math.max(0, pista.scrollWidth - window.innerWidth); };
    gsap.to(pista, { x: function () { return -distancia(); }, ease: 'none', scrollTrigger: { trigger: '.js-bita', start: 'top top', end: function () { return '+=' + distancia(); }, pin: '.js-bita-pin', scrub: 0.8, invalidateOnRefresh: true,
      onUpdate: function (s) { $('.js-bita-l').style.width = (s.progress * 100) + '%'; } } });
  }

  /* ---------- video que se expande ---------- */
  var expVideo = $('.js-exp-media video');
  if (!reducir) {
    var te = gsap.timeline({ scrollTrigger: { trigger: '.js-expande', start: 'top top', end: 'bottom bottom', scrub: 0.7 } });
    var ini = movil ? 'inset(30% 12% 30% 12% round 28px)' : 'inset(22% 26% 22% 26% round 40px)';
    te.fromTo('.js-exp-media', { clipPath: ini }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 0.55, ease: 'power2.inOut' }, 0)
      .fromTo('.js-exp-media video', { scale: 1.15 }, { scale: 1, duration: 0.55 }, 0)
      .to('.js-exp-esq', { opacity: 0, scale: 1.2, duration: 0.2 }, 0)
      .to('.js-exp-txt', { color: '#ffffff', duration: 0.15 }, 0.22)
      .to('.js-exp-txt', { y: -120, opacity: 0, duration: 0.2 }, 0.62)
      .fromTo('.js-exp-sub', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.18 }, 0.7);
  }
  function autoplay(v) { new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); }); }, { threshold: 0.15 }).observe(v); }
  autoplay(expVideo); autoplay($('.marco video'));

  /* ---------- clase en modal ---------- */
  $('.js-clase').addEventListener('click', function () {
    var m = document.createElement('div'); m.className = 'modal';
    m.innerHTML = '<div class="modal-caja" role="dialog" aria-modal="true" aria-label="Clase: Anatomía de un prompt"><button class="modal-x" aria-label="Cerrar">' + ico(I.x) + '</button><video controls autoplay playsinline poster="assets/media/leccion-poster.webp"><source src="assets/media/leccion-anatomia-prompt.mp4" type="video/mp4"><track kind="captions" srclang="es" label="Español" src="assets/media/leccion-anatomia-prompt.vtt" default></video></div>';
    function cerrar() { m.remove(); document.removeEventListener('keydown', k); if (lenis) lenis.start(); }
    function k(e) { if (e.key === 'Escape') cerrar(); }
    m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('.modal-x')) cerrar(); });
    document.addEventListener('keydown', k); document.body.appendChild(m); if (lenis) lenis.stop();
    $('.modal-x', m).focus();
  });

  /* ---------- mesa con fotos arrastrables ---------- */
  (function () {
    var mesa = $('.js-mesa');
    var F = [['assets/img/bts/pintura.webp', 'Día 3: pintura'], ['assets/img/bts/monitor.webp', 'Prueba de cámara'], ['assets/img/bts/planeacion.webp', 'El temario, en la pared'], ['assets/img/bts/lampara.webp', 'La lámpara roja'], ['assets/img/bts/estatua.webp', 'El equipo de arte']];
    var W = mesa.clientWidth, H = mesa.clientHeight, z = 1;
    var pw = movil ? 170 : 230;
    F.forEach(function (f, i) {
      var p = document.createElement('figure'); p.className = 'pola'; p.style.margin = 0; p.setAttribute('data-mira', ''); p.setAttribute('data-mira-t', 'Arrastra');
      p.innerHTML = '<span class="cinta-p"></span><img src="' + f[0] + '" alt="" draggable="false" loading="lazy"><p>' + f[1] + '</p>';
      var cols = movil ? 2 : 5, x = movil ? (i % cols) * (W - pw - 20) / (cols - 1) + 10 : 30 + i * ((W - pw - 60) / (F.length - 1)), y = movil ? 60 + Math.floor(i / cols) * 190 + (i % 2) * 30 : 70 + (i % 2) * 90;
      var r = (Math.random() * 16 - 8);
      p.style.left = x + 'px'; p.style.top = y + 'px'; p.style.transform = 'rotate(' + r + 'deg)'; p.style.zIndex = ++z;
      mesa.appendChild(p);
      var ox, oy, sx, sy;
      p.addEventListener('pointerdown', function (e) {
        p.setPointerCapture(e.pointerId); p.classList.add('agarrada'); p.style.zIndex = ++z;
        ox = e.clientX; oy = e.clientY; sx = parseFloat(p.style.left); sy = parseFloat(p.style.top);
        p.style.transition = 'transform .2s'; p.style.transform = 'rotate(0deg) scale(1.06)';
      });
      p.addEventListener('pointermove', function (e) {
        if (!p.classList.contains('agarrada')) return;
        var nx = Math.min(W - pw * 0.5, Math.max(-pw * 0.4, sx + e.clientX - ox)), ny = Math.min(H - 120, Math.max(-40, sy + e.clientY - oy));
        p.style.left = nx + 'px'; p.style.top = ny + 'px';
      });
      function soltar() { if (!p.classList.contains('agarrada')) return; p.classList.remove('agarrada'); p.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1)'; p.style.transform = 'rotate(' + (Math.random() * 14 - 7) + 'deg)'; }
      p.addEventListener('pointerup', soltar); p.addEventListener('pointercancel', soltar);
    });
  })();

  /* ---------- cámara 3D ---------- */
  $('.js-burst-cam').innerHTML = burst('3D<small>gírala</small>', '#F10E3B', '#fff', 96);

  /* ---------- plataforma ---------- */
  (function () {
    var CAP = ['Tu semana de un vistazo: racha, meta de horas, sesiones en vivo y entregas.', 'Reproductor propio: subtítulos, capítulos, notas al minuto y preguntas al docente.', 'Cada programa con su temario real, docente, cohortes y pago en cuotas.', 'Constancia con código de verificación, lista para PDF y LinkedIn.'];
    var imgs = $$('.js-pantalla img'), tabs = $$('.js-plat-tabs button'), k = 0, auto = true;
    function ir(i) { k = i; imgs.forEach(function (im, j) { im.classList.toggle('on', j === i); }); tabs.forEach(function (t, j) { t.classList.toggle('on', j === i); t.setAttribute('aria-selected', j === i); }); $('.js-plat-cap').textContent = CAP[i]; }
    tabs.forEach(function (t) { t.addEventListener('click', function () { auto = false; ir(+t.dataset.i); }); });
    setInterval(function () { if (auto && !document.hidden) ir((k + 1) % imgs.length); }, 4200);
    if (!reducir) gsap.fromTo('.js-portatil', { rotateX: 28, scale: 0.86, y: 40 }, { rotateX: 0, scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: '.js-portatil', start: 'top 95%', end: 'center 55%', scrub: 0.6 } });
  })();

  /* ---------- programas ---------- */
  $('.js-progs').innerHTML = [
    ['assets/img/cursos/prog-ia.webp', 'IA aplicada al marketing', 'De usar ChatGPT a operar un sistema de marketing con IA. Con Mariana Restrepo.', 'Jueves en vivo'],
    ['assets/img/cursos/prog-seo.webp', 'SEO y posicionamiento web', 'Que te encuentren en Google, en el mapa y en las respuestas de la IA. Con Andrés Cifuentes.', 'Martes en vivo']
  ].map(function (p, i) { return '<article class="prog rv" style="--d:' + (i * 0.08) + 's" data-mira><img src="' + p[0] + '" alt="" loading="lazy"><div class="prog-c"><div style="display:flex;gap:8px;flex-wrap:wrap"><span class="tag tag-y">Primera cohorte · 9 nov</span><span class="tag tag-b">' + p[3] + '</span></div><span class="prog-h">100<small>horas</small></span><h3>' + p[1] + '</h3><p>' + p[2] + '</p></div></article>'; }).join('');

  /* ---------- tarjetas para rascar ---------- */
  (function () {
    var C = [['prompts', 'Prompts que sí funcionan para marketing', 'Mariana Restrepo'], ['reels', 'Guiones para reels que retienen', 'Laura Mejía'], ['meta', 'Meta Ads desde cero', 'Julián Ortega'], ['seolocal', 'SEO local: aparece en el mapa', 'Andrés Cifuentes'], ['producto', 'Fotos de producto con IA', 'Laura Mejía'], ['linkedin', 'Marca personal en LinkedIn', 'docente por revelar']];
    var cont = $('.js-rascas'), hechas = 0;
    cont.innerHTML = C.map(function (c, i) { return '<article class="rasca rv" style="--d:' + (i % 3 * 0.06) + 's"><div class="rasca-img"><img src="assets/img/cursos/' + c[0] + '-sm.webp" alt="" loading="lazy"><canvas data-mira data-mira-t="Rasca" aria-label="Rasca para descubrir el curso"></canvas>' + burst('¡Ahí<small>está!</small>', '#F10E3B', '#fff', 84) + '</div><div class="rasca-c"><b>' + c[1] + '</b><small>Curso corto · ' + (/revelar/.test(c[2]) ? c[2] : 'con ' + c[2]) + '</small></div></article>'; }).join('');
    $$('.rasca', cont).forEach(function (card) {
      var cv = $('canvas', card), ctx = cv.getContext('2d'), w, h, abajo = false, ult = null, cont2 = 0, lista = false;
      function prep() {
        var r = cv.getBoundingClientRect(); w = cv.width = Math.round(r.width * 1.5); h = cv.height = Math.round(r.height * 1.5);
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#373435'; ctx.fillRect(0, 0, w, h);
        var img = new Image(); img.onload = function () { var pat = ctx.createPattern(img, 'repeat'); ctx.globalAlpha = 0.16; ctx.fillStyle = pat; ctx.fillRect(0, 0, w, h); ctx.globalAlpha = 1; texto(); };
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'><path d='M6 6h12v24h24v12H6z' fill='#F10E3B'/><path d='M90 6v36H78V18H54V6z' fill='#FFC225'/><path d='M6 90V54h12v24h24v12z' fill='#FFC225'/><path d='M90 90H54V78h24V54h12z' fill='#ffffff'/></svg>");
        texto();
      }
      function texto() { ctx.fillStyle = '#FFC225'; ctx.font = '700 ' + Math.round(h * 0.16) + 'px Fredoka, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('RASCA AQUÍ', w / 2, h / 2); }
      function pos(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * w / r.width, y: (e.clientY - r.top) * h / r.height }; }
      function raya(p) {
        ctx.globalCompositeOperation = 'destination-out'; ctx.lineWidth = w * 0.13; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(ult ? ult.x : p.x, ult ? ult.y : p.y); ctx.lineTo(p.x, p.y); ctx.stroke(); ult = p;
        if (++cont2 % 8 === 0) medir();
      }
      function medir() {
        var d = ctx.getImageData(0, 0, w, h).data, vac = 0, tot = 0;
        for (var i = 3; i < d.length; i += 4 * 24) { tot++; if (d[i] < 40) vac++; }
        if (!lista && vac / tot > 0.5) { lista = true; card.classList.add('lista'); hechas++; $('.js-desc').innerHTML = 'Descubiertos: <b>' + hechas + '</b> de 6'; if (hechas === 6) { confeti(); aviso('<b>¡Los descubriste todos!</b><small>Entran al catálogo el 9 de noviembre.</small>', '★'); } }
      }
      cv.addEventListener('pointerdown', function (e) { abajo = true; ult = null; cv.setPointerCapture(e.pointerId); raya(pos(e)); });
      cv.addEventListener('pointermove', function (e) { if (abajo || (!tactil && e.buttons === 0 && e.pointerType === 'mouse')) raya(pos(e)); });
      cv.addEventListener('pointerup', function () { abajo = false; ult = null; medir(); });
      cv.addEventListener('pointerleave', function () { ult = null; });
      prep(); if (document.fonts) document.fonts.ready.then(prep);
    });
  })();

  /* ---------- quiz ---------- */
  (function () {
    var Q = [
      ['¿Qué te quita más tiempo hoy?', [['Crear contenido para redes', { ia: 2, con: 2 }], ['Que nadie me encuentre en Google', { seo: 3 }], ['Pautar sin saber si funciona', { pau: 3 }], ['Hacer todo a mano', { ia: 3 }]]],
      ['¿Cómo aprendes mejor?', [['Haciendo, con mi propio negocio', { prog: 2 }], ['En ratos cortos, a mi ritmo', { cur: 2 }], ['Con alguien que me corrija', { prog: 3 }], ['Viendo ejemplos y copiando', { cur: 1 }]]],
      ['¿Cuánto tiempo tienes por semana?', [['1 a 2 horas', { cur: 3 }], ['3 a 5 horas', { cur: 1, prog: 1 }], ['Unas 10 horas', { prog: 3 }], ['Depende de la semana', { cur: 2 }]]],
      ['En tres meses quieres mostrar…', [['Un mes de contenido hecho con IA', { ia: 2, con: 1 }], ['Mi negocio en el mapa y en Google', { seo: 3 }], ['Campañas con resultados medibles', { pau: 3 }], ['Un sistema que trabaja solo', { ia: 3 }]]]
    ];
    var R = {
      ia: { prog: ['IA aplicada al marketing', 'mariana', 'Programa de 100 horas · 10 semanas', 'Diez semanas trabajando tu propio negocio: prompts, contenido, automatizaciones y pauta con IA, con sesión en vivo cada jueves.'], cur: ['Prompts que sí funcionan para marketing', 'mariana', 'Curso corto · 2 h 48 min', 'Lo básico bien hecho: rol, contexto, tarea, formato y restricciones. Sales con 10 prompts listos.'], tam: 'Automatiza tu marketing sin programar, con Daniela Ríos.' },
      seo: { prog: ['SEO y posicionamiento web', 'andres', 'Programa de 100 horas · 10 semanas', 'Auditoría, mapa de contenidos, SEO técnico, GEO y una campaña de búsqueda viva, con un sitio real.'], cur: ['SEO local: aparece en el mapa', 'andres', 'Curso corto · 2 h 08 min', 'Perfil de negocio, reseñas y señales locales para salir cuando buscan «cerca de mí».'], tam: 'GA4 y Looker Studio sin miedo, con Santiago Vélez.' },
      con: { prog: ['IA aplicada al marketing', 'mariana', 'Programa de 100 horas · 10 semanas', 'Las unidades 4 y 5 son puro contenido: voz de marca, calendario del mes, imagen y video con IA.'], cur: ['Guiones para reels que retienen', 'laura', 'Curso corto · 2 h 36 min', 'Ganchos, estructura y cierre para reels que la gente ve hasta el final.'], tam: 'Fotos de producto con IA, también con Laura Mejía.' },
      pau: { prog: ['IA aplicada al marketing', 'mariana', 'Programa de 100 horas · 10 semanas', 'Incluye la unidad «IA en la pauta digital»: Advantage+, recursos automáticos y pruebas de creativos.'], cur: ['Meta Ads desde cero', 'julian', 'Curso corto · 2 h 54 min', 'Del Administrador de anuncios al primer resultado medible, sin quemar el presupuesto.'], tam: 'Google Ads para negocios locales, también con Julián Ortega.' }
    };
    var caja = $('.js-quiz'), i = 0, pts = {};
    function pinta() {
      if (i >= Q.length) return resultado();
      var q = Q[i];
      caja.innerHTML = '<div class="quiz-anim"><div class="quiz-barra">' + Q.map(function (_, j) { return '<i class="' + (j < i ? 'ok' : '') + '"></i>'; }).join('') + '</div><span class="ceja">Pregunta ' + (i + 1) + ' de ' + Q.length + '</span><h3>' + q[0] + '</h3><div class="ops">' + q[1].map(function (o, j) { return '<button class="op" data-j="' + j + '" data-mira><i>' + 'ABCD'[j] + '</i>' + o[0] + '</button>'; }).join('') + '</div></div>';
    }
    function resultado() {
      var tema = ['ia', 'seo', 'con', 'pau'].sort(function (a, b) { return (pts[b] || 0) - (pts[a] || 0); })[0];
      var fmt = (pts.prog || 0) >= (pts.cur || 0) ? 'prog' : 'cur', r = R[tema][fmt];
      guardar('ruta', { tema: tema, nombre: r[0] });
      caja.innerHTML = '<div class="quiz-anim"><div class="quiz-barra">' + Q.map(function () { return '<i class="ok"></i>'; }).join('') + '</div><div class="resultado"><img src="assets/img/docentes/' + r[1] + '.webp" alt=""><div><span class="ceja">Tu ruta para empezar</span><h3>' + r[0] + '</h3><span class="tag tag-y">' + r[2] + '</span><p style="margin-top:12px;color:var(--tx2)">' + r[3] + '</p><p class="tambien"><b>También te sirve:</b> ' + R[tema].tam + '</p><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px"><button class="btn js-ruta-lista" data-mira>Guardar mi cupo en esta ruta</button><button class="btn btn-o btn-s js-ruta-otra">Repetir</button></div></div></div></div>';
    }
    caja.addEventListener('click', function (e) {
      var o = e.target.closest('.op');
      if (o) { o.classList.add('sel'); var s = Q[i][1][+o.dataset.j][1]; Object.keys(s).forEach(function (k) { pts[k] = (pts[k] || 0) + s[k]; }); setTimeout(function () { i++; pinta(); }, 260); }
      if (e.target.closest('.js-ruta-otra')) { i = 0; pts = {}; pinta(); }
      if (e.target.closest('.js-ruta-lista')) { var r = leer('ruta', null); marcarInteres(r && r.tema); irA('#lista'); }
    });
    pinta();
  })();

  /* ---------- docentes ---------- */
  $('.js-docs').innerHTML = [
    ['mariana', 'Mariana Restrepo', 'IA aplicada'], ['andres', 'Andrés Cifuentes', 'SEO y SEM'], ['laura', 'Laura Mejía', 'Contenido'], ['julian', 'Julián Ortega', 'Pauta digital'], ['daniela', 'Daniela Ríos', 'Automatización'],
    ['santiago', '¿Quién será?', 'Se revela el 19 de octubre', true], ['camila', '¿Quién será?', 'Se revela el 26 de octubre', true]
  ].map(function (d, i) { return '<article class="doc rv' + (d[3] ? ' bloq' : '') + '" style="--d:' + (i * 0.05) + 's" data-mira><img src="assets/img/docentes/' + d[0] + '.webp" alt="' + (d[3] ? '' : d[1]) + '" loading="lazy"><div class="doc-n"><b>' + d[1] + '</b><small>' + d[2] + '</small></div></article>'; }).join('');

  /* ---------- lista de espera ---------- */
  var INTERESES = [['ia', 'IA aplicada'], ['seo', 'SEO y web'], ['con', 'Contenido'], ['pau', 'Pauta digital'], ['emp', 'Para mi empresa']];
  function marcarInteres(t) { if (!t) return; var c = $('.js-form-caja input[value="' + t + '"]'); if (c) c.checked = true; }
  function formHTML() {
    return burst('−30 %<small>fundador</small>', '#FFC225', '#373435', 120) + '<h3>Guarda tu cupo</h3><p style="color:var(--tx2)">Te escribimos solo para avisarte lo importante. Sin spam.</p>' +
      '<form class="js-lista" novalidate><div class="campos">' +
      '<div class="fld"><label for="l-n">Nombre</label><input id="l-n" class="inp" autocomplete="given-name" required><span class="err">Escribe tu nombre.</span></div>' +
      '<div class="fld"><label for="l-c">Correo</label><input id="l-c" type="email" class="inp" autocomplete="email" required><span class="err">Revisa el correo.</span></div>' +
      '<div class="fld"><label for="l-w">WhatsApp (opcional)</label><input id="l-w" type="tel" class="inp" inputmode="numeric" autocomplete="tel" placeholder="300 123 4567"></div>' +
      '<div class="fld"><label for="l-ci">Ciudad</label><input id="l-ci" class="inp" autocomplete="address-level2" list="ciudades"><datalist id="ciudades"><option>Bogotá</option><option>Medellín</option><option>Cali</option><option>Barranquilla</option><option>Pereira</option><option>Bucaramanga</option><option>Buga</option></datalist></div>' +
      '<div class="fld full"><span class="lbl">¿Qué te interesa?</span><div class="intereses">' + INTERESES.map(function (x) { return '<label><input type="checkbox" value="' + x[0] + '"><span>' + x[1] + '</span></label>'; }).join('') + '</div></div>' +
      '<label class="check full"><input type="checkbox" required><span>Acepto que Semply me escriba sobre el lanzamiento y trate mis datos según la Ley 1581 de 2012.</span></label>' +
      '<button class="btn full" data-mira>Guardar mi cupo de fundador ' + ico(I.flecha).replace('class="ico"', 'class="ico ico-f"') + '</button></div></form>';
  }
  function exitoHTML(r) {
    var url = location.href.split('?')[0].split('#')[0] + '?ref=' + r.ref;
    var msj = 'Me anoté a Semply, la academia de marketing e IA que abre el 9 de noviembre. Si entras con mi enlace, los dos subimos en la lista: ' + url;
    return '<div class="exito">' + burst('¡Estás<small>dentro!</small>', '#F10E3B', '#fff', 120, 'rel') + '<h3>Gracias, ' + esc(r.nombre) + '.</h3><p class="puesto">#' + fmtN(r.puesto) + '<small>es tu puesto en la lista</small></p><p style="color:var(--tx2);max-width:420px">Sube 5 puestos por cada amistad que se anote con tu enlace. Y cada una te da otra oportunidad en el sorteo de becas.</p>' +
      '<div class="enlace-ref"><input readonly value="' + url + '" aria-label="Tu enlace para invitar"><button class="btn btn-g btn-s js-copiar">' + ico(I.copiar) + 'Copiar</button></div>' +
      '<div class="compartir"><a class="btn btn-s" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(msj) + '">' + ico(I.chat) + 'Compartir por WhatsApp</a><button class="btn btn-o btn-s js-ics">' + ico(I.cal) + 'Agendar el lanzamiento</button></div>' +
      '<button class="js-otra" style="font-size:13.5px;color:var(--tx2);text-decoration:underline">No soy ' + esc(r.nombre) + '</button></div>';
  }
  var caja = $('.js-form-caja');
  function pintaForm() { var r = leer('registro', null); caja.innerHTML = r ? exitoHTML(r) : formHTML(); var rt = leer('ruta', null); if (!r && rt) marcarInteres(rt.tema); }
  pintaForm();
  caja.addEventListener('submit', function (e) {
    e.preventDefault(); var f = e.target, ok = true;
    $$('[required]', f).forEach(function (i) {
      var bien = i.type === 'checkbox' ? i.checked : i.type === 'email' ? /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value) : i.value.trim().length > 0;
      var fl = i.closest('.fld'); if (fl) fl.classList.toggle('mal', !bien); if (i.type === 'checkbox') i.closest('.check').classList.toggle('mal', !bien);
      if (!bien && ok) { i.focus(); ok = false; }
    });
    if (!ok) return;
    var b = $('button.btn', f); b.classList.add('cargando');
    setTimeout(function () {
      enLista++; guardar('extra', leer('extra', 0) + 1); pintaLista();
      var r = { nombre: $('#l-n').value.trim().split(' ')[0], correo: $('#l-c').value.trim(), puesto: enLista, ref: Math.random().toString(36).slice(2, 8), intereses: $$('.intereses input:checked', f).map(function (x) { return x.value; }) };
      guardar('registro', r); pintaForm(); confeti();
    }, 900);
  });
  caja.addEventListener('click', function (e) {
    if (e.target.closest('.js-copiar')) { var i = $('.enlace-ref input', caja); i.select(); (navigator.clipboard ? navigator.clipboard.writeText(i.value) : Promise.reject()).then(function () { aviso('<b>Enlace copiado</b><small>Pégalo donde quieras.</small>', '✓'); }, function () { document.execCommand && document.execCommand('copy'); }); }
    if (e.target.closest('.js-ics')) ics();
    if (e.target.closest('.js-otra')) { guardar('registro', null); pintaForm(); }
  });
  function ics() {
    var t = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Semply//Lanzamiento//ES', 'BEGIN:VEVENT', 'UID:lanzamiento-2026@semply.co', 'DTSTAMP:20261012T000000Z', 'DTSTART:20261110T000000Z', 'DTEND:20261110T013000Z', 'SUMMARY:Lanzamiento de Semply · clase en vivo', 'DESCRIPTION:Clase abierta de lanzamiento con el equipo docente de Semply. El enlace llega a tu correo.', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([t], { type: 'text/calendar' })); a.download = 'lanzamiento-semply.ics'; a.click();
  }
  // formulario corto del inicio: llena el correo y lleva al formulario completo
  $('.js-mini').addEventListener('submit', function (e) {
    e.preventDefault(); var v = $('#mini-c').value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { $('#mini-c').focus(); aviso('<b>Revisa tu correo</b><small>Parece que falta algo.</small>', '!'); return; }
    if (leer('registro', null)) { irA('#lista'); return; }
    var c = $('#l-c'); if (c) c.value = v; irA('#lista'); setTimeout(function () { var n = $('#l-n'); if (n) n.focus({ preventScroll: true }); }, 1500);
  });
  // invitación con ?ref=
  if (/[?&]ref=/.test(location.search)) { var bnr = document.createElement('div'); bnr.className = 'ref-banner'; bnr.innerHTML = '★ Te invitaron a Semply. Si te anotas, los dos suben en la lista.'; document.body.appendChild(bnr); setTimeout(function () { bnr.remove(); }, 7000); }

  /* ---------- confeti de corchetes ---------- */
  function confeti() {
    if (reducir) return;
    var c = document.createElement('div'); c.className = 'confeti'; var cols = ['#F10E3B', '#FFC225', '#ffffff', '#373435'];
    for (var i = 0; i < 80; i++) c.insertAdjacentHTML('beforeend', '<i style="left:' + Math.random() * 100 + '%;--c:' + cols[i % 4] + ';--t:' + (2.2 + Math.random() * 2) + 's;--dl:' + Math.random() * 0.8 + 's;--dx:' + (Math.random() * 220 - 110) + 'px;--rr:' + (Math.random() * 900 - 450) + 'deg"></i>');
    document.body.appendChild(c); setTimeout(function () { c.remove(); }, 5200);
  }

  /* ---------- redes: los videos suenan al pasar ---------- */
  $$('video[data-hover]').forEach(function (v) {
    if (tactil) { autoplay(v); return; }
    var r = v.closest('.reel'); r.addEventListener('mouseenter', function () { var p = v.play(); if (p && p.catch) p.catch(function () {}); }); r.addEventListener('mouseleave', function () { v.pause(); });
  });

  /* ---------- preguntas ---------- */
  $('.js-faq').innerHTML = [
    ['¿Cuándo abre Semply?', 'El lunes 9 de noviembre de 2026 a las 7:00 p. m., con una clase en vivo de lanzamiento. Quienes estén en la lista entran 48 horas antes.'],
    ['¿Qué gano por anotarme ahora?', 'Precio de fundador (−30 % en tu primer programa o en tu primer año de Semply Pro), acceso anticipado, la clase de lanzamiento y la posibilidad de ganar una de tres becas completas.'],
    ['¿Anotarme me obliga a comprar?', 'No. La lista es gratis y te puedes salir cuando quieras con un clic desde cualquier correo.'],
    ['¿Las clases son en vivo o grabadas?', 'Las dos. Los programas de 100 horas combinan lecciones grabadas, una sesión en vivo cada semana y un entregable por unidad. Los cursos cortos son grabados.'],
    ['¿Entregan certificado?', 'Una constancia digital de asistencia y aprobación con código de verificación. Semply es educación informal: entrega constancia, no título.']
  ].map(function (f, i) { return '<div class="acc-it' + (i === 0 ? ' abierto' : '') + '"><button class="acc-bt" aria-expanded="' + (i === 0) + '" data-mira>' + f[0] + '<span class="mas">' + ico(I.mas) + '</span></button><div class="acc-cont"><div><p>' + f[1] + '</p></div></div></div>'; }).join('');
  $('.js-faq').addEventListener('click', function (e) { var b = e.target.closest('.acc-bt'); if (!b) return; var it = b.parentNode, a = it.classList.toggle('abierto'); b.setAttribute('aria-expanded', a); });

  /* ---------- texto cinético ---------- */
  $$('.js-kinetic > span').forEach(function (l) {
    l.innerHTML = l.textContent.split(' ').map(function (w) { return '<span class="w">' + w.split('').map(function (c) { return '<span class="c">' + c + '</span>'; }).join('') + '</span>'; }).join(' ');
  });
  if (!reducir) gsap.from('.js-kinetic .c', { yPercent: 110, opacity: 0, rotate: 8, stagger: 0.025, duration: 0.8, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.js-kinetic', start: 'top 80%' } });

  /* ---------- mira: el cursor encuadra lo que tocas ---------- */
  (function () {
    if (tactil || reducir) return;
    var m = $('.js-mira'), pt = $('.js-mira-p'), tx = $('.js-mira-t'), x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, w = 34, h = 34, cw = 34, ch = 34, objetivo = null;
    document.addEventListener('pointermove', function (e) {
      x = e.clientX; y = e.clientY; m.classList.add('on'); pt.classList.add('on');
      pt.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      var t = e.target.closest('[data-mira]');
      objetivo = t && !t.closest('.mesa') && t.tagName !== 'CANVAS' && !t.classList.contains('pola') ? t : null;
      var lbl = t && t.getAttribute('data-mira-t');
      tx.textContent = lbl || ''; tx.classList.toggle('on', !!lbl); tx.style.left = x + 'px'; tx.style.top = y + 'px';
    });
    document.addEventListener('pointerleave', function () { m.classList.remove('on'); pt.classList.remove('on'); });
    (function loop() {
      var tx2 = x, ty2 = y, tw = 34, th = 34;
      if (objetivo) { var r = objetivo.getBoundingClientRect(); tx2 = r.left + r.width / 2; ty2 = r.top + r.height / 2; tw = r.width + 16; th = r.height + 16; }
      cx += (tx2 - cx) * 0.22; cy += (ty2 - cy) * 0.22; cw += (tw - cw) * 0.2; ch += (th - ch) * 0.2;
      m.style.transform = 'translate(' + (cx - cw / 2) + 'px,' + (cy - ch / 2) + 'px)'; m.style.width = cw + 'px'; m.style.height = ch + 'px';
      m.classList.toggle('encuadra', !!objetivo);
      requestAnimationFrame(loop);
    })();
    m.style.left = '0'; m.style.top = '0';
  })();

  /* ---------- aparición ---------- */
  (function () {
    var els = $$('.rv');
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ---------- enlaces que llegan con la web final ---------- */
  document.addEventListener('click', function (e) { if (e.target.closest('.js-pronto')) { e.preventDefault(); aviso('<b>Muy pronto</b><small>Las redes se abren con el lanzamiento.</small>', '★'); } });
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
