/* =========================================================
   Scenes — kitchen, bathroom and garden art (+ bedroom tweaks).
   Room space is 400 × 480; walls extend upward for tall phones.
   Game logic lives in game.js; this file only paints and exposes
   a few render helpers (pots, butterflies).
   ========================================================= */
(() => {
  'use strict';
  const M = window.CatModel;
  const $ = (id) => document.getElementById(id);
  if (!M || !$('bg-kitchen')) return;
  const { Fur } = M;
  const svg = $('scene');
  const defs = svg.querySelector('defs');
  let R = M.rng(2027);
  const rr = (a, b) => a + R() * (b - a);
  const f1 = (n) => Math.round(n * 10) / 10;

  defs.insertAdjacentHTML('beforeend', `
    <pattern id="kTile" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#FFFFFF"/><rect x="1" y="1" width="18" height="18" rx="2.5" fill="#E2F6EE"/><rect x="3" y="3" width="6" height="3" rx="1.5" fill="#FFFFFF" opacity=".6"/></pattern>
    <pattern id="kFloor" width="44" height="44" patternUnits="userSpaceOnUse"><rect width="44" height="44" fill="#FFF7F2"/><rect width="22" height="22" fill="#FFDCE7"/><rect x="22" y="22" width="22" height="22" fill="#FFDCE7"/></pattern>
    <pattern id="mintDots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="1.6" fill="#BDE9D6"/><circle cx="19" cy="19" r="1.2" fill="#FFC9DA"/></pattern>
    <pattern id="bScale" width="26" height="13" patternUnits="userSpaceOnUse"><rect width="26" height="13" fill="#E4ECFF"/><circle cx="13" cy="13" r="13" fill="#EDF2FF" stroke="#FFFFFF" stroke-width="1.8"/><circle cx="0" cy="0" r="13" fill="#EDF2FF" stroke="#FFFFFF" stroke-width="1.8"/><circle cx="26" cy="0" r="13" fill="#EDF2FF" stroke="#FFFFFF" stroke-width="1.8"/></pattern>
    <pattern id="bFloor" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="#E9ECF7"/><rect x="1.2" y="1.2" width="25.6" height="25.6" rx="4" fill="#FAFBFF"/></pattern>
    <linearGradient id="bWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DDF4FF"/><stop offset="1" stop-color="#A8DCF6"/></linearGradient>
    <linearGradient id="bTub" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6FA"/><stop offset=".6" stop-color="#FFE0EB"/><stop offset="1" stop-color="#F7C3D6"/></linearGradient>
    <linearGradient id="gGround" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9F4D2"/><stop offset="1" stop-color="#BFE8BA"/></linearGradient>
    <linearGradient id="gSkyDay" x1="0" y1="0" x2="0" y2="1"><stop offset=".3" stop-color="#A9DBFF"/><stop offset="1" stop-color="#FFEAF3"/></linearGradient>
    <linearGradient id="gSkyNight" x1="0" y1="0" x2="0" y2="1"><stop offset=".3" stop-color="#26235A"/><stop offset="1" stop-color="#7A5EA8"/></linearGradient>
    <linearGradient id="potGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F7B6A5"/><stop offset=".45" stop-color="#FFD2C4"/><stop offset="1" stop-color="#EE9E8B"/></linearGradient>
    <radialGradient id="ovenHot" cx=".5" cy=".6" r=".7"><stop offset="0" stop-color="#FFE9A8"/><stop offset=".6" stop-color="#FFB36B"/><stop offset="1" stop-color="#FF8A6B"/></radialGradient>
    <radialGradient id="glowDot"><stop offset="0" stop-color="#FFF7B0" stop-opacity="1"/><stop offset="1" stop-color="#FFF7B0" stop-opacity="0"/></radialGradient>
    <clipPath id="kWinClip"><circle cx="200" cy="76" r="40"/></clipPath>`);

  /* ---------------- kitchen ---------------- */
  (function kitchen() {
    let doors = '';
    for (let x = -80; x < 480; x += 72) {
      if (x + 64 > 270 && x < 374) continue; // oven slot
      doors += `<rect x="${x + 5}" y="258" width="62" height="72" rx="8" fill="none" stroke="#FFFFFF" stroke-width="2.2" opacity=".9"/><circle cx="${x + 36}" cy="270" r="3.4" fill="#FFB3CD"/>`;
    }
    $('bg-kitchen').innerHTML = `
      <rect x="-600" y="-900" width="1600" height="1240" fill="#F3FBF8"/>
      <rect x="-600" y="-900" width="1600" height="1026" fill="url(#mintDots)"/>
      <g data-upper="kitchen" style="display:none">
        <path d="M70 -46 H330" stroke="#F4C9DA" stroke-width="4" stroke-linecap="round"/>
        <g stroke="#D8C7E8" stroke-width="1.6"><path d="M104 -46 v10"/><path d="M160 -46 v10"/><path d="M232 -46 v10"/><path d="M296 -46 v10"/></g>
        <circle cx="104" cy="-22" r="14" fill="#FFD1E0"/><rect x="100" y="-37" width="8" height="6" rx="2" fill="#FFB3CD"/>
        <path d="M160 -36 v26 m-6 0 q6 14 12 0 z" fill="#E2F6EE" stroke="#BFE3D2" stroke-width="2"/>
        <path d="M232 -36 v14 m-8 0 h16 v6 a8 8 0 0 1 -16 0 z" fill="#FFE9A8" stroke="#F3D07A" stroke-width="1.6"/>
        <path d="M296 -36 v8 m-10 0 q10 30 20 0" fill="none" stroke="#C8B6FF" stroke-width="2.4"/>
      </g>
      <!-- round window -->
      <g clip-path="url(#kWinClip)">
        <rect class="sky-d" x="150" y="30" width="100" height="100" fill="url(#gSkyDay)"/>
        <rect class="sky-n" x="150" y="30" width="100" height="100" fill="url(#gSkyNight)"/>
        <circle class="sky-d" cx="222" cy="58" r="10" fill="#FFE58F"/>
        <path class="sky-n" d="M222 50 a10 10 0 1 0 8 16 a8 8 0 1 1 -8 -16z" fill="#FFF3C9"/>
        <g class="sky-d cloud" fill="#fff"><ellipse cx="182" cy="94" rx="16" ry="7"/><ellipse cx="192" cy="89" rx="10" ry="7"/></g>
        <path d="M150 112 q25 -12 50 0 t50 0 v30 h-100 z" fill="#BDE8C8" opacity=".9"/>
      </g>
      <circle cx="200" cy="76" r="40" fill="none" stroke="#FFFFFF" stroke-width="7"/>
      <path d="M200 38 V114 M162 76 H238" stroke="#FFFFFF" stroke-width="3.4"/>
      <!-- upper cabinets -->
      ${[[18, 30], [264, 30]].map(([x, y]) => `
        <rect x="${x + 2}" y="${y + 4}" width="118" height="80" rx="12" fill="#E9B3C8" opacity=".35"/>
        <rect x="${x}" y="${y}" width="118" height="80" rx="12" fill="#FFD6E4"/>
        <rect x="${x + 7}" y="${y + 7}" width="49" height="66" rx="8" fill="none" stroke="#FFFFFF" stroke-width="2.2"/>
        <rect x="${x + 62}" y="${y + 7}" width="49" height="66" rx="8" fill="none" stroke="#FFFFFF" stroke-width="2.2"/>
        <circle cx="${x + 52}" cy="${y + 58}" r="3.4" fill="#FFFFFF"/><circle cx="${x + 66}" cy="${y + 58}" r="3.4" fill="#FFFFFF"/>`).join('')}
      <!-- backsplash + counter + lower cabinets -->
      <rect x="-600" y="118" width="1600" height="122" fill="url(#kTile)" opacity=".95"/>
      <rect x="-600" y="118" width="1600" height="6" fill="#CFEBDF" opacity=".6"/>
      <!-- counter props -->
      <g>
        <rect x="42" y="204" width="58" height="34" rx="12" fill="#BFEBDA"/>
        <rect x="52" y="196" width="14" height="12" rx="3" fill="#F5D3A6"/><rect x="72" y="198" width="14" height="10" rx="3" fill="#F5D3A6"/>
        <rect x="42" y="204" width="58" height="8" rx="4" fill="#A7E0CB"/>
        <circle cx="90" cy="224" r="3" fill="#FF9EC4"/><rect x="50" y="222" width="24" height="4" rx="2" fill="#FFFFFF" opacity=".7"/>
        <path d="M122 238 q-4 -26 16 -30 q20 4 16 30 z" fill="#FFFFFF" stroke="#E7D6EA" stroke-width="1.6"/>
        <path d="M130 206 q8 -8 16 0" fill="#FFB3CD"/><path d="M154 216 q10 2 8 14" fill="none" stroke="#E7D6EA" stroke-width="3" stroke-linecap="round"/>
        ${[[292, '#FFE9A8', '#E7B35A'], [318, '#FFD6E4', '#F28DB4'], [344, '#E2F6EE', '#8FD3B6']].map(([x, c, d]) => `
          <rect x="${x}" y="206" width="22" height="32" rx="6" fill="${c}" opacity=".85" stroke="#FFFFFF" stroke-width="1.6"/>
          <rect x="${x - 1}" y="200" width="24" height="8" rx="3" fill="${d}"/>
          <circle cx="${x + 8}" cy="224" r="3.6" fill="${d}" opacity=".7"/><circle cx="${x + 15}" cy="229" r="3" fill="${d}" opacity=".6"/>`).join('')}
      </g>
      <rect x="-600" y="236" width="1600" height="16" rx="6" fill="#FFFFFF"/>
      <rect x="-600" y="250" width="1600" height="4" fill="#E9CFDC" opacity=".6"/>
      <rect x="-600" y="252" width="1600" height="86" fill="#FFD9E6"/>
      ${doors}
      <!-- oven -->
      <g id="oven" class="tappable">
        <rect x="270" y="252" width="104" height="86" fill="#FFFFFF"/>
        <rect x="270" y="252" width="104" height="16" fill="#F7EEF7"/>
        <circle cx="286" cy="260" r="4" fill="#FFB3CD"/><circle cx="300" cy="260" r="4" fill="#C8B6FF"/><circle cx="314" cy="260" r="4" fill="#9EF0E1"/>
        <rect x="334" y="256" width="30" height="8" rx="2" fill="#2E2552"/><text x="349" y="263" text-anchor="middle" font-family="Silkscreen, monospace" font-size="6" fill="#9EF0E1" id="ovenText">READY</text>
        <rect x="282" y="276" width="80" height="50" rx="9" fill="#3B2F4F"/>
        <rect id="ovenGlow" x="282" y="276" width="80" height="50" rx="9" fill="url(#ovenHot)"/>
        <path d="M288 282 L300 282" stroke="#FFFFFF" stroke-width="2" opacity=".35" stroke-linecap="round"/>
        <rect x="292" y="270" width="60" height="4" rx="2" fill="#E7D6EA"/>
      </g>
      <!-- floor -->
      <rect x="-600" y="337" width="1600" height="400" fill="url(#kFloor)"/>
      <rect x="-600" y="337" width="1600" height="30" fill="url(#floorShade)"/>
      <!-- striped kitchen mat -->
      <g>
        <rect x="116" y="438" width="170" height="30" rx="15" fill="#BFEBDA"/>
        ${[0, 1, 2, 3, 4].map((i) => `<rect x="${130 + i * 30}" y="438" width="14" height="30" fill="#FFFFFF" opacity=".75"/>`).join('')}
        <rect x="116" y="438" width="170" height="30" rx="15" fill="none" stroke="#A7E0CB" stroke-width="2"/>
      </g>`;
  })();

  /* ---------------- bathroom ---------------- */
  (function bathroom() {
    $('bg-bath').innerHTML = `
      <rect x="-600" y="-900" width="1600" height="1240" fill="#F2F5FF"/>
      <g data-upper="bath" style="display:none">
        <path d="M300 -700 V-70" stroke="#DCD2EE" stroke-width="1.5"/>
        <path d="M284 -72 h32 l-5 20 h-22 z" fill="#FFFFFF" stroke="#E6DAF2" stroke-width="1.6"/>
        <g fill="#A8DDB5"><ellipse cx="290" cy="-46" rx="5" ry="10" transform="rotate(-20 290 -46)"/><ellipse cx="300" cy="-40" rx="5" ry="12"/><ellipse cx="310" cy="-46" rx="5" ry="10" transform="rotate(20 310 -46)"/><ellipse cx="296" cy="-28" rx="4" ry="9" transform="rotate(-10 296 -28)"/></g>
        ${[[80, -40, 10], [120, -80, 6], [150, -20, 8], [60, -110, 5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF" stroke="#CFE6FA" stroke-width="1.6"/><circle cx="${x - r * .35}" cy="${y - r * .35}" r="${r * .25}" fill="#fff"/>`).join('')}
      </g>
      <rect x="-600" y="190" width="1600" height="150" fill="url(#bScale)"/>
      <rect x="-600" y="184" width="1600" height="8" rx="4" fill="#FFFFFF"/>
      <!-- mirror -->
      <ellipse cx="306" cy="108" rx="46" ry="58" fill="#C9D9F5" opacity=".5" transform="translate(2 4)"/>
      <ellipse cx="304" cy="104" rx="44" ry="56" fill="#E7F1FF" stroke="url(#holo)" stroke-width="6"/>
      <path d="M278 88 L306 62 M282 110 L318 76" stroke="#FFFFFF" stroke-width="5" opacity=".7" stroke-linecap="round"/>
      <!-- shelf with duck & bottles -->
      <rect x="36" y="118" width="118" height="7" rx="3.5" fill="#FFFFFF"/>
      <rect x="44" y="92" width="16" height="26" rx="5" fill="#FFC9DA"/><rect x="48" y="86" width="8" height="7" rx="2" fill="#F29BB3"/>
      <rect x="64" y="98" width="14" height="20" rx="5" fill="#BFEBDA"/><rect x="67" y="93" width="8" height="6" rx="2" fill="#8FD3B6"/>
      <g transform="translate(118 104)">
        <ellipse cx="0" cy="6" rx="15" ry="9" fill="#FFE27A"/><circle cx="-7" cy="-4" r="8" fill="#FFE27A"/>
        <path d="M-15 -4 l-6 2 l6 3 z" fill="#FF9E5E"/><circle cx="-9" cy="-6" r="1.4" fill="#3A2A2A"/>
        <path d="M4 2 q6 -6 10 2" fill="none" stroke="#F3C94A" stroke-width="2"/>
      </g>
      <!-- towel -->
      <rect x="30" y="150" width="84" height="5" rx="2.5" fill="#E6DAF2"/>
      <path d="M40 153 h64 v70 q-32 8 -64 0 z" fill="#FFD6E4"/>
      <path d="M40 200 h64 M40 208 h64" stroke="#FFFFFF" stroke-width="3" opacity=".9"/>
      <!-- floor -->
      <rect x="-600" y="337" width="1600" height="400" fill="url(#bFloor)"/>
      <rect x="-600" y="337" width="1600" height="26" fill="url(#floorShade)"/>
      <!-- tub back rim + water -->
      <ellipse cx="200" cy="398" rx="152" ry="26" fill="#FFFFFF"/>
      <ellipse cx="200" cy="401" rx="138" ry="17" fill="url(#bWater)"/>
      <path d="M44 360 q0 -16 14 -16 h10" fill="none" stroke="#D4C7EA" stroke-width="6" stroke-linecap="round"/>
      <circle cx="70" cy="344" r="5" fill="#C8B6FF"/>`;
    // tub front (drawn over the cat) + stool with the grooming brush
    let foam = '';
    R = M.rng(66);
    for (let i = 0; i < 22; i++) {
      const t = i / 21, x = 58 + t * 284, y = 398 + Math.sin(t * Math.PI) * 17 + rr(-4, 2), r = rr(6, 12);
      foam += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#FFFFFF" stroke="#D6ECFA" stroke-width="1.4"/><circle cx="${f1(x - r * .35)}" cy="${f1(y - r * .35)}" r="${f1(r * .22)}" fill="#EAF6FF"/>`;
    }
    $('fg-bath').innerHTML = `
      <path d="M46 398 C 46 470, 92 486, 200 486 C 308 486, 354 470, 354 398 Q 200 436 46 398 Z" fill="url(#bTub)"/>
      <path d="M46 398 Q 200 436 354 398" fill="none" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round"/>
      <path d="M70 420 Q 90 460 140 470" fill="none" stroke="#FFFFFF" stroke-width="5" opacity=".7" stroke-linecap="round"/>
      <g id="tubFoam">${foam}</g>
      <circle cx="84" cy="484" r="8" fill="#F3D07A"/><circle cx="316" cy="484" r="8" fill="#F3D07A"/>
      <g id="brushTool" class="tappable">
        <rect x="356" y="428" width="40" height="10" rx="5" fill="#FFFFFF" stroke="#E6DAF2" stroke-width="1.6"/>
        <path d="M362 438 v34 M390 438 v34" stroke="#E6DAF2" stroke-width="4" stroke-linecap="round"/>
        <rect x="352" y="412" width="44" height="12" rx="6" fill="#C8B6FF"/>
        <rect x="358" y="406" width="32" height="8" rx="3" fill="#FFFFFF"/>
        <path d="M360 406 v-5 M365 406 v-5 M370 406 v-5 M375 406 v-5 M380 406 v-5 M385 406 v-5" stroke="#E6DAF2" stroke-width="1.6" stroke-linecap="round"/>
        <circle cx="386" cy="418" r="2.2" fill="#fff"/>
      </g>`;
  })();

  /* ---------------- garden ---------------- */
  (function garden() {
    R = M.rng(909);
    const grass = new Fur(), grass2 = new Fur();
    for (let x = -60; x < 460; x += 3.2) {
      grass.add('#A9DDA5', .95, x + rr(-1, 1), 340 + rr(-1, 2), -Math.PI / 2 + rr(-.35, .35), rr(6, 13), rr(1.4, 2.2), rr(-.2, .2));
      if (R() < .5) grass2.add('#C9EFC2', .95, x + rr(-1, 1), 342, -Math.PI / 2 + rr(-.3, .3), rr(4, 9), rr(1.2, 1.8), rr(-.2, .2));
    }
    // tufts scattered on the lawn
    for (let i = 0; i < 70; i++) {
      const x = rr(-40, 440), y = rr(352, 480);
      if (Math.abs(x - 200) < 90 && y > 420) continue;
      for (let k = 0; k < 3; k++) grass.add('#B3E2AE', .9, x + rr(-3, 3), y, -Math.PI / 2 + rr(-.5, .5), rr(4, 8), rr(1.2, 1.8), rr(-.2, .2));
    }
    let flowers = '';
    const cols = ['#FFB3CD', '#FFFFFF', '#FFE08A', '#C8B6FF'];
    for (let i = 0; i < 22; i++) {
      const x = rr(-30, 430), y = rr(356, 478);
      if (Math.abs(x - 200) < 100 && y > 410) continue;
      const c = cols[i % 4], r = rr(2.2, 3.6);
      flowers += `<g transform="translate(${f1(x)} ${f1(y)})">${[0, 72, 144, 216, 288].map((a) => `<circle cx="${f1(Math.cos(a * Math.PI / 180) * r)}" cy="${f1(Math.sin(a * Math.PI / 180) * r)}" r="${f1(r * .75)}" fill="${c}"/>`).join('')}<circle r="${f1(r * .55)}" fill="#FFD35C"/></g>`;
    }
    let pickets = '';
    for (let x = -120; x < 520; x += 22) pickets += `<path d="M${x} 346 V296 l7 -9 l7 9 V346 z" fill="#FFFFFF" stroke="#EBDDEB" stroke-width="1.2"/>`;
    let stars = '';
    for (let i = 0; i < 26; i++) stars += `<circle cx="${f1(rr(-40, 440))}" cy="${f1(rr(-300, 240))}" r="${f1(rr(.8, 1.8))}" fill="#FFFFFF"/>`;
    let flies = '';
    for (let i = 0; i < 9; i++) flies += `<circle cx="${f1(rr(20, 380))}" cy="${f1(rr(260, 420))}" r="7" fill="url(#glowDot)" style="animation-delay:${f1(-rr(0, 4))}s"/>`;
    $('bg-garden').innerHTML = `
      <rect class="sky-d" x="-600" y="-900" width="1600" height="1240" fill="url(#gSkyDay)"/>
      <rect class="sky-n" x="-600" y="-900" width="1600" height="1240" fill="url(#gSkyNight)"/>
      <g class="sky-n twinkle">${stars}</g>
      <g class="sky-d"><circle cx="330" cy="96" r="30" fill="#FFE58F" opacity=".3"/><circle cx="330" cy="96" r="20" fill="#FFE58F"/></g>
      <path class="sky-n" d="M332 80 a18 18 0 1 0 14 30 a15 15 0 1 1 -14 -30z" fill="#FFF3C9"/>
      <g class="sky-d cloud" fill="#FFFFFF" opacity=".95"><ellipse cx="120" cy="80" rx="30" ry="12"/><ellipse cx="138" cy="72" rx="20" ry="13"/><ellipse cx="100" cy="84" rx="18" ry="9"/></g>
      <g class="sky-d cloud c2" fill="#FFFFFF" opacity=".85"><ellipse cx="250" cy="150" rx="24" ry="9"/><ellipse cx="264" cy="143" rx="15" ry="10"/></g>
      <!-- tiny pastel city on the horizon -->
      <g opacity=".55">${[[150, 270, 14], [166, 258, 10], [178, 276, 16], [196, 262, 9], [207, 280, 14]].map(([x, y, w]) => `<rect class="bld" x="${x}" y="${y}" width="${w}" height="${320 - y}" rx="2"/>`).join('')}</g>
      <ellipse cx="80" cy="348" rx="240" ry="62" fill="#CDEFD3"/>
      <ellipse cx="340" cy="352" rx="260" ry="72" fill="#BFE8C8"/>
      <!-- blossom tree -->
      <g>
        <path d="M44 344 C 48 300, 40 262, 52 226 L 64 228 C 58 262, 66 300, 62 344 Z" fill="#D9B08C"/>
        <path d="M54 262 q-18 -8 -26 -26 M58 250 q16 -10 22 -28" stroke="#D9B08C" stroke-width="6" fill="none" stroke-linecap="round"/>
        <circle cx="36" cy="200" r="46" fill="#B9E6BF"/><circle cx="82" cy="206" r="40" fill="#A8DDB5"/><circle cx="58" cy="168" r="42" fill="#C4ECC7"/><circle cx="10" cy="226" r="30" fill="#A8DDB5"/>
        ${Array.from({ length: 22 }, () => `<circle cx="${f1(rr(0, 118))}" cy="${f1(rr(140, 238))}" r="${f1(rr(2.2, 4))}" fill="${R() < .6 ? '#FFC2D6' : '#FFFFFF'}"/>`).join('')}
      </g>
      <g>${pickets}</g>
      <rect x="-600" y="302" width="1600" height="7" rx="3" fill="#FFFFFF"/>
      <rect x="-600" y="324" width="1600" height="7" rx="3" fill="#FFFFFF"/>
      <rect x="-600" y="340" width="1600" height="400" fill="url(#gGround)"/>
      ${grass2.svg()}${grass.svg()}
      ${flowers}
      <ellipse cx="200" cy="462" rx="120" ry="16" fill="#A6D9A0" opacity=".5"/>
      <g id="pot2" class="tappable pot" data-pot="2" transform="translate(378 374) scale(.86)"></g>
      <g class="sky-n fireflies">${flies}</g>`;
    $('fg-garden').innerHTML = `
      <g id="pot0" class="tappable pot" data-pot="0" transform="translate(46 462)"></g>
      <g id="pot1" class="tappable pot" data-pot="1" transform="translate(354 462)"></g>
      <g id="butterflies"></g>`;
  })();

  /* ---------------- bedroom: toy basket where the bowl used to be ---------------- */
  (function bedroomToys() {
    $('fg-bedroom').insertAdjacentHTML('beforeend', `
      <g id="toyBasket">
        <ellipse cx="62" cy="470" rx="42" ry="7" fill="#9B6280" opacity=".2" filter="url(#aBlur4)"/>
        <circle cx="48" cy="436" r="14" fill="#FFB3D1"/><path d="M36 430 q12 -8 24 4 M38 442 q10 -10 22 0" fill="none" stroke="#FF8FBC" stroke-width="1.8"/>
        <circle cx="74" cy="440" r="12" fill="#C8B6FF"/><path d="M64 436 q10 -6 20 4 M66 446 q8 -8 16 0" fill="none" stroke="#A68CFF" stroke-width="1.6"/>
        <path d="M84 446 q14 10 8 22" fill="none" stroke="#A68CFF" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M26 446 h72 l-7 22 q-29 6 -58 0 z" fill="#E7C49A"/>
        <path d="M30 452 h64 M32 459 h60" stroke="#CFA273" stroke-width="2"/>
        <path d="M26 446 h72" stroke="#F3D9B8" stroke-width="4" stroke-linecap="round"/>
      </g>`);
  })();

  // the food bowl now lives in the kitchen
  if ($('bowl')) $('fg-kitchen').appendChild($('bowl'));

  /* =========================================================
     render helpers used by game.js
     ========================================================= */
  const SEEDS = {
    berry: { leaf: '#8FD37C', fruit: '#F0566A' },
    catnip: { leaf: '#9FDBAE', fruit: '#C8B6FF' },
    carrot: { leaf: '#7CC655', fruit: '#FF9150' },
  };
  function plantArt(seed, p) {
    const s = SEEDS[seed];
    if (p < .34) {
      return `<path d="M0 -20 v-8" stroke="${s.leaf}" stroke-width="2"/><ellipse cx="-4" cy="-29" rx="4" ry="2.4" fill="${s.leaf}" transform="rotate(-25 -4 -29)"/><ellipse cx="4" cy="-30" rx="4" ry="2.4" fill="${s.leaf}" transform="rotate(25 4 -30)"/>`;
    }
    const big = p >= 1;
    let out = `<g fill="${s.leaf}">
      <path d="M0 -20 v-${big ? 22 : 16}" stroke="${s.leaf}" stroke-width="2.4"/>
      <ellipse cx="-9" cy="-${big ? 34 : 30}" rx="9" ry="5" transform="rotate(-30 -9 -${big ? 34 : 30})"/>
      <ellipse cx="9" cy="-${big ? 36 : 31}" rx="9" ry="5" transform="rotate(30 9 -${big ? 36 : 31})"/>
      <ellipse cx="-6" cy="-${big ? 44 : 38}" rx="7" ry="4" transform="rotate(-50 -6 -${big ? 44 : 38})"/>
      <ellipse cx="6" cy="-${big ? 46 : 39}" rx="7" ry="4" transform="rotate(50 6 -${big ? 46 : 39})"/>
    </g>`;
    if (big) {
      if (seed === 'berry') out += [[-10, -28], [9, -26], [0, -38]].map(([x, y]) => `<path d="M${x - 4} ${y} q4 -3 8 0 q0 6 -4 9 q-4 -3 -4 -9z" fill="${s.fruit}"/><circle cx="${x - 1}" cy="${y + 2}" r=".7" fill="#FFE9E0"/>`).join('');
      if (seed === 'catnip') out += [[-8, -50], [8, -52], [0, -56], [-12, -40], [12, -42]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="${s.fruit}"/>`).join('');
      if (seed === 'carrot') out += `<path d="M-7 -21 l7 16 l7 -16 z" fill="${s.fruit}"/><path d="M-4 -16 h5 M-2 -11 h4" stroke="#E0702F" stroke-width="1"/>`;
      out += `<g class="ripe-spark"><path d="M16 -52 l1.6 3.6 3.6 1.6 -3.6 1.6 -1.6 3.6 -1.6 -3.6 -3.6 -1.6 3.6 -1.6z" fill="#FFE08A"/></g>`;
    }
    return out;
  }
  function potArt(pot, now, grow) {
    let plant = '', badge = '';
    if (!pot) {
      badge = `<g class="pot-hint"><circle cx="0" cy="-40" r="11" fill="#FFFFFF" stroke="#FFB3CD" stroke-width="2" stroke-dasharray="3 3"/><path d="M0 -45 v10 M-5 -40 h10" stroke="#FF83B6" stroke-width="2.4" stroke-linecap="round"/></g>`;
    } else {
      const p = grow(pot, now);
      plant = plantArt(pot.seed, p);
      if (p < 1) {
        badge = `<g transform="translate(0 -62)"><rect x="-18" y="-4" width="36" height="8" rx="4" fill="#FFFFFF" opacity=".9"/><rect x="-16" y="-2" width="${f1(32 * p)}" height="4" rx="2" fill="#7FE3C9"/></g>`;
        if (!pot.watered) badge += `<g class="pot-hint" transform="translate(20 -50)"><path d="M0 -8 c5 7 7 10 7 13 a7 7 0 0 1 -14 0 c0 -3 2 -6 7 -13z" fill="#6FC7F0" stroke="#fff" stroke-width="1.5"/></g>`;
      }
    }
    return `
      <ellipse cx="0" cy="16" rx="26" ry="5" fill="#6B4A5A" opacity=".2"/>
      ${plant}
      <path d="M-22 -16 h44 l-5 30 q-17 5 -34 0 z" fill="url(#potGrad)"/>
      <rect x="-26" y="-22" width="52" height="10" rx="5" fill="#FFC4B3"/>
      <ellipse cx="0" cy="-20" rx="21" ry="3.6" fill="#8C6B5A"/>
      <path d="M-14 -4 q14 6 28 0" fill="none" stroke="#FFFFFF" stroke-width="2" opacity=".5" stroke-linecap="round"/>
      ${badge}`;
  }
  function butterflyArt(c1, c2) {
    return `<g class="bf-wings">
      <path d="M0 0 C -14 -16, -24 -6, -14 4 C -20 12, -8 16, 0 4 Z" fill="${c1}"/>
      <path d="M0 0 C 14 -16, 24 -6, 14 4 C 20 12, 8 16, 0 4 Z" fill="${c1}"/>
      <path d="M-4 -2 C -10 -10, -16 -4, -10 1 M4 -2 C 10 -10, 16 -4, 10 1" fill="${c2}"/>
    </g><path d="M0 -6 v12" stroke="#5A4462" stroke-width="2" stroke-linecap="round"/><path d="M0 -6 l-3 -5 M0 -6 l3 -5" stroke="#5A4462" stroke-width="1"/>`;
  }
  window.Scenes = { potArt, butterflyArt, SEEDS };
})();
