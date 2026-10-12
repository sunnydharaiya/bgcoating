const fs = require('fs');
const html = fs.readFileSync('C:/Users/ADMIN/Documents/Workspace/bgcoating.com/Reference/02. R0_BG CoatingOS™ _ Digital Workspace for Coating Professionals_files/81a0a99e-4d1a-4d0a-b215-4c4854c9d871.html', 'utf8');

const regex = /<div[^>]*class=["'][^"']*card[^"']*["'][^>]*id=["']sp-cons["'][\s\S]*?(?=<div[^>]*class=["'][^"']*card[^"']*["']|$)/i;
const match = html.match(regex);
if (match) {
  console.log(match[0].slice(0, 2000));
} else {
  console.log('Not found');
}
