import io
p = 'game.js'
s = io.open(p, encoding='utf-8').read()

def R(a, b):
    global s
    assert a in s, 'MISSING: ' + a[:90]
    s = s.replace(a, b, 1)

# ---------- icons ----------
R("""    none: '<svg viewBox="0 0 48 48">""", """    carrotrice: '<svg viewBox="0 0 48 48"><path d="M6 24q1 16 18 16t18-16z" fill="#FFB3CD"/><ellipse cx="24" cy="24" rx="18" ry="6" fill="#FFF8EC"/><g fill="#FFFFFF"><circle cx="16" cy="22" r="3"/><circle cx="22" cy="20" r="3"/><circle cx="30" cy="21" r="3"/></g><g fill="#FF9150"><circle cx="19" cy="24" r="3"/><circle cx="29" cy="25" r="3"/></g><path d="M31 15c3-4 7-4 9-2-3 2-6 3-9 2z" fill="#7CC655"/><path d="M12 28c3-5 11-5 14 0l3-2v5l-3-2c-3 5-11 5-14-1z" fill="#8FD3F4"/></svg>',
    cropBerry: '<svg viewBox="0 0 48 48"><path d="M10 18q14-8 28 0q0 16-14 24q-14-8-14-24z" fill="#F0566A"/><path d="M16 12l8 6 8-6" stroke="#67B45A" stroke-width="3" fill="none" stroke-linecap="round"/><g fill="#FFE9E0"><circle cx="18" cy="24" r="1.4"/><circle cx="26" cy="22" r="1.4"/><circle cx="22" cy="30" r="1.4"/><circle cx="30" cy="28" r="1.4"/></g></svg>',
    cropCatnip: '<svg viewBox="0 0 48 48"><path d="M24 42V20" stroke="#6FB585" stroke-width="3"/><g fill="#9FDBAE"><ellipse cx="16" cy="28" rx="9" ry="5" transform="rotate(-30 16 28)"/><ellipse cx="32" cy="26" rx="9" ry="5" transform="rotate(30 32 26)"/></g><g fill="#C8B6FF"><circle cx="24" cy="12" r="5"/><circle cx="18" cy="16" r="4"/><circle cx="30" cy="16" r="4"/></g></svg>',
    cropCarrot: '<svg viewBox="0 0 48 48"><path d="M14 16l12 28 12-28z" fill="#FF9150" transform="rotate(-10 26 28)"/><path d="M18 22h8M20 30h7" stroke="#E0702F" stroke-width="2" stroke-linecap="round"/><path d="M26 16c-2-8 2-12 4-12 0 6-2 9-4 12zM26 16c4-6 10-6 12-4-4 3-8 4-12 4z" fill="#7CC655"/></svg>',
    none: '<svg viewBox="0 0 48 48">""")

# ---------- data ----------
R("""    { id: 'cookie', name: '猫薄荷饼干', price: 20, food: 10, fun: 45, xp: 8, lv: 3, color: '#A9DB8F', desc: '吃完会有点飘飘' },
  ];""", """    { id: 'cookie', name: '猫薄荷饼干', price: 20, food: 10, fun: 45, xp: 8, lv: 3, color: '#A9DB8F', desc: '吃完会有点飘飘' },
    { id: 'carrotrice', name: '胡萝卜鱼饭', price: 0, cookOnly: true, food: 48, fun: 16, xp: 9, color: '#FFB072', desc: '只能自己做的家常饭' },
  ];
  const CROPS = {
    berry: { name: '草莓', grow: 6, yield: 2, icon: 'cropBerry' },
    catnip: { name: '猫薄荷', grow: 4, yield: 2, icon: 'cropCatnip' },
    carrot: { name: '胡萝卜', grow: 8, yield: 2, icon: 'cropCarrot' },
  };
  const RECIPES = [
    { id: 'cake', need: { berry: 3 } },
    { id: 'cookie', need: { catnip: 2, berry: 1 } },
    { id: 'carrotrice', need: { carrot: 2 } },
  ];
  const SCENES = {
    bedroom: { name: '卧室', home: [200, 456], wander: [160, 250], hello: ['回家啦～', '还是窝里舒服'] },
    kitchen: { name: '厨房', home: [200, 456], wander: [170, 240], hello: ['有好吃的吗？', '厨房香香的！'] },
    bath: { name: '浴室', home: [200, 472], wander: null, hello: ['……这里是浴室？', '（警惕地看着水）'] },
    garden: { name: '花园', home: [200, 456], wander: [150, 250], hello: ['外面好舒服！', '有蝴蝶！'] },
  };""")
R("""    { type: 'meow', goal: 5, text: '听它喵 5 声', reward: 10 },
  ];""", """    { type: 'meow', goal: 5, text: '听它喵 5 声', reward: 10 },
    { type: 'harvest', goal: 2, text: '在花园收获 2 次', reward: 20 },
    { type: 'cook', goal: 1, text: '用烤箱做一道料理', reward: 20 },
    { type: 'brush', goal: 1, text: '在浴室给它梳一次毛', reward: 15 },
    { type: 'butterfly', goal: 3, text: '陪它扑 3 次蝴蝶', reward: 15 },
    { type: 'visit', goal: 3, text: '带它去 3 个不同的地方', reward: 10 },
  ];""")

# ---------- state ----------
R("""    settings: { vibe: true }, installAsked: 0, playSec: 0,
  });""", """    settings: { vibe: true }, installAsked: 0, playSec: 0,
    scene: 'bedroom', inv: { berry: 0, catnip: 1, carrot: 0 }, pantry: {}, garden: [null, null, null], brushedAt: 0, visits: null,
  });""")
R("""  G.settings = Object.assign({ vibe: true }, G.settings);""", """  G.settings = Object.assign({ vibe: true }, G.settings);
  G.inv = Object.assign({ berry: 0, catnip: 0, carrot: 0 }, G.inv);
  G.pantry = G.pantry || {};
  G.garden = Array.isArray(G.garden) ? G.garden : [null, null, null];
  G.scene = G.scene || 'bedroom';""")

# ---------- wander / bath position per scene ----------
R("""      if (Math.random() < .55) goTo(rand(160, 250), HOME_Y);""", """      const sc = SCENES[G.scene];
      if (sc.wander && Math.random() < .55) goTo(rand(sc.wander[0], sc.wander[1]), sc.home[1]);""")
R("""    goTo(200, HOME_Y);
    say(G.needs.clean > 90 ? '已经很香了嘛…好吧' : '洗…洗澡？', 1600);""", """    goTo(200, SCENES.bath.home[1]);
    say(G.needs.clean > 90 ? '已经很香了嘛…好吧' : '洗…洗澡？', 1600);""")

# ---------- feed: kitchen + pantry ----------
R("""  function feed(f) {
    if (G.sleeping) return toast('它在睡觉，先叫醒它吧');
    if (busy()) return toast('等它忙完这一下～');
    if (G.needs.food >= 96) { closeSheet(); return say('吃不下啦…肚肚圆圆'); }
    if (f.price > G.coins) return toast('小鱼干不够啦，去玩接小鱼赚吧');
    if (f.lv && G.lv < f.lv) return toast(`Lv.${f.lv} 解锁`);
    addCoins(-f.price);""", """  function feed(f) {
    if (G.sleeping) return toast('它在睡觉，先叫醒它吧');
    if (busy()) return toast('等它忙完这一下～');
    if (G.scene !== 'kitchen') { closeSheet(); return goScene('kitchen', () => feed(f)); }
    if (G.needs.food >= 96) { closeSheet(); return say('吃不下啦…肚肚圆圆'); }
    const stocked = (G.pantry[f.id] || 0) > 0;
    if (!stocked) {
      if (f.cookOnly) return toast('这道要先用厨房的烤箱做出来哦');
      if (f.price > G.coins) return toast('小鱼干不够啦，去玩接小鱼赚吧');
      if (f.lv && G.lv < f.lv) return toast(`Lv.${f.lv} 解锁`);
      addCoins(-f.price);
    } else G.pantry[f.id]--;""")

# ---------- brushing shares the bath rub mechanic ----------
R("""  const bath = { on: false, prog: 0, foam: 0 };
  function startBath() {
    if (G.sleeping) return toast('它在睡觉，先叫醒它吧');
    if (busy()) return;
    bath.on = true; bath.prog = 0; bath.foam = 0;""", """  const bath = { on: false, prog: 0, foam: 0, kind: 'bath' };
  const setBathBar = (text) => { el('bathBar').querySelector('span').textContent = text; };
  function startBrush() {
    if (G.sleeping) return toast('它在睡觉，先叫醒它吧');
    if (busy()) return;
    if (G.scene !== 'bath') return goScene('bath', startBrush);
    bath.on = true; bath.prog = 0; bath.foam = 0; bath.kind = 'brush';
    cat.state = 'bath';
    room.classList.add('brushing');
    setBathBar('✦ 用梳子顺着毛梳一梳');
    el('bathBar').hidden = false;
    el('bathProg').style.width = '0%';
    say(pick(['梳…梳毛？', '要轻轻的哦']), 1500);
  }
  function startBath() {
    if (G.sleeping) return toast('它在睡觉，先叫醒它吧');
    if (busy()) return;
    if (G.scene !== 'bath') return goScene('bath', startBath);
    setBathBar('🫧 用海绵在它身上搓搓');
    bath.on = true; bath.prog = 0; bath.foam = 0; bath.kind = 'bath';""")
R("""  function endBath(done) {
    bath.on = false;
    room.classList.remove('bathing');
    el('bathBar').hidden = true;""", """  function endBath(done) {
    bath.on = false;
    room.classList.remove('bathing', 'brushing');
    el('bathBar').hidden = true;
    if (bath.kind === 'brush') {
      cat.state = 'idle'; cat.until = now() + 2000;
      if (!done) return;
      for (let i = 0; i < 8; i++) setTimeout(() => spawn('', cat.x + rand(-60, 60), rand(300, 400), 'fluff'), i * 60);
      need('fun', 8); need('clean', 8); G.brushedAt = Date.now();
      addXP(5); track('brush'); buzz([15, 30, 15]);
      happyUntil = now() + 1800;
      say('好舒服～毛毛顺顺的', 2200);
      save();
      return;
    }""")
R("""  function rub(p, d) {
    bath.prog = Math.min(100, bath.prog + d * .045);
    el('bathProg').style.width = bath.prog + '%';""", """  function rub(p, d) {
    if (bath.kind === 'brush') {
      bath.prog = Math.min(100, bath.prog + d * .05);
      el('bathProg').style.width = bath.prog + '%';
      bath.foam += d;
      if (bath.foam > 34) { bath.foam = 0; const q = toRoomPt(p.x, p.y); spawn('', q.x, q.y, 'fluff'); if (Math.random() < .4) spawn(pick(['呼噜', '♡']), q.x, q.y - 12, ''); }
      if (bath.prog >= 100) endBath(true);
      return;
    }
    bath.prog = Math.min(100, bath.prog + d * .045);
    el('bathProg').style.width = bath.prog + '%';""")

# ---------- sleep lives in the bedroom ----------
R("""    } else {
      if (cat.state === 'eat') return toast('等它吃完～');
      G.sleeping = true;""", """    } else {
      if (cat.state === 'eat') return toast('等它吃完～');
      if (G.scene !== 'bedroom') return goScene('bedroom', toggleSleep);
      G.sleeping = true;""")

# ---------- no hairballs for a while after brushing ----------
R("""    if (!G.sleeping && n.clean < 80 && G.hairballs.length < 3 && Math.random() < 1 / 100) addHairball();""",
  """    if (!G.sleeping && n.clean < 80 && G.hairballs.length < 3 && Date.now() - (G.brushedAt || 0) > 2 * 3600e3 && Math.random() < 1 / 100) addHairball();
    if (G.scene === 'garden' && ++potTick % 4 === 0) renderPots();
    G.garden.forEach((pot) => { if (pot && !pot.told && grow(pot, Date.now()) >= 1) { pot.told = true; toast(`花园里的${CROPS[pot.seed].name}成熟啦！`); } });""")

# ---------- layoutUpper: per-scene upper decor ----------
R("""    const up = el('upperDecor');
    if (topY < -95) { up.style.display = ''; up.setAttribute('transform', `translate(0 ${Math.round(topY * .5 + 10)})`); }
    else up.style.display = 'none';""", """    $$('[data-upper]').forEach((up) => {
      if (up.dataset.upper === G.scene && topY < -95) { up.style.display = ''; up.setAttribute('transform', `translate(0 ${Math.round(topY * .5 + 10)})`); }
      else up.style.display = 'none';
    });""")

# ---------- feed sheet shows the fridge; new cook + seeds sheets ----------
R("""    if (sheetKind === 'feed') {
      title.textContent = '今天吃什么？';
      body.innerHTML = '<div class="grid">' + FOODS.map((f) => {
        const locked = f.lv && G.lv < f.lv;
        const eff = [f.food && `饱+${f.food}`, f.fun && `乐+${f.fun}`].filter(Boolean).join(' ');
        return `<button class="item ${locked ? 'locked' : ''}" data-food="${f.id}">
          <span class="art"><span class="ic">${IC[f.id]}</span></span>
          <b>${f.name}</b><small>${f.desc}<br>${eff}</small>
          ${locked ? lockTag(f.lv) : priceTag(f.price)}</button>`;
      }).join('') + '</div>';""", """    if (sheetKind === 'feed') {
      title.textContent = '今天吃什么？';
      body.innerHTML = '<p class="sheet-tip">冰箱里有的料理可以免费喂；想要更多，去花园种菜、用烤箱做 🍳</p><div class="grid">' + FOODS.map((f) => {
        const stock = G.pantry[f.id] || 0;
        const locked = !stock && f.lv && G.lv < f.lv;
        const eff = [f.food && `饱+${f.food}`, f.fun && `乐+${f.fun}`].filter(Boolean).join(' ');
        const tag = stock ? `<span class="price free">冰箱 ×${stock}</span>` : f.cookOnly ? '<span class="lock">需烤箱制作</span>' : locked ? lockTag(f.lv) : priceTag(f.price);
        return `<button class="item ${locked || (f.cookOnly && !stock) ? 'locked' : ''}" data-food="${f.id}">
          <span class="art"><span class="ic">${IC[f.id]}</span></span>
          <b>${f.name}</b><small>${f.desc}<br>${eff}</small>
          ${tag}</button>`;
      }).join('') + '</div>';""")
R("""    else if (sheetKind === 'closet') {""", """    else if (sheetKind === 'cook') {
      title.textContent = '烤箱 · 做点好吃的';
      const inv = Object.entries(CROPS).map(([k, c]) => `<span class="inv"><span class="ic">${IC[c.icon]}</span>${c.name}<b>×${G.inv[k] || 0}</b></span>`).join('');
      body.innerHTML = `<div class="inv-row">${inv}</div><div class="recipes">` + RECIPES.map((r) => {
        const f = FOODS.find((x) => x.id === r.id);
        const ok = Object.entries(r.need).every(([k, n]) => (G.inv[k] || 0) >= n);
        const need = Object.entries(r.need).map(([k, n]) => `<span class="${(G.inv[k] || 0) >= n ? 'have' : 'miss'}">${CROPS[k].name}×${n}</span>`).join('');
        return `<div class="recipe"><span class="art"><span class="ic">${IC[f.id]}</span></span>
          <div class="rt"><b>${f.name}</b><small>${need}</small><small class="stock">冰箱里有 ${G.pantry[f.id] || 0} 份</small></div>
          <button class="cta ${ok ? '' : 'ghost'}" data-cook="${r.id}" ${ok ? '' : 'disabled'}>开烤</button></div>`;
      }).join('') + '</div><p class="sheet-tip">食材在「花园」种出来 🌱</p>';
      $$('[data-cook]', body).forEach((b) => b.addEventListener('click', () => cook(RECIPES.find((r) => r.id === b.dataset.cook))));
    }
    else if (sheetKind === 'seeds') {
      title.textContent = '种点什么？';
      body.innerHTML = '<div class="grid">' + Object.entries(CROPS).map(([k, c]) => `
        <button class="item" data-seed="${k}"><span class="art"><span class="ic">${IC[c.icon]}</span></span>
        <b>${c.name}</b><small>${c.grow} 分钟成熟<br>收获 ×${c.yield}</small><span class="price free">免费种子</span></button>`).join('') + '</div><p class="sheet-tip">种下后记得浇一次水，会长得更快 💧</p>';
      $$('[data-seed]', body).forEach((b) => b.addEventListener('click', () => plant(sheetTab, b.dataset.seed)));
    }
    else if (sheetKind === 'closet') {""")

# ---------- dock routes to the right room ----------
R("""    if (a === 'feed') openSheet('feed');
    else if (a === 'bath') { closeSheet(); startBath(); }
    else if (a === 'play') startMini();
    else if (a === 'sleep') { closeSheet(); toggleSleep(); }""", """    if (a === 'feed') { if (G.scene === 'kitchen') openSheet('feed'); else goScene('kitchen', () => openSheet('feed')); }
    else if (a === 'bath') { closeSheet(); startBath(); }
    else if (a === 'play') startMini();
    else if (a === 'sleep') { closeSheet(); toggleSleep(); }""")

# ---------- scene manager, garden, oven, butterflies ----------
R("""  el('btnTasks').addEventListener('click', () => openSheet('tasks'));""", """  el('btnTasks').addEventListener('click', () => openSheet('tasks'));

  /* =========================================================
     scenes: bedroom / kitchen / bath / garden
     ========================================================= */
  if (el('upperDecor')) el('upperDecor').dataset.upper = 'bedroom';
  let sceneLock = false;
  function setSceneNow(id) {
    G.scene = id;
    room.dataset.scene = id;
    $$('.scene-layer').forEach((n) => { n.style.display = n.dataset.scene === id ? '' : 'none'; });
    $$('#sceneNav button').forEach((b) => b.classList.toggle('on', b.dataset.go === id));
    const h = SCENES[id].home;
    cat.x = cat.tx = h[0]; cat.y = cat.ty = h[1]; cat.moving = false; cat.until = now() + 2500;
    layoutUpper();
    if (id === 'garden') renderPots();
  }
  function goScene(id, cb) {
    if (G.scene === id) { if (cb) cb(); return; }
    if (G.sleeping) return toast('它在睡觉，先叫醒它吧');
    if (busy() || bath.on) return toast('等它忙完这一下～');
    if (sceneLock) return;
    sceneLock = true;
    closeSheet();
    room.classList.add('swapping');
    setTimeout(() => {
      setSceneNow(id);
      squishAt = now();
      if (!G.visits || G.visits.day !== dateKey()) G.visits = { day: dateKey(), list: [] };
      if (!G.visits.list.includes(id)) { G.visits.list.push(id); track('visit'); }
      save();
      room.classList.remove('swapping');
      sceneLock = false;
      say(pick(SCENES[id].hello), 1600);
      if (cb) setTimeout(cb, 380);
    }, 260);
  }
  $$('#sceneNav button').forEach((b) => b.addEventListener('click', () => { buzz(8); goScene(b.dataset.go); }));
  const tapOn = (id, fn) => { const n = el(id); if (n) n.addEventListener('click', (e) => { e.stopPropagation(); buzz(8); fn(); }); };
  tapOn('oven', () => openSheet('cook'));
  tapOn('brushTool', () => startBrush());
  tapOn('bed', () => { if (!G.sleeping) toggleSleep(); });

  // ---- garden
  let potTick = 0;
  const POTS = [[46, 462], [354, 462], [372, 398]];
  function grow(pot, t) {
    const c = CROPS[pot.seed];
    const mins = (t - pot.t0) / 60000 + (pot.watered ? c.grow * .4 : 0);
    return Math.min(1, mins / c.grow);
  }
  function renderPots() {
    if (!window.Scenes) return;
    G.garden.forEach((pot, i) => { const n = el('pot' + i); if (n) n.innerHTML = Scenes.potArt(pot, Date.now(), grow); });
  }
  function plant(i, seed) {
    closeSheet();
    G.garden[i] = { seed, t0: Date.now(), watered: false };
    renderPots(); save(); buzz(12);
    spawn('种下啦', POTS[i][0], POTS[i][1] - 50, 'big');
    say(pick(['会长出什么呢？', '我来看着它！']), 1600);
  }
  function potClick(i) {
    const pot = G.garden[i], [x, y] = POTS[i];
    if (!pot) return openSheet('seeds', i);
    const p = grow(pot, Date.now());
    if (p >= 1) {
      const c = CROPS[pot.seed];
      G.inv[pot.seed] = (G.inv[pot.seed] || 0) + c.yield;
      G.garden[i] = null;
      renderPots(); addXP(3); track('harvest'); buzz([15, 30, 15]);
      spawn(`+${c.yield} ${c.name}`, x, y - 50, 'big');
      for (let k = 0; k < 5; k++) setTimeout(() => spawn(pick(['✦', '✨']), x + rand(-20, 20), y - rand(30, 60), 'spark'), k * 80);
      say(pick(['好多！', '可以做好吃的了！']), 1600);
      save();
      return;
    }
    if (!pot.watered) {
      pot.watered = true;
      for (let k = 0; k < 10; k++) setTimeout(() => spawn('', x + rand(-16, 16), y - 70, 'drop'), k * 40);
      renderPots(); addXP(1); buzz(10); save();
      return toast('浇水啦，长得更快了 💧');
    }
    const left = Math.max(1, Math.ceil((1 - p) * CROPS[pot.seed].grow));
    toast(`${CROPS[pot.seed].name}还要大约 ${left} 分钟`);
  }
  $$('.pot').forEach((n) => n.addEventListener('click', (e) => { e.stopPropagation(); potClick(+n.dataset.pot); }));

  // ---- oven
  function cook(r) {
    if (!Object.entries(r.need).every(([k, n]) => (G.inv[k] || 0) >= n)) return toast('食材不够哦，去花园种一些吧');
    Object.entries(r.need).forEach(([k, n]) => { G.inv[k] -= n; });
    closeSheet();
    const f = FOODS.find((x) => x.id === r.id);
    room.classList.add('baking');
    const txt = el('ovenText'); if (txt) txt.textContent = 'BAKING';
    say('好香…要好了吗？', 2000);
    buzz(12);
    setTimeout(() => {
      room.classList.remove('baking');
      if (txt) txt.textContent = 'READY';
      G.pantry[f.id] = (G.pantry[f.id] || 0) + 1;
      addXP(5); track('cook'); buzz([20, 40, 20]);
      for (let k = 0; k < 6; k++) setTimeout(() => spawn(pick(['✦', '♨', '✨']), 322 + rand(-30, 30), 280 - rand(0, 30), 'spark'), k * 90);
      toast(`烤好啦！${f.name} 放进冰箱了`);
      save();
    }, 3200);
  }

  // ---- butterflies
  const BF = [
    { ph: 0, c1: '#FFB3D1', c2: '#FFFFFF', x: 120, y: 300, away: 0 },
    { ph: 2.4, c1: '#C8B6FF', c2: '#FFE08A', x: 280, y: 320, away: 0 },
  ];
  if (el('butterflies') && window.Scenes) {
    el('butterflies').innerHTML = BF.map((b, i) => `<g class="bf tappable" data-bf="${i}"><circle r="22" fill="transparent"/><g class="bf-body">${Scenes.butterflyArt(b.c1, b.c2)}</g></g>`).join('');
    $$('.bf').forEach((n) => n.addEventListener('click', (e) => { e.stopPropagation(); pounce(+n.dataset.bf); }));
  }
  function moveButterflies(t) {
    const time = t / 1000;
    BF.forEach((b, i) => {
      const n = document.querySelector(`.bf[data-bf="${i}"]`); if (!n) return;
      let x = 200 + Math.sin(time * .45 + b.ph) * 140, y = 300 + Math.sin(time * 1.1 + b.ph * 2) * 50 + Math.sin(time * 2.7 + b.ph) * 8;
      if (b.away > t) { const k = 1 - (b.away - t) / 6000; y -= Math.sin(Math.min(1, k * 1.4) * Math.PI) * 420; }
      b.x = x; b.y = y;
      n.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(Math.cos(time * .45 + b.ph) * 18).toFixed(1)})`);
    });
  }
  function pounce(i) {
    if (G.sleeping || busy() || cat.moving) return;
    const b = BF[i];
    if (b.away > now()) return;
    const tx = clamp(b.x, 150, 250);
    say(pick(['！', '（屁股扭扭）']), 900);
    goTo(tx, SCENES.garden.home[1], () => {
      squishAt = now(); meowUntil = now() + 500;
      const got = Math.random() < .55;
      b.away = now() + 6000;
      need('fun', got ? 6 : 3); addXP(got ? 3 : 1); track('butterfly'); buzz(got ? [20, 30, 20] : 12);
      spawn(got ? '扑到啦！' : '差一点！', b.x, b.y - 10, 'pop');
      happyUntil = now() + (got ? 1600 : 600);
      save();
    });
  }""")

R("""    const sleepingNow = G.sleeping && !cat.moving;""", """    if (G.scene === 'garden') moveButterflies(t);
    const sleepingNow = G.sleeping && !cat.moving;""")

# ---------- boot into the saved scene ----------
R("""    applyLook(); renderHairballs(); renderClockSky(); renderHud(); layoutUpper();""", """    applyLook(); renderHairballs(); renderClockSky(); renderHud();
    setSceneNow(G.sleeping ? 'bedroom' : (SCENES[G.scene] ? G.scene : 'bedroom'));
    layoutUpper();""")

io.open(p, 'w', encoding='utf-8').write(s)
print('patched game.js')
