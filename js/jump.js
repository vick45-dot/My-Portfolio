/* Quick jump: press Ctrl+K (or Cmd+K, or /) to jump to a section, open a project or do something. */
(function () {
  'use strict';
  var VK = window.VK;
  var dlg = document.getElementById('pal');
  var input = document.getElementById('palQ');
  var list = document.getElementById('palList');
  var open = document.getElementById('openJump');
  var rows = [], shown = [], active = 0;

  function go(sel) { return function () { var t = document.querySelector(sel); if (t) t.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }; }
  function link(href) { return function () { window.open(href, '_blank', 'noopener'); }; }

  rows.push({ group: 'Go to', label: 'The map story', hint: 'top of the page', run: go('#story') });
  rows.push({ group: 'Go to', label: 'All my work', hint: 'eight projects', run: go('#work') });
  rows.push({ group: 'Go to', label: 'About me', hint: 'who I am and what I use', run: go('#about') });
  rows.push({ group: 'Go to', label: 'Contact', hint: 'email and WhatsApp', run: go('#contact') });
  VK.PROJECTS.forEach(function (p) { rows.push({ group: 'Projects', label: p.name, hint: p.status, run: function () { VK.openCase(p.id); } }); });
  rows.push({ group: 'Actions', label: 'Email Victor', hint: VK.EMAIL, run: function () { location.href = 'mailto:' + VK.EMAIL; } });
  rows.push({ group: 'Actions', label: 'Copy my email address', hint: '', run: function () { var b = document.getElementById('copyEmail'); if (b) b.click(); } });
  rows.push({ group: 'Actions', label: 'Message me on WhatsApp', hint: '', run: link(VK.CONTACT.whatsapp) });
  rows.push({ group: 'Actions', label: 'See my GitHub', hint: 'vick45-dot', run: link(VK.CONTACT.github) });
  rows.push({ group: 'Actions', label: 'See my Fiverr profile', hint: 'vict0r_build', run: link(VK.CONTACT.fiverr) });

  function render() {
    var q = input.value.trim().toLowerCase();
    shown = rows.filter(function (r) { return !q || (r.label + ' ' + r.hint + ' ' + r.group).toLowerCase().indexOf(q) > -1; });
    if (active >= shown.length) active = Math.max(0, shown.length - 1);
    var html = '', lastGroup = '';
    shown.forEach(function (r, i) {
      if (r.group !== lastGroup) { html += '<li class="group" role="presentation">' + r.group + '</li>'; lastGroup = r.group; }
      html += '<li role="option" id="pal-o' + i + '" aria-selected="' + (i === active) + '" data-i="' + i + '">' + r.label + (r.hint ? '<small>' + r.hint + '</small>' : '') + '</li>';
    });
    if (!shown.length) html = '<li class="group" role="presentation">Nothing matches that. Try “dream”, “about” or “email”.</li>';
    list.innerHTML = html;
    input.setAttribute('aria-activedescendant', shown.length ? 'pal-o' + active : '');
    var cur = document.getElementById('pal-o' + active); if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: 'nearest' });
  }

  function openPal() { if (dlg.open) return; input.value = ''; active = 0; render(); dlg.showModal(); input.focus(); }
  function run(i) { var r = shown[i]; if (!r) return; dlg.close(); setTimeout(r.run, 30); }

  input.addEventListener('input', function () { active = 0; render(); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { active = Math.min(shown.length - 1, active + 1); render(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { active = Math.max(0, active - 1); render(); e.preventDefault(); }
    else if (e.key === 'Enter') { run(active); e.preventDefault(); }
  });
  list.addEventListener('click', function (e) { var li = e.target.closest('li[data-i]'); if (li) run(+li.getAttribute('data-i')); });
  list.addEventListener('mousemove', function (e) { var li = e.target.closest('li[data-i]'); if (li && +li.getAttribute('data-i') !== active) { active = +li.getAttribute('data-i'); render(); } });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  open.addEventListener('click', openPal);
  document.addEventListener('keydown', function (e) {
    var typing = /INPUT|TEXTAREA|SELECT/.test((e.target.tagName || ''));
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); dlg.open ? dlg.close() : openPal(); }
    else if (e.key === '/' && !typing && !dlg.open) { e.preventDefault(); openPal(); }
  });
})();
