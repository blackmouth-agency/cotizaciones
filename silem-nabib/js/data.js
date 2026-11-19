// Contenido del recorrido. Cada texto tiene versión humana (h) y de ingeniero (e).

export const GH = 'https://github.com/SilemNabib';

export const PROJECTS = [
  {
    id: 'agenda', cab: 1, title: 'Agenda de citas', kind: 'SaaS · en producción',
    year: '2026', role: 'Diseño, backend, frontend y despliegue',
    h: 'Una plataforma para que cualquier negocio reciba citas por internet sin cruces: sedes, horarios, empleados, bloqueos, avisos por correo y políticas de cancelación. Antes de programar escribió las 35 reglas del negocio, y la app ya está en línea.',
    e: 'Next.js 16 sobre Cloudflare Workers (OpenNext), PostgreSQL en Neon con Drizzle (17 migraciones), autenticación con Clerk, correos con React Email, archivos en R2. 133 archivos de pruebas con Vitest, PRD de 35 reglas de negocio y sistema de diseño documentado.',
    stats: [['35', 'reglas de negocio'], ['17', 'migraciones'], ['133', 'archivos de pruebas']],
    chips: ['Next.js', 'TypeScript', 'Cloudflare Workers', 'PostgreSQL', 'Drizzle', 'Clerk', 'Vitest'],
    live: 'https://agenda-citas.silemnabib.workers.dev', repo: GH + '/appointment-scheduler',
    url: 'proyectos/agenda/index.html', note: 'La app real bloquea los marcos externos; esta es su vista por dentro.',
    shots: ['agenda-in'],
  },
  {
    id: 'preanest', cab: 0, title: 'Modelo predictivo preanestésico', kind: 'Proyecto de grado · ICESI + Fundación Valle del Lili',
    year: '2026', role: 'Equipo de 3: María Alejandra Mantilla, Silem Nabib y Andrés David Parra',
    h: 'Un sistema que ayuda a la clínica a saber qué pacientes necesitan una valoración antes de la anestesia. Aprendió de casi 31.000 casos y, además de dar la probabilidad, explica por qué decidió lo que decidió.',
    e: 'Clasificador XGBoost calibrado (isotónico) entrenado con 30.962 casos y 80 variables. Pipeline orquestado en Airflow, artefactos .joblib + manifiesto como contrato, API REST en FastAPI con Docker y explicabilidad por SHAP. ROC-AUC 0,861 y recall 0,853 con umbral optimizado por F2.',
    stats: [['0,861', 'ROC-AUC'], ['0,853', 'recall'], ['30.962', 'casos']],
    chips: ['Python', 'XGBoost', 'SHAP', 'Airflow', 'FastAPI', 'Docker'],
    live: 'https://silemnabib.github.io/predictive-screening-preanesthesia-presentation/', repo: GH + '/predictive-screening-preanesthesia-presentation',
    url: 'proyectos/predictive-screening-preanesthesia-presentation/index.html', note: 'Presentación navegable: usa las flechas del teclado.',
    shots: ['preanest-1', 'preanest-problema', 'preanest-arquitectura', 'preanest-metricas', 'preanest-shap'],
  },
  {
    id: 'market', cab: 2, title: 'Market Basket Analytics', kind: 'Analítica de datos · con Rafaela Ruiz',
    year: '2026', role: 'ETL, modelos y despliegue',
    h: 'Más de un millón de compras de un supermercado colombiano convertidas en respuestas: qué se vende, quién compra, qué se lleva junto y qué recomendarle a cada cliente.',
    e: 'ETL en Python/Pandas sobre 1.108.951 transacciones (10,6 M ítems, 4 tiendas). Segmentación K-Means en 4 perfiles, 3,8 M reglas de asociación y similitud coseno. Streamlit + FastAPI, Docker y Google Cloud Run con Cloud Storage.',
    stats: [['1.108.951', 'compras'], ['131.186', 'clientes'], ['4', 'perfiles']],
    chips: ['Python', 'Pandas', 'Scikit-learn', 'FastAPI', 'Docker', 'Cloud Run'],
    repo: GH + '/market-basket-analytics',
    url: 'proyectos/market/index.html', note: 'Resultados tomados de su informe técnico.',
    shots: ['market-in', 'top10products', 'elbow', 'market-diagrama'],
  },
  {
    id: 'ceedi', cab: 1, title: 'CEEDi · Universidad Autónoma de Occidente', kind: 'Propuesta de diseño y prototipo',
    year: '2026', role: 'Arquitectura de contenido, diseño y desarrollo',
    h: 'Una propuesta completa para el micrositio del Centro de Excelencia Educativa Digital de la UAO: ocho páginas navegables para que los profesores encuentren formación, recursos y acompañamiento.',
    e: 'Prototipo estático multipágina generado con un build propio en Node (contenido separado del marcado en _src), respetando la identidad institucional de la UAO. Publicado en GitHub Pages.',
    stats: [['8', 'páginas'], ['1', 'build propio']],
    chips: ['HTML', 'CSS', 'JavaScript', 'Node', 'GitHub Pages'],
    live: 'https://silemnabib.github.io/ceedi-uao-design-proposal/', repo: GH + '/ceedi-uao-design-proposal',
    url: 'proyectos/ceedi-uao-design-proposal/index.html', note: 'Prototipo completo: navega por sus ocho páginas.',
    shots: ['ceedi-home', 'ceedi-formacion', 'ceedi-recursos', 'ceedi-cultura', 'ceedi-solicita'],
  },
  {
    id: 'tribunal', cab: 0, title: 'Tribunal Ético de Enfermería', kind: 'Prototipo web · Región Suroccidental',
    year: '2026', role: 'Diseño y desarrollo',
    h: 'La nueva cara de un tribunal que protege el ejercicio de la enfermería en seis departamentos: presentar una queja paso a paso, formación ética, eventos y comunicados.',
    e: 'SPA en React (JSX compilado en el navegador) con páginas de inicio, queja guiada, formación y eventos; video de fondo e identidad de marca aplicada. Publicado en GitHub Pages.',
    stats: [['6', 'departamentos'], ['4', 'secciones']],
    chips: ['React', 'JavaScript', 'CSS', 'GitHub Pages'],
    live: 'https://silemnabib.github.io/tribunal-etico/', repo: GH + '/tribunal-etico',
    url: 'proyectos/tribunal-etico/index.html', note: 'Sitio en React: prueba el menú y el formulario de queja.',
    shots: ['tribunal-home'],
  },
  {
    id: 'refil', cab: 2, title: 'Refil', kind: 'Emprendimiento · pitch y landing',
    year: '2026', role: 'Pitch deck y sitio',
    h: 'Una idea de negocio para limpiar la casa sin llenarla de plástico: productos de aseo recargables pedidos por WhatsApp. Silem armó el pitch y la página de venta.',
    e: 'Dos piezas publicadas en GitHub Pages: un deck navegable con teclado (deck-stage propio) y una landing responsive con catálogo y flujo de pedido por WhatsApp.',
    stats: [['~40 %', 'del precio es empaque'], ['2', 'sitios']],
    chips: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
    live: 'https://silemnabib.github.io/refill-reborn/', live2: 'https://silemnabib.github.io/mad/', repo: GH + '/refill-reborn',
    url: 'proyectos/refill-reborn/index.html', alt: ['Landing', 'proyectos/mad/index.html'], altMain: 'Pitch', note: 'Pitch con flechas del teclado; la landing es otra pestaña.',
    shots: ['refill-1', 'refill-2', 'refill-4', 'mad-home', 'mad-1'],
  },
];

export const JOBS = [
  {
    id: 'icesi', shop: 'shop-icesi', sign: 'ICESI', color: '#7cc4ff',
    when: 'Nov. 2023 – jun. 2026', title: 'Universidad ICESI', role: 'Monitor en Syri Multimedios y asistente de profesor',
    h: 'Dos años y medio siendo el que llega antes: abría los salones, dejaba los equipos listos y resolvía las fallas en plena clase. Además acompañó a estudiantes de primero a cuarto semestre en lógica, algoritmos y bases de datos.',
    e: 'Preparación y soporte de equipos audiovisuales en aulas, con diagnóstico de fallas en vivo. Asistencia docente (Departamento TIC) en pensamiento lógico, algoritmos y bases de datos, semestres 1 a 4.',
    gain: 'Explica lo técnico sin hacer sentir mal a nadie.',
  },
  {
    id: 'pistis', shop: 'shop-pistis', sign: 'PISTIS', color: '#ffd27a',
    when: 'Nov. 2025 – feb. 2026', title: 'Pistis', role: 'Desarrollador full stack',
    h: 'Una app que va del servidor al bolsillo: trabajó en lo que pasa detrás, en la versión web, en la app para celulares y en los correos que llegan solos.',
    e: 'Backend en NestJS con PostgreSQL, frontend en Next.js, app móvil en Flutter, correos transaccionales con Resend y despliegue en Google Cloud.',
    gain: 'Entiende el camino completo de una función, de la base de datos a la tienda de apps.',
  },
  {
    id: 'methodus', shop: 'shop-methodus', sign: 'METHODUS', color: '#9dff8a',
    when: 'Ene. 2026 – hoy', title: 'Methodus', role: 'Desarrollador full stack',
    h: 'Una plataforma para que estudiantes colombianos se preparen para el ICFES Saber 11. Se sienta con el cliente a definir qué necesita, reparte las tareas con el equipo y construye las evaluaciones, el banco de preguntas y el registro del tiempo de estudio.',
    e: 'Épicas e historias de usuario definidas con el cliente y repartidas entre backend, frontend, nube y SQL. Evaluaciones, gestión de preguntas y seguimiento de tiempo de estudio en Spring Boot con migraciones en Flyway; pantallas en Next.js y TypeScript.',
    gain: 'Traduce lo que pide el cliente a tareas que el equipo puede construir.',
  },
  {
    id: 'banco', shop: 'shop-banco', sign: 'BANCO DE OCCIDENTE', color: '#ff8ac8',
    when: 'Jul. 2026 – hoy', title: 'Banco de Occidente', role: 'Profesional en entrenamiento · Gerencia de Tecnología y Soluciones',
    h: 'En un banco, todo el mundo le pide algo a tecnología. Él recibe esas solicitudes, ayuda a decidir cuáles van primero y se asegura de que las áreas se entiendan entre ellas.',
    e: 'Evaluación y priorización de requerimientos a TI, acompañamiento en gestión de la demanda y procesos administrativos de TI, y coordinación entre áreas para validar solicitudes de servicio, como el montaje de un backend.',
    gain: 'Sabe de código y también de filas, prioridades y personas.',
  },
];

export const STACK = [
  { cat: 'Lógica', items: [
    ['Java', 'openjdk', 'El idioma de muchos bancos y empresas grandes. Estable, en el mejor sentido.', 'Base de su trabajo backend.'],
    ['Spring Boot', 'springboot', 'Un andamio para hacer servidores en Java sin empezar de cero.', 'Evaluaciones y preguntas en Methodus.'],
    ['NestJS', 'nestjs', 'Lo mismo que Spring Boot, pero en JavaScript.', 'Backend de Pistis.'],
    ['Node.js', 'nodedotjs', 'JavaScript fuera del navegador: servidores y herramientas.', 'Build propio del sitio de CEEDi.'],
    ['Python', 'python', 'El lenguaje de los datos: limpiar, contar, agrupar y predecir.', 'Market Basket y el modelo preanestésico.'],
    ['JHipster', 'jhipster', 'Genera en minutos el esqueleto de una aplicación completa.', ''],
  ]},
  { cat: 'Datos', items: [
    ['PostgreSQL', 'postgresql', 'Donde viven los datos sin perderse ni contradecirse.', 'Methodus, Pistis y la agenda de citas.'],
    ['Oracle · PL/SQL', 'oracle', 'La base de datos de los bancos, con su propio idioma.', ''],
    ['MySQL', 'mysql', 'Otra base de datos muy usada en la web.', ''],
    ['Flyway', 'flyway', 'Un diario de cambios de la base de datos.', 'Migraciones en Methodus.'],
    ['Drizzle', 'drizzle', 'Describe las tablas en código y genera los cambios solo.', '17 migraciones en la agenda.'],
    ['XGBoost', 'xgboost', 'Un modelo que aprende de miles de casos para predecir.', 'Modelo preanestésico (ROC-AUC 0,861).'],
  ]},
  { cat: 'Interfaz', items: [
    ['TypeScript', 'typescript', 'JavaScript con reglas: los errores aparecen antes que el usuario.', 'Methodus y la agenda.'],
    ['Next.js', 'nextdotjs', 'Páginas web rápidas que Google entiende bien.', 'Methodus, Pistis y la agenda.'],
    ['React', 'react', 'La pieza con la que se arma casi toda interfaz moderna.', 'Tribunal Ético y la agenda.'],
    ['Flutter', 'flutter', 'Una sola base de código para Android y iPhone.', 'App móvil de Pistis.'],
    ['HTML · CSS', 'html5', 'Lo que el navegador dibuja.', 'CEEDi, Refil y todo lo demás.'],
  ]},
  { cat: 'Entrega', items: [
    ['Git · GitHub', 'github', 'El historial de cada cambio: quién, cuándo y por qué.', '25 repositorios públicos.'],
    ['GitHub Actions', 'githubactions', 'Un robot que revisa el código cada vez que alguien lo cambia.', 'CI de la agenda de citas.'],
    ['Docker', 'docker', 'Empaca la app para que funcione igual en cualquier lado.', 'Market Basket y el modelo preanestésico.'],
    ['Google Cloud', 'googlecloud', 'Computadores de Google alquilados por minutos.', 'Pistis y Cloud Run.'],
    ['Cloudflare', 'cloudflare', 'Pone la app cerca de cada usuario.', 'La agenda de citas corre ahí.'],
    ['Airflow', 'apacheairflow', 'Un director de orquesta para procesos de datos.', 'Pipeline del modelo preanestésico.'],
  ]},
  { cat: 'Equipo', items: [
    ['Scrum', '', 'Trabajar en ciclos cortos y mostrar avances seguido.', 'Methodus.'],
    ['Jira', 'jira', 'El tablero donde vive cada tarea del equipo.', ''],
    ['Historias de usuario', '', 'Escribir lo que el cliente necesita en sus palabras.', 'Con el cliente de Methodus.'],
    ['Inglés B2', '', 'Lee documentación y conversa en inglés.', ''],
    ['Enseñar', '', 'Dos años y medio como asistente de profesor.', 'ICESI, semestres 1 a 4.'],
  ]},
];

// Guion del narrador (el gato negro de Silem) para las paradas que no son proyecto ni trabajo
export const LINES = {
  hero: {
    h: '¡Miau! Soy el gato negro de Silem. Él escribe el código que nadie ve y que hace que todo funcione. Baja y te muestro, sin siglas raras.',
    e: 'Silem Nabib · Ingeniería de Sistemas, ICESI (10.º semestre). Backend con Java, Spring Boot y PostgreSQL; también Next.js, NestJS y nube. Baja para ver el detalle.',
  },
  room: {
    h: 'Este es su cuarto. Desde ese escritorio trabaja para un banco, para una plataforma de estudio y en sus propios proyectos. Pasa el cursor por las cosas: todo tiene historia.',
    e: 'Hoy: Banco de Occidente (gestión de la demanda de TI) y Methodus (full stack). Antes: Pistis e ICESI. Homelab propio y 25 repositorios públicos.',
  },
  arcade: {
    h: 'Bienvenido al arcade. Cada máquina es un proyecto real de Silem, y adentro está el proyecto funcionando: toca la pantalla para entrar.',
    e: 'Seis proyectos con código público. Toca cada máquina para ver capturas, cifras, stack y enlaces.',
  },
  street: {
    h: 'Ahora, los lugares donde ha trabajado. Acércate a la puerta: se abre sola.',
    e: 'Experiencia laboral, en orden.',
  },
  stack: {
    h: 'Este es su inventario. Toca un objeto y te digo para qué sirve, en cristiano.',
    e: 'Herramientas por capa. Cada una dice dónde la usó.',
  },
  contact: {
    h: 'Si llegaste hasta aquí, ya sabes que no era un sombrero. El resto se conversa: escríbele.',
    e: 'Contacto directo. Hoja de vida en PDF de una página.',
  },
};

export const HOTSPOTS = [
  { u: 0.27, v: 0.36, t: 'La ventana', h: 'Cali de noche. Los Farallones al fondo.', e: 'Cali, Colombia.' },
  { u: 0.49, v: 0.33, t: 'La biblioteca', h: 'Aquí guarda su stack. Tócala para abrir el inventario.', e: 'Inventario de herramientas.', page: 'stack' },
  { u: 0.64, v: 0.25, t: 'El tablero', h: 'Post-its: así se ven las historias de usuario antes de programar.', e: 'Épicas e historias de usuario con el cliente (Methodus).' },
  { u: 0.86, v: 0.37, t: 'El banderín', h: 'La estrella de su banner de GitHub.', e: 'github.com/SilemNabib' },
  { u: 0.64, v: 0.47, t: 'Los monitores', h: 'Aquí viven sus proyectos. Toca para entrar a la pantalla.', e: 'Java · Spring Boot · TypeScript · Python', go: 'projects' },
  { u: 0.86, v: 0.62, t: 'El servidor', h: 'Su homelab: un servidor propio para aprender y probar.', e: 'Repositorio Star-Homelab.' },
  { u: 0.2, v: 0.76, t: 'La cama de los gatos', h: 'Según el gato negro, es decorativa.', e: 'Dos gatos. Pixel art del propio Silem.' },
];

// Cifras grandes (todas salen del CV, los repos o los informes de cada proyecto)
export const NUMBERS = [
  { n: '25', l: 'repositorios públicos en GitHub', big: true },
  { n: '6', l: 'proyectos que puedes abrir y usar en esta página' },
  { n: '4', l: 'equipos: un banco, dos productos y la universidad' },
  { n: '0,861', l: 'ROC-AUC de su modelo clínico con la Fundación Valle del Lili' },
  { n: '1,1 M', l: 'compras de supermercado analizadas' },
];

// Lo que sabe hacer, con la prueba de cada cosa. open = índice del proyecto en SilemOS; go = sección
export const CAPS = [
  { t: 'Backend y bases de datos', h: 'Servidores que guardan los datos sin perderlos, aplican las reglas del negocio y responden rápido. Y bases de datos que pueden cambiar sin romper nada.', e: 'APIs en Spring Boot, NestJS y FastAPI. PostgreSQL, Oracle PL/SQL y MySQL; migraciones versionadas con Flyway y Drizzle; pruebas automatizadas.', tags: ['Java', 'Spring Boot', 'NestJS', 'PostgreSQL', 'Flyway'], proof: 'Agenda de citas: 35 reglas de negocio y 17 migraciones', open: 0 },
  { t: 'Datos y modelos', h: 'Convertir montañas de datos en respuestas: qué pasa, a quién le pasa y qué va a pasar. Con modelos que además explican por qué.', e: 'ETL con Pandas, segmentación K-Means, reglas de asociación, XGBoost calibrado con explicabilidad SHAP y pipelines en Airflow.', tags: ['Python', 'Pandas', 'XGBoost', 'SHAP', 'Airflow'], proof: 'Modelo preanestésico (ROC-AUC 0,861) y Market Basket (1,1 M compras)', open: 1 },
  { t: 'Interfaces web y móvil', h: 'Las pantallas que usa la gente: páginas rápidas, formularios que guían paso a paso y una app para el celular.', e: 'Next.js y React con TypeScript, Flutter para Android e iPhone, diseño responsive y sistemas de diseño documentados.', tags: ['Next.js', 'React', 'TypeScript', 'Flutter'], proof: 'Tribunal Ético, CEEDi y la app de Pistis', open: 4 },
  { t: 'Nube y entrega', h: 'Que la app funcione igual en su computador que en internet, y que cada cambio se revise solo antes de salir.', e: 'Docker, Google Cloud Run y Cloud Storage, Cloudflare Workers con OpenNext, GitHub Actions para integración continua.', tags: ['Docker', 'Google Cloud', 'Cloudflare', 'GitHub Actions'], proof: 'Agenda en Cloudflare, Market Basket en Cloud Run', open: 2 },
  { t: 'Equipo y cliente', h: 'Sentarse con el cliente, entender qué necesita y repartirlo en tareas que el equipo puede construir. Y explicarlo sin siglas.', e: 'Épicas e historias de usuario, Scrum y Jira; gestión de la demanda de TI en banca; dos años y medio de asistencia docente.', tags: ['Scrum', 'Jira', 'Historias de usuario', 'Inglés B2'], proof: 'Methodus, Banco de Occidente e ICESI', go: 'experiencia' },
];
