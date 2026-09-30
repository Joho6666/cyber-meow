import io
def edit(p, pairs):
    s = io.open(p, encoding='utf-8').read()
    for a, b in pairs:
        assert a in s, (p, a[:80])
        s = s.replace(a, b, 1)
    io.open(p, 'w', encoding='utf-8').write(s)

NAV = '''
      <nav class="scene-nav" id="sceneNav" aria-label="切换场景">
        <button data-go="bedroom" class="on" aria-label="卧室"><svg viewBox="0 0 24 24"><path d="M3 18v-6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6M3 15h18M6 9V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><b>卧室</b></button>
        <button data-go="kitchen" aria-label="厨房"><svg viewBox="0 0 24 24"><circle cx="10" cy="13" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 13h6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M8 6c0-2 2-2 2-4M11 6c0-2 2-2 2-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg><b>厨房</b></button>
        <button data-go="bath" aria-label="浴室"><svg viewBox="0 0 24 24"><path d="M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5zM6 12V6a2 2 0 0 1 4 0M7 21l1-2M17 21l-1-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><b>浴室</b></button>
        <button data-go="garden" aria-label="花园"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="2.4" fill="currentColor"/><path d="M12 3.5a2.6 2.6 0 0 1 0 5.2 2.6 2.6 0 0 1 0-5.2M7.5 8a2.6 2.6 0 0 1 4.5 0M16.5 8a2.6 2.6 0 0 0-4.5 0M12 11v9M12 17c-3 0-5-2-5-4 3 0 5 2 5 4M12 15c2.4 0 4-1.6 4-3.4-2.4 0-4 1.6-4 3.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><b>花园</b></button>
      </nav>'''

edit('index.html', [
    ('        <!-- ===== room ===== -->\n', '        <!-- ===== room ===== -->\n        <g id="bg-bedroom" class="scene-layer" data-scene="bedroom">\n'),
    ('        <g id="hairballs"></g>', '''        </g>
        <g id="bg-kitchen" class="scene-layer" data-scene="kitchen" style="display:none"></g>
        <g id="bg-bath" class="scene-layer" data-scene="bath" style="display:none"></g>
        <g id="bg-garden" class="scene-layer" data-scene="garden" style="display:none"></g>

        <g id="hairballs"></g>'''),
    ('        <g id="bedFront">', '        <g id="fg-bedroom" class="scene-layer" data-scene="bedroom">\n        <g id="bedFront">'),
    ('        <rect id="dusk"', '''        </g>
        <g id="fg-kitchen" class="scene-layer" data-scene="kitchen" style="display:none"></g>
        <g id="fg-bath" class="scene-layer" data-scene="bath" style="display:none"></g>
        <g id="fg-garden" class="scene-layer" data-scene="garden" style="display:none"></g>

        <rect id="dusk"'''),
    ('      <!-- room overlays -->', '      <!-- room overlays -->' + NAV),
    ('<div class="room" id="room">', '<div class="room" id="room" data-scene="bedroom">'),
    ('<script src="art.js"></script>\n', '<script src="art.js"></script>\n<script src="scenes.js"></script>\n'),
])

# sunbeam belongs to the bedroom only
edit('art.js', [
    ("    ($('hairballs') || win).insertAdjacentHTML($('hairballs') ? 'beforebegin' : 'afterend', `", "    ($('bg-bedroom') || win).insertAdjacentHTML($('bg-bedroom') ? 'beforeend' : 'afterend', `"),
])
edit('sw.js', [("'./art.js', ", "'./art.js', './scenes.js', "), ("cybermeow-v7", "cybermeow-v8")])
print('ok')
