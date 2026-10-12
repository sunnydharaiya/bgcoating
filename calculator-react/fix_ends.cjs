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
    if (!content.trim().endsWith('}')) {
        if (!content.trim().endsWith(');')) {
            content = content.trimEnd() + '\n  );\n}';
        } else {
            content = content.trimEnd() + '\n}';
        }
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed end of: ' + file);
    }
});
