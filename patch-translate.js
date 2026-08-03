const fs = require('fs');
let code = fs.readFileSync('components/TranslateModal.tsx', 'utf8');

const replacement = `
            <p className="text-[11px] text-black/60 dark:text-white/60 leading-relaxed mt-2 italic">
              Note: Translating a large document may take 20-30 seconds.
            </p>
          </div>
`;

code = code.replace(
  '          </div>\n\n          <div className="space-y-4">',
  replacement + '\n          <div className="space-y-4">'
);

fs.writeFileSync('components/TranslateModal.tsx', code);
