const fs = require('fs');
const calcHtml = fs.readFileSync('C:/Users/ADMIN/Documents/Workspace/bgcoating.com/Reference/02. R0_BG CoatingOS™ _ Digital Workspace for Coating Professionals_files/81a0a99e-4d1a-4d0a-b215-4c4854c9d871.html', 'utf8');

const regex = /<div[^>]*class=["'][^"']*card[^"']*["'][^>]*id=["']sp-cov["'][\s\S]*?(?=<div[^>]*class=["'][^"']*card[^"']*["']|$)/i;
const match = calcHtml.match(regex);
if (match) {
  console.log(match[0].slice(0, 2000));
} else {
  // try id="sp-cov"
  const idx = calcHtml.indexOf('id="sp-cov"');
  console.log(calcHtml.slice(idx, idx + 2000));
}
