import json

with open('ref.html', 'r', encoding='utf-8') as f:
    content = f.read()

calc_marker = 'window.__BG_CALC__ = '
start_calc = content.find(calc_marker) + len(calc_marker)

# Use json.JSONDecoder to decode just the string literal
dec = json.JSONDecoder()
calc_html, calc_end = dec.raw_decode(content[start_calc:])
with open('scratch/calc_inner.html', 'w', encoding='utf-8') as f:
    f.write(calc_html)
print('calc_inner.html decoded! length:', len(calc_html))

design_marker = 'window.__BG_DESIGN__ = '
start_design = content.find(design_marker) + len(design_marker)
design_html, design_end = dec.raw_decode(content[start_design:])
with open('scratch/design_inner.html', 'w', encoding='utf-8') as f:
    f.write(design_html)
print('design_inner.html decoded! length:', len(design_html))
