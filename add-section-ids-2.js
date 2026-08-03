const fs = require('fs');
let code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

// The h2 elements are a great anchor! They all look like:
// <h2> or <h2 ...> ... <span>X. TITLE</span> or just "X. TITLE"
// Wait, I can just do a regex replace on the <section elements before the <h2>.
// Actually, an even easier way is to just put the ID on the <React.Fragment> ? No, Fragment can't have an ID, but we can put it on the <section>.

// Let's just find `// {/* X. TITLE */}` and find the very next `<section` and add `id="section-X"`.

let replaced = 0;
code = code.replace(/\/\/\s*{\/\*\s*(\d+)\.\s[^\n]+\n(?:[^\n]+\n){1,5}?\s*<section(\s)/g, (match, num, space) => {
    // If it already has an id, don't replace
    if (match.includes(' id=')) return match;
    replaced++;
    return match.replace('<section', `<section id="section-${num}"`);
});

fs.writeFileSync('components/DocumentView.tsx', code);
console.log('Total replaced:', replaced);
