import re

with open('scratch/calc_inner.html', 'r', encoding='utf-8') as f:
    calc_html = f.read()

# find styles between .side-nav and whatever is next
start = calc_html.find('.sec-label{')
end = calc_html.find('/* ── TOPBAR', start)
if end == -1:
    end = calc_html.find('/* ──', start + 100)

with open('scratch/calc_nav_styles.css', 'w', encoding='utf-8') as out:
    out.write(calc_html[start:end])
print("Done, length:", end - start)
