(function () {
  "use strict";
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var ORDEN = ["genova", "piamonte", "milan", "verona", "treviso", "venecia", "bolonia", "florencia", "amatrice", "roma", "trevi", "napoles", "amalfi"];
  var D = (window.ITALIA || []).slice().sort(function (a, b) { return ORDEN.indexOf(a.k) - ORDEN.indexOf(b.k); });
  // posición de cada parada sobre el mapa (% del ancho y alto de la imagen)
  var POS = window.MAPA_POS || {};
  // el plato de la carta que corresponde a cada parada
  var PLATO = { genova: "pesto", roma: "carbonara", trevi: "alfredo", amatrice: "amatriciana", bolonia: "ragu", napoles: "napolitana", amalfi: "limoncello", venecia: "tinta", treviso: "tiramisu", milan: "ossobuco", florencia: "negroni", piamonte: "pannacotta", verona: "gn-pesto" };

  /* ---------- héroe: monumentos que rotan ---------- */
  var fotos = $$(".it-heroe-fotos img"), lugares = ["Roma · Lacio", "Venecia · Véneto", "Costa Amalfitana · Campania", "Génova · Liguria"], fi = 0;
  if (fotos.length && !window.CP.reduce) setInterval(function () {
    fotos[fi].classList.remove("on"); fi = (fi + 1) % fotos.length; fotos[fi].classList.add("on");
    var l = $("#heroe-lugar"); l.classList.remove("on"); void l.offsetWidth; l.textContent = lugares[fi]; l.classList.add("on");
  }, 4200);

  /* ---------- paradas ---------- */
  var cont = $("#paradas"), mapa = $("#mapa");
  $("#mapa-tot").textContent = ("0" + D.length).slice(-2);
  D.forEach(function (p, i) {
    var a = document.createElement("article"); a.className = "parada"; a.id = p.k; a.dataset.i = i;
    var cta = '<a class="btn btn-rojo" href="carta.html#plato=' + (PLATO[p.k] || "") + '">' + (p.pide ? p.pide.txt : "Ver " + p.plato.toLowerCase() + " en la carta") + '</a><a class="btn btn-linea-crema" href="reservas.html">Pruébalo en el restaurante</a>';
    a.innerHTML = '<figure class="parada-foto"><img src="img/italia/m/' + p.img + '.webp" srcset="img/italia/m/' + p.img + '.webp 820w, img/italia/' + p.img + '.webp 1376w" sizes="(max-width:900px) 92vw, 46vw" alt="' + p.ciudad + ', ' + p.region + '" loading="lazy" width="1376" height="768"><figcaption>' + p.ciudad + ' · ' + p.region + '</figcaption></figure>' +
      '<div class="parada-txt"><span class="parada-n">' + ("0" + (i + 1)).slice(-2) + '</span><span class="ante">' + p.region + '</span><h2>' + p.ciudad + '</h2><h3>' + p.plato + '</h3><p>' + p.historia + '</p>' +
      '<aside class="sabias"><b>¿Sabías que…?</b><p>' + p.dato + '</p></aside><div class="heroe-btns">' + cta + '</div></div>';
    cont.appendChild(a);
    if (POS[p.k]) {
      var m = document.createElement("button"); m.type = "button"; m.className = "pin"; m.style.left = POS[p.k][0] + "%"; m.style.top = POS[p.k][1] + "%"; m.dataset.k = p.k;
      m.innerHTML = "<i></i><span>" + p.ciudad + "</span>"; m.setAttribute("aria-label", p.ciudad + ": " + p.plato);
      m.onclick = function () { var t = document.getElementById(p.k); var y = t.getBoundingClientRect().top + scrollY - 90; if (window.CP.lenis) window.CP.lenis.scrollTo(y); else scrollTo({ top: y, behavior: "smooth" }); };
      mapa.appendChild(m);
    }
  });

  /* ---------- ruta entre paradas visitadas ---------- */
  var path = $("#ruta-path");
  function ruta(hasta) {
    var pts = D.slice(0, hasta + 1).map(function (p) { return POS[p.k]; }).filter(Boolean);
    if (pts.length < 2) { path.setAttribute("d", ""); return; }
    var d = "M" + pts[0][0] + " " + pts[0][1];
    for (var i = 1; i < pts.length; i++) { var a = pts[i - 1], b = pts[i], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - 4; d += " Q" + mx + " " + my + " " + b[0] + " " + b[1]; }
    path.setAttribute("d", d);
  }
  var activa = -1;
  function activar(i) {
    if (i === activa) return; activa = i;
    var p = D[i];
    $$(".pin", mapa).forEach(function (m, j) { m.classList.toggle("on", m.dataset.k === p.k); m.classList.toggle("visto", D.findIndex(function (x) { return x.k === m.dataset.k; }) <= i); });
    $$(".parada").forEach(function (a) { a.classList.toggle("activa", +a.dataset.i === i); });
    $("#mapa-n").textContent = ("0" + (i + 1)).slice(-2); $("#mapa-ciudad").textContent = p.ciudad + " · " + p.plato;
    ruta(i);
    if (POS[p.k] && innerWidth > 900) { mapa.style.setProperty("--fx", (50 - POS[p.k][0]) * 0.35 + "%"); mapa.style.setProperty("--fy", (50 - POS[p.k][1]) * 0.35 + "%"); }
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) activar(+e.target.dataset.i); });
  }, { rootMargin: "-45% 0px -45% 0px" });
  $$(".parada").forEach(function (a) { io.observe(a); });
  activar(0);

  /* ---------- parallax suave en las fotos ---------- */
  if (!window.CP.reduce) {
    var figs = $$(".parada-foto img");
    addEventListener("scroll", function () {
      requestAnimationFrame(function () {
        figs.forEach(function (im) { var r = im.parentNode.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; var k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; im.style.transform = "translateY(" + (k * -40) + "px) scale(1.12)"; });
      });
    }, { passive: true });
  }
})();
