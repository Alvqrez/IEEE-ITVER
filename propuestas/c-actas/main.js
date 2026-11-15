/* Concepto C · Actas — menu, slow crossfade, call-for-members steps, sign as co-author (live thing). */
(() => {
  /* contacto: correo de contenido/capitulo.js; si está pendiente, Instagram */
  const irAContacto = (subject, body) => {
    const D = window.ITVER || {};
    if (D.correo) window.location.href = `mailto:${D.correo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    else if (D.redes && D.redes.instagram) window.open(D.redes.instagram.url, '_blank', 'noopener');
  };
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (new URLSearchParams(location.search).has('provisional')) document.documentElement.classList.add('show-provisional');

  /* footer name fitted to the content box by measurement */
  const fitName = () => {
    const el = document.querySelector('.foot-name');
    if (!el) return;
    el.style.fontSize = '';
    const cs = getComputedStyle(el);
    const box = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const probe = document.createElement('span');
    probe.textContent = el.textContent;
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font:inherit;letter-spacing:inherit';
    el.appendChild(probe);
    const w = probe.getBoundingClientRect().width;
    probe.remove();
    if (w > 0) el.style.fontSize = (parseFloat(cs.fontSize) * box / w * 0.995) + 'px';
  };
  if (document.fonts?.ready) document.fonts.ready.then(fitName); else fitName();
  window.addEventListener('resize', fitName);

  /* phone menu */
  const menuBtn = document.querySelector('.menu-btn');
  const menu = document.getElementById('menu');
  const word = menuBtn?.querySelector('.menu-word');
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    if (word) word.textContent = open ? 'Cerrar' : 'Menú';
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { requestAnimationFrame(() => menu.classList.add('is-open')); menu.querySelector('a')?.focus(); }
    else menu.classList.remove('is-open');
  };
  menuBtn?.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  menu?.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuBtn?.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); } });

  /* slow crossfade: the campus today and the ENIAC in 1946 */
  const fade = document.querySelector('[data-fade]');
  if (fade && !reduce) {
    let timer = null;
    const start = () => { if (!timer) timer = setInterval(() => fade.classList.toggle('is-alt'), 5600); };
    const stop = () => { clearInterval(timer); timer = null; };
    start();
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  }

  /* reveals */
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  const seen = new Map();
  reveals.forEach((el) => { const host = el.closest('section, article') || document.body; const n = seen.get(host) || 0; el.style.setProperty('--i', Math.min(n, 4)); seen.set(host, n + 1); });
  if (!('IntersectionObserver' in window) || reduce) reveals.forEach((el) => el.classList.add('is-in'));
  else {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });
    reveals.forEach((el) => io.observe(el));
  }

  /* call for members: one step open at a time */
  const steps = [...document.querySelectorAll('[data-steps] .step')];
  const openStep = (step) => steps.forEach((s) => {
    const on = s === step;
    s.classList.toggle('is-open', on);
    s.querySelector('h3 button').setAttribute('aria-expanded', String(on));
    s.querySelector('.step-body').hidden = !on;
  });
  steps.forEach((s, i) => {
    const btn = s.querySelector('h3 button');
    s.querySelector('.step-body').hidden = !s.classList.contains('is-open');
    btn.addEventListener('click', () => openStep(s));
    btn.addEventListener('keydown', (e) => {
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      const next = steps[(i + d + steps.length) % steps.length];
      next.querySelector('h3 button').focus();
      openStep(next);
    });
  });

  /* sign as co-author: the name joins the author line, the citation and the letter */
  const author = document.getElementById('author-name');
  const letterName = document.getElementById('letter-name');
  const cite = document.getElementById('cite-line');
  const base = 'Capítulo Estudiantil IEEE CS ITVER';
  const sync = (value, from) => {
    const name = value.trim();
    if (from !== author && author) author.value = value;
    if (from !== letterName && letterName) letterName.value = value;
    if (author) author.size = Math.max(12, Math.min(28, value.length + 2));
    if (cite) cite.textContent = `${base}${name ? ' y ' + name : ''}, “IEEE Computer Society en el ITVER”, Veracruz, 2026.`;
  };
  author?.addEventListener('input', () => sync(author.value, author));
  letterName?.addEventListener('input', () => sync(letterName.value, letterName));

  /* today's date on the letter */
  const dateEl = document.getElementById('letter-date');
  if (dateEl) {
    const d = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
    dateEl.textContent = `Veracruz, Ver., a ${d}.`;
  }

  /* the letter composes an email: a real action, no backend */
  const letter = document.getElementById('letter');
  letter?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!letter.reportValidity()) return;
    const name = letterName.value.trim();
    const career = document.getElementById('letter-career').value.trim();
    const subject = 'Carta de intención: unirme al capítulo IEEE CS ITVER';
    const body = `${dateEl ? dateEl.textContent : ''}\n\nAl capítulo estudiantil de IEEE Computer Society del ITVER: yo, ${name}, estudiante de ${career || '[carrera]'}, solicito unirme al capítulo y recibir información de sus actividades.`;
    irAContacto(subject, body);
  });
})();
