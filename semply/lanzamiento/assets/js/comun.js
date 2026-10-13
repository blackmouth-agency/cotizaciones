/* Semply · datos y piezas comunes a todas las páginas del sitio en construcción.
   Datos de la institución tomados de la Resolución 1200.3.2-0496 del 27 de abril de 2026 (Secretaría de Educación de Yumbo). */
(function () {
  var S = window.SMP = {};
  S.$ = function (s, r) { return (r || document).querySelector(s); };
  S.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  S.esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  S.reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  S.tactil = matchMedia('(pointer: coarse)').matches;
  S.movil = matchMedia('(max-width: 720px)').matches;
  S.leer = function (k, d) { try { var v = localStorage.getItem('smpl.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  S.guardar = function (k, v) { try { localStorage.setItem('smpl.' + k, JSON.stringify(v)); } catch (e) {} };
  S.ico = function (p, cls) { return '<svg class="ico ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + p + '</svg>'; };
  S.I = {
    flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>', mas: '<path d="M12 5v14M5 12h14"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>', check: '<path d="m5 12 5 5L20 7"/>',
    tel: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    correo: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>', pin: '<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>', escudo: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>', reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    libro: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/>', candado: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'
  };
  S.burst = function (txt, color, fg, s, cls) {
    var pts = [], n = 18;
    for (var i = 0; i < n * 2; i++) { var a = Math.PI * i / n - Math.PI / 2, r = i % 2 ? 41 : 50; pts.push((50 + r * Math.cos(a)).toFixed(1) + ',' + (50 + r * Math.sin(a)).toFixed(1)); }
    return '<div class="burst ' + (cls || '') + '" style="--s:' + s + 'px;color:' + fg + '"><svg viewBox="0 0 100 100" aria-hidden="true"><polygon points="' + pts.join(' ') + '" fill="' + color + '"/></svg><span>' + txt + '</span></div>';
  };

  /* ---------- datos reales de la institución ---------- */
  S.CONTACTO = { tel: '318 888 8328', wa: '573188888328', correo: 'semply.edu@gmail.com', dir: 'Carrera 5 No. 12-43, barrio Bolívar', ciudad: 'Yumbo, Valle del Cauca' };
  S.PROGRAMA = { nombre: 'Técnico Laboral en Marketing Digital e Inteligencia Artificial', cert: 'Técnico Laboral por Competencias en Marketing Digital e Inteligencia Artificial', horas: 1200, registro: 'Resolución 1200.3.2-0496 del 27 de abril de 2026', licencia: 'Resolución 0495 del 27 de abril de 2026', jornadas: ['Diurna', 'Nocturna', 'Fin de semana'], metodologia: 'Presencial y a distancia con estrategia de educación virtual' };
  // los 12 módulos del curso madre (estructura curricular del programa). «det» = ya tiene temario publicado.
  S.MODULOS = [
    { n: 'Fundamentos de Marketing', s: 1, d: 'Mercado, cliente, propuesta de valor y las bases para decidir con criterio.', img: 'prog-seo' },
    { n: 'Comunicación Digital', s: 1, d: 'Mensajes claros para cada canal, tono de marca y escritura para pantallas.', img: 'linkedin' },
    { n: 'Herramientas Digitales', s: 1, d: 'Las herramientas de trabajo del día a día: diseño, gestión y productividad.', img: 'automatiza' },
    { n: 'Marketing Digital', s: 1, d: 'Embudos, canales y estrategia para vender en internet.', img: 'ga4' },
    { n: 'Gestión de Redes Sociales', s: 1, d: 'Calendario, comunidad y métricas para que las redes trabajen por el negocio.', img: 'reels' },
    { n: 'Creación de Contenidos Digitales', s: 1, d: 'Foto, video corto, copy y diseño para piezas que la gente sí mira.', img: 'producto' },
    { n: 'Publicidad Digital', s: 2, d: 'Campañas en Meta y Google con presupuesto real y resultados medibles.', img: 'meta' },
    { n: 'SEO y Posicionamiento Web', s: 2, d: 'Que te encuentren en Google, en el mapa y en las respuestas de la IA.', img: 'seolocal', det: 'seo' },
    { n: 'Analítica de Marketing Digital', s: 2, d: 'Leer los datos, armar tableros y tomar decisiones con ellos.', img: 'googleads' },
    { n: 'Comercio Electrónico', s: 2, d: 'Tiendas en línea, catálogos, pagos y logística para vender por internet.', img: 'email' },
    { n: 'Inteligencia Artificial Aplicada al Marketing', s: 2, d: 'De usar ChatGPT a operar un sistema de marketing con IA.', img: 'prompts', det: 'ia' },
    { n: 'Proyecto Integrador', s: 2, d: 'Un proyecto real de principio a fin que se sustenta ante el equipo docente.', img: 'prog-ia' }
  ];
  // equipo directivo: fotos y cargos enviados por el rector el 13 de octubre de 2026
  S.EQUIPO = [
    { n: 'Sebastián Beltrán', c: 'Rector y Director Académico', img: 'assets/img/equipo-sebastian.webp', col: '#F10E3B' },
    { n: 'Jhon Luque', c: 'Director de Admisiones y Ventas B2B y B2C', img: 'assets/img/equipo-jhon.webp', col: '#FFC225' },
    { n: 'Karol Díaz', c: 'Directora de Contenido Orgánico y Estrategia Visual', img: 'assets/img/equipo-karol.webp', col: '#373435' }
  ];
  S.waLink = function (msg) { return 'https://wa.me/' + S.CONTACTO.wa + '?text=' + encodeURIComponent(msg || 'Hola, quiero información sobre Semply.'); };
  S.tarjetaEquipo = function (p, i) {
    var ini = p.n.split(' ').map(function (x) { return x[0]; }).join('');
    return '<article class="miembro rv" style="--d:' + (i * 0.08) + 's;--c:' + p.col + '" data-mira><div class="miembro-foto"><img src="' + p.img + '" alt="' + S.esc(p.n) + '" loading="lazy" onerror="this.remove()"><span class="miembro-ini">' + ini + '</span></div><div class="miembro-c"><b>' + S.esc(p.n) + '</b><span>' + S.esc(p.c) + '</span></div></article>';
  };

  /* ---------- encabezado: fondo al bajar y menú del celular ---------- */
  S.cabecera = function (umbral) {
    var hdr = S.$('.js-hdr'); if (!hdr) return;
    function f() { var lim = typeof umbral === 'function' ? umbral() : umbral; hdr.classList.toggle('claro-h', window.scrollY > lim); }
    window.addEventListener('scroll', f, { passive: true }); f();
    var bt = S.$('.js-menu');
    if (bt) bt.addEventListener('click', function () {
      var c = document.createElement('div'); c.className = 'cajon';
      var enlaces = S.$$('.hdr-nav a').map(function (a) { return '<a href="' + a.getAttribute('href') + '"' + (a.hasAttribute('aria-current') ? ' aria-current="page"' : '') + '>' + a.textContent + S.ico(S.I.flecha) + '</a>'; }).join('');
      c.innerHTML = '<div class="cajon-fondo"></div><nav class="cajon-panel" aria-label="Menú"><div class="cajon-cab"><img src="assets/img/logo-color.png" alt="Semply"><button class="js-cerrar" aria-label="Cerrar">' + S.ico(S.I.x) + '</button></div>' + enlaces + '<a class="btn" href="inscripcion.html">Inscríbete</a><a class="btn btn-o" href="' + S.waLink() + '" target="_blank" rel="noopener">WhatsApp ' + S.CONTACTO.tel + '</a></nav>';
      document.body.appendChild(c); document.body.style.overflow = 'hidden';
      requestAnimationFrame(function () { c.classList.add('on'); });
      c.addEventListener('click', function (e) { if (e.target.classList.contains('cajon-fondo') || e.target.closest('.js-cerrar')) { c.remove(); document.body.style.overflow = ''; } });
    });
  };

  /* ---------- pie ---------- */
  S.pie = function () {
    var p = S.$('.js-pie'); if (!p) return;
    var C = S.CONTACTO;
    p.innerHTML = '<div class="wrap pie-grid"><div class="pie-marca"><img src="assets/img/logo-blanco-rojo.png" alt="Semply" width="130" height="34"><p>Institución de Educación para el Trabajo y el Desarrollo Humano. Marketing digital e inteligencia artificial, sin complicarlo.</p></div>' +
      '<div><h4>Semply</h4><ul><li><a href="index.html">Inicio</a></li><li><a href="nosotros.html">Nosotros</a></li><li><a href="programa.html">Curso madre</a></li><li><a href="inscripcion.html">Inscripciones</a></li><li><a href="contacto.html">Contacto</a></li></ul></div>' +
      '<div><h4>Contacto</h4><ul><li>' + S.ico(S.I.pin) + C.dir + ', ' + C.ciudad + '</li><li><a href="tel:+57' + C.tel.replace(/ /g, '') + '">' + S.ico(S.I.tel) + C.tel + '</a></li><li><a href="mailto:' + C.correo + '">' + S.ico(S.I.correo) + C.correo + '</a></li><li><a href="' + S.waLink() + '" target="_blank" rel="noopener">' + S.ico(S.I.chat) + 'Escríbenos por WhatsApp</a></li></ul></div></div>' +
      '<div class="wrap pie-legal"><span>© 2026 Semply SAS. Licencia de funcionamiento: ' + S.PROGRAMA.licencia + '. Programa ' + S.PROGRAMA.nombre + ' registrado por la Secretaría de Educación de Yumbo, ' + S.PROGRAMA.registro + '.</span><span>Sitio en construcción · por BLACKMOUTH</span></div>';
  };

  /* ---------- enlaces de WhatsApp ---------- */
  S.whatsapp = function () { S.$$('.js-wa').forEach(function (a) { a.href = S.waLink(a.dataset.msg); }); };

  /* ---------- avisos ---------- */
  S.aviso = function (html, ini) {
    var box = S.$('.js-avisos'); if (!box) { box = document.createElement('div'); box.className = 'avisos js-avisos'; document.body.appendChild(box); }
    var a = document.createElement('div'); a.className = 'aviso'; a.innerHTML = '<span class="av">' + (ini || '★') + '</span><div>' + html + '</div>';
    box.appendChild(a); setTimeout(function () { a.classList.add('sale'); setTimeout(function () { a.remove(); }, 360); }, 4600);
  };
  document.addEventListener('click', function (e) { if (e.target.closest('.js-pronto')) { e.preventDefault(); S.aviso('<b>Muy pronto</b><small>Las redes se abren con el lanzamiento del sitio.</small>', '★'); } });

  /* ---------- acordeón, aparición y confeti ---------- */
  S.acordeon = function (el, items) {
    el.innerHTML = items.map(function (f, i) { return '<div class="acc-it' + (i === 0 ? ' abierto' : '') + '"><button class="acc-bt" aria-expanded="' + (i === 0) + '" data-mira>' + f[0] + '<span class="mas">' + S.ico(S.I.mas) + '</span></button><div class="acc-cont"><div><p>' + f[1] + '</p></div></div></div>'; }).join('');
    el.addEventListener('click', function (e) { var b = e.target.closest('.acc-bt'); if (!b) return; var it = b.parentNode, a = it.classList.toggle('abierto'); b.setAttribute('aria-expanded', a); });
  };
  S.revelar = function () {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    S.$$('.rv:not(.in)').forEach(function (e) { io.observe(e); });
  };
  S.confeti = function () {
    if (S.reducir) return;
    var c = document.createElement('div'); c.className = 'confeti'; var cols = ['#F10E3B', '#FFC225', '#ffffff', '#373435'];
    for (var i = 0; i < 80; i++) c.insertAdjacentHTML('beforeend', '<i style="left:' + Math.random() * 100 + '%;--c:' + cols[i % 4] + ';--t:' + (2.2 + Math.random() * 2) + 's;--dl:' + Math.random() * 0.8 + 's;--dx:' + (Math.random() * 220 - 110) + 'px;--rr:' + (Math.random() * 900 - 450) + 'deg"></i>');
    document.body.appendChild(c); setTimeout(function () { c.remove(); }, 5200);
  };

  /* ---------- mira: el cursor encuadra lo que tocas ---------- */
  S.mira = function () {
    if (S.tactil || S.reducir) return;
    var m = S.$('.js-mira'), pt = S.$('.js-mira-p'), tx = S.$('.js-mira-t'); if (!m) return;
    var x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, cw = 34, ch = 34, obj = null;
    document.addEventListener('pointermove', function (e) {
      x = e.clientX; y = e.clientY; m.classList.add('on'); pt.classList.add('on');
      pt.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      var t = e.target.closest('[data-mira]');
      obj = t && t.tagName !== 'CANVAS' ? t : null;
      var lbl = t && t.getAttribute('data-mira-t');
      tx.textContent = lbl || ''; tx.classList.toggle('on', !!lbl); tx.style.left = x + 'px'; tx.style.top = y + 'px';
    });
    document.addEventListener('pointerleave', function () { m.classList.remove('on'); pt.classList.remove('on'); });
    (function loop() {
      var tx2 = x, ty2 = y, tw = 34, th = 34;
      if (obj) { var r = obj.getBoundingClientRect(); tx2 = r.left + r.width / 2; ty2 = r.top + r.height / 2; tw = r.width + 16; th = r.height + 16; }
      cx += (tx2 - cx) * 0.22; cy += (ty2 - cy) * 0.22; cw += (tw - cw) * 0.2; ch += (th - ch) * 0.2;
      m.style.transform = 'translate(' + (cx - cw / 2) + 'px,' + (cy - ch / 2) + 'px)'; m.style.width = cw + 'px'; m.style.height = ch + 'px';
      m.classList.toggle('encuadra', !!obj);
      requestAnimationFrame(loop);
    })();
  };

  /* ---------- formulario de inscripción o contacto (modo demostración) ---------- */
  S.validar = function (f) {
    var ok = true;
    S.$$('[required]', f).forEach(function (i) {
      var bien = i.type === 'checkbox' ? i.checked : i.type === 'email' ? /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value) : i.type === 'tel' ? i.value.replace(/\D/g, '').length >= 10 : i.value.trim().length > 0;
      var fl = i.closest('.fld'); if (fl) fl.classList.toggle('mal', !bien);
      if (i.type === 'checkbox') i.closest('.check').classList.toggle('mal', !bien);
      if (!bien && ok) { i.focus(); ok = false; }
    });
    return ok;
  };

  S.iniciarComun = function (umbral) { S.cabecera(umbral == null ? 40 : umbral); S.pie(); S.whatsapp(); S.mira(); S.revelar(); };
})();
