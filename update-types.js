const fs = require('fs');

let code = fs.readFileSync('types/prd.ts', 'utf8');

const insertAfter = 'estimatedTimeline: string;';
const newFields = `
  coverBadge?: string;
  coverDocumentType?: string;
  coverSubtitle?: string;
  coverDescription?: string;`;

code = code.replace(insertAfter, insertAfter + newFields);

const emptyPrdAfter = 'estimatedTimeline: "",';
const emptyPrdNewFields = `
  coverBadge: "Confidential & Proprietary",
  coverDocumentType: "Product Requirement Specification & Development Agreement",
  coverSubtitle: "— Official Project Specification —",
  coverDescription: "Comprehensive Technical Architecture, Functional Requirements & Commercial Scope Agreement",`;

code = code.replace(emptyPrdAfter, emptyPrdAfter + emptyPrdNewFields);

fs.writeFileSync('types/prd.ts', code);
console.log('Updated types/prd.ts');
