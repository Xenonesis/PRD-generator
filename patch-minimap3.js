const fs = require('fs');
let code = fs.readFileSync('components/MiniMap.tsx', 'utf8');

code = code.replace(/\\`/g, '`');
code = code.replace(/\\\$/g, '$');

fs.writeFileSync('components/MiniMap.tsx', code);
