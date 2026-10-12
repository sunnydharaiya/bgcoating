const fs = require('fs');
const specHtml = fs.readFileSync('C:/Users/ADMIN/Documents/Workspace/bgcoating.com/Reference/02. R0_BG CoatingOS™ _ Digital Workspace for Coating Professionals_files/c55616a4-012d-46b6-8915-bd18aae98599.html', 'utf8');

const secIds = ['secAB', 'secC', 'secD', 'secE', 'secF', 'secG', 'secH', 'secI', 'secN', 'secValidate', 'tab-report'];

for (let i = 0; i < secIds.length; i++) {
  const curId = secIds[i];
  const nextId = secIds[i+1] || '/body';
  const startIdx = specHtml.indexOf(`id="${curId}"`);
  if (startIdx === -1) continue;
  const divStart = specHtml.lastIndexOf('<div', startIdx);
  let endIdx = specHtml.length;
  if (i < secIds.length - 1) {
    const nextStart = specHtml.indexOf(`id="${nextId}"`);
    if (nextStart !== -1) {
      endIdx = specHtml.lastIndexOf('<div', nextStart);
    }
  }
  const content = specHtml.slice(divStart, endIdx).trim();
  fs.writeFileSync(`ref_sec_${curId}.html`, content);
  console.log(`Saved ref_sec_${curId}.html (${content.length} chars)`);
}
