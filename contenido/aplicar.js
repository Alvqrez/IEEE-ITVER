/*
  Aplica los datos de contenido/*.js a cualquier página y da vida a las acciones compartidas.
  Cada diseño decide su propio marcado y estilo; este archivo solo rellena y conecta:

  Datos sueltos
    [data-dato="nombre|fundacion|mision|vision|sobreIEEECS"]   texto
    a[data-red="instagram|facebook"]       href (y [data-red-usuario] dentro, con el usuario)
    [data-correo]                          enlace o texto del correo; sin correo, lleva a Instagram
    [data-mesa] > template                 una copia por integrante de la mesa: [data-rol], [data-nombre], [data-foto]
    [data-lista-texto="objetivos|valores|propositoIEEECS"] > template   [data-campo="titulo|texto"] o el nodo entero
    [data-si-borrador]                     visible solo mientras identidadBorrador sea true

  Organigrama
    [data-organigrama] > template          filas [data-nivel="1|2|3|asesoria|coordinaciones"]

  Colecciones (eventos, noticias, proyectos, galeria, integrantes)
    [data-coleccion="eventos"]             con data-filtro="proximos|pasados", data-limite="3", data-ocultar-si-vacio
      [data-lista] > template              una copia por elemento
      [data-vacio]                         se muestra si no hay ninguno
      [data-filtros]                       botones por tipo (o álbum) cuando hay dos o más
    Dentro de la plantilla:
      [data-campo="x"]  [data-fecha="x"]  [data-dia="x"]  [data-mes="x"]  [data-hora]
      [data-imagen="x"] (quita su [data-media] si no hay imagen)   [data-enlace="x"]   [data-pub="instagram|facebook"]
      [data-iniciales]  [data-si-ejemplo]  [data-opcional] (se quita si su campo está vacío)
      [data-accion="calendario|google|compartir|ampliar"]

  Formularios
    form[data-mensaje]                     arma un mensaje para unirse; lo envía por correo o lo copia y abre Instagram
  Visor de imágenes
    dialog[data-visor]                     [data-visor-img], [data-visor-pie], [data-visor-cerrar|anterior|siguiente]

  Revisión de diseño: ?ejemplos carga contenido/ejemplos.js (nunca se publica) y marca cada tarjeta como "Ejemplo".
  Las rutas de imágenes se resuelven con <html data-assets="...">. Al terminar se emite el evento itver:contenido.
*/
(() => {
  const D = window.ITVER || {};
  const assets = document.documentElement.dataset.assets || 'assets/';
  const safeUrl = (u) => (typeof u === 'string' && /^(https?:|mailto:)/i.test(u) ? u : null);
  const asset = (p) => (typeof p === 'string' && p && !/^[a-z]+:/i.test(p) ? assets + p.replace(/^\/+/, '') : null);
  const arr = (v) => (Array.isArray(v) ? v : []);
  const PENDIENTE = 'Pendiente';
  const TZ = 'America/Mexico_City';
  const params = new URLSearchParams(location.search);
  const here = document.currentScript && document.currentScript.src;

  /* ---------- small helpers ---------- */
  const pad = (n) => String(n).padStart(2, '0');
  const parse = (s) => {
    if (typeof s !== 'string') return null;
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/);
    if (!m) return null;
    return { y: +m[1], mo: +m[2], d: +m[3], h: m[4] != null ? +m[4] : null, mi: m[5] != null ? +m[5] : 0, allDay: m[4] == null };
  };
  const toDate = (p) => (p ? new Date(p.y, p.mo - 1, p.d, p.h ?? 12, p.mi) : null);
  const fmtLong = (s) => { const d = toDate(parse(s)); return d ? d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) : s; };
  const fmtDay = (s) => { const d = toDate(parse(s)); return d ? d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' }) : s; };
  const fmtMonth = (s) => { const d = toDate(parse(s)); return d ? d.toLocaleDateString('es-MX', { month: 'short' }).replace('.', '') : ''; };
  const hm = (p) => `${pad(p.h)}:${pad(p.mi)}`;
  const slug = (s) => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
  const iniciales = (n) => String(n || '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '·';

  // event start / end, with a two-hour default
  const span = (e) => {
    const a = parse(e.inicio);
    if (!a) return null;
    let b = parse(e.fin);
    if (!b) {
      if (a.allDay) b = { ...a };
      else { const t = new Date(a.y, a.mo - 1, a.d, a.h + 2, a.mi); b = { y: t.getFullYear(), mo: t.getMonth() + 1, d: t.getDate(), h: t.getHours(), mi: t.getMinutes(), allDay: false }; }
    }
    return { a, b };
  };
  const endsAt = (e) => { const s = span(e); if (!s) return 0; const { b } = s; return new Date(b.y, b.mo - 1, b.d, b.allDay ? 23 : b.h, b.allDay ? 59 : b.mi).getTime(); };

  /* ---------- a quiet status message (shared toast) ---------- */
  let toast;
  const avisar = (msg) => {
    if (!toast) {
      toast = document.createElement('p');
      toast.className = 'aviso';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(avisar.t);
    avisar.t = setTimeout(() => toast.classList.remove('is-on'), 2600);
  };
  const copiar = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; } catch {
      const t = document.createElement('textarea');
      t.value = text; t.setAttribute('readonly', ''); t.style.position = 'absolute'; t.style.left = '-9999px';
      document.body.append(t); t.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch {}
      t.remove(); return ok;
    }
  };

  /* ---------- calendar files ---------- */
  const icsText = (s) => String(s || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
  const stamp = (p) => `${p.y}${pad(p.mo)}${pad(p.d)}` + (p.allDay ? '' : `T${pad(p.h)}${pad(p.mi)}00`);
  const nextDay = (p) => { const t = new Date(p.y, p.mo - 1, p.d + 1); return { y: t.getFullYear(), mo: t.getMonth() + 1, d: t.getDate(), allDay: true }; };
  const eventUrl = (id) => new URL('eventos.html#' + id, location.href.split('#')[0].split('?')[0]).href;
  const ics = (e, id) => {
    const { a, b } = span(e);
    const now = new Date();
    const dtstamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}00Z`;
    const when = a.allDay
      ? [`DTSTART;VALUE=DATE:${stamp(a)}`, `DTEND;VALUE=DATE:${stamp(nextDay(b))}`]
      : [`DTSTART;TZID=${TZ}:${stamp(a)}`, `DTEND;TZID=${TZ}:${stamp(b)}`];
    return [
      'BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//${D.nombre || 'IEEE CS'}//Eventos//ES`, 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VTIMEZONE', `TZID:${TZ}`, 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:-0600', 'TZOFFSETTO:-0600', 'TZNAME:CST', 'END:STANDARD', 'END:VTIMEZONE',
      'BEGIN:VEVENT', `UID:${id}@computersociety.itver`, `DTSTAMP:${dtstamp}`, ...when,
      `SUMMARY:${icsText(e.titulo)}`, `LOCATION:${icsText(e.lugar)}`, `DESCRIPTION:${icsText(e.descripcion)}`,
      ...(location.protocol.startsWith('http') ? [`URL:${eventUrl(id)}`] : []),
      'END:VEVENT', 'END:VCALENDAR', '',
    ].join('\r\n');
  };
  const googleUrl = (e) => {
    const { a, b } = span(e);
    const dates = a.allDay ? `${stamp(a)}/${stamp(nextDay(b))}` : `${stamp(a)}/${stamp(b)}`;
    const q = new URLSearchParams({ action: 'TEMPLATE', text: e.titulo, dates, ctz: TZ, details: e.descripcion || '', location: e.lugar || '' });
    return 'https://calendar.google.com/calendar/render?' + q.toString();
  };

  /* ---------- plain data ---------- */
  const aplicarDatos = () => {
    document.querySelectorAll('[data-dato]').forEach((el) => {
      const v = D[el.dataset.dato];
      if (v != null && typeof v !== 'object') el.textContent = String(v);
    });

    document.querySelectorAll('[data-si-borrador]').forEach((el) => { if (D.identidadBorrador === false) el.remove(); });

    document.querySelectorAll('a[data-red]').forEach((a) => {
      const red = D.redes && D.redes[a.dataset.red];
      const url = red && safeUrl(red.url);
      if (!url) { a.hidden = true; return; }
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
      const u = a.querySelector('[data-red-usuario]');
      if (u && red.usuario) u.textContent = red.usuario;
    });

    const ig = D.redes && D.redes.instagram && safeUrl(D.redes.instagram.url);
    document.querySelectorAll('[data-correo]').forEach((el) => {
      if (D.correo) {
        if (el.tagName === 'A') el.href = 'mailto:' + D.correo;
        const t = el.querySelector('[data-correo-texto]') || (el.tagName !== 'A' ? el : null);
        if (t) t.textContent = D.correo;
      } else if (el.tagName === 'A' && ig) {
        el.href = ig; el.target = '_blank'; el.rel = 'noopener';
        if (el.dataset.correoSin) { const t = el.querySelector('[data-correo-texto]') || el; t.textContent = el.dataset.correoSin; }
      } else if (el.hasAttribute('data-correo-ocultar')) {
        el.hidden = true;
      }
    });
    document.documentElement.classList.toggle('sin-correo', !D.correo);

    // text lists (objectives, values, IEEE CS purpose)
    document.querySelectorAll('[data-lista-texto]').forEach((list) => {
      const tpl = list.querySelector('template');
      const items = arr(D[list.dataset.listaTexto]);
      if (!tpl || !items.length) return;
      [...list.children].forEach((c) => { if (c !== tpl) c.remove(); });
      items.forEach((it, i) => {
        const node = tpl.content.firstElementChild.cloneNode(true);
        const n = node.querySelector('[data-n]');
        if (n) n.textContent = pad(i + 1);
        if (typeof it === 'string') { (node.querySelector('[data-campo="texto"]') || node).textContent = it; node.querySelector('[data-campo="titulo"]')?.remove(); }
        else node.querySelectorAll('[data-campo]').forEach((el) => { el.textContent = it[el.dataset.campo] || ''; });
        list.appendChild(node);
      });
    });
  };

  /* ---------- people: board list, org chart ---------- */
  const persona = (tpl, m) => {
    const node = tpl.content.firstElementChild.cloneNode(true);
    const rol = node.querySelector('[data-rol]');
    const nom = node.querySelector('[data-nombre]');
    const img = node.querySelector('[data-foto]');
    const ini = node.querySelector('[data-iniciales]');
    if (rol) rol.textContent = m.rol || m.area || '';
    if (nom) { nom.textContent = m.nombre || PENDIENTE; if (!m.nombre) nom.setAttribute('data-provisional', ''); }
    const src = asset(m.foto);
    if (img) { if (src) { img.src = src; img.alt = m.nombre ? `${m.nombre}, ${m.rol || m.area || ''}` : (m.rol || ''); } else img.remove(); }
    if (ini) { if (src) ini.remove(); else ini.textContent = m.nombre ? iniciales(m.nombre) : '?'; }
    if (!m.nombre) node.classList.add('is-pendiente');
    return node;
  };
  const aplicarPersonas = () => {
    document.querySelectorAll('[data-mesa]').forEach((list) => {
      const tpl = list.querySelector('template');
      if (!tpl || !Array.isArray(D.mesa)) return;
      [...list.children].forEach((c) => { if (c !== tpl) c.remove(); });
      D.mesa.forEach((m) => list.appendChild(persona(tpl, m)));
    });
    document.querySelectorAll('[data-organigrama]').forEach((org) => {
      const tpl = org.querySelector(':scope > template');
      if (!tpl) return;
      org.querySelectorAll('[data-nivel]').forEach((r) => { r.textContent = ''; }); // drop the static fallback
      const row = (k) => org.querySelector(`[data-nivel="${k}"]`);
      arr(D.mesa).forEach((m) => { const r = row(m.nivel || 3) || row(3); if (r) r.appendChild(persona(tpl, m)); });
      const as = row('asesoria');
      if (as) { if (D.asesoria) as.appendChild(persona(tpl, D.asesoria)); else as.closest('[data-rama]')?.remove(); }
      const co = row('coordinaciones');
      if (co) { const list = arr(D.coordinaciones); if (list.length) list.forEach((m) => co.appendChild(persona(tpl, m))); else co.closest('[data-rama]')?.remove(); }
    });
  };

  /* ---------- collections ---------- */
  const valid = {
    eventos: (e) => e && e.titulo && e.tipo && parse(e.inicio) && e.lugar && e.descripcion,
    noticias: (n) => n && n.titulo && parse(n.fecha) && n.resumen,
    proyectos: (p) => p && p.titulo && parse(p.fecha) && p.tipo && p.descripcion,
    galeria: (g) => g && g.imagen && g.alt && g.album && parse(g.fecha),
    integrantes: (m) => m && m.nombre,
  };
  const fuentes = (ej) => ({
    eventos: ej ? ej.eventos : window.ITVER_EVENTOS,
    noticias: ej ? ej.noticias : window.ITVER_NOTICIAS,
    proyectos: ej ? ej.proyectos : window.ITVER_PROYECTOS,
    galeria: ej ? ej.galeria : window.ITVER_GALERIA,
    integrantes: ej ? ej.integrantes : D.integrantes,
  });

  const llenar = (node, it, tipo, ejemplo) => {
    node.querySelectorAll('[data-campo]').forEach((el) => {
      const v = it[el.dataset.campo];
      if (v) el.textContent = String(v); else if (el.hasAttribute('data-opcional')) el.remove(); else el.textContent = '';
    });
    node.querySelectorAll('[data-fecha]').forEach((el) => {
      const k = el.dataset.fecha; const v = it[k];
      if (!v) { el.remove(); return; }
      el.textContent = tipo === 'eventos' ? fmtDay(v) : fmtLong(v);
      if (el.tagName === 'TIME') el.dateTime = v;
    });
    node.querySelectorAll('[data-dia]').forEach((el) => { const p = parse(it[el.dataset.dia]); el.textContent = p ? String(p.d) : ''; });
    node.querySelectorAll('[data-mes]').forEach((el) => { el.textContent = fmtMonth(it[el.dataset.mes]); });
    node.querySelectorAll('[data-hora]').forEach((el) => {
      const s = span(it);
      if (!s || s.a.allDay) { el.textContent = 'Todo el día'; return; }
      el.textContent = `${hm(s.a)} – ${hm(s.b)} h`;
    });
    node.querySelectorAll('[data-imagen]').forEach((img) => {
      const src = asset(it[img.dataset.imagen]);
      if (src) { img.src = src; img.alt = it.alt || it.titulo || ''; }
      else (img.closest('[data-media]') || img).remove();
    });
    node.querySelectorAll('[data-enlace]').forEach((a) => {
      const url = safeUrl(it[a.dataset.enlace]);
      if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; } else a.remove();
    });
    node.querySelectorAll('[data-pub]').forEach((a) => {
      const url = safeUrl(it.publicacion && it.publicacion[a.dataset.pub]);
      if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; } else a.remove();
    });
    node.querySelectorAll('[data-iniciales]').forEach((el) => {
      if (asset(it.foto)) el.remove(); else el.textContent = iniciales(it.nombre);
    });
    node.querySelectorAll('[data-foto]').forEach((img) => {
      const src = asset(it.foto);
      if (src) { img.src = src; img.alt = it.nombre || ''; } else img.remove();
    });
    node.querySelectorAll('[data-si-ejemplo]').forEach((el) => { if (!ejemplo) el.remove(); });
    node.querySelectorAll('[data-si-video]').forEach((el) => { if (!safeUrl(it.video)) el.remove(); });
    if (ejemplo) node.setAttribute('data-ejemplo', '');
  };

  const aplicarColecciones = (ej) => {
    const src = fuentes(ej);
    document.querySelectorAll('[data-coleccion]').forEach((wrap) => {
      const tipo = wrap.dataset.coleccion;
      const list = wrap.querySelector('[data-lista]') || wrap;
      const tpl = list.querySelector('template');
      const empty = wrap.querySelector('[data-vacio]');
      let items = arr(src[tipo]).filter(valid[tipo] || Boolean);

      if (tipo === 'eventos') {
        const now = Date.now();
        const f = wrap.dataset.filtro;
        if (f === 'proximos') items = items.filter((e) => endsAt(e) >= now).sort((a, b) => endsAt(a) - endsAt(b));
        else if (f === 'pasados') items = items.filter((e) => endsAt(e) < now).sort((a, b) => endsAt(b) - endsAt(a));
        else items.sort((a, b) => endsAt(a) - endsAt(b));
      } else if (tipo !== 'integrantes') {
        items.sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
      }
      const limit = parseInt(wrap.dataset.limite, 10);
      const total = items.length;
      if (limit > 0) items = items.slice(0, limit);

      wrap.dataset.total = String(total);
      if (empty) empty.hidden = total > 0;
      if (wrap.hasAttribute('data-ocultar-si-vacio')) wrap.hidden = total === 0;
      wrap.querySelectorAll('[data-si-mas]').forEach((el) => { el.hidden = !(limit > 0 && total > limit); });
      wrap.querySelectorAll('[data-total]').forEach((el) => { if (el !== wrap) el.textContent = String(total); });
      if (!tpl || !items.length) return;

      items.forEach((it, i) => {
        const node = tpl.content.firstElementChild.cloneNode(true);
        const id = (tipo === 'eventos' ? 'evento-' : tipo + '-') + slug(it.titulo || it.nombre || it.alt || i) + (it.inicio || it.fecha ? '-' + String(it.inicio || it.fecha).slice(0, 10) : '');
        if (tipo === 'eventos' || tipo === 'noticias' || tipo === 'proyectos') node.id = id;
        const grupo = tipo === 'galeria' ? it.album : (it.tipo || it.area);
        if (grupo) node.dataset.grupo = grupo;
        node.style.setProperty('--n', String(i));
        llenar(node, it, tipo, !!ej);
        node.querySelectorAll('[data-accion]').forEach((b) => { b._item = it; b._id = id; });
        list.appendChild(node);
      });

      // filters by type (or album)
      const bar = wrap.querySelector('[data-filtros]');
      const grupos = [...new Set(items.map((it) => (tipo === 'galeria' ? it.album : it.tipo)).filter(Boolean))];
      if (bar && grupos.length > 1) {
        const make = (label, value) => {
          const b = document.createElement('button');
          b.type = 'button'; b.textContent = label;
          b.setAttribute('aria-pressed', value === '' ? 'true' : 'false');
          b.addEventListener('click', () => {
            bar.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
            [...list.children].forEach((c) => { if (c.tagName !== 'TEMPLATE') c.classList.toggle('is-oculto', value !== '' && c.dataset.grupo !== value); });
          });
          return b;
        };
        bar.textContent = '';
        bar.append(make('Todos', ''), ...grupos.map((g) => make(g, g)));
        bar.hidden = false;
      }
    });
  };

  /* ---------- actions on cards ---------- */
  document.addEventListener('click', async (ev) => {
    const b = ev.target.closest('[data-accion]');
    if (!b || !b._item) return;
    const it = b._item, id = b._id, accion = b.dataset.accion;
    if (accion === 'calendario') {
      ev.preventDefault();
      const blob = new Blob([ics(it, id)], { type: 'text/calendar;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = slug(it.titulo) + '.ics';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      avisar('Archivo de calendario descargado. Ábrelo para guardar el evento.');
    } else if (accion === 'google') {
      ev.preventDefault();
      window.open(googleUrl(it), '_blank', 'noopener');
    } else if (accion === 'compartir') {
      ev.preventDefault();
      const url = it.inicio ? eventUrl(id) : location.href.split('#')[0].split('?')[0] + '#' + id;
      const text = it.inicio ? `${it.titulo} · ${fmtDay(it.inicio)} · ${it.lugar}` : (it.resumen || it.descripcion || it.titulo);
      if (navigator.share && (!navigator.canShare || navigator.canShare({ url }))) {
        try { await navigator.share({ title: it.titulo, text, url }); return; } catch (err) { if (err && err.name === 'AbortError') return; }
      }
      {
        avisar((await copiar(`${text}\n${url}`)) ? 'Enlace copiado. Pégalo donde quieras compartirlo.' : 'Copia el enlace de la barra de direcciones.');
      }
    }
  });

  /* ---------- image viewer (gallery) ---------- */
  const visor = () => {
    const dlg = document.querySelector('dialog[data-visor]');
    if (!dlg || typeof dlg.showModal !== 'function') return;
    const img = dlg.querySelector('[data-visor-img]');
    const pie = dlg.querySelector('[data-visor-pie]');
    const cuenta = dlg.querySelector('[data-visor-cuenta]');
    const video = dlg.querySelector('[data-visor-video]');
    let list = [], i = 0, opener = null;
    const show = () => {
      const b = list[i], it = b._item;
      img.src = asset(it.imagen); img.alt = it.alt;
      if (pie) pie.textContent = `${it.album} · ${fmtLong(it.fecha)}`;
      if (cuenta) cuenta.textContent = `${i + 1} de ${list.length}`;
      if (video) { const u = safeUrl(it.video); video.hidden = !u; if (u) { video.href = u; video.target = '_blank'; video.rel = 'noopener'; } }
    };
    document.addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-accion="ampliar"]');
      if (!b || !b._item) return;
      ev.preventDefault();
      opener = b;
      list = [...document.querySelectorAll('[data-accion="ampliar"]')].filter((x) => x._item && !x.closest('.is-oculto'));
      i = Math.max(0, list.indexOf(b));
      show();
      dlg.showModal();
    });
    const step = (d) => { if (list.length) { i = (i + d + list.length) % list.length; show(); } };
    dlg.querySelector('[data-visor-anterior]')?.addEventListener('click', () => step(-1));
    dlg.querySelector('[data-visor-siguiente]')?.addEventListener('click', () => step(1));
    dlg.querySelector('[data-visor-cerrar]')?.addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', (ev) => { if (ev.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', (ev) => { if (ev.key === 'ArrowRight') step(1); if (ev.key === 'ArrowLeft') step(-1); });
    dlg.addEventListener('close', () => { opener?.focus(); });
  };

  /* ---------- join message form ---------- */
  const mensaje = () => {
    document.querySelectorAll('form[data-mensaje]').forEach((form) => {
      const vista = form.querySelector('[data-mensaje-vista]') || document.querySelector('[data-mensaje-vista]');
      const accion = form.querySelector('[data-mensaje-accion]');
      const nombre = form.elements.nombre;
      const error = form.querySelector('[data-error="nombre"]');
      const usuario = ((D.redes && D.redes.instagram && D.redes.instagram.usuario) || '').replace(/^@/, '');
      if (accion) accion.textContent = D.correo ? 'Enviar por correo' : 'Copiar y abrir Instagram';
      form.querySelectorAll('[data-si-correo]').forEach((el) => { el.hidden = !D.correo; });
      form.querySelectorAll('[data-sin-correo]').forEach((el) => { el.hidden = !!D.correo; });
      const texto = () => {
        const n = (nombre?.value || '').trim();
        const carrera = (form.elements.carrera?.value || '').trim();
        const semestre = form.elements.semestre?.value || '';
        const areas = [...form.querySelectorAll('input[name="areas"]:checked')].map((x) => x.value);
        let t = `Hola, soy ${n || '[tu nombre]'}`;
        if (carrera && semestre) t += `, estudio ${carrera} y voy en ${semestre} semestre`;
        else if (carrera) t += `, estudio ${carrera}`;
        else if (semestre) t += ` y voy en ${semestre} semestre`;
        t += '. Quiero participar en el capítulo';
        if (areas.length) t += `; me interesa${areas.length > 1 ? 'n' : ''} ${areas.length > 1 ? areas.slice(0, -1).join(', ') + ' y ' + areas.slice(-1) : areas[0]}`;
        return t + '.';
      };
      const update = () => { if (vista) vista.textContent = texto(); };
      const setError = (on) => {
        if (!nombre) return;
        nombre.setAttribute('aria-invalid', String(on));
        nombre.closest('[data-campo-form]')?.classList.toggle('is-error', on);
        if (error) error.hidden = !on;
      };
      form.addEventListener('input', (e) => { update(); if (e.target === nombre && nombre.value.trim()) setError(false); });
      form.addEventListener('change', update);
      update();
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (nombre && !nombre.value.trim()) { setError(true); nombre.focus(); return; }
        const t = texto();
        if (D.correo) {
          window.location.href = `mailto:${D.correo}?subject=${encodeURIComponent('Quiero participar en ' + (D.nombre || 'el capítulo'))}&body=${encodeURIComponent(t)}`;
          return;
        }
        const ok = await copiar(t);
        avisar(ok ? 'Mensaje copiado. Pégalo en el chat de Instagram que se abrió.' : 'No se pudo copiar; escribe el mensaje en el chat.');
        if (usuario) window.open(`https://ig.me/m/${encodeURIComponent(usuario)}`, '_blank', 'noopener');
      });
    });
  };

  /* ---------- run ---------- */
  const run = (ej) => {
    aplicarDatos();
    aplicarPersonas();
    aplicarColecciones(ej);
    visor();
    mensaje();
    document.documentElement.classList.add('contenido-listo');
    document.dispatchEvent(new CustomEvent('itver:contenido'));
  };

  if (params.has('ejemplos') && !window.ITVER_EJEMPLOS && here) {
    const s = document.createElement('script');
    s.src = here.replace(/aplicar\.js(\?.*)?$/, 'ejemplos.js');
    s.onload = () => run(window.ITVER_EJEMPLOS);
    s.onerror = () => run(null);
    document.head.appendChild(s);
  } else {
    run(params.has('ejemplos') ? window.ITVER_EJEMPLOS : null);
  }
})();
