/* Portada de Tutor */
(() => {
const T = window.TUTOR, $ = (s, r = document) => r.querySelector(s);
const ancho = () => innerWidth, alto = () => innerHeight, movil = () => innerWidth <= 860;

/* ---------- A · Burbujas con física ---------- */
const FRASES = [
  ["Can I say something?", "¿Puedo decir algo?"], ["Let me explain.", "Déjame explicar."],
  ["I disagree, because…", "No estoy de acuerdo, porque…"], ["What do you mean?", "¿Qué quieres decir?"],
  ["Good point!", "¡Buen punto!"], ["Could you repeat that?", "¿Puedes repetirlo?"],
  ["In my opinion…", "En mi opinión…"], ["Here's the thing.", "El asunto es este."],
  ["Let's figure it out.", "Resolvámoslo."], ["I've got an idea!", "¡Tengo una idea!"],
  ["May I have the floor?", "¿Me permiten la palabra?"], ["Nice to meet you.", "Mucho gusto."]
];
const juego = $("#juego"), zoomEl = $("#zoom");
const trad = document.createElement("p"); trad.className = "hero__trad"; trad.setAttribute("aria-live", "polite"); juego.append(trad);
let motor = null, corriendo = false, burbujas = [];
function tocar(b) {
  b.el.classList.remove("suena"); void b.el.offsetWidth; b.el.classList.add("suena");
  T.hablar(b.en);
  trad.innerHTML = `<span class="en">${b.en}</span> — ${b.es}`; trad.classList.add("ver");
  clearTimeout(tocar.t); tocar.t = setTimeout(() => trad.classList.remove("ver"), 2600);
}
function crearBurbujas() {
  const n = movil() ? 5 : 10, estilos = ["", "burbuja--hueso", "burbuja--rojo", "", "burbuja--hueso"];
  FRASES.slice(0, n).forEach(([en, es], i) => {
    const el = document.createElement("button");
    el.className = `burbuja ${estilos[i % estilos.length]} ${i % 3 === 1 ? "burbuja--izq" : ""}`;
    el.textContent = en; el.type = "button"; el.setAttribute("aria-label", `${en} (${es}). Toca para escuchar`);
    juego.append(el);
    burbujas.push({ el, en, es, w: el.offsetWidth, h: el.offsetHeight });
  });
}
function iniciarFisica() {
  const M = window.Matter; if (!M) return;
  const { Engine, Bodies, Composite, Body, Constraint, Runner, Events } = M;
  motor = Engine.create({ gravity: { y: 1.1 } });
  const r = juego.getBoundingClientRect(), W = r.width, H = r.height;
  const z = zoomEl.getBoundingClientRect(), zx = z.left - r.left, zy = z.top - r.top;
  const est = { isStatic: true, friction: .8 };
  Composite.add(motor.world, [
    Bodies.rectangle(W / 2, H + 40, W * 3, 80, est),
    Bodies.rectangle(-40, H / 2 - 400, 80, H * 3, est),
    Bodies.rectangle(W + 40, H / 2 - 400, 80, H * 3, est),
    // el bocadillo rojo: bloque de arriba y la cola
    Bodies.rectangle(zx + z.width / 2, zy + z.height * .33, z.width, z.height * .66, est),
    Bodies.rectangle(zx + z.width * .78, zy + z.height * .8, z.width * .44, z.height * .4, est)
  ]);
  burbujas.forEach((b, i) => {
    const x = Math.min(W - b.w / 2 - 10, Math.max(b.w / 2 + 10, W * (.15 + Math.random() * .7)));
    b.body = Bodies.rectangle(x, -60 - i * 70, b.w, b.h * .9, { chamfer: { radius: 4 }, restitution: .25, friction: .6, frictionAir: .012, angle: (Math.random() - .5) * .5 });
    b.body.burbuja = b;
    Composite.add(motor.world, b.body);
  });
  Events.on(motor, "afterUpdate", () => {
    burbujas.forEach(b => { const p = b.body.position;
      if (Math.abs(b.body.angle) > .34) { Body.setAngle(b.body, Math.sign(b.body.angle) * .34); Body.setAngularVelocity(b.body, 0); } b.el.style.transform = `translate(${p.x - b.w / 2}px,${p.y - b.h / 2}px) rotate(${b.body.angle}rad)`; });
  });
  const runner = Runner.create();
  const arrancar = (on) => { if (on && !corriendo) { Runner.run(runner, motor); corriendo = true; } else if (!on && corriendo) { Runner.stop(runner); corriendo = false; } };
  new IntersectionObserver(([e]) => arrancar(e.isIntersecting)).observe(juego);
  // arrastrar con el puntero (propio, para que la rueda del mouse siga haciendo scroll)
  let agarre = null;
  const punto = (e) => { const rr = juego.getBoundingClientRect(); return { x: e.clientX - rr.left, y: e.clientY - rr.top }; };
  juego.addEventListener("pointerdown", (e) => {
    const el = e.target.closest(".burbuja"); if (!el) return;
    const b = burbujas.find(x => x.el === el), p = punto(e);
    agarre = { b, t: performance.now(), p0: p, c: Constraint.create({ pointA: p, bodyB: b.body, pointB: { x: p.x - b.body.position.x, y: p.y - b.body.position.y }, stiffness: .2, damping: .1 }) };
    Composite.add(motor.world, agarre.c); el.setPointerCapture(e.pointerId);
  });
  juego.addEventListener("pointermove", (e) => { if (agarre) agarre.c.pointA = punto(e); });
  const soltar = (e) => {
    if (!agarre) return;
    const p = punto(e), d = Math.hypot(p.x - agarre.p0.x, p.y - agarre.p0.y);
    Composite.remove(motor.world, agarre.c);
    if (d < 8 && performance.now() - agarre.t < 400) { tocar(agarre.b); Body.applyForce(agarre.b.body, agarre.b.body.position, { x: (Math.random() - .5) * .02, y: -.05 }); }
    agarre = null;
  };
  juego.addEventListener("pointerup", soltar); juego.addEventListener("pointercancel", soltar);
  juego.addEventListener("keydown", (e) => { const el = e.target.closest(".burbuja"); if (el && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); tocar(burbujas.find(x => x.el === el)); } });
}
function burbujasQuietas() {
  const r = juego.getBoundingClientRect();
  burbujas.forEach((b, i) => {
    const col = i % 3, fila = Math.floor(i / 3);
    b.el.style.transform = `translate(${12 + col * (r.width / 3.2)}px,${30 + fila * (b.h + 14)}px)`;
    b.el.addEventListener("click", () => tocar(b));
  });
}
crearBurbujas();
if (T.reducido || !window.Matter) burbujasQuietas(); else iniciarFisica();

/* ---------- B · Zoom a través de la figura ---------- */
if (window.gsap && window.ScrollTrigger && !T.reducido) {
  const simb = $(".zoom__simbolo"), foto = $("#zoomFoto"), texto = $(".hero__texto"), despues = $("#despues");
  let L, o, smax, dx, dy;
  const medir = () => {
    zoomEl.style.transform = "none";
    const z = zoomEl.getBoundingClientRect();
    L = { x: z.left, y: z.top }; o = { x: z.width * .645, y: z.height * .5 };
    zoomEl.style.transformOrigin = `${o.x}px ${o.y}px`;
    smax = Math.max(ancho() / (z.width * .168), alto() / (z.height * .38)) * 1.7;
    dx = ancho() / 2 - (L.x + o.x); dy = alto() / 2 - (L.y + o.y);
  };
  const pintar = (p) => {
    const e = gsap.parseEase("power2.inOut")(Math.min(1, p / .85));
    const s = Math.pow(smax, e), tx = dx * Math.min(1, e * 1.6), ty = dy * Math.min(1, e * 1.6);
    zoomEl.style.transform = `translate(${tx}px,${ty}px) scale(${s})`;
    const ex = o.x - (L.x + tx + o.x) / s, ey = o.y - (L.y + ty + o.y) / s;
    foto.style.transform = `matrix(${1 / s},0,0,${1 / s},${ex},${ey})`;
    foto.style.opacity = Math.min(1, Math.max(0, (p - .12) / .25));
    simb.style.opacity = 1 - Math.min(1, Math.max(0, (p - .62) / .16));
    const t = Math.min(1, p / .14);
    texto.style.opacity = 1 - t; texto.style.translate = `0 ${-60 * t}px`;
    burbujas.forEach(b => b.el.style.opacity = 1 - Math.min(1, p / .08));
    juego.style.pointerEvents = p > .04 ? "none" : "";
    const d = Math.max(0, (p - .86) / .14);
    despues.style.opacity = d;
    despues.querySelectorAll("span").forEach((sp, i) => sp.style.transform = `translateY(${(1 - Math.min(1, d * 1.4 - i * .3)) * 40}px)`);
  };
  medir(); pintar(0);
  ScrollTrigger.create({ trigger: "#hero", start: "top top", end: () => "+=" + alto() * 1.8, pin: true, scrub: true, onUpdate: (st) => pintar(st.progress), onRefresh: (st) => { medir(); pintar(st.progress); } });
  // entrada del titular
  gsap.from(".hero__tit .ln", { yPercent: 60, opacity: 0, duration: 1, stagger: .12, ease: "power3.out", delay: .1 });
  gsap.from([".hero__en", ".hero .lead", ".hero .fila"], { y: 24, opacity: 0, duration: .9, stagger: .1, ease: "power3.out", delay: .45 });
  gsap.from(zoomEl, { scale: .2, opacity: 0, duration: 1.1, ease: "back.out(1.6)", delay: .2, transformOrigin: "100% 100%", clearProps: "opacity", onComplete: () => { medir(); pintar(0); } });
}

/* ---------- C · La cuenta ---------- */
const rP = $("#rPers"), rF = $("#rProfe"), num = $("#calcNum");
let val = { v: 3 };
function cuenta() {
  const pers = +rP.value, profe = +rF.value, min = 120 * (1 - profe / 100) / pers;
  $("#oPers").textContent = pers; $("#oProfe").textContent = profe + " %";
  const fmt = (v) => v < 10 ? v.toFixed(1).replace(".", ",").replace(",0", "") : Math.round(v);
  if (window.gsap) gsap.to(val, { v: min, duration: .5, ease: "power2.out", onUpdate: () => num.textContent = fmt(val.v) }); else num.textContent = fmt(min);
  $("#calcTxt").textContent = `En 120 minutos de clase con ${pers} personas, si el profe habla el ${profe} % del tiempo, a cada una le quedan unos ${fmt(min)} minutos para hablar.`;
}
rP.addEventListener("input", cuenta); rF.addEventListener("input", cuenta); cuenta();

/* ---------- D · Reloj del método ---------- */
const svg = $("#reloj"), lista = $("#pasos"), centro = $("#relojCentro"), hace = $("#relojHace");
const NS = "http://www.w3.org/2000/svg", R = 128, G = 1.4;
const polar = (a, r) => [r * Math.sin(a * Math.PI / 180), -r * Math.cos(a * Math.PI / 180)];
const arco = (a0, a1, r) => { const [x0, y0] = polar(a0, r), [x1, y1] = polar(a1, r); return `M${x0},${y0} A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1},${y1}`; };
let acum = 0, activo = 0;
const arcos = T.PASOS.map((p, i) => {
  const a0 = acum / 120 * 360 + G, a1 = (acum + p.min) / 120 * 360 - G; acum += p.min;
  const el = document.createElementNS(NS, "path");
  el.setAttribute("d", arco(a0, a1, R)); el.setAttribute("class", "arco"); el.setAttribute("fill", "none");
  el.setAttribute("stroke-width", "30"); el.setAttribute("stroke", "rgba(255,255,255,.14)");
  el.addEventListener("click", () => elegir(i, true));
  svg.append(el);
  const [lx, ly] = polar((a0 + a1) / 2, R + 34);
  const t = document.createElementNS(NS, "text");
  t.setAttribute("x", lx); t.setAttribute("y", ly + 4); t.setAttribute("text-anchor", "middle");
  t.setAttribute("fill", "#B9BBBA"); t.setAttribute("style", "font:700 11px var(--f-txt);letter-spacing:.06em");
  t.textContent = `${p.min}′`; svg.append(t);
  return { el, t, mid: (a0 + a1) / 2 };
});
for (let m = 0; m < 120; m += 5) {
  const [x0, y0] = polar(m * 3, R - 22), [x1, y1] = polar(m * 3, R - (m % 30 ? 18 : 12));
  const l = document.createElementNS(NS, "line"); l.setAttribute("x1", x0); l.setAttribute("y1", y0); l.setAttribute("x2", x1); l.setAttribute("y2", y1);
  l.setAttribute("stroke", m % 30 ? "rgba(255,255,255,.25)" : "#fff"); l.setAttribute("stroke-width", m % 30 ? 1 : 2); svg.append(l);
}
const aguja = document.createElementNS(NS, "g");
aguja.innerHTML = `<line x1="0" y1="0" x2="0" y2="${-(R - 30)}" stroke="#FF0000" stroke-width="3"/><circle r="6" fill="#FF0000"/>`;
svg.append(aguja);
lista.innerHTML = T.PASOS.map((p, i) => `<li><button role="tab" aria-selected="false" data-i="${i}"><span class="num">0${p.n}</span><b>${p.nombre}</b><span class="min">${p.min} min</span></button></li>`).join("");
lista.setAttribute("role", "tablist");
const botones = [...lista.querySelectorAll("button")];
let rotAguja = { a: 0 };
function elegir(i, manual) {
  activo = i; const p = T.PASOS[i];
  arcos.forEach((a, j) => { a.el.setAttribute("stroke", j === i ? "#FF0000" : j < i ? "rgba(255,255,255,.4)" : "rgba(255,255,255,.14)"); a.t.setAttribute("fill", j === i ? "#fff" : "#B9BBBA"); });
  botones.forEach((b, j) => b.setAttribute("aria-selected", j === i));
  centro.innerHTML = `<span class="rc-min">${p.min}<small> min</small></span><span class="rc-nom">${p.nombre}</span><button class="rc-en" type="button" aria-label="Escuchar: ${p.en}">“${p.en}” <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M4 9v6h4l5 4V5L8 9H4z"/></svg></button>`;
  hace.textContent = p.hace;
  centro.querySelector(".rc-en").onclick = () => T.hablar(p.en);
  if (window.gsap) gsap.to(rotAguja, { a: arcos[i].mid, duration: .9, ease: "elastic.out(1,.7)", onUpdate: () => aguja.setAttribute("transform", `rotate(${rotAguja.a})`) });
  else aguja.setAttribute("transform", `rotate(${arcos[i].mid})`);
  if (manual) clearInterval(auto);
}
botones.forEach((b, i) => b.addEventListener("click", () => elegir(i, true)));
elegir(0);
let auto = null;
if (window.gsap && window.ScrollTrigger && !T.reducido && innerWidth > 900) {
  ScrollTrigger.create({ trigger: ".metodo__pin", start: "top top", end: "+=" + 6 * 55 + "%", pin: true, scrub: true,
    onUpdate: (st) => { const i = Math.min(5, Math.floor(st.progress * 6)); if (i !== activo) elegir(i); } });
} else {
  new IntersectionObserver(([e]) => { clearInterval(auto); if (e.isIntersecting) auto = setInterval(() => elegir((activo + 1) % 6), 4200); }).observe(svg);
}

/* ---------- E · Escalera de niveles ---------- */
const esc = $("#escalera"), det = $("#nivelDet");
esc.innerHTML = T.NIVELES.map((n, i) => `<button class="escalon" role="tab" aria-selected="false" aria-controls="nivelDet" data-i="${i}" style="height:${40 + i * 15}%;background:${n.color};color:${n.texto}"><span class="id">${n.id}</span><span class="nom">${n.nombre}</span></button>`).join("")
  + `<img class="escalera__fig" id="figEsc" src="assets/logo/figura-tinta.svg" alt="">`;
const escalones = [...esc.querySelectorAll(".escalon")], fig = $("#figEsc");
const guardado = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch { return null; } };
function nivel(i) {
  const n = T.NIVELES[i];
  escalones.forEach((b, j) => b.setAttribute("aria-selected", j === i));
  const b = escalones[i], fw = fig.offsetWidth, fh = fig.offsetHeight;
  fig.style.transform = `translate(${b.offsetLeft + b.offsetWidth * .5 - fw * .55}px,${b.offsetTop - fh - 10}px)`;
  det.innerHTML = `<div><span class="etq rojo">Nivel ${n.id}</span><h3>${n.nombre}</h3>
    <button class="frase" type="button"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zM16.5 8.5a5 5 0 0 1 0 7"/></svg>“${n.frase}”</button></div>
    <div><p class="etq" style="margin-bottom:16px">Al terminar ${n.id} puedes…</p><ul class="puede">${n.puede.map((t, j) => `<li><label><input type="checkbox" data-k="tutor-cd-${n.id}-${j}"${guardado(`tutor-cd-${n.id}-${j}`) === "1" ? " checked" : ""}><span>${t}</span></label></li>`).join("")}</ul></div>
    <div><div class="dato"><b>${n.horas} h</b><small>Horas guiadas acumuladas desde cero, de referencia según Cambridge English. Cada persona avanza a su ritmo.</small></div>
    <div class="dato"><b style="font-size:var(--s2);line-height:1.2">${n.examen}</b><small>Examen internacional que encaja con este nivel.</small></div></div>`;
  det.querySelector(".frase").onclick = () => T.hablar(n.frase);
  det.querySelectorAll("input").forEach(c => c.onchange = () => guardado(c.dataset.k, c.checked ? "1" : "0"));
  if (window.gsap) gsap.from(det.children, { y: 18, opacity: 0, duration: .6, stagger: .07, ease: "power3.out" });
}
escalones.forEach((b, i) => b.addEventListener("click", () => nivel(i)));
esc.addEventListener("keydown", (e) => { const i = escalones.indexOf(document.activeElement); if (i < 0) return; const k = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (k) { const j = (i + k + 5) % 5; escalones[j].focus(); nivel(j); } });
fig.complete ? nivel(2) : fig.addEventListener("load", () => nivel(2));
addEventListener("resize", () => nivel(escalones.findIndex(b => b.getAttribute("aria-selected") === "true")));
escalones.forEach((b, i) => b.style.setProperty("--i", i));
new IntersectionObserver(([e], ob) => { if (e.isIntersecting) { esc.classList.add("crecer"); ob.disconnect(); } }, { rootMargin: "0px 0px -15% 0px" }).observe(esc);

/* ---------- F · Programas ---------- */
$("#progs").innerHTML = T.PROGRAMAS.map(p => `<a class="prog rev" href="programas.html#${p.id}">
  <div class="foto-boc bocadillo"><img src="${p.img}" alt="Clase de inglés de ${p.nombre.toLowerCase()} en Tutor" loading="lazy"></div>
  <div class="prog__txt"><span class="etq">${p.sub}</span><h3>${p.nombre}</h3><p>${p.gancho}</p><span class="enlace">Ver programa</span></div></a>`).join("");
T.observar();

/* ---------- G · Reto de voz ---------- */
const RETO = { A1: "Hi! My name is Ana and I live in Cali.", A2: "Could you tell me where the bus station is?", B1: "I'd like to take the floor for a minute.", B2: "That's a fair point, but have you considered the cost?", C1: "Let me put it another way, so it's crystal clear." };
let nivelReto = "B1";
const fr = $("#retoFrase"), res = $("#retoRes"), mic = $("#retoMic"), selN = $("#retoNivel");
selN.innerHTML = Object.keys(RETO).map(k => `<button type="button" aria-pressed="${k === nivelReto}" data-k="${k}">${k}</button>`).join("");
const norm = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z' ]/g, " ").split(/\s+/).filter(Boolean);
const pintarFrase = (ok) => { const ws = RETO[nivelReto].split(" "); fr.innerHTML = ws.map((w, i) => ok ? `<span class="${ok[i] ? "ok" : "no"}">${w}</span>` : w).join(" "); };
selN.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; nivelReto = b.dataset.k; selN.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b)); pintarFrase(); res.textContent = ""; });
pintarFrase();
$("#retoOir").onclick = () => T.hablar(RETO[nivelReto], .9);
if (!T.Reconocer) {
  mic.disabled = true; mic.style.opacity = .4;
  res.textContent = "Tu navegador no deja usar el micrófono aquí. Prueba en Chrome o Edge, o escúchala y repítela en voz alta.";
} else {
  let rec = null;
  mic.onclick = () => {
    if (rec) { rec.stop(); return; }
    rec = new T.Reconocer(); rec.lang = "en-US"; rec.interimResults = true; rec.maxAlternatives = 3;
    mic.classList.add("oye"); mic.querySelector("span").textContent = "Te oigo"; res.textContent = "Habla ahora…";
    let ultimo = "";
    rec.onresult = (e) => { ultimo = [...e.results].map(r => r[0].transcript).join(" "); res.innerHTML = `Entendí: «<span class="en">${ultimo}</span>»`; };
    rec.onerror = (e) => { res.textContent = e.error === "not-allowed" ? "Necesitamos permiso para usar el micrófono. Revísalo en la barra del navegador." : "No te escuchamos bien. Inténtalo otra vez."; };
    rec.onend = () => {
      mic.classList.remove("oye"); mic.querySelector("span").textContent = "Hablar"; rec = null;
      if (!ultimo) return;
      const dichas = norm(ultimo), meta = norm(RETO[nivelReto]), bolsa = {};
      dichas.forEach(w => bolsa[w] = (bolsa[w] || 0) + 1);
      const ok = meta.map(w => bolsa[w] ? (bolsa[w]--, true) : false);
      const pct = Math.round(ok.filter(Boolean).length / meta.length * 100);
      pintarFrase(ok);
      const msg = pct >= 90 ? "¡Impecable! Tomaste la palabra." : pct >= 60 ? "Muy bien. Lo que quedó en gris es lo que afinamos en clase." : "Buen intento. Escúchala y vuelve a tomar la palabra.";
      res.innerHTML = `<b>${pct} %</b> &nbsp;${msg} <br><small>Entendí: «<span class="en">${ultimo}</span>»</small>`;
    };
    rec.start();
  };
}

/* ---------- H · Preguntas y visita ---------- */
$("#faqIni").innerHTML = [0, 5, 7, 2].map(i => T.FAQ[i]).map(f => `<details><summary>${f.p}<i aria-hidden="true"></i></summary><div class="resp">${f.r}</div></details>`).join("");
$("#visitaWa").href = T.wa("¡Hola, Tutor! Quiero agendar una clase de prueba de inglés.");
})();
