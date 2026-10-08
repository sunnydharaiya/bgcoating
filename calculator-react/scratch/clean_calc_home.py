import re

with open('scratch/calc_home_extracted.html', 'r', encoding='utf-8') as f:
    html = f.read()

# remove base64
clean = re.sub(r'data:image/[^;]+;base64,[a-zA-Z0-9+/=]+', '[BASE64]', html)
with open('scratch/calc_home_clean.html', 'w', encoding='utf-8') as out:
    out.write(clean)

print("Saved clean calc home, length:", len(clean))
