const fs = require('fs');
let code = fs.readFileSync('components/MiniMap.tsx', 'utf8');

if (code.includes('}, [audits]);')) {
  code = code.replace('}, [audits]);', '}, [data]);');
  fs.writeFileSync('components/MiniMap.tsx', code);
  console.log('Patched MiniMap.tsx to fix infinite loop');
} else {
  console.log('Already patched?');
}
