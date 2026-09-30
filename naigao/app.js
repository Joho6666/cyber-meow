(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- data ----------
  const HATS = [
    { id: 'none',  no: '00', name: '原装',     en: 'Au Naturel', title: '原装<br>奶糕',     note: '什么都不戴，也能上封面。' },
    { id: 'star',  no: '01', name: '黄油星星', en: 'Butter Star', title: '黄油<br>小星星',  note: '五个软软的角，一张圆圆的脸。', back: 'hat-star-b', front: 'hat-star-f', hideEars: true },
    { id: 'bunny', no: '02', name: '兔兔帽',   en: 'Lapin',       title: '今天<br>是兔兔',  note: '胡萝卜不在今天的菜单上。',   back: 'hat-bunny-b', front: 'hat-bunny-f', hideEars: true },
    { id: 'bear',  no: '03', name: '小熊毛球', en: 'Teddy Knit',  title: '头顶<br>一颗毛球', note: '羊羔绒，摸起来像刚出炉的面包。', front: 'hat-bear-f', hideEars: true },
    { id: 'bow',   no: '04', name: '樱花结',   en: 'Sakura Bow',  title: '樱花色<br>蝴蝶结', note: '别在右耳边，刚刚好。', front: 'hat-bow-f' },
  ];
  const COLLARS = [
    { id: 'none',    no: '00', name: '留白',     line: '领口留白，露出围脖毛。' },
    { id: 'gingham', no: '05', name: '格纹蕾丝', line: '复古格纹 × 蕾丝小翻领', use: 'col-gingham' },
    { id: 'tie',     no: '06', name: '草莓领带', line: '今日职位：草莓部经理', use: 'col-tie' },
    { id: 'bbf',     no: '07', name: '黄油领巾', line: 'Best Butter Friends 限定', use: 'col-bbf' },
  ];
  const MEOWS = ['喵～', '喵？', '咪。', 'mew.', '喵呜——', '……喵', '喵喵！'];
  const PURRS = [['呼噜', 'cn'], ['prrr', ''], ['呼噜噜', 'cn'], ['♡', 'heart'], ['prr…', '']];

  // ---------- state ----------
  const KEY = 'naigao.v1';
  const todayStr = new Date().toISOString().slice(0, 10);
  const S = Object.assign(
    { name: 'Naigao', hat: 'star', collar: 'none', props: { teddy: true, carrot: false, basket: false }, first: Date.now(), day: todayStr, pets: 0, meows: 0 },
    (() => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } })()
  );
  if (S.day !== todayStr) { S.day = todayStr; S.pets = 0; S.meows = 0; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };

  const mode = { wand: false, sleep: false };

  // ---------- elements ----------
  const svg = $('#scene'), cover = $('#cover'), fx = $('#fx'), bubble = $('#bubble');
  const el = (id) => document.getElementById(id);
  const E = {
    catInner: el('catInner'), head: el('head'), bodyG: el('bodyG'), tail: el('tail'),
    earL: el('earL'), earR: el('earR'), ears: el('ears'),
    eyeL: el('eyeL'), eyeR: el('eyeR'), pupilL: el('pupilL'), pupilR: el('pupilR'),
    glintL: el('glintL'), glintR: el('glintR'),
    eyesOpen: el('eyesOpen'), happyEyes: el('happyEyes'), sleepEyes: el('sleepEyes'),
    blush: el('blush'), mouthOpen: el('mouthOpen'), whiskL: el('whiskL'), whiskR: el('whiskR'),
    pawR: el('pawR'), paws: el('paws'), shadow: el('catShadow'),
    slotHatBack: el('slotHatBack'), slotHatFront: el('slotHatFront'), slotCollar: el('slotCollar'),
    teddy: el('teddy'), carrot: el('carrot'), basketBack: el('basketBack'), basketFront: el('basketFront'),
    wand: el('wand'), wandLine: el('wandLine'), feather: el('feather'), featherRot: el('featherRot'),
    mast: el('masthead'),
  };

  // star hood outline
  (function buildStar() {
    const cx = 300, cy = 262, R = 228, r = 150, rot = -6;
    let d = '';
    for (let i = 0; i < 10; i++) {
      const a = (-90 + rot + i * 36) * Math.PI / 180;
      const rr = i % 2 ? r : R;
      d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1);
    }
    el('starShape').setAttribute('d', d + 'Z');
  })();

  // ---------- coordinates ----------
  const CAT = { tx: 125, ty: 245, s: 1.25 };
  const pt = svg.createSVGPoint();
  function toGlobal(e) {
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }
  const toLocal = (g) => ({ x: (g.x - CAT.tx) / CAT.s, y: (g.y - CAT.ty) / CAT.s });
  const L2G = (x, y) => ({ x: CAT.tx + x * CAT.s, y: CAT.ty + y * CAT.s });
  const onCat = (p) =>
    ((p.x - 300) / 205) ** 2 + ((p.y - 290) / 180) ** 2 < 1 ||
    ((p.x - 300) / 195) ** 2 + ((p.y - 515) / 180) ** 2 < 1;

  // ---------- fx ----------
  function spawn(text, gx, gy, cls = '') {
    const s = document.createElement('span');
    s.className = 'pfx ' + cls;
    s.textContent = text;
    s.style.left = (gx / 10) + '%';
    s.style.top = (gy / 12.5) + '%';
    s.style.setProperty('--dx', ((Math.random() - .5) * 50).toFixed(0) + 'px');
    s.style.setProperty('--rot', ((Math.random() - .5) * 28).toFixed(0) + 'deg');
    fx.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  }
  let bubbleTimer;
  function say(text) {
    const g = L2G(448, 142);
    bubble.textContent = text;
    bubble.style.left = (g.x / 10) + '%';
    bubble.style.top = (g.y / 12.5) + '%';
    bubble.classList.remove('show');
    void bubble.offsetWidth;
    bubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove('show'), 1500);
  }
  function restart(node, cls) { node.classList.remove(cls); void node.getBoundingClientRect(); node.classList.add(cls); }

  // ---------- wardrobe ----------
  function setUse(node, id) {
    if (id) { node.setAttribute('href', '#' + id); node.style.display = ''; }
    else node.style.display = 'none';
  }
  function hatPreview(h) {
    return (h.back ? `<use href="#${h.back}"/>` : '') +
      (h.hideEars ? '' : '<use href="#miniEars"/>') +
      '<use href="#miniFace"/>' +
      (h.front ? `<use href="#${h.front}"/>` : '');
  }
  function collarPreview(c) {
    return '<use href="#miniChest"/>' + (c.use ? `<use href="#${c.use}"/>` : '') + '<use href="#miniChin"/>';
  }
  function buildGrid(root, items, kind) {
    items.forEach((it) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'card';
      b.dataset.id = it.id;
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', it.name);
      b.innerHTML =
        `<svg viewBox="${kind === 'hat' ? '30 -115 540 600' : '140 360 320 250'}" aria-hidden="true">${kind === 'hat' ? hatPreview(it) : collarPreview(it)}</svg>` +
        `<span class="lbl"><span class="n">${it.no}</span>${it.name}</span>`;
      b.addEventListener('click', () => {
        if (kind === 'hat') S.hat = it.id; else S.collar = it.id;
        applyLook(true);
      });
      root.appendChild(b);
    });
  }
  buildGrid(el('hatGrid'), HATS, 'hat');
  buildGrid(el('collarGrid'), COLLARS, 'collar');

  function applyLook(animate) {
    const hi = Math.max(0, HATS.findIndex((x) => x.id === S.hat));
    const ci = Math.max(0, COLLARS.findIndex((x) => x.id === S.collar));
    const h = HATS[hi], c = COLLARS[ci];

    setUse(E.slotHatBack, h.back);
    setUse(E.slotHatFront, h.front);
    setUse(E.slotCollar, c.use);
    E.ears.style.display = h.hideEars ? 'none' : '';

    el('cvTitle').innerHTML = h.title;
    el('cvEn').textContent = h.en;
    el('cvNote').textContent = h.note;
    el('cvCollar').textContent = c.line;
    el('cvNo').textContent = String(hi * COLLARS.length + ci + 1).padStart(2, '0');

    document.querySelectorAll('#hatGrid .card').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === h.id)));
    document.querySelectorAll('#collarGrid .card').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === c.id)));

    if (animate) {
      anim.hop = performance.now();
      [E.slotHatBack, E.slotHatFront, E.slotCollar].forEach((n) => restart(n, 'pop-in'));
      restart(el('lookBlock'), 'swap');
      restart(el('noBlock'), 'swap');
      if (Math.random() < .5) setTimeout(() => say(pick(['好看吗？', '喵！', '这件可以。', '拍我拍我'])), 380);
    }
    save();
  }

  function applyProps() {
    const p = S.props;
    E.teddy.style.display = p.teddy ? '' : 'none';
    E.carrot.style.display = p.carrot ? '' : 'none';
    E.basketBack.style.display = E.basketFront.style.display = p.basket ? '' : 'none';
    E.paws.setAttribute('transform', p.basket ? 'translate(0 -70)' : '');
    E.shadow.setAttribute('rx', p.basket ? 260 : 200);
    document.querySelectorAll('[data-prop]').forEach((b) => b.setAttribute('aria-pressed', String(!!p[b.dataset.prop])));
    save();
  }
  document.querySelectorAll('[data-prop]').forEach((b) =>
    b.addEventListener('click', () => {
      S.props[b.dataset.prop] = !S.props[b.dataset.prop];
      applyProps();
      anim.hop = performance.now();
    })
  );

  // ---------- name / masthead ----------
  const nameInput = el('nameInput');
  function setName(n) {
    const name = (n || '').trim() || 'Naigao';
    const m = E.mast;
    m.textContent = name;
    m.removeAttribute('textLength');
    m.removeAttribute('lengthAdjust');
    const cjk = /[　-鿿＀-￯]/.test(name);
    m.classList.toggle('cjk', cjk);
    m.style.fontSize = '';
    try {
      const w = m.getComputedTextLength();
      if (w > 900) {
        if (cjk) m.style.fontSize = Math.floor(300 * 900 / w) + 'px';
        else { m.setAttribute('textLength', '900'); m.setAttribute('lengthAdjust', 'spacingAndGlyphs'); }
      }
    } catch {}
    document.title = `${name} — 一只电子小猫`;
  }
  nameInput.value = S.name;
  nameInput.addEventListener('input', () => { S.name = nameInput.value; setName(S.name); save(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => setName(S.name));

  // ---------- stats ----------
  function mood() {
    if (mode.sleep) return '睡着了 zZ';
    if (S.pets >= 12) return '满足到融化';
    if (S.pets >= 5) return '很开心';
    if (S.pets >= 1) return '心情不错';
    return '有点想你';
  }
  function renderStats() {
    const days = Math.floor((Date.now() - S.first) / 864e5) + 1;
    el('statPets').textContent = S.pets;
    el('statMeows').textContent = S.meows;
    el('statDays').textContent = days;
    el('cvPets').textContent = S.pets;
    el('cvMood').textContent = mood();
    el('cvIssue').textContent = String(days).padStart(3, '0');
  }

  // cover date + barcode
  (function coverMeta() {
    const d = new Date();
    el('cvDate').textContent = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
    let seed = 20260927;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    let html = '';
    for (let i = 0; i < 38; i++) {
      html += `<i style="width:${(1 + Math.floor(rnd() * 3)) * .9}px;margin-right:${(1 + Math.floor(rnd() * 2)) * .9}px"></i>`;
    }
    el('barcode').innerHTML = html;
  })();

  // ---------- play modes ----------
  const btnWand = el('btnWand'), btnSleep = el('btnSleep');
  function setWand(v) {
    mode.wand = v;
    cover.classList.toggle('wand', v);
    E.wand.style.display = v ? '' : 'none';
    btnWand.setAttribute('aria-pressed', String(v));
    if (v) {
      if (mode.sleep) setSleep(false);
      if (!gPointer) { feather.x = 760; feather.y = 620; }
      say(pick(['！', '那是什么…', '（盯——）']));
    }
  }
  function setSleep(v) {
    mode.sleep = v;
    cover.classList.toggle('sleeping', v);
    btnSleep.setAttribute('aria-pressed', String(v));
    if (v) { if (mode.wand) setWand(false); bubble.classList.remove('show'); }
    renderStats();
  }
  btnWand.addEventListener('click', () => setWand(!mode.wand));
  btnSleep.addEventListener('click', () => setSleep(!mode.sleep));
  el('btnMeow').addEventListener('click', () => { if (mode.sleep) { setSleep(false); say('……喵？'); } else meow(); });

  function meow() {
    S.meows++; save(); renderStats();
    anim.meowUntil = performance.now() + 650;
    anim.squish = performance.now();
    say(pick(MEOWS));
  }

  // ---------- pointer ----------
  let gPointer = null, pLocal = null, lastMove = -1e9, down = null, petting = false;
  const feather = { x: 760, y: 620, px: 760, rot: 0 };

  svg.addEventListener('pointermove', (e) => {
    const g = toGlobal(e);
    gPointer = g; pLocal = toLocal(g); lastMove = performance.now();
    if (down) {
      const d = Math.hypot(pLocal.x - down.x, pLocal.y - down.y);
      down.dist += d; down.x = pLocal.x; down.y = pLocal.y;
      if (down.dist > 36 && onCat(pLocal)) { down.pet = true; petting = true; }
      else if (!onCat(pLocal)) petting = false;
    }
  });
  svg.addEventListener('pointerleave', () => { if (!down) { pLocal = null; } });
  svg.addEventListener('pointerdown', (e) => {
    const g = toGlobal(e), p = toLocal(g);
    gPointer = g; pLocal = p; lastMove = performance.now();
    if (mode.wand || !onCat(p)) return;
    if (mode.sleep) { setSleep(false); say('……喵？'); return; }
    down = { x: p.x, y: p.y, dist: 0, pet: false };
    try { svg.setPointerCapture(e.pointerId); } catch {}
  });
  svg.addEventListener('pointerup', (e) => {
    if (!down) return;
    if (down.pet) {
      S.pets++; save(); renderStats();
      anim.happyUntil = performance.now() + 1500;
      const g = L2G(300 + (Math.random() - .5) * 80, 150);
      spawn('♡', g.x, g.y, 'heart');
    } else if (down.dist < 12) meow();
    down = null; petting = false;
    if (e.pointerType !== 'mouse') pLocal = null;
  });
  svg.addEventListener('pointercancel', () => { down = null; petting = false; });

  // ---------- animation ----------
  const anim = {
    hop: -1, squish: -1, meowUntil: 0, happyUntil: 0,
    blinkStart: -1, blinkDur: 150, blinkDouble: false, nextBlink: 1400,
    twitchStart: -1, twitchEar: 'L', nextTwitch: 3500,
    idleNext: 0, idleTarget: { x: 300, y: 300 },
    lastPurr: 0, lastZ: 0, lastCatch: 0,
  };
  const C = { hr: 0, hx: 0, hy: 0, ex: 0, ey: 0, pr: 37, mouth: 0, blush: .38, px: 0, py: 0, prr: 0 };

  function frame(now) {
    const t = now / 1000;
    const sleep = mode.sleep, wand = mode.wand;
    const happy = !sleep && (petting || now < anim.happyUntil);

    // feather follows pointer with a little lag
    let fLocal = null;
    if (wand) {
      const tx = gPointer ? gPointer.x : 760, ty = gPointer ? gPointer.y : 620;
      feather.px = feather.x;
      feather.x = lerp(feather.x, tx, .35);
      feather.y = lerp(feather.y, ty, .35);
      const vx = feather.x - feather.px;
      feather.rot = lerp(feather.rot, clamp(-vx * 2.4, -50, 50) + Math.sin(t * 3) * 6, .15);
      const sag = Math.max(feather.y, -60) * .45 + 140;
      E.wandLine.setAttribute('d', `M1046 -46 Q ${((1046 + feather.x) / 2).toFixed(1)} ${sag.toFixed(1)} ${feather.x.toFixed(1)} ${feather.y.toFixed(1)}`);
      E.feather.setAttribute('transform', `translate(${feather.x.toFixed(1)} ${feather.y.toFixed(1)})`);
      E.featherRot.setAttribute('transform', `rotate(${feather.rot.toFixed(1)})`);
      fLocal = toLocal({ x: feather.x, y: feather.y + 40 });
    }

    // gaze target
    let tgt = null;
    if (!sleep) {
      if (wand) tgt = fLocal;
      else if (pLocal && now - lastMove < 4500) tgt = pLocal;
      else {
        if (now > anim.idleNext) {
          anim.idleTarget = Math.random() < .45
            ? { x: 300, y: 300 }
            : { x: 300 + (Math.random() - .5) * 520, y: 250 + (Math.random() - .3) * 320 };
          anim.idleNext = now + 1800 + Math.random() * 2800;
        }
        tgt = anim.idleTarget;
      }
    }
    let ex = 0, ey = 0, thr = 0, thx = 0, thy = 0;
    if (tgt) {
      const dx = tgt.x - 300, dy = tgt.y - 300, d = Math.hypot(dx, dy) || 1;
      const m = Math.min(wand ? 8.5 : 6.5, d / 20);
      ex = dx / d * m; ey = dy / d * m;
      thr = clamp(dx / 48, -7, 7); thx = clamp(dx / 34, -9, 9); thy = clamp(dy / 50, -5, 6);
    }
    if (happy && pLocal) { thr = clamp((pLocal.x - 300) / 22, -11, 11) + Math.sin(t * 3) * 1.2; thy = -2; }
    if (sleep) { thr = 5; thx = 0; thy = 12; }

    const k = reduceMotion ? 1 : .1;
    C.hr = lerp(C.hr, thr, k); C.hx = lerp(C.hx, thx, k); C.hy = lerp(C.hy, thy, k);
    C.ex = lerp(C.ex, ex, .22); C.ey = lerp(C.ey, ey, .22);

    // breath / hop / squish
    const br = reduceMotion ? 0 : Math.sin(t * (sleep ? 1.1 : 2.0)) * (sleep ? .022 : .011);
    E.bodyG.setAttribute('transform', `translate(300 670) scale(${(1 - br * .4).toFixed(4)} ${(1 + br).toFixed(4)}) translate(-300 -670)`);
    let hopY = 0, sq = 0;
    if (anim.hop > 0) { const p = (now - anim.hop) / 460; if (p < 1) hopY = -22 * Math.sin(Math.PI * p); else anim.hop = -1; }
    if (anim.squish > 0) { const p = (now - anim.squish) / 380; if (p < 1) sq = Math.sin(Math.PI * p) * .035; else anim.squish = -1; }
    E.catInner.setAttribute('transform', `translate(0 ${hopY.toFixed(2)}) translate(300 670) scale(${(1 + sq).toFixed(4)} ${(1 - sq).toFixed(4)}) translate(-300 -670)`);
    E.head.setAttribute('transform', `translate(${C.hx.toFixed(2)} ${(C.hy - br * 140).toFixed(2)}) rotate(${C.hr.toFixed(2)} 300 420)`);

    // pupils & glints
    const prT = wand ? 43.5 : (now < anim.meowUntil ? 39 : 37);
    C.pr = lerp(C.pr, prT, .12);
    E.pupilL.setAttribute('cx', (238 + C.ex).toFixed(2)); E.pupilL.setAttribute('cy', (298 + C.ey).toFixed(2)); E.pupilL.setAttribute('r', C.pr.toFixed(2));
    E.pupilR.setAttribute('cx', (362 + C.ex).toFixed(2)); E.pupilR.setAttribute('cy', (298 + C.ey).toFixed(2)); E.pupilR.setAttribute('r', C.pr.toFixed(2));
    const gt = `translate(${(C.ex * .3).toFixed(2)} ${(C.ey * .3).toFixed(2)})`;
    E.glintL.setAttribute('transform', gt); E.glintR.setAttribute('transform', gt);

    // blink (sometimes a slow "I love you" blink)
    if (now > anim.nextBlink && anim.blinkStart < 0 && !sleep && !happy) {
      anim.blinkStart = now;
      anim.blinkDur = Math.random() < .15 ? 560 : 150;
      anim.blinkDouble = anim.blinkDur < 200 && Math.random() < .22;
    }
    let s = 1;
    if (anim.blinkStart > 0) {
      const p = (now - anim.blinkStart) / anim.blinkDur;
      if (p >= 1) {
        if (anim.blinkDouble) { anim.blinkDouble = false; anim.blinkStart = now + 70; }
        else { anim.blinkStart = -1; anim.nextBlink = now + 2000 + Math.random() * 4200; }
      } else if (p > 0) s = 1 - Math.sin(p * Math.PI) * .93;
    }
    const bt = (cy) => `translate(0 ${cy}) scale(1 ${s.toFixed(3)}) translate(0 -${cy})`;
    E.eyeL.setAttribute('transform', bt(298)); E.eyeR.setAttribute('transform', bt(298));
    E.eyesOpen.style.display = (happy || sleep) ? 'none' : '';
    E.happyEyes.style.display = happy ? '' : 'none';
    E.sleepEyes.style.display = sleep ? '' : 'none';

    // ears
    if (now > anim.nextTwitch && anim.twitchStart < 0 && !sleep) {
      anim.twitchStart = now; anim.twitchEar = Math.random() < .5 ? 'L' : 'R';
      anim.nextTwitch = now + 3500 + Math.random() * 6000;
    }
    let aL = 0, aR = 0;
    if (anim.twitchStart > 0) {
      const p = (now - anim.twitchStart) / 420;
      if (p >= 1) anim.twitchStart = -1;
      else { const a = -13 * Math.sin(p * Math.PI * 3) * (1 - p); if (anim.twitchEar === 'L') aL = a; else aR = a; }
    }
    const perk = wand ? 4 : sleep ? -6 : happy ? -4 : 0;
    E.earL.setAttribute('transform', `rotate(${(aL + perk).toFixed(2)} 205 205)`);
    E.earR.setAttribute('transform', `rotate(${(-(aR + perk)).toFixed(2)} 395 205)`);

    // tail & whiskers
    if (!reduceMotion) {
      const ta = sleep ? Math.sin(t * .5) * 2 : Math.sin(t * 1.2) * 5 + (wand ? Math.sin(t * 5) * 7 : 0) + (happy ? Math.sin(t * 2.4) * 3 : 0);
      E.tail.setAttribute('transform', `rotate(${ta.toFixed(2)} 410 625)`);
      const wa = Math.sin(t * 1.6) * 1.4 + (now < anim.meowUntil ? 3 : 0) - (sleep ? 3 : 0);
      E.whiskL.setAttribute('transform', `rotate(${wa.toFixed(2)} 270 364)`);
      E.whiskR.setAttribute('transform', `rotate(${(-wa).toFixed(2)} 330 364)`);
    }

    // mouth & blush
    C.mouth = lerp(C.mouth, now < anim.meowUntil ? 8 : 0, .3);
    E.mouthOpen.setAttribute('ry', C.mouth.toFixed(2));
    C.blush = lerp(C.blush, happy ? .78 : sleep ? .5 : .38, .08);
    E.blush.setAttribute('opacity', C.blush.toFixed(3));

    // paw swipes at the feather
    let tx = 0, ty = 0, tr = 0;
    const baseY = S.props.basket ? 572 : 642;
    let reach = false;
    if (wand && fLocal) {
      reach = fLocal.y > 330 && fLocal.x > 170 && fLocal.x < 570 && Math.hypot(fLocal.x - 342, fLocal.y - baseY) < 310;
      if (reach) {
        tx = clamp(fLocal.x - 342, -50, 115);
        ty = clamp(fLocal.y - baseY + 30, -215, -30);
        tr = clamp(tx / 4, -10, 25);
      }
    }
    C.px = lerp(C.px, tx, .2); C.py = lerp(C.py, ty, .2); C.prr = lerp(C.prr, tr, .2);
    E.pawR.setAttribute('transform', `translate(${C.px.toFixed(2)} ${C.py.toFixed(2)}) rotate(${C.prr.toFixed(2)} 342 642)`);
    if (reach && now - anim.lastCatch > 900 && Math.hypot(fLocal.x - (342 + C.px), fLocal.y - (baseY + C.py)) < 48) {
      anim.lastCatch = now;
      spawn(pick(['啪！', '抓到！', '嘿！']), feather.x, feather.y, 'pop');
    }

    // purr & sleep particles
    if (petting && gPointer && now - anim.lastPurr > 420) {
      anim.lastPurr = now;
      const [w, c] = pick(PURRS);
      spawn(w, gPointer.x + (Math.random() - .5) * 40, gPointer.y - 30, c);
    }
    if (sleep && now - anim.lastZ > 1400) {
      anim.lastZ = now;
      const g = L2G(420 + Math.random() * 30, 170);
      spawn(pick(['z', 'Z', 'z']), g.x, g.y, 'z');
    }

    requestAnimationFrame(frame);
  }

  // ---------- boot ----------
  setName(S.name);
  applyLook(false);
  applyProps();
  renderStats();
  requestAnimationFrame(frame);
  setTimeout(() => say(S.pets ? '你回来啦～' : '喵～'), 1300);
})();
