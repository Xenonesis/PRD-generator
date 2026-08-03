const fs = require('fs');

let code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

// The faulty regex left behind:
//   return (
//     <button
//       onClick={handleCopy}
//      ...
//     </button>
//   );
// };

code = code.replace(/  return \([\s\S]*?<\/button>\n  \);\n\};\n/, '');

fs.writeFileSync('components/DocumentView.tsx', code);
console.log('Fixed syntax error');
