const fs = require('fs');
let code = fs.readFileSync('types/prd.ts', 'utf8');

const insertAfter = 'coverDescription?: string;';
const newFields = `
  brandingPrimaryColor?: string;
  brandingLogoUrl?: string;
  brandingHeaderStyle?: 'standard' | 'minimal' | 'bold';`;

code = code.replace(insertAfter, insertAfter + newFields);

const emptyPrdAfter = 'coverDescription: "Comprehensive Technical Architecture, Functional Requirements & Commercial Scope Agreement",';
const emptyPrdNewFields = `
  brandingPrimaryColor: "#000000",
  brandingLogoUrl: "",
  brandingHeaderStyle: "standard",`;

code = code.replace(emptyPrdAfter, emptyPrdAfter + emptyPrdNewFields);

fs.writeFileSync('types/prd.ts', code);
console.log('Updated types/prd.ts with branding');
