// App shell — top nav, router, footer, tweaks
const { useState: useStateA, useEffect: useEffectA } = React;

const ROUTES = [
  { id: "home", l: "Inicio" },
  { id: "quienes", l: "Quiénes Somos" },
  { id: "queja", l: "Presentar Queja" },
  { id: "formacion", l: "Formación Ética" },
  { id: "eventos", l: "Capacitaciones y Eventos" },
  { id: "comunicados", l: "Comunicados" },
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#020866", "#1a2098"],
  "headingFont": "Montserrat",
  "density": "comfortable",
  "showCursorTrail": false,
  "ribbonAccent": true
}/*EDITMODE-END*/;

const App = () => {
  const [route, setRoute] = useStateA("home");
  const [scrolled, setScrolled] = useStateA(false);
  const [mobileNav, setMobileNav] = useStateA(false);
  const [tweaks, setTweak] = window.useTweaks
    ? window.useTweaks(TWEAK_DEFAULTS)
    : [TWEAK_DEFAULTS, () => {}];

  useEffectA(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reset scroll on route change
  useEffectA(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setMobileNav(false);
  }, [route]);

  // Apply palette
  useEffectA(() => {
    const [p1, p2] = tweaks.palette || [];
    if (p1) document.documentElement.style.setProperty("--navy-900", p1);
    if (p2) document.documentElement.style.setProperty("--navy-800", p2);
  }, [tweaks.palette]);

  useEffectA(() => {
    document.documentElement.style.setProperty("--heading-font", tweaks.headingFont || "Montserrat");
    document.querySelectorAll(".display").forEach(el => {
      el.style.fontFamily = `'${tweaks.headingFont}', sans-serif`;
    });
  }, [tweaks.headingFont]);

  const go = (r) => setRoute(r);
  const TPanel = window.TweaksPanel;
  const TSection = window.TweakSection;
  const TColor = window.TweakColor;
  const TSelect = window.TweakSelect;
  const TToggle = window.TweakToggle;
  const TRadio = window.TweakRadio;

  return (
    <div>
      <Navbar route={route} go={go} scrolled={scrolled} mobileNav={mobileNav} setMobileNav={setMobileNav}/>
      <main style={{ paddingTop: 0 }}>
        {route === "home" && <HomePage go={go}/>}
        {route === "quienes" && <QuienesPage/>}
        {route === "queja" && <QuejaPage/>}
        {route === "formacion" && <FormacionPage/>}
        {route === "eventos" && <EventosPage/>}
        {route === "comunicados" && <ComunicadosPage/>}
      </main>
      <Footer go={go}/>

      {TPanel && (
        <TPanel title="Tweaks">
          <TSection label="Identidad visual">
            <TColor
              label="Paleta institucional"
              value={tweaks.palette}
              onChange={v => setTweak('palette', v)}
              options={[
                ["#020866", "#1a2098"],
                ["#0c2a5b", "#1a4180"],
                ["#142850", "#27496d"],
                ["#1d3557", "#457b9d"],
              ]}
            />
            <TSelect
              label="Tipografía de títulos"
              value={tweaks.headingFont}
              onChange={v => setTweak('headingFont', v)}
              options={["Montserrat", "Inter", "Playfair Display", "DM Serif Display"]}
            />
          </TSection>
          <TSection label="Composición">
            <TRadio
              label="Densidad"
              value={tweaks.density}
              onChange={v => setTweak('density', v)}
              options={["comfortable", "compact"]}
            />
            <TToggle label="Líneas decorativas" value={tweaks.ribbonAccent} onChange={v => setTweak('ribbonAccent', v)}/>
          </TSection>
        </TPanel>
      )}
    </div>
  );
};

const Navbar = ({ route, go, scrolled, mobileNav, setMobileNav }) => {
  const onHero = route === "home";
  // Always-light navbar when scrolled OR on non-home routes
  const lightBg = scrolled || !onHero;
  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: lightBg ? "rgba(255,255,255,0.96)" : "transparent",
      borderBottom: "1px solid " + (lightBg ? "var(--line)" : "transparent"),
      backdropFilter: lightBg ? "blur(8px)" : "none",
      transition: "all 200ms ease",
    }}>
      <div style={{
        maxWidth: 1440, margin: "0 auto",
        padding: "16px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 40,
      }}>
        <button onClick={() => go('home')} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          <Logo variant={lightBg ? "default" : "light"}/>
        </button>

        <nav style={{ display: "flex", alignItems: "center", gap: 4 }} className="main-nav">
          {ROUTES.slice(0, 6).map(r => (
            <button key={r.id} onClick={() => go(r.id)} style={{
              padding: "10px 14px",
              fontSize: 13,
              fontWeight: route === r.id ? 700 : 500,
              fontFamily: "Montserrat, sans-serif",
              color: lightBg ? (route === r.id ? "var(--navy-900)" : "var(--slate-700)") : "rgba(255,255,255,0.9)",
              borderBottom: "2px solid " + (route === r.id && lightBg ? "var(--navy-900)" : route === r.id ? "#fff" : "transparent"),
              transition: "all 160ms ease",
              letterSpacing: "0.01em",
            }}>{r.l}</button>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => go('queja')} className="btn"
            style={{
              padding: "11px 18px",
              background: lightBg ? "var(--navy-900)" : "#fff",
              color: lightBg ? "#fff" : "var(--navy-900)",
              fontSize: 12.5,
            }}>
            Radicar queja <Icon name="arrow_right" size={14}/>
          </button>
        </div>
      </div>
      <style>{`
        @media (max-width: 1100px) {
          .main-nav { display: none !important; }
        }
      `}</style>
    </header>
  );
};

const Footer = ({ go }) => (
  <footer style={{ background: "#06093f", color: "#fff", paddingTop: 80, paddingBottom: 32, position: "relative", overflow: "hidden" }}>
    <div style={{
      position: "absolute", top: -100, right: -100, width: 400, height: 400,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(108,180,228,0.12) 0%, transparent 60%)",
      pointerEvents: "none",
    }}/>
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 56px", position: "relative" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 56, marginBottom: 64 }}>
        <div>
          <Logo variant="light"/>
          <p style={{ marginTop: 24, fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.65, maxWidth: 360 }}>
            Autoridad ético-disciplinaria del ejercicio de la enfermería en el suroccidente colombiano. Operamos en el marco de la Ley 911 de 2004.
          </p>
        </div>
        {[
          { t: "Tribunal", items: [["Quiénes Somos", "quienes"], ["Magistrados", "quienes"], ["Marco legal", "quienes"]] },
          { t: "Recursos", items: [["Presentar queja", "queja"], ["Formación ética", "formacion"], ["Eventos", "eventos"], ["Comunicados", "comunicados"]] },
          { t: "Contacto", items: [["Cali, Valle del Cauca", null], ["+57 (602) 555 0911", null], ["contacto@tribunal-enfermeria.gov.co", null], ["Lun – Vie · 08:00 – 17:00", null]] },
        ].map((col, i) => (
          <div key={i}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>{col.t}</div>
            <div style={{ display: "grid", gap: 12 }}>
              {col.items.map(([l, r], j) => (
                r ? (
                  <button key={j} onClick={() => go(r)} style={{ textAlign: "left", fontSize: 13.5, color: "rgba(255,255,255,0.85)", transition: "color 160ms" }}
                    onMouseOver={e => e.currentTarget.style.color = "#fff"}
                    onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.85)"}>
                    {l}
                  </button>
                ) : (
                  <span key={j} style={{ fontSize: 13.5, color: "rgba(255,255,255,0.65)" }}>{l}</span>
                )
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{
        paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.12)",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
          © 2026 Tribunal Departamental Ético de Enfermería · Región Suroccidental. Todos los derechos reservados.
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
          <a>Política de privacidad</a>
          <a>Términos</a>
          <a>Accesibilidad</a>
        </div>
      </div>
    </div>
  </footer>
);

// Mount
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
