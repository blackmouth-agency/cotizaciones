/* Semply · carrito y pago (modo demostración: no se cobra nada ni se envía ningún dato) */
(function () {
  var S = Semply, D = SEMPLY, $ = S.$, $$ = S.$$;
  var paso = 1, metodo = 'tarjeta', cupon = S.leer('cupon', null), datos = S.leer('datosCompra', {});
  var CUPONES = { SEMPLY10: { pct: 10, txt: '10 % de bienvenida' }, PROFE20: { pct: 20, txt: '20 % para docentes' } };
  var PASOS = ['Carrito', 'Tus datos', 'Pago', 'Listo'];
  var BANCOS = ['Bancolombia', 'Banco de Bogotá', 'Davivienda', 'BBVA Colombia', 'Banco de Occidente', 'Banco Popular', 'Banco Caja Social', 'Scotiabank Colpatria', 'Banco AV Villas', 'Nequi', 'Daviplata', 'Lulo Bank', 'Nu Colombia'];

  function cuentas() {
    var items = S.carrito(), sub = 0, hoy = 0, antes = 0;
    items.forEach(function (it) { var x = S.item(it); if (!x) return; sub += x.precio; antes += x.antes || x.precio; hoy += it.pago === 'cuotas' ? x.precio / 4 : x.precio; });
    var desc = cupon && CUPONES[cupon] ? Math.round(sub * CUPONES[cupon].pct / 100) : 0;
    var hoyDesc = sub ? Math.round(hoy - desc * (hoy / sub)) : 0;
    return { items: items, sub: sub, antes: antes, ahorro: antes - sub, desc: desc, total: sub - desc, hoy: hoyDesc, cuotas: hoy < sub };
  }
  function pasos() {
    $('.js-pasos').innerHTML = PASOS.map(function (p, i) { var n = i + 1; return (i ? '<span class="linea"></span>' : '') + '<span class="' + (n < paso ? 'ok' : n === paso ? 'on' : '') + '"><i>' + (n < paso ? '✓' : n) + '</i>' + p + '</span>'; }).join('');
  }
  function resumen(boton) {
    var t = cuentas();
    return '<aside class="resumen"><div class="caja"><h2>Resumen</h2>' +
      (paso === 1 ? '<form class="cupon js-cupon"><label class="sr" for="cup">Cupón</label><input id="cup" class="inp" placeholder="Cupón (prueba SEMPLY10)" value="' + (cupon || '') + '"><button class="btn btn-o btn-s">Aplicar</button></form>' : '') +
      '<dl><dt>Subtotal</dt><dd>' + S.fmt(t.sub) + '</dd>' + (t.ahorro > 0 ? '<dt>Ahorro de lanzamiento</dt><dd style="color:var(--verde)">−' + S.fmt(t.ahorro) + ' <small class="muted">(ya aplicado)</small></dd>' : '') +
      (t.desc ? '<dt>Cupón ' + cupon + '</dt><dd style="color:var(--verde)">−' + S.fmt(t.desc) + '</dd>' : '') +
      '<dt class="total">Total</dt><dd class="total">' + S.fmt(t.total) + '</dd>' +
      (t.cuotas ? '<dt>Pagas hoy</dt><dd style="color:var(--rojo)">' + S.fmt(t.hoy) + '</dd><dt colspan="2" class="muted" style="grid-column:1/-1;font-size:13.5px">Las cuotas restantes se cobran cada mes con el mismo medio de pago.</dt>' : '') + '</dl>' +
      boton + '<p class="garantia" style="margin-top:14px">' + S.ico('escudo') + ' Pago protegido · 7 días de garantía</p></div></aside>';
  }

  function paso1() {
    var t = cuentas();
    if (!t.items.length) {
      var sug = D.cursos.filter(function (c) { return c.top || c.tipo === 'programa'; }).slice(0, 4);
      return '<div class="vacio" style="margin-bottom:48px">' + S.burst('0', '#FFC225', '#373435', 96) + '<h1 class="t-m">Tu carrito está vacío</h1><p class="muted">Todavía no has elegido nada. Aquí van los más buscados de la semana.</p><a class="btn btn-r" href="cursos.html">Ver el catálogo</a></div><div class="grid-cursos" style="margin-bottom:96px">' + sug.map(S.cardCurso).join('') + '</div>';
    }
    return '<div class="compra-grid"><div><div class="caja"><h2>Tu carrito (' + t.items.length + ')</h2>' + t.items.map(function (it) {
      var x = S.item(it);
      return '<div class="item">' + S.img(x.img, '') + '<div><h3>' + (x.url ? '<a href="' + x.url + '">' + x.titulo + '</a>' : x.titulo) + '</h3><small>' + x.sub + '</small>' + (it.regalo ? '<small style="color:var(--rojo)">' + S.ico('regalo') + ' Regalo para ' + S.esc(it.regalo) + '</small>' : '') + '<button class="quitar js-quitar" data-s="' + it.slug + '">' + S.ico('basura') + 'Quitar</button></div><div style="text-align:right"><div class="precio">' + S.fmt(x.precio) + '</div>' + (x.antes ? '<s class="muted" style="font-size:14px">' + S.fmt(x.antes) + '</s>' : '') + (it.pago === 'cuotas' ? '<small class="muted">4 × ' + S.fmt(x.precio / 4) + '</small>' : '') + '</div></div>';
    }).join('') + '</div>' +
      (t.items.some(function (i) { return i.slug === 'pro'; }) ? '' : '<div class="caja" style="display:flex;gap:16px;align-items:center;background:var(--amarillo-s);border-color:var(--amarillo)">' + S.ico('chispa') + '<div style="flex:1"><b style="font-family:var(--f-tit)">¿Vas a tomar más de cinco cursos este año?</b><p class="muted" style="font-size:14.5px">Con Semply Pro tienes todos los cursos cortos por ' + S.fmt(D.planes.pro.anual) + ' al año.</p></div><button class="btn btn-o btn-s js-pro">Cambiar a Pro</button></div>') +
      '</div>' + resumen('<button class="btn btn-r btn-l btn-full js-seguir">Continuar ' + S.ico('flecha', 'ico-flecha') + '</button>') + '</div>';
  }

  function paso2() {
    var u = S.sesion() || {};
    var v = function (k, def) { return S.esc(datos[k] || u[k] || def || ''); };
    return '<div class="compra-grid"><form class="caja js-datos" novalidate><h2>Tus datos</h2>' + (u.nombre ? '<div class="demo-aviso" style="background:var(--verde-s)">' + S.ico('check') + '<span>Compras como <b>' + S.esc(u.nombre) + '</b>. Los cursos aparecerán en tu campus.</span></div>' : '<p class="muted" style="margin:-8px 0 18px">Con estos datos creamos tu acceso al campus. ¿Ya tienes cuenta? <a class="lnk" href="ingresar.html?volver=carrito.html">Ingresa</a></p>') +
      '<div class="form-2">' +
      '<div class="fld full"><label for="d-n">Nombre completo</label><input id="d-n" name="nombre" class="inp" autocomplete="name" required value="' + v('nombre') + '"><span class="err">Escribe tu nombre.</span></div>' +
      '<div class="fld"><label for="d-c">Correo</label><input id="d-c" name="correo" type="email" class="inp" autocomplete="email" required value="' + v('correo') + '"><span class="err">Revisa el correo.</span></div>' +
      '<div class="fld"><label for="d-t">Celular</label><input id="d-t" name="cel" type="tel" class="inp" autocomplete="tel" inputmode="numeric" placeholder="300 123 4567" required value="' + v('cel') + '"><span class="err">Escribe un celular de 10 dígitos.</span></div>' +
      '<div class="fld"><label for="d-td">Documento</label><select id="d-td" name="tdoc" class="inp"><option>Cédula de ciudadanía</option><option>Cédula de extranjería</option><option>NIT (factura a empresa)</option><option>Pasaporte</option></select></div>' +
      '<div class="fld"><label for="d-doc">Número</label><input id="d-doc" name="doc" class="inp" inputmode="numeric" required value="' + v('doc') + '"><span class="err">Escribe el número de documento.</span></div>' +
      '<div class="fld"><label for="d-ci">Ciudad</label><input id="d-ci" name="ciudad" class="inp" autocomplete="address-level2" list="ciudades" value="' + v('ciudad') + '"><datalist id="ciudades"><option>Bogotá</option><option>Medellín</option><option>Cali</option><option>Barranquilla</option><option>Pereira</option><option>Bucaramanga</option><option>Buga</option></datalist></div>' +
      (u.nombre ? '' : '<div class="fld"><label for="d-p">Crea una contraseña</label><input id="d-p" name="clave" type="password" class="inp" autocomplete="new-password" minlength="6" required><span class="err">Mínimo 6 caracteres.</span></div>') +
      '<label class="check full"><input type="checkbox" name="acepto" required><span>Acepto los <a class="lnk js-pronto" href="#">términos</a> y autorizo el tratamiento de mis datos según la <a class="lnk js-pronto" href="#">política de privacidad</a> (Ley 1581 de 2012).</span></label>' +
      '<label class="check full"><input type="checkbox" name="news" checked><span>Quiero recibir una clase gratis cada mes.</span></label>' +
      '</div><div style="display:flex;justify-content:space-between;gap:12px;margin-top:24px;flex-wrap:wrap"><button type="button" class="btn btn-o js-atras">' + S.ico('izq') + 'Volver</button><button class="btn btn-r">Continuar al pago ' + S.ico('flecha', 'ico-flecha') + '</button></div></form>' + resumen('') + '</div>';
  }

  function paso3() {
    var t = cuentas();
    var M = [['tarjeta', 'Tarjeta', 'tarjeta'], ['pse', 'PSE', 'banco'], ['nequi', 'Nequi', 'celular'], ['efecty', 'Efecty', 'efectivo']];
    var cuerpo = {
      tarjeta: '<div class="tarjeta-vis js-tv"><div class="fila"><span class="chipt"></span><span class="js-tv-marca">Débito o crédito</span></div><div class="num js-tv-num">•••• •••• •••• ••••</div><div class="fila"><span class="js-tv-nom">' + S.esc((datos.nombre || 'Tu nombre').toUpperCase()) + '</span><span class="js-tv-ven">MM/AA</span></div></div>' +
        '<div class="form-2"><div class="fld full"><label for="p-n">Número de la tarjeta</label><input id="p-n" class="inp js-num" inputmode="numeric" autocomplete="off" placeholder="4242 4242 4242 4242" maxlength="19" required><span class="err">Revisa el número.</span></div>' +
        '<div class="fld"><label for="p-v">Vencimiento</label><input id="p-v" class="inp js-ven" inputmode="numeric" autocomplete="off" placeholder="MM/AA" maxlength="5" required><span class="err">Fecha no válida.</span></div>' +
        '<div class="fld"><label for="p-c">Código de seguridad</label><input id="p-c" class="inp" inputmode="numeric" autocomplete="off" placeholder="123" maxlength="4" required><span class="err">Revisa el código.</span></div>' +
        '<div class="fld full"><label for="p-q">Número de cuotas (tarjeta de crédito)</label><select id="p-q" class="inp">' + [1, 2, 3, 6, 12, 24, 36].map(function (n) { return '<option>' + n + (n === 1 ? ' cuota' : ' cuotas') + '</option>'; }).join('') + '</select></div></div>',
      pse: '<div class="form-2"><div class="fld"><label for="p-tp">Tipo de persona</label><select id="p-tp" class="inp"><option>Natural</option><option>Jurídica</option></select></div><div class="fld"><label for="p-b">Banco</label><select id="p-b" class="inp" required><option value="">Elige tu banco</option>' + BANCOS.map(function (b) { return '<option>' + b + '</option>'; }).join('') + '</select><span class="err">Elige un banco.</span></div></div><p class="muted" style="margin-top:14px;font-size:14.5px">Al pagar te llevamos a la página de tu banco y vuelves aquí cuando termines.</p>',
      nequi: '<div class="fld"><label for="p-nq">Celular registrado en Nequi</label><input id="p-nq" class="inp" inputmode="numeric" placeholder="300 123 4567" value="' + S.esc(datos.cel || '') + '" required><span class="err">Escribe un celular de 10 dígitos.</span></div><p class="muted" style="margin-top:14px;font-size:14.5px">Te llega una notificación a la app de Nequi para aprobar el pago.</p>',
      efecty: '<p>Generamos un código de pago que puedes llevar a cualquier punto Efecty en las próximas 48 horas. Tu acceso se activa en cuanto pagues.</p>'
    };
    return '<div class="compra-grid"><form class="caja js-pago" novalidate><h2>Pago</h2><div class="demo-aviso">' + S.ico('info') + '<span><b>Modo demostración.</b> Este prototipo no cobra nada ni envía datos a ningún lado. Puedes escribir cualquier número.</span></div>' +
      '<div class="metodos" role="tablist">' + M.map(function (m) { return '<button type="button" class="metodo" role="tab" data-m="' + m[0] + '" aria-pressed="' + (m[0] === metodo) + '">' + S.ico(m[2]) + m[1] + '</button>'; }).join('') + '</div>' +
      '<div class="js-metodo">' + cuerpo[metodo] + '</div>' +
      '<div style="display:flex;justify-content:space-between;gap:12px;margin-top:24px;flex-wrap:wrap"><button type="button" class="btn btn-o js-atras">' + S.ico('izq') + 'Volver</button><button class="btn btn-r btn-l">' + S.ico('candado') + (metodo === 'efecty' ? 'Generar código' : 'Pagar ' + S.fmt(t.hoy)) + '</button></div></form>' + resumen('') + '</div>';
  }

  function paso4() {
    var o = S.leer('ultimaOrden', {}), u = S.sesion() || {};
    return '<div class="listo">' + S.burst('¡Listo!', '#F10E3B', '#fff', 150) + '<h1>Ya eres parte de Semply, ' + S.esc((u.nombre || '').split(' ')[0]) + '.</h1><p class="lead" style="max-width:560px">' + (o.metodo === 'efecty' ? 'Tu código de pago Efecty es <b style="color:var(--gris)">' + o.efecty + '</b>. Tu acceso se activa apenas pagues.' : 'Tu pago fue aprobado. Ya puedes entrar a tus clases.') + ' Te enviamos el recibo a <b style="color:var(--gris)">' + S.esc(u.correo) + '</b>.</p>' +
      '<div class="caja" style="width:min(520px,100%);text-align:left"><div style="display:flex;justify-content:space-between;margin-bottom:12px"><span class="muted">Orden</span><b style="font-family:var(--f-tit)">' + o.id + '</b></div>' + (o.items || []).map(function (x) { return '<div style="display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-top:1px solid var(--linea)"><span>' + x.t + '</span><b style="font-family:var(--f-tit);font-weight:600">' + S.fmt(x.p) + '</b></div>'; }).join('') + '<div style="display:flex;justify-content:space-between;padding-top:12px;border-top:1.5px dashed var(--linea);font-family:var(--f-tit);font-weight:700;font-size:1.2rem"><span>Pagado hoy</span><span>' + S.fmt(o.hoy || 0) + '</span></div></div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><a class="btn btn-r btn-l" href="campus.html">Ir a mi campus ' + S.ico('flecha', 'ico-flecha') + '</a><a class="btn btn-o btn-l" href="cursos.html">Seguir explorando</a></div></div>';
  }

  function pintar() {
    pasos();
    $('.js-paso').innerHTML = [null, paso1, paso2, paso3, paso4][paso]();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (paso === 3) montarTarjeta();
  }
  function confeti() {
    var c = document.createElement('div'); c.className = 'confeti'; var cols = ['#F10E3B', '#FFC225', '#373435'];
    for (var i = 0; i < 70; i++) c.insertAdjacentHTML('beforeend', '<i style="left:' + Math.random() * 100 + '%;--c:' + cols[i % 3] + ';--t:' + (2.2 + Math.random() * 2) + 's;--dl:' + Math.random() * .8 + 's;--dx:' + (Math.random() * 200 - 100) + 'px;--rr:' + (Math.random() * 900 - 450) + 'deg"></i>');
    document.body.appendChild(c); setTimeout(function () { c.remove(); }, 5200);
  }
  function validar(form) {
    var ok = true;
    $$('[required]', form).forEach(function (i) {
      var bien = i.type === 'checkbox' ? i.checked : i.value.trim().length > 0;
      if (i.type === 'email') bien = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value);
      if (i.name === 'cel' || i.id === 'p-nq') bien = i.value.replace(/\D/g, '').length === 10;
      if (i.classList.contains('js-num')) bien = i.value.replace(/\D/g, '').length >= 15;
      if (i.classList.contains('js-ven')) bien = /^(0[1-9]|1[0-2])\/\d\d$/.test(i.value);
      if (i.minLength > 0) bien = bien && i.value.length >= i.minLength;
      var f = i.closest('.fld'); if (f) f.classList.toggle('mal', !bien);
      if (i.type === 'checkbox' && !bien) i.closest('.check').style.color = 'var(--rojo)';
      if (!bien && ok) { i.focus(); ok = false; }
    });
    return ok;
  }
  function montarTarjeta() {
    var n = $('.js-num'); if (!n) return;
    n.addEventListener('input', function () {
      var d = n.value.replace(/\D/g, '').slice(0, 16); n.value = d.replace(/(\d{4})(?=\d)/g, '$1 ');
      $('.js-tv-num').textContent = (d + '••••••••••••••••').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
      $('.js-tv-marca').textContent = /^4/.test(d) ? 'VISA' : /^5[1-5]/.test(d) ? 'MASTERCARD' : /^3[47]/.test(d) ? 'AMEX' : 'Débito o crédito';
    });
    var v = $('.js-ven');
    v.addEventListener('input', function () { var d = v.value.replace(/\D/g, '').slice(0, 4); v.value = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; $('.js-tv-ven').textContent = v.value || 'MM/AA'; });
  }
  function finalizar() {
    var t = cuentas(), u = S.sesion();
    if (!u) u = S.entrar({ nombre: datos.nombre, correo: datos.correo, ciudad: datos.ciudad || '', negocio: '' });
    var slugs = [], esPro = false;
    t.items.forEach(function (it) { var x = S.item(it); if (x.pro) esPro = true; x.slugs.forEach(function (s) { if (slugs.indexOf(s) < 0) slugs.push(s); }); });
    slugs.forEach(function (s) { S.inscribir(s, { cohorte: (t.items.filter(function (i) { return i.slug === s; })[0] || {}).cohorte }); });
    if (esPro) { u.plan = 'Semply Pro'; S.guardar('sesion', u); }
    S.guardar('ultimaOrden', { id: 'SMP-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 90000) + 10000), metodo: metodo, efecty: String(Math.floor(Math.random() * 9e9) + 1e9), hoy: t.hoy, items: (function () { var l = t.items.map(function (it) { var x = S.item(it); return { t: x.titulo + (it.pago === 'cuotas' ? ' · cuota 1 de 4' : ''), p: it.pago === 'cuotas' ? x.precio / 4 : x.precio }; }); var d = l.reduce(function (a, x) { return a + x.p; }, 0) - t.hoy; if (d > 0) l.push({ t: 'Cupón ' + cupon, p: -d }); return l; })() });
    S.vaciar(); S.guardar('cupon', null); cupon = null;
    paso = 4; pintar(); confeti(); S.header('carrito');
  }

  document.addEventListener('click', function (e) {
    var q = e.target.closest('.js-quitar'); if (q) { S.quitar(q.dataset.s); S.toast('Quitado del carrito', 'basura'); pintar(); }
    if (e.target.closest('.js-seguir')) { paso = 2; pintar(); }
    if (e.target.closest('.js-atras')) { paso--; pintar(); }
    if (e.target.closest('.js-pro')) { S.agregar('pro', { periodo: 'anual' }, true); pintar(); S.toast('Agregamos Semply Pro anual. Puedes quitar los cursos sueltos que ya incluye.', 'chispa'); }
    var m = e.target.closest('.metodo'); if (m) { metodo = m.dataset.m; pintar(); }
  });
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f.classList.contains('js-cupon')) {
      e.preventDefault(); var v = $('#cup').value.trim().toUpperCase();
      if (CUPONES[v]) { cupon = v; S.guardar('cupon', v); S.toast('Cupón aplicado: ' + CUPONES[v].txt, 'check'); }
      else if (v) { S.toast('Ese cupón no existe o ya venció', 'info'); cupon = null; S.guardar('cupon', null); }
      pintar();
    }
    if (f.classList.contains('js-datos')) {
      e.preventDefault(); if (!validar(f)) return;
      var fd = new FormData(f); fd.forEach(function (v, k) { if (k !== 'clave') datos[k] = v; }); S.guardar('datosCompra', datos);
      paso = 3; pintar();
    }
    if (f.classList.contains('js-pago')) {
      e.preventDefault(); if (!validar(f)) return;
      var caja = f; caja.innerHTML = '<div class="procesando"><div class="anillo"></div><h2 class="t-s">' + (metodo === 'pse' ? 'Conectando con tu banco…' : metodo === 'nequi' ? 'Revisa tu app de Nequi…' : 'Procesando el pago…') + '</h2><p class="muted">No cierres esta ventana.</p></div>';
      setTimeout(finalizar, metodo === 'efecty' ? 900 : 2200);
    }
  });
  pintar();
})();
