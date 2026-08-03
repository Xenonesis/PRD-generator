const fs = require('fs');
let code = fs.readFileSync('types/prd.ts', 'utf8');

const target1 = "clientSignoff: {\n    name: string;\n    company: string;\n    signatureDate: string;\n  };";
const replacement1 = "clientSignoff: {\n    name: string;\n    company: string;\n    signatureDate: string;\n    signatureDataUrl?: string;\n  };";

const target2 = "providerSignoff: {\n    name: string;\n    company: string;\n    signatureDate: string;\n  };";
const replacement2 = "providerSignoff: {\n    name: string;\n    company: string;\n    signatureDate: string;\n    signatureDataUrl?: string;\n  };";

code = code.replace(target1, replacement1);
code = code.replace(target2, replacement2);

fs.writeFileSync('types/prd.ts', code);
console.log('Patched types/prd.ts');
