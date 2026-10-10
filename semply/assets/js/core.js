/* Semply · núcleo compartido: estado (sesión, carrito, progreso), íconos, encabezado, pie y utilidades.
   Todo vive en localStorage del navegador: es un prototipo sin servidor. */
(function () {
  var D = window.SEMPLY;
  var S = window.Semply = {};

  /* ---------- utilidades ---------- */
  S.$ = function (s, r) { return (r || document).querySelector(s); };
  S.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  S.esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  S.param = function (k) { return new URLSearchParams(location.search).get(k); };
  S.fmt = D.fmt;
  S.img = function (src, alt, extra) { return '<img src="' + src + '" alt="' + S.esc(alt || '') + '" ' + (extra || 'loading="lazy" decoding="async"') + '>'; };
  S.cover = function (c, grande) { return 'assets/img/cursos/' + c.img + (grande ? '' : '-sm') + '.webp'; };
  S.docImg = function (id, av) { return 'assets/img/docentes/' + id + (av ? '-av' : '') + '.webp'; };
  S.iniciales = function (n) { return (n || '?').split(' ').filter(Boolean).slice(0, 2).map(function (p) { return p[0]; }).join('').toUpperCase(); };
  S.dur = function (min) { if (min >= 60) { var h = Math.floor(min / 60), m = min % 60; return h + ' h' + (m ? ' ' + m + ' min' : ''); } return min + ' min'; };
  S.horasTxt = function (c) { return c.tipo === 'programa' ? c.horas + ' horas' : S.dur(c.minutos); };
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  S.MESES = MESES; S.DIAS = DIAS;
  S.fecha = function (iso, conDia) { var d = typeof iso === 'string' ? new Date(iso + 'T12:00:00') : iso; return (conDia ? DIAS[d.getDay()] + ' ' : '') + d.getDate() + ' de ' + MESES[d.getMonth()]; };
  S.hora = function (d) { var h = d.getHours(), m = d.getMinutes(); var ap = h >= 12 ? 'p. m.' : 'a. m.'; h = h % 12 || 12; return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ap; };

  /* ---------- almacenamiento seguro ---------- */
  function leer(k, def) { try { var v = localStorage.getItem('smp.' + k); return v ? JSON.parse(v) : def; } catch (e) { return def; } }
  function guardar(k, v) { try { localStorage.setItem('smp.' + k, JSON.stringify(v)); } catch (e) {} }
  S.leer = leer; S.guardar = guardar;

  /* ---------- sesión ---------- */
  S.sesion = function () { return leer('sesion', null); };
  S.entrar = function (datos, demo) {
    var u = Object.assign({ nombre: 'Estudiante Semply', correo: '', ciudad: '', negocio: '', plan: '' }, datos);
    guardar('sesion', u);
    if (demo) S.sembrarDemo();
    return u;
  };
  S.salir = function () { guardar('sesion', null); location.href = 'index.html'; };
  S.exigirSesion = function () { if (!S.sesion()) { location.replace('ingresar.html?volver=' + encodeURIComponent(location.pathname.split('/').pop() + location.search + location.hash)); return false; } return true; };

  /* ---------- inscripciones y progreso ---------- */
  S.inscritos = function () { return leer('inscritos', {}); };
  S.inscribir = function (slug, extra) {
    var ins = S.inscritos();
    if (!ins[slug]) ins[slug] = Object.assign({ desde: new Date().toISOString(), hechas: {}, ultima: null, tiempos: {} }, extra || {});
    guardar('inscritos', ins);
  };
  S.marcar = function (slug, lid, hecha) {
    var ins = S.inscritos(); if (!ins[slug]) return;
    if (hecha === false) delete ins[slug].hechas[lid]; else ins[slug].hechas[lid] = Date.now();
    guardar('inscritos', ins);
  };
  S.ultima = function (slug, lid, t) {
    var ins = S.inscritos(); if (!ins[slug]) return;
    ins[slug].ultima = lid; if (t != null) ins[slug].tiempos[lid] = t;
    guardar('inscritos', ins);
  };
  S.lecciones = function (c) { var a = []; c.unidades.forEach(function (u) { u.lecciones.forEach(function (l) { a.push(Object.assign({ u: u }, l)); }); }); return a; };
  S.progreso = function (slug) {
    var c = D.curso(slug), ins = S.inscritos()[slug]; if (!c || !ins) return 0;
    var tot = S.lecciones(c).length, n = Object.keys(ins.hechas).length;
    return Math.round(n / tot * 100);
  };
  S.siguiente = function (slug) {
    var c = D.curso(slug), ins = S.inscritos()[slug] || { hechas: {} }, ls = S.lecciones(c);
    if (ins.ultima && !ins.hechas[ins.ultima]) return ls.filter(function (l) { return l.id === ins.ultima; })[0];
    return ls.filter(function (l) { return !ins.hechas[l.id]; })[0] || ls[ls.length - 1];
  };
  S.sembrarDemo = function () {
    var hace = function (d) { return new Date(Date.now() - d * 864e5).toISOString(); };
    var ins = {};
    var ia = D.curso('ia-marketing'), pr = D.curso('prompts-marketing'), re = D.curso('guiones-reels');
    var h = {};
    S.lecciones(ia).forEach(function (l) { if (/^u[01]-/.test(l.id)) h[l.id] = Date.now() - 7.8e8; });
    ins['ia-marketing'] = { desde: hace(18), hechas: h, ultima: 'u2-1', tiempos: {}, cohorte: 'sep26' };
    var hp = {}; S.lecciones(pr).forEach(function (l) { hp[l.id] = Date.now() - 2e9; });
    ins['prompts-marketing'] = { desde: hace(52), hechas: hp, ultima: null, tiempos: {}, terminado: hace(31) };
    var hr = {}; S.lecciones(re).slice(0, 6).forEach(function (l) { hr[l.id] = Date.now() - 9e8; });
    ins['guiones-reels'] = { desde: hace(24), hechas: hr, ultima: 's2-3', tiempos: {} };
    guardar('inscritos', ins);
    guardar('entregas', {
      'ia-marketing|u0-taller': { estado: 'aprobado', nota: 4.6, archivo: 'Ficha negocio - Café La Loma.pdf', fecha: hace(15), comentario: 'Muy clara la ficha. Afina el público: «personas que toman café» es todo el mundo. ¿Quién compra café de origen en Pereira?' },
      'ia-marketing|u1-taller': { estado: 'revision', archivo: 'Auditoría 5 respuestas IA.docx', fecha: hace(2) }
    });
    guardar('notas', { 'ia-marketing': { 'u1-4': [{ t: 132, txt: 'Revisar el mapa de modelos de video antes del taller 5.' }] } });
  };

  /* agenda de los programas: una sesión en vivo y una entrega por unidad, semana a semana desde la inscripción */
  S.agenda = function () {
    var ins = S.inscritos(), ev = [];
    Object.keys(ins).forEach(function (slug) {
      var c = D.curso(slug); if (!c || c.tipo !== 'programa') return;
      var ini = new Date(ins[slug].desde); ini.setHours(0, 0, 0, 0);
      var diaVivo = /jueves/i.test(c.cohortes[0].dia) ? 4 : 2;
      c.unidades.forEach(function (u, i) {
        var v = new Date(ini.getTime() + i * 7 * 864e5); while (v.getDay() !== diaVivo) v.setDate(v.getDate() + 1); v.setHours(19, 0, 0, 0);
        ev.push({ tipo: 'vivo', slug: slug, c: c, u: u, i: i, fecha: v, fin: new Date(v.getTime() + 2 * 36e5), t: i === c.unidades.length - 1 ? 'Sustentaciones finales' : 'Clínica en vivo · ' + u.c, lid: u.c.toLowerCase() + '-vivo' });
        var e = new Date(ini.getTime() + (i * 7 + 6) * 864e5); e.setHours(23, 59, 0, 0);
        ev.push({ tipo: 'entrega', slug: slug, c: c, u: u, i: i, fecha: e, t: 'Entrega ' + u.c + ' · ' + u.n, lid: u.c.toLowerCase() + '-taller' });
      });
    });
    return ev.sort(function (a, b) { return a.fecha - b.fecha; });
  };
  S.ics = function (e) {
    var f = function (d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); };
    var txt = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Semply//Campus//ES', 'BEGIN:VEVENT', 'UID:' + e.slug + '-' + e.lid + '@semply.co', 'DTSTAMP:' + f(new Date()), 'DTSTART:' + f(e.fecha), 'DTEND:' + f(e.fin || new Date(e.fecha.getTime() + 36e5)), 'SUMMARY:Semply · ' + e.t, 'DESCRIPTION:' + e.c.titulo + ' con ' + D.docentes[e.c.docente].nombre + '. Enlace en tu campus.', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'text/calendar' })); a.download = 'semply-' + e.lid + '.ics'; a.click();
    S.toast('Evento descargado. Ábrelo para agregarlo a tu calendario.', 'calendario');
  };

  /* estado de una entrega: guardada, o pendiente/vencida/bloqueada según la fecha y el avance */
  S.unidadActual = function (slug) {
    var c = D.curso(slug), ins = S.inscritos()[slug] || { hechas: {} };
    for (var i = 0; i < c.unidades.length; i++) if (c.unidades[i].lecciones.some(function (l) { return l.tipo === 'video' && !ins.hechas[l.id]; })) return i;
    return c.unidades.length - 1;
  };
  S.entrega = function (slug, lid, fecha, i) {
    var g = S.leer('entregas', {})[slug + '|' + lid]; if (g) return g;
    if (i > S.unidadActual(slug) + 1) return { estado: 'bloqueada' };
    return { estado: fecha && fecha < new Date() ? 'vencida' : 'pendiente' };
  };
  S.guardarEntrega = function (slug, lid, obj) { var e = S.leer('entregas', {}); e[slug + '|' + lid] = obj; S.guardar('entregas', e); };

  /* ventana para subir o revisar una entrega (la subida es simulada: el archivo no sale del navegador) */
  S.modalEntrega = function (c, u, lid, listo) {
    var e = S.entrega(c.slug, lid), d = D.docentes[c.docente];
    var cab = '<span class="ceja">' + u.c + ' · ' + S.esc(u.n) + '</span><h2 class="t-m" style="margin:10px 0 8px">Entregable</h2><p class="muted" style="margin-bottom:16px">' + S.esc(u.d || 'Proyecto final del curso') + '</p>';
    if (e.estado === 'aprobado' || e.estado === 'revision') {
      var m = S.modal(cab + '<div class="archivo-sub">' + S.ico('archivo') + '<div><b style="font-family:var(--f-tit)">' + S.esc(e.archivo) + '</b><small class="muted" style="display:block">Enviado el ' + S.fecha(new Date(e.fecha)) + '</small></div></div>' +
        (e.estado === 'aprobado' ? '<div class="rubrica"><div><span>Cumple lo que pide la unidad</span><b>' + (e.nota >= 4.5 ? '5,0' : '4,5') + '</b></div><div><span>Usa evidencia del negocio real</span><b>4,5</b></div><div><span>Claridad y presentación</span><b>' + String(e.nota).replace('.', ',') + '</b></div><div style="background:var(--verde-s)"><b>Nota</b><b style="color:var(--verde)">' + String(e.nota).replace('.', ',') + ' / 5</b></div></div><div class="feedback">' + S.img(S.docImg(c.docente, true), '') + '<div><b style="font-family:var(--f-tit)">' + d.nombre + '</b><p style="font-size:14.5px;margin-top:4px">' + S.esc(e.comentario) + '</p></div></div>'
          : '<div class="demo-aviso" style="margin-top:14px">' + S.ico('reloj') + '<span><b>En revisión.</b> ' + d.nombre.split(' ')[0] + ' la revisa antes de la próxima sesión en vivo (máximo 48 horas).</span></div>'));
      return m;
    }
    if (e.estado === 'bloqueada') { S.toast('Esta entrega se habilita cuando llegues a ' + u.c + '.', 'candado'); return; }
    var m2 = S.modal(cab + (e.estado === 'vencida' ? '<div class="demo-aviso" style="background:var(--rojo-s)">' + S.ico('info') + '<span>La fecha pasó, pero todavía la puedes enviar. Cuenta con nota máxima de 4,0.</span></div>' : '') +
      '<label class="subida js-zona"><input type="file" class="sr js-arch" accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.xlsx,.zip">' + S.ico('subir') + '<b style="font-family:var(--f-tit)">Arrastra tu archivo aquí</b><small class="muted">o haz clic para elegirlo · PDF, Word, PowerPoint, Excel, imagen o ZIP · máx. 50 MB</small></label>' +
      '<div class="js-estado-sub" style="margin-top:14px"></div><div class="fld" style="margin-top:14px"><label for="ent-c">Comentario para ' + d.nombre.split(' ')[0] + ' (opcional)</label><textarea id="ent-c" class="inp" placeholder="¿Algo que quieras que revise con lupa?"></textarea></div><button class="btn btn-r btn-full js-enviar" style="margin-top:16px" disabled>Enviar entregable</button>');
    var zona = $('.js-zona', m2), inp = $('.js-arch', m2), env = $('.js-enviar', m2), arch = null;
    function elegir(f) {
      if (!f) return; arch = f;
      var est = $('.js-estado-sub', m2);
      est.innerHTML = '<div class="archivo-sub">' + S.ico('archivo') + '<div><b style="font-family:var(--f-tit)">' + S.esc(f.name) + '</b><div class="barra-p verde" style="margin-top:8px"><i style="width:0"></i></div></div></div>';
      var b = $('.barra-p i', est), p = 0;
      var t = setInterval(function () { p = Math.min(100, p + 9 + Math.random() * 14); b.style.width = p + '%'; if (p >= 100) { clearInterval(t); env.disabled = false; } }, 120);
    }
    inp.addEventListener('change', function () { elegir(inp.files[0]); });
    ['dragenter', 'dragover'].forEach(function (ev) { zona.addEventListener(ev, function (x) { x.preventDefault(); zona.classList.add('sobre'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { zona.addEventListener(ev, function (x) { x.preventDefault(); zona.classList.remove('sobre'); }); });
    zona.addEventListener('drop', function (x) { elegir(x.dataTransfer.files[0]); });
    env.addEventListener('click', function () {
      S.guardarEntrega(c.slug, lid, { estado: 'revision', archivo: arch.name, fecha: new Date().toISOString() });
      if (lid) S.marcar(c.slug, lid);
      m2.cerrar(); S.toast('Entregable enviado. Te avisamos cuando tenga nota.', 'check');
      if (listo) listo();
    });
    return m2;
  };

  /* ---------- carrito ---------- */
  S.carrito = function () { return leer('carrito', []); };
  S.enCarrito = function (slug) { return S.carrito().some(function (i) { return i.slug === slug; }); };
  S.agregar = function (slug, extra, silencio) {
    var c = S.carrito();
    if (S.inscritos()[slug] && S.sesion()) { S.toast('Ya estás inscrito en este curso', 'info', '<a href="campus.html">Ir al campus</a>'); return false; }
    if (!c.some(function (i) { return i.slug === slug; })) c.push(Object.assign({ slug: slug }, extra || {}));
    else c = c.map(function (i) { return i.slug === slug ? Object.assign(i, extra || {}) : i; });
    guardar('carrito', c); S.pintarContador(true);
    if (!silencio) S.toast('Agregado al carrito', 'carrito', '<a href="carrito.html">Ver carrito</a>');
    return true;
  };
  S.quitar = function (slug) { guardar('carrito', S.carrito().filter(function (i) { return i.slug !== slug; })); S.pintarContador(); };
  S.vaciar = function () { guardar('carrito', []); S.pintarContador(); };
  S.pintarContador = function (pop) {
    var n = S.carrito().length;
    S.$$('.js-cont').forEach(function (e) { e.textContent = n; e.classList.toggle('si', n > 0); if (pop) { e.classList.remove('pop'); void e.offsetWidth; e.classList.add('pop'); } });
  };
  /* ficha de un ítem del carrito: curso, programa, ruta completa o plan Pro */
  S.item = function (it) {
    if (it.slug === 'ruta') return { titulo: D.ruta.titulo, sub: 'Los dos programas de 100 h · inicia el 9 de noviembre', img: 'assets/img/cursos/prog-ia-sm.webp', precio: D.ruta.precio, antes: D.ruta.antes, slugs: ['ia-marketing', 'seo-posicionamiento'] };
    if (it.slug === 'pro') { var p = D.planes.pro, an = it.periodo !== 'mensual'; return { titulo: 'Semply Pro · ' + (an ? 'anual' : 'mensual'), sub: an ? 'Todos los cursos cortos durante 12 meses' : 'Todos los cursos cortos · se renueva cada mes', img: 'assets/img/cursos/prompts-sm.webp', precio: an ? p.anual : p.mensual, antes: an ? p.mensual * 12 : null, slugs: D.cursos.filter(function (c) { return c.tipo === 'curso'; }).map(function (c) { return c.slug; }), pro: true }; }
    var c = D.curso(it.slug); if (!c) return null;
    var sub = c.tipo === 'programa' ? 'Programa de 100 h · ' + (c.cohortes.filter(function (k) { return k.id === it.cohorte; })[0] || c.cohortes[0]).inicio.split('-').reverse().join('/') : 'Curso · ' + S.horasTxt(c) + ' · ' + D.docentes[c.docente].nombre;
    if (it.pago === 'cuotas') sub += ' · 4 cuotas';
    return { titulo: c.titulo, sub: sub, img: S.cover(c), precio: c.precio, antes: c.antes, slugs: [c.slug], url: 'curso.html?c=' + c.slug };
  };
  S.precioItem = function (it) { var x = S.item(it); return x ? x.precio : 0; };

  /* ---------- favoritos ---------- */
  S.favs = function () { return leer('fav', []); };
  S.togFav = function (slug) { var f = S.favs(), i = f.indexOf(slug); if (i < 0) f.push(slug); else f.splice(i, 1); guardar('fav', f); return i < 0; };

  /* ---------- íconos ---------- */
  var IC = {
    buscar: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    carrito: '<path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6 5 3H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/>',
    flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>', izq: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    abajo: '<path d="m6 9 6 6 6-6"/>', der: '<path d="m9 6 6 6-6 6"/>', arriba: '<path d="m6 15 6-6 6 6"/>',
    mas: '<path d="M12 5v14M5 12h14"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>', menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    check: '<path d="m5 12 5 5L20 7"/>', reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    play: '<path d="M8 5.5v13a.5.5 0 0 0 .8.4l10-6.5a.5.5 0 0 0 0-.8l-10-6.5a.5.5 0 0 0-.8.4z" fill="currentColor"/>',
    pausa: '<rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/>',
    libro: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/>',
    video: '<rect x="3" y="5" width="14" height="14" rx="3"/><path d="m17 10 4-2v8l-4-2"/>',
    vivo: '<circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5"/>',
    taller: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7"/><path d="M12 17h.01"/>',
    corazon: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
    estrella: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    usuario: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    usuarios: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 4 6"/>',
    calendario: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    medalla: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/>',
    casa: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',
    campana: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
    salir: '<path d="M15 4h4v16h-4"/><path d="M10 8l-4 4 4 4M6 12h10"/>',
    subir: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v4h16v-4"/>',
    descargar: '<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 20h16"/>',
    archivo: '<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4"/>',
    candado: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    volumen: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/>',
    mute: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="m17 9 5 6M22 9l-5 6"/>',
    expandir: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    cc: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10.5 10.2a2 2 0 1 0 0 3.6M17 10.2a2 2 0 1 0 0 3.6"/>',
    ajustes: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    pip: '<rect x="3" y="5" width="18" height="14" rx="2"/><rect x="12" y="11" width="7" height="6" rx="1" fill="currentColor"/>',
    nota: '<path d="M5 4h14v12l-4 4H5z"/><path d="M15 20v-4h4M9 9h6M9 13h4"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    clip: '<path d="M20 11 12 19a5 5 0 0 1-7-7l8-8a3.5 3.5 0 0 1 5 5l-8 8a2 2 0 0 1-3-3l7-7"/>',
    grafica: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    rayo: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    fuego: '<path d="M12 21a7 7 0 0 0 7-7c0-4-3-6-4-9-1 2-2 3-3.5 3.5C11 6 10 4 10 2 7 5 5 9 5 14a7 7 0 0 0 7 7z"/>',
    regalo: '<rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13M12 8S10 3 7.5 4.5 9 8 12 8zM12 8s2-5 4.5-3.5S15 8 12 8z"/>',
    tarjeta: '<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20M6 15h4"/>',
    banco: '<path d="M3 10 12 4l9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18"/>',
    celular: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
    efectivo: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
    escudo: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    trofeo: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 21h8M10 17h4v4h-4z"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>',
    tiktok: '<path d="M14 3v11a4 4 0 1 1-4-4"/><path d="M14 3c.5 2.5 2.5 4.5 5 5"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>',
    youtube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor"/>',
    compartir: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/>',
    copiar: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/>',
    imprimir: '<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>',
    atras10: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    adelante10: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
    filtro: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
    edificio: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/>',
    objetivo: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>',
    chispa: '<path d="M12 3c.5 4.5 2.5 6.5 7 7-4.5.5-6.5 2.5-7 7-.5-4.5-2.5-6.5-7-7 4.5-.5 6.5-2.5 7-7z"/>',
    mundo: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    ojo: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    basura: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    lista: '<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
    rejilla: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    correo: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    pin: '<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>'
  };
  S.ico = function (n, cls) { return '<svg class="ico ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (IC[n] || '') + '</svg>'; };
  S.estrellas = function (r, n) { return '<span class="estrellas">' + S.ico('estrella') + r.toFixed(1).replace('.', ',') + (n != null ? ' <small>(' + n.toLocaleString('es-CO') + ')</small>' : '') + '</span>'; };

  /* estallido "oferta": polígono de N puntas */
  S.burst = function (txt, color, fg, s, extra) {
    var pts = [], n = 18, R = 50, r = 41;
    for (var i = 0; i < n * 2; i++) { var a = Math.PI * i / n - Math.PI / 2, rr = i % 2 ? r : R; pts.push((50 + rr * Math.cos(a)).toFixed(1) + ',' + (50 + rr * Math.sin(a)).toFixed(1)); }
    return '<div class="burst ' + (extra || '') + '" style="--s:' + (s || 120) + 'px;color:' + (fg || '#fff') + '"><svg viewBox="0 0 100 100" aria-hidden="true"><polygon points="' + pts.join(' ') + '" fill="' + (color || '#F10E3B') + '"/></svg><span>' + txt + '</span></div>';
  };

  /* ---------- tarjetas ---------- */
  S.catNombre = function (id) { var c = D.categorias.filter(function (x) { return x.id === id; })[0]; return c ? c.nombre : ''; };
  S.cardCurso = function (c) {
    var d = D.docentes[c.docente], fav = S.favs().indexOf(c.slug) >= 0;
    var tags = '';
    if (c.tipo === 'programa') tags += '<span class="tag tag-g">Programa · 100 h</span>';
    if (c.top) tags += '<span class="tag tag-y">Más vendido</span>';
    if (c.nuevo) tags += '<span class="tag tag-r">Nuevo</span>';
    if (c.antes) tags += '<span class="tag tag-b">−' + Math.round((1 - c.precio / c.antes) * 100) + ' %</span>';
    return '<article class="cc"><span class="esq"></span>' +
      '<div class="cc-img">' + S.img(S.cover(c), '') + '<div class="cc-tags">' + tags + '</div>' +
      '<button class="cc-fav' + (fav ? ' on' : '') + '" data-fav="' + c.slug + '" aria-label="Guardar en favoritos" aria-pressed="' + fav + '">' + S.ico('corazon') + '</button></div>' +
      '<div class="cc-cuerpo"><span class="cc-cat">' + S.esc(S.catNombre(c.cat)) + '</span>' +
      '<h3><a href="curso.html?c=' + c.slug + '">' + S.esc(c.titulo) + '</a></h3>' +
      '<div class="cc-doc">' + S.img(S.docImg(c.docente, true), '') + S.esc(d.nombre) + '</div>' +
      '<div class="cc-meta">' + S.estrellas(c.rating, c.resenas) + '<span>' + S.ico('reloj') + S.horasTxt(c) + '</span><span>' + S.ico('libro') + c.lecciones + ' lecciones</span></div>' +
      '<div class="cc-pie"><div class="precio">' + S.fmt(c.precio) + (c.antes ? '<s>' + S.fmt(c.antes) + '</s>' : '') + '</div><span class="tag">' + c.nivel + '</span></div>' +
      '</div></article>';
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-fav]'); if (!b) return;
    e.preventDefault(); var on = S.togFav(b.dataset.fav);
    S.$$('[data-fav="' + b.dataset.fav + '"]').forEach(function (x) { x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); });
    S.toast(on ? 'Guardado en tus favoritos' : 'Quitado de favoritos', 'corazon');
  });

  /* ---------- toast y modal ---------- */
  S.toast = function (txt, ico, extra) {
    var box = S.$('.toasts'); if (!box) { box = document.createElement('div'); box.className = 'toasts'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); document.body.appendChild(box); }
    var t = document.createElement('div'); t.className = 'toast';
    t.innerHTML = S.ico(ico === 'info' ? 'info' : ico || 'check') + '<span>' + txt + (extra ? ' ' + extra : '') + '</span>';
    box.appendChild(t);
    setTimeout(function () { t.classList.add('sale'); setTimeout(function () { t.remove(); }, 320); }, 3400);
  };
  S.modal = function (html, cls) {
    var m = document.createElement('div'); m.className = 'modal';
    m.innerHTML = '<div class="modal-caja ' + (cls || '') + '" role="dialog" aria-modal="true"><button class="modal-x" aria-label="Cerrar">' + S.ico('x') + '</button>' + html + '</div>';
    var prev = document.activeElement;
    function cerrar() { m.remove(); document.removeEventListener('keydown', esc); document.body.style.overflow = ''; if (prev && prev.focus) prev.focus(); if (m.onclose) m.onclose(); }
    function esc(e) { if (e.key === 'Escape') cerrar(); }
    m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('.modal-x')) cerrar(); });
    document.addEventListener('keydown', esc);
    document.body.appendChild(m); document.body.style.overflow = 'hidden';
    var f = m.querySelector('input, button:not(.modal-x), a'); setTimeout(function () { (f || m.querySelector('.modal-x')).focus(); }, 50);
    m.cerrar = cerrar; return m;
  };

  /* ---------- buscador ---------- */
  function norm(t) { return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  S.buscar = function (q) {
    q = norm(q.trim()); if (!q) return [];
    var ws = q.split(/\s+/);
    return D.cursos.map(function (c) {
      var hay = norm([c.titulo, c.sub, S.catNombre(c.cat), D.docentes[c.docente].nombre].join(' ') + ' ' + c.unidades.map(function (u) { return u.n + ' ' + u.lecciones.map(function (l) { return l.t; }).join(' '); }).join(' '));
      var p = 0; ws.forEach(function (w) { if (hay.indexOf(w) >= 0) p += 1; if (norm(c.titulo).indexOf(w) >= 0) p += 3; });
      return { c: c, p: p };
    }).filter(function (x) { return x.p >= ws.length; }).sort(function (a, b) { return b.p - a.p; }).map(function (x) { return x.c; });
  };
  S.montarBuscador = function (raiz) {
    var inp = S.$('input', raiz), res = S.$('.busca-res', raiz), sel = -1;
    function marcar(t, q) { if (!q) return S.esc(t); var i = norm(t).indexOf(norm(q.split(' ')[0])); if (i < 0) return S.esc(t); var l = q.split(' ')[0].length; return S.esc(t.slice(0, i)) + '<mark>' + S.esc(t.slice(i, i + l)) + '</mark>' + S.esc(t.slice(i + l)); }
    function pintar() {
      var q = inp.value.trim(); sel = -1;
      if (!q) { res.classList.remove('si'); return; }
      var r = S.buscar(q).slice(0, 6);
      res.innerHTML = r.length ? r.map(function (c) { return '<a href="curso.html?c=' + c.slug + '">' + S.img(S.cover(c), '') + '<div><b>' + marcar(c.titulo, q) + '</b><small>' + (c.tipo === 'programa' ? 'Programa · 100 h' : 'Curso · ' + S.horasTxt(c)) + ' · ' + S.esc(D.docentes[c.docente].nombre) + '</small></div>' + S.ico('der') + '</a>'; }).join('') + '<a href="cursos.html?q=' + encodeURIComponent(q) + '" style="grid-template-columns:1fr auto"><b>Ver todos los resultados de «' + S.esc(q) + '»</b>' + S.ico('flecha') + '</a>'
        : '<div class="busca-vacio">No encontramos «' + S.esc(q) + '». Prueba con <b>prompts</b>, <b>SEO</b> o <b>reels</b>.</div>';
      res.classList.add('si');
    }
    inp.addEventListener('input', pintar);
    inp.addEventListener('focus', pintar);
    inp.addEventListener('keydown', function (e) {
      var as = S.$$('a', res);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + as.length) % as.length; as.forEach(function (a, i) { a.classList.toggle('activo', i === sel); }); }
      if (e.key === 'Enter') { e.preventDefault(); if (sel >= 0 && as[sel]) location.href = as[sel].href; else if (inp.value.trim()) location.href = 'cursos.html?q=' + encodeURIComponent(inp.value.trim()); }
      if (e.key === 'Escape') { res.classList.remove('si'); inp.blur(); }
    });
    document.addEventListener('click', function (e) { if (!raiz.contains(e.target)) res.classList.remove('si'); });
  };

  /* ---------- encabezado y pie ---------- */
  S.header = function (activo) {
    var u = S.sesion(), progs = D.cursos.filter(function (c) { return c.tipo === 'programa'; });
    var cats = D.categorias.map(function (k) { var n = D.cursos.filter(function (c) { return c.cat === k.id; }).length; return '<a href="cursos.html?cat=' + k.id + '">' + k.nombre + '<span>' + n + '</span></a>'; }).join('');
    var prog = progs.map(function (c) { return '<a href="curso.html?c=' + c.slug + '">' + S.img(S.cover(c), '') + '<div><b>' + c.titulo + '</b><small>100 h · inicia el ' + S.fecha(c.cohortes[0].inicio) + '</small></div></a>'; }).join('');
    var cur = function (k) { return activo === k ? ' aria-current="page"' : ''; };
    var h = '<div class="wrap">' +
      '<a class="logo" href="index.html" aria-label="Semply, inicio">' + S.img('assets/img/logo-color.png', 'Semply', 'width="160" height="41"') + '</a>' +
      '<nav class="nav" aria-label="Principal">' +
      '<div class="dd"><button aria-expanded="false" aria-haspopup="true">Explorar ' + S.ico('abajo') + '</button><div class="dd-panel"><div class="dd-cats">' + cats + '<a href="cursos.html" style="color:var(--rojo)">Ver todo el catálogo ' + S.ico('flecha') + '</a></div><div class="dd-prog"><span class="ceja" style="padding:6px 8px 0">Programas de 100 horas</span>' + prog + '</div></div></div>' +
      '<a href="index.html#programas"' + cur('programas') + '>Programas</a><a href="cursos.html"' + cur('cursos') + '>Cursos</a><a href="empresas.html"' + cur('empresas') + '>Empresas</a><a href="index.html#planes"' + cur('planes') + '>Planes</a></nav>' +
      '<div class="hdr-der">' +
      '<a class="icob" href="cursos.html" aria-label="Buscar cursos">' + S.ico('buscar') + '</a>' +
      '<a class="icob" href="carrito.html" aria-label="Carrito">' + S.ico('carrito') + '<span class="contador js-cont">0</span></a>' +
      (u ? '<a class="hdr-user solo-esc" href="campus.html"><span class="avatar">' + S.iniciales(u.nombre) + '</span>Mi campus</a>'
         : '<a class="btn btn-o btn-s solo-esc" href="ingresar.html">Ingresar</a><a class="btn btn-r btn-s solo-esc" href="ingresar.html?modo=registro">Empieza gratis</a>') +
      '<button class="icob burger" aria-label="Abrir menú">' + S.ico('menu') + '</button></div></div>';
    var el = S.$('#hdr'); el.className = 'hdr'; el.innerHTML = h;
    // menú desplegable
    var dd = S.$('.dd', el), bt = S.$('button', dd), t;
    dd.addEventListener('mouseenter', function () { clearTimeout(t); dd.classList.add('abierto'); bt.setAttribute('aria-expanded', 'true'); });
    dd.addEventListener('mouseleave', function () { t = setTimeout(function () { dd.classList.remove('abierto'); bt.setAttribute('aria-expanded', 'false'); }, 160); });
    bt.addEventListener('click', function () { var a = dd.classList.toggle('abierto'); bt.setAttribute('aria-expanded', a); });
    // cajón móvil
    S.$('.burger', el).addEventListener('click', function () {
      var c = document.createElement('div'); c.className = 'cajon abierto';
      c.innerHTML = '<div class="cajon-fondo"></div><div class="cajon-panel" role="dialog" aria-label="Menú"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' + S.img('assets/img/logo-color.png', 'Semply', 'style="height:26px;width:auto"') + '<button class="icob js-x" aria-label="Cerrar">' + S.ico('x') + '</button></div>' +
        '<a href="index.html#programas">Programas ' + S.ico('der') + '</a><a href="cursos.html">Cursos ' + S.ico('der') + '</a><a href="empresas.html">Empresas ' + S.ico('der') + '</a><a href="index.html#planes">Planes ' + S.ico('der') + '</a><a href="carrito.html">Carrito ' + S.ico('der') + '</a>' +
        '<div style="margin-top:auto;display:grid;gap:10px;padding-top:20px">' + (u ? '<a class="btn btn-r" href="campus.html">Ir a mi campus</a>' : '<a class="btn btn-r" href="ingresar.html?modo=registro">Empieza gratis</a><a class="btn btn-o" href="ingresar.html">Ingresar</a>') + '</div></div>';
      document.body.appendChild(c); document.body.style.overflow = 'hidden';
      function cerrar() { c.remove(); document.body.style.overflow = ''; }
      c.addEventListener('click', function (e) { if (e.target.classList.contains('cajon-fondo') || e.target.closest('.js-x') || e.target.closest('a')) cerrar(); });
    });
    window.addEventListener('scroll', function () { el.classList.toggle('scroll', scrollY > 8); }, { passive: true });
    S.pintarContador();
  };

  S.footer = function () {
    var f = S.$('#pie'); if (!f) return;
    f.className = 'pie';
    f.innerHTML = '<div class="pie-patron" aria-hidden="true"></div><div class="wrap"><div class="pie-grid">' +
      '<div><a class="pie-logo" href="index.html">' + S.img('assets/img/logo-blanco-rojo.png', 'Semply', 'width="160" height="41"') + '</a><p>Academia virtual de marketing e inteligencia artificial. Porque el marketing no tiene por qué ser complicado.</p>' +
      '<form class="pie-news js-news"><label class="sr" for="news">Tu correo</label><input class="inp" id="news" type="email" placeholder="Tu correo" required><button class="btn btn-y">Suscribirme</button></form>' +
      '<div class="pie-redes"><a href="#" aria-label="Instagram">' + S.ico('instagram') + '</a><a href="#" aria-label="TikTok">' + S.ico('tiktok') + '</a><a href="#" aria-label="LinkedIn">' + S.ico('linkedin') + '</a><a href="#" aria-label="YouTube">' + S.ico('youtube') + '</a></div></div>' +
      '<div><h4>Aprende</h4><ul><li><a href="curso.html?c=ia-marketing">IA aplicada al marketing</a></li><li><a href="curso.html?c=seo-posicionamiento">SEO y posicionamiento web</a></li><li><a href="cursos.html">Todos los cursos</a></li><li><a href="index.html#planes">Semply Pro</a></li></ul></div>' +
      '<div><h4>Semply</h4><ul><li><a href="empresas.html">Para empresas</a></li><li><a href="index.html#docentes">Docentes</a></li><li><a href="#" class="js-pronto">Enseña en Semply</a></li><li><a href="#" class="js-pronto">Blog</a></li></ul></div>' +
      '<div><h4>Ayuda</h4><ul><li><a href="index.html#faq">Preguntas frecuentes</a></li><li><a href="ingresar.html">Mi campus</a></li><li><a href="mailto:hola@semply.co">hola@semply.co</a></li><li><a href="#" class="js-pronto">WhatsApp +57 300 000 0000</a></li></ul></div>' +
      '</div><div class="pie-gigante" aria-hidden="true">semply</div><div class="pie-legal"><span>© 2026 Semply. Educación informal: entrega constancia de asistencia y aprobación, no título.</span><span><a href="#" class="js-pronto">Términos</a> · <a href="#" class="js-pronto">Privacidad y datos (Ley 1581)</a> · Sitio por BLACKMOUTH</span></div></div>';
    S.$('.js-news', f).addEventListener('submit', function (e) { e.preventDefault(); e.target.reset(); S.toast('¡Listo! Te llega una clase gratis cada mes.', 'correo'); });
  };
  document.addEventListener('click', function (e) { if (e.target.closest('.js-pronto')) { e.preventDefault(); S.toast('Esta sección llega con la versión final del sitio.', 'info'); } });

  /* ---------- acordeón y aparición ---------- */
  S.acordeon = function (raiz) {
    S.$$('.acc-bt', raiz).forEach(function (b) {
      b.addEventListener('click', function () { var it = b.closest('.acc-it'); var a = it.classList.toggle('abierto'); b.setAttribute('aria-expanded', a); });
    });
  };
  S.revelar = function () {
    var els = S.$$('.rv:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
    // respaldo: si el observador no dispara (pestaña en segundo plano), revisa al hacer scroll
    if (!S._rvScroll) { S._rvScroll = true; var pend = false; window.addEventListener('scroll', function () { if (pend) return; pend = true; requestAnimationFrame(function () { pend = false; var h = innerHeight; S.$$('.rv:not(.in)').forEach(function (e) { var r = e.getBoundingClientRect(); if (r.top < h * .95 && r.bottom > 0) e.classList.add('in'); }); }); }, { passive: true }); }
  };
  S.contar = function (el, hasta, dur, dec) {
    var t0 = null; dur = dur || 1400;
    function paso(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); var v = hasta * e; el.textContent = dec ? v.toFixed(dec).replace('.', ',') : Math.round(v).toLocaleString('es-CO'); if (p < 1) requestAnimationFrame(paso); }
    requestAnimationFrame(paso);
  };

  /* clase de muestra en modal */
  S.verClase = function () {
    S.modal('<video controls autoplay playsinline poster="assets/media/leccion-poster.webp" style="width:100%;aspect-ratio:16/9;display:block"><source src="assets/media/leccion-anatomia-prompt.mp4" type="video/mp4"><track kind="captions" srclang="es" label="Español" src="assets/media/leccion-anatomia-prompt.vtt" default></video>', 'ancha');
  };

  S.iniciar = function (activo) { if (S.$('#hdr')) S.header(activo); S.footer(); S.revelar(); };
})();
