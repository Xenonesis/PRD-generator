const fs = require('fs');

let code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

const getPriorityBadgeRegex = /  const getPriorityBadge = \(p: string\) => \{[\s\S]*?  \};\n/;
const match = code.match(getPriorityBadgeRegex);

if (match) {
  // Remove it from its current location
  code = code.replace(match[0], '');
  
  // Insert it before sectionBlocks
  const insertTarget = 'const sectionBlocks = [';
  code = code.replace(insertTarget, match[0].replace('  const getPriorityBadge', 'const getPriorityBadge') + '\n' + insertTarget);
  
  fs.writeFileSync('components/DocumentView.tsx', code);
  console.log('Moved getPriorityBadge');
} else {
  console.log('Could not find getPriorityBadge');
}

