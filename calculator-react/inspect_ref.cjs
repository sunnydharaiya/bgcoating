const fs = require('fs');
const path = require('path');

const refDir = path.resolve('../Reference/02. R0_BG CoatingOS™ _ Digital Workspace for Coating Professionals_files');
const specHtml = fs.readFileSync(path.join(refDir, 'c55616a4-012d-46b6-8915-bd18aae98599.html'), 'utf8');

function getElementById(html, id) {
  const regex = new RegExp(`<([a-zA-Z0-9]+)[^>]*id=["']${id}["'][^>]*>`, 'i');
  const match = html.match(regex);
  if (!match) return null;
  const tag = match[1];
  const startIndex = match.index;
  // find matching close tag
  let depth = 0;
  let pos = startIndex;
  const openTagRegex = new RegExp(`<${tag}[^>]*>`, 'gi');
  const closeTagRegex = new RegExp(`</${tag}>`, 'gi');
  
  // simple substring extraction up to next section or reasonable length
  return html.slice(startIndex, startIndex + 1500);
}

['prog-panel', 'secAB', 'secC', 'secD', 'secE', 'secF', 'secG', 'secH', 'secI', 'secN', 'secValidate', 'tab-report'].forEach(id => {
  console.log(`\n================== ID: ${id} ==================`);
  console.log(getElementById(specHtml, id));
});
