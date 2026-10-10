/* Semply · ingresar, crear cuenta y recuperar contraseña (prototipo: cualquier correo funciona) */
(function () {
  var S = Semply, D = SEMPLY, $ = S.$, $$ = S.$$;
  var modo = S.param('modo') === 'registro' ? 'registro' : 'ingreso';
  var volver = S.param('volver') || 'campus.html';
  if (!/^[a-z0-9-]+\.html/i.test(volver)) volver = 'campus.html';
  $('.js-burst').outerHTML = S.burst('Hola<small>de nuevo</small>', '#FFC225', '#373435', 120);
  var G = '<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.2l7.9 6.2C12.5 13.6 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 6.9-10.3 6.9-17.7z"/><path fill="#FBBC05" d="M10.6 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6l-7.9-6.2A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l8-6.2z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.2 1.5-5 2.3-8.2 2.3-6.2 0-11.5-4.1-13.4-9.8l-8 6.2C6.6 42.6 14.6 48 24 48z"/></svg>';

  function pintar() {
    var reg = modo === 'registro';
    $('.js-auth').innerHTML =
      '<span class="ceja">' + (reg ? 'Crea tu cuenta' : 'Hola de nuevo') + '</span><h1>' + (reg ? 'Empieza gratis hoy.' : 'Entra a tu campus.') + '</h1><p class="muted">' + (reg ? 'Tu primera clase de cada curso es gratis. Sin tarjeta.' : 'Retoma tus clases donde las dejaste.') + '</p>' +
      '<div class="auth-tabs" role="tablist"><button role="tab" class="' + (!reg ? 'on' : '') + '" data-m="ingreso">Ingresar</button><button role="tab" class="' + (reg ? 'on' : '') + '" data-m="registro">Crear cuenta</button></div>' +
      '<div class="sociales"><button class="btn btn-o js-social" data-p="Google">' + G + 'Con Google</button><button class="btn btn-o js-social" data-p="Microsoft"><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="#F25022" d="M1 1h10v10H1z"/><path fill="#7FBA00" d="M13 1h10v10H13z"/><path fill="#00A4EF" d="M1 13h10v10H1z"/><path fill="#FFB900" d="M13 13h10v10H13z"/></svg>Con Microsoft</button></div>' +
      '<div class="o">o con tu correo</div>' +
      '<form class="auth-campos js-form" novalidate>' +
      (reg ? '<div class="fld"><label for="a-n">Nombre</label><input id="a-n" name="nombre" class="inp" autocomplete="name" required><span class="err">Escribe tu nombre.</span></div>' : '') +
      '<div class="fld"><label for="a-c">Correo</label><input id="a-c" name="correo" type="email" class="inp" autocomplete="email" required><span class="err">Revisa el correo.</span></div>' +
      '<div class="fld"><label for="a-p" style="display:flex;justify-content:space-between">Contraseña' + (reg ? '' : '<button type="button" class="lnk js-olvido" style="font-size:13.5px">¿La olvidaste?</button>') + '</label><div class="ver-clave"><input id="a-p" name="clave" type="password" class="inp" autocomplete="' + (reg ? 'new-password' : 'current-password') + '" minlength="6" required><button type="button" class="js-ver" aria-label="Mostrar contraseña">' + S.ico('ojo') + '</button></div><span class="err">Mínimo 6 caracteres.</span></div>' +
      (reg ? '<label class="check"><input type="checkbox" required><span>Acepto los términos y la política de datos (Ley 1581).</span></label>' : '<label class="check"><input type="checkbox" checked><span>Mantener la sesión iniciada</span></label>') +
      '<button class="btn btn-r btn-l btn-full">' + (reg ? 'Crear mi cuenta' : 'Ingresar') + '</button></form>' +
      '<button class="demo-btn js-demo"><span class="avatar" style="background:var(--amarillo)">NC</span><span><b>Entrar con la cuenta demo</b><small>Natalia Cardona · Café La Loma · ya va en la unidad 2</small></span>' + S.ico('flecha') + '</button>';
  }
  pintar();

  function ir() { location.href = volver; }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-m]'); if (t) { modo = t.dataset.m; pintar(); history.replaceState(null, '', 'ingresar.html' + (modo === 'registro' ? '?modo=registro' : '')); }
    if (e.target.closest('.js-ver')) { var i = $('#a-p'); i.type = i.type === 'password' ? 'text' : 'password'; }
    if (e.target.closest('.js-demo')) { S.entrar(D.ESTUDIANTE_DEMO, true); S.toast('Entraste como Natalia (cuenta demo)', 'usuario'); setTimeout(ir, 450); }
    var so = e.target.closest('.js-social');
    if (so) { so.classList.add('cargando'); setTimeout(function () { S.entrar(D.ESTUDIANTE_DEMO, true); ir(); }, 900); }
    if (e.target.closest('.js-olvido')) {
      var m = S.modal('<span class="ceja">Recuperar acceso</span><h2 class="t-m" style="margin:10px 0 8px">Te mandamos un enlace</h2><p class="muted" style="margin-bottom:18px">Escribe el correo con el que te inscribiste y te enviamos un enlace para crear una contraseña nueva.</p><form class="js-rec" style="display:grid;gap:14px"><div class="fld"><label for="r-c">Correo</label><input id="r-c" type="email" class="inp" required value="' + S.esc(($('#a-c') || {}).value || '') + '"></div><button class="btn btn-r">Enviar enlace</button></form>');
      $('.js-rec', m).addEventListener('submit', function (ev) { ev.preventDefault(); $('.js-rec', m).outerHTML = '<div class="exito">' + S.burst('¡Va!', '#FFC225', '#373435', 90) + '<p>Si <b>' + S.esc($('#r-c', m).value) + '</b> tiene cuenta, en un minuto te llega el enlace. Revisa también el spam.</p></div>'; });
    }
  });
  document.addEventListener('submit', function (e) {
    var f = e.target; if (!f.classList.contains('js-form')) return;
    e.preventDefault();
    var ok = true;
    $$('[required]', f).forEach(function (i) {
      var bien = i.type === 'checkbox' ? i.checked : i.type === 'email' ? /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value) : i.value.length >= (i.minLength > 0 ? i.minLength : 1);
      var fl = i.closest('.fld'); if (fl) fl.classList.toggle('mal', !bien); if (!bien && ok) { i.focus(); ok = false; }
    });
    if (!ok) return;
    var b = $('button.btn-r', f); b.classList.add('cargando');
    var correo = $('#a-c').value.trim();
    setTimeout(function () {
      if (modo === 'registro') { S.entrar({ nombre: $('#a-n').value.trim(), correo: correo }); S.toast('Cuenta creada. Ya eres parte de Semply.', 'check'); }
      else {
        var nom = correo.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, function (x) { return x.toUpperCase(); });
        if (correo === D.ESTUDIANTE_DEMO.correo) S.entrar(D.ESTUDIANTE_DEMO, true); else S.entrar({ nombre: nom, correo: correo });
      }
      ir();
    }, 700);
  });
})();
