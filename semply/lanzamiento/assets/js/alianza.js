/* Semply · piezas de la alianza con ADH Coaching (25-nov-2026): programas, precios, aliados y docentes.
   Se carga después de comun.js y antes del script de cada página, para que S.revelar() alcance lo que se pinta aquí. */
(function () {
  var S = window.SMP; if (!S) return;
  var $ = S.$, $$ = S.$$, P = S.PRECIOS, raiz = document.body.dataset.raiz || '';
  var flecha = S.ico(S.I.flecha, 'ico-f');

  /* programas */
  $$('.js-programas').forEach(function (el) {
    var mkt = S.PROGRAMAS[0], co = S.PROGRAMAS[1];
    el.innerHTML =
      '<article class="pgm pgm-mkt rv tilt" data-mira>' +
        '<span class="pgm-de"><img src="' + raiz + 'assets/img/logo-color.png" alt="" width="94" height="24">Programa Semply</span>' +
        '<h3>' + mkt.nombre + '</h3><p>' + mkt.d + '</p>' +
        '<div class="pgm-datos">' + mkt.datos.map(function (d) { return '<span><b>' + d[0] + '</b>' + d[1] + '</span>'; }).join('') + '</div>' +
        '<div class="pgm-precio"><small>Pago único</small><b>' + S.pesos(P.unico) + '</b><small>o desde ' + S.pesos(300000) + ' por módulo</small></div>' +
        '<div class="pgm-acc"><a class="btn btn-y btn-s" href="' + raiz + 'oferta-academica.html#marketing" data-mira>Ver el programa ' + flecha + '</a><a class="btn btn-o btn-s" href="' + raiz + 'oferta-academica.html#inversion" data-mira>Simular mi inversión</a></div>' +
      '</article>' +
      '<article class="pgm pgm-coach rv tilt" style="--d:.08s" data-mira>' +
        '<span class="tag tag-y pgm-nuevo">Nuevo</span>' +
        '<span class="pgm-de"><img src="' + raiz + S.ADH.logo + '" alt="" width="52" height="34">En alianza con ADH Coaching</span>' +
        '<h3>' + co.nombre + '</h3><p>' + co.d + '</p>' +
        '<div class="pgm-datos"><span><b>3</b>enfoques</span><span><b>10</b>unidades</span><span>Certificación CEL · aval FGU</span></div>' +
        '<div class="pgm-precio"><small>Valor del programa</small><b>' + S.pesos(co.valor) + '</b></div>' +
        '<div class="pgm-acc"><a class="btn btn-y btn-s" href="' + raiz + 'oferta-academica.html#coaching" data-mira>Ver el programa ' + flecha + '</a><a class="btn btn-o btn-s js-wa" data-msg="Hola, quiero información sobre el Técnico Laboral en Coaching Ontológico de Semply y ADH Coaching." target="_blank" rel="noopener" data-mira>Pedir información</a></div>' +
      '</article>';
  });

  /* precios del programa de marketing */
  $$('.js-precios').forEach(function (el) {
    var pre = S.preventa(), dias = S.diasPreventa(), pct = P.preventa.pct;
    function tarifa(v) { return pre ? '<b>' + S.pesos(v * (100 - pct) / 100) + '</b><s>' + S.pesos(v) + '</s>' : '<b>' + S.pesos(v) + '</b>'; }
    el.innerHTML =
      (pre ? '<div class="precios-pre rv">' + S.burst('−' + pct + '%<small>preventa</small>', '#FFC225', '#373435', 112) +
        '<div><h3>Los primeros ' + P.preventa.cupos + ' inscritos pagan la mitad.</h3><p>Preventa con ' + pct + ' % de descuento ' + P.preventa.texto + '. ' + (dias <= 1 ? 'Hoy es el último día.' : 'Quedan ' + dias + ' días.') + '</p></div>' +
        '<a class="btn btn-y" href="' + raiz + 'inscripcion.html?programa=marketing" data-mira>Separar mi cupo ' + flecha + '</a></div>' : '') +
      '<div class="precios">' +
        '<div class="precio top rv"><span class="tag tag-y">Ahorras más</span><small>Pago único</small>' + tarifa(P.unico) + '<p>El programa completo: 12 módulos, 1.200 horas.</p></div>' +
        '<div class="precio rv" style="--d:.05s"><small>Por semestre</small>' + tarifa(P.semestre) + '<p>Seis módulos. Pagas cada semestre al empezarlo.</p></div>' +
        '<div class="precio rv" style="--d:.1s"><small>Por módulo</small><b>' + S.pesos(pre ? 150000 : 300000) + '</b><p>Desde, cada uno. Módulos 1–3: ' + S.pesos(300000) + ' · 4–6: ' + S.pesos(400000) + ' · 7–12: ' + S.pesos(350000) + '.</p></div>' +
        '<div class="precio rv" style="--d:.15s"><small>Matrícula</small><b>' + S.pesos(P.matricula) + '</b><p>Un solo pago al matricularte.</p></div>' +
      '</div>' +
      '<p class="precios-adh rv"><img src="' + raiz + S.ADH.logo + '" alt="ADH Coaching" width="58" height="38"><span>¿Eres estudiante o exestudiante de <b>ADH Coaching</b>? Tienes <b>' + P.adh.pct + ' % de descuento</b>. Los descuentos no se suman: se aplica el mayor.</span></p>';
  });

  /* empresas aliadas */
  $$('.js-cinta-aliados').forEach(function (el) {
    el.innerHTML = S.ALIADOS.map(function (a) { var img = '<img src="' + raiz + a.img + '" alt="' + S.esc(a.n) + '" loading="lazy">'; return a.url ? '<a href="' + raiz + a.url + '" data-mira>' + img + '</a>' : '<span>' + img + '</span>'; }).join('');
  });
  $$('.js-aliados').forEach(function (el) {
    el.innerHTML = S.ALIADOS.map(function (a, i) {
      var tag = a.url ? 'a' : 'div';
      return '<' + tag + ' class="aliado rv"' + (a.url ? ' href="' + raiz + a.url + '" data-mira' : '') + ' style="--d:' + (i * 0.06) + 's"><div class="aliado-logo"><img src="' + raiz + a.img + '" alt="' + S.esc(a.n) + '" loading="lazy"></div><div><h3>' + S.esc(a.n) + '</h3><p>' + a.d + '</p>' + (a.url ? '<span class="aliado-ver">Ver el programa ' + flecha + '</span>' : '') + '</div></' + tag + '>';
    }).join('');
  });

  /* docentes */
  $$('.js-docentes').forEach(function (el) {
    var tabs = el.querySelector('.js-doc-tabs'), rej = el.querySelector('.docentes'), nota = el.querySelector('.doc-nota');
    var silueta = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="8.5" r="4"/><path d="M4 21c1.2-4.2 4.3-6.3 8-6.3s6.8 2.1 8 6.3"/></svg>';
    function pinta(k) {
      $$('button', tabs).forEach(function (b) { var on = b.dataset.k === k; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
      if (k === 'coaching') {
        rej.innerHTML = S.DOCENTES.coaching.map(function (d, i) {
          return '<article class="docente rv in" style="--d:' + (i * 0.04) + 's" data-mira><div class="docente-foto"><img src="' + raiz + 'assets/img/aliado/equipo-' + d[0] + '.jpg" alt="' + S.esc(d[1]) + '" loading="lazy"></div><div class="docente-c"><b>' + S.esc(d[1]) + '</b><span>' + S.esc(d[2]) + '</span><small>' + S.esc(d[3]) + '</small></div></article>';
        }).join('');
        nota.innerHTML = 'Equipo de entrenadores de <b>ADH Coaching</b> para el programa de Coaching Ontológico.';
      } else {
        var lista = S.DOCENTES.marketing.length ? S.DOCENTES.marketing : [0, 1, 2, 3];
        rej.innerHTML = lista.map(function (d, i) {
          if (typeof d === 'number') return '<article class="docente pronto-d rv in" style="--d:' + (i * 0.04) + 's"><div class="docente-foto">' + silueta + '</div><div class="docente-c"><b>Muy pronto</b><span>Docente de Marketing Digital e IA</span><small>Presentamos al equipo docente antes del inicio de clases.</small></div></article>';
          return '<article class="docente rv in" data-mira><div class="docente-foto"><img src="' + raiz + d[0] + '" alt="' + S.esc(d[1]) + '" loading="lazy"></div><div class="docente-c"><b>' + S.esc(d[1]) + '</b><span>' + S.esc(d[2]) + '</span><small>' + S.esc(d[3]) + '</small></div></article>';
        }).join('');
        nota.innerHTML = 'Cada módulo tiene un docente experto en su tema. Aquí verás su experiencia y sus redes.';
      }
    }
    tabs.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) pinta(b.dataset.k); });
    pinta(location.hash === '#docentes-marketing' ? 'marketing' : 'coaching');
  });

  /* días de preventa en cualquier texto */
  $$('.js-dias-pre').forEach(function (el) { var n = S.diasPreventa(); el.textContent = n <= 1 ? 'hoy es el último día' : 'quedan ' + n + ' días'; });
  $$('.js-solo-preventa').forEach(function (el) { if (!S.preventa()) el.remove(); });
})();
