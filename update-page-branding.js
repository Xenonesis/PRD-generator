const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

// Add import
const importTarget = "import { VersionHistoryDrawer } from \"@/components/VersionHistoryDrawer\";";
const importReplacement = "import { VersionHistoryDrawer } from \"@/components/VersionHistoryDrawer\";\nimport { DocumentBrandingModal } from \"@/components/DocumentBrandingModal\";";
if (!code.includes("DocumentBrandingModal")) {
  code = code.replace(importTarget, importReplacement);
}

// Add state
const stateTarget = "const [isHistoryOpen, setIsHistoryOpen] = useState(false);";
const stateReplacement = "const [isHistoryOpen, setIsHistoryOpen] = useState(false);\n  const [isBrandingOpen, setIsBrandingOpen] = useState(false);";
if (!code.includes("isBrandingOpen")) {
  code = code.replace(stateTarget, stateReplacement);
}

// Add to Navbar
const navbarTarget = "onOpenHistory={() => setIsHistoryOpen(true)}";
const navbarReplacement = "onOpenHistory={() => setIsHistoryOpen(true)}\n        onOpenBranding={() => setIsBrandingOpen(true)}";
if (!code.includes("onOpenBranding")) {
  code = code.replace(navbarTarget, navbarReplacement);
}

// Add Modal
const modalTarget = `<VersionHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}`;
const modalReplacement = `<DocumentBrandingModal
        isOpen={isBrandingOpen}
        onClose={() => setIsBrandingOpen(false)}
        prdData={prdData}
        onSave={(updates) => {
          setPrdData(prev => ({ ...prev, ...updates }));
          // Add to history
          setPrdHistory(prev => [...prev, { timestamp: Date.now(), data: { ...prdData, ...updates } }]);
        }}
      />
      
      <VersionHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}`;
if (!code.includes("<DocumentBrandingModal")) {
  code = code.replace(modalTarget, modalReplacement);
}

fs.writeFileSync('app/page.tsx', code);
console.log('Updated app/page.tsx with Branding');
