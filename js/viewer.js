/* The project tiles, and the full-screen viewer that opens from a tile or from a pin on the map. */
(function () {
  'use strict';
  var VK = window.VK;
  var P = VK.PROJECTS;
  var dlg = document.getElementById('case');
  var body = document.getElementById('caseBody');
  var tilesEl = document.getElementById('tiles');
  var countEl = document.getElementById('caseCount');
  var index = 0, opener = null, hashBefore = '';

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function kes(n) { return 'KES ' + Math.round(n).toLocaleString('en-US'); }
  var ARROW = '<svg class="arrow" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';

  /* ---- tiles ---- */
  P.forEach(function (p, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'tile' + (i === 0 ? ' feature' : '');
    b.style.setProperty('--tbg', p.bg); b.style.setProperty('--tfg', p.fg); b.style.setProperty('--tacc', p.accent);
    b.setAttribute('data-open', p.id);
    b.innerHTML = '<span class="tile-top"><span class="chip"><i></i>' + esc(p.status) + '</span>' + ARROW + '</span>' +
      '<span class="tile-name">' + esc(p.name) + '</span>' +
      '<span class="tile-blurb">' + esc(p.blurb) + '</span>' +
      '<span class="tile-stack">' + esc(p.kind) + ' · ' + esc(p.stack) + '</span>' +
      (i === 0 && p.shots ? '<span class="tile-shot" aria-hidden="true" style="background-image:url(' + p.shots[0].src + ')"></span>' : '');
    tilesEl.appendChild(b);
  });

  /* ---- "try the maths" ---- */
  function share(flat, per, n, buffer) { return Math.ceil((flat + per * n) * (100 + buffer) / (100 * n)); }

  function quotaHTML() {
    function row(id, label, min, max, step, val) {
      return '<div class="q-row"><label for="' + id + '">' + label + '</label><output for="' + id + '" id="' + id + 'o"></output>' +
        '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"></div>';
    }
    return '<div class="quota" id="quota"><h3>Try the maths</h3>' +
      '<p class="sub">This is the real rule from DreamPath. Shared costs get split. Per-person costs follow each person. Change the group and see what the deadline does.</p>' +
      row('q-group', 'Friends in the group', 2, 12, 1, 6) +
      row('q-miss', 'Friends who miss the deadline', 0, 11, 1, 0) +
      row('q-flat', 'Shared costs, such as a van', 0, 60000, 1000, 24000) +
      row('q-per', 'Costs per person, such as stay and activities', 2000, 30000, 500, 9500) +
      row('q-buf', 'Safety buffer', 0, 10, 1, 5) +
      '<div class="q-out"><div class="l">Each person pays</div><div class="n" id="q-n" aria-live="polite"></div><p class="m" id="q-m"></p></div>' +
      '<div class="q-btns"><button type="button" class="btn" id="q-run">Make three friends miss the deadline</button></div></div>';
  }

  function initQuota(root) {
    var $ = function (id) { return root.querySelector('#' + id); };
    var g = $('q-group'), m = $('q-miss'), f = $('q-flat'), pp = $('q-per'), bf = $('q-buf');
    function update() {
      var group = +g.value; m.max = group - 1; if (+m.value > group - 1) m.value = group - 1;
      var miss = +m.value, n = group - miss, flat = +f.value, per = +pp.value, buf = +bf.value;
      $('q-groupo').textContent = group; $('q-misso').textContent = miss; $('q-flato').textContent = kes(flat); $('q-pero').textContent = kes(per); $('q-bufo').textContent = buf + '%';
      var before = share(flat, per, group, buf), after = share(flat, per, n, buf);
      $('q-n').textContent = kes(after);
      $('q-m').textContent = miss === 0
        ? 'Everyone is in, so nobody is removed. Split ' + group + ' ways.'
        : miss + (miss === 1 ? ' friend' : ' friends') + ' did not pay the deposit and ' + (miss === 1 ? 'was' : 'were') + ' removed. The share went from ' + kes(before) + ' to ' + kes(after) + ', because the shared costs are now split ' + n + ' ways.';
      $('q-run').textContent = miss === 0 ? 'Make three friends miss the deadline' : 'Start again';
    }
    [g, m, f, pp, bf].forEach(function (i) { i.addEventListener('input', update); });
    $('q-run').addEventListener('click', function () {
      if (+m.value === 0) { m.value = Math.min(3, +g.value - 1); } else { m.value = 0; }
      update();
    });
    update();
  }

  /* ---- the viewer ---- */
  function fitPreview() {
    var box = body.querySelector('.preview-box'); if (!box) return;
    var s = box.clientWidth / 1280;
    box.style.height = (800 * s) + 'px';
    var fr = box.querySelector('iframe'); if (fr) fr.style.transform = 'scale(' + s + ')';
  }

  function fill(i) {
    index = (i + P.length) % P.length;
    var p = P[index];
    dlg.style.setProperty('--cbg', p.bg); dlg.style.setProperty('--cfg', p.fg); dlg.style.setProperty('--cacc', p.accent);
    countEl.textContent = (index + 1) + ' of ' + P.length;
    var hasVis = p.quota || p.preview;
    var vis = '';
    if (p.quota) vis += quotaHTML();
    if (p.preview) vis += '<div class="preview"><div class="preview-bar"><span>' + esc(p.preview.src) + '</span></div><div class="preview-box"><iframe src="' + esc(p.preview.src) + '" title="' + esc(p.preview.title) + '" loading="lazy" tabindex="-1" sandbox="allow-scripts allow-same-origin"></iframe></div></div>';
    if (p.shots) p.shots.forEach(function (s) { vis += '<figure class="shot"><img src="' + esc(s.src) + '" alt="' + esc(s.alt) + '" loading="lazy"><figcaption>' + esc(s.cap) + '</figcaption></figure>'; });
    var html = '<div class="case-grid' + (hasVis ? '' : ' single') + '"><div class="case-text">' +
      '<div class="case-meta"><span class="chip"><i></i>' + esc(p.status) + '</span><span>' + esc(p.kind) + ', ' + esc(p.year) + '</span></div>' +
      '<h2 id="case-title">' + esc(p.name) + '</h2>' +
      p.story.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') +
      '<ul>' + p.facts.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
      '<p class="case-stack">Made with ' + esc(p.stack) + '</p>' +
      (p.links.length ? '<div class="case-links">' + p.links.map(function (l) { return '<a class="btn" href="' + esc(l.href) + '"' + (/^https?:/.test(l.href) ? ' target="_blank" rel="noopener"' : '') + '>' + esc(l.label) + '</a>'; }).join('') + '</div>' : '') +
      '</div>' + (hasVis ? '<div class="case-vis">' + vis + '</div>' : '') + '</div>';
    var hadFocus = body.contains(document.activeElement);
    body.innerHTML = html;
    body.scrollTop = 0;
    if (hadFocus) { body.setAttribute('tabindex', '-1'); body.focus({ preventScroll: true }); }
    var q = body.querySelector('#quota'); if (q) initQuota(q);
    fitPreview();
    history.replaceState(null, '', location.pathname + location.search + '#work/' + p.id);
  }

  VK.openCase = function (id) {
    var i = P.findIndex(function (p) { return p.id === id; });
    if (i < 0) return;
    if (!dlg.open) {
      opener = document.activeElement; hashBefore = location.hash && location.hash.indexOf('#work/') !== 0 ? location.hash : '';
      dlg.showModal(); document.body.classList.add('locked');
    }
    fill(i);
  };

  function closeCase() { if (dlg.open) dlg.close(); }
  dlg.addEventListener('close', function () {
    document.body.classList.remove('locked');
    history.replaceState(null, '', location.pathname + location.search + hashBefore);
    if (opener && opener.focus) opener.focus();
    body.innerHTML = '';
  });
  document.getElementById('caseClose').addEventListener('click', closeCase);
  document.getElementById('casePrev').addEventListener('click', function () { fill(index - 1); });
  document.getElementById('caseNext').addEventListener('click', function () { fill(index + 1); });
  /* arrow keys move between projects, unless the person is using a slider or the quick-jump box is open */
  document.addEventListener('keydown', function (e) {
    if (!dlg.open || document.getElementById('pal').open) return;
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
    if (e.key === 'ArrowLeft') { fill(index - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { fill(index + 1); e.preventDefault(); }
  });
  window.addEventListener('resize', fitPreview);

  /* anything with data-open opens that project: tiles, buttons in the story */
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-open]') : null;
    if (t && !t.closest('svg')) { e.preventDefault(); VK.openCase(t.getAttribute('data-open')); }
  });

  /* a link like #work/dreampath opens straight away */
  function fromHash() {
    var m = /^#work\/([a-z0-9-]+)$/.exec(location.hash);
    if (m && !dlg.open) VK.openCase(m[1]);
  }
  window.addEventListener('hashchange', fromHash);
  VK.openFromHash = fromHash;
})();
