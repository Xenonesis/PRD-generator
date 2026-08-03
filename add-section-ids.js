const fs = require('fs');
let code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

let replaced = 0;
code = code.replace(/\/\/\s*{\/\*\s*(\d+)\.\s[^\n]+\n\s*\(d:.*?\)\s*=>\s*\(\n\s*<React\.Fragment key="sec-\d+">\n\s*<section /g, (match, num) => {
    replaced++;
    return match.replace('<section ', `<section id="section-${num}" `);
});

console.log('Replaced', replaced, 'sections via function signature');

// For 33. ADDITIONAL LEGAL CLAUSES which is slightly different:
// It has:
/*
  // {/* 33. ADDITIONAL LEGAL CLAUSES *}
  (d: PRDData, prdSectionClass: string, index: number, moveUp: (i: number) => void, moveDown: (i: number) => void) => (
    <React.Fragment key="sec-30">
      {d.additionalLegalClauses &&
          Object.values(d.additionalLegalClauses).some(Boolean) && (
            <div className="pdf-page-break-before space-y-6 pt-6">
              <section className="mb-8 relative group section-container">
*/
code = code.replace(/\/\/\s*{\/\*\s*(33)\.\s[^\n]+\n\s*\(d:.*?\)\s*=>\s*\(\n\s*<React\.Fragment.*?\n.*?<section /gs, (match, num) => {
    replaced++;
    return match.replace('<section ', `<section id="section-${num}" `);
});

fs.writeFileSync('components/DocumentView.tsx', code);
console.log('Total replaced:', replaced);
