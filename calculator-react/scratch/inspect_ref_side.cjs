const fs = require('fs');
const path = require('path');

const refDir = path.resolve(__dirname, '../../Reference');
const files = fs.readdirSync(refDir);
const target = files.find(f => f.includes('02.') && f.endsWith('.html'));

const fullPath = path.join(refDir, target);
let content = fs.readFileSync(fullPath, 'utf8');

const goCalcIndex = content.indexOf('function goCalc(');
if (goCalcIndex !== -1) {
  console.log(content.substring(goCalcIndex, goCalcIndex + 2000));
} else {
  console.log('function goCalc not found directly');
  const anyGoCalc = content.indexOf('goCalc');
  console.log('goCalc at:', anyGoCalc);
}
