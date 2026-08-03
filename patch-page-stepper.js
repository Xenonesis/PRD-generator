const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

// 1. Import WorkflowStepper
if (!code.includes('WorkflowStepper')) {
  code = code.replace(
    'import { MiniMap } from "@/components/MiniMap";',
    'import { MiniMap } from "@/components/MiniMap";\nimport { WorkflowStepper } from "@/components/WorkflowStepper";'
  );
}

// 2. Add currentStep logic
const currentStepTarget = "const [isHistoryOpen, setIsHistoryOpen] = useState(false);";
const currentStepReplacement = `const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);`;

if (code.includes(currentStepTarget) && !code.includes('currentStep')) {
  code = code.replace(currentStepTarget, currentStepReplacement);
}

// 3. Add onStepClick handler
const handlerTarget = "const handleCopyMarkdown = () => {";
const handlerReplacement = `const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
    if (stepId === 0) {
      setViewMode("split");
    } else if (stepId === 1) {
      setViewMode("preview");
    } else if (stepId === 2) {
      setViewMode("split");
      window.dispatchEvent(new CustomEvent('SET_ACTIVE_TAB', { detail: 'signoff' }));
    } else if (stepId === 3) {
      setViewMode("preview");
      window.dispatchEvent(new CustomEvent('TRIGGER_EXPORT_MENU'));
    }
  };

  const handleCopyMarkdown = () => {`;

if (code.includes(handlerTarget) && !code.includes('handleStepClick')) {
  code = code.replace(handlerTarget, handlerReplacement);
}

// 4. Place WorkflowStepper before the banner
const stepperTarget = "{/* Banner callout for AI generation */}";
const stepperReplacement = `{/* Workflow Stepper */}
        {!isFullscreen && (
          <WorkflowStepper 
            data={prdData}
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
        )}

        {/* Banner callout for AI generation */}`;

if (code.includes(stepperTarget) && !code.includes('WorkflowStepper data={prdData}')) {
  code = code.replace(stepperTarget, stepperReplacement);
}

fs.writeFileSync('app/page.tsx', code);
console.log('Patched app/page.tsx with Stepper');
