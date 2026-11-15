/*
  Aplica los datos de contenido/capitulo.js y contenido/proyectos.js a cualquier landing.
  Cada landing decide su propio marcado; este archivo solo rellena:
    [data-dato="nombre|fundacion"]       texto
    a[data-red="instagram|facebook"]     href (y [data-red-usuario] dentro, con el usuario)
    [data-correo]                        enlace o texto del correo; sin correo, lleva a Instagram
    [data-mesa] > template               una copia por integrante: [data-rol], [data-nombre], [data-foto]
    [data-proyectos] > template          una copia por proyecto; [data-proyectos-vacio] si no hay ninguno
  Las rutas de imágenes se resuelven con <html data-assets="...">.
*/
(() => {
  const D = window.ITVER || {};
  const P = Array.isArray(window.ITVER_PROYECTOS) ? window.ITVER_PROYECTOS : [];
  const assets = document.documentElement.dataset.assets || 'assets/';
  const safeUrl = (u) => (typeof u === 'string' && /^(https?:|mailto:)/i.test(u) ? u : null);
  const asset = (p) => (typeof p === 'string' && !/^[a-z]+:/i.test(p) ? assets + p.replace(/^\/+/, '') : null);
  const PENDIENTE = 'Pendiente';

  // texts
  document.querySelectorAll('[data-dato]').forEach((el) => {
    const v = D[el.dataset.dato];
    if (v != null) el.textContent = String(v);
  });

  // social links
  document.querySelectorAll('a[data-red]').forEach((a) => {
    const red = D.redes && D.redes[a.dataset.red];
    const url = red && safeUrl(red.url);
    if (!url) { a.hidden = true; return; }
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    const u = a.querySelector('[data-red-usuario]');
    if (u && red.usuario) u.textContent = red.usuario;
  });

  // email (pending: fall back to Instagram)
  const ig = D.redes && D.redes.instagram && safeUrl(D.redes.instagram.url);
  document.querySelectorAll('[data-correo]').forEach((el) => {
    if (D.correo) {
      if (el.tagName === 'A') el.href = 'mailto:' + D.correo;
      const t = el.querySelector('[data-correo-texto]') || (el.tagName !== 'A' ? el : null);
      if (t) t.textContent = D.correo;
    } else if (el.tagName === 'A' && ig) {
      el.href = ig; el.target = '_blank'; el.rel = 'noopener';
      if (el.dataset.correoSin) {
        const t = el.querySelector('[data-correo-texto]') || el;
        t.textContent = el.dataset.correoSin;
      }
    } else if (el.hasAttribute('data-correo-ocultar')) {
      el.hidden = true;
    }
  });
  document.documentElement.classList.toggle('sin-correo', !D.correo);

  // board
  document.querySelectorAll('[data-mesa]').forEach((list) => {
    const tpl = list.querySelector('template');
    if (!tpl || !Array.isArray(D.mesa)) return;
    [...list.children].forEach((c) => { if (c !== tpl) c.remove(); });
    D.mesa.forEach((m) => {
      const node = tpl.content.firstElementChild.cloneNode(true);
      const rol = node.querySelector('[data-rol]');
      const nom = node.querySelector('[data-nombre]');
      const img = node.querySelector('[data-foto]');
      if (rol) rol.textContent = m.rol;
      if (nom) {
        nom.textContent = m.nombre || PENDIENTE;
        if (!m.nombre) nom.setAttribute('data-provisional', '');
      }
      if (img) {
        const src = asset(m.foto);
        if (src) { img.src = src; img.alt = m.nombre ? `${m.nombre}, ${m.rol}` : m.rol; }
        else img.remove();
      }
      if (!m.nombre) node.classList.add('is-pendiente');
      list.appendChild(node);
    });
  });

  // projects
  document.querySelectorAll('[data-proyectos]').forEach((wrap) => {
    const list = wrap.querySelector('[data-proyectos-lista]') || wrap;
    const tpl = wrap.querySelector('template');
    const empty = wrap.querySelector('[data-proyectos-vacio]');
    const items = P.filter((p) => p && p.titulo && p.fecha && p.tipo && p.descripcion)
      .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
    if (empty) empty.hidden = items.length > 0;
    if (!tpl || !items.length) { wrap.dataset.total = '0'; return; }
    const fmt = (iso) => {
      const d = new Date(iso + 'T12:00:00');
      return isNaN(d) ? iso : d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
    };
    items.forEach((p) => {
      const node = tpl.content.firstElementChild.cloneNode(true);
      node.dataset.tipo = p.tipo;
      const set = (sel, v) => { const el = node.querySelector(sel); if (el) el.textContent = v; };
      set('[data-p-titulo]', p.titulo);
      set('[data-p-tipo]', p.tipo);
      set('[data-p-descripcion]', p.descripcion);
      const f = node.querySelector('[data-p-fecha]');
      if (f) { f.textContent = fmt(p.fecha); if (f.tagName === 'TIME') f.dateTime = p.fecha; }
      const img = node.querySelector('[data-p-imagen]');
      const src = asset(p.imagen);
      if (img) {
        if (src) { img.src = src; img.alt = p.titulo; }
        else (img.closest('[data-p-media]') || img).remove();
      }
      const link = node.querySelector('[data-p-enlace]');
      const url = safeUrl(p.enlace);
      if (link) { if (url) { link.href = url; link.target = '_blank'; link.rel = 'noopener'; } else link.remove(); }
      list.appendChild(node);
    });
    wrap.dataset.total = String(items.length);
    wrap.dataset.tipos = [...new Set(items.map((p) => p.tipo))].join('|');
  });

  document.dispatchEvent(new CustomEvent('itver:contenido'));
})();
