import io
p = 'cat.js'
s = io.open(p, encoding='utf-8').read()

def R(a, b):
    global s
    assert a in s, 'MISSING: ' + a[:80]
    s = s.replace(a, b, 1)

R('''        <circle cx="${cx}" cy="${cy}" r="55" fill="#7B5A68" opacity=".16" filter="url(#mBlur5)"/>
        <circle cx="${cx}" cy="${cy}" r="48.5" fill="none" style="stroke:var(--f-stripe)" stroke-opacity=".38" stroke-width="3" filter="url(#mBlur2)"/>
        ${wing}''', '''        <g id="rim${s}">
          <circle cx="${cx}" cy="${cy}" r="55" fill="#7B5A68" opacity=".16" filter="url(#mBlur5)"/>
          <circle cx="${cx}" cy="${cy}" r="48.5" fill="none" style="stroke:var(--f-stripe)" stroke-opacity=".38" stroke-width="3" filter="url(#mBlur2)"/>
        </g>
        ${wing}''')
# lids blend into the face: soft fur colour with a slightly darker crease at the lash line
R('''<linearGradient id="mLidU" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox"><stop offset="0" style="stop-color:var(--f-mid)"/><stop offset=".75" style="stop-color:var(--f-mid)"/><stop offset="1" style="stop-color:var(--f-top)"/></linearGradient>''',
  '''<linearGradient id="mLidU" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--f-soft)"/><stop offset=".78" style="stop-color:var(--f-soft)"/><stop offset="1" style="stop-color:var(--f-mid)"/></linearGradient>''')
R('''<linearGradient id="mLidD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--f-top)"/><stop offset=".3" style="stop-color:var(--f-mid)"/><stop offset="1" style="stop-color:var(--f-soft)"/></linearGradient>''',
  '''<linearGradient id="mLidD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--f-mid)"/><stop offset=".25" style="stop-color:var(--f-soft)"/><stop offset="1" style="stop-color:var(--f-light)"/></linearGradient>''')
# fade the eye rim with the lid so a closed eye never looks like goggles
R('''        document.getElementById('lash' + k).setAttribute('d', q > .97 ? '' : `M${cx - 50} ${f1(up)}Q${cx} ${f1(up + sag)} ${cx + 50} ${f1(up)}`);''',
  '''        document.getElementById('lash' + k).setAttribute('d', q > .97 ? '' : `M${cx - 50} ${f1(up)}Q${cx} ${f1(up + sag)} ${cx + 50} ${f1(up)}`);
        const rim = document.getElementById('rim' + k);
        if (rim) rim.setAttribute('opacity', f1(.25 + q * .75));''')
io.open(p, 'w', encoding='utf-8').write(s)
print('ok')
