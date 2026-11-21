import './ui.js';
import { $, urlWhatsApp } from './util.js';

// El formulario de contacto no guarda nada: arma el mensaje y lo abre en WhatsApp.
const f = $('#form-contacto');
f?.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = f.nombre.value.trim().slice(0, 80);
  const mensaje = f.mensaje.value.trim().slice(0, 600);
  const estado = $('.estado', f);
  if (nombre.length < 2 || mensaje.length < 3) { estado.textContent = 'Escribe tu nombre y tu mensaje.'; return; }
  estado.textContent = '';
  location.assign(urlWhatsApp(`Hola Stimura 👋 Soy ${nombre}. ${mensaje}`));
});
