const fs = require('fs');
let code = fs.readFileSync('app/api/gemini/generate-prd/route.ts', 'utf8');

const target1 = "const { prompt, clientName, serviceProvider, projectCost, timeline, industry } = body;";
const replacement1 = "const { prompt, clientName, serviceProvider, projectCost, timeline, industry, tone } = body;";

const target2 = "${industry ? `Industry: ${industry}` : ''}";
const replacement2 = "${industry ? `Industry: ${industry}` : ''}\n${tone ? `Tone of Voice: ${tone}` : ''}";

code = code.replace(target1, replacement1);
code = code.replace(target2, replacement2);

// Add instruction about tone if not there
if (code.includes('NEVER leave empty strings')) {
  code = code.replace(
    "NEVER leave empty strings or mock generic placeholders like '[Feature]' — generate exact realistic technical strings matching the requested app!`;",
    "NEVER leave empty strings or mock generic placeholders like '[Feature]' — generate exact realistic technical strings matching the requested app!\n4. MATCH THE REQUESTED TONE exactly in all generated descriptions, objectives, and text fields.`;"
  );
}

fs.writeFileSync('app/api/gemini/generate-prd/route.ts', code);
console.log('Patched API generate route');
