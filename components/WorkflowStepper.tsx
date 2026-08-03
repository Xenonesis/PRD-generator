import React from 'react';
import { Check, Edit3, Eye, PenTool, Download } from 'lucide-react';
import { PRDData } from '@/types/prd';
import { getSectionAudits } from '@/components/InteractiveForm';

interface WorkflowStepperProps {
  data: PRDData;
  onStepClick: (stepId: number) => void;
  currentStep: number;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({ data, onStepClick, currentStep }) => {
  const audits = getSectionAudits(data);
  const totalSections = audits.length;
  const completedSections = audits.filter(a => a.isComplete).length;
  const progressPercent = (completedSections / totalSections) * 100;
  
  // Dynamic step completion logic
  // 0: Drafting (always accessible)
  // 1: Review (needs at least some drafting done, say 50% or just available)
  // 2: Sign-off (needs completion > 80%)
  // 3: Exported (needs signatures)
  
  const signoffComplete = audits.find(a => a.id === 33)?.isComplete;

  const steps = [
    { 
      id: 0, 
      label: 'Drafting', 
      icon: Edit3, 
      completed: completedSections > totalSections * 0.5,
      clickable: true,
      hint: `${completedSections}/${totalSections} sections`
    },
    { 
      id: 1, 
      label: 'Review', 
      icon: Eye, 
      completed: progressPercent >= 90,
      clickable: true,
      hint: progressPercent >= 90 ? 'Ready for review' : 'Drafting incomplete'
    },
    { 
      id: 2, 
      label: 'Sign-off', 
      icon: PenTool, 
      completed: signoffComplete,
      clickable: progressPercent >= 90,
      hint: signoffComplete ? 'Signed' : 'Needs signatures'
    },
    { 
      id: 3, 
      label: 'Exported', 
      icon: Download, 
      completed: false, 
      clickable: signoffComplete,
      hint: 'Generate PDF/Word'
    },
  ];

  return (
    <div className="w-full bg-[#EFECE7] dark:bg-[#1E1E1E] border border-black dark:border-white/10 p-4 sm:p-6 shadow-sm no-print mb-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-black/50 dark:text-white/50">
            Project Workflow
          </h3>
          <span className="text-[10px] font-bold font-mono bg-black/5 dark:bg-white/10 px-2 py-0.5">
            {Math.round(progressPercent)}% COMPLETE
          </span>
        </div>
        
        <div className="flex items-center justify-between relative mt-8">
          <div className="absolute left-0 top-5 -translate-y-1/2 w-full h-0.5 bg-black/10 dark:bg-white/10" />
          <div 
            className="absolute left-0 top-5 -translate-y-1/2 h-0.5 bg-black dark:bg-white transition-all duration-500 ease-in-out" 
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
          
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            
            return (
              <button 
                key={step.id} 
                onClick={() => {
                  if (step.clickable || step.id <= currentStep) {
                    onStepClick(step.id);
                  }
                }}
                disabled={!step.clickable && step.id > currentStep}
                className="relative z-10 flex flex-col items-center gap-2 group outline-none"
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                    isActive 
                      ? 'bg-black text-white dark:bg-white dark:text-[#121212] border-black dark:border-white scale-110' 
                      : step.completed
                        ? 'bg-[#EFECE7] dark:bg-[#1E1E1E] text-black dark:text-white border-black dark:border-white'
                        : 'bg-[#F4F1EE] dark:bg-[#2A2A2A] text-black/30 dark:text-white/30 border-black/10 dark:border-white/10'
                  }`}
                >
                  {step.completed && !isActive ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                </div>
                <div className="flex flex-col items-center">
                  <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mt-1 transition-colors ${
                    isActive
                      ? 'text-black dark:text-white' 
                      : step.completed
                        ? 'text-black/70 dark:text-white/70'
                        : 'text-black/40 dark:text-white/40'
                  }`}>
                    {step.label}
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-black/50 dark:text-white/50 hidden sm:block whitespace-nowrap mt-0.5">
                    {step.hint}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
