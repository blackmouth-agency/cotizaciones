(function () {
  "use strict";
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var CP = window.CP;
  var PLATOS = ["spaghetti_napolitana", "tagliatelle_pesto", "raviolis_ragu", "pappardelle_marisco", "spaghetti_carbonara", "gnocchi_napolitana", "tagliatelle_alfredo", "spaghetti_albnap", "raviolis_alfredo", "pappardelle_ragu", "tagliatelle_amatriciana", "raviolis_pesto", "spaghetti_tinta", "gnocchi_pesto", "tagliatelle_ortolana", "pappardelle_alfcam", "spaghetti_puttanesca", "raviolis_napolitana", "tagliatelle_carbonara", "gnocchi_ragu"];
  var VASOS = ["limonada", "vino", "soda", "jugo", "agua", "limonada", "vino", "gaseosa"];
  var st = { n: 2, dia: null, hora: null, oc: "", nombre: "" };
  var mesa = $("#res-mesa");

  function pintaMesa() {
    var n = st.n, actuales = $$(".puesto", mesa);
    var grande = n > 8, R = grande ? 41 : 37;
    mesa.classList.toggle("grande", grande);
    for (var i = actuales.length; i < n; i++) {
      var p = document.createElement("div"); p.className = "puesto";
      p.innerHTML = '<img class="pl" src="img/plato2/s/' + PLATOS[i % PLATOS.length] + '.webp" alt=""><img class="vs" src="img/bebida_top/' + VASOS[i % VASOS.length] + '.webp" alt="">';
      mesa.appendChild(p); actuales.push(p);
    }
    actuales.forEach(function (p, i) {
      if (i >= n) { p.classList.add("sale"); setTimeout(function () { if (p.classList.contains("sale")) p.remove(); }, 400); return; }
      p.classList.remove("sale");
      var a = (i / n) * Math.PI * 2 - Math.PI / 2, x = 50 + Math.cos(a) * R, y = 50 + Math.sin(a) * R;
      p.style.left = x + "%"; p.style.top = y + "%"; p.style.setProperty("--rot", (a * 180 / Math.PI + 90) + "deg");
      p.style.setProperty("--tam", grande ? "15%" : n > 6 ? "18%" : "21%");
      p.style.transitionDelay = (i * 0.03) + "s";
    });
    $("#res-nota").textContent = n + (n === 1 ? " persona" : " personas") + (n > 12 ? " · para grupos grandes te ofrecemos el salón" : "");
  }
  function pintaCentro() {
    var c = $("#res-centro");
    c.dataset.oc = st.oc ? st.oc.split(" ").pop() : "";
    $("#res-nombre-cartel").textContent = st.nombre ? st.nombre : "para ti";
    $("#res-cuando-cartel").textContent = st.dia ? (diaTxt(st.dia) + (st.hora != null ? " · " + CP.hora(st.hora) : "")) : "Escoge el día";
  }
  function diaTxt(d) { var hoy = CP.cali(); var k = Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())) / 864e5); return k === 0 ? "Hoy" : k === 1 ? "Mañana" : CP.DIAS[d.getDay()].replace(/^\w/, function (c) { return c.toUpperCase(); }) + " " + d.getDate(); }

  // días
  var dias = $("#dias"), hoy = CP.cali();
  for (var k = 0; k < 10; k++) {
    var d = new Date(hoy); d.setDate(hoy.getDate() + k);
    var t = CP.turnos(d), b = document.createElement("button"); b.type = "button";
    b.innerHTML = "<small>" + (k === 0 ? "Hoy" : k === 1 ? "Mañana" : CP.DIAS[d.getDay()].slice(0, 3)) + "</small><b>" + d.getDate() + "</b>" + (CP.esFest(d) ? "<i>festivo</i>" : "");
    if (!t.length) { b.disabled = true; b.title = "Cerrado"; }
    (function (d, b) { b.onclick = function () { $$("button", dias).forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); st.dia = d; st.hora = null; pintaHoras(); pintaCentro(); }; })(d, b);
    dias.appendChild(b);
  }
  function pintaHoras() {
    var h = $("#horas"); h.innerHTML = "";
    var t = CP.turnos(st.dia), ahora = CP.cali(), esHoy = st.dia.toDateString() === ahora.toDateString(), m = ahora.getHours() * 60 + ahora.getMinutes();
    t.forEach(function (tr) {
      for (var x = tr[0]; x <= tr[1] - 60; x += 30) {
        if (esHoy && x < m + 60) continue;
        var b = document.createElement("button"); b.type = "button"; b.textContent = CP.hora(x).replace(" ", " ");
        (function (x, b) { b.onclick = function () { $$("button", h).forEach(function (y) { y.classList.remove("on"); }); b.classList.add("on"); st.hora = x; pintaCentro(); }; })(x, b);
        h.appendChild(b);
      }
    });
    if (!h.children.length) h.innerHTML = '<span class="chips-vacio">Ese día ya no quedan horas: prueba otro.</span>';
  }
  $("#menos").onclick = function () { st.n = Math.max(1, st.n - 1); $("#personas").textContent = st.n; pintaMesa(); };
  $("#mas").onclick = function () { st.n = Math.min(20, st.n + 1); $("#personas").textContent = st.n; pintaMesa(); };
  $$("#ocasion button").forEach(function (b) { b.onclick = function () { $$("#ocasion button").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on"); st.oc = b.dataset.o; pintaCentro(); }; });
  $("#res-nombre").addEventListener("input", function (e) { st.nombre = e.target.value.trim(); pintaCentro(); });
  $("#res-form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!st.dia) { $("#dias").classList.add("falta"); setTimeout(function () { $("#dias").classList.remove("falta"); }, 700); return; }
    var txt = "¡Hola, Che Pasta! 🇮🇹 Quiero reservar una mesa:\n\n👥 " + st.n + (st.n === 1 ? " persona" : " personas") + "\n📅 " + diaTxt(st.dia) + " (" + st.dia.getDate() + " de " + CP.MESES[st.dia.getMonth()] + ")" + (st.hora != null ? "\n🕐 " + CP.hora(st.hora) : "") + (st.oc ? "\n🎉 Es para " + st.oc : "") + (st.nombre ? "\n🙋 A nombre de " + st.nombre : "") + "\n\n¿Tienen disponibilidad?";
    window.open(CP.wa(txt), "_blank", "noopener");
  });
  pintaMesa(); pintaCentro();
})();
