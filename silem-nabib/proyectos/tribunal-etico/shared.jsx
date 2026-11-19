// Shared components — icons, placeholders, decorative bits
const { useState, useEffect, useRef, useMemo } = React;

// ── Icons (minimalist, 1.5px line) ─────────────────────────────
const Icon = ({ name, size = 22, stroke = 1.6, style }) => {
  const props = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor",
    strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round",
    style,
  };
  const paths = {
    document: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></>,
    book: <><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17.5a2.5 2.5 0 0 1-2.5 2.5H6.5A2.5 2.5 0 0 1 4 19.5z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/></>,
    users: <><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.2c2.6.4 5 2.6 5 5.8"/></>,
    phone: <><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></>,
    play: <><polygon points="7,4 21,12 7,20"/></>,
    chevron_right: <><polyline points="9 6 15 12 9 18"/></>,
    chevron_left: <><polyline points="15 6 9 12 15 18"/></>,
    arrow_right: <><line x1="4" y1="12" x2="20" y2="12"/><polyline points="14 6 20 12 14 18"/></>,
    arrow_up_right: <><line x1="6" y1="18" x2="18" y2="6"/><polyline points="9 6 18 6 18 15"/></>,
    download: <><path d="M12 4v12"/><polyline points="6 12 12 18 18 12"/><line x1="4" y1="21" x2="20" y2="21"/></>,
    search: <><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></>,
    check: <><polyline points="5 12 10 17 19 7"/></>,
    clipboard: <><rect x="6" y="4" width="12" height="17" rx="1.5"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="13" y2="14"/></>,
    folder: <><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4l2 2h9A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z"/></>,
    shield: <><path d="M12 3 4 6v6c0 4.5 3.4 8.4 8 9 4.6-.6 8-4.5 8-9V6z"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="1.5"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10.5 19a1.5 1.5 0 0 0 3 0"/></>,
    location: <><path d="M12 22s7-6.4 7-12a7 7 0 1 0-14 0c0 5.6 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="1.5"/><polyline points="3 7 12 13 21 7"/></>,
    menu: <><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></>,
    close: <><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></>,
    filter: <><polygon points="3 4 21 4 14 13 14 19 10 21 10 13"/></>,
    pdf: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><text x="12" y="17" textAnchor="middle" fontSize="5" fontWeight="700" stroke="none" fill="currentColor">PDF</text></>,
    video: <><rect x="3" y="6" width="14" height="12" rx="1.5"/><polygon points="21 8 17 11 17 13 21 16"/></>,
    quote: <><path d="M7 7h4v4c0 2.2-1.3 4-4 4V7zM15 7h4v4c0 2.2-1.3 4-4 4V7z"/></>,
    scale: <><line x1="12" y1="3" x2="12" y2="21"/><line x1="6" y1="6" x2="18" y2="6"/><path d="M6 6l-3 7a3 3 0 0 0 6 0z"/><path d="M18 6l-3 7a3 3 0 0 0 6 0z"/></>,
  };
  return <svg {...props}>{paths[name]}</svg>;
};

// ── Image / photo placeholder (striped) ─────────────────────────
const Placeholder = ({ label, aspect = "16/9", style, tone = "light", small = false }) => (
  <div className="ph-stripe" style={{
    aspectRatio: aspect,
    width: "100%",
    background: tone === "dark"
      ? "linear-gradient(135deg, #0a1280 0%, #020866 60%, #060c4d 100%)"
      : undefined,
    color: tone === "dark" ? "#dfe3ff" : undefined,
    ...style,
  }}>
    {tone === "dark" && (
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 8px, transparent 8px 18px)",
      }}/>
    )}
    {label && (
      <span className="ph-label" style={{
        background: tone === "dark" ? "rgba(2,8,102,0.7)" : undefined,
        color: tone === "dark" ? "#fff" : undefined,
        borderColor: tone === "dark" ? "rgba(255,255,255,0.2)" : undefined,
        fontSize: small ? 10 : 11,
      }}>↓ {label}</span>
    )}
  </div>
);

// ── Decorative navy ribbon (curved) ────────────────────────────
const Ribbon = ({ style }) => (
  <svg viewBox="0 0 800 600" preserveAspectRatio="none" style={{
    position: "absolute", inset: 0, width: "100%", height: "100%",
    opacity: 0.07, ...style,
  }}>
    <path d="M0 600 Q 200 300 400 250 T 800 80" stroke="var(--navy-900)" strokeWidth="60" fill="none" opacity="0.5"/>
    <path d="M0 600 Q 240 360 460 300 T 800 140" stroke="var(--navy-900)" strokeWidth="40" fill="none" opacity="0.4"/>
  </svg>
);

// ── Section header ──────────────────────────────────────────────
const SectionHeader = ({ eyebrow, title, lead, align = "left" }) => (
  <div style={{ textAlign: align, maxWidth: align === "center" ? 720 : 760, margin: align === "center" ? "0 auto 56px" : "0 0 56px" }}>
    {eyebrow && <div className="eyebrow" style={{ justifyContent: align === "center" ? "center" : "flex-start" }}>{eyebrow}</div>}
    <h2 className="display display-lg">{title}</h2>
    {lead && <p className="lead">{lead}</p>}
  </div>
);

// ── Logo lockup ────────────────────────────────────────────────
const Logo = ({ variant = "default", showText = true, size = 38 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
    <img src="assets/logo.png" alt="Tribunal" style={{
      height: size, width: "auto",
      filter: variant === "light" ? "brightness(0) invert(1)" : "none",
    }}/>
    {showText && (
      <div style={{ lineHeight: 1.15 }}>
        <div className="display" style={{
          fontWeight: 700, fontSize: 12.5, letterSpacing: "0.02em",
          color: variant === "light" ? "#fff" : "var(--navy-900)",
        }}>
          Tribunal Departamental<br/>Ético de Enfermería
        </div>
        <div className="mono" style={{
          fontSize: 9.5, letterSpacing: "0.16em", textTransform: "uppercase",
          color: variant === "light" ? "rgba(255,255,255,0.65)" : "var(--slate-500)",
          marginTop: 2,
        }}>
          Región Suroccidental
        </div>
      </div>
    )}
  </div>
);

Object.assign(window, { Icon, Placeholder, Ribbon, SectionHeader, Logo });
