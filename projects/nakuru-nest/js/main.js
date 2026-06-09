/* ===== SCROLL TO TOP ON LOAD ===== */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* ===== NAVBAR SCROLL ===== */
(function () {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
})();

/* ===== HAMBURGER / MOBILE MENU ===== */
(function () {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });

  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      btn.classList.remove('open');
      menu.classList.remove('open');
    }
  });
})();

/* ===== HERO SEARCH ===== */
(function () {
  const form = document.getElementById('heroSearchForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const loc = document.getElementById('searchLocation').value.trim() || 'Nakuru';
    alert(`Searching BnBs in ${loc}…\n(Connect to a backend to enable live search)`);
  });

  /* Quick-tag fills search field */
  document.querySelectorAll('.hero-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      document.getElementById('searchLocation').value = tag.dataset.location;
      tag.closest('.hero-content').querySelector('.search-btn').focus();
    });
  });
})();

/* ===== STATS COUNTER ===== */
(function () {
  const nums = document.querySelectorAll('.stat-number[data-target]');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      const dur    = 1500;
      const steps  = 60;
      const inc    = target / steps;
      let val = 0, count = 0;

      const t = setInterval(() => {
        count++;
        val = Math.min(val + inc, target);
        el.textContent = Math.floor(val).toLocaleString() + suffix;
        if (count >= steps) clearInterval(t);
      }, dur / steps);

      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => obs.observe(n));
})();

/* ===== SCROLL REVEAL ===== */
(function () {
  const targets = document.querySelectorAll(
    '.listing-card, .step-card, .feature-item, .testimonial-card, .destination-card'
  );

  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = 'opacity .55s ease, transform .55s ease';
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 65);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  targets.forEach(el => obs.observe(el));
})();
