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

  // Contact form — Web3Forms (public HTTPS endpoint, works in published sandbox)
  var form = document.getElementById('quoteForm');
  if (form) {
    var status = document.getElementById('formStatus');
    var btn = document.getElementById('submitBtn');
    var defaultLabel = btn ? btn.textContent : 'Send My Free Quote';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (status) { status.textContent = ''; status.className = 'form-status'; }
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      var data = new FormData(form);
      // honeypot
      if (data.get('botcheck')) { return false; }

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res.success) {
            if (status) { status.textContent = 'Thanks — your request is in. We will reach out within 24 hours.'; status.classList.add('success'); }
            form.reset();
          } else {
            throw new Error(res.message || 'Submission failed');
          }
        })
        .catch(function (err) {
          if (status) { status.textContent = 'Something went wrong. Please call us at (804) 774-0332.'; status.classList.add('error'); }
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.textContent = defaultLabel; }
        });
    });
  }
})();
