import re

with open('scratch/calc_inner.html', 'r', encoding='utf-8') as f:
    calc_html = f.read()

m = re.search(r'/\*[^*]*SIDEBAR[^*]*\*\/[\s\S]*?(?=/\*|\Z)', calc_html, re.IGNORECASE)
if m:
    with open('scratch/calc_sidebar_style.css', 'w', encoding='utf-8') as out:
        out.write(m.group(0))

with open('scratch/design_inner.html', 'r', encoding='utf-8') as f:
    design_html = f.read()

m_d = re.search(r'/\*[^*]*SIDEBAR[^*]*\*\/[\s\S]*?(?=/\*|\Z)', design_html, re.IGNORECASE)
if m_d:
    with open('scratch/design_sidebar_style.css', 'w', encoding='utf-8') as out:
        out.write(m_d.group(0))
print("Done writing sidebar styles")
