const fs = require('fs');
let code = fs.readFileSync('lib/pdfExport.ts', 'utf8');

code = code.replace(
  /\/\/ Skip if it's h1 and is just the project title\n\s*if \(level === 1 && header.textContent\?\.includes\('UNTITLED PROJECT'\)\) return;/,
  `// Skip h1 as they are document titles
          if (level === 1) return;`
);

fs.writeFileSync('lib/pdfExport.ts', code);
console.log('Patched pdfExport.ts to ignore h1');
