import re

with open('scratch/design_inner.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find the main container in design_inner
start = html.find('<div class="main"')
if start == -1:
    start = html.find('class="main"')
print('Main container at:', start)

# Let's inspect the first 4000 characters of the main content
with open('scratch/design_main_snippet.html', 'w', encoding='utf-8') as out:
    out.write(html[start:start+5000])

print("Wrote design_main_snippet.html")
