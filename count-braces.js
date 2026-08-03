const fs = require('fs');
const code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

let openBraces = 0;
let closeBraces = 0;

for (let i = 0; i < code.length; i++) {
  if (code[i] === '{') openBraces++;
  if (code[i] === '}') closeBraces++;
}

console.log('Open:', openBraces, 'Close:', closeBraces);
