const fs = require('fs');
let code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

// 1. Inject styles and logic near the top of the component
const hookTarget = `  // Track section order
  const [sectionOrder, setSectionOrder] = React.useState<number[]>(() => {`;

const logicToInject = `  const headerStyle = d.brandingHeaderStyle || 'standard';
  const primaryColor = d.brandingPrimaryColor || '#000000';

  const h2Class = headerStyle === 'minimal'
    ? "font-sans uppercase tracking-widest text-lg font-bold pb-2 mb-4 flex items-center justify-between border-b brand-colored-border"
    : headerStyle === 'bold'
    ? "font-serif text-2xl font-black border-l-4 pl-3 mb-6 flex items-center justify-between brand-colored-border brand-colored-text"
    : "font-serif italic text-xl font-bold border-b pb-1 mb-4 flex items-center justify-between brand-colored-border";

  const h1Class = headerStyle === 'minimal'
    ? "font-sans uppercase tracking-widest text-3xl font-bold pb-4 mb-8 text-center"
    : headerStyle === 'bold'
    ? "font-serif text-4xl font-black text-center mb-8 brand-colored-text"
    : "font-serif text-2xl md:text-4xl font-black uppercase tracking-tight mb-4 leading-tight";

`;

if (!code.includes("const headerStyle = d.brandingHeaderStyle")) {
  code = code.replace(hookTarget, logicToInject + hookTarget);
}

// 2. Replace all the h2 static classes
const h2Regex = /className="font-serif italic text-xl font-bold text-\\[#1A1A1A\\] dark:text-\\[#F4F1EE\\] border-b border-black dark:border-white\/20 pb-1 mb-4 flex items-center justify-between"/g;
code = code.replace(h2Regex, 'className={`text-[#1A1A1A] dark:text-[#F4F1EE] ${h2Class}`}');

// Replace the H2s that don't have flex (like section 33)
const h2NonFlexRegex = /className="font-serif text-2xl font-bold text-\\[#1A1A1A\\] dark:text-\\[#F4F1EE\\] border-b border-black dark:border-white\/30 pb-2 mb-4"/g;
code = code.replace(h2NonFlexRegex, 'className={`text-[#1A1A1A] dark:text-[#F4F1EE] ${h2Class}`}');

// 3. Inject CSS Variables
const styleTarget = `{/* Page-specific styling for print */}`;
const styleInjection = `{/* Page-specific styling for print */}
      <style>{\`
        :root {
          --brand-primary: \${primaryColor};
        }
        .brand-colored-text { color: var(--brand-primary); }
        .brand-colored-border { border-color: var(--brand-primary) !important; }
        .brand-colored-bg { background-color: var(--brand-primary) !important; }
      \`}</style>`;

if (!code.includes("--brand-primary")) {
  code = code.replace(styleTarget, styleInjection);
}

// 4. Update H1 in printMode === 'full' (the one after Cover Page)
const h1FullRegex = /className="font-serif text-2xl md:text-4xl font-black text-\\[#1A1A1A\\] dark:text-\\[#F4F1EE\\] uppercase tracking-tight mb-4 leading-tight"/g;
code = code.replace(h1FullRegex, 'className={`text-[#1A1A1A] dark:text-[#F4F1EE] ${h1Class}`}');

// 5. Add Logo to Cover Page
const coverBannerTarget = `{/* Top Classification Banner */}`;
const logoInjection = `{d.brandingLogoUrl && (
            <div className="absolute top-12 left-0 right-0 flex justify-center pointer-events-none">
              <img src={d.brandingLogoUrl} alt="Logo" className="max-h-24 object-contain" />
            </div>
          )}
          {/* Top Classification Banner */}`;
if (!code.includes("d.brandingLogoUrl &&")) {
  code = code.replace(coverBannerTarget, logoInjection);
}

// 6. Update the centerpiece typographic display for primary color
const projectTitleRegex = /className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-\\[#1A1A1A\\] dark:text-\\[#F4F1EE\\] uppercase tracking-tight leading-tight max-w-3xl mx-auto break-words"/g;
code = code.replace(projectTitleRegex, 'className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-[#1A1A1A] dark:text-[#F4F1EE] uppercase tracking-tight leading-tight max-w-3xl mx-auto break-words brand-colored-text"');

fs.writeFileSync('components/DocumentView.tsx', code);
console.log('Patched DocumentView.tsx with Branding features');
