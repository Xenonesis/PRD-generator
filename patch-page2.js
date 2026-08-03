const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

// 1. Import
code = code.replace(
  'import { AIMagicModal } from "@/components/AIMagicModal";',
  'import { AIMagicModal } from "@/components/AIMagicModal";\nimport { TranslateModal } from "@/components/TranslateModal";'
);

// 2. State
code = code.replace(
  'const [isAiModalOpen, setIsAiModalOpen] = useState(false);',
  'const [isAiModalOpen, setIsAiModalOpen] = useState(false);\n  const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);'
);

// 3. Navbar Prop
code = code.replace(
  'onOpenAIMagic={() => setIsAiModalOpen(true)}',
  'onOpenAIMagic={() => setIsAiModalOpen(true)}\n          onOpenTranslate={() => setIsTranslateModalOpen(true)}'
);

// 4. Modal Render
const translateModalStr = `      <AIMagicModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onGenerated={handlePRDChange}
      />
      <TranslateModal
        isOpen={isTranslateModalOpen}
        onClose={() => setIsTranslateModalOpen(false)}
        currentData={prdData}
        onTranslated={(translated) => {
          handlePRDChange(translated);
          setIsTranslateModalOpen(false);
        }}
      />`;
code = code.replace(
  '<AIMagicModal\n        isOpen={isAiModalOpen}\n        onClose={() => setIsAiModalOpen(false)}\n        onGenerated={handlePRDChange}\n      />',
  translateModalStr
);

fs.writeFileSync('app/page.tsx', code);
console.log('Patched app/page.tsx');
