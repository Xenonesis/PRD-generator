const fs = require('fs');
let code = fs.readFileSync('components/MiniMap.tsx', 'utf8');

code = code.replace(
  'disabled={!canScroll && !exists}',
  'disabled={(!canScroll && !exists) || isHidden}'
);

fs.writeFileSync('components/MiniMap.tsx', code);
