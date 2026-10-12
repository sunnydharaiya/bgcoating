const fs = require('fs');

// Read spec_style_1.css
let specCss = fs.readFileSync('spec_style_1.css', 'utf8');

// We want to remove html, body, and sidebar fixed layout rules that could break our React App shell
// But keep everything else: .prog-panel, .prog-donut, .sec, .tbl, .yno-btn, .scope-grid, .imp, .area-summary, .mfr-tbl, .reg-*, etc.
// Let's strip the App shell and sidebar layout portions
const strippedSpec = specCss
  .replace(/html\s*\{[^}]*\}/gi, '')
  .replace(/body\s*\{[^}]*\}/gi, '')
  .replace(/\.app\s*\{[^}]*\}/gi, '')
  .replace(/\.sidebar\b[^{]*\{[^}]*\}/gi, '')
  .replace(/\.side-[^{]*\{[^}]*\}/gi, '')
  .replace(/\.main\s*\{[^}]*\}/gi, '')
  .replace(/\.topbar\b[^{]*\{[^}]*\}/gi, '')
  .replace(/\.tb-[^{]*\{[^}]*\}/gi, '')
  .replace(/\.backdrop\b[^{]*\{[^}]*\}/gi, '');

fs.writeFileSync('src/styles/specification-reading.css', `/* BG CoatingOS™ — Specification Reading Styles */\n` + strippedSpec);
console.log('Written src/styles/specification-reading.css:', strippedSpec.length, 'bytes');

// Read calc_style_1.css
let calcCss = fs.readFileSync('calc_style_1.css', 'utf8');

const strippedCalc = calcCss
  .replace(/html\s*\{[^}]*\}/gi, '')
  .replace(/body\s*\{[^}]*\}/gi, '')
  .replace(/\.app\s*\{[^}]*\}/gi, '')
  .replace(/\.sidebar\b[^{]*\{[^}]*\}/gi, '')
  .replace(/\.side-[^{]*\{[^}]*\}/gi, '')
  .replace(/\.main\s*\{[^}]*\}/gi, '')
  .replace(/\.topbar\b[^{]*\{[^}]*\}/gi, '')
  .replace(/\.tb-[^{]*\{[^}]*\}/gi, '')
  .replace(/\.backdrop\b[^{]*\{[^}]*\}/gi, '');

fs.writeFileSync('src/styles/coating-calculator.css', `/* BG CoatingOS™ — Coating Calculator Styles */\n` + strippedCalc);
console.log('Written src/styles/coating-calculator.css:', strippedCalc.length, 'bytes');
