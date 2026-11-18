/* Héroe por capas: mar y pueblo al fondo, la palabra ITALIA, la terraza y la mesa al frente.
   Cada capa se mueve distinto con el mouse, el giroscopio y el scroll: profundidad real y sin WebGL. */
(function () {
  "use strict";
  var h = document.getElementById("heroe"); if (!h) return;
  var capas = Array.prototype.slice.call(h.querySelectorAll("[data-prof]"));
  var reduce = window.CP && window.CP.reduce;
  var txt = h.querySelector(".h3d-txt");
  function lista() { h.classList.add("lista"); }
  var imgs = Array.prototype.slice.call(h.querySelectorAll(".capa img"));
  var faltan = imgs.length;
  imgs.forEach(function (im) { if (im.complete) { if (!--faltan) lista(); } else im.addEventListener("load", function () { if (!--faltan) lista(); }); im.addEventListener("error", function () { if (!--faltan) lista(); }); });
  setTimeout(lista, 2500);
  if (reduce) return;

  var obj = { x: 0, y: 0 }, act = { x: 0, y: 0 }, sc = 0, scAct = 0, corriendo = false, puntero = false, t0 = performance.now();
  var fino = matchMedia("(hover:hover) and (pointer:fine)").matches;
  if (fino) addEventListener("pointermove", function (e) { puntero = true; obj.x = e.clientX / innerWidth * 2 - 1; obj.y = e.clientY / innerHeight * 2 - 1; arranca(); }, { passive: true });
  addEventListener("deviceorientation", function (e) {
    if (e.gamma == null) return; puntero = true;
    obj.x = Math.max(-1, Math.min(1, e.gamma / 20)); obj.y = Math.max(-1, Math.min(1, (e.beta - 50) / 20)); arranca();
  }, { passive: true });
  addEventListener("scroll", function () { sc = Math.min(1.2, scrollY / innerHeight); arranca(); }, { passive: true });
  addEventListener("resize", arranca);

  var visible = true;
  new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) arranca(); }).observe(h);

  function arranca() { if (!corriendo && visible) { corriendo = true; requestAnimationFrame(paso); } }
  function paso(now) {
    // sin mouse (celular sin giroscopio): un vaivén lento para que se note la profundidad
    if (!puntero) { var t = (now - t0) / 1000; obj.x = Math.sin(t * 0.5) * 0.6; obj.y = Math.sin(t * 0.37) * 0.3; }
    act.x += (obj.x - act.x) * 0.075; act.y += (obj.y - act.y) * 0.075; scAct += (sc - scAct) * 0.2;
    var w = innerWidth, hh = innerHeight;
    for (var i = 0; i < capas.length; i++) {
      var c = capas[i], p = +c.dataset.prof; // 0 = lejos, 1 = cerca
      var dx = -act.x * p * w * 0.028, dy = -act.y * p * hh * 0.02;
      var sy = scAct * hh * (0.06 - p * 0.32); // al bajar, lo cercano sube más rápido que el fondo
      var es = 1 + scAct * (0.04 + p * 0.1);
      c.style.transform = "translate3d(" + dx.toFixed(1) + "px," + (dy + sy).toFixed(1) + "px,0) scale(" + es.toFixed(4) + ")";
    }
    if (txt) { txt.style.transform = "translate3d(0," + (-scAct * 90).toFixed(1) + "px,0)"; txt.style.opacity = Math.max(0, 1 - scAct * 1.6).toFixed(3); }
    var quieto = puntero && Math.abs(obj.x - act.x) < 0.001 && Math.abs(obj.y - act.y) < 0.001 && Math.abs(sc - scAct) < 0.001;
    if (!visible || quieto) { corriendo = false; return; }
    requestAnimationFrame(paso);
  }
  arranca();
})();
