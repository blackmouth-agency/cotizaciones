/* Semply · página de curso o programa */
(function () {
  var S = Semply, D = SEMPLY, $ = S.$, $$ = S.$$;
  var c = D.curso(S.param('c')) || D.curso('ia-marketing');
  var d = D.docentes[c.docente], prog = c.tipo === 'programa';
  document.title = c.titulo + ' · Semply';
  var ins = S.sesion() && S.inscritos()[c.slug];

  /* reseñas inventadas, estables por curso */
  var NOMBRES = ['María Fernanda G.', 'Luis Carlos P.', 'Paula Andrea A.', 'Jhon Jairo M.', 'Catalina V.', 'Diego H.', 'Ana María R.', 'Felipe O.', 'Mónica L.', 'Esteban C.'];
  var TEXTOS = [
    [5, 'Muy práctico. Desde la primera semana apliqué lo aprendido en mi negocio y se notó en los resultados.'],
    [5, 'Se nota que ' + d.nombre.split(' ')[0] + ' hace esto todos los días: ejemplos de marcas reales y cero relleno.'],
    [5, 'Lo mejor son los ejercicios. No te quedas viendo videos: te toca hacer, y eso es lo que sirve.'],
    [4, 'Para arrancar es perfecto. Me hubiera gustado un poco más de casos avanzados, pero cumple lo que promete.'],
    [5, 'Las plantillas descargables valen lo que cuesta el curso. Ya las uso con mis clientes.'],
    [5, 'Me encantó que desde el inicio avisan qué herramientas son gratis y cuáles de pago.'],
    [4, 'Lecciones cortas, perfectas para ver en el bus. Algunas se sienten rápidas, pero se pueden repetir.'],
    [5, 'La retroalimentación fue concreta y con nombre propio. Nada de «buen trabajo» genérico.']
  ];
  var seed = c.slug.length;
  var resenas = [0, 1, 2, 3].map(function (i) { var t = TEXTOS[(seed + i * 3) % TEXTOS.length]; return { n: NOMBRES[(seed * 3 + i * 7) % NOMBRES.length], e: t[0], t: t[1], f: ['hace 3 días', 'hace 1 semana', 'hace 2 semanas', 'hace 1 mes'][i] }; });
  var dist = (function (r) { var f = Math.round((r - 4) * 100); var five = Math.min(92, Math.max(55, f + 2)); var four = Math.max(5, 100 - five - 4); return [five, four, 3, 1, 0]; })(c.rating);

  var totalMin = 0, nVid = 0;
  c.unidades.forEach(function (u) { u.lecciones.forEach(function (l) { if (l.tipo === 'video') { totalMin += l.min; nVid++; } }); });
  var h = prog ? D.horasTipo(c) : null;
  var finOferta = new Date('2026-10-31T23:59:00');

  function icoLec(t) { return { video: 'play', vivo: 'vivo', taller: 'taller', quiz: 'quiz' }[t]; }
  function unidadHTML(u, ui) {
    var vids = u.lecciones.filter(function (l) { return l.tipo === 'video'; }).length;
    var meta = prog ? (u.h[0] + u.h[1] + u.h[2] + u.h[3]) + ' h · ' + u.lecciones.length + ' actividades' : u.lecciones.length + ' lecciones · ' + S.dur(u.lecciones.reduce(function (a, l) { return a + l.min; }, 0));
    return '<div class="acc-it unidad' + (ui === 0 ? ' abierto' : '') + '"><button class="acc-bt" aria-expanded="' + (ui === 0) + '"><span class="u-cod">' + u.c + '</span><span>' + u.n + '</span><span class="u-meta" style="margin-left:auto">' + meta + '</span><span class="mas" style="margin-left:12px">' + S.ico('mas') + '</span></button>' +
      '<div class="acc-cont"><div><div class="lecs">' + u.lecciones.map(function (l, li) {
        var gratis = ui === 0 && li === 0 || (prog && u.c === 'U2' && li === 0);
        return '<div class="lec">' + S.ico(icoLec(l.tipo)) + '<span>' + S.esc(l.t) + (gratis ? ' · <button class="gratis js-preview">Vista previa</button>' : '') + '</span><small>' + (l.tipo === 'vivo' ? 'En vivo · ' : '') + S.dur(l.min) + '</small></div>';
      }).join('') + (u.d ? '<div class="entregable">' + S.ico('taller') + '<span><b>Entregable:</b> ' + S.esc(u.d) + '</span></div>' : '') + '</div></div></div></div>';
  }

  var co = prog ? c.cohortes[0] : null;
  var compra = '<div class="compra" id="comprar"><button class="compra-video js-preview" aria-label="Ver la vista previa del curso">' + S.img(S.cover(c, true), '', 'loading="eager"') + '<span class="play">' + S.ico('play') + '</span><span class="tag tag-b">' + S.ico('ojo') + 'Vista previa · 1:36</span></button>' +
    '<div class="compra-cuerpo">' +
    (ins ? '<div class="demo-aviso" style="background:var(--verde-s)">' + S.ico('check') + '<span>Ya estás inscrito. Llevas un <b>' + S.progreso(c.slug) + ' %</b>.</span></div><a class="btn btn-r btn-l btn-full" href="clase.html?c=' + c.slug + '">Continuar en el campus</a>' :
    '<div class="compra-precio"><span class="precio js-precio">' + S.fmt(c.precio) + '</span>' + (c.antes ? '<s class="muted">' + S.fmt(c.antes) + '</s><span class="tag tag-r">−' + Math.round((1 - c.precio / c.antes) * 100) + ' %</span>' : '') + '</div>' +
    (c.antes ? '<div class="cuenta">' + S.ico('reloj') + '<span>El precio de lanzamiento termina en <b class="js-cuenta"></b></span></div>' : '') +
    (prog ? '<div class="fld"><span class="lbl">Cohorte</span><div class="opciones">' + c.cohortes.map(function (k, i) { return '<label class="opcion"><input type="radio" name="cohorte" value="' + k.id + '"' + (i === 0 ? ' checked' : '') + '><span><b>' + S.fecha(k.inicio) + '</b>' + k.dia + ' · ' + k.cupos + ' cupos</span></label>'; }).join('') + '</div></div>' +
      '<div class="fld"><span class="lbl">Forma de pago</span><div class="opciones"><label class="opcion"><input type="radio" name="pago" value="contado" checked><span><b>De contado</b>' + S.fmt(c.precio) + '</span></label><label class="opcion"><input type="radio" name="pago" value="cuotas"><span><b>4 cuotas</b>' + S.fmt(c.precio / 4) + ' al mes</span></label></div></div>' : '') +
    '<button class="btn btn-r btn-l btn-full js-inscribir">Inscribirme ahora</button>' +
    '<div class="compra-acc"><button class="btn btn-o btn-s js-carrito">' + S.ico('carrito') + 'Al carrito</button><button class="btn btn-o btn-s js-regalar">' + S.ico('regalo') + 'Regalar</button><button class="btn btn-o btn-s js-fav-c" data-fav="' + c.slug + '" aria-label="Guardar en favoritos" style="flex:0 0 auto;padding:0 12px">' + S.ico('corazon') + '</button></div>') +
    '<ul>' + (prog ? '<li>' + S.ico('reloj') + '100 horas en 10 semanas</li><li>' + S.ico('vivo') + 'Sesión en vivo: ' + co.dia.toLowerCase() + '</li><li>' + S.ico('taller') + c.unidades.length + ' entregables revisados por el docente</li><li>' + S.ico('trofeo') + 'Sustentación final de 10 minutos</li>'
      : '<li>' + S.ico('video') + nVid + ' lecciones · ' + S.dur(totalMin) + ' de video</li><li>' + S.ico('archivo') + 'Plantillas y recursos descargables</li><li>' + S.ico('taller') + 'Proyecto final y quiz</li><li>' + S.ico('reloj') + 'Acceso por 12 meses</li>') +
    '<li>' + S.ico('cc') + 'Subtítulos y transcripción</li><li>' + S.ico('medalla') + 'Constancia digital verificable</li></ul>' +
    '<p class="garantia">' + S.ico('escudo').replace('class="ico ', 'class="ico " style="display:inline;vertical-align:-3px" ') + ' 7 días de garantía: si no es para ti, te devolvemos el dinero.</p></div></div>';

  var html =
    '<section class="cur-hero"><div class="wrap cur-grid"><div>' +
    '<nav class="migas" aria-label="Ruta"><a href="index.html">Inicio</a>' + S.ico('der') + '<a href="cursos.html">Catálogo</a>' + S.ico('der') + '<a href="cursos.html?cat=' + c.cat + '">' + S.catNombre(c.cat) + '</a></nav>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap">' + (prog ? '<span class="tag tag-y">Programa · 100 horas</span><span class="tag tag-r"><span class="punto-vivo" style="color:#fff"></span>Inicia el ' + S.fecha(co.inicio) + '</span>' : '<span class="tag tag-y">Curso corto</span>') + (c.top ? '<span class="tag tag-b">Más vendido</span>' : '') + (c.nuevo ? '<span class="tag tag-r">Nuevo</span>' : '') + '</div>' +
    '<h1>' + c.titulo + '</h1><p class="lead">' + c.sub + '</p>' +
    '<div class="cur-meta">' + S.estrellas(c.rating, c.resenas) + '<span>' + S.ico('usuarios') + c.estudiantes.toLocaleString('es-CO') + ' estudiantes</span><span>' + S.ico('reloj') + S.horasTxt(c) + '</span><span>' + S.ico('libro') + c.lecciones + (prog ? ' actividades' : ' lecciones') + '</span><span>' + S.ico('grafica') + c.nivel + '</span><span>' + S.ico('mundo') + 'Español · subtítulos</span></div>' +
    '<div class="cur-doc">' + S.img(S.docImg(c.docente, true), d.nombre) + '<div><small>Docente</small><b>' + d.nombre + '</b></div></div>' +
    '</div><aside>' + compra + '</aside></div></section>' +

    '<div class="wrap cur-cuerpo"><div>' +
    '<section class="cur-sec rv"><h2>Lo que vas a lograr</h2><ul class="logros">' + c.logros.map(function (l) { return '<li>' + S.ico('check') + '<span>' + l + '</span></li>'; }).join('') + '</ul></section>' +
    (prog ? '<section class="cur-sec rv"><h2>Cómo se reparten las 100 horas</h2><div class="horas-barra">' + ['c-rec', 'c-vivo', 'c-prac', 'c-eval'].map(function (k, i) { return '<i class="' + k + '" style="width:' + h[i] + '%"></i>'; }).join('') + '</div><div class="leyenda"><span><i class="c-rec"></i>Grabado · ' + h[0] + ' h</span><span><i class="c-vivo"></i>En vivo · ' + h[1] + ' h</span><span><i class="c-prac"></i>Práctica · ' + h[2] + ' h</span><span><i class="c-eval"></i>Evaluación · ' + h[3] + ' h</span></div><p class="muted" style="margin-top:14px">Diez horas por semana: 2 a 3 h de lecciones grabadas, 2 h en vivo (mitad taller, mitad clínica), 4 a 5 h de práctica y 1 h de cierre con quiz y retroalimentación.</p></section>' : '') +
    '<section class="cur-sec rv"><h2>Temario</h2><div class="temario-resumen"><span>' + c.unidades.length + (prog ? ' unidades' : ' secciones') + ' · ' + c.lecciones + (prog ? ' actividades' : ' lecciones') + ' · ' + S.dur(totalMin) + ' de video</span><button class="lnk js-expandir">Expandir todo</button></div><div class="acc js-temario">' + c.unidades.map(unidadHTML).join('') + '</div></section>' +
    (prog ? '<section class="cur-sec rv"><h2>Cómo se aprueba</h2><p class="muted" style="margin-bottom:18px">Se aprueba haciendo, no respondiendo quices.</p><div class="eval"><div><b>40 %</b><span>Talleres y entregables por unidad</span></div><div><b>40 %</b><span>Proyecto integrador: avances y sustentación</span></div><div><b>10 %</b><span>Quices de cierre de unidad</span></div><div><b>10 %</b><span>Participación en sesiones en vivo</span></div></div>' +
      '<div class="eval" style="margin-top:12px"><div><b style="color:var(--gris)">3,5</b><span>Nota final mínima sobre 5,0</span></div><div><b style="color:var(--gris)">80 %</b><span>De los entregables radicados</span></div><div><b style="color:var(--gris)">70 %</b><span>De las sesiones, en vivo o grabadas</span></div><div><b style="color:var(--gris)">10 min</b><span>Sustentación del proyecto</span></div></div></section>' : '') +
    '<section class="cur-sec rv"><h2>¿Es para ti?</h2><div class="para"><div><h3>Para quién es</h3><ul>' + (prog ? '<li>' + c.para + '</li>' : '<li>Emprendedores y dueños de negocio que hacen su propio marketing.</li><li>Community managers y freelancers que quieren cobrar mejor.</li><li>Equipos de mercadeo que necesitan resultados esta semana.</li>') + '</ul></div><div><h3>Qué necesitas</h3><ul>' + (prog ? c.req : ['Computador o celular con conexión estable.', 'Ganas de practicar con tu propio negocio o el de un cliente.', 'No se necesita experiencia previa.']).map(function (r) { return '<li>' + r + '</li>'; }).join('') + '</ul></div></div></section>' +
    '<section class="cur-sec rv"><h2>Tu docente</h2><div class="doc-ficha">' + S.img(S.docImg(c.docente), d.nombre) + '<div><h3>' + d.nombre + '</h3><p class="rol">' + d.rol + ' · ' + d.anos + ' años de experiencia</p><p class="muted">' + d.bio + '</p><blockquote>«' + d.frase + '»</blockquote>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px">' + D.cursos.filter(function (x) { return x.docente === c.docente && x.slug !== c.slug; }).map(function (x) { return '<a class="chip" href="curso.html?c=' + x.slug + '">' + x.titulo + '</a>'; }).join('') + '</div></div></div></section>' +
    '<section class="cur-sec rv"><h2>Reseñas</h2><div class="resenas-top"><div class="resenas-nota"><b>' + c.rating.toFixed(1).replace('.', ',') + '</b><div class="est">' + [1, 2, 3, 4, 5].map(function () { return '<svg viewBox="0 0 24 24"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>'; }).join('') + '</div><small class="muted">' + c.resenas.toLocaleString('es-CO') + ' reseñas</small></div><div class="dist">' + dist.map(function (v, i) { return '<div><span>' + (5 - i) + ' estrellas</span><i><b style="width:' + v + '%"></b></i><span>' + v + ' %</span></div>'; }).join('') + '</div></div>' +
      resenas.map(function (r) { return '<div class="resena"><div class="resena-cab"><span class="avatar">' + S.iniciales(r.n) + '</span><div><b>' + r.n + '</b><small>' + '★★★★★'.slice(0, r.e) + '<span style="opacity:.3">' + '★★★★★'.slice(r.e) + '</span> · ' + r.f + '</small></div></div><p>' + r.t + '</p></div>'; }).join('') + '</section>' +
    '<section class="cur-sec rv"><h2>Preguntas sobre este ' + (prog ? 'programa' : 'curso') + '</h2><div class="acc js-faq">' + [
      ['¿Qué constancia recibo?', 'Una constancia digital de asistencia y aprobación, con código de verificación, que puedes descargar en PDF y agregar a LinkedIn. Semply es educación informal: entrega constancia, no título.'],
      prog ? ['¿Qué pasa si falto a una sesión en vivo?', 'Queda grabada en el campus. Si la ves durante la misma semana, cuenta para tu asistencia.'] : ['¿Por cuánto tiempo tengo acceso?', 'Doce meses desde la compra, o mientras tengas Semply Pro activo.'],
      prog ? ['¿Puedo pagar en cuotas?', 'Sí. Cuatro cuotas mensuales de ' + S.fmt(c.precio / 4) + ' sin intereses con Semply, con tarjeta, PSE o Nequi.'] : ['¿Está incluido en Semply Pro?', 'Sí. Con Semply Pro tienes este y todos los cursos cortos del catálogo.'],
      ['¿Y si no me gusta?', 'Tienes 7 días desde la compra para pedir el reembolso, siempre que no hayas visto más del 20 % del contenido.']
    ].map(function (f) { return '<div class="acc-it"><button class="acc-bt" aria-expanded="false">' + f[0] + '<span class="mas">' + S.ico('mas') + '</span></button><div class="acc-cont"><div><p>' + f[1] + '</p></div></div></div>'; }).join('') + '</div></section>' +
    '</div><aside></aside></div>' +
    '<section class="sec sec-nube" style="padding-block:72px"><div class="wrap"><div class="cab-fila"><div class="cab"><span class="ceja">Sigue aprendiendo</span><h2 class="t-m">También te puede servir</h2></div><a class="lnk" href="cursos.html">Ver catálogo ' + S.ico('flecha') + '</a></div><div class="grid-cursos">' +
      D.cursos.filter(function (x) { return x.slug !== c.slug && (x.cat === c.cat || x.docente === c.docente || x.tipo === 'curso'); }).sort(function (a, b) { return (b.cat === c.cat) - (a.cat === c.cat); }).slice(0, 4).map(S.cardCurso).join('') + '</div></div></section>' +
    (ins ? '' : '<div class="barra-mob"><div><div class="precio js-precio">' + S.fmt(c.precio) + '</div><small class="muted">' + (prog ? 'o 4 cuotas' : 'acceso 12 meses') + '</small></div><button class="btn btn-r js-inscribir">Inscribirme</button></div>');

  $('.js-curso').innerHTML = html;
  S.acordeon($('.js-temario')); S.acordeon($('.js-faq'));
  /* la tarjeta de compra vive en la columna lateral en escritorio (fija al bajar) y en la cabecera en móvil */
  var tarjeta = $('#comprar'), lugarHero = $('.cur-hero aside'), lugarCuerpo = $('.cur-cuerpo > aside'), mq = matchMedia('(min-width: 1081px)');
  function ubicar() {
    if (mq.matches) { lugarCuerpo.appendChild(tarjeta); tarjeta.style.marginTop = '0px'; tarjeta.style.marginTop = (lugarHero.getBoundingClientRect().top - lugarCuerpo.getBoundingClientRect().top) + 'px'; }
    else { lugarHero.appendChild(tarjeta); tarjeta.style.marginTop = ''; }
  }
  ubicar(); mq.addEventListener('change', ubicar); window.addEventListener('load', ubicar);
  S.revelar();
  var fb = $('.js-fav-c'); if (fb && S.favs().indexOf(c.slug) >= 0) fb.classList.add('on');

  /* expandir/colapsar temario */
  var exp = false;
  $('.js-expandir').addEventListener('click', function (e) { exp = !exp; $$('.js-temario .acc-it').forEach(function (it) { it.classList.toggle('abierto', exp); }); e.target.textContent = exp ? 'Colapsar todo' : 'Expandir todo'; });

  /* cuenta regresiva */
  var ce = $('.js-cuenta');
  function tic() { var ms = finOferta - Date.now(); if (ms < 0) { ce.textContent = 'hoy'; return; } var dd = Math.floor(ms / 864e5), hh = Math.floor(ms / 36e5) % 24, mm = Math.floor(ms / 6e4) % 60; ce.textContent = dd + ' d ' + hh + ' h ' + mm + ' min'; }
  if (ce) { tic(); setInterval(tic, 30000); }

  /* compra */
  function extra() {
    if (!prog) return {};
    var k = $('input[name=cohorte]:checked'), p = $('input[name=pago]:checked');
    return { cohorte: k ? k.value : c.cohortes[0].id, pago: p ? p.value : 'contado' };
  }
  $$('input[name=pago]').forEach(function (r) { r.addEventListener('change', function () { $$('.js-precio').forEach(function (e) { e.innerHTML = r.value === 'cuotas' && r.checked ? S.fmt(c.precio / 4) + '<small style="font-size:.45em;color:var(--gris-3)"> /mes × 4</small>' : S.fmt(c.precio); }); }); });
  $$('.js-inscribir').forEach(function (b) { b.addEventListener('click', function () { if (S.agregar(c.slug, extra(), true)) location.href = 'carrito.html'; }); });
  var bc = $('.js-carrito'); if (bc) bc.addEventListener('click', function () { S.agregar(c.slug, extra()); });
  var br = $('.js-regalar');
  if (br) br.addEventListener('click', function () {
    var m = S.modal('<span class="ceja">Regalar</span><h2 class="t-m" style="margin:10px 0 8px">Regala «' + c.titulo + '»</h2><p class="muted" style="margin-bottom:18px">Le enviamos un correo con el acceso y tu mensaje el día que elijas.</p><form class="js-regalo" style="display:grid;gap:14px"><div class="fld"><label for="rg-n">Nombre de quien recibe</label><input id="rg-n" class="inp" required></div><div class="fld"><label for="rg-c">Su correo</label><input id="rg-c" type="email" class="inp" required></div><div class="fld"><label for="rg-m">Mensaje (opcional)</label><textarea id="rg-m" class="inp" placeholder="Para que dejes de pelear con la IA."></textarea></div><button class="btn btn-r">Agregar regalo al carrito</button></form>');
    $('.js-regalo', m).addEventListener('submit', function (e) { e.preventDefault(); S.agregar(c.slug, Object.assign(extra(), { regalo: $('#rg-n', m).value }), true); m.cerrar(); S.toast('Regalo para ' + S.esc($('#rg-n', m).value) + ' agregado', 'regalo', '<a href="carrito.html">Ver carrito</a>'); });
  });
  document.addEventListener('click', function (e) { if (e.target.closest('.js-preview')) { e.preventDefault(); S.verClase(); } });
})();
