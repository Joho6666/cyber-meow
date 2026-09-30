import io
p = 'cat.js'
s = io.open(p, encoding='utf-8').read()

def R(a, b):
    global s
    assert a in s, 'MISSING: ' + a[:80]
    s = s.replace(a, b, 1)

R('''        <g clip-path="url(#mEyeClip${s})">
          <circle cx="${cx}" cy="${cy}" r="47" fill="#1A1412"/>''', '''        <g clip-path="url(#mEyeClip${s})"><g id="ball${s}">
          <circle cx="${cx}" cy="${cy}" r="47" fill="#1A1412"/>''')
R('''            <path d="M${cx - 30} ${cy + 22} Q${cx} ${cy + 44} ${cx + 32} ${cy + 20}" fill="none" stroke="#FFFFFF" stroke-width="2.5" opacity=".22" stroke-linecap="round"/>
          </g>
          <path id="lidU${s}" d="" fill="url(#mLidU)"/>''', '''            <path d="M${cx - 30} ${cy + 22} Q${cx} ${cy + 44} ${cx + 32} ${cy + 20}" fill="none" stroke="#FFFFFF" stroke-width="2.5" opacity=".22" stroke-linecap="round"/>
          </g>
        </g></g>
        <g clip-path="url(#mLidClip${s})">
          <path id="lidU${s}" d="" fill="url(#mLidU)"/>''')
R('''    <clipPath id="mEyeClipR"><circle cx="362" cy="298" r="46"/></clipPath>''', '''    <clipPath id="mEyeClipR"><circle cx="362" cy="298" r="46"/></clipPath>
    <clipPath id="mLidClipL"><circle cx="238" cy="298" r="48.5"/></clipPath>
    <clipPath id="mLidClipR"><circle cx="362" cy="298" r="48.5"/></clipPath>''')
R('''const up = cy - 52 + c * 58, low = cy + 49 - c * 40;''', '''const up = cy - 56 + c * 62, low = cy + 53 - c * 44;''')
R('''        if (rim) rim.setAttribute('opacity', f1(Math.max(0, (q - .35) / .65)));''', '''        if (rim) rim.setAttribute('opacity', f1(Math.max(0, (q - .35) / .65)));
        const ball = document.getElementById('ball' + k);
        if (ball) ball.setAttribute('opacity', f1(Math.min(1, q / .3)));''')
io.open(p, 'w', encoding='utf-8').write(s)
print('ok')
