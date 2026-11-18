(function (global) {
  "use strict";
  var TAU = Math.PI * 2;

  function rng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rgb(h) {
    if (h.indexOf("rgb") === 0) return h.replace(/[^\d,.]/g, "").split(",").slice(0, 3).map(Number);
    h = h.replace("#", "");
    return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)];
  }
  function mezcla(a, b, t) {
    var x = rgb(a), y = rgb(b);
    return "rgb(" + Math.round(x[0] + (y[0] - x[0]) * t) + "," + Math.round(x[1] + (y[1] - x[1]) * t) + "," + Math.round(x[2] + (y[2] - x[2]) * t) + ")";
  }
  function alfa(h, a) { var x = rgb(h); return "rgba(" + x[0] + "," + x[1] + "," + x[2] + "," + a + ")"; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function eOut(t) { t = clamp(t, 0, 1); return 1 - Math.pow(1 - t, 3); }
  function eBack(t) { t = clamp(t, 0, 1); var c = 1.70158, c3 = c + 1; return 1 + c3 * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }

  /* ---------- datos del menú ---------- */
  var PASTAS = {
    spaghetti:   { n: "Spaghetti",   tipo: "hilo",  ancho: 0.021, cant: 170, base: "#EDCB7C", osc: "#B98B3F", luz: "#FFF0C2" },
    tagliatelle: { n: "Tagliatelle", tipo: "hilo",  ancho: 0.052, cant: 62,  base: "#EFCD7E", osc: "#BE8F44", luz: "#FFF3CB" },
    pappardelle: { n: "Pappardelle", tipo: "hilo",  ancho: 0.092, cant: 34,  base: "#F0CF82", osc: "#C09146", luz: "#FFF4CF" },
    gnocchi:     { n: "Gnocchi",     tipo: "gnocchi", base: "#EFCF8A", osc: "#B98E48", luz: "#FFEFC4" },
    raviolis:    { n: "Raviolis",    tipo: "ravioli", base: "#F2CC78", osc: "#B07F34", luz: "#FFE7A8" }
  };
  var RELLENOS = {
    carne: "de carne", mixto: "mixtos", ricotta: "de ricotta", cuatroquesos: "4 quesos", sorrentina: "sorrentina",
    cordero: "de cordero", portobello: "de portobello", salmon: "de salmón", jaiba: "de jaiba"
  };
  var ROJA = ["#E2553A", "#C8321F", "#8E1B10"];
  var SALSAS = {
    napolitana:  { n: "Napolitana", d: "Tomate y especias", c: ROJA, p: ["hierba"], g: "albahaca" },
    alfredo:     { n: "Alfredo", d: "Mantequilla, crema y romero", c: ["#FBF1D6", "#F0DFB4", "#CDB27E"], crema: 1, p: ["romero"] },
    ragu:        { n: "Ragú", d: "Carne, tomate y especias", c: ["#C65A33", "#9E3B1E", "#5E1E0E"], p: ["carne", "hierba"] },
    carbonara:   { n: "Carbonara", d: "Tocineta, huevo y crema", c: ["#F9D77E", "#E9B84E", "#B98227"], crema: 1, p: ["tocineta", "pimienta"] },
    blanca:      { n: "Blanca", d: "Crema, champiñones y especias", c: ["#F8F0DF", "#EDE1C8", "#C9B591"], crema: 1, p: ["champinon", "hierba"] },
    amatriciana: { n: "Amatriciana", d: "Napolitana, tocineta y picante", c: ["#E05A3A", "#C4402A", "#87200F"], p: ["tocineta", "chile"] },
    pesto:       { n: "Pesto", d: "Albahaca, piñones y parmesano", c: ["#8DB955", "#4F8C2D", "#2D5917"], p: ["pinon", "queso"], g: "albahaca" },
    ortolana:    { n: "Ortolana", d: "Verduras de temporada y napolitana", c: ROJA, p: ["verdura", "hierba"] },
    puttanesca:  { n: "Puttanesca", d: "Anchoa, aceituna y alcaparra", c: ["#D24E33", "#B5361F", "#7A1A0C"], p: ["aceituna", "alcaparra", "hierba"] },
    albnap:      { n: "Albóndiga y napolitana", c: ROJA, p: ["albondiga", "hierba"], g: "albahaca" },
    albragu:     { n: "Albóndiga y ragú", c: ["#C65A33", "#9E3B1E", "#5E1E0E"], p: ["carne", "albondiga"] },
    alfcam:      { n: "Alfredo con camarón", c: ["#FBF1D6", "#F0DFB4", "#CDB27E"], crema: 1, p: ["camaron", "romero"] },
    marisco:     { n: "Marisco", d: "Calamar, camarón, mejillón y tomate", c: ["#E4633F", "#C44B2A", "#83240F"], p: ["mejillon", "calamar", "camaron", "hierba"] },
    tinta:       { n: "Marisco en tinta de calamar", c: ["#4A4244", "#221D1F", "#0B090A"], p: ["mejillon", "calamar", "camaron"] },
    marymonte:   { n: "Mar y monte", c: ["#F3CDA6", "#E2AE85", "#B47D57"], crema: 1, p: ["champinon", "camaron"] },
    nueces:      { n: "Nueces", c: ["#F2E3C2", "#E3CC9C", "#B99A63"], crema: 1, p: ["nuez"] },
    casa:        { n: "De la casa", c: ["#E99272", "#D9775A", "#A84E35"], p: ["hierba"] },
    tomatefresco:{ n: "Tomate fresco", c: ["#F0614A", "#D63A28", "#9A1F12"], p: ["tomate", "hierba"], g: "albahaca" },
    mariscoNap:  { n: "Marisco napolitana", c: ROJA, p: ["mejillon", "calamar", "camaron"] }
  };
  var HILO = ["napolitana", "alfredo", "ragu", "carbonara", "blanca", "amatriciana", "pesto", "ortolana", "puttanesca", "albnap", "albragu", "alfcam", "marisco", "tinta", "marymonte"];
  var POR_RELLENO = {
    carne: ["napolitana", "alfredo", "ragu", "amatriciana", "pesto", "nueces", "puttanesca"],
    cuatroquesos: ["napolitana", "blanca", "nueces", "amatriciana", "casa", "puttanesca", "ragu"],
    cordero: ["napolitana", "blanca"],
    portobello: ["blanca", "marisco"],
    salmon: ["blanca", "tomatefresco", "mariscoNap", "marisco"]
  };
  POR_RELLENO.mixto = POR_RELLENO.ricotta = POR_RELLENO.carne;
  POR_RELLENO.sorrentina = POR_RELLENO.cuatroquesos;
  POR_RELLENO.jaiba = POR_RELLENO.salmon;
  var TODAS = ["napolitana", "alfredo", "ragu", "carbonara", "blanca", "amatriciana", "pesto", "ortolana", "puttanesca", "albnap", "albragu", "alfcam", "marisco", "tinta", "marymonte", "nueces", "casa", "tomatefresco", "mariscoNap"];

  function salsasPara(pasta, relleno) {
    if (!pasta) return TODAS;
    if (pasta === "gnocchi") return ["pesto", "napolitana", "ragu"];
    if (pasta === "raviolis") return POR_RELLENO[relleno || "carne"];
    return HILO;
  }

  /* ---------- trazos ---------- */
  function curva(ctx, pts) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length - 1; i++) {
      var mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
      ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
    }
    var l = pts[pts.length - 1];
    ctx.lineTo(l[0], l[1]);
  }

  function genHilos(r, R, cant, ancho, crudo) {
    var out = [];
    for (var i = 0; i < cant; i++) {
      var centro = !crudo && i < cant * 0.1;
      var r0 = centro ? R * (0.04 + r() * 0.2) : R * (0.12 + 0.8 * Math.sqrt(r()));
      var ox = (r() - 0.5) * R * (crudo ? 0.12 : 0.34), oy = (r() - 0.5) * R * (crudo ? 0.12 : 0.34);
      var a = r() * TAU, dir = r() < 0.7 ? 1 : -1, ond = 1.5 + r() * 3.5, amp = R * (crudo ? 0.04 : 0.06 + r() * 0.1), ph = r() * TAU;
      var paso = (crudo ? 0.13 : 0.075 + r() * 0.06), pasos = Math.floor((crudo ? 2.6 : 2 + r() * 3.4) / paso), pts = [], suma = 0, deriva = (r() - 0.5) * R * 0.004;
      for (var s = 0; s < pasos; s++) {
        a += dir * paso;
        var rr = clamp(r0 + Math.sin(a * ond + ph) * amp + s * deriva, R * 0.03, R * 0.97);
        var k = 1 - rr / R;
        var x = ox * k + Math.cos(a) * rr, y = oy * k + Math.sin(a) * rr * 0.97;
        suma += Math.sqrt(x * x + y * y);
        pts.push([x, y]);
      }
      if (pts.length > 2) out.push({ pts: pts, w: ancho * R * (0.8 + r() * 0.4), m: suma / pts.length, v: r() });
    }
    out.sort(function (x, y) { return y.m - x.m; });
    return out;
  }
  function tonoHilo(h, R, P, tinte, t) {
    var prof = clamp(1 - h.m / R, 0, 1), base = mezcla(P.base, P.luz, prof * 0.45 + h.v * 0.1);
    base = mezcla(base.indexOf("rgb") === 0 ? aHex(base) : base, P.osc, (1 - prof) * 0.22);
    if (tinte) base = mezcla(aHex(base), tinte, t);
    return base;
  }
  function aHex(c) { var x = rgb(c); return "#" + x.map(function (v) { return ("0" + Math.round(v).toString(16)).slice(-2); }).join(""); }

  function pintaHilo(ctx, h, p, base, osc, luz) {
    var w = h.w;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    curva(ctx, h.pts);
    ctx.strokeStyle = osc; ctx.lineWidth = w + Math.max(1.1, w * 0.32); ctx.stroke();
    ctx.strokeStyle = base; ctx.lineWidth = w; ctx.stroke();
    if (w > 2.2) {
      ctx.save(); ctx.translate(-w * 0.16, -w * 0.18);
      ctx.strokeStyle = luz; ctx.globalAlpha *= 0.65; ctx.lineWidth = w * 0.3; ctx.stroke();
      ctx.restore();
    }
  }

  function genPiezas(r, R, cant, rmax, sep) {
    var out = [], intentos = 0;
    while (out.length < cant && intentos < 900) {
      intentos++;
      var rad = rmax * Math.sqrt(r()), a = r() * TAU, x = Math.cos(a) * rad, y = Math.sin(a) * rad, ok = true;
      for (var i = 0; i < out.length; i++) {
        var dx = out[i].x - x, dy = out[i].y - y;
        if (dx * dx + dy * dy < sep * sep) { ok = false; break; }
      }
      if (ok) out.push({ x: x, y: y, rot: r() * TAU, k: 0.88 + r() * 0.24, r2: r() });
    }
    out.sort(function (a, b) { return a.y - b.y; });
    return out;
  }

  function pintaGnocchi(ctx, g, R, col, cubierta) {
    var rx = R * 0.12 * g.k, ry = R * 0.085 * g.k;
    ctx.save(); ctx.translate(g.x, g.y); ctx.rotate(g.rot);
    ctx.fillStyle = "rgba(60,30,10,.22)";
    ctx.beginPath(); ctx.ellipse(rx * 0.12, ry * 0.3, rx * 1.02, ry * 1.02, 0, 0, TAU); ctx.fill();
    var gr = ctx.createRadialGradient(-rx * 0.3, -ry * 0.4, 1, 0, 0, rx * 1.1);
    gr.addColorStop(0, cubierta ? mezcla(col.luz, cubierta, 0.25) : col.luz);
    gr.addColorStop(0.55, cubierta ? mezcla(col.base, cubierta, 0.18) : col.base);
    gr.addColorStop(1, cubierta ? mezcla(col.osc, cubierta, 0.3) : col.osc);
    ctx.fillStyle = gr;
    ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = "rgba(120,80,30,.32)"; ctx.lineWidth = Math.max(0.8, R * 0.006);
    for (var i = -2; i <= 2; i++) {
      ctx.beginPath(); ctx.ellipse(i * rx * 0.3, 0, rx * 0.12, ry * 0.78, 0, -1.2, 1.2); ctx.stroke();
    }
    ctx.restore();
  }

  function pintaRavioli(ctx, v, R, col, cubierta) {
    var s = R * 0.26 * v.k, n = 9, h = s / 2;
    ctx.save(); ctx.translate(v.x, v.y); ctx.rotate(v.rot);
    ctx.fillStyle = "rgba(60,30,10,.24)";
    ctx.fillRect(-h + s * 0.06, -h + s * 0.1, s, s);
    ctx.beginPath();
    for (var side = 0; side < 4; side++) {
      for (var i = 0; i < n; i++) {
        var t = i / n, o = (i % 2 ? 1 : 0) * s * 0.035;
        var x, y;
        if (side === 0) { x = -h + s * t; y = -h - o; }
        else if (side === 1) { x = h + o; y = -h + s * t; }
        else if (side === 2) { x = h - s * t; y = h + o; }
        else { x = -h - o; y = h - s * t; }
        if (side === 0 && i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fillStyle = cubierta ? mezcla(col.base, cubierta, 0.3) : col.base; ctx.fill();
    ctx.strokeStyle = cubierta ? mezcla(col.osc, cubierta, 0.4) : col.osc; ctx.lineWidth = Math.max(1, R * 0.006); ctx.stroke();
    var gr = ctx.createRadialGradient(-s * 0.1, -s * 0.12, 1, 0, 0, s * 0.36);
    gr.addColorStop(0, cubierta ? mezcla(col.luz, cubierta, 0.2) : col.luz);
    gr.addColorStop(0.7, cubierta ? mezcla(col.base, cubierta, 0.3) : col.base);
    gr.addColorStop(1, alfa(col.osc, 0.0));
    ctx.fillStyle = gr;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.34, 0, TAU); ctx.fill();
    ctx.strokeStyle = "rgba(140,95,40,.35)"; ctx.lineWidth = Math.max(0.7, R * 0.004);
    for (var k = 0; k < 4; k++) {
      ctx.save(); ctx.rotate(k * Math.PI / 2);
      for (var j = -3; j <= 3; j++) { ctx.beginPath(); ctx.moveTo(j * s * 0.12, -h + s * 0.03); ctx.lineTo(j * s * 0.12, -h + s * 0.12); ctx.stroke(); }
      ctx.restore();
    }
    ctx.restore();
  }

  /* ---------- salsa ---------- */
  function genBlob(r, R, puntos) {
    var ph = [], am = [], pts = [];
    for (var j = 0; j < 5; j++) { ph.push(r() * TAU); am.push((0.09 - j * 0.014) * (0.6 + r() * 0.8)); }
    for (var i = 0; i < puntos; i++) {
      var t = i / puntos * TAU, f = 1;
      for (var k = 0; k < 5; k++) f += am[k] * Math.sin((k + 2) * t + ph[k]);
      pts.push([Math.cos(t) * R * f, Math.sin(t) * R * f * 0.97]);
    }
    return pts;
  }
  function blobPath(ctx, pts, k) {
    ctx.beginPath();
    var n = pts.length;
    for (var i = 0; i < n; i++) {
      var a = pts[i], b = pts[(i + 1) % n];
      var mx = (a[0] + b[0]) / 2 * k, my = (a[1] + b[1]) / 2 * k;
      if (i === 0) ctx.moveTo(mx, my); else ctx.quadraticCurveTo(a[0] * k, a[1] * k, mx, my);
    }
    var a0 = pts[0], b0 = pts[1 % n];
    ctx.quadraticCurveTo(a0[0] * k, a0[1] * k, (a0[0] + b0[0]) / 2 * k, (a0[1] + b0[1]) / 2 * k);
    ctx.closePath();
  }
  function pintaSalsa(ctx, blob, R, sal, k, alfaS) {
    if (k <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = alfaS;
    var gr = ctx.createRadialGradient(-R * 0.25 * k, -R * 0.3 * k, R * 0.05, 0, 0, R * 1.05 * k);
    gr.addColorStop(0, sal.c[0]); gr.addColorStop(0.55, sal.c[1]); gr.addColorStop(1, sal.c[2]);
    blobPath(ctx, blob, k);
    ctx.fillStyle = gr; ctx.fill();
    ctx.globalAlpha = alfaS * 0.5;
    ctx.strokeStyle = sal.c[2]; ctx.lineWidth = Math.max(1, R * 0.012); ctx.stroke();
    ctx.restore();
  }
  function texturaSalsa(ctx, e, S, t) {
    ctx.save();
    blobPath(ctx, e.blob, 1); ctx.clip();
    e.tex.forEach(function (q) {
      ctx.globalAlpha = t * q.a;
      ctx.fillStyle = q.c ? S.c[0] : S.c[2];
      ctx.beginPath(); ctx.ellipse(q.x, q.y, q.r, q.r * 0.7, q.rot, 0, TAU); ctx.fill();
    });
    ctx.globalAlpha = t * (S.crema ? 0.75 : 0.6);
    ctx.fillStyle = "#fff";
    e.spec.forEach(function (q) { ctx.beginPath(); ctx.ellipse(q.x, q.y, q.r, q.r * 0.45, q.rot, 0, TAU); ctx.fill(); });
    ctx.restore();
  }
  function brillo(ctx, R, k, r) {
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,.38)"; ctx.lineCap = "round";
    for (var i = 0; i < 5; i++) {
      var a = -2.4 + r() * 1.2, rad = R * (0.25 + r() * 0.45) * k;
      ctx.lineWidth = Math.max(1, R * (0.01 + r() * 0.018));
      ctx.beginPath(); ctx.arc(0, 0, rad, a, a + 0.25 + r() * 0.35); ctx.stroke();
    }
    ctx.restore();
  }

  /* ---------- toppings ---------- */
  function genParticulas(r, tipos, R, rmax) {
    var out = [];
    var CANT = { hierba: 42, romero: 26, carne: 90, tocineta: 22, pimienta: 70, champinon: 11, chile: 30, pinon: 16, queso: 60, verdura: 30, aceituna: 9, alcaparra: 14, albondiga: 5, camaron: 5, mejillon: 4, calamar: 6, nuez: 14, tomate: 18 };
    tipos.forEach(function (t) {
      var n = CANT[t] || 10;
      for (var i = 0; i < n; i++) {
        var lim = (t === "albondiga" || t === "camaron" || t === "mejillon") ? rmax * 0.62 : rmax;
        var rad = lim * Math.sqrt(r()), a = r() * TAU;
        out.push({ t: t, x: Math.cos(a) * rad, y: Math.sin(a) * rad, rot: r() * TAU, k: 0.75 + r() * 0.5, v: r(), d: r() });
      }
    });
    var orden = { carne: 0, hierba: 5, romero: 5, pimienta: 6, chile: 4, queso: 7 };
    out.sort(function (a, b) { return (orden[a.t] || 2) - (orden[b.t] || 2) || a.y - b.y; });
    return out;
  }
  function hoja(ctx, L, w, c1, c2) {
    ctx.beginPath(); ctx.moveTo(-L / 2, 0);
    ctx.quadraticCurveTo(0, -w, L / 2, 0); ctx.quadraticCurveTo(0, w, -L / 2, 0); ctx.closePath();
    var g = ctx.createLinearGradient(0, -w, 0, w); g.addColorStop(0, c1); g.addColorStop(1, c2);
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = Math.max(0.6, w * 0.08);
    ctx.beginPath(); ctx.moveTo(-L * 0.42, 0); ctx.lineTo(L * 0.4, 0); ctx.stroke();
  }
  function pintaParticula(ctx, q, R, sc) {
    if (sc <= 0.01) return;
    ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.rot); ctx.scale(q.k * sc, q.k * sc);
    var u = R;
    switch (q.t) {
      case "hierba":
        ctx.fillStyle = q.v > 0.5 ? "#2F5A1C" : "#4C7A2A"; ctx.fillRect(-u * 0.008, -u * 0.004, u * 0.016, u * 0.008); break;
      case "romero":
        ctx.strokeStyle = "#3D5B2A"; ctx.lineWidth = u * 0.006; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(-u * 0.022, 0); ctx.lineTo(u * 0.022, 0); ctx.stroke(); break;
      case "pimienta":
        ctx.fillStyle = "#1E1612"; ctx.beginPath(); ctx.arc(0, 0, u * 0.005, 0, TAU); ctx.fill(); break;
      case "chile":
        ctx.fillStyle = "#E2452B"; ctx.fillRect(-u * 0.008, -u * 0.005, u * 0.016, u * 0.01); break;
      case "queso":
        ctx.fillStyle = "#FFF6DC"; ctx.fillRect(-u * 0.007, -u * 0.003, u * 0.014, u * 0.006); break;
      case "carne":
        ctx.fillStyle = q.v > 0.5 ? "#6B2A14" : "#86391C";
        ctx.beginPath(); ctx.ellipse(0, 0, u * 0.022, u * 0.016, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "rgba(255,180,140,.25)"; ctx.beginPath(); ctx.arc(-u * 0.006, -u * 0.005, u * 0.006, 0, TAU); ctx.fill(); break;
      case "tocineta":
        ctx.fillStyle = "#B4624F"; ctx.strokeStyle = "#7A3528"; ctx.lineWidth = u * 0.005;
        ctx.beginPath(); ctx.rect(-u * 0.03, -u * 0.016, u * 0.06, u * 0.032); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#F2D4C4"; ctx.fillRect(-u * 0.03, -u * 0.004, u * 0.06, u * 0.008); break;
      case "champinon":
        ctx.fillStyle = "#D8C2A2"; ctx.strokeStyle = "#8E7457"; ctx.lineWidth = u * 0.005;
        ctx.beginPath(); ctx.arc(0, 0, u * 0.045, Math.PI, 0); ctx.lineTo(u * 0.016, 0); ctx.lineTo(u * 0.016, u * 0.04); ctx.lineTo(-u * 0.016, u * 0.04); ctx.lineTo(-u * 0.016, 0); ctx.closePath();
        ctx.fill(); ctx.stroke(); break;
      case "pinon":
        ctx.fillStyle = "#EEDDB0"; ctx.strokeStyle = "#C2A770"; ctx.lineWidth = u * 0.003;
        ctx.beginPath(); ctx.ellipse(0, 0, u * 0.02, u * 0.01, 0, 0, TAU); ctx.fill(); ctx.stroke(); break;
      case "verdura":
        var vc = q.v < 0.34 ? ["#5E8A2A", "#D7E39C"] : q.v < 0.67 ? ["#E3A421", "#F5D56A"] : ["#4A2B4E", "#D8CFA6"];
        ctx.fillStyle = vc[0]; ctx.fillRect(-u * 0.022, -u * 0.022, u * 0.044, u * 0.044);
        ctx.fillStyle = vc[1]; ctx.fillRect(-u * 0.014, -u * 0.014, u * 0.028, u * 0.028); break;
      case "aceituna":
        ctx.strokeStyle = "#2A2326"; ctx.lineWidth = u * 0.016;
        ctx.beginPath(); ctx.arc(0, 0, u * 0.026, 0, TAU); ctx.stroke(); break;
      case "alcaparra":
        ctx.fillStyle = "#6E8A2E"; ctx.beginPath(); ctx.arc(0, 0, u * 0.012, 0, TAU); ctx.fill(); break;
      case "albondiga":
        var g = ctx.createRadialGradient(-u * 0.04, -u * 0.05, 1, 0, 0, u * 0.13);
        g.addColorStop(0, "#A55A35"); g.addColorStop(0.6, "#7A3A1C"); g.addColorStop(1, "#45190A");
        ctx.fillStyle = "rgba(40,10,0,.3)"; ctx.beginPath(); ctx.arc(u * 0.012, u * 0.02, u * 0.12, 0, TAU); ctx.fill();
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, u * 0.115, 0, TAU); ctx.fill();
        ctx.fillStyle = "rgba(200,50,31,.75)"; ctx.beginPath(); ctx.ellipse(u * 0.01, -u * 0.02, u * 0.08, u * 0.055, 0.4, 0, TAU); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.3)"; ctx.beginPath(); ctx.arc(-u * 0.04, -u * 0.05, u * 0.018, 0, TAU); ctx.fill(); break;
      case "camaron":
        ctx.lineCap = "round";
        for (var s = 0; s < 6; s++) {
          var a0 = Math.PI * 0.15 + s * 0.22;
          ctx.strokeStyle = s % 2 ? "#F08A5D" : "#E8734A"; ctx.lineWidth = u * (0.05 - s * 0.005);
          ctx.beginPath(); ctx.arc(0, 0, u * 0.06, a0, a0 + 0.24); ctx.stroke();
        }
        ctx.strokeStyle = "rgba(255,240,220,.7)"; ctx.lineWidth = u * 0.008;
        ctx.beginPath(); ctx.arc(0, 0, u * 0.06, 0.5, 1.6); ctx.stroke();
        ctx.fillStyle = "#D9502C"; ctx.beginPath(); ctx.moveTo(u * 0.035, u * 0.07); ctx.lineTo(u * 0.07, u * 0.085); ctx.lineTo(u * 0.06, u * 0.05); ctx.fill(); break;
      case "mejillon":
        ctx.fillStyle = "#1D2130"; ctx.beginPath(); ctx.ellipse(0, 0, u * 0.075, u * 0.042, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#3A4157"; ctx.beginPath(); ctx.ellipse(-u * 0.01, -u * 0.012, u * 0.05, u * 0.012, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#E99A4E"; ctx.beginPath(); ctx.ellipse(u * 0.008, u * 0.006, u * 0.05, u * 0.026, 0, 0, TAU); ctx.fill(); break;
      case "calamar":
        ctx.strokeStyle = "#F4EAD8"; ctx.lineWidth = u * 0.018;
        ctx.beginPath(); ctx.ellipse(0, 0, u * 0.045, u * 0.036, 0, 0, TAU); ctx.stroke();
        ctx.strokeStyle = "rgba(180,140,110,.5)"; ctx.lineWidth = u * 0.004; ctx.stroke(); break;
      case "nuez":
        ctx.fillStyle = "#8A5A2B";
        ctx.beginPath(); ctx.arc(-u * 0.01, 0, u * 0.018, 0, TAU); ctx.arc(u * 0.012, -u * 0.006, u * 0.015, 0, TAU); ctx.arc(u * 0.004, u * 0.014, u * 0.013, 0, TAU); ctx.fill();
        ctx.fillStyle = "rgba(255,220,170,.3)"; ctx.beginPath(); ctx.arc(-u * 0.014, -u * 0.006, u * 0.006, 0, TAU); ctx.fill(); break;
      case "tomate":
        ctx.fillStyle = "#E2392B"; ctx.fillRect(-u * 0.025, -u * 0.022, u * 0.05, u * 0.044);
        ctx.fillStyle = "#F7A08A"; ctx.beginPath(); ctx.arc(0, 0, u * 0.01, 0, TAU); ctx.fill(); break;
    }
    ctx.restore();
  }
  function albahaca(ctx, R, sc, rot) {
    if (sc <= 0.01) return;
    ctx.save(); ctx.translate(R * 0.08, -R * 0.12); ctx.rotate(rot); ctx.scale(sc, sc);
    ctx.save(); ctx.rotate(-0.5); ctx.translate(R * 0.07, 0); hoja(ctx, R * 0.2, R * 0.075, "#6FAF3A", "#2F6A1A"); ctx.restore();
    ctx.save(); ctx.rotate(0.7); ctx.translate(R * 0.07, 0); hoja(ctx, R * 0.17, R * 0.065, "#7DBA45", "#356F1E"); ctx.restore();
    ctx.save(); ctx.rotate(2.5); ctx.translate(R * 0.05, 0); hoja(ctx, R * 0.12, R * 0.05, "#8BC650", "#3A7A22"); ctx.restore();
    ctx.restore();
  }
  function genTrufa(r, R) {
    var out = [];
    for (var i = 0; i < 9; i++) { var a = r() * TAU, rad = R * 0.45 * Math.sqrt(r()); out.push({ x: Math.cos(a) * rad, y: Math.sin(a) * rad, rot: r() * TAU, k: 0.8 + r() * 0.4, d: r() }); }
    return out;
  }
  function lamTrufa(ctx, t, R, sc) {
    if (sc <= 0.01) return;
    ctx.save(); ctx.translate(t.x, t.y); ctx.rotate(t.rot); ctx.scale(t.k * sc, t.k * sc);
    var rr = R * 0.055;
    ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(rr * 0.12, rr * 0.18, rr, rr * 0.82, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#4A372C"; ctx.beginPath(); ctx.ellipse(0, 0, rr, rr * 0.82, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#1F1410"; ctx.lineWidth = rr * 0.16; ctx.stroke();
    ctx.strokeStyle = "rgba(225,205,180,.55)"; ctx.lineWidth = rr * 0.06;
    for (var i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-rr * 0.6, -rr * 0.4 + i * rr * 0.28); ctx.bezierCurveTo(-rr * 0.2, -rr * 0.6 + i * rr * 0.3, rr * 0.1, -rr * 0.1 + i * rr * 0.22, rr * 0.6, -rr * 0.35 + i * rr * 0.3); ctx.stroke(); }
    ctx.restore();
  }

  /* ---------- escena del plato ---------- */
  var cacheEsc = {};
  function escena(plato, R) {
    var key = [plato.pasta, plato.relleno, plato.salsa, plato.masPasta ? 1 : 0, plato.masSalsa ? 1 : 0, plato.semilla, Math.round(R)].join("|");
    if (cacheEsc[key]) return cacheEsc[key];
    var r = rng(hash(key) ^ (plato.semilla || 7)), e = { R: R };
    var P = PASTAS[plato.pasta];
    if (P) {
      var Rn = R * (P.tipo === "hilo" ? (plato.masPasta ? 0.93 : 0.85) : (plato.masPasta ? 0.86 : 0.78));
      if (P.tipo === "hilo") e.hilos = genHilos(r, Rn, Math.round(P.cant * (plato.masPasta ? 1.3 : 1)), P.ancho, false);
      else if (P.tipo === "gnocchi") e.piezas = genPiezas(r, R, plato.masPasta ? 32 : 25, Rn * 0.9, R * 0.16);
      else e.piezas = genPiezas(r, R, plato.masPasta ? 12 : 9, Rn * 0.78, R * 0.27);
      e.Rn = Rn;
    }
    if (plato.salsa) {
      var S = SALSAS[plato.salsa];
      var Rs = R * (S.crema ? 0.8 : 0.56) * (plato.masSalsa ? 1.12 : 1);
      e.blob = genBlob(r, Rs, 72); e.Rs = Rs;
      e.gotas = [];
      for (var i = 0; i < 7; i++) { var a = r() * TAU, d = Rs * 0.5 * Math.sqrt(r()); e.gotas.push({ x: Math.cos(a) * d, y: Math.sin(a) * d, b: genBlob(r, R * (0.05 + r() * 0.06), 18) }); }
      e.part = genParticulas(r, S.p, R, Rs * 0.9);
      e.tex = []; e.spec = [];
      for (var t = 0; t < 70; t++) { var ta = r() * TAU, td = Rs * Math.sqrt(r()); e.tex.push({ x: Math.cos(ta) * td, y: Math.sin(ta) * td, r: R * (0.015 + r() * 0.04), rot: r() * 3, c: r() < 0.5, a: 0.2 + r() * 0.35 }); }
      for (var u = 0; u < 16; u++) { var ua = r() * TAU, ud = Rs * 0.75 * Math.sqrt(r()); e.spec.push({ x: Math.cos(ua) * ud, y: Math.sin(ua) * ud, r: R * (0.008 + r() * 0.018), rot: r() * 3 }); }
      e.top = e.hilos ? e.hilos.filter(function (_, i) { return i > e.hilos.length * 0.55 && (i % 2 === 0 || S.crema); }) : null;
      e.giro = r() * TAU;
      e.semBrillo = Math.floor(r() * 1e9);
    }
    e.trufa = genTrufa(rng(hash(key + "t")), R);
    cacheEsc[key] = e;
    return e;
  }

  /* anim: {pasta:0..1, salsa:0..1, trufa:0..1} */
  function pintaComida(ctx, plato, R, anim) {
    var P = PASTAS[plato.pasta];
    if (!P) return;
    var e = escena(plato, R), S = plato.salsa ? SALSAS[plato.salsa] : null;
    var ap = anim.pasta == null ? 1 : anim.pasta, as = anim.salsa == null ? 1 : anim.salsa, at = anim.trufa == null ? 1 : anim.trufa;
    var col = P;
    ctx.save();
    // sombra del montón
    ctx.fillStyle = "rgba(70,35,10,.22)";
    ctx.beginPath(); ctx.ellipse(R * 0.03, R * 0.05, e.Rn * 1.02 * eOut(ap), e.Rn * 0.98 * eOut(ap), 0, 0, TAU); ctx.fill();

    if (e.hilos) {
      ctx.save();
      var k = 1 + (1 - eOut(ap)) * 0.35;
      ctx.rotate((1 - eOut(ap)) * -1.6); ctx.scale(k, k);
      ctx.globalAlpha = clamp(ap * 2.2, 0, 1);
      var nH = Math.ceil(e.hilos.length * clamp(ap * 1.6, 0, 1));
      var tinte = S ? S.c[1] : null, tt = S ? (S.crema ? 0.42 : 0.16) * eOut(as) : 0;
      var oscT = S ? mezcla(col.osc, S.c[2], 0.3 * eOut(as)) : col.osc;
      for (var i = 0; i < nH; i++) pintaHilo(ctx, e.hilos[i], 1, tonoHilo(e.hilos[i], e.Rn, col, tinte, tt), oscT, col.luz);
      ctx.restore();
      if (S) {
        ctx.save(); ctx.rotate(e.giro);
        var ks = eOut(as);
        pintaSalsa(ctx, e.blob, e.Rs, S, ks, S.crema ? 0.74 : 0.94);
        if (as > 0.25) texturaSalsa(ctx, e, S, clamp((as - 0.25) / 0.5, 0, 1));
        ctx.restore();
        if (as > 0.35) {
          ctx.save();
          ctx.globalAlpha = clamp((as - 0.35) / 0.4, 0, 1) * (S.crema ? 0.85 : 0.95);
          var cub = S.c[1];
          for (var j = 0; j < e.top.length; j++) {
            var hb = tonoHilo(e.top[j], e.Rn, col, cub, S.crema ? 0.45 : 0.55);
            pintaHilo(ctx, e.top[j], 1, hb, mezcla(col.osc, S.c[2], 0.65), mezcla(col.luz, S.c[0], 0.35));
          }
          ctx.restore();
        }
      }
    } else if (e.piezas) {
      if (S) {
        ctx.save(); ctx.rotate(e.giro);
        pintaSalsa(ctx, e.blob, e.Rs * 1.08, S, eOut(as), 0.95);
        ctx.restore();
      }
      var n = e.piezas.length;
      for (var p = 0; p < n; p++) {
        var t = clamp((ap - p / n * 0.55) / 0.45, 0, 1);
        if (t <= 0) continue;
        ctx.save();
        var pz = e.piezas[p], sc = eBack(t);
        ctx.translate(pz.x, pz.y - (1 - eOut(t)) * R * 0.5); ctx.scale(sc, sc); ctx.translate(-pz.x, -pz.y);
        ctx.globalAlpha = clamp(t * 3, 0, 1);
        var cubierta = S && as > 0.5 ? S.c[1] : null;
        if (P.tipo === "gnocchi") pintaGnocchi(ctx, pz, R, col, cubierta); else pintaRavioli(ctx, pz, R, col, cubierta);
        ctx.restore();
      }
      if (S && as > 0.4) {
        ctx.save(); ctx.globalAlpha = clamp((as - 0.4) / 0.4, 0, 1) * 0.92;
        e.gotas.forEach(function (g) {
          ctx.save(); ctx.translate(g.x, g.y);
          var gr = ctx.createRadialGradient(-R * 0.02, -R * 0.02, 1, 0, 0, R * 0.1);
          gr.addColorStop(0, S.c[0]); gr.addColorStop(1, S.c[1]);
          blobPath(ctx, g.b, eOut((as - 0.4) / 0.6)); ctx.fillStyle = gr; ctx.fill();
          ctx.restore();
        });
        ctx.restore();
      }
    }
    if (S && as > 0.55) {
      var tp = (as - 0.55) / 0.45;
      e.part.forEach(function (q) { pintaParticula(ctx, q, R, eBack(clamp((tp - q.d * 0.5) / 0.5, 0, 1))); });
      ctx.save(); ctx.globalAlpha = clamp(tp, 0, 1);
      brillo(ctx, e.Rs, 1, rng(e.semBrillo));
      ctx.restore();
      if (S.g) albahaca(ctx, R, eBack(clamp((tp - 0.5) / 0.5, 0, 1)), e.giro);
    }
    if (plato.trufa) e.trufa.forEach(function (t) { lamTrufa(ctx, t, R, eBack(clamp((at - t.d * 0.5) / 0.5, 0, 1))); });
    ctx.restore();
  }

  /* ---------- envase kraft ---------- */
  var logoImg = null;
  function setLogo(img) { logoImg = img; }
  function pintaEnvase(ctx, cx, cy, R0, vacio) {
    var Ri = R0 * 0.86;
    ctx.save(); ctx.translate(cx, cy);
    var sh = ctx.createRadialGradient(R0 * 0.06, R0 * 0.1, R0 * 0.7, R0 * 0.06, R0 * 0.1, R0 * 1.12);
    sh.addColorStop(0, "rgba(40,18,6,.45)"); sh.addColorStop(1, "rgba(40,18,6,0)");
    ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(R0 * 0.06, R0 * 0.1, R0 * 1.12, 0, TAU); ctx.fill();
    var g = ctx.createLinearGradient(-R0, -R0, R0, R0);
    g.addColorStop(0, "#E2BB84"); g.addColorStop(0.5, "#C99B60"); g.addColorStop(1, "#A97C46");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R0, 0, TAU); ctx.fill();
    ctx.strokeStyle = "rgba(255,236,200,.55)"; ctx.lineWidth = Math.max(1, R0 * 0.012);
    ctx.beginPath(); ctx.arc(0, 0, R0 * 0.985, Math.PI * 0.95, Math.PI * 1.75); ctx.stroke();
    ctx.strokeStyle = "rgba(120,80,40,.5)"; ctx.lineWidth = Math.max(1, R0 * 0.008);
    ctx.beginPath(); ctx.arc(0, 0, R0 * 0.935, 0, TAU); ctx.stroke();
    var gi = ctx.createRadialGradient(-Ri * 0.2, -Ri * 0.25, Ri * 0.1, 0, 0, Ri);
    gi.addColorStop(0, "#E6C38E"); gi.addColorStop(0.75, "#D2A56B"); gi.addColorStop(1, "#B8884F");
    ctx.fillStyle = gi; ctx.beginPath(); ctx.arc(0, 0, Ri, 0, TAU); ctx.fill();
    var r = rng(99);
    ctx.strokeStyle = "rgba(110,70,30,.08)"; ctx.lineWidth = 1;
    for (var i = 0; i < 140; i++) { var a = r() * TAU, d = Ri * Math.sqrt(r()), x = Math.cos(a) * d, y = Math.sin(a) * d, b = r() * TAU; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(b) * R0 * 0.03, y + Math.sin(b) * R0 * 0.03); ctx.stroke(); }
    if (vacio > 0.01 && logoImg && logoImg.complete && logoImg.naturalWidth) {
      ctx.save();
      ctx.beginPath(); ctx.arc(0, 0, Ri * 0.98, 0, TAU); ctx.clip();
      ctx.globalAlpha = 0.42 * vacio; ctx.globalCompositeOperation = "multiply";
      var lw = Ri * 1.3, lh = lw * logoImg.naturalHeight / logoImg.naturalWidth;
      ctx.drawImage(logoImg, -lw / 2, -lh / 2, lw, lh);
      ctx.restore();
    }
    var ish = ctx.createRadialGradient(0, 0, Ri * 0.78, 0, 0, Ri);
    ish.addColorStop(0, "rgba(60,30,8,0)"); ish.addColorStop(1, "rgba(60,30,8,.32)");
    ctx.fillStyle = ish; ctx.beginPath(); ctx.arc(0, 0, Ri, 0, TAU); ctx.fill();
    ctx.restore();
    return Ri;
  }

  function pintaPlato(cv, plato, anim) {
    var dpr = cv._dpr || 1, W = cv.width / dpr, ctx = cv.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, W);
    var R0 = W * 0.48, cx = W / 2, cy = W / 2;
    var ap = plato.pasta ? (anim.pasta == null ? 1 : anim.pasta) : 0;
    var Ri = pintaEnvase(ctx, cx, cy, R0, 1 - clamp(ap * 2, 0, 1));
    if (plato.pasta) {
      ctx.save(); ctx.translate(cx, cy);
      ctx.beginPath(); ctx.arc(0, 0, Ri * 0.985, 0, TAU); ctx.clip();
      pintaComida(ctx, plato, Ri, anim);
      ctx.restore();
    }
  }

  /* ---------- íconos de las estaciones ---------- */
  function lienzo(cv, w, h) {
    var dpr = Math.min(2, global.devicePixelRatio || 1);
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    cv._dpr = dpr;
    var ctx = cv.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }
  function rrect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function bandeja(ctx, S) {
    var m = S * 0.06;
    ctx.fillStyle = "rgba(40,20,5,.35)"; rrect(ctx, m + S * 0.02, m + S * 0.04, S - 2 * m, S - 2 * m, S * 0.1); ctx.fill();
    var g = ctx.createLinearGradient(0, 0, S, S); g.addColorStop(0, "#F2F4F5"); g.addColorStop(0.5, "#BFC5C9"); g.addColorStop(1, "#8D959B");
    ctx.fillStyle = g; rrect(ctx, m, m, S - 2 * m, S - 2 * m, S * 0.1); ctx.fill();
    var i = S * 0.13;
    var g2 = ctx.createLinearGradient(0, i, 0, S - i); g2.addColorStop(0, "#9BA3A9"); g2.addColorStop(1, "#D5DADD");
    ctx.fillStyle = g2; rrect(ctx, i, i, S - 2 * i, S - 2 * i, S * 0.07); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 1; rrect(ctx, i, i, S - 2 * i, S - 2 * i, S * 0.07); ctx.stroke();
    return i;
  }
  function harina(ctx, S, r, n) {
    for (var k = 0; k < n; k++) { ctx.fillStyle = "rgba(255,255,255," + (0.35 + r() * 0.5) + ")"; ctx.beginPath(); ctx.arc(S * (0.18 + r() * 0.64), S * (0.18 + r() * 0.64), 0.5 + r() * 1.3, 0, TAU); ctx.fill(); }
  }
  function iconoPasta(cv, k, S) {
    var ctx = lienzo(cv, S, S), P = PASTAS[k], r = rng(hash("ico" + k));
    var i = bandeja(ctx, S);
    ctx.save(); rrect(ctx, i, i, S - 2 * i, S - 2 * i, S * 0.07); ctx.clip();
    var crudo = { base: mezcla(P.base, "#FFF7E0", 0.25), osc: mezcla(P.osc, "#E8D6A8", 0.35), luz: "#FFFBEF" };
    if (P.tipo === "hilo") {
      var nidos = [[0.33, 0.36], [0.67, 0.4], [0.5, 0.7]];
      nidos.forEach(function (c) {
        ctx.save(); ctx.translate(S * c[0], S * c[1]);
        var hs = genHilos(r, S * 0.2, Math.round(P.cant * 0.28), P.ancho * 1.2, true);
        ctx.fillStyle = "rgba(80,50,20,.18)"; ctx.beginPath(); ctx.arc(2, 3, S * 0.2, 0, TAU); ctx.fill();
        hs.forEach(function (h) { pintaHilo(ctx, h, 1, crudo.base, crudo.osc, crudo.luz); });
        ctx.restore();
      });
    } else if (P.tipo === "gnocchi") {
      var ps = genPiezas(r, S, 16, S * 0.34, S * 0.11);
      ctx.translate(S / 2, S / 2);
      ps.forEach(function (p) { pintaGnocchi(ctx, p, S * 0.62, crudo); });
    } else {
      var vs = genPiezas(r, S, 6, S * 0.26, S * 0.2);
      ctx.translate(S / 2, S / 2);
      vs.forEach(function (v) { pintaRavioli(ctx, v, S * 0.7, crudo); });
    }
    ctx.restore();
    harina(ctx, S, r, 60);
  }
  function iconoOlla(cv, k, S) {
    var ctx = lienzo(cv, S, S), Sa = SALSAS[k], r = rng(hash("olla" + k));
    var cx = S / 2, cy = S / 2 + S * 0.02, R = S * 0.36;
    ctx.fillStyle = "rgba(40,20,5,.35)"; ctx.beginPath(); ctx.arc(cx + S * 0.03, cy + S * 0.05, R * 1.08, 0, TAU); ctx.fill();
    ctx.fillStyle = "#7E868C"; rrect(ctx, cx - R * 1.38, cy - R * 0.12, R * 0.4, R * 0.24, R * 0.1); ctx.fill(); rrect(ctx, cx + R * 0.98, cy - R * 0.12, R * 0.4, R * 0.24, R * 0.1); ctx.fill();
    var g = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R); g.addColorStop(0, "#F1F3F4"); g.addColorStop(0.5, "#A9B0B5"); g.addColorStop(1, "#6F777D");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 1.04, 0, TAU); ctx.fill();
    ctx.fillStyle = "#5D6469"; ctx.beginPath(); ctx.arc(cx, cy, R * 0.92, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(cx, cy);
    ctx.beginPath(); ctx.arc(0, 0, R * 0.9, 0, TAU); ctx.clip();
    var gr = ctx.createRadialGradient(-R * 0.3, -R * 0.35, R * 0.05, 0, 0, R * 0.95);
    gr.addColorStop(0, Sa.c[0]); gr.addColorStop(0.6, Sa.c[1]); gr.addColorStop(1, Sa.c[2]);
    ctx.fillStyle = gr; ctx.fillRect(-R, -R, 2 * R, 2 * R);
    var parts = genParticulas(r, Sa.p, R * 2.2, R * 0.78);
    parts.forEach(function (q) { pintaParticula(ctx, q, R * 1.9, q.t === "albondiga" || q.t === "camaron" || q.t === "mejillon" ? 0.55 : 0.7); });
    ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, R * 0.6, -2.5, -1.7); ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, R * 1.0, Math.PI, Math.PI * 1.6); ctx.stroke();
  }
  function iconoExtra(cv, k, S, salsaActual) {
    var ctx = lienzo(cv, S, S), r = rng(hash("ex" + k));
    var cx = S / 2, cy = S / 2, R = S * 0.34;
    function ramekin() {
      ctx.fillStyle = "rgba(40,20,5,.32)"; ctx.beginPath(); ctx.arc(cx + 3, cy + 4, R * 1.05, 0, TAU); ctx.fill();
      ctx.fillStyle = "#FBF8F2"; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#D8CFC0"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R * 0.84, 0, TAU); ctx.stroke();
    }
    if (k === "trufa") {
      ctx.fillStyle = "rgba(40,20,5,.3)"; rrect(ctx, S * 0.12, S * 0.2, S * 0.78, S * 0.66, 10); ctx.fill();
      var gw = ctx.createLinearGradient(0, S * 0.18, 0, S * 0.84); gw.addColorStop(0, "#B98A55"); gw.addColorStop(1, "#8E6236");
      ctx.fillStyle = gw; rrect(ctx, S * 0.1, S * 0.17, S * 0.78, S * 0.66, 10); ctx.fill();
      var tg = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, 1, cx - R * 0.1, cy, R * 0.75);
      tg.addColorStop(0, "#5B463B"); tg.addColorStop(1, "#1C130F");
      ctx.fillStyle = tg; ctx.beginPath();
      for (var i = 0; i < 26; i++) { var a = i / 26 * TAU, rr = R * 0.62 * (1 + (i % 2 ? 0.05 : -0.04) + Math.sin(a * 3) * 0.05); ctx.lineTo(cx - R * 0.15 + Math.cos(a) * rr, cy - R * 0.05 + Math.sin(a) * rr); }
      ctx.closePath(); ctx.fill();
      ctx.save(); ctx.translate(cx + R * 0.55, cy + R * 0.55);
      lamTrufa(ctx, { x: 0, y: 0, rot: 0.4, k: 1 }, S * 0.9, 1);
      lamTrufa(ctx, { x: -R * 0.35, y: R * 0.12, rot: 1.4, k: 0.9 }, S * 0.9, 1);
      ctx.restore();
    } else if (k === "masPasta") {
      ramekin();
      ctx.save(); ctx.translate(cx, cy);
      var hs = genHilos(r, R * 0.75, 40, 0.03, true);
      hs.forEach(function (h) { pintaHilo(ctx, h, 1, "#F1D894", "#C9A660", "#FFF6DA"); });
      ctx.restore();
    } else {
      ramekin();
      var Sa = SALSAS[salsaActual || "napolitana"];
      var g = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.3, 1, cx, cy, R * 0.82);
      g.addColorStop(0, Sa.c[0]); g.addColorStop(0.6, Sa.c[1]); g.addColorStop(1, Sa.c[2]);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 0.8, 0, TAU); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.4)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R * 0.5, -2.5, -1.8); ctx.stroke();
    }
  }
  function platoPostre(ctx, cx, cy, R) {
    ctx.fillStyle = "rgba(40,20,5,.32)"; ctx.beginPath(); ctx.arc(cx + 3, cy + 4, R * 1.04, 0, TAU); ctx.fill();
    ctx.fillStyle = "#FBF8F2"; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#E3DACB"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R * 0.78, 0, TAU); ctx.stroke();
    ctx.strokeStyle = "#C8102E"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, R * 0.94, 0, TAU); ctx.stroke();
  }
  function bola(ctx, x, y, r, c1, c2) {
    ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.beginPath(); ctx.arc(x + r * 0.1, y + r * 0.15, r, 0, TAU); ctx.fill();
    var g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, 1, x, y, r); g.addColorStop(0, c1); g.addColorStop(1, c2);
    ctx.fillStyle = g; ctx.beginPath();
    for (var i = 0; i < 20; i++) { var a = i / 20 * TAU, rr = r * (1 + (i % 2 ? 0.04 : -0.03)); ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
    ctx.closePath(); ctx.fill();
  }
  function iconoPostre(cv, k, S) {
    var ctx = lienzo(cv, S, S), cx = S / 2, cy = S / 2, R = S * 0.4, r = rng(hash("po" + k));
    if (k === "tiramisu") {
      ctx.fillStyle = "rgba(40,20,5,.32)"; rrect(ctx, S * 0.16, S * 0.18, S * 0.72, S * 0.72, 10); ctx.fill();
      ctx.fillStyle = "#FBF8F2"; rrect(ctx, S * 0.13, S * 0.14, S * 0.72, S * 0.72, 10); ctx.fill();
      var g = ctx.createRadialGradient(cx - S * 0.1, cy - S * 0.1, 2, cx, cy, S * 0.4); g.addColorStop(0, "#8A5A3A"); g.addColorStop(1, "#4E2E1C");
      ctx.fillStyle = g; rrect(ctx, S * 0.2, S * 0.21, S * 0.58, S * 0.58, 6); ctx.fill();
      for (var i = 0; i < 260; i++) { ctx.fillStyle = "rgba(" + (r() < 0.5 ? "60,32,18" : "120,80,52") + ",.6)"; ctx.fillRect(S * (0.2 + r() * 0.58), S * (0.21 + r() * 0.58), 1.2, 1.2); }
      ctx.strokeStyle = "rgba(246,236,214,.9)"; ctx.lineWidth = 2; rrect(ctx, S * 0.2, S * 0.21, S * 0.58, S * 0.58, 6); ctx.stroke();
    } else if (k === "pannacotta") {
      platoPostre(ctx, cx, cy, R);
      ctx.fillStyle = "#B3122A"; ctx.beginPath();
      for (var j = 0; j < 30; j++) { var a = j / 30 * TAU, rr = R * 0.66 * (1 + Math.sin(a * 5) * 0.08); ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
      ctx.closePath(); ctx.fill();
      var gp = ctx.createRadialGradient(cx - R * 0.15, cy - R * 0.2, 1, cx, cy, R * 0.48); gp.addColorStop(0, "#FFFDF7"); gp.addColorStop(1, "#E9DFC9");
      ctx.fillStyle = gp; ctx.beginPath(); ctx.arc(cx, cy, R * 0.46, 0, TAU); ctx.fill();
      ctx.fillStyle = "#C21530"; ctx.beginPath(); ctx.ellipse(cx + R * 0.05, cy - R * 0.05, R * 0.24, R * 0.18, 0.4, 0, TAU); ctx.fill();
      [[0.15, -0.1], [-0.08, 0.06], [0.02, 0.14]].forEach(function (p) { bola(ctx, cx + R * p[0], cy + R * p[1], R * 0.07, "#E8546B", "#7A0A1E"); });
    } else if (k === "raviolichoc") {
      platoPostre(ctx, cx, cy, R);
      var col = { base: "#5A3322", osc: "#2E160C", luz: "#8A5A42" };
      ctx.save(); ctx.translate(cx, cy);
      [[-0.32, -0.18, 0.3], [0.05, -0.36, -0.4], [-0.25, 0.28, 0.9]].forEach(function (p) { pintaRavioli(ctx, { x: R * p[0], y: R * p[1], rot: p[2], k: 0.95 }, R * 0.95, col); });
      ctx.restore();
      bola(ctx, cx + R * 0.28, cy + R * 0.18, R * 0.3, "#FFF8E6", "#E6D3A8");
    } else if (k === "torta") {
      platoPostre(ctx, cx, cy, R);
      ctx.save(); ctx.translate(cx - R * 0.12, cy);
      ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.moveTo(-R * 0.48, -R * 0.36); ctx.lineTo(R * 0.4, R * 0.04); ctx.lineTo(-R * 0.42, R * 0.44); ctx.closePath(); ctx.fill();
      var gt = ctx.createLinearGradient(-R * 0.5, 0, R * 0.4, 0); gt.addColorStop(0, "#3A1C10"); gt.addColorStop(1, "#5A2E1A");
      ctx.fillStyle = gt; ctx.beginPath(); ctx.moveTo(-R * 0.52, -R * 0.4); ctx.lineTo(R * 0.36, 0); ctx.lineTo(-R * 0.46, R * 0.4); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#7A4429"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-R * 0.52, -R * 0.4); ctx.lineTo(-R * 0.46, R * 0.4); ctx.stroke();
      ctx.restore();
      bola(ctx, cx + R * 0.36, cy + R * 0.3, R * 0.26, "#FFF8E6", "#E6D3A8");
    } else {
      ctx.fillStyle = "rgba(40,20,5,.3)"; ctx.beginPath(); ctx.arc(cx + 3, cy + 4, R * 0.9, 0, TAU); ctx.fill();
      ctx.fillStyle = "rgba(235,245,248,.85)"; ctx.beginPath(); ctx.arc(cx, cy, R * 0.88, 0, TAU); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.95)"; ctx.lineWidth = 2; ctx.stroke();
      var ge = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 0.78); ge.addColorStop(0, "#9A5B2E"); ge.addColorStop(1, "#3E1E0C");
      ctx.fillStyle = ge; ctx.beginPath(); ctx.arc(cx, cy, R * 0.76, 0, TAU); ctx.fill();
      bola(ctx, cx, cy, R * 0.42, "#FFF8E6", "#E2CB9A");
      ctx.strokeStyle = "rgba(120,60,20,.75)"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(cx, cy, R * 0.3, 0.3, 2); ctx.stroke();
    }
  }
  function vaso(ctx, S, liquido, liquido2, extra) {
    var x = S * 0.3, y = S * 0.18, w = S * 0.4, h = S * 0.68;
    ctx.fillStyle = "rgba(40,20,5,.28)"; ctx.beginPath(); ctx.ellipse(S / 2 + 3, y + h + 2, w * 0.6, S * 0.04, 0, 0, TAU); ctx.fill();
    ctx.save();
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w * 0.9, y + h); ctx.lineTo(x + w * 0.1, y + h); ctx.closePath(); ctx.clip();
    ctx.fillStyle = "rgba(230,240,245,.35)"; ctx.fillRect(x, y, w, h);
    var g = ctx.createLinearGradient(0, y + h * 0.16, 0, y + h); g.addColorStop(0, liquido2 || liquido); g.addColorStop(1, liquido);
    ctx.fillStyle = g; ctx.fillRect(x, y + h * 0.16, w, h);
    if (extra === "crema") { ctx.fillStyle = "rgba(255,250,238,.95)"; ctx.fillRect(x, y + h * 0.16, w, h * 0.12); }
    for (var i = 0; i < 3; i++) { ctx.fillStyle = "rgba(255,255,255,.4)"; rrect(ctx, x + w * (0.15 + i * 0.25), y + h * (0.3 + (i % 2) * 0.12), w * 0.26, w * 0.24, 3); ctx.fill(); }
    ctx.fillStyle = "rgba(255,255,255,.45)"; ctx.fillRect(x + w * 0.08, y, w * 0.1, h);
    ctx.restore();
    ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w * 0.1, y + h); ctx.lineTo(x + w * 0.9, y + h); ctx.lineTo(x + w, y); ctx.stroke();
    ctx.strokeStyle = "#D7282F"; ctx.lineWidth = S * 0.035; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x + w * 0.62, y + h * 0.5); ctx.lineTo(x + w * 0.82, y - h * 0.16); ctx.stroke();
    ctx.strokeStyle = "#fff"; ctx.lineWidth = S * 0.012; ctx.setLineDash([3, 3]); ctx.stroke(); ctx.setLineDash([]);
    if (extra === "limon") {
      ctx.fillStyle = "#F3E26A"; ctx.beginPath(); ctx.arc(x + w * 0.12, y + 2, S * 0.1, 0, TAU); ctx.fill();
      ctx.fillStyle = "#FFF7C8"; ctx.beginPath(); ctx.arc(x + w * 0.12, y + 2, S * 0.075, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#E8D24E"; ctx.lineWidth = 1; for (var k = 0; k < 6; k++) { var a = k / 6 * TAU; ctx.beginPath(); ctx.moveTo(x + w * 0.12, y + 2); ctx.lineTo(x + w * 0.12 + Math.cos(a) * S * 0.075, y + 2 + Math.sin(a) * S * 0.075); ctx.stroke(); }
      ctx.save(); ctx.translate(x + w * 0.35, y - 2); hoja(ctx, S * 0.14, S * 0.05, "#7BC04A", "#2F7A1E"); ctx.restore();
    }
  }
  function botella(ctx, S, cuerpo, tapa, etiqueta) {
    var cx = S / 2, top = S * 0.08, bot = S * 0.88, w = S * 0.26;
    ctx.fillStyle = "rgba(40,20,5,.28)"; ctx.beginPath(); ctx.ellipse(cx + 3, bot + 2, w * 0.8, S * 0.04, 0, 0, TAU); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.22, top + S * 0.06); ctx.lineTo(cx - w * 0.22, top + S * 0.22);
    ctx.bezierCurveTo(cx - w * 0.22, top + S * 0.32, cx - w * 0.5, top + S * 0.34, cx - w * 0.5, top + S * 0.44);
    ctx.lineTo(cx - w * 0.5, bot - 6); ctx.quadraticCurveTo(cx - w * 0.5, bot, cx - w * 0.44, bot);
    ctx.lineTo(cx + w * 0.44, bot); ctx.quadraticCurveTo(cx + w * 0.5, bot, cx + w * 0.5, bot - 6);
    ctx.lineTo(cx + w * 0.5, top + S * 0.44);
    ctx.bezierCurveTo(cx + w * 0.5, top + S * 0.34, cx + w * 0.22, top + S * 0.32, cx + w * 0.22, top + S * 0.22);
    ctx.lineTo(cx + w * 0.22, top + S * 0.06); ctx.closePath();
    var g = ctx.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0); g.addColorStop(0, cuerpo[0]); g.addColorStop(0.4, cuerpo[1]); g.addColorStop(1, cuerpo[2]);
    ctx.fillStyle = g; ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.4)"; ctx.fillRect(cx - w * 0.36, top + S * 0.42, w * 0.08, S * 0.36);
    ctx.fillStyle = tapa; rrect(ctx, cx - w * 0.26, top, w * 0.52, S * 0.08, 2); ctx.fill();
    if (etiqueta) {
      ctx.fillStyle = etiqueta; ctx.fillRect(cx - w * 0.5, top + S * 0.52, w, S * 0.18);
      ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.fillRect(cx - w * 0.5, top + S * 0.6, w, S * 0.02);
    }
  }
  function iconoBebida(cv, k, S) {
    var ctx = lienzo(cv, S, S);
    if (k === "soda") vaso(ctx, S, "#C8102E", "#F45B7A", "crema");
    else if (k === "limonada") vaso(ctx, S, "#F1E7A0", "#FBF6D6", "limon");
    else if (k === "jugo") vaso(ctx, S, "#F2A23A", "#FFC861", "");
    else if (k === "gaseosa") botella(ctx, S, ["#2C140C", "#5A2C18", "#1E0C06"], "#C8102E", "#C8102E");
    else if (k === "agua") botella(ctx, S, ["#B9DCEB", "#E8F5FB", "#9CC8DD"], "#1E5FA8", "#2C7BD0");
    else {
      var cx = S / 2;
      ctx.fillStyle = "rgba(40,20,5,.28)"; ctx.beginPath(); ctx.ellipse(cx + 3, S * 0.88, S * 0.24, S * 0.04, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx - S * 0.06, S * 0.1); ctx.lineTo(cx - S * 0.06, S * 0.36); ctx.bezierCurveTo(cx - S * 0.28, S * 0.46, cx - S * 0.26, S * 0.88, cx - S * 0.18, S * 0.88);
      ctx.lineTo(cx + S * 0.18, S * 0.88); ctx.bezierCurveTo(cx + S * 0.26, S * 0.88, cx + S * 0.28, S * 0.46, cx + S * 0.06, S * 0.36); ctx.lineTo(cx + S * 0.06, S * 0.1); ctx.closePath();
      ctx.fillStyle = "rgba(230,240,245,.4)"; ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.save(); ctx.clip();
      var g = ctx.createLinearGradient(0, S * 0.5, 0, S * 0.88); g.addColorStop(0, "#8E1B2E"); g.addColorStop(1, "#4A0814");
      ctx.fillStyle = g; ctx.fillRect(0, S * 0.52, S, S);
      ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(cx - S * 0.17, S * 0.45, S * 0.04, S * 0.4);
      ctx.restore();
    }
  }
  function tapaCaja(cv, w, h) {
    var ctx = lienzo(cv, w, h);
    var g = ctx.createLinearGradient(0, 0, w, h); g.addColorStop(0, "#DDB57E"); g.addColorStop(0.5, "#C99B60"); g.addColorStop(1, "#AE814B");
    ctx.fillStyle = g; rrect(ctx, 0, 0, w, h, Math.min(w, h) * 0.04); ctx.fill();
    var r = rng(5);
    ctx.strokeStyle = "rgba(110,70,30,.1)"; ctx.lineWidth = 1;
    for (var i = 0; i < 380; i++) { var x = r() * w, y = r() * h, b = r() * TAU; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(b) * 8, y + Math.sin(b) * 8); ctx.stroke(); }
    ctx.strokeStyle = "rgba(90,55,20,.35)"; ctx.lineWidth = 2;
    rrect(ctx, w * 0.04, h * 0.05, w * 0.92, h * 0.9, Math.min(w, h) * 0.03); ctx.stroke();
  }

  global.Cocina = {
    PASTAS: PASTAS, SALSAS: SALSAS, RELLENOS: RELLENOS, salsasPara: salsasPara,
    pintaPlato: pintaPlato, lienzo: lienzo, setLogo: setLogo,
    iconoPasta: iconoPasta, iconoOlla: iconoOlla, iconoExtra: iconoExtra, iconoPostre: iconoPostre, iconoBebida: iconoBebida, tapaCaja: tapaCaja,
    rng: rng, eOut: eOut, eBack: eBack, clamp: clamp
  };
})(window);
