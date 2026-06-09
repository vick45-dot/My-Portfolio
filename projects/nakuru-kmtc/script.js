/* ===== HERO SLIDER ===== */
(function () {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.dot');
  let current  = 0, timer;

  function goTo(i) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }

  function startAuto() { timer = setInterval(next, 5000); }
  function stopAuto()  { clearInterval(timer); }

  dots.forEach(dot => dot.addEventListener('click', () => {
    stopAuto(); goTo(+dot.dataset.index); startAuto();
  }));

  startAuto();
})();

/* ===== STICKY HEADER ===== */
(function () {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ===== MOBILE NAV TOGGLE ===== */
(function () {
  const toggle = document.getElementById('navToggle');
  const nav    = document.getElementById('nav');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    nav.classList.toggle('open');
  });

  /* Close on outside click */
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      toggle.classList.remove('open');
      nav.classList.remove('open');
    }
  });

  /* Mobile dropdown toggles */
  document.querySelectorAll('.has-dropdown .nav-link').forEach(link => {
    link.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        link.closest('.has-dropdown').classList.toggle('open');
      }
    });
  });
})();

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    /* close mobile nav */
    document.getElementById('nav').classList.remove('open');
    document.getElementById('navToggle').classList.remove('open');
  });
});

/* ===== STATS COUNTER ===== */
(function () {
  const nums = document.querySelectorAll('.stat-num[data-target]');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.target;
      const dur    = 1600;
      const step   = 16;
      const inc    = target / (dur / step);
      let   val    = 0;
      const t = setInterval(() => {
        val = Math.min(val + inc, target);
        el.textContent = Math.floor(val).toLocaleString();
        if (val >= target) clearInterval(t);
      }, step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => obs.observe(n));
})();

/* ===== PROGRAM TABS ===== */
(function () {
  const btns    = document.querySelectorAll('.tab-btn');
  const panels  = document.querySelectorAll('.tab-content');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });
})();

/* ===== CONTACT FORM ===== */
(function () {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    success.classList.add('show');
    form.reset();
    setTimeout(() => success.classList.remove('show'), 5000);
  });
})();

/* ===== BACK TO TOP ===== */
(function () {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ===== SCROLL REVEAL ===== */
(function () {
  const items = document.querySelectorAll(
    '.prog-card, .why-card, .mv-card, .news-card, .stat-item, .step, .highlight-item'
  );

  items.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .55s ease, transform .55s ease';
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 70);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  items.forEach(el => obs.observe(el));
})();
