/* ===== SCROLL TO TOP ON LOAD ===== */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* ===== HERO SLIDER ===== */
(function () {
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.slider-dot');
  let current  = 0;
  let timer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  document.getElementById('nextSlide').addEventListener('click', () => { goTo(current + 1); startAuto(); });
  document.getElementById('prevSlide').addEventListener('click', () => { goTo(current - 1); startAuto(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => { goTo(+dot.dataset.slide); startAuto(); });
  });

  startAuto();
})();

/* ===== STICKY HEADER ===== */
(function () {
  const sticky    = document.getElementById('stickyHeader');
  const threshold = document.querySelector('.hero-slider').offsetHeight;

  window.addEventListener('scroll', () => {
    sticky.classList.toggle('visible', window.scrollY > threshold - 80);
  }, { passive: true });
})();

/* ===== HAMBURGER / MOBILE NAV ===== */
(function () {
  const btn     = document.getElementById('hamburger');
  const nav     = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileOverlay');
  const close   = document.getElementById('mobileClose');

  function openNav() {
    nav.classList.add('open');
    overlay.classList.add('show');
    btn.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    nav.classList.remove('open');
    overlay.classList.remove('show');
    btn.classList.remove('open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', openNav);
  close.addEventListener('click', closeNav);
  overlay.addEventListener('click', closeNav);
})();

/* ===== SEARCH OVERLAY ===== */
(function () {
  const overlay = document.getElementById('searchOverlay');
  const openBtn = document.getElementById('searchBtn');
  const closeBtn = document.getElementById('searchClose');
  const input   = document.getElementById('searchInput');

  openBtn.addEventListener('click', () => {
    overlay.classList.add('open');
    setTimeout(() => input.focus(), 200);
  });

  closeBtn.addEventListener('click', () => overlay.classList.remove('open'));

  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') overlay.classList.remove('open');
  });
})();

/* ===== SCROLL REVEAL ===== */
(function () {
  const targets = document.querySelectorAll('.vmv-card, .notice-card, .partner-logo');

  targets.forEach(el => el.classList.add('reveal-on-scroll'));

  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('visible'), i * 90);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  targets.forEach(el => obs.observe(el));
})();
