// Home + Quiénes Somos
const { useState: useStateH, useEffect: useEffectH, useRef: useRefH } = React;

// ── HOME ───────────────────────────────────────────────────────
const HomePage = ({ go }) => {
  return (
    <div className="page-enter">
      <Hero go={go}/>
      <QuickAccess go={go}/>
      <MissionStrip/>
      <NewsSlider/>
      <CTABanner go={go}/>
    </div>
  );
};

// Hero — cinematic dark navy with video placeholder
const Hero = ({ go }) => {
  const [now, setNow] = useStateH(new Date());
  useEffectH(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <section style={{
      position: "relative",
      minHeight: "calc(100vh - 76px)",
      background: "linear-gradient(180deg, #020866 0%, #060c4d 100%)",
      color: "#fff",
      overflow: "hidden",
      display: "flex",
      alignItems: "stretch",
    }}>
      {/* Video stage placeholder */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.55 }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0 6px, transparent 6px 14px)",
        }}/>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 70% 30%, rgba(108,180,228,0.35), transparent 55%), radial-gradient(ellipse at 20% 90%, rgba(108,180,228,0.18), transparent 60%)",
        }}/>
        {/* Soft animated grain */}
        <div className="hero-grain" style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0, transparent 40%)",
          animation: "heroPulse 8s ease-in-out infinite",
        }}/>
        <style>{`@keyframes heroPulse { 0%,100%{opacity:.6} 50%{opacity:.9} }`}</style>
      </div>

      {/* Recording marker */}
      <div style={{
        position: "absolute", top: 32, right: 56, zIndex: 3,
        display: "flex", alignItems: "center", gap: 10,
        color: "rgba(255,255,255,0.55)", fontSize: 11, letterSpacing: "0.18em",
        textTransform: "uppercase", fontFamily: "JetBrains Mono, monospace",
      }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5454", animation: "blink 1.6s ease-in-out infinite" }}/>
        Hero Video · Loop 00:00:24
        <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
      </div>

      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 1320, margin: "0 auto", width: "100%",
        padding: "120px 56px 80px",
        display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 60, alignItems: "end",
      }}>
        <div>
          <div className="mono" style={{
            fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)", marginBottom: 24,
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <span style={{ width: 28, height: 1.5, background: "rgba(255,255,255,0.6)" }}/>
            Ley 911 de 2004 · República de Colombia
          </div>
          <h1 className="display display-xl" style={{ color: "#fff", maxWidth: "14ch" }}>
            Ética y Responsabilidad en el Cuidado de la Vida.
          </h1>
          <p className="lead" style={{ color: "rgba(255,255,255,0.78)", maxWidth: "52ch", marginBottom: 36 }}>
            Tribunal Departamental Ético de Enfermería · Región Suroccidental.
            Garantes del ejercicio digno, consciente y profesional de la enfermería en Valle del Cauca, Cauca, Nariño, Putumayo, Caquetá y Chocó.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button className="btn btn-outline" onClick={() => go('quienes')}>
              Conoce el Tribunal <Icon name="arrow_right" size={16}/>
            </button>
            <button className="btn" style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.2)" }} onClick={() => go('queja')}>
              Presentar una queja
            </button>
          </div>
        </div>

        {/* Side meta panel */}
        <div style={{
          borderLeft: "1px solid rgba(255,255,255,0.15)",
          paddingLeft: 36, marginBottom: 8,
        }}>
          <div className="mono" style={{ fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 18 }}>
            Atención al profesional
          </div>
          <div style={{ display: "grid", gap: 22 }}>
            {[
              ["Sede principal", "Cali, Valle del Cauca"],
              ["Horario", "Lun – Vie · 08:00 – 17:00"],
              ["Línea directa", "+57 (602) 555 0911"],
              ["Estado", <span key="x" style={{ color: "#7be1a5" }}>● Atención activa</span>],
            ].map(([k, v], i) => (
              <div key={i}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
                <div style={{ fontSize: 15, color: "rgba(255,255,255,0.92)" }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 28, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,0.12)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div className="mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
              {now.toLocaleDateString('es-CO', { weekday: 'long', day: '2-digit', month: 'long' })}
            </div>
            <div className="mono" style={{ fontSize: 13, color: "#fff", letterSpacing: "0.05em" }}>
              {now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom scroll hint */}
      <div style={{
        position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
        color: "rgba(255,255,255,0.5)", fontSize: 10, letterSpacing: "0.24em",
        fontFamily: "JetBrains Mono, monospace", textTransform: "uppercase",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
      }}>
        Desliza
        <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.3)", animation: "scrollHint 2s ease-in-out infinite" }}/>
        <style>{`@keyframes scrollHint { 0%,100%{transform:scaleY(0.4); transform-origin:top} 50%{transform:scaleY(1); transform-origin:top} }`}</style>
      </div>
    </section>
  );
};

// Quick access — 4 cards
const QuickAccess = ({ go }) => {
  const cards = [
    { id: "queja", icon: "scale", title: "Presentar Queja", body: "Guía paso a paso y radicación segura del proceso ético-disciplinario.", k: "01" },
    { id: "formacion", icon: "book", title: "Formación Ética", body: "Código, casos explicados y recursos para la práctica profesional.", k: "02" },
    { id: "quienes", icon: "users", title: "¿Quiénes Somos?", body: "Nuestra misión, marco legal y el equipo magistrado del Tribunal.", k: "03" },
    { id: "contactos", icon: "phone", title: "Contactos", body: "Canales de atención directa y sedes regionales de la Región Suroccidental.", k: "04" },
  ];
  return (
    <section className="section" style={{ paddingTop: 120 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 48, flexWrap: "wrap", gap: 24 }}>
        <div style={{ maxWidth: 540 }}>
          <div className="eyebrow">Accesos directos</div>
          <h2 className="display display-lg">Cuatro puertas hacia el Tribunal.</h2>
        </div>
        <p className="body" style={{ maxWidth: 360, margin: 0 }}>
          Una arquitectura simple para que cada profesional, paciente o institución
          llegue al recurso que necesita sin pasos intermedios.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "var(--line)", border: "1px solid var(--line)" }}>
        {cards.map((c, i) => (
          <button key={c.id} onClick={() => go(c.id === 'contactos' ? 'home' : c.id)}
            className="qa-card"
            style={{
              background: "#fff",
              padding: "40px 32px 36px",
              textAlign: "left",
              display: "flex", flexDirection: "column",
              minHeight: 280,
              transition: "all 240ms ease",
              cursor: "pointer",
              position: "relative",
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 36 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 2,
                background: "var(--navy-050)",
                color: "var(--navy-900)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name={c.icon} size={22}/>
              </div>
              <span className="mono" style={{ fontSize: 11, color: "var(--slate-400)" }}>{c.k}</span>
            </div>
            <h3 className="display display-md" style={{ marginBottom: 10 }}>{c.title}</h3>
            <p className="body" style={{ flex: 1 }}>{c.body}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18, color: "var(--navy-900)", fontWeight: 600, fontSize: 13.5 }}>
              <span className="qa-arrow">Acceder</span>
              <Icon name="arrow_right" size={16}/>
            </div>
          </button>
        ))}
        <style>{`
          .qa-card:hover { background: var(--navy-050) !important; }
          .qa-card:hover .qa-arrow { letter-spacing: 0.04em; }
        `}</style>
      </div>
    </section>
  );
};

// Mission strip — single statement on navy
const MissionStrip = () => (
  <section style={{ background: "var(--navy-900)", color: "#fff", position: "relative", overflow: "hidden" }}>
    <Ribbon style={{ opacity: 0.12 }}/>
    <div className="section" style={{ position: "relative", zIndex: 1 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 22 }}>
            — Nuestro compromiso
          </div>
          <h2 className="display" style={{ fontWeight: 600, fontSize: "clamp(28px, 3vw, 40px)", lineHeight: 1.25, letterSpacing: "-0.01em", color: "#fff", margin: 0 }}>
            <Icon name="quote" size={36} stroke={1.2} style={{ opacity: 0.4 }}/>
            <span style={{ display: "block", marginTop: 12 }}>
              No somos ángeles, somos profesionales de la ciencia y la ética.
              El mayor homenaje a la enfermería es ejercerla con rigor, responsabilidad y dignidad.
            </span>
          </h2>
          <div className="mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 28, letterSpacing: "0.06em" }}>
            — Magistratura del Tribunal
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {[
            ["6", "Departamentos cubiertos"],
            ["22 años", "Bajo Ley 911 de 2004"],
            ["100%", "Procesos con debido proceso"],
            ["7", "Magistrados activos"],
          ].map(([n, l], i) => (
            <div key={i} style={{ padding: "28px 0", borderTop: "1px solid rgba(255,255,255,0.18)" }}>
              <div className="display" style={{ fontSize: 44, fontWeight: 700, color: "#fff", lineHeight: 1, letterSpacing: "-0.02em" }}>{n}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 10 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// News slider — horizontal scroll carousel
const NewsSlider = () => {
  const items = [
    { tag: "Normativa", date: "08 Mayo 2026", title: "Nuevas disposiciones de la Ley 911", desc: "Lectura comentada del último ajuste reglamentario y su impacto en la práctica clínica.", color: "navy" },
    { tag: "Webinar", date: "02 Mayo 2026", title: "Registro del último Webinar", desc: "Confidencialidad en redes sociales: lecciones desde tres casos anonimizados.", color: "sky" },
    { tag: "Agenda", date: "27 Abril 2026", title: "Cronograma de visitas regionales", desc: "Visitas formativas a Nariño, Putumayo y Caquetá. Inscripciones abiertas.", color: "navy" },
    { tag: "Caso ético", date: "21 Abril 2026", title: "Delegar sin supervisar: el caso de la auxiliar", desc: "Cómo la responsabilidad recayó en la enfermera jefe por una omisión en la cadena de cuidado.", color: "sky" },
    { tag: "Comunicado", date: "15 Abril 2026", title: "Apertura de inscripciones · cohorte 2026-II", desc: "Curso de actualización en deontología profesional para enfermería.", color: "navy" },
  ];
  const ref = useRefH(null);
  const scroll = (dir) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir * 420, behavior: "smooth" });
  };
  return (
    <section style={{ background: "var(--bg-soft)", padding: "96px 0" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 56px 32px", display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 24 }}>
        <div>
          <div className="eyebrow">Últimas publicaciones</div>
          <h2 className="display display-lg" style={{ margin: 0 }}>Mantente al día.</h2>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a className="mono" style={{ fontSize: 12, color: "var(--navy-900)", textDecoration: "underline", textUnderlineOffset: 4 }}>Ver todas →</a>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => scroll(-1)} className="news-nav" aria-label="Anterior"><Icon name="chevron_left" size={18}/></button>
            <button onClick={() => scroll(1)} className="news-nav" aria-label="Siguiente"><Icon name="chevron_right" size={18}/></button>
          </div>
        </div>
      </div>
      <style>{`
        .news-nav { width: 44px; height: 44px; border: 1px solid var(--slate-200); background: #fff; color: var(--navy-900); display:inline-flex; align-items:center; justify-content:center; border-radius: 2px; transition: all 180ms ease; }
        .news-nav:hover { background: var(--navy-900); color: #fff; border-color: var(--navy-900); }
        .news-track { display: flex; gap: 22px; overflow-x: auto; padding: 8px 56px 32px; scroll-snap-type: x mandatory; scrollbar-width: thin; }
        .news-track::-webkit-scrollbar { height: 6px; }
        .news-card { flex: 0 0 380px; background:#fff; border:1px solid var(--slate-200); scroll-snap-align: start; display:flex; flex-direction: column; transition: all 240ms ease; cursor: pointer; }
        .news-card:hover { transform: translateY(-4px); box-shadow: 0 18px 40px -16px rgba(2,8,102,0.18); border-color: var(--navy-900); }
      `}</style>
      <div className="news-track" ref={ref}>
        {items.map((it, i) => (
          <article key={i} className="news-card">
            <Placeholder
              label={`Foto editorial · ${it.tag.toLowerCase()}`}
              aspect="4/3"
              tone={it.color === "navy" ? "dark" : "light"}
            />
            <div style={{ padding: "24px 26px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", background: "var(--navy-900)", padding: "5px 10px" }}>{it.tag}</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--slate-500)" }}>{it.date}</span>
              </div>
              <h3 className="display" style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.25, margin: "0 0 10px", letterSpacing: "-0.01em" }}>{it.title}</h3>
              <p style={{ fontSize: 14, color: "var(--slate-700)", lineHeight: 1.55, margin: 0 }}>{it.desc}</p>
              <div style={{ marginTop: 18, fontSize: 13, fontWeight: 600, color: "var(--navy-900)", display: "flex", alignItems: "center", gap: 6 }}>
                Leer publicación <Icon name="arrow_right" size={14}/>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

const CTABanner = ({ go }) => (
  <section className="section">
    <div style={{
      padding: "64px 56px",
      border: "1px solid var(--slate-200)",
      display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 56, alignItems: "center",
      background: "linear-gradient(90deg, var(--bg-soft) 0%, #fff 100%)",
    }}>
      <div>
        <div className="eyebrow">¿Necesita radicar un proceso?</div>
        <h2 className="display display-lg" style={{ margin: 0 }}>Acompañamos cada paso del debido proceso.</h2>
        <p className="lead" style={{ marginTop: 18 }}>
          Si te denuncian, no es el fin del mundo. Antes del fallo viene la investigación, las pruebas y un proceso transparente. Conoce las tres etapas.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button className="btn btn-primary" onClick={() => go('queja')}>Iniciar radicación <Icon name="arrow_right" size={16}/></button>
        <button className="btn btn-ghost" onClick={() => go('formacion')}>Ver guías éticas</button>
      </div>
    </div>
  </section>
);

// ── QUIÉNES SOMOS ───────────────────────────────────────────────
const QuienesPage = () => {
  return (
    <div className="page-enter">
      <PageHero
        eyebrow="Sobre el Tribunal"
        title="Guardianes de la dignidad profesional."
        lead="Una institución autónoma, creada por la Ley 911 de 2004, encargada del control ético-disciplinario del ejercicio de la enfermería en la Región Suroccidental colombiana."
        videoSrc="assets/video_presentacion.mp4"
      />
      <IdentidadBlock/>
      <MisionVision/>
      <Magistrados/>
      <MarcoLegal/>
    </div>
  );
};

const PageHero = ({ eyebrow, title, lead, videoSrc }) => (
  <section style={{
    background: videoSrc ? "none" : "linear-gradient(180deg, var(--navy-900) 0%, #060c4d 100%)",
    color: "#fff", position: "relative", overflow: "hidden",
  }}>
    {videoSrc && (
      <video
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    )}

    <div style={{
      position: "absolute",
      inset: 0,
      background: videoSrc
        ? "linear-gradient(135deg, rgba(2,8,102,0.75) 0%, rgba(6,12,77,0.65) 100%)"
        : "none",
      zIndex: 1,
    }}/>

    <Ribbon style={{ opacity: 0.1 }}/>
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "120px 56px 80px", position: "relative", zIndex: 2 }}>
      <div className="mono" style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 22 }}>
        — {eyebrow}
      </div>
      <h1 className="display display-xl" style={{ color: "#fff", maxWidth: "20ch" }}>{title}</h1>
      <p className="lead" style={{ color: "rgba(255,255,255,0.78)", maxWidth: "62ch", marginTop: 14 }}>{lead}</p>
    </div>
  </section>
);

const IdentidadBlock = () => (
  <section className="section">
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 80, alignItems: "start" }}>
      <div>
        <div className="eyebrow">Identidad</div>
        <h2 className="display display-lg">Una historia de rigor y consciencia.</h2>
      </div>
      <div>
        <p className="lead" style={{ marginBottom: 24 }}>
          El Tribunal Departamental Ético de Enfermería nace bajo el amparo de la
          Ley 911 de 2004 como autoridad descentralizada para el control deontológico
          de la profesión en los departamentos del suroccidente colombiano.
        </p>
        <p className="body">
          Su mandato no se reduce a la sanción. Acompañamos al ejercicio profesional
          desde la formación preventiva: traducimos el lenguaje jurídico al turno diario,
          divulgamos jurisprudencia y promovemos una cultura de la dignidad humana
          como eje del cuidado.
        </p>
        <p className="body">
          Operamos con autonomía técnica frente a las instituciones empleadoras y
          frente al gremio, garantizando imparcialidad en cada proceso radicado.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 36 }}>
          {[
            ["2004", "Año de fundación"],
            ["6", "Departamentos"],
            ["Ley 911", "Marco jurídico"],
          ].map(([n, l]) => (
            <div key={l} style={{ paddingTop: 18, borderTop: "1px solid var(--line)" }}>
              <div className="display" style={{ fontSize: 28, fontWeight: 700, color: "var(--navy-900)" }}>{n}</div>
              <div style={{ fontSize: 12.5, color: "var(--slate-500)", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const MisionVision = () => (
  <section style={{ background: "var(--bg-soft)" }}>
    <div className="section" style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--slate-200)", border: "1px solid var(--slate-200)" }}>
        {[
          { k: "Misión", body: "Velar por el ejercicio ético, responsable y digno de la enfermería en la Región Suroccidental, mediante el control deontológico, la formación preventiva y la divulgación clara del marco legal que rige la profesión." },
          { k: "Visión", body: "Ser un referente nacional de tribunales éticos: una autoridad reconocida por la transparencia de sus procesos, la pedagogía de sus contenidos y el respeto que profesa por la profesión a la que sirve." },
        ].map(({ k, body }) => (
          <div key={k} style={{ background: "#fff", padding: "56px 48px" }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--navy-900)", marginBottom: 24 }}>— {k}</div>
            <p className="display" style={{ fontFamily: "Montserrat, sans-serif", fontSize: 22, fontWeight: 500, lineHeight: 1.45, color: "var(--ink)", margin: 0, letterSpacing: "-0.01em" }}>
              {body}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Magistrados = () => {
  const people = [
    { n: "Dra. María Helena Vásquez", c: "Magistrada Presidenta", bio: "30 años de práctica clínica · Especialista en bioética", dept: "Magistratura" },
    { n: "Dr. Juan Carlos Realpe", c: "Magistrado Vicepresidente", bio: "Doctorado en derecho sanitario · Asesor en Ley 911", dept: "Magistratura" },
    { n: "Dra. Sandra Liliana Ochoa", c: "Magistrada Ponente", bio: "Profesora titular · Universidad del Valle", dept: "Magistratura" },
    { n: "Dr. Andrés Felipe Mosquera", c: "Magistrado", bio: "Investigación en deontología profesional", dept: "Magistratura" },
    { n: "Dra. Patricia Eugenia Castro", c: "Secretaria General", bio: "Coordinación de procesos disciplinarios", dept: "Personal administrativo" },
    { n: "Ing. Daniel Eduardo Pérez", c: "Coordinador de Comunicaciones", bio: "Estrategia digital y formación ética", dept: "Personal administrativo" },
  ];
  const [filter, setFilter] = useStateH("Todos");
  const filtered = filter === "Todos" ? people : people.filter(p => p.dept === filter);
  return (
    <section className="section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
        <div>
          <div className="eyebrow">Talento humano</div>
          <h2 className="display display-lg" style={{ margin: 0 }}>El equipo del Tribunal.</h2>
        </div>
        <div style={{ display: "flex", gap: 4, background: "var(--bg-soft)", padding: 4, border: "1px solid var(--line)" }}>
          {["Todos", "Magistratura", "Personal administrativo"].map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: "10px 16px", fontSize: 12.5, fontWeight: 600,
              background: filter === t ? "var(--navy-900)" : "transparent",
              color: filter === t ? "#fff" : "var(--slate-700)",
              fontFamily: "Montserrat, sans-serif",
              transition: "all 160ms ease",
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {filtered.map((p, i) => (
          <article key={i} style={{ border: "1px solid var(--line)", background: "#fff", transition: "all 240ms ease" }} className="mag-card">
            <Placeholder label="Retrato unificado" aspect="4/5" tone="dark" small/>
            <div style={{ padding: "24px 24px 28px" }}>
              <div className="mono" style={{ fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--navy-900)", marginBottom: 10 }}>{p.c}</div>
              <h3 className="display" style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.01em" }}>{p.n}</h3>
              <p style={{ fontSize: 13.5, color: "var(--slate-500)", margin: 0, lineHeight: 1.55 }}>{p.bio}</p>
            </div>
          </article>
        ))}
      </div>
      <style>{`.mag-card:hover { border-color: var(--navy-900); transform: translateY(-2px); }`}</style>
    </section>
  );
};

const MarcoLegal = () => (
  <section style={{ background: "var(--navy-900)", color: "#fff" }}>
    <div className="section">
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 60, alignItems: "center" }}>
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 22 }}>— Marco legal</div>
          <h2 className="display display-lg" style={{ color: "#fff" }}>Ley 911 de 2004</h2>
          <p className="lead" style={{ color: "rgba(255,255,255,0.78)" }}>
            La norma que regula el ejercicio ético-disciplinario de la enfermería en Colombia
            y que instituye los tribunales seccionales como autoridades del control deontológico.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 28 }}>
            <button className="btn btn-outline">Leer la ley completa <Icon name="arrow_up_right" size={16}/></button>
            <button className="btn" style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.2)" }}>
              <Icon name="download" size={16}/> Descargar PDF
            </button>
          </div>
        </div>
        <div style={{ display: "grid", gap: 1, background: "rgba(255,255,255,0.12)" }}>
          {[
            ["Capítulo I", "Disposiciones generales y principios"],
            ["Capítulo II", "Deberes del profesional de enfermería"],
            ["Capítulo III", "Régimen disciplinario"],
            ["Capítulo IV", "Sanciones y debido proceso"],
          ].map(([k, v]) => (
            <div key={k} style={{ background: "var(--navy-900)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase" }}>{k}</div>
                <div style={{ fontSize: 15, marginTop: 4, color: "#fff" }}>{v}</div>
              </div>
              <Icon name="arrow_up_right" size={18}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

Object.assign(window, { HomePage, QuienesPage, PageHero });
