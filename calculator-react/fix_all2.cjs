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
    
    // First, let's remove any block of multiple </div>s that we added incorrectly before `);`
    // My previous script added: \n</div>\n</div>\n          ...);
    // So we look for \n(?:<\/div>\n)+          \);
    let original = content;
    content = content.replace(/\n(?:<\/div>\n)+\s*\);/g, '\n  );');
    
    // Now let's recount
    let opens = (content.match(/<div(?:\s|>)/g) || []).length;
    let closes = (content.match(/<\/div>/g) || []).length;
    
    if (opens > closes) {
        let diff = opens - closes;
        let divs = '\n' + '</div>\n'.repeat(diff);
        
        // Find the LAST `  );\n}` in the file, which corresponds to the end of the component return
        let lastIndex = content.lastIndexOf('  );\n}');
        if (lastIndex !== -1) {
            content = content.substring(0, lastIndex) + divs + content.substring(lastIndex);
        } else {
            // fallback
            let backupIndex = content.lastIndexOf(');');
            if (backupIndex !== -1) {
                // To be safe, make sure it's preceded by whitespace and `</div>`
                content = content.substring(0, backupIndex) + divs + content.substring(backupIndex);
            }
        }
    }
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed ' + file);
    }
});
