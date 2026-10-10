/* Semply · reproductor de clase y actividades (video, sesión en vivo, taller, quiz) */
(function () {
  var S = Semply, D = SEMPLY, $ = S.$, $$ = S.$$;
  if (!S.sesion()) return;
  var c = D.curso(S.param('c')) || D.curso('ia-marketing');
  var L = SEMPLY_LECCION, d = D.docentes[c.docente];
  var todas = S.lecciones(c);
  var lec = null, v = null, ocultar = null, completada = false, ultimoGuardado = 0, conSubs = true;
  document.title = c.titulo + ' · Semply';

  function inscrito() { return !!S.inscritos()[c.slug]; }
  function hechas() { return (S.inscritos()[c.slug] || { hechas: {} }).hechas; }
  function esPreview(l) { return l.id === todas[0].id || (c.slug === 'ia-marketing' && l.id === 'u2-1'); }
  function mmss(t) { t = Math.max(0, Math.floor(t || 0)); return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); }
  function idx(l) { for (var i = 0; i < todas.length; i++) if (todas[i].id === l.id) return i; return 0; }
  function vecina(n) { return todas[idx(lec) + n]; }
  var TIPO = { video: 'Video', vivo: 'En vivo', taller: 'Taller', quiz: 'Quiz' };

  /* ---------- encabezado y lateral ---------- */
  function cabecera() {
    var p = S.progreso(c.slug), R = 14, C = 2 * Math.PI * R;
    $('.js-t-curso').textContent = c.titulo; $('.js-t-lec').textContent = lec.t;
    $('.js-prog').innerHTML = '<svg class="mini-anillo" viewBox="0 0 34 34"><circle cx="17" cy="17" r="' + R + '" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="4"/><circle cx="17" cy="17" r="' + R + '" fill="none" stroke="#FFC225" stroke-width="4" stroke-linecap="round" stroke-dasharray="' + C + '" stroke-dashoffset="' + C * (1 - p / 100) + '"/></svg><span>' + p + ' % completado</span>';
  }
  function lateral() {
    var h = hechas(), n = Object.keys(h).length, p = S.progreso(c.slug);
    $('.js-lat').innerHTML = '<div class="cl-lat-cab"><b>' + c.titulo + '</b><small>' + n + ' de ' + todas.length + ' actividades · ' + p + ' %</small><div class="barra-p"><i style="width:' + p + '%"></i></div></div><div class="cl-temario">' +
      c.unidades.map(function (u) {
        var abierta = u.lecciones.some(function (l) { return l.id === lec.id; });
        var hu = u.lecciones.filter(function (l) { return h[l.id]; }).length;
        return '<div class="cl-u' + (abierta ? ' abierta' : '') + '"><button aria-expanded="' + abierta + '"><b>' + u.c + ' · ' + S.esc(u.n) + '</b><small>' + hu + ' / ' + u.lecciones.length + '</small>' + S.ico('abajo') + '</button><div class="ls">' +
          u.lecciones.map(function (l) {
            var bloq = !inscrito() && !esPreview(l);
            return '<button class="cl-l' + (l.id === lec.id ? ' act' : '') + (h[l.id] ? ' hecha' : '') + '" data-l="' + l.id + '"><span class="ck">' + (bloq ? S.ico('candado').replace('class="ico ', 'class="ico " style="opacity:.6;width:12px;height:12px" ') : S.ico('check')) + '</span><span>' + S.esc(l.t) + '<span class="tipo">' + TIPO[l.tipo] + (esPreview(l) && !inscrito() ? ' · vista previa' : '') + '</span></span><small>' + S.dur(l.min) + '</small></button>';
          }).join('') + '</div></div>';
      }).join('') + '</div>';
    var act = $('.cl-l.act'); if (act) act.scrollIntoView({ block: 'nearest' });
  }
  $('.js-lat').addEventListener('click', function (e) {
    var b = e.target.closest('.cl-l'); if (b) { abrir(b.dataset.l); return; }
    var u = e.target.closest('.cl-u > button'); if (u) { var w = u.parentNode; w.classList.toggle('abierta'); u.setAttribute('aria-expanded', w.classList.contains('abierta')); }
  });

  /* ---------- reproductor ---------- */
  function playerHTML(etiqueta) {
    var caps = L.capitulos.slice(1).map(function (k) { return '<span class="cap" style="left:' + (k[0] / 95.8 * 100) + '%"></span>'; }).join('');
    return '<div class="player js-player" tabindex="-1">' +
      '<video class="js-v" preload="metadata" playsinline poster="assets/media/leccion-poster.webp"><source src="assets/media/leccion-anatomia-prompt.mp4" type="video/mp4"></video>' +
      '<div class="subs js-subs"></div>' + (etiqueta ? '<span class="tag tag-y muestra">' + etiqueta + '</span>' : '') +
      '<button class="p-grande js-pg" aria-label="Reproducir">' + S.ico('play') + '</button><div class="aviso-p js-aviso"></div><div class="siguiente-ov js-sig-ov"></div>' +
      '<div class="ctrl"><div class="linea-t js-linea" role="slider" tabindex="0" aria-label="Línea de tiempo" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="riel"><div class="buf"></div><div class="hecho"></div>' + caps + '<div class="bola"></div></div><span class="tip-t"></span></div>' +
      '<div class="ctrl-fila"><button class="cb js-play" aria-label="Reproducir (espacio)">' + S.ico('play') + '</button><button class="cb js-m10" aria-label="Atrás 10 segundos">' + S.ico('atras10') + '</button><button class="cb js-p10" aria-label="Adelante 10 segundos">' + S.ico('adelante10') + '</button>' +
      '<div class="vol"><button class="cb js-mute" aria-label="Silenciar (m)">' + S.ico('volumen') + '</button><input type="range" class="js-vol" min="0" max="1" step="0.05" value="1" aria-label="Volumen"></div><span class="tiempo js-tiempo">0:00 / 0:00</span><span class="capitulo-act js-cap"></span>' +
      '<button class="cb js-cc on" aria-label="Subtítulos (c)" aria-pressed="true">' + S.ico('cc') + '</button><button class="cb js-aj" aria-label="Velocidad y calidad">' + S.ico('ajustes') + '</button><button class="cb js-pip" aria-label="Imagen en imagen">' + S.ico('pip') + '</button><button class="cb js-fs" aria-label="Pantalla completa (f)">' + S.ico('expandir') + '</button></div></div>' +
      '<div class="menu-vel js-menu"><small>Velocidad</small>' + [0.75, 1, 1.25, 1.5, 2].map(function (x) { return '<button data-vel="' + x + '" class="' + (x === 1 ? 'on' : '') + '">' + String(x).replace('.', ',') + '×' + (x === 1 ? ' <span>normal</span>' : '') + '</button>'; }).join('') + '<small>Calidad</small>' + ['Automática', '1080p', '720p', '480p'].map(function (x, i) { return '<button data-cal="' + x + '" class="' + (i === 0 ? 'on' : '') + '">' + x + '</button>'; }).join('') + '</div></div>';
  }
  function montarPlayer() {
    var pl = $('.js-player'); v = $('.js-v', pl);
    var linea = $('.js-linea', pl), hecho = $('.hecho', linea), bola = $('.bola', linea), buf = $('.buf', linea), tip = $('.tip-t', linea);
    var subs = $('.js-subs', pl), cap = $('.js-cap', pl), tiempo = $('.js-tiempo', pl), playB = $('.js-play', pl);
    completada = !!hechas()[lec.id];
    function dur() { return v.duration || 95.8; }
    function aviso(t) { var a = $('.js-aviso', pl); a.textContent = t; a.classList.add('si'); clearTimeout(a._t); a._t = setTimeout(function () { a.classList.remove('si'); }, 1400); }
    function toggle() { if (v.paused) v.play(); else v.pause(); }
    function mostrar() { pl.classList.remove('oculto'); clearTimeout(ocultar); if (!v.paused) ocultar = setTimeout(function () { pl.classList.add('oculto'); $('.js-menu', pl).classList.remove('si'); }, 2600); }
    pl._toggle = toggle; pl._aviso = aviso; pl._mostrar = mostrar;
    v.addEventListener('play', function () { pl.classList.add('sonando'); playB.innerHTML = S.ico('pausa'); playB.setAttribute('aria-label', 'Pausar (espacio)'); mostrar(); });
    v.addEventListener('pause', function () { pl.classList.remove('sonando'); playB.innerHTML = S.ico('play'); playB.setAttribute('aria-label', 'Reproducir (espacio)'); mostrar(); guardarT(true); });
    v.addEventListener('loadedmetadata', function () {
      var t0 = ((S.inscritos()[c.slug] || {}).tiempos || {})[lec.id];
      if (t0 > 5 && t0 < dur() - 5) { v.currentTime = t0; aviso('Retomamos donde ibas · ' + mmss(t0)); }
      tiempo.textContent = mmss(v.currentTime) + ' / ' + mmss(dur());
    });
    v.addEventListener('progress', function () { if (v.buffered.length) buf.style.width = (v.buffered.end(v.buffered.length - 1) / dur() * 100) + '%'; });
    v.addEventListener('timeupdate', function () {
      var t = v.currentTime, p = t / dur() * 100;
      hecho.style.width = p + '%'; bola.style.left = p + '%'; linea.setAttribute('aria-valuenow', Math.round(p));
      tiempo.textContent = mmss(t) + ' / ' + mmss(dur());
      var k = L.capitulos.filter(function (x) { return x[0] <= t; }).pop(); cap.textContent = k ? '· ' + k[1] : '';
      var q = L.cues.filter(function (x) { return t >= x[0] && t <= x[1] + .2; })[0];
      subs.innerHTML = conSubs && q ? '<span>' + S.esc(q[2]) + '</span>' : '';
      sincronizarTrans(t);
      guardarT();
      if (!completada && p >= 90 && inscrito()) { completada = true; S.marcar(c.slug, lec.id); S.toast('Lección completada. ¡Vas muy bien!', 'check'); cabecera(); lateral(); botonHecha(); }
    });
    v.addEventListener('ended', function () { pl.classList.remove('oculto'); siguienteOverlay(); });
    // línea de tiempo
    function posA(e) { var r = linea.getBoundingClientRect(); return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)); }
    var arrastrando = false;
    linea.addEventListener('pointerdown', function (e) { arrastrando = true; linea.setPointerCapture(e.pointerId); v.currentTime = posA(e) * dur(); });
    linea.addEventListener('pointermove', function (e) {
      var p = posA(e), t = p * dur(), k = L.capitulos.filter(function (x) { return x[0] <= t; }).pop();
      tip.style.left = (p * 100) + '%'; tip.textContent = mmss(t) + (k ? ' · ' + k[1] : '');
      if (arrastrando) v.currentTime = t;
    });
    linea.addEventListener('pointerup', function () { arrastrando = false; });
    linea.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { v.currentTime += 5; e.preventDefault(); } if (e.key === 'ArrowLeft') { v.currentTime -= 5; e.preventDefault(); } });
    // botones
    pl.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) { if (e.target === v || e.target.closest('.subs')) toggle(); return; }
      if (b.matches('.js-pg, .js-play')) toggle();
      if (b.matches('.js-m10')) { v.currentTime -= 10; aviso('−10 s'); }
      if (b.matches('.js-p10')) { v.currentTime += 10; aviso('+10 s'); }
      if (b.matches('.js-mute')) { v.muted = !v.muted; b.innerHTML = S.ico(v.muted ? 'mute' : 'volumen'); }
      if (b.matches('.js-cc')) { conSubs = !conSubs; b.classList.toggle('on', conSubs); b.setAttribute('aria-pressed', conSubs); aviso(conSubs ? 'Subtítulos activados' : 'Subtítulos desactivados'); if (!conSubs) subs.innerHTML = ''; }
      if (b.matches('.js-aj')) $('.js-menu', pl).classList.toggle('si');
      if (b.dataset.vel) { v.playbackRate = +b.dataset.vel; $$('[data-vel]', pl).forEach(function (x) { x.classList.toggle('on', x === b); }); aviso('Velocidad ' + String(b.dataset.vel).replace('.', ',') + '×'); }
      if (b.dataset.cal) { $$('[data-cal]', pl).forEach(function (x) { x.classList.toggle('on', x === b); }); aviso('Calidad: ' + b.dataset.cal); $('.js-menu', pl).classList.remove('si'); }
      if (b.matches('.js-pip')) { if (document.pictureInPictureElement) document.exitPictureInPicture(); else if (v.requestPictureInPicture) v.requestPictureInPicture().catch(function () { S.toast('Tu navegador no permite imagen en imagen aquí.', 'info'); }); }
      if (b.matches('.js-fs')) { if (document.fullscreenElement) document.exitFullscreen(); else if (pl.requestFullscreen) pl.requestFullscreen(); }
    });
    $('.js-vol', pl).addEventListener('input', function () { v.volume = +this.value; v.muted = v.volume === 0; $('.js-mute', pl).innerHTML = S.ico(v.muted ? 'mute' : 'volumen'); });
    pl.addEventListener('pointermove', mostrar);
    pl.addEventListener('dblclick', function (e) { if (e.target === v) $('.js-fs', pl).click(); });
  }
  function guardarT(ya) { if (!v || !inscrito()) return; var n = Date.now(); if (ya || n - ultimoGuardado > 4000) { ultimoGuardado = n; S.ultima(c.slug, lec.id, v.currentTime); } }
  function siguienteOverlay() {
    var sig = vecina(1), ov = $('.js-sig-ov'); if (!sig || !ov) return;
    var n = 6, C = 2 * Math.PI * 32;
    ov.innerHTML = '<small style="color:rgba(255,255,255,.6);font-family:var(--f-tit)">A continuación · ' + TIPO[sig.tipo] + '</small><h3>' + S.esc(sig.t) + '</h3><div class="cuenta-sig"><svg viewBox="0 0 72 72"><circle cx="36" cy="36" r="32" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="5"/><circle class="js-cs" cx="36" cy="36" r="32" fill="none" stroke="#F10E3B" stroke-width="5" stroke-linecap="round" stroke-dasharray="' + C + '" stroke-dashoffset="0" style="transition:stroke-dashoffset 1s linear"/></svg><b class="js-cn">' + n + '</b></div><div style="display:flex;gap:10px;justify-content:center"><button class="btn btn-r js-ya">Ver ahora</button><button class="btn btn-ob js-cancelar">Cancelar</button></div>';
    ov.classList.add('si');
    var t = setInterval(function () { n--; var cn = $('.js-cn', ov); if (!cn) return clearInterval(t); cn.textContent = n; $('.js-cs', ov).style.strokeDashoffset = C * (1 - n / 6); if (n <= 0) { clearInterval(t); abrir(sig.id); } }, 1000);
    $('.js-ya', ov).addEventListener('click', function () { clearInterval(t); abrir(sig.id); });
    $('.js-cancelar', ov).addEventListener('click', function () { clearInterval(t); ov.classList.remove('si'); });
  }
  document.addEventListener('keydown', function (e) {
    var pl = $('.js-player'); if (!pl || !v || e.target.closest('input, textarea, select') || e.ctrlKey || e.metaKey || e.altKey) return;
    var k = e.key.toLowerCase();
    if (k === ' ' || k === 'k') { e.preventDefault(); pl._toggle(); }
    else if (k === 'arrowleft' || k === 'j') { e.preventDefault(); v.currentTime -= k === 'j' ? 10 : 5; pl._aviso(k === 'j' ? '−10 s' : '−5 s'); }
    else if (k === 'arrowright' || k === 'l') { e.preventDefault(); v.currentTime += k === 'l' ? 10 : 5; pl._aviso(k === 'l' ? '+10 s' : '+5 s'); }
    else if (k === 'm') $('.js-mute', pl).click();
    else if (k === 'c') $('.js-cc', pl).click();
    else if (k === 'f') $('.js-fs', pl).click();
    else return;
    pl._mostrar();
  });

  /* ---------- actividades ---------- */
  var QUIZ = [
    ['¿Qué pieza del prompt le dice a la IA desde dónde mirar el problema?', ['El rol', 'El formato', 'Las restricciones', 'La tarea'], 0, 'El rol fija el punto de vista. No es «eres un experto», es «eres la estratega de contenido de una panadería de barrio en Cali».'],
    ['Según la clase, ¿dónde fallan casi todos los prompts?', ['En la redacción', 'En el contexto', 'En la longitud', 'En el modelo que eliges'], 1, 'Sin materia prima (qué vendes, a quién, qué funcionó), la IA rellena con lugares comunes.'],
    ['«Escribe cinco ganchos para un reel de 30 segundos» es un ejemplo de…', ['Rol', 'Contexto', 'Tarea', 'Formato'], 2, 'Una buena tarea tiene un verbo y un resultado concreto.'],
    ['¿Cuál de estas es una restricción bien escrita?', ['«Hazlo bien bonito»', '«Usa tu creatividad»', '«Máximo 12 palabras por gancho y sin emojis»', '«Eres experta en marketing»'], 2, 'Una restricción dice lo que no puede pasar, en términos que se pueden comprobar.'],
    ['Si la IA te devuelve lugares comunes, lo primero que revisas es…', ['Cambiar de herramienta', 'Si le diste datos, ejemplos y lo que funcionó antes', 'Pedirle que sea más creativa', 'Escribir el prompt en inglés'], 1, 'Casi siempre falta contexto. Antes de cambiar de herramienta, dale materia prima.']
  ];
  function quizHTML() {
    var st = { i: 0, ok: 0, res: [] };
    function pintar(box) {
      if (st.i >= QUIZ.length) {
        var paso = st.ok >= 4;
        box.innerHTML = '<div style="text-align:center;display:grid;justify-items:center;gap:12px"><div style="position:relative;width:130px;height:130px">' + S.burst(st.ok + '/5', paso ? '#F10E3B' : '#373435', '#fff', 130) + '</div><h2>' + (paso ? '¡Aprobado!' : 'Casi. Inténtalo otra vez.') + '</h2><p class="muted">' + (paso ? 'Sumaste ' + st.ok + ' de 5. Este quiz cuenta para el 10 % de tu nota.' : 'Necesitas 4 de 5. Repasa la lección y vuelve: no hay límite de intentos.') + '</p><div style="display:flex;gap:10px">' + (paso ? '<button class="btn btn-r js-q-sig">Siguiente actividad ' + S.ico('flecha') + '</button>' : '') + '<button class="btn btn-o js-q-re">Repetir quiz</button></div></div>';
        if (paso && inscrito()) { S.marcar(c.slug, lec.id); cabecera(); lateral(); botonHecha(); }
        return;
      }
      var q = QUIZ[st.i];
      box.innerHTML = '<div class="quiz-barra">' + QUIZ.map(function (_, j) { return '<i class="' + (j < st.i ? (st.res[j] ? 'ok' : 'no') : j === st.i ? 'act' : '') + '"></i>'; }).join('') + '</div><span class="ceja" style="margin-top:18px">Pregunta ' + (st.i + 1) + ' de 5</span><h2>' + q[0] + '</h2><div class="quiz-op">' + q[1].map(function (o, j) { return '<button data-o="' + j + '"><i>' + 'ABCD'[j] + '</i>' + o + '</button>'; }).join('') + '</div><div class="js-q-exp"></div>';
      $$('.quiz-op button', box).forEach(function (b) {
        b.addEventListener('click', function () {
          var j = +b.dataset.o, bien = j === q[2];
          $$('.quiz-op button', box).forEach(function (x) { x.disabled = true; if (+x.dataset.o === q[2]) x.classList.add('bien'); });
          if (!bien) b.classList.add('mal');
          st.res[st.i] = bien; if (bien) st.ok++;
          $('.js-q-exp', box).innerHTML = '<div class="explica"><b>' + (bien ? '¡Exacto!' : 'No es esa.') + '</b> ' + q[3] + '</div><button class="btn btn-r js-q-n">' + (st.i === QUIZ.length - 1 ? 'Ver resultado' : 'Siguiente pregunta') + '</button>';
          $('.js-q-n', box).addEventListener('click', function () { st.i++; pintar(box); });
        });
      });
    }
    return { pintar: pintar, st: st };
  }

  function escena() {
    var e = $('.js-escena'); v = null;
    if (!inscrito() && !esPreview(lec)) {
      e.innerHTML = '<div class="actividad"><div class="act-caja" style="text-align:center;display:grid;justify-items:center;gap:12px">' + S.ico('candado').replace('class="ico ', 'class="ico " style="width:40px;height:40px;color:var(--rojo)" ') + '<h2>Esta clase es parte de «' + c.titulo + '»</h2><p class="muted">Inscríbete para ver todas las lecciones, entregar los talleres y recibir tu constancia.</p><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><a class="btn btn-r" href="curso.html?c=' + c.slug + '#comprar">Inscribirme · ' + S.fmt(c.precio) + '</a><button class="btn btn-o js-ir-prev">Ver la vista previa gratis</button></div></div></div>';
      return;
    }
    if (lec.tipo === 'video') { e.innerHTML = playerHTML(lec.id === 'u2-1' ? '' : 'Clip de muestra del prototipo'); montarPlayer(); return; }
    if (lec.tipo === 'vivo') {
      var ev = S.agenda().filter(function (x) { return x.slug === c.slug && x.lid === lec.id; })[0], n = new Date();
      if (ev && ev.fin < n) { e.innerHTML = playerHTML('Grabación · ' + S.fecha(ev.fecha)); montarPlayer(); return; }
      var ms = ev ? ev.fecha - n : 0, dd = Math.floor(ms / 864e5), hh = Math.floor(ms / 36e5) % 24, mm = Math.floor(ms / 6e4) % 60;
      e.innerHTML = '<div class="actividad"><div class="act-caja vivo-caja"><span class="tag tag-r"><span class="punto-vivo" style="color:#fff"></span>Sesión en vivo</span><h2>' + S.esc(lec.t) + '</h2><p class="muted">' + (ev ? S.DIAS[ev.fecha.getDay()] + ' ' + S.fecha(ev.fecha) + ' · ' + S.hora(ev.fecha) + ' a ' + S.hora(ev.fin) : 'Fecha por confirmar') + ' · con ' + d.nombre + '</p>' +
        (ev && ms > 0 ? '<div class="cuenta-v"><div><b>' + dd + '</b><small>días</small></div><div><b>' + hh + '</b><small>horas</small></div><div><b>' + mm + '</b><small>min</small></div></div>' : '<a class="btn btn-r" href="#">Entrar a la sala</a>') +
        '<p style="font-size:14.5px;max-width:460px">Mitad taller, mitad clínica. Lleva tu avance del entregable: ' + d.nombre.split(' ')[0] + ' revisa en vivo el trabajo de quien lo comparta. Si no puedes llegar, la grabación aparece aquí al día siguiente.</p>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">' + (ev ? '<button class="btn btn-o js-ics-c">' + S.ico('calendario') + 'Agregar al calendario</button>' : '') + '<button class="btn btn-o js-recordar">' + S.ico('campana') + 'Recordarme 1 h antes</button></div></div></div>';
      if (ev) $('.js-ics-c', e).addEventListener('click', function () { S.ics(ev); });
      $('.js-recordar', e).addEventListener('click', function () { this.innerHTML = S.ico('check') + 'Te avisamos 1 h antes'; this.disabled = true; S.toast('Listo: te avisamos por correo una hora antes.', 'campana'); });
      return;
    }
    if (lec.tipo === 'taller') {
      var u = lec.u, est = S.entrega(c.slug, lec.id);
      var EST = { aprobado: ['tag-v', 'Aprobado · ' + String(est.nota).replace('.', ',')], revision: ['tag-y', 'En revisión'], pendiente: ['tag', 'Pendiente'], vencida: ['tag-r', 'Vencida'], bloqueada: ['tag', 'Pendiente'] }[est.estado] || ['tag', 'Pendiente'];
      e.innerHTML = '<div class="actividad"><div class="act-caja"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><span class="ceja">Taller · ' + u.c + '</span><span class="tag ' + EST[0] + '">' + EST[1] + '</span></div><h2>' + S.esc(u.d || lec.t) + '</h2><p class="muted">Trabájalo sobre tu negocio de práctica' + (S.sesion().negocio ? ' (<b>' + S.esc(S.sesion().negocio) + '</b>)' : '') + '. Calcula ' + S.dur(lec.min) + ' entre las dos semanas.</p>' +
        '<h3 style="font-size:1.05rem;margin:18px 0 8px">Paso a paso</h3><ol style="padding-left:20px;display:grid;gap:6px;font-size:15px"><li>Descarga la guía del taller y léela completa (5 min).</li><li>Haz el ejercicio con tu negocio real, no con un ejemplo inventado.</li><li>Exporta en PDF o comparte el enlace del documento.</li><li>Súbelo antes del domingo a las 11:59 p. m.</li></ol>' +
        '<div class="rubrica"><div><span>Cumple lo que pide la unidad</span><b>40 %</b></div><div><span>Usa evidencia del negocio real</span><b>40 %</b></div><div><span>Claridad y presentación</span><b>20 %</b></div></div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:20px"><button class="btn btn-r js-subir">' + S.ico(est.estado === 'aprobado' || est.estado === 'revision' ? 'ojo' : 'subir') + (est.estado === 'aprobado' ? 'Ver nota y comentarios' : est.estado === 'revision' ? 'Ver mi envío' : 'Subir entregable') + '</button><button class="btn btn-o js-guia">' + S.ico('descargar') + 'Guía del taller</button></div></div></div>';
      $('.js-subir', e).addEventListener('click', function () { S.modalEntrega(c, u, lec.id, function () { escena(); cabecera(); lateral(); botonHecha(); }); });
      $('.js-guia', e).addEventListener('click', function () { descargar('guia-taller-' + u.c.toLowerCase() + '.txt', 'SEMPLY · GUÍA DEL TALLER ' + u.c + '\n' + c.titulo + '\n\nEntregable: ' + (u.d || lec.t) + '\n\n1. Lee la guía completa.\n2. Trabaja con tu negocio real.\n3. Exporta en PDF o comparte el enlace.\n4. Sube tu entregable en el campus antes del domingo a las 11:59 p. m.\n\nCriterios: cumple lo que pide la unidad (40 %), usa evidencia del negocio real (40 %), claridad y presentación (20 %).\n\nDocente: ' + d.nombre + '\n'); });
      return;
    }
    if (lec.tipo === 'quiz') {
      e.innerHTML = '<div class="actividad"><div class="act-caja js-quiz"></div></div>';
      var qz = quizHTML(), box = $('.js-quiz', e); qz.pintar(box);
      box.addEventListener('click', function (x) { if (x.target.closest('.js-q-re')) { qz.st.i = 0; qz.st.ok = 0; qz.st.res = []; qz.pintar(box); } if (x.target.closest('.js-q-sig')) { var s = vecina(1); if (s) abrir(s.id); } });
    }
  }
  $('.js-escena').addEventListener('click', function (e) { if (e.target.closest('.js-ir-prev')) abrir(c.slug === 'ia-marketing' ? 'u2-1' : todas[0].id); });
  function descargar(nombre, txt) { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain;charset=utf-8' })); a.download = nombre; a.click(); S.toast('Descargando ' + nombre, 'descargar'); }

  /* ---------- información y pestañas ---------- */
  var pestana = 'resumen';
  function notasDe() { return ((S.leer('notas', {})[c.slug] || {})[lec.id]) || []; }
  function guardarNotas(l) { var n = S.leer('notas', {}); n[c.slug] = n[c.slug] || {}; n[c.slug][lec.id] = l; S.guardar('notas', n); }
  function preguntasDe() {
    var g = S.leer('preguntas', {})[c.slug + '|' + lec.id]; if (g) return g;
    if (lec.id === 'u2-1') return [
      { n: 'Juliana Patiño', t: 'hace 2 días', q: '¿El contexto puede ser un documento completo o es mejor resumirlo?', r: 'Puede ser completo, pero dile qué partes importan y para qué. En la lección 2 vemos cómo darle materia prima sin que se pierda.' },
      { n: 'Camilo Rendón', t: 'hace 4 días', q: '¿Las cinco piezas sirven igual en Gemini que en ChatGPT?', r: 'Sí, sirven en cualquier modelo. Lo que cambia es cuánto contexto aguanta cada uno: lo vimos en el mapa de modelos de la U1.' },
      { n: 'Sebastián Lozano', t: 'hace 6 h', q: 'Para el taller, ¿puedo usar el negocio de un cliente en vez del mío?', r: '' }];
    return [{ n: 'Paula Andrea A.', t: 'hace 3 días', q: '¿Esta lección tiene plantilla descargable?', r: 'Sí, está en la pestaña Recursos. Si no te aparece, recarga la página.' }];
  }
  function info() {
    var hecha = !!hechas()[lec.id], ant = vecina(-1), sig = vecina(1);
    var nN = notasDe().length, nP = preguntasDe().length;
    $('.js-info').innerHTML = '<span class="tag tag-y">' + lec.u.c + ' · ' + S.esc(lec.u.n) + '</span><h1>' + S.esc(lec.t) + '</h1><div style="display:flex;gap:10px;align-items:center;color:rgba(255,255,255,.7);font-size:14.5px">' + S.img(S.docImg(c.docente, true), '', 'style="width:32px;height:32px;border-radius:50%;object-fit:cover"') + d.nombre + ' · ' + TIPO[lec.tipo] + ' · ' + S.dur(lec.min) + '</div>' +
      '<div class="cl-acc">' + (inscrito() ? '<button class="btn btn-ob btn-s btn-hecha js-hecha' + (hecha ? ' hecha' : '') + '">' + S.ico('check') + (hecha ? 'Completada' : 'Marcar como vista') + '</button>' : '<a class="btn btn-y btn-s" href="curso.html?c=' + c.slug + '#comprar">Inscribirme para ver todo</a>') +
      (ant ? '<button class="btn btn-ob btn-s js-ant">' + S.ico('izq') + 'Anterior</button>' : '') + (sig ? '<button class="btn btn-r btn-s js-sig">Siguiente ' + S.ico('flecha', 'ico-flecha') + '</button>' : '') + '</div>' +
      '<div class="cl-tabs" role="tablist">' + [['resumen', 'Resumen'], ['trans', 'Transcripción'], ['recursos', 'Recursos'], ['notas', 'Notas', nN], ['preguntas', 'Preguntas', nP]].filter(function (t) { return lec.tipo === 'video' || lec.tipo === 'vivo' || (t[0] !== 'trans'); }).map(function (t) { return '<button role="tab" data-t="' + t[0] + '" class="' + (pestana === t[0] ? 'on' : '') + '">' + t[1] + (t[2] ? '<span class="n">' + t[2] + '</span>' : '') + '</button>'; }).join('') + '</div><div class="cl-pan js-pan"></div>';
    panel();
  }
  function botonHecha() { var b = $('.js-hecha'); if (!b) return; var h = !!hechas()[lec.id]; b.classList.toggle('hecha', h); b.innerHTML = S.ico('check') + (h ? 'Completada' : 'Marcar como vista'); }
  function panel() {
    var p = $('.js-pan'), muestra = lec.id === 'u2-1';
    if (pestana === 'trans' && lec.tipo !== 'video' && lec.tipo !== 'vivo') pestana = 'resumen';
    if (pestana === 'resumen') {
      p.innerHTML = muestra ? '<p>Un prompt funciona como un motor de cinco piezas. Si una falla, la respuesta se cae, y casi siempre la que falla es el contexto.</p><h3>Las cinco piezas</h3><ul class="puntos"><li><b>Rol:</b> desde dónde mira la IA. No «eres un experto», sino «eres la estratega de contenido de una panadería de barrio en Cali».</li><li><b>Contexto:</b> la materia prima. Qué vendes, a quién y qué funcionó el mes pasado.</li><li><b>Tarea:</b> un verbo y un resultado. «Escribe cinco ganchos para un reel de 30 segundos».</li><li><b>Formato:</b> cómo lo quieres recibir. Tabla, lista o guion.</li><li><b>Restricciones:</b> lo que no puede pasar. Sin emojis, máximo 12 palabras, sin prometer descuentos.</li></ul><h3>Para el taller</h3><p>Arma tu primer prompt con las cinco piezas usando la ficha de tu negocio y súbelo como entregable de la unidad.</p>'
        : '<p>' + (lec.tipo === 'video' ? 'En esta lección: <b>' + S.esc(lec.t) + '</b>.' : S.esc(lec.t) + '.') + ' Forma parte de ' + lec.u.c + ' · ' + S.esc(lec.u.n) + (lec.u.d ? ', cuyo entregable es: ' + S.esc(lec.u.d) : '') + '</p><div class="demo-aviso" style="margin-top:16px;background:rgba(255,194,37,.12);color:#fff">' + S.ico('info') + '<span>Prototipo: esta lección usa el clip de muestra de «Anatomía de un prompt». Las demás se graban en el set de Semply con la misma plantilla.</span></div>';
    } else if (pestana === 'trans') {
      p.innerHTML = '<div class="trans js-trans">' + L.cues.map(function (q, i) { return '<button data-t="' + q[0] + '" data-i="' + i + '"><small>' + mmss(q[0]) + '</small><span>' + S.esc(q[2]) + '</span></button>'; }).join('') + '</div>';
    } else if (pestana === 'recursos') {
      var rec = [['archivo', 'Plantilla: las cinco piezas del prompt', 'TXT · 2 KB', 'plantilla'], ['libro', 'Ficha del negocio de práctica', 'Documento editable', 'ficha'], ['lista', 'Biblioteca de 15 prompts para marketing', 'Notion · se duplica a tu cuenta', 'notion'], ['cc', 'Subtítulos de la lección', 'VTT', 'vtt']];
      p.innerHTML = rec.map(function (r) { return '<div class="recurso"><span class="ic">' + S.ico(r[0]) + '</span><div><b>' + r[1] + '</b><small>' + r[2] + '</small></div><button class="btn btn-ob btn-s js-rec" data-r="' + r[3] + '">' + S.ico('descargar') + '<span class="sr">Descargar</span></button></div>'; }).join('');
    } else if (pestana === 'notas') {
      var ns = notasDe();
      p.innerHTML = '<form class="nota-f js-nota-f"><label class="sr" for="nota-t">Nueva nota</label><input id="nota-t" class="inp" placeholder="' + (v ? 'Escribe una nota en ' + mmss(v.currentTime) + '…' : 'Escribe una nota…') + '" autocomplete="off"><button class="btn btn-r">Guardar</button></form>' +
        (ns.length ? ns.map(function (n, i) { return '<div class="nota"><button class="t js-ir" data-t="' + n.t + '">' + mmss(n.t) + '</button><p>' + S.esc(n.txt) + '</p><button class="x js-borrar" data-i="' + i + '" aria-label="Borrar nota">' + S.ico('x') + '</button></div>'; }).join('') : '<p style="color:rgba(255,255,255,.5)">Tus notas quedan amarradas al minuto del video. Toca el minuto para volver a ese punto.</p>');
    } else if (pestana === 'preguntas') {
      var ps = preguntasDe();
      p.innerHTML = '<form class="nota-f js-preg-f"><label class="sr" for="preg-t">Tu pregunta</label><input id="preg-t" class="inp" placeholder="Pregúntale a ' + d.nombre.split(' ')[0] + ' o a tus compañeros…" autocomplete="off"><button class="btn btn-r">Publicar</button></form>' +
        ps.map(function (q) { return '<div class="preg"><span class="avatar">' + S.iniciales(q.n) + '</span><div><b>' + S.esc(q.n) + '</b> <small>· ' + q.t + '</small><p>' + S.esc(q.q) + '</p>' + (q.r ? '<div class="resp">' + S.img(S.docImg(c.docente, true), '') + '<div><b>' + d.nombre + '</b> <span class="tag tag-y" style="font-size:11px;padding:2px 6px">Docente</span><p>' + S.esc(q.r) + '</p></div></div>' : '<small style="color:var(--amarillo)">' + d.nombre.split(' ')[0] + ' suele responder en menos de 24 horas.</small>') + '</div></div>'; }).join('');
    }
  }
  $('.js-info').addEventListener('click', function (e) {
    var t = e.target.closest('[data-t]');
    if (t && t.closest('.cl-tabs')) { pestana = t.dataset.t; $$('.cl-tabs button').forEach(function (b) { b.classList.toggle('on', b === t); }); panel(); return; }
    if (t && (t.closest('.trans') || t.classList.contains('js-ir'))) { if (v) { v.currentTime = +t.dataset.t; v.play(); $('.js-player').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } return; }
    if (e.target.closest('.js-hecha')) { var h = !!hechas()[lec.id]; S.marcar(c.slug, lec.id, !h); completada = !h; botonHecha(); cabecera(); lateral(); if (!h) S.toast('Marcada como vista', 'check'); }
    if (e.target.closest('.js-ant')) abrir(vecina(-1).id);
    if (e.target.closest('.js-sig')) abrir(vecina(1).id);
    var b = e.target.closest('.js-borrar'); if (b) { var l = notasDe(); l.splice(+b.dataset.i, 1); guardarNotas(l); info(); pestana = 'notas'; }
    var r = e.target.closest('.js-rec');
    if (r) {
      if (r.dataset.r === 'plantilla') descargar('semply-plantilla-5-piezas.txt', 'SEMPLY · PLANTILLA: LAS CINCO PIEZAS DEL PROMPT\n\nROL\nEres [quién] de [qué negocio] en [dónde].\n\nCONTEXTO\nVendemos [qué] a [quién]. Lo que funcionó el mes pasado: [dato o ejemplo].\n\nTAREA\n[Verbo] + [resultado concreto]. Ej.: Escribe 5 ganchos para un reel de 30 segundos.\n\nFORMATO\nEntrégalo en [tabla / lista / guion] con estas columnas: [...].\n\nRESTRICCIONES\nSin [...]. Máximo [...]. No [...].\n\n— Mariana Restrepo · IA aplicada al marketing · Unidad 2\n');
      else if (r.dataset.r === 'vtt') { var a = document.createElement('a'); a.href = 'assets/media/leccion-anatomia-prompt.vtt'; a.download = 'subtitulos-anatomia-prompt.vtt'; a.click(); }
      else S.toast(r.dataset.r === 'notion' ? 'En la versión final se duplica a tu Notion.' : 'En la versión final abre una copia en tu Google Drive.', 'info');
    }
  });
  $('.js-info').addEventListener('submit', function (e) {
    e.preventDefault();
    if (e.target.classList.contains('js-nota-f')) { var i = $('#nota-t'), tx = i.value.trim(); if (!tx) return; var l = notasDe(); l.push({ t: v ? Math.floor(v.currentTime) : 0, txt: tx }); l.sort(function (a, b) { return a.t - b.t; }); guardarNotas(l); pestana = 'notas'; info(); S.toast('Nota guardada en ' + mmss(v ? v.currentTime : 0), 'nota'); }
    if (e.target.classList.contains('js-preg-f')) { var q = $('#preg-t').value.trim(); if (!q) return; var ps = preguntasDe(); ps.unshift({ n: S.sesion().nombre, t: 'ahora', q: q, r: '' }); var g = S.leer('preguntas', {}); g[c.slug + '|' + lec.id] = ps; S.guardar('preguntas', g); pestana = 'preguntas'; info(); S.toast('Pregunta publicada', 'chat'); }
  });
  var ultimaI = -1;
  function sincronizarTrans(t) {
    var tr = $('.js-trans'); if (!tr) return;
    var i = -1; L.cues.forEach(function (q, j) { if (t >= q[0]) i = j; });
    if (i === ultimaI) return; ultimaI = i;
    $$('button', tr).forEach(function (b) { b.classList.toggle('act', +b.dataset.i === i); });
    var a = $('button.act', tr); if (a) tr.scrollTo({ top: a.offsetTop - tr.offsetTop - 80, behavior: 'smooth' });
  }

  /* ---------- abrir una lección ---------- */
  function abrir(lid) {
    if (v) { guardarT(true); v.pause(); }
    lec = todas.filter(function (l) { return l.id === lid; })[0] || S.siguiente(c.slug);
    if (inscrito()) S.ultima(c.slug, lec.id);
    history.replaceState(null, '', 'clase.html?c=' + c.slug + '&l=' + lec.id);
    ultimaI = -1;
    cabecera(); escena(); info(); lateral();
    var sb = $('.js-sig-top'), s = vecina(1); sb.style.display = s ? '' : 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  $('.js-sig-top').addEventListener('click', function () { var s = vecina(1); if (s) abrir(s.id); });
  window.addEventListener('beforeunload', function () { guardarT(true); });
  var pedida = S.param('l');
  abrir(pedida || (inscrito() ? S.siguiente(c.slug).id : (c.slug === 'ia-marketing' ? 'u2-1' : todas[0].id)));
})();
