/* Concepto A · Unos y ceros — menu, reveals, activity index, celosía (live thing). */
(() => {
  /* contacto: correo de contenido/capitulo.js; si está pendiente, Instagram */
  const irAContacto = (subject, body) => {
    const D = window.ITVER || {};
    if (D.correo) window.location.href = `mailto:${D.correo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    else if (D.redes && D.redes.instagram) window.open(D.redes.instagram.url, '_blank', 'noopener');
  };
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  /* Review mode: ?provisional outlines every provisional item. */

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

  if (new URLSearchParams(location.search).has('provisional')) root.classList.add('show-provisional');

  /* ---------- phone menu ---------- */
  const menuBtn = document.querySelector('.menu-btn');
  const menu = document.getElementById('menu');
  const word = menuBtn?.querySelector('.menu-word');
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    if (word) word.textContent = open ? 'Cerrar' : 'Menú';
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add('is-open'));
      document.body.style.overflow = 'hidden';
      menu.querySelector('a')?.focus();
    } else {
      menu.classList.remove('is-open');
      menu.hidden = true;
      document.body.style.overflow = '';
    }
  };
  menuBtn?.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  menu?.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuBtn?.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); }
  });

  /* ---------- reveals: once, staggered per section ---------- */
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  const groups = new Map();
  reveals.forEach((el) => {
    const host = el.closest('section, figure, .pair') || document.body;
    const n = groups.get(host) || 0;
    el.style.setProperty('--i', Math.min(n, 4));
    groups.set(host, n + 1);
  });
  if (!('IntersectionObserver' in window) || reduce) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- activities: big names with a sticky panel ---------- */
  const tabs = [...document.querySelectorAll('.act')];
  const panel = document.getElementById('act-panel');
  const pTitle = panel?.querySelector('.acts-panel-title');
  const pText = panel?.querySelector('.acts-panel-text');
  const pTake = panel?.querySelector('.acts-panel-take span');
  let active = 0;
  const activate = (i, focus = false) => {
    if (i === active || !panel) { if (focus) tabs[i].focus(); return; }
    tabs.forEach((t, k) => {
      const on = k === i;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    const t = tabs[i];
    const swap = () => {
      pTitle.textContent = t.querySelector('.act-name').textContent;
      pText.textContent = t.querySelector('.act-desc').textContent;
      pTake.textContent = t.dataset.take || '';
      panel.setAttribute('aria-labelledby', t.id);
      panel.classList.remove('is-swapping');
    };
    if (reduce) swap(); else { panel.classList.add('is-swapping'); setTimeout(swap, 180); }
    active = i;
    if (focus) t.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activate(i));
    t.addEventListener('mouseenter', () => { if (window.matchMedia('(hover: hover)').matches) activate(i); });
    t.addEventListener('keydown', (e) => {
      const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (e.key in keys) { e.preventDefault(); activate((i + keys[e.key] + tabs.length) % tabs.length, true); }
      if (e.key === 'Home') { e.preventDefault(); activate(0, true); }
      if (e.key === 'End') { e.preventDefault(); activate(tabs.length - 1, true); }
    });
  });

  /* ---------- celosía: the building's lattice as a 5×7 bitmap ---------- */
  const FONT = {
    A: '01110100011000111111100011000110001', B: '11110100011000111110100011000111110',
    C: '01110100011000010000100001000101110', D: '11100100101000110001100011001011100',
    E: '11111100001000011110100001000011111', F: '11111100001000011110100001000010000',
    G: '01110100011000010111100011000101111', H: '10001100011000111111100011000110001',
    I: '01110001000010000100001000010001110', J: '00111000100001000010000101001001100',
    K: '10001100101010011000101001001010001', L: '10000100001000010000100001000011111',
    M: '10001110111010110101100011000110001', N: '10001100011100110101100111000110001',
    'Ñ': '01101100101000111001101011001110001', O: '01110100011000110001100011000101110',
    P: '11110100011000111110100001000010000', Q: '01110100011000110001101011001001101',
    R: '11110100011000111110101001001010001', S: '01111100001000001110000010000111110',
    T: '11111001000010000100001000010000100', U: '10001100011000110001100011000101110',
    V: '10001100011000110001100010101000100', W: '10001100011000110101101011010101010',
    X: '10001100010101000100010101000110001', Y: '10001100011000101010001000010000100',
    Z: '11111000010001000100010001000011111',
    0: '01110100011001110101110011000101110', 1: '00100011000010000100001000010001110',
    2: '01110100010000100010001000100011111', 3: '11111000100010000010000011000101110',
    4: '00010001100101010010111110001000010', 5: '11111100001111000001000011000101110',
    6: '00110010001000011110100011000101110', 7: '11111000010001000100010000100001000',
    8: '01110100011000101110100011000101110', 9: '01110100011000101111000010001001100',
    '-': '00000000000000011111000000000000000', '.': '00000000000000000000000000110001100',
    ' ': '00000000000000000000000000000000000',
  };
  const svg = document.getElementById('lattice-svg');
  const input = document.getElementById('lattice-name');
  const form = document.getElementById('lattice-form');
  if (!svg || !input) return;

  const NS = 'http://www.w3.org/2000/svg';
  const CW = 10, CH = 8, GX = 6, GY = 6, BAR = 12; // hole size, gaps, blue beam
  const ROWS = 17; // two text lines of 7 rows, one blank row between, a margin row each side
  let cols = 0, perLine = 0, bits = [];

  const clean = (s) => s.toUpperCase().replace(/Ñ/g, '\u0000').normalize('NFD')
    .replace(/[̀-ͯ]/g, '').replace(/\u0000/g, 'Ñ').replace(/[^A-ZÑ0-9 .-]/g, '');

  const wrapLines = (text) => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const lines = [];
    let cur = '';
    for (let w of words) {
      while (w.length > perLine) { if (cur) { lines.push(cur); cur = ''; } lines.push(w.slice(0, perLine)); w = w.slice(perLine); }
      if (!cur) cur = w;
      else if ((cur + ' ' + w).length <= perLine) cur += ' ' + w;
      else { lines.push(cur); cur = w; }
    }
    if (cur) lines.push(cur);
    return lines.slice(0, 2);
  };

  const build = () => {
    perLine = svg.clientWidth < 560 ? 8 : 11;
    cols = perLine * 6 + 1;
    const w = cols * (CW + GX) + GX;
    const h = ROWS * (CH + GY) + GY + BAR * 2;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.textContent = '';
    const top = document.createElementNS(NS, 'rect');
    top.setAttribute('class', 'bar'); top.setAttribute('width', w); top.setAttribute('height', BAR);
    const bottom = top.cloneNode(); bottom.setAttribute('y', h - BAR);
    svg.append(top, bottom);
    const g = document.createElementNS(NS, 'g');
    bits = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < cols; c++) {
        const x = GX + c * (CW + GX), y = BAR + GY + r * (CH + GY);
        const hole = document.createElementNS(NS, 'rect');
        hole.setAttribute('class', 'hole'); hole.setAttribute('x', x); hole.setAttribute('y', y);
        hole.setAttribute('width', CW); hole.setAttribute('height', CH);
        const bit = hole.cloneNode();
        bit.setAttribute('class', 'bit');
        if (!reduce) bit.style.transitionDelay = `${c * 9}ms`;
        g.append(hole, bit);
        bits.push(bit);
      }
    }
    svg.append(g);
  };

  const render = () => {
    const raw = clean(input.value) || 'ITVER';
    const lines = wrapLines(raw);
    const on = new Set();
    const startRow = lines.length === 1 ? 5 : 1;
    lines.forEach((line, li) => {
      const width = line.length * 6 - 1;
      const startCol = Math.floor((cols - width) / 2);
      [...line].forEach((ch, ci) => {
        const glyph = FONT[ch] || FONT[' '];
        for (let gy = 0; gy < 7; gy++) for (let gx = 0; gx < 5; gx++) {
          if (glyph[gy * 5 + gx] === '1') on.add((startRow + li * 8 + gy) * cols + startCol + ci * 6 + gx);
        }
      });
    });
    bits.forEach((b, i) => b.classList.toggle('on', on.has(i)));
    svg.setAttribute('aria-label', `La palabra ${lines.join(' ')} formada con huecos encendidos de la celosía`);
  };

  build();
  render();
  input.addEventListener('input', render);
  let lastPer = perLine;
  window.addEventListener('resize', () => {
    const next = svg.clientWidth < 560 ? 8 : 11;
    if (next !== lastPer) { lastPer = next; build(); render(); }
  });

  /* The form composes an email: a real action, no backend needed. */
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = input.value.trim();
    const subject = 'Quiero unirme al capítulo IEEE CS ITVER';
    const body = `Hola, me llamo ${name || '[tu nombre]'}. Me gustaría unirme al capítulo estudiantil de IEEE Computer Society del ITVER y recibir información de las próximas actividades.`;
    irAContacto(subject, body);
  });
})();
