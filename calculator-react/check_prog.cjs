const fs = require('fs');
const html = fs.readFileSync('C:/Users/ADMIN/Documents/Workspace/bgcoating.com/Reference/02. R0_BG CoatingOS™ _ Digital Workspace for Coating Professionals_files/c55616a4-012d-46b6-8915-bd18aae98599.html', 'utf8');

const idx = html.indexOf("$('prog-fill')");
if (idx !== -1) {
  console.log(html.slice(idx - 600, idx + 1400));
} else {
  console.log('Not found');
}
