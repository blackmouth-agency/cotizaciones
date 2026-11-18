(function () {
  "use strict";
  var WA = "573188752637";
  function wa(t) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(t); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- horario (hora de Cali) ---------- */
  var H = { 0: [[630, 1080]], 1: [], 2: [[690, 930], [1050, 1290]], 3: [[690, 930], [1050, 1290]], 4: [[690, 930], [1050, 1320]], 5: [[690, 930], [1050, 1350]], 6: [[690, 1350]] };
  var FEST = ["2026-11-16", "2026-12-08", "2026-12-25", "2027-01-01", "2027-01-11", "2027-03-22", "2027-03-25", "2027-03-26", "2027-05-01", "2027-05-10", "2027-05-31", "2027-06-07", "2027-07-05", "2027-07-20", "2027-08-07", "2027-08-16", "2027-10-18", "2027-11-01", "2027-11-15", "2027-12-08", "2027-12-25"];
  var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  function cali() { var d = new Date(); return new Date(d.getTime() + (d.getTimezoneOffset() - 300) * 60000); }
  function clave(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function esFest(d) { return FEST.indexOf(clave(d)) > -1; }
  function turnos(d) { return esFest(d) ? H[0] : H[d.getDay()]; }
  function hora(m) { var h = Math.floor(m / 60), mi = m % 60, h12 = h % 12 || 12; return h12 + ":" + ("0" + mi).slice(-2) + " " + (h >= 12 ? "p. m." : "a. m."); }
  function corta(m) { return hora(m).replace(/:00/, ""); }
  function tramo(x) { var a = corta(x[0]), b = corta(x[1]); return ((x[0] >= 720) === (x[1] >= 720) ? a.replace(/ [ap]\. m\./, "") : a) + "–" + b; }
  function estadoTexto() {
    var n = cali(), m = n.getHours() * 60 + n.getMinutes(), t = turnos(n);
    for (var i = 0; i < t.length; i++) {
      if (m >= t[i][0] && m < t[i][1]) { var f = t[i][1] - m; return { c: f <= 45 ? "pronto" : "abierto", t: f <= 45 ? "Cierra pronto" : "Abierto ahora", s: "hasta las " + hora(t[i][1]) }; }
      if (m < t[i][0]) return { c: "cerrado", t: "Ahora cerrado", s: "abrimos hoy a las " + hora(t[i][0]) };
    }
    for (var k = 1; k < 8; k++) { var d = new Date(n); d.setDate(n.getDate() + k); var tt = turnos(d); if (tt.length) return { c: "cerrado", t: "Ahora cerrado", s: "abrimos " + (k === 1 ? "mañana" : "el " + DIAS[d.getDay()]) + " a las " + hora(tt[0][0]) }; }
    return { c: "cerrado", t: "Cerrado", s: "" };
  }
  function pintaEstado() {
    var e = estadoTexto();
    $$("[data-estado]").forEach(function (el) { el.className = el.className.replace(/\b(abierto|pronto|cerrado)\b/g, "").trim() + " " + e.c; var t = $(".est-txt", el); if (t) t.innerHTML = e.t + "<small>" + e.s + "</small>"; });
  }
  pintaEstado(); setInterval(pintaEstado, 60000);
  var sem = $("#semana");
  if (sem) {
    var hoy = cali().getDay(), html = "";
    [2, 3, 4, 5, 6, 0, 1].forEach(function (d) {
      var t = H[d], cls = (d === hoy ? "hoy " : "") + (t.length ? "" : "cerr");
      html += '<li class="' + cls + '"><span>' + DIAS[d] + (d === hoy ? " · hoy" : "") + "</span><span>" + (t.length ? t.map(function (x) { return "<i>" + tramo(x) + "</i>"; }).join("") : "Cerrado") + "</span></li>";
    });
    sem.innerHTML = html;
  }
  window.CP = { wa: wa, H: H, DIAS: DIAS, MESES: MESES, cali: cali, turnos: turnos, esFest: esFest, hora: hora, tramo: tramo, reduce: reduce };

  /* ---------- enlaces de WhatsApp ---------- */
  var wf = $("#wa-fija"); if (wf) wf.href = wa("¡Hola, Che Pasta! 🇮🇹 Vengo de su página web y tengo una pregunta:");
  $$("[data-wa]").forEach(function (a) { a.href = wa(a.getAttribute("data-wa")); a.target = "_blank"; a.rel = "noopener"; });

  /* ---------- navegación ---------- */
  var nav = $("#nav"), ultimoY = 0, oscura = document.body.classList.contains("con-heroe");
  function navScroll() {
    var y = scrollY;
    nav.classList.toggle("solida", !oscura || y > innerHeight * 0.5);
    nav.classList.toggle("oculta", y > ultimoY + 4 && y > innerHeight * 0.8 && !document.body.classList.contains("menu-abierto"));
    if (y < ultimoY - 4) nav.classList.remove("oculta");
    ultimoY = y;
  }
  addEventListener("scroll", navScroll, { passive: true }); navScroll();
  var mb = $("#menu-btn");
  if (mb) mb.onclick = function () { var ab = document.body.classList.toggle("menu-abierto"); mb.setAttribute("aria-expanded", ab); };
  addEventListener("keydown", function (e) { if (e.key === "Escape") document.body.classList.remove("menu-abierto"); });

  /* ---------- títulos que entran palabra por palabra ---------- */
  $$("[data-split]").forEach(function (h) {
    var i = 0;
    (function recorre(n) {
      Array.prototype.slice.call(n.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
            var o = document.createElement("span"); o.className = "pal"; var p = document.createElement("span"); p.textContent = w; p.style.transitionDelay = (i++ * 0.06) + "s"; o.appendChild(p); frag.appendChild(o);
          });
          n.replaceChild(frag, c);
        } else if (c.nodeType === 1) recorre(c);
      });
    })(h);
  });

  /* ---------- revelado al hacer scroll ---------- */
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("visto"); io.unobserve(e.target); } }); }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  $$(".rv,[data-split]").forEach(function (el) { io.observe(el); });

  /* ---------- tarjetas con inclinación 3D ---------- */
  if (!reduce && matchMedia("(hover:hover)").matches) {
    $$("[data-tilt]").forEach(function (el) {
      var f = parseFloat(el.getAttribute("data-tilt")) || 8;
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = "perspective(900px) rotateY(" + (x * f) + "deg) rotateX(" + (-y * f) + "deg) translateZ(0)";
        el.style.setProperty("--mx", (x + 0.5) * 100 + "%"); el.style.setProperty("--my", (y + 0.5) * 100 + "%");
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- pestañas genéricas ---------- */
  $$("[data-pestanas]").forEach(function (g) {
    var bs = $$("button[data-r]", g);
    bs.forEach(function (b) { b.onclick = function () { bs.forEach(function (x) { x.setAttribute("aria-selected", x === b); var p = document.getElementById(x.dataset.r); if (p) p.hidden = x !== b; }); }; });
  });

  /* ---------- transición entre páginas ---------- */
  var cortina = $("#cortina");
  if (cortina) {
    requestAnimationFrame(function () { document.body.classList.add("cargada"); });
    addEventListener("pageshow", function (e) { if (e.persisted) { document.body.classList.remove("saliendo"); document.body.classList.add("cargada"); } });
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a[href]"); if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey) return;
      var u = new URL(a.href, location.href);
      if (u.origin !== location.origin || !/\.html$|\/$/.test(u.pathname) || (u.pathname === location.pathname && u.hash)) return;
      if (reduce) return;
      e.preventDefault(); document.body.classList.remove("menu-abierto"); document.body.classList.add("saliendo");
      setTimeout(function () { location.href = u.href; }, 300);
    });
  }

  /* ---------- scroll suave ---------- */
  if (!reduce && window.Lenis && !document.body.hasAttribute("data-sin-lenis")) {
    var lenis = new window.Lenis({ lerp: 0.11, smoothWheel: true });
    window.CP.lenis = lenis;
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    if (window.ScrollTrigger) { lenis.on("scroll", window.ScrollTrigger.update); }
  }
})();
