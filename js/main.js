(function () {
  'use strict';
  var KS = window.KS;
  if (!KS) return;

  function safe(name) {
    try { if (typeof KS[name] === 'function') KS[name](); }
    catch (err) { if (window.console) console.error('[ks] ' + name + ' failed', err); }
  }

  KS.applyConfig();
  safe('initHero');
  safe('initSections');
  safe('initReelEmbed');
  safe('initFooter');
  safe('initChrome');

  /* One-shot fade for any `.reveal` element, and the fallback when observers are missing. */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  KS.requestScrollFrame();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(KS.requestScrollFrame);
})();
