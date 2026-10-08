import re

with open('scratch/calc_inner.html', 'r', encoding='utf-8') as f:
    calc_html = f.read()

cleaned_calc = re.sub(r'data:image/[^;]+;base64,[a-zA-Z0-9+/=]+', '[BASE64_IMAGE]', calc_html)

sb_calc_match = re.search(r'(<aside[^>]*class="[^"]*sidebar[^"]*"[\s\S]*?</aside>)', cleaned_calc)
if sb_calc_match:
    with open('scratch/calc_sidebar_clean.html', 'w', encoding='utf-8') as f:
        f.write(sb_calc_match.group(0))
    print('Clean calc sidebar written, length:', len(sb_calc_match.group(0)))

with open('scratch/design_inner.html', 'r', encoding='utf-8') as f:
    design_html = f.read()

cleaned_design = re.sub(r'data:image/[^;]+;base64,[a-zA-Z0-9+/=]+', '[BASE64_IMAGE]', design_html)

sb_design_match = re.search(r'(<aside[^>]*class="[^"]*sidebar[^"]*"[\s\S]*?</aside>)', cleaned_design)
if sb_design_match:
    with open('scratch/design_sidebar_clean.html', 'w', encoding='utf-8') as f:
        f.write(sb_design_match.group(0))
    print('Clean design sidebar written, length:', len(sb_design_match.group(0)))
