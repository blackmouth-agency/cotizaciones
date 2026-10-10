/* Semply · datos del prototipo. Los dos programas usan el temario real del plan de estudios v2.
   Todo lo demás (cursos cortos, docentes, precios, reseñas) es inventado para el prototipo. */
(function () {
var MODS = [
  { name:'IA aplicada al marketing',
    who:'Personas de marketing, community managers, diseñadores, emprendedores y dueños de negocio que ya trabajan con redes o publicidad y quieren dejar de improvisar con la IA.',
    req:['Manejo básico de computador y navegador. No se necesita programar.','Celular con cámara y conexión estable.','Un negocio o marca real para trabajar las 10 semanas: propio, de un cliente o asignado por Semply.','Herramientas en su mayoría con plan gratuito. Las unidades que requieren pago lo indican desde el inicio.'],
    out:['Diseñar y documentar prompts y asistentes reutilizables para tareas de marketing.','Investigar mercado, competencia y audiencia con IA, verificando cada dato.','Producir un mes de contenido en texto, imagen y video con la voz de la marca.','Montar automatizaciones de atención, captura de leads y reportes sin programar.','Usar la IA de las plataformas de pauta con criterio y probar creativos.','Aplicar criterios legales y éticos: derechos de autor, datos personales, etiquetado y revisión humana.'],
    units:[
      {c:'U0',n:'Bienvenida y puesta en marcha',h:[1,1,2,0],l:['Cómo funciona Semply: ritmo, entregas y soporte','Tu kit de herramientas: qué es gratis y qué es de pago','Diagnóstico del negocio con el que vas a trabajar','Qué es un entregable y cómo se evalúa'],d:'Ficha del negocio de práctica: qué vende, a quién y dónde está hoy en redes.'},
      {c:'U1',n:'Cómo piensa (y cómo falla) la IA',h:[2,1,2,1],l:['Qué es un modelo de lenguaje, explicado para marketing','Contexto y memoria: por qué “se le olvida”','Alucinaciones: por qué inventa y cómo cacharla','Mapa 2026 de modelos de texto, imagen, video y audio','Cuánto cuesta la IA por cliente y por mes'],d:'Auditoría de 5 respuestas de IA: qué era correcto, qué era inventado y cómo se verificó.'},
      {c:'U2',n:'Prompting y contexto profesional',h:[3,2,6,1],l:['Anatomía de un prompt: rol, contexto, tarea, formato y restricciones','Darle materia prima: datos, documentos y ejemplos propios','Enseñar con ejemplos y fijar el estilo','Encadenar tareas en vez de pedir todo de una','Proyectos, GPTs e instrucciones personalizadas','Conectar la IA a tus archivos: Drive, hojas de cálculo y correo','Diagnosticar un mal resultado y corregirlo'],d:'Biblioteca de 15 prompts documentados y 3 proyectos o GPTs configurados para el negocio.'},
      {c:'U3',n:'Investigación y estrategia con IA',h:[2,2,6,1],l:['Research de mercado: qué pedir y qué verificar','Análisis de competencia con fuentes reales','Reseñas, comentarios y mensajes como materia prima','Buyer persona con evidencia, no con imaginación','Propuesta de valor y mensajes clave','Del insight al brief creativo'],d:'Brief estratégico de una página y 2 buyer personas con la evidencia citada.'},
      {c:'U4',n:'Contenido escrito con IA',h:[3,2,5,1],l:['Documento de voz de marca: entrenar a la IA en tu tono','Copy para redes: de la idea al carrusel','Guiones para reels y TikTok: gancho, desarrollo y cierre','Email marketing y secuencias','Copy para landing y anuncios','Calendario de contenido mensual asistido por IA'],d:'Documento de voz de marca y calendario del mes con 12 copys listos.'},
      {c:'U5',n:'Imagen, video y diseño con IA',h:[3,2,6,1],l:['Imagen de producto, retrato y escena','Consistencia de personaje y de marca entre piezas','Video con IA: de la foto al clip','Locución, subtítulos y doblaje','Canva + IA sin romper el manual de marca','Adaptación a formatos y plataformas','Qué no se genera: marcas, parecidos y material protegido','Cuándo la IA no alcanza y toca diseñador'],d:'Las 12 piezas del mes con imagen, 2 videos cortos y un kit de 6 plantillas de marca.'},
      {c:'U6',n:'Automatización y agentes',h:[3,2,6,1],l:['Qué automatizar y qué no','Primer flujo en Make o n8n: disparador, acción y resultado','Respuestas automáticas en Instagram con ManyChat','Captura y calificación de leads: formulario, hoja y CRM','Reportes que se arman solos','Agentes que ejecutan tareas: qué hacen hoy y qué todavía no','Probar y monitorear un flujo sin tumbar la operación','WhatsApp Business: requisitos y costos (tema opcional)'],d:'2 automatizaciones funcionando y el documento de operación para entregar a un cliente.'},
      {c:'U7',n:'IA en la pauta digital',h:[2,1,3,1],l:['Cómo deciden los algoritmos de Meta y Google','Meta Advantage+: qué delegar y qué controlar','Recursos creativos automáticos en Google Ads','Pruebas de creativos: variaciones con IA y lectura de resultados','Cuándo no confiar en la automatización'],d:'Plan de pruebas con 6 variaciones de anuncio y el criterio para elegir la ganadora.'},
      {c:'U8',n:'Datos y decisiones',h:[2,1,4,1],l:['Limpiar y ordenar datos con IA en Sheets o Excel','Preguntarle a tus datos: análisis conversacional','Métricas que importan según el objetivo','Del dato al reporte: narrativa de resultados','Tablero simple de seguimiento'],d:'Reporte mensual con lectura de resultados e hipótesis de mejora.'},
      {c:'U9',n:'Ética y uso responsable',h:[1,1,2,1],l:['Derechos de autor: qué se puede usar y vender','Datos personales de clientes (Ley 1581 de 2012)','Etiquetado de contenido con IA en Meta, TikTok y YouTube','Sesgos y errores que cuestan reputación','Revisión humana: el filtro que no se salta'],d:'Política de uso de IA de una página para el negocio.'},
      {c:'PF',n:'Proyecto integrador',h:[0,3,8,1],l:['Brief y buyer personas con evidencia','Un mes de contenido: 12 piezas y 2 videos','Una automatización funcionando','Plan de pruebas creativas para pauta','Reporte de medición con 3 decisiones propuestas','Biblioteca de prompts y política de uso de IA'],d:'Sistema de marketing con IA para un negocio real, sustentado en 10 minutos ante el docente.'}
    ]},
  { name:'SEO y posicionamiento web',
    who:'Personas de marketing, dueños de negocio con sitio web, freelancers y equipos comerciales que necesitan tráfico que no dependa solo de redes sociales.',
    req:['Manejo básico de computador y navegador. No se necesita programar.','Un sitio web para trabajar: propio, de un cliente o la plantilla de práctica que entrega Semply.','Medio de pago para la cuenta de Google Ads. Se trabaja con un presupuesto mínimo de prueba.'],
    out:['Auditar un sitio y priorizar los hallazgos por impacto y esfuerzo.','Construir un mapa de contenidos a partir de keywords agrupadas por intención.','Optimizar páginas y datos estructurados, y corregir errores de indexación.','Ganar visibilidad en buscadores con IA (GEO y AEO), en YouTube y en TikTok.','Montar y administrar una campaña de búsqueda con conversiones bien medidas.','Presentar un reporte mensual con decisiones, no solo con gráficas.'],
    units:[
      {c:'U0',n:'Bienvenida y montaje de cuentas',h:[1,1,2,0],l:['Qué sitio vas a trabajar: propio, de un cliente o la plantilla de Semply','Search Console, Analytics 4 y Tag Manager paso a paso','Cuenta de Google Ads en modo experto, sin gastar todavía','Herramientas SEO cuando no hay presupuesto'],d:'Sitio conectado a Search Console y Analytics 4, y cuenta de Google Ads creada.'},
      {c:'U1',n:'Cómo funciona la búsqueda hoy',h:[2,1,2,1],l:['Rastreo, indexación y ranking sin tecnicismos','Anatomía de la página de resultados','AI Overviews y buscadores generativos: qué cambió','Intención de búsqueda: los 4 tipos','SEO, SEM, GEO y AEO: qué es cada cosa','Búsquedas sin clic: qué implican para la estrategia'],d:'Análisis de 10 páginas de resultados del sector: qué aparece, quién gana y por qué.'},
      {c:'U2',n:'Keyword research e intención',h:[2,2,5,1],l:['De la idea de negocio a la lista de temas','Keyword Planner, Search Console y alternativas gratuitas','Volumen, dificultad y valor comercial','Long tail: dónde sí se puede competir','Agrupar por intención','Keyword gap contra la competencia','Mapa de contenidos: una intención, una URL'],d:'Mapa de contenidos con 40 a 60 keywords agrupadas y priorizadas.'},
      {c:'U3',n:'On-page y arquitectura',h:[2,1,5,1],l:['Title y meta description que se ganan el clic','Encabezados y estructura de la página','Responder primero: contenido listo para ser citado','URLs, silos y enlazado interno','Canibalización: detectarla y arreglarla','Datos estructurados: negocio local, producto y artículo'],d:'3 páginas optimizadas con antes y después, y datos estructurados validados.'},
      {c:'U4',n:'SEO técnico esencial',h:[2,2,5,1],l:['Auditoría con Screaming Frog paso a paso','robots.txt, sitemap y control de lo que se indexa','Errores de rastreo en Search Console','Core Web Vitals y velocidad: lo que sí mueve la aguja','Móvil primero, de verdad','HTTPS, duplicados y canonical','Qué sí se puede tocar en WordPress, Shopify y Wix','Migraciones y JavaScript: reconocer el riesgo y saber a quién llamar'],d:'Auditoría técnica con 20 hallazgos priorizados por impacto y esfuerzo.'},
      {c:'U5',n:'Contenido, autoridad y E-E-A-T',h:[2,1,5,1],l:['Brief SEO: qué recibe quien redacta','Actualizar contenido viejo: la victoria más rápida','E-E-A-T: experiencia, autoría y confianza','Link building que no te quema','Entidades y menciones de marca','La IA en el contenido SEO: qué sí y qué no'],d:'Un artículo publicado y optimizado, y un plan de 10 enlaces realistas.'},
      {c:'U6',n:'SEO local',h:[1,1,3,1],l:['Perfil de Empresa en Google: ficha completa','Categorías, servicios y fotos que mueven el ranking local','Reseñas: conseguirlas y responderlas','NAP y citaciones locales','Páginas por ciudad o barrio sin duplicar contenido'],d:'Ficha local optimizada y plan de reseñas de 90 días.'},
      {c:'U7',n:'GEO y AEO: aparecer en las respuestas de la IA',h:[2,1,4,1],l:['Cómo elige un motor generativo a quién citar','Pasajes extraíbles: la unidad ya no es la página','Dejar entrar a los rastreadores de IA en robots.txt','Bing Webmaster Tools e IndexNow: la puerta a ChatGPT','FAQ, schema y llms.txt: qué sirve y qué es humo','Construir la entidad de marca','Medir menciones en ChatGPT, Gemini y Perplexity'],d:'Auditoría GEO de la marca y 5 bloques de contenido listos para ser citados.'},
      {c:'U8',n:'Búsqueda más allá de Google',h:[1,1,3,1],l:['YouTube: títulos, capítulos y miniaturas que se encuentran','TikTok e Instagram como buscadores','Google Merchant Center y listados gratuitos de producto'],d:'3 piezas de video optimizadas para búsqueda y, si el negocio vende productos, su catálogo en Merchant Center.'},
      {c:'U9',n:'SEM: Google Ads de cero a campaña viva',h:[3,2,7,1],l:['Estructura: campaña, grupo, anuncio y palabra clave','Primera campaña de búsqueda en modo experto','Concordancias y negativas: donde se quema el presupuesto','Anuncios adaptables y recursos','Nivel de calidad y relevancia','Pujas y presupuesto real en pesos','Landing que convierte: el mínimo no negociable','Seguimiento de conversiones bien montado','Performance Max y remarketing: cuándo sí y cuándo no','CPA, ROAS y punto de equilibrio'],d:'Campaña de búsqueda publicada, con conversiones midiendo y CPA objetivo calculado.'},
      {c:'U10',n:'Medición, reporte y decisión',h:[2,1,3,1],l:['Analytics 4 sin miedo: eventos y conversiones','Search Console: consultas, páginas y oportunidades','Práctica con datos reales en la cuenta demo de Google','Atribución simple y honesta','Tablero en Looker Studio','De los datos a las 3 acciones del próximo mes'],d:'Tablero en Looker Studio y reporte mensual con 3 decisiones recomendadas.'},
      {c:'PF',n:'Proyecto integrador',h:[0,3,8,1],l:['Auditoría técnica y de contenidos con hallazgos priorizados','Mapa de contenidos por intención','3 páginas optimizadas y publicadas','Plan GEO/AEO con bloques listos para citar','Campaña de búsqueda viva, midiendo conversiones','Tablero y reporte con las 3 decisiones del próximo mes'],d:'Plan de posicionamiento completo de un sitio real, sustentado en 10 minutos ante el docente.'}
    ]}
  ];

var D = {};

D.docentes = {
  mariana: { nombre: 'Mariana Restrepo', rol: 'Estratega de IA para marketing', anos: 9,
    bio: 'Lleva 9 años en agencias de Medellín y Bogotá. Hoy diseña sistemas de contenido con IA para marcas de consumo y les enseña a sus equipos a usarlos sin perder la voz.',
    frase: 'La IA no es mágica. Es una practicante muy rápida que necesita buen contexto.' },
  andres: { nombre: 'Andrés Cifuentes', rol: 'Consultor SEO y SEM', anos: 11,
    bio: 'Once años posicionando tiendas, clínicas y negocios locales. Audita sitios todas las semanas y desconfía de cualquiera que prometa «el primer lugar en Google».',
    frase: 'El SEO no se gana con trucos. Se gana respondiendo mejor que los demás.' },
  laura: { nombre: 'Laura Mejía', rol: 'Directora de contenido', anos: 7,
    bio: 'Escribe y graba reels para marcas desde 2019. Su regla de oro: si no se entiende sin sonido, no está listo.',
    frase: 'Tienes un segundo. Úsalo para decir algo, no para saludar.' },
  julian: { nombre: 'Julián Ortega', rol: 'Media buyer · Meta y Google Ads', anos: 8,
    bio: 'Maneja pauta para comercio electrónico y servicios. Ha invertido más de 4.000 millones de pesos en anuncios y aprendió algo de cada peso perdido.',
    frase: 'El creativo es la nueva segmentación.' },
  daniela: { nombre: 'Daniela Ríos', rol: 'Automatización y CRM', anos: 10,
    bio: 'Ingeniera industrial convertida en marketera. Monta flujos en Make y ManyChat para que los equipos pequeños trabajen como grandes.',
    frase: 'Si lo haces tres veces a mano, ya es candidato para automatizar.' },
  santiago: { nombre: 'Santiago Vélez', rol: 'Analítica y medición', anos: 15,
    bio: 'Quince años entre datos y mercadeo. Convierte tableros que nadie lee en reportes de una página con tres decisiones.',
    frase: 'Una gráfica sin decisión es decoración.' },
  camila: { nombre: 'Camila Herrera', rol: 'Marca personal y LinkedIn', anos: 6,
    bio: 'Acompaña a profesionales y fundadores a contar lo que saben. Su propio perfil le trajo sus últimos doce clientes.',
    frase: 'Nadie te contrata por lo que sabes si nadie sabe lo que sabes.' }
};

D.categorias = [
  { id: 'ia', nombre: 'Inteligencia artificial' },
  { id: 'seo', nombre: 'SEO y web' },
  { id: 'contenido', nombre: 'Contenido' },
  { id: 'pauta', nombre: 'Pauta digital' },
  { id: 'automatizacion', nombre: 'Automatización' },
  { id: 'datos', nombre: 'Datos' },
  { id: 'marca', nombre: 'Marca personal' }
];

/* Cursos cortos: secciones con lecciones [titulo, minutos] */
D.cursos = [
  { slug: 'ia-marketing', tipo: 'programa', mod: 0, cat: 'ia', nivel: 'Intermedio', docente: 'mariana', img: 'prog-ia',
    titulo: 'IA aplicada al marketing', sub: 'De usar ChatGPT a operar un sistema de marketing con IA. 10 semanas trabajando un negocio real, con sesión en vivo cada jueves.',
    horas: 100, semanas: 10, precio: 1290000, antes: 1690000, cuotas: 4, rating: 4.9, resenas: 214, estudiantes: 860, envivo: true, practica: 50,
    cohortes: [{ id: 'nov26', inicio: '2026-11-09', dia: 'Jueves 7:00 p. m.', cupos: 14 }, { id: 'ene27', inicio: '2027-01-18', dia: 'Jueves 7:00 p. m.', cupos: 40 }] },
  { slug: 'seo-posicionamiento', tipo: 'programa', mod: 1, cat: 'seo', nivel: 'Intermedio', docente: 'andres', img: 'prog-seo',
    titulo: 'SEO y posicionamiento web', sub: 'Que te encuentren en Google, en el mapa y en las respuestas de la IA. 10 semanas con un sitio real y sesión en vivo cada martes.',
    horas: 100, semanas: 10, precio: 1290000, antes: 1690000, cuotas: 4, rating: 4.8, resenas: 167, estudiantes: 640, envivo: true, practica: 52,
    cohortes: [{ id: 'nov26', inicio: '2026-11-10', dia: 'Martes 7:00 p. m.', cupos: 22 }, { id: 'ene27', inicio: '2027-01-19', dia: 'Martes 7:00 p. m.', cupos: 40 }] },

  { slug: 'prompts-marketing', tipo: 'curso', cat: 'ia', nivel: 'Básico', docente: 'mariana', img: 'prompts',
    titulo: 'Prompts que sí funcionan para marketing', sub: 'Deja de pedirle cosas a la IA como si fuera un buscador. Arma prompts con rol, contexto y formato que te sirvan todos los días.',
    precio: 99900, antes: 139900, rating: 4.9, resenas: 612, estudiantes: 3840, top: true,
    logros: ['Escribir prompts con las cinco piezas: rol, contexto, tarea, formato y restricciones.', 'Crear un GPT o proyecto que hable con la voz de tu marca.', 'Corregir un mal resultado en dos intentos, no en diez.', 'Salir con una biblioteca de 10 prompts documentados.'],
    secciones: [
      ['Antes de escribir', [['Por qué tu prompt falla (y no es la redacción)', 7], ['Anatomía de un prompt: las cinco piezas', 9], ['Rol: desde dónde mira la IA', 8], ['Contexto: la materia prima', 11]]],
      ['Prompts para el día a día', [['Ideas de contenido que no suenan a IA', 10], ['Copys con la voz de tu marca', 12], ['Respuestas a clientes y reseñas', 8], ['Resúmenes de reuniones y documentos', 7]]],
      ['Subir de nivel', [['Ejemplos que enseñan el estilo', 9], ['Encadenar tareas paso a paso', 11], ['Proyectos y GPTs con instrucciones fijas', 13], ['Corregir un mal resultado sin empezar de cero', 8]]],
      ['Tu biblioteca', [['Plantilla de biblioteca de prompts', 6], ['Proyecto final: 10 prompts documentados', 9]]]
    ] },
  { slug: 'guiones-reels', tipo: 'curso', cat: 'contenido', nivel: 'Básico', docente: 'laura', img: 'reels',
    titulo: 'Guiones para reels que retienen', sub: 'Ganchos, estructura y cierre: escribe reels que la gente ve hasta el final y que dicen algo de tu marca.',
    precio: 119900, rating: 4.8, resenas: 488, estudiantes: 2910, top: true,
    logros: ['Escribir ganchos que detienen el dedo en el primer segundo.', 'Estructurar un reel de 30 segundos sin relleno.', 'Grabar con el celular y luz de ventana.', 'Leer la retención y saber qué cambiar.'],
    secciones: [
      ['El primer segundo', [['Qué hace que alguien deje de deslizar', 8], ['12 tipos de gancho con ejemplos', 14], ['Gancho visual vs. gancho hablado', 7]]],
      ['Estructura', [['Problema, giro y solución', 10], ['Listas, mitos y antes/después', 9], ['Ritmo: un corte cada dos segundos', 8], ['Subtítulos que se leen sin sonido', 7]]],
      ['Grabar sin equipo caro', [['Celular, ventana y micrófono de solapa', 11], ['Hablarle a la cámara sin parecer robot', 9], ['Teleprompter casero', 6]]],
      ['Cerrar y medir', [['Llamados a la acción que no suenan a vendedor', 8], ['Retención y reproducciones: qué mirar', 10], ['Proyecto final: 3 guiones y 1 reel publicado', 8]]]
    ] },
  { slug: 'meta-ads', tipo: 'curso', cat: 'pauta', nivel: 'Básico', docente: 'julian', img: 'meta',
    titulo: 'Meta Ads desde cero: tu primera campaña rentable', sub: 'Del Administrador de anuncios al primer resultado medible, sin quemar el presupuesto en el intento.',
    precio: 139900, antes: 179900, rating: 4.7, resenas: 721, estudiantes: 4530,
    logros: ['Elegir el objetivo de campaña según el objetivo de negocio.', 'Instalar el píxel y medir conversiones.', 'Probar creativos con variaciones hechas con IA.', 'Saber cuándo apagar, ajustar o escalar.'],
    secciones: [
      ['Antes de pautar', [['Objetivo de negocio vs. objetivo de campaña', 9], ['Píxel, API de conversiones y eventos', 14], ['Cuánto invertir para aprender algo', 8]]],
      ['Montar la campaña', [['Campaña, conjunto y anuncio', 11], ['Públicos: amplio, similar y personalizado', 12], ['Advantage+: qué delegar', 10], ['Ubicaciones y formatos', 7]]],
      ['Creativos que venden', [['El creativo es la nueva segmentación', 9], ['Variaciones con IA para probar rápido', 12], ['Copys para anuncios', 8]]],
      ['Leer y optimizar', [['Las cinco métricas que importan', 10], ['Cuándo apagar un anuncio', 7], ['Escalar sin romper el aprendizaje', 9], ['Proyecto final: campaña con presupuesto de prueba', 10]]]
    ] },
  { slug: 'automatiza-marketing', tipo: 'curso', cat: 'automatizacion', nivel: 'Intermedio', docente: 'daniela', img: 'automatiza',
    titulo: 'Automatiza tu marketing sin programar', sub: 'Make, ManyChat y hojas de cálculo para que los leads, las respuestas y los reportes se muevan solos.',
    precio: 129900, rating: 4.8, resenas: 356, estudiantes: 1980,
    logros: ['Mapear tu operación y decidir qué automatizar.', 'Montar flujos en Make con disparador, acción y resultado.', 'Responder comentarios y mensajes de Instagram con ManyChat.', 'Probar y monitorear sin tumbar la operación.'],
    secciones: [
      ['Pensar en flujos', [['Qué automatizar y qué no', 8], ['Disparador, acción y resultado', 9], ['El mapa de tu operación en una hoja', 10]]],
      ['Primeros flujos en Make', [['Del formulario a la hoja y al correo', 13], ['Leads al CRM con etiquetas', 12], ['Alertas en WhatsApp o Slack', 9]]],
      ['Instagram con ManyChat', [['Respuesta automática a comentarios', 11], ['Palabra clave que entrega un recurso', 9], ['Calificar leads por mensaje', 10]]],
      ['Operar sin sustos', [['Probar antes de encender', 7], ['Errores, límites y costos', 8], ['Proyecto final: dos flujos funcionando', 9]]]
    ] },
  { slug: 'ga4-looker', tipo: 'curso', cat: 'datos', nivel: 'Intermedio', docente: 'santiago', img: 'ga4',
    titulo: 'GA4 y Looker Studio sin miedo', sub: 'Configura eventos, entiende tus informes y arma un tablero que tu jefe o tu cliente sí va a leer.',
    precio: 119900, rating: 4.7, resenas: 298, estudiantes: 1640,
    logros: ['Instalar GA4 con Tag Manager y marcar conversiones.', 'Leer adquisición e interacción sin perderte.', 'Armar un tablero en Looker Studio con filtros.', 'Escribir un reporte de una página con tres decisiones.'],
    secciones: [
      ['Lo básico bien hecho', [['Cómo piensa GA4: eventos, no visitas', 9], ['Instalación con Tag Manager', 13], ['Conversiones clave', 8]]],
      ['Leer informes', [['Adquisición: de dónde viene la gente', 10], ['Interacción: qué hace en el sitio', 9], ['Exploraciones sin perderse', 12]]],
      ['Tableros en Looker Studio', [['Conectar fuentes', 8], ['Gráficos que responden una pregunta', 11], ['Filtros y controles para el cliente', 9]]],
      ['Decidir con datos', [['De la gráfica a la decisión', 8], ['Reporte mensual en una página', 9], ['Proyecto final: tablero publicado', 7]]]
    ] },
  { slug: 'seo-local', tipo: 'curso', cat: 'seo', nivel: 'Básico', docente: 'andres', img: 'seolocal',
    titulo: 'SEO local: aparece en el mapa', sub: 'Perfil de negocio, reseñas y señales locales para que te encuentren cuando buscan «cerca de mí».',
    precio: 89900, rating: 4.9, resenas: 402, estudiantes: 2270, top: true,
    logros: ['Entender cómo decide Google qué negocio mostrar en el mapa.', 'Optimizar tu perfil de negocio de punta a punta.', 'Conseguir y responder reseñas con un plan de 90 días.', 'Crear páginas por ciudad o barrio sin duplicar contenido.'],
    secciones: [
      ['El mapa manda', [['Cómo decide Google qué negocio mostrar', 8], ['Relevancia, distancia y prominencia', 7]]],
      ['Tu perfil de negocio', [['Categorías, servicios y atributos', 10], ['Fotos y publicaciones que suman', 8], ['Preguntas y respuestas', 6]]],
      ['Reseñas', [['Conseguir reseñas sin rogar', 9], ['Responder bien, también a las malas', 8], ['Plan de reseñas de 90 días', 7]]],
      ['Más allá del perfil', [['NAP y directorios locales', 8], ['Páginas por ciudad o barrio', 10], ['Proyecto final: ficha optimizada', 7]]]
    ] },
  { slug: 'fotos-producto-ia', tipo: 'curso', cat: 'ia', nivel: 'Básico', docente: 'laura', img: 'producto', nuevo: true,
    titulo: 'Fotos de producto con IA', sub: 'De una foto con el celular a piezas de catálogo y redes, sin estudio y sin cambiar cómo se ve tu producto de verdad.',
    precio: 109900, antes: 139900, rating: 4.8, resenas: 96, estudiantes: 720,
    logros: ['Tomar una foto base que la IA pueda aprovechar.', 'Cambiar fondos y crear escenas sin deformar el producto.', 'Mantener la consistencia entre piezas.', 'Saber qué no se debe generar y cómo etiquetar.'],
    secciones: [
      ['La foto base', [['Luz de ventana y fondo limpio', 8], ['Ángulos que le sirven a la IA', 7]]],
      ['Generar y editar', [['Cambiar el fondo sin deformar el producto', 12], ['Escenas de estilo de vida', 11], ['Consistencia entre piezas', 10]]],
      ['Formatos', [['Catálogo, historia y anuncio', 9], ['Texto sobre la imagen sin romper la marca', 8]]],
      ['Lo que no se hace', [['Productos que no existen y promesas falsas', 7], ['Derechos y etiquetado', 8], ['Proyecto final: kit de 8 imágenes', 9]]]
    ] },
  { slug: 'marca-personal-linkedin', tipo: 'curso', cat: 'marca', nivel: 'Básico', docente: 'camila', img: 'linkedin',
    titulo: 'Marca personal en LinkedIn', sub: 'Perfil, temas y publicaciones para que te escriban por lo que sabes hacer, no por suerte.',
    precio: 99900, rating: 4.8, resenas: 331, estudiantes: 2050,
    logros: ['Convertir tu perfil en una página que explica qué haces y para quién.', 'Definir tres temas y un punto de vista.', 'Publicar con constancia durante 30 días.', 'Pasar de la conversación a la oportunidad.'],
    secciones: [
      ['Tu perfil como landing', [['Un titular que dice qué haces y para quién', 8], ['Acerca de: historia corta, prueba concreta', 9], ['Destacados y recomendaciones', 6]]],
      ['Qué publicar', [['Tres temas y un punto de vista', 10], ['Texto, carrusel y video', 9], ['Escribir con IA sin sonar a IA', 8]]],
      ['Constancia', [['Calendario de 30 días', 7], ['Comentar también es publicar', 6]]],
      ['Medir', [['Qué métricas mirar', 7], ['De la conversación a la oportunidad', 8], ['Proyecto final: perfil y 8 publicaciones', 9]]]
    ] },
  { slug: 'email-marketing', tipo: 'curso', cat: 'contenido', nivel: 'Básico', docente: 'daniela', img: 'email',
    titulo: 'Email marketing que sí se abre', sub: 'Asuntos, secuencias y listas sanas para vender por correo sin terminar en spam.',
    precio: 89900, rating: 4.6, resenas: 189, estudiantes: 1120,
    logros: ['Crear un lead magnet que la gente sí quiera.', 'Escribir asuntos que se abren.', 'Montar una secuencia de bienvenida de cinco correos.', 'Medir aperturas, clics y ventas.'],
    secciones: [
      ['La lista', [['Lead magnets que no son un PDF olvidado', 8], ['Consentimiento y Ley 1581', 7]]],
      ['Escribir', [['Asuntos que se abren', 9], ['Un correo, una idea, un botón', 8], ['Plantillas que funcionan en el celular', 7]]],
      ['Secuencias', [['Bienvenida de cinco correos', 11], ['Carrito abandonado y recompra', 10]]],
      ['Medir', [['Aperturas, clics y ventas', 8], ['Pruebas A/B', 7], ['Proyecto final: secuencia de bienvenida', 8]]]
    ] },
  { slug: 'google-ads-local', tipo: 'curso', cat: 'pauta', nivel: 'Intermedio', docente: 'julian', img: 'googleads',
    titulo: 'Google Ads para negocios locales', sub: 'Campañas de búsqueda con presupuesto pequeño para que te llamen los que ya te están buscando.',
    precio: 129900, rating: 4.7, resenas: 244, estudiantes: 1480,
    logros: ['Montar una campaña de búsqueda en modo experto.', 'Elegir palabras clave con intención de compra y negativas.', 'Medir llamadas, formularios y WhatsApp.', 'Calcular pujas con presupuesto real en pesos.'],
    secciones: [
      ['Antes de la primera campaña', [['Modo experto y estructura', 10], ['Palabras clave con intención de compra', 12], ['Concordancias y negativas', 11]]],
      ['Anuncios', [['Anuncios adaptables', 9], ['Recursos: llamada, ubicación y sitio', 8]]],
      ['Medir', [['Conversiones: llamadas, formularios y WhatsApp', 13], ['Nivel de calidad', 8]]],
      ['Optimizar', [['Términos de búsqueda: dónde se va la plata', 10], ['Pujas con presupuesto real en pesos', 11], ['Proyecto final: campaña viva', 9]]]
    ] }
];

/* ---- Programas: se arman las lecciones a partir del temario real ---- */
var TIPO_VIVO = ['Sesión en vivo: taller y clínica', 'Sesión en vivo: clínica de proyecto'];
function minutos(seed) { return 6 + ((seed * 7919) % 9); }
D.cursos.forEach(function (c) {
  if (c.tipo === 'programa') {
    var m = MODS[c.mod];
    c.para = m.who; c.req = m.req; c.logros = m.out;
    c.unidades = m.units.map(function (u, ui) {
      var lec = [];
      u.l.forEach(function (t, li) {
        lec.push({ id: u.c.toLowerCase() + '-' + (li + 1), t: t, tipo: 'video', min: minutos(ui * 13 + li + 3) });
      });
      if (u.h[1]) lec.push({ id: u.c.toLowerCase() + '-vivo', t: TIPO_VIVO[ui % 2], tipo: 'vivo', min: u.h[1] * 60 });
      if (u.h[2]) lec.push({ id: u.c.toLowerCase() + '-taller', t: 'Taller: ' + u.d, tipo: 'taller', min: u.h[2] * 60 });
      if (u.h[3]) lec.push({ id: u.c.toLowerCase() + '-quiz', t: 'Quiz de cierre de la unidad', tipo: 'quiz', min: 15 });
      return { c: u.c, n: u.n, h: u.h, d: u.d, lecciones: lec };
    });
    c.lecciones = c.unidades.reduce(function (a, u) { return a + u.lecciones.length; }, 0);
  } else {
    c.unidades = c.secciones.map(function (s, si) {
      return { c: 'S' + (si + 1), n: s[0], lecciones: s[1].map(function (l, li) {
        var last = si === c.secciones.length - 1 && li === s[1].length - 1;
        return { id: 's' + (si + 1) + '-' + (li + 1), t: l[0], tipo: last ? 'taller' : 'video', min: l[1] };
      }) };
    });
    var mins = 0, n = 0;
    c.unidades.forEach(function (u) { u.lecciones.forEach(function (l) { mins += l.min; n++; }); });
    // quiz final por curso
    c.unidades[c.unidades.length - 1].lecciones.splice(-1, 0, { id: 'quiz', t: 'Quiz final', tipo: 'quiz', min: 10 });
    c.lecciones = n + 1;
    c.minutos = mins + 40; // + recursos y ejercicios
    c.horas = Math.round(c.minutos / 60 * 10) / 10;
  }
});

D.testimonios = [
  { nombre: 'Juliana Patiño', rol: 'Dueña de una tienda de ropa · Pereira', curso: 'ia-marketing', logro: '3 asistentes de IA en uso',
    texto: 'Creía que ya sabía usar ChatGPT. En la unidad 2 entendí que solo le estaba pidiendo favores. Hoy tengo tres asistentes que me hacen el trabajo pesado del mes.' },
  { nombre: 'Camilo Rendón', rol: 'Community manager freelance · Cali', curso: 'ia-marketing', logro: 'Calendario aprobado en vivo',
    texto: 'Lo que más me sirvió fue la clínica en vivo. Mariana revisó mi calendario delante de todos y me dijo exactamente qué cambiar. Eso no lo da un video.' },
  { nombre: 'Daniela Moreno', rol: 'Coordinadora de mercadeo · Bogotá', curso: 'seo-posicionamiento', logro: 'Primer reporte leído completo',
    texto: 'Con el módulo de SEO armamos el tablero en Looker y por primera vez el gerente leyó el reporte completo. Y preguntó por la página tres.' },
  { nombre: 'Andrés Fajardo', rol: 'Emprendedor · Buga', curso: 'seo-local', logro: 'Top 3 en el mapa del barrio',
    texto: 'Hice el curso de SEO local en un fin de semana. Al mes mi negocio salía en el mapa del barrio y las llamadas subieron. Así de simple, de verdad.' },
  { nombre: 'Valeria Quintero', rol: 'Diseñadora · Medellín', curso: 'fotos-producto-ia', logro: 'Catálogo sin estudio',
    texto: 'Mi clienta vende velas y no tenía plata para un estudio. Con lo del curso le armé el catálogo completo con fotos del celular y nadie nota la diferencia.' },
  { nombre: 'Sebastián Lozano', rol: 'Analista junior · Barranquilla', curso: 'ga4-looker', logro: 'Ascenso a analista',
    texto: 'Santiago explica GA4 como si te estuviera tomando un café. Presenté el tablero del proyecto final en la entrevista y me quedé con el cargo.' }
];

D.faq = [
  ['¿Cómo son las clases?', 'Los cursos cortos son grabados y los ves a tu ritmo. Los programas de 100 horas combinan lecciones grabadas, una sesión en vivo cada semana y un entregable por unidad que revisa el docente.'],
  ['¿Qué recibo al terminar?', 'Una constancia digital de asistencia y aprobación por cada curso o programa, con código de verificación. Semply es educación informal: entrega constancia, no título.'],
  ['¿Necesito saber programar?', 'No. Basta con manejar el computador y el navegador. Las herramientas que usamos tienen, en su mayoría, plan gratuito, y cada unidad avisa desde el inicio si algo es de pago.'],
  ['¿Y si no puedo ir a la sesión en vivo?', 'Todas quedan grabadas. Si la ves durante la misma semana, cuenta para tu asistencia.'],
  ['¿Cómo puedo pagar?', 'Con tarjeta débito o crédito, PSE, Nequi, Daviplata o en efectivo por Efecty. Los programas se pueden pagar en cuatro cuotas sin intereses con Semply.'],
  ['¿Puedo pedir reembolso?', 'Sí. Tienes 7 días desde la compra si no has visto más del 20 % del contenido.'],
  ['¿Tienen planes para empresas?', 'Sí. Armamos rutas a la medida de tu equipo, con panel de seguimiento y reportes de avance. Mira Semply Empresas.']
];

D.ruta = { titulo: 'Ruta completa: IA + SEO', precio: 2290000, antes: 2580000 };
D.planes = { pro: { titulo: 'Semply Pro', anual: 590000, mensual: 59900 } };

D.marcasEmpresa =['Café Altamira', 'Grupo Ceiba', 'Ferretería Andina', 'Clínica Oriente', 'Tiendas Nube', 'Constructora Prado'];

D.ESTUDIANTE_DEMO = { nombre: 'Natalia Cardona', correo: 'natalia@cafelaloma.co', ciudad: 'Pereira', negocio: 'Café La Loma', plan: 'Semply Pro' };

D.fmt = function (n) { return (n < 0 ? '−' : '') + '$' + Math.abs(Math.round(n)).toLocaleString('es-CO'); };
D.curso = function (slug) { for (var i = 0; i < D.cursos.length; i++) if (D.cursos[i].slug === slug) return D.cursos[i]; return null; };
D.horasTipo = function (c) { var t = [0, 0, 0, 0]; (c.unidades || []).forEach(function (u) { if (u.h) u.h.forEach(function (v, i) { t[i] += v; }); }); return t; };

window.SEMPLY = D;
})();
