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
  S.CONTACTO = { tel: '318 888 8328', wa: '573188888328', correo: 'semply.edu@gmail.com', dir: 'Carrera 5 No. 12-43, barrio Bolívar', ciudad: 'Yumbo, Valle del Cauca', instagram: 'https://www.instagram.com/semplyedu/' };
  S.PROGRAMA = { nombre: 'Técnico Laboral en Marketing Digital e Inteligencia Artificial', cert: 'Técnico Laboral por Competencias en Marketing Digital e Inteligencia Artificial', certLargo: 'Certificado de Aptitud Ocupacional de Técnico Laboral por Competencias en Marketing Digital e Inteligencia Artificial', horas: 1200, registro: 'Resolución 1200.3.2-0496 del 27 de abril de 2026', vigencia: '27 de abril de 2031', licencia: 'Resolución 0495 del 27 de abril de 2026', metodologia: '100 % virtual: clases grabadas a tu ritmo y sesiones en vivo con tu docente', metodologiaRes: 'presencial y a distancia con estrategia de educación virtual' };
  // datos legales (Ley 1064 de 2006, Decreto 1075 de 2015, Ley 1581 de 2012). nit: escribirlo cuando Semply lo envíe; mientras esté vacío no se muestra
  S.LEGAL = { razon: 'Semply SAS', nit: '', vigila: 'Secretaría de Educación de Yumbo', politica: 'legal.html#datos' };
  S.LEGAL.aclaracion = 'Este es un programa de Educación para el Trabajo y el Desarrollo Humano (Ley 1064 de 2006 y Decreto 1075 de 2015). Al terminarlo se otorga un Certificado de Aptitud Ocupacional de Técnico Laboral por Competencias. <b>No es un programa de educación superior ni conduce a título profesional, tecnológico o técnico profesional.</b> No garantizamos empleo ni ingresos.';
  // envío de formularios: pegar aquí la URL del webhook de entrada del CRM (GoHighLevel → Automatización → «Inbound Webhook»). Vacío = solo WhatsApp
  S.ENVIO = { webhook: '' };
  // medición: ID de Google Analytics 4 (G-XXXX) y del píxel de Meta. Vacíos = no se carga nada. Se activan solo si la persona acepta las cookies
  S.MEDICION = { ga4: '', pixel: '' };
  // los 12 módulos del programa (estructura curricular). El temario completo de cada uno vive en plan-de-estudios/ (datos en plan.js).
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
  // número y enlace al módulo dentro del plan de estudios (las páginas internas viven en la raíz del sitio)
  S.MODULOS.forEach(function (m, i) { m.num = i + 1; m.plan = 'plan-de-estudios/#m' + (i + 1); m.det = true; });
  // equipo directivo: fotos y cargos enviados por el rector el 13 de octubre de 2026
  S.EQUIPO = [
    { n: 'Sebastián Beltrán', c: 'Rector y Director Académico', img: 'assets/img/equipo-sebastian.webp?v=2', col: '#F10E3B' },
    { n: 'Jhon Luque', c: 'Director de Admisiones y Ventas B2B y B2C', img: 'assets/img/equipo-jhon.webp', col: '#FFC225' },
    { n: 'Karol Díaz', c: 'Directora de Contenido Orgánico y Estrategia Visual', img: 'assets/img/equipo-karol.webp', col: '#373435' },
    // Sebastián Ortiz, de BLACKMOUTH (la agencia aliada); agregado por pedido de David el 26-oct-2026
    { n: 'Sebastián Ortiz', c: 'Director de Estrategia y Marketing · BLACKMOUTH', img: 'assets/img/equipo-ortiz.webp', col: '#FFFFFF', claro: true }
  ];
  /* ---------- alianza con ADH Coaching y segundo programa (brief del 25-nov-2026) ---------- */
  S.ADH = { n: 'ADH Coaching', largo: 'Academia de Desarrollo Humano y Coaching Ontológico', azul: '#285B8B', marino: '#1F273C', celeste: '#31A3CA', logo: 'assets/img/aliados/adh.webp', logoBlanco: 'assets/img/aliado/adh-blanco.png' };
  S.PROGRAMAS = [
    { k: 'marketing', nombre: 'Técnico Laboral en Marketing Digital e Inteligencia Artificial', corto: 'Marketing Digital e IA', de: 'Semply',
      d: 'Aprende a vender por internet con criterio: estrategia, contenido, pauta, posicionamiento, comercio electrónico e inteligencia artificial aplicada, en doce módulos prácticos sobre un negocio real.',
      datos: [['1.200', 'horas'], ['12', 'módulos'], ['2', 'semestres'], ['100 %', 'virtual']], registro: 'Res. 1200.3.2-0496 de 2026', precio: 'Desde $300.000 por módulo', url: 'oferta-academica.html#marketing' },
    { k: 'coaching', nombre: 'Técnico Laboral en Coaching Ontológico', corto: 'Coaching Ontológico', de: 'ADH Coaching',
      d: 'Fórmate como Coach Ontológico Profesional: aprende a observar cómo el lenguaje, las emociones y el cuerpo crean resultados, y a acompañar procesos de cambio en personas, equipos y organizaciones.',
      datos: [['3', 'enfoques: ontológico, constructivista y sistémico'], ['10', 'unidades'], ['ADH', 'Coaching']], registro: null, valor: 8200000, url: 'oferta-academica.html#coaching' }
  ];
  // precios del Técnico Laboral en Marketing Digital e IA. Supuestos por confirmar: descuentos no acumulables (se toma el mayor), sobre el valor académico; matrícula completa y una sola vez.
  S.PRECIOS = {
    unico: 3200000, semestre: 1750000, matricula: 200000,
    modulo: function (n) { return n <= 3 ? 300000 : n <= 6 ? 400000 : 350000; },
    preventa: { pct: 50, cupos: 30, hasta: '2026-12-16T00:00:00-05:00', texto: 'hasta el 15 de diciembre' },
    adh: { pct: 20 }
  };
  S.preventa = function () { return Date.now() < Date.parse(S.PRECIOS.preventa.hasta); };
  S.diasPreventa = function () { return Math.max(0, Math.ceil((Date.parse(S.PRECIOS.preventa.hasta) - Date.now()) / 864e5)); };
  S.pesos = function (n) { return '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
  S.ALIADOS = [
    { n: 'ADH Coaching', img: 'assets/img/aliados/adh.webp', d: 'Alianza académica. Con ellos llega el programa de Coaching Ontológico.', url: 'plan-de-estudios/#aliado' },
    { n: 'Florida Global University', img: 'assets/img/aliados/fgu.svg', d: 'Avala la certificación en Coaching Ontológico de ADH Coaching.' },
    { n: 'CEL Center of Education and Leadership', img: 'assets/img/aliados/cel.webp', d: 'Certifica el programa de Coaching Ontológico de ADH Coaching.' }
  ];
  // docentes: los de coaching son el equipo de ADH Coaching (pénsum 2027); los de marketing llegan con sus fotos
  S.DOCENTES = {
    marketing: [],
    coaching: [
      ['ruben', 'Rubén Carrano', 'Director y CEO de ADH Coaching', 'Senior Coach Ontológico Profesional · FICOP #2850 · Máster en neurociencias'],
      ['yuveli', 'Yuveli Jiménez', 'Directora de admisiones', 'Coach Ontológico Profesional · Técnica en mercadeo y ventas'],
      ['lucy', 'Lucy Correa', 'Entrenadora', 'Coach Ontológico Profesional · FICOP #8694 · Coach ejecutiva y organizacional'],
      ['alejandro', 'Alejandro López', 'Entrenador', 'Coach Ontológico Profesional · FICOP #8710 · Psicólogo'],
      ['marysel', 'Marysel Arango', 'Entrenadora', 'Coach Ontológico Profesional · Ingeniera industrial · Consultora organizacional'],
      ['janneth', 'Janneth Patiño', 'Entrenadora', 'Coach Ontológico Profesional · Profesional en mercadeo y publicidad'],
      ['william', 'William Sánchez', 'Entrenador', 'Coach Ontológico Profesional · Empresario y conferencista'],
      ['sonia', 'Sonia García', 'Entrenadora', 'Coach Ontológico Profesional · Especialista en gerencia educativa']
    ]
  };
  S.waLink = function (msg) { return 'https://wa.me/' + S.CONTACTO.wa + '?text=' + encodeURIComponent(msg || 'Hola, quiero información sobre Semply.'); };
  S.tarjetaEquipo = function (p, i) {
    var ini = p.n.split(' ').map(function (x) { return x[0]; }).join('');
    return '<article class="miembro rv' + (p.claro ? ' claro' : '') + '" style="--d:' + (i * 0.08) + 's;--c:' + p.col + '" data-mira><div class="miembro-foto"><img src="' + p.img + '" alt="' + S.esc(p.n) + '" loading="lazy" onerror="this.remove()"><span class="miembro-ini">' + ini + '</span></div><div class="miembro-c"><b>' + S.esc(p.n) + '</b><span>' + S.esc(p.c) + '</span></div></article>';
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
      c.innerHTML = '<div class="cajon-fondo"></div><nav class="cajon-panel" aria-label="Menú"><div class="cajon-cab"><img src="assets/img/logo-color.png" alt="Semply"><button class="js-cerrar" aria-label="Cerrar">' + S.ico(S.I.x) + '</button></div>' + enlaces + '<a href="contacto.html">Contacto' + S.ico(S.I.flecha) + '</a><a class="btn" href="inscripcion.html">Inscríbete</a><a class="btn btn-o" href="' + S.waLink() + '" target="_blank" rel="noopener">WhatsApp ' + S.CONTACTO.tel + '</a></nav>';
      document.body.appendChild(c); document.body.style.overflow = 'hidden';
      requestAnimationFrame(function () { c.classList.add('on'); });
      c.addEventListener('click', function (e) { if (e.target.classList.contains('cajon-fondo') || e.target.closest('.js-cerrar')) { c.remove(); document.body.style.overflow = ''; } });
    });
  };

  /* ---------- pie ---------- */
  S.pie = function () {
    var p = S.$('.js-pie'); if (!p) return;
    var C = S.CONTACTO;
    p.innerHTML = '<div class="wrap pie-grid"><div class="pie-marca"><img src="assets/img/logo-blanco-rojo.png" alt="Semply" width="130" height="34"><p>Institución de Educación para el Trabajo y el Desarrollo Humano. Marketing digital e inteligencia artificial, sin complicarlo.</p><a class="pie-alianza" href="oferta-academica.html#coaching"><small>En alianza académica con</small><img src="' + S.ADH.logoBlanco + '" alt="ADH Coaching" width="92" height="60" loading="lazy"></a></div>' +
      '<div><h4>Semply</h4><ul><li><a href="index.html">Inicio</a></li><li><a href="nosotros.html">Nosotros</a></li><li><a href="oferta-academica.html">Oferta académica</a></li><li><a href="oferta-academica.html#inversion">Precios y simulador</a></li><li><a href="plan-de-estudios/">Plan de estudios</a></li><li><a href="como-funciona.html">Cómo funciona</a></li><li><a href="preguntas.html">Preguntas frecuentes</a></li><li><a href="inscripcion.html">Inscríbete</a></li><li><a href="contacto.html">Contacto</a></li></ul></div>' +
      '<div><h4>Contacto</h4><ul><li><a href="tel:+57' + C.tel.replace(/ /g, '') + '">' + S.ico(S.I.tel) + C.tel + '</a></li><li><a href="mailto:' + C.correo + '">' + S.ico(S.I.correo) + C.correo + '</a></li><li><a href="' + S.waLink() + '" target="_blank" rel="noopener">' + S.ico(S.I.chat) + 'Escríbenos por WhatsApp</a></li><li><a href="' + C.instagram + '" target="_blank" rel="noopener">' + S.ico('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5v.01"/>') + '@semplyedu en Instagram</a></li></ul></div></div>' +
      '<div class="wrap pie-legal"><p class="pie-ley">' + S.textoLegal() + '</p><nav class="pie-pol" aria-label="Políticas"><a href="legal.html#datos">Política de datos</a><a href="legal.html#cookies">Cookies</a><a href="legal.html#terminos">Términos</a><a href="legal.html#pqrs">PQRS</a><button type="button" class="js-cookies-cfg">Configurar cookies</button></nav><span>Sitio en construcción · por BLACKMOUTH</span></div>';
  };
  S.textoLegal = function () {
    var P = S.PROGRAMA, L = S.LEGAL, C = S.CONTACTO;
    return '© 2026 ' + L.razon + (L.nit ? ', NIT ' + L.nit : '') + '. Institución de Educación para el Trabajo y el Desarrollo Humano con licencia de funcionamiento otorgada por la Secretaría de Educación de Yumbo, ' + P.licencia + '. Programa «' + P.nombre + '», registrado por la Secretaría de Educación de Yumbo, ' + P.registro + ', vigente hasta el ' + P.vigencia + '. Metodología: ' + P.metodologiaRes + '. Duración: 1.200 horas (2 semestres). Otorga <b>Certificado de Aptitud Ocupacional de Técnico Laboral por Competencias</b>. <b>No conduce a título profesional.</b> Inspección y vigilancia: ' + L.vigila + '. Sede: ' + C.dir + ', ' + C.ciudad + ' · ' + C.tel + ' · ' + C.correo + '.';
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
    if (el._acc) return; el._acc = true;
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
    var corre = false, ult = '';
    function loop() {
      var tx2 = x, ty2 = y, tw = 34, th = 34;
      if (obj) { var r = obj.getBoundingClientRect(); tx2 = r.left + r.width / 2; ty2 = r.top + r.height / 2; tw = r.width + 16; th = r.height + 16; }
      cx += (tx2 - cx) * 0.22; cy += (ty2 - cy) * 0.22; cw += (tw - cw) * 0.2; ch += (th - ch) * 0.2;
      var k = Math.round(cx - cw / 2) + ',' + Math.round(cy - ch / 2) + ',' + Math.round(cw) + ',' + Math.round(ch) + (obj ? 1 : 0);
      if (k !== ult) { ult = k; m.style.transform = 'translate(' + (cx - cw / 2).toFixed(1) + 'px,' + (cy - ch / 2).toFixed(1) + 'px)'; m.style.width = cw.toFixed(1) + 'px'; m.style.height = ch.toFixed(1) + 'px'; m.classList.toggle('encuadra', !!obj); }
      var quieto = Math.abs(tx2 - cx) < 0.3 && Math.abs(ty2 - cy) < 0.3 && Math.abs(tw - cw) < 0.3 && Math.abs(th - ch) < 0.3;
      if (quieto && !obj) { corre = false; return; }
      requestAnimationFrame(loop);
    }
    function arrancar() { if (!corre) { corre = true; requestAnimationFrame(loop); } }
    document.addEventListener('pointermove', arrancar, { passive: true });
    window.addEventListener('scroll', function () { if (obj) arrancar(); }, { passive: true });
    arrancar();
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

  /* ---------- preguntas frecuentes: una sola fuente para la portada, inscripciones y la página de preguntas ---------- */
  // [tema, pregunta, respuesta, marca opcional: 'inicio' sale en la portada, 'insc' en inscripciones]
  S.FAQ_TEMAS = [['programa', 'El programa'], ['inscripcion', 'Inscripción y pagos'], ['modalidad', 'Modalidad y horarios'], ['certificado', 'Certificado y evaluación'], ['plataforma', 'Plataforma y clases']];
  S.FAQ = [
    ['programa', '¿Qué estudio en Semply?', 'Dos programas técnicos laborales. El de Marketing Digital e Inteligencia Artificial: 1.200 horas repartidas en doce módulos de 100 horas y dos semestres, 100 % virtual. Y, en alianza académica con ADH Coaching, el de Coaching Ontológico, para formarte como Coach Ontológico Profesional.', 'inicio'],
    ['programa', '¿Qué es la alianza con ADH Coaching?', 'ADH Coaching, Academia de Desarrollo Humano y Coaching Ontológico, es nuestro aliado académico. Con la alianza, Semply suma a su oferta el Técnico Laboral en Coaching Ontológico, con el equipo de entrenadores de ADH, y los estudiantes y exestudiantes de ADH tienen 20 % de descuento en el programa de Marketing Digital e IA.', 'inicio'],
    ['programa', '¿Qué módulos tiene?', 'Semestre 1: ' + S.MODULOS.filter(function (m) { return m.s === 1; }).map(function (m) { return m.n; }).join(', ') + '. Semestre 2: ' + S.MODULOS.filter(function (m) { return m.s === 2; }).map(function (m) { return m.n; }).join(', ') + '. El temario completo de cada uno, unidad por unidad, está en el <a href="plan-de-estudios/">plan de estudios</a>.'],
    ['programa', '¿Necesito saber de marketing o de programación?', 'No. El primer semestre arranca con Fundamentos de Marketing y Herramientas Digitales, y no se necesita programar: basta con manejo básico de computador y navegador.', 'inicio'],
    ['programa', '¿Las clases son pura teoría?', 'No. De las 100 horas de cada módulo, 15 son clases grabadas, 20 son sesiones en vivo con el docente, 50 son práctica con un entregable que se revisa y 15 son evaluación y retroalimentación. Trabajas sobre un negocio real: el tuyo, el de un cliente o uno que te asigna Semply.'],
    ['programa', '¿Para quién es el programa?', 'Para quien termina el colegio y quiere un certificado de técnico laboral con salida laboral, para quien ya trabaja y quiere crecer o cambiar de área, y para quien tiene un negocio y quiere venderlo mejor en internet.'],
    ['inscripcion', '¿Cómo me inscribo?', 'Llena el formulario de inscripción o escríbenos al WhatsApp ' + S.CONTACTO.tel + '. El equipo de admisiones te contacta para contarte el paso a paso de la matrícula.', 'inicio'],
    ['inscripcion', '¿Cuánto cuesta y cómo se paga?', 'El Técnico Laboral en Marketing Digital e IA cuesta ' + S.pesos(S.PRECIOS.unico) + ' en pago único o ' + S.pesos(S.PRECIOS.semestre) + ' por semestre. También puedes pagar módulo por módulo: del 1 al 3, ' + S.pesos(300000) + ' cada uno; del 4 al 6, ' + S.pesos(400000) + '; y del 7 al 12, ' + S.pesos(350000) + '. La matrícula vale ' + S.pesos(S.PRECIOS.matricula) + '. Calcula tu caso en el <a class="enl" href="oferta-academica.html#inversion">simulador de costos</a>.', 'insc'],
    ['inscripcion', '¿Hay descuentos?', 'Sí. En preventa, los primeros 30 inscritos tienen 50 % de descuento hasta el 15 de diciembre. Si eres estudiante o exestudiante de ADH Coaching tienes 20 % de descuento. Los descuentos no se suman: se aplica el mayor.', 'inicio'],
    ['inscripcion', '¿Cuándo empiezan las clases?', 'Admisiones te confirma la fecha de inicio del próximo grupo.'],
    ['inscripcion', '¿Qué documentos necesito?', 'Admisiones te envía la lista de documentos para la matrícula cuando te contacte.'],
    ['modalidad', '¿Las clases son virtuales?', 'Sí. El programa es 100 % virtual: ves las clases grabadas a tu ritmo, te conectas a las sesiones en vivo con tu docente y entregas tus trabajos en la plataforma. Estudias desde donde estés.', 'inicio'],
    ['modalidad', '¿En qué horario son las clases?', 'Las clases grabadas las ves cuando quieras. Las sesiones en vivo tienen un horario fijo por grupo que admisiones te confirma al inscribirte, y quedan grabadas por si no puedes conectarte.', 'inicio'],
    ['certificado', '¿Qué certificado recibo?', 'Al aprobar el programa recibes el ' + S.PROGRAMA.certLargo + '. ' + S.LEGAL.aclaracion, 'inicio'],
    ['certificado', '¿Es un título profesional?', 'No. ' + S.LEGAL.aclaracion],
    ['certificado', '¿Hasta cuándo está vigente el registro del programa?', 'El registro del programa (' + S.PROGRAMA.registro + ') está vigente hasta el ' + S.PROGRAMA.vigencia + '. Lo vigila la ' + S.LEGAL.vigila + '.'],
    ['certificado', '¿El programa está avalado?', 'Sí. Semply es una institución de Educación para el Trabajo y el Desarrollo Humano con licencia de funcionamiento (' + S.PROGRAMA.licencia + '), y el programa está registrado ante la Secretaría de Educación de Yumbo (' + S.PROGRAMA.registro + ', vigente hasta el ' + S.PROGRAMA.vigencia + '). Es un programa de Educación para el Trabajo y el Desarrollo Humano: no conduce a título profesional.', 'inicio'],
    ['certificado', '¿Cómo se aprueba cada módulo?', 'Con nota mínima de 3,5 sobre 5,0, el 80 % de los entregables radicados, el 70 % de las sesiones en vivo y la sustentación del proyecto integrador. La nota sale sobre todo de lo que produces: talleres y entregables (40 %) y proyecto integrador (40 %).'],
    ['plataforma', '¿Qué necesito para estudiar a distancia?', 'Un computador o celular con buena conexión. La mayoría de las herramientas tienen plan gratuito, y las que requieren pago se indican desde el inicio.'],
    ['plataforma', '¿Las sesiones en vivo quedan grabadas?', 'Sí. Se graban para quien no pudo asistir y para repasar.'],
    ['plataforma', '¿Cómo entrego mis trabajos?', 'En la plataforma: subes cada entregable y tu docente lo revisa y te deja retroalimentación.']
  ];

  /* ---------- tarjetas de contacto ---------- */
  S.contactos = function (el) {
    if (!el) return; var C = S.CONTACTO;
    el.innerHTML = [
      [S.I.chat, 'WhatsApp', C.tel, S.waLink(), true], [S.I.tel, 'Teléfono', C.tel, 'tel:+57' + C.tel.replace(/ /g, '')], [S.I.correo, 'Correo', C.correo, 'mailto:' + C.correo]
    ].map(function (c) { return '<a class="contacto-it" href="' + c[3] + '"' + (c[4] ? ' target="_blank" rel="noopener"' : '') + ' data-mira><span class="ic">' + S.ico(c[0]) + '</span><div><b>' + c[1] + '</b><span>' + c[2] + '</span></div></a>'; }).join('');
  };

  /* ---------- decoración e interacción comunes ---------- */
  // tarjetas que se inclinan hacia el cursor
  S.tilt = function () {
    if (S.tactil || S.reducir) return;
    S.$$('.tilt:not([data-tilt])').forEach(function (el) {
      el.setAttribute('data-tilt', '');
      el.addEventListener('pointermove', function (e) { var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; el.style.transform = 'perspective(900px) rotateX(' + (-y * 7).toFixed(2) + 'deg) rotateY(' + (x * 9).toFixed(2) + 'deg) translateY(-4px)'; });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  };
  // números que cuentan al aparecer
  S.contar = function () {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; io.unobserve(e.target);
        var el = e.target, n = parseFloat(el.dataset.n), dec = +(el.dataset.dec || 0), suf = el.dataset.suf || '', t0 = null;
        function fmt(v) { return v.toLocaleString('es-CO', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf; }
        if (S.reducir) { el.textContent = fmt(n); return; }
        (function paso(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1300, 1), k = 1 - Math.pow(1 - p, 3); el.textContent = fmt(n * k); if (p < 1) requestAnimationFrame(paso); })(performance.now());
      });
    }, { threshold: 0.6 });
    S.$$('.js-contar').forEach(function (el) { io.observe(el); });
  };
  // pieza en L de la marca (la misma del patrón del manual)
  S.pieza = function (col, cls) { return '<svg class="' + (cls || '') + '" viewBox="0 0 60 60" aria-hidden="true"><path d="M4 4h18v34h34v18H4z" fill="' + col + '"/></svg>'; };
  S.decorar = function () {
    var cols = ['#F10E3B', '#FFC225', '#373435', '#ffffff'];
    // piezas que flotan en las secciones y se mueven con el scroll
    var piezas = [];
    S.$$('.deco-sec').forEach(function (sec, k) {
      var oscuro = sec.classList.contains('oscuro') || sec.classList.contains('rojo-bg');
      [0, 1].forEach(function (j) {
        var d = document.createElement('div'); d.className = 'deco-l';
        var lado = (k + j) % 2 ? 'right' : 'left', tam = 46 + ((k * 37 + j * 23) % 50);
        d.style.cssText = lado + ':' + (-tam * 0.35) + 'px;top:' + (j ? 62 : 8) + '%;width:' + tam + 'px;height:' + tam + 'px;--r:' + ((k * 53 + j * 97) % 360) + 'deg;--f:' + (0.08 + ((k + j) % 3) * 0.05);
        d.innerHTML = S.pieza(oscuro ? cols[(k + j) % 2] : cols[(k + j * 2) % 3]);
        sec.appendChild(d); piezas.push(d);
      });
    });
    if (piezas.length && !S.reducir) {
      var pend = false;
      var mover = function () { pend = false; var vh = innerHeight; var med = piezas.map(function (d) { return d.parentNode.getBoundingClientRect(); }); piezas.forEach(function (d, i) { var r = med[i]; if (r.bottom < 0 || r.top > vh) return; var c = (r.top + r.height / 2 - vh / 2), f = d._f || (d._f = parseFloat(d.style.getPropertyValue('--f'))); d.style.transform = 'translateY(' + (-c * f).toFixed(1) + 'px) rotate(calc(var(--r) + ' + (c * f * 0.25).toFixed(1) + 'deg))'; }); };
      window.addEventListener('scroll', function () { if (!pend) { pend = true; requestAnimationFrame(mover); } }, { passive: true }); mover();
    }
    // sellos: tocar el fondo del encabezado deja piezas de la marca
    S.$$('.js-sellos').forEach(function (z) {
      var n = 0;
      z.addEventListener('pointerdown', function (e) {
        if (e.target.closest('a,button,input,label,.burst')) return;
        var r = z.getBoundingClientRect(), s = document.createElement('div'); s.className = 'sello';
        s.style.left = (e.clientX - r.left) + 'px'; s.style.top = (e.clientY - r.top) + 'px'; s.style.setProperty('--r', (Math.random() * 360) + 'deg');
        s.innerHTML = S.pieza(cols[[1, 3, 2, 1, 0][n++ % 5]]); z.appendChild(s);
        var p = z.querySelector('.sellos-pista'); if (p) p.classList.add('fuera');
        setTimeout(function () { s.classList.add('sale'); setTimeout(function () { s.remove(); }, 700); }, 2600);
      });
    });
    // botones magnéticos
    if (!S.tactil && !S.reducir) document.addEventListener('pointermove', function (e) {
      var b = e.target.closest && e.target.closest('.btn'); if (S._mag && S._mag !== b) { S._mag.style.translate = ''; S._mag = null; }
      if (!b) return; var r = b.getBoundingClientRect(); b.style.translate = ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + 'px ' + ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + 'px'; S._mag = b;
    });
    S.contar(); S.tilt();
  };

  /* ---------- página actual: en plataformas que pegan el HTML como bloque (GoHighLevel) el <body> pierde sus atributos ---------- */
  S.pagina = function () {
    var el = document.body.dataset.pagina ? document.body : S.$('[data-pagina]');
    var p = el ? el.dataset.pagina : '';
    if (p && p !== 'inicio') document.body.classList.add('interna');
    return p;
  };

  /* ---------- enlaces limpios: en semply.edu.co las páginas viven sin «.html» (/inscripcion, /plan-de-estudios) ---------- */
  S.LIMPIO = /(^|\.)semply\.edu\.co$/.test(location.hostname);
  S.ruta = function (h) {
    if (!S.LIMPIO || !h || /^(https?:|mailto:|tel:|#|\/\/)/.test(h)) return h;
    var m = /^(?:\.\.\/)*([\w-]+)(?:\.html)?\/?(\?[^#]*)?(#.*)?$/.exec(h); if (!m) return h;
    return (m[1] === 'index' ? '/' : '/' + m[1]) + (m[2] || '') + (m[3] || '');
  };
  S.limpiarEnlaces = function (raiz) {
    if (!S.LIMPIO) return;
    S.$$('a[href]', raiz).forEach(function (a) { var h = a.getAttribute('href'), n = S.ruta(h); if (n !== h) a.setAttribute('href', n); });
  };
  // lo que se pinta después (tarjetas, cajón del menú) se limpia al tocarlo
  if (S.LIMPIO) ['pointerdown', 'focusin', 'click'].forEach(function (t) { document.addEventListener(t, function (e) { var a = e.target.closest && e.target.closest('a[href]'); if (a) S.limpiarEnlaces(a.parentNode); }, true); });

  /* ---------- de dónde llegó la persona (anuncio, Instagram, Google): se guarda solo durante la visita ---------- */
  S.origen = function () {
    try {
      var o = JSON.parse(sessionStorage.getItem('smpl.origen') || 'null');
      if (!o) {
        var q = new URLSearchParams(location.search); o = { llegada: location.pathname, referente: document.referrer || '' };
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'].forEach(function (k) { if (q.get(k)) o[k] = q.get(k); });
        sessionStorage.setItem('smpl.origen', JSON.stringify(o));
      }
      return o;
    } catch (e) { return {}; }
  };

  /* ---------- medición (GA4 + píxel de Meta), solo con consentimiento ---------- */
  window.dataLayer = window.dataLayer || [];
  S.consentimiento = function () { try { return localStorage.getItem('smpl.cookies'); } catch (e) { return null; } };
  S.cargarMedicion = function () {
    var M = S.MEDICION; if (S._medicion || S.consentimiento() !== 'si') return; S._medicion = true;
    if (M.ga4) {
      var g = document.createElement('script'); g.async = true; g.src = 'https://www.googletagmanager.com/gtag/js?id=' + M.ga4; document.head.appendChild(g);
      window.gtag = function () { window.dataLayer.push(arguments); }; window.gtag('js', new Date()); window.gtag('config', M.ga4);
    }
    if (M.pixel) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', M.pixel); window.fbq('track', 'PageView');
    }
  };
  // eventos: inscripcion (resultado clave), whatsapp (clave), inscribete_clic, formulario_inicio, ruta_inicio, ruta_resultado, video_play, video_progreso, perfil, instagram
  var META = { inscripcion: 'Lead', whatsapp: 'Contact' };
  S.medir = function (ev, datos) {
    datos = datos || {};
    window.dataLayer.push(Object.assign({ event: ev }, datos));
    if (window.gtag && S._medicion) window.gtag('event', ev, datos);
    if (window.fbq && S._medicion) { if (META[ev]) window.fbq('track', META[ev], datos); else window.fbq('trackCustom', ev, datos); }
  };
  S.avisoCookies = function (forzar) {
    var M = S.MEDICION; if (!M.ga4 && !M.pixel) return;
    if (!forzar && S.consentimiento()) { S.cargarMedicion(); return; }
    var v = S.$('.cookies'); if (v) v.remove();
    v = document.createElement('div'); v.className = 'cookies'; v.setAttribute('role', 'dialog'); v.setAttribute('aria-label', 'Aviso de cookies');
    v.innerHTML = '<p>Usamos cookies para medir las visitas y saber qué publicidad funciona. Solo se activan si las aceptas. <a href="' + S.ruta('legal.html#cookies') + '">Más información</a></p><div><button class="btn btn-s btn-o js-ck" data-v="no">Rechazar</button><button class="btn btn-s js-ck" data-v="si">Aceptar</button></div>';
    v.addEventListener('click', function (e) { var b = e.target.closest('.js-ck'); if (!b) return; try { localStorage.setItem('smpl.cookies', b.dataset.v); } catch (er) {} v.remove(); S.cargarMedicion(); });
    document.body.appendChild(v);
  };
  // clics que se cuentan en todo el sitio
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    var h = a.getAttribute('href') || '';
    if (/wa\.me\//.test(h)) S.medir('whatsapp', { lugar: S.pagina() || 'inicio' });
    else if (/instagram\.com/.test(h)) S.medir('instagram');
    else if (/inscripcion/.test(h)) S.medir('inscribete_clic', { lugar: S.pagina() || 'inicio' });
  });
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.js-cookies-cfg')) S.avisoCookies(true); });

  /* ---------- envío de formularios: webhook del CRM si está configurado ---------- */
  S.enviar = function (tipo, datos) {
    var cuerpo = Object.assign({ tipo: tipo, fecha: new Date().toISOString(), pagina: location.href }, datos, { origen: S.origen() });
    if (!S.ENVIO.webhook) return Promise.resolve(false);
    return fetch(S.ENVIO.webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) })
      .then(function (r) { return r.ok; }, function () { return false; });
  };

  /* ---------- casilla de autorización de datos (sin marcar, obligatoria) y casilla opcional de publicidad ---------- */
  S.casillaDatos = function (pre) {
    var L = S.LEGAL;
    return '<label class="check full autoriza"><input type="checkbox" id="' + pre + '-aut" required><span>Autorizo de forma previa, expresa e informada a ' + L.razon + (L.nit ? ', NIT ' + L.nit : '') + ', como responsable, para tratar mis datos con el fin de gestionar mi proceso de admisión y contactarme por teléfono, correo y WhatsApp. Sé que los datos se almacenan en proveedores ubicados en EE. UU. Puedo conocer, actualizar, rectificar y suprimir mis datos, y revocar esta autorización, escribiendo a ' + S.CONTACTO.correo + '. Leí la <a class="enl" href="' + S.ruta(L.politica) + '" target="_blank" rel="noopener">Política de Tratamiento de Datos</a>. Si soy menor de edad, esta autorización la da mi representante legal.</span></label>' +
      '<label class="check full"><input type="checkbox" id="' + pre + '-pub"><span>También quiero recibir información académica y comercial de Semply (opcional).</span></label>';
  };

  /* ---------- botón flotante de WhatsApp (celular y tableta) ---------- */
  S.waFlotante = function () {
    if (S.$('.wa-flota')) return;
    var a = document.createElement('a'); a.className = 'wa-flota'; a.href = S.waLink(); a.target = '_blank'; a.rel = 'noopener'; a.setAttribute('aria-label', 'Escríbenos por WhatsApp');
    a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>';
    document.body.appendChild(a);
  };

  S.iniciarComun = function (umbral) { S.origen(); S.cabecera(umbral == null ? 40 : umbral); S.pie(); S.whatsapp(); S.waFlotante(); S.mira(); S.revelar(); S.decorar(); S.limpiarEnlaces(); S.avisoCookies(); };
})();
