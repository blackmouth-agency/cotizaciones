/* Semply · inicio */
(function () {
  var S = Semply, D = SEMPLY, $ = S.$, $$ = S.$$;

  /* buscador del hero */
  var busca = $('.hero-busca'); S.montarBuscador(busca);
  $$('.hero-sug button').forEach(function (b) { b.addEventListener('click', function () { var i = $('input', busca); i.value = b.dataset.q; i.focus(); i.dispatchEvent(new Event('input')); }); });

  /* hero: rotación de docentes y paralaje */
  var vis = $('.hero-vis'), fotos = $$('.hv-marco img', vis), k = 0;
  $('.js-burst-hero').outerHTML = S.burst('−24 %<small>lanzamiento</small>', '#F10E3B', '#fff', 118, 'burst-h');
  setInterval(function () {
    if (document.hidden) return;
    fotos[k].classList.remove('on'); k = (k + 1) % fotos.length; fotos[k].classList.add('on');
    $('.js-hv-n').textContent = fotos[k].dataset.n; $('.js-hv-r').textContent = fotos[k].dataset.r;
  }, 4200);
  if (matchMedia('(pointer: fine)').matches) {
    $('.hero').addEventListener('pointermove', function (e) {
      var r = vis.getBoundingClientRect();
      vis.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3));
      vis.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3));
    });
  }

  /* banda de herramientas */
  var tools = ['ChatGPT', 'Gemini', 'Claude', 'Canva', 'Make', 'ManyChat', 'Meta Ads', 'Google Ads', 'Search Console', 'Analytics 4', 'Looker Studio', 'CapCut', 'Notion', 'HubSpot'];
  $('.js-banda').innerHTML = tools.concat(tools).map(function (t) { return '<span>' + t + '</span>'; }).join('');

  /* programas */
  var progs = D.cursos.filter(function (c) { return c.tipo === 'programa'; });
  $('.js-progs').innerHTML = progs.map(function (c, i) {
    var d = D.docentes[c.docente], co = c.cohortes[0];
    return '<article class="cp rv" style="--d:' + (i * .08) + 's"><span class="esq"></span><div class="cp-img">' + S.img(S.cover(c, true), '') +
      '<div class="cp-horas">100<small>h</small></div></div><div class="cp-cuerpo">' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><span class="tag tag-r"><span class="punto-vivo" style="color:#fff"></span>Inicia el ' + S.fecha(co.inicio) + '</span><span class="tag">Quedan ' + co.cupos + ' cupos</span></div>' +
      '<h3><a href="curso.html?c=' + c.slug + '">' + c.titulo + '</a></h3><p class="muted">' + c.sub + '</p>' +
      '<div class="cp-datos"><div><b>' + c.semanas + ' semanas</b><small>10 h por semana</small></div><div><b>' + c.practica + ' %</b><small>de práctica</small></div><div><b>' + co.dia.split(' ')[0] + '</b><small>en vivo, ' + co.dia.split(' ').slice(1).join(' ') + '</small></div></div>' +
      '<div class="cc-doc">' + S.img(S.docImg(c.docente, true), '') + 'Con ' + d.nombre + ' · ' + S.estrellas(c.rating, c.resenas) + '</div>' +
      '<div class="cp-pie"><div><div class="precio">' + S.fmt(c.precio) + '<s>' + S.fmt(c.antes) + '</s></div><span class="cuota">o 4 cuotas de ' + S.fmt(c.precio / 4) + '</span></div><a class="btn btn-r" href="curso.html?c=' + c.slug + '">Ver programa ' + S.ico('flecha', 'ico-flecha') + '</a></div>' +
      '</div></article>';
  }).join('');
  $('.js-ruta-p').textContent = S.fmt(D.ruta.precio);
  $('.js-ruta').addEventListener('click', function () { S.agregar('ruta', { cohorte: 'nov26' }); });

  /* la hora Semply */
  var TIPOS = [
    ['Grabado', 'Lecciones cortas que ves a tu ritmo.', '#ffffff'],
    ['En vivo', 'Taller y clínica con el docente, en horario fijo.', 'var(--rojo)'],
    ['Práctica', 'Talleres y avances del proyecto. Cada uno deja evidencia.', 'var(--amarillo)'],
    ['Evaluación', 'Quices, revisión de entregables y sustentación.', 'transparent']
  ];
  var celdas = $('.js-celdas'), tiposEl = $('.js-tipos'), modo = 0, foco = -1;
  for (var i = 0; i < 100; i++) celdas.insertAdjacentHTML('beforeend', '<i style="--n:' + i + '"></i>');
  function pintarHora() {
    var h = D.horasTipo(progs[modo]), cs = $$('i', celdas), n = 0;
    h.forEach(function (v, t) { for (var j = 0; j < v; j++) { cs[n].className = 't' + t + (foco === t ? ' sel' : ''); n++; } });
    celdas.classList.toggle('foco', foco >= 0);
    tiposEl.innerHTML = TIPOS.map(function (t, j) {
      return '<button class="hora-tipo' + (foco === j ? ' on' : '') + '" data-t="' + j + '"><i style="background:' + t[2] + ';' + (j === 3 ? 'box-shadow:inset 0 0 0 2.5px var(--amarillo)' : '') + '"></i><span><b>' + t[0] + '</b><small>' + t[1] + '</small></span><em>' + h[j] + ' h</em></button>';
    }).join('');
    $('.js-hora-nota').textContent = foco >= 0 ? TIPOS[foco][0] + ': ' + h[foco] + ' de las 100 horas en ' + progs[modo].titulo + '.' : 'Toca un tipo de hora para verlo en el mapa.';
  }
  tiposEl.addEventListener('click', function (e) { var b = e.target.closest('[data-t]'); if (!b) return; foco = foco === +b.dataset.t ? -1 : +b.dataset.t; pintarHora(); });
  $$('.js-seg button').forEach(function (b) { b.addEventListener('click', function () { $$('.js-seg button').forEach(function (x) { x.classList.toggle('on', x === b); }); modo = +b.dataset.m; pintarHora(); }); });
  pintarHora();
  new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { celdas.classList.add('in'); o.disconnect(); } }, { threshold: .3 }).observe(celdas);

  /* cursos cortos con filtro */
  var cortos = D.cursos.filter(function (c) { return c.tipo === 'curso'; }), cat = 'todos';
  var catsUsadas = D.categorias.filter(function (k) { return cortos.some(function (c) { return c.cat === k.id; }); });
  $('.js-chips').innerHTML = '<button class="chip" aria-pressed="true" data-c="todos">Todos</button>' + catsUsadas.map(function (k) { return '<button class="chip" aria-pressed="false" data-c="' + k.id + '">' + k.nombre + '</button>'; }).join('');
  function pintarCursos() {
    var l = cortos.filter(function (c) { return cat === 'todos' || c.cat === cat; }).slice(0, 8);
    var g = $('.js-cursos'); g.style.opacity = 0;
    setTimeout(function () { g.innerHTML = l.map(S.cardCurso).join(''); g.style.transition = 'opacity .35s'; g.style.opacity = 1; }, 120);
  }
  $('.js-chips').addEventListener('click', function (e) { var b = e.target.closest('[data-c]'); if (!b) return; cat = b.dataset.c; $$('.js-chips .chip').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); pintarCursos(); });
  pintarCursos();

  /* docentes */
  var ids = Object.keys(D.docentes);
  $('.js-docs').innerHTML = ids.map(function (id, i) {
    var d = D.docentes[id];
    return '<article class="doc rv" tabindex="0" style="--d:' + (i % 4 * .05) + 's">' + S.img(S.docImg(id), d.nombre) + '<span class="tag tag-b doc-anos">' + d.anos + ' años</span><div class="doc-info"><b>' + d.nombre + '</b><small>' + d.rol + '</small><div class="doc-frase"><p>' + d.frase + '</p></div></div></article>';
  }).join('') + '<article class="doc doc-ensena rv"><div><span class="ceja">Enseña en Semply</span><h3 style="margin-top:12px">¿Haces marketing todos los días?</h3></div><a class="btn btn-y js-pronto" href="#">Postúlate</a></article>';

  /* testimonios */
  var pista = $('.js-testi');
  pista.innerHTML = D.testimonios.map(function (t) {
    var c = D.curso(t.curso);
    return '<article class="testi"><span class="tag tag-y">' + S.ico('trofeo') + t.logro + '</span><blockquote>' + t.texto + '</blockquote><div class="testi-quien"><span class="avatar">' + S.iniciales(t.nombre) + '</span><div><b>' + t.nombre + '</b><small>' + t.rol + '</small><br><a class="lnk" style="font-size:13.5px" href="curso.html?c=' + c.slug + '">' + c.titulo + '</a></div></div></article>';
  }).join('');
  $('.js-ant').addEventListener('click', function () { pista.scrollBy({ left: -400, behavior: 'smooth' }); });
  $('.js-sig').addEventListener('click', function () { pista.scrollBy({ left: 400, behavior: 'smooth' }); });
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { S.contar(e.target, +e.target.dataset.n, 1600, +e.target.dataset.dec || 0); io.unobserve(e.target); } }); }, { threshold: .6 });
  $$('.js-cuenta').forEach(function (e) { io.observe(e); });

  /* planes */
  var periodo = 'anual';
  $('.js-burst-pro').outerHTML = S.burst('−18 %<small>anual</small>', '#FFC225', '#373435', 96);
  $$('.js-periodo button').forEach(function (b) {
    b.addEventListener('click', function () {
      periodo = b.dataset.p; $$('.js-periodo button').forEach(function (x) { x.classList.toggle('on', x === b); });
      var p = D.planes.pro;
      $('.js-pro-precio').innerHTML = periodo === 'anual' ? S.fmt(p.anual) + '<small> /año</small>' : S.fmt(p.mensual) + '<small> /mes</small>';
      $('.js-pro-nota').textContent = periodo === 'anual' ? 'Equivale a ' + S.fmt(p.anual / 12) + ' al mes' : 'Cancelas cuando quieras';
    });
  });
  $('.js-pro').addEventListener('click', function () { S.agregar('pro', { periodo: periodo }); });

  /* empresas */
  $('.js-burst-emp').outerHTML = S.burst('B2B<small>a la medida</small>', '#FFC225', '#373435', 110);

  /* preguntas */
  $('.js-faq').innerHTML = D.faq.map(function (f, i) {
    return '<div class="acc-it' + (i === 0 ? ' abierto' : '') + '"><button class="acc-bt" aria-expanded="' + (i === 0) + '">' + f[0] + '<span class="mas">' + S.ico('mas') + '</span></button><div class="acc-cont"><div><p>' + f[1] + '</p></div></div></div>';
  }).join('');
  S.acordeon($('.js-faq'));

  /* video de muestra */
  $('.js-video').addEventListener('click', function () { S.verClase(); });

  /* cierre: sellos */
  var cierre = $('.js-cierre'), cols = ['#FFC225', '#ffffff', '#373435'], ns = 0;
  cierre.addEventListener('click', function (e) {
    if (e.target.closest('a, button') || matchMedia('(pointer: coarse)').matches) return;
    var r = cierre.getBoundingClientRect(), s = document.createElement('span');
    var forma = ns % 3;
    s.className = 'sello';
    s.style.left = (e.clientX - r.left) + 'px'; s.style.top = (e.clientY - r.top) + 'px';
    s.style.setProperty('--rot', (Math.random() * 60 - 30) + 'deg');
    s.style.setProperty('--c', cols[ns % 3]);
    s.innerHTML = forma === 1 ? S.burst(['¡Sí!', 'Así', 'Fácil'][Math.floor(Math.random() * 3)], '#FFC225', '#373435', 90).replace('class="burst ', 'class="burst burst-in ') : '<div class="sello-l"></div>';
    cierre.appendChild(s); ns++;
    if (cierre.querySelectorAll('.sello').length > 24) cierre.querySelector('.sello').remove();
  });
})();
