// HWS Sealcoating — interactions

(function () {
  var root = document.documentElement;
  var stored = null; // localStorage blocked in sandboxed iframe — use in-memory + system pref
  var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', dark ? 'dark' : 'light');

  function setTheme(d) {
    dark = d;
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    var t = document.querySelector('[data-theme-toggle]');
    if (t) t.setAttribute('aria-label', 'Switch to ' + (dark ? 'light' : 'dark') + ' mode');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('[data-theme-toggle]');
    if (toggle) toggle.addEventListener('click', function () { setTheme(!dark); });

    // Mobile menu
    var menuBtn = document.getElementById('menuBtn');
    var mobileNav = document.getElementById('mobileNav');
    if (menuBtn && mobileNav) {
      menuBtn.addEventListener('click', function () {
        var open = mobileNav.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      mobileNav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          mobileNav.classList.remove('open');
          menuBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Header shadow on scroll
    var header = document.getElementById('header');
    function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 8); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });

  // Contact form submits natively (POST to Web3Forms) — bypasses CORS, redirects to success.html.
  // Honeypot guard: if the hidden botcheck field is filled, block submission.
  var form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      if (form.querySelector('[name="botcheck"]').checked) { e.preventDefault(); return false; }
      var btn = document.getElementById('submitBtn');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      // Let the browser submit natively — Web3Forms redirects to success.html.
    });
  }
})();
