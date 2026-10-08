(function () {
  'use strict';
  var KS = window.KS;

  var W = 1600, H = 900, DURATION = 15;
  var TICKS = [2.6, 5.6, 8.6, 11.4, 13.8];
  var STORY_TIMES = [2.2, 4.85, 7.55, 10.95, 13.55];
  var C = {
    void: '#05070b', panel: '#0b1118', line: '#1b2733', text: '#d7e3ee', muted: '#8a9aab',
    blue: '#1793d1', glow: '#38d0ff', alert: '#ff4d6d', ok: '#63e6a5'
  };
  var MONO = '"JetBrains Mono", ui-monospace, Consolas, monospace';
  var HEAD = '"Chakra Petch", "Segoe UI", sans-serif';
  var CAPTIONS = [
    { t: 0.25, end: 2.4, text: 'A product people trust.' },
    { t: 2.75, end: 5.4, text: 'Spot the weak point.' },
    { t: 5.75, end: 8.4, text: 'Prove it. Harmlessly.' },
    { t: 8.75, end: 11.2, text: 'Write it up clearly.' },
    { t: 11.55, end: 13.65, text: 'Help them fix it.' }
  ];

  var WIN = { x: 440, y: 170, w: 720, h: 470 };
  var DOC = { x: 610, y: 120, w: 380, h: 560 };
  var BTN = { x: 650, y: 448, w: 300, h: 50 };
  var BX = BTN.x + BTN.w / 2, BY = BTN.y + BTN.h / 2;

  var clamp = function (v, a, b) { return Math.min(b === undefined ? 1 : b, Math.max(a || 0, v)); };
  var lerp = function (a, b, k) { return a + (b - a) * k; };
  var seg = function (t, a, b) { return clamp((t - a) / (b - a)); };
  var E = {
    out: function (x) { return 1 - Math.pow(1 - x, 3); },
    inOut: function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; },
    in: function (x) { return x * x * x; },
    back: function (x) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
  };
  function rgba(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function mixHex(h1, h2, k) {
    var a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16);
    var r = Math.round(lerp(a >> 16, b >> 16, k)), g = Math.round(lerp((a >> 8) & 255, (b >> 8) & 255, k)), bl = Math.round(lerp(a & 255, b & 255, k));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
  }
  function lerpRect(a, b, k) { return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k), h: lerp(a.h, b.h, k) }; }

  function chamferPath(ctx, x, y, w, h, c) {
    ctx.beginPath();
    ctx.moveTo(x + c, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + h - c);
    ctx.lineTo(x + w - c, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + c); ctx.closePath();
  }

  /* ---------------------------------------------------------------- scene parts */

  function backdrop(ctx) {
    ctx.fillStyle = C.void;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(215,227,238,0.05)';
    for (var x = 50; x < W; x += 50) for (var y = 50; y < H; y += 50) ctx.fillRect(x - 1, y - 1, 2, 2);
  }

  function windowFrame(ctx, r, draw, t) {
    var per = 2 * (r.w + r.h);
    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = C.blue;
    ctx.shadowColor = rgba(C.glow, 0.35);
    ctx.shadowBlur = 16;
    ctx.fillStyle = rgba(C.panel, Math.min(1, draw * 1.2) * 0.9);
    chamferPath(ctx, r.x, r.y, r.w, r.h, 18);
    ctx.fill();
    if (draw < 1) ctx.setLineDash([per * draw, per]);
    ctx.stroke();
    ctx.restore();
    var chrome = seg(draw, 0.75, 1);
    if (chrome <= 0) return;
    var morph = seg(r.w, DOC.w, WIN.w);
    ctx.save();
    ctx.globalAlpha = chrome * morph;
    ctx.strokeStyle = rgba(C.blue, 0.6);
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(r.x, r.y + 42); ctx.lineTo(r.x + r.w, r.y + 42); ctx.stroke();
    ctx.fillStyle = rgba(C.blue, 0.7);
    for (var i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(r.x + 28 + i * 20, r.y + 21, 5, 0, Math.PI * 2); ctx.fill(); }
    ctx.strokeStyle = rgba(C.blue, 0.45);
    chamferPath(ctx, r.x + 110, r.y + 12, Math.max(0, r.w - 220), 18, 5);
    ctx.stroke();
    ctx.restore();
  }

  function formParts(ctx, t, alpha, off) {
    if (alpha <= 0) return;
    var parts = [
      { x: 650, y: 262, w: 170, h: 20, kind: 'title' },
      { x: 650, y: 308, w: 300, h: 46, kind: 'input' },
      { x: 650, y: 370, w: 300, h: 46, kind: 'input' }
    ];
    ctx.save();
    ctx.translate(off.x, off.y);
    parts.forEach(function (p, i) {
      var k = E.out(seg(t, 0.8 + i * 0.16, 1.15 + i * 0.16));
      if (t > 1.6) k = 1;
      if (k <= 0) return;
      ctx.globalAlpha = alpha * k;
      var dy = (1 - k) * 16;
      if (p.kind === 'title') {
        ctx.fillStyle = rgba(C.text, 0.85);
        ctx.fillRect(p.x, p.y + dy, p.w, p.h);
        ctx.fillStyle = rgba(C.text, 0.25);
        ctx.fillRect(p.x + p.w + 14, p.y + 6 + dy, 70, 8);
      } else {
        ctx.strokeStyle = rgba(C.blue, 0.7);
        ctx.lineWidth = 2;
        chamferPath(ctx, p.x, p.y + dy, p.w, p.h, 8);
        ctx.stroke();
        ctx.fillStyle = rgba(C.text, 0.18);
        ctx.fillRect(p.x + 16, p.y + 19 + dy, i === 1 ? 120 : 90, 8);
      }
    });
    ctx.restore();
  }

  function button(ctx, t, alpha, off) {
    var k = E.out(seg(t, 1.28, 1.6));
    if (t > 1.6) k = 1;
    if (alpha <= 0 || k <= 0) return;
    var pulse = 0;
    if (t >= 4.2 && t < 5.1) {
      var u = t - 4.2;
      pulse = 0.5 + 0.5 * Math.sin(Math.pow(u, 1.5) * 26 - Math.PI / 2);
    }
    var marked = t >= 5.1 && t < 13.8;
    var fixK = seg(t, 11.9, 12.2);
    ctx.save();
    ctx.translate(off.x, off.y + (1 - k) * 16);
    ctx.globalAlpha = alpha * k;
    ctx.fillStyle = pulse > 0 ? rgba(C.alert, 0.15 + pulse * 0.55) : rgba(C.blue, 0.22);
    chamferPath(ctx, BTN.x, BTN.y, BTN.w, BTN.h, 10);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = pulse > 0 ? C.alert : C.blue;
    ctx.stroke();
    ctx.fillStyle = rgba(C.text, 0.85);
    ctx.fillRect(BX - 40, BY - 4, 80, 8);
    if (marked) {
      var col = mixHex(C.alert, C.blue, fixK);
      ctx.shadowColor = col;
      ctx.shadowBlur = 22;
      ctx.strokeStyle = col;
      ctx.lineWidth = 3;
      chamferPath(ctx, BTN.x - 8, BTN.y - 8, BTN.w + 16, BTN.h + 16, 12);
      ctx.stroke();
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(BTN.x + BTN.w + 2, BTN.y - 2, 7, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function secureCheck(ctx, t, alpha, off) {
    var a = seg(t, 1.6, 2.1) * (1 - seg(t, 2.7, 3.1)) * alpha;
    if (a <= 0) return;
    var x = BTN.x + BTN.w + 42 + off.x, y = BY + off.y;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.shadowColor = C.ok; ctx.shadowBlur = 18 + 8 * Math.sin(t * 4);
    ctx.strokeStyle = C.ok; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 8, y); ctx.lineTo(x - 2, y + 6); ctx.lineTo(x + 9, y - 6); ctx.stroke();
    ctx.restore();
  }

  function lens(ctx, t) {
    if (t < 2.6 || t > 5.7) return;
    var x, y, a = 1;
    if (t < 3.5) { var k = E.out(seg(t, 2.6, 3.5)); x = lerp(150, BX, k); y = lerp(300, BY, k); a = seg(t, 2.6, 2.9); }
    else if (t < 5.1) { x = BX; y = BY; }
    else { var k2 = E.in(seg(t, 5.1, 5.6)); x = lerp(BX, 1350, k2); y = lerp(BY, 230, k2); a = 1 - k2; }
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = rgba(C.glow, 0.08);
    ctx.strokeStyle = C.glow; ctx.lineWidth = 3;
    ctx.shadowColor = C.glow; ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.arc(x, y, 80, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + 57, y + 57); ctx.lineTo(x + 112, y + 112); ctx.lineWidth = 8; ctx.stroke();
    var lock = E.out(seg(t, 3.5, 4.2));
    if (lock > 0 && t < 5.1) {
      ctx.lineWidth = 3;
      var d = lerp(130, 62, lock);
      ctx.globalAlpha = a * lock;
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (s) {
        ctx.beginPath();
        ctx.moveTo(x + s[0] * d, y + s[1] * (d - 22));
        ctx.lineTo(x + s[0] * d, y + s[1] * d);
        ctx.lineTo(x + s[0] * (d - 22), y + s[1] * d);
        ctx.stroke();
      });
      ctx.lineWidth = 2;
      for (var i = 0; i < 12; i++) {
        var ang = i / 12 * Math.PI * 2 + (1 - lock) * 0.8;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(ang) * 86, y + Math.sin(ang) * 86);
        ctx.lineTo(x + Math.cos(ang) * 96, y + Math.sin(ang) * 96);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function hiddenLayer(ctx, t, e) {
    var a = seg(t, 5.8, 6.3) * (1 - seg(t, 8.0, 8.6));
    if (a <= 0) return;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.setLineDash([10, 8]);
    ctx.strokeStyle = C.glow; ctx.lineWidth = 2;
    ctx.fillStyle = rgba(C.glow, 0.06);
    chamferPath(ctx, BTN.x - 30, BTN.y - 26, BTN.w + 60, BTN.h + 52, 12);
    ctx.fill(); ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = '500 18px ' + MONO;
    ctx.fillStyle = rgba(C.glow, 0.85);
    ctx.fillText('HIDDEN LAYER', BTN.x - 28, BTN.y - 38 - e * 6);
    ctx.restore();
  }

  function cursorClick(ctx, t) {
    if (t < 6.3 || t > 8.6) return;
    var k = E.inOut(seg(t, 6.4, 7.1));
    var x = lerp(1240, BX + 14, k), y = lerp(780, BY + 6, k);
    var press = t > 7.1 && t < 7.25 ? 0.82 : 1;
    var a = seg(t, 6.3, 6.5) * (1 - seg(t, 8.1, 8.5));
    ctx.save();
    ctx.globalAlpha = a;
    var rip = seg(t, 7.1, 7.75);
    if (rip > 0 && rip < 1) {
      ctx.strokeStyle = rgba(C.glow, 1 - rip);
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(BX + 14, BY + 6, 10 + rip * 90, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.translate(x, y); ctx.scale(press * 1.6, press * 1.6);
    ctx.fillStyle = C.text; ctx.strokeStyle = C.void; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 22); ctx.lineTo(6, 17); ctx.lineTo(10, 26); ctx.lineTo(14, 24); ctx.lineTo(10, 15); ctx.lineTo(18, 15); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.restore();
  }

  function proofFlag(ctx, t, off) {
    var rise = E.out(seg(t, 7.2, 7.55));
    if (rise <= 0) return;
    var a = 1 - seg(t, 8.55, 8.85);
    if (a <= 0) return;
    var unfurl = E.back(seg(t, 7.45, 7.85));
    var px = BX + 90 + off.x, base = BTN.y + off.y, top = base - rise * 96;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.strokeStyle = C.text; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(px, base); ctx.lineTo(px, top); ctx.stroke();
    if (unfurl > 0) {
      var fw = 130 * unfurl;
      ctx.fillStyle = C.glow;
      ctx.shadowColor = C.glow; ctx.shadowBlur = 16;
      ctx.beginPath(); ctx.moveTo(px, top); ctx.lineTo(px + fw, top); ctx.lineTo(px + fw - 12 * unfurl, top + 20); ctx.lineTo(px + fw, top + 40); ctx.lineTo(px, top + 40); ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0;
      if (unfurl > 0.8) {
        ctx.fillStyle = C.void;
        ctx.font = '700 22px ' + MONO;
        ctx.fillText('PROOF', px + 14, top + 28);
      }
    }
    ctx.restore();
  }

  function reportLines(ctx, t, r) {
    var a = seg(t, 9.2, 9.35) * (1 - seg(t, 11.4, 11.6));
    if (a <= 0) return;
    var widths = [0.55, 0.85, 0.7, 0.9, 0.45, 0.8, 0.88, 0.6, 0.35];
    ctx.save();
    ctx.globalAlpha = a;
    widths.forEach(function (w, i) {
      var k = E.out(seg(t, 9.3 + i * 0.11, 9.48 + i * 0.11));
      if (k <= 0) return;
      ctx.fillStyle = i === 0 ? rgba(C.text, 0.85) : rgba(C.text, 0.32);
      ctx.fillRect(r.x + 40, r.y + 60 + i * 48, (r.w - 80) * w * k, i === 0 ? 16 : 9);
    });
    ctx.restore();
  }

  function highBadge(ctx, t, r) {
    if (t < 10.4 || t > 11.65) return;
    var k = E.in(seg(t, 10.4, 10.62));
    var s = lerp(3.2, 1, k);
    var a = seg(t, 10.4, 10.48) * (1 - seg(t, 11.4, 11.65));
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(r.x + r.w - 92, r.y + r.h - 96);
    ctx.rotate(-0.14);
    ctx.scale(s, s);
    ctx.fillStyle = C.alert;
    ctx.shadowColor = C.alert; ctx.shadowBlur = 24;
    chamferPath(ctx, -66, -26, 132, 52, 10);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = C.void;
    ctx.font = '700 30px ' + HEAD;
    ctx.textAlign = 'center';
    ctx.fillText('HIGH', 0, 11);
    ctx.restore();
  }

  function shieldAndLock(ctx, t) {
    var s = seg(t, 12.2, 12.6);
    if (s <= 0 || t > 14.6) return;
    var k = E.back(s);
    ctx.save();
    ctx.translate(BX, BY);
    ctx.scale(lerp(1.6, 1, k), lerp(1.6, 1, k));
    ctx.globalAlpha = Math.min(1, s * 2);
    ctx.fillStyle = rgba(C.panel, 0.92);
    ctx.strokeStyle = C.glow; ctx.lineWidth = 4;
    ctx.shadowColor = C.glow; ctx.shadowBlur = 22;
    ctx.beginPath();
    ctx.moveTo(0, -70); ctx.lineTo(58, -48); ctx.lineTo(54, 14); ctx.quadraticCurveTo(44, 50, 0, 72);
    ctx.quadraticCurveTo(-44, 50, -54, 14); ctx.lineTo(-58, -48); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;
    var close = E.out(seg(t, 12.6, 13.0));
    var lift = (1 - close) * 14;
    ctx.strokeStyle = C.glow; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-14, -6 - lift); ctx.lineTo(-14, -18 - lift); ctx.arc(0, -18 - lift, 14, Math.PI, 0); ctx.lineTo(14, -6 - (close < 1 ? lift * 1.6 : 0)); ctx.stroke();
    ctx.fillStyle = C.glow;
    ctx.fillRect(-22, -6, 44, 34);
    ctx.fillStyle = C.void;
    ctx.fillRect(-3, 4, 6, 12);
    ctx.restore();

    var p = seg(t, 12.85, 13.55);
    if (p > 0 && p < 1) {
      ctx.save();
      ctx.strokeStyle = rgba(C.glow, (1 - p) * 0.8);
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(BX, BY, 60 + p * 260, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
  }

  function resolved(ctx, t) {
    if (t < 13.15) return;
    var text = 'RESOLVED';
    var n = Math.min(text.length, Math.floor(seg(t, 13.15, 13.6) * (text.length + 0.99)));
    ctx.save();
    ctx.font = '700 40px ' + MONO;
    ctx.fillStyle = C.glow;
    ctx.shadowColor = C.glow; ctx.shadowBlur = 18;
    ctx.textAlign = 'center';
    ctx.fillText(text.slice(0, n) + (n < text.length && Math.floor(t * 8) % 2 ? '_' : ''), 800, 712);
    ctx.restore();
  }

  function monogram(ctx, t) {
    var a = seg(t, 14.1, 14.4) * (1 - seg(t, 14.6, 15));
    if (a <= 0) return;
    var s = lerp(0.92, 1, E.out(seg(t, 14.1, 14.55)));
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(800, 450); ctx.scale(s, s);
    ctx.strokeStyle = C.blue; ctx.lineWidth = 4;
    ctx.shadowColor = C.glow; ctx.shadowBlur = 24;
    chamferPath(ctx, -110, -110, 220, 220, 30);
    ctx.stroke();
    ctx.fillStyle = C.text;
    ctx.font = '700 110px ' + HEAD;
    ctx.textAlign = 'center';
    ctx.fillText('KS', 0, 38);
    ctx.restore();
  }

  function caption(ctx, t) {
    for (var i = 0; i < CAPTIONS.length; i++) {
      var c = CAPTIONS[i];
      if (t < c.t || t > c.end) continue;
      var n = Math.min(c.text.length, Math.floor((t - c.t) * 26));
      var a = 1 - seg(t, c.end - 0.25, c.end);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.font = '500 28px ' + MONO;
      ctx.fillStyle = i >= 1 && i <= 3 ? rgba(C.alert, 0.9) : C.glow;
      ctx.fillText('>', 64, 846);
      ctx.fillStyle = C.text;
      ctx.fillText(c.text.slice(0, n) + (n < c.text.length ? '_' : ''), 96, 846);
      ctx.restore();
    }
  }

  /* One frame of the film at time t (seconds). Pure function of t: pausing freezes everything together. */
  function render(ctx, t, rs) {
    ctx.setTransform(rs, 0, 0, rs, 0, 0);
    backdrop(ctx);

    var cam = 1, camA = 1;
    if (t >= 13.8) {
      var pk = E.inOut(seg(t, 13.8, 14.5));
      cam = lerp(1, 0.3, pk);
      camA = 1 - seg(t, 13.9, 14.25);
    }
    var shake = t > 10.62 && t < 10.95 ? Math.sin(t * 150) * 12 * (1 - seg(t, 10.62, 10.95)) : 0;

    ctx.save();
    ctx.translate(800 + shake, 450 + shake * 0.5);
    ctx.scale(cam, cam);
    ctx.translate(-800, -450);
    ctx.globalAlpha = camA;

    var morph = t < 11.4 ? E.inOut(seg(t, 8.6, 9.3)) : 1 - E.inOut(seg(t, 11.4, 11.9));
    var explode = t < 7.8 ? E.out(seg(t, 5.6, 6.4)) : 1 - E.inOut(seg(t, 7.8, 8.6));
    var back = { x: -explode * 70, y: -explode * 48 };
    var front = { x: explode * 70, y: explode * 48 };
    var draw = E.inOut(seg(t, 0, 0.8));
    var formA = t < 11.4 ? 1 - seg(t, 8.6, 8.85) : seg(t, 11.65, 11.9);

    var frame = lerpRect(WIN, DOC, morph);
    ctx.save();
    ctx.translate(back.x, back.y);
    windowFrame(ctx, frame, draw, t);
    ctx.restore();

    if (explode > 0) {
      ctx.save();
      ctx.globalAlpha = camA * explode * 0.5;
      ctx.strokeStyle = rgba(C.blue, 0.4);
      ctx.setLineDash([4, 8]);
      ctx.lineWidth = 1.5;
      [[WIN.x, WIN.y], [WIN.x + WIN.w, WIN.y], [WIN.x + WIN.w, WIN.y + WIN.h], [WIN.x, WIN.y + WIN.h]].forEach(function (p) {
        ctx.beginPath(); ctx.moveTo(p[0] + back.x, p[1] + back.y); ctx.lineTo(p[0] + front.x, p[1] + front.y); ctx.stroke();
      });
      ctx.restore();
    }

    formParts(ctx, t, formA, front);
    secureCheck(ctx, t, formA, front);
    hiddenLayer(ctx, t, explode);
    button(ctx, t, formA, front);
    reportLines(ctx, t, frame);
    highBadge(ctx, t, frame);
    lens(ctx, t);
    cursorClick(ctx, t);
    proofFlag(ctx, t, front);
    shieldAndLock(ctx, t);
    resolved(ctx, t);
    ctx.restore();

    monogram(ctx, t);
    caption(ctx, t);
  }

  /* ---------------------------------------------------------------- player */

  function createReel(figure) {
    var stage = figure.querySelector('.reel-stage');
    var canvas = figure.querySelector('.reel-canvas');
    var ctx = canvas.getContext('2d');
    var bar = figure.querySelector('.reel-bar');
    var progress = figure.querySelector('.reel-progress');
    var hint = figure.querySelector('[data-reel-hint]');
    var framesList = figure.querySelector('.reel-frames');
    var params = new URLSearchParams(location.search);
    var debugT = params.has('t') ? parseFloat(params.get('t')) : NaN;

    TICKS.forEach(function (t) {
      var tick = document.createElement('i');
      tick.className = 'reel-tick';
      tick.style.left = (t / DURATION * 100) + '%';
      progress.appendChild(tick);
    });

    var cur = isNaN(debugT) ? 0 : debugT;
    var playing = isNaN(debugT);
    var inView = false, docVisible = !document.hidden, ready = false;
    var raf = 0, last = null, rs = 1, quality = 1, ema = 16, slowFrames = 0;

    function resize() {
      var cssW = stage.clientWidth || 800;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.round(clamp(cssW * dpr * quality, 480, 1920));
      if (canvas.width !== w) { canvas.width = w; canvas.height = Math.round(w * 9 / 16); }
      rs = canvas.width / W;
      if (ready) draw();
    }
    function draw() {
      render(ctx, cur, rs);
      bar.style.transform = 'scaleX(' + (cur / DURATION).toFixed(4) + ')';
    }
    function shouldRun() { return ready && playing && inView && docVisible && !KS.reduced; }
    function tick(now) {
      raf = 0;
      if (!shouldRun()) { last = null; return; }
      if (last !== null) {
        var ms = now - last;
        cur = (cur + Math.min(ms, 100) / 1000) % DURATION;
        ema = ema * 0.92 + ms * 0.08;
        if (ema > 26 && quality > 0.5) {
          if (++slowFrames > 45) { quality -= 0.25; slowFrames = 0; ema = 16; resize(); }
        } else slowFrames = 0;
      }
      last = now;
      draw();
      raf = requestAnimationFrame(tick);
    }
    function start() { if (shouldRun() && !raf) { last = null; raf = requestAnimationFrame(tick); } }
    function setPlaying(next) {
      playing = next;
      figure.classList.toggle('is-paused', !playing);
      stage.setAttribute('aria-label', playing ? 'Pause the film' : 'Play the film');
      if (hint) hint.textContent = playing ? 'Tap to pause' : 'Tap to play';
      start();
    }

    function buildStoryboard() {
      if (framesList.childElementCount) return;
      STORY_TIMES.forEach(function (t, i) {
        var li = document.createElement('li');
        var c = document.createElement('canvas');
        c.width = 640; c.height = 360;
        c.setAttribute('aria-hidden', 'true');
        var p = document.createElement('p');
        p.textContent = (i + 1) + '. ' + CAPTIONS[i].text;
        li.appendChild(c); li.appendChild(p);
        framesList.appendChild(li);
        render(c.getContext('2d'), t, 640 / W);
      });
    }
    function applyMode() {
      figure.classList.toggle('is-static', KS.reduced);
      var live = figure.querySelector('.optic-label b');
      if (live) live.textContent = KS.reduced ? 'STILLS' : 'LIVE';
      framesList.hidden = !KS.reduced;
      stage.hidden = KS.reduced;
      if (KS.reduced) buildStoryboard();
      else start();
    }

    stage.addEventListener('click', function () { setPlaying(!playing); });
    document.addEventListener('visibilitychange', function () { docVisible = !document.hidden; start(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { inView = entries[0].isIntersecting; start(); }, { threshold: 0.15 }).observe(stage);
    } else inView = true;
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage);
    else window.addEventListener('resize', resize);
    KS.on('motionchange', applyMode);

    var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    fontsReady.then(function () {
      ready = true;
      resize();
      draw();
      figure.classList.add('is-ready');
      applyMode();
      setPlaying(playing);
    });

    return {
      play: function () { setPlaying(true); },
      pause: function () { setPlaying(false); },
      seek: function (t) { cur = clamp(t, 0, DURATION); draw(); },
      get time() { return cur; },
      get playing() { return playing; },
      get running() { return !!raf; },
      duration: DURATION
    };
  }

  KS.createReel = createReel;
  KS.initReelEmbed = function () {
    var fig = document.querySelector('[data-reel]');
    if (fig) KS.reel = createReel(fig);
  };
})();
