import fs from 'fs';
const html = fs.readFileSync('ref.html', 'utf8');
const matches = [...html.matchAll(/<aside[\s\S]*?<\/aside>/gi)];

if (!fs.existsSync('scratch')) {
  fs.mkdirSync('scratch');
}

matches.forEach((m, idx) => {
  const clean = m[0].replace(/src="data:[^"]+"/g, 'src="..."');
  fs.writeFileSync(`scratch/aside_${idx}.html`, clean);
  console.log(`Wrote scratch/aside_${idx}.html, len=${clean.length}`);
});
