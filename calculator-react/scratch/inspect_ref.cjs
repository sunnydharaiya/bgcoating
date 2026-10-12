const fs = require('fs');
const path = require('path');

const refDir = path.resolve(__dirname, '../../Reference');
const files = fs.readdirSync(refDir);
const target = files.find(f => f.includes('02.') && f.endsWith('.html'));

const fullPath = path.join(refDir, target);
const content = fs.readFileSync(fullPath, 'utf8');

const goCalcMatches = [...content.matchAll(/goCalc\(([^)]+)\)/g)].map(m => m[1]);
console.log('Total goCalc calls:', goCalcMatches.length);
console.log('Unique goCalc calls:');
const unique = [...new Set(goCalcMatches)];
unique.forEach(u => console.log(u));

const cardMatches = [...content.matchAll(/<div class="sub-sec card"[^>]*id="([^"]+)"/g)].map(m => m[1]);
console.log('\nSub-sec cards in reference HTML (count: ' + cardMatches.length + '):');
cardMatches.forEach(c => console.log(c));
