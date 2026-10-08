import fs from 'fs';

const html = fs.readFileSync('ref.html', 'utf8');

function extractString(varName) {
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

const calc = extractString('__BG_CALC__');
const design = extractString('__BG_DESIGN__');

const calcSide = calc.match(/<aside[\s\S]*?<\/aside>/i);
if (calcSide) {
  const clean = calcSide[0].replace(/src="data:[^"]+"/g, 'src="..."');
  fs.writeFileSync('scratch/calc_side.html', clean);
  console.log('Saved calc_side.html, len:', clean.length);
}

const designSide = design.match(/<aside[\s\S]*?<\/aside>/i);
if (designSide) {
  const clean = designSide[0].replace(/src="data:[^"]+"/g, 'src="..."');
  fs.writeFileSync('scratch/design_side.html', clean);
  console.log('Saved design_side.html, len:', clean.length);
}
