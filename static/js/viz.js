/* Pangenome AI — hero + section canvas visualisations
   Vanilla JS, no dependencies. Auto-inits any <canvas data-viz="helix|scan">. */
(function () {
  "use strict";
  var canvases = [];

  function fit(c) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = c.getBoundingClientRect();
    if (r.width === 0) return null;
    c.width = Math.round(r.width * dpr);
    c.height = Math.round(r.height * dpr);
    var ctx = c.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: r.width, h: r.height };
  }

  function buildHelix(c) {
    var f = fit(c); if (!f) return null;
    var N = 150, pts = [];
    for (var i = 0; i < N; i++) pts.push(i / N);
    return { canvas: c, kind: "helix", f: f, N: N, pts: pts };
  }
  function drawHelix(s, t) {
    var ctx = s.f.ctx, w = s.f.w, h = s.f.h;
    ctx.clearRect(0, 0, w, h);
    var cx = w * 0.72, cy = h * 0.5, R = Math.min(w, h) * 0.16, rot = t * 0.35;
    var span = h * 0.9, dots = [];
    for (var i = 0; i < s.N; i++) {
      var u = s.pts[i], ang = u * Math.PI * 5 + rot, y = cy - span / 2 + u * span;
      for (var strand = 0; strand < 2; strand++) {
        var a = ang + strand * Math.PI, x = cx + Math.cos(a) * R, z = Math.sin(a), depth = (z + 1) / 2;
        dots.push({ x: x, y: y, z: z, depth: depth, strand: strand });
      }
    }
    dots.sort(function (p, q) { return p.z - q.z; });
    for (var j = 0; j < s.N; j += 4) {
      var uu = s.pts[j], an = uu * Math.PI * 5 + rot, yy = cy - span / 2 + uu * span;
      var x1 = cx + Math.cos(an) * R, x2 = cx + Math.cos(an + Math.PI) * R, zz = (Math.sin(an) + 1) / 2;
      ctx.strokeStyle = "rgba(233,160,95," + (0.06 + 0.16 * zz) + ")";
      ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x1, yy); ctx.lineTo(x2, yy); ctx.stroke();
    }
    dots.forEach(function (d) {
      var rad = 1.6 + 2.8 * d.depth;
      var col = d.strand === 0 ? [233, 160, 95] : [243, 237, 225];
      ctx.fillStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + (0.2 + 0.7 * d.depth) + ")";
      ctx.beginPath(); ctx.arc(d.x, d.y, rad, 0, 6.28); ctx.fill();
    });
  }

  function buildScan(c) {
    var f = fit(c); if (!f) return null;
    var lanes = 6, per = Math.floor((f.w - 140) / 9), grid = [];
    for (var r = 0; r < lanes; r++) { var row = []; for (var i = 0; i < per; i++) row.push(Math.random()); grid.push(row); }
    return { canvas: c, kind: "scan", f: f, lanes: lanes, per: per, grid: grid };
  }
  function drawScan(s, t) {
    var ctx = s.f.ctx, w = s.f.w, h = s.f.h;
    ctx.clearRect(0, 0, w, h);
    var C = "rgba(233,160,95,";
    var left = 100, top = 26, laneH = (h - top * 2) / s.lanes, cw = (w - left - 30) / s.per;
    var scan = (t * 0.13) % 1, scanX = left + scan * (w - left - 30);
    ctx.font = '11px "IBM Plex Mono", monospace';
    for (var r = 0; r < s.lanes; r++) {
      var y = top + r * laneH;
      ctx.fillStyle = "rgba(200,190,168,0.6)";
      ctx.fillText("genome " + String(r + 1).padStart(2, "0"), 14, y + laneH * 0.62);
      for (var i = 0; i < s.per; i++) {
        var x = left + i * cw, v = s.grid[r][i];
        var near = 1 - Math.min(1, Math.abs(x - scanX) / 70), on = v > 0.62;
        ctx.fillStyle = on ? (near > 0.1 ? C + (0.35 + 0.65 * near) + ")" : C + "0.30)") : "rgba(233,225,205,0.10)";
        var bh = on ? laneH * 0.5 : laneH * 0.24;
        ctx.fillRect(x, y + laneH / 2 - bh / 2, cw - 2, bh);
      }
    }
    ctx.fillStyle = C + "0.10)"; ctx.fillRect(scanX - 2, top - 6, 4, h - top * 2 + 12);
    ctx.fillStyle = C + "1)"; ctx.fillRect(scanX - 1, top - 6, 2, h - top * 2 + 12);
  }

  function build(c) {
    var kind = c.getAttribute("data-viz");
    if (kind === "helix") return buildHelix(c);
    if (kind === "scan") return buildScan(c);
    return null;
  }
  function setup() {
    canvases = [];
    document.querySelectorAll("canvas[data-viz]").forEach(function (c) {
      var s = build(c); if (s) canvases.push(s);
    });
  }

  function start() {
    setup();
    if (!canvases.length) return;
    var t0 = performance.now();
    function loop(t) {
      var time = (t - t0) / 1000;
      canvases.forEach(function (s) { s.kind === "helix" ? drawHelix(s, time) : drawScan(s, time); });
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(setup, 150); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
