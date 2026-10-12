const fs = require('fs');
const path = require('path');

const refDir = path.resolve('../Reference/02. R0_BG CoatingOS™ _ Digital Workspace for Coating Professionals_files');
const specHtml = fs.readFileSync(path.join(refDir, 'c55616a4-012d-46b6-8915-bd18aae98599.html'), 'utf8');

const styles = [...specHtml.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
styles.forEach((s, idx) => {
  fs.writeFileSync(`spec_style_${idx+1}.css`, s[1]);
  console.log(`Saved spec_style_${idx+1}.css (${s[1].length} bytes)`);
});
