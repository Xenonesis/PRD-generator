const fs = require('fs');
let code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

code = code.replace(/<CopySectionButton \/>/g, '<SectionControls index={31} total={32} moveUp={() => {}} moveDown={() => {}} />');

fs.writeFileSync('components/DocumentView.tsx', code);
console.log('Fixed section 34 copy button');
