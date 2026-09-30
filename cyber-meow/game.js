(() => {
  'use strict';

  /* =========================================================
     utils
     ========================================================= */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (id) => document.getElementById(id);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const now = () => performance.now();
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dateKey = (d = new Date()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

  /* =========================================================
     icons
     ========================================================= */
  const IC = {
    coin: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="21" fill="#FFD35C"/><circle cx="24" cy="24" r="16.5" fill="none" stroke="#F2B32C" stroke-width="3"/><path d="M12 24c5-7 15-8 21-1l5-4v10l-5-4c-6 7-16 6-21-1z" fill="#fff"/><circle cx="18" cy="23" r="1.8" fill="#F2B32C"/></svg>',
    nFood: '<svg viewBox="0 0 48 48"><path d="M6 24c6-10 21-12 29-3l7-6v18l-7-6c-8 9-23 7-29-3z" fill="#FFA27A"/><circle cx="15" cy="22" r="2.6" fill="#fff"/><path d="M24 17c2 4 2 10 0 14" stroke="#fff" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/></svg>',
    nClean: '<svg viewBox="0 0 48 48"><path d="M24 5c9 12 14 18 14 25a14 14 0 0 1-28 0c0-7 5-13 14-25z" fill="#6FC7F0"/><ellipse cx="18.5" cy="29" rx="3.2" ry="5.5" fill="#fff" opacity=".75"/></svg>',
    nFun: '<svg viewBox="0 0 48 48"><path d="M24 5l5.6 11.6 12.8 1.8-9.3 9 2.2 12.7L24 34l-11.3 6.1 2.2-12.7-9.3-9 12.8-1.8z" fill="#FF83B6" stroke="#FF83B6" stroke-width="3" stroke-linejoin="round"/><circle cx="19.5" cy="23" r="2" fill="#fff"/><circle cx="28.5" cy="23" r="2" fill="#fff"/><path d="M21 28q3 3 6 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    nEnergy: '<svg viewBox="0 0 48 48"><path d="M28 4 10 27h12l-4 17 20-24H27z" fill="#A68CFF" stroke="#A68CFF" stroke-width="2" stroke-linejoin="round"/><path d="M24 12l-6 11" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".7"/></svg>',
    food: '<svg viewBox="0 0 48 48"><ellipse cx="24" cy="22" rx="17" ry="5" fill="#E57FA8"/><g fill="#C98A5B"><circle cx="17" cy="20" r="3.4"/><circle cx="24" cy="18" r="3.6"/><circle cx="31" cy="20" r="3.4"/><circle cx="21" cy="22" r="3"/><circle cx="28" cy="22" r="3"/></g><path d="M6 22q1 16 18 16t18-16q-18 8-36 0z" fill="#FF9EC4"/><path d="M19 30q5-5 10 0q-5 5-10 0z" fill="#fff"/></svg>',
    bath: '<svg viewBox="0 0 48 48"><circle cx="19" cy="27" r="13" fill="#BDE7FA" stroke="#6FC7F0" stroke-width="2.5"/><circle cx="34" cy="16" r="8" fill="#E6F6FD" stroke="#6FC7F0" stroke-width="2.5"/><circle cx="36" cy="35" r="5" fill="#E6F6FD" stroke="#6FC7F0" stroke-width="2.2"/><path d="M12 22a7 7 0 0 1 6-5" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="31" cy="13" r="1.8" fill="#fff"/></svg>',
    play: '<svg viewBox="0 0 48 48"><circle cx="22" cy="24" r="15" fill="#fff"/><path d="M9 20q13-6 26 4M10 30q11-8 24-2M17 10q-2 14 8 28M28 10q-8 12-2 27" stroke="#FF83B6" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M36 30q6 4 3 10" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>',
    sleep: '<svg viewBox="0 0 48 48"><path d="M30 6a18 18 0 1 0 12 30 15 15 0 1 1-12-30z" fill="#A68CFF"/><circle cx="21" cy="26" r="1.8" fill="#fff"/><circle cx="29" cy="31" r="1.8" fill="#fff"/><path d="M38 8l1.5 3 3 1.5-3 1.5L38 17l-1.5-3-3-1.5 3-1.5z" fill="#FFE08A"/></svg>',
    wake: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="10" fill="#FFD35C"/><g stroke="#FFD35C" stroke-width="3.5" stroke-linecap="round"><path d="M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M38 10l-4 4M14 34l-4 4"/></g><circle cx="20.5" cy="23" r="1.6" fill="#B4781A"/><circle cx="27.5" cy="23" r="1.6" fill="#B4781A"/><path d="M21 27q3 2.5 6 0" stroke="#B4781A" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>',
    closet: '<svg viewBox="0 0 48 48"><path d="M24 22C18 12 6 10 5 18s8 12 19 4zM24 22c6-10 18-12 19-4s-8 12-19 4z" fill="#FFB3D1" stroke="#FF83B6" stroke-width="2.5" stroke-linejoin="round"/><path d="M22 25l-6 15 5-2 3 4 2-17zM26 25l6 15-5-2-3 4-2-17z" fill="#FF9EC4"/><circle cx="24" cy="22" r="4.5" fill="#FF83B6"/></svg>',
    kibble: '<svg viewBox="0 0 48 48"><ellipse cx="24" cy="24" rx="17" ry="5" fill="#E57FA8"/><g fill="#C98A5B"><circle cx="17" cy="22" r="3.6"/><circle cx="24" cy="20" r="3.8"/><circle cx="31" cy="22" r="3.6"/></g><path d="M6 24q1 16 18 16t18-16q-18 8-36 0z" fill="#FF9EC4"/></svg>',
    fish: '<svg viewBox="0 0 48 48"><path d="M5 24c7-11 22-12 30-3l8-6v18l-8-6c-8 9-23 8-30-3z" fill="#EDB566"/><path d="M14 20l4 8M20 18l4 12M26 18l3 11" stroke="#D39545" stroke-width="2" stroke-linecap="round"/><circle cx="11" cy="22" r="2" fill="#6B4A2A"/></svg>',
    can: '<svg viewBox="0 0 48 48"><rect x="9" y="13" width="30" height="26" rx="5" fill="#B9D8F4"/><ellipse cx="24" cy="13" rx="15" ry="5" fill="#E3F0FB" stroke="#9CC4E8" stroke-width="2"/><path d="M13 27c4-6 12-7 17-1l4-3v8l-4-3c-5 6-13 5-17-1z" fill="#F4A39A"/><circle cx="17" cy="26" r="1.4" fill="#fff"/></svg>',
    cake: '<svg viewBox="0 0 48 48"><path d="M7 26h34v12a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3z" fill="#FFE9D2"/><path d="M7 26h34v5H7z" fill="#FFB3CD"/><path d="M7 26q4-8 17-10t17 10z" fill="#fff"/><path d="M24 7q-6 1-5 7t5 5q4 1 5-5t-5-7z" fill="#F0566A"/><path d="M21 7l3-3 3 3" stroke="#67B45A" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    cookie: '<svg viewBox="0 0 48 48"><circle cx="24" cy="25" r="16" fill="#F1D19A"/><circle cx="24" cy="25" r="16" fill="none" stroke="#DDB273" stroke-width="2.5"/><path d="M24 16c-6 4-6 12 0 18c6-6 6-14 0-18z" fill="#8FD37C"/><path d="M24 18v14" stroke="#5DA34B" stroke-width="1.6"/><circle cx="14" cy="22" r="1.6" fill="#C9934E"/><circle cx="33" cy="30" r="1.6" fill="#C9934E"/></svg>',
    carrotrice: '<svg viewBox="0 0 48 48"><path d="M6 24q1 16 18 16t18-16z" fill="#FFB3CD"/><ellipse cx="24" cy="24" rx="18" ry="6" fill="#FFF8EC"/><g fill="#FFFFFF"><circle cx="16" cy="22" r="3"/><circle cx="22" cy="20" r="3"/><circle cx="30" cy="21" r="3"/></g><g fill="#FF9150"><circle cx="19" cy="24" r="3"/><circle cx="29" cy="25" r="3"/></g><path d="M31 15c3-4 7-4 9-2-3 2-6 3-9 2z" fill="#7CC655"/><path d="M12 28c3-5 11-5 14 0l3-2v5l-3-2c-3 5-11 5-14-1z" fill="#8FD3F4"/></svg>',
    cropBerry: '<svg viewBox="0 0 48 48"><path d="M10 18q14-8 28 0q0 16-14 24q-14-8-14-24z" fill="#F0566A"/><path d="M16 12l8 6 8-6" stroke="#67B45A" stroke-width="3" fill="none" stroke-linecap="round"/><g fill="#FFE9E0"><circle cx="18" cy="24" r="1.4"/><circle cx="26" cy="22" r="1.4"/><circle cx="22" cy="30" r="1.4"/><circle cx="30" cy="28" r="1.4"/></g></svg>',
    cropCatnip: '<svg viewBox="0 0 48 48"><path d="M24 42V20" stroke="#6FB585" stroke-width="3"/><g fill="#9FDBAE"><ellipse cx="16" cy="28" rx="9" ry="5" transform="rotate(-30 16 28)"/><ellipse cx="32" cy="26" rx="9" ry="5" transform="rotate(30 32 26)"/></g><g fill="#C8B6FF"><circle cx="24" cy="12" r="5"/><circle cx="18" cy="16" r="4"/><circle cx="30" cy="16" r="4"/></g></svg>',
    cropCarrot: '<svg viewBox="0 0 48 48"><path d="M14 16l12 28 12-28z" fill="#FF9150" transform="rotate(-10 26 28)"/><path d="M18 22h8M20 30h7" stroke="#E0702F" stroke-width="2" stroke-linecap="round"/><path d="M26 16c-2-8 2-12 4-12 0 6-2 9-4 12zM26 16c4-6 10-6 12-4-4 3-8 4-12 4z" fill="#7CC655"/></svg>',
    none: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="15" fill="none" stroke="#D9C8D9" stroke-width="3" stroke-dasharray="4 5"/></svg>',
  };
  const paintIcons = (root = document) => $$('[data-icon]', root).forEach((n) => { n.innerHTML = IC[n.dataset.icon] || ''; });

  /* =========================================================
     data
     ========================================================= */
  const COATS = [
    { id: 'gold', name: '金渐层', sw: 'linear-gradient(160deg,#CDB392,#F6ECDF)' },
    { id: 'silver', name: '银渐层', sw: 'linear-gradient(160deg,#A9ABB5,#F1F1F4)' },
    { id: 'bluewhite', name: '蓝白', sw: 'linear-gradient(160deg,#8E98AB 45%,#FFFFFF 46%)' },
    { id: 'orange', name: '奶橘', sw: 'linear-gradient(160deg,#E4A56C,#FAEBD8)' },
  ];
  const NAMES = ['奶糕', '布丁', '团子', '麻薯', '糯米', '年糕', '豆花', '芋圆'];

  const FOODS = [
    { id: 'kibble', name: '猫猫粮', price: 0, food: 22, fun: 0, xp: 2, color: '#C98A5B', desc: '每天都吃不腻' },
    { id: 'fish', name: '小鱼干', price: 8, food: 32, fun: 8, xp: 4, color: '#E7B36A', desc: '嘎嘣脆' },
    { id: 'can', name: '金枪鱼罐罐', price: 15, food: 50, fun: 12, xp: 6, color: '#F4A39A', desc: '开罐声就是召唤术' },
    { id: 'cake', name: '草莓小蛋糕', price: 25, food: 28, fun: 30, xp: 10, lv: 2, color: '#FFB3CD', desc: '不是生日也可以吃' },
    { id: 'cookie', name: '猫薄荷饼干', price: 20, food: 10, fun: 45, xp: 8, lv: 3, color: '#A9DB8F', desc: '吃完会有点飘飘' },
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
  };

  const HATS = {
    star:  { name: '黄油星星', price: 60, lv: 1, back: 'hat-star-b', front: 'hat-star-f', hideEars: true, desc: '五个软软的角' },
    bow:   { name: '樱花结',   price: 40, lv: 1, front: 'hat-bow-f', desc: '别在右耳边' },
    bunny: { name: '兔兔帽',   price: 80, lv: 2, back: 'hat-bunny-b', front: 'hat-bunny-f', hideEars: true, desc: '今天是兔兔' },
    bear:  { name: '小熊毛球', price: 90, lv: 3, front: 'hat-bear-f', hideEars: true, desc: '顶上一颗毛球' },
  };
  const COLLARS = {
    cyber:   { name: '赛博铃铛', price: 0,  lv: 1, use: 'col-cyber', desc: '会发光的爱心芯片' },
    gingham: { name: '格纹蕾丝', price: 50, lv: 1, use: 'col-gingham', desc: '粉格子小翻领' },
    tie:     { name: '草莓领带', price: 60, lv: 2, use: 'col-tie', desc: '草莓部经理' },
    bbf:     { name: '黄油领巾', price: 70, lv: 3, use: 'col-bbf', desc: 'Best Butter Friends' },
  };
  const DECOR = {
    lights: { name: '星星灯串', price: 60, lv: 1, desc: '一闪一闪', vb: '0 14 400 64', art: 'art-lights' },
    plant:  { name: '圆叶盆栽', price: 40, lv: 1, desc: '会呼吸的绿', vb: '330 222 84 124', art: 'art-plant' },
    rug:    { name: '云朵地毯', price: 50, lv: 2, desc: '踩上去软乎乎', vb: '60 390 300 84', art: 'art-rug' },
    teddy:  { name: '泰迪熊',   price: 80, lv: 2, desc: '它最好的朋友', vb: '0 560 400 560', art: 'art-teddy' },
  };

  const TASK_POOL = [
    { type: 'feed', goal: 3, text: '喂它吃 3 顿饭', reward: 15 },
    { type: 'pet', goal: 10, text: '摸摸它 10 下', reward: 15 },
    { type: 'play', goal: 1, text: '陪它玩一局接小鱼', reward: 20 },
    { type: 'bath', goal: 1, text: '给它洗个香香澡', reward: 20 },
    { type: 'clean', goal: 2, text: '清理 2 个毛球', reward: 15 },
    { type: 'dress', goal: 1, text: '给它换一次装扮', reward: 10 },
    { type: 'sleep', goal: 1, text: '哄它睡一觉', reward: 15 },
    { type: 'meow', goal: 5, text: '听它喵 5 声', reward: 10 },
    { type: 'harvest', goal: 2, text: '在花园收获 2 次', reward: 20 },
    { type: 'cook', goal: 1, text: '用烤箱做一道料理', reward: 20 },
    { type: 'brush', goal: 1, text: '在浴室给它梳一次毛', reward: 15 },
    { type: 'butterfly', goal: 3, text: '陪它扑 3 次蝴蝶', reward: 15 },
    { type: 'visit', goal: 3, text: '带它去 3 个不同的地方', reward: 10 },
  ];
  const TITLES = ['', '初次见面', '有点熟了', '想要贴贴', '超级喜欢你', '心肝宝贝', '命中注定'];
  const xpNeed = (lv) => 40 + (lv - 1) * 30;

  const LINES = {
    food: ['肚肚饿了…', '想吃小鱼干', '咕噜噜（肚子在叫）'],
    clean: ['身上黏黏的…', '想洗香香'],
    fun: ['陪我玩嘛～', '好无聊喵…', '（用头蹭屏幕）'],
    energy: ['困困…', '眼皮好重'],
    happy: ['今天也很喜欢你', '喵～', '（盯——）', '蹭蹭', '你在看什么呀', '本喵是赛博小猫哦', '想被摸摸头', '♪ 喵喵喵～'],
    meow: ['喵～', '喵？', '咪！', '喵呜——', '……喵', '喵喵！', 'mew'],
    purr: ['呼噜', '呼噜噜', 'prrr', '♡'],
  };

  /* =========================================================
     state
     ========================================================= */
  const KEY = 'cybermeow.v1';
  const fresh = () => ({
    adopted: false, name: '', coat: 'gold', coins: 60, lv: 1, xp: 0,
    needs: { food: 72, clean: 80, fun: 62, energy: 78 },
    owned: { hat: [], collar: ['cyber'], decor: [] },
    equip: { hat: 'none', collar: 'cyber', decor: [] },
    sleeping: false, hairballs: [], last: Date.now(), born: Date.now(),
    day: '', tasks: [], streak: 0, lastCheck: '', best: 0,
    settings: { vibe: true }, installAsked: 0, playSec: 0,
    scene: 'bedroom', inv: { berry: 0, catnip: 1, carrot: 0 }, pantry: {}, garden: [null, null, null], brushedAt: 0, visits: null,
  });
  let G;
  try { G = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { G = fresh(); }
  G.settings = Object.assign({ vibe: true }, G.settings);
  G.inv = Object.assign({ berry: 0, catnip: 0, carrot: 0 }, G.inv);
  G.pantry = G.pantry || {};
  G.garden = Array.isArray(G.garden) ? G.garden : [null, null, null];
  G.scene = G.scene || 'bedroom';
  const save = () => { G.last = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(G)); } catch {} };

  function offlineCatchUp() {
    const mins = clamp((Date.now() - G.last) / 60000, 0, 60 * 24 * 3);
    if (mins < 1) return 0;
    const n = G.needs;
    if (G.sleeping) { n.energy += mins; n.food -= mins * .1; n.fun -= mins * .06; }
    else { n.food -= mins * .15; n.clean -= mins * .09; n.fun -= mins * .18; n.energy -= mins * .1; }
    for (const k in n) n[k] = clamp(n[k], 6, 100);
    if (mins > 30) for (let i = 0; i < Math.min(2, Math.floor(mins / 60)); i++) addHairball(false);
    return mins;
  }

  function ensureDay() {
    const today = dateKey();
    if (G.day === today) return;
    G.day = today;
    const pool = [...TASK_POOL].sort(() => Math.random() - .5).slice(0, 3);
    G.tasks = pool.map((t) => ({ ...t, prog: 0, done: false, claimed: false }));
    save();
  }

  /* =========================================================
     elements
     ========================================================= */
  const device = el('device'), room = el('room'), svg = el('scene'), fx = el('fx'), bubble = el('bubble');
  const E = {};
  ['cat', 'catInner', 'head', 'bodyG', 'tail', 'ears', 'earL', 'earR', 'eyeL', 'eyeR', 'pupilL', 'pupilR', 'glintL', 'glintR',
    'eyesOpen', 'happyEyes', 'sleepEyes', 'sadBrows', 'blush', 'mouthOpen', 'whiskL', 'whiskR', 'pawR', 'foam',
    'slotHatBack', 'slotHatFront', 'slotCollar', 'dirtBody', 'dirtFace', 'bowlFood', 'foodMound', 'hairballs',
    'sky', 'skyDayArt', 'skyNightArt', 'rugDefault', 'decor-lights', 'decor-rug', 'decor-plant', 'decor-teddy'].forEach((id) => { E[id] = el(id); });

  // static art built in JS
  (function buildArt() {
    // star hood
    const cx = 300, cy = 262, R = 228, r = 150;
    let d = '';
    for (let i = 0; i < 10; i++) {
      const a = (-96 + i * 36) * Math.PI / 180, rr = i % 2 ? r : R;
      d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1);
    }
    el('starShape').setAttribute('d', d + 'Z');
    // pixel heart
    const rows = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'];
    let h = '';
    rows.forEach((row, y) => [...row].forEach((c, x) => {
      if (c === 'X') h += `<rect x="${271 + x * 6}" y="${88 + y * 6}" width="6" height="6" fill="${(x + y) % 3 ? '#FF9EC4' : '#FFB8D3'}"/>`;
    }));
    h += '<rect x="277" y="94" width="6" height="6" fill="#fff"/>';
    el('pixHeart').innerHTML = h;
    // string light bulbs
    const ns = 'http://www.w3.org/2000/svg';
    const tmp = document.createElementNS(ns, 'path');
    tmp.setAttribute('d', 'M8 30 Q100 70 200 42 Q300 16 392 50');
    svg.appendChild(tmp);
    const L = tmp.getTotalLength();
    const cols = ['#FF9EC4', '#9EF0E1', '#FFE08A', '#C8B6FF'];
    let b = '';
    for (let i = 1; i < 12; i++) {
      const p = tmp.getPointAtLength(L * i / 12);
      const c = cols[i % 4];
      b += `<g class="bulb" style="animation-delay:${(i * .27).toFixed(2)}s"><circle cx="${p.x}" cy="${p.y + 7}" r="9" fill="${c}" opacity=".35"/><path d="M${p.x} ${p.y + 1}l2 4.2 4.6.6-3.4 3.2.9 4.6-4.1-2.3-4.1 2.3.9-4.6-3.4-3.2 4.6-.6z" fill="${c}"/></g>`;
    }
    tmp.remove();
    el('bulbs').innerHTML = b;
  })();

  /* =========================================================
     coordinates & fx
     ========================================================= */
  const S = .42, HOME_Y = 456, BED = { x: 318, y: 442 }, EAT_X = 146;
  const cat = { x: 200, y: HOME_Y, tx: 200, ty: HOME_Y, moving: false, onArrive: null, phase: 0, hopY: 0, state: 'idle', until: 0, eatUntil: 0 };
  const pt = svg.createSVGPoint();
  function toRoom(e) { pt.x = e.clientX; pt.y = e.clientY; return pt.matrixTransform(svg.getScreenCTM().inverse()); }
  const originX = () => cat.x - 300 * S;
  const originY = () => cat.y - 670 * S + cat.hopY;
  const toLocal = (g) => ({ x: (g.x - originX()) / S, y: (g.y - originY()) / S });
  const toRoomPt = (x, y) => ({ x: originX() + x * S, y: originY() + y * S });
  const onCat = (p) => ((p.x - 300) / 210) ** 2 + ((p.y - 290) / 185) ** 2 < 1 || ((p.x - 300) / 200) ** 2 + ((p.y - 520) / 180) ** 2 < 1;

  // room (viewBox) coordinates → CSS pixels inside .room
  const px = (x, y) => {
    const m = svg.getScreenCTM(), r = room.getBoundingClientRect();
    return { x: m.a * x + m.e - r.left, y: m.d * y + m.f - r.top };
  };
  function spawn(text, rx, ry, cls = '') {
    const s = document.createElement('span');
    s.className = 'pfx ' + cls;
    s.textContent = text;
    const q = px(rx, ry);
    s.style.left = q.x + 'px';
    s.style.top = q.y + 'px';
    s.style.setProperty('--dx', rand(-26, 26).toFixed(0) + 'px');
    s.style.setProperty('--rot', rand(-16, 16).toFixed(0) + 'deg');
    fx.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  }
  let bubbleTimer = 0, bubbleUntil = 0;
  function say(text, ms = 2000, icon) {
    bubble.innerHTML = (icon ? `<span class="ic">${IC[icon]}</span>` : '') + text;
    bubble.classList.remove('show'); void bubble.offsetWidth; bubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleUntil = now() + ms;
    bubbleTimer = setTimeout(() => bubble.classList.remove('show'), ms);
  }
  let toastTimer;
  function toast(t) {
    const n = el('toast');
    n.textContent = t;
    n.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => n.classList.remove('show'), 1900);
  }

  // ---- haptics (Android vibrates; iOS silently ignores)
  const buzz = (p) => { try { if (G.settings.vibe && navigator.vibrate) navigator.vibrate(p); } catch {} };

  /* =========================================================
     economy / progression
     ========================================================= */
  function addCoins(n, rx, ry) {
    G.coins = Math.max(0, G.coins + n);
    const p = el('coinPill');
    p.classList.remove('bump'); void p.offsetWidth; p.classList.add('bump');
    if (n > 0 && rx != null) spawn('+' + n + ' 🐟', rx, ry, 'coin');
    renderHud();
  }
  function addXP(n) {
    G.xp += n;
    let up = false;
    while (G.xp >= xpNeed(G.lv)) { G.xp -= xpNeed(G.lv); G.lv++; up = true; }
    if (up) {
      const reward = 30 + G.lv * 10;
      G.coins += reward;
      el('luLv').textContent = 'Lv.' + G.lv;
      el('luTitle').textContent = TITLES[Math.min(G.lv, TITLES.length - 1)];
      el('luReward').textContent = `奖励 🐟×${reward} · 新商品解锁了`;
      el('levelUp').hidden = false;
      buzz([30, 60, 30, 60, 80]);
      for (let i = 0; i < 10; i++) setTimeout(() => spawn(pick(['♥', '✦', '♡']), rand(60, 340), rand(160, 360), 'heart'), i * 80);
    }
    renderHud(); save();
  }
  el('luOk').addEventListener('click', () => { el('levelUp').hidden = true; });

  function need(k, d) { G.needs[k] = clamp(G.needs[k] + d, 0, 100); }

  function track(type, n = 1) {
    let changed = false;
    G.tasks.forEach((t) => {
      if (t.type !== type || t.done) return;
      t.prog = Math.min(t.goal, t.prog + n);
      changed = true;
      if (t.prog >= t.goal) { t.done = true; toast('✓ 任务完成：' + t.text); }
    });
    if (changed) { renderHud(); save(); if (sheetKind === 'tasks') renderSheet(); }
  }

  /* =========================================================
     HUD
     ========================================================= */
  function renderHud() {
    el('hudName').textContent = G.name || '小猫';
    el('hudLv').textContent = 'Lv.' + G.lv;
    el('hudTitle').textContent = TITLES[Math.min(G.lv, TITLES.length - 1)] + ` · ${Math.round(G.xp)}/${xpNeed(G.lv)}`;
    el('hudXp').style.width = (G.xp / xpNeed(G.lv) * 100) + '%';
    el('hudCoins').textContent = G.coins;
    $$('.need').forEach((n) => {
      const v = G.needs[n.dataset.need];
      n.querySelector('.ring').style.setProperty('--p', v.toFixed(1));
      n.classList.toggle('low', v < 30);
    });
    const claimable = G.tasks.some((t) => t.done && !t.claimed) || G.lastCheck !== dateKey();
    el('taskDot').hidden = !claimable;
    el('sleepLbl').textContent = G.sleeping ? '起床' : '睡觉';
    const sb = el('btnSleep');
    sb.classList.toggle('on', G.sleeping);
    sb.querySelector('.ic').innerHTML = IC[G.sleeping ? 'wake' : 'sleep'];
  }

  function applyLook() {
    const h = HATS[G.equip.hat], c = COLLARS[G.equip.collar];
    const setUse = (n, id) => { if (id) { n.setAttribute('href', '#' + id); n.style.display = ''; } else n.style.display = 'none'; };
    setUse(E.slotHatBack, h && h.back);
    setUse(E.slotHatFront, h && h.front);
    setUse(E.slotCollar, c && c.use);
    E.ears.style.display = h && h.hideEars ? 'none' : '';
    Object.keys(DECOR).forEach((k) => { E['decor-' + k].style.display = G.equip.decor.includes(k) ? '' : 'none'; });
    E.rugDefault.style.display = G.equip.decor.includes('rug') ? 'none' : '';
    device.dataset.coat = G.coat;
    portrait();
  }

  // static snapshots of the real cat model (HUD avatar + adoption screen); coat colours stay live via CSS vars
  function snapshot(svgEl, sourceId) {
    if (!svgEl) return;
    const src = el(sourceId);
    if (!src) return;
    const copy = src.cloneNode(true);
    copy.removeAttribute('transform');
    copy.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
    copy.querySelectorAll('[transform]').forEach((n) => {
      // keep authored geometry transforms, drop the live animation ones
      if (/rotate\(-?[\d.]+ (300 420|205 205|395 205|410 625|270 364|330 364)\)|^translate\(-?[\d.]+ -?[\d.]+\) rotate/.test(n.getAttribute('transform'))) n.removeAttribute('transform');
    });
    svgEl.replaceChildren(copy);
  }
  function portrait() {
    snapshot($('.avatar svg'), 'head');
    snapshot($('.adopt-cat svg'), 'catInner');
  }

  // tall phones show more wall above the scene; dress it only when it is really visible
  function layoutUpper() {
    const m = svg.getScreenCTM(); if (!m) return;
    const r = room.getBoundingClientRect();
    const topY = (r.top - m.f) / m.d;          // viewBox y at the top edge of the room
    $$('[data-upper]').forEach((up) => {
      if (up.dataset.upper === G.scene && topY < -95) { up.style.display = ''; up.setAttribute('transform', `translate(0 ${Math.round(topY * .5 + 10)})`); }
      else up.style.display = 'none';
    });
  }
  window.addEventListener('resize', layoutUpper);

  function renderClockSky() {
    const d = new Date(), h = d.getHours();
    el('clock').textContent = `${String(h).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    const phase = h >= 6 && h < 17 ? 'day' : h >= 17 && h < 19 ? 'dusk' : 'night';
    E.sky.setAttribute('fill', `url(#sky${phase === 'day' ? 'Day' : phase === 'dusk' ? 'Dusk' : 'Night'})`);
    E.skyDayArt.style.display = phase === 'night' ? 'none' : '';
    E.skyNightArt.style.display = phase === 'night' ? '' : 'none';
    room.classList.toggle('night', phase === 'night');
  }

  /* =========================================================
     hairballs
     ========================================================= */
  function addHairball(animate = true) {
    if (G.hairballs.length >= 3) return;
    let x, y, tries = 0;
    do { x = rand(70, 290); y = rand(462, 474); tries++; } while (tries < 10 && G.hairballs.some((h) => Math.abs(h.x - x) < 30));
    G.hairballs.push({ x: +x.toFixed(1), y: +y.toFixed(1), id: Date.now() + Math.random() });
    renderHairballs(animate);
  }
  function renderHairballs() {
    E.hairballs.innerHTML = G.hairballs.map((h) => {
      // a soft tumbleweed of shed fur, painted with the same brush as the cat
      const rnd = CatModel.rng(Math.floor(h.x * 97 + h.y * 13)), f = new CatModel.Fur();
      for (let i = 0; i < 26; i++) {
        const a = rnd() * Math.PI * 2, k = .3 + rnd() * .6;
        f.add(i % 3 ? 'var(--f-mid)' : 'var(--f-light)', .95, h.x + Math.cos(a) * 5 * k, h.y + Math.sin(a) * 4 * k, a + (rnd() - .5), 4 + rnd() * 5, .9 + rnd() * .6, (rnd() - .5) * .4);
      }
      return `
      <g class="hairball" data-id="${h.id}">
        <circle cx="${h.x}" cy="${h.y}" r="16" fill="transparent"/>
        <g class="hb">
          <ellipse cx="${h.x}" cy="${h.y + 5}" rx="10" ry="2.5" fill="#9B6E86" opacity=".25"/>
          <circle cx="${h.x}" cy="${h.y}" r="6.5" style="fill:var(--f-body1)"/>
          ${f.svg()}
        </g>
      </g>`;
    }).join('');
  }
  E.hairballs.addEventListener('pointerdown', (e) => {
    const g = e.target.closest('.hairball');
    if (!g) return;
    e.stopPropagation();
    const h = G.hairballs.find((x) => String(x.id) === g.dataset.id);
    G.hairballs = G.hairballs.filter((x) => x !== h);
    renderHairballs();
    if (h) { spawn('✨', h.x, h.y - 10, 'spark'); spawn('扫走啦', h.x, h.y - 24, 'big'); }
    need('clean', 5); addXP(1); track('clean'); save(); buzz(12);
  });

  /* =========================================================
     cat control
     ========================================================= */
  function goTo(x, y, cb) { cat.tx = x; cat.ty = y; cat.moving = true; cat.onArrive = cb || null; }
  const busy = () => ['eat', 'bath', 'game'].includes(cat.state);

  // ---- feed
  function feed(f) {
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
    } else G.pantry[f.id]--;
    buzz(12);
    closeSheet();
    el('foodMound').setAttribute('fill', f.color);
    E.bowlFood.style.display = '';
    spawn('叮～', 66, 420, 'big');
    cat.state = 'eat';
    say(pick(['！！', '开饭啦？', '是' + f.name + '！']), 1200);
    goTo(EAT_X, HOME_Y - 6, () => {
      cat.eatUntil = now() + 2800;
      const iv = setInterval(() => spawn(pick(['吧唧', '嚼嚼', '好香']), rand(70, 120), 405, 'big'), 700);
      setTimeout(() => {
        clearInterval(iv);
        E.bowlFood.style.display = 'none';
        need('food', f.food); need('fun', f.fun);
        addXP(f.xp); track('feed');
        cat.state = 'idle'; cat.until = now() + 1500;
        say(pick(['好吃！', '还要～', '谢谢你喵', '幸福…']));
        spawn('♥', cat.x, 280, 'heart');
        save();
      }, 2800);
    });
  }

  // ---- bath
  const bath = { on: false, prog: 0, foam: 0, kind: 'bath' };
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
    bath.on = true; bath.prog = 0; bath.foam = 0; bath.kind = 'bath';
    E.foam.innerHTML = '';
    cat.state = 'bath';
    room.classList.add('bathing');
    el('bathBar').hidden = false;
    el('bathProg').style.width = '0%';
    goTo(200, SCENES.bath.home[1]);
    say(G.needs.clean > 90 ? '已经很香了嘛…好吧' : '洗…洗澡？', 1600);
  }
  function endBath(done) {
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
    }
    if (!done) {
      need('clean', bath.prog * .3);
      E.foam.innerHTML = '';
      cat.state = 'idle';
      return;
    }
    for (let i = 0; i < 34; i++) setTimeout(() => spawn('', cat.x + rand(-80, 80), rand(150, 260), 'drop'), i * 28);
    setTimeout(() => {
      E.foam.innerHTML = '';
      for (let i = 0; i < 8; i++) setTimeout(() => spawn(pick(['✦', '✧', '✨']), cat.x + rand(-70, 70), rand(260, 420), 'spark'), i * 70);
      G.needs.clean = 100; need('fun', 6); need('energy', -4); buzz([20, 40, 20]);
      addXP(6); track('bath');
      cat.state = 'idle'; cat.until = now() + 2000;
      say('香香的！✨');
      save();
    }, 1000);
  }
  function rub(p, d) {
    if (bath.kind === 'brush') {
      bath.prog = Math.min(100, bath.prog + d * .05);
      el('bathProg').style.width = bath.prog + '%';
      bath.foam += d;
      if (bath.foam > 34) { bath.foam = 0; const q = toRoomPt(p.x, p.y); spawn('', q.x, q.y, 'fluff'); if (Math.random() < .4) spawn(pick(['呼噜', '♡']), q.x, q.y - 12, ''); }
      if (bath.prog >= 100) endBath(true);
      return;
    }
    bath.prog = Math.min(100, bath.prog + d * .045);
    el('bathProg').style.width = bath.prog + '%';
    bath.foam += d;
    if (bath.foam > 26 && E.foam.childElementCount < 70) {
      bath.foam = 0;
      const r = rand(14, 32);
      E.foam.insertAdjacentHTML('beforeend',
        `<g><circle cx="${p.x.toFixed(0)}" cy="${p.y.toFixed(0)}" r="${r.toFixed(0)}" fill="#fff" fill-opacity=".92" stroke="#BDE7FA" stroke-width="3"/><circle cx="${(p.x - r * .35).toFixed(0)}" cy="${(p.y - r * .35).toFixed(0)}" r="${(r * .2).toFixed(0)}" fill="#DFF3FC"/></g>`);
    }
    if (bath.prog >= 100) endBath(true);
  }
  el('bathCancel').addEventListener('click', () => endBath(false));

  // ---- sleep
  function toggleSleep() {
    if (bath.on || cat.state === 'game') return;
    if (G.sleeping) {
      G.sleeping = false;
      room.classList.remove('lightsoff');
      cat.state = 'idle'; cat.until = now() + 2500;
      goTo(200, HOME_Y);
      say(G.needs.energy > 80 ? '睡饱饱啦！' : '唔…还有点困', 1800);
    } else {
      if (cat.state === 'eat') return toast('等它吃完～');
      if (G.scene !== 'bedroom') return goScene('bedroom', toggleSleep);
      G.sleeping = true;
      cat.state = 'sleep';
      room.classList.add('lightsoff');
      say(G.needs.energy > 85 ? '还不困…好吧' : '晚安喵…', 1400);
      goTo(BED.x, BED.y);
      track('sleep');
    }
    renderHud(); save();
  }

  // ---- meow / pet
  let meowUntil = 0, squishAt = -1, happyUntil = 0, lastMeowXP = 0;
  function meow() {
    meowUntil = now() + 650; squishAt = now(); buzz(15);
    say(pick(LINES.meow), 1300);
    need('fun', 1);
    if (now() - lastMeowXP > 3000) { addXP(1); lastMeowXP = now(); }
    track('meow');
  }

  let down = null, petting = false, pLocal = null, pRoom = null, lastMove = -1e9, lastPurr = 0;
  svg.addEventListener('pointermove', (e) => {
    pRoom = toRoom(e); pLocal = toLocal(pRoom); lastMove = now();
    if (!down) return;
    const d = Math.hypot(pLocal.x - down.x, pLocal.y - down.y);
    down.x = pLocal.x; down.y = pLocal.y; down.dist += d;
    if (bath.on) { if (onCat(pLocal)) rub(pLocal, d); return; }
    if (G.sleeping) return;
    if (down.dist > 30 && onCat(pLocal)) {
      petting = true;
      down.acc += d;
      if (down.acc > 140) {
        down.acc = 0;
        need('fun', 3); addXP(1); track('pet'); buzz(8);
      }
    } else if (!onCat(pLocal)) petting = false;
  });
  svg.addEventListener('pointerdown', (e) => {
    pRoom = toRoom(e); pLocal = toLocal(pRoom); lastMove = now();
    if (cat.state === 'game' || !onCat(pLocal)) return;
    down = { x: pLocal.x, y: pLocal.y, dist: 0, acc: 0 };
    try { svg.setPointerCapture(e.pointerId); } catch {}
  });
  const endPointer = (e) => {
    if (!down) return;
    if (!bath.on) {
      if (petting) { happyUntil = now() + 1300; spawn('♥', cat.x + rand(-20, 20), 250, 'heart'); save(); }
      else if (down.dist < 12) {
        if (G.sleeping) say('zzz…（翻了个身）', 1400);
        else if (!busy()) meow();
      }
    }
    down = null; petting = false;
    if (e && e.pointerType !== 'mouse') pLocal = null;
  };
  svg.addEventListener('pointerup', endPointer);
  svg.addEventListener('pointercancel', () => { down = null; petting = false; });
  svg.addEventListener('pointerleave', () => { if (!down) pLocal = null; });

  /* =========================================================
     render loop
     ========================================================= */
  const C = { hr: 0, hx: 0, hy: 0, ex: 0, ey: 0, blush: .45, mouth: 0, dil: .3 };
  const anim = { blinkStart: -1, blinkDur: 150, dbl: false, nextBlink: 1500, twStart: -1, twEar: 'L', nextTw: 3000, idleNext: 0, idleT: { x: 300, y: 300 }, lastZ: 0 };
  let lastT = now();

  function frame(t) {
    const dt = Math.min(.05, (t - lastT) / 1000); lastT = t;
    const time = t / 1000;

    // --- movement
    if (cat.moving) {
      const dx = cat.tx - cat.x, dy = cat.ty - cat.y, dist = Math.hypot(dx, dy), step = 85 * dt;
      if (dist <= step) {
        cat.x = cat.tx; cat.y = cat.ty; cat.moving = false; cat.hopY = 0;
        const cb = cat.onArrive; cat.onArrive = null; if (cb) cb();
      } else {
        cat.x += dx / dist * step; cat.y += dy / dist * step;
        cat.phase += dt * 11;
        cat.hopY = -Math.abs(Math.sin(cat.phase)) * 11;
      }
    } else cat.phase = 0;

    // --- wander when idle
    if (cat.state === 'idle' && !cat.moving && !G.sleeping && !down && t > cat.until) {
      const sc = SCENES[G.scene];
      if (sc.wander && Math.random() < .55) goTo(rand(sc.wander[0], sc.wander[1]), sc.home[1]);
      cat.until = t + rand(5000, 11000);
    }

    if (G.scene === 'garden') moveButterflies(t);
    const sleepingNow = G.sleeping && !cat.moving;
    const eating = cat.state === 'eat' && t < cat.eatUntil;
    const happy = !sleepingNow && (petting || t < happyUntil || eating || bath.on);
    const minNeed = Math.min(...Object.values(G.needs));

    // --- gaze
    let tgt = null;
    if (!sleepingNow && !eating) {
      if (pLocal && t - lastMove < 4000) tgt = pLocal;
      else if (cat.moving) tgt = { x: 300 + Math.sign(cat.tx - cat.x) * 300, y: 330 };
      else {
        if (t > anim.idleNext) { anim.idleT = Math.random() < .5 ? { x: 300, y: 300 } : { x: 300 + rand(-280, 280), y: rand(180, 520) }; anim.idleNext = t + rand(1500, 4000); }
        tgt = anim.idleT;
      }
    }
    let ex = 0, ey = 0, thr = 0, thx = 0, thy = 0;
    if (tgt) {
      const dx = tgt.x - 300, dy = tgt.y - 300, d = Math.hypot(dx, dy) || 1, m = Math.min(6.5, d / 20);
      ex = dx / d * m; ey = dy / d * m;
      thr = clamp(dx / 48, -7, 7); thx = clamp(dx / 34, -9, 9); thy = clamp(dy / 50, -5, 6);
    }
    if (petting && pLocal) { thr = clamp((pLocal.x - 300) / 22, -11, 11) + Math.sin(time * 3) * 1.2; thy = -2; }
    if (eating) { thr = -12; thx = -22; thy = 34 + Math.sin(time * 12) * 4; }
    if (sleepingNow) { thr = 7; thx = 4; thy = 16; }
    if (bath.on) thr += Math.sin(time * 5) * 2;
    if (minNeed < 25 && !sleepingNow && !happy) thy += 6;

    C.hr = lerp(C.hr, thr, .12); C.hx = lerp(C.hx, thx, .12); C.hy = lerp(C.hy, thy, .12);
    C.ex = lerp(C.ex, ex, .22); C.ey = lerp(C.ey, ey, .22);

    // --- body
    const br = reduceMotion ? 0 : Math.sin(time * (sleepingNow ? 1.1 : 2)) * (sleepingNow ? .024 : .011);
    let sq = 0;
    if (squishAt > 0) { const p = (t - squishAt) / 380; if (p < 1) sq = Math.sin(Math.PI * p) * .04; else squishAt = -1; }
    if (cat.moving) sq = -Math.cos(cat.phase * 2) * .035;
    E.cat.setAttribute('transform', `translate(${originX().toFixed(2)} ${originY().toFixed(2)}) scale(${S})`);
    E.catInner.setAttribute('transform', `translate(300 670) scale(${(1 + sq).toFixed(4)} ${(1 - sq).toFixed(4)}) translate(-300 -670)`);
    E.bodyG.setAttribute('transform', `translate(300 670) scale(${(1 - br * .4).toFixed(4)} ${(1 + br).toFixed(4)}) translate(-300 -670)`);
    E.head.setAttribute('transform', `translate(${C.hx.toFixed(2)} ${(C.hy - br * 140).toFixed(2)}) rotate(${C.hr.toFixed(2)} 300 420)`);

    // --- eyes
    if (t > anim.nextBlink && anim.blinkStart < 0 && !sleepingNow && !happy) {
      anim.blinkStart = t; anim.blinkDur = Math.random() < .15 ? 560 : 150; anim.dbl = anim.blinkDur < 200 && Math.random() < .22;
    }
    let s = 1;
    if (anim.blinkStart > 0) {
      const p = (t - anim.blinkStart) / anim.blinkDur;
      if (p >= 1) { if (anim.dbl) { anim.dbl = false; anim.blinkStart = t + 70; } else { anim.blinkStart = -1; anim.nextBlink = t + rand(2000, 6000); } }
      else if (p > 0) s = 1 - Math.sin(p * Math.PI) * .93;
    }
    // low energy → droopy eyes
    if (G.needs.energy < 20 && !happy && !sleepingNow) s = Math.min(s, .62);
    CatModel.eyes(C.ex, C.ey, t < meowUntil ? 1 : C.dil, s);
    E.eyesOpen.style.display = (happy || sleepingNow) ? 'none' : '';
    E.happyEyes.style.display = happy ? '' : 'none';
    E.sleepEyes.style.display = sleepingNow ? '' : 'none';
    E.sadBrows.style.display = (minNeed < 25 && !sleepingNow && !happy) ? '' : 'none';
    const dirty = G.needs.clean < 40 && !bath.on;
    E.dirtBody.style.display = E.dirtFace.style.display = dirty ? '' : 'none';

    // --- ears / tail / whiskers
    if (t > anim.nextTw && anim.twStart < 0 && !sleepingNow) { anim.twStart = t; anim.twEar = Math.random() < .5 ? 'L' : 'R'; anim.nextTw = t + rand(3500, 9000); }
    let aL = 0, aR = 0;
    if (anim.twStart > 0) {
      const p = (t - anim.twStart) / 420;
      if (p >= 1) anim.twStart = -1;
      else { const a = -13 * Math.sin(p * Math.PI * 3) * (1 - p); if (anim.twEar === 'L') aL = a; else aR = a; }
    }
    const perk = sleepingNow ? -6 : happy ? -5 : minNeed < 25 ? -9 : 0;
    E.earL.setAttribute('transform', `rotate(${(aL + perk).toFixed(2)} 205 205)`);
    E.earR.setAttribute('transform', `rotate(${(-(aR + perk)).toFixed(2)} 395 205)`);
    if (!reduceMotion) {
      const ta = sleepingNow ? Math.sin(time * .5) * 2 : Math.sin(time * 1.2) * 5 + (happy ? Math.sin(time * 3) * 4 : 0) + (cat.moving ? Math.sin(time * 6) * 6 : 0);
      E.tail.setAttribute('transform', `rotate(${ta.toFixed(2)} 410 625)`);
      const wa = Math.sin(time * 1.6) * 1.4 + (t < meowUntil ? 3 : 0) - (sleepingNow ? 3 : 0);
      E.whiskL.setAttribute('transform', `rotate(${wa.toFixed(2)} 270 364)`);
      E.whiskR.setAttribute('transform', `rotate(${(-wa).toFixed(2)} 330 364)`);
    }

    // --- mouth & blush
    const mt = eating ? 4 + Math.abs(Math.sin(time * 12)) * 5 : t < meowUntil ? 9 : 0;
    C.mouth = lerp(C.mouth, mt, .3);
    E.mouthOpen.setAttribute('ry', C.mouth.toFixed(2));
    C.blush = lerp(C.blush, happy ? .85 : sleepingNow ? .6 : .45, .08);
    E.blush.setAttribute('opacity', C.blush.toFixed(3));

    // --- particles
    if (petting && pRoom && t - lastPurr > 450) { lastPurr = t; const w = pick(LINES.purr); spawn(w, pRoom.x + rand(-14, 14), pRoom.y - 16, w === '♡' ? 'heart' : ''); }
    if (sleepingNow && t - anim.lastZ > 1500) { anim.lastZ = t; const g = toRoomPt(430, 150); spawn(pick(['z', 'Z', 'z']), g.x + rand(0, 10), g.y, 'z'); }

    // --- bubble follows head
    const hatLift = HATS[G.equip.hat] && HATS[G.equip.hat].back ? -70 : G.equip.hat === 'bear' ? -60 : 0;
    const bp = toRoomPt(300 + C.hx, 105 + C.hy + hatLift);
    const bq = px(bp.x, bp.y);
    bubble.style.left = bq.x + 'px';
    bubble.style.top = bq.y + 'px';

    requestAnimationFrame(frame);
  }

  /* =========================================================
     needs tick & chatter
     ========================================================= */
  let lastTick = Date.now(), nextChat = now() + 8000;
  function tick() {
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
    const n = G.needs;
    if (G.sleeping) { n.energy += 12 * dtMin; n.food -= .12 * dtMin; n.fun -= .08 * dtMin; }
    else { n.food -= .3 * dtMin; n.clean -= .18 * dtMin; n.fun -= .35 * dtMin; n.energy -= .22 * dtMin; }
    for (const k in n) n[k] = clamp(n[k], 0, 100);

    if (!G.sleeping && n.clean < 80 && G.hairballs.length < 3 && Date.now() - (G.brushedAt || 0) > 2 * 3600e3 && Math.random() < 1 / 100) addHairball();
    if (G.scene === 'garden' && ++potTick % 4 === 0) renderPots();
    G.garden.forEach((pot) => { if (pot && !pot.told && grow(pot, Date.now()) >= 1) { pot.told = true; toast(`花园里的${CROPS[pot.seed].name}成熟啦！`); } });
    if (G.sleeping && n.energy >= 100 && cat.state === 'sleep' && Math.random() < .02) toggleSleep();
    if (!G.sleeping && n.energy < 5 && cat.state === 'idle') { say('撑不住了…', 1500); setTimeout(toggleSleep, 1200); }

    const t = now();
    if (t > nextChat && t > bubbleUntil && !busy() && !G.sleeping && !down) {
      nextChat = t + rand(10000, 18000);
      const low = Object.entries(n).sort((a, b) => a[1] - b[1])[0];
      const hr = new Date().getHours();
      if (low[1] < 35) say(pick(LINES[low[0]]), 2600, { food: 'nFood', clean: 'nClean', fun: 'nFun', energy: 'nEnergy' }[low[0]]);
      else if ((hr >= 23 || hr < 6) && Math.random() < .5) say('好晚了…该睡觉了喵', 2400, 'sleep');
      else if (hr >= 6 && hr < 10 && Math.random() < .3) say('早安喵！☀', 2200);
      else if (G.hairballs.length && Math.random() < .4) say('地上有毛球…不是我干的', 2400);
      else if (Math.random() < .55) say(pick(LINES.happy), 2200);
    }
    renderHud();
  }

  /* =========================================================
     sheets
     ========================================================= */
  let sheetKind = null, sheetTab = null;
  const sheet = el('sheet'), scrim = el('scrim');
  function openSheet(kind, tab) {
    const wasOpen = !!sheetKind;
    sheetKind = kind;
    sheetTab = tab ?? (kind === 'closet' ? 'hat' : null);
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
  })();
  el('sheetClose').addEventListener('click', closeSheet);
  scrim.addEventListener('click', closeSheet);

  const priceTag = (p) => p === 0 ? '<span class="price free">FREE</span>' : `<span class="price"><span class="ic">${IC.coin}</span>${p}</span>`;
  const lockTag = (lv) => `<span class="lock">🔒 Lv.${lv}</span>`;

  function renderSheet() {
    const title = el('sheetTitle'), tabs = el('sheetTabs'), body = el('sheetBody');
    tabs.innerHTML = '';
    if (sheetKind === 'feed') {
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
      }).join('') + '</div>';
      $$('[data-food]', body).forEach((b) => b.addEventListener('click', () => feed(FOODS.find((f) => f.id === b.dataset.food))));
    }
    else if (sheetKind === 'cook') {
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
    else if (sheetKind === 'closet') {
      title.textContent = '衣橱 & 小屋';
      [['hat', '帽子'], ['collar', '领饰'], ['decor', '家具']].forEach(([k, n]) => {
        const b = document.createElement('button');
        b.className = 'tab' + (sheetTab === k ? ' on' : '');
        b.textContent = n;
        b.onclick = () => { sheetTab = k; renderSheet(); };
        tabs.appendChild(b);
      });
      const table = sheetTab === 'hat' ? HATS : sheetTab === 'collar' ? COLLARS : DECOR;
      let html = '<div class="grid">';
      if (sheetTab !== 'decor') {
        const on = G.equip[sheetTab] === 'none';
        html += `<button class="item ${on ? 'on' : ''}" data-shop="none"><span class="art"><span class="ic">${IC.none}</span></span><b>${sheetTab === 'hat' ? '不戴帽子' : '不戴领饰'}</b><small>素颜也超可爱</small><span class="price free">—</span></button>`;
      }
      for (const [id, it] of Object.entries(table)) {
        const owned = G.owned[sheetTab].includes(id) || it.price === 0;
        const on = sheetTab === 'decor' ? G.equip.decor.includes(id) : G.equip[sheetTab] === id;
        const locked = !owned && G.lv < it.lv;
        let art;
        if (sheetTab === 'hat') art = `<svg viewBox="30 -115 540 600">${it.back ? `<use href="#${it.back}"/>` : ''}${it.hideEars ? '' : '<use href="#miniEars"/>'}<use href="#miniFace"/><use href="#${it.front}"/></svg>`;
        else if (sheetTab === 'collar') art = `<svg viewBox="140 360 320 250"><use href="#miniChest"/><use href="#${it.use}"/><use href="#miniChin"/></svg>`;
        else art = `<svg viewBox="${it.vb}"><use href="#${it.art}"/></svg>`;
        const tag = owned ? `<span class="price free">${on ? (sheetTab === 'decor' ? '点击收起' : '已穿上') : (sheetTab === 'decor' ? '点击摆放' : '点击穿上')}</span>` : locked ? lockTag(it.lv) : priceTag(it.price);
        html += `<button class="item ${sheetTab === 'decor' ? 'decor' : ''} ${on ? 'on' : ''} ${locked ? 'locked' : ''}" data-shop="${id}"><span class="art">${art}</span><b>${it.name}</b><small>${it.desc}</small>${tag}</button>`;
      }
      body.innerHTML = html + '</div>';
      $$('[data-shop]', body).forEach((b) => b.addEventListener('click', () => shopClick(sheetTab, b.dataset.shop)));
    }
    else if (sheetKind === 'tasks') {
      title.textContent = G.name + ' 的小本本';
      const checked = G.lastCheck === dateKey();
      const streakShown = checked ? G.streak : G.streak;
      const week = Array.from({ length: 7 }, (_, i) => `<span class="${i < ((streakShown - 1) % 7) + 1 && streakShown > 0 ? 'done' : ''}">D${i + 1}</span>`).join('');
      const nextReward = 20 + Math.min(G.streak + 1, 7) * 5;
      const days = Math.floor((Date.now() - G.born) / 864e5) + 1;
      body.innerHTML = `
        <div class="card lvcard">
          <span class="big">Lv.${G.lv}</span>
          <div style="flex:1"><b style="font-weight:400;font-size:17px">${TITLES[Math.min(G.lv, TITLES.length - 1)]}</b>
            <span class="xp" style="margin-top:6px"><span style="width:${G.xp / xpNeed(G.lv) * 100}%"></span></span>
            <p>亲密度 ${Math.round(G.xp)}/${xpNeed(G.lv)} · 你们认识第 ${days} 天 · 接小鱼最高 ${G.best} 分</p></div>
        </div>
        <div class="card">
          <h4>每日签到 <small>STREAK ${G.streak}</small></h4>
          <div class="week">${week}</div>
          <button class="cta" id="checkin" style="width:100%" ${checked ? 'disabled' : ''}>${checked ? '今天已经签到啦 ♥' : `签到领 🐟×${nextReward}`}</button>
        </div>
        <div class="card">
          <h4>今天的小目标 <small>DAILY</small></h4>
          ${G.tasks.map((t, i) => `
            <div class="task"><div class="t"><b>${t.text}</b><span class="bar"><i style="width:${t.prog / t.goal * 100}%"></i></span></div>
            ${t.claimed ? '<span class="claimed">DONE ✓</span>' : `<button class="cta ${t.done ? '' : 'ghost'}" data-claim="${i}" ${t.done ? '' : 'disabled'}>🐟${t.reward}</button>`}</div>`).join('')}
        </div>
        <div class="card">
          <h4>设置 <small>SETTINGS</small></h4>
          <div class="setting"><span>震动反馈</span><button class="switch" id="setVibe" role="switch" aria-checked="${G.settings.vibe}"></button></div>
          ${isStandalone() ? '' : '<div class="setting"><span>放到手机桌面</span><button class="cta" id="setInstall" style="padding:8px 14px;font-size:13px">添加</button></div>'}
        </div>
        <button class="reset" id="resetGame">重新领养（会清空存档）</button>`;
      el('setVibe').onclick = () => { G.settings.vibe = !G.settings.vibe; save(); buzz(20); renderSheet(); };
      if (el('setInstall')) el('setInstall').onclick = () => { closeSheet(); setTimeout(() => showInstall(true), 250); };
      const ci = el('checkin');
      if (ci) ci.onclick = () => {
        const y = new Date(); y.setDate(y.getDate() - 1);
        G.streak = G.lastCheck === dateKey(y) ? G.streak + 1 : 1;
        G.lastCheck = dateKey();
        const r = 20 + Math.min(G.streak, 7) * 5;
        addCoins(r, cat.x, 260); addXP(3);
        say('每天都要来看我哦', 2000);
        save(); renderSheet();
      };
      $$('[data-claim]', body).forEach((b) => b.onclick = () => {
        const t = G.tasks[+b.dataset.claim];
        if (!t.done || t.claimed) return;
        t.claimed = true;
        addCoins(t.reward, cat.x, 260); addXP(5);
        save(); renderSheet();
      });
      el('resetGame').onclick = () => {
        if (confirm('真的要重新领养吗？当前的小猫和所有进度都会清空。')) { localStorage.removeItem(KEY); location.reload(); }
      };
    }
  }

  function shopClick(kind, id) {
    if (id === 'none') { G.equip[kind] = 'none'; afterDress(); return; }
    const table = kind === 'hat' ? HATS : kind === 'collar' ? COLLARS : DECOR;
    const it = table[id];
    const owned = G.owned[kind].includes(id) || it.price === 0;
    if (!owned) {
      if (G.lv < it.lv) return toast(`等级到 Lv.${it.lv} 才能买哦`);
      if (G.coins < it.price) return toast('小鱼干不够啦，去玩接小鱼赚吧');
      addCoins(-it.price);
      G.owned[kind].push(id);
      toast('买到啦！' + it.name); buzz([15, 40, 15]);
      if (kind === 'decor') { G.equip.decor.push(id); applyLook(); save(); renderSheet(); return; }
    }
    if (kind === 'decor') {
      G.equip.decor = G.equip.decor.includes(id) ? G.equip.decor.filter((x) => x !== id) : [...G.equip.decor, id];
      applyLook(); save(); renderSheet();
      return;
    }
    G.equip[kind] = G.equip[kind] === id && owned ? 'none' : id;
    afterDress();
  }
  function afterDress() {
    applyLook();
    [E.slotHatBack, E.slotHatFront, E.slotCollar].forEach((n) => { n.style.transformBox = 'fill-box'; });
    squishAt = now();
    if (!G.sleeping) say(pick(['好看吗？', '喵！这件可以', '拍我拍我', '转个圈～']), 1600);
    track('dress'); addXP(1);
    save(); renderSheet();
  }

  /* =========================================================
     dock
     ========================================================= */
  $$('.gum').forEach((b) => b.addEventListener('click', () => {
    const a = b.dataset.act;
    buzz(10);
    if (a !== 'closet' && bath.on) endBath(false);
    if (a === 'feed') { if (G.scene === 'kitchen') openSheet('feed'); else goScene('kitchen', () => openSheet('feed')); }
    else if (a === 'bath') { closeSheet(); startBath(); }
    else if (a === 'play') startMini();
    else if (a === 'sleep') { closeSheet(); toggleSleep(); }
    else if (a === 'closet') openSheet('closet');
  }));
  el('btnTasks').addEventListener('click', () => openSheet('tasks'));

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
  const POTS = [[46, 462], [354, 462], [378, 374]];
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
  }
  el('coinPill').addEventListener('click', () => toast('小鱼干：玩接小鱼、签到、做任务都能拿'));

  /* =========================================================
     mini game: 接小鱼
     ========================================================= */
  const mini = el('mini'), cv = el('miniCanvas'), ctx = cv.getContext('2d');
  let M = null;
  const ITEM_TYPES = [
    { k: 'fish', w: .58, pts: 1 }, { k: 'berry', w: .21, pts: 2 }, { k: 'star', w: .07, pts: 5 }, { k: 'cuke', w: .14, pts: -3 },
  ];
  function startMini() {
    if (G.sleeping) return toast('它在睡觉，先叫醒它吧');
    if (busy()) return;
    if (G.needs.energy < 15) return say('太累了…玩不动', 1800, 'nEnergy');
    closeSheet();
    cat.state = 'game';
    mini.hidden = false;
    if (!(history.state && history.state.layer === 'mini')) setTimeout(() => history.pushState({ layer: 'mini' }, ''), 0);
    const r = mini.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = r.width * dpr; cv.height = r.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cs = getComputedStyle(device);
    M = {
      w: r.width, h: r.height, x: r.width / 2, tx: r.width / 2, items: [], pops: [], score: 0, time: 25, spawn: 0,
      running: false, alive: true, mouth: 0, shake: 0, t0: now(), last: now(),
      col: { mid: cs.getPropertyValue('--f-mid').trim(), soft: cs.getPropertyValue('--f-soft').trim(), ear: cs.getPropertyValue('--f-ear').trim(), top: cs.getPropertyValue('--f-top').trim() },
    };
    el('miniScore').textContent = '0'; el('miniTime').textContent = '25';
    const center = el('miniCenter');
    let n = 3;
    const cd = () => {
      center.innerHTML = `<div class="count">${n || 'GO!'}</div>`;
      if (n-- > 0) setTimeout(cd, 650);
      else setTimeout(() => { center.innerHTML = ''; M.running = true; M.last = now(); }, 450);
    };
    cd();
    requestAnimationFrame(miniLoop);
  }
  const miniX = (e) => { const r = cv.getBoundingClientRect(); if (M) M.tx = clamp(e.clientX - r.left, 30, M.w - 30); };
  cv.addEventListener('pointermove', miniX);
  cv.addEventListener('pointerdown', miniX);
  window.addEventListener('keydown', (e) => {
    if (!M || !M.running) return;
    if (e.key === 'ArrowLeft') M.tx = clamp(M.tx - 50, 30, M.w - 30);
    if (e.key === 'ArrowRight') M.tx = clamp(M.tx + 50, 30, M.w - 30);
  });

  function miniLoop(t) {
    if (!M || !M.alive) return;
    const dt = Math.min(.05, (t - M.last) / 1000); M.last = t;
    const W = M.w, H = M.h, cy = H - 64;
    if (M.running) {
      M.time -= dt;
      const prog = 1 - M.time / 25;
      M.spawn -= dt;
      if (M.spawn <= 0) {
        M.spawn = .62 - prog * .3;
        let r = Math.random(), type = ITEM_TYPES[0];
        for (const it of ITEM_TYPES) { if ((r -= it.w) <= 0) { type = it; break; } }
        M.items.push({ ...type, x: rand(28, W - 28), y: -20, vy: 150 + prog * 150 + rand(0, 50), rot: rand(-1, 1), vr: rand(-2, 2) });
      }
      M.items.forEach((it) => {
        it.y += it.vy * dt; it.rot += it.vr * dt;
        if (!it.gone && it.y > cy - 42 && it.y < cy + 12 && Math.abs(it.x - M.x) < 46) {
          it.gone = true;
          M.score = Math.max(0, M.score + it.pts);
          M.pops.push({ x: it.x, y: cy - 50, text: (it.pts > 0 ? '+' : '') + it.pts, bad: it.pts < 0, t: 0 });
          if (it.pts < 0) { M.shake = .35; buzz([40, 30, 40]); } else { M.mouth = .25; buzz(10); }
          el('miniScore').textContent = M.score;
        }
      });
      M.items = M.items.filter((it) => !it.gone && it.y < H + 30);
      el('miniTime').textContent = Math.max(0, Math.ceil(M.time));
      if (M.time <= 0) { M.running = false; endMini(); }
    }
    M.x = lerp(M.x, M.tx, .28);
    M.mouth = Math.max(0, M.mouth - dt); M.shake = Math.max(0, M.shake - dt);
    M.pops.forEach((p) => { p.t += dt; p.y -= 40 * dt; });
    M.pops = M.pops.filter((p) => p.t < .8);

    // draw
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#FCE8FF'); g.addColorStop(1, '#E4F4FF');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(166,140,255,.12)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 24) { ctx.beginPath(); ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 24) { ctx.beginPath(); ctx.moveTo(0, y + .5); ctx.lineTo(W, y + .5); ctx.stroke(); }
    ctx.fillStyle = '#FFD6E6'; ctx.fillRect(0, H - 22, W, 22);
    M.items.forEach(drawItem);
    drawCatcher(M.x + (M.shake ? Math.sin(t / 20) * 6 : 0), cy);
    ctx.textAlign = 'center';
    M.pops.forEach((p) => {
      ctx.globalAlpha = 1 - p.t / .8;
      ctx.font = '700 18px Silkscreen, monospace';
      ctx.fillStyle = p.bad ? '#6BBF59' : '#FF6FA5';
      ctx.fillText(p.text, p.x, p.y);
      ctx.globalAlpha = 1;
    });
    requestAnimationFrame(miniLoop);
  }
  function drawItem(it) {
    ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(it.rot);
    if (it.k === 'fish') {
      ctx.fillStyle = '#7EC8F0';
      ctx.beginPath(); ctx.ellipse(0, 0, 17, 10, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(13, 0); ctx.lineTo(25, -9); ctx.lineTo(25, 9); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-8, -2, 3.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2C3E50'; ctx.beginPath(); ctx.arc(-8, -2, 1.6, 0, Math.PI * 2); ctx.fill();
    } else if (it.k === 'berry') {
      ctx.fillStyle = '#F0566A';
      ctx.beginPath(); ctx.moveTo(-13, -6); ctx.quadraticCurveTo(0, -14, 13, -6); ctx.quadraticCurveTo(13, 8, 0, 16); ctx.quadraticCurveTo(-13, 8, -13, -6); ctx.fill();
      ctx.fillStyle = '#6CC04A'; ctx.beginPath(); ctx.moveTo(-8, -9); ctx.lineTo(0, -16); ctx.lineTo(8, -9); ctx.lineTo(0, -6); ctx.fill();
      ctx.fillStyle = '#FFE9E0'; [[-5, -1], [4, 0], [-1, 6], [5, -5]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill(); });
    } else if (it.k === 'star') {
      ctx.fillStyle = '#FFD35C'; ctx.shadowColor = '#FFE08A'; ctx.shadowBlur = 14;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 7 : 16; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
      ctx.closePath(); ctx.fill();
    } else {
      ctx.fillStyle = '#6BBF59';
      ctx.beginPath(); ctx.roundRect(-9, -20, 18, 40, 9); ctx.fill();
      ctx.fillStyle = '#9ED98A'; [[-3, -10], [3, -2], [-2, 8]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2); ctx.fill(); });
    }
    ctx.restore();
  }
  function drawCatcher(x, y) {
    const c = M.col;
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = c.ear;
    ctx.beginPath(); ctx.moveTo(-34, -14); ctx.lineTo(-28, -46); ctx.lineTo(-8, -32); ctx.fill();
    ctx.beginPath(); ctx.moveTo(34, -14); ctx.lineTo(28, -46); ctx.lineTo(8, -32); ctx.fill();
    ctx.fillStyle = '#F7C3CB';
    ctx.beginPath(); ctx.moveTo(-28, -20); ctx.lineTo(-26, -38); ctx.lineTo(-14, -30); ctx.fill();
    ctx.beginPath(); ctx.moveTo(28, -20); ctx.lineTo(26, -38); ctx.lineTo(14, -30); ctx.fill();
    const hg = ctx.createRadialGradient(0, 6, 4, 0, 0, 42);
    hg.addColorStop(0, '#fff'); hg.addColorStop(.5, c.soft); hg.addColorStop(1, c.mid);
    ctx.fillStyle = hg; ctx.beginPath(); ctx.ellipse(0, 0, 42, 36, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#221C15';
    const happy = M.mouth > 0, sad = M.shake > 0;
    if (happy) {
      ctx.strokeStyle = '#3A2A2A'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(-14, 2, 7, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      ctx.beginPath(); ctx.arc(14, 2, 7, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.arc(-14, -1, 10, 0, Math.PI * 2); ctx.arc(14, -1, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(-17, -5, 3.2, 0, Math.PI * 2); ctx.arc(11, -5, 3.2, 0, Math.PI * 2); ctx.fill();
      if (sad) { ctx.fillStyle = '#6FC7F0'; ctx.beginPath(); ctx.ellipse(-26, 6, 3, 5, 0, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.fillStyle = 'rgba(247,170,189,.6)';
    ctx.beginPath(); ctx.ellipse(-26, 10, 7, 4, 0, 0, Math.PI * 2); ctx.ellipse(26, 10, 7, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#EE99A3'; ctx.beginPath(); ctx.moveTo(-4, 8); ctx.lineTo(4, 8); ctx.lineTo(0, 12); ctx.fill();
    if (happy) { ctx.fillStyle = '#C0646E'; ctx.beginPath(); ctx.ellipse(0, 18, 6, 6, 0, 0, Math.PI * 2); ctx.fill(); }
    else { ctx.strokeStyle = '#C99A92'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(-5, 16); ctx.quadraticCurveTo(0, 19, 0, 13); ctx.quadraticCurveTo(0, 19, 5, 16); ctx.stroke(); }
    ctx.restore();
  }
  function endMini() {
    const score = M.score, record = score > G.best;
    if (record) G.best = score;
    const funUp = clamp(10 + score, 10, 45);
    need('fun', funUp); need('energy', -10);
    G.coins += score;
    addXP(4 + Math.floor(score / 4)); track('play');
    save();
    el('miniCenter').innerHTML = `
      <div class="result">
        <span class="pix">TIME UP!</span>
        <h3>${score}</h3>
        <p>获得 🐟×${score}${record ? ' · 新纪录！' : ''}<br>开心 +${funUp}　精力 -10</p>
        <div class="row"><button class="cta ghost" id="mAgain">再来一局</button><button class="cta" id="mHome">回家</button></div>
      </div>`;
    el('mAgain').onclick = () => { M.alive = false; if (G.needs.energy < 15) { closeMini(); say('太累了…玩不动', 1800, 'nEnergy'); } else { cat.state = 'idle'; startMini(); } };
    el('mHome').onclick = () => closeMini();
    buzz([20, 50, 20]);
  }
  function closeMini(fromPop) {
    if (fromPop !== true && history.state && history.state.layer === 'mini') { history.back(); return; }
    if (M) M.alive = false;
    mini.hidden = true;
    el('miniCenter').innerHTML = '';
    cat.state = 'idle'; cat.until = now() + 2000;
    happyUntil = now() + 1600;
    say(pick(['好好玩！', '再陪我玩嘛', '累了…但开心']), 2000);
    renderHud();
  }

  /* =========================================================
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
     adoption & boot
     ========================================================= */
  function showAdopt() {
    const a = el('adopt');
    a.hidden = false;
    portrait();
    const row = el('coatRow');
    row.innerHTML = COATS.map((c) => `<button class="coat ${c.id === G.coat ? 'on' : ''}" data-coat="${c.id}"><i style="background:${c.sw}"></i>${c.name}</button>`).join('');
    $$('.coat', row).forEach((b) => b.onclick = () => {
      G.coat = b.dataset.coat; device.dataset.coat = G.coat;
      $$('.coat', row).forEach((x) => x.classList.toggle('on', x === b));
    });
    const input = el('adoptName');
    input.placeholder = pick(NAMES);
    el('nameSugg').innerHTML = NAMES.slice(0, 6).map((n) => `<button>${n}</button>`).join('');
    $$('#nameSugg button').forEach((b) => b.onclick = () => { input.value = b.textContent; });
    el('adoptGo').onclick = () => {
      G.name = (input.value.trim() || input.placeholder).slice(0, 8);
      G.adopted = true; G.born = Date.now(); G.last = Date.now();
      save();
      a.hidden = true;
      startGame(true);
    };
  }

  function startGame(isNew) {
    ensureDay();
    const away = isNew ? 0 : offlineCatchUp();
    applyLook(); renderHairballs(); renderClockSky(); renderHud();
    setSceneNow(G.sleeping ? 'bedroom' : (SCENES[G.scene] ? G.scene : 'bedroom'));
    layoutUpper();
    setTimeout(layoutUpper, 300); setTimeout(layoutUpper, 1500);
    if (G.sleeping) { cat.x = BED.x; cat.y = BED.y; cat.state = 'sleep'; room.classList.add('lightsoff'); }
    requestAnimationFrame((t) => { lastT = t; requestAnimationFrame(frame); });
    setInterval(tick, 1000);
    setInterval(renderClockSky, 20000);
    setInterval(save, 5000);
    setInterval(ensureDay, 60000);
    setTimeout(() => {
      if (isNew) { say(`你好呀，我是${G.name}！`, 2600); setTimeout(() => toast('小提示：按住它左右拖动就是摸摸 ♥'), 2800); }
      else if (G.sleeping) say('zzz…', 1500);
      else if (away > 240) say('你终于回来啦！想你了', 2600);
      else say(pick(['欢迎回来喵～', '你来啦！']), 2000);
    }, 600);
  }

  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
  window.addEventListener('pagehide', save);

  paintIcons();
  renderClockSky();
  device.dataset.coat = G.coat;
  const msgs = ['WAKING UP KITTY...', 'LOADING WHISKERS...', 'SYNCING PURR.DLL...'];
  let mi = 0;
  const msgT = setInterval(() => { el('bootMsg').textContent = msgs[++mi % msgs.length]; }, 450);
  setTimeout(() => {
    clearInterval(msgT);
    el('boot').classList.add('gone');
    if (!G.adopted) showAdopt(); else startGame(false);
  }, 1500);
})();
