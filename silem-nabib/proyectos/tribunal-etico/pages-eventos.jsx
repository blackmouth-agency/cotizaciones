// Capacitaciones y Eventos + Comunicados
const { useState: useStateE } = React;

// ── CAPACITACIONES Y EVENTOS ──────────────────────────────────
const EventosPage = () => {
  const [tab, setTab] = useStateE("capacitaciones");
  return (
    <div className="page-enter">
      <PageHero
        eyebrow="Capacitaciones y Eventos"
        title="Formación continua, encuentros y memoria institucional."
        lead="Cursos, talleres, congresos y jornadas regionales para sostener la cultura ética del ejercicio profesional. Lo que viene y lo que ya hemos vivido juntos."
      />
      <TabsBar tab={tab} setTab={setTab}/>
      {tab === "capacitaciones" ? <CapacitacionesList/> : <EventosList/>}
      <MemoriaInstitucional/>
    </div>
  );
};

const TabsBar = ({ tab, setTab }) => (
  <div style={{ borderBottom: "1px solid var(--line)", background: "#fff", position: "sticky", top: 76, zIndex: 50 }}>
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 56px", display: "flex", gap: 0 }}>
      {[
        { id: "capacitaciones", l: "Capacitaciones", c: "Cursos · talleres · actualizaciones" },
        { id: "eventos", l: "Eventos", c: "Encuentros · congresos · jornadas" },
      ].map(t => (
        <button key={t.id} onClick={() => setTab(t.id)} style={{
          padding: "24px 32px 22px",
          textAlign: "left",
          borderBottom: "3px solid " + (tab === t.id ? "var(--navy-900)" : "transparent"),
          color: tab === t.id ? "var(--navy-900)" : "var(--slate-500)",
          transition: "all 200ms ease",
        }}>
          <div className="display" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>{t.l}</div>
          <div style={{ fontSize: 12, marginTop: 4, color: tab === t.id ? "var(--slate-700)" : "var(--slate-400)" }}>{t.c}</div>
        </button>
      ))}
    </div>
  </div>
);

const CapacitacionesList = () => {
  const courses = [
    { date: { d: "22", m: "MAY" }, status: "Inscripciones abiertas", t: "Curso de actualización en Ley 911", mode: "Virtual sincrónico", duration: "8 sesiones · 24 h", cup: "45/60", price: "Gratuito" },
    { date: { d: "05", m: "JUN" }, status: "Próximamente", t: "Taller: Registro en historia clínica", mode: "Presencial · Cali", duration: "Jornada única · 6 h", cup: "12/40", price: "Gratuito" },
    { date: { d: "19", m: "JUN" }, status: "Inscripciones abiertas", t: "Deontología aplicada al servicio domiciliario", mode: "Virtual sincrónico", duration: "4 sesiones · 12 h", cup: "28/80", price: "Gratuito" },
    { date: { d: "10", m: "JUL" }, status: "Próximamente", t: "Bioética clínica para enfermería de UCI", mode: "Híbrido", duration: "6 sesiones · 18 h", cup: "—", price: "Gratuito" },
  ];
  return (
    <section className="section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 24, marginBottom: 36 }}>
        <h2 className="display display-lg" style={{ margin: 0 }}>Cohorte 2026 · II semestre</h2>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Icon name="search" size={16} style={{ position: "absolute", left: 14, top: 14, color: "var(--slate-400)" }}/>
            <input placeholder="Buscar curso..." style={{
              padding: "11px 16px 11px 40px", fontSize: 13.5,
              border: "1px solid var(--slate-200)", borderRadius: 2,
              width: 240, outline: "none",
            }}/>
          </div>
          <button className="btn btn-ghost" style={{ padding: "11px 18px" }}>
            <Icon name="filter" size={15}/> Filtrar
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gap: 1, background: "var(--line)", border: "1px solid var(--line)" }}>
        {courses.map((c, i) => (
          <div key={i} className="course-row" style={{
            background: "#fff", padding: "28px 32px",
            display: "grid", gridTemplateColumns: "100px 1fr auto", gap: 28, alignItems: "center",
            transition: "all 180ms ease",
          }}>
            <div style={{
              border: "1px solid var(--line)", padding: "16px 0", textAlign: "center",
              background: "var(--bg-soft)",
            }}>
              <div className="display" style={{ fontSize: 28, fontWeight: 700, color: "var(--navy-900)", lineHeight: 1 }}>{c.date.d}</div>
              <div className="mono" style={{ fontSize: 11, color: "var(--slate-500)", letterSpacing: "0.14em", marginTop: 6 }}>{c.date.m}</div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span className="mono" style={{
                  fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase",
                  padding: "4px 10px",
                  background: c.status === "Inscripciones abiertas" ? "#e7f5ec" : "var(--slate-100)",
                  color: c.status === "Inscripciones abiertas" ? "#377d52" : "var(--slate-500)",
                }}>● {c.status}</span>
                <span style={{ fontSize: 12, color: "var(--slate-500)" }}>{c.mode}</span>
              </div>
              <h3 className="display" style={{ fontSize: 20, fontWeight: 700, margin: "0 0 10px", letterSpacing: "-0.01em" }}>{c.t}</h3>
              <div style={{ display: "flex", gap: 28, fontSize: 12.5, color: "var(--slate-500)" }}>
                <span><b style={{ color: "var(--slate-700)" }}>Duración:</b> {c.duration}</span>
                <span><b style={{ color: "var(--slate-700)" }}>Cupos:</b> {c.cup}</span>
                <span><b style={{ color: "var(--slate-700)" }}>Costo:</b> {c.price}</span>
              </div>
            </div>
            <button className="btn btn-ghost" style={{ padding: "12px 22px" }}>
              Ver detalle <Icon name="arrow_right" size={14}/>
            </button>
          </div>
        ))}
      </div>
      <style>{`.course-row:hover { background: var(--bg-soft) !important; }`}</style>
    </section>
  );
};

const EventosList = () => {
  const events = [
    { d: "30", m: "MAY", t: "II Encuentro Regional de Magistraturas Éticas", place: "Centro de Convenciones · Cali", type: "Encuentro nacional" },
    { d: "14", m: "JUN", t: "Jornada de actualización · Nariño", place: "Pasto · Auditorio U. Mariana", type: "Jornada regional" },
    { d: "28", m: "JUN", t: "Congreso Suroccidental de Bioética", place: "Popayán · Auditorio Paraninfo", type: "Congreso" },
    { d: "05", m: "JUL", t: "Jornada de actualización · Putumayo", place: "Mocoa · Hotel Casa de los Vientos", type: "Jornada regional" },
  ];
  return (
    <section className="section">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {events.map((e, i) => (
          <article key={i} className="event-card" style={{
            border: "1px solid var(--line)", background: "#fff",
            display: "grid", gridTemplateColumns: "auto 1fr", gap: 28,
            padding: "32px 32px",
            transition: "all 220ms ease", cursor: "pointer",
          }}>
            <div style={{
              width: 88,
              background: "var(--navy-900)", color: "#fff",
              padding: "18px 0", textAlign: "center",
            }}>
              <div className="display" style={{ fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{e.d}</div>
              <div className="mono" style={{ fontSize: 11, letterSpacing: "0.16em", marginTop: 6, opacity: 0.7 }}>{e.m}</div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--navy-900)", marginBottom: 10 }}>{e.type}</div>
              <h3 className="display" style={{ fontSize: 20, fontWeight: 700, margin: "0 0 12px", lineHeight: 1.25, letterSpacing: "-0.01em" }}>{e.t}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--slate-500)" }}>
                <Icon name="location" size={14}/> {e.place}
              </div>
              <div style={{ marginTop: 18, fontSize: 13, fontWeight: 600, color: "var(--navy-900)", display: "flex", alignItems: "center", gap: 6 }}>
                Inscribirme <Icon name="arrow_right" size={14}/>
              </div>
            </div>
          </article>
        ))}
      </div>
      <style>{`.event-card:hover { border-color: var(--navy-900); transform: translateY(-3px); box-shadow: 0 18px 36px -16px rgba(2,8,102,0.18); }`}</style>
    </section>
  );
};

const MemoriaInstitucional = () => {
  const [year, setYear] = useStateE("2025");
  const items = {
    "2025": [
      { t: "I Encuentro Regional de Magistraturas", date: "Octubre 2025" },
      { t: "Jornada · Cauca", date: "Agosto 2025" },
      { t: "Webinar · Ley 911 al día", date: "Junio 2025" },
      { t: "Congreso Bioética 2025", date: "Abril 2025" },
    ],
    "2024": [
      { t: "Visita pedagógica · Caquetá", date: "Noviembre 2024" },
      { t: "Cohorte 2024-II", date: "Septiembre 2024" },
      { t: "Foro de jurisprudencia", date: "Mayo 2024" },
    ],
    "2023": [
      { t: "20 años de la Ley 911", date: "Octubre 2023" },
      { t: "Encuentro nacional · Bogotá", date: "Marzo 2023" },
    ],
  };
  return (
    <section style={{ background: "var(--bg-soft)" }}>
      <div className="section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 24, marginBottom: 40 }}>
          <div>
            <div className="eyebrow">Memoria institucional</div>
            <h2 className="display display-lg" style={{ margin: 0 }}>Archivo histórico.</h2>
          </div>
          <div style={{ display: "flex", gap: 4, background: "#fff", padding: 4, border: "1px solid var(--line)" }}>
            {["2025", "2024", "2023"].map(y => (
              <button key={y} onClick={() => setYear(y)} style={{
                padding: "10px 18px", fontSize: 13, fontWeight: 600,
                fontFamily: "Montserrat, sans-serif",
                background: year === y ? "var(--navy-900)" : "transparent",
                color: year === y ? "#fff" : "var(--slate-700)",
                transition: "all 160ms ease",
              }}>{y}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {(items[year] || []).map((it, i) => (
            <article key={i} style={{ background: "#fff", border: "1px solid var(--line)", cursor: "pointer", transition: "all 220ms ease" }} className="archive-card">
              <Placeholder label="Memoria fotográfica" aspect="4/3" tone="light"/>
              <div style={{ padding: "20px 22px 24px" }}>
                <div className="mono" style={{ fontSize: 10.5, color: "var(--slate-500)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>{it.date}</div>
                <h4 className="display" style={{ fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: "-0.01em", lineHeight: 1.3 }}>{it.t}</h4>
              </div>
            </article>
          ))}
        </div>
        <style>{`.archive-card:hover { transform: translateY(-3px); border-color: var(--navy-900); }`}</style>
      </div>
    </section>
  );
};

// ── COMUNICADOS Y NOTIFICACIONES ──────────────────────────────
const ComunicadosPage = () => {
  return (
    <div className="page-enter">
      <PageHero
        eyebrow="Comunicados y Notificaciones"
        title="Publicaciones oficiales del Tribunal."
        lead="Resoluciones, edictos, comunicados de prensa y notificaciones del Tribunal. Tabla dinámica con buscador y descarga directa de cada documento."
      />
      <ComunicadosTable/>
    </div>
  );
};

const ComunicadosTable = () => {
  const all = [
    { d: "08/05/2026", type: "Resolución", n: "Res. 042-2026", title: "Adopción de protocolo digital de radicación", tag: "navy" },
    { d: "02/05/2026", type: "Comunicado", n: "Com. 018-2026", title: "Pronunciamiento sobre confidencialidad en redes sociales", tag: "navy" },
    { d: "27/04/2026", type: "Edicto", n: "Ed. 011-2026", title: "Notificación pública · Expediente 2024-218", tag: "sky" },
    { d: "21/04/2026", type: "Resolución", n: "Res. 041-2026", title: "Calendario anual de capacitaciones 2026", tag: "navy" },
    { d: "15/04/2026", type: "Comunicado", n: "Com. 017-2026", title: "Apertura de inscripciones · cohorte 2026-II", tag: "navy" },
    { d: "08/04/2026", type: "Edicto", n: "Ed. 010-2026", title: "Notificación pública · Expediente 2024-201", tag: "sky" },
    { d: "01/04/2026", type: "Resolución", n: "Res. 040-2026", title: "Modificación al manual de procedimiento ético-disciplinario", tag: "navy" },
    { d: "25/03/2026", type: "Comunicado", n: "Com. 016-2026", title: "Pronunciamiento sobre carga laboral y deber ético", tag: "navy" },
  ];
  const [query, setQuery] = useStateE("");
  const [type, setType] = useStateE("Todos");
  const types = ["Todos", "Resolución", "Comunicado", "Edicto"];
  const filtered = all.filter(r =>
    (type === "Todos" || r.type === type) &&
    (query === "" || r.title.toLowerCase().includes(query.toLowerCase()) || r.n.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <section className="section">
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr auto auto", gap: 16, marginBottom: 32, alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <Icon name="search" size={18} style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "var(--slate-400)" }}/>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por número, palabra clave o tema..."
            style={{
              width: "100%", padding: "16px 20px 16px 50px", fontSize: 14.5,
              border: "1px solid var(--slate-200)", borderRadius: 2, outline: "none",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 4, background: "var(--bg-soft)", padding: 4, border: "1px solid var(--line)" }}>
          {types.map(t => (
            <button key={t} onClick={() => setType(t)} style={{
              padding: "12px 16px", fontSize: 13, fontWeight: 600,
              fontFamily: "Montserrat, sans-serif",
              background: type === t ? "var(--navy-900)" : "transparent",
              color: type === t ? "#fff" : "var(--slate-700)",
              transition: "all 160ms ease",
            }}>{t}</button>
          ))}
        </div>
        <span className="mono" style={{ fontSize: 12, color: "var(--slate-500)" }}>
          {filtered.length} de {all.length}
        </span>
      </div>

      <div style={{ border: "1px solid var(--line)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{
          display: "grid", gridTemplateColumns: "140px 140px 1fr 180px 140px",
          padding: "16px 24px", gap: 24,
          background: "var(--bg-soft)",
          borderBottom: "1px solid var(--line)",
        }}>
          {["Fecha", "Tipo", "Documento", "N° / Radicado", "Acción"].map(h => (
            <div key={h} className="mono" style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--slate-500)" }}>{h}</div>
          ))}
        </div>
        {/* Rows */}
        {filtered.map((r, i) => (
          <div key={i} className="com-row" style={{
            display: "grid", gridTemplateColumns: "140px 140px 1fr 180px 140px",
            padding: "22px 24px", gap: 24, alignItems: "center",
            borderTop: i ? "1px solid var(--line)" : "none",
            transition: "background 160ms ease",
          }}>
            <div className="mono" style={{ fontSize: 13, color: "var(--slate-700)" }}>{r.d}</div>
            <div>
              <span style={{
                fontSize: 11, padding: "5px 10px", letterSpacing: "0.1em",
                fontFamily: "Montserrat, sans-serif", fontWeight: 600, textTransform: "uppercase",
                background: r.tag === "navy" ? "var(--navy-050)" : "#e7f0fa",
                color: r.tag === "navy" ? "var(--navy-900)" : "#0a4f93",
              }}>{r.type}</span>
            </div>
            <div className="display" style={{ fontSize: 15.5, fontWeight: 600, color: "var(--ink)" }}>{r.title}</div>
            <div className="mono" style={{ fontSize: 12.5, color: "var(--slate-500)" }}>{r.n}</div>
            <button className="btn-ghost btn" style={{ padding: "10px 16px", fontSize: 12, justifyContent: "center" }}>
              <Icon name="download" size={14}/> Ver PDF
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: "60px 24px", textAlign: "center", color: "var(--slate-500)", fontSize: 14 }}>
            No se encontraron documentos para “{query}”.
          </div>
        )}
      </div>

      {/* Pagination hint */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
        <span className="mono" style={{ fontSize: 12, color: "var(--slate-500)" }}>Mostrando 1 – {filtered.length}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="news-nav" style={{
            width: 40, height: 40, border: "1px solid var(--slate-200)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: "#fff", color: "var(--navy-900)",
          }}><Icon name="chevron_left" size={16}/></button>
          {[1, 2, 3].map(n => (
            <button key={n} style={{
              width: 40, height: 40, fontSize: 13, fontWeight: 600,
              fontFamily: "Montserrat, sans-serif",
              background: n === 1 ? "var(--navy-900)" : "#fff",
              color: n === 1 ? "#fff" : "var(--slate-700)",
              border: "1px solid " + (n === 1 ? "var(--navy-900)" : "var(--slate-200)"),
            }}>{n}</button>
          ))}
          <button className="news-nav" style={{
            width: 40, height: 40, border: "1px solid var(--slate-200)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: "#fff", color: "var(--navy-900)",
          }}><Icon name="chevron_right" size={16}/></button>
        </div>
      </div>
      <style>{`.com-row:hover { background: var(--bg-soft); }`}</style>
    </section>
  );
};

Object.assign(window, { EventosPage, ComunicadosPage });
