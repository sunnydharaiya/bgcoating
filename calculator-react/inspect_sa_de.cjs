const fs = require('fs');
const html = fs.readFileSync('C:/Users/ADMIN/Documents/Workspace/bgcoating.com/Reference/02. R0_BG CoatingOS™ _ Digital Workspace for Coating Professionals_files/81a0a99e-4d1a-4d0a-b215-4c4854c9d871.html', 'utf8');

['sa-de', 'sa-vessel'].forEach(id => {
  const regex = new RegExp(`<div[^>]*class=["'][^"']*card[^"']*["'][^>]*id=["']${id}["'][\\s\\S]*?(?=<div[^>]*class=["'][^"']*card[^"']*["']|$)`, 'i');
  const m = html.match(regex);
  console.log(`\n================ ID: ${id} ================`);
  if (m) console.log(m[0].slice(0, 1500));
});
