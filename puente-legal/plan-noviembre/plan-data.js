/* Plan de contenidos Puente Legal · noviembre 2026 · datos del calendario.
   Fuente: guiones/*.md, 07-piezas/COPYS.md y 03-calendario-noviembre.md. Si cambia un guion, se cambia aquí también. */
window.PLAN = {
hora: "7:00 p. m.",
planos: {
  "PM": "Plano medio, al pecho",
  "PMC": "Plano medio corto (punch-in al 112 %)",
  "PD": "Plano detalle / inserto",
  "CEN": "Cenital",
  "BR": "B-roll",
  "GR": "Gráfico animado",
  "REC": "Persona recortada sobre fondo gráfico",
  "PANT": "Grabación de pantalla del celular",
  "PC": "Plano conjunto"
},
reels: [
{ id:"R01", fecha:"2026-11-03", titulo:"Eso tiene nombre (lanzamiento)", serie:"Lanzamiento", objetivo:"Marca", linea:"Todas", dur:"13 s", quien:"Nadie: motion graphics", palabra:"", redes:"Instagram · Facebook · canal de WhatsApp",
  gancho:{ c0:"Caja blanca centrada (y ≈ 0,40) sobre una cabina de camión de noche en gris: «Hice el viaje y no me han pagado el saldo.» A los 0,9 s se voltea y aparece SALDO DEL MANIFIESTO en ciruela sobre crema.", voz:"Sin voz." },
  guion:[
    ["0,0–2,4","BR + GR","—","caja «Hice el viaje y no me han pagado el saldo.» → SALDO DEL MANIFIESTO","flip de papel"],
    ["2,4–4,8","BR + GR","—","caja «Tengo varias deudas y ya no me alcanza.» → INSOLVENCIA","flip"],
    ["4,8–7,2","BR + GR","—","caja «Voy a crear mi empresa y no sé qué figura me conviene.» → CONSTITUCIÓN DE SAS","flip"],
    ["7,2–9,6","BR + GR","—","caja «Me pidieron el PESV y no sé por dónde empezar.» → PLAN ESTRATÉGICO DE SEGURIDAD VIAL","flip"],
    ["9,6–11,6","GR","—","las cuatro fichas se ordenan como tramos de un puente: ESO TIENE NOMBRE. · Y TIENE SALIDA.","golpe suave"],
    ["11,6–13,5","GR","—","se dibuja el arco del isologo; entra el logo completo, quieto y pequeño, abajo al centro","pulso grave"]
  ],
  tomas:["No se graba: cuatro planos de 3 s de B-roll (cabina de noche, facturas, oficina, patio de camiones) con el material de la web o con IA (skill orquestar-ia).","El último cuadro es igual al primero, para que el reel quede en bucle."],
  musica:"Pulso grave y limpio a 100 BPM, sin melodía protagonista. Flip de papel en cada volteo. −14 LUFS.",
  post:"Abogadas en transporte de carga, empresas, SST e insolvencia.\nLo que parece un enredo casi siempre tiene nombre. Y cuando tiene nombre, tiene salida.\nAtendemos: habilitación de empresas de carga, cobro de saldos y standby, PESV y SG-SST, constitución de SAS, insolvencia de persona natural y comercio exterior.\n¿Cuál de estas te ha pasado? Escríbenos: el WhatsApp está en el perfil.",
  tiktok:"", validar:["Las cuatro frases de situación (las mismas de la web)."],
  historia:{img:"R01", nota:"Ya hecha: se publica como historia el mismo día."} },

{ id:"R02", fecha:"2026-11-05", titulo:"El standby ya no son 12 horas", serie:"Eso tiene nombre · cap. 1", objetivo:"Comentario (≥ 0,5 % de comentarios sobre vistas)", linea:"Cobro de saldos y standby", dur:"40 s", quien:"Karem", palabra:"MANIFIESTO", regalo:"PDF «Lo que tienes que guardar de cada viaje para cobrar saldo y standby»", redes:"Instagram (trial reel mar 3–mié 4) · Facebook · TikTok",
  gancho:{ c0:"Gancho A: Karem recortada sobre una página del Decreto 1017 con «ocho (8) horas» subrayado en crema. Texto: STANDBY · YA NO SON 12 HORAS. — Gancho B: caja blanca sobre Karem en gris, «Me tuvieron todo el día en el descargue y no me pagaron nada.», que a los 1,2 s se voltea: STANDBY.", voz:"A: «Si te dijeron que el standby se cobra después de 12 horas, eso cambió hace un año.» · B: «¿Cuánto vale cada hora que te tienen parqueado? Ya tiene precio.»" },
  guion:[
    ["0–2,5","REC (A) / PM (B)","Gancho A o B","A: STANDBY · YA NO SON 12 HORAS · B: caja → STANDBY","flip / golpe"],
    ["2,5–5","PMC","«Desde septiembre de 2025, con el Decreto 1017, el cargue tiene un tope de 8 horas…»","8 HORAS · CARGUE","tic"],
    ["5–7","BR (fila de tractomulas en un patio)","«…y el descargue, otras 8.»","8 HORAS · DESCARGUE · chip «D. 1079 art. 2.2.1.7.6.8»","—"],
    ["7–10,5","PD (reloj de tablero + cita en la remesa de EJEMPLO)","«Se cuentan desde la hora de tu cita, aunque llegues antes.»","DESDE · LA CITA","tic de reloj"],
    ["10,5–14","GR (barra de horas que se llena; contador)","«Pasadas las 8, cada hora de más se paga aparte: 3 salarios mínimos diarios si el carro es articulado, unos 175 mil pesos…»","+3 SMLDV · ≈ $175.000","tic por número"],
    ["14–17","GR","«…y 2 si es rígido, unos 117 mil.»","+2 SMLDV · ≈ $117.000","tic"],
    ["17–20,5","PM + GR (5 casillas que se marcan)","«Y no esperes a que el cliente le pague a la empresa: la empresa tiene 5 días hábiles desde el cumplido para pagarte el saldo con esas horas…»","5 DÍAS · HÁBILES · chip «art. 2.2.1.7.6.6»","tic por casilla"],
    ["20,5–23","PMC","«…así el generador no le haya pagado.»","AUNQUE NO · LE HAYAN PAGADO","—"],
    ["23–26","PM","«Si se pasa, te debe intereses.»","+ INTERESES","golpe suave"],
    ["26–31","PD (mano revolviendo papeles en una guantera)","«¿El problema? Casi nadie guarda los papeles que lo prueban.»","SIN PAPELES · NO HAY COBRO","papeles"],
    ["31–37","PM","«Comenta MANIFIESTO y te mando la lista de lo que tienes que guardar de cada viaje.»","COMENTA · MANIFIESTO (crema sobre ciruela, ≥ 2 s)","golpe en la palabra"],
    ["37–40","GR","—","Cierre fijo: ESO TIENE NOMBRE. · Y TIENE SALIDA. + arco del isologo","pulso"]
  ],
  tomas:["Karem al pecho sobre fondo liso, para recortarla: el texto completo 3 veces y cada frase suelta 2 veces.","Los dos ganchos por separado, 3 veces cada uno.","5 s en silencio mirando a cámara (cuadro 0 del gancho B).","Insertos: remesa y manifiesto de EJEMPLO, reloj del tablero, guantera.","B-roll: patio de tractomulas y descargue (aliado transportador o IA)."],
  musica:"Pulso grave a 95 BPM. Tic en cada número, flip en el volteo, golpe suave en la palabra clave. −14 LUFS.",
  post:"Comenta MANIFIESTO y te mandamos la lista de lo que tienes que guardar de cada viaje.\n\nStandby: desde el Decreto 1017 de 2025, el cargue y el descargue tienen un tope de 8 horas cada uno, contadas desde la hora de la cita. Cada hora de más se paga aparte: 3 salarios mínimos diarios en vehículo articulado y 2 en rígido. La empresa tiene 5 días hábiles desde el cumplido para pagarte el saldo con esas horas, aunque el generador no le haya pagado, y si se pasa debe intereses.\n\nInformación general: cada caso se revisa con sus documentos.\nNorma: Decreto 1079 de 2015, arts. 2.2.1.7.6.6 y 2.2.1.7.6.8, modificados por el Decreto 1017 de 2025.\n#transportedecarga #standby",
  tiktok:"Standby transporte de carga 2026: ya no son 12 horas, son 8 (Decreto 1017). Cuánto vale cada hora de más.",
  validar:["Que el pago al propietario no admite «pacto en contrario».","Las cifras en pesos con el SMMLV 2026.","Que los arts. 14 y 15 del D. 1017 no estén suspendidos (revisar la semana de publicación).","La pregunta del DM."],
  historia:{img:"R02", nota:"Historia ya hecha; se ajusta el texto a «ya no son 12 horas»."} },

{ id:"R03", fecha:"2026-11-11", titulo:"9 requisitos para habilitar tu empresa de carga", serie:"En regla · cap. 1", objetivo:"Guardado (likes ÷ vistas ≥ 3 %)", linea:"Habilitación", dur:"36 s", quien:"Katherine", palabra:"", redes:"Instagram · Facebook · TikTok · LinkedIn de Karem (jue 12, con C4 en PDF)",
  gancho:{ c0:"La carpeta del expediente ya armada, con 9 separadores ciruela numerados. Texto: 9 REQUISITOS · PARA HABILITARTE.", voz:"«Para habilitar una empresa de transporte de carga hoy te piden 9 cosas. La que más hay que planear es la número 8.»" },
  guion:[
    ["0–3","CEN (carpeta armada)","Gancho","9 REQUISITOS · PARA HABILITARTE","clic"],
    ["3–5","PM","«Guárdalo: lo vas a necesitar.»","GUÁRDALO","—"],
    ["5–9","CEN (se abren los separadores 1 y 2)","«Uno: la solicitud al Ministerio, firmada por el representante legal. Dos: el certificado de existencia, de menos de 30 días, con el transporte de carga en el objeto social.»","1 · SOLICITUD / 2 · CERTIFICADO (lista acumulada, cada ítem ≥ 1,8 s)","clic por separador"],
    ["9–13","CEN + GR (organigrama)","«Tres: domicilio y oficinas. Cuatro: la estructura, con cuatro áreas: flota, finanzas con SIPLAFT, personal y técnica.»","3 · DOMICILIO / 4 · ESTRUCTURA","clic"],
    ["13–17","CEN","«Cinco: la relación de vehículos. Seis: estados financieros, o el balance inicial si la empresa es nueva. Siete: la declaración de renta del socio constituyente.»","5 · VEHÍCULOS / 6 · ESTADOS / 7 · RENTA","clic"],
    ["17–24","PMC + GR (1.000 → 250)","«Y la ocho, la que hay que planear: capital pagado o patrimonio de mil salarios mínimos. Si la empresa es solo de propietarios, con máximo tres vehículos cada uno, arrancan con 250 y tienen cinco años para llegar a mil.»","8 · 1.000 SMMLV / O 250 · SI SON PROPIETARIOS","golpe"],
    ["24–27","CEN","«La nueve: pagar los derechos del trámite.»","9 · DERECHOS","clic"],
    ["27–31","GR (calendario que avanza)","«El Ministerio tiene hasta 90 días hábiles para responder. Empieza con tiempo.»","HASTA · 90 DÍAS HÁBILES","—"],
    ["31–36","GR (lista completa quieta 3 s) + isologo","«Si la quieres armar con nosotras, el WhatsApp está en el perfil.»","la lista completa, para el pantallazo","pulso"]
  ],
  tomas:["Katherine al pecho: el texto completo 3 veces.","Cenital fijo (trípode con brazo) de la carpeta con 9 separadores: una toma por separador, con la mano entrando y saliendo.","5 s de la carpeta cerrada (sirve también para R06)."],
  musica:"Base limpia a 100 BPM; clic de separador en cada ítem. −14 LUFS.",
  post:"Guárdalo: los 9 requisitos para habilitar una empresa de transporte de carga en 2026.\n1. Solicitud al Ministerio de Transporte firmada por el representante legal.\n2. Certificado de existencia y representación (máx. 30 días hábiles) con el transporte de carga en el objeto social.\n3. Domicilio principal y relación de oficinas o agencias.\n4. Estructura: gestión de flota, financiera y administrativa (con SIPLAFT), personal y técnica vehicular.\n5. Relación de vehículos: placa, propietario y cédula.\n6. Estados financieros a 31 de diciembre (empresa nueva: balance inicial).\n7. Declaración de renta del socio constituyente, o certificación de no declarante.\n8. Capital pagado o patrimonio líquido de 1.000 SMMLV (empresas solo de propietarios: 250, con 5 años para llegar a 1.000).\n9. Pago de los derechos del trámite.\nEl Ministerio tiene hasta 90 días hábiles para responder.\n¿Ya tienes tu SAS o arrancas de cero? Escríbenos.\nNorma: Decreto 1079 de 2015, art. 2.2.1.7.2.3, modificado por el Decreto 1017 de 2025.\n#transportedecarga #habilitacion",
  tiktok:"Requisitos para habilitar una empresa de transporte de carga 2026 (Decreto 1017): los 9 que pide el Ministerio.",
  validar:["La lista, el orden y los 90 días hábiles.","Que el art. 4 del D. 1017 no esté suspendido."],
  historia:{img:"R03", nota:"Historia ya hecha."} },

{ id:"R04", fecha:"2026-11-17", titulo:"Ya no me alcanza", serie:"Eso tiene nombre · cap. 2", objetivo:"Comentario (≥ 0,5 %)", linea:"Insolvencia", dur:"40 s", quien:"Karem", palabra:"DEUDAS", regalo:"PDF «5 preguntas para saber si la insolvencia es para ti», por privado", redes:"Instagram · Facebook · TikTok",
  gancho:{ c0:"Caja blanca sobre Karem en gris: «Tengo varias deudas y ya no me alcanza para pagarlas.» A los 1,4 s se voltea: INSOLVENCIA, y la imagen recupera el color.", voz:"«Si ya no te alcanza para pagar tus deudas, en 2025 la ley cambió a tu favor.»" },
  guion:[
    ["0–2,5","PM (set cálido)","Gancho","caja → INSOLVENCIA","flip"],
    ["2,5–8","PMC + GR (barra de deuda: la marca baja del 50 al 30 %)","«Antes, para pedir insolvencia, la mitad de tus deudas tenía que estar en mora. Con la Ley 2445 basta el 30 %: dos o más deudas, con dos o más acreedores, atrasadas más de 90 días.»","ANTES 50 % / AHORA · 30 % · chip «CGP art. 538»","tic"],
    ["8–13","BR (mesa de cocina con recibos sin datos, luz de mañana)","«Cuando te aceptan el trámite se frenan los embargos y los descuentos por libranza, menos los de alimentos.»","SE FRENAN · LOS EMBARGOS","piano suave"],
    ["13–17","PMC","«Y tu empleador no te puede despedir por eso.»","NO PUEDEN · DESPEDIRTE","—"],
    ["17–25","BR (camión estacionado frente a una casa; mostrador de tienda)","«Si tienes un negocio pequeño, también puedes. Y si eres transportador y tu camión es tu herramienta de trabajo, el camión no cuenta para el tope de activos.»","PEQUEÑO · COMERCIANTE / EL CAMIÓN · NO CUENTA","—"],
    ["25–30","GR (5 casillas borrosas)","«No es para todo el mundo, y no es para hacerlo cada año. Hay cinco preguntas que te dicen si es para ti.»","5 · PREGUNTAS","—"],
    ["30–37","PM","«Comenta DEUDAS y te las mando por privado. Nadie más ve tu respuesta.»","COMENTA · DEUDAS","golpe suave"],
    ["37–40","GR","—","Cierre fijo: ESO TIENE NOMBRE. · Y TIENE SALIDA.","pulso"]
  ],
  tomas:["Karem al pecho en el set 2 (esquina cálida, lámpara encendida, otra prenda), con voz tranquila: el texto completo 3 veces.","5 s en silencio (cuadro 0).","B-roll: recibos sin datos legibles, taza, luz de mañana; camión frente a una casa (aliado o IA, rotulado «recreación»)."],
  musica:"Piano y pulso suave a 80 BPM, sin golpes fuertes. −14 LUFS.",
  post:"Comenta DEUDAS y te mandamos por privado las 5 preguntas para saber si la insolvencia es para ti.\n\nDesde la Ley 2445 de 2025:\n· Basta con que el 30 % de tus deudas esté en mora (antes era el 50 %): dos o más obligaciones, con dos o más acreedores, a más de 90 días.\n· Al aceptarse el trámite se suspenden los embargos y los descuentos por libranza (salvo alimentos).\n· Tu empleador no puede tenerlo en cuenta para despedirte.\n· También aplica al pequeño comerciante con activos de menos de 1.000 salarios mínimos, sin contar la vivienda familiar ni el vehículo con que trabaja.\nNo es para todos. Información general: cada caso se revisa con sus documentos.\n#insolvencia #deudas",
  tiktok:"Insolvencia persona natural 2026: ya no tienes que deber la mitad, basta el 30 % (Ley 2445).",
  validar:["La redacción completa.","«El camión no cuenta»: solo para el tope de activos; no insinuar que queda protegido en una liquidación.","Las 5 preguntas del regalo."],
  historia:{img:"R04", nota:"Historia ya hecha."} },

{ id:"R05", fecha:"2026-11-19", titulo:"Respuesta a…: ¿qué me pueden descontar del saldo?", serie:"Respuesta a… · cap. 1", objetivo:"Alcance por búsqueda", linea:"Cobro de saldos", dur:"30 s", quien:"Karem", palabra:"", redes:"Instagram (trial reel mar 17) · Facebook · TikTok",
  gancho:{ c0:"Gancho A: el sticker de respuesta de Instagram con el comentario real más repetido (si no llega, la pregunta semilla «¿Me pueden descontar del saldo lo que ellos quieran?», rotulada «Pregunta que nos hacen mucho») sobre Karem. — Gancho B: SOLO 2 DESCUENTOS sobre una liquidación de EJEMPLO, con todo tachado menos dos líneas.", voz:"A: «Respuesta corta: solo dos cosas.» · B: «De tu saldo solo te pueden descontar dos cosas. Te digo cuáles.»" },
  guion:[
    ["0–2,5","PM + sticker (A) / PD (B)","Gancho A o B","A: el comentario · B: SOLO 2 DESCUENTOS","—"],
    ["2,5–8","PD (liquidación de EJEMPLO: las líneas se tachan menos dos)","«Del valor a pagar de tu viaje solo se puede descontar la retención en la fuente y el ICA. Nada más.»","RETENCIÓN · E ICA · chip «D. 1079 art. 2.2.1.7.6.7»","tachón"],
    ["8–14","GR (dos casillas separadas)","«Si la empresa te presta otros servicios, eso va en una casilla aparte. No se le resta a tu saldo.»","CASILLA · APARTE","—"],
    ["14–19","PMC","«Y el contrato de vinculación no le permite pagarte por debajo del SICE-TAC.»","NI POR DEBAJO · DEL SICE-TAC","—"],
    ["19–25","PD (mano con la liquidación)","«Si te descontaron algo más, guarda la liquidación del viaje: la empresa tiene que dártela.»","GUARDA LA · LIQUIDACIÓN","papel"],
    ["25–30","PM","«¿Qué te han descontado a ti sin explicarte? Déjalo en los comentarios y te respondemos en el próximo video.»","¿QUÉ TE · DESCONTARON?","pulso"]
  ],
  tomas:["En la grabación del 28-oct: la pregunta semilla, 3 veces.","Si llega un comentario mejor: Karem lo responde con el celular entre el mar 10 y el vie 13-nov (10 minutos, la misma luz).","Inserto: liquidación de viaje de EJEMPLO."],
  musica:"Pulso sobrio a 95 BPM; un tachón por cada línea descartada. −14 LUFS.",
  post:"¿Qué te pueden descontar del saldo del viaje? Solo dos cosas: retención en la fuente e ICA.\n\nLos servicios distintos a mover la carga van en una casilla aparte y no se le restan al valor a pagar. El contrato de vinculación no autoriza pagarte por debajo del SICE-TAC. La empresa tiene que entregarte la liquidación del viaje.\n¿Qué te han descontado a ti? Cuéntanos en los comentarios (sin nombres de empresas).\nInformación general: cada caso se revisa con sus documentos.\n#transportedecarga",
  tiktok:"¿Qué le pueden descontar al transportador del saldo del manifiesto? Solo retención e ICA (Decreto 1079).",
  validar:["Cómo se manejan los daños o faltantes de la carga (no se mencionan hasta que Karem lo defina).","Que la liquidación del viaje es obligatoria (art. 2.2.1.7.6.9)."],
  historia:{img:"R05", nota:"La historia ya hecha era del sketch: se rehace como «Respuesta a…»."} },

{ id:"R06", fecha:"2026-11-25", titulo:"¿Y si montan su propia empresa de carga?", serie:"Sin vueltas · cap. 1", objetivo:"Venta (DMs con intención y cotizaciones)", linea:"Habilitación", dur:"47 s", quien:"Karem", palabra:"HABILITAR", regalo:"Enlace al cotizador de la web + PDF de los 9 requisitos", redes:"Instagram (colaboración con Karem) · Facebook · TikTok · LinkedIn de Karem (jue 26)",
  gancho:{ c0:"Tres camiones de dueños distintos estacionados en fila. Texto: TU PROPIA · EMPRESA DE CARGA.", voz:"«Si estás cansado de esperar el saldo de otros, mira esto: con otros propietarios pueden montar su propia empresa.»" },
  guion:[
    ["0–3","PC (tres camiones en fila)","Gancho","TU PROPIA · EMPRESA DE CARGA","motor que arranca"],
    ["3–10","PM + GR (1.000 → 250)","«La norma permite empresas formadas solo por propietarios, cada socio con máximo tres vehículos. Y para ellas el capital de entrada no es de mil salarios mínimos: es de 250.»","SOLO · PROPIETARIOS / 250 SMMLV · chip «art. 2.2.1.7.2.3»","golpe"],
    ["10–15","GR (barra de 5 años)","«Tienen cinco años para completar los mil. Si no, la habilitación se cae.»","5 AÑOS · PARA LLEGAR A 1.000","tic"],
    ["15–24","CEN (la carpeta de R03 cerrándose) + GR (organigrama)","«Necesitan una SAS con el transporte de carga en el objeto social, cuatro áreas —flota, finanzas, personal y técnica— y radicar ante el Ministerio, que tiene hasta 90 días hábiles para responder.»","SAS · 4 ÁREAS · 90 DÍAS","clic"],
    ["24–28","PMC","«Y es la empresa la que paga el saldo y el standby a tiempo. Ahí ya no esperan: cumplen.»","DEL OTRO LADO · DEL PUENTE","—"],
    ["28–38","PANT (cotizador de la web: «Ya tengo mi SAS» / «Desde cero»)","«Nosotras armamos el expediente con ustedes. Si ya tienen la SAS, revisamos qué falta. Si no, la creamos lista para habilitarse. La cotización llega por escrito, antes de empezar.»","DOS CAMINOS · UN PUENTE / POR ESCRITO","clic al tocar"],
    ["38–44","PM","«Comenta HABILITAR y te mando el enlace y la lista completa.»","COMENTA · HABILITAR","golpe en la palabra"],
    ["44–47","GR","—","isologo quieto","pulso"]
  ],
  tomas:["Karem al pecho, set 1: el texto completo 3 veces.","Tres camiones de dueños distintos en fila (aliado transportador, o IA rotulada «recreación»).","Grabación de pantalla del cotizador en el celular (la hace Claude con Edge, 1080×1920).","La carpeta de R03 cerrándose."],
  musica:"Base segura a 100 BPM; clic al tocar la ruta; golpe en «POR ESCRITO». −14 LUFS.",
  post:"Comenta HABILITAR y te mandamos el enlace para cotizar y la lista de los 9 requisitos.\n\nUna empresa de transporte de carga formada solo por propietarios (máximo 3 vehículos por socio) arranca con un capital de 250 salarios mínimos, no de 1.000, y tiene 5 años para completar los 1.000. Necesitan una SAS con el transporte en el objeto social, la estructura de cuatro áreas y la solicitud ante el Ministerio de Transporte, que tiene hasta 90 días hábiles para responder.\nAtendemos la habilitación de empresas de transporte de carga: si ya tienen SAS, revisamos qué falta; si no, la creamos lista para habilitarse.\nNorma: Decreto 1079 de 2015, art. 2.2.1.7.2.3, modificado por el Decreto 1017 de 2025.\n#transportedecarga #habilitacion",
  tiktok:"Empresa de transporte de carga de propietarios: capital de 250 salarios mínimos, no 1.000 (Decreto 1017).",
  validar:["Las reglas de la empresa de propietarios (250 SMMLV, 3 vehículos por socio, 5 años).","«La habilitación se cae» (condición resolutoria).","Bloqueante: el formulario del cotizador conectado y la web en el dominio definitivo; si no, el cierre es «escríbenos por WhatsApp»."],
  historia:{img:"R06", nota:"La historia ya hecha se ajusta a «Tu propia empresa de carga»."} }
],

carruseles: [
 { id:"C1", fecha:"2026-11-04", titulo:"Quién te responde", objetivo:"Marca", laminas:["C1-01","C1-02","C1-03","C1-04","C1-05"], redes:"Instagram · Facebook · LinkedIn de Karem",
   post:"Si nos escribes, te responde una de nosotras. Así de simple.\n\nKarem, Katherine y Diana: conciliación, sociedades, insolvencia, SST y transporte de carga. Tú nos cuentas lo que te pasa con tus palabras; nosotras te decimos cómo se llama y qué sigue.\n\n¿Con qué empezamos? Cuéntanoslo en los comentarios o escríbenos: el WhatsApp está en el perfil.", validar:["Estudios y años de cada una."] },
 { id:"C2", fecha:"2026-11-06", titulo:"Los papeles de cada viaje", objetivo:"Guardado + MANIFIESTO", laminas:["C2-01","C2-02","C2-03","C2-04","C2-05","C2-06"], redes:"Instagram · Facebook · TikTok (modo foto)",
   post:"Comenta MANIFIESTO y te mandamos la lista completa de lo que tienes que guardar de cada viaje.\n\nEsperar de más en el cargue o el descargue tiene nombre: standby. La norma pone un tope de 8 horas desde la hora de la cita, y cada hora de más se paga con recargo. Que no te paguen lo que faltaba del viaje también tiene nombre: saldo del manifiesto, y la empresa tiene 5 días hábiles desde el cumplido para pagarlo.\n\nLos dos se reclaman con papeles. Guárdalo para tu próximo viaje.\n\nNorma: Decreto 1079 de 2015, arts. 2.2.1.7.6.6 y 2.2.1.7.6.8, modificados por el Decreto 1017 de 2025. Información general: cada caso se revisa con sus documentos.", validar:["La lista de papeles."] },
 { id:"C3", fecha:"2026-11-10", titulo:"11 situaciones, 11 nombres", objetivo:"Guardado", laminas:["C3-01","C3-02","C3-03","C3-04","C3-05","C3-06"], redes:"Instagram · Facebook",
   post:"Guárdalo: 11 situaciones con su nombre legal.\n\nLo que parece un enredo casi siempre tiene nombre. Y cuando tiene nombre, tiene ruta: crear tu empresa, habilitarla, el SG-SST y el PESV, los roces del equipo, las deudas, importar o exportar.\n\n¿La tuya no está? Cuéntala en los comentarios con tus palabras, sin nombres ni datos, y te decimos cómo se llama.", validar:["Las 11 frases (las mismas de la web)."] },
 { id:"C4", fecha:"2026-11-13", titulo:"Habilitación, la lista", objetivo:"Guardado", laminas:["C4-01","C4-02","C4-03","C4-04","C4-05","C4-06"], redes:"Instagram · Facebook · TikTok (modo foto) · LinkedIn (PDF, jue 12)",
   post:"Guárdalo: los 9 requisitos para habilitar tu empresa de transporte de carga ante el Ministerio de Transporte.\n(Los 9 numerados, como en el post de R03.)\n\n¿Ya tienes tu SAS o arrancas de cero? Escríbenos: el WhatsApp está en el perfil. La cotización te llega por escrito, antes de empezar.\n\nNorma: Decreto 1079 de 2015, art. 2.2.1.7.2.3, modificado por el Decreto 1017 de 2025.", validar:["«El que más hay que planear: el capital»."] },
 { id:"C5", fecha:"2026-11-20", titulo:"Insolvencia: 4 cosas que no son ciertas", objetivo:"Guardado + DEUDAS", laminas:["C5-01","C5-02","C5-03","C5-04","C5-05","C5-06"], redes:"Instagram · Facebook · TikTok (modo foto)",
   post:"Comenta DEUDAS y te mandamos por privado las 5 preguntas para saber si la insolvencia es para ti.\n\nSe dice que es solo para empresas, que hay que esperar a que te demanden, que te quitan todo y que mientras tanto te siguen embargando. En el carrusel está lo que dice la ley, mito por mito.\n\nNo es para todos: cada caso se revisa. Si es para ti, mejor saberlo pronto.\n\nNorma: Código General del Proceso, Título IV, modificado por la Ley 2445 de 2025.", validar:["Los 4 mitos y sus respuestas."] },
 { id:"C6", fecha:"2026-11-27", titulo:"La prima de diciembre", objetivo:"Guardado (pymes)", laminas:["C6-01","C6-02","C6-03","C6-04","C6-05","C6-06"], redes:"Instagram · Facebook",
   post:"Guárdalo para el 20 de diciembre.\n\nLa segunda mitad de la prima de servicios se paga, a más tardar, en los primeros 20 días de diciembre. Este año el 20 cae domingo.\n\nFórmula: salario mensual × días trabajados en el semestre ÷ 360. Si el trabajador gana hasta 2 salarios mínimos, el auxilio de transporte entra en la base. Si entró a mitad de semestre, se paga en proporción.\n\n¿Tu empresa tiene más dudas laborales? Escríbenos: el WhatsApp está en el perfil.\n\nNorma: Código Sustantivo del Trabajo, art. 306 (Ley 1788 de 2016).", validar:["Fecha, cálculo y ejemplo."] }
],

historias: [
 ["2026-11-03","H01","«Estrenamos casa. Tu problema tiene nombre. Y tiene salida.»","Se publica con R01 compartido"],
 ["2026-11-03","H02","«¿Cuál de estas te ha pasado?» + las 4 frases de R01","Encuesta A · B · C · D"],
 ["2026-11-05","H03","«¿Esperaste de más en el descargue?» + «Comenta en el reel MANIFIESTO»","R02 compartido"],
 ["2026-11-08","H04","«Cuéntanos tu situación con tus palabras. Te decimos cómo se llama.»","Caja de preguntas (alimenta R05)"],
 ["2026-11-11","H05","«Lo que te piden para habilitarte.» + GUÁRDALO","R03 compartido"],
 ["2026-11-13","H06","«¿Tu empresa ya está habilitada?»","Encuesta: Sí · En eso · ¿Qué es eso?"],
 ["2026-11-15","H07","«Nos escribieron: [frase anónima validada] → Eso se llama [nombre legal].»","Plantilla: se llena con una respuesta real de la caja"],
 ["2026-11-17","H08","«“Ya no me alcanza.” Comenta en el reel DEUDAS. La respuesta te llega por privado.»","R04 compartido"],
 ["2026-11-19","H09","CAMBIA a: «¿Qué te han descontado del saldo sin explicarte?»","Caja de preguntas (alimenta la respuesta de diciembre)"],
 ["2026-11-21","H10","«Lo que nos contaron.» + 3 respuestas anónimas","Plantilla"],
 ["2026-11-25","H11","«¿Tu empresa ya puede cargar? Cotiza la habilitación en línea.»","Sticker de enlace al cotizador"],
 ["2026-11-27","H12","«20 de diciembre. ¿Tu empresa ya tiene lista la prima?»","Encuesta: Sí · Todavía no"]
],

extra: {
 "2026-10-22":[["g","Enviar a Karem el plan, las tres preguntas de arranque y la lista de validaciones"]],
 "2026-10-27":[["g","Fecha límite para que la firma valide los datos legales de guiones, carruseles y regalos"]],
 "2026-10-28":[["g","Grabación: 2 h 30 (Karem, Katherine y Diana). Ver la sección Grabación"]],
 "2026-10-29":[["g","Perfil nuevo en Instagram y Facebook, cuenta de TikTok, canal de WhatsApp y regalo MANIFIESTO en PDF"]],
 "2026-10-31":[["g","Respuesta automática de MANIFIESTO probada desde otra cuenta; R01 y R02 por el revisor"]],
 "2026-11-02":[["f","Festivo"]],
 "2026-11-03":[["t","Trial reel R02: gancho A y gancho B solo para no seguidores; a las 48 h se publica el ganador el jueves"]],
 "2026-11-09":[["w","Canal de WhatsApp: «Cargue y descargue: 8 horas desde la cita. Cada hora de más se paga aparte. Guárdalo.» + lámina 3 de C2"]],
 "2026-11-12":[["l","LinkedIn de Karem: C4 en PDF + un párrafo para gerentes de empresa sobre la habilitación"]],
 "2026-11-16":[["f","Festivo"],["w","Canal de WhatsApp: los 9 requisitos para habilitar una empresa de carga"]],
 "2026-11-17":[["t","Trial reel R05: gancho A (el comentario) y gancho B («Solo 2 descuentos»)"]],
 "2026-11-23":[["w","Canal de WhatsApp: qué te pueden descontar del saldo (solo retención e ICA)"]],
 "2026-11-26":[["l","LinkedIn de Karem: la empresa de propietarios con 250 SMMLV"]],
 "2026-11-30":[["w","Canal de WhatsApp: la prima se paga el viernes 18 (el 20 es domingo)"],["g","Cierre del mes: tabla de medición y ajuste de diciembre"]]
}
};
