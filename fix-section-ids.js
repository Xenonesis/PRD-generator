const fs = require('fs');
let code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

code = code.replace(/id="section-\d+"\s+id="section-\d+"/g, (match) => {
    return match.split(/\s+/)[0];
});

fs.writeFileSync('components/DocumentView.tsx', code);
console.log('Fixed duplicates');
