/* Propuesta D · Moderna — island nav, chapter badge (live thing), area wheel, pinned stepper, month calendar.
   Datos, filtros, calendario de eventos, compartir, visor y formulario de mensaje: contenido/aplicar.js. */
(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const ASSETS = root.dataset.assets || 'assets/';
  const DATA = window.ITVER || {};
  if (new URLSearchParams(location.search).has('provisional')) root.classList.add('show-provisional');

  /* ---------- island nav: dark over dark sections, light over light ones ---------- */
  const nav = document.querySelector('[data-nav]');
  const sections = [...document.querySelectorAll('main > section, footer')];
  if (nav && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) nav.classList.toggle('is-light', e.target.dataset.theme !== 'dark'); });
    }, { rootMargin: '-36px 0px -96% 0px' });
    sections.forEach((s) => io.observe(s));
  }

  /* ---------- phone menu ---------- */
  const menuBtn = document.querySelector('.nav-menu');
  const menu = document.getElementById('menu');
  const word = menuBtn?.querySelector('.nav-menu-word');
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

  /* ---------- copy the chapter email ---------- */
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      const done = btn.closest('[data-copy-wrap]')?.querySelector('.mail-done');
      let ok = false;
      try { await navigator.clipboard.writeText(text); ok = true; } catch {
        const t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', ''); t.style.position = 'absolute'; t.style.left = '-9999px';
        document.body.append(t); t.select(); try { ok = document.execCommand('copy'); } catch {} t.remove();
      }
      if (done) {
        done.textContent = ok ? 'Correo copiado' : 'Copia el correo manualmente';
        done.classList.add('is-on');
        setTimeout(() => done.classList.remove('is-on'), 2200);
      }
    });
  });

  /* ---------- reveals ---------- */
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  const seen = new Map();
  reveals.forEach((el) => { const host = el.parentElement; const n = seen.get(host) || 0; el.style.setProperty('--i', Math.min(n, 3)); seen.set(host, n + 1); });
  if (!('IntersectionObserver' in window) || reduce) reveals.forEach((el) => el.classList.add('is-in'));
  else {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- the chapter badge ---------- */
  const badge = document.querySelector('[data-badge]');
  const stage = document.querySelector('.badge-stage');
  const nameOut = document.querySelector('[data-badge-name]');
  const areaOut = document.querySelector('[data-badge-area]');
  const logo = badge?.querySelector('.badge-logo');
  const input = document.getElementById('badge-input');
  const radios = [...document.querySelectorAll('.area-tabs [role="radio"]')];

  // the ITVER lattice, engraved on the badge
  const g = badge?.querySelector('.badge-lattice g');
  if (g) {
    const NS = 'http://www.w3.org/2000/svg';
    const rect = (x, y, w, h) => { const r = document.createElementNS(NS, 'rect'); r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', w); r.setAttribute('height', h); return r; };
    g.append(rect(0, 0, 130, 4), rect(0, 54, 130, 4));
    for (let r = 0; r < 4; r++) for (let c = 0; c < 10; c++) g.append(rect(1.5 + c * 13, 7 + r * 11.5, 10, 8));
  }

  const setArea = (btn, focus = false) => {
    radios.forEach((b) => { const on = b === btn; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; });
    badge.style.setProperty('--c', btn.dataset.c);
    badge.style.setProperty('--ink', btn.dataset.ink);
    areaOut.textContent = btn.dataset.area;
    if (logo) logo.src = ASSETS + (btn.dataset.ink === '#ffffff' ? 'logos/ieee-cs-white.png' : 'logos/ieee-cs-black.png');
    if (focus) btn.focus();
  };
  radios.forEach((b, i) => {
    b.addEventListener('click', () => setArea(b));
    b.addEventListener('keydown', (e) => {
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      setArea(radios[(i + d + radios.length) % radios.length], true);
    });
  });
  input?.addEventListener('input', () => { nameOut.textContent = input.value.trim() || 'Tu nombre'; });

  // tilt and sheen follow the pointer (transform only, one frame at a time)
  if (badge && stage && finePointer && !reduce) {
    let frame = 0, px = 0.5, py = 0.5;
    const paint = () => {
      frame = 0;
      badge.style.setProperty('--ry', `${(px - 0.5) * 18}deg`);
      badge.style.setProperty('--rx', `${(0.5 - py) * 14}deg`);
      badge.style.setProperty('--mx', `${px * 100}%`);
      badge.style.setProperty('--my', `${py * 100}%`);
    };
    stage.addEventListener('pointermove', (e) => {
      const r = badge.getBoundingClientRect();
      px = clamp((e.clientX - r.left) / r.width, 0, 1);
      py = clamp((e.clientY - r.top) / r.height, 0, 1);
      badge.classList.add('is-tracking');
      if (!frame) frame = requestAnimationFrame(paint);
    });
    stage.addEventListener('pointerleave', () => {
      badge.classList.remove('is-tracking');
      px = 0.5; py = 0.5;
      badge.style.setProperty('--rx', '0deg'); badge.style.setProperty('--ry', '0deg');
    });
  }

  document.getElementById('badge-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = input.value.trim();
    const area = areaOut.textContent;
    if (DATA.correo) {
      const subject = `Quiero participar en ${DATA.nombre || 'el capítulo'}`;
      const body = `Hola, me llamo ${name || '[tu nombre]'} y me interesa el área de ${area}. Quiero participar en las actividades del capítulo.`;
      window.location.href = `mailto:${DATA.correo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else if (DATA.redes?.instagram?.url) {
      window.open(DATA.redes.instagram.url, '_blank', 'noopener');
    }
  });

  /* ---------- this month, with today marked (events empty state) ---------- */
  document.querySelectorAll('[data-mes-actual]').forEach((box) => {
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth(), today = now.getDate();
    const first = (new Date(y, m, 1).getDay() + 6) % 7; // Monday first
    const days = new Date(y, m + 1, 0).getDate();
    const title = now.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
    const bar = document.createElement('div');
    bar.className = 'frag-bar';
    bar.innerHTML = '<span></span><span>Sin eventos publicados</span>';
    bar.firstChild.textContent = title.charAt(0).toUpperCase() + title.slice(1);
    const grid = document.createElement('div');
    grid.className = 'cal-grid';
    ['L', 'M', 'M', 'J', 'V', 'S', 'D'].forEach((d) => { const s = document.createElement('span'); s.className = 'cal-wd'; s.textContent = d; grid.append(s); });
    for (let i = 0; i < first; i++) grid.append(document.createElement('span'));
    for (let d = 1; d <= days; d++) {
      const s = document.createElement('span');
      s.className = 'cal-d' + (d < today ? ' is-past' : '') + (d === today ? ' is-today' : '');
      s.textContent = String(d);
      grid.append(s);
    }
    box.replaceChildren(bar, grid);
  });

  /* ---------- scroll-driven stages (run only while on screen; no scroll listener) ---------- */
  const driven = [];
  const loop = () => {
    driven.forEach((d) => { if (d.on) d.update(); });
    if (driven.some((d) => d.on)) requestAnimationFrame(loop); else running = false;
  };
  let running = false;
  const watch = (el, update) => {
    const d = { on: false, update };
    driven.push(d);
    new IntersectionObserver(([e]) => {
      d.on = e.isIntersecting;
      if (d.on && !running) { running = true; requestAnimationFrame(loop); }
    }).observe(el);
    update();
  };
  const progressOf = (track) => {
    const r = track.getBoundingClientRect();
    const total = track.offsetHeight - window.innerHeight;
    return total > 0 ? clamp(-r.top / total, 0, 1) : 0;
  };

  /* the wheel of areas */
  const wheelSec = document.getElementById('areas');
  const track = document.querySelector('[data-wheel]');
  const items = [...document.querySelectorAll('[data-wheel-list] li')];
  const nOut = document.querySelector('[data-wheel-n]');
  const descOut = document.querySelector('[data-wheel-desc]');
  let lastActive = -1;
  const setActive = (i) => {
    if (i === lastActive) return;
    lastActive = i;
    items.forEach((li, k) => li.classList.toggle('is-active', k === i));
    if (nOut) nOut.textContent = String(i + 1);
    if (descOut) descOut.textContent = items[i].dataset.desc;
  };
  if (track && items.length) {
    if (reduce) {
      wheelSec.classList.add('wheel-static');
      setActive(0);
      items.forEach((li, i) => { li.tabIndex = 0; li.addEventListener('click', () => setActive(i)); li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(i); } }); });
    } else {
      const N = items.length, STEP = 21;
      let last = -1;
      watch(track, () => {
        const p = progressOf(track) * (N - 1);
        if (Math.abs(p - last) < 0.001) return;
        last = p;
        const R = Math.max(160, Math.min(window.innerHeight * 0.26, 260));
        items.forEach((li, i) => {
          const d = i - p;
          const a = d * STEP;
          const vis = Math.abs(a) < 88;
          li.style.transform = `translateZ(${-R}px) rotateX(${-a}deg) translateZ(${R}px)`;
          li.style.opacity = vis ? String(Math.abs(d) < 0.5 ? 1 : clamp(0.55 - Math.abs(d) * 0.11, 0.08, 0.5)) : '0';
        });
        setActive(clamp(Math.round(p), 0, N - 1));
      });
    }
  }

  /* the pinned stepper */
  const stepTrack = document.querySelector('[data-stepper]');
  const steps = [...document.querySelectorAll('[data-steps] li')];
  const checks = [...document.querySelectorAll('[data-check-list] li')];
  const checkN = document.querySelector('[data-check-n]');
  const checkBar = document.querySelector('[data-check-bar]');
  const checkNote = document.querySelector('[data-check-note]');
  const notes = [
    'Listo: te enteras de cada actividad en cuanto la publicamos.',
    'Primera actividad: un taller, una charla o un reto, sin experiencia previa.',
    'Ya estás en un equipo. Al final del semestre presentan su proyecto.',
    'Opcional: con la membresía de IEEE sumas la red internacional.',
  ];
  let stepNow = -1;
  const setStep = (i) => {
    if (i === stepNow) return;
    stepNow = i;
    steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
    checks.forEach((c, k) => c.classList.toggle('is-done', k <= i));
    if (checkN) checkN.textContent = String(i + 1);
    if (checkBar) checkBar.style.transform = `scaleX(${(i + 1) / steps.length})`;
    if (checkNote) checkNote.textContent = notes[i];
  };
  setStep(0);
  const pinned = () => stepTrack && stepTrack.offsetHeight > window.innerHeight * 1.5;
  steps.forEach((s, i) => s.querySelector('button').addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    setStep(i);
    if (pinned()) {
      const total = stepTrack.offsetHeight - window.innerHeight;
      const y = stepTrack.getBoundingClientRect().top + window.scrollY + total * ((i + 0.5) / steps.length);
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    }
  }));
  if (stepTrack && !reduce) watch(stepTrack, () => { if (pinned()) setStep(clamp(Math.floor(progressOf(stepTrack) * steps.length), 0, steps.length - 1)); });

  /* ---------- event tabs ---------- */
  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  const select = (t, focus = false) => {
    tabs.forEach((x) => {
      const on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) t.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      select(tabs[(i + d + tabs.length) % tabs.length], true);
    });
  });
})();
