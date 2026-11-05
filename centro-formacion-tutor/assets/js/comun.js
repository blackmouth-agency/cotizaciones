/* Centro de Formación Tutor · datos y piezas comunes */
(() => {
const T = window.TUTOR = {};

/* Datos de contacto: los del cliente van aquí cuando los confirme. */
T.CONTACTO = {
  whatsapp: "573000000000",      // PENDIENTE: número real
  whatsappVisible: "300 000 0000",
  instagram: "",                 // PENDIENTE
  correo: "",                    // PENDIENTE
  sede: "",                      // PENDIENTE: dirección
  ciudad: "Valle del Cauca",     // PENDIENTE: ciudad exacta
  horario: "",                   // PENDIENTE
  licencia: "",                  // PENDIENTE: acto administrativo de licencia
  registro: "",                  // PENDIENTE: número del acto de registro de los programas
  secretaria: ""                 // PENDIENTE: Secretaría de Educación que vigila
};

T.PASOS = [
  { n:1, id:"recuerda",  nombre:"Recuerda",        min:10, en:"What did we say last time?",
    hace:"En parejas y sin libro, recuperas lo que aprendiste en las clases anteriores: frases, palabras, una estructura. Nada nuevo todavía.",
    porque:"Recordar a propósito, con días de por medio, es lo que hace que una palabra se quede contigo." },
  { n:2, id:"preparate", nombre:"Prepárate",       min:15, en:"Here's how they say it.",
    hace:"Ves o escuchas un modelo real de la situación del día y anotas las frases clave en bloques. Sabes desde el principio qué vas a poder hacer al salir.",
    porque:"Llegar a la tarea con las frases a mano baja la presión y sube la calidad de lo que dices." },
  { n:3, id:"resuelve",  nombre:"Resuelve",        min:35, en:"Let's figure this out.",
    hace:"Con tu grupo resuelves una tarea real: decidir, planear, negociar, explicar algo a alguien. El profe circula, escucha y anota; no interrumpe.",
    porque:"Usar el inglés para lograr algo, no para repetirlo, es el corazón del aprendizaje basado en tareas." },
  { n:4, id:"palabra",   nombre:"Toma la palabra", min:15, en:"May I have the floor?",
    hace:"Pasas al frente a presentar lo que resolvió tu grupo. Los demás escuchan con una pregunta asignada para ti.",
    porque:"Hablar frente a otros, con alguien que te pregunta, es lo que más se parece a la vida real. Aquí pasa en todas las clases." },
  { n:5, id:"afina",     nombre:"Afina",           min:25, en:"Let's polish that.",
    hace:"Trabajas los 3 a 5 errores que salieron en tu propia tarea: explicación corta y clara, práctica, corrección con pistas y pronunciación.",
    porque:"La explicación explícita de tus propios errores funciona mejor que solo exponerte al idioma, sobre todo en adultos." },
  { n:6, id:"repite",    nombre:"Repite y cierra", min:20, en:"One more time, even better.",
    hace:"Repites la tarea con otro compañero o con un giro, marcas lo que ya puedes hacer y guardas una evidencia en tu portafolio.",
    porque:"La segunda vez sale mejor, y lo notas. Ese avance que se ve es lo que te hace volver." }
];

T.NIVELES = [
  { id:"A1", nombre:"Primeras palabras", color:"#FFD6D0", texto:"#1F2120", horas:"≈ 90–100",
    puede:["Presentarte y presentar a otros.","Preguntar y responder datos personales: dónde vives, qué tienes, a quién conoces.","Entender frases muy básicas si te hablan despacio."],
    frase:"Hi, I'm Laura. I live in Cali.", examen:"Aptis · MET Go! (menores)" },
  { id:"A2", nombre:"Me defiendo", color:"#FF8F80", texto:"#1F2120", horas:"180–200",
    puede:["Comprar, pedir indicaciones y resolver trámites sencillos.","Hablar de tu familia, tu trabajo o tu estudio.","Intercambiar información sobre temas que conoces."],
    frase:"Could you tell me where the station is?", examen:"Cambridge A2 Key" },
  { id:"B1", nombre:"Me explico", color:"#FF4A36", texto:"#1F2120", horas:"350–400",
    puede:["Resolver casi cualquier situación de un viaje.","Contar una experiencia o un plan y justificar tu opinión.","Entender lo esencial de temas de trabajo, estudio u ocio."],
    frase:"I think we should go, because it's cheaper.", examen:"Cambridge B1 Preliminary" },
  { id:"B2", nombre:"Opino y debato", color:"#FF0000", texto:"#1F2120", horas:"500–600",
    puede:["Conversar con fluidez con hablantes nativos, sin tensión para nadie.","Explicar un punto de vista con ventajas y desventajas.","Entender lo principal de textos técnicos de tu campo."],
    frase:"That's a fair point, but have you considered the cost?", examen:"Cambridge B2 First · IELTS · TOEFL iBT" },
  { id:"C1", nombre:"Sin buscar palabras", color:"#8E0007", texto:"#FFFFFF", horas:"700–800",
    puede:["Expresarte con fluidez y espontaneidad, sin buscar las palabras.","Usar el inglés con eficacia en lo social, lo académico y lo laboral.","Escribir textos claros y bien organizados sobre temas complejos."],
    frase:"Let me put it another way, so it's crystal clear.", examen:"Cambridge C1 Advanced · IELTS 6,5–7" }
];

T.PROGRAMAS = [
  { id:"adolescentes", nombre:"Adolescentes", sub:"Bachillerato", img:"assets/img/adolescentes.webp",
    gancho:"Del colegio al mundo, sin miedo a abrir la boca.",
    objetivo:"Prepararse para el Saber 11, las pruebas de admisión y un primer certificado internacional.",
    cambia:["Más juego y estructura al recordar.","Tareas sobre temas de su edad.","Primero toman la palabra en grupos pequeños; después, frente a toda la clase.","Corrección oral frecuente: a esta edad rinde más."],
    evalua:"Lista de lo que ya pueden hacer e informe a los padres cada periodo. Simulacros de lectura tipo Saber 11.",
    examen:"A2 Key y B1 Preliminary for Schools · MET Go!", horario:"Tarde entre semana o sábado" },
  { id:"adultos", nombre:"Adultos", sub:"Y profesionales", img:"assets/img/adultos.webp",
    gancho:"El inglés que te pidieron en la entrevista, por fin en tu boca.",
    objetivo:"Trabajo, ascensos, viajes y estudios en el exterior.",
    cambia:["Más tiempo en Afina: la explicación clara rinde en adultos.","Tareas sacadas de tu trabajo y de tu vida.","Desde B1, 5–10 minutos de preparación en casa antes de clase."],
    evalua:"Portafolio personal con tus turnos y simulacros del examen que necesites.",
    examen:"B2 First · C1 Advanced · IELTS · TOEFL iBT · MET", horario:"Noche entre semana o sábado" },
  { id:"empresas", nombre:"Empresas", sub:"Equipos y cargos", img:"assets/img/empresas.webp",
    gancho:"Tu equipo, resolviendo en inglés lo que hoy resuelve en español.",
    objetivo:"Que cada cargo resuelva en inglés las situaciones reales de su trabajo: reuniones, llamadas, correos, clientes.",
    cambia:["Diagnóstico de necesidades por cargo antes de empezar.","Tareas con situaciones y documentos reales de la empresa.","Contenido del sector de tu empresa."],
    evalua:"Prueba de ubicación del grupo e informe por persona para Recursos Humanos.",
    examen:"Aptis · MET", horario:"En la sede de la empresa o en Tutor" }
];

T.FAQ = [
  { t:"Empezar", p:"¿Puedo empezar desde cero?", r:"Sí. El nivel A1 es para quien no habla nada todavía. Si ya sabes algo, la prueba de nivel te ubica para que no repitas lo que ya sabes." },
  { t:"Empezar", p:"¿Cómo sé en qué nivel estoy?", r:"Haz la prueba de nivel de esta página (unos 10 minutos). Te da un nivel estimado; en la sede lo confirmamos con una conversación corta." },
  { t:"Método", p:"¿Las clases son en inglés?", r:"Desde A2, sí. En A1 hay apoyo en español cuando hace falta, para que nadie se pierda." },
  { t:"Método", p:"¿Qué es «tomar la palabra»?", r:"Es el paso 4 de cada clase: pasas al frente a presentar lo que resolvió tu grupo, y alguien te hace una pregunta. Al principio en grupos pequeños; con el tiempo, frente a todos." },
  { t:"Método", p:"¿Ven gramática?", r:"Sí, y de forma explícita. La diferencia es que la vemos a partir de los errores que salieron en tu propia tarea, no de una lista de reglas sueltas." },
  { t:"Niveles", p:"¿Cuánto tiempo toma pasar de nivel?", r:"Depende de cada persona y de cuántas horas estudies. Como referencia internacional, Cambridge calcula unas 180–200 horas guiadas acumuladas para llegar a A2 y 500–600 para B2. Desconfía de quien te prometa inglés en tres meses." },
  { t:"Niveles", p:"¿Hasta qué nivel llegan?", r:"Hasta C1, el nivel en el que te expresas con fluidez en lo social, lo académico y lo laboral." },
  { t:"Certificados", p:"¿Me dan un título?", r:"No: ningún instituto de idiomas da títulos. Los programas de idiomas de educación para el trabajo entregan un certificado de conocimientos académicos y no conducen a título profesional." },
  { t:"Certificados", p:"¿Me certifican el nivel internacional?", r:"Te preparamos para el examen de tu nivel (Cambridge, IELTS, TOEFL, Aptis, MET). El certificado internacional lo entrega el organismo que hace el examen." },
  { t:"Certificados", p:"¿Me sirve para el Saber 11?", r:"Sí te prepara: la prueba de inglés del Saber 11 mide lectura y uso del idioma, y eso lo trabajamos con simulacros. Ojo: un B1 del ICFES no equivale a un B1 completo, porque esa prueba no mide la conversación." },
  { t:"Empresas", p:"¿Pueden dar las clases en nuestra empresa?", r:"Sí, la idea es poder hacerlo en la sede de la empresa o en Tutor. Escríbenos y armamos el diagnóstico de tu equipo." },
  { t:"Sede y horarios", p:"¿Dónde queda Tutor?", r:"<span class='pend' title='Dato por confirmar con el cliente'>Dirección de la sede por confirmar</span>." },
  { t:"Sede y horarios", p:"¿Qué horarios tienen?", r:"La propuesta es tarde entre semana o sábado para adolescentes y noche entre semana o sábado para adultos. <span class='pend' title='Dato por confirmar con el cliente'>Horarios exactos por confirmar</span>." },
  { t:"Sede y horarios", p:"¿Cuánto cuesta?", r:"<span class='pend' title='Dato por confirmar con el cliente'>Precios por confirmar</span>. Escríbenos por WhatsApp y te contamos los planes vigentes." }
];

/* WhatsApp con mensaje armado */
T.wa = (msg = "¡Hola, Tutor! Quiero información sobre los cursos de inglés.") =>
  `https://wa.me/${T.CONTACTO.whatsapp}?text=${encodeURIComponent(msg)}`;

/* Voz en inglés (Web Speech API) */
let voz = null;
const elegirVoz = () => {
  const vs = speechSynthesis.getVoices();
  voz = vs.find(v => /en-GB/i.test(v.lang) && /natural|online|google/i.test(v.name)) ||
        vs.find(v => /en-US/i.test(v.lang) && /natural|online|google/i.test(v.name)) ||
        vs.find(v => /^en/i.test(v.lang)) || null;
};
if ("speechSynthesis" in window) { elegirVoz(); speechSynthesis.onvoiceschanged = elegirVoz; }
T.hablar = (txt, rate = .95) => {
  if (!("speechSynthesis" in window)) return false;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(txt); u.lang = voz ? voz.lang : "en-GB"; if (voz) u.voice = voz; u.rate = rate;
  speechSynthesis.speak(u); return u;
};
T.Reconocer = window.SpeechRecognition || window.webkitSpeechRecognition || null;

T.reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;

const ICO = {
  wa:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z"/></svg>',
  flecha:'<svg class="flecha" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>'
};
T.ICO = ICO;

/* cabecera, panel móvil, pie y botón flotante */
const pagina = document.body.dataset.pagina || "";
const NAV = [["metodo.html","El método","metodo"],["niveles.html","Niveles","niveles"],["programas.html","Programas","programas"],["preguntas.html","Preguntas","preguntas"]];
const cab = document.createElement("header");
cab.className = "cab";
cab.innerHTML = `<div class="cab__in">
  <a class="cab__logo" href="index.html" aria-label="Centro de Formación Tutor, inicio"><img src="assets/logo/logo-color.svg" alt="Centro de Formación Tutor" width="150" height="90"></a>
  <nav class="cab__nav" aria-label="Principal">${NAV.map(([h,t,k]) => `<a href="${h}"${k===pagina?' aria-current="page"':""}>${t}</a>`).join("")}</nav>
  <a class="btn" href="prueba.html">Prueba de nivel ${ICO.flecha}</a>
  <button class="cab__menu" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span><span></span></button>
</div>`;
document.body.prepend(cab);
const panel = document.createElement("nav");
panel.className = "panel"; panel.setAttribute("aria-label", "Menú");
panel.innerHTML = `<a href="index.html">Inicio</a>${NAV.map(([h,t]) => `<a href="${h}">${t}</a>`).join("")}<a href="inscripcion.html">Inscríbete</a><a class="btn" href="prueba.html">Haz la prueba de nivel ${ICO.flecha}</a>`;
cab.after(panel);
const bMenu = cab.querySelector(".cab__menu");
bMenu.addEventListener("click", () => {
  const ab = document.documentElement.classList.toggle("menu-abierto");
  bMenu.setAttribute("aria-expanded", ab); bMenu.setAttribute("aria-label", ab ? "Cerrar menú" : "Abrir menú");
});
let yPrev = 0;
addEventListener("scroll", () => {
  const y = scrollY;
  cab.classList.toggle("solida", y > 30);
  cab.classList.toggle("oculta", y > 400 && y > yPrev && !document.documentElement.classList.contains("menu-abierto"));
  yPrev = y;
}, { passive:true });

const C = T.CONTACTO;
const pend = (t) => `<span class="pend" title="Dato por confirmar con el cliente">${t}</span>`;
const pie = document.createElement("footer");
pie.className = "pie";
pie.innerHTML = `<div class="envoltura">
  <div class="pie__grid">
    <div><img class="pie__logo" src="assets/logo/logo-blanco.svg" alt="Centro de Formación Tutor" width="260" height="156"><p style="margin-top:22px;color:#B9BBBA;max-width:34ch">Inglés presencial de A1 a C1 para adolescentes, adultos y empresas. <span class="en" style="color:#fff">Take the floor.</span></p></div>
    <div><h4>Aprende</h4><ul><li><a href="metodo.html">El método</a></li><li><a href="niveles.html">Niveles A1–C1</a></li><li><a href="programas.html">Programas</a></li><li><a href="prueba.html">Prueba de nivel</a></li></ul></div>
    <div><h4>Contacto</h4><ul><li><a class="wa" href="${T.wa()}" target="_blank" rel="noopener">WhatsApp ${C.whatsappVisible}</a></li><li>${C.correo || pend("Correo por confirmar")}</li><li>${C.instagram ? `<a href="${C.instagram}" target="_blank" rel="noopener">Instagram</a>` : pend("Instagram por confirmar")}</li></ul></div>
    <div><h4>Sede</h4><ul><li>${C.sede || pend("Dirección por confirmar")}</li><li>${C.ciudad}</li><li>${C.horario || pend("Horario por confirmar")}</li><li><a href="inscripcion.html">Inscríbete</a></li></ul></div>
  </div>
  <div class="pie__gigante" aria-hidden="true"><div class="pie__cinta">${"<span>Take the floor.</span><span class=\"es\">Toma la palabra.</span>".repeat(4)}</div></div>
  <div class="pie__legal">
    <p>Institución de Educación para el Trabajo y el Desarrollo Humano. Licencia de funcionamiento: ${C.licencia || pend("por confirmar")}. Registro de programas: ${C.registro || pend("por confirmar")}. Certificado que se otorga: certificado de conocimientos académicos, referenciado al Marco Común Europeo (MCER). Los programas no conducen a título profesional. Inspección y vigilancia: ${C.secretaria || pend("Secretaría de Educación por confirmar")}.</p>
    <p>© ${new Date().getFullYear()} Centro de Formación Tutor · Diseño y desarrollo: BLACKMOUTH</p>
  </div>
</div>`;
document.body.append(pie);
const flot = document.createElement("a");
flot.className = "wa-flot"; flot.href = T.wa(); flot.target = "_blank"; flot.rel = "noopener"; flot.setAttribute("aria-label", "Escríbenos por WhatsApp");
flot.innerHTML = ICO.wa;
document.body.append(flot);

/* aparición con el scroll */
const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visto"); io.unobserve(e.target); } }), { rootMargin:"0px 0px -8% 0px" });
T.observar = (root = document) => root.querySelectorAll(".rev:not(.visto)").forEach(el => io.observe(el));
T.observar();

/* scroll suave */
if (window.Lenis && !T.reducido) {
  const lenis = T.lenis = new Lenis({ lerp:.11, smoothWheel:true });
  if (window.gsap && window.ScrollTrigger) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
  } else { const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
}
if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

/* palabras que aparecen como dichas en voz alta */
T.dividir = (el) => {
  if (el.dataset.dividido) return el.querySelectorAll(".pal");
  const txt = el.textContent.trim().split(/\s+/);
  el.innerHTML = txt.map(w => `<span class="pal" style="display:inline-block">${w}</span>`).join(" ");
  el.dataset.dividido = 1;
  return el.querySelectorAll(".pal");
};
})();
