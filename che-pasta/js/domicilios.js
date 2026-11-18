(function () {
  "use strict";
  var C = window.Cocina, clamp = C.clamp, eOut = C.eOut;
  var WA = "573188752637";
  function wa(t) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(t); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var movil = function () { return innerWidth <= 900; };
  function seg(v, a, b) { return clamp((v - a) / (b - a), 0, 1); }
  function eIO(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  /* =================== DOMICILIOS =================== */
  var logo = new Image(); logo.src = "img/logo.webp"; C.setLogo(logo);
  var dom = $("#domicilios"), pin = $(".dom-pin", dom), intro = $("#intro"), caja = $("#caja"), tapaw = $("#tapaw");
  var estP = $(".est-pasta"), estS = $(".est-salsa"), estM = $(".est-mas"), comanda = $("#comanda"), mtabs = $("#mtabs"), mPed = $("#m-pedido");
  var cvPlato = $("#plato"), nombreEl = $("#plato-nombre");

  /* mesa de madera con harina */
  function pintaMesa() {
    var w = movil() ? 900 : 1600, h = movil() ? 1600 : 1000, cv = document.createElement("canvas");
    cv.width = w; cv.height = h;
    var ctx = cv.getContext("2d"), r = C.rng(31);
    var g = ctx.createLinearGradient(0, 0, w, h); g.addColorStop(0, "#C9965F"); g.addColorStop(0.5, "#BC8952"); g.addColorStop(1, "#A97644");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    var tabla = movil() ? 225 : 250;
    for (var x0 = 0; x0 < w; x0 += tabla) {
      ctx.fillStyle = "rgba(" + (r() < 0.5 ? "255,220,170" : "90,50,20") + "," + (0.03 + r() * 0.05) + ")"; ctx.fillRect(x0, 0, tabla, h);
      for (var i = 0; i < 70; i++) {
        var x = x0 + r() * tabla, amp = 2 + r() * 6, fr = 0.004 + r() * 0.01, ph = r() * 6;
        ctx.strokeStyle = r() < 0.6 ? "rgba(95,55,22," + (0.05 + r() * 0.12) + ")" : "rgba(240,200,150," + (0.05 + r() * 0.1) + ")";
        ctx.lineWidth = 0.5 + r() * 2.2; ctx.beginPath();
        for (var y = 0; y <= h; y += 20) { var xx = x + Math.sin(y * fr + ph) * amp; if (y === 0) ctx.moveTo(xx, y); else ctx.lineTo(xx, y); }
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(50,25,8,.45)"; ctx.fillRect(x0, 0, 2, h);
      ctx.fillStyle = "rgba(255,230,190,.18)"; ctx.fillRect(x0 + 2, 0, 1, h);
    }
    for (var k = 0; k < 5; k++) {
      var kx = r() * w, ky = r() * h;
      for (var j = 6; j > 0; j--) { ctx.strokeStyle = "rgba(90,50,20," + (0.06 + j * 0.02) + ")"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(kx, ky, j * 4, j * 9, 0, 0, Math.PI * 2); ctx.stroke(); }
    }
    for (var n = 0; n < 7; n++) {
      var fx = r() * w, fy = r() * h, fr2 = 80 + r() * 200;
      var fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, fr2); fg.addColorStop(0, "rgba(255,252,245,.42)"); fg.addColorStop(1, "rgba(255,252,245,0)");
      ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(fx, fy, fr2, 0, Math.PI * 2); ctx.fill();
      for (var q = 0; q < 500; q++) { var a = r() * Math.PI * 2, d = fr2 * Math.pow(r(), 0.7); ctx.fillStyle = "rgba(255,255,255," + (0.3 + r() * 0.6) + ")"; ctx.fillRect(fx + Math.cos(a) * d, fy + Math.sin(a) * d, 1 + r() * 1.6, 1 + r() * 1.6); }
    }
    $("#mesa").style.backgroundImage = "url(" + cv.toDataURL("image/jpeg", 0.82) + ")";
  }

  /* datos de postres y bebidas (carta vigente en Menüpp) */
  var POSTRES = [
    { k: "raviolichoc", c: "Raviolis de chocolate", n: "Raviolis de chocolate con helado" },
    { k: "torta", c: "Torta de chocolate", n: "Torta de chocolate con helado" },
    { k: "tiramisu", c: "Tiramisú", n: "Tiramisú" },
    { k: "pannacotta", c: "Panna cotta", n: "Panna cotta" },
    { k: "affogato", c: "Affogato", n: "Affogato all'amaretto" }
  ];
  var BEBIDAS = [
    { k: "soda", c: "Soda italiana", t: "¿De qué sabor?", ops: [["Cherry", "Soda italiana de cherry"], ["Curazao", "Soda italiana de curazao"], ["Manzana verde", "Soda italiana de manzana verde"], ["Maracuyá", "Soda italiana de maracuyá"], ["Frutos rojos", "Soda italiana de frutos rojos"], ["Fresa", "Soda italiana de fresa"]] },
    { k: "limonada", c: "Limonada", t: "¿Cuál limonada?", ops: [["Cerezada", "Limonada cerezada"], ["De coco", "Limonada de coco"], ["De yerbabuena", "Limonada de yerbabuena"], ["Natural", "Limonada natural"]] },
    { k: "jugo", c: "Jugo natural", t: "¿De qué fruta?", ops: [["Maracuyá", "Jugo de maracuyá"], ["Mango", "Jugo de mango"], ["Lulo", "Jugo de lulo"], ["Frutos rojos", "Jugo de frutos rojos"], ["Guanábana", "Jugo de guanábana"]], t2: "¿En agua o en leche?", ops2: [["En agua", "en agua"], ["En leche", "en leche"]] },
    { k: "gaseosa", c: "Gaseosa", t: "¿Cuál gaseosa?", ops: [["Coca-Cola", "Coca-Cola"], ["Bretaña", "Bretaña"], ["Premio", "Premio"], ["Ginger Ale", "Ginger Ale"]] },
    { k: "agua", c: "Agua", t: "¿Cómo la quieres?", ops: [["Natural", "Agua natural"], ["Con gas", "Agua con gas"]] },
    { k: "vino", c: "Tinto de la casa", t: "¿Cuánto vino?", ops: [["¼ de litro", "Tinto de la casa (¼ de litro)"], ["½ litro", "Tinto de la casa (½ litro)"]] }
  ];
  var EXTRAS = [
    { k: "trufa", c: "Trufa", n: "trufa" },
    { k: "masPasta", c: "Más pasta", n: "porción extra de pasta" },
    { k: "masSalsa", c: "Más salsa", n: "porción extra de salsa" }
  ];
  var ORDEN_P = ["spaghetti", "tagliatelle", "pappardelle", "gnocchi", "raviolis"];
  var ORDEN_R = ["carne", "mixto", "ricotta", "cuatroquesos", "sorrentina", "cordero", "portobello", "salmon", "jaiba"];
  var TODAS = ["napolitana", "alfredo", "ragu", "carbonara", "blanca", "amatriciana", "pesto", "ortolana", "puttanesca", "albnap", "albragu", "alfcam", "marisco", "tinta", "marymonte", "nueces", "casa", "tomatefresco", "mariscoNap"];
  var S = 140;

  /* fotos disponibles (las que faltan se dibujan) */
  var F = window.FOTOS || {};
  function tiene(grupo, k) { return F[grupo] && F[grupo].indexOf(k) > -1; }
  function rutaSalsa(k) { return k === "mariscoNap" ? "marisco" : k === "casa" ? "napolitana" : k; }
  function icoImg(src, cls) { var im = new Image(); im.src = src; im.alt = ""; im.className = "ico" + (cls ? " " + cls : ""); im.decoding = "async"; im.setAttribute("aria-hidden", "true"); return im; }
  function icono(grupo, k, tam) {
    if (grupo === "salsa" && tiene("salsa", rutaSalsa(k))) {
      var o = document.createElement("span"); o.className = "olla ico"; o.appendChild(icoImg("img/olla/" + rutaSalsa(k) + ".webp")); return o;
    }
    if (grupo === "extra" && k === "masSalsa" && tiene("extra", k)) { var o2 = document.createElement("span"); o2.className = "olla ico"; o2.appendChild(icoImg("img/extra/masSalsa.webp")); return o2; }
    if (grupo === "extra" && k === "trufa" && tiene("extra", "salsera_trufa")) return icoImg("img/extra/salsera_trufa.webp");
    if (grupo === "extra" && k === "masPasta") return icoImg("img/plato2/p_tagliatelle.webp");
    if (grupo !== "salsa" && tiene(grupo, k)) return icoImg("img/" + grupo + "/" + k + ".webp");
    var cv = document.createElement("canvas"); cv.className = "ico"; cv.setAttribute("aria-hidden", "true");
    if (grupo === "pasta") C.iconoPasta(cv, k, tam); else if (grupo === "salsa") C.iconoOlla(cv, k, tam);
    else if (grupo === "extra") C.iconoExtra(cv, k, tam); else if (grupo === "postre") C.iconoPostre(cv, k, tam); else C.iconoBebida(cv, k, tam);
    return cv;
  }
  function item(cont, k, etiqueta, grupo, onclick) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "item"; b.dataset.k = k;
    b.appendChild(icono(grupo, k, S));
    var s = document.createElement("span"); s.className = "nom"; s.textContent = etiqueta; b.appendChild(s);
    b.setAttribute("aria-label", etiqueta);
    b.addEventListener("click", function () { onclick(k, b); });
    cont.appendChild(b);
    return b;
  }
  var bP = {}, bS = {}, bE = {}, bPo = {}, bB = {};
  ORDEN_P.forEach(function (k) { bP[k] = item($("#items-pasta"), k, C.PASTAS[k].n, "pasta", elegirPasta); });
  var sello = document.createElement("div"); sello.className = "item-sello"; sello.innerHTML = "Pasta fresca<br>de fábrica"; sello.setAttribute("aria-hidden", "true");
  $("#items-pasta").appendChild(sello);
  TODAS.forEach(function (k) { bS[k] = item($("#items-salsa"), k, C.SALSAS[k].n, "salsa", elegirSalsa); });
  EXTRAS.forEach(function (x) { bE[x.k] = item($("#items-extras"), x.k, x.c, "extra", elegirExtra); });
  POSTRES.forEach(function (x) { bPo[x.k] = item($("#items-postres"), x.k, x.c, "postre", elegirPostre); });
  BEBIDAS.forEach(function (x) { bB[x.k] = item($("#items-bebidas"), x.k, x.c, "bebida", elegirBebida); });
  function ico(btn) { return btn.querySelector(".ico"); }

  /* ---------- estado del pedido ---------- */
  var semilla = 1;
  function nuevoPlato() { return { pasta: null, relleno: null, salsa: null, trufa: false, masPasta: false, masSalsa: false, semilla: semilla++ }; }
  var plato = nuevoPlato(), listos = [], otros = [];
  var anim = { pasta: 1, salsa: 1, trufa: 1 };
  var eVacio = $(".e-vacio", cvPlato), eBase = $(".e-base", cvPlato), eSalsa = $(".e-salsa", cvPlato), eTrufa = $(".e-trufa", cvPlato);
  var LAMINAS = [[0.43, 0.37, 20], [0.55, 0.45, 120], [0.45, 0.56, 250], [0.36, 0.48, 60], [0.53, 0.33, 200]];

  function tamPlato() {
    var h = caja.clientHeight, w = caja.clientWidth * 0.6, s = Math.max(40, Math.min(w, h));
    cvPlato.style.width = s + "px"; cvPlato.style.height = s + "px";
    caja.style.setProperty("--p", s + "px");
  }
  function srcSalsa(p) { return "img/plato2/" + p.pasta + "_" + rutaSalsa(p.salsa) + ".webp"; }
  function dibujar() {
    eVacio.hidden = false;
    if (plato.pasta) { var sb = "img/plato2/p_" + plato.pasta + ".webp"; if (eBase.getAttribute("src") !== sb) eBase.src = sb; eBase.hidden = false; }
    else eBase.hidden = true;
    if (plato.salsa && plato.pasta) { var ss = srcSalsa(plato); if (eSalsa.getAttribute("src") !== ss) eSalsa.src = ss; eSalsa.hidden = false; }
    else eSalsa.hidden = true;
    var sal = $("#salseras"), quiero = [];
    if (plato.pasta && plato.trufa) quiero.push("trufa");
    if (plato.pasta && plato.salsa && plato.masSalsa) quiero.push("salsa:" + rutaSalsa(plato.salsa));
    if (sal.dataset.k !== quiero.join("|")) {
      sal.dataset.k = quiero.join("|"); sal.innerHTML = "";
      quiero.forEach(function (q) {
        var d = document.createElement("div"); d.className = "salsera"; d.dataset.q = q.split(":")[0];
        if (q === "trufa") d.innerHTML = '<img src="img/extra/salsera_trufa.webp" alt="">';
        else d.innerHTML = '<img src="img/extra/salsera.webp" alt=""><img class="dentro" src="img/olla/' + q.split(":")[1] + '.webp" alt="">';
        sal.appendChild(d);
      });
    }
  }
  function DEC(el) { return el.decode ? el.decode().catch(function () {}) : Promise.resolve(); }
  function tween(prop, dur, desde) {
    dibujar();
    if (reduce) return Promise.resolve();
    var el = prop === "pasta" ? eBase : prop === "salsa" ? (desde ? ($(".salsera[data-q=salsa]") || eSalsa) : eSalsa) : ($(".salsera[data-q=trufa]") || eTrufa);
    return (el.tagName === "IMG" ? DEC(el) : Promise.resolve()).then(function () {
      var a;
      if (prop === "pasta" && !desde) a = el.animate([{ opacity: 0, transform: "scale(1.16) rotate(-40deg)" }, { opacity: 1, transform: "none" }], { duration: dur, easing: "cubic-bezier(.2,.8,.2,1)" });
      else if (prop === "salsa" && !desde) a = el.animate([{ clipPath: "circle(0% at 50% 47%)" }, { clipPath: "circle(18% at 50% 47%)", offset: 0.25 }, { clipPath: "circle(75% at 50% 47%)" }], { duration: dur, easing: "cubic-bezier(.3,.7,.3,1)" });
      else if (prop === "trufa") a = el.animate([{ opacity: 0, transform: "scale(1.25)" }, { opacity: 1, transform: "none" }], { duration: dur, easing: "cubic-bezier(.3,1.4,.5,1)" });
      else a = el.animate([{ transform: "scale(1)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }], { duration: dur, easing: "ease-in-out" });
      return a.finished.catch(function () {});
    });
  }
  function capturaPlato() {
    var r = cvPlato.getBoundingClientRect(), n = Math.round(Math.min(900, r.width * 2)), c = document.createElement("canvas");
    c.width = c.height = n; var x = c.getContext("2d");
    [eVacio, eBase, eSalsa].forEach(function (im) { if (!im.hidden && im.complete && im.naturalWidth) x.drawImage(im, 0, 0, n, n); });
    return c;
  }

  /* ---------- vuelos ---------- */
  function centro(r) { return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
  function volar(srcCv, desde, hasta, op) {
    op = op || {};
    return new Promise(function (res) {
      if (reduce) { res(); return; }
      var w = desde.width, h = desde.height, el = document.createElement("canvas");
      var fuente = srcCv.tagName === "SPAN" ? srcCv.querySelector("img") : srcCv;
      el.className = "fly"; el.width = fuente.naturalWidth || fuente.width || 200; el.height = fuente.naturalHeight || fuente.height || 200;
      try { el.getContext("2d").drawImage(fuente, 0, 0, el.width, el.height); } catch (e) {}
      if (srcCv.tagName === "SPAN") el.style.borderRadius = "50%";
      el.style.width = w + "px"; el.style.height = h + "px"; el.style.left = "0px"; el.style.top = "0px";
      document.body.appendChild(el);
      var a = centro(desde), b = centro(hasta), c = { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - (op.alto || 140) };
      var dur = op.dur || 720, esc = op.escala || 0.6, giro = op.giro || 0, t0 = performance.now();
      (function paso(now) {
        var t = clamp((now - t0) / dur, 0, 1), e = eIO(t), u = 1 - e;
        var x = u * u * a.x + 2 * u * e * c.x + e * e * b.x, y = u * u * a.y + 2 * u * e * c.y + e * e * b.y;
        var s = 1 + (esc - 1) * e + Math.sin(t * Math.PI) * 0.18;
        el.style.transform = "translate(" + (x - w / 2) + "px," + (y - h / 2) + "px) scale(" + s + ") rotate(" + giro * e + "deg)";
        el.style.opacity = t > 0.88 ? (1 - (t - 0.88) / 0.12) : 1;
        if (t < 1) requestAnimationFrame(paso); else { el.remove(); res(); }
      })(t0);
    });
  }
  function cucharon(desdeRect, salsaK) {
    return new Promise(function (res) {
      var sal = C.SALSAS[salsaK];
      var pr = cvPlato.getBoundingClientRect(), W = pr.width * 0.78, Hh = W * 0.4;
      var NS = "http://www.w3.org/2000/svg", svg = document.createElementNS(NS, "svg");
      svg.setAttribute("viewBox", "0 0 200 80"); svg.setAttribute("class", "cucharon");
      svg.innerHTML = '<defs><linearGradient id="ac" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4F6F7"/><stop offset=".5" stop-color="#AEB5BA"/><stop offset="1" stop-color="#6F777D"/></linearGradient></defs>' +
        '<ellipse cx="38" cy="46" rx="32" ry="30" fill="rgba(30,10,0,.25)"/>' +
        '<rect x="58" y="34" width="138" height="12" rx="6" fill="url(#ac)"/><circle cx="188" cy="40" r="7" fill="#7E868C"/>' +
        '<circle cx="36" cy="40" r="32" fill="url(#ac)"/><circle cx="36" cy="40" r="26" fill="#5D6469"/>' +
        '<clipPath id="clc"><circle class="sal" cx="36" cy="40" r="24"/></clipPath><circle cx="36" cy="40" r="24" fill="' + sal.c[1] + '" clip-path="url(#clc)"/>' + (tiene("salsa", rutaSalsa(salsaK)) ? '<image href="img/olla/' + rutaSalsa(salsaK) + '.webp" x="12" y="16" width="48" height="48" clip-path="url(#clc)"/>' : '') + '<circle class="sal2" cx="30" cy="34" r="0"/>';
      svg.style.width = W + "px"; svg.style.height = Hh + "px"; svg.style.left = "0px"; svg.style.top = "0px";
      document.body.appendChild(svg);
      var bx = 36 / 200 * W, by = Hh / 2;
      var a = centro(desdeRect), b = { x: pr.left + pr.width * 0.5, y: pr.top + pr.height * 0.42 }, c = { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - 120 };
      var salC = svg.querySelector(".sal"), sal2 = svg.querySelector(".sal2");
      var t0 = performance.now(), T1 = 560, T2 = 1050, T3 = 480, sirvio = false;
      function pon(x, y, rot, sy, op) {
        svg.style.transform = "translate(" + (x - bx) + "px," + (y - by) + "px) rotate(" + rot + "deg) scaleY(" + sy + ")";
        svg.style.opacity = op;
      }
      (function paso(now) {
        var t = now - t0;
        if (t < T1) {
          var e = eIO(t / T1), u = 1 - e;
          pon(u * u * a.x + 2 * u * e * c.x + e * e * b.x, u * u * a.y + 2 * u * e * c.y + e * e * b.y, -25 * e, 1, 1);
        } else if (t < T1 + T2) {
          var p = (t - T1) / T2;
          if (!sirvio) { sirvio = true; plato.salsa = salsaK; tween("salsa", 1250).then(function () { if (!sirvio) return; }); res(); }
          var tilt = Math.sin(Math.min(1, p * 1.6) * Math.PI / 2);
          var wob = Math.sin(p * Math.PI * 4) * 6 * (1 - p);
          pon(b.x + wob, b.y + Math.sin(p * Math.PI * 2) * 4, -25 - 30 * tilt, 1 - 0.45 * tilt, 1);
          salC.setAttribute("r", 24 * (1 - eOut(p)) + 0.5);
        } else if (t < T1 + T2 + T3) {
          var q = eIO((t - T1 - T2) / T3);
          pon(b.x + (a.x - b.x) * q, b.y + (a.y - b.y) * q - Math.sin(q * Math.PI) * 80, -55 * (1 - q), 0.55 + 0.45 * q, 1 - q);
        } else { svg.remove(); return; }
        requestAnimationFrame(paso);
      })(t0);
    });
  }


  /* ---------- ¿sabías que…? al servir una salsa con historia ---------- */
  var ORIGEN_SALSA = { pesto: "genova", carbonara: "roma", alfredo: "trevi", alfcam: "trevi", amatriciana: "amatrice", ragu: "bolonia", albragu: "bolonia", napolitana: "napoles", albnap: "napoles", puttanesca: "napoles", tomatefresco: "napoles", tinta: "venecia" };
  var yaVisto = {}, tSab;
  function sabias(k) {
    var lugar = ORIGEN_SALSA[k], D = window.ITALIA || [];
    var p = D.filter(function (x) { return x.k === lugar; })[0];
    if (!p || yaVisto[lugar]) return; yaVisto[lugar] = 1;
    var c = $("#sabias-dom"); if (!c) { c = document.createElement("aside"); c.id = "sabias-dom"; c.className = "sabias-dom"; document.body.appendChild(c); }
    c.innerHTML = '<button type="button" aria-label="Cerrar">×</button><b>¿Sabías que…? · ' + p.ciudad + '</b><p>' + p.dato + '</p><a href="italia.html#' + p.k + '">Leer la historia de este plato →</a>';
    c.querySelector("button").onclick = function () { c.classList.remove("on"); };
    requestAnimationFrame(function () { c.classList.add("on"); });
    clearTimeout(tSab); tSab = setTimeout(function () { c.classList.remove("on"); }, 9000);
  }
  /* ---------- aviso y popover ---------- */
  var tAviso;
  function aviso(txt) { var a = $("#aviso"); a.textContent = txt; a.classList.add("on"); clearTimeout(tAviso); tAviso = setTimeout(function () { a.classList.remove("on"); }, 2600); }
  function sacude(el) { el.classList.remove("sacude"); void el.offsetWidth; el.classList.add("sacude"); }
  var popRes = null;
  function popover(anchor, titulo, ops) {
    return new Promise(function (res) {
      var p = $("#pop"), r = anchor.getBoundingClientRect();
      $("#pop-tit").textContent = titulo;
      var box = $("#pop-ops"); box.innerHTML = "";
      ops.forEach(function (o) {
        var b = document.createElement("button"); b.type = "button"; b.textContent = o[0];
        b.onclick = function (ev) { ev.stopPropagation(); cerrarPop(); res(o); };
        box.appendChild(b);
      });
      p.hidden = false;
      var pw = p.offsetWidth, ph = p.offsetHeight;
      var x = clamp(r.left + r.width / 2 - pw / 2, 12, innerWidth - pw - 12);
      var y = r.top - ph - 10; if (y < 70) y = Math.min(innerHeight - ph - 12, r.bottom + 10);
      p.style.left = x + "px"; p.style.top = y + "px";
      popRes = function () { res(null); };
      setTimeout(function () { box.firstChild && box.firstChild.focus({ preventScroll: true }); }, 30);
    });
  }
  function cerrarPop() { $("#pop").hidden = true; popRes = null; }
  document.addEventListener("click", function (e) { if (popRes && !$("#pop").contains(e.target)) { var f = popRes; cerrarPop(); f(); } }, true);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { if (popRes) { var f = popRes; cerrarPop(); f(); } cerrarHoja(); } });

  /* ---------- acciones ---------- */
  var ocupado = false;
  function elegirPasta(k, btn) {
    if (ocupado) return;
    var paso = k === "raviolis" ? popover(btn, "¿Raviolis de qué?", ORDEN_R.map(function (r) { return [C.RELLENOS[r].replace(/^de /, "").replace(/^\w/, function (c) { return c.toUpperCase(); }), r]; })) : Promise.resolve([null, null]);
    paso.then(function (o) {
      if (!o) return;
      var rel = o[1];
      if (plato.pasta === k && plato.relleno === rel) { aviso("Ya está en tu plato"); return; }
      ocupado = true;
      volar(ico(btn), ico(btn).getBoundingClientRect(), cvPlato.getBoundingClientRect(), { escala: 1.4, giro: 160, dur: 700 }).then(function () {
        plato.pasta = k; plato.relleno = rel;
        var disp = C.salsasPara(k, rel);
        if (plato.salsa && disp.indexOf(plato.salsa) < 0) { aviso("La salsa " + C.SALSAS[plato.salsa].n + " no va con esta pasta: escoge otra"); plato.salsa = null; plato.masSalsa = false; }
        refrescar();
        ocupado = false;
        if (movil() && !plato.salsa) setTimeout(function () { verPanel("salsa"); }, 500);
        return tween("pasta", 950);
      });
    });
  }
  function elegirSalsa(k, btn) {
    if (ocupado) return;
    if (!plato.pasta) { aviso("Primero escoge tu pasta"); sacude(estP); if (movil()) verPanel("pasta"); return; }
    if (C.salsasPara(plato.pasta, plato.relleno).indexOf(k) < 0) { aviso("Esa salsa no va con esta pasta"); return; }
    if (plato.salsa === k) { aviso("Tu plato ya tiene salsa " + C.SALSAS[k].n); return; }
    ocupado = true;
    plato.salsa = null; anim.salsa = 0; dibujar();
    cucharon(ico(btn).getBoundingClientRect(), k).then(function () {
      refrescar(); sabias(k);
      setTimeout(function () { ocupado = false; if (movil()) verPanel("extras"); }, 900);
    });
  }
  function elegirExtra(k, btn) {
    if (ocupado) return;
    if (!plato.pasta) { aviso("Primero escoge tu pasta"); sacude(estP); if (movil()) verPanel("pasta"); return; }
    if (k === "masSalsa" && !plato.salsa) { aviso("Primero sírvele la salsa"); sacude(estS); if (movil()) verPanel("salsa"); return; }
    if (plato[k]) { plato[k] = false; refrescar(); dibujar(); aviso("Quitamos: " + EXTRAS.filter(function (x) { return x.k === k; })[0].n); return; }
    ocupado = true;
    volar(ico(btn), ico(btn).getBoundingClientRect(), cvPlato.getBoundingClientRect(), { escala: 0.5, giro: 90, dur: 650 }).then(function () {
      plato[k] = true; refrescar();
      if (k === "trufa") return tween("trufa", 800);
      if (k === "masPasta") return tween("pasta", 600, 0.55);
      return tween("salsa", 700, 0.5);
    }).then(function () { ocupado = false; });
  }
  function sumar(k, nombre, tipo) {
    var id = k + "|" + nombre, it = otros.filter(function (x) { return x.id === id; })[0];
    if (it) it.cant++; else otros.push({ id: id, k: k, nombre: nombre, tipo: tipo, cant: 1 });
    refrescar();
  }
  function elegirPostre(k, btn) {
    var p = POSTRES.filter(function (x) { return x.k === k; })[0];
    var dest = $("#lado");
    volar(ico(btn), ico(btn).getBoundingClientRect(), dest.getBoundingClientRect(), { escala: 0.55, giro: 40, dur: 650 }).then(function () { sumar(k, p.n, "postre"); });
  }
  function elegirBebida(k, btn) {
    var b = BEBIDAS.filter(function (x) { return x.k === k; })[0];
    popover(btn, b.t, b.ops).then(function (o) {
      if (!o) return null;
      if (!b.ops2) return o[1];
      return popover(btn, b.t2, b.ops2).then(function (o2) { return o2 ? o[1] + " " + o2[1] : null; });
    }).then(function (nombre) {
      if (!nombre) return;
      volar(ico(btn), ico(btn).getBoundingClientRect(), $("#bolsa").getBoundingClientRect(), { escala: 0.5, dur: 650, alto: 90 }).then(function () { sumar(k, nombre, "bebida"); });
    });
  }

  function descPlato(p, html) {
    if (!p.pasta) return "";
    var P = C.PASTAS[p.pasta].n + (p.pasta === "raviolis" && p.relleno ? " " + C.RELLENOS[p.relleno] : "");
    var s = p.salsa ? " con salsa " + (html ? "<b>" + C.SALSAS[p.salsa].n + "</b>" : C.SALSAS[p.salsa].n) : "";
    var ex = EXTRAS.filter(function (x) { return p[x.k]; }).map(function (x) { return x.n; });
    return P + s + (ex.length ? " + " + ex.join(" + ") : "");
  }
  function completo(p) { return p.pasta && p.salsa; }

  function refrescar() {
    // pasta
    ORDEN_P.forEach(function (k) { bP[k].classList.toggle("sel", plato.pasta === k); });
    // salsas
    var disp = C.salsasPara(plato.pasta, plato.relleno);
    TODAS.forEach(function (k) {
      var vis = plato.pasta ? disp.indexOf(k) > -1 : C.salsasPara("spaghetti").indexOf(k) > -1;
      bS[k].hidden = !vis; bS[k].classList.toggle("off", !plato.pasta); bS[k].classList.toggle("sel", plato.salsa === k);
    });
    $("#salsa-nota").textContent = plato.pasta ? (disp.length + " salsas para " + C.PASTAS[plato.pasta].n.toLowerCase()) : "primero escoge la pasta";
    // extras
    EXTRAS.forEach(function (x) { bE[x.k].classList.toggle("sel", !!plato[x.k]); bE[x.k].classList.toggle("off", !plato.pasta || (x.k === "masSalsa" && !plato.salsa)); });
    var ms = ico(bE.masSalsa); if (ms.tagName === "CANVAS") C.iconoExtra(ms, "masSalsa", S, plato.salsa); else if (plato.salsa && tiene("salsa", rutaSalsa(plato.salsa))) (ms.querySelector("img") || ms).src = "img/olla/" + rutaSalsa(plato.salsa) + ".webp";
    // postres y bebidas: insignias
    POSTRES.concat(BEBIDAS).forEach(function (x) {
      var btn = bPo[x.k] || bB[x.k], n = otros.filter(function (o) { return o.k === x.k; }).reduce(function (s, o) { return s + o.cant; }, 0);
      var bd = btn.querySelector(".badge");
      if (n) { if (!bd) { bd = document.createElement("span"); bd.className = "badge"; btn.appendChild(bd); } bd.textContent = n; }
      else if (bd) bd.remove();
    });
    // compartimiento lateral: postres
    var lado = $("#lado"), pos = otros.filter(function (o) { return o.tipo === "postre"; }), totP = pos.reduce(function (t, o) { return t + o.cant; }, 0);
    var clvP = pos.length ? pos[pos.length - 1].k + "|" + totP : "";
    if (lado.dataset.k !== clvP) {
      lado.dataset.k = clvP; lado.innerHTML = "";
      if (pos.length) { lado.appendChild(icono("postre", pos[pos.length - 1].k, 90)); if (totP > 1) { var bp = document.createElement("b"); bp.textContent = "×" + totP; lado.appendChild(bp); } }
    }
    var bolsa = $("#bolsa"), beb = otros.filter(function (o) { return o.tipo === "bebida"; }), totB = beb.reduce(function (t, o) { return t + o.cant; }, 0);
    var clvB = beb.map(function (o) { return o.k; }).join(",") + "|" + totB;
    if (bolsa.dataset.k !== clvB) {
      bolsa.dataset.k = clvB; bolsa.innerHTML = "";
      beb.slice(-2).forEach(function (o) { bolsa.appendChild(tiene("bebidaTop", o.k) ? icoImg("img/bebida_top/" + o.k + ".webp") : icono("bebida", o.k, 70)); });
      if (totB > 2) { var bb = document.createElement("b"); bb.textContent = "×" + totB; bolsa.appendChild(bb); }
    }
    // listos
    $("#listos").innerHTML = listos.length ? "<span>✓ " + listos.length + (listos.length === 1 ? " plato listo" : " platos listos") + "</span>" : "";
    // nombre del plato
    nombreEl.innerHTML = plato.pasta ? descPlato(plato, true) : (listos.length ? "Arma tu siguiente plato" : "Tu plato está esperando");
    $("#vapor").classList.toggle("on", !!plato.salsa);
    // comanda
    var html = "";
    listos.forEach(function (p, i) { html += '<span class="chip">🍝 ' + descPlato(p) + ' <button type="button" data-q="l' + i + '" aria-label="Quitar">×</button></span>'; });
    if (plato.pasta) html += '<span class="chip actual">🍝 ' + descPlato(plato) + (plato.salsa ? "" : " · falta la salsa") + ' <button type="button" data-q="actual" aria-label="Vaciar plato">×</button></span>';
    otros.forEach(function (o, i) { html += '<span class="chip">' + (o.tipo === "postre" ? "🍰 " : "🥤 ") + o.cant + "× " + o.nombre + ' <button type="button" data-q="o' + i + '" aria-label="Quitar uno">×</button></span>'; });
    $("#com-lista").innerHTML = html || '<span class="com-vacia">Tu pedido aparece aquí</span>';
    var total = listos.length + (plato.pasta ? 1 : 0) + otros.reduce(function (s, o) { return s + o.cant; }, 0);
    $("#m-cant").textContent = total;
    $("#otro").disabled = !completo(plato);
    $("#pedir").disabled = !total;
    // pasos hechos en móvil
    $$("#mtabs button").forEach(function (b) {
      var m = b.dataset.m;
      b.classList.toggle("hecho", (m === "pasta" && !!plato.pasta) || (m === "salsa" && !!plato.salsa) || (m === "postres" && otros.some(function (o) { return o.tipo === "postre"; })) || (m === "bebidas" && otros.some(function (o) { return o.tipo === "bebida"; })));
    });
  }
  $("#com-lista").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-q]"); if (!b) return;
    var q = b.dataset.q;
    if (q === "actual") { plato = nuevoPlato(); anim.pasta = anim.salsa = anim.trufa = 1; dibujar(); }
    else if (q[0] === "l") listos.splice(+q.slice(1), 1);
    else { var o = otros[+q.slice(1)]; o.cant--; if (!o.cant) otros.splice(otros.indexOf(o), 1); }
    refrescar();
  });

  $("#otro").onclick = function () {
    if (!completo(plato) || ocupado) return;
    ocupado = true;
    var pr = cvPlato.getBoundingClientRect(), copia = capturaPlato();
    var cx = copia.getContext("2d");
    var R = copia.width * 0.46;
    var g = cx.createLinearGradient(0, 0, copia.width, copia.height); g.addColorStop(0, "rgba(255,255,255,.75)"); g.addColorStop(1, "rgba(220,230,235,.55)");
    cx.fillStyle = g; cx.beginPath(); cx.arc(copia.width / 2, copia.height / 2, R, 0, Math.PI * 2); cx.fill();
    cx.strokeStyle = "rgba(255,255,255,.9)"; cx.lineWidth = copia.width * 0.02; cx.stroke();
    listos.push(plato);
    plato = nuevoPlato(); anim.pasta = anim.salsa = anim.trufa = 1; dibujar();
    var dest = $("#listos").getBoundingClientRect();
    if (!dest.width) dest = { left: pr.left - 20, top: pr.top - 20, width: 40, height: 40 };
    volar(copia, pr, dest, { escala: 0.12, dur: 800, alto: 60 }).then(function () {
      refrescar(); ocupado = false; aviso("¡Plato listo! Arma el siguiente");
      if (movil()) verPanel("pasta");
    });
  };

  /* ---------- al pedido compartido ---------- */
  function fotoPlato(p) { return p.salsa ? srcSalsa(p) : "img/plato2/p_" + p.pasta + ".webp"; }
  function alPedido() {
    if (plato.pasta && !plato.salsa) { aviso("A tu plato le falta la salsa"); sacude(estS); if (movil()) verPanel("salsa"); return; }
    var pl = listos.slice(); if (completo(plato)) pl.push(plato);
    pl.forEach(function (p) { window.PEDIDO.agregar({ id: "arma|" + descPlato(p), n: "Pasta armada", d: descPlato(p), f: fotoPlato(p), t: "arma" }); });
    otros.forEach(function (o) { window.PEDIDO.agregar({ id: o.tipo + "|" + o.id, n: o.nombre, d: o.tipo === "postre" ? "Postre" : "Bebida", c: o.cant, f: (o.tipo === "postre" ? "img/postre/" : "img/bebida_top/") + o.k + ".webp", t: "carta" }); });
    listos = []; otros = []; plato = nuevoPlato(); anim.pasta = anim.salsa = anim.trufa = 1;
    comanda.classList.remove("abierta"); cerrarCaja();
    setTimeout(function () { refrescar(); dibujar(); window.PEDIDO.abrir(); setTimeout(abrirCaja, 600); }, reduce ? 0 : 900);
  }
  $("#pedir").onclick = alPedido;
  function cerrarCaja() {
    if (reduce) return;
    tapaw.style.transition = "transform .8s cubic-bezier(.2,.8,.2,1), opacity .4s";
    tapaw.style.opacity = 1; tapaw.style.transform = "none"; cerrada = true;
  }
  function abrirCaja() { tapaw.style.transition = "transform .8s cubic-bezier(.2,.8,.2,1), opacity .5s"; cerrada = false; escena(); setTimeout(function () { tapaw.style.transition = ""; }, 900); }
  var cerrada = false;

  /* ---------- paneles (escritorio y móvil) ---------- */
  function verPanel(nombre) {
    var mas = ["extras", "postres", "bebidas"].indexOf(nombre) > -1;
    if (mas) {
      $$(".est-mas .tabs button").forEach(function (b) { b.setAttribute("aria-selected", b.dataset.tab === nombre); });
      $$(".est-mas [data-panel]").forEach(function (p) { p.classList.toggle("on", p.dataset.panel === nombre); });
    }
    $$("#mtabs button").forEach(function (b) { b.classList.toggle("on", b.dataset.m === nombre); });
    estP.classList.toggle("m-on", nombre === "pasta");
    estS.classList.toggle("m-on", nombre === "salsa");
    estM.classList.toggle("m-on", mas);
  }
  $$(".est-mas .tabs button").forEach(function (b) { b.onclick = function () { verPanel(b.dataset.tab); }; });
  $$("#mtabs button").forEach(function (b) { b.onclick = function () { verPanel(b.dataset.m); }; });
  mPed.onclick = function () { comanda.classList.toggle("abierta"); };
  verPanel("pasta");

  /* ---------- escena por scroll ---------- */
  var nat = null;
  function medir() {
    caja.style.transform = "none";
    var r = caja.getBoundingClientRect(), pr = pin.getBoundingClientRect();
    nat = { cx: r.left + r.width / 2 - pr.left, cy: r.top + r.height / 2 - pr.top, w: r.width };
  }
  function escena() {
    var total = dom.offsetHeight - innerHeight, p = reduce ? 1 : clamp((scrollY - dom.offsetTop) / (total || 1), 0, 1);
    var q = seg(p, 0, 0.55);
    
    if (!nat) medir();
    var vw = innerWidth, vh = pin.clientHeight, m = eIO(seg(q, 0.22, 0.72));
    // texto de entrada
    var ti = seg(q, 0.02, 0.3);
    intro.style.opacity = 1 - ti;
    intro.style.visibility = ti >= 1 ? "hidden" : "visible";
    intro.style.transform = (movil() ? "" : "translateY(-50%) ") + "translateY(" + (-50 * ti) + "px)";
    // caja
    var ix, iy, is;
    if (movil()) { ix = vw / 2; iy = vh * 0.66; is = 0.9; }
    else { ix = vw * 0.68; iy = vh * 0.54; is = Math.min(1.35, (vh * 0.62) / (nat.w / 1.42)); }
    var dx = (ix - nat.cx) * (1 - m), dy = (iy - nat.cy) * (1 - m), s = is + (1 - is) * m;
    caja.style.transform = "translate(" + dx + "px," + dy + "px) scale(" + s + ")";
    // tapa
    if (!cerrada) {
      var lift = eIO(seg(q, 0.12, 0.5));
      tapaw.style.transform = "translateY(" + (-lift * 130) + "%) rotate(" + (-lift * 10) + "deg)";
      tapaw.style.opacity = 1 - seg(q, 0.38, 0.55);
    }
    // estaciones
    var m1 = eOut(seg(q, 0.42, 0.78)), m2 = eOut(seg(q, 0.48, 0.84)), m3 = eOut(seg(q, 0.54, 0.9)), m4 = eOut(seg(q, 0.62, 1));
    if (movil()) {
      [estP, estS, estM].forEach(function (el) { el.style.transform = "translateY(" + (1 - m1) * 110 + "%)"; el.style.opacity = m1; });
      mtabs.style.transform = "translateY(" + (1 - m1) * 110 + "%)";
      mPed.style.opacity = m4; mPed.style.pointerEvents = m4 > 0.5 ? "" : "none";
      comanda.style.transform = "";
    } else {
      estP.style.transform = "translateX(" + (-(1 - m1) * 130) + "%)"; estP.style.opacity = m1;
      estS.style.transform = "translateY(" + (-(1 - m2) * 170) + "%)"; estS.style.opacity = m2;
      estM.style.transform = "translateX(" + ((1 - m3) * 130) + "%)"; estM.style.opacity = m3;
      comanda.style.transform = "translateY(" + ((1 - m4) * 220) + "%)"; comanda.style.opacity = m4;
      mtabs.style.transform = "";
    }
    nombreEl.style.opacity = m4; $("#bolsa").style.opacity = m4;
    var activo = q > 0.6;
    [estP, estS, estM, comanda].forEach(function (el) { el.style.pointerEvents = activo ? "" : "none"; });
    $("#wa-fija").classList.toggle("oculta", p > 0 && p < 1 && movil());
  }

  var raf = null;
  addEventListener("scroll", function () {
    if (raf) return;
    raf = requestAnimationFrame(function () { raf = null; escena(); });
  }, { passive: true });
  var tRes, anchoAnt = innerWidth;
  addEventListener("resize", function () {
    clearTimeout(tRes);
    tRes = setTimeout(function () {
      var cambioModo = (anchoAnt <= 900) !== (innerWidth <= 900); anchoAnt = innerWidth;
      tamPlato(); nat = null; escena();
    }, 150);
  });

  function iniciar() {
    refrescar();
    tamPlato();
    nat = null; escena();
  }
  logo.onload = function () { dibujar(); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { nat = null; escena(); });
  iniciar();
  (function enlace() {
    var q = {}; (location.hash || "").replace(/^#/, "").split("&").forEach(function (kv) { var p = kv.split("="); if (p[0]) q[p[0]] = decodeURIComponent(p[1] || ""); });
    if (!q.pasta || !C.PASTAS[q.pasta]) return;
    plato.pasta = q.pasta; plato.relleno = q.relleno || (q.pasta === "raviolis" ? "carne" : null);
    if (q.salsa && C.salsasPara(plato.pasta, plato.relleno).indexOf(q.salsa) > -1) plato.salsa = q.salsa;
    refrescar(); dibujar();
    setTimeout(function () { var tot = dom.offsetHeight - innerHeight; window.scrollTo({ top: dom.offsetTop + tot * 0.6, behavior: "smooth" }); if (movil()) verPanel(plato.salsa ? "extras" : "salsa"); }, 400);
  })();
})();
