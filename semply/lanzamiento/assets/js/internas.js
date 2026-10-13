/* Semply · páginas internas: nosotros, curso madre, inscripciones y contacto */
(function () {
  var S = window.SMP, $ = S.$, $$ = S.$$, pag = document.body.dataset.pagina, C = S.CONTACTO;
  var hero = $('.p-hero');
  S.iniciarComun(function () { return hero ? hero.offsetHeight - 90 : 40; });
  var b = $('.js-burst-p');
  if (b) b.outerHTML = { nosotros: S.burst('Yumbo<small>Valle</small>', '#FFC225', '#373435', 130), programa: S.burst('1.200<small>horas</small>', '#FFC225', '#373435', 140), inscripcion: S.burst('¡Abiertas!', '#F10E3B', '#fff', 130), contacto: S.burst('Hola<small>¿qué tal?</small>', '#FFC225', '#373435', 120) }[pag] || '';

  /* ---------- nosotros ---------- */
  if (pag === 'nosotros') { $('.js-equipo').innerHTML = S.EQUIPO.map(S.tarjetaEquipo).join(''); S.revelar(); }

  /* ---------- curso madre ---------- */
  if (pag === 'programa') {
    var T = window.SMP_TEMARIO || {};
    var cont = $('.js-modulos');
    cont.innerHTML = S.MODULOS.map(function (m, i) {
      var t = m.det && T[m.det];
      return '<article class="modp rv' + (t ? '' : ' pendiente') + '" data-s="' + m.s + '" style="--d:' + (i % 3 * 0.05) + 's"><div class="modp-img"><img src="assets/img/cursos/' + m.img + '-sm.webp" alt="" loading="lazy"><span class="tag ' + (t ? 'tag-y' : 'tag-b') + '">' + (t ? 'Temario publicado' : 'Contenido en construcción') + '</span></div>' +
        '<div class="modp-c"><small>Módulo ' + String(i + 1).padStart(2, '0') + ' · Semestre ' + m.s + ' · 100 h</small><h3>' + m.n + '</h3><p>' + m.d + '</p>' +
        (t ? '<button class="btn btn-s btn-o js-temario" aria-expanded="false" data-mira>Ver temario</button><ol class="temario">' + t.map(function (u) { return '<li><b>' + u.c + '</b>' + S.esc(u.n) + '</li>'; }).join('') + '</ol>' : '') + '</div></article>';
    }).join('');
    cont.addEventListener('click', function (e) { var bt = e.target.closest('.js-temario'); if (!bt) return; var c = bt.closest('.modp'), a = c.classList.toggle('abierto'); bt.setAttribute('aria-expanded', a); bt.textContent = a ? 'Ocultar temario' : 'Ver temario'; });
    $$('.js-filtro button').forEach(function (bt) {
      bt.addEventListener('click', function () {
        $$('.js-filtro button').forEach(function (x) { x.classList.toggle('on', x === bt); });
        var s = bt.dataset.s; $$('.modp', cont).forEach(function (c) { c.style.display = s === '0' || c.dataset.s === s ? '' : 'none'; });
      });
    });
    S.revelar();
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
    S.acordeon($('.js-faq'), [
      ['¿Cuánto dura el programa?', '1.200 horas, repartidas en dos semestres de seis módulos de 100 horas cada uno.'],
      ['¿En qué jornadas puedo estudiar?', 'Diurna, nocturna o fin de semana. Escoges la que prefieras al inscribirte.'],
      ['¿Puedo estudiar a distancia?', 'Sí. El programa es presencial y a distancia, con estrategia de educación virtual.'],
      ['¿Qué certificado recibo?', 'Al aprobar el programa recibes el certificado de ' + S.PROGRAMA.cert + '.'],
      ['¿Cuánto cuesta y cómo se paga?', 'El equipo de admisiones te cuenta el valor, lo que incluye y las formas de pago cuando te contacte.']
    ]);
  }

  /* ---------- contacto ---------- */
  if (pag === 'contacto') {
    $('.js-contactos').innerHTML = [
      [S.I.chat, 'WhatsApp', C.tel, S.waLink(), true], [S.I.tel, 'Teléfono', C.tel, 'tel:+57' + C.tel.replace(/ /g, '')], [S.I.correo, 'Correo', C.correo, 'mailto:' + C.correo], [S.I.pin, 'Sede', C.dir + ', ' + C.ciudad, 'https://www.google.com/maps?q=' + encodeURIComponent('Carrera 5 #12-43, Bolívar, Yumbo, Valle del Cauca'), true]
    ].map(function (c) { return '<a class="contacto-it" href="' + c[3] + '"' + (c[4] ? ' target="_blank" rel="noopener"' : '') + ' data-mira><span class="ic">' + S.ico(c[0]) + '</span><div><b>' + c[1] + '</b><span>' + c[2] + '</span></div></a>'; }).join('');
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
