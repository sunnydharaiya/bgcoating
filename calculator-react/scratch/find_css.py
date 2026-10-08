import re

with open('scratch/calc_inner.html', 'r', encoding='utf-8') as f:
    calc_html = f.read()

# search style tags in calc_inner
style_calc = re.findall(r'<style[^>]*>([\s\S]*?)</style>', calc_html)
print(f"Calc has {len(style_calc)} style blocks")

with open('scratch/design_inner.html', 'r', encoding='utf-8') as f:
    design_html = f.read()

style_design = re.findall(r'<style[^>]*>([\s\S]*?)</style>', design_html)
print(f"Design has {len(style_design)} style blocks")

# search for .ng-hero in design
for i, s in enumerate(style_design):
    if '.ng-hero' in s:
        print(f"Found .ng-hero in design style {i}")
        # extract around .ng-hero
        idx = s.find('.ng-hero')
        with open('scratch/ng_hero_styles.css', 'w', encoding='utf-8') as out:
            out.write(s[max(0, idx-200):min(len(s), idx+4000)])

# search for .qa-tile in calc
for i, s in enumerate(style_calc):
    if '.qa-tile' in s:
        print(f"Found .qa-tile in calc style {i}")
        idx = s.find('.qa-tile')
        with open('scratch/qa_tile_styles.css', 'w', encoding='utf-8') as out:
            out.write(s[max(0, idx-500):min(len(s), idx+4000)])

print("Done style search")
