(function () {
  'use strict';
  var KS = window.KS;

  /* Write CSS custom properties only when they change. */
  function vars(el, obj) {
    var cache = el.__vars || (el.__vars = {});
    for (var k in obj) {
      var v = typeof obj[k] === 'number' ? obj[k].toFixed(4) : obj[k];
      if (cache[k] !== v) { cache[k] = v; el.style.setProperty(k, v); }
    }
  }
  function clearVars(el) {
    if (!el.__vars) return;
    for (var k in el.__vars) el.style.removeProperty(k);
    el.__vars = {};
  }
  var easeOut = function (x) { return 1 - Math.pow(1 - x, 3); };
  var easeInOut = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

  function typeText(el, text, cps, done) {
    var t0 = performance.now();
    el.__typing = (el.__typing || 0) + 1;
    var token = el.__typing;
    (function step(now) {
      if (token !== el.__typing) return;
      var n = Math.min(text.length, Math.floor((now - t0) / 1000 * cps) + 1);
      el.textContent = text.slice(0, n);
      if (n < text.length) requestAnimationFrame(step);
      else if (done) done();
    })(t0);
  }

  /* ---------------------------------------------------------------- About */
  function initAbout() {
    var blocks = document.querySelectorAll('[data-about-block]');
    var implants = document.querySelectorAll('[data-about-implant]');
    var last = -1;
    KS.onScroll(function () {
      var reached = 0;
      blocks.forEach(function (b) { if (b.getBoundingClientRect().top < KS.vh * 0.62) reached++; });
      if (reached === last) return;
      last = reached;
      implants.forEach(function (c, i) {
        c.classList.toggle('is-done', i < reached - 1);
        c.classList.toggle('is-active', i === reached - 1);
      });
    });

    var stats = document.querySelectorAll('[data-count]');
    if (KS.reduced || !('IntersectionObserver' in window)) return;
    stats.forEach(function (el) { el.textContent = el.getAttribute('data-from') || '0'; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target;
        var to = +el.getAttribute('data-count'), from = +(el.getAttribute('data-from') || 0);
        var t0 = performance.now();
        (function step(now) {
          var k = KS.clamp((now - t0) / 900);
          el.textContent = Math.round(KS.lerp(from, to, easeOut(k)));
          if (k < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, { threshold: 0.6 });
    stats.forEach(function (el) { io.observe(el); });
  }

  /* About -> Work: optic feed hands off to the server rack. */
  function initRack() {
    var work = document.getElementById('work');
    var optic = document.querySelector('[data-reel]');
    KS.onScroll(function () {
      if (KS.reduced) { clearVars(work); if (optic) clearVars(optic); return; }
      var r = work.getBoundingClientRect();
      if (r.top > KS.vh * 1.2 || r.top < -KS.vh) return;
      var p = KS.clamp((KS.vh * 0.95 - r.top) / (KS.vh * 0.6));
      vars(work, { '--rack': easeOut(p) });
      if (optic) {
        var o = optic.getBoundingClientRect();
        var leave = KS.clamp((KS.vh * 0.3 - o.top) / (KS.vh * 0.5));
        vars(optic, { '--leave': leave });
      }
    });
  }

  /* ---------------------------------------------------------------- Work */
  function initWork() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    KS.onScroll(function () {
      if (KS.reduced || KS.isPhone() && KS.vh < 640) { cards.forEach(clearVars); return; }
      var rects = cards.map(function (c) { return c.getBoundingClientRect(); });
      if (rects[0].top > KS.vh || rects[rects.length - 1].bottom < 0) return;
      cards.forEach(function (card, i) {
        var next = rects[i + 1];
        var cover = next ? KS.clamp(1 - (next.top - rects[i].top - 16) / (KS.vh * 0.55)) : 0;
        vars(card, { '--cover': cover });
      });
    });

    var hoverable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    cards.forEach(function (card) {
      var btn = card.querySelector('.card-more');
      var pinned = false;
      function set(open) {
        card.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
        btn.textContent = open ? 'Less' : 'Details';
      }
      btn.addEventListener('click', function () { pinned = !card.classList.contains('is-open') || !pinned; set(pinned); });
      if (hoverable) {
        card.addEventListener('mouseenter', function () { set(true); });
        card.addEventListener('mouseleave', function () { if (!pinned) set(false); });
      }
    });

    KS.watchVisibility(cards);
  }

  function initSegGrid() {
    var svg = document.querySelector('[data-seg-grid]');
    if (!svg) return;
    var NS = 'http://www.w3.org/2000/svg';
    var classes = ['#1793d1', '#38d0ff', '#ffb454', '#d7e3ee'];
    var cols = 10, rows = 6, cw = 20, ch = 18, ox = 20, oy = 18;
    var html = '';
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var n = Math.sin(c * 0.9 + r * 0.6) + Math.cos(r * 1.3 - c * 0.4);
        var cls = n > 1.1 ? 0 : n > 0.2 ? 1 : n > -0.7 ? 2 : 3;
        var x = ox + c * cw, y = oy + r * ch;
        html += '<rect class="seg-base" x="' + x + '" y="' + y + '" width="' + (cw - 2) + '" height="' + (ch - 2) + '"/>';
        html += '<rect class="seg-cell" style="--c:' + c + ';fill:' + classes[cls] + '" x="' + x + '" y="' + y + '" width="' + (cw - 2) + '" height="' + (ch - 2) + '"/>';
      }
    }
    html += '<rect class="seg-sweep" x="' + ox + '" y="' + (oy - 6) + '" width="2" height="' + (rows * ch + 10) + '"/>';
    html += '<text class="v-label" x="20" y="150">CLASSES 04 // WATER VEG URBAN BARE</text>';
    svg.innerHTML = html;
    svg.setAttribute('xmlns', NS);
  }

  /* ---------------------------------------------------------------- Work -> Education: memory rewind */
  function initRewind() {
    var tx = document.querySelector('[data-rewind]');
    var host = tx.querySelector('[data-rewind-strips]');
    var tpl = tx.querySelector('[data-rewind-recap]');
    var STRIPS = 12;
    for (var i = 0; i < STRIPS; i++) {
      var strip = document.createElement('div');
      strip.className = 'strip';
      strip.style.setProperty('--k', i);
      strip.style.setProperty('--dir', i % 2 ? -1 : 1);
      strip.style.setProperty('--amp', 6 + (i * 7) % 11);
      var inner = document.createElement('div');
      inner.className = 'strip-inner';
      inner.appendChild(tpl.content.cloneNode(true));
      strip.appendChild(inner);
      host.appendChild(strip);
    }

    KS.onScroll(function () {
      if (KS.reduced) { clearVars(tx); KS.state.augmentOffset = 0; return; }
      var r = tx.getBoundingClientRect();
      if (r.top > KS.vh || r.bottom < 0) { if (KS.state.augmentOffset) KS.state.augmentOffset = 0; return; }
      var range = Math.max(1, r.height - KS.vh);
      var enter = KS.clamp(1 - r.top / KS.vh);
      var p = KS.clamp(-r.top / range);
      var shear = Math.sin(Math.PI * KS.seg(p, 0, 0.85));
      var after = (-r.top - range) / KS.vh;
      var alpha = KS.seg(enter, 0.35, 1) * (1 - KS.seg(after, 0.05, 0.5));
      vars(tx, { '--rw-x': shear * (0.6 + 0.4 * Math.sin(p * 40)), '--rw-a': alpha });
      KS.state.augmentOffset = p > 0.12 && p < 0.8 ? -Math.max(1, Math.round(5 * shear)) : 0;
    });
  }

  /* ---------------------------------------------------------------- Education */
  function initEducation() {
    var edu = document.getElementById('education');
    var inner = edu.querySelector('.edu-inner');
    KS.onScroll(function () {
      if (KS.reduced) { clearVars(inner); return; }
      var top = edu.getBoundingClientRect().top;
      if (top > KS.vh * 1.1 || top < -KS.vh) return;
      var q = KS.clamp((KS.vh - top) / (KS.vh * 0.55));
      vars(inner, { '--blur': (1 - easeOut(q)) * 8 });
    });

    var log = edu.querySelector('[data-origin-log]');
    var lines = Array.prototype.slice.call(log.children);
    var certs = edu.querySelector('[data-certs]');
    var list = KS.config.certifications || [];
    if (list.length) {
      certs.innerHTML = '';
      list.forEach(function (c, i) {
        var li = document.createElement('li');
        li.className = 'cert';
        li.innerHTML = '<span class="cert-k">CERT // ' + String(i + 1).padStart(2, '0') + '</span><b></b><span class="cert-meta"></span>';
        li.querySelector('b').textContent = c.name;
        li.querySelector('.cert-meta').textContent = [c.issuer, c.date].filter(Boolean).join(' · ');
        if (c.url) {
          var a = document.createElement('a');
          a.href = c.url; a.target = '_blank'; a.rel = 'noopener';
          a.className = 'cert-link';
          a.textContent = 'View credential';
          li.appendChild(a);
        }
        certs.appendChild(li);
      });
    }
    var tiles = Array.prototype.slice.call(certs.children);

    if (KS.reduced || !('IntersectionObserver' in window)) {
      tiles.forEach(function (t) { t.classList.add('is-in'); });
      return;
    }
    var texts = lines.map(function (li) { return li.innerHTML; });
    lines.forEach(function (li) { li.classList.add('is-waiting'); });
    tiles.forEach(function (t) { t.classList.add('is-waiting'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        if (e.target === log) {
          lines.forEach(function (li, i) {
            setTimeout(function () {
              var year = li.querySelector('span').textContent;
              var rest = li.textContent.slice(year.length);
              li.classList.remove('is-waiting');
              li.innerHTML = '<span>' + year + '</span><em></em>';
              typeText(li.querySelector('em'), rest, 55, function () { li.innerHTML = texts[i]; });
            }, i * 650);
          });
        } else {
          tiles.forEach(function (t, i) {
            setTimeout(function () { t.classList.remove('is-waiting'); t.classList.add('is-in'); }, i * 120);
          });
        }
      });
    }, { threshold: 0.4 });
    io.observe(log);
    io.observe(certs);
  }

  /* ---------------------------------------------------------------- Skills + module install */
  function initSkills() {
    var host = document.querySelector('[data-bays]');
    var skills = KS.config.skills || [];
    var LEVELS = { learning: 'learning', working: 'working', strong: 'strong' };
    skills.forEach(function (bay, b) {
      var sec = document.createElement('section');
      sec.className = 'bay';
      sec.style.setProperty('--bay-delay', (b * 0.3) + 's');
      var head = document.createElement('div');
      head.className = 'bay-head';
      var h3 = document.createElement('h3');
      h3.textContent = bay.bay;
      var status = document.createElement('span');
      status.className = 'bay-status';
      status.setAttribute('aria-hidden', 'true');
      status.textContent = 'BAY 0' + (b + 1) + ' // EMPTY';
      head.appendChild(h3); head.appendChild(status);
      var ul = document.createElement('ul');
      ul.className = 'slots';
      bay.chips.forEach(function (chip, j) {
        var level = LEVELS[chip[1]] || 'working';
        var li = document.createElement('li');
        li.className = 'slot lvl-' + level;
        li.style.setProperty('--from', j % 2 ? 1 : -1);
        li.style.setProperty('--delay', (b * 0.3 + 0.5 + j * 0.09).toFixed(2) + 's');
        li.innerHTML = '<span class="skill"></span>';
        li.firstChild.textContent = chip[0];
        var sr = document.createElement('span');
        sr.className = 'sr-only';
        sr.textContent = ' (' + level + ')';
        li.firstChild.appendChild(sr);
        ul.appendChild(li);
      });
      sec.appendChild(head); sec.appendChild(ul);
      host.appendChild(sec);
    });

    var section = document.getElementById('skills');
    var bays = Array.prototype.slice.call(host.children);
    var installed = false, timers = [];
    function install(on) {
      installed = on;
      timers.forEach(clearTimeout); timers = [];
      bays.forEach(function (bay, b) {
        var status = bay.querySelector('.bay-status');
        if (!on) {
          bay.classList.remove('is-installed', 'is-loading');
          status.__typing = (status.__typing || 0) + 1;
          status.textContent = 'BAY 0' + (b + 1) + ' // EMPTY';
          return;
        }
        timers.push(setTimeout(function () {
          bay.classList.add('is-loading');
          typeText(status, 'LOADING MODULE ... OK', 60);
        }, b * 300));
        timers.push(setTimeout(function () { bay.classList.add('is-installed'); }, b * 300 + 120));
      });
    }
    if (KS.reduced) { bays.forEach(function (bay) { bay.classList.add('is-installed'); bay.querySelector('.bay-status').textContent = 'MODULE OK'; }); }
    KS.onScroll(function () {
      if (KS.reduced) { if (!installed) { installed = true; bays.forEach(function (bay) { bay.classList.add('is-installed'); }); } return; }
      var top = host.getBoundingClientRect().top;
      if (!installed && top < KS.vh * 0.72) install(true);
      else if (installed && top > KS.vh * 0.95) install(false);
    });
    KS.on('motionchange', function () { if (KS.reduced) install(true); });
    KS.watchVisibility([section]);
  }

  /* ---------------------------------------------------------------- Skills -> Footer: power-down */
  function initPowerDown() {
    var pin = document.querySelector('[data-power]');
    var board = pin.querySelector('[data-board]');
    var footer = document.getElementById('contact');
    var stickTop = 0, pad = 1;
    var spacer = document.createElement('div');
    spacer.className = 'power-spacer';
    spacer.setAttribute('aria-hidden', 'true');
    pin.appendChild(spacer);

    function measure() {
      var h = board.offsetHeight;
      stickTop = KS.vh >= h ? (KS.vh - h) / 2 : KS.vh - h;
      pad = spacer.offsetHeight || 1;
      board.style.setProperty('--stick-top', stickTop.toFixed(1) + 'px');
      board.style.setProperty('--origin-y', (KS.vh / 2 - stickTop).toFixed(1) + 'px');
    }
    measure();
    KS.on('resize', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    if ('ResizeObserver' in window) new ResizeObserver(measure).observe(board);

    KS.onScroll(function () {
      if (KS.reduced) { clearVars(board); clearVars(footer); return; }
      var r = pin.getBoundingClientRect();
      if (r.bottom < -KS.vh || r.top > KS.vh * 2) return;
      var p = KS.clamp((stickTop - r.top) / pad);
      var squeezeY = easeInOut(KS.seg(p, 0.32, 0.62));
      var squeezeX = easeInOut(KS.seg(p, 0.65, 0.86));
      vars(board, {
        '--sy': 1 - squeezeY * 0.996,
        '--sx': 1 - squeezeX * 0.992,
        '--flash': KS.seg(p, 0.42, 0.62) * (1 - KS.seg(p, 0.94, 1) * 0.6),
        '--board-a': 1 - KS.seg(p, 0.88, 1)
      });
      var f = KS.clamp((KS.vh - footer.getBoundingClientRect().top) / (KS.vh * 0.45));
      vars(footer, { '--foot': easeOut(f) });
    });
  }

  KS.initSections = function () {
    initAbout();
    initRack();
    initWork();
    initSegGrid();
    initRewind();
    initEducation();
    initSkills();
    initPowerDown();
  };
})();
