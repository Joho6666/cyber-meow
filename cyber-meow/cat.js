/* =========================================================
   CatModel — procedural "hand-painted" fluffy cat in SVG.
   Local space: 600 × 720, feet on y≈670, head center (300,290).
   Keeps the element ids the game drives (head, tail, ears, slots…).
   ========================================================= */
(() => {
  'use strict';

  // ---------- deterministic randomness (same cat every load) ----------
  function mulberry(seed) {
    return () => {
      seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  let R = mulberry(20260927);
  const rr = (a, b) => a + R() * (b - a);
  const f1 = (n) => Math.round(n * 10) / 10;
  const gauss = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s));
  const TAU = Math.PI * 2;

  // ---------- fur brush: tapered, slightly curved strands ----------
  class Fur {
    constructor() { this.m = new Map(); }
    add(col, op, bx, by, ang, L, w, bend = 0) {
      const dx = Math.cos(ang), dy = Math.sin(ang), px = -dy, py = dx;
      const tx = bx + dx * L, ty = by + dy * L;
      const mx = bx + dx * L * .42, my = by + dy * L * .42;
      const bv = bend * L;
      const d = `M${f1(bx)} ${f1(by)}Q${f1(mx + px * (w + bv))} ${f1(my + py * (w + bv))} ${f1(tx)} ${f1(ty)}Q${f1(mx + px * (-w + bv))} ${f1(my + py * (-w + bv))} ${f1(bx)} ${f1(by)}Z`;
      const k = col + '|' + op;
      if (!this.m.has(k)) this.m.set(k, []);
      this.m.get(k).push(d);
      return this;
    }
    svg(extra = '') {
      let s = '';
      for (const [k, a] of this.m) {
        const [c, o] = k.split('|');
        s += `<path d="${a.join('')}" style="fill:${c}" opacity="${o}"${extra}/>`;
      }
      return s;
    }
  }

  function smoothClosed(pts) {
    const n = pts.length;
    let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
    }
    return d + 'Z';
  }

  // ---------- silhouettes ----------
  const HC = { x: 300, y: 290 };
  const cheek = (th) => 26 * (gauss(th, .6, .33) + gauss(th, Math.PI - .6, .33));
  function headP(th) {
    const c = Math.cos(th), s = Math.sin(th), b = cheek(th);
    return [HC.x + (168 + b) * c, HC.y + ((s < 0 ? 146 : 150) + b * .5) * s];
  }
  const BC = { x: 300, y: 515 };
  function bodyP(th) {
    const c = Math.cos(th), s = Math.sin(th);
    return [BC.x + (180 + (s > 0 ? 8 * s * s : 0)) * c, Math.min(668, BC.y + 158 * s)];
  }
  const ring = (fn, n = 96) => Array.from({ length: n }, (_, i) => fn(i / n * TAU));
  const HEAD_D = smoothClosed(ring(headP));
  const BODY_D = smoothClosed(ring(bodyP));

  const EYES = [{ x: 238, y: 298, s: 'L' }, { x: 362, y: 298, s: 'R' }];
  const NOSE = { x: 300, y: 340 };

  /* =========================================================
     fur passes
     ========================================================= */
  function headFur() {
    const under = new Fur(), over = new Fur(), inner = new Fur(), cheeks = new Fur();

    // silhouette strands (2 layers)
    for (let th = 0; th < TAU; th += .021) {
      const t = th + rr(-.008, .008);
      const [x, y] = headP(t);
      const c = Math.cos(t), s = Math.sin(t);
      const top = s < -.35, low = s > .35, b = cheek(t);
      const nx = c, ny = s + (s > 0 ? .5 : .12);
      // crown hair lies back along the skull; sides flare out; cheeks sweep down
      const lie = top ? Math.sign(c || 1) * .9 : 0;
      const ang = Math.atan2(ny, nx) + lie * (1 - Math.abs(c)) * .9 + rr(-.18, .18);
      const L = top ? rr(7, 12) : b > 10 ? rr(18, 28) : low ? rr(10, 16) : rr(12, 20);
      const col = top ? 'var(--f-top)' : low ? 'var(--f-mid)' : 'var(--f-mid)';
      under.add(col, .95, x - c * 8, y - s * 8, ang, L, rr(3, 4.4), rr(-.22, .22));
      const col2 = top ? 'var(--f-mid)' : low ? 'var(--f-soft)' : 'var(--f-soft)';
      over.add(col2, .9, x - c * 13, y - s * 13, ang + rr(-.1, .1), L * .75, rr(2.4, 3.6), rr(-.22, .22));
    }

    // interior texture following a flow field radiating from the nose
    let n = 0;
    while (n < 300) {
      const a = rr(0, TAU), k = Math.sqrt(R());
      const x = HC.x + Math.cos(a) * 155 * k, y = HC.y + Math.sin(a) * 138 * k;
      if (EYES.some((e) => Math.hypot(x - e.x, y - e.y) < 60)) continue;
      if (Math.hypot(x - 300, y - 362) < 40) continue;
      n++;
      let ang = Math.atan2(y - 352, x - 300);
      if (y < 250 && Math.abs(x - 300) < 95) ang = -Math.PI / 2 + (x - 300) / 190;
      ang += rr(-.25, .25);
      const crown = y < 215;
      const pick = R();
      const col = crown ? (pick < .55 ? 'var(--f-tabby)' : 'var(--f-top)') : pick < .6 ? 'var(--f-light)' : 'var(--f-mid)';
      const op = crown ? .34 : pick < .6 ? .5 : .22;
      inner.add(col, op, x, y, ang, rr(9, 17), rr(1.3, 2.1), rr(-.18, .18));
    }

    // chinchilla forehead ticking (faint "M")
    [[300, 150, 60], [283, 156, 52], [317, 156, 52], [266, 168, 36], [334, 168, 36]].forEach(([x, y, L]) => {
      for (let i = 0; i < 4; i++) inner.add('var(--f-stripe)', .22, x + rr(-3, 3), y + L + rr(-4, 4), -Math.PI / 2 + (x - 300) / 300 + rr(-.08, .08), L * rr(.6, 1), rr(1.4, 2.2), rr(-.05, .05));
    });

    // big fluffy jowls
    [[.12, 1.2], [Math.PI - 1.2, Math.PI - .12]].forEach(([a0, a1]) => {
      for (let th = a0; th < a1; th += .028) {
        const t = th + rr(-.01, .01);
        const [x, y] = headP(t);
        const c = Math.cos(t), s = Math.sin(t);
        const ang = Math.atan2(s + .75, c) + rr(-.2, .2);
        cheeks.add('var(--f-soft)', .96, x - c * 20, y - s * 16, ang, rr(22, 38), rr(4, 6), rr(-.24, .24));
        if (R() < .7) cheeks.add('var(--f-light)', .92, x - c * 26, y - s * 20, ang + rr(-.12, .12), rr(16, 28), rr(3, 4.4), rr(-.24, .24));
      }
    });
    // chin tuft
    for (let i = 0; i < 22; i++) cheeks.add('#FFFFFF', .85, 300 + rr(-34, 34), 392 + rr(-6, 8), Math.PI / 2 + rr(-.35, .35), rr(12, 22), rr(1.8, 2.6), rr(-.2, .2));

    return { under: under.svg(), over: over.svg(), inner: inner.svg(), cheeks: cheeks.svg() };
  }

  function maneFur() {
    // longhair collar behind the head, frames the face
    const f = new Fur(), g = new Fur();
    for (let th = .05; th < Math.PI - .05; th += .024) {
      const c = Math.cos(th), s = Math.sin(th);
      const x = 300 + 198 * c, y = 338 + 128 * s;
      const ang = Math.atan2(s + .9, c) + rr(-.2, .2);
      f.add(s > .75 ? 'var(--f-belly)' : 'var(--f-body1)', .95, x - c * 10, y - s * 10, ang, rr(20, 34), rr(4, 6), rr(-.22, .22));
      g.add('var(--f-mane)', .95, x - c * 22, y - s * 18, ang + rr(-.1, .1), rr(18, 30), rr(3.6, 5), rr(-.22, .22));
    }
    return `<ellipse cx="300" cy="338" rx="200" ry="130" style="fill:var(--f-mane)"/>` + f.svg() + g.svg();
  }

  function earFur() {
    const f = new Fur(), tufts = new Fur();
    const segs = [[[142, 250], [180, 108]], [[180, 108], [272, 178]]];
    segs.forEach(([a, b]) => {
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const nx = (b[1] - a[1]) / len, ny = -(b[0] - a[0]) / len; // outward normal (left of travel)
      for (let t = 0; t < 1; t += .045) {
        const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
        f.add('var(--f-ear)', .95, x - nx * 3, y - ny * 3, Math.atan2(ny, nx) + rr(-.3, .3), rr(6, 12), rr(1.6, 2.4), rr(-.2, .2));
      }
    });
    // ear furnishings: long wispy white tufts
    for (let i = 0; i < 26; i++) {
      const x = rr(186, 236), y = rr(186, 214);
      const ang = Math.atan2(118 - y, 184 - x) + rr(-.35, .45);
      tufts.add(i % 3 ? '#FFFFFF' : 'var(--f-light)', rr(.7, .95), x, y, ang, rr(34, 70), rr(1.4, 2.4), rr(-.22, .1));
    }
    return `
      <path d="M142 250 C 136 185, 150 132, 176 110 C 188 102, 198 104, 208 112 C 232 132, 256 156, 272 178 Z" fill="url(#mEar)"/>
      ${f.svg()}
      <path d="M162 226 C 160 182, 170 147, 185 132 C 192 126, 199 128, 206 135 C 222 151, 238 168, 248 184 Z" fill="url(#mEarIn)"/>
      <path d="M170 220 C 170 190, 178 160, 188 146 C 200 160, 214 176, 226 190 Z" fill="#E89AA6" opacity=".35" filter="url(#mBlur5)"/>
      ${tufts.svg()}`;
  }

  function bodyFur() {
    const edge = new Fur(), edge2 = new Fur(), inner = new Fur();
    for (let th = -Math.PI; th < Math.PI; th += .02) {
      const t = th + rr(-.008, .008);
      const s = Math.sin(t), c = Math.cos(t);
      if (s > .8) continue; // floor contact under the paws
      const [x, y] = bodyP(t);
      const ang = Math.atan2(s + .65, c) + rr(-.2, .2);
      const L = s > .15 ? rr(20, 34) : rr(14, 24);
      edge.add(s < -.1 ? 'var(--f-body0)' : 'var(--f-body1)', .96, x - c * 9, y - s * 9, ang, L, rr(3.6, 5.4), rr(-.24, .24));
      if (s > .1) edge2.add('var(--f-belly)', .9, x - c * 16, y - s * 12, ang + rr(-.1, .1), L * .75, rr(3, 4.4), rr(-.24, .24));
    }
    for (let i = 0; i < 420; i++) {
      const a = rr(0, TAU), k = Math.sqrt(R());
      const x = BC.x + Math.cos(a) * 170 * k, y = BC.y + Math.sin(a) * 150 * k;
      const edge = Math.abs(x - 300) > 110;
      const p = R();
      const col = p < .45 ? 'var(--f-light)' : p < .8 ? (edge ? 'var(--f-body0)' : 'var(--f-mid)') : '#FFFFFF';
      inner.add(col, p < .45 ? .55 : p < .8 ? .4 : .5, x, y, Math.PI / 2 + (x - 300) / 260 + rr(-.22, .22), rr(16, 30), rr(2.2, 3.6), rr(-.22, .22));
    }
    return { edge: edge.svg(), edge2: edge2.svg(), inner: inner.svg() };
  }

  function ruffFur() {
    // chest mane: rows of V-shaped locks, painted bottom → top
    const deep = new Fur(), light = new Fur(), hi = new Fur();
    for (let r = 7; r >= 0; r--) {
      const y0 = 402 + r * 23, half = 160 - r * 13;
      for (let x = 300 - half; x <= 300 + half; x += rr(8, 12)) {
        const dx = (x - 300) / half;
        const ang = Math.PI / 2 + dx * .5 + rr(-.12, .12);
        const L = 34 + (1 - Math.abs(dx)) * 18 + rr(-5, 6);
        const y = y0 + rr(-5, 5) + Math.abs(dx) * 10;
        if (R() < .35) deep.add('var(--f-body1)', .85, x - 3, y + 4, ang + .08, L * .9, rr(4, 6), rr(-.15, .15));
        light.add(R() < .6 ? 'var(--f-belly)' : 'var(--f-light)', .97, x, y, ang, L, rr(5.5, 8.5), rr(-.22, .22));
        if (R() < .3) hi.add('#FFFFFF', .8, x + rr(-2, 2), y + 2, ang + rr(-.05, .05), L * .7, rr(1.6, 2.6), rr(-.12, .12));
      }
    }
    return deep.svg() + light.svg() + hi.svg();
  }

  function legFur() {
    const f = new Fur();
    [262, 338].forEach((cx) => {
      for (let i = 0; i < 26; i++) {
        const x = cx + rr(-30, 30), y = rr(570, 626);
        f.add(R() < .5 ? 'var(--f-belly)' : 'var(--f-light)', .75, x, y, Math.PI / 2 + (x - cx) / 90 + rr(-.1, .1), rr(12, 22), rr(3.4, 5), rr(-.2, .2));
      }
    });
    return f.svg();
  }

  function legArt(cx, side) {
    // soft column with fuzzy edges and a little volume shading
    const edge = new Fur(), tex = new Fur();
    for (let y = 556; y < 646; y += 4.5) {
      const k = (y - 556) / 90, half = 34 - k * 4;
      [-1, 1].forEach((s) => {
        const col = s === side ? 'var(--f-body1)' : 'var(--f-belly)';
        edge.add(col, .92, cx + s * (half - 4), y + rr(-2, 2), Math.PI / 2 - s * rr(.35, .7), rr(10, 17), rr(2.6, 3.6), rr(-.2, .2));
      });
    }
    for (let i = 0; i < 26; i++) {
      const x = cx + rr(-24, 24), y = rr(566, 630);
      tex.add(R() < .6 ? 'var(--f-light)' : 'var(--f-body1)', R() < .6 ? .7 : .45, x, y, Math.PI / 2 + (x - cx) / 80 + rr(-.12, .12), rr(12, 22), rr(2.2, 3.4), rr(-.2, .2));
    }
    return `
      <path d="M${cx - 34} 556 C ${cx - 37} 596, ${cx - 35} 628, ${cx - 30} 648 L ${cx + 30} 648 C ${cx + 35} 628, ${cx + 37} 596, ${cx + 34} 556 Z" fill="url(#mLeg${side < 0 ? 'L' : 'R'})"/>
      ${edge.svg()}${tex.svg()}`;
  }

  function pawArt(cx) {
    const f = new Fur();
    for (let i = 0; i < 16; i++) f.add('var(--f-light)', .95, cx + rr(-30, 30), rr(622, 632), Math.PI / 2 + rr(-.3, .3), rr(12, 20), rr(2.4, 3.4), rr(-.2, .2));
    const toes = new Fur();
    [-12, 0, 12].forEach((o, i) => i && toes.add('var(--f-body1)', .9, cx + o - 6, 668, -Math.PI / 2 + rr(-.08, .08), 16, 1.6));
    return `
      <ellipse cx="${cx}" cy="662" rx="30" ry="6" fill="#6B4A5A" opacity=".22" filter="url(#mBlur5)"/>
      <path d="M${cx - 36} 650 C ${cx - 38} 624, ${cx + 38} 624, ${cx + 36} 650 C ${cx + 34} 668, ${cx - 34} 668, ${cx - 36} 650 Z" style="fill:var(--f-belly)"/>
      <path d="M${cx - 30} 656 C ${cx - 20} 668, ${cx + 20} 668, ${cx + 30} 656" fill="none" stroke="#7B5A68" stroke-opacity=".12" stroke-width="5" stroke-linecap="round"/>
      ${toes.svg()}${f.svg()}`;
  }

  function tailFur() {
    const P = [[410, 622], [500, 628], [562, 582], [562, 500], [562, 440], [522, 410], [492, 432]];
    const bez = (a, b, c, d, t) => {
      const u = 1 - t;
      return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]];
    };
    const pts = [];
    for (let i = 0; i <= 60; i++) {
      const T = i / 60, seg = T < .6 ? 0 : 1, t = seg ? (T - .6) / .4 : T / .6;
      const q = seg ? bez(P[3], P[4], P[5], P[6], t) : bez(P[0], P[1], P[2], P[3], t);
      pts.push([q[0], q[1], T]);
    }
    const a = new Fur(), b = new Fur(), c = new Fur();
    for (let i = 1; i < pts.length - 1; i++) {
      const [x, y, T] = pts[i];
      const tx = pts[i + 1][0] - pts[i - 1][0], ty = pts[i + 1][1] - pts[i - 1][1];
      const ta = Math.atan2(ty, tx), nx = -Math.sin(ta), ny = Math.cos(ta);
      const w = 22 + 16 * T;
      for (let k = 0; k < 4; k++) {
        const side = k % 2 ? 1 : -1;
        const off = side * w * rr(.1, .8);
        const ang = Math.atan2(Math.sin(ta) * .6 + ny * side, Math.cos(ta) * .6 + nx * side) + rr(-.2, .2);
        const L = 18 + 18 * T + rr(-3, 5);
        (T < .45 ? a : b).add(T < .45 ? 'var(--f-body0)' : 'var(--f-body1)', .95, x + nx * off, y + ny * off, ang, L, rr(4.4, 6.4), rr(-.24, .24));
        if (T > .5) c.add(T > .8 ? '#FFFFFF' : 'var(--f-belly)', .9, x + nx * off * .6, y + ny * off * .6, ang + rr(-.1, .1), L * .75, rr(3.4, 5), rr(-.24, .24));
      }
    }
    return `<path d="M410 622 C 500 628, 562 582, 562 500 C 562 440, 522 410, 492 432" fill="none" stroke="url(#mTail)" stroke-width="66" stroke-linecap="round"/>` + a.svg() + b.svg() + c.svg();
  }

  function whiskers(side) {
    const f = new Fur(), sh = new Fur();
    const sx = side < 0 ? 270 : 330;
    [[358, -.12, 150], [364, .04, 158], [370, .2, 146], [376, .36, 120]].forEach(([y, tilt, L]) => {
      const ang = (side < 0 ? Math.PI : 0) + tilt * (side < 0 ? -1 : 1);
      sh.add('#6B4A5A', .16, sx, y + 1.6, ang, L, 1.4, side * .03);
      f.add('#FFFFFF', .96, sx, y, ang, L, 1.5, side * .03);
    });
    return sh.svg() + f.svg();
  }

  function irisFibers(cx, cy) {
    const lite = new Fur(), dark = new Fur();
    for (let i = 0; i < 70; i++) {
      const a = rr(0, TAU), r0 = rr(30, 34);
      lite.add('var(--eye-in)', .45, cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, a + rr(-.08, .08), rr(8, 14), rr(.8, 1.3), rr(-.1, .1));
    }
    for (let i = 0; i < 40; i++) {
      const a = rr(0, TAU), r0 = rr(36, 40);
      dark.add('var(--eye-out)', .45, cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, a, rr(5, 9), rr(.7, 1.1));
    }
    return lite.svg() + dark.svg();
  }

  function eye({ x: cx, y: cy, s }) {
    const outer = s === 'L' ? -1 : 1;
    const wing = new Fur().add('var(--f-stripe)', .45, cx + outer * 44, cy + 6, s === 'L' ? Math.PI * .86 : Math.PI * .14, 20, 2.4, .05).svg();
    return `
      <g id="eye${s}">
        <g id="rim${s}">
          <circle cx="${cx}" cy="${cy}" r="55" fill="#7B5A68" opacity=".16" filter="url(#mBlur5)"/>
          <circle cx="${cx}" cy="${cy}" r="48.5" fill="none" style="stroke:var(--f-stripe)" stroke-opacity=".38" stroke-width="3" filter="url(#mBlur2)"/>
        </g>
        ${wing}
        <g clip-path="url(#mEyeClip${s})"><g id="ball${s}">
          <circle cx="${cx}" cy="${cy}" r="47" fill="#1A1412"/>
          <g id="iris${s}">
            <circle cx="${cx}" cy="${cy}" r="50" fill="url(#mIris)"/>
            ${irisFibers(cx, cy)}
            <circle cx="${cx}" cy="${cy}" r="44" fill="none" style="stroke:var(--eye-out)" stroke-width="6" opacity=".8" filter="url(#mBlur2)"/>
            <circle cx="${cx}" cy="${cy}" r="34" fill="none" style="stroke:var(--eye-in)" stroke-width="3" opacity=".45" filter="url(#mBlur1)"/>
            <circle id="pupil${s}" cx="${cx}" cy="${cy}" r="30" fill="#0B0807" filter="url(#mBlur1)"/>
          </g>
          <ellipse cx="${cx}" cy="${cy + 32}" rx="30" ry="11" style="fill:var(--eye-in)" opacity=".28" filter="url(#mBlur5)"/>
          <ellipse cx="${cx}" cy="${cy - 42}" rx="54" ry="22" fill="#000" opacity=".4" filter="url(#mBlur5)"/>
          <circle cx="${cx}" cy="${cy}" r="46.5" fill="none" stroke="#2A1E1A" stroke-width="5"/>
          <g id="glint${s}">
            <path d="M${cx - 27} ${cy - 20} q2 -12 14 -14 q9 -1 10 6 q0 8 -10 12 q-12 5 -14 -4z" fill="#FFFFFF" opacity=".96"/>
            <circle cx="${cx + 17}" cy="${cy + 16}" r="5.5" fill="#FFFFFF" opacity=".85"/>
            <circle cx="${cx - 2}" cy="${cy - 27}" r="2.6" fill="#FFFFFF" opacity=".85"/>
            <path d="M${cx - 30} ${cy + 22} Q${cx} ${cy + 44} ${cx + 32} ${cy + 20}" fill="none" stroke="#FFFFFF" stroke-width="2.5" opacity=".22" stroke-linecap="round"/>
          </g>
        </g></g>
        <g clip-path="url(#mLidClip${s})">
          <path id="lidU${s}" d="" fill="url(#mLidU)"/>
          <path id="lidD${s}" d="" fill="url(#mLidD)"/>
          <path id="lash${s}" d="" fill="none" stroke="#2A1E1C" stroke-width="4" stroke-linecap="round"/>
        </g>
      </g>`;
  }

  function muzzle() {
    const dots = [];
    [[-1, 1]].forEach(() => {});
    [-1, 1].forEach((side) => {
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
        dots.push(`<circle cx="${f1(300 + side * (16 + c * 9 + r * 3))}" cy="${f1(356 + r * 7 + c * 1.5)}" r="1.5"/>`);
      }
    });
    return `
      <g filter="url(#mBlur2)">
        <ellipse cx="279" cy="362" rx="30" ry="22" fill="url(#mPad)"/>
        <ellipse cx="321" cy="362" rx="30" ry="22" fill="url(#mPad)"/>
        <ellipse cx="300" cy="388" rx="22" ry="13" fill="#FFFFFF" opacity=".9"/>
      </g>
      <g style="fill:var(--f-stripe)" opacity=".32">${dots.join('')}</g>`;
  }

  /* =========================================================
     defs + assembly
     ========================================================= */
  const DEFS = `
    <radialGradient id="mHead" cx=".48" cy=".62" r=".62">
      <stop offset="0" style="stop-color:var(--f-light)"/><stop offset=".4" style="stop-color:var(--f-soft)"/><stop offset=".78" style="stop-color:var(--f-mid)"/><stop offset="1" style="stop-color:var(--f-top)"/>
    </radialGradient>
    <linearGradient id="mBody" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" style="stop-color:var(--f-body0)"/><stop offset=".45" style="stop-color:var(--f-body1)"/><stop offset="1" style="stop-color:var(--f-belly)"/>
    </linearGradient>
    <radialGradient id="mSide" cx=".45" cy=".45" r=".6"><stop offset=".55" stop-color="#6B4A5A" stop-opacity="0"/><stop offset="1" stop-color="#6B4A5A" stop-opacity=".22"/></radialGradient>
    <linearGradient id="mTail" x1="0" y1="1" x2=".4" y2="0"><stop offset="0" style="stop-color:var(--f-body0)"/><stop offset="1" style="stop-color:var(--f-belly)"/></linearGradient>
    <linearGradient id="mEar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--f-ear)"/><stop offset="1" style="stop-color:var(--f-mid)"/></linearGradient>
    <linearGradient id="mEarIn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0A9B4"/><stop offset="1" stop-color="#FCE0E3"/></linearGradient>
    <radialGradient id="mRuff" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".7" style="stop-color:var(--f-belly)"/><stop offset="1" style="stop-color:var(--f-body1)"/></radialGradient>
    <radialGradient id="mPad" cx=".45" cy=".4" r=".6"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" style="stop-color:var(--f-light)"/></radialGradient>
    <radialGradient id="mIris" cx=".5" cy=".5" r=".5">
      <stop offset=".55" style="stop-color:var(--eye-in)"/><stop offset=".78" style="stop-color:var(--eye)"/><stop offset="1" style="stop-color:var(--eye-out)"/>
    </radialGradient>
    <linearGradient id="mLegL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--f-body1)"/><stop offset=".45" style="stop-color:var(--f-light)"/><stop offset="1" style="stop-color:var(--f-belly)"/></linearGradient>
    <linearGradient id="mLegR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--f-belly)"/><stop offset=".55" style="stop-color:var(--f-light)"/><stop offset="1" style="stop-color:var(--f-body1)"/></linearGradient>
    <linearGradient id="mNose" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAC7CA"/><stop offset="1" stop-color="#EB97A2"/></linearGradient>
    <linearGradient id="mLidU" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--f-soft)"/><stop offset=".78" style="stop-color:var(--f-soft)"/><stop offset="1" style="stop-color:var(--f-mid)"/></linearGradient>
    <linearGradient id="mLidD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--f-mid)"/><stop offset=".25" style="stop-color:var(--f-soft)"/><stop offset="1" style="stop-color:var(--f-light)"/></linearGradient>
    <linearGradient id="mRim" x1="0" y1="0" x2="1" y2=".3"><stop offset=".55" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="1" stop-color="#FFFFFF" stop-opacity=".95"/></linearGradient>
    <filter id="mSoft" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation=".7"/></filter>
    <filter id="mBlur1" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1"/></filter>
    <filter id="mBlur2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2"/></filter>
    <filter id="mBlur5" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="mBlur12" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12"/></filter>
    <filter id="mBlur20" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="20"/></filter>
    <clipPath id="mHeadClip"><path d="${HEAD_D}"/></clipPath>
    <clipPath id="mBodyClip"><path d="${BODY_D}"/></clipPath>
    <clipPath id="mEyeClipL"><circle cx="238" cy="298" r="46"/></clipPath>
    <clipPath id="mEyeClipR"><circle cx="362" cy="298" r="46"/></clipPath>
    <clipPath id="mLidClipL"><circle cx="238" cy="298" r="48.5"/></clipPath>
    <clipPath id="mLidClipR"><circle cx="362" cy="298" r="48.5"/></clipPath>
    <g id="mEarShape">${earFur()}</g>`;

  function markup() {
    R = mulberry(20260927);
    const hf = headFur(), bf = bodyFur();
    const brows = new Fur()
      .add('#8E7466', .8, 208, 250, -.34, 44, 3.4, -.04)
      .add('#8E7466', .8, 392, 250, Math.PI + .34, 44, 3.4, .04).svg();
    const lashes = (cx, dir) => { const f = new Fur(); [-.5, 0, .5].forEach((o) => f.add('#3A2A2A', .9, cx + o * 40, 298 + (dir > 0 ? 12 : -2) - Math.abs(o) * 8 * dir, Math.PI / 2 * dir + o * .6, 9, 1.6)); return f.svg(); };
    return `
      <g id="catInner">
        <ellipse id="catShadow" cx="300" cy="672" rx="190" ry="18" fill="#7B4E68" opacity=".22" filter="url(#mBlur12)"/>
        <ellipse cx="300" cy="666" rx="150" ry="8" fill="#5A3A4E" opacity=".2" filter="url(#mBlur5)"/>

        <g id="tail"><g filter="url(#mSoft)">${tailFur()}</g></g>

        <g id="bodyG">
          <path d="${BODY_D}" fill="url(#mBody)"/>
          <path d="${BODY_D}" fill="url(#mSide)"/>
          <g filter="url(#mSoft)">${bf.edge}</g>${bf.inner}${bf.edge2}
          <g clip-path="url(#mBodyClip)"><path d="${BODY_D}" fill="none" stroke="url(#mRim)" stroke-width="22" opacity=".28" filter="url(#mBlur12)"/></g>
          <g>
            ${legArt(264, -1)}${legArt(336, 1)}
            <path d="M300 560 V650" stroke="#6B4A5A" stroke-opacity=".12" stroke-width="10" filter="url(#mBlur5)"/>
          </g>
          <path d="M172 402 C 190 350, 410 350, 428 402 C 444 474, 392 548, 300 568 C 208 548, 156 474, 172 402 Z" fill="url(#mRuff)"/>
          ${ruffFur()}
          <ellipse cx="300" cy="446" rx="142" ry="34" fill="#5A3A4E" opacity=".16" filter="url(#mBlur12)"/>
          <use id="slotCollar" href="#col-cyber"/>
          <g id="dirtBody" style="display:none" fill="#8C7060" opacity=".38" filter="url(#mBlur2)">
            <ellipse cx="190" cy="520" rx="16" ry="11"/><ellipse cx="410" cy="560" rx="14" ry="10"/><ellipse cx="250" cy="606" rx="10" ry="8"/><circle cx="380" cy="480" r="6"/>
          </g>
        </g>

        <g id="head">
          <use id="slotHatBack" href="#hat-star-b" style="display:none"/>
          <g filter="url(#mSoft)">${maneFur()}</g>
          <g id="ears">
            <g id="earL"><use href="#mEarShape"/></g>
            <g id="earR"><g transform="translate(600 0) scale(-1 1)"><use href="#mEarShape"/></g></g>
          </g>
          <g filter="url(#mSoft)">${hf.cheeks}</g>
          <path d="${HEAD_D}" fill="url(#mHead)"/>
          <g filter="url(#mSoft)">${hf.under}</g>
          <g clip-path="url(#mHeadClip)">
            <ellipse cx="300" cy="168" rx="150" ry="70" style="fill:var(--f-tabby)" opacity=".5" filter="url(#mBlur20)"/>
            <ellipse cx="138" cy="268" rx="40" ry="90" style="fill:var(--f-tabby)" opacity=".2" filter="url(#mBlur20)"/>
            <ellipse cx="462" cy="268" rx="40" ry="90" style="fill:var(--f-tabby)" opacity=".2" filter="url(#mBlur20)"/>
            ${hf.inner}
            <ellipse cx="232" cy="200" rx="110" ry="62" fill="#FFFFFF" opacity=".3" filter="url(#mBlur20)"/>
            <path d="${HEAD_D}" fill="none" stroke="url(#mRim)" stroke-width="18" opacity=".4" filter="url(#mBlur12)"/>
          </g>
          ${hf.over}
          <g id="blush" opacity=".45" filter="url(#mBlur12)"><ellipse cx="190" cy="356" rx="32" ry="15" fill="#F6A5B8"/><ellipse cx="410" cy="356" rx="32" ry="15" fill="#F6A5B8"/></g>
          <g id="dirtFace" style="display:none" fill="#8C7060" opacity=".35" filter="url(#mBlur2)"><ellipse cx="410" cy="250" rx="14" ry="9"/><circle cx="180" cy="232" r="7"/></g>

          ${muzzle()}

          <g id="eyesOpen">${eye(EYES[0])}${eye(EYES[1])}</g>
          <g id="happyEyes" style="display:none" fill="none" stroke="#35262A" stroke-width="7" stroke-linecap="round">
            <path d="M205 308 Q238 268 271 308"/><path d="M329 308 Q362 268 395 308"/>
          </g>
          <g id="sleepEyes" style="display:none">
            <g fill="none" stroke="#35262A" stroke-width="6" stroke-linecap="round"><path d="M207 298 Q238 324 269 298"/><path d="M331 298 Q362 324 393 298"/></g>
            ${lashes(238, 1)}${lashes(362, 1)}
          </g>
          <g id="sadBrows" style="display:none">${brows}</g>

          <path d="M286 333 Q300 327 314 333 Q318 338 309 346 L302 352 Q300 354 298 352 L291 346 Q282 338 286 333 Z" fill="url(#mNose)" stroke="#D98791" stroke-width="1.6"/>
          <path d="M292 340 q3 3 6 1 M308 340 q-3 3 -6 1" stroke="#C9737F" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/>
          <ellipse cx="295" cy="334" rx="5" ry="2.2" fill="#FFFFFF" opacity=".75"/>
          <ellipse id="mouthOpen" cx="300" cy="371" rx="10" ry="0" fill="#C0646E"/>
          <path id="mouthLine" d="M300 352 L300 361 M300 361 Q294 370 285 366 M300 361 Q306 370 315 366" stroke="#B98680" stroke-width="2.4" fill="none" stroke-linecap="round"/>
          <g id="whiskL">${whiskers(-1)}</g>
          <g id="whiskR">${whiskers(1)}</g>
          <use id="slotHatFront" href="#hat-star-f" style="display:none"/>
        </g>

        <g id="paws">
          <g>${pawArt(258)}</g>
          <g id="pawR">${pawArt(342)}</g>
        </g>
        <g id="foam"></g>
      </g>`;
  }

  // ---------- runtime API ----------
  let lastLid = -1;
  const api = {
    build() {
      const cat = document.getElementById('cat');
      const svg = cat.ownerSVGElement;
      let defs = svg.querySelector('defs');
      if (!defs) { defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs'); svg.prepend(defs); }
      if (!document.getElementById('mHead')) defs.insertAdjacentHTML('beforeend', DEFS);
      cat.innerHTML = markup();
      lastLid = -1;
      api.eyes(0, 0, 0, 1);
    },
    // ex/ey: gaze offset, dil: 0..1 pupil dilation, s: 1 open … 0 closed
    eyes(ex, ey, dil, s) {
      EYES.forEach((e) => {
        const g = document.getElementById('iris' + e.s);
        if (!g) return;
        g.setAttribute('transform', `translate(${f1(ex)} ${f1(ey)})`);
        document.getElementById('pupil' + e.s).setAttribute('r', f1(28 + dil * 8));
        document.getElementById('glint' + e.s).setAttribute('transform', `translate(${f1(ex * .25)} ${f1(ey * .25)})`);
      });
      const q = Math.round(s * 100) / 100;
      if (q === lastLid) return;
      lastLid = q;
      EYES.forEach(({ x: cx, y: cy, s: k }) => {
        const c = 1 - q;
        const up = cy - 56 + c * 62, low = cy + 53 - c * 44;
        const sag = 6 + c * 18;
        document.getElementById('lidU' + k).setAttribute('d', `M${cx - 52} ${cy - 60}H${cx + 52}V${f1(up)}Q${cx} ${f1(up + sag)} ${cx - 52} ${f1(up)}Z`);
        document.getElementById('lidD' + k).setAttribute('d', `M${cx - 52} ${cy + 60}H${cx + 52}V${f1(low)}Q${cx} ${f1(low - 6 * c)} ${cx - 52} ${f1(low)}Z`);
        document.getElementById('lash' + k).setAttribute('d', q > .97 ? '' : `M${cx - 50} ${f1(up)}Q${cx} ${f1(up + sag)} ${cx + 50} ${f1(up)}`);
        const rim = document.getElementById('rim' + k);
        if (rim) rim.setAttribute('opacity', f1(Math.max(0, (q - .35) / .65)));
        const ball = document.getElementById('ball' + k);
        if (ball) ball.setAttribute('opacity', f1(Math.min(1, q / .3)));
      });
    },
  };
  api.Fur = Fur;
  api.rng = mulberry;
  api.smooth = smoothClosed;
  window.CatModel = api;
  if (document.getElementById('cat')) api.build();
})();
