const fs = require('fs');
const path = require('path');

const refDir = path.resolve('../Reference/02. R0_BG CoatingOS™ _ Digital Workspace for Coating Professionals_files');
const calcHtml = fs.readFileSync(path.join(refDir, '81a0a99e-4d1a-4d0a-b215-4c4854c9d871.html'), 'utf8');

const pgMatches = [...calcHtml.matchAll(/id=["'](pg-[^"']+)["']/g)];
console.log('Pages found:', pgMatches.map(m => m[1]));

// Let's check sub-navs / tool containers inside pg-paint and other pg- containers
const subnavMatches = [...calcHtml.matchAll(/id=["']([^"']*-sn)["']/g)];
console.log('Sub-nav containers:', subnavMatches.map(m => m[1]));

// Let's print out what is inside pg-paint
const paintIdx = calcHtml.indexOf('id="pg-paint"');
console.log('\n--- PG-PAINT snippet ---');
console.log(calcHtml.slice(paintIdx, paintIdx + 2500));
