const fs = require('fs');
const code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

const match = code.match(/const sectionBlocks = \[[\s\S]*?\];\n/);
if (match) {
  const text = match[0];
  let ob = 0; let cb = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '{') ob++;
    if (text[i] === '}') cb++;
  }
  console.log('sectionBlocks: Open:', ob, 'Close:', cb);
}

