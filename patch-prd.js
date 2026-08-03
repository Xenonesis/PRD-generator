const fs = require('fs');
let code = fs.readFileSync('types/prd.ts', 'utf8');

const target1 = "brandingHeaderStyle?: 'standard' | 'minimal' | 'bold';";
const replacement1 = "brandingHeaderStyle?: 'standard' | 'minimal' | 'bold';\n  hiddenSections?: number[];";

const target2 = "export const EMPTY_PRD: PRDData = {";
const replacement2 = "export const EMPTY_PRD: PRDData = {\n  hiddenSections: [],";

if (code.includes(target1) && !code.includes('hiddenSections?:')) {
  code = code.replace(target1, replacement1);
  code = code.replace(target2, replacement2);
  fs.writeFileSync('types/prd.ts', code);
  console.log('Patched types/prd.ts');
}
