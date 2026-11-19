// Efectos de sonido de 8 bits generados en el navegador (sin archivos). Apagados por defecto.
let ctx = null, on = false, master = null;
export function soundOn() { return on; }
export function setSound(v) {
  on = v;
  if (on && !ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0.18; master.connect(ctx.destination);
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
}
function tone(f0, f1, dur, type = 'square', vol = 0.6, delay = 0) {
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
}
export function sfx(name) {
  if (!on || !ctx) return;
  switch (name) {
    case 'tick': tone(1400, 1300, 0.03, 'square', 0.15); break;
    case 'blip': tone(660, 990, 0.08, 'square', 0.35); break;
    case 'flip': tone(300, 900, 0.12, 'triangle', 0.5); tone(900, 1200, 0.06, 'square', 0.2, 0.1); break;
    case 'whoosh': tone(200, 80, 0.25, 'sawtooth', 0.2); break;
    case 'reveal': [523, 659, 784, 1047].forEach((f, i) => tone(f, f, 0.12, 'square', 0.3, i * 0.07)); break;
    case 'type': tone(900 + Math.random() * 300, 800, 0.025, 'square', 0.06); break;
    case 'arrive': tone(523, 523, 0.07, 'square', 0.18); tone(784, 784, 0.09, 'square', 0.18, 0.07); break;
    case 'coin': tone(988, 988, 0.08, 'square', 0.35); tone(1319, 1319, 0.28, 'square', 0.35, 0.08); break;
    case 'island': tone(392, 784, 0.18, 'triangle', 0.4); tone(784, 784, 0.1, 'square', 0.15, 0.12); break;
    case 'meow': {
      const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      o.type = 'sawtooth'; f.type = 'bandpass'; f.Q.value = 3;
      o.frequency.setValueAtTime(520, t); o.frequency.linearRampToValueAtTime(880, t + 0.18); o.frequency.linearRampToValueAtTime(460, t + 0.55);
      f.frequency.setValueAtTime(900, t); f.frequency.linearRampToValueAtTime(1800, t + 0.2); f.frequency.linearRampToValueAtTime(700, t + 0.55);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.7, t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      o.connect(f); f.connect(g); g.connect(master); o.start(t); o.stop(t + 0.62);
      break;
    }
  }
}

// radio de la azotea: una melodía de 8 bits en bucle
let musicTimer = 0;
export function music(on) {
  clearInterval(musicTimer);
  if (!on) return;
  if (!ctx) setSound(true);
  const notes = [392, 440, 523, 587, 523, 440, 392, 330, 349, 392, 440, 392, 330, 294, 330, 392];
  const bass = [131, 131, 165, 165, 147, 147, 196, 196];
  let i = 0;
  const step = () => {
    if (!ctx) return;
    const t = ctx.currentTime;
    const play = (f, d, type, v) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = f; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(g); g.connect(master); o.start(t); o.stop(t + d + 0.02); };
    play(notes[i % notes.length], 0.22, 'square', 0.12);
    if (i % 2 === 0) play(bass[(i / 2) % bass.length], 0.4, 'triangle', 0.25);
    i++;
  };
  step(); musicTimer = setInterval(step, 240);
}
