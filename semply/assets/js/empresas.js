/* Semply · empresas: panel de muestra, calculadora y formulario de demo */
(function () {
  var S = Semply, D = SEMPLY, $ = S.$, $$ = S.$$;
  $('.js-logos').innerHTML = '<span style="font-size:14px;font-family:var(--f-txt);font-weight:500;width:100%">Equipos que ya aprenden con Semply</span>' + D.marcasEmpresa.map(function (m) { return '<span>' + m + '</span>'; }).join('');
  $('.js-burst-h').outerHTML = S.burst('B2B<small>a la medida</small>', '#F10E3B', '#fff', 120);

  /* cifras */
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { S.contar(e.target, +e.target.dataset.n, 1400); io.unobserve(e.target); } }); }, { threshold: .5 });
  $$('.js-cuenta, .js-kpi').forEach(function (e) { io.observe(e); });

  /* panel de muestra */
  var EQ = [['Valeria Ríos', 'Contenido', 'IA aplicada', 92, 'hoy'], ['Mateo Londoño', 'Pauta', 'IA aplicada', 78, 'ayer'], ['Sara Jiménez', 'Ecommerce', 'SEO y web', 71, 'hoy'], ['Daniel Patiño', 'Marca', 'IA aplicada', 64, 'hace 2 días'], ['Luisa Herrera', 'Servicio al cliente', 'Cursos cortos', 55, 'hace 3 días'], ['Andrés Mora', 'Comercial', 'SEO y web', 23, 'hace 9 días']];
  var RU = [['IA aplicada al marketing', 14, 74, 'Unidad 5'], ['SEO y posicionamiento web', 8, 58, 'Unidad 4'], ['Cursos cortos (Semply Pro)', 8, 61, '3 cursos por persona']];
  function tabla(t) {
    $('.js-ptabla').innerHTML = t === 'equipo' ? '<table><thead><tr><th>Persona</th><th>Área</th><th>Ruta</th><th>Avance</th><th>Último ingreso</th><th></th></tr></thead><tbody>' + EQ.map(function (p) { return '<tr><td style="display:flex;align-items:center;gap:10px"><span class="avatar" style="width:30px;height:30px;font-size:11px">' + S.iniciales(p[0]) + '</span>' + p[0] + '</td><td>' + p[1] + '</td><td>' + p[2] + '</td><td><span class="mini"><b style="width:' + p[3] + '%"></b></span>' + p[3] + ' %</td><td>' + p[4] + '</td><td>' + (p[3] < 30 ? '<button class="btn btn-o btn-s js-recordar">Recordarle</button>' : '<span class="tag tag-v">Al día</span>') + '</td></tr>'; }).join('') + '</tbody></table>'
      : '<table><thead><tr><th>Ruta</th><th>Personas</th><th>Avance</th><th>Van en</th></tr></thead><tbody>' + RU.map(function (r) { return '<tr><td><b style="font-family:var(--f-tit);font-weight:600">' + r[0] + '</b></td><td>' + r[1] + '</td><td><span class="mini"><b style="width:' + r[2] + '%"></b></span>' + r[2] + ' %</td><td>' + r[3] + '</td></tr>'; }).join('') + '</tbody></table>';
  }
  tabla('equipo');
  $$('.js-ptabs button').forEach(function (b) { b.addEventListener('click', function () { $$('.js-ptabs button').forEach(function (x) { x.classList.toggle('on', x === b); }); tabla(b.dataset.p); }); });
  document.addEventListener('click', function (e) { var b = e.target.closest('.js-recordar'); if (b) { b.outerHTML = '<span class="tag tag-y">Recordatorio enviado</span>'; S.toast('Le enviamos un recordatorio amable a Andrés', 'campana'); } });

  /* calculadora */
  var RUTAS = [['ia', 'IA aplicada', 1290000, 100], ['seo', 'SEO y web', 1290000, 100], ['ruta', 'Las dos', 2290000, 200], ['pro', 'Cursos cortos (Pro)', 590000, 28]];
  $('.js-rutas').innerHTML = RUTAS.map(function (r, i) { return '<label class="opcion"><input type="radio" name="ruta" value="' + i + '"' + (i === 0 ? ' checked' : '') + '><span><b>' + r[1] + '</b>' + S.fmt(r[2]) + ' c/u</span></label>'; }).join('');
  function calc() {
    var n = +$('.js-n').value, r = RUTAS[+$('input[name=ruta]:checked').value], ses = +$('input[name=ses]:checked').value;
    var dsc = n >= 50 ? .25 : n >= 25 ? .18 : n >= 10 ? .1 : 0;
    var pp = Math.round(r[2] * (1 - dsc) / 1000) * 1000, meses = r[3] >= 200 ? 5 : r[0] === 'pro' ? 12 : 3;
    var tot = pp * n + (ses ? 1800000 * meses : 0), horas = r[3] * n;
    $('.js-n-o').textContent = n;
    $('.js-pp').textContent = S.fmt(pp); $('.js-desc').textContent = dsc ? '−' + Math.round(dsc * 100) + ' %' : 'Desde 10 personas';
    $('.js-horas').textContent = horas.toLocaleString('es-CO') + ' h'; $('.js-hora').textContent = S.fmt(tot / horas);
    $('.js-total').textContent = S.fmt(tot);
  }
  document.addEventListener('input', function (e) { if (e.target.closest('.calc')) calc(); });
  document.addEventListener('change', function (e) { if (e.target.closest('.calc')) calc(); });
  calc();

  /* preguntas */
  $('.js-faq-emp').innerHTML = [
    ['¿Emiten factura electrónica?', 'Sí, a nombre de tu empresa y con el NIT que nos indiques. Aceptamos pago por transferencia a 30 días.'],
    ['¿Puedo cambiar a una persona de la ruta?', 'Sí. Si alguien sale de la empresa, su cupo pasa a otra persona y el avance arranca desde cero para quien llega.'],
    ['¿Las sesiones privadas se graban?', 'Todas. Quedan en el campus de tu equipo durante el tiempo del contrato.'],
    ['¿Qué recibe cada persona al terminar?', 'Una constancia digital de asistencia y aprobación con código de verificación. Semply es educación informal: no entrega títulos.']
  ].map(function (f) { return '<div class="acc-it"><button class="acc-bt" aria-expanded="false">' + f[0] + '<span class="mas">' + S.ico('mas') + '</span></button><div class="acc-cont"><div><p>' + f[1] + '</p></div></div></div>'; }).join('');
  S.acordeon($('.js-faq-emp'));

  /* demo */
  $('.js-demo').addEventListener('submit', function (e) {
    e.preventDefault(); var f = e.target, ok = true;
    $$('[required]', f).forEach(function (i) { var bien = i.type === 'checkbox' ? i.checked : i.type === 'email' ? /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value) : i.value.trim().length > 0; var fl = i.closest('.fld'); if (fl) fl.classList.toggle('mal', !bien); if (i.type === 'checkbox' && !bien) i.closest('.check').style.color = 'var(--rojo)'; if (!bien && ok) { i.focus(); ok = false; } });
    if (!ok) return;
    var nombre = $('#e-n').value.trim().split(' ')[0], hoy = new Date(), slots = [], d = new Date(hoy);
    while (slots.length < 3) { d.setDate(d.getDate() + 1); if (d.getDay() > 0 && d.getDay() < 6) slots.push(new Date(d)); }
    $('.js-demo-caja').innerHTML = '<div class="exito">' + S.burst('¡Gracias!', '#F10E3B', '#fff', 110) + '<h3 class="t-m">Listo, ' + S.esc(nombre) + '.</h3><p class="muted">Elige un espacio de 30 minutos y te enviamos la invitación por correo.</p><div class="opciones" style="justify-content:center">' +
      slots.map(function (s) { return ['9:00 a. m.', '11:30 a. m.', '3:00 p. m.'].map(function (h) { return '<label class="opcion"><input type="radio" name="slot" value="' + S.DIAS[s.getDay()] + ' ' + S.fecha(s) + ', ' + h + '"><span><b>' + S.DIAS[s.getDay()] + ' ' + s.getDate() + '</b>' + h + '</span></label>'; }).join(''); }).join('') + '</div><button class="btn btn-r js-confirmar" disabled>Confirmar demo</button></div>';
    var caja = $('.js-demo-caja');
    caja.addEventListener('change', function () { $('.js-confirmar', caja).disabled = false; });
    caja.addEventListener('click', function (x) { if (!x.target.closest('.js-confirmar')) return; var v = $('input[name=slot]:checked', caja).value; caja.innerHTML = '<div class="exito">' + S.burst('¡Hecho!', '#FFC225', '#373435', 110) + '<h3 class="t-m">Demo agendada</h3><p class="muted">' + S.esc(v) + '. La invitación llega a tu correo en unos minutos.</p></div>'; S.toast('Demo agendada: ' + v, 'calendario'); });
  });
})();
