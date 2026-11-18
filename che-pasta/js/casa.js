(function () {
  "use strict";
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var reduce = window.CP.reduce;

  /* tiempos de cocción orientativos (pasta fresca, desde congelada) */
  var PASTAS = [
    { k: "tagliatelle", n: "Tagliatelle", d: "Cintas medianas: las que más salsa agarran.", min: 3, f: "img/pasta/tagliatelle.webp" },
    { k: "spaghetti", n: "Spaghetti", d: "El clásico de siempre, fresco y suave.", min: 3, f: "img/pasta/spaghetti.webp" },
    { k: "pappardelle", n: "Pappardelle", d: "Cintas anchas para salsas de carne y ragú.", min: 4, f: "img/pasta/pappardelle.webp" },
    { k: "gnocchi", n: "Gnocchi", d: "De papa y harina. Están listos cuando suben a flote.", min: 3, f: "img/pasta/gnocchi.webp" },
    { k: "raviolis", n: "Raviolis", d: "Rellenos y cerrados a mano en la fábrica.", min: 5, f: "img/pasta/raviolis.webp",
      rel: [["carne", "De carne"], ["mixto", "Mixtos"], ["ricotta", "De ricotta"], ["cuatroquesos", "4 quesos"], ["sorrentina", "Sorrentina"], ["cordero", "De cordero"], ["portobello", "De portobello"], ["salmon", "De salmón"], ["jaiba", "De jaiba"]] }
  ];

  /* ---------- calculadora ---------- */
  var gente = 4, gramosP = 100;
  function g() { return gente * gramosP; }
  function pintaCalcu() {
    $("#gente").textContent = gente;
    $("#gramos").textContent = g() >= 1000 ? (g() / 1000).toLocaleString("es-CO", { maximumFractionDigits: 2 }) + " kg" : g() + " g";
    var n = $("#nidos"), html = "";
    for (var i = 0; i < gente; i++) html += '<i style="--i:' + i + '"></i>';
    if (n.childElementCount !== gente) n.innerHTML = html;
    $$(".prod-add span").forEach(function (s) { s.textContent = gente === 1 ? "para 1 persona" : "para " + gente + " personas"; });
  }
  $("#gente-menos").onclick = function () { gente = Math.max(1, gente - 1); pintaCalcu(); };
  $("#gente-mas").onclick = function () { gente = Math.min(20, gente + 1); pintaCalcu(); };
  $$(".calcu-hambre button").forEach(function (b) { b.onclick = function () { gramosP = +b.dataset.g; $$(".calcu-hambre button").forEach(function (x) { x.setAttribute("aria-checked", x === b); }); pintaCalcu(); }; });

  /* ---------- productos ---------- */
  var cont = $("#productos");
  PASTAS.forEach(function (p, i) {
    var a = document.createElement("article"); a.className = "prod rv"; a.style.setProperty("--d", (i * 0.06) + "s");
    a.innerHTML = '<div class="prod-img"><img src="' + p.f + '" alt="' + p.n + ' frescos" loading="lazy"></div>' +
      '<div class="prod-txt"><h3>' + p.n + '</h3><p>' + p.d + '</p><span class="prod-min">≈ ' + p.min + ' min en agua hirviendo</span>' +
      (p.rel ? '<label class="prod-rel">Relleno <select>' + p.rel.map(function (r) { return '<option value="' + r[0] + '">' + r[1] + '</option>'; }).join("") + '</select></label>' : "") +
      '<button type="button" class="btn btn-rojo prod-add">Agregar <span>para 4 personas</span></button></div>';
    a.querySelector(".prod-add").onclick = function (e) {
      var sel = a.querySelector("select"), rel = sel ? sel.options[sel.selectedIndex].text : "";
      var n = p.k === "raviolis" ? "Raviolis " + rel.toLowerCase() : p.n + " frescos";
      var d = "Para " + gente + (gente === 1 ? " persona" : " personas") + " (≈ " + $("#gramos").textContent + ")";
      window.PEDIDO.agregar({ id: "casa|" + p.k + "|" + rel + "|" + gente + "|" + gramosP, n: n, d: d, f: p.f, t: "casa" }, e.currentTarget);
    };
    cont.appendChild(a);
  });
  var rio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("visto"); rio.unobserve(e.target); } }); }, { threshold: 0.1 });
  $$("#productos .rv").forEach(function (el) { rio.observe(el); });
  pintaCalcu();

  /* ---------- temporizador ---------- */
  var elige = $("#cocina-elige"), actual = PASTAS[0], restante = actual.min * 60, total = restante, corre = null, fin = 0, bloqueo = null;
  PASTAS.forEach(function (p, i) {
    var b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "radio"); b.setAttribute("aria-checked", i === 0); b.textContent = p.n;
    b.onclick = function () { if (corre) return; actual = p; $$("button", elige).forEach(function (x) { x.setAttribute("aria-checked", x === b); }); reinicia(); };
    elige.appendChild(b);
  });
  var C = 2 * Math.PI * 54, ring = $("#reloj-avance"); ring.style.strokeDasharray = C;
  function mmss(s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
  function pinta() {
    $("#reloj-min").textContent = mmss(restante); $("#reloj-que").textContent = actual.n;
    ring.style.strokeDashoffset = C * (1 - restante / total);
  }
  function reinicia() { clearInterval(corre); corre = null; restante = total = actual.min * 60; $("#olla").classList.remove("hierve", "lista"); $("#reloj").classList.remove("lista"); $("#reloj-ir").textContent = "Empezar"; suelta(); pinta(); }
  function suena() {
    try {
      var A = new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.35, 0.7].forEach(function (t) { var o = A.createOscillator(), v = A.createGain(); o.frequency.value = 880; o.connect(v); v.connect(A.destination); v.gain.setValueAtTime(0.0001, A.currentTime + t); v.gain.exponentialRampToValueAtTime(0.3, A.currentTime + t + 0.02); v.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + t + 0.28); o.start(A.currentTime + t); o.stop(A.currentTime + t + 0.3); });
    } catch (e) {}
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  }
  function suelta() { if (bloqueo) { try { bloqueo.release(); } catch (e) {} bloqueo = null; } }
  $("#reloj-ir").onclick = function () {
    if (corre) { clearInterval(corre); corre = null; $("#reloj-ir").textContent = "Seguir"; $("#olla").classList.remove("hierve"); return; }
    if (restante <= 0) reinicia();
    fin = Date.now() + restante * 1000; $("#reloj-ir").textContent = "Pausar"; $("#olla").classList.add("hierve");
    try { if (navigator.wakeLock) navigator.wakeLock.request("screen").then(function (l) { bloqueo = l; }).catch(function () {}); } catch (e) {}
    corre = setInterval(function () {
      restante = (fin - Date.now()) / 1000; pinta();
      if (restante <= 0) {
        clearInterval(corre); corre = null; restante = 0; pinta(); suena(); suelta();
        $("#reloj-min").textContent = "¡Lista!"; $("#reloj-que").textContent = "Al dente: a la salsa";
        $("#olla").classList.remove("hierve"); $("#olla").classList.add("lista"); $("#reloj").classList.add("lista"); $("#reloj-ir").textContent = "Otra vez";
      }
    }, 250);
  };
  $("#reloj-reinicia").onclick = reinicia;
  pinta();
})();
