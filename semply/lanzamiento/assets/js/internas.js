/* Semply · páginas internas: nosotros, oferta académica, cómo funciona, preguntas, inscripciones y contacto */
(function () {
  var S = window.SMP, $ = S.$, $$ = S.$$, pag = document.body.dataset.pagina, C = S.CONTACTO;
  var hero = $('.p-hero');
  S.iniciarComun(function () { return hero ? hero.offsetHeight - 90 : 40; });
  var b = $('.js-burst-p');
  if (b) b.outerHTML = { nosotros: S.burst('Yumbo<small>Valle</small>', '#FFC225', '#373435', 130), oferta: S.burst('1.200<small>horas</small>', '#FFC225', '#373435', 140), funciona: S.burst('5<small>pasos</small>', '#F10E3B', '#fff', 130), preguntas: S.burst('¿?', '#FFC225', '#373435', 120), inscripcion: S.burst('¡Abiertas!', '#F10E3B', '#fff', 130), contacto: S.burst('Hola<small>¿qué tal?</small>', '#FFC225', '#373435', 120) }[pag] || '';
  var P = window.SMP_PLAN || {};
  var TIPOS = [['Grabadas', '#F10E3B'], ['En vivo', '#FFC225'], ['Práctica', '#373435'], ['Evaluación', '#9b9591']];
  function suma(m) { return m.units.reduce(function (a, u) { return a.map(function (v, i) { return v + u.h[i]; }); }, [0, 0, 0, 0]); }
  // barra apilada de horas: [grabadas, en vivo, práctica, evaluación]
  function barra(h, con) {
    var t = h.reduce(function (a, v) { return a + v; }, 0);
    return '<div class="apilada">' + h.map(function (v, i) { return v ? '<i style="--w:' + (v / t * 100) + '%;--c:' + TIPOS[i][1] + '" title="' + TIPOS[i][0] + ': ' + v + ' h">' + (con ? '<span>' + v + ' h</span>' : '') + '</i>' : ''; }).join('') + '</div>' +
      (con ? '<div class="leyenda">' + TIPOS.map(function (x, i) { return '<span style="--c:' + x[1] + '">' + x[0] + ' · <b>' + h[i] + ' h</b></span>'; }).join('') + '</div>' : '');
  }

  /* ---------- nosotros ---------- */
  if (pag === 'nosotros') { $('.js-equipo').innerHTML = S.EQUIPO.map(S.tarjetaEquipo).join(''); S.revelar(); }

  /* ---------- oferta académica ---------- */
  if (pag === 'oferta') {
    var cont = $('.js-modulos');
    cont.innerHTML = S.MODULOS.map(function (m, i) {
      var t = m.det && P[m.det];
      return '<article class="modp rv tilt' + (t ? '' : ' pendiente') + '" data-s="' + m.s + '" style="--d:' + (i % 3 * 0.05) + 's"><div class="modp-img"><img src="assets/img/cursos/' + m.img + '-sm.webp" alt="" loading="lazy"><span class="tag ' + (t ? 'tag-y' : 'tag-b') + '">' + (t ? 'Plan de estudios listo' : 'Plan en construcción') + '</span></div>' +
        '<div class="modp-c"><small>Módulo ' + String(i + 1).padStart(2, '0') + ' · Semestre ' + m.s + ' · 100 h</small><h3>' + m.n + '</h3><p>' + m.d + '</p>' +
        (t ? '<button class="btn btn-s btn-o js-ver-plan" data-k="' + m.det + '" data-mira>Ver plan de estudios</button>' : '') + '</div></article>';
    }).join('');
    $$('.js-filtro button').forEach(function (bt) {
      bt.addEventListener('click', function () {
        $$('.js-filtro button').forEach(function (x) { x.classList.toggle('on', x === bt); });
        var s = bt.dataset.s; $$('.modp', cont).forEach(function (c) { c.style.display = s === '0' || c.dataset.s === s ? '' : 'none'; });
      });
    });
    var planEl = $('.js-plan');
    function plan(k) {
      var m = P[k]; if (!m) return; var h = suma(m);
      $$('.js-plan-tabs button').forEach(function (x) { x.classList.toggle('on', x.dataset.k === k); });
      planEl.innerHTML = '<div class="plan-cab"><div><small>Módulo de 100 horas · ' + m.units.length + ' unidades</small><h3>' + S.esc(m.name) + '</h3></div>' + S.burst(Math.round(h[2]) + '%<small>práctica</small>', '#FFC225', '#373435', 96) + '</div>' +
        '<div class="plan-tres"><div><h4>Para quién es</h4><p>' + S.esc(m.who) + '</p></div><div><h4>Qué necesitas</h4><ul>' + m.req.map(function (r) { return '<li>' + S.esc(r) + '</li>'; }).join('') + '</ul></div><div><h4>Lo que vas a saber hacer</h4><ul class="chulos">' + m.out.map(function (r) { return '<li>' + S.esc(r) + '</li>'; }).join('') + '</ul></div></div>' +
        '<div class="plan-horas"><h4>Cómo se reparten las 100 horas</h4>' + barra(h, true) + '</div>' +
        '<h4 class="plan-u-t">Unidades <small>Toca una para ver sus lecciones y el entregable</small></h4><ol class="unidades">' + m.units.map(function (u, i) {
          var t = u.h.reduce(function (a, v) { return a + v; }, 0);
          return '<li class="unidad' + (i === 0 ? ' abierta' : '') + '"><button class="unidad-bt" aria-expanded="' + (i === 0) + '" data-mira><b>' + u.c + '</b><span>' + S.esc(u.n) + '</span><em>' + t + ' h</em>' + barra(u.h) + '<i class="mas">' + S.ico(S.I.mas) + '</i></button>' +
            '<div class="unidad-c"><div><ul class="lecciones">' + u.l.map(function (l) { return '<li>' + S.esc(l) + '</li>'; }).join('') + '</ul><div class="entregable"><small>Entregable</small><p>' + S.esc(u.d) + '</p></div></div></div></li>';
        }).join('') + '</ol>';
    }
    plan('ia');
    planEl.addEventListener('click', function (e) { var bt = e.target.closest('.unidad-bt'); if (!bt) return; var a = bt.parentNode.classList.toggle('abierta'); bt.setAttribute('aria-expanded', a); });
    $$('.js-plan-tabs button').forEach(function (bt) { bt.addEventListener('click', function () { plan(bt.dataset.k); }); });
    cont.addEventListener('click', function (e) { var bt = e.target.closest('.js-ver-plan'); if (!bt) return; plan(bt.dataset.k); $('#plan').scrollIntoView({ behavior: S.reducir ? 'auto' : 'smooth' }); });
    if (location.hash === '#plan-seo') plan('seo');
    S.revelar(); S.tilt();
  }

  /* ---------- cómo funciona ---------- */
  if (pag === 'funciona') {
    var PASOS = [
      ['Te inscribes', 'Llenas el formulario en dos minutos o nos escribes por WhatsApp. Nos dices qué jornada y qué modalidad prefieres.', 'inscripcion.html', 'Ir al formulario'],
      ['Te contacta admisiones', 'El equipo de admisiones resuelve tus dudas: valor, formas de pago, fecha de inicio del próximo grupo, horarios y documentos.', S.waLink('Hola, quiero hablar con admisiones de Semply.'), 'Hablar con admisiones'],
      ['Haces tu matrícula', 'Formalizas tu cupo en la jornada y la modalidad que elegiste, y recibes tu acceso a la plataforma.', '', ''],
      ['Estudias dos semestres', 'Seis módulos por semestre, de 100 horas cada uno. La mitad del tiempo es práctica sobre un negocio real, con un entregable por unidad.', 'oferta-academica.html', 'Ver los 12 módulos'],
      ['Sustentas y te certificas', 'Presentas tu proyecto integrador ante el equipo docente y recibes el certificado de Técnico Laboral por Competencias en Marketing Digital e IA.', '#evaluacion', 'Cómo se aprueba']
    ];
    var rec = $('.js-recorrido'), pi = 0;
    function pintaRec() {
      rec.innerHTML = '<ol class="rec-pasos" role="tablist">' + PASOS.map(function (p, i) { return '<li><button class="' + (i === pi ? 'on' : '') + (i < pi ? ' hecho' : '') + '" data-i="' + i + '" role="tab" aria-selected="' + (i === pi) + '" data-mira><b>' + (i + 1) + '</b><span>' + p[0] + '</span></button></li>'; }).join('') + '</ol>' +
        '<div class="rec-det"><span class="rec-n">' + (pi + 1) + '</span><div><h3>' + PASOS[pi][0] + '</h3><p>' + PASOS[pi][1] + '</p>' + (PASOS[pi][2] ? '<a class="btn btn-s" href="' + PASOS[pi][2] + '"' + (PASOS[pi][2].indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '') + ' data-mira>' + PASOS[pi][3] + S.ico(S.I.flecha, 'ico-f') + '</a>' : '') + '</div><div class="rec-nav"><button class="js-rec-ant" aria-label="Paso anterior"' + (pi ? '' : ' disabled') + '>' + S.ico('<path d="M19 12H5M11 6l-6 6 6 6"/>') + '</button><button class="js-rec-sig" aria-label="Paso siguiente"' + (pi < PASOS.length - 1 ? '' : ' disabled') + '>' + S.ico(S.I.flecha) + '</button></div></div>';
      rec.style.setProperty('--avn', pi / (PASOS.length - 1));
    }
    pintaRec();
    rec.addEventListener('click', function (e) {
      var bt = e.target.closest('[data-i]'); if (bt) { pi = +bt.dataset.i; pintaRec(); }
      if (e.target.closest('.js-rec-sig') && pi < PASOS.length - 1) { pi++; pintaRec(); if (pi === PASOS.length - 1) S.confeti(); }
      if (e.target.closest('.js-rec-ant') && pi) { pi--; pintaRec(); }
    });

    var MOD = { presencial: ['En la sede de Yumbo', 'Clases en el aula con tu grupo y el docente, en la ' + C.dir + '.', S.ico('<path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6"/>')], virtual: ['Desde donde estés', 'Lecciones en la plataforma a tu ritmo y sesiones en vivo con el docente. Solo necesitas computador o celular y buena conexión.', S.ico('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/>')] };
    var JOR = { diurna: ['Jornada diurna', 'Para quien tiene libres las mañanas o las tardes, por ejemplo si acabas de terminar el colegio.', [1, 1, 1, 1, 1, 0, 0], '☀'], nocturna: ['Jornada nocturna', 'Para quien trabaja de día y estudia después del trabajo.', [1, 1, 1, 1, 1, 0, 0], '☾'], finde: ['Fin de semana', 'Para quien solo tiene libres los sábados y domingos.', [0, 0, 0, 0, 0, 1, 1], '★'] };
    var sel = { m: 'presencial', j: 'diurna' }, res = $('.js-elige');
    function pintaElige() {
      var m = MOD[sel.m], j = JOR[sel.j];
      res.innerHTML = '<div class="elige-tarj"><span class="elige-ic">' + m[2] + '</span><h3>' + m[0] + ' · ' + j[0].toLowerCase() + '</h3><p>' + m[1] + '</p><p>' + j[1] + '</p>' +
        '<div class="semana">' + ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(function (d, i) { return '<div class="' + (j[2][i] ? 'si' : '') + '" style="--i:' + i + '"><small>' + d + '</small><b>' + (j[2][i] ? j[3] : '') + '</b></div>'; }).join('') + '</div>' +
        '<p class="elige-nota">Semana de ejemplo. Admisiones te confirma los horarios exactos de cada jornada.</p><a class="btn btn-y btn-s" href="inscripcion.html" data-mira>Inscribirme así ' + S.ico(S.I.flecha, 'ico-f') + '</a></div>';
    }
    pintaElige();
    [['.js-modalidad', 'm'], ['.js-jornada', 'j']].forEach(function (g) {
      $(g[0]).addEventListener('click', function (e) {
        var bt = e.target.closest('button'); if (!bt) return; sel[g[1]] = bt.dataset.v;
        $$('button', $(g[0])).forEach(function (x) { x.classList.toggle('on', x === bt); x.setAttribute('aria-checked', x === bt); });
        pintaElige();
      });
    });

    var rep = $('.js-reparto');
    function pintaRep(k) { if (!P[k]) return; rep.innerHTML = barra(suma(P[k]), true); $$('.js-reparto-tabs button').forEach(function (x) { x.classList.toggle('on', x.dataset.k === k); }); }
    pintaRep('ia');
    $$('.js-reparto-tabs button').forEach(function (bt) { bt.addEventListener('click', function () { pintaRep(bt.dataset.k); }); });

    // dona de la evaluación: se resalta el peso que tocas
    var PESOS = [[40, '#F10E3B', 'Talleres y entregables'], [40, '#FFC225', 'Proyecto integrador'], [10, '#373435', 'Quices'], [10, '#9b9591', 'Sesiones en vivo']];
    var dona = $('.js-dona'), dc = $('.js-dona-c'), ac = 0, r = 15.915;
    dona.innerHTML = '<circle cx="21" cy="21" r="' + r + '" fill="none" stroke="#efe9e3" stroke-width="6"/>' + PESOS.map(function (p, i) { var s = '<circle class="seg" data-i="' + i + '" cx="21" cy="21" r="' + r + '" fill="none" stroke="' + p[1] + '" stroke-width="6" stroke-dasharray="' + (p[0] - 0.6) + ' ' + (100 - p[0] + 0.6) + '" stroke-dashoffset="' + (25 - ac) + '"/>'; ac += p[0]; return s; }).join('');
    function marca(i) { $$('.seg', dona).forEach(function (c) { c.classList.toggle('apaga', +c.dataset.i !== i); }); $$('.js-pesos li').forEach(function (l) { l.classList.toggle('on', +l.dataset.i === i); }); dc.innerHTML = '<b>' + PESOS[i][0] + '%</b><span>' + PESOS[i][2] + '</span>'; }
    $$('.js-pesos li').forEach(function (l) { ['mouseenter', 'click'].forEach(function (ev) { l.addEventListener(ev, function () { marca(+l.dataset.i); }); }); });
    marca(0);
    S.tilt();
  }

  /* ---------- preguntas frecuentes ---------- */
  if (pag === 'preguntas') {
    var faq = $('.js-faq-p'), tema = 'todas', q = '';
    var TEMAS = [['todas', 'Todas']].concat(S.FAQ_TEMAS);
    $('.js-temas').innerHTML = TEMAS.map(function (t) { var n = t[0] === 'todas' ? S.FAQ.length : S.FAQ.filter(function (f) { return f[0] === t[0]; }).length; return '<button class="tema' + (t[0] === tema ? ' on' : '') + '" data-t="' + t[0] + '" data-mira>' + t[1] + '<small>' + n + '</small></button>'; }).join('');
    function norm(t) { return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
    function pintaFaq() {
      var lista = S.FAQ.filter(function (f) { return (tema === 'todas' || f[0] === tema) && (!q || norm(f[1] + ' ' + f[2]).indexOf(norm(q)) > -1); });
      S.acordeon(faq, lista.map(function (f) { return [f[1], f[2]]; }), true);
      if (q && lista.length) $$('.acc-it', faq).forEach(function (it) { it.classList.add('abierto'); $('.acc-bt', it).setAttribute('aria-expanded', 'true'); });
      $('.js-vacio').hidden = !!lista.length;
    }
    pintaFaq();
    $('.js-temas').addEventListener('click', function (e) { var bt = e.target.closest('.tema'); if (!bt) return; tema = bt.dataset.t; $$('.tema').forEach(function (x) { x.classList.toggle('on', x === bt); }); pintaFaq(); });
    $('.js-buscar').addEventListener('input', function (e) { q = e.target.value.trim(); pintaFaq(); });
    S.contactos($('.js-contactos'));
  }

  /* ---------- inscripciones ---------- */
  if (pag === 'inscripcion') {
    var interes = new URLSearchParams(location.search).get('interes');
    var temas = { ia: 'inteligencia artificial', seo: 'SEO y posicionamiento', con: 'contenido y redes', pau: 'pauta y ventas' };
    var caja = $('.js-form-caja');
    function formulario() {
      caja.innerHTML = S.burst('Cupos<small>abiertos</small>', '#FFC225', '#373435', 110) + '<h3>Formulario de inscripción</h3><p style="color:var(--tx2)">Técnico Laboral en Marketing Digital e Inteligencia Artificial.</p>' +
        '<form class="js-insc" novalidate><div class="campos">' +
        '<div class="fld full"><label for="i-n">Nombre completo</label><input id="i-n" class="inp" autocomplete="name" required><span class="err">Escribe tu nombre.</span></div>' +
        '<div class="fld"><label for="i-t">Celular o WhatsApp</label><input id="i-t" type="tel" class="inp" inputmode="numeric" autocomplete="tel" placeholder="300 123 4567" required><span class="err">Escribe un número de 10 dígitos.</span></div>' +
        '<div class="fld"><label for="i-c">Correo</label><input id="i-c" type="email" class="inp" autocomplete="email" required><span class="err">Revisa el correo.</span></div>' +
        '<div class="fld"><label for="i-ci">Ciudad</label><input id="i-ci" class="inp" autocomplete="address-level2" list="ciudades" value="Yumbo"><datalist id="ciudades"><option>Yumbo</option><option>Cali</option><option>Palmira</option><option>Jamundí</option><option>Buga</option><option>Tuluá</option></datalist></div>' +
        '<div class="fld"><label for="i-co">¿Cómo nos conociste?</label><select id="i-co" class="inp"><option>Redes sociales</option><option>Un amigo o familiar</option><option>Google</option><option>En la sede</option><option>Otro</option></select></div>' +
        '<div class="fld full"><span class="lbl">Jornada que prefieres</span><div class="opciones">' + ['Diurna', 'Nocturna', 'Fin de semana'].map(function (j, k) { return '<label class="opcion"><input type="radio" name="jornada" value="' + j + '"' + (k === 0 ? ' checked' : '') + '><span><b>' + j + '</b></span></label>'; }).join('') + '</div></div>' +
        '<div class="fld full"><span class="lbl">Modalidad</span><div class="opciones"><label class="opcion"><input type="radio" name="modalidad" value="Presencial" checked><span><b>Presencial</b>Sede Yumbo</span></label><label class="opcion"><input type="radio" name="modalidad" value="A distancia"><span><b>A distancia</b>Clases virtuales</span></label></div></div>' +
        '<div class="fld full"><label for="i-m">¿Algo que quieras contarnos? (opcional)</label><textarea id="i-m" class="inp">' + (interes && temas[interes] ? 'Me interesa sobre todo ' + temas[interes] + '.' : '') + '</textarea></div>' +
        '<label class="check full"><input type="checkbox" required><span>Autorizo a Semply a contactarme y a tratar mis datos según la Ley 1581 de 2012.</span></label>' +
        '<button class="btn full" data-mira>Enviar inscripción ' + S.ico(S.I.flecha, 'ico-f') + '</button></div></form>';
    }
    formulario();
    caja.addEventListener('submit', function (e) {
      e.preventDefault(); var f = e.target; if (!S.validar(f)) return;
      var d = { nombre: $('#i-n').value.trim(), tel: $('#i-t').value.trim(), correo: $('#i-c').value.trim(), ciudad: $('#i-ci').value.trim(), como: $('#i-co').value, jornada: $('input[name=jornada]:checked').value, modalidad: $('input[name=modalidad]:checked').value, nota: $('#i-m').value.trim() };
      var btn = $('button.btn', f); btn.classList.add('cargando');
      setTimeout(function () {
        S.guardar('inscripcion', d);
        var msg = 'Hola, quiero inscribirme al Técnico Laboral en Marketing Digital e IA.\nNombre: ' + d.nombre + '\nCelular: ' + d.tel + '\nCorreo: ' + d.correo + '\nCiudad: ' + d.ciudad + '\nJornada: ' + d.jornada + '\nModalidad: ' + d.modalidad + (d.nota ? '\nNota: ' + d.nota : '');
        caja.innerHTML = '<div class="exito">' + S.burst('¡Listo!', '#F10E3B', '#fff', 120, 'rel') + '<h3>Gracias, ' + S.esc(d.nombre.split(' ')[0]) + '.</h3><p style="color:var(--tx2);max-width:420px">Recibimos tu inscripción para la jornada <b>' + d.jornada.toLowerCase() + '</b>, modalidad <b>' + d.modalidad.toLowerCase() + '</b>. Para que admisiones te atienda más rápido, envíanos también tus datos por WhatsApp.</p>' +
          '<div class="compartir"><a class="btn" href="' + S.waLink(msg) + '" target="_blank" rel="noopener">' + S.ico(S.I.chat) + 'Enviar por WhatsApp</a><button class="btn btn-o btn-s js-otra">Inscribir a otra persona</button></div></div>';
        S.confeti();
      }, 900);
    });
    caja.addEventListener('click', function (e) { if (e.target.closest('.js-otra')) formulario(); });
    S.contactos($('.js-contactos'));
    S.acordeon($('.js-faq'), S.FAQ.filter(function (f) { return f[0] === 'inscripcion' || f[3] === 'insc'; }).map(function (f) { return [f[1], f[2]]; }));
  }

  /* ---------- contacto ---------- */
  if (pag === 'contacto') {
    S.contactos($('.js-contactos'));
    var caja2 = $('.js-form-caja');
    function form2() {
      caja2.innerHTML = '<h3>Escríbenos</h3><p style="color:var(--tx2)">Te respondemos lo antes posible.</p><form class="js-cont" novalidate><div class="campos">' +
        '<div class="fld full"><label for="c-n">Nombre</label><input id="c-n" class="inp" autocomplete="name" required><span class="err">Escribe tu nombre.</span></div>' +
        '<div class="fld"><label for="c-t">Celular</label><input id="c-t" type="tel" class="inp" inputmode="numeric" autocomplete="tel" required><span class="err">Escribe un número de 10 dígitos.</span></div>' +
        '<div class="fld"><label for="c-c">Correo (opcional)</label><input id="c-c" type="email" class="inp" autocomplete="email"></div>' +
        '<div class="fld full"><label for="c-m">Mensaje</label><textarea id="c-m" class="inp" required></textarea><span class="err">Cuéntanos en qué te ayudamos.</span></div>' +
        '<label class="check full"><input type="checkbox" required><span>Autorizo el tratamiento de mis datos según la Ley 1581 de 2012.</span></label>' +
        '<button class="btn full" data-mira>Enviar mensaje</button></div></form>';
    }
    form2();
    caja2.addEventListener('submit', function (e) {
      e.preventDefault(); var f = e.target; if (!S.validar(f)) return;
      var n = $('#c-n').value.trim(), msg = 'Hola, soy ' + n + ' (' + $('#c-t').value.trim() + '). ' + $('#c-m').value.trim();
      caja2.innerHTML = '<div class="exito">' + S.burst('¡Gracias!', '#FFC225', '#373435', 110, 'rel') + '<h3>Mensaje listo, ' + S.esc(n.split(' ')[0]) + '.</h3><p style="color:var(--tx2)">Para que llegue de una vez, envíalo por WhatsApp o por correo.</p><div class="compartir"><a class="btn" href="' + S.waLink(msg) + '" target="_blank" rel="noopener">' + S.ico(S.I.chat) + 'WhatsApp</a><a class="btn btn-o" href="mailto:' + C.correo + '?subject=' + encodeURIComponent('Contacto desde la web') + '&body=' + encodeURIComponent(msg) + '">' + S.ico(S.I.correo) + 'Correo</a></div><button class="js-otra" style="font-size:13.5px;color:var(--tx2);text-decoration:underline">Escribir otro mensaje</button></div>';
    });
    caja2.addEventListener('click', function (e) { if (e.target.closest('.js-otra')) form2(); });
  }
})();
