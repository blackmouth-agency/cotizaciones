/* Pedido compartido: la carta, el armador de pasta y la pasta para casa llenan la misma bolsa. */
(function () {
  "use strict";
  var CLAVE = "chepasta-pedido-v1";
  function $(s, r) { return (r || document).querySelector(s); }
  function leer() { try { return JSON.parse(localStorage.getItem(CLAVE)) || []; } catch (e) { return []; } }
  function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(items)); } catch (e) {} }
  var items = leer();
  var BOLSA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  /* ---------- interfaz ---------- */
  var fija = document.createElement("button");
  fija.type = "button"; fija.className = "bolsa-fija"; fija.id = "bolsa-fija"; fija.hidden = true;
  fija.innerHTML = BOLSA + '<span>Tu pedido</span><b id="bolsa-n">0</b>';
  document.body.appendChild(fija);

  var panel = document.createElement("div");
  panel.className = "pedido"; panel.id = "pedido"; panel.hidden = true;
  panel.setAttribute("role", "dialog"); panel.setAttribute("aria-modal", "true"); panel.setAttribute("aria-labelledby", "pedido-tit");
  panel.innerHTML =
    '<div class="pedido-fondo" data-cierra></div>' +
    '<div class="pedido-caja">' +
    '  <header class="pedido-cab"><h2 id="pedido-tit">Tu pedido</h2><button type="button" class="pedido-x" data-cierra aria-label="Cerrar">×</button></header>' +
    '  <div class="pedido-cuerpo">' +
    '    <ul class="pedido-lista" id="pedido-lista"></ul>' +
    '    <div class="pedido-vacio" id="pedido-vacio"><p>Tu pedido está vacío.</p><div class="pedido-vacio-links"><a href="carta.html">Ver la carta</a><a href="arma-tu-pasta.html">Armar mi pasta</a><a href="pasta-para-casa.html">Pasta para casa</a></div></div>' +
    '    <form class="pedido-form" id="pedido-form" autocomplete="on">' +
    '      <fieldset class="entrega"><legend>¿Cómo lo quieres?</legend>' +
    '        <label><input type="radio" name="entrega" value="dom" checked><span><b>A domicilio</b><small>Te lo llevamos</small></span></label>' +
    '        <label><input type="radio" name="entrega" value="rec"><span><b>Paso a recogerlo</b><small>Av. 5 Norte #42N-35</small></span></label>' +
    '      </fieldset>' +
    '      <label class="campo"><span>Tu nombre</span><input name="nombre" required autocomplete="name"></label>' +
    '      <div class="solo-dom"><label class="campo"><span>Dirección</span><input name="dir" autocomplete="street-address" placeholder="Calle, número, apto"></label>' +
    '      <label class="campo"><span>Barrio</span><input name="barrio" placeholder="Ej.: La Flora"></label></div>' +
    '      <label class="campo"><span>Notas <small>(opcional)</small></span><input name="notas" placeholder="Sin picante, timbre dañado…"></label>' +
    '      <p class="pedido-nota" id="pedido-nota"></p>' +
    '    </form>' +
    '  </div>' +
    '  <footer class="pedido-pie"><button type="submit" form="pedido-form" class="btn btn-wa ancho" id="pedido-enviar">' +
    '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm6.4 18.3c-.3.8-1.6 1.5-2.6 1.6-.7.1-1.6.1-4.5-1-3.8-1.6-6.2-5.4-6.4-5.7-.2-.3-1.5-2-1.5-3.9s1-2.8 1.3-3.2c.3-.4.8-.5 1-.5h.8c.2 0 .6 0 .9.7l1.2 2.8c.1.3.2.6 0 .9l-.6.8c-.2.2-.4.5-.2.9.6 1 1.3 1.9 2.2 2.7 1.1.9 2 1.3 2.4 1.5.3.1.6.1.8-.1l1-1.2c.3-.3.5-.3.9-.2l2.6 1.3c.4.2.6.3.7.4.1.3.1 1-.2 1.8z"/></svg>Enviar pedido por WhatsApp</button>' +
    '<p>El valor del pedido y del domicilio te lo confirmamos por WhatsApp.</p></footer>' +
    '</div>';
  document.body.appendChild(panel);

  var aviso = document.createElement("div"); aviso.className = "pedido-aviso"; aviso.setAttribute("role", "status"); document.body.appendChild(aviso);
  var tAviso;
  function avisar(t) { aviso.textContent = t; aviso.classList.add("on"); clearTimeout(tAviso); tAviso = setTimeout(function () { aviso.classList.remove("on"); }, 2600); }

  function total() { return items.reduce(function (s, it) { return s + it.c; }, 0); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function pintar() {
    var n = total();
    fija.hidden = !n; $("#bolsa-n").textContent = n;
    var nb = document.getElementById("nav-pedido"); if (nb) { nb.hidden = !n; var b = nb.querySelector("b"); if (b) b.textContent = n; }
    $("#pedido-lista").innerHTML = items.map(function (it, i) {
      return '<li><span class="pi-foto">' + (it.f ? '<img src="' + esc(it.f) + '" alt="" loading="lazy">' : '<i>' + (it.t === "casa" ? "❄" : "🍽") + '</i>') + '</span>' +
        '<span class="pi-txt"><b>' + esc(it.n) + '</b>' + (it.d ? '<small>' + esc(it.d) + '</small>' : "") + (it.t === "casa" ? '<em>Para cocinar en casa</em>' : "") + '</span>' +
        '<span class="pi-cant"><button type="button" data-i="' + i + '" data-d="-1" aria-label="Uno menos">−</button><b>' + it.c + '</b><button type="button" data-i="' + i + '" data-d="1" aria-label="Uno más">+</button></span></li>';
    }).join("");
    $("#pedido-vacio").hidden = !!n; $("#pedido-form").hidden = !n; $("#pedido-enviar").disabled = !n;
    var e = window.CP && document.querySelector("[data-estado]");
    var nota = $("#pedido-nota"), cerrado = e && /\bcerrado\b/.test(e.className);
    nota.textContent = cerrado ? "Ahora estamos cerrados: tu pedido llega a nuestro WhatsApp y te respondemos apenas abramos." : "";
    nota.hidden = !cerrado;
  }
  $("#pedido-lista").addEventListener("click", function (ev) {
    var b = ev.target.closest("button[data-i]"); if (!b) return;
    var it = items[+b.dataset.i]; it.c += +b.dataset.d;
    if (it.c <= 0) items.splice(+b.dataset.i, 1);
    guardar(); pintar();
  });
  function entrega() { var r = panel.querySelector("input[name=entrega]:checked"); return r ? r.value : "dom"; }
  panel.addEventListener("change", function (e) {
    if (e.target.name !== "entrega") return;
    var dom = entrega() === "dom";
    panel.querySelector(".solo-dom").hidden = !dom;
    panel.querySelector("input[name=dir]").required = dom; panel.querySelector("input[name=barrio]").required = dom;
  });
  panel.querySelector("input[name=dir]").required = true; panel.querySelector("input[name=barrio]").required = true;

  var ultimoFoco = null;
  function abrir() {
    ultimoFoco = document.activeElement;
    pintar(); panel.hidden = false; document.body.classList.add("pedido-abierto");
    requestAnimationFrame(function () { panel.classList.add("on"); });
    setTimeout(function () { var x = panel.querySelector(".pedido-x"); x && x.focus({ preventScroll: true }); }, 50);
  }
  function cerrar() {
    panel.classList.remove("on"); document.body.classList.remove("pedido-abierto");
    setTimeout(function () { panel.hidden = true; }, 380);
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus({ preventScroll: true });
  }
  panel.addEventListener("click", function (e) { if (e.target.closest("[data-cierra]")) cerrar(); });
  addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) cerrar(); });
  fija.onclick = abrir;
  document.addEventListener("click", function (e) { var a = e.target.closest("[data-abre-pedido]"); if (a) { e.preventDefault(); abrir(); } });

  $("#pedido-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target, dom = entrega() === "dom";
    var lineas = items.map(function (it) { return "• " + it.c + " × " + it.n + (it.d ? " (" + it.d + ")" : "") + (it.t === "casa" ? " — para cocinar en casa" : ""); });
    var txt = "¡Hola, Che Pasta! 🇮🇹 Quiero hacer un pedido " + (dom ? "a domicilio" : "para recoger en el restaurante") + ":\n\n" + lineas.join("\n") +
      "\n\n👤 " + f.nombre.value.trim() + (dom ? "\n📍 " + f.dir.value.trim() + ", barrio " + f.barrio.value.trim() : "") +
      (f.notas.value.trim() ? "\n📝 " + f.notas.value.trim() : "") +
      "\n\n" + (dom ? "¿Cuánto sería con el domicilio?" : "¿Cuánto sería y a qué hora lo puedo recoger?");
    window.open(window.CP.wa(txt), "_blank", "noopener");
    items = []; guardar(); pintar(); cerrar();
    avisar("¡Listo! Termina de enviarlo en WhatsApp");
  });

  /* vuela una miniatura desde el botón hasta la bolsa */
  function volar(desde, foto) {
    if (!desde || (window.CP && window.CP.reduce)) return;
    var r = desde.getBoundingClientRect(), dest = (fija.hidden ? null : fija.getBoundingClientRect());
    var nb = document.getElementById("nav-pedido");
    if (nb && !nb.hidden && nb.getBoundingClientRect().width && !document.getElementById("nav").classList.contains("oculta")) dest = nb.getBoundingClientRect();
    if (!dest) dest = { left: 30, top: innerHeight - 60, width: 40, height: 40 };
    var el = document.createElement(foto ? "img" : "span"); el.className = "vuela-bolsa"; if (foto) el.src = foto;
    var x0 = r.left + r.width / 2 - 30, y0 = r.top + r.height / 2 - 30, x1 = dest.left + dest.width / 2 - 30, y1 = dest.top + dest.height / 2 - 30;
    el.style.left = x0 + "px"; el.style.top = y0 + "px"; document.body.appendChild(el);
    el.animate([{ transform: "translate(0,0) scale(1)", opacity: 1 }, { transform: "translate(" + (x1 - x0) * 0.5 + "px," + ((y1 - y0) * 0.5 - 90) + "px) scale(.8)", opacity: 1, offset: 0.5 }, { transform: "translate(" + (x1 - x0) + "px," + (y1 - y0) + "px) scale(.3)", opacity: 0.2 }], { duration: 750, easing: "cubic-bezier(.4,0,.2,1)" }).onfinish = function () { el.remove(); fija.classList.remove("late"); void fija.offsetWidth; fija.classList.add("late"); };
  }

  window.PEDIDO = {
    agregar: function (it, desde) {
      var c = it.c || 1, ya = items.filter(function (x) { return x.id === it.id; })[0];
      if (ya) ya.c += c; else items.push({ id: it.id, n: it.n, d: it.d || "", f: it.f || "", t: it.t || "carta", c: c });
      guardar(); pintar(); volar(desde, it.f);
      avisar("Agregado: " + it.n + (it.d ? " · " + it.d : ""));
    },
    abrir: abrir, total: total
  };
  addEventListener("storage", function (e) { if (e.key === CLAVE) { items = leer(); pintar(); } });
  addEventListener("pageshow", function () { items = leer(); pintar(); });
  pintar();
})();
