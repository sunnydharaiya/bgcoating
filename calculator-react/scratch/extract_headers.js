import fs from 'fs';

function extractString(html, varName) {
  const startMarker = varName + ' = ';
  const startIdx = html.indexOf(startMarker);
  if (startIdx === -1) return '';
  const quoteChar = html[startIdx + startMarker.length];
  let endIdx = startIdx + startMarker.length + 1;
  while (endIdx < html.length) {
    if (html[endIdx] === quoteChar && html[endIdx - 1] !== '\\') {
      break;
    }
    endIdx++;
  }
  const raw = html.slice(startIdx + startMarker.length + 1, endIdx);
  return JSON.parse('"' + raw + '"');
}

const html = fs.readFileSync('ref.html', 'utf8');
const calc = extractString(html, '__BG_CALC__');
const design = extractString(html, '__BG_DESIGN__');

const calcHdr = calc.match(/<header[\s\S]*?<\/header>/i);
if (calcHdr) {
  fs.writeFileSync('scratch/calc_hdr.html', calcHdr[0]);
  console.log('Saved calc_hdr.html');
}

const designHdr = design.match(/<header[\s\S]*?<\/header>/i);
if (designHdr) {
  fs.writeFileSync('scratch/design_hdr.html', designHdr[0]);
  console.log('Saved design_hdr.html');
}

const mainHdr = html.match(/<header[\s\S]*?<\/header>/i);
if (mainHdr) {
  fs.writeFileSync('scratch/main_hdr.html', mainHdr[0]);
  console.log('Saved main_hdr.html');
}
