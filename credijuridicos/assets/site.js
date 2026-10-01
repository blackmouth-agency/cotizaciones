/* CREDIJURÍDICOS — interacción del sitio (vanilla, sin dependencias) */
(() => {
  'use strict';

  /* ---- Datos por confirmar con el cliente ---- */
  const CFG = {
    whatsapp: '573000000000',      // PENDIENTE: número real de WhatsApp
    smmlv: 1750905,                // Salario mínimo 2026 (verificar decreto)
    auxTransporte: 249095,         // Auxilio de transporte 2026 (verificar decreto)
  };

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fino = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const modo = () => root.dataset.modo;
  const pesos = n => '$' + Math.round(n).toLocaleString('es-CO');
  const waURL = txt => `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(txt)}`;
  const abrirWA = txt => window.open(waURL(txt), '_blank', 'noopener');

  /* ---------- Precarga ---------- */
  const pre = $('.precarga');
  let yaVio = false;
  try { yaVio = sessionStorage.getItem('cj-pre') === '1'; sessionStorage.setItem('cj-pre', '1'); } catch (e) {}
  if (reduce || yaVio) {
    root.classList.add('sin-precarga');
    requestAnimationFrame(() => root.classList.add('listo'));
  } else {
    setTimeout(() => pre.classList.add('fuera'), 1500);
    setTimeout(() => root.classList.add('listo'), 1650);
    setTimeout(() => pre.remove(), 2600);
  }

  /* ---------- Modo trabajador / empresa ---------- */
  function aplicarModo(m) {
    root.dataset.modo = m;
    try { localStorage.setItem('cj-modo', m); } catch (e) {}
    const url = new URL(location.href);
    url.searchParams.set('para', m === 'e' ? 'empresa' : 'trabajador');
    history.replaceState(null, '', url);
    $$('[data-ir]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.ir === m)));
    // Lo que acaba de aparecer y ya está en pantalla se muestra sin esperar al observador
    $$(`[data-solo="${m}"] [data-rev], [data-solo="${m}"][data-rev]`).forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) el.classList.add('visto');
    });
    calcular(); reloj(); chequeo(); medirMarquesina();
  }
  function cambiarModo(m, ev) {
    if (m === modo()) return;
    if (!document.startViewTransition || reduce) { aplicarModo(m); return; }
    const x = ev && ev.clientX ? ev.clientX : innerWidth / 2;
    const y = ev && ev.clientY ? ev.clientY : innerHeight / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(() => aplicarModo(m));
    vt.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 900, easing: 'cubic-bezier(.7,0,.2,1)', pseudoElement: '::view-transition-new(root)' }
      );
    });
  }
  $$('[data-ir]').forEach(b => {
    b.setAttribute('aria-pressed', String(b.dataset.ir === modo()));
    b.addEventListener('click', ev => cambiarModo(b.dataset.ir, ev));
  });

  /* ---------- Menú móvil ---------- */
  const btnMenu = $('.cab__menu'), menu = $('#menu-movil');
  const cerrarMenu = () => { menu.hidden = true; btnMenu.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
  btnMenu.addEventListener('click', () => {
    const abrir = menu.hidden;
    menu.hidden = !abrir; btnMenu.setAttribute('aria-expanded', String(abrir));
    document.body.style.overflow = abrir ? 'hidden' : '';
  });
  $$('a', menu).forEach(a => a.addEventListener('click', cerrarMenu));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { cerrarMenu(); btnMenu.focus(); } });

  /* ---------- Acordeón de casos ---------- */
  $$('.fila').forEach(f => {
    const btn = $('.fila__btn', f), det = $('.fila__det', f);
    det.hidden = false;
    btn.addEventListener('click', () => {
      const abrir = !f.classList.contains('abierta');
      $$('.fila.abierta', f.parentElement).forEach(o => { o.classList.remove('abierta'); $('.fila__btn', o).setAttribute('aria-expanded', 'false'); });
      f.classList.toggle('abierta', abrir);
      btn.setAttribute('aria-expanded', String(abrir));
    });
  });
  $$('[data-wa]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); abrirWA(a.dataset.wa); }));
  $$('[data-wa-cierre]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    abrirWA(modo() === 'e' ? 'Hola, escribo de una empresa y queremos asesoría laboral.' : 'Hola, quiero orientación sobre un tema laboral.');
  }));

  /* ---------- Cursor ---------- */
  if (fino && !reduce) {
    const cur = $('.cursor'), txt = $('.cursor__txt');
    let x = -100, y = -100, cx = x, cy = y;
    addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; cur.classList.add('activo'); }, { passive: true });
    document.addEventListener('pointerleave', () => cur.classList.remove('activo'));
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('[data-cursor]');
      cur.classList.toggle('grande', !!t);
      if (t) txt.textContent = t.dataset.cursor;
    });
    (function bucle() {
      cx += (x - cx) * .2; cy += (y - cy) * .2;
      cur.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(bucle);
    })();
  }

  /* ---------- Marquesina con velocidad de scroll ---------- */
  const filas = $$('.marquesina__fila').map(f => {
    $$('.marquesina__pista', f).forEach(p => { p.innerHTML += p.innerHTML; });
    return { el: f, dir: +f.dataset.dir, x: 0, ancho: 1 };
  });
  function medirMarquesina() {
    filas.forEach(f => {
      const vis = $$('.marquesina__pista', f.el).find(p => p.offsetParent !== null);
      f.ancho = vis ? vis.scrollWidth / 2 : 1;
    });
  }
  medirMarquesina();
  addEventListener('resize', medirMarquesina);
  document.fonts && document.fonts.ready.then(medirMarquesina);

  /* ---------- Bucle de scroll ---------- */
  const cab = $('.cab'), hero = $('.hero'), heroPluma = $('.hero__pluma'), wa = $('.wa-flotante');
  const proceso = $('.proceso'), pista = $('.proceso__pista'), pasos = $$('.paso');
  const pie = $('.pie');
  const manif = $('[data-palabras]');
  let ultY = scrollY, vel = 0;

  // Partir el manifiesto en palabras
  (function partir(el) {
    [...el.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(w => {
          if (!w) return;
          if (/^\s+$/.test(w)) frag.append(w);
          else { const s = document.createElement('span'); s.className = 'p'; s.textContent = w; frag.append(s); }
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) { n.classList.add('p'); }
    });
  })(manif);
  const palabras = $$('.p', manif);

  function enScroll() {
    const y = scrollY, vh = innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    root.style.setProperty('--scroll', (y / max).toFixed(4));

    cab.classList.toggle('con-fondo', y > 40);
    cab.classList.toggle('oculta', y > ultY && y > 400 && menu.hidden);
    vel = clamp((y - ultY) * .6, -40, 40);
    ultY = y;

    heroPluma.style.setProperty('--hp', clamp(y / (vh * .9)).toFixed(3));
    wa.classList.toggle('ver', y > vh * .8);

    // Manifiesto
    const rm = manif.getBoundingClientRect();
    const pm = clamp((vh * .82 - rm.top) / (rm.height + vh * .25));
    const on = Math.round(pm * palabras.length);
    palabras.forEach((w, i) => w.classList.toggle('on', reduce || i < on));

    // Proceso horizontal
    if (innerWidth > 900) {
      const rp = proceso.getBoundingClientRect();
      const pp = clamp(-rp.top / (rp.height - vh));
      const desp = Math.max(0, pista.scrollWidth - innerWidth);
      pista.style.setProperty('--tx', (-desp * pp).toFixed(1) + 'px');
      pista.style.setProperty('--pp', pp.toFixed(4));
      pasos.forEach((p, i) => p.classList.toggle('on', pp >= i / pasos.length - .02));
    }

    // Logo del pie sube
    const rf = pie.getBoundingClientRect();
    const pf = clamp((vh - rf.top) / rf.height);
    pie.querySelector('.pie__logo').style.setProperty('--py', ((1 - pf) * 45).toFixed(1) + '%');
  }
  addEventListener('scroll', enScroll, { passive: true });
  addEventListener('resize', enScroll);
  enScroll();

  (function animar() {
    if (!reduce) {
      filas.forEach(f => {
        f.x -= (1.1 + Math.abs(vel) * .5) * f.dir;
        if (f.x <= -f.ancho) f.x += f.ancho;
        if (f.x > 0) f.x -= f.ancho;
        f.el.style.transform = `translate3d(${f.x}px,0,0)`;
      });
      vel *= .92;
    }
    requestAnimationFrame(animar);
  })();

  /* ---------- Pluma del hero: inclinación con el mouse ---------- */
  if (fino && !reduce) {
    hero.addEventListener('pointermove', e => {
      const rx = (e.clientY / innerHeight - .5) * -10;
      const ry = (e.clientX / innerWidth - .5) * 16;
      heroPluma.style.setProperty('--rx', rx.toFixed(2) + 'deg');
      heroPluma.style.setProperty('--ry', ry.toFixed(2) + 'deg');
    });
  }

  /* ---------- Sello magnético ---------- */
  const sello = $('.sello');
  if (fino && !reduce && sello) {
    const zona = $('.cierre__grande');
    zona.addEventListener('pointermove', e => {
      const r = sello.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < r.width * 1.4) { sello.style.setProperty('--mx', dx * .3 + 'px'); sello.style.setProperty('--my', dy * .3 + 'px'); }
      else { sello.style.setProperty('--mx', '0px'); sello.style.setProperty('--my', '0px'); }
    });
    zona.addEventListener('pointerleave', () => { sello.style.setProperty('--mx', '0px'); sello.style.setProperty('--my', '0px'); });
  }

  /* ---------- Aparición por scroll + contadores ---------- */
  const revSel = ['.sec-cab > *', '.fila', '.cifra', '.calc__form', '.calc__res', '.reloj__txt > *', '.reloj__vis',
    '.chequeo__txt > *', '.chequeo__vis', '.faq details', '.cierre__intro > *', '.form > *', '.proceso__cab > *'];
  $$(revSel.join(',')).forEach(el => {
    const i = [...el.parentElement.children].indexOf(el);
    el.dataset.rev = '';
    el.style.setProperty('--d', Math.min(i * .06, .42) + 's');
  });
  const contar = el => {
    const fin = +el.dataset.contar, t0 = performance.now(), dur = 1400;
    (function paso(t) {
      const k = clamp((t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      el.textContent = Math.round(fin * e);
      if (k < 1) requestAnimationFrame(paso);
    })(t0);
  };
  const io = new IntersectionObserver(entradas => entradas.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('visto');
    $$('[data-contar]', en.target).forEach(c => { if (!c.dataset.hecho && !reduce) { c.dataset.hecho = 1; contar(c); } });
    io.unobserve(en.target);
  }), { rootMargin: '0px 0px -8% 0px' });
  $$('[data-rev]').forEach(el => io.observe(el));

  /* ---------- Calculadora de liquidación ---------- */
  const form = $('#calc-form');
  const F = n => form.elements[n];
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const fecha = s => { if (!s) return null; const [a, m, d] = s.split('-').map(Number); return new Date(a, m - 1, d); };
  F('salida').value = iso(hoy);
  const finDef = new Date(hoy); finDef.setMonth(finDef.getMonth() + 6);
  F('fin').value = iso(finDef);

  // Días con calendario comercial de 360 días (meses de 30), incluyendo el primer y el último día
  function d360(a, b) {
    let d1 = a.getDate(), d2 = b.getDate();
    const finFeb = d => d.getMonth() === 1 && d.getDate() === new Date(d.getFullYear(), 2, 0).getDate();
    if (d1 === 31 || finFeb(a)) d1 = 30;
    if (d2 === 31 || finFeb(b)) d2 = 30;
    return (b.getFullYear() - a.getFullYear()) * 360 + (b.getMonth() - a.getMonth()) * 30 + (d2 - d1) + 1;
  }
  const mayor = (a, b) => (a > b ? a : b);

  const salidaTotal = $('#calc-total');
  let totalMostrado = 0, animTotal;
  function pintarTotal(v) {
    cancelAnimationFrame(animTotal);
    if (reduce) { salidaTotal.textContent = pesos(v); totalMostrado = v; return; }
    const ini = totalMostrado, t0 = performance.now();
    (function paso(t) {
      const k = clamp((t - t0) / 700), e = 1 - Math.pow(1 - k, 3);
      totalMostrado = ini + (v - ini) * e;
      salidaTotal.textContent = pesos(totalMostrado);
      if (k < 1) animTotal = requestAnimationFrame(paso);
    })(t0);
  }

  let ultimoCalculo = '';
  function calcular() {
    const aviso = $('#calc-aviso');
    const salario = +String(F('salario').value).replace(/\D/g, '');
    const ingreso = fecha(F('ingreso').value), salida = fecha(F('salida').value);
    const tipo = form.querySelector('[name=tipo]:checked').value;
    const motivo = form.querySelector('[name=motivo]:checked').value;
    $('[data-si-fijo]').hidden = tipo !== 'fijo';
    aviso.textContent = '';

    const cero = () => { $$('.calc__desglose dd').forEach(d => (d.textContent = '$0')); pintarTotal(0); };
    if (!salario || !ingreso || !salida) { aviso.textContent = 'Escribe el salario y las dos fechas para calcular.'; return cero(); }
    if (salida < ingreso) { aviso.textContent = 'La fecha de salida tiene que ser posterior a la de ingreso.'; return cero(); }
    if (salario < CFG.smmlv) aviso.textContent = `Ojo: el salario no puede ser menor al mínimo (${pesos(CFG.smmlv)}). Si te pagan menos, eso también se reclama.`;
    else if (salario >= CFG.smmlv * 13) aviso.textContent = 'Si tienes salario integral, no hay cesantías ni prima: escríbenos para calcularlo bien.';

    const base = salario <= CFG.smmlv * 2 ? salario + CFG.auxTransporte : salario;
    const a = salida.getFullYear();

    const diasCes = d360(mayor(ingreso, new Date(a, 0, 1)), salida);
    const ces = base * diasCes / 360;
    const int = ces * diasCes * .12 / 360;

    const semIni = salida.getMonth() < 6 ? new Date(a, 0, 1) : new Date(a, 6, 1);
    const prima = base * d360(mayor(ingreso, semIni), salida) / 360;

    let aniv = new Date(a, ingreso.getMonth(), ingreso.getDate());
    if (aniv > salida) aniv = new Date(a - 1, ingreso.getMonth(), ingreso.getDate());
    const vac = salario * d360(mayor(ingreso, aniv), salida) / 720;

    let ind = 0;
    if (motivo === 'sin') {
      if (tipo === 'indefinido') {
        const anios = d360(ingreso, salida) / 360;
        const alto = salario >= CFG.smmlv * 10;
        const primero = alto ? 20 : 30, adicional = alto ? 15 : 20;
        const dias = anios <= 1 ? primero : primero + (anios - 1) * adicional;
        ind = salario / 30 * dias;
      } else {
        const fin = fecha(F('fin').value);
        if (fin && fin > salida) {
          const sig = new Date(salida); sig.setDate(sig.getDate() + 1);
          ind = salario / 30 * d360(sig, fin);
        } else if (!aviso.textContent) aviso.textContent = 'Para un contrato a término fijo, pon la fecha pactada de terminación (posterior a la salida).';
      }
    }

    const vals = { ces, int, prima, vac, ind };
    Object.entries(vals).forEach(([k, v]) => ($(`[data-k="${k}"]`).textContent = pesos(v)));
    const total = ces + int + prima + vac + ind;
    pintarTotal(total);

    const motivoTxt = { sin: 'despido sin justa causa', renuncia: 'renuncia', con: 'despido con justa causa' }[motivo];
    ultimoCalculo = `Salario ${pesos(salario)}, del ${F('ingreso').value} al ${F('salida').value}, contrato a término ${tipo}, ${motivoTxt}. La calculadora estimó ${pesos(total)}.`;
  }
  // Formato de miles mientras se escribe
  F('salario').addEventListener('input', e => {
    const n = e.target.value.replace(/\D/g, '').slice(0, 12);
    e.target.value = n ? Number(n).toLocaleString('es-CO') : '';
  });
  form.addEventListener('input', calcular);
  form.addEventListener('change', calcular);
  form.addEventListener('submit', e => e.preventDefault());
  $('#calc-wa').addEventListener('click', e => {
    e.preventDefault();
    abrirWA((modo() === 'e' ? 'Hola, escribo de una empresa. Usamos la calculadora de liquidación. ' : 'Hola, usé la calculadora de liquidación. ') + ultimoCalculo + ' Quiero revisarlo con un abogado.');
  });
  calcular();

  /* ---------- Reloj de prescripción ---------- */
  const rFecha = $('#reloj-fecha'), rAro = $('.reloj__resto');
  function reloj() {
    const f = fecha(rFecha.value);
    const n = $('#reloj-n'), u = $('#reloj-u'), msg = $('#reloj-msg');
    if (!f) { n.textContent = '—'; msg.textContent = 'Elige una fecha.'; rAro.style.setProperty('--off', 1000); return; }
    if (f > hoy) { n.textContent = '—'; u.textContent = 'días para reclamar'; msg.textContent = 'Esa fecha todavía no llega. Pon la fecha en que terminó tu contrato o en que debieron pagarte.'; rAro.style.setProperty('--off', 0); return; }
    const limite = new Date(f); limite.setFullYear(limite.getFullYear() + 3);
    const quedan = Math.ceil((limite - hoy) / 864e5);
    const total = Math.round((limite - f) / 864e5);
    const frac = clamp(quedan / total);
    rAro.style.setProperty('--off', (1000 * (1 - frac)).toFixed(0));
    n.textContent = Math.max(quedan, 0).toLocaleString('es-CO');
    u.textContent = quedan === 1 ? 'día para reclamar' : 'días para reclamar';
    msg.textContent =
      quedan <= 0 ? 'Pasaron más de tres años. Aun así, hay derechos que se pueden revisar, como los aportes a pensión. Escríbenos.' :
      quedan <= 90 ? 'Quedan pocas semanas. Escríbenos hoy para no perder el plazo.' :
      quedan <= 365 ? 'Te queda menos de un año. Es buen momento para actuar.' :
      'Estás a tiempo. Igual conviene no esperar: con los meses las pruebas se pierden.';
  }
  rFecha.addEventListener('input', reloj);
  reloj();

  /* ---------- Chequeo de cumplimiento ---------- */
  const chkBtns = $$('.chequeo__lista button');
  function chequeo() {
    const n = chkBtns.filter(b => b.getAttribute('aria-pressed') === 'true').length;
    $('#chequeo-n').textContent = n;
    $('.medidor__val').style.setProperty('--off', (100 - n / chkBtns.length * 100).toFixed(1));
    const [nivel, msg] =
      n === chkBtns.length ? ['En orden', 'Todo marcado. Una auditoría confirma que lo que está en el papel también pasa en la práctica.'] :
      n >= 6 ? ['Riesgo bajo', 'Van bien. Quedan uno o dos frentes que vale la pena cerrar antes de una revisión.'] :
      n >= 4 ? ['Riesgo medio', 'Hay puntos que pueden terminar en sanción de la UGPP o en una demanda. Se pueden corregir.'] :
      ['Riesgo alto', 'Hay frentes abiertos que pueden terminar en sanción o demanda. Revisémoslos juntos.'];
    $('#chequeo-nivel').textContent = nivel;
    $('#chequeo-msg').textContent = msg;
  }
  chkBtns.forEach(b => b.addEventListener('click', () => { b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); chequeo(); }));
  $('#chequeo-wa').addEventListener('click', e => {
    e.preventDefault();
    const faltan = chkBtns.filter(b => b.getAttribute('aria-pressed') !== 'true').map(b => '- ' + b.textContent).join('\n');
    abrirWA(`Hola, hicimos el chequeo de cumplimiento laboral (${$('#chequeo-n').textContent}/8). Nos falta:\n${faltan || '- Nada, queremos confirmarlo con una auditoría.'}`);
  });
  chequeo();

  /* ---------- Formulario de contacto → WhatsApp ---------- */
  $('#form-contacto').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, err = $('#form-error');
    const nombre = f.nombre.value.trim(), tel = f.tel.value.trim(), caso = f.caso.value.trim();
    const falta = [!nombre && 'tu nombre', !tel && 'un teléfono', !caso && 'qué pasó'].filter(Boolean);
    if (falta.length) { err.textContent = 'Falta ' + falta.join(', ') + '.'; return; }
    err.textContent = '';
    const emp = modo() === 'e' && f.empresa.value.trim() ? ` de ${f.empresa.value.trim()}` : '';
    abrirWA(`Hola, soy ${nombre}${emp}. Mi teléfono es ${tel}.\n\n${caso}`);
  });
})();
