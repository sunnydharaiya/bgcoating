with open('scratch/calc_inner.html', 'r', encoding='utf-8') as f:
    html = f.read()

start = html.find('id="pg-home"')
if start != -1:
    end = html.find('id="pg-paint"', start)
    with open('scratch/calc_home_extracted.html', 'w', encoding='utf-8') as out:
        out.write(html[start:end])
    print("Found pg-home in calc! Length:", end - start)
else:
    print("pg-home not found")
