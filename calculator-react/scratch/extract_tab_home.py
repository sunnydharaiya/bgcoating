with open('scratch/design_inner.html', 'r', encoding='utf-8') as f:
    html = f.read()

start = html.find('id="tab-home"')
if start != -1:
    end = html.find('id="tab-input"', start)
    with open('scratch/tab_home_design.html', 'w', encoding='utf-8') as out:
        out.write(html[start-30:end])
    print("Found tab-home in design! Length:", end - start)
else:
    print("tab-home not found")
