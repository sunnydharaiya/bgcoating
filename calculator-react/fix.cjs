const fs = require('fs');
const file = 'src/tools/pro/VolumeSolidsSuite.jsx';
let content = fs.readFileSync(file, 'utf8');

// The error was expected '}' but found ';', meaning we are missing closing tags for Method 2 and 3.
// Let's just count how many divs we have. We can just add '</div>' right before Method 2 and Method 3's Results Output Section.

const parts = content.split('{/* Results Output Section */}');
// parts[0] is before Method 1
// parts[1] is Method 1 results + Method 2 form
// parts[2] is Method 2 results + Method 3 form
// parts[3] is Method 3 results

if (parts.length === 4) {
    // Add a </div> to parts[1] (end of Method 2 form)
    parts[1] = parts[1].replace(/<\/div>\s*$/, '</div>\n          </div>\n          ');
    // Add a </div> to parts[2] (end of Method 3 form)
    parts[2] = parts[2].replace(/<\/div>\s*$/, '</div>\n          </div>\n          ');
    // Method 1 (end of parts[0]) should have just one </div>
    parts[0] = parts[0].replace(/<\/div>\s*<\/div>\s*$/, '</div>\n          ');
}

fs.writeFileSync(file, parts.join('{/* Results Output Section */}'));
