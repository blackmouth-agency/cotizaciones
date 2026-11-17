/* Semply · plan de estudios: aliado estratégico ADH Coaching (Certificación Internacional en Coaching Ontológico 2027).
   Fuente: «Pensum 2027.pdf» enviado por Sebas el 17-nov-2026. Sin precios (decisión de David). */
(function () {
  var host = document.getElementById('aliado'); if (!host) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var BRK = '<svg viewBox="0 0 100 90" aria-hidden="true"><use href="#brk"/></svg>';
  var IMG = '../assets/img/aliado/';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function d(i, paso) { return ' style="animation-delay:' + (i * (paso || 50)) + 'ms"'; }
  function burst(n, r1, r2) { var p = []; for (var i = 0; i < n * 2; i++) { var a = Math.PI * i / n - Math.PI / 2, r = i % 2 ? r2 : r1; p.push((Math.cos(a) * r).toFixed(2) + ',' + (Math.sin(a) * r).toFixed(2)); } return p.join(' '); }
  function romano(n) { return ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][n - 1]; }

  var A = {
    enfoques: [
      ['Ontológico', 'Parte de la Ontología del Lenguaje: el lenguaje no solo describe la realidad, también la crea. Aprendes a observar y transformar tus propias narrativas y las de tus clientes.'],
      ['Constructivista', 'El aprendizaje es un proceso activo de construcción de significados. Desarrollas la capacidad de reinterpretar y co-construir nuevas realidades con tus clientes.'],
      ['Sistémico', 'Personas y organizaciones son partes de sistemas más amplios. Aprendes a ver patrones, relaciones y dinámicas para intervenir teniendo en cuenta el todo.']
    ],
    valores: [
      ['Integridad', 'Coherencia entre lo que se piensa, se dice y se hace.'],
      ['Empatía', 'Conectar con las experiencias y emociones del otro.'],
      ['Responsabilidad social', 'Ser agentes de cambio positivo en la comunidad.'],
      ['Creatividad', 'Encontrar soluciones nuevas durante el proceso.'],
      ['Excelencia', 'Aprendizaje permanente y mejora continua.'],
      ['Inclusión', 'Respeto por la diversidad en todas sus formas.']
    ],
    objetivos: [
      'Comprender los principios de la Ontología del Lenguaje y aplicarlos en el proceso de coaching.',
      'Analizar las teorías del constructivismo para co-construir nuevas realidades en los procesos de cambio.',
      'Identificar dinámicas y patrones sistémicos en personas y organizaciones.',
      'Aplicar estrategias de intervención ontológicas, constructivistas y sistémicas en sesiones de coaching.',
      'Evaluar el impacto de las intervenciones con criterios de eficacia y ética profesional.',
      'Integrar teoría y práctica en un ejercicio profesional coherente.',
      'Desarrollar la autoobservación y la reflexión crítica sobre la propia práctica.',
      'Emplear el coaching ontológico en la gestión organizacional para lograr mejores resultados.'
    ],
    unidades: [
      ['Introductorio', ['Historia general del coaching: definición y origen', 'Raíces filosóficas y precursores del coaching', 'Evolución del coaching ontológico a lo largo del tiempo']],
      ['Ontología del lenguaje', ['¿Qué es y qué hace un coach? Fundamentos filosóficos, sociológicos y antropológicos', 'Aprendizaje y enemigos del aprendizaje', 'Teoría del observador: postulados y principios; transparencia y quiebre', 'Actos lingüísticos: afirmaciones, declaraciones, juicios', 'Modelo de aprendizaje de primer, segundo y tercer orden', 'Gestión general de las emociones', 'Gestión corporal y disposiciones corporales', 'Diseño de conversaciones y coordinación de acciones']],
      ['Introducción al coaching ontológico', ['Alcances y límites del coaching ontológico y del coach', 'Pilares epistemológicos: marco constructivista, aprendizaje ontológico y perspectiva sistémica', 'Diferencias con otras disciplinas: psicología, counseling, consultoría y mentoring', 'Narrativa y discursos históricos']],
      ['Coaching ontológico', ['Matriz de indagación básica y tipos de pregunta', 'Metodología de coaching y de una sesión de coaching']],
      ['Ética y coaching ontológico', ['Competencias profesionales', 'Comportamientos observables requeridos por la FICOP', 'La ética y la deontología en la práctica profesional', 'Código de ética de la FICOP']],
      ['Prácticas y coaching ontológico', ['Declaración de la incompetencia profesional y derivación a otros profesionales', 'Proceso de coaching ontológico', 'Identificación del punto de partida, diseño de la acción, ejecución y evaluación', 'Contrato y prácticas supervisadas']],
      ['Herramientas novedosas aplicadas al coaching ontológico', ['Aplicación de la inteligencia artificial en el coaching ontológico', 'Estrategias de primeros auxilios psicológicos para coaches']],
      ['Neurociencia', ['Introducción a la neurociencia']],
      ['Health coaching', ['Introducción a la nutrición moderna', 'La dieta del futuro: ayuno metabólico', 'Pilares para una salud integral']],
      ['Coaching organizacional', ['Coaching en la organización', 'Gestión del tiempo', 'Resolución de conflictos', 'Liderazgo y estilos de liderazgo', 'Coaching ejecutivo', 'Destrezas para delegar', 'Conversaciones en redes sociales y competencias gerenciales', 'Construyendo el líder-coach', 'Equipos que generan rentabilidad', 'Negociación']]
    ],
    horas: [
      [220, 'Clases por encuentro', 'Clases teóricas y prácticas.', '#F10E3B'],
      [88, 'Prácticas de coaching', 'Sesiones individuales, informes de sesión, coaching observado y transcripciones.', '#FFC225'],
      [60, 'Actividades en plataforma', 'Clases teóricas y prácticas en la plataforma virtual.', '#FFFFFF'],
      [28, 'Actividades varias', 'Webinars, proyecto social y otras actividades.', '#CFC8C5'],
      [20, 'Reuniones de supervisión', 'Acompañamiento del staff sobre tu práctica.', '#8E8788']
    ],
    fases: [
      ['Fase 1', 'Recibes coaching', 'Pasas como coachee por sesiones con los distintos coaches del staff y conoces estilos diferentes.'],
      ['Fase 2', 'Coacheas entre compañeros', 'Practicas con tus compañeros, observado por los coaches, y empiezas a desarrollar tu propio estilo.'],
      ['Fase 3', 'Coacheas a terceros', 'Haces coaching a personas externas, tutorado por el staff, que te señala qué observar y mejorar.']
    ],
    guias: [
      ['Ontológicas', 'Profundizas en el libro Ontología del Lenguaje con preguntas de comprensión y aplicación.'],
      ['Prácticas', 'Un mes de trabajo aplicando alguna de las distinciones vistas.'],
      ['De reflexión', 'Lecturas complementarias sobre las que escribes tus reflexiones.'],
      ['De autoobservación', 'Reflexionas sobre tus propios pensamientos, emociones y aprendizajes.']
    ],
    ejeTeorico: [
      ['Ontología del lenguaje', ['Trasfondo filosófico de la ontología del lenguaje', 'El escuchar: el lado oculto del lenguaje', 'Estados de ánimo', 'Diseño de conversaciones', 'Acción humana y lenguaje', 'Significación del coaching ontológico', 'Metodología del coaching', 'Territorio de aprendizaje', 'Momentos de una sesión de coaching', 'Ética y coaching', 'Abordajes corporales e intervenciones creativas', 'Timing', 'Indagación apreciativa']],
      ['Acercamiento al coaching organizacional', ['Coaching para equipos de alto desempeño', 'Estilos de liderazgo', 'Pensamiento estratégico', 'Gestión del cambio', 'Modelo Canvas']]
    ],
    competencias: [
      ['Comunicación efectiva', 'Escuchar activamente, preguntar y comunicarte con claridad y empatía, con role-playing y feedback constante.'],
      ['Observación y autoobservación', 'Identificar patrones, creencias limitantes y emociones, y mantener la presencia en tus intervenciones.'],
      ['Gestión emocional', 'Reconocer y gestionar tus emociones y ayudar a tus clientes a hacerlo, con mindfulness e inteligencia emocional.'],
      ['Diseño de intervenciones', 'Diseñar y ejecutar intervenciones de coaching adaptadas al contexto y los objetivos de cada cliente.'],
      ['Pensamiento sistémico', 'Ver cómo se relacionan los distintos aspectos de la vida de tus clientes y cómo influyen en su bienestar.']
    ],
    campos: [
      ['En la organización', 'Mejorar la comunicación interna, resolver conflictos y facilitar conversaciones difíciles en recursos humanos o al frente de equipos.'],
      ['Coaching individual', 'Acompañar a tus clientes como coach independiente a crear nuevas narrativas para alcanzar sus metas.'],
      ['En la educación', 'Diseñar y facilitar programas que promuevan el aprendizaje significativo y el pensamiento crítico.'],
      ['Liderazgo transformacional', 'Construir un estilo de liderazgo basado en la reflexión y la responsabilidad compartida.'],
      ['Transformación personal', 'Revisar tus propios patrones para decidir con más conciencia y construir relaciones más sanas.'],
      ['Bienestar y autogestión', 'Aunque no vayas a ejercer, gestionar mejor tu vida diaria, tu resiliencia y tu equilibrio.']
    ],
    ingreso: ['Edad mínima: 18 años', 'Bachillerato completo', 'Ficha de inscripción y firma del reglamento interno', 'Ficha médica', 'Entrevista de admisión'],
    certificar: ['80 % de asistencia a los encuentros presenciales', 'Promedio de evaluaciones aprobadas', 'Guías de estudio y tareas complementarias', 'Sesiones de coaching', 'Cuotas al día'],
    equipo: [
      ['ruben', 'Rubén Carrano', 'Director y CEO', ['Senior Coach Ontológico Profesional · FICOP #2850', 'Health coach', 'Máster en neurociencias', 'Empresario', 'Conferencista']],
      ['yuveli', 'Yuveli Jiménez', 'Directora de admisiones', ['Coach Ontológico Profesional', 'Técnica en mercadeo y ventas', 'Formación en tanatología', 'Bootcamp de inteligencia artificial', 'Formación en atención al cliente', 'Formación en marketing y publicidad']],
      ['lucy', 'Lucy Correa', 'Entrenadora de sede', ['Coach Ontológico Profesional · FICOP #8694', 'Terapeuta holística', 'Mastering Coaching Skills', 'Coach ejecutiva y organizacional', 'Gestión de empresas y mercadeo', 'Biodescodificación y constelaciones familiares', 'Empresaria']],
      ['alejandro', 'Alejandro López', 'Entrenador de sede', ['Coach Ontológico Profesional · FICOP #8710', 'Psicólogo', 'Diplomado en formación especializada en talento humano', 'Diplomado en estrategias operativas para el logro de resultados']],
      ['marysel', 'Marysel Arango', 'Entrenadora de sede', ['Coach Ontológico Profesional', 'Ingeniera industrial', 'Consultora organizacional', 'Coach espiritual', 'Terapeuta holística']],
      ['janneth', 'Janneth Patiño', 'Entrenadora de sede', ['Coach Ontológico Profesional', 'Profesional en mercadeo y publicidad', 'Diplomado en coaching gerencial', 'Diplomado en coaching empresarial']],
      ['william', 'William Sánchez', 'Entrenador de sede', ['Coach Ontológico Profesional', 'Tecnólogo en control de calidad de alimentos', 'Técnico en cooperativismo y economía solidaria', 'Empresario', 'Conferencista']],
      ['sonia', 'Sonia García', 'Entrenadora de sede', ['Coach Ontológico Profesional', 'Profesional en administración de empresas', 'Especialización en gerencia educativa', 'Diplomado en PNL', 'Diplomado en alta gerencia', 'Diplomado en coaching organizacional', 'Diplomado en neuropsicología']]
    ]
  };

  function lista(items, cls) { return '<ul class="' + (cls || 'al-li') + '">' + items.map(function (x, i) { return '<li' + d(i, 40) + '>' + BRK + '<span>' + x + '</span></li>'; }).join('') + '</ul>'; }

  var PANELES = [
    ['El programa', function () {
      return '<div class="al-grid2">' +
          '<blockquote class="al-quote"><small>Su misión</small><p>Despertar el potencial humano.</p><span>Formar coaches que conecten con su propio ser y con el otro, comprometidos con el bienestar colectivo, para facilitar procesos de transformación personal y social.</span></blockquote>' +
          '<div class="al-txt"><h3>Metodología experiencial ontológica</h3><p><b>Experiencial</b> porque se aprende viviendo situaciones y reflexionando sobre ellas. <b>Ontológica</b> porque trabaja sobre el SER: sobre cómo percibimos y describimos la realidad. Al intervenir en el lenguaje, la corporalidad y la emocionalidad cambia la manera de observar y, con ella, los resultados que obtenemos.</p>' +
          '<p>El coaching no es consejería: el coach no le dice al cliente qué hacer, lo acompaña para que él mismo se dé cuenta de lo que lo limita y encuentre sus propias respuestas.</p></div>' +
        '</div>' +
        '<h3 class="al-sub">Tres enfoques</h3><div class="al-cards c3">' + A.enfoques.map(function (e, i) { return '<article class="al-card"' + d(i, 70) + '><b class="al-n">0' + (i + 1) + '</b><h4>' + e[0] + '</h4><p>' + e[1] + '</p></article>'; }).join('') + '</div>' +
        '<h3 class="al-sub">Objetivos del programa</h3>' + lista(A.objetivos, 'al-li dos') +
        '<h3 class="al-sub">Valores</h3><div class="al-chips">' + A.valores.map(function (v, i) { return '<span' + d(i, 40) + '><b>' + v[0] + '</b>' + v[1] + '</span>'; }).join('') + '</div>';
    }],
    ['Las 10 unidades', function () {
      return '<div class="al-units"><div class="al-ulist" role="tablist" aria-label="Unidades del programa">' +
        A.unidades.map(function (u, i) { return '<button role="tab" data-u="' + i + '"><span class="c">' + romano(i + 1) + '</span><span class="n">' + u[0] + '</span></button>'; }).join('') +
        '</div><div class="al-ucard" aria-live="polite"></div></div>';
    }, function (p) {
      var card = $('.al-ucard', p), bs = $$('[data-u]', p);
      function pintar(i) {
        var u = A.unidades[i];
        bs.forEach(function (b) { b.setAttribute('aria-selected', +b.dataset.u === i); });
        card.innerHTML = '<span class="code">Unidad ' + romano(i + 1) + ' de X</span><h4>' + u[0] + '</h4>' + lista(u[1]) +
          '<div class="nextprev"><button data-go="-1"' + (i ? '' : ' disabled') + '>Anterior</button><button data-go="1"' + (i === 9 ? ' disabled' : '') + '>Siguiente unidad</button></div>';
        card.classList.remove('swap'); void card.offsetWidth; card.classList.add('swap');
        $$('[data-go]', card).forEach(function (b) { b.addEventListener('click', function () { pintar(i + (+b.dataset.go)); }); });
      }
      bs.forEach(function (b) { b.addEventListener('click', function () { pintar(+b.dataset.u); }); });
      pintar(0);
    }],
    ['Las 416 horas', function () {
      return '<div class="al-bar" aria-hidden="true">' + A.horas.map(function (h) { return '<div style="flex-grow:' + h[0] + ';background:' + h[3] + '" title="' + h[1] + ': ' + h[0] + ' h"><span>' + h[0] + ' h</span></div>'; }).join('') + '</div>' +
        '<div class="al-hrows">' + A.horas.map(function (h, i) { return '<div class="al-hrow"' + d(i, 60) + '><span class="hv"><i style="background:' + h[3] + '"></i>' + h[0] + ' h</span><div><b>' + h[1] + '</b><p>' + h[2] + '</p></div></div>'; }).join('') + '</div>' +
        '<p class="al-nota"><b>416 horas en total</b>, cursadas de forma continua durante 10 meses.</p>';
    }],
    ['Modalidad', function () {
      return '<div class="al-cards c2">' +
          '<article class="al-card al-mod"' + d(0) + '><small>Opción 1</small><h4>Presencial</h4><p class="al-big">Un fin de semana al mes</p><p>Sábado y domingo de 9:00 a. m. a 6:00 p. m., en las fechas acordadas. Si alguna fecha cambia, se acuerda con tres meses de anticipación. Se acepta la ausencia de un fin de semana al año.</p></article>' +
          '<article class="al-card al-mod"' + d(1) + '><small>Opción 2</small><h4>Virtual</h4><p class="al-big">100 % en vivo por Zoom</p><p>Una vez a la semana, de 6:00 a 8:30 p. m. (hora de Colombia), y un sábado al mes con 4 horas de clase. No son videos grabados.</p></article>' +
        '</div>' +
        '<div class="al-plat">' + BRK + '<p><b>Plataforma virtual en las dos modalidades.</b> Ahí encuentras el material de cada encuentro, bibliografía complementaria, tareas en línea y foros interactivos.</p></div>';
    }],
    ['Prácticas', function () {
      return '<p class="al-intro">Un sistema de <b>coaching observado</b>: practicas desde el primer mes y el staff te acompaña hasta saber si estás listo para certificarte.</p>' +
        '<ol class="al-fases">' + A.fases.map(function (f, i) { return '<li' + d(i, 90) + '><div class="al-seal"><svg viewBox="-50 -50 100 100"><polygon points="' + burst(14 + i * 2, 50, 39) + '"/></svg><span>' + (i + 1) + '</span></div><small>' + f[0] + '</small><h4>' + f[1] + '</h4><p>' + f[2] + '</p></li>'; }).join('') + '</ol>' +
        '<div class="al-grid2 al-ejes"><div><h3 class="al-sub">Eje teórico</h3>' + A.ejeTeorico.map(function (e) { return '<h4 class="al-h4">' + e[0] + '</h4><div class="al-tags">' + e[1].map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>'; }).join('') + '</div>' +
          '<div><h3 class="al-sub">Eje práctico</h3><p class="al-p">Coloquios, reflexiones con fragmentos de películas y, en el mes entre cada encuentro, una guía de estudio en la plataforma:</p>' +
          '<div class="al-guias">' + A.guias.map(function (g, i) { return '<div' + d(i, 50) + '><b>Guías ' + g[0].toLowerCase() + '</b><p>' + g[1] + '</p></div>'; }).join('') + '</div></div></div>';
    }],
    ['Certificación', function () {
      return '<div class="al-cert">' +
          '<div class="al-cert-t"><small>Te certificas como</small><h3>Coach Ontológico Profesional</h3>' +
            '<p>El certificado lo otorga <b>ADH Coaching</b>, certificado por <b>CEL Center of Education and Leadership</b> y avalado por <b>Florida Global University</b>.</p>' +
            '<p class="al-opc">' + BRK + '<span><b>Opcional, con costo adicional:</b> certificado internacional apostillado por La Haya, emitido en EE. UU., impreso y sellado en original, con el contenido académico, fechas, horas y validación de autenticidad.</span></p>' +
            '<img class="al-sellos" src="' + IMG + 'cel-fgu.png" alt="Certificado por CEL Center of Education and Leadership y avalado por Florida Global University" loading="lazy"></div>' +
          '<figure class="al-dip"><img src="' + IMG + 'diploma.jpg" alt="Ejemplo del diploma de Florida Global University y ADH Coaching" loading="lazy"><figcaption>Ejemplo del diploma</figcaption></figure>' +
        '</div>' +
        '<div class="al-cards c2 al-req">' +
          '<article class="al-card"' + d(0) + '><h4>Requisitos de ingreso</h4>' + lista(A.ingreso) + '</article>' +
          '<article class="al-card"' + d(1) + '><h4>Requisitos para certificarte</h4>' + lista(A.certificar) + '</article>' +
        '</div>' +
        '<h3 class="al-sub">Lo que sabrás hacer</h3><div class="al-cards c5">' + A.competencias.map(function (c, i) { return '<article class="al-card"' + d(i, 50) + '><h4>' + c[0] + '</h4><p>' + c[1] + '</p></article>'; }).join('') + '</div>' +
        '<h3 class="al-sub">Dónde lo aplicas</h3><div class="al-cards c3">' + A.campos.map(function (c, i) { return '<article class="al-card"' + d(i, 50) + '><b class="al-n">0' + (i + 1) + '</b><h4>' + c[0] + '</h4><p>' + c[1] + '</p></article>'; }).join('') + '</div>';
    }],
    ['Equipo', function () {
      return '<p class="al-intro">El staff de ADH Coaching: coaches ontológicos profesionales que acompañan los encuentros, las prácticas y la supervisión. Toca cada tarjeta para ver su formación.</p>' +
        '<div class="al-team">' + A.equipo.map(function (p, i) {
          return '<button class="al-pers" aria-expanded="false"' + d(i, 50) + '><img src="' + IMG + 'equipo-' + p[0] + '.jpg" alt="' + p[1] + '" loading="lazy" width="480" height="600"><span class="al-pinfo"><b>' + p[1] + '</b><small>' + p[2] + '</small></span><span class="al-pcv">' + p[3].map(function (x) { return '<i>' + x + '</i>'; }).join('') + '</span></button>';
        }).join('') + '</div>';
    }, function (p) {
      $$('.al-pers', p).forEach(function (b) { b.addEventListener('click', function () { var on = b.getAttribute('aria-expanded') !== 'true'; b.setAttribute('aria-expanded', on); }); });
    }]
  ];

  var tabs = $('#al-tabs', host), panel = $('#al-panel', host);
  tabs.innerHTML = PANELES.map(function (t, i) { return '<button role="tab" aria-selected="' + (i === 0) + '" data-t="' + i + '">' + t[0] + '</button>'; }).join('');
  var bs = $$('button', tabs);
  function mostrar(i, ir) {
    bs.forEach(function (b, j) { b.setAttribute('aria-selected', i === j); });
    var b = bs[i]; tabs.scrollTo && tabs.scrollTo({ left: b.offsetLeft - tabs.clientWidth / 2 + b.offsetWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
    panel.innerHTML = '<div class="al-in">' + PANELES[i][1]() + '</div>';
    if (PANELES[i][2]) PANELES[i][2](panel);
    if (ir) window.scrollTo({ top: tabs.getBoundingClientRect().top + scrollY - 80, behavior: reduce ? 'auto' : 'smooth' });
  }
  bs.forEach(function (b, i) { b.addEventListener('click', function () { mostrar(i); }); });
  $$('[data-al]', host).forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); mostrar(+a.dataset.al, true); }); });
  mostrar(0);
})();
