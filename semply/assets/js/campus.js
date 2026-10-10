/* Semply · campus del estudiante (rutas por #hash) */
(function () {
  var S = Semply, D = SEMPLY, $ = S.$, $$ = S.$$;
  var u = S.sesion(); if (!u) return;
  var VISTAS = [['inicio', 'Inicio', 'casa'], ['cursos', 'Mis cursos', 'libro'], ['calendario', 'Calendario', 'calendario'], ['entregas', 'Entregas', 'taller'], ['certificados', 'Constancias', 'medalla'], ['perfil', 'Perfil', 'usuario']];
  var esDemo = u.correo === D.ESTUDIANTE_DEMO.correo;
  var calMes = null;

  function ahora() { return new Date(); }
  function ins() { return S.inscritos(); }
  function misCursos() { return Object.keys(ins()).map(D.curso).filter(Boolean); }
  function pendientes() {
    return S.agenda().filter(function (e) { if (e.tipo !== 'entrega') return false; var st = S.entrega(e.slug, e.lid, e.fecha, e.i).estado; return st === 'pendiente' || st === 'vencida'; });
  }
  function proxVivo() { var n = ahora(); return S.agenda().filter(function (e) { return e.tipo === 'vivo' && e.fin > n; }); }
  function horasSemana() {
    var lim = Date.now() - 7 * 864e5, min = 0;
    Object.keys(ins()).forEach(function (s) { var c = D.curso(s), h = ins()[s].hechas; S.lecciones(c).forEach(function (l) { if (h[l.id] > lim) min += l.tipo === 'video' ? l.min : Math.min(l.min, 60); }); });
    return Math.round(((esDemo ? 6.5 : 0) + min / 60) * 10) / 10;
  }

  /* ---------- marco ---------- */
  function marco(v) {
    var pend = pendientes().length;
    $('.js-nav').innerHTML = VISTAS.map(function (x) { return '<a href="#' + x[0] + '" class="' + (x[0] === v ? 'on' : '') + '">' + S.ico(x[2]) + x[1] + (x[0] === 'entregas' && pend ? '<span class="badge">' + pend + '</span>' : '') + '</a>'; }).join('');
    $('.js-tabbar').innerHTML = VISTAS.filter(function (x) { return x[0] !== 'certificados'; }).map(function (x) { return '<a href="#' + x[0] + '" class="' + (x[0] === v ? 'on' : '') + '">' + S.ico(x[2]) + x[1].replace('Mis c', 'C') + '</a>'; }).join('');
    $('.js-titulo').textContent = VISTAS.filter(function (x) { return x[0] === v; })[0][1];
    $('.js-av').textContent = S.iniciales(u.nombre);
    $('.js-plan').innerHTML = u.plan ? '<span class="tag tag-y">' + S.ico('chispa') + u.plan + '</span><p style="margin-top:8px">Tienes todos los cursos cortos. Renueva el 10 de octubre de 2027.</p>' : '<b>Pásate a Semply Pro</b><p style="margin:6px 0 10px">Todos los cursos cortos por ' + S.fmt(D.planes.pro.anual) + ' al año.</p><a class="btn btn-y btn-s" href="index.html#planes">Ver planes</a>';
  }

  /* ---------- notificaciones ---------- */
  function notifs() {
    var l = [], ent = S.leer('entregas', {});
    var pv = proxVivo()[0];
    if (pv) l.push({ ic: 'vivo', t: '<b>' + pv.t + '</b> el ' + S.fecha(pv.fecha, true) + ' a las ' + S.hora(pv.fecha), f: 'Recordatorio', n: true });
    Object.keys(ent).forEach(function (k) { var e = ent[k], c = D.curso(k.split('|')[0]); if (e.estado === 'aprobado') l.push({ img: S.docImg(c.docente, true), t: '<b>' + D.docentes[c.docente].nombre + '</b> calificó tu entregable con <b>' + String(e.nota).replace('.', ',') + '</b>', f: S.fecha(new Date(e.fecha)), n: true }); });
    var pe = pendientes()[0]; if (pe) l.push({ ic: 'taller', t: 'Tu entrega de <b>' + pe.u.c + '</b> vence el ' + S.fecha(pe.fecha, true), f: 'Entregas' });
    l.push({ ic: 'chispa', t: 'Nuevo curso: <b>Fotos de producto con IA</b>, con Laura Mejía', f: 'Hace 3 días' });
    $('.js-notif-panel').innerHTML = '<h4>Notificaciones <button class="lnk js-leidas" style="font-size:13px">Marcar como leídas</button></h4>' + l.map(function (x) { return '<div class="notif-it' + (x.n && !S.leer('notifLeidas', false) ? ' nueva' : '') + '">' + (x.img ? S.img(x.img, '') : '<span class="ic">' + S.ico(x.ic) + '</span>') + '<div>' + x.t + '<small>' + x.f + '</small></div></div>'; }).join('');
    $('.js-punto').style.display = S.leer('notifLeidas', false) ? 'none' : '';
  }
  $('.js-campana').addEventListener('click', function (e) { e.stopPropagation(); var n = $('.js-notif'); var a = n.classList.toggle('abierto'); this.setAttribute('aria-expanded', a); });
  document.addEventListener('click', function (e) { if (!e.target.closest('.js-notif')) $('.js-notif').classList.remove('abierto'); if (e.target.closest('.js-leidas')) { S.guardar('notifLeidas', true); notifs(); } });

  /* ---------- piezas ---------- */
  function tarjetaMia(c) {
    var p = S.progreso(c.slug), sig = S.siguiente(c.slug);
    return '<article class="mc"><a class="mc-img" href="clase.html?c=' + c.slug + '">' + S.img(S.cover(c), '') + '<span class="tag ' + (c.tipo === 'programa' ? 'tag-g' : 'tag-b') + '">' + (c.tipo === 'programa' ? 'Programa' : 'Curso') + '</span></a><div class="mc-c"><h3>' + c.titulo + '</h3>' +
      '<div><div class="barra-p' + (p === 100 ? ' verde' : '') + '"><i style="width:' + p + '%"></i></div><div class="prog-txt"><span>' + (p === 100 ? 'Terminado' : p + ' % completado') + '</span><span>' + S.esc(D.docentes[c.docente].nombre) + '</span></div></div>' +
      (p === 100 ? '<a class="btn btn-o btn-s" href="certificado.html?c=' + c.slug + '">' + S.ico('medalla') + 'Ver constancia</a>' : '<p class="sig">Siguiente: ' + S.esc(sig.t) + '</p><a class="btn btn-r btn-s" href="clase.html?c=' + c.slug + '&l=' + sig.id + '">' + (p ? 'Continuar' : 'Empezar') + '</a>') + '</div></article>';
  }
  function filaEvento(e, conBoton) {
    var n = ahora(), vivoYa = e.tipo === 'vivo' && e.fecha - n < 15 * 6e4 && e.fin > n;
    var dia = e.fecha.toDateString() === n.toDateString();
    return '<div class="fila-ev"><span class="fecha-c' + (dia ? ' rojo' : '') + '"><b>' + e.fecha.getDate() + '</b><small>' + S.MESES[e.fecha.getMonth()].slice(0, 3) + '</small></span><div><b>' + S.esc(e.t) + '</b><small>' + (e.tipo === 'vivo' ? S.DIAS[e.fecha.getDay()] + ' · ' + S.hora(e.fecha) + ' · ' + S.esc(D.docentes[e.c.docente].nombre) : 'Vence ' + S.DIAS[e.fecha.getDay()] + ' a las 11:59 p. m.') + '</small></div>' +
      (conBoton ? (e.tipo === 'vivo' ? (vivoYa ? '<a class="btn btn-r btn-s" href="clase.html?c=' + e.slug + '&l=' + e.lid + '"><span class="punto-vivo" style="color:#fff"></span>Unirme</a>' : '<button class="btn btn-o btn-s js-ics" data-k="' + e.slug + '|' + e.lid + '">' + S.ico('calendario') + '<span class="sr">Agregar al calendario</span></button>') : '<button class="btn btn-o btn-s js-entregar" data-k="' + e.slug + '|' + e.lid + '">Entregar</button>') : '') + '</div>';
  }
  function buscarEv(k) { var p = k.split('|'); return S.agenda().filter(function (e) { return e.slug === p[0] && e.lid === p[1]; })[0]; }

  /* ---------- vistas ---------- */
  var V = {};
  V.inicio = function () {
    var mc = misCursos();
    if (!mc.length) return '<div class="panel saludo"><div><span class="ceja">Te damos la bienvenida</span><h2>Hola, ' + S.esc(u.nombre.split(' ')[0]) + '.</h2><p>Tu campus está listo. Elige tu primer curso: la primera clase de cada uno es gratis.</p></div></div><div class="panel" style="margin-top:20px"><h2>Para empezar</h2><div class="mis">' + D.cursos.filter(function (c) { return c.top || c.tipo === 'programa'; }).slice(0, 3).map(function (c) { return '<article class="mc"><a class="mc-img" href="curso.html?c=' + c.slug + '">' + S.img(S.cover(c), '') + '</a><div class="mc-c"><h3>' + c.titulo + '</h3><p class="sig">' + S.horasTxt(c) + ' · ' + S.fmt(c.precio) + '</p><a class="btn btn-r btn-s" href="curso.html?c=' + c.slug + '">Ver curso</a></div></article>'; }).join('') + '</div></div>';
    var hs = horasSemana(), meta = 10, pct = Math.min(1, hs / meta), R = 54, C = 2 * Math.PI * R;
    var hoy = ahora(), dsem = (hoy.getDay() + 6) % 7, racha = esDemo ? Math.min(4, dsem + 1) : (horasSemana() > 0 ? 1 : 0);
    var dias = ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(function (l, i) { return '<span class="' + (i <= dsem && i > dsem - racha ? 'si' : '') + (i === dsem ? ' hoy' : '') + '">' + l + '</span>'; }).join('');
    var enCurso = mc.filter(function (c) { return S.progreso(c.slug) < 100; });
    var foco = enCurso.sort(function (a, b) { return (b.tipo === 'programa') - (a.tipo === 'programa'); })[0] || mc[0];
    var sig = S.siguiente(foco.slug), p = S.progreso(foco.slug);
    var vivos = proxVivo().slice(0, 3), pend = pendientes().slice(0, 3);
    var prog = mc.filter(function (c) { return c.tipo === 'programa'; })[0];
    var rec = D.cursos.filter(function (c) { return !ins()[c.slug] && c.tipo === 'curso'; })[0];
    return '<div class="ini"><div class="ini-col">' +
      '<section class="panel saludo"><div><span class="ceja">' + S.DIAS[hoy.getDay()] + ' ' + S.fecha(hoy) + '</span><h2>Hola, ' + S.esc(u.nombre.split(' ')[0]) + '.</h2><p>' + (pend.length ? 'Tienes ' + pend.length + (pend.length === 1 ? ' entrega pendiente' : ' entregas pendientes') + (vivos[0] ? ' y una sesión en vivo el ' + S.DIAS[vivos[0].fecha.getDay()] : '') + '.' : 'Vas al día. Buen momento para adelantar la próxima lección.') + '</p>' +
      (racha ? '<span class="racha">' + S.ico('fuego') + racha + (racha === 1 ? ' día' : ' días') + ' seguidos aprendiendo</span>' : '') + '<div class="dias">' + dias + '</div></div>' +
      '<div class="anillo-m" title="Meta de la semana"><svg viewBox="0 0 132 132"><circle class="f" cx="66" cy="66" r="' + R + '"/><circle class="v js-anillo" cx="66" cy="66" r="' + R + '" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '" data-o="' + (C * (1 - pct)) + '"/></svg><div><b>' + String(hs).replace('.', ',') + '</b><small>de ' + meta + ' h esta semana</small></div></div></section>' +
      '<section class="panel"><h2>Continúa donde ibas</h2><div class="seguir" style="padding:0"><a class="seguir-img" href="clase.html?c=' + foco.slug + '&l=' + sig.id + '">' + S.img(sig.id === 'u2-1' ? 'assets/media/leccion-poster.webp' : S.cover(foco), '') + '<span class="play">' + S.ico('play') + '</span></a><div><span class="tag">' + (sig.u ? sig.u.c + ' · ' + S.esc(sig.u.n) : '') + '</span><h3>' + S.esc(sig.t) + '</h3><p class="muted" style="font-size:14.5px;margin-bottom:12px">' + foco.titulo + ' · ' + S.dur(sig.min) + '</p><div class="barra-p"><i style="width:' + p + '%"></i></div><div class="prog-txt"><span>' + p + ' % del ' + (foco.tipo === 'programa' ? 'programa' : 'curso') + '</span></div><a class="btn btn-r" style="margin-top:14px" href="clase.html?c=' + foco.slug + '&l=' + sig.id + '">' + S.ico('play') + 'Continuar clase</a></div></div></section>' +
      '<section class="panel"><h2>Mis cursos <a class="lnk" href="#cursos">Ver todos</a></h2><div class="mis">' + mc.slice(0, 3).map(tarjetaMia).join('') + '</div></section>' +
      '</div><div class="ini-col">' +
      (vivos.length ? '<section class="panel"><h2>En vivo <a class="lnk" href="#calendario">Calendario</a></h2><div class="lista">' + vivos.map(function (e) { return filaEvento(e, true); }).join('') + '</div></section>' : '') +
      (pend.length ? '<section class="panel"><h2>Por entregar <a class="lnk" href="#entregas">Todas</a></h2><div class="lista">' + pend.map(function (e) { return filaEvento(e, true); }).join('') + '</div></section>' : '') +
      (prog ? '<section class="anuncio">' + S.img(S.docImg(prog.docente, true), '') + '<div><b>' + D.docentes[prog.docente].nombre + '</b> <small class="muted">· anuncio</small><p>Esta semana la clínica es sobre contexto: lleven la ficha del negocio abierta. Vamos a corregir prompts en vivo con los de ustedes.</p></div></section>' : '') +
      (rec ? '<section class="panel"><h2>Te puede servir</h2>' + S.cardCurso(rec) + '</section>' : '') +
      '</div></div>';
  };
  V.cursos = function () {
    var f = location.hash.split('/')[1] || 'curso';
    var mc = misCursos(), act = mc.filter(function (c) { return S.progreso(c.slug) < 100; }), fin = mc.filter(function (c) { return S.progreso(c.slug) === 100; });
    var favs = S.favs().map(D.curso).filter(function (c) { return c && !ins()[c.slug]; });
    var l = f === 'terminados' ? fin.map(tarjetaMia) : f === 'favoritos' ? favs.map(S.cardCurso) : act.map(tarjetaMia);
    return '<div class="tabs"><a class="chip' + (f === 'curso' ? ' on' : '') + '" href="#cursos/curso">En curso (' + act.length + ')</a><a class="chip' + (f === 'terminados' ? ' on' : '') + '" href="#cursos/terminados">Terminados (' + fin.length + ')</a><a class="chip' + (f === 'favoritos' ? ' on' : '') + '" href="#cursos/favoritos">Favoritos (' + favs.length + ')</a><a class="chip" href="cursos.html">' + S.ico('mas') + 'Explorar catálogo</a></div>' +
      (l.length ? '<div class="mis">' + l.join('') + '</div>' : '<div class="panel vacio-app">' + S.burst('Nada', '#FFC225', '#373435', 90) + '<h2 class="t-s">' + (f === 'favoritos' ? 'Todavía no guardas favoritos' : f === 'terminados' ? 'Aún no terminas ningún curso' : 'No tienes cursos en curso') + '</h2><a class="btn btn-r" href="cursos.html">Ir al catálogo</a></div>');
  };
  V.calendario = function () {
    var n = ahora(); if (!calMes) calMes = new Date(n.getFullYear(), n.getMonth(), 1);
    var ev = S.agenda(), y = calMes.getFullYear(), m = calMes.getMonth();
    var ini = new Date(y, m, 1), off = (ini.getDay() + 6) % 7, celdas = '';
    for (var i = 0; i < 42; i++) {
      var d = new Date(y, m, 1 - off + i);
      var es = ev.filter(function (e) { return e.fecha.toDateString() === d.toDateString(); });
      celdas += '<div class="cal-d' + (d.getMonth() !== m ? ' fuera' : '') + (d.toDateString() === n.toDateString() ? ' hoy' : '') + '"><span>' + d.getDate() + '</span>' + es.map(function (e) { return '<span class="ev ev-' + e.tipo + '" title="' + S.esc(e.t) + '">' + (e.tipo === 'vivo' ? '7 p. m. ' : '') + S.esc(e.tipo === 'vivo' ? 'En vivo ' + e.u.c : 'Entrega ' + e.u.c) + '</span>'; }).join('') + '</div>';
      if (i === 34 && new Date(y, m, 1 - off + 35).getMonth() !== m) break;
    }
    var prox = ev.filter(function (e) { return (e.fin || e.fecha) > n; }).slice(0, 6);
    return '<div class="cal"><section class="panel"><div class="cal-cab"><h2>' + S.MESES[m] + ' ' + y + '</h2><div class="flechas" style="display:flex;gap:6px"><button class="icob js-mes" data-d="-1" aria-label="Mes anterior">' + S.ico('izq') + '</button><button class="btn btn-o btn-s js-mes" data-d="0">Hoy</button><button class="icob js-mes" data-d="1" aria-label="Mes siguiente">' + S.ico('flecha') + '</button></div></div>' +
      '<div class="cal-grid">' + ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'].map(function (x) { return '<span class="dn">' + x + '</span>'; }).join('') + celdas + '</div><div class="leyenda" style="margin-top:14px"><span><i class="c-vivo"></i>Sesión en vivo</span><span><i class="c-prac"></i>Entrega</span></div></section>' +
      '<section class="panel"><h2>Próximos</h2>' + (prox.length ? '<div class="lista">' + prox.map(function (e) { return filaEvento(e, true); }).join('') + '</div>' : '<p class="muted">Tus cursos cortos no tienen fechas: los ves a tu ritmo.</p>') + '</section></div>';
  };
  V.entregas = function () {
    var ev = S.agenda().filter(function (e) { return e.tipo === 'entrega'; });
    if (!ev.length) return '<div class="panel vacio-app">' + S.burst('Libre', '#FFC225', '#373435', 90) + '<h2 class="t-s">No tienes entregas con fecha</h2><p class="muted">Las entregas revisadas por docentes son parte de los programas de 100 horas.</p><a class="btn btn-r" href="index.html#programas">Ver programas</a></div>';
    var EST = { aprobado: ['tag-v', 'Aprobado'], revision: ['tag-y', 'En revisión'], pendiente: ['tag', 'Pendiente'], vencida: ['tag-r', 'Vencida'], bloqueada: ['tag', 'Bloqueada'] };
    var porC = {}; ev.forEach(function (e) { (porC[e.slug] = porC[e.slug] || []).push(e); });
    return Object.keys(porC).map(function (s) {
      var c = D.curso(s), l = porC[s];
      var aprob = l.filter(function (e) { return S.entrega(s, e.lid, e.fecha, e.i).estado === 'aprobado'; });
      var prom = aprob.length ? aprob.reduce(function (a, e) { return a + S.entrega(s, e.lid).nota; }, 0) / aprob.length : 0;
      return '<section class="panel" style="margin-bottom:20px"><h2>' + c.titulo + '<span class="muted" style="font-family:var(--f-txt);font-size:14.5px;font-weight:500">' + aprob.length + ' de ' + l.length + ' aprobadas' + (prom ? ' · promedio ' + prom.toFixed(1).replace('.', ',') : '') + '</span></h2>' +
        l.map(function (e) {
          var st = S.entrega(s, e.lid, e.fecha, e.i), t = EST[st.estado];
          return '<div class="ent' + (st.estado === 'bloqueada' ? ' bloq' : '') + '"><span class="u">' + e.u.c + '</span><div><b>' + S.esc(e.u.d) + '</b><small>' + (st.estado === 'aprobado' || st.estado === 'revision' ? 'Enviado el ' + S.fecha(new Date(st.fecha)) : 'Vence el ' + S.fecha(e.fecha, true)) + '</small></div><span class="tag ' + t[0] + '">' + (st.estado === 'aprobado' ? '<span class="nota-g" style="font-size:1rem">' + String(st.nota).replace('.', ',') + '</span> ' : '') + t[1] + '</span>' +
            (st.estado === 'bloqueada' ? '<span class="muted">' + S.ico('candado') + '</span>' : '<button class="btn ' + (st.estado === 'pendiente' || st.estado === 'vencida' ? 'btn-r' : 'btn-o') + ' btn-s js-entregar" data-k="' + s + '|' + e.lid + '">' + (st.estado === 'aprobado' ? 'Ver nota' : st.estado === 'revision' ? 'Ver envío' : 'Entregar') + '</button>') + '</div>';
        }).join('') + '</section>';
    }).join('');
  };
  V.certificados = function () {
    var mc = misCursos();
    if (!mc.length) return '<div class="panel vacio-app"><h2 class="t-s">Aún no tienes constancias</h2><a class="btn btn-r" href="cursos.html">Elegir un curso</a></div>';
    return '<p class="muted" style="margin-bottom:18px">Semply es educación informal: cada curso aprobado entrega una constancia digital con código de verificación.</p><div class="certs">' + mc.map(function (c) {
      var p = S.progreso(c.slug);
      return p === 100 ? '<article class="cert ok">' + S.burst('¡Hecho!', '#F10E3B', '#fff', 92) + '<span class="ceja">Constancia</span><h3>' + c.titulo + '</h3><p class="muted">' + S.horasTxt(c) + ' · ' + D.docentes[c.docente].nombre + '</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px"><a class="btn btn-r btn-s" href="certificado.html?c=' + c.slug + '">' + S.ico('ojo') + 'Ver y descargar</a><a class="btn btn-o btn-s" target="_blank" rel="noopener" href="https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=' + encodeURIComponent(c.titulo) + '&organizationName=Semply">' + S.ico('linkedin') + 'Agregar a LinkedIn</a></div></article>'
        : '<article class="cert bloq">' + '<span class="ceja" style="color:var(--gris-4)">' + S.ico('candado') + 'Bloqueada</span><h3>' + c.titulo + '</h3><div class="barra-p"><i style="width:' + p + '%"></i></div><p class="muted" style="font-size:14px">Te falta el ' + (100 - p) + ' %' + (c.tipo === 'programa' ? ' y la sustentación final.' : '.') + '</p></article>';
    }).join('') + '</div>';
  };
  V.perfil = function () {
    var on = S.leer('ajustes', { vivo: true, semanal: true, wa: false });
    return '<div class="perfil"><form class="panel js-perfil"><h2>Tus datos</h2><div style="display:flex;gap:18px;align-items:center;margin-bottom:22px"><span class="avatar av-grande">' + S.iniciales(u.nombre) + '</span><div><b style="font-family:var(--f-tit);font-size:1.3rem">' + S.esc(u.nombre) + '</b><p class="muted">' + S.esc(u.correo) + '</p></div></div><div class="form-2">' +
      '<div class="fld"><label for="pf-n">Nombre</label><input id="pf-n" name="nombre" class="inp" value="' + S.esc(u.nombre) + '"></div><div class="fld"><label for="pf-c">Correo</label><input id="pf-c" name="correo" type="email" class="inp" value="' + S.esc(u.correo) + '"></div>' +
      '<div class="fld"><label for="pf-ci">Ciudad</label><input id="pf-ci" name="ciudad" class="inp" value="' + S.esc(u.ciudad || '') + '"></div><div class="fld"><label for="pf-ne">Negocio con el que practicas</label><input id="pf-ne" name="negocio" class="inp" value="' + S.esc(u.negocio || '') + '" placeholder="Tu marca, la de un cliente o la de Semply"></div>' +
      '<div class="fld full"><label for="pf-b">Sobre ti (lo ven tus compañeros)</label><textarea id="pf-b" name="bio" class="inp" placeholder="Qué haces y qué quieres aprender">' + S.esc(u.bio || '') + '</textarea></div></div><button class="btn btn-r" style="margin-top:18px">Guardar cambios</button></form>' +
      '<div class="ini-col"><section class="panel"><h2>Avisos</h2>' + [['vivo', 'Recordatorio de sesiones en vivo', '1 hora antes, por correo'], ['semanal', 'Resumen de la semana', 'Los lunes: entregas y sesiones'], ['wa', 'Mensajes por WhatsApp', 'Solo recordatorios importantes']].map(function (a) { return '<label class="ajuste"><span><b>' + a[1] + '</b><small>' + a[2] + '</small></span><input type="checkbox" class="switch js-aj" data-k="' + a[0] + '"' + (on[a[0]] ? ' checked' : '') + '></label>'; }).join('') + '</section>' +
      '<section class="panel"><h2>Tu plan</h2>' + (u.plan ? '<p><span class="tag tag-y">' + u.plan + '</span></p><p class="muted" style="margin-top:8px">Todos los cursos cortos hasta el 10 de octubre de 2027.</p>' : '<p class="muted">Pagas por curso.</p><a class="btn btn-y btn-s" style="margin-top:10px" href="index.html#planes">Conocer Semply Pro</a>') + '</section>' +
      '<section class="panel"><h2>Prototipo</h2><p class="muted" style="font-size:14px;margin-bottom:12px">Los datos de este campus viven solo en este navegador.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-o btn-s js-reset">Reiniciar demo</button><button class="btn btn-o btn-s js-salir">Cerrar sesión</button></div></section></div></div>';
  };

  /* ---------- enrutador ---------- */
  function ir() {
    var v = (location.hash.slice(1) || 'inicio').split('/')[0];
    if (!V[v]) v = 'inicio';
    u = S.sesion();
    marco(v); notifs();
    $('.js-vista').innerHTML = V[v]();
    var an = $('.js-anillo'); if (an) requestAnimationFrame(function () { setTimeout(function () { an.style.strokeDashoffset = an.dataset.o; }, 80); });
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', ir);
  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('.js-ics'))) { S.ics(buscarEv(t.dataset.k)); }
    if ((t = e.target.closest('.js-entregar'))) { var ev = buscarEv(t.dataset.k); S.modalEntrega(ev.c, ev.u, ev.lid, ir); }
    if ((t = e.target.closest('.js-mes'))) { var dd = +t.dataset.d; calMes = dd ? new Date(calMes.getFullYear(), calMes.getMonth() + dd, 1) : null; ir(); }
    if (e.target.closest('.js-salir')) S.salir();
    if (e.target.closest('.js-reset')) { S.entrar(D.ESTUDIANTE_DEMO, true); S.guardar('notifLeidas', false); S.toast('Demo reiniciada', 'check'); location.hash = '#inicio'; ir(); }
  });
  document.addEventListener('change', function (e) { var t = e.target.closest('.js-aj'); if (!t) return; var a = S.leer('ajustes', { vivo: true, semanal: true, wa: false }); a[t.dataset.k] = t.checked; S.guardar('ajustes', a); S.toast(t.checked ? 'Aviso activado' : 'Aviso desactivado', 'campana'); });
  document.addEventListener('submit', function (e) {
    if (!e.target.classList.contains('js-perfil')) return; e.preventDefault();
    var fd = new FormData(e.target), n = Object.assign({}, S.sesion()); fd.forEach(function (v, k) { n[k] = v; });
    S.guardar('sesion', n); S.toast('Perfil actualizado', 'check'); ir();
  });
  S.montarBuscador($('.js-busca'));
  S.pintarContador();
  ir();
})();
