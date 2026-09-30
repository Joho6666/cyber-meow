  /* =========================================================
     background polish: panelling, city view, clock, neon,
     floor grain, paw-print rug, placemat, dust motes, bokeh
     ========================================================= */
  defs.insertAdjacentHTML('beforeend', `
    <linearGradient id="aWain" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F9E9F6"/><stop offset="1" stop-color="#F0DCF0"/></linearGradient>
    <radialGradient id="aClock" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#FDEFF6"/></radialGradient>
    <filter id="aNeon" x="-40%" y="-80%" width="180%" height="260%"><feGaussianBlur stdDeviation="3.2"/></filter>
    <filter id="aBokeh" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="10"/></filter>`);

  // lower-wall wainscot + chair rail, and warm daylight spilling from the window
  const dotsRect = svg.querySelector('rect[fill="url(#wallDots)"]');
  if (dotsRect) {
    let panels = '';
    for (let x = -80; x < 480; x += 88) {
      panels += `<rect x="${x + 9}" y="252" width="70" height="62" rx="9" fill="none" stroke="#D9C2DE" stroke-width="2" opacity=".55" transform="translate(1.4 1.6)"/>
        <rect x="${x + 9}" y="252" width="70" height="62" rx="9" fill="none" stroke="#FFFFFF" stroke-width="2" opacity=".85"/>`;
    }
    dotsRect.insertAdjacentHTML('afterend', `
      <ellipse class="daylight" cx="104" cy="170" rx="200" ry="160" fill="#FFF3DC" opacity=".42" filter="url(#aBokeh)"/>
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
      <text x="334" y="206" text-anchor="middle" font-family="Silkscreen, monospace" font-weight="700" font-size="19" letter-spacing="1.5" fill="none" stroke="#FF6FAE" stroke-width="2.2" stroke-linejoin="round">MEOW</text>
      <text x="334" y="206" text-anchor="middle" font-family="Silkscreen, monospace" font-weight="700" font-size="19" letter-spacing="1.5" fill="none" stroke="#FFE3F0" stroke-width=".8">MEOW</text>
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
        <circle cx="-8" cy="498" r="44" fill="#FFB3D1" opacity=".28" filter="url(#aBokeh)"/>
        <circle cx="30" cy="512" r="22" fill="#C8B6FF" opacity=".25" filter="url(#aBokeh)"/>
        <circle cx="412" cy="494" r="38" fill="#C8B6FF" opacity=".24" filter="url(#aBokeh)"/>
      </g>`);
    // neon keeps glowing above the night overlay
    vignetteAnchor.insertAdjacentHTML('afterend', `<g id="neonNight" pointer-events="none"><g filter="url(#aNeon)">${neon}</g>${neon}</g>`);
  }

