const fs = require('fs');
const code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

const startIndex = code.indexOf('const SectionControls = ');
const endIndex = code.indexOf('const sectionBlocks = ');
const text = code.substring(startIndex, endIndex);

let ob = 0; let cb = 0;
for (let i = 0; i < text.length; i++) {
  if (text[i] === '{') ob++;
  if (text[i] === '}') cb++;
}
console.log('SectionControls: Open:', ob, 'Close:', cb);

