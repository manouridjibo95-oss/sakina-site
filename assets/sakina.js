/* Sakina — comportements partagés
   Navigation, notifications, révélations au défilement, icônes SVG. */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- Icônes */
  var ICONS = {
    pin: '<path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    shield: '<path d="M12 3l7 3v5.5c0 4.4-3 8.1-7 9.5-4-1.4-7-5.1-7-9.5V6l7-3Z"/><path d="M9.2 12.2 11 14l3.8-3.8"/>',
    star: '<path d="M12 3.2 14.3 9l6.2.3-4.8 3.9 1.6 6-5.3-3.5L6.7 19l1.6-6L3.5 9.3 9.7 9Z"/>',
    heart: '<path d="M12 20s-7-4.4-7-9.3A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.7C19 15.6 12 20 12 20Z"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>',
    users: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19.5c0-3 2.5-4.8 5.5-4.8s5.5 1.8 5.5 4.8"/><path d="M16 6.2a3.2 3.2 0 0 1 0 6.1"/><path d="M17.5 15.2c2.1.5 3.5 2 3.5 4.3"/>',
    sprout: '<path d="M12 21v-7"/><path d="M12 14c0-3.3-2.4-6-5.5-6 0 3.3 2.4 6 5.5 6Z"/><path d="M12 14c0-3.9 2.8-7 6.2-7 0 3.9-2.8 7-6.2 7Z"/>',
    eye: '<path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
    arrowLeft: '<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>',
    lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    person: '<circle cx="12" cy="8.5" r="3.6"/><path d="M4.8 20c0-3.7 3.2-6 7.2-6s7.2 2.3 7.2 6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><path d="M12 7.6h.01"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V13"/><path d="M12 16.4h.01"/>'
  };

  function icon(name, size) {
    var d = ICONS[name];
    if (!d) return '';
    var s = size || 24;
    return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" ' +
      'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  }

  /* ------------------------------------------------------------ Utilitaires */
  function escapeHtml(value) {
    var el = document.createElement('div');
    el.textContent = value == null ? '' : String(value);
    return el.innerHTML;
  }

  function currentUser() {
    try {
      var raw = localStorage.getItem('sakina_user');
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  /* ----------------------------------------------------------- Notifications */
  var stack;
  function toast(message, kind) {
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'toast-stack';
      stack.setAttribute('role', 'status');
      stack.setAttribute('aria-live', 'polite');
      document.body.appendChild(stack);
    }
    var bad = kind === 'error';
    var el = document.createElement('div');
    el.className = 'toast ' + (bad ? 'is-bad' : 'is-good');
    el.innerHTML = icon(bad ? 'alert' : 'check', 17) + '<span>' + escapeHtml(message) + '</span>';
    stack.appendChild(el);
    setTimeout(function () {
      el.classList.add('is-leaving');
      setTimeout(function () { el.remove(); }, 300);
    }, bad ? 5200 : 4000);
  }

  /* ------------------------------------------------------------- Navigation */
  function setupNav() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    function measure() {
      document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    }
    measure();
    window.addEventListener('resize', measure);

    var toggle = header.querySelector('[data-nav-toggle]');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = document.body.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && document.body.classList.contains('nav-open')) toggle.click();
      });
    }

    // Marque le lien correspondant à la page courante
    var here = location.pathname.replace(/index\.html$/, '') || '/';
    header.querySelectorAll('.nav-links a').forEach(function (link) {
      var target = link.getAttribute('href') || '';
      if (target.indexOf('#') === 0 || target.indexOf('/#') === 0) return;
      if (target.replace(/index\.html$/, '') === here) link.setAttribute('aria-current', 'page');
    });

    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function setupLogout() {
    document.querySelectorAll('[data-logout]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        localStorage.removeItem('sakina_user');
        window.location.href = '/';
      });
    });
  }

  /* ------------------------------------------------- Révélations au défilement */
  function setupReveal() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute('data-reveal'), 10);
        el.style.transitionDelay = (delay > 0 ? delay : 0) + 'ms';
        el.classList.add('is-visible');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (el) { io.observe(el); });
  }

  function init() {
    setupNav();
    setupLogout();
    setupReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.Sakina = {
    icon: icon,
    escapeHtml: escapeHtml,
    toast: toast,
    currentUser: currentUser
  };
})();
