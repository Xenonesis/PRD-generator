const fs = require('fs');
let code = fs.readFileSync('components/InsightsDashboard.tsx', 'utf8');
if (!code.includes("'use client'")) {
  code = "'use client';\n" + code;
  fs.writeFileSync('components/InsightsDashboard.tsx', code);
  console.log("Added 'use client'");
}
