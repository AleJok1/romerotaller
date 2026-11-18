// Taller Romero · JS sin dependencias. Todo el horario sale de assets/config.js.
(() => {
  const C = window.TALLER;
  if (!C) return;
  const N = C.negocio;
  const WA = `https://wa.me/${N.whatsapp}`;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const DIAS_CORTOS = ['Dom.', 'L', 'M', 'X', 'J', 'V', 'Sáb.'];
  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const pad = n => String(n).padStart(2, '0');
  const hora = t => t.replace(/^0/, '');                      // "08:00" -> "8:00"
  const telTxt = n => n.replace(/^\+34/, '').replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  const min = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

  /* ---------- Calendario ---------- */
  const festivos = new Map([...(C.festivosOficiales || []), ...(C.festivosLocales || [])]);
  function ahoraMadrid() {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
      .formatToParts(new Date()).map(x => [x.type, x.value]));
    return { y: +p.year, m: +p.month, d: +p.day, minutos: (+p.hour % 24) * 60 + +p.minute };
  }
  function dia(y, m, d, mas = 0) {
    const f = new Date(Date.UTC(y, m - 1, d + mas));
    const Y = f.getUTCFullYear(), M = f.getUTCMonth() + 1, D = f.getUTCDate(), wd = f.getUTCDay();
    const iso = `${Y}-${pad(M)}-${pad(D)}`;
    const md = `${pad(M)}-${pad(D)}`;
    const v = C.verano;
    const enVerano = !!(v && v.activo && md >= v.desde && md <= v.hasta);
    const festivo = festivos.get(iso) || null;
    const tramos = festivo ? [] : ((enVerano ? v.horario : C.horario)[wd] || []);
    return { Y, M, D, wd, iso, festivo, tramos, enVerano };
  }
  function cuando(info, offset) {
    if (offset === 0) return 'hoy';
    if (offset === 1) return 'mañana';
    if (offset < 7) return `el ${DIAS[info.wd]}`;
    return `el ${info.D} de ${MESES[info.M - 1]}`;
  }
  function estadoAhora() {
    const a = ahoraMadrid();
    const hoy = dia(a.y, a.m, a.d);
    for (const [ab, ci] of hoy.tramos) {
      if (a.minutos >= min(ab) && a.minutos < min(ci)) return { abierto: true, texto: `Abierto, cierra a las ${hora(ci)}` };
    }
    const pref = hoy.festivo ? 'Cerrado por festivo' : 'Cerrado';
    const luego = hoy.tramos.find(([ab]) => min(ab) > a.minutos);
    if (luego) return { abierto: false, texto: `${pref}, abre hoy a las ${hora(luego[0])}` };
    for (let i = 1; i <= 21; i++) {
      const s = dia(a.y, a.m, a.d, i);
      if (s.tramos.length) return { abierto: false, texto: `${pref}, abre ${cuando(s, i)} a las ${hora(s.tramos[0][0])}` };
    }
    return { abierto: false, texto: pref };
  }

  /* ---------- Horario en texto (agrupa días iguales) ---------- */
  const tramosTxt = t => t.length ? t.map(([a, c]) => `${hora(a)}–${hora(c)}`).join(' y ') : 'Cerrado';
  function grupos(h) {
    const orden = [1, 2, 3, 4, 5, 6, 0], out = [];
    for (const d of orden) {
      const txt = tramosTxt(h[d] || []);
      const ult = out[out.length - 1];
      if (ult && ult.txt === txt) ult.dias.push(d); else out.push({ txt, dias: [d] });
    }
    return out;
  }
  const nombreGrupo = (dias, corto) => {
    const n = corto ? DIAS_CORTOS : DIAS.map(s => s[0].toUpperCase() + s.slice(1));
    if (dias.length === 1) return n[dias[0]];
    if (dias.length === 2) return `${n[dias[0]]} y ${corto ? n[dias[1]] : n[dias[1]].toLowerCase()}`;
    return corto ? `${n[dias[0]]}–${n[dias[dias.length - 1]]}` : `${n[dias[0]]} a ${n[dias[dias.length - 1]].toLowerCase()}`;
  };

  function pintarHorario() {
    const a = ahoraMadrid(), hoy = dia(a.y, a.m, a.d);
    const base = hoy.enVerano ? C.verano.horario : C.horario;
    const gs = grupos(base);
    // Resumen corto (portada)
    $$('[data-horario-resumen]').forEach(el => {
      el.textContent = gs.filter(g => g.txt !== 'Cerrado').map(g => `${nombreGrupo(g.dias, true)} ${g.txt}`).join(' · ');
    });
    // Tabla
    const tabla = $('#horario');
    if (tabla) {
      tabla.replaceChildren(...gs.map(g => {
        const fila = document.createElement('div');
        if (g.dias.includes(hoy.wd) && !hoy.festivo) fila.className = 'hoy';
        const dt = document.createElement('dt'); dt.textContent = nombreGrupo(g.dias, false);
        const dd = document.createElement('dd'); dd.textContent = g.txt;
        fila.append(dt, dd); return fila;
      }));
    }
    // Frase de un día concreto (p. ej. la respuesta de los sábados)
    $$('[data-horario-dia]').forEach(el => {
      const t = base[el.dataset.horarioDia] || [];
      el.textContent = t.length ? t.map(([x, y]) => `de ${hora(x)} a ${hora(y)}`).join(' y ') : 'cerrado';
    });
    // Aviso de verano
    const v = C.verano, av = $('#aviso-verano');
    if (av && v && v.activo) {
      const [m1, d1] = v.desde.split('-').map(Number), [m2, d2] = v.hasta.split('-').map(Number);
      av.hidden = false;
      av.textContent = `Del ${d1} de ${MESES[m1 - 1]} al ${d2} de ${MESES[m2 - 1]}: ` + grupos(v.horario).filter(g => g.txt !== 'Cerrado').map(g => `${nombreGrupo(g.dias, false).toLowerCase()} ${g.txt}`).join(', ') + '.';
    }
    // Próximos festivos que caen en día de apertura
    const lista = $('#proximos-festivos');
    if (lista) {
      const prox = [];
      for (let i = 0; i < 120 && prox.length < 3; i++) {
        const s = dia(a.y, a.m, a.d, i);
        const normal = ((s.enVerano ? C.verano.horario : C.horario)[s.wd] || []).length;
        if (s.festivo && normal) prox.push(`${DIAS[s.wd]} ${s.D} de ${MESES[s.M - 1]} (${s.festivo.replace(/\s*\(.*\)$/, '')})`);
      }
      if (prox.length) { lista.hidden = false; $('span', lista).textContent = prox.join(', ') + '.'; }
    }
    // Estado
    const e = estadoAhora();
    $$('[data-estado]').forEach(el => { el.dataset.abierto = e.abierto ? 'si' : 'no'; el.textContent = e.texto; });
  }

  /* ---------- Datos para Google (JSON-LD) desde la configuración ---------- */
  function jsonLd() {
    const dom = N.dominio;
    const nombres = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const spec = h => {
      const out = [];
      for (const g of grupos(h)) {
        if (g.txt === 'Cerrado') continue;
        for (const [o, c] of h[g.dias[0]]) out.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: g.dias.map(d => nombres[d]), opens: o, closes: c });
      }
      return out;
    };
    const a = ahoraMadrid(), especiales = [];
    for (let i = 0; i < 400; i++) {
      const s = dia(a.y, a.m, a.d, i);
      if (s.festivo) especiales.push({ '@type': 'OpeningHoursSpecification', validFrom: s.iso, validThrough: s.iso, opens: '00:00', closes: '00:00' });
    }
    const d = {
      '@context': 'https://schema.org', '@type': 'AutoRepair', name: N.nombre,
      telephone: N.telefonoFijo, email: N.email,
      contactPoint: [{ '@type': 'ContactPoint', telephone: N.telefonoMovil, contactType: 'customer service', availableLanguage: 'es' }],
      address: { '@type': 'PostalAddress', streetAddress: N.calle, postalCode: N.cp, addressLocality: N.localidad, addressRegion: N.provincia, addressCountry: 'ES' },
      hasMap: N.mapa, sameAs: [N.instagram],
      openingHoursSpecification: spec(C.horario),
      specialOpeningHoursSpecification: especiales,
      hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Servicios del taller', itemListElement: ['Mecánica rápida', 'Neumáticos', 'Diagnosis', 'Pre-ITV', 'Bolas de remolque', 'Aire acondicionado'].map(n => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: n } })) }
    };
    if (dom) Object.assign(d, { '@id': dom + '/#taller', url: dom + '/', image: dom + '/og.jpg', logo: dom + '/apple-touch-icon.png' });
    // Sin aggregateRating a propósito: Google no admite valoraciones «autoservidas»
    // de LocalBusiness (https://developers.google.com/search/docs/appearance/structured-data/review-snippet).
    if (N.lat && N.lng) d.geo = { '@type': 'GeoCoordinates', latitude: N.lat, longitude: N.lng };
    const s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(d);
    document.head.append(s);
  }

  /* ---------- Reseñas ---------- */
  function pintarResenas() {
    const r = C.resenas || {};
    if (r.nota && r.total) {
      const nota = $('#nota-google');
      if (nota) nota.textContent = `${Number(r.nota).toFixed(1).replace('.', ',')} · ${r.total} reseñas en Google`;
      const f = $('#fecha-resenas');
      if (f && r.fecha) { const [y, m, dd] = r.fecha.split('-').map(Number); f.textContent = `Datos de la ficha de Google a ${dd}/${m}/${y}.`; }
    }
    const b = $('#dejar-resena');
    const v = $('#ver-resenas');
    if (v && r.enlaceVer) v.href = r.enlaceVer;
    if (b && r.enlaceResena) { b.href = r.enlaceResena; const p = $('.pendiente', b.parentElement); if (p) p.remove(); }
  }

  /* ---------- Fotos que aún no existen (Miguel de joven, Silvia) ---------- */
  $$('img[data-hueco]').forEach(img => {
    const marcar = () => { img.closest('[data-hueco-contenedor]').classList.add('sin-foto'); img.remove(); };
    if (img.complete && img.naturalWidth === 0) marcar(); else img.addEventListener('error', marcar, { once: true });
  });

  /* ---------- Mensaje de WhatsApp ---------- */
  const form = $('#consulta');
  if (form) {
    const vista = $('#vista'), coche = $('#coche'), detalle = $('#detalle');
    const texto = () => {
      const serv = $$('input[name=servicio]:checked', form).map(i => i.value.toLowerCase());
      const sint = $$('input[name=sintoma]:checked', form).map(i => i.value.toLowerCase());
      let t = `Hola, ${N.nombre}. `;
      t += serv.length ? `Quería pedir cita para: ${serv.join(', ')}.` : 'Quería pedir cita.';
      if (sint.length) t += `\nLe noto: ${sint.join(', ')}.`;
      if (coche.value.trim()) t += `\nMi coche: ${coche.value.trim()}.`;
      if (detalle.value.trim()) t += `\n${detalle.value.trim()}`;
      return t;
    };
    const enlace = () => `${WA}?text=${encodeURIComponent(texto())}`;
    const pintar = animar => {
      const t = texto();
      if (vista.textContent === t) return;
      const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (animar && document.startViewTransition && !reducido) document.startViewTransition(() => { vista.textContent = t; });
      else vista.textContent = t;
    };
    form.addEventListener('change', () => pintar(true));
    form.addEventListener('input', e => { if (e.target.matches('input[type=text],textarea')) pintar(false); });
    form.addEventListener('submit', e => { e.preventDefault(); window.open(enlace(), '_blank', 'noopener'); });
    $$('[data-servicio]').forEach(a => a.addEventListener('click', () => {
      $$('input[name=servicio]', form).forEach(i => { i.checked = i.value === a.dataset.servicio; });
      pintar(false);
    }));
    pintar(false);
  }

  /* ---------- Guardar contacto (vCard generada desde la configuración) ---------- */
  function descargar(nombre, tipo, contenido) {
    const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
    const a = document.createElement('a'); a.href = url; a.download = nombre;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
  const esc = s => String(s).replace(/([,;\\])/g, '\\$1');
  const vcard = $('#guardar-contacto');
  if (vcard) vcard.addEventListener('click', () => {
    // Web: el dominio de config.js o, publicada en https (pages.dev), la dirección actual.
    const web = N.dominio || (location.protocol === 'https:' ? location.origin : '');
    const lineas = ['BEGIN:VCARD', 'VERSION:3.0', `FN:${esc(N.nombre)}`, `ORG:${esc(N.nombre)}`,
      `TEL;TYPE=WORK,VOICE:${N.telefonoFijo}`, `TEL;TYPE=CELL:${N.telefonoMovil}`, `EMAIL;TYPE=INTERNET:${N.email}`,
      `ADR;TYPE=WORK:;;${esc(N.calle)};${esc(N.localidad)};${esc(N.provincia)};${N.cp};España`,
      web ? `URL:${web}` : '', `NOTE:${esc('Taller mecánico. WhatsApp: ' + WA)}`, 'END:VCARD'].filter(Boolean);
    descargar('taller-romero.vcf', 'text/vcard;charset=utf-8', lineas.join('\r\n'));
  });

  /* ---------- Recordatorio en el calendario (.ics) ---------- */
  const rec = $('#recordatorio');
  if (rec) {
    const fecha = $('#rec-fecha');
    const hoyIso = (() => { const a = ahoraMadrid(); return `${a.y}-${pad(a.m)}-${pad(a.d)}`; })();
    fecha.min = hoyIso;
    rec.addEventListener('submit', e => {
      e.preventDefault();
      if (!fecha.value) { fecha.focus(); $('#rec-error').hidden = false; return; }
      $('#rec-error').hidden = true;
      const que = $('#rec-que').value, antes = +$('#rec-antes').value;
      const [y, m, d] = fecha.value.split('-').map(Number);
      const aviso = new Date(Date.UTC(y, m - 1, d - antes));
      const ymd = f => `${f.getUTCFullYear()}${pad(f.getUTCMonth() + 1)}${pad(f.getUTCDate())}`;
      const fin = new Date(aviso.getTime() + 86400000);
      const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
      const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Taller Romero//Recordatorio//ES', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
        `UID:${stamp}-${Math.random().toString(36).slice(2)}@taller-romero`, `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${ymd(aviso)}`, `DTEND;VALUE=DATE:${ymd(fin)}`,
        `SUMMARY:${esc(`Pedir cita en ${N.nombre}: ${que}`)}`,
        `DESCRIPTION:${esc(`${que} el ${d}/${m}/${y}. Llama al ${telTxt(N.telefonoFijo)} o escribe por WhatsApp: ${WA}`)}`,
        `LOCATION:${esc(`${N.calle}, ${N.cp} ${N.localidad}`)}`,
        'BEGIN:VALARM', 'ACTION:DISPLAY', 'TRIGGER:PT9H', `DESCRIPTION:${esc(`Pedir cita en ${N.nombre}`)}`, 'END:VALARM',
        'END:VEVENT', 'END:VCALENDAR'];
      descargar('recordatorio-taller-romero.ics', 'text/calendar', ics.join('\r\n'));
      $('#rec-ok').hidden = false;
    });
  }

  /* ---------- Menú móvil y mapa ---------- */
  const menu = $('.menu-movil');
  if (menu) menu.addEventListener('click', e => { if (e.target.closest('a')) menu.open = false; });
  const boton = $('#cargar-mapa');
  if (boton) boton.addEventListener('click', () => {
    const f = document.createElement('iframe');
    const q = N.lat && N.lng ? `${N.lat},${N.lng}` : `${N.calle}, ${N.cp} ${N.localidad}, ${N.provincia}`;
    f.src = 'https://www.google.com/maps?q=' + encodeURIComponent(q) + '&z=17&output=embed';
    f.title = `Mapa: ${N.nombre}, ${N.calle}, ${N.localidad}`;
    f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
    $('#mapa').replaceChildren(f);
  });

  pintarHorario();
  jsonLd();
  pintarResenas();
  // Si la pestaña queda abierta, el estado se actualiza solo cada minuto
  setInterval(() => { const e = estadoAhora(); $$('[data-estado]').forEach(el => { el.dataset.abierto = e.abierto ? 'si' : 'no'; el.textContent = e.texto; }); }, 60000);
})();
