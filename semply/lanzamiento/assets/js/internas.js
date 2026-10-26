/* Semply · páginas internas: nosotros, oferta académica, cómo funciona, preguntas, inscripciones y contacto */
(function () {
  var S = window.SMP, $ = S.$, $$ = S.$$, pag = document.body.dataset.pagina, C = S.CONTACTO;
  var hero = $('.p-hero');
  S.iniciarComun(function () { return hero ? hero.offsetHeight - 90 : 40; });
  var b = $('.js-burst-p');
  if (b) b.outerHTML = { nosotros: S.burst('100%<small>virtual</small>', '#FFC225', '#373435', 130), oferta: S.burst('1.200<small>horas</small>', '#FFC225', '#373435', 140), funciona: S.burst('5<small>pasos</small>', '#F10E3B', '#fff', 130), preguntas: S.burst('¿?', '#FFC225', '#373435', 120), inscripcion: S.burst('¡Abiertas!', '#F10E3B', '#fff', 130), contacto: S.burst('Hola<small>¿qué tal?</small>', '#FFC225', '#373435', 120) }[pag] || '';
  var TIPOS = [['Grabadas', '#F10E3B'], ['En vivo', '#FFC225'], ['Práctica', '#373435'], ['Evaluación', '#9b9591']];
  // barra apilada de horas: [grabadas, en vivo, práctica, evaluación]
  function barra(h, con) {
    var t = h.reduce(function (a, v) { return a + v; }, 0);
    return '<div class="apilada">' + h.map(function (v, i) { return v ? '<i style="--w:' + (v / t * 100) + '%;--c:' + TIPOS[i][1] + '" title="' + TIPOS[i][0] + ': ' + v + ' h">' + (con ? '<span>' + v + ' h</span>' : '') + '</i>' : ''; }).join('') + '</div>' +
      (con ? '<div class="leyenda">' + TIPOS.map(function (x, i) { return '<span style="--c:' + x[1] + '">' + x[0] + ' · <b>' + h[i] + ' h</b></span>'; }).join('') + '</div>' : '');
  }

  /* ---------- nosotros ---------- */
  if (pag === 'nosotros') {
    $('.js-equipo').innerHTML = S.EQUIPO.map(S.tarjetaEquipo).join(''); S.revelar();
    // misión y visión: las palabras entran una tras otra y luego se subrayan las claves
    $$('.js-palabras').forEach(function (el) {
      var i = 0, m = 0;
      (function partir(nodo) {
        [].slice.call(nodo.childNodes).forEach(function (n) {
          if (n.nodeType === 3) {
            var f = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(function (w) {
              if (!w) return;
              if (/^\s+$/.test(w)) { f.appendChild(document.createTextNode(w)); return; }
              var s = document.createElement('span'); s.className = 'w'; s.style.setProperty('--i', i++); s.textContent = w; f.appendChild(s);
            });
            n.parentNode.replaceChild(f, n);
          } else if (n.nodeType === 1) { if (n.tagName === 'MARK') n.style.setProperty('--m', m++); partir(n); }
        });
      })(el);
      if (S.reducir) { el.classList.add('ver'); return; }
      new IntersectionObserver(function (es, o) { es.forEach(function (e) { if (e.isIntersecting) { el.classList.add('ver'); o.disconnect(); } }); }, { threshold: 0.3 }).observe(el);
    });
    // historia: el paso que está en el centro de la pantalla se enciende y mueve el contador
    var pasos = $$('.js-hist .hist-paso'), num = $('.js-hist-n'), barra = $('.js-hist-barra');
    function encender(k) {
      pasos.forEach(function (p, j) { p.classList.toggle('on', j <= k); });
      num.textContent = String(k + 1).padStart(2, '0'); barra.style.transform = 'scaleX(' + ((k + 1) / pasos.length) + ')';
    }
    if (S.reducir) encender(pasos.length - 1);
    else {
      // el último paso cuyo borde superior ya pasó la mitad de la pantalla (al final de la sección quedan todos encendidos)
      var pend = false, ult = -1;
      var medir = function () { pend = false; var k = 0, mitad = innerHeight * 0.55; pasos.forEach(function (p, j) { if (p.getBoundingClientRect().top < mitad) k = j; }); if (k !== ult) { ult = k; encender(k); } };
      addEventListener('scroll', function () { if (!pend) { pend = true; requestAnimationFrame(medir); } }, { passive: true });
      medir();
    }
    var simple = $('.js-simple');
    simple.addEventListener('click', function () { simple.classList.remove('wig'); void simple.offsetWidth; simple.classList.add('wig'); S.confeti(); setTimeout(function () { simple.classList.remove('wig'); }, 500); });
  }

  /* ---------- oferta académica ---------- */
  if (pag === 'oferta') {
    var cont = $('.js-modulos'), PM = window.SMP_MODULOS || [];
    function porNum(n) { return PM.filter(function (x) { return x.n === n; })[0]; }
    cont.innerHTML = S.MODULOS.map(function (m, i) {
      return '<article class="modp rv tilt" data-s="' + m.s + '" style="--d:' + (i % 3 * 0.05) + 's"><div class="modp-img"><img src="assets/img/cursos/' + m.img + '-sm.webp" alt="" loading="lazy"><span class="tag tag-y">Temario completo</span></div>' +
        '<div class="modp-c"><small>Módulo ' + String(m.num).padStart(2, '0') + ' · Semestre ' + m.s + ' · 100 h</small><h3>' + m.n + '</h3><p>' + m.d + '</p>' +
        '<div class="modp-acc"><a class="btn btn-s" href="' + m.plan + '" data-mira>Ver temario ' + S.ico(S.I.flecha, 'ico-f') + '</a><button class="btn btn-s btn-o js-ver-plan" data-k="' + m.num + '" data-mira>Resumen</button></div></div></article>';
    }).join('');
    $$('.js-filtro button').forEach(function (bt) {
      bt.addEventListener('click', function () {
        $$('.js-filtro button').forEach(function (x) { x.classList.toggle('on', x === bt); });
        var s = bt.dataset.s; $$('.modp', cont).forEach(function (c) { c.style.display = s === '0' || c.dataset.s === s ? '' : 'none'; });
      });
    });
    var planEl = $('.js-plan'), tabs = $('.js-plan-tabs');
    tabs.innerHTML = PM.map(function (m) { return '<button data-k="' + m.n + '" title="' + S.esc(m.corto) + '">' + String(m.n).padStart(2, '0') + '</button>'; }).join('');
    function plan(k) {
      var m = porNum(+k); if (!m) return;
      $$('button', tabs).forEach(function (x) { x.classList.toggle('on', +x.dataset.k === m.n); });
      planEl.innerHTML = '<div class="plan-cab"><div><small>Módulo ' + String(m.n).padStart(2, '0') + ' · Semestre ' + m.s + ' · 100 horas · ' + m.unidades.length + ' unidades</small><h3>' + S.esc(m.corto) + '</h3><p class="plan-lema">' + S.esc(m.lema) + '</p></div>' + S.burst(m.horas[2] + '%<small>práctica</small>', '#FFC225', '#373435', 96) + '</div>' +
        '<div class="plan-tres"><div><h4>Para quién es</h4><p>' + S.esc(m.paraQuien) + '</p></div><div><h4>Qué necesitas</h4><ul>' + m.necesitas.map(function (r) { return '<li>' + S.esc(r) + '</li>'; }).join('') + '</ul></div><div><h4>Lo que vas a hacer</h4><p>' + S.esc(m.haras) + '</p></div></div>' +
        '<div class="plan-horas"><h4>Cómo se reparten las 100 horas</h4>' + barra(m.horas, true) + '</div>' +
        '<h4 class="plan-u-t">Unidades <small>Toca una para ver de qué se trata y el entregable</small></h4><ol class="unidades">' + m.unidades.map(function (u, i) {
          var t = u.h.reduce(function (a, v) { return a + v; }, 0);
          return '<li class="unidad' + (i === 0 ? ' abierta' : '') + '"><button class="unidad-bt" aria-expanded="' + (i === 0) + '" data-mira><b>U' + (i + 1) + '</b><span>' + S.esc(u.t) + '</span><em>' + String(t).replace('.', ',') + ' h</em>' + barra(u.h) + '<i class="mas">' + S.ico(S.I.mas) + '</i></button>' +
            '<div class="unidad-c"><div><p class="unidad-txt">' + S.esc(u.c) + '</p><div class="entregable"><small>Entregable</small><p>' + S.esc(u.e) + '</p></div></div></div></li>';
        }).join('') + '</ol>' +
        '<div class="plan-ir"><p>Herramientas, horas por unidad y el proyecto que sustentas al final, en el plan de estudios.</p><a class="btn" href="plan-de-estudios/#m' + m.n + '" data-mira>Ver el módulo completo ' + S.ico(S.I.flecha, 'ico-f') + '</a></div>';
    }
    plan(1);
    planEl.addEventListener('click', function (e) { var bt = e.target.closest('.unidad-bt'); if (!bt) return; var a = bt.parentNode.classList.toggle('abierta'); bt.setAttribute('aria-expanded', a); });
    $$('button', tabs).forEach(function (bt) { bt.addEventListener('click', function () { plan(bt.dataset.k); }); });
    cont.addEventListener('click', function (e) { var bt = e.target.closest('.js-ver-plan'); if (!bt) return; plan(bt.dataset.k); $('#plan').scrollIntoView({ behavior: S.reducir ? 'auto' : 'smooth' }); });
    var hm = /^#plan-(\d+)$/.exec(location.hash); if (hm) plan(hm[1]);
    S.revelar(); S.tilt();
  }

  /* ---------- cómo funciona ---------- */
  if (pag === 'funciona') {
    var PASOS = [
      ['Te inscribes', 'Llenas el formulario en dos minutos o nos escribes por WhatsApp. Nos cuentas qué te interesa aprender.', 'inscripcion.html', 'Ir al formulario'],
      ['Te contacta admisiones', 'El equipo de admisiones resuelve tus dudas: valor, formas de pago, fecha de inicio del próximo grupo, horarios y documentos.', S.waLink('Hola, quiero hablar con admisiones de Semply.'), 'Hablar con admisiones'],
      ['Haces tu matrícula', 'Formalizas tu cupo en el próximo grupo y recibes tu acceso a la plataforma.', '', ''],
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

    // cómo se estudia a distancia: tres momentos de cada unidad
    var VIR = {
      grabadas: ['Clases grabadas', 'Cápsulas de 8 a 10 minutos con la teoría, casos reales y demostraciones. Las ves cuando quieras y las repites las veces que necesites.', S.ico(S.I.libro), 'A tu ritmo, cualquier día'],
      vivo: ['Sesiones en vivo', 'Talleres con tu docente y tu grupo para resolver dudas y avanzar en tu proyecto. Tienen horario fijo por grupo y quedan grabadas.', S.ico(S.I.chat), 'Horario que te confirma admisiones'],
      practica: ['Práctica y entregas', 'Construyes el entregable de cada unidad sobre un negocio real, lo subes a la plataforma y recibes retroalimentación con rúbrica.', S.ico(S.I.check), 'A tu ritmo, con fecha de entrega']
    };
    var sel = 'grabadas', res = $('.js-elige');
    function pintaElige() {
      var v = VIR[sel];
      res.innerHTML = '<div class="elige-tarj"><span class="elige-ic">' + v[2] + '</span><h3>' + v[0] + '</h3><p>' + v[1] + '</p><p class="elige-cuando">' + S.ico(S.I.reloj) + v[3] + '</p>' +
        '<p class="elige-nota">Solo necesitas computador o celular con buena conexión.</p><a class="btn btn-y btn-s" href="inscripcion.html" data-mira>Inscribirme ' + S.ico(S.I.flecha, 'ico-f') + '</a></div>';
    }
    pintaElige();
    $('.js-virtual').addEventListener('click', function (e) {
      var bt = e.target.closest('button'); if (!bt) return; sel = bt.dataset.v;
      $$('button', $('.js-virtual')).forEach(function (x) { x.classList.toggle('on', x === bt); x.setAttribute('aria-checked', x === bt); });
      pintaElige();
    });

    var rep = $('.js-reparto'), PM2 = window.SMP_MODULOS || [];
    var REP = { mod: PM2.length ? PM2[0].horas : [15, 20, 50, 15], prog: PM2.reduce(function (a, m) { return a.map(function (v, i) { return v + m.horas[i]; }); }, [0, 0, 0, 0]) };
    function pintaRep(k) { if (!REP[k]) return; rep.innerHTML = barra(REP[k], true); $$('.js-reparto-tabs button').forEach(function (x) { x.classList.toggle('on', x.dataset.k === k); }); }
    pintaRep('mod');
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
        '<div class="fld"><label for="i-ci">Ciudad</label><input id="i-ci" class="inp" autocomplete="address-level2" list="ciudades" placeholder="Tu ciudad"><datalist id="ciudades"><option>Yumbo</option><option>Cali</option><option>Palmira</option><option>Jamundí</option><option>Buga</option><option>Tuluá</option></datalist></div>' +
        '<div class="fld"><label for="i-co">¿Cómo nos conociste?</label><select id="i-co" class="inp"><option>Redes sociales</option><option>Un amigo o familiar</option><option>Google</option><option>Otro</option></select></div>' +
        '<div class="fld full"><label for="i-m">¿Algo que quieras contarnos? (opcional)</label><textarea id="i-m" class="inp">' + (interes && temas[interes] ? 'Me interesa sobre todo ' + temas[interes] + '.' : '') + '</textarea></div>' +
        '<label class="check full"><input type="checkbox" required><span>Autorizo a Semply a contactarme y a tratar mis datos según la Ley 1581 de 2012.</span></label>' +
        '<button class="btn full" data-mira>Enviar inscripción ' + S.ico(S.I.flecha, 'ico-f') + '</button></div></form>';
    }
    formulario();
    caja.addEventListener('submit', function (e) {
      e.preventDefault(); var f = e.target; if (!S.validar(f)) return;
      var d = { nombre: $('#i-n').value.trim(), tel: $('#i-t').value.trim(), correo: $('#i-c').value.trim(), ciudad: $('#i-ci').value.trim(), como: $('#i-co').value, nota: $('#i-m').value.trim() };
      var btn = $('button.btn', f); btn.classList.add('cargando');
      setTimeout(function () {
        S.guardar('inscripcion', d);
        var msg = 'Hola, quiero inscribirme al Técnico Laboral en Marketing Digital e IA.\nNombre: ' + d.nombre + '\nCelular: ' + d.tel + '\nCorreo: ' + d.correo + '\nCiudad: ' + d.ciudad + (d.nota ? '\nNota: ' + d.nota : '');
        caja.innerHTML = '<div class="exito">' + S.burst('¡Listo!', '#F10E3B', '#fff', 120, 'rel') + '<h3>Gracias, ' + S.esc(d.nombre.split(' ')[0]) + '.</h3><p style="color:var(--tx2);max-width:420px">Recibimos tu inscripción al Técnico Laboral, 100 % virtual. Para que admisiones te atienda más rápido, envíanos también tus datos por WhatsApp.</p>' +
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
