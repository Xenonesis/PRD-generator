const fs = require('fs');

let code = fs.readFileSync('app/page.tsx', 'utf8');

const regex = /fontTheme: options\.fontTheme,\n\s*density: options\.density,\n\s*\}\);/;
const match = code.match(regex);
if (match) {
  code = code.replace(match[0], 'fontTheme: options.fontTheme,\n        density: options.density,\n        includeToc: options.includeToc,\n      });');
  fs.writeFileSync('app/page.tsx', code);
  console.log('Fixed includeToc in app/page.tsx');
} else {
  console.log('Could not find the target string');
}

