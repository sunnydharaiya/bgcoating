import re

print("=== CALC_INNER ===")
with open('scratch/calc_inner.html', 'r', encoding='utf-8') as f:
    calc_html = f.read()

# Find sidebar in calc
sb_calc_match = re.search(r'(<(?:aside|div)[^>]*class="[^"]*sidebar[^"]*"[\s\S]*?</(?:aside|div)>)', calc_html)
if sb_calc_match:
    print("Found sidebar in calc! Length:", len(sb_calc_match.group(0)))
    with open('scratch/calc_sidebar.html', 'w', encoding='utf-8') as f_sb:
        f_sb.write(sb_calc_match.group(0)[:5000])
else:
    print("Sidebar class not directly matched with simple regex")

# Check what main containers exist in calc
m = re.findall(r'<div[^>]*id="[^"]*"', calc_html)
print("Calc div IDs:", m[:20])

print("\n=== DESIGN_INNER ===")
with open('scratch/design_inner.html', 'r', encoding='utf-8') as f:
    design_html = f.read()

sb_design_match = re.search(r'(<(?:aside|div)[^>]*class="[^"]*sidebar[^"]*"[\s\S]*?</(?:aside|div)>)', design_html)
if sb_design_match:
    print("Found sidebar in design! Length:", len(sb_design_match.group(0)))
    with open('scratch/design_sidebar.html', 'w', encoding='utf-8') as f_sb:
        f_sb.write(sb_design_match.group(0)[:5000])
else:
    print("Sidebar class not directly matched with simple regex in design")

m_d = re.findall(r'<div[^>]*id="[^"]*"', design_html)
print("Design div IDs:", m_d[:20])
