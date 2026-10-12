const fs = require('fs');
const path = require('path');

const refDir = path.resolve('../Reference/02. R0_BG CoatingOS™ _ Digital Workspace for Coating Professionals_files');
const calcHtml = fs.readFileSync(path.join(refDir, '81a0a99e-4d1a-4d0a-b215-4c4854c9d871.html'), 'utf8');

function getSubSec(id) {
  const marker = `id="${id}"`;
  const idx = calcHtml.indexOf(marker);
  if (idx === -1) return null;
  const start = calcHtml.lastIndexOf('<div', idx);
  return calcHtml.slice(start, start + 3000);
}

['sp-pc', 'sp-cov', 'sa-pipe'].forEach(id => {
  console.log(`\n================ ID: ${id} ================`);
  console.log(getSubSec(id));
});
