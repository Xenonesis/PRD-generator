const fs = require('fs');
let code = fs.readFileSync('components/InteractiveForm.tsx', 'utf8');

function addAIQuickFill(regexStr, field, schemaDescription, title) {
  const regex = new RegExp(regexStr);
  if (regex.test(code)) {
    code = code.replace(
      regex, 
      '<div className="flex items-center gap-2">$1<AIQuickFill field="' + field + '" schemaDescription="' + schemaDescription + '" data={data} onUpdate={(val) => updateField(\'' + field + '\', val)} title="' + title + '" /></div>'
    );
  } else {
    console.log("NOT FOUND: " + regexStr);
  }
}

addAIQuickFill(
  '(<label className="text-\\[10px\\] font-bold uppercase tracking-wider text-black\\/70 dark:text-white\\/70 block mb-2">1\\.3 Target Users<\\/label>)',
  'targetUsers',
  'Object with keys: primary, secondary, admin (all strings)',
  'Target Users'
);

addAIQuickFill(
  '(<h3 className="text-\\[10px\\] font-bold uppercase tracking-wider text-black\\/70 dark:text-white\\/70">5\\. User Roles &amp; Permissions<\\/h3>)',
  'userRoles',
  'Object with keys: guest, registeredUser, admin, superAdmin (all strings)',
  'User Roles & Permissions'
);

addAIQuickFill(
  '(<h3 className="text-\\[10px\\] font-bold uppercase tracking-wider text-black\\/70 dark:text-white\\/70">7\\. UI\\/UX &amp; Design Requirements<\\/h3>)',
  'design',
  'Object with keys: style, primaryColor, secondaryColor, typography, referenceWebsites (all strings)',
  'UI/UX & Design'
);

addAIQuickFill(
  '(<h3 className="text-\\[10px\\] font-bold uppercase tracking-wider text-black\\/70 dark:text-white\\/70">14\\. Timeline Phase Breakdown<\\/h3>)',
  'timelinePhases',
  'Array of objects {phase: string, duration: string}',
  'Timeline Phase Breakdown'
);

addAIQuickFill(
  '(<h3 className="text-\\[10px\\] font-bold uppercase tracking-wider text-black\\/70 dark:text-white\\/70">15\\. Payment Milestones<\\/h3>)',
  'paymentStructure',
  'Array of objects {percentage: string, milestone: string, description: string}',
  'Payment Milestones'
);

addAIQuickFill(
  '(<h3 className="text-\\[10px\\] font-bold uppercase tracking-wider text-black\\/70 dark:text-white\\/70 mb-3">Additional Legal Clauses \\(Optional\\)<\\/h3>)',
  'legalClauses',
  'Array of strings',
  'Additional Legal Clauses'
);

fs.writeFileSync('components/InteractiveForm.tsx', code);
console.log('Patched with AIQuickFill');
