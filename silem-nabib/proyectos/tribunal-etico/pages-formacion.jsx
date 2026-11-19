// Formación Ética
const { useState: useStateF } = React;

const FormacionPage = () => {
  return (
    <div className="page-enter">
      <PageHero
        eyebrow="Formación Ética"
        title="Una biblioteca viva para la práctica consciente."
        lead="Traducimos la Ley 911 al turno diario. Aquí encontrará el código segmentado en lenguaje ciudadano, casos anonimizados narrados, contenido audiovisual y material descargable para su consulta."
      />
      <CategoryNav/>
      <CodigoEtico/>
      <CasosEticos/>
      <CentroMultimedia/>
      <Repositorio/>
    </div>
  );
};

const CategoryNav = () => {
  const cats = [
    { id: "codigo", n: "01", l: "Código Ético", c: "Artículos en lenguaje claro" },
    { id: "casos", n: "02", l: "Casos Éticos", c: "Aprendizaje preventivo" },
    { id: "multimedia", n: "03", l: "Centro Multimedia", c: "Videos y webinars" },
    { id: "descargas", n: "04", l: "Descargas", c: "Guías e infografías" },
  ];
  const scroll = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  };
  return (
    <section style={{ position: "sticky", top: 76, zIndex: 50, background: "#fff", borderBottom: "1px solid var(--line)" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 56px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "var(--line)" }}>
        {cats.map(c => (
          <button key={c.id} onClick={() => scroll(c.id)} className="cat-btn" style={{
            background: "#fff", padding: "20px 24px", textAlign: "left",
            display: "flex", gap: 16, alignItems: "center",
            transition: "all 180ms ease",
          }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--slate-400)" }}>{c.n}</span>
            <div>
              <div className="display" style={{ fontSize: 14.5, fontWeight: 700 }}>{c.l}</div>
              <div style={{ fontSize: 11.5, color: "var(--slate-500)", marginTop: 2 }}>{c.c}</div>
            </div>
          </button>
        ))}
      </div>
      <style>{`.cat-btn:hover { background: var(--bg-soft) !important; }`}</style>
    </section>
  );
};

const CodigoEtico = () => {
  const articles = [
    {
      art: "Art. 1", titulo: "Dignidad humana",
      preview: "El cuidado de enfermería no se ejerce sobre cuerpos; se ejerce con personas. La dignidad del paciente es el punto de partida.",
      lectura: "4 min", tipo: "Principio",
    },
    {
      art: "Art. 6", titulo: "Consentimiento informado",
      preview: "Antes de cualquier procedimiento, el paciente tiene derecho a entender qué, por qué y con qué riesgos. Documentar no es burocracia, es ética.",
      lectura: "6 min", tipo: "Procedimiento",
    },
    {
      art: "Art. 9", titulo: "Confidencialidad",
      preview: "Lo que se conoce en el ejercicio profesional no se comparte: ni en el café, ni en grupos de WhatsApp, ni con la familia. Caso real explicado.",
      lectura: "5 min", tipo: "Conducta",
    },
    {
      art: "Art. 14", titulo: "Registro en la historia clínica",
      preview: "Si no está escrito, legalmente no se hizo. Cómo registrar con claridad, oportunidad y veracidad cada intervención.",
      lectura: "8 min", tipo: "Procedimiento",
    },
    {
      art: "Art. 21", titulo: "Delegación responsable",
      preview: "Delegar una función no transfiere la responsabilidad ética. El enfermero jefe responde por la supervisión adecuada del personal a su cargo.",
      lectura: "5 min", tipo: "Conducta",
    },
    {
      art: "Art. 32", titulo: "Sus derechos como profesional",
      preview: "El Tribunal no solo vigila los deberes del enfermero; también protege sus derechos frente a las instituciones empleadoras.",
      lectura: "7 min", tipo: "Derechos",
    },
  ];
  return (
    <section id="codigo" className="section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
        <div>
          <div className="eyebrow">Código ético explicado</div>
          <h2 className="display display-lg" style={{ margin: 0 }}>De la ley al turno.</h2>
        </div>
        <a className="mono" style={{ fontSize: 12.5, color: "var(--navy-900)", textDecoration: "underline", textUnderlineOffset: 4 }}>
          Ver todos los artículos →
        </a>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {articles.map((a, i) => (
          <article key={i} className="art-card" style={{
            border: "1px solid var(--line)", background: "#fff",
            padding: "32px 28px 28px",
            display: "flex", flexDirection: "column",
            transition: "all 220ms ease",
            cursor: "pointer",
            minHeight: 280,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <span style={{
                fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13,
                color: "#fff", background: "var(--navy-900)",
                padding: "6px 12px", letterSpacing: "0.04em",
              }}>{a.art}</span>
              <span className="mono" style={{ fontSize: 10.5, color: "var(--slate-500)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{a.tipo}</span>
            </div>
            <h3 className="display" style={{ fontSize: 22, fontWeight: 700, margin: "0 0 12px", letterSpacing: "-0.01em" }}>{a.titulo}</h3>
            <p className="body" style={{ flex: 1 }}>{a.preview}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
              <span className="mono" style={{ fontSize: 11, color: "var(--slate-500)" }}>⏱ {a.lectura}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--navy-900)", display: "flex", alignItems: "center", gap: 6 }}>Leer <Icon name="arrow_right" size={14}/></span>
            </div>
          </article>
        ))}
      </div>
      <style>{`.art-card:hover { border-color: var(--navy-900); transform: translateY(-3px); box-shadow: 0 18px 40px -16px rgba(2,8,102,0.16); }`}</style>
    </section>
  );
};

const CasosEticos = () => {
  const cases = [
    {
      tag: "Confidencialidad",
      title: "El estado de WhatsApp que costó una licencia.",
      summary: "Una profesional publicó una historia con un detalle clínico, sin mencionar al paciente. ¿Por qué fue suficiente para abrir proceso?",
      lecciones: 3,
    },
    {
      tag: "Delegación",
      title: "La auxiliar, la medicación y el enfermero jefe.",
      summary: "Una omisión en el conteo de medicación derivó en investigación. La responsabilidad no recayó donde el equipo esperaba.",
      lecciones: 4,
    },
    {
      tag: "Asepsia",
      title: "Una omisión invisible.",
      summary: "Saltarse un protocolo básico de asepsia parece menor hasta que aparece la infección. Cronología de una negligencia.",
      lecciones: 3,
    },
  ];
  return (
    <section id="casos" style={{ background: "var(--bg-soft)" }}>
      <div className="section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
          <div style={{ maxWidth: 560 }}>
            <div className="eyebrow">Casos éticos explicados</div>
            <h2 className="display display-lg" style={{ margin: 0 }}>Te puede pasar a ti.</h2>
            <p className="lead" style={{ marginTop: 18 }}>
              Casos reales narrados con todos los nombres y detalles cambiados.
              No buscan señalar; buscan prevenir.
            </p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {cases.map((c, i) => (
            <article key={i} style={{ background: "var(--navy-900)", color: "#fff", display: "flex", flexDirection: "column", transition: "all 240ms ease", cursor: "pointer", overflow: "hidden" }} className="case-card">
              <Placeholder label={c.tag} aspect="16/10" tone="dark"/>
              <div style={{ padding: "28px 28px 30px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div className="mono" style={{ fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 14 }}>
                  Caso · {c.tag}
                </div>
                <h3 className="display" style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.25, color: "#fff", margin: "0 0 14px", letterSpacing: "-0.01em" }}>{c.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "rgba(255,255,255,0.75)", margin: 0, flex: 1 }}>{c.summary}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
                  <span className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.65)" }}>{c.lecciones} lecciones clave</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>Leer caso <Icon name="arrow_right" size={14}/></span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <style>{`.case-card:hover { transform: translateY(-4px); box-shadow: 0 24px 50px -20px rgba(2,8,102,0.5); }`}</style>
    </section>
  );
};

const CentroMultimedia = () => {
  const videos = [
    { t: "Confidencialidad en redes sociales", d: "Webinar · 42 min", featured: true, label: "Webinar destacado" },
    { t: "Ley 911 explicada", d: "Serie · 6 episodios", featured: false, label: "Episodio 1" },
    { t: "Un tinto con la Magistrada", d: "Conversaciones · 12 min", featured: false, label: "Conversación" },
    { t: "ABC del Debido Proceso", d: "Animación · 4 min", featured: false, label: "Animación" },
  ];
  return (
    <section id="multimedia" className="section">
      <div style={{ marginBottom: 48 }}>
        <div className="eyebrow">Centro multimedia</div>
        <h2 className="display display-lg" style={{ margin: 0 }}>Videos, webinars y conferencias.</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gridTemplateRows: "auto auto", gap: 20 }}>
        {videos.map((v, i) => (
          <div key={i} className="video-card" style={{
            gridColumn: i === 0 ? "1 / 2" : undefined,
            gridRow: i === 0 ? "1 / 3" : undefined,
            position: "relative", cursor: "pointer", transition: "all 220ms ease",
          }}>
            <Placeholder label={v.label} aspect={i === 0 ? "4/5" : "16/10"} tone="dark"/>
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(180deg, transparent 50%, rgba(2,8,102,0.85) 100%)",
              display: "flex", flexDirection: "column", justifyContent: "flex-end",
              padding: i === 0 ? "32px" : "20px 22px",
              color: "#fff",
            }}>
              <div style={{
                width: i === 0 ? 64 : 48, height: i === 0 ? 64 : 48,
                borderRadius: "50%", background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: "1.5px solid rgba(255,255,255,0.6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: i === 0 ? 24 : 16,
              }}>
                <Icon name="play" size={i === 0 ? 22 : 16}/>
              </div>
              <h3 className="display" style={{
                fontSize: i === 0 ? 28 : 17, fontWeight: 700, lineHeight: 1.2,
                color: "#fff", margin: 0, letterSpacing: "-0.01em",
              }}>{v.t}</h3>
              <div className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 8, letterSpacing: "0.12em", textTransform: "uppercase" }}>{v.d}</div>
            </div>
          </div>
        ))}
      </div>
      <style>{`.video-card:hover { transform: translateY(-3px); }`}</style>
    </section>
  );
};

const Repositorio = () => {
  const files = [
    { icon: "pdf", t: "Guía de bolsillo · Código ético", d: "Síntesis ilustrada de los 32 artículos clave", size: "1.8 MB" },
    { icon: "pdf", t: "Checklist · Entrega de turno", d: "Lista verificada de datos que no pueden faltar", size: "640 KB" },
    { icon: "pdf", t: "Infografía · Debido proceso", d: "Las 4 fases del proceso ético-disciplinario", size: "1.2 MB" },
    { icon: "pdf", t: "Sus 5 derechos según la Ley 911", d: "Carrusel imprimible para sala de descanso", size: "920 KB" },
    { icon: "pdf", t: "Caso de estudio · Confidencialidad", d: "Análisis narrativo de tres situaciones reales", size: "2.4 MB" },
    { icon: "pdf", t: "Mini código de ética", d: "Edición de bolsillo · formato 90×130 mm", size: "3.1 MB" },
  ];
  return (
    <section id="descargas" style={{ background: "var(--navy-900)", color: "#fff" }}>
      <div className="section">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64, alignItems: "start" }}>
          <div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 22 }}>— Repositorio de descargas</div>
            <h2 className="display display-lg" style={{ color: "#fff" }}>Material descargable.</h2>
            <p className="lead" style={{ color: "rgba(255,255,255,0.75)" }}>
              Guías de bolsillo, infografías y checklists pensados para imprimir,
              guardar en el celular o compartir con su equipo de turno.
            </p>
            <button className="btn btn-outline" style={{ marginTop: 24 }}>
              Descargar todo en ZIP <Icon name="download" size={16}/>
            </button>
          </div>
          <div style={{ display: "grid", gap: 1, background: "rgba(255,255,255,0.15)" }}>
            {files.map((f, i) => (
              <div key={i} className="dl-row" style={{
                background: "var(--navy-900)", padding: "22px 26px",
                display: "flex", alignItems: "center", gap: 22,
                transition: "all 180ms ease", cursor: "pointer",
              }}>
                <div style={{
                  width: 44, height: 44, border: "1.5px solid rgba(255,255,255,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff",
                }}>
                  <Icon name="document" size={20}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="display" style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>{f.t}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>{f.d}</div>
                </div>
                <div className="mono" style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)" }}>{f.size}</div>
                <Icon name="download" size={18}/>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`.dl-row:hover { background: #0a1280 !important; }`}</style>
    </section>
  );
};

Object.assign(window, { FormacionPage });
