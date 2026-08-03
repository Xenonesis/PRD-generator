const fs = require('fs');
let code = fs.readFileSync('components/InteractiveForm.tsx', 'utf8');

code = code.replace(
  /<AIQuickFill field="legalClauses" schemaDescription="Array of strings" data=\{data\} onUpdate=\{\(val\) => updateField\('legalClauses', val\)\} title="Additional Legal Clauses" \/>/,
  `<AIQuickFill field="additionalLegalClauses" schemaDescription="Object with keys: nda, ipAssignment, nonCompete, termination (all booleans)" data={data} onUpdate={(val) => updateField('additionalLegalClauses', val)} title="Additional Legal Clauses" />`
);

fs.writeFileSync('components/InteractiveForm.tsx', code);
console.log('Fixed legalClauses type error');
