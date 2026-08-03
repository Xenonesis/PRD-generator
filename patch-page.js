const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

code = code.replace(
  '"editor" | "split" | "preview" | "markdown"',
  '"editor" | "split" | "preview" | "markdown" | "insights"'
);

code = code.replace(
  'import { MarkdownView } from "@/components/MarkdownView";',
  'import { MarkdownView } from "@/components/MarkdownView";\nimport { InsightsDashboard } from "@/components/InsightsDashboard";'
);

const insightsBlock = `
        {viewMode === "insights" && (
          <div className="animate-fade-in max-w-6xl mx-auto w-full min-w-0">
            <InsightsDashboard data={prdData} />
          </div>
        )}
`;

code = code.replace(
  '{viewMode === "markdown" && (',
  insightsBlock + '\n        {viewMode === "markdown" && ('
);

fs.writeFileSync('app/page.tsx', code);
console.log('Patched page.tsx');
