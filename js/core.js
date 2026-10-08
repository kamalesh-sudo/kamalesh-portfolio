(function () {
  'use strict';

  var root = document.documentElement;
  var reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var touchQuery = window.matchMedia('(hover: none), (pointer: coarse)');
  var phoneQuery = window.matchMedia('(max-width: 820px)');

  var KS = window.KS = {
    config: window.KS_CONFIG || { placeholders: {} },
    reduced: reduceQuery.matches,
    touch: touchQuery.matches,
    clamp: function (v, a, b) { return Math.min(b === undefined ? 1 : b, Math.max(a || 0, v)); },
    lerp: function (a, b, k) { return a + (b - a) * k; },
    seg: function (v, a, b) { return KS.clamp((v - a) / (b - a)); },
    isPhone: function () { return phoneQuery.matches; },

    ph: function (key) {
      var entry = KS.config.placeholders[key];
      return entry && entry.value ? entry.value : null;
    }
  };

  function applyMotionFlags() {
    KS.reduced = reduceQuery.matches;
    root.classList.toggle('reduced', KS.reduced);
  }
  applyMotionFlags();
  if (reduceQuery.addEventListener) reduceQuery.addEventListener('change', function () { applyMotionFlags(); KS.emit('motionchange'); });
  root.classList.toggle('is-touch', KS.touch);

  /* Tiny event bus so modules can react to shared state without knowing each other. */
  var handlers = {};
  KS.on = function (name, fn) { (handlers[name] = handlers[name] || []).push(fn); };
  KS.emit = function (name, data) { (handlers[name] || []).forEach(function (fn) { fn(data); }); };

  /*
   * Scroll registry. Each effect is called at most once per frame with the
   * current scroll position. Effects are pure functions of scroll, which keeps
   * every scroll-linked transition reversible.
   */
  var effects = [];
  var ticking = false;
  KS.vh = window.innerHeight;
  KS.onScroll = function (fn) { effects.push(fn); };
  function frame() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    for (var i = 0; i < effects.length; i++) effects[i](y);
  }
  KS.requestScrollFrame = function () {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  };
  window.addEventListener('scroll', KS.requestScrollFrame, { passive: true });
  window.addEventListener('resize', function () {
    KS.vh = window.innerHeight;
    KS.emit('resize');
    KS.requestScrollFrame();
  });

  /* Progress of an element through the viewport, 0 when its top hits `start`, 1 after `length` px. */
  KS.progress = function (el, start, length) {
    var top = el.getBoundingClientRect().top;
    return KS.clamp((start - top) / length);
  };

  /* Toggle `.is-offscreen` so CSS loops and rAF loops only run while visible. */
  KS.watchVisibility = function (els, cb, margin) {
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { cb && cb(el, true); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.classList.toggle('is-offscreen', !e.isIntersecting);
        if (cb) cb(e.target, e.isIntersecting);
      });
    }, { rootMargin: margin || '80px 0px' });
    els.forEach(function (el) { io.observe(el); });
    return io;
  };

  /* Apply placeholder values from site-config.js to the markup. */
  KS.applyConfig = function () {
    document.querySelectorAll('[data-ph-href]').forEach(function (a) {
      var key = a.getAttribute('data-ph-href');
      var value = KS.ph(key);
      if (value) {
        a.href = a.hasAttribute('data-mailto') ? 'mailto:' + value : value;
        a.classList.remove('is-pending');
        a.removeAttribute('aria-disabled');
      } else {
        a.removeAttribute('href');
        a.classList.add('is-pending');
        a.setAttribute('aria-disabled', 'true');
        a.setAttribute('title', 'Link coming soon ({{' + key + '}})');
      }
    });

    document.querySelectorAll('[data-ph-text]').forEach(function (el) {
      var value = KS.ph(el.getAttribute('data-ph-text'));
      if (value) { el.textContent = value; el.classList.remove('ph'); el.removeAttribute('title'); }
    });

    var email = KS.ph('EMAIL');
    var emailItem = document.querySelector('[data-email-item]');
    if (emailItem) emailItem.hidden = !email;

    var endpoint = KS.ph('CONTACT_FORM_ENDPOINT');
    var form = document.querySelector('[data-contact-form]');
    if (form && endpoint) form.action = endpoint;

    KS.portraitSrc = KS.ph('PHOTO_PORTRAIT_CUTOUT') || KS.ph('PHOTO_PORTRAIT_FALLBACK') || KS.ph('PORTRAIT_STANDIN');
    KS.portraitFramed = !KS.ph('PHOTO_PORTRAIT_CUTOUT') && !!KS.ph('PHOTO_PORTRAIT_FALLBACK');
  };
})();
