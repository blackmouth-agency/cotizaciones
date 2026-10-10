/* Semply · catálogo con filtros, búsqueda y orden (sincronizado con la URL) */
(function () {
  var S = Semply, D = SEMPLY, $ = S.$, $$ = S.$$;
  var p = new URLSearchParams(location.search);
  var F = {
    q: p.get('q') || '',
    tipo: p.get('tipo') ? p.get('tipo').split(',') : [],
    cat: p.get('cat') ? p.get('cat').split(',') : [],
    nivel: [], pmax: 1300000, vivo: false, favs: false, orden: 'rel'
  };
  var TIPOS = [['programa', 'Programas de 100 h'], ['curso', 'Cursos cortos']];
  var NIVELES = ['Básico', 'Intermedio'];
  function cuenta(fn) { return D.cursos.filter(fn).length; }
  function checks(sel, items, grupo) {
    $(sel).innerHTML = items.map(function (it) {
      return '<label class="check"><input type="checkbox" data-g="' + grupo + '" value="' + it[0] + '"' + (F[grupo].indexOf(it[0]) >= 0 ? ' checked' : '') + '><span>' + it[1] + '</span><small>' + it[2] + '</small></label>';
    }).join('');
  }
  checks('.js-f-tipo', TIPOS.map(function (t) { return [t[0], t[1], cuenta(function (c) { return c.tipo === t[0]; })]; }), 'tipo');
  checks('.js-f-cat', D.categorias.map(function (k) { return [k.id, k.nombre, cuenta(function (c) { return c.cat === k.id; })]; }), 'cat');
  checks('.js-f-nivel', NIVELES.map(function (n) { return [n, n, cuenta(function (c) { return c.nivel === n; })]; }), 'nivel');

  var q = $('.js-q'); q.value = F.q;
  var pm = $('.js-pmax');
  function sync() {
    var u = new URLSearchParams();
    if (F.q) u.set('q', F.q); if (F.tipo.length) u.set('tipo', F.tipo.join(',')); if (F.cat.length) u.set('cat', F.cat.join(','));
    history.replaceState(null, '', 'cursos.html' + (u.toString() ? '?' + u : ''));
  }
  function pintar() {
    $('.js-pmax-t').textContent = S.fmt(F.pmax);
    var base = F.q ? S.buscar(F.q) : D.cursos.slice();
    var favs = S.favs();
    var r = base.filter(function (c) {
      return (!F.tipo.length || F.tipo.indexOf(c.tipo) >= 0) && (!F.cat.length || F.cat.indexOf(c.cat) >= 0) &&
        (!F.nivel.length || F.nivel.indexOf(c.nivel) >= 0) && c.precio <= F.pmax && (!F.vivo || c.envivo) && (!F.favs || favs.indexOf(c.slug) >= 0);
    });
    var ord = { rating: function (a, b) { return b.rating - a.rating; }, est: function (a, b) { return b.estudiantes - a.estudiantes; }, pmin: function (a, b) { return a.precio - b.precio; }, pmax: function (a, b) { return b.precio - a.precio; } }[F.orden];
    if (ord) r.sort(ord);
    $('.js-cuenta').innerHTML = '<b>' + r.length + '</b> ' + (r.length === 1 ? 'resultado' : 'resultados') + (F.q ? ' para «' + S.esc(F.q) + '»' : '');
    // chips de filtros activos
    var act = [];
    if (F.q) act.push(['q', '', 'Búsqueda: ' + F.q]);
    F.tipo.forEach(function (t) { act.push(['tipo', t, TIPOS.filter(function (x) { return x[0] === t; })[0][1]]); });
    F.cat.forEach(function (t) { act.push(['cat', t, S.catNombre(t)]); });
    F.nivel.forEach(function (t) { act.push(['nivel', t, t]); });
    if (F.vivo) act.push(['vivo', '', 'En vivo']); if (F.favs) act.push(['favs', '', 'Favoritos']);
    $('.js-activos').innerHTML = act.map(function (a) { return '<button data-q="' + a[0] + '" data-v="' + S.esc(a[1]) + '">' + S.esc(a[2]) + S.ico('x') + '</button>'; }).join('');
    $('.js-res').innerHTML = r.length ? r.map(S.cardCurso).join('') :
      '<div class="vacio" style="grid-column:1/-1">' + S.burst('¡Ups!', '#FFC225', '#373435', 110) + '<h3 class="t-s">No encontramos cursos con esos filtros.</h3><p class="muted">Prueba quitando alguno o busca otra palabra.</p><button class="btn btn-r js-limpiar">Ver todo el catálogo</button></div>';
    sync();
  }
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.dataset.g) { var g = F[t.dataset.g]; if (t.checked) g.push(t.value); else g.splice(g.indexOf(t.value), 1); }
    if (t.classList.contains('js-vivo')) F.vivo = t.checked;
    if (t.classList.contains('js-favs')) F.favs = t.checked;
    if (t.classList.contains('js-orden')) F.orden = t.value;
    pintar();
  });
  pm.addEventListener('input', function () { F.pmax = +pm.value; pintar(); });
  var tq; q.addEventListener('input', function () { clearTimeout(tq); tq = setTimeout(function () { F.q = q.value.trim(); pintar(); }, 180); });
  function limpiar() { F.q = ''; F.tipo = []; F.cat = []; F.nivel = []; F.pmax = 1300000; F.vivo = F.favs = false; q.value = ''; pm.value = 1300000; $$('.filtros input[type=checkbox]').forEach(function (c) { c.checked = false; }); pintar(); }
  document.addEventListener('click', function (e) {
    if (e.target.closest('.js-limpiar')) limpiar();
    var a = e.target.closest('.js-activos button');
    if (a) {
      var k = a.dataset.q, v = a.dataset.v;
      if (k === 'q') { F.q = ''; q.value = ''; } else if (k === 'vivo' || k === 'favs') { F[k] = false; $('.js-' + k).checked = false; }
      else { F[k].splice(F[k].indexOf(v), 1); var c = $('input[data-g="' + k + '"][value="' + v + '"]'); if (c) c.checked = false; }
      pintar();
    }
    if (e.target.closest('.js-abrir-f')) $('.js-filtros').classList.toggle('abiertos');
  });
  pintar();
})();
