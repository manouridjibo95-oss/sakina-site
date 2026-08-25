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
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V13"/><path d="M12 16.4h.01"/>',
    home: '<path d="M4 10.6 12 4l8 6.6V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1Z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.2 8.8-2 4.4-4.4 2 2-4.4Z"/>',
    chat: '<path d="M20.5 12c0 3.9-3.8 7-8.5 7a10 10 0 0 1-2.6-.34L4.5 20l1.2-3.4A6.5 6.5 0 0 1 3.5 12c0-3.9 3.8-7 8.5-7s8.5 3.1 8.5 7Z"/>',
    gauge: '<path d="M4 17a8.5 8.5 0 1 1 16 0"/><path d="m12 13.5 3.4-3.6"/><circle cx="12" cy="16.6" r="1.3"/>',
    crown: '<path d="M4 17.5h16"/><path d="m4 8 3.6 3L12 5.5 16.4 11 20 8v6H4Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7.4V12l3.2 2"/>',
    settings: '<circle cx="12" cy="12" r="2.9"/><path d="M19.2 14.4a1.5 1.5 0 0 0 .3 1.7l.1.1a1.8 1.8 0 1 1-2.5 2.5l-.1-.1a1.5 1.5 0 0 0-2.5 1v.3a1.8 1.8 0 1 1-3.6 0v-.2a1.5 1.5 0 0 0-2.6-1l-.1.1a1.8 1.8 0 1 1-2.5-2.5l.1-.1a1.5 1.5 0 0 0-1-2.5h-.3a1.8 1.8 0 1 1 0-3.6h.2a1.5 1.5 0 0 0 1-2.6l-.1-.1a1.8 1.8 0 1 1 2.5-2.5l.1.1a1.5 1.5 0 0 0 2.5-1v-.3a1.8 1.8 0 1 1 3.6 0v.2a1.5 1.5 0 0 0 2.6 1l.1-.1a1.8 1.8 0 1 1 2.5 2.5l-.1.1a1.5 1.5 0 0 0 1 2.5h.3a1.8 1.8 0 1 1 0 3.6h-.2a1.5 1.5 0 0 0-1.3.9Z"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4A2.5 2.5 0 0 1 14.5 10c0 1.7-2.5 2-2.5 3.6"/><path d="M12 16.8h.01"/>',
    logout: '<path d="M14.5 16.5v2a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5v-13A1.5 1.5 0 0 1 6 4h7a1.5 1.5 0 0 1 1.5 1.5v2"/><path d="M10 12h9.5"/><path d="m16.8 9 3 3-3 3"/>',
    bell: '<path d="M18 15.5V11a6 6 0 1 0-12 0v4.5L4.5 18h15Z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',
    chevron: '<path d="m9.5 6 6 6-6 6"/>'
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

  /* --------------------------------------------------------------- Durées */
  // « il y a 6 h », « 3 j » — format compact des listes de visiteurs
  function relativeTime(value) {
    var then = new Date(value).getTime();
    if (isNaN(then)) return '';
    var mins = Math.max(0, Math.round((Date.now() - then) / 60000));
    if (mins < 1) return "à l'instant";
    if (mins < 60) return mins + ' min';
    var hours = Math.round(mins / 60);
    if (hours < 24) return hours + ' h';
    var days = Math.round(hours / 24);
    if (days < 7) return days + ' j';
    var weeks = Math.round(days / 7);
    if (weeks < 5) return weeks + ' sem';
    return Math.round(days / 30) + ' mois';
  }

  /* ------------------------------------------------------ Profil du membre */
  var COMPLETION_FIELDS = ['first_name', 'age', 'city', 'gender', 'bio', 'practice', 'wali_name'];

  function completion(profile) {
    if (!profile) return 0;
    var filled = COMPLETION_FIELDS.filter(function (f) {
      return profile[f] !== null && profile[f] !== '' && profile[f] !== undefined;
    }).length;
    return Math.round((filled / COMPLETION_FIELDS.length) * 100);
  }

  var profileRequest = null;
  // Une seule requête de profil par page, partagée par le menu et la page elle-même
  function myProfile(refresh) {
    var user = currentUser();
    if (!user) return Promise.resolve(null);
    if (!profileRequest || refresh) {
      profileRequest = fetch('/api/get-profile?userId=' + encodeURIComponent(user.id))
        .then(function (res) { return res.json(); })
        .then(function (data) { return data.profile || null; })
        .catch(function () { return null; });
    }
    return profileRequest;
  }

  var intentionsRequest = null;
  // Idem pour les intentions : le menu et la page se partagent la réponse
  function myIntentions(refresh) {
    var user = currentUser();
    if (!user) return Promise.resolve({ received: [], sent: [] });
    if (!intentionsRequest || refresh) {
      intentionsRequest = fetch('/api/get-intentions?userId=' + encodeURIComponent(user.id))
        .then(function (res) { return res.json(); })
        .then(function (data) { return { received: data.received || [], sent: data.sent || [] }; })
        .catch(function () { return { received: [], sent: [] }; });
    }
    return intentionsRequest;
  }

  function avatarMarkup(photo, name, cls) {
    var initial = escapeHtml(String(name || '?').charAt(0).toUpperCase());
    return photo
      ? '<img class="' + cls + '" src="' + escapeHtml(photo).replace(/"/g, '&quot;') + '" alt="">'
      : '<div class="' + cls + ' avatar-fallback" aria-hidden="true">' + initial + '</div>';
  }

  /* ------------------------------------------------------- Fenêtre Premium */
  function premiumModal(options) {
    var opts = options || {};
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML =
      '<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="premiumModalTitle">' +
        '<div class="modal-mark">' + icon('lock', 26) + '</div>' +
        '<h2 id="premiumModalTitle">' + escapeHtml(opts.title || 'Réservé aux membres Premium') + '</h2>' +
        '<p>' + escapeHtml(opts.body ||
          "Vous voyez qui a consulté votre profil. Passez Premium pour ouvrir leur profil et voir tous vos visiteurs.") + '</p>' +
        '<a class="btn btn-gold btn-block" href="/#tarifs">' + icon('star', 17) + 'Devenir Premium</a>' +
        '<button class="modal-close" type="button">Fermer</button>' +
      '</div>';

    var previous = document.activeElement;
    function close() {
      overlay.classList.remove('is-open');
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', onKey);
      setTimeout(function () { overlay.remove(); }, 220);
      if (previous && previous.focus) previous.focus();
    }
    function onKey(e) { if (e.key === 'Escape') close(); }

    overlay.querySelector('.modal-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', onKey);

    document.body.appendChild(overlay);
    document.body.classList.add('modal-open');
    requestAnimationFrame(function () { overlay.classList.add('is-open'); });
    overlay.querySelector('.btn').focus();
    return close;
  }

  /* -------------------------------------------------------- Menu du compte */
  var ACCOUNT_LINKS = [
    { group: 'Mon compte', href: '/tableau-de-bord.html', icon: 'gauge', label: 'Tableau de bord' },
    { group: 'Mon compte', href: '/intentions.html', icon: 'clock', label: 'Historique des intentions' },
    { group: 'Mon compte', href: '/compatibilite.html', icon: 'sprout', label: 'Mes affinités' },
    { group: 'Mon compte', href: '/profil.html', icon: 'settings', label: 'Mon profil et mes informations' },
    { group: 'Assistance', href: '/#faq', icon: 'help', label: 'Aide et questions fréquentes' },
    { group: 'Assistance', href: '/#pourquoi', icon: 'shield', label: 'Pudeur et confidentialité' }
  ];

  function accountGroups() {
    var html = '';
    var current = null;
    ACCOUNT_LINKS.forEach(function (item) {
      if (item.group !== current) {
        if (current) html += '</div>';
        current = item.group;
        html += '<div class="account-section"><div class="account-section-title">' + escapeHtml(current) + '</div>';
      }
      html += '<a class="account-item" href="' + item.href + '">' +
        '<span class="account-item-icon">' + icon(item.icon, 19) + '</span>' +
        '<span class="account-item-label">' + escapeHtml(item.label) + '</span>' +
        '<span class="account-item-chevron">' + icon('chevron', 15) + '</span>' +
        '</a>';
    });
    return html + (current ? '</div>' : '');
  }

  function setupAccount() {
    var user = currentUser();
    var nav = document.querySelector('.site-header .nav');
    if (!user || !nav || nav.querySelector('[data-account]')) return;

    // Le compte remplace « Mon profil » et « Se déconnecter » dans la barre
    nav.querySelectorAll('.nav-actions [data-auth="member"]').forEach(function (el) { el.remove(); });

    var wrap = document.createElement('div');
    wrap.className = 'account';
    wrap.setAttribute('data-account', '');
    wrap.innerHTML =
      '<a class="account-bell" href="/intentions.html" aria-label="Mes intentions">' + icon('bell', 21) +
        '<span class="account-bell-dot" hidden></span></a>' +
      '<button class="account-trigger" type="button" aria-expanded="false" aria-haspopup="dialog" aria-label="Mon compte">' +
        avatarMarkup(null, user.email, 'account-avatar') +
      '</button>' +
      '<div class="account-menu" hidden>' +
        '<a class="account-head" href="/profil.html">' +
          avatarMarkup(null, user.email, 'account-head-avatar') +
          '<span class="account-head-text">' +
            '<span class="account-head-name">Mon compte</span>' +
            '<span class="account-head-sub">Profil à <b data-account-pct>–</b> complété</span>' +
            '<span class="account-head-bar"><span data-account-bar></span></span>' +
          '</span>' +
          '<span class="account-item-chevron">' + icon('chevron', 15) + '</span>' +
        '</a>' +
        '<div class="account-premium" data-account-premium>' +
          '<span class="account-premium-mark">' + icon('crown', 22) + '</span>' +
          '<div class="account-premium-text">' +
            '<strong>Passez à Premium</strong>' +
            '<span>Plus d’échanges, plus de visibilité et l’identité de vos visiteurs.</span>' +
          '</div>' +
          '<a class="btn btn-gold btn-sm btn-block" href="/#tarifs">Découvrir Premium ' + icon('chevron', 14) + '</a>' +
        '</div>' +
        accountGroups() +
        '<button class="account-item account-logout" type="button" data-logout>' +
          '<span class="account-item-icon">' + icon('logout', 19) + '</span>' +
          '<span class="account-item-label">Déconnexion</span>' +
        '</button>' +
      '</div>';

    var toggle = nav.querySelector('[data-nav-toggle]');
    if (toggle) nav.insertBefore(wrap, toggle); else nav.appendChild(wrap);

    var trigger = wrap.querySelector('.account-trigger');
    var menu = wrap.querySelector('.account-menu');

    function close() {
      wrap.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      setTimeout(function () { if (!wrap.classList.contains('is-open')) menu.hidden = true; }, 200);
    }
    function open() {
      menu.hidden = false;
      requestAnimationFrame(function () {
        wrap.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      });
    }
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (wrap.classList.contains('is-open')) close(); else open();
    });
    document.addEventListener('click', function (e) {
      if (wrap.classList.contains('is-open') && !wrap.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && wrap.classList.contains('is-open')) { close(); trigger.focus(); }
    });

    if (user.isPremium) markPremium(wrap);

    myProfile().then(function (profile) {
      if (!profile) return;
      var pct = completion(profile);
      wrap.querySelector('[data-account-pct]').textContent = pct + ' %';
      wrap.querySelector('[data-account-bar]').style.width = pct + '%';
      wrap.querySelector('.account-head-name').textContent = profile.first_name || 'Mon compte';
      if (profile.photo_data) {
        wrap.querySelectorAll('.account-avatar, .account-head-avatar').forEach(function (el) {
          var img = document.createElement('img');
          img.className = el.className.replace(' avatar-fallback', '');
          img.src = profile.photo_data;
          img.alt = '';
          el.replaceWith(img);
        });
      }
    });

    // Pastille sur la cloche : intentions reçues en attente de réponse
    myIntentions().then(function (data) {
      var pending = data.received.filter(function (i) { return i.status === 'pending'; }).length;
      if (!pending) return;
      var dot = wrap.querySelector('.account-bell-dot');
      dot.textContent = pending > 9 ? '9+' : String(pending);
      dot.hidden = false;
    });
  }

  function markPremium(scope) {
    // Mémorise le statut pour les pages suivantes, sans attendre une reconnexion
    try {
      var stored = currentUser();
      if (stored && !stored.isPremium) {
        stored.isPremium = true;
        localStorage.setItem('sakina_user', JSON.stringify(stored));
      }
    } catch (err) { /* stockage indisponible : sans conséquence */ }

    var card = (scope || document).querySelector('[data-account-premium]');
    if (!card) return;
    card.classList.add('is-member');
    card.innerHTML =
      '<span class="account-premium-mark">' + icon('crown', 22) + '</span>' +
      '<div class="account-premium-text"><strong>Membre Premium</strong>' +
      '<span>Vos visiteurs et vos échanges sont débloqués.</span></div>';
  }

  /* ------------------------------------------- Barre de navigation mobile */
  var TABS = [
    { href: '/', icon: 'home', label: 'Accueil' },
    { href: '/profils.html', icon: 'compass', label: 'Découvrir' },
    { href: '/compatibilite.html', icon: 'heart', label: 'Affinités' },
    { href: '/intentions.html', icon: 'mail', label: 'Intentions' },
    { href: '/tableau-de-bord.html', icon: 'gauge', label: 'Tableau' }
  ];

  function setupTabBar() {
    if (!currentUser()) return;
    if (document.body.classList.contains('thread-page')) return; // la messagerie a sa propre barre
    if (document.querySelector('.tabbar')) return;

    var here = location.pathname.replace(/index\.html$/, '') || '/';
    var bar = document.createElement('nav');
    bar.className = 'tabbar';
    bar.setAttribute('aria-label', 'Navigation rapide');
    bar.innerHTML = TABS.map(function (tab) {
      var active = tab.href === here ? ' aria-current="page"' : '';
      return '<a href="' + tab.href + '"' + active + '>' + icon(tab.icon, 22) +
        '<span>' + escapeHtml(tab.label) + '</span></a>';
    }).join('');
    document.body.appendChild(bar);
    document.body.classList.add('has-tabbar');
  }

  function init() {
    setupNav();
    setupAccount();
    setupLogout();
    setupTabBar();
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
    currentUser: currentUser,
    myProfile: myProfile,
    myIntentions: myIntentions,
    completion: completion,
    relativeTime: relativeTime,
    avatarMarkup: avatarMarkup,
    premiumModal: premiumModal,
    markPremium: markPremium
  };
})();
