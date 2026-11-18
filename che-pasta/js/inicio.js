(function () {
  "use strict";
  var reduce = window.CP.reduce;
  function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }

  /* cifras que cuentan */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return; io.unobserve(e.target);
      var el = e.target, fin = +el.dataset.cuenta, t0 = performance.now();
      if (reduce) { el.textContent = fin; return; }
      (function paso(now) { var p = Math.min(1, (now - t0) / 1400); el.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(paso); })(t0);
    });
  }, { threshold: 0.6 });
  $$("[data-cuenta]").forEach(function (el) { el.textContent = "0"; io.observe(el); });

  /* abanico de fotos de la fábrica: se abre al pasar por él */
  var ab = document.getElementById("abanico"); if (!ab || reduce) return;
  var fotos = $$("#abanico img"), visible = false, pend = false;
  new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) pide(); }).observe(ab);
  function pide() { if (!pend) { pend = true; requestAnimationFrame(pinta); } }
  function pinta() {
    pend = false; if (!visible) return;
    var r = ab.getBoundingClientRect(), p = Math.max(0, Math.min(1, (innerHeight * 0.9 - r.top) / (innerHeight * 0.65)));
    var e = 1 - Math.pow(1 - p, 2);
    fotos.forEach(function (im, i) { var k = i - 1.5; im.style.transform = "translate(" + (k * 28 * e) + "%," + ((1 - e) * 40 + Math.abs(k) * 18 * e) + "px) rotate(" + (k * 9 * e) + "deg)"; });
  }
  addEventListener("scroll", pide, { passive: true });
})();
