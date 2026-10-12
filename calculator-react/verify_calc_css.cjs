const fs = require('fs');
const css = fs.readFileSync('calc_style_1.css', 'utf8');

const idx = css.indexOf('.action-bar');
if (idx !== -1) {
  console.log(css.slice(idx, idx + 500));
} else {
  console.log('Not in calc_style_1.css');
}
