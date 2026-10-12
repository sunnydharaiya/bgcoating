const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.jsx')) results.push(file);
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src', 'tools'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // 1. Replace button classes
    // Calculate button
    content = content.replace(
        /className="flex-\[2\] py-3 px-4 bg-gradient-to-r from-\[\#F7941D\] to-\[\#A50021\].*?"/g,
        'className="flex-[2] md:flex-[3] py-3.5 bg-gradient-to-r from-[#FBA435] to-[#F7941D] hover:from-[#F7941D] hover:to-[#E8700A] text-white font-bold text-sm md:text-base rounded-full shadow-[0_2px_8px_rgba(247,148,29,0.3)] transition hover:shadow-[0_4px_12px_rgba(247,148,29,0.4)] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"'
    );
    // Alternate calculate button
    content = content.replace(
        /className="flex-\[2\] py-3.5 px-4 bg-gradient-to-r from-\[\#F7941D\].*?"/g,
        'className="flex-[2] md:flex-[3] py-3.5 bg-gradient-to-r from-[#FBA435] to-[#F7941D] hover:from-[#F7941D] hover:to-[#E8700A] text-white font-bold text-sm md:text-base rounded-full shadow-[0_2px_8px_rgba(247,148,29,0.3)] transition hover:shadow-[0_4px_12px_rgba(247,148,29,0.4)] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"'
    );
    // Calculate button svg
    content = content.replace(
        /<Play className="w-3\.5 h-3\.5 fill-white" \/>/g,
        '<Play className="w-4 h-4 fill-white text-white" />'
    );
    
    // Reset button
    content = content.replace(
        /className="flex-1 py-3 px-4 bg-white hover:bg-red-50 text-\[\#A50021\] border border-\[\#A50021\]\/30.*?"/g,
        'className="flex-1 py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-sm md:text-base rounded-full shadow-sm transition hover:bg-slate-50 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"'
    );
    content = content.replace(
        /<RotateCcw className="w-3\.5 h-3\.5" \/>/g,
        '<RotateCcw className="w-4 h-4" />'
    );
    // Button row wrapper
    content = content.replace(
        /<div className="flex gap-2\.5 pt-2">/g,
        '<div className="flex flex-col sm:flex-row gap-3 pt-2 mt-4">'
    );

    // 2. Replace input fields
    content = content.replace(
        /className="w-full px-3\.5 py-2\.5 bg-slate-50 border border-slate-200 rounded-xl text-xs (?:font-mono )?(?:font-bold|font-medium) text-slate-900 focus:outline-none focus:ring-2 focus:ring-\[\#F7941D\](.*?)"/g,
        'className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-[#F7941D] focus:ring-1 focus:ring-[#F7941D] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]$1"'
    );

    // 3. Optional: replace the container div
    if (!content.includes('USER INPUTS — PLEASE FILL CORRECTLY') && content.includes('<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">')) {
        content = content.replace(
            /<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">/,
            `<div className="relative border-2 border-[#F7941D]/30 rounded-xl p-5 md:p-6 pt-7 md:pt-8 mt-4">
            <div className="absolute -top-3 left-4 md:left-6 bg-gradient-to-r from-[#FBA435] to-[#F7941D] text-white text-[9px] md:text-[10px] font-bold px-3 py-1.5 rounded-sm uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <BookOpen className="w-3 h-3" />
              USER INPUTS — PLEASE FILL CORRECTLY
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-5">`
        );
        
        content = content.replace(
            /{\/\* Form Actions: Calculate & Reset \*\/}/,
            `</div>\n          {/* Form Actions: Calculate & Reset */}`
        );
        content = content.replace(
            /{\/\* Action Button Row \*\/}/,
            `</div>\n          {/* Action Button Row */}`
        );
        content = content.replace(
            /{\/\* Actions \*\/}/,
            `</div>\n          {/* Actions */}`
        );
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated: ' + file);
    }
});
