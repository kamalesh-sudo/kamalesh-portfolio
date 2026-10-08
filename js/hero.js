(function () {
  'use strict';
  var KS = window.KS;
  var root = document.documentElement;
  var GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>';

  function setupPortrait(hero) {
    var src = KS.portraitSrc;
    var portrait = hero.querySelector('[data-portrait]');
    document.querySelectorAll('[data-portrait-img]').forEach(function (img) {
      if (src && img.getAttribute('src') !== src) img.src = src;
    });
    if (KS.portraitFramed) portrait.classList.add('is-framed');
    else if (src) portrait.style.setProperty('--portrait-mask', 'url("' + new URL(src, location.href).href + '")');

    var labels = (KS.config.heroLabels || []).slice(0, 4);
    hero.querySelectorAll('[data-hero-label]').forEach(function (pill, i) {
      if (labels[i]) pill.textContent = labels[i]; else pill.remove();
    });

    var img = hero.querySelector('.portrait-human');
    return new Promise(function (resolve) {
      var done = function () { resolve(); };
      setTimeout(done, 6000);
      if (img.complete && img.naturalWidth) { (img.decode ? img.decode() : Promise.resolve()).then(done, done); return; }
      img.addEventListener('load', function () { (img.decode ? img.decode() : Promise.resolve()).then(done, done); }, { once: true });
      img.addEventListener('error', done, { once: true });
    });
  }

  /* Letter-by-letter scramble that settles left to right. */
  function scramble(el, startDelay, stagger, duration) {
    var text = el.getAttribute('data-text') || el.textContent.trim();
    el.setAttribute('data-text', text);
    el.textContent = '';
    var letters = text.split('').map(function (ch, i) {
      var span = document.createElement('span');
      span.className = 'ch';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = ch === ' ' ? '\u00a0' : '';
      el.appendChild(span);
      return { span: span, ch: ch, start: startDelay + i * stagger };
    });
    var t0 = performance.now(), lastSwap = 0, raf;
    function tick(now) {
      var t = now - t0, swap = now - lastSwap > 45, pending = false;
      if (swap) lastSwap = now;
      letters.forEach(function (l) {
        if (l.ch === ' ' || l.settled) return;
        if (t < l.start) { pending = true; return; }
        if (t >= l.start + duration) {
          l.span.textContent = l.ch; l.span.classList.remove('is-scrambling'); l.settled = true; return;
        }
        pending = true;
        if (swap) { l.span.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0]; l.span.classList.add('is-scrambling'); }
      });
      if (pending) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return function settle() {
      cancelAnimationFrame(raf);
      letters.forEach(function (l) { l.span.textContent = l.ch === ' ' ? '\u00a0' : l.ch; l.span.classList.remove('is-scrambling'); });
    };
  }

  function typeLine(li, duration) {
    var text = li.getAttribute('data-boot-line');
    var t0 = performance.now();
    (function step(now) {
      var k = KS.clamp((now - t0) / duration);
      li.textContent = text.slice(0, Math.ceil(text.length * k));
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  function runBoot(hero) {
    var timers = [];
    var settlers = [];
    var finished = false;
    var at = function (ms, fn) { timers.push(setTimeout(fn, ms)); };
    var on = function (sel) { var el = hero.querySelector(sel); if (el) el.classList.add('on'); };
    var bootList = hero.querySelector('.boot');
    var name = hero.querySelector('.hero-name');

    function finish() {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      settlers.forEach(function (s) { s(); });
      name.querySelectorAll('[data-scramble]').forEach(function (el) {
        if (!el.hasAttribute('data-text')) return;
        el.textContent = el.getAttribute('data-text');
      });
      root.classList.remove('boot-pending');
      hero.classList.remove('crt-on');
      try { sessionStorage.setItem('ks-booted', '1'); } catch (e) {}
      ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (ev) { window.removeEventListener(ev, finish); });
      window.removeEventListener('scroll', onScroll);
      KS.emit('heroready');
    }
    function onScroll() { if (window.scrollY > 8) finish(); }
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (ev) { window.addEventListener(ev, finish, { passive: true }); });
    window.addEventListener('scroll', onScroll, { passive: true });

    hero.classList.add('crt-on');
    bootList.querySelectorAll('li').forEach(function (li, i) { at(300 + i * 230, function () { typeLine(li, 200); }); });
    at(1500, function () { bootList.classList.add('is-out'); });
    at(1700, function () { on('.layer-portrait'); });
    at(2200, function () {
      name.classList.add('on');
      name.querySelectorAll('[data-scramble]').forEach(function (el, i) {
        settlers.push(scramble(el, i * 220, 55, 280));
      });
    });
    at(3000, function () { on('[data-boot="chip"]'); });
    at(3150, function () { on('[data-boot="line"]'); });
    at(3250, function () { on('[data-boot="btn1"]'); });
    at(3400, function () { on('[data-boot="btn2"]'); on('[data-boot="labels"]'); });
    at(3550, function () { on('[data-boot="socials"]'); });
    at(3900, function () { on('[data-boot="cue"]'); });
    at(4500, finish);
  }

  /* Pointer-driven tilt and parallax; touch devices use the CSS sway instead. */
  function setupDepth(hero) {
    if (KS.touch) return;
    var stage = hero.querySelector('[data-stage]');
    var pin = hero.querySelector('.hero-pin');
    var mx = 0, my = 0, tx = 0, ty = 0, sx = 50, sy = 38, tsx = 50, tsy = 38, running = false;

    function loop() {
      mx = KS.lerp(mx, tx, 0.08); my = KS.lerp(my, ty, 0.08);
      sx = KS.lerp(sx, tsx, 0.12); sy = KS.lerp(sy, tsy, 0.12);
      stage.style.setProperty('--mx', mx.toFixed(4));
      stage.style.setProperty('--my', my.toFixed(4));
      stage.style.setProperty('--sx', sx.toFixed(2) + '%');
      stage.style.setProperty('--sy', sy.toFixed(2) + '%');
      if (Math.abs(tx - mx) + Math.abs(ty - my) + Math.abs(tsx - sx) / 100 > 0.002) requestAnimationFrame(loop);
      else running = false;
    }
    function kick() { if (!running && !KS.reduced) { running = true; requestAnimationFrame(loop); } }

    pin.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      tx = KS.clamp((e.clientX / window.innerWidth - 0.5) * 2, -1, 1);
      ty = KS.clamp((e.clientY / window.innerHeight - 0.5) * 2, -1, 1);
      var r = stage.getBoundingClientRect();
      tsx = ((e.clientX - r.left) / r.width) * 100;
      tsy = ((e.clientY - r.top) / r.height) * 100;
      kick();
    }, { passive: true });
    pin.addEventListener('pointerleave', function () { tx = 0; ty = 0; tsx = 50; tsy = 38; kick(); });
  }

  /* Hero -> About "X-ray scan", a pure function of scroll position. */
  function setupXray(hero) {
    var last = '';
    KS.onScroll(function () {
      if (KS.reduced) {
        if (last !== 'r') { hero.style.cssText = ''; last = 'r'; }
        return;
      }
      var r = hero.getBoundingClientRect();
      if (r.bottom < -50) return;
      var p = KS.clamp(-r.top / Math.max(1, r.height - KS.vh));
      var xp = KS.seg(p, 0, 0.45);
      var scan = KS.seg(p, 0.06, 0.82);
      var hand = KS.seg(p, 0.84, 1);
      var key = p.toFixed(4);
      if (key === last) return;
      last = key;
      hero.style.setProperty('--xp', xp.toFixed(4));
      hero.style.setProperty('--scan', scan.toFixed(4));
      hero.style.setProperty('--hand', hand.toFixed(4));
      hero.style.setProperty('--xl', scan > 0 && scan < 1 ? '1' : '0');
    });
  }

  KS.initHero = function () {
    var hero = document.getElementById('hero');
    var ready = setupPortrait(hero);
    setupDepth(hero);
    setupXray(hero);

    if (!root.classList.contains('boot-pending')) { KS.emit('heroready'); return; }
    if (window.scrollY > KS.vh * 0.5 || location.hash.length > 1) {
      root.classList.remove('boot-pending');
      KS.emit('heroready');
      return;
    }
    ready.then(function () { runBoot(hero); });
  };
})();
