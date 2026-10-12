const fs = require('fs');
const path = require('path');
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        if (fs.statSync(file).isDirectory()) results = results.concat(walk(file));
        else if (file.endsWith('.jsx')) results.push(file);
    });
    return results;
}
const files = walk(path.join(__dirname, 'src', 'tools'));
let broken = [];
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let opens = (content.match(/<div(\s|>)/g) || []).length;
    let closes = (content.match(/<\/div>/g) || []).length;
    if (opens !== closes) {
        broken.push({ file, diff: opens - closes });
    }
});
console.log(JSON.stringify(broken, null, 2));
