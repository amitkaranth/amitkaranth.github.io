(function () {
  'use strict';

  /* ── Core animation ──────────────────────────────────────────
     markDone = true  → set sessionStorage when finished (page load)
     markDone = false → leave sessionStorage alone (theme switch)
  ─────────────────────────────────────────────────────────────── */
  function runAnimation(loader, markDone) {
    const canvas = loader.querySelector('canvas');
    const ctx    = canvas.getContext('2d');
    const dpr    = window.devicePixelRatio || 1;

    const W = window.innerWidth;
    const H = window.innerHeight;

    canvas.width        = W * dpr;
    canvas.height       = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    const cx = W / 2;
    const cy = H / 2;

    const waveLen   = Math.min(W * 0.50, 500);
    const waveLeft  = cx - waveLen / 2;
    const waveRight = cx + waveLen / 2;
    const AMP    = Math.min(H * 0.055, 42);
    const CYCLES = 3;

    // Read theme at the moment the animation starts
    const isDark   = document.documentElement.dataset.theme === 'dark';
    const SR       = isDark ? 57  : 29;
    const SG       = isDark ? 255 : 78;
    const SB       = isDark ? 144 : 216;
    const SIG_HEX  = isDark ? '#39ff90' : '#1d4ed8';
    const GLOW_STR = isDark ? 10 : 16;

    function sig(a) { return `rgba(${SR},${SG},${SB},${a})`; }

    const P1 = 1060;
    const P2 = 1580;
    const P3 = 2100;
    const P4 = 2620;
    const P5 = 3180;

    let startTs = null;

    function easeIO(t) { return t < 0.5 ? 2*t*t : -1 + (4 - 2*t) * t; }
    function easeO3(t) { return 1 - Math.pow(1 - t, 3); }
    function easeO4(t) { return 1 - Math.pow(1 - t, 4); }

    function waveY(x, amp) {
      const ratio = (x - waveLeft) / waveLen;
      return cy + amp * Math.sin(ratio * Math.PI * 2 * CYCLES);
    }

    function glow(blur) { ctx.shadowColor = SIG_HEX; ctx.shadowBlur = blur; }
    function noGlow()    { ctx.shadowBlur = 0; }

    function drawBaseline() {
      ctx.save();
      ctx.strokeStyle = sig(isDark ? 0.07 : 0.15);
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 10]);
      ctx.beginPath();
      ctx.moveTo(waveLeft - 50, cy);
      ctx.lineTo(waveRight + 50, cy);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    function drawWave(toX, amp, alpha) {
      if (toX <= waveLeft + 1) return;
      const pts = Math.floor(toX - waveLeft);
      ctx.beginPath();
      for (let i = 0; i <= pts; i++) {
        const x = waveLeft + (i / pts) * (toX - waveLeft);
        const y = waveY(x, amp);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = sig(alpha);
      ctx.lineWidth = 2;
      ctx.lineCap   = 'round';
      ctx.lineJoin  = 'round';
      glow(GLOW_STR);
      ctx.stroke();
      noGlow();
    }

    function drawDot(x, y, r, alpha) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = sig(alpha);
      glow(22);
      ctx.fill();
      noGlow();
    }

    function drawRing(r, alpha, lw) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = sig(alpha);
      ctx.lineWidth = lw;
      glow(18);
      ctx.stroke();
      noGlow();
    }

    function frame(ts) {
      if (!startTs) startTs = ts;
      const e = ts - startTs;

      ctx.clearRect(0, 0, W, H);
      drawBaseline();

      if (e < P1) {
        const p   = easeIO(e / P1);
        const toX = waveLeft + waveLen * p;
        drawWave(toX, AMP, 1);
        drawDot(toX, waveY(toX, AMP), 3.5, 1);

      } else if (e < P2) {
        const p   = easeO3((e - P1) / (P2 - P1));
        const amp = AMP * (1 - p);
        drawWave(waveRight, amp, 1 - p * 0.25);
        drawDot(cx, cy, 1 + 3 * p, p * 0.9);

      } else if (e < P3) {
        const p    = easeO3((e - P2) / (P3 - P2));
        const half = (waveLen / 2) * (1 - p);
        if (half > 1) {
          ctx.beginPath();
          ctx.moveTo(cx - half, cy);
          ctx.lineTo(cx + half, cy);
          ctx.strokeStyle = sig(0.9 - p * 0.6);
          ctx.lineWidth = 2;
          glow(GLOW_STR);
          ctx.stroke();
          noGlow();
        }
        drawDot(cx, cy, 2 + 3 * Math.min(1, p * 2), Math.min(1, p * 2));

      } else if (e < P4) {
        const p    = easeO4((e - P3) / (P4 - P3));
        const maxR = Math.min(W, H) * 0.13;
        drawRing(easeO3(p) * maxR, (1 - p) * 0.95, 2);
        if (p > 0.28) {
          const ep = (p - 0.28) / 0.72;
          drawRing(easeO3(ep) * maxR * 0.6, (1 - ep) * 0.4, 1.5);
        }
        drawDot(cx, cy, 4 * (1 - p) + 1, (1 - p) * 0.9);

      } else if (e < P5) {
        const p = easeO3((e - P4) / (P5 - P4));
        loader.style.opacity = String(1 - p);

      } else {
        if (markDone) sessionStorage.setItem('portfolioLoaded', '1');
        loader.remove();
        document.body.style.overflow = '';
        return;
      }

      requestAnimationFrame(frame);
    }

    document.body.style.overflow = 'hidden';
    requestAnimationFrame(frame);
  }

  /* ── Programmatic trigger (theme switch) ─────────────────────
     Called by main.js after the new theme is applied.
     Does not touch sessionStorage.
  ─────────────────────────────────────────────────────────────── */
  window.triggerLoader = function () {
    const old = document.getElementById('loader');
    if (old) old.remove();

    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.setAttribute('aria-hidden', 'true');
    const canvas = document.createElement('canvas');
    loader.appendChild(canvas);
    document.body.prepend(loader);

    runAnimation(loader, false);
  };

  /* ── Page-load gate ──────────────────────────────────────────
     Runs on initial visit and after initials click (which clears
     sessionStorage before navigating back to index.html).
  ─────────────────────────────────────────────────────────────── */
  const loader = document.getElementById('loader');
  if (!loader) return;

  if (!sessionStorage.getItem('portfolioLoaded')) {
    runAnimation(loader, true);
  } else {
    loader.remove(); // not needed this visit — clean up the HTML element
  }
})();
