/* Small things: the header takes the colour of the section under it, the copy button, deep links. */
(function () {
  'use strict';
  var VK = window.VK;
  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-tone]')).filter(function (n) { return n.tagName !== 'BODY'; });
  var raf = 0;

  function tone() {
    raf = 0;
    var y = 40, cur = sections[0];
    sections.forEach(function (s) { if (s.getBoundingClientRect().top <= y) cur = s; });
    var t = cur.getAttribute('data-tone');
    if (document.body.getAttribute('data-tone') !== t) document.body.setAttribute('data-tone', t);
  }
  window.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(tone); }, { passive: true });
  tone();

  var btn = document.getElementById('copyEmail'), note = document.getElementById('copyNote');
  if (btn) btn.addEventListener('click', function () {
    function done(ok) { note.textContent = ok ? 'Copied ' + VK.EMAIL : 'Select and copy it from the button on the left: ' + VK.EMAIL; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(VK.EMAIL).then(function () { done(true); }, function () { done(false); });
    else done(false);
  });

  if (VK.openFromHash) VK.openFromHash();
})();
