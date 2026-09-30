import io
p = 'cat.js'
s = io.open(p, encoding='utf-8').read()

def R(a, b):
    global s
    assert a in s, 'MISSING: ' + a[:80]
    s = s.replace(a, b, 1)

R('''            <ellipse cx="264" cy="604" rx="34" ry="50" style="fill:var(--f-belly)"/>
            <ellipse cx="336" cy="604" rx="34" ry="50" style="fill:var(--f-belly)"/>''', '''            ${legArt(264, -1)}${legArt(336, 1)}''')
R('''            ${legFur()}
''', '')
R('''  function pawArt(cx) {''', '''  function legArt(cx, side) {
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

  function pawArt(cx) {''')
R('''    <linearGradient id="mNose"''', '''    <linearGradient id="mLegL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--f-body1)"/><stop offset=".45" style="stop-color:var(--f-light)"/><stop offset="1" style="stop-color:var(--f-belly)"/></linearGradient>
    <linearGradient id="mLegR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:var(--f-belly)"/><stop offset=".55" style="stop-color:var(--f-light)"/><stop offset="1" style="stop-color:var(--f-body1)"/></linearGradient>
    <linearGradient id="mNose"''')
R('''  window.CatModel = api;''', '''  api.Fur = Fur;
  api.rng = mulberry;
  api.smooth = smoothClosed;
  window.CatModel = api;''')
io.open(p, 'w', encoding='utf-8').write(s)
print('ok')
