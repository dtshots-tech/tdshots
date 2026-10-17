(function () {
  var GA_ID = 'G-WG93QG05LM';
  var ADSENSE_CLIENT = 'ca-pub-4682659743955327';
  var CLARITY_ID = 'wahptqmnwv';
  var STORAGE_KEY = 'cookieConsent';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  // Consent Mode v2 — default denied until the visitor actively accepts.
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });

  function loadScript(src, attrs) {
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    for (var k in attrs) { s.setAttribute(k, attrs[k]); }
    document.head.appendChild(s);
  }

  function loadClarity() {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  var trackersLoaded = false;
  function loadTrackers() {
    if (trackersLoaded) return;
    trackersLoaded = true;
    gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted'
    });
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + GA_ID);
    gtag('js', new Date());
    gtag('config', GA_ID);
    loadScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADSENSE_CLIENT, { crossorigin: 'anonymous' });
    loadClarity();
  }

  if (localStorage.getItem(STORAGE_KEY) === 'accepted') { loadTrackers(); }

  document.addEventListener('DOMContentLoaded', function () {
    var banner = document.getElementById('cookie-banner');
    if (!banner) return;
    var acceptBtn = document.getElementById('cookieAccept');
    var declineBtn = document.getElementById('cookieDecline');
    var existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      setTimeout(function () { banner.classList.add('show'); }, 800);
    }
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        localStorage.setItem(STORAGE_KEY, 'accepted');
        banner.classList.remove('show');
        loadTrackers();
      });
    }
    if (declineBtn) {
      declineBtn.addEventListener('click', function () {
        localStorage.setItem(STORAGE_KEY, 'declined');
        banner.classList.remove('show');
      });
    }
  });
})();
