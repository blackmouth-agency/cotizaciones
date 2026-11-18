/* Héroe: los platos de la casa ruedan sobre una órbita. El de adelante se muestra grande;
   el siguiente asoma arriba a la derecha y el anterior sale por la izquierda. */
(function () {
  "use strict";
  var esc = document.getElementById("orbita"); if (!esc) return;
  var reduce = window.CP && window.CP.reduce;
  var PLATOS = [
    { k: "carbonara", n: "Carbonara", f: "tagliatelle_carbonara", o: "Nace en Roma" },
    { k: "pesto", n: "Pesto genovés", f: "tagliatelle_pesto", o: "Nace en Génova" },
    { k: "rav-carne", n: "Raviolis al ragú", f: "raviolis_ragu", o: "Hechos a mano en la fábrica" },
    { k: "marisco", n: "Pappardelle al marisco", f: "pappardelle_marisco", o: "Calamar, camarón y mejillones" },
    { k: "albnap", n: "Albóndigas en napolitana", f: "spaghetti_albnap", o: "La salsa roja de la casa" },
    { k: "gn-pesto", n: "Gnocchi al pesto", f: "gnocchi_pesto", o: "De papa y harina" },
    { k: "tinta", n: "Marisco en tinta", f: "spaghetti_tinta", o: "Nace en Venecia" }
  ];
  var N = PLATOS.length, act = 0, giro = 0, timer = null;
  var cont = document.getElementById("orb-platos"), mini = document.getElementById("orb-mini");
  var svg = esc.querySelector(".orb-banda");
  var els = PLATOS.map(function (p, i) {
    var d = document.createElement("button"); d.type = "button"; d.className = "orb-plato";
    d.setAttribute("aria-label", "Ver " + p.n);
    d.innerHTML = '<img src="img/plato2/' + p.f + '.webp" alt="' + p.n + '" width="900" height="900"' + (i === 0 ? ' fetchpriority="high"' : ' loading="lazy"') + '>';
    d.onclick = function () { if (i !== act) ir(i); else location.href = "carta.html#plato=" + p.k; };
    cont.appendChild(d);
    var m = document.createElement("button"); m.type = "button"; m.setAttribute("role", "tab"); m.className = "orb-mini";
    m.innerHTML = '<img src="img/plato2/s/' + p.f + '.webp" alt="" width="420" height="420" loading="lazy"><span>' + p.n + '</span>';
    m.onclick = function () { ir(i); reinicia(); };
    mini.appendChild(m);
    return d;
  });

  // geometría de la órbita (se recalcula al cambiar el tamaño)
  var G = {};
  function medir() {
    var w = esc.clientWidth, h = esc.clientHeight, movil = innerWidth <= 900;
    var S = movil ? Math.min(w * 0.56, h * 0.3) : Math.min(h * 0.54, w * 0.34);
    var px = movil ? w * 0.5 : w * 0.68, py = movil ? h * 0.27 : h * 0.44;
    var R = S * (movil ? 1.25 : 1.45), a0 = (movil ? -110 : -128) * Math.PI / 180;
    G = { S: S, R: R, a0: a0, paso: (movil ? 58 : 46) * Math.PI / 180, cx: px - R * Math.cos(a0), cy: py - R * Math.sin(a0) };
    esc.style.setProperty("--S", S + "px");
    // la banda sigue el mismo círculo
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    svg.querySelectorAll("circle").forEach(function (c) { c.setAttribute("cx", G.cx); c.setAttribute("cy", G.cy); c.setAttribute("r", R); });
    pinta(true);
  }
  function rel(i) { var d = (i - act) % N; if (d > N / 2) d -= N; if (d < -N / 2) d += N; return d; }
  function pinta(sinAnim) {
    els.forEach(function (el, i) {
      var d = rel(i), a = G.a0 + d * G.paso;
      var x = G.cx + G.R * Math.cos(a) - G.S / 2, y = G.cy + G.R * Math.sin(a) - G.S / 2;
      var esc2 = d === 0 ? 1 : 0.62, rot = giro + d * 70;
      el.style.transition = sinAnim ? "none" : "";
      el.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) scale(" + esc2 + ")";
      el.querySelector("img").style.transform = "rotate(" + rot + "deg)";
      el.style.opacity = d === 0 ? 1 : d === 1 ? 0.95 : d === -1 ? (innerWidth <= 900 ? 0 : 0.28) : 0;
      el.style.zIndex = d === 0 ? 3 : 2;
      el.classList.toggle("on", d === 0);
      el.tabIndex = Math.abs(d) <= 1 ? 0 : -1;
    });
    Array.prototype.forEach.call(mini.children, function (m, i) { m.setAttribute("aria-selected", i === act); m.classList.toggle("on", i === act); });
  }
  function info() {
    var p = PLATOS[act], nom = document.getElementById("orb-nombre");
    document.getElementById("orb-n").textContent = "Nº " + (act + 1) + " de la casa";
    document.getElementById("orb-origen").textContent = p.o;
    document.getElementById("orb-ver").href = "carta.html#plato=" + p.k;
    var nuevo = document.createElement("span"); nuevo.textContent = p.n;
    var viejo = nom.firstElementChild;
    if (reduce || !viejo) { nom.innerHTML = ""; nom.appendChild(nuevo); return; }
    nuevo.className = "entra-nom"; nom.appendChild(nuevo); viejo.className = "sale-nom";
    setTimeout(function () { if (viejo.parentNode) viejo.parentNode.removeChild(viejo); nuevo.className = ""; }, 700);
  }
  function ir(i) {
    var d = rel(i); if (!d) return;
    giro += d * 70; act = (i + N) % N; pinta(); info();
  }
  function sig() { ir((act + 1) % N); }
  function prev() { ir((act - 1 + N) % N); }
  document.getElementById("orb-sig").onclick = function () { sig(); reinicia(); };
  document.getElementById("orb-prev").onclick = function () { prev(); reinicia(); };
  // deslizar en el celular
  var x0 = null;
  esc.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  esc.addEventListener("touchend", function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) { dx < 0 ? sig() : prev(); reinicia(); } x0 = null; });
  // avance solo, que se detiene al pasar el mouse
  function reinicia() { clearInterval(timer); if (!reduce) timer = setInterval(sig, 4800); }
  esc.addEventListener("mouseenter", function () { clearInterval(timer); });
  esc.addEventListener("mouseleave", reinicia);
  new IntersectionObserver(function (es) { if (es[0].isIntersecting) reinicia(); else clearInterval(timer); }).observe(esc);
  addEventListener("resize", medir);
  medir(); info();
  requestAnimationFrame(function () { esc.classList.add("lista"); });

  // el texto se va al bajar
  var txt = document.querySelector(".h3d-txt");
  if (txt && !reduce) addEventListener("scroll", function () { var k = Math.min(1.2, scrollY / innerHeight); txt.style.transform = "translate3d(0," + (-k * 80).toFixed(1) + "px,0)"; txt.style.opacity = Math.max(0, 1 - k * 1.5).toFixed(3); }, { passive: true });
})();
