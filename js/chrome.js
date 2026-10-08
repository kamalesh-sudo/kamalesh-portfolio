(function () {
  'use strict';
  var KS = window.KS;
  var root = document.documentElement;

  var SECTIONS = ['hero', 'about', 'work', 'education', 'skills', 'contact'];
  var AMBER = [255, 180, 84];
  var BLUE = [23, 147, 209];

  KS.state = { section: 0, augmentOffset: 0, standby: false };

  /* Conversion colour: amber at the top, machine blue by the footer. */
  function initAccent() {
    var last = '';
    KS.onScroll(function (y) {
      var max = Math.max(1, document.documentElement.scrollHeight - KS.vh);
      var t = KS.clamp(y / (max * 0.94));
      var eased = t * t * (3 - 2 * t) * 0.35 + t * 0.65;
      var rgb = AMBER.map(function (c, i) { return Math.round(KS.lerp(c, BLUE[i], eased)); }).join(' ');
      if (rgb !== last) {
        last = rgb;
        root.style.setProperty('--accent', 'rgb(' + rgb + ')');
        root.style.setProperty('--accent-rgb', rgb);
      }
      KS.state.scrollProgress = y / max;
    });
  }

  function currentSection(els) {
    var line = KS.vh * 0.45;
    var idx = 0;
    els.forEach(function (el, i) { if (el && el.getBoundingClientRect().top <= line) idx = i; });
    return idx;
  }

  function initNav() {
    var nav = document.querySelector('[data-nav]');
    var links = document.querySelectorAll('[data-nav-link]');
    var toggle = nav.querySelector('.nav-toggle');
    var overlay = document.getElementById('nav-overlay');
    var lastY = window.scrollY;
    var open = false;

    KS.onScroll(function (y) {
      if (!open && !nav.contains(document.activeElement)) {
        if (y > lastY + 6 && y > 140) nav.classList.add('is-hidden');
        else if (y < lastY - 6 || y < 140) nav.classList.remove('is-hidden');
      }
      lastY = y;
    });
    nav.addEventListener('focusin', function () { nav.classList.remove('is-hidden'); });

    KS.on('section', function (idx) {
      var id = SECTIONS[idx];
      links.forEach(function (a) {
        var on = a.getAttribute('data-nav-link') === id;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    });

    var overlayLinks = overlay.querySelectorAll('a');
    function setOpen(next) {
      open = next;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Open menu';
      overlay.hidden = !open;
      overlay.classList.toggle('is-open', open);
      root.style.overflow = open ? 'hidden' : '';
      if (open) { nav.classList.remove('is-hidden'); overlayLinks[0].focus(); }
    }
    toggle.addEventListener('click', function () { setOpen(!open); });
    overlayLinks.forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) {
      if (!open) return;
      if (e.key === 'Escape') { setOpen(false); toggle.focus(); return; }
      if (e.key !== 'Tab') return;
      var items = [toggle].concat(Array.prototype.slice.call(overlayLinks));
      var i = items.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
    });
    KS.on('resize', function () { if (open && !KS.isPhone()) setOpen(false); });
  }

  /* Side figure, AUGMENT readout, and the phone progress bar. */
  function initRail() {
    var rail = document.querySelector('[data-rail]');
    var implants = rail.querySelectorAll('.implant');
    var readout = rail.querySelector('[data-augment]');
    var bar = document.querySelector('.top-progress');
    var sectionEls = SECTIONS.map(function (id) { return document.getElementById(id); });
    var footer = document.getElementById('contact');
    var names = ['optic', 'neural', 'voice', 'core', 'arm interface', 'link'];
    var lastIdx = -1, lastPct = -1, lastStandby = null;

    KS.onScroll(function (y) {
      var idx = currentSection(sectionEls);
      var standby = footer.getBoundingClientRect().top < KS.vh * 0.55;
      var pct = Math.round(KS.clamp(KS.state.scrollProgress || 0) * 100);
      var shown = KS.clamp(pct + KS.state.augmentOffset, 0, 100);

      if (idx !== lastIdx || standby !== lastStandby) {
        implants.forEach(function (c, i) {
          var done = standby || i < idx;
          c.classList.toggle('is-done', done);
          c.classList.toggle('is-active', !standby && i === idx);
        });
        rail.classList.toggle('is-standby', standby);
        rail.setAttribute('aria-label', standby
          ? 'Augmentation complete, system in standby'
          : 'Augmentation progress: ' + names[idx] + ' implant active');
        if (idx !== lastIdx) { KS.state.section = idx; KS.emit('section', idx); }
        lastIdx = idx; lastStandby = standby;
      }
      if (shown !== lastPct) {
        readout.textContent = (standby ? 'STBY ' : '') + shown + '%';
        bar.style.setProperty('--progress', (pct / 100).toFixed(3));
        lastPct = shown;
      }
      readout.parentNode.classList.toggle('is-flicker', KS.state.augmentOffset < 0);
    });
  }

  function initCursor() {
    if (KS.touch) return;
    var ring = document.querySelector('.cursor-ring');
    var x = -100, y = -100, tx = -100, ty = -100, running = false;
    function loop() {
      x = KS.lerp(x, tx, 0.22); y = KS.lerp(y, ty, 0.22);
      ring.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.3) requestAnimationFrame(loop);
      else running = false;
    }
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY;
      ring.classList.add('is-on');
      ring.classList.toggle('is-hover', !!(e.target.closest && e.target.closest('a, button, input, textarea, [role="button"]')));
      if (!running) { running = true; requestAnimationFrame(loop); }
    }, { passive: true });
    document.addEventListener('pointerleave', function () { ring.classList.remove('is-on'); });
  }

  KS.initChrome = function () {
    initAccent();
    initNav();
    initRail();
    initCursor();
  };
})();
