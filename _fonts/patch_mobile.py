import io, sys
p = sys.argv[1]
s = io.open(p, encoding='utf-8').read()

def R(a, b):
    global s
    assert a in s, 'MISSING: ' + a[:90]
    s = s.replace(a, b, 1)

R("day: '', tasks: [], streak: 0, lastCheck: '', best: 0,",
  "day: '', tasks: [], streak: 0, lastCheck: '', best: 0,\n    settings: { vibe: true }, installAsked: 0, playSec: 0,")
R("  const save = () => {", "  G.settings = Object.assign({ vibe: true }, G.settings);\n  const save = () => {")

R("""  /* =========================================================
     economy / progression""", """  // ---- haptics (Android vibrates; iOS silently ignores)
  const buzz = (p) => { try { if (G.settings.vibe && navigator.vibrate) navigator.vibrate(p); } catch {} };

  /* =========================================================
     economy / progression""")
R("      el('levelUp').hidden = false;", "      el('levelUp').hidden = false;\n      buzz([30, 60, 30, 60, 80]);")
R("    need('clean', 5); addXP(1); track('clean'); save();", "    need('clean', 5); addXP(1); track('clean'); save(); buzz(12);")
R("        need('fun', 3); addXP(1); track('pet');", "        need('fun', 3); addXP(1); track('pet'); buzz(8);")
R("    meowUntil = now() + 650; squishAt = now();", "    meowUntil = now() + 650; squishAt = now(); buzz(15);")
R("      G.needs.clean = 100; need('fun', 6); need('energy', -4);", "      G.needs.clean = 100; need('fun', 6); need('energy', -4); buzz([20, 40, 20]);")
R("          if (it.pts < 0) M.shake = .35; else M.mouth = .25;", "          if (it.pts < 0) { M.shake = .35; buzz([40, 30, 40]); } else { M.mouth = .25; buzz(10); }")
R("""  $$('.gum').forEach((b) => b.addEventListener('click', () => {
    const a = b.dataset.act;""", """  $$('.gum').forEach((b) => b.addEventListener('click', () => {
    const a = b.dataset.act;
    buzz(10);""")

R("""  function openSheet(kind, tab) {
    sheetKind = kind;
    sheetTab = tab || (kind === 'closet' ? 'hat' : null);
    sheet.hidden = false; scrim.hidden = false;
    renderSheet();
  }
  function closeSheet() { sheet.hidden = true; scrim.hidden = true; sheetKind = null; }""", """  function openSheet(kind, tab) {
    const wasOpen = !!sheetKind;
    sheetKind = kind;
    sheetTab = tab || (kind === 'closet' ? 'hat' : null);
    sheet.hidden = false; scrim.hidden = false;
    sheet.style.transform = '';
    if (!wasOpen) history.pushState({ layer: 'sheet' }, '');
    renderSheet();
  }
  function hideSheet() { sheet.hidden = true; scrim.hidden = true; sheetKind = null; }
  function closeSheet() {
    if (!sheetKind) return;
    if (history.state && history.state.layer === 'sheet') history.back(); else hideSheet();
  }
  // Android back button / back gesture closes the top layer instead of leaving the game
  window.addEventListener('popstate', () => {
    if (!el('levelUp').hidden) { el('levelUp').hidden = true; return; }
    if (sheetKind) { hideSheet(); return; }
    if (!mini.hidden) { closeMini(true); return; }
    if (bath.on) endBath(false);
  });
  // drag the sheet down to dismiss
  (() => {
    let y0 = null, dy = 0;
    const handles = [sheet.querySelector('.grab'), sheet.querySelector('.sheet-head')];
    const move = (e) => { if (y0 == null) return; dy = Math.max(0, e.clientY - y0); sheet.style.transform = `translateY(${dy}px)`; };
    const end = () => {
      if (y0 == null) return;
      y0 = null; sheet.classList.remove('dragging'); sheet.classList.add('snap');
      if (dy > 90) { buzz(8); closeSheet(); } else sheet.style.transform = '';
    };
    handles.forEach((n) => {
      n.style.touchAction = 'none';
      n.addEventListener('pointerdown', (e) => {
        if (e.target.closest('button')) return;
        y0 = e.clientY; dy = 0;
        sheet.classList.add('dragging'); sheet.classList.remove('snap');
        n.setPointerCapture(e.pointerId);
      });
      n.addEventListener('pointermove', move);
      n.addEventListener('pointerup', end);
      n.addEventListener('pointercancel', end);
    });
  })();""")

R("      toast('买到啦！' + it.name);", "      toast('买到啦！' + it.name); buzz([15, 40, 15]);")
R("    addCoins(-f.price);\n    closeSheet();", "    addCoins(-f.price);\n    buzz(12);\n    closeSheet();")

R("""    closeSheet();
    cat.state = 'game';
    mini.hidden = false;""", """    closeSheet();
    cat.state = 'game';
    mini.hidden = false;
    if (!(history.state && history.state.layer === 'mini')) setTimeout(() => history.pushState({ layer: 'mini' }, ''), 0);""")
R("""  function closeMini() {
    if (M) M.alive = false;""", """  function closeMini(fromPop) {
    if (fromPop !== true && history.state && history.state.layer === 'mini') { history.back(); return; }
    if (M) M.alive = false;""")
R("    el('mHome').onclick = closeMini;", "    el('mHome').onclick = () => closeMini();\n    buzz([20, 50, 20]);")

R("""  function tick() {
    const nowMs = Date.now(), dtMin = (nowMs - lastTick) / 60000; lastTick = nowMs;
    const n = G.needs;""", """  function tick() {
    const nowMs = Date.now(), dtMin = (nowMs - lastTick) / 60000;
    if (dtMin > 2) {
      // phone was locked / app was in the background: use the gentle offline rates
      G.last = lastTick; lastTick = nowMs;
      const away = offlineCatchUp();
      renderHairballs(); renderHud(); save();
      if (away > 30 && !G.sleeping) say('你回来啦！', 2000);
      return;
    }
    lastTick = nowMs;
    G.playSec += 1;
    if (G.playSec === 90 && !isStandalone() && G.installAsked < 2) setTimeout(() => showInstall(), 400);
    const n = G.needs;""")

R("""        <button class="reset" id="resetGame">重新领养（会清空存档）</button>`;""", """        <div class="card">
          <h4>设置 <small>SETTINGS</small></h4>
          <div class="setting"><span>震动反馈</span><button class="switch" id="setVibe" role="switch" aria-checked="${G.settings.vibe}"></button></div>
          ${isStandalone() ? '' : '<div class="setting"><span>放到手机桌面</span><button class="cta" id="setInstall" style="padding:8px 14px;font-size:13px">添加</button></div>'}
        </div>
        <button class="reset" id="resetGame">重新领养（会清空存档）</button>`;
      el('setVibe').onclick = () => { G.settings.vibe = !G.settings.vibe; save(); buzz(20); renderSheet(); };
      if (el('setInstall')) el('setInstall').onclick = () => { closeSheet(); setTimeout(() => showInstall(true), 250); };""")

R("""  /* =========================================================
     adoption & boot""", """  /* =========================================================
     install to home screen (PWA)
     ========================================================= */
  function isStandalone() { return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; }
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; });
  window.addEventListener('appinstalled', () => { el('install').hidden = true; toast('装好啦，去桌面找它吧 ♥'); });
  function showInstall(force) {
    if (isStandalone()) return;
    if (!force && !deferredPrompt && !isIOS) return;
    G.installAsked++; save();
    el('insName').textContent = G.name || '小猫';
    const ios = isIOS && !deferredPrompt;
    el('insSteps').hidden = !ios;
    el('insText').textContent = ios ? '在 Safari 里这样做：' : deferredPrompt ? '像 App 一样全屏打开，断网也能陪它玩。' : '在浏览器菜单里选「添加到主屏幕」或「安装应用」就可以啦。';
    el('insGo').textContent = ios ? '知道啦' : deferredPrompt ? '放到桌面' : '好的';
    el('install').hidden = false;
  }
  el('insLater').onclick = () => { el('install').hidden = true; };
  el('insGo').onclick = async () => {
    el('install').hidden = true;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const r = await deferredPrompt.userChoice.catch(() => null);
      deferredPrompt = null;
      if (r && r.outcome === 'accepted') buzz([20, 40, 20]);
    }
  };

  // lighter rendering on low-end phones: drop the soft-fur blur filters
  if (matchMedia('(pointer: coarse)').matches && (navigator.hardwareConcurrency || 8) <= 4) {
    $$('#cat [filter="url(#mSoft)"]').forEach((n) => n.removeAttribute('filter'));
  }
  // no long-press menus on the play area
  device.addEventListener('contextmenu', (e) => { if (!e.target.closest('input')) e.preventDefault(); });
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }

  /* =========================================================
     adoption & boot""")

io.open(p, 'w', encoding='utf-8').write(s)
print('patched')
