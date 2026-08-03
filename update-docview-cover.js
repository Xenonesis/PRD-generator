const fs = require('fs');

let code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

code = code.replace(
  'Confidential &amp; Proprietary',
  '{d.coverBadge || "Confidential & Proprietary"}'
);

code = code.replace(
  'Product Requirement Specification &amp; Development Agreement',
  '{d.coverDocumentType || "Product Requirement Specification & Development Agreement"}'
);

code = code.replace(
  '— Official Project Specification —',
  '{d.coverSubtitle || "— Official Project Specification —"}'
);

code = code.replace(
  'Comprehensive Technical Architecture, Functional Requirements\n              &amp; Commercial Scope Agreement',
  '{d.coverDescription || "Comprehensive Technical Architecture, Functional Requirements & Commercial Scope Agreement"}'
);

// Fallback replacements in case the indentation/newlines were different
code = code.replace(
  /Comprehensive Technical Architecture, Functional Requirements\s*&amp; Commercial Scope Agreement/g,
  '{d.coverDescription || "Comprehensive Technical Architecture, Functional Requirements & Commercial Scope Agreement"}'
);


fs.writeFileSync('components/DocumentView.tsx', code);
console.log('Updated DocumentView cover page');
