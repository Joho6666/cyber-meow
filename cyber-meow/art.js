/* =========================================================
   Art pass — accessories, props and room lighting painted with
   the same fur brush as the cat (no noisy displacement filters).
   Runs after cat.js, before game.js. Safe on pages that only
   contain some of these elements (e.g. lab.html).
   ========================================================= */
(() => {
  'use strict';
  const M = window.CatModel;
  if (!M || !M.Fur) return;
  const { Fur } = M;
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('scene');
  if (!svg) return;
  const $ = (id) => document.getElementById(id);
  let R = M.rng(4242);
  const rr = (a, b) => a + R() * (b - a);
  const f1 = (n) => Math.round(n * 10) / 10;
  const TAU = Math.PI * 2;

  let defs = svg.querySelector('defs');
  if (!defs) { defs = document.createElementNS(NS, 'defs'); svg.prepend(defs); }
  const ensure = (id) => {
    let n = $(id);
    if (!n) { n = document.createElementNS(NS, 'g'); n.id = id; defs.appendChild(n); }
    return n;
  };

  defs.insertAdjacentHTML('beforeend', `
    <radialGradient id="aStar" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#FFFBD2"/><stop offset=".7" stop-color="#FAEE8E"/><stop offset="1" stop-color="#F0DE6E"/></radialGradient>
    <linearGradient id="aStarBand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF7B4"/><stop offset="1" stop-color="#F3E27A"/></linearGradient>
    <linearGradient id="aWhite" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#F3EDF6"/></linearGradient>
    <linearGradient id="aEarPink" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD9E3"/><stop offset=".6" stop-color="#F7B3C6"/><stop offset="1" stop-color="#FBCBD8"/></linearGradient>
    <linearGradient id="aBeanie" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D4AB84"/><stop offset="1" stop-color="#A97D57"/></linearGradient>
    <linearGradient id="aBrim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C69A71"/><stop offset="1" stop-color="#94693F"/></linearGradient>
    <linearGradient id="aSatin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD3DE"/><stop offset=".45" stop-color="#F7A9BF"/><stop offset=".7" stop-color="#FBC2D2"/><stop offset="1" stop-color="#EE93AE"/></linearGradient>
    <radialGradient id="aKnot" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#FFC6D5"/><stop offset="1" stop-color="#E7859F"/></radialGradient>
    <radialGradient id="aBtn" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFE0E8"/><stop offset="1" stop-color="#EE8FA8"/></radialGradient>
    <radialGradient id="aTeddy" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#D8AC82"/><stop offset="1" stop-color="#A7774F"/></radialGradient>
    <linearGradient id="aBeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFDF2" stop-opacity=".0"/><stop offset=".25" stop-color="#FFFDF2" stop-opacity=".22"/><stop offset="1" stop-color="#FFFDF2" stop-opacity=".05"/></linearGradient>
    <radialGradient id="aVignette" cx=".5" cy=".55" r=".75"><stop offset=".62" stop-color="#6E4A78" stop-opacity="0"/><stop offset="1" stop-color="#6E4A78" stop-opacity=".2"/></radialGradient>
    <linearGradient id="aBed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBB9CF"/><stop offset="1" stop-color="#EE8FB2"/></linearGradient>
    <radialGradient id="aCushion" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#FFF4F8"/><stop offset="1" stop-color="#FAD3E1"/></radialGradient>
    <linearGradient id="aBowl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB9D3"/><stop offset="1" stop-color="#F28DB4"/></linearGradient>
    <linearGradient id="aCurtain" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFC0D6"/><stop offset=".3" stop-color="#FFD6E4"/><stop offset=".55" stop-color="#F7AFC8"/><stop offset=".8" stop-color="#FFD0E0"/><stop offset="1" stop-color="#F4A8C2"/></linearGradient>
    <filter id="aSoft" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation=".6"/></filter>
    <filter id="aBlur2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2"/></filter>
    <filter id="aBlur4" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>
    <filter id="aBlur8" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="8"/></filter>`);

  /* ---------- helpers ---------- */
  const ell = (cx, cy, rx, ry, a) => [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];

  // strands along an ellipse edge, pointing outward
  function ellipseFur(f, col, op, cx, cy, rx, ry, a0, a1, step, L, W, inset = 4, down = 0) {
    for (let a = a0; a < a1; a += step) {
      const t = a + rr(-step * .4, step * .4);
      const [x, y] = ell(cx, cy, rx - inset, ry - inset, t);
      const ang = Math.atan2(Math.sin(t) * rx / ry + down, Math.cos(t) * ry / rx) + rr(-.22, .22);
      f.add(col, op, x, y, ang, rr(L[0], L[1]), rr(W[0], W[1]), rr(-.22, .22));
    }
  }

  // hood crescent that frames the face (shared by star + bunny hoods)
  const CO = { cx: 300, cy: 302, rx: 174, ry: 196 }, CI = { cx: 300, cy: 302, rx: 166, ry: 126 };
  function crescent({ fill, under, over, hi, shadow, L = [8, 14], W = [2.6, 3.8], plush = 1 }) {
    const pts = [];
    for (let i = 0; i <= 40; i++) pts.push(ell(CO.cx, CO.cy, CO.rx, CO.ry, Math.PI + Math.PI * i / 40));
    for (let i = 40; i >= 0; i--) pts.push(ell(CI.cx, CI.cy, CI.rx, CI.ry, Math.PI + Math.PI * i / 40));
    const d = 'M' + pts.map((p) => f1(p[0]) + ' ' + f1(p[1])).join('L') + 'Z';
    const inner = 'M' + Array.from({ length: 41 }, (_, i) => ell(CI.cx, CI.cy, CI.rx, CI.ry, Math.PI + Math.PI * i / 40)).map((p) => f1(p[0]) + ' ' + f1(p[1])).join('L');
    const a = new Fur(), b = new Fur(), c = new Fur(), t = new Fur();
    ellipseFur(a, under, .95, CO.cx, CO.cy, CO.rx, CO.ry, Math.PI + .06, TAU - .06, .03, [L[0] * plush, L[1] * plush], W, 6, -.1);
    ellipseFur(b, over, .92, CO.cx, CO.cy, CO.rx, CO.ry, Math.PI + .08, TAU - .08, .036, [L[0] * .7 * plush, L[1] * .7 * plush], W, 12, -.1);
    // inner rim: short fibres curling onto the forehead
    for (let a0 = Math.PI + .1; a0 < TAU - .1; a0 += .04) {
      const [x, y] = ell(CI.cx, CI.cy, CI.rx + 6, CI.ry + 6, a0);
      c.add(over, .95, x, y, Math.atan2(-Math.sin(a0), -Math.cos(a0)) + rr(-.3, .3), rr(6, 11) * plush, rr(2.2, 3.2), rr(-.25, .25));
    }
    // body texture
    for (let i = 0; i < 170; i++) {
      const a0 = rr(Math.PI + .1, TAU - .1), k = R();
      const [xo, yo] = ell(CO.cx, CO.cy, CO.rx - 10, CO.ry - 10, a0), [xi, yi] = ell(CI.cx, CI.cy, CI.rx + 10, CI.ry + 10, a0);
      const x = xi + (xo - xi) * k, y = yi + (yo - yi) * k;
      t.add(R() < .5 ? hi : under, R() < .5 ? .5 : .3, x, y, Math.atan2(Math.sin(a0), Math.cos(a0)) + rr(-.6, .6), rr(7, 12), rr(1.6, 2.4), rr(-.25, .25));
    }
    return `
      <path d="${inner}" fill="none" stroke="${shadow}" stroke-width="16" opacity=".32" transform="translate(0 9)" filter="url(#aBlur8)"/>
      ${a.svg()}
      <path d="${d}" fill="${fill}"/>
      ${t.svg()}${b.svg()}${c.svg()}`;
  }

  /* ---------- 黄油星星 star hood ---------- */
  (function starHood() {
    const cx = 300, cy = 262, P = [];
    for (let i = 0; i < 10; i++) {
      const a = (-96 + i * 36) * Math.PI / 180, r = i % 2 ? 150 : 228;
      P.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    const d = 'M' + P.map((p) => f1(p[0]) + ' ' + f1(p[1])).join('L') + 'Z';
    const under = new Fur(), over = new Fur(), tex = new Fur();
    for (let i = 0; i < 10; i++) {
      const A = P[i], B = P[(i + 1) % 10];
      const dx = B[0] - A[0], dy = B[1] - A[1], len = Math.hypot(dx, dy);
      let nx = dy / len, ny = -dx / len;
      const mx = (A[0] + B[0]) / 2 - cx, my = (A[1] + B[1]) / 2 - cy;
      if (nx * mx + ny * my < 0) { nx = -nx; ny = -ny; }
      for (let t = 0; t < 1; t += 7 / len) {
        const x = A[0] + dx * t + nx * 23, y = A[1] + dy * t + ny * 23;
        const ang = Math.atan2(ny, nx) + rr(-.25, .25);
        under.add('#E8D46A', .95, x, y, ang, rr(7, 13), rr(2.6, 3.6), rr(-.25, .25));
        if (R() < .7) over.add('#FFF6B8', .9, x - nx * 6, y - ny * 6, ang + rr(-.15, .15), rr(5, 9), rr(2, 3), rr(-.25, .25));
      }
    }
    // soft fans around each outer tip
    P.forEach((V, i) => {
      if (i % 2) return;
      const base = Math.atan2(V[1] - cy, V[0] - cx);
      for (let k = 0; k < 11; k++) {
        const a = base + (k / 10 - .5) * 2.1;
        under.add('#E8D46A', .95, V[0] + Math.cos(a) * 22, V[1] + Math.sin(a) * 22, a + rr(-.2, .2), rr(7, 12), rr(2.6, 3.4), rr(-.2, .2));
      }
    });
    const inside = (x, y) => {
      let c = false;
      for (let i = 0, j = 9; i < 10; j = i++) {
        const [xi, yi] = P[i], [xj, yj] = P[j];
        if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
      }
      return c;
    };
    let n = 0;
    while (n < 240) {
      const x = rr(60, 540), y = rr(20, 480);
      if (!inside(x, y)) continue;
      n++;
      const a = Math.atan2(y - cy, x - cx);
      tex.add(R() < .55 ? '#FFFAD0' : '#EBDA72', R() < .55 ? .55 : .35, x, y, a + rr(-.5, .5), rr(8, 14), rr(1.8, 2.6), rr(-.25, .25));
    }
    ensure('hat-star-b').innerHTML = `
      ${under.svg()}
      <path id="starShape" d="${d}" fill="url(#aStar)" stroke="url(#aStar)" stroke-width="46" stroke-linejoin="round"/>
      ${tex.svg()}${over.svg()}`;

    // front: crescent brim + chin band with two buttons
    const band = new Fur();
    for (let t = 0; t <= 1; t += .02) {
      const u = 1 - t, x = u * u * 196 + 2 * u * t * 300 + t * t * 404, y = u * u * 458 + 2 * u * t * 508 + t * t * 458;
      band.add('#E8D46A', .95, x, y - 4, Math.PI / 2 + (x - 300) / 260 + rr(-.25, .25), rr(7, 11), rr(2.4, 3.2), rr(-.2, .2));
    }
    ensure('hat-star-f').innerHTML = crescent({ fill: 'url(#aStarBand)', under: '#E8D46A', over: '#FFF8C4', hi: '#FFFBD8', shadow: '#8C6B3A' }) + `
      <path d="M190 428 Q300 474 410 428 L404 458 Q300 508 196 458 Z" fill="#8C6B3A" opacity=".22" transform="translate(0 8)" filter="url(#aBlur4)"/>
      ${band.svg()}
      <path d="M190 428 Q300 474 410 428 L404 458 Q300 508 196 458 Z" fill="url(#aStarBand)"/>
      ${[268, 332].map((x) => `<circle cx="${x}" cy="472" r="9" fill="#8C5A66" opacity=".25" filter="url(#aBlur2)"/><circle cx="${x}" cy="469" r="8.5" fill="url(#aBtn)"/><circle cx="${x - 2.6}" cy="467" r="1.4" fill="#C9637F"/><circle cx="${x + 2.6}" cy="467" r="1.4" fill="#C9637F"/><circle cx="${x - 3}" cy="465" r="2.4" fill="#fff" opacity=".7"/>`).join('')}`;
  })();

  /* ---------- 兔兔帽 bunny hood ---------- */
  (function bunnyHood() {
    const ring = new Fur(), ring2 = new Fur();
    ellipseFur(ring, '#E6DDEC', .95, 300, 288, 194, 180, 0, TAU, .022, [12, 22], [3.4, 5], 6, .2);
    ellipseFur(ring2, '#FFFFFF', .95, 300, 288, 194, 180, 0, TAU, .03, [9, 16], [3, 4.4], 14, .2);
    const ear = (cx, cy, rx, ry, rot, flop) => {
      const f = new Fur(), g = new Fur(), tuft = new Fur();
      ellipseFur(f, '#E6DDEC', .95, cx, cy, rx, ry, 0, TAU, .05, [8, 14], [3, 4.4], 5);
      ellipseFur(g, '#FFFFFF', .95, cx, cy, rx, ry, 0, TAU, .065, [6, 10], [2.6, 3.6], 10);
      for (let i = 0; i < 16; i++) tuft.add('#FFFFFF', .85, cx + rr(-12, 12), cy + ry * .55 + rr(-8, 8), -Math.PI / 2 + rr(-.5, .5), rr(14, 26), rr(1.6, 2.4), rr(-.2, .2));
      return `<g transform="rotate(${rot} ${cx} ${cy + 110})">
        ${f.svg()}
        <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#aWhite)"/>
        ${g.svg()}
        <ellipse cx="${cx}" cy="${cy + 10}" rx="${rx * .46}" ry="${ry * .7}" fill="url(#aEarPink)"/>
        <ellipse cx="${cx - rx * .12}" cy="${cy - ry * .15}" rx="${rx * .1}" ry="${ry * .38}" fill="#fff" opacity=".45" filter="url(#aBlur2)"/>
        ${tuft.svg()}
        ${flop ? `<path d="M${cx - rx} ${cy - ry * .55} Q${cx} ${cy - ry * .8} ${cx + rx} ${cy - ry * .5}" fill="none" stroke="#D9CEE2" stroke-width="3" opacity=".6" filter="url(#aBlur2)"/>` : ''}
      </g>`;
    };
    ensure('hat-bunny-b').innerHTML = `
      ${ring.svg()}
      <ellipse cx="300" cy="288" rx="190" ry="176" fill="url(#aWhite)"/>
      ${ring2.svg()}
      ${ear(232, 6, 46, 108, -14, false)}
      ${ear(372, 10, 44, 102, 24, true)}`;
    ensure('hat-bunny-f').innerHTML = crescent({ fill: 'url(#aWhite)', under: '#E3DAEA', over: '#FFFFFF', hi: '#FFFFFF', shadow: '#6B5A7A', L: [11, 20], W: [3, 4.6], plush: 1.15 });
  })();

  /* ---------- 小熊毛球 teddy knit beanie ---------- */
  (function beanie() {
    const shape = 'M134 262 C 124 150, 210 72, 330 48 C 348 44, 366 34, 378 22 C 392 70, 446 130, 466 262 C 400 212, 200 212, 134 262 Z';
    let loops = '';
    for (let i = 0; i < 330; i++) {
      const x = rr(130, 470), y = rr(20, 262), r = rr(2.6, 4.8);
      const light = R() < .55;
      loops += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="none" stroke="${light ? '#E6C8A4' : '#8F653F'}" stroke-width="${f1(rr(1.4, 2.2))}" opacity="${light ? .75 : .45}"/>`;
    }
    let brim = '';
    for (let t = 0; t <= 1; t += .012) {
      const u = 1 - t;
      const x = u * u * u * 138 + 3 * u * u * t * 200 + 3 * u * t * t * 400 + t * t * t * 462;
      const y = u * u * u * 258 + 3 * u * u * t * 206 + 3 * u * t * t * 206 + t * t * t * 258;
      for (let k = 0; k < 2; k++) brim += `<circle cx="${f1(x + rr(-3, 3))}" cy="${f1(y + rr(-11, 11))}" r="${f1(rr(2.6, 4.2))}" fill="none" stroke="${R() < .5 ? '#DDBB94' : '#7F5634'}" stroke-width="1.8" opacity=".6"/>`;
    }
    const pom = new Fur(), pom2 = new Fur();
    for (let i = 0; i < 120; i++) {
      const a = rr(0, TAU), k = rr(.35, .95);
      pom.add(R() < .5 ? '#F1E0C4' : '#FFF8EC', .95, 380 + Math.cos(a) * 30 * k, 22 + Math.sin(a) * 30 * k, a + rr(-.4, .4), rr(10, 18), rr(2.4, 3.6), rr(-.3, .3));
    }
    for (let i = 0; i < 50; i++) { const a = rr(0, TAU); pom2.add('#FFFFFF', .8, 376 + Math.cos(a) * 12, 16 + Math.sin(a) * 12, a, rr(8, 14), rr(1.8, 2.6), rr(-.3, .3)); }
    ensure('hat-bear-f').innerHTML = `
      <clipPath id="beanieClip"><path d="${shape}"/></clipPath>
      <path d="M138 258 C 200 206, 400 206, 462 258" fill="none" stroke="#6B4A2F" stroke-width="22" opacity=".28" transform="translate(0 12)" filter="url(#aBlur8)"/>
      <path d="${shape}" fill="url(#aBeanie)"/>
      <g clip-path="url(#beanieClip)">
        ${loops}
        <ellipse cx="240" cy="120" rx="90" ry="50" fill="#FFF3E0" opacity=".22" filter="url(#aBlur8)"/>
        <path d="M150 250 C 150 170, 220 90, 330 60" fill="none" stroke="#6B4A2F" stroke-width="30" opacity=".12" filter="url(#aBlur8)"/>
      </g>
      <path d="M138 258 C 200 206, 400 206, 462 258" fill="none" stroke="url(#aBrim)" stroke-width="30" stroke-linecap="round"/>
      ${brim}
      <path d="M150 248 C 206 202, 394 202, 450 248" fill="none" stroke="#F0D3AE" stroke-width="3" opacity=".6" stroke-linecap="round"/>
      <circle cx="384" cy="30" r="30" fill="#6B4A2F" opacity=".22" filter="url(#aBlur4)"/>
      ${pom.svg()}
      <circle cx="380" cy="22" r="27" fill="#FFF6E6"/>
      ${pom2.svg()}`;
  })();

  /* ---------- 樱花结 satin bow ---------- */
  ensure('hat-bow-f').innerHTML = `
    <g transform="translate(408 168) rotate(20)">
      <ellipse cx="4" cy="20" rx="58" ry="16" fill="#8C4A62" opacity=".2" filter="url(#aBlur4)"/>
      <path d="M-4 16 L-20 52 L-8 47 L2 16 Z M4 16 L18 54 L26 44 L8 14 Z" fill="#E98BA8"/>
      <path d="M-3 18 L-14 44 M5 18 L17 46" stroke="#FFD6E1" stroke-width="2" opacity=".6"/>
      <path d="M0 0 C -20 -32, -60 -36, -62 -6 C -64 22, -26 24, 0 0 Z M0 0 C 20 -32, 60 -36, 62 -6 C 64 22, 26 24, 0 0 Z" fill="url(#aSatin)"/>
      <path d="M-10 -8 C -26 -24, -46 -26, -54 -12" stroke="#FFFFFF" stroke-width="4" opacity=".55" fill="none" stroke-linecap="round"/>
      <path d="M10 -8 C 26 -24, 46 -26, 54 -12" stroke="#FFFFFF" stroke-width="3" opacity=".4" fill="none" stroke-linecap="round"/>
      <path d="M-8 4 C -26 12, -42 12, -52 4 M8 4 C 26 12, 42 12, 52 4" stroke="#DE7E9C" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>
      <ellipse rx="12" ry="14" fill="url(#aKnot)"/>
      <path d="M-5 -9 q4 -2 7 1" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>
    </g>`;

  /* ---------- collars: contact shadow on the fur ---------- */
  ['col-cyber', 'col-gingham', 'col-tie', 'col-bbf'].forEach((id) => {
    const n = $(id);
    if (n && !n.dataset.shaded) {
      n.dataset.shaded = '1';
      n.insertAdjacentHTML('afterbegin', '<path d="M176 420 Q300 470 424 420 Q420 480 300 500 Q180 480 176 420Z" fill="#6B4A5A" opacity=".16" transform="translate(0 10)" filter="url(#aBlur8)"/>');
    }
  });

  /* ---------- teddy bear decor ---------- */
  if ($('art-teddy')) {
    R = M.rng(99);
    const parts = [[115, 638, 40, 40], [288, 632, 40, 40], [195, 912, 130, 152], [118, 1052, 64, 46], [272, 1064, 64, 46], [200, 722, 110, 110]];
    const fur = new Fur();
    parts.forEach(([cx, cy, rx, ry]) => ellipseFur(fur, '#A0714A', .95, cx, cy, rx, ry, 0, TAU, 18 / Math.max(rx, ry) * .5, [10, 20], [4, 6], 6));
    $('art-teddy').innerHTML = `
      ${fur.svg()}
      ${parts.map(([cx, cy, rx, ry]) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#aTeddy)"/>`).join('')}
      <circle cx="115" cy="640" r="20" fill="#8A5E3B" opacity=".5"/><circle cx="288" cy="634" r="20" fill="#8A5E3B" opacity=".5"/>
      <ellipse cx="200" cy="760" rx="48" ry="37" fill="#E6C29D"/>
      <path d="M186 742 Q200 735 214 742 Q212 755 200 759 Q188 755 186 742Z" fill="#4A2E1E"/>
      <path d="M200 759 v10 M188 776 q12 8 24 0" stroke="#4A2E1E" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="160" cy="712" r="9" fill="#1C120C"/><circle cx="240" cy="712" r="9" fill="#1C120C"/>
      <circle cx="157" cy="708" r="3" fill="#fff" opacity=".85"/><circle cx="237" cy="708" r="3" fill="#fff" opacity=".85"/>
      <ellipse cx="146" cy="764" rx="20" ry="10" fill="#F4A3B6" opacity=".55"/><ellipse cx="254" cy="764" rx="20" ry="10" fill="#F4A3B6" opacity=".55"/>`;
  }

  /* =========================================================
     room lighting & materials
     ========================================================= */
  const win = $('window');
  if (win) {
    // glass reflections
    const glass = win.querySelector('g[clip-path]');
    glass.insertAdjacentHTML('beforeend', `
      <g class="glass" opacity=".5">
        <path d="M44 150 L110 60 L128 60 L60 170 Z" fill="#FFFFFF" opacity=".28"/>
        <path d="M70 212 L150 96 L158 104 L84 212 Z" fill="#FFFFFF" opacity=".18"/>
      </g>`);
    // curtain folds
    win.querySelectorAll('path[fill="#FFC6DA"]').forEach((c) => c.setAttribute('fill', 'url(#aCurtain)'));
    // light pouring through the window onto the floor (day) / moonlight (night)
    ($('bg-bedroom') || win).insertAdjacentHTML($('bg-bedroom') ? 'beforeend' : 'afterend', `
      <g id="sunbeam" pointer-events="none">
        <path d="M44 214 L160 214 L318 476 L150 476 Z" fill="url(#aBeam)"/>
        <g class="patch" filter="url(#aBlur4)" opacity=".55" style="mix-blend-mode: screen">
          <path d="M150 392 L232 392 L318 476 L196 476 Z" fill="#FFF1D2"/>
          <path d="M191 392 L257 476 M173 434 L276 434" stroke="#E9C9B8" stroke-width="7" opacity=".7"/>
        </g>
      </g>`);
  }

  const rug = $('rugDefault');
  if (rug) {
    R = M.rng(31);
    const f = new Fur(), g = new Fur();
    ellipseFur(f, '#F7B4CC', .75, 200, 448, 138, 28, 0, TAU, .03, [3, 5.5], [2, 2.8], 2);
    ellipseFur(g, '#FFE6EF', .7, 200, 448, 138, 28, 0, TAU, .05, [2.5, 4.5], [1.6, 2.4], 7);
    rug.innerHTML = `<g filter="url(#aSoft)">${f.svg()}</g><ellipse cx="200" cy="448" rx="138" ry="28" fill="#FFD6E6"/>${g.svg()}
      <ellipse cx="200" cy="448" rx="120" ry="21" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>
      <ellipse cx="170" cy="442" rx="70" ry="10" fill="#fff" opacity=".22" filter="url(#aBlur4)"/>`;
  }

  const bed = $('bed'), bedFront = $('bedFront');
  if (bed && bedFront) {
    R = M.rng(57);
    const rim = new Fur(), rim2 = new Fur(), lip = new Fur();
    ellipseFur(rim, '#EE8FB2', .9, 318, 428, 74, 26, Math.PI, TAU, .035, [4, 7], [2.6, 3.4], 3);
    ellipseFur(rim2, '#FFD3E2', .9, 318, 428, 74, 26, Math.PI + .1, TAU - .1, .05, [4, 7], [2, 3], 8);
    for (let t = 0; t <= 1; t += .018) {
      const u = 1 - t, x = u * u * 244 + 2 * u * t * 318 + t * t * 392, y = u * u * 428 + 2 * u * t * 488 + t * t * 428;
      lip.add(R() < .5 ? '#F7A8C4' : '#FFD1E0', .85, x, y - 3, Math.PI / 2 + (x - 318) / 160 + rr(-.3, .3), rr(3.5, 6), rr(2.4, 3.2), rr(-.25, .25));
    }
    bed.innerHTML = `
      <ellipse cx="318" cy="452" rx="80" ry="11" fill="#9B6280" opacity=".22" filter="url(#aBlur4)"/>
      <g filter="url(#aSoft)">${rim.svg()}</g>
      <ellipse cx="318" cy="428" rx="74" ry="26" fill="url(#aBed)"/>
      ${rim2.svg()}
      <ellipse cx="318" cy="426" rx="60" ry="16" fill="url(#aCushion)"/>
      <ellipse cx="318" cy="422" rx="44" ry="8" fill="#FFFFFF" opacity=".35" filter="url(#aBlur2)"/>`;
    bedFront.innerHTML = `
      <path d="M244 428 Q244 458 318 460 Q392 458 392 428 Q356 450 318 450 Q280 450 244 428Z" fill="url(#aBed)"/>
      <g filter="url(#aSoft)">${lip.svg()}</g>
      <path d="M262 440 Q318 456 374 440" stroke="#fff" stroke-opacity=".55" stroke-width="2.5" fill="none" stroke-dasharray="2 7" stroke-linecap="round"/>`;
  }

  const bowl = $('bowl');
  if (bowl) {
    const front = bowl.querySelector('path[fill="#FFA6C9"]');
    if (front) front.setAttribute('fill', 'url(#aBowl)');
    bowl.insertAdjacentHTML('beforeend', `
      <path d="M40 447 Q66 458 92 447" fill="none" stroke="#fff" stroke-width="2.4" opacity=".6" stroke-linecap="round"/>
      <path d="M42 452 Q44 462 54 465" fill="none" stroke="#fff" stroke-width="3" opacity=".45" stroke-linecap="round"/>`);
  }

  /* =========================================================
     background polish: panelling, city view, clock, neon,
     floor grain, paw-print rug, placemat, dust motes, bokeh
     ========================================================= */
  defs.insertAdjacentHTML('beforeend', `
    <linearGradient id="aWain" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F9E9F6"/><stop offset="1" stop-color="#F0DCF0"/></linearGradient>
    <radialGradient id="aClock" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#FDEFF6"/></radialGradient>
    <filter id="aNeon" x="-40%" y="-80%" width="180%" height="260%"><feGaussianBlur stdDeviation="3.2"/></filter>
    <filter id="aBokeh" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="10"/></filter>
    <radialGradient id="aWarm"><stop offset="0" stop-color="#FFF3DC" stop-opacity=".55"/><stop offset="1" stop-color="#FFF3DC" stop-opacity="0"/></radialGradient>
    <radialGradient id="aBokPink"><stop offset="0" stop-color="#FFB3D1" stop-opacity=".45"/><stop offset=".6" stop-color="#FFB3D1" stop-opacity=".25"/><stop offset="1" stop-color="#FFB3D1" stop-opacity="0"/></radialGradient>
    <radialGradient id="aBokLav"><stop offset="0" stop-color="#C8B6FF" stop-opacity=".42"/><stop offset=".6" stop-color="#C8B6FF" stop-opacity="0.22"/><stop offset="1" stop-color="#C8B6FF" stop-opacity="0"/></radialGradient>`);

  // lower-wall wainscot + chair rail, and warm daylight spilling from the window
  const dotsRect = svg.querySelector('rect[fill="url(#wallDots)"]');
  if (dotsRect) {
    let panels = '';
    for (let x = -80; x < 480; x += 88) {
      panels += `<rect x="${x + 9}" y="252" width="70" height="62" rx="9" fill="none" stroke="#D9C2DE" stroke-width="2" opacity=".55" transform="translate(1.4 1.6)"/>
        <rect x="${x + 9}" y="252" width="70" height="62" rx="9" fill="none" stroke="#FFFFFF" stroke-width="2" opacity=".85"/>`;
    }
    dotsRect.insertAdjacentHTML('afterend', `
      <ellipse class="daylight" cx="104" cy="170" rx="220" ry="180" fill="url(#aWarm)"/>
      <g id="wainscot">
        <rect x="-600" y="238" width="1600" height="92" fill="url(#aWain)"/>
        ${panels}
        <rect x="-600" y="241" width="1600" height="5" fill="#C9AFCF" opacity=".35" filter="url(#aBlur2)"/>
        <rect x="-600" y="232" width="1600" height="9" rx="4.5" fill="#FFFFFF"/>
        <rect x="-600" y="232" width="1600" height="2.5" fill="#FFFFFF"/>
        <rect x="-600" y="239" width="1600" height="2" fill="#EBD9EC"/>
      </g>`);
  }

  // pastel cyber-city skyline through the window (neon windows at night)
  if (win) {
    const glassGroup = win.querySelector('g[clip-path]');
    const B = [[38, 176, 22], [58, 162, 18], [74, 182, 26], [98, 150, 16], [112, 170, 24], [134, 160, 20], [152, 180, 16]];
    R = M.rng(808);
    let city = '<g id="city">';
    B.forEach(([x, y, w], i) => {
      city += `<rect class="bld" x="${x}" y="${y}" width="${w}" height="${214 - y}" rx="3"/>`;
      for (let wy = y + 6; wy < 206; wy += 7) for (let wx = x + 4; wx < x + w - 4; wx += 6) {
        if (R() < .55) city += `<rect class="wl wl${1 + Math.floor(R() * 3)}" x="${wx}" y="${wy}" width="3" height="3.4" rx=".8"/>`;
      }
      if (i === 3) city += `<path d="M${x + 8} ${y} V${y - 12}" stroke="#B9A9E6" stroke-width="1.4"/><circle class="beacon" cx="${x + 8}" cy="${y - 13}" r="2.2"/>`;
    });
    city += '<rect class="haze" x="30" y="150" width="140" height="70" fill="url(#aBeam)"/></g>';
    const glass = glassGroup.querySelector('.glass');
    if (glass) glass.insertAdjacentHTML('beforebegin', city); else glassGroup.insertAdjacentHTML('beforeend', city);

    // tie-backs on the curtains + a tiny succulent on the sill
    win.insertAdjacentHTML('beforeend', `
      <g class="tieback"><path d="M36 150 q14 6 26 -2" fill="none" stroke="#FF9EC4" stroke-width="5" stroke-linecap="round"/><circle cx="62" cy="148" r="4.5" fill="#FFB8D3"/><circle cx="61" cy="146.5" r="1.5" fill="#fff" opacity=".7"/></g>
      <g class="tieback"><path d="M164 150 q-14 6 -26 -2" fill="none" stroke="#FF9EC4" stroke-width="5" stroke-linecap="round"/><circle cx="138" cy="148" r="4.5" fill="#FFB8D3"/><circle cx="137" cy="146.5" r="1.5" fill="#fff" opacity=".7"/></g>
      <g class="sill-pot">
        <ellipse cx="146" cy="208" rx="12" ry="2.4" fill="#B98AA0" opacity=".25"/>
        <path d="M136 196 h20 l-2.5 12 h-15 z" fill="#FFFFFF" stroke="#F4C9DA" stroke-width="1.6"/>
        <g fill="#A8DDB5"><ellipse cx="141" cy="192" rx="4" ry="6.5" transform="rotate(-25 141 192)"/><ellipse cx="151" cy="192" rx="4" ry="6.5" transform="rotate(25 151 192)"/><ellipse cx="146" cy="188" rx="4" ry="7.5"/></g>
        <path d="M146 186 v8" stroke="#7CC795" stroke-width="1.2"/>
      </g>`);
  }

  // wall clock that shows the real time
  const frame = $('pixHeart') && $('pixHeart').parentNode;
  if (frame) {
    let ticks = '';
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6, r0 = i % 3 ? 15.5 : 13.5;
      ticks += `<path d="M${f1(212 + Math.sin(a) * r0)} ${f1(104 - Math.cos(a) * r0)} L${f1(212 + Math.sin(a) * 17.5)} ${f1(104 - Math.cos(a) * 17.5)}" stroke="${i % 3 ? '#E3CBE4' : '#C9A6D8'}" stroke-width="${i % 3 ? 1.4 : 2.2}" stroke-linecap="round"/>`;
    }
    frame.insertAdjacentHTML('afterend', `
      <g id="wallClock">
        <circle cx="214" cy="108" r="23" fill="#9B6E86" opacity=".18" filter="url(#aBlur4)"/>
        <circle cx="212" cy="104" r="22.5" fill="url(#aClock)" stroke="url(#holo)" stroke-width="3.5"/>
        ${ticks}
        <path d="M205 112 q7 5 14 0" fill="none" stroke="#F7B6C8" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>
        <circle cx="207" cy="100" r="1.4" fill="#C9A6D8"/><circle cx="217" cy="100" r="1.4" fill="#C9A6D8"/>
        <path id="clockH" d="M212 104 V93" stroke="#5A4462" stroke-width="2.8" stroke-linecap="round"/>
        <path id="clockM" d="M212 104 V88" stroke="#FF83B6" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="212" cy="104" r="2.2" fill="#5A4462"/>
      </g>`);
    const tickClock = () => {
      const d = new Date(), m = d.getMinutes() + d.getSeconds() / 60, h = (d.getHours() % 12) + m / 60;
      $('clockH').setAttribute('transform', `rotate(${f1(h * 30)} 212 104)`);
      $('clockM').setAttribute('transform', `rotate(${f1(m * 6)} 212 104)`);
    };
    tickClock();
    setInterval(tickClock, 15000);
  }

  // neon sign — a soft night-light when the room goes dark
  const neon = `
    <g class="neon-art">
      <text x="334" y="207" text-anchor="middle" font-family="Silkscreen, monospace" font-weight="400" font-size="17" letter-spacing="2" fill="#FF6FAE">MEOW</text>
      <text x="333.4" y="206.4" text-anchor="middle" font-family="Silkscreen, monospace" font-weight="400" font-size="17" letter-spacing="2" fill="#FFD6E8" opacity=".55">MEOW</text>
      <path d="M334 182 c-5 -6 -13 -2 -10 4 c2 4 10 8 10 8 s8 -4 10 -8 c3 -6 -5 -10 -10 -4z" fill="none" stroke="#7FF0E0" stroke-width="2" stroke-linejoin="round"/>
    </g>`;
  const wallAnchor = $('wallClock') || (frame && frame.nextSibling);
  if (wallAnchor) {
    wallAnchor.insertAdjacentHTML('afterend', `
      <g id="neonSign">
        <rect x="291" y="172" width="86" height="42" rx="10" fill="#FFFFFF" opacity=".28" stroke="#F1DDF0" stroke-width="1.5"/>
        <g class="neon-glow" filter="url(#aNeon)" opacity=".55">${neon}</g>
        ${neon}
      </g>`);
  }

  // wood grain on the planks
  const planks = svg.querySelector('rect[fill="url(#planks)"]');
  if (planks) {
    R = M.rng(1212);
    let grain = '';
    for (let row = 0; row < 6; row++) {
      const y0 = 337 + row * 26;
      for (let k = 0; k < 7; k++) {
        const x = rr(-40, 420), len = rr(24, 70), y = y0 + rr(6, 20);
        grain += `<path d="M${f1(x)} ${f1(y)} q${f1(len / 2)} ${f1(rr(-2, 2))} ${f1(len)} 0" fill="none" stroke="${R() < .5 ? '#E8CBBE' : '#FBEDE6'}" stroke-width="${f1(rr(.8, 1.4))}" opacity=".8" stroke-linecap="round"/>`;
      }
    }
    planks.insertAdjacentHTML('afterend', `<g id="grain">${grain}</g>
      <rect x="-600" y="337" width="1600" height="143" fill="url(#aBeam)" opacity=".5" class="daylight"/>`);
  }

  // paw prints on the round rug
  if (rug) {
    const paw = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(1 .42)" fill="#FFEAF2" opacity=".9">
      <ellipse cx="0" cy="3" rx="6" ry="5"/><circle cx="-6.5" cy="-4" r="2.4"/><circle cx="-2.2" cy="-7.4" r="2.4"/><circle cx="2.2" cy="-7.4" r="2.4"/><circle cx="6.5" cy="-4" r="2.4"/></g>`;
    rug.insertAdjacentHTML('beforeend', [paw(112, 452, -20), paw(136, 444, -10), paw(270, 451, 15), paw(294, 443, 25), paw(206, 460, 0)].join(''));
  }

  // placemat under the food bowl
  if (bowl) {
    bowl.insertAdjacentHTML('afterbegin', `
      <ellipse cx="68" cy="466" rx="58" ry="11" fill="#FFE9B8"/>
      <ellipse cx="68" cy="466" rx="51" ry="8" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-dasharray="3 5" opacity=".9"/>
      <ellipse cx="68" cy="468" rx="58" ry="11" fill="none" stroke="#E9C98A" stroke-width="1.2" opacity=".6"/>`);
  }

  // dust motes floating in the window light
  const beam = $('sunbeam');
  if (beam) {
    R = M.rng(5150);
    let motes = '';
    for (let i = 0; i < 16; i++) {
      const t = R(), x = 60 + t * 200 + rr(-30, 30), y = 230 + t * 220 + rr(-20, 20);
      motes += `<circle class="mote" cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr(.8, 1.8))}" fill="#FFFFFF" style="animation-delay:${f1(-rr(0, 9))}s;animation-duration:${f1(rr(7, 12))}s"/>`;
    }
    beam.insertAdjacentHTML('beforeend', `<g id="motes">${motes}</g>`);
  }

  // foreground bokeh for depth of field
  const vignetteAnchor = $('dusk');
  if (vignetteAnchor) {
    vignetteAnchor.insertAdjacentHTML('beforebegin', `
      <g id="bokeh" pointer-events="none">
        <circle cx="-8" cy="498" r="60" fill="url(#aBokPink)"/>
        <circle cx="32" cy="514" r="32" fill="url(#aBokLav)"/>
        <circle cx="412" cy="494" r="54" fill="url(#aBokLav)"/>
      </g>`);
    // neon keeps glowing above the night overlay
    vignetteAnchor.insertAdjacentHTML('afterend', `<g id="neonNight" pointer-events="none"><g filter="url(#aNeon)">${neon}</g>${neon}</g>`);
  }

  const dusk = $('dusk');
  if (dusk) dusk.insertAdjacentHTML('beforebegin', '<rect id="vignette" x="-600" y="-900" width="1600" height="1700" fill="url(#aVignette)" pointer-events="none"/>');

  // drop the heavy turbulence filters left on the old hat defs (if any remain)
  svg.querySelectorAll('[filter="url(#plush)"], [filter="url(#plushBig)"], [filter="url(#curly)"]').forEach((n) => {
    if (!n.closest('#cat')) n.removeAttribute('filter');
  });
})();
