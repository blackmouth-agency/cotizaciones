// Presentar una Queja
const { useState: useStateQ } = React;

const QuejaPage = () => {
  return (
    <div className="page-enter">
      <PageHero
        eyebrow="Presentar una queja"
        title="Un proceso claro, en tres pasos."
        lead="Hemos rediseñado la radicación para que cualquier profesional o ciudadano comprenda, en pocos minutos, si su caso aplica, qué documentos necesita y cómo enviar la solicitud."
      />
      <StepsTimeline/>
      <FormularioRadicacion/>
      <PostRadicacion/>
      <FAQRadicacion/>
    </div>
  );
};

// 3-step timeline
const StepsTimeline = () => {
  const steps = [
    {
      n: "01", k: "Verificar",
      title: "¿Su caso aplica para un proceso ético-disciplinario?",
      body: "Los procesos del Tribunal versan sobre la conducta profesional de enfermería, no sobre conflictos laborales, civiles o penales que correspondan a otras instancias.",
      bullets: ["Conducta profesional de enfermería", "Hechos ocurridos en Región Suroccidental", "Soportado en evidencia documental"],
    },
    {
      n: "02", k: "Reunir datos",
      title: "Lista de documentos y pruebas necesarias.",
      body: "Para que la radicación avance es indispensable contar con los soportes mínimos. La completitud documental acelera la fase de admisión.",
      bullets: ["Identificación del quejoso y del profesional señalado", "Narración cronológica de los hechos", "Pruebas: historia clínica, mensajes, testigos"],
    },
    {
      n: "03", k: "Enviar",
      title: "Acceso al formulario de radicación.",
      body: "Diligencie el formulario protegido y reciba un número único de proceso. A partir de allí podrá consultar el estado en línea.",
      bullets: ["Formulario con validación en tiempo real", "Confirmación por correo y SMS", "Seguimiento con número de radicado"],
    },
  ];
  return (
    <section className="section">
      <div style={{ marginBottom: 48 }}>
        <div className="eyebrow">Guía de pasos</div>
        <h2 className="display display-lg" style={{ margin: 0 }}>Antes de radicar.</h2>
      </div>
      <div style={{ position: "relative" }}>
        {/* Connecting line */}
        <div style={{
          position: "absolute", left: "calc(16.67% - 1px)", right: "calc(16.67% - 1px)", top: 36,
          height: 1, background: "var(--slate-200)",
        }}/>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, position: "relative" }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "var(--navy-900)", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 22,
                letterSpacing: "0.02em", marginBottom: 24,
                border: "6px solid #fff",
                boxShadow: "0 0 0 1px var(--navy-900)",
              }}>{s.n}</div>
              <div className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--navy-900)", marginBottom: 12 }}>Paso {s.n} · {s.k}</div>
              <h3 className="display" style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.25, margin: "0 0 14px", letterSpacing: "-0.01em" }}>{s.title}</h3>
              <p className="body" style={{ marginBottom: 18 }}>{s.body}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10, width: "100%" }}>
                {s.bullets.map((b, j) => (
                  <li key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13.5, color: "var(--slate-700)", padding: "12px 0", borderTop: "1px solid var(--line)" }}>
                    <Icon name="check" size={14} stroke={2}/>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Form
const FormularioRadicacion = () => {
  const [step, setStep] = useStateQ(1);
  const [data, setData] = useStateQ({
    nombre: "", documento: "", correo: "", telefono: "",
    profesional: "", registro: "", fecha: "", lugar: "",
    descripcion: "", acepta: false,
  });
  const update = (k, v) => setData(prev => ({ ...prev, [k]: v }));
  const filled = (k) => data[k] && String(data[k]).length > 0;

  return (
    <section style={{ background: "var(--bg-soft)" }}>
      <div className="section">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: 64 }}>
          <div>
            <div className="eyebrow">Formulario de radicación</div>
            <h2 className="display display-lg">Radique con seguridad.</h2>
            <p className="body">
              Validaciones en tiempo real y campos amplios para evitar errores.
              Los datos viajan cifrados y son tratados según la política de privacidad del Tribunal.
            </p>
            <div style={{ marginTop: 32, padding: 24, border: "1px solid var(--line)", background: "#fff" }}>
              <div className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--navy-900)", marginBottom: 12 }}>Avance del formulario</div>
              <div style={{ display: "grid", gap: 14 }}>
                {[
                  { n: 1, l: "Datos del quejoso" },
                  { n: 2, l: "Profesional señalado" },
                  { n: 3, l: "Hechos y pruebas" },
                ].map(s => (
                  <button key={s.n} onClick={() => setStep(s.n)}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "10px 0",
                      textAlign: "left",
                      borderTop: "1px solid var(--line)",
                    }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: step >= s.n ? "var(--navy-900)" : "#fff",
                      color: step >= s.n ? "#fff" : "var(--slate-400)",
                      border: "1.5px solid " + (step >= s.n ? "var(--navy-900)" : "var(--slate-300)"),
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, fontFamily: "Montserrat, sans-serif",
                    }}>{step > s.n ? "✓" : s.n}</span>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: step === s.n ? 700 : 500, color: step === s.n ? "var(--navy-900)" : "var(--slate-700)" }}>{s.l}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid var(--line)", padding: "40px 44px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h3 className="display" style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
                {step === 1 ? "Datos del quejoso" : step === 2 ? "Profesional señalado" : "Hechos y pruebas"}
              </h3>
              <span className="mono" style={{ fontSize: 11, color: "var(--slate-500)" }}>Paso {step} de 3</span>
            </div>

            {step === 1 && (
              <div style={{ display: "grid", gap: 20 }}>
                <Field label="Nombre completo" required v={data.nombre} onChange={v => update('nombre', v)} placeholder="Como aparece en su documento"/>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <Field label="Documento de identidad" required v={data.documento} onChange={v => update('documento', v)} placeholder="CC · CE · Pasaporte" hint="Solo números"/>
                  <Field label="Teléfono de contacto" required v={data.telefono} onChange={v => update('telefono', v)} placeholder="+57 300 000 0000"/>
                </div>
                <Field label="Correo electrónico" type="email" required v={data.correo} onChange={v => update('correo', v)} placeholder="usuario@correo.com" valid={data.correo.includes("@") && data.correo.includes(".")}/>
              </div>
            )}
            {step === 2 && (
              <div style={{ display: "grid", gap: 20 }}>
                <Field label="Nombre del profesional señalado" required v={data.profesional} onChange={v => update('profesional', v)}/>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <Field label="N° de registro profesional" v={data.registro} onChange={v => update('registro', v)} hint="Si lo conoce"/>
                  <Field label="Institución donde ocurrieron los hechos" v={data.lugar} onChange={v => update('lugar', v)}/>
                </div>
                <Field label="Fecha aproximada de los hechos" type="date" required v={data.fecha} onChange={v => update('fecha', v)}/>
              </div>
            )}
            {step === 3 && (
              <div style={{ display: "grid", gap: 20 }}>
                <Field
                  label="Descripción de los hechos"
                  required
                  v={data.descripcion}
                  onChange={v => update('descripcion', v)}
                  multiline
                  hint="Cronológica, en sus propias palabras. Mínimo 300 caracteres."
                  count={data.descripcion.length}
                />
                <FileDrop/>
                <label style={{ display: "flex", gap: 12, alignItems: "flex-start", marginTop: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={data.acepta} onChange={e => update('acepta', e.target.checked)} style={{ marginTop: 4, accentColor: "var(--navy-900)" }}/>
                  <span style={{ fontSize: 13.5, color: "var(--slate-700)", lineHeight: 1.5 }}>
                    Declaro bajo gravedad de juramento que la información aquí consignada es verídica y que conozco que la falsa denuncia es un delito sancionado por la ley colombiana.
                  </span>
                </label>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
              <button className="btn btn-ghost" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} style={{ opacity: step === 1 ? 0.4 : 1 }}>
                <Icon name="chevron_left" size={16}/> Anterior
              </button>
              {step < 3 ? (
                <button className="btn btn-primary" onClick={() => setStep(step + 1)}>
                  Continuar <Icon name="chevron_right" size={16}/>
                </button>
              ) : (
                <button className="btn btn-primary" disabled={!data.acepta} style={{ opacity: data.acepta ? 1 : 0.5 }}>
                  Enviar radicación <Icon name="arrow_right" size={16}/>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Field = ({ label, required, v, onChange, placeholder, multiline, hint, count, type = "text", valid }) => {
  const [focused, setFocused] = useStateQ(false);
  const showValid = valid && v && v.length > 0;
  return (
    <label style={{ display: "block" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--slate-700)", letterSpacing: "0.04em", textTransform: "uppercase", fontFamily: "Montserrat, sans-serif" }}>
          {label} {required && <span style={{ color: "var(--navy-900)" }}>*</span>}
        </span>
        {showValid && <span className="mono" style={{ fontSize: 10.5, color: "#5eb37c" }}>✓ válido</span>}
        {count !== undefined && <span className="mono" style={{ fontSize: 10.5, color: count >= 300 ? "#5eb37c" : "var(--slate-400)" }}>{count}/300</span>}
      </div>
      {multiline ? (
        <textarea value={v} onChange={e => onChange(e.target.value)} rows={5}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={placeholder} style={{
            width: "100%", padding: "14px 16px", fontSize: 14.5, fontFamily: "Inter, sans-serif",
            background: "#fff", color: "var(--ink)",
            border: "1.5px solid " + (focused ? "var(--navy-900)" : "var(--slate-200)"),
            borderRadius: 2, outline: "none", resize: "vertical",
            transition: "border-color 160ms ease",
          }}/>
      ) : (
        <input type={type} value={v} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={placeholder} style={{
            width: "100%", padding: "14px 16px", fontSize: 14.5, fontFamily: "Inter, sans-serif",
            background: "#fff", color: "var(--ink)",
            border: "1.5px solid " + (focused ? "var(--navy-900)" : "var(--slate-200)"),
            borderRadius: 2, outline: "none",
            transition: "border-color 160ms ease",
          }}/>
      )}
      {hint && <div style={{ fontSize: 11.5, color: "var(--slate-500)", marginTop: 6 }}>{hint}</div>}
    </label>
  );
};

const FileDrop = () => (
  <div style={{
    border: "1.5px dashed var(--slate-300)",
    padding: "32px 20px", textAlign: "center",
    background: "var(--bg-soft)",
    cursor: "pointer",
  }}>
    <div style={{
      width: 44, height: 44, borderRadius: "50%",
      background: "#fff", border: "1px solid var(--slate-200)",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      marginBottom: 12, color: "var(--navy-900)",
    }}>
      <Icon name="folder" size={20}/>
    </div>
    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Adjunte pruebas y soportes</div>
    <div style={{ fontSize: 12, color: "var(--slate-500)", marginTop: 4 }}>PDF, JPG o PNG · Máx. 20 MB por archivo</div>
  </div>
);

// Post-radicación infographic
const PostRadicacion = () => {
  const phases = [
    { n: "I", t: "Admisión", d: "Verificación de competencia, completitud documental y traslado al magistrado ponente.", time: "5 días hábiles" },
    { n: "II", t: "Investigación", d: "Recolección de pruebas, testimonios y descargos del profesional señalado.", time: "30 a 90 días" },
    { n: "III", t: "Pruebas", d: "Audiencia, contradicción de pruebas y verificación cruzada de los hechos.", time: "Variable" },
    { n: "IV", t: "Fallo", d: "Decisión motivada del Tribunal, notificación a las partes y publicación de jurisprudencia.", time: "15 días hábiles" },
  ];
  return (
    <section className="section">
      <div style={{ marginBottom: 56, maxWidth: 720 }}>
        <div className="eyebrow">Etapa post-radicación</div>
        <h2 className="display display-lg">¿Qué sucede después?</h2>
        <p className="lead">
          La transparencia es uno de nuestros pilares. Conocer las fases del proceso
          desmitifica la idea de una "cacería de brujas" y garantiza el debido proceso.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "var(--line)", border: "1px solid var(--line)" }}>
        {phases.map((p, i) => (
          <div key={p.n} style={{ background: "#fff", padding: "32px 28px 36px", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <div className="display" style={{
                fontSize: 44, fontWeight: 300, color: "var(--navy-900)", letterSpacing: "-0.02em", lineHeight: 1,
                fontFamily: "Montserrat, sans-serif",
              }}>{p.n}</div>
              {i < phases.length - 1 && (
                <div style={{ position: "absolute", right: -10, top: 48, color: "var(--slate-300)" }}>
                  <Icon name="chevron_right" size={20}/>
                </div>
              )}
            </div>
            <h4 className="display" style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.01em" }}>{p.t}</h4>
            <p style={{ fontSize: 13.5, color: "var(--slate-700)", lineHeight: 1.55, margin: "0 0 18px" }}>{p.d}</p>
            <div style={{ paddingTop: 16, borderTop: "1px solid var(--line)" }}>
              <div className="mono" style={{ fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--slate-500)" }}>Duración estimada</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy-900)", marginTop: 4 }}>{p.time}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const FAQRadicacion = () => {
  const faqs = [
    { q: "¿Puedo radicar una queja anónima?", a: "No. Para garantizar el debido proceso, todas las quejas requieren identificación del quejoso. Sus datos son tratados con confidencialidad." },
    { q: "¿Cuánto cuesta radicar una queja?", a: "La radicación ante el Tribunal es completamente gratuita. No existen costos administrativos ni honorarios." },
    { q: "¿Cuál es el tiempo total estimado del proceso?", a: "En promedio, entre 6 y 12 meses, dependiendo de la complejidad probatoria y los recursos interpuestos." },
    { q: "¿Puedo retirar una queja una vez radicada?", a: "Una vez admitida, el proceso continúa de oficio aún si el quejoso desiste, en tanto el Tribunal actúa por mandato legal." },
  ];
  const [open, setOpen] = useStateQ(0);
  return (
    <section style={{ background: "var(--bg-soft)" }}>
      <div className="section-narrow">
        <SectionHeader eyebrow="Preguntas frecuentes" title="Dudas comunes."/>
        <div style={{ border: "1px solid var(--line)", background: "#fff" }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ borderTop: i ? "1px solid var(--line)" : "none" }}>
              <button onClick={() => setOpen(open === i ? -1 : i)}
                style={{ width: "100%", padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
                <span className="display" style={{ fontSize: 17, fontWeight: 600, color: "var(--ink)" }}>{f.q}</span>
                <span style={{
                  fontSize: 22, color: "var(--navy-900)", fontWeight: 300,
                  transform: open === i ? "rotate(45deg)" : "rotate(0)",
                  transition: "transform 200ms ease",
                }}>+</span>
              </button>
              {open === i && (
                <div style={{ padding: "0 28px 28px", fontSize: 14.5, color: "var(--slate-700)", lineHeight: 1.65, maxWidth: "70ch" }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

Object.assign(window, { QuejaPage });
