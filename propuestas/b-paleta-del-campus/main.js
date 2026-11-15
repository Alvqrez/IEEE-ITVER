/* Concepto B · La paleta del campus — menu, reveals, colour accordion (live thing), join form. */
(() => {
  /* contacto: correo de contenido/capitulo.js; si está pendiente, Instagram */
  const irAContacto = (subject, body) => {
    const D = window.ITVER || {};
    if (D.correo) window.location.href = `mailto:${D.correo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    else if (D.redes && D.redes.instagram) window.open(D.redes.instagram.url, '_blank', 'noopener');
  };
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  if (new URLSearchParams(location.search).has('provisional')) document.documentElement.classList.add('show-provisional');

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

  /* entrances: the staircase line by line, the join tiles growing, a few reveals */
  const targets = [...document.querySelectorAll('[data-stair], [data-grow], [data-reveal]')];
  if (!('IntersectionObserver' in window) || reduce) targets.forEach((t) => t.classList.add('is-in'));
  else {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
    targets.forEach((t) => io.observe(t));
  }

  /* the colour accordion: one area open at a time */
  const panels = [...document.querySelectorAll('[data-accordion] .panel')];
  const open = (panel) => {
    panels.forEach((p) => {
      const on = p === panel;
      p.classList.toggle('is-open', on);
      const btn = p.querySelector('h3 button');
      btn.setAttribute('aria-expanded', String(on));
      p.querySelector('.panel-body').hidden = !on;
    });
  };
  panels.forEach((p, i) => {
    const btn = p.querySelector('h3 button');
    p.querySelector('.panel-body').hidden = !p.classList.contains('is-open');
    btn.addEventListener('click', () => open(p));
    btn.addEventListener('keydown', (e) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      const next = panels[(i + step + panels.length) % panels.length];
      next.querySelector('h3 button').focus();
      open(next);
    });
  });

  /* join form: composes an email (no backend, nothing simulated) */
  const form = document.getElementById('join-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('nombre') || '').trim();
    const mail = String(data.get('correo') || '').trim();
    const subject = 'Solicitud para unirme al capítulo IEEE CS ITVER';
    const body = `Hola, me llamo ${name}. Mi correo es ${mail}. Me gustaría unirme al capítulo estudiantil de IEEE Computer Society del ITVER.`;
    irAContacto(subject, body);
  });
})();
