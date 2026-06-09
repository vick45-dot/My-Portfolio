/* ===== SCROLL TO TOP ON REFRESH ===== */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('beforeunload', () => window.scrollTo(0, 0));

/* ===== MOBILE HAMBURGER MENU ===== */
(function () {
  const btn     = document.getElementById('navHamburger');
  const menu    = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileMenuOverlay');
  const close   = document.getElementById('mobileMenuClose');
  if (!btn || !menu) return;

  function openMenu() {
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', openMenu);
  close.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  // Close on nav link click
  menu.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ===== BACKGROUND CANVAS — MATRIX RAIN ===== */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  /* ── Config ── */
  const FS       = 15;   // font size / column width in px
  const CHARS    = '01アウエオカキ<>{}[]();=/*#@$?!:+-→←functionconstletvarreturnclassif';
  const KEYWORDS = ['const ','let ','var ','fn()','=> ','if(','{}','[]','();','=>{}','null','true','0x','!=','==','&&','||'];
  const ACCENT   = '#818cf8';
  const CYAN     = '#22d3ee';
  const HEAD_COL = '#e0e7ff';  // near-white head
  const STREAM_COLORS = [ACCENT, CYAN, '#a5b4fc', '#67e8f9', '#6366f1'];

  let W, H, cols;
  let streams  = [];
  let bgGrid   = [];
  let mouse    = { x: -1, y: -1 };
  let frame    = 0;

  /* ── Helpers ── */
  function randChar() {
    const pool = CHARS + KEYWORDS[frame % KEYWORDS.length];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /* ── Resize (DPR-aware for crisp mobile rendering) ── */
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);
    cols = Math.ceil(W / FS);
    buildStreams();
    buildBgGrid();
  }

  /* ── Build streams (one per column, staggered start) ── */
  function buildStreams() {
    const rows = Math.ceil(H / FS);
    const isMobile = W < 640;
    /* ~65% of columns on desktop, ~35% on mobile for performance */
    const threshold = isMobile ? 0.65 : 0.35;
    streams = [];
    for (let c = 0; c < cols; c++) {
      if (Math.random() > threshold) {
        streams.push(makeStream(c, rows, true));
      }
    }
  }

  function makeStream(col, rows, randomStart) {
    const len = Math.floor(Math.random() * 22 + 10);
    return {
      col,
      headRow : randomStart ? Math.random() * rows : -len - 2,
      speed   : Math.random() * 0.05 + 0.025,
      len,
      chars   : Array.from({ length: len }, randChar),
      color   : STREAM_COLORS[Math.floor(Math.random() * STREAM_COLORS.length)],
      muteTick: 0,
    };
  }

  /* ── Sparse background character grid ── */
  function buildBgGrid() {
    bgGrid = [];
    const step = 3; // every 3rd column
    const rowStep = 3;
    for (let c = 0; c < cols; c += step) {
      for (let r = 0; r < Math.ceil(H / FS); r += rowStep) {
        bgGrid.push({
          x     : c * FS,
          y     : r * FS,
          char  : randChar(),
          alpha : Math.random() * 0.07 + 0.03,
          tick  : Math.floor(Math.random() * 300),
        });
      }
    }
  }

  /* ── Mouse ── */
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener('mouseleave', () => { mouse.x = mouse.y = -1; });
  window.addEventListener('resize', resize, { passive: true });

  /* ── Main loop ── */
  function loop() {
    frame++;
    ctx.clearRect(0, 0, W, H);

    const rows = Math.ceil(H / FS);
    ctx.font = `${FS}px 'Courier New', monospace`;
    ctx.textBaseline = 'top';

    /* --- 1. Background ghost grid --- */
    bgGrid.forEach(bg => {
      bg.tick--;
      if (bg.tick <= 0) {
        bg.char  = randChar();
        bg.alpha = Math.random() * 0.08 + 0.03;
        bg.tick  = Math.floor(Math.random() * 350 + 120);
      }

      let a = bg.alpha;
      if (mouse.x >= 0) {
        const d = Math.hypot(bg.x - mouse.x, bg.y - mouse.y);
        if (d < 220) a = Math.min(0.55, a + (1 - d / 220) * 0.45);
      }

      ctx.globalAlpha = a;
      ctx.fillStyle   = ACCENT;
      ctx.fillText(bg.char, bg.x, bg.y);
    });

    /* --- 2. Falling streams --- */
    streams.forEach(s => {
      s.headRow += s.speed;
      s.muteTick++;
      /* randomly mutate a char in the trail */
      if (s.muteTick >= 6) {
        s.muteTick = 0;
        s.chars[Math.floor(Math.random() * s.len)] = randChar();
      }

      for (let j = 0; j < s.len; j++) {
        const row = Math.floor(s.headRow) - j;
        if (row < 0 || row >= rows) continue;

        const x = s.col * FS;
        const y = row * FS;

        /* mouse proximity boost */
        const md   = mouse.x >= 0 ? Math.hypot(x - mouse.x, y - mouse.y) : 9999;
        const mFac = md < 200 ? (1 - md / 200) * 0.35 : 0;

        if (j === 0) {
          /* HEAD — bright, glowing */
          ctx.globalAlpha = 1;
          ctx.fillStyle   = HEAD_COL;
          ctx.shadowBlur  = 18;
          ctx.shadowColor = s.color;
        } else {
          /* TRAIL — fade with distance from head */
          const t = j / s.len;
          ctx.globalAlpha = Math.max(0, (1 - t) * 0.75 + mFac);
          ctx.fillStyle   = s.color;
          ctx.shadowBlur  = j < 4 ? 10 : 0;
          ctx.shadowColor = s.color;
        }

        ctx.fillText(s.chars[j % s.len], x, y);
      }

      ctx.shadowBlur = 0;

      /* reset stream when it scrolls off bottom */
      if ((s.headRow - s.len) * FS > H) {
        s.headRow = -(s.len + 2);
        s.speed   = Math.random() * 0.05 + 0.025;
        s.color   = STREAM_COLORS[Math.floor(Math.random() * STREAM_COLORS.length)];
        s.len     = Math.floor(Math.random() * 22 + 10);
        s.chars   = Array.from({ length: s.len }, randChar);
      }
    });

    ctx.globalAlpha = 1;

    /* --- 3. Mouse spotlight glow --- */
    if (mouse.x >= 0) {
      const grd = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 180);
      grd.addColorStop(0,   'rgba(129,140,248,0.10)');
      grd.addColorStop(0.5, 'rgba(34,211,238,0.04)');
      grd.addColorStop(1,   'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
    }

    requestAnimationFrame(loop);
  }

  resize();
  loop();
})();

/* ===== SPLASH SCREEN ===== */
(function () {
  const splash = document.getElementById('splash');
  if (!splash) return;

  const dismiss = () => {
    splash.classList.add('fade-out');
    document.body.classList.remove('splash-active');
    setTimeout(() => splash.remove(), 800);
  };

  // Auto-dismiss after 2.4s, or immediately on click/keydown
  const timer = setTimeout(dismiss, 2400);
  splash.addEventListener('click', () => { clearTimeout(timer); dismiss(); });
  document.addEventListener('keydown', () => { clearTimeout(timer); dismiss(); }, { once: true });
})();

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ===== TYPEWRITER ===== */
(function () {
  const el = document.querySelector('.hero-role');
  if (!el) return;
  const text = el.dataset.text.replace(/&amp;/g, '&');
  let i = 0;

  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, i === 1 ? 900 : 45);
    }
  }

  setTimeout(type, 1200);
})();

/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = parseInt(el.dataset.delay || '0', 10);
    setTimeout(() => el.classList.add('visible'), delay);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===== HEADING UNDERLINE DRAW ===== */
const h2Observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('line-drawn');
      h2Observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('section h2').forEach(el => h2Observer.observe(el));

/* ===== STAT COUNTER ===== */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat-number[data-target]').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const step = 16;
      const steps = duration / step;
      let current = 0;
      const inc = target / steps;

      const timer = setInterval(() => {
        current = Math.min(current + inc, target);
        el.textContent = Math.floor(current) + suffix;
        if (current >= target) clearInterval(timer);
      }, step);
    });
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.4 });

const aboutStripe = document.querySelector('#about-stripe');
if (aboutStripe) counterObserver.observe(aboutStripe);

/* ===== 3D CARD TILT ===== */
document.querySelectorAll('.card.tilt').forEach(card => {
  const TILT = 10;

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -TILT;
    const rotY = ((x - cx) / cx) *  TILT;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ===== BUTTON RIPPLE ===== */
document.querySelectorAll('.ripple').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top  - size / 2;

    const circle = document.createElement('span');
    circle.className = 'ripple-circle';
    circle.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  });
});

/* ===== ACTIVE NAV ON SCROLL ===== */
(function () {
  const sections = document.querySelectorAll('main section[id], #about-stripe');
  const links = document.querySelectorAll('nav a[href^="#"], .mobile-menu a[href^="#"]');

  function getActiveId() {
    const scrollY = window.scrollY + 120;
    let active = null;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.id === 'about' ? 'about' : section.id;
      if (scrollY >= top && scrollY < bottom) active = id;
    });
    return active;
  }

  function updateNav() {
    const id = getActiveId();
    links.forEach(link => {
      const href = link.getAttribute('href').slice(1);
      link.classList.toggle('active', href === id);
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();
