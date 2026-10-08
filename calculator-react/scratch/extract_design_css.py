import re

with open('scratch/design_inner.html', 'r', encoding='utf-8') as f:
    html = f.read()

start = html.find('.sidebar{')
if start == -1:
    start = html.find('.sidebar {')
print('design .sidebar start:', start)

if start != -1:
    end = html.find('/* ──', start + 100)
    with open('scratch/design_nav_full.css', 'w', encoding='utf-8') as out:
        out.write(html[start:end])
    print('Wrote design_nav_full.css, length:', end - start)
