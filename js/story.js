/* The map story: scrolling moves a camera over a real map of Kenya. Plain JavaScript, no libraries.
   Each step of text on the left has a camera position (VK.CAMERA); the camera glides between them as you scroll. */
(function () {
  'use strict';
  var K = window.KENYA, VK = window.VK;
  var svg = document.getElementById('map');
  var stage = document.getElementById('stage');
  if (!svg || !K || !VK) return;

  var NS = 'http://www.w3.org/2000/svg';
  var RAD = Math.PI / 180;
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var narrow = window.matchMedia('(max-width: 899px)');
  var steps = Array.prototype.slice.call(document.querySelectorAll('.step'));
  var CAM = VK.CAMERA;
  var LAST = CAM.length - 1;
  var byId = {}; VK.PROJECTS.forEach(function (p) { byId[p.id] = p; });

  function proj(lat, lng) { return [K.TX + K.K * lng * RAD, K.TY - K.K * lat * RAD]; }
  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var a in attrs) n.setAttribute(a, attrs[a]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function smooth(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  function ramp(v, a, b) { return smooth((v - a) / (b - a)); }

  /* ---- layers ---- */
  var land = el('g', {}, svg);
  K.neighbours.forEach(function (d) { el('path', { d: d, 'class': 'neigh' }, land); });
  var grat = el('g', { 'class': 'grat' }, land);
  for (var la = -5; la <= 5.5; la += 0.25) { var a = proj(la, 33.5), b = proj(la, 42.2); el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, grat); }
  for (var lo = 33.5; lo <= 42.2; lo += 0.25) { var c = proj(5.6, lo), d = proj(-5, lo); el('line', { x1: c[0], y1: c[1], x2: d[0], y2: d[1] }, grat); }
  el('path', { d: K.kenya, 'class': 'land' }, land);

  /* DreamPath's route, drawn as gentle curves between its real places */
  var placeByName = {}; VK.DREAM_PLACES.forEach(function (p) { placeByName[p[0]] = p; });
  var routeG = el('g', {}, land);
  (function () {
    var d = '', prev = null, flip = 1;
    VK.DREAM_ROUTE.forEach(function (name) {
      var p = placeByName[name], pt = proj(p[1], p[2]);
      if (!prev) d = 'M' + pt[0].toFixed(1) + ',' + pt[1].toFixed(1);
      else {
        var mx = (prev[0] + pt[0]) / 2, my = (prev[1] + pt[1]) / 2, dx = pt[0] - prev[0], dy = pt[1] - prev[1];
        var cx = mx - dy * 0.14 * flip, cy = my + dx * 0.14 * flip; flip = -flip;
        d += ' Q' + cx.toFixed(1) + ',' + cy.toFixed(1) + ' ' + pt[0].toFixed(1) + ',' + pt[1].toFixed(1);
      }
      prev = pt;
    });
    el('path', { d: d, 'class': 'route' }, routeG);
  })();

  var pinsG = el('g', {}, svg);
  var pins = [];

  function addPin(opts) {
    var g = el('g', { 'class': 'pin' + (opts.cls ? ' ' + opts.cls : '') }, pinsG);
    if (opts.link) opts.link.line = el('line', { 'class': 'link' }, pinsG), pinsG.insertBefore(opts.link.line, g);
    if (opts.halo) el('circle', { 'class': 'halo', r: opts.r }, g);
    el('circle', { 'class': 'core', r: opts.r }, g);
    if (opts.label) {
      opts.lx0 = opts.lx == null ? opts.r + 8 : opts.lx; opts.a0 = opts.anchor || 'start';
      var t = el('text', { x: opts.lx0, y: opts.ly == null ? 5 : opts.ly, 'text-anchor': opts.a0 }, g); t.textContent = opts.label; opts.t = t;
    }
    if (opts.open) {
      g.setAttribute('role', 'button'); g.setAttribute('tabindex', '0'); g.setAttribute('aria-label', opts.aria);
      g.addEventListener('click', function () { VK.openCase(opts.open); });
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); VK.openCase(opts.open); } });
    } else g.setAttribute('aria-hidden', 'true');
    opts.g = g; pins.push(opts); return opts;
  }

  /* DreamPath's places */
  var SHOW_NAMES = { 'Maasai Mara': 1, 'Amboseli': 1, 'Diani': 1, 'Lamu': 1, 'Samburu': 1, 'Mount Kenya': 1, 'Taita Hills': 1 };
  VK.DREAM_PLACES.forEach(function (p) {
    var hide = p[0] === 'Mount Kenya' || p[0] === 'Taita Hills';   /* too crowded on a phone */
    addPin({ kind: 'dream', lat: p[1], lng: p[2], r: 4.5, cls: 'small dark', label: SHOW_NAMES[p[0]] ? p[0] : '', lx: 9, ly: 4, hideNarrow: hide });
  });
  /* the project pins */
  var suwerwa = addPin({ kind: 'suwerwa', lat: VK.SUWERWA.lat, lng: VK.SUWERWA.lng, r: 8, label: 'Suwerwa', open: 'stfrancis', aria: 'Open St Francis Girls’ High School, Suwerwa' });
  var nakuru = addPin({ kind: 'nakuru', lat: VK.NAKURU.lat, lng: VK.NAKURU.lng, r: 9, halo: true, label: 'Nakuru', lx: 16, ly: -10 });
  var ring = VK.NAKURU_RING.map(function (id, i) {
    var angle = [150, 30, 270][i] * RAD;
    return addPin({ kind: 'sat', id: id, angle: angle, r: 8, link: {}, label: byId[id].name.replace(' Management System', '').replace(' website', ''), lx: [-16, 16, 0][i], ly: [-12, -12, 30][i], anchor: ['end', 'start', 'middle'][i], open: id, aria: 'Open ' + byId[id].name });
  });
  var dreamBadge = addPin({ kind: 'badge', lat: 2.3, lng: 38.5, r: 8, label: 'DreamPath Travel', lx: 0, ly: -15, anchor: 'middle', open: 'dreampath', aria: 'Open DreamPath Travel' });

  /* ---- layout and drawing ---- */
  var W = 0, H = 0, HM = 0, S0 = 1;
  function measure() {
    var r = svg.getBoundingClientRect();
    W = Math.max(200, r.width); H = Math.max(160, r.height);
    HM = narrow.matches ? H - 50 : H;   /* on a phone the readout sits in a strip under the picture */
    svg.setAttribute('viewBox', '0 0 ' + W.toFixed(0) + ' ' + H.toFixed(0));
    S0 = Math.min(W / K.W, HM / K.H) * 0.94;
    pins.forEach(function (p) { p.tw = 0; });
  }

  /* keep a pin's label inside the picture: flip it to the other side of its pin if it would run off the edge */
  function fitLabel(p, x) {
    if (!p.tw) p.tw = p.t.getComputedTextLength() || p.t.textContent.length * 7.5;
    var lx = p.lx0, a = p.a0, pad = 8;
    if (a === 'start' && x + lx + p.tw > W - pad) { a = 'end'; lx = -lx; }
    else if (a === 'end' && x + lx - p.tw < pad) { a = 'start'; lx = -lx; }
    else if (a === 'middle') { var l = x - p.tw / 2, r = x + p.tw / 2; if (l < pad) lx += pad - l; else if (r > W - pad) lx -= r - (W - pad); }
    if (p.cx !== lx || p.ca !== a) { p.t.setAttribute('x', lx); p.t.setAttribute('text-anchor', a); p.cx = lx; p.ca = a; }
  }

  function camera(f) {
    var i = Math.min(LAST - 1, Math.floor(f)), t = f - i;
    var a = CAM[i], b = CAM[i + 1];
    var e = calm ? (t >= 0.5 ? 1 : 0) : smooth((t - 0.2) / 0.6);
    var lat = a.lat + (b.lat - a.lat) * e, lng = a.lng + (b.lng - a.lng) * e;
    var k = Math.exp(Math.log(a.k) + (Math.log(b.k) - Math.log(a.k)) * e);
    var far = Math.hypot(b.lat - a.lat, b.lng - a.lng);
    if (a.k >= 2 && b.k >= 2 && far > 0.3) k *= 1 - 0.55 * Math.sin(Math.PI * e);   /* zoom out a little on the way, so both places are in view */
    return { lat: lat, lng: lng, k: k };
  }

  var lastText = '';
  function draw(f) {
    var cam = camera(f);
    var c = proj(cam.lat, cam.lng), sc = S0 * cam.k;
    var ox = W / 2 - c[0] * sc, oy = HM / 2 - c[1] * sc;
    land.setAttribute('transform', 'translate(' + ox.toFixed(2) + ',' + oy.toFixed(2) + ') scale(' + sc.toFixed(4) + ')');
    grat.style.opacity = (0.25 + 0.75 * ramp(cam.k, 1.5, 5)).toFixed(2);
    function pos(lat, lng) { var p = proj(lat, lng); return [ox + p[0] * sc, oy + p[1] * sc]; }

    var home = pos(VK.NAKURU.lat, VK.NAKURU.lng);
    var wSat = ramp(f, 1.25, 1.9) * (1 - ramp(f, 2.45, 2.95));
    var wDream = ramp(f, 3.35, 3.95);
    var R = Math.min(W, HM) * (narrow.matches ? 0.27 : 0.2);

    pins.forEach(function (p) {
      var x, y, o = 1;
      if (p.kind === 'sat') {
        x = home[0] + Math.cos(p.angle) * R; y = home[1] - Math.sin(p.angle) * R; o = wSat;
        p.link.line.setAttribute('x1', home[0].toFixed(1)); p.link.line.setAttribute('y1', home[1].toFixed(1));
        p.link.line.setAttribute('x2', x.toFixed(1)); p.link.line.setAttribute('y2', y.toFixed(1));
        p.link.line.style.opacity = o.toFixed(2);
      } else {
        var q = pos(p.lat, p.lng); x = q[0]; y = q[1];
        if (p.kind === 'dream' || p.kind === 'badge') o = wDream;
        if (p.kind === 'nakuru') o = 1;
      }
      if (p.t && p.hideNarrow) p.t.style.display = narrow.matches ? 'none' : '';
      if (p.t && !(p.hideNarrow && narrow.matches)) fitLabel(p, x);
      p.g.setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')');
      p.g.style.opacity = o.toFixed(2);
      p.g.style.pointerEvents = o < 0.5 ? 'none' : 'auto';
      if (p.open) p.g.setAttribute('tabindex', o < 0.5 ? '-1' : '0');
    });
    routeG.style.opacity = wDream.toFixed(2);

    var latT = Math.abs(cam.lat).toFixed(2) + '°' + (cam.lat < 0 ? 'S' : 'N') + ' ' + cam.lng.toFixed(2) + '°E';
    if (latT !== lastText) { document.getElementById('coords').textContent = latT; lastText = latT; }
    var pxPerKm = K.K * RAD * sc / 111.195, nice = [2, 5, 10, 20, 50, 100, 200, 500], km = 500;
    for (var n = 0; n < nice.length; n++) if (nice[n] * pxPerKm >= 70) { km = nice[n]; break; }
    document.getElementById('scaleLine').style.width = (km * pxPerKm).toFixed(0) + 'px';
    document.getElementById('scaleText').textContent = km + ' km';
  }

  /* ---- which step are we at? ---- */
  function fractionalStep() {
    var vh = window.innerHeight, ref, cs = [];
    if (narrow.matches) { var sb = stage.getBoundingClientRect().bottom; ref = sb + (vh - sb) * 0.4; } else ref = vh * 0.5;
    steps.forEach(function (s) { var r = s.getBoundingClientRect(); cs.push(r.top + r.height / 2); });
    if (ref <= cs[0]) return 0;
    for (var i = 0; i < cs.length - 1; i++) if (ref < cs[i + 1]) return i + (ref - cs[i]) / (cs[i + 1] - cs[i]);
    return LAST;
  }

  var raf = 0, shownStep = -1;
  function frame() {
    raf = 0;
    var f = fractionalStep();
    var active = Math.round(f);
    if (active !== shownStep) { steps.forEach(function (s, i) { s.classList.toggle('on', i === active); }); shownStep = active; }
    draw(calm ? active : f);
  }
  function queue() { if (!raf) raf = requestAnimationFrame(frame); }

  measure(); frame();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); queue(); });
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', function () { measure(); queue(); });
  if (window.ResizeObserver) new ResizeObserver(function () { measure(); queue(); }).observe(stage);
})();
