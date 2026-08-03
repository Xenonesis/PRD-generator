const fs = require('fs');
let code = fs.readFileSync('components/InteractiveForm.tsx', 'utf8');

code = code.replace(/Search\s*Maximize2/, "Search,\n  Maximize2");
fs.writeFileSync('components/InteractiveForm.tsx', code);
