/* Semply · simulador de costos académicos del Técnico Laboral en Marketing Digital e IA (25-nov-2026).
   Reemplaza el enfoque de créditos y financiación: pago único, por semestre o por módulos, con descuento de preventa o de ADH Coaching.
   Precios y reglas en S.PRECIOS (comun.js). */
(function () {
  var S = window.SMP; if (!S) return;
  var caja = S.$('.js-sim'); if (!caja) return;
  var P = S.PRECIOS, MOD = S.MODULOS;
  var st = { modo: 'unico', sem: { 1: true, 2: false }, mods: {}, adh: false, pre: S.preventa() };
  [1, 2, 3].forEach(function (n) { st.mods[n] = true; });

  var MODOS = [['unico', 'Programa completo', 'Pago único'], ['semestre', 'Por semestre', '6 módulos'], ['modulos', 'Por módulos', 'Elige los tuyos']];
  function pieza(m) {
    return '<button class="sim-mod" data-n="' + m.num + '" data-s="' + m.s + '" aria-pressed="false"><span class="sim-mod-n">' + String(m.num).padStart(2, '0') + '</span><span class="sim-mod-t">' + S.esc(m.n) + '</span><span class="sim-mod-p">' + S.pesos(P.modulo(m.num)) + '</span><i aria-hidden="true"></i></button>';
  }
  caja.innerHTML =
    '<div class="sim-izq">' +
      '<p class="sim-paso"><b>1</b>¿Cómo quieres pagar?</p>' +
      '<div class="sim-modos" role="radiogroup" aria-label="Forma de pago">' + MODOS.map(function (m) { return '<button role="radio" data-m="' + m[0] + '" data-mira><b>' + m[1] + '</b><small>' + m[2] + '</small></button>'; }).join('') + '</div>' +
      '<div class="sim-sems" hidden><span>Semestres:</span><button data-s="1" aria-pressed="true">Semestre 1 <small>módulos 1–6</small></button><button data-s="2" aria-pressed="false">Semestre 2 <small>módulos 7–12</small></button></div>' +
      '<p class="sim-paso"><b>2</b><span class="js-sim-paso2">Tus doce piezas</span></p>' +
      '<div class="sim-tablero">' +
        '<div class="sim-col"><small>Semestre 1</small>' + MOD.filter(function (m) { return m.s === 1; }).map(pieza).join('') + '</div>' +
        '<div class="sim-col"><small>Semestre 2</small>' + MOD.filter(function (m) { return m.s === 2; }).map(pieza).join('') + '</div>' +
      '</div>' +
      '<div class="sim-rapidos" hidden><button data-r="1">Semestre 1</button><button data-r="2">Semestre 2</button><button data-r="todos">Los 12</button><button data-r="nada">Limpiar</button></div>' +
      '<p class="sim-paso"><b>3</b>Tus descuentos</p>' +
      '<label class="sim-sw sim-sw-adh"><input type="checkbox" class="js-sim-adh"><span class="sw" aria-hidden="true"></span><span><b>Soy estudiante o exestudiante de ADH Coaching</b><small>' + P.adh.pct + ' % de descuento</small></span><img src="' + S.ADH.logo + '" alt="ADH Coaching" width="62" height="40" loading="lazy"></label>' +
      '<label class="sim-sw sim-sw-pre"' + (S.preventa() ? '' : ' hidden') + '><input type="checkbox" class="js-sim-pre" checked><span class="sw" aria-hidden="true"></span><span><b>Preventa: me inscribo entre los primeros ' + P.preventa.cupos + '</b><small>' + P.preventa.pct + ' % de descuento ' + P.preventa.texto + '</small></span><em class="js-sim-dias"></em></label>' +
      '<div class="sim-barra"><span>Total estimado<b class="js-r-total2"></b></span><a class="btn btn-y btn-s" href="#sim-recibo">Ver detalle</a></div>' +
    '</div>' +
    '<div class="sim-der" id="sim-recibo"><div class="recibo" aria-live="polite">' +
      '<div class="recibo-cab"><span>Tu simulación</span><b class="js-r-que"></b></div>' +
      '<dl>' +
        '<div><dt>Valor del programa</dt><dd class="js-r-orig"></dd></div>' +
        '<div class="recibo-desc"><dt class="js-r-dlab">Descuento</dt><dd class="js-r-desc"></dd></div>' +
        '<div><dt>Matrícula</dt><dd class="js-r-mat"></dd></div>' +
      '</dl>' +
      '<div class="recibo-total"><span>Total estimado</span><b class="js-r-total"></b></div>' +
      '<p class="recibo-ahorro js-r-ahorro"></p>' +
      '<p class="recibo-tip js-r-tip"></p>' +
      '<div class="recibo-cta"><a class="btn btn-y js-r-insc" href="inscripcion.html" data-mira>Separar mi cupo ' + S.ico(S.I.flecha, 'ico-f') + '</a><a class="btn btn-o btn-claro js-r-wa" target="_blank" rel="noopener" data-mira>' + S.ico(S.I.chat) + 'Enviar por WhatsApp</a></div>' +
      '<p class="recibo-nota">Valores en pesos colombianos. Es una simulación de referencia: admisiones te confirma el valor final al matricularte. Los descuentos no se suman: se aplica el mayor.</p>' +
    '</div></div>';

  var $ = function (s) { return S.$(s, caja); }, $$ = function (s) { return S.$$(s, caja); };
  function contar(el, v, pre) {
    pre = pre || '';
    var tok = el._tok = (el._tok || 0) + 1, desde = el._v == null ? v : el._v; el._v = v;
    var fin = function () { if (el._tok === tok) el.textContent = pre + S.pesos(v); };
    if (S.reducir || desde === v) { fin(); return; }
    var t0 = performance.now(), dur = 520;
    (function paso(t) { if (el._tok !== tok) return; var x = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - x, 3); el.textContent = pre + S.pesos(desde + (v - desde) * e); if (x < 1) requestAnimationFrame(paso); })(t0);
    setTimeout(fin, dur + 60); // por si la pestaña está en segundo plano y no corre requestAnimationFrame
  }
  function seleccion() {
    if (st.modo === 'unico') return MOD.map(function (m) { return m.num; });
    if (st.modo === 'semestre') return MOD.filter(function (m) { return st.sem[m.s]; }).map(function (m) { return m.num; });
    return MOD.filter(function (m) { return st.mods[m.num]; }).map(function (m) { return m.num; });
  }
  function calcular() {
    var sel = seleccion(), porModulos = sel.reduce(function (a, n) { return a + P.modulo(n); }, 0), base, que;
    var nSem = (st.sem[1] ? 1 : 0) + (st.sem[2] ? 1 : 0);
    if (st.modo === 'unico') { base = P.unico; que = 'Programa completo · pago único'; }
    else if (st.modo === 'semestre') { base = P.semestre * nSem; que = nSem === 2 ? 'Los dos semestres' : nSem ? 'Semestre ' + (st.sem[1] ? 1 : 2) : 'Elige un semestre'; }
    else { base = porModulos; que = sel.length ? sel.length + (sel.length === 1 ? ' módulo' : ' módulos') : 'Elige tus módulos'; }
    var pre = st.pre && S.preventa() ? P.preventa.pct : 0, adh = st.adh ? P.adh.pct : 0, pct = Math.max(pre, adh);
    var desc = Math.round(base * pct / 100), mat = base > 0 ? P.matricula : 0;
    return { sel: sel, base: base, porModulos: porModulos, que: que, pct: pct, tipo: pct === 0 ? '' : pre >= adh ? 'Preventa' : 'ADH Coaching', desc: desc, mat: mat, total: base - desc + mat, nSem: nSem };
  }
  function pintar() {
    $$('.sim-modos button').forEach(function (b) { var on = b.dataset.m === st.modo; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
    $('.sim-sems').hidden = st.modo !== 'semestre';
    $('.sim-rapidos').hidden = st.modo !== 'modulos';
    $$('.sim-sems button').forEach(function (b) { b.setAttribute('aria-pressed', !!st.sem[b.dataset.s]); });
    caja.dataset.modo = st.modo;
    $('.js-sim-paso2').textContent = st.modo === 'unico' ? 'Las doce piezas, en un solo pago' : st.modo === 'semestre' ? 'Elige el semestre que vas a pagar' : 'Toca los módulos que quieres';
    var r = calcular(), sel = {};
    r.sel.forEach(function (n) { sel[n] = 1; });
    $$('.sim-mod').forEach(function (b) { var on = !!sel[b.dataset.n]; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    $('.js-r-que').textContent = r.que;
    contar($('.js-r-orig'), r.base);
    var d = $('.js-r-desc'); d.parentNode.classList.toggle('cero', !r.desc);
    $('.js-r-dlab').textContent = r.pct ? 'Descuento ' + r.tipo + ' · ' + r.pct + ' %' : 'Descuento';
    if (r.desc) contar(d, r.desc, '−'); else { d._tok = (d._tok || 0) + 1; d._v = 0; d.textContent = '$0'; }
    contar($('.js-r-mat'), r.mat);
    contar($('.js-r-total'), r.total);
    $('.js-r-total2').textContent = S.pesos(r.total);
    // ahorro frente a pagar los mismos módulos uno por uno
    var ref = r.porModulos, ahorro = ref + r.mat - r.total;
    $('.js-r-ahorro').innerHTML = r.base && ahorro > 0 ? 'Ahorras <b>' + S.pesos(ahorro) + '</b> frente a pagar ' + (r.sel.length === 12 ? 'los 12 módulos' : 'estos módulos') + ' uno por uno.' : '';
    var tip = '';
    if (st.modo === 'semestre' && r.nSem === 2) tip = 'Pagando el programa completo en un solo pago te sale ' + S.pesos(P.semestre * 2 - P.unico) + ' más barato.';
    else if (st.modo === 'modulos' && r.base >= P.semestre && r.sel.length < 12) tip = 'Con ' + r.sel.length + ' módulos ya pagas más que un semestre completo (' + S.pesos(P.semestre) + ', seis módulos).';
    else if (st.modo === 'modulos' && r.sel.length === 12) tip = 'Los 12 módulos sueltos cuestan ' + S.pesos(r.porModulos) + '. En pago único, ' + S.pesos(P.unico) + '.';
    $('.js-r-tip').textContent = tip; $('.js-r-tip').hidden = !tip;
    var resumen = 'Técnico Laboral en Marketing Digital e IA · ' + r.que + (r.pct ? ' · descuento ' + r.tipo + ' ' + r.pct + ' %' : '') + ' · total estimado ' + S.pesos(r.total) + ' (matrícula incluida)';
    $('.js-r-wa').href = S.waLink('Hola, hice la simulación en la web de Semply y quiero matricularme.\n' + resumen + (r.sel.length && r.sel.length < 12 ? '\nMódulos: ' + r.sel.join(', ') : ''));
    $('.js-r-insc').href = 'inscripcion.html?programa=marketing' + (st.adh ? '&adh=1' : '') + '&sim=' + encodeURIComponent(resumen);
    var dias = $('.js-sim-dias'); if (dias) { var n = S.diasPreventa(); dias.textContent = n <= 1 ? 'Último día' : 'Quedan ' + n + ' días'; }
  }
  caja.addEventListener('click', function (e) {
    var b;
    if ((b = e.target.closest('.sim-modos button'))) { st.modo = b.dataset.m; pintar(); return; }
    if ((b = e.target.closest('.sim-sems button'))) { st.sem[b.dataset.s] = !st.sem[b.dataset.s]; if (!st.sem[1] && !st.sem[2]) st.sem[b.dataset.s === '1' ? 2 : 1] = true; pintar(); return; }
    if ((b = e.target.closest('.sim-mod'))) {
      var n = +b.dataset.n;
      if (st.modo !== 'modulos') { st.mods = {}; seleccion().forEach(function (k) { st.mods[k] = true; }); st.modo = 'modulos'; }
      st.mods[n] = !st.mods[n]; b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); pintar(); return;
    }
    if ((b = e.target.closest('.sim-rapidos button'))) {
      var r = b.dataset.r; st.mods = {};
      MOD.forEach(function (m) { if (r === 'todos' || String(m.s) === r) st.mods[m.num] = true; });
      pintar();
    }
  });
  $('.js-sim-adh').addEventListener('change', function (e) { st.adh = e.target.checked; pintar(); });
  var pre = $('.js-sim-pre'); if (pre) pre.addEventListener('change', function (e) { st.pre = e.target.checked; pintar(); });
  if (/[?&]adh=1/.test(location.search)) { st.adh = true; $('.js-sim-adh').checked = true; }
  pintar();
})();
