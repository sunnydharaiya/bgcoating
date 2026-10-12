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
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    let opens = (content.match(/<div(?:\s|>)/g) || []).length;
    let closes = (content.match(/<\/div>/g) || []).length;
    
    if (opens > closes) {
        let diff = opens - closes;
        let divs = '\n' + '      </div>\n'.repeat(diff);
        
        let match = content.match(/\n\s*\);\s*\}?\s*\}?\s*$/);
        if (match) {
            let lastIndex = content.lastIndexOf(match[0]);
            content = content.substring(0, lastIndex) + divs + content.substring(lastIndex);
        } else {
            content += divs;
        }
    }
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Balanced: ' + file + ' added ' + (opens - closes) + ' divs');
    }
});
