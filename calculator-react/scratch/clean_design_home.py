import re

with open('scratch/tab_home_design.html', 'r', encoding='utf-8') as f:
    html = f.read()

clean = re.sub(r'data:image/[^;]+;base64,[a-zA-Z0-9+/=]+', '[BASE64]', html)
with open('scratch/design_home_clean.html', 'w', encoding='utf-8') as out:
    out.write(clean)

print("Saved clean design home, length:", len(clean))
