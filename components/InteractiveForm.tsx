'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  FileCheck2,
  ListPlus,
  Shield,
  Layers,
  DollarSign,
  UserCheck,
  Palette,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Check,
  Search,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { PRDData, FeatureItem, TimelinePhase, PaymentMilestone, prdToMarkdown } from '@/types/prd';
import { AIQuickFill } from '@/components/AIQuickFill';
import { SignatureCapture } from '@/components/SignatureCapture';

interface InteractiveFormProps {
  data: PRDData;
  onChange: (updated: PRDData) => void;
}

export interface SectionAudit {
  id: number;
  title: string;
  tab: string;
  isComplete: boolean;
  missingDetail?: string;
}

export const getSectionAudits = (d: PRDData): SectionAudit[] => [
  {
    id: 0,
    title: '0. Header & Basic Terms',
    tab: 'header',
    isComplete: Boolean(
      d.projectName?.trim() &&
      d.clientName?.trim() &&
      d.projectCost?.trim()
    ),
    missingDetail: 'Fill project name, client name, and project cost'
  },
  {
    id: 1,
    title: '1. Project Overview & Objectives',
    tab: 'overview',
    isComplete: Boolean(
      d.projectDescription?.trim() &&
      d.projectObjectives?.length > 0 &&
      d.projectObjectives.some(o => o.trim())
    ),
    missingDetail: !d.projectDescription?.trim()
      ? 'Missing project overview description'
      : !d.projectObjectives?.length || !d.projectObjectives.some(o => o.trim())
      ? 'Missing project objectives list'
      : undefined
  },
  {
    id: 2,
    title: '2. Project Scope & Included Platforms',
    tab: 'overview',
    isComplete: Boolean(
      d.includedPlatforms &&
      (d.includedPlatforms.website ||
       d.includedPlatforms.webApp ||
       d.includedPlatforms.adminPanel ||
       d.includedPlatforms.androidApp ||
       d.includedPlatforms.iosApp ||
       d.includedPlatforms.apiBackend ||
       Boolean(d.includedPlatforms.other?.trim()))
    ),
    missingDetail: 'Select at least one included target platform'
  },
  {
    id: 3,
    title: '3. Features & Requirements',
    tab: 'features',
    isComplete: Boolean(
      d.features?.length > 0 &&
      d.features.some(f => f.feature?.trim() && f.description?.trim())
    ),
    missingDetail: 'Add at least one feature with title & description'
  },
  {
    id: 4,
    title: '4. Pages & Screens',
    tab: 'features',
    isComplete: Boolean(d.pages?.length > 0 && d.pages.some(p => p.trim())),
    missingDetail: 'List key pages or screens'
  },
  {
    id: 5,
    title: '5. User Roles & Permissions',
    tab: 'roles',
    isComplete: Boolean(
      d.userRoles?.guest?.trim() &&
      d.userRoles?.registeredUser?.trim() &&
      d.userRoles?.admin?.trim()
    ),
    missingDetail: 'Define permissions for guest, registered user, and admin'
  },
  {
    id: 6,
    title: '6. User Flows',
    tab: 'roles',
    isComplete: Boolean(
      d.userFlows?.registration?.trim() &&
      d.userFlows?.primaryProductFlow?.trim()
    ),
    missingDetail: 'Define primary user registration and product workflows'
  },
  {
    id: 7,
    title: '7. UI/UX & Design Guidelines',
    tab: 'design',
    isComplete: Boolean(
      d.design?.style?.trim() &&
      d.design?.primaryColor?.trim()
    ),
    missingDetail: 'Specify visual style and primary color scheme'
  },
  {
    id: 8,
    title: '8. Technical Architecture',
    tab: 'design',
    isComplete: Boolean(
      d.techStack?.frontend?.trim() &&
      d.techStack?.backend?.trim() &&
      d.techStack?.database?.trim()
    ),
    missingDetail: 'Specify frontend, backend, and database technologies'
  },
  {
    id: 9,
    title: '9. Third-Party Integrations',
    tab: 'design',
    isComplete: Boolean(
      d.thirdPartyIntegrations?.length > 0 &&
      d.thirdPartyIntegrations.some(i => i.trim())
    ),
    missingDetail: 'List third-party APIs or service integrations'
  },
  {
    id: 10,
    title: '10. Security Practices',
    tab: 'design',
    isComplete: Boolean(
      d.securityPractices?.length > 0 &&
      d.securityPractices.some(s => s.trim())
    ),
    missingDetail: 'Specify security practices and access controls'
  },
  {
    id: 11,
    title: '11. Performance Optimizations',
    tab: 'design',
    isComplete: Boolean(
      d.performanceOptimizations?.length > 0 &&
      d.performanceOptimizations.some(p => p.trim())
    ),
    missingDetail: 'List performance optimizations'
  },
  {
    id: 12,
    title: '12. SEO Features',
    tab: 'design',
    isComplete: Boolean(
      d.seoFeatures?.length > 0 &&
      d.seoFeatures.some(s => s.trim())
    ),
    missingDetail: 'List SEO capabilities and metadata features'
  },
  {
    id: 13,
    title: '13. Deliverables',
    tab: 'design',
    isComplete: Boolean(
      d.deliverables?.length > 0 &&
      d.deliverables.some(del => del.trim())
    ),
    missingDetail: 'Specify key project deliverables'
  },
  {
    id: 14,
    title: '14. Project Timeline & Phases',
    tab: 'timeline',
    isComplete: Boolean(
      d.timelinePhases?.length > 0 &&
      d.timelinePhases.some(t => t.phase?.trim() && t.duration?.trim())
    ),
    missingDetail: 'Define project timeline phases and durations'
  },
  {
    id: 15,
    title: '15. Payment Terms & Milestones',
    tab: 'timeline',
    isComplete: Boolean(
      d.paymentStructure?.length > 0 &&
      d.paymentStructure.some(p => p.milestone?.trim() && p.percentage?.trim())
    ),
    missingDetail: 'Define payment milestone breakdown'
  },
  {
    id: 16,
    title: '16. Revision Policy',
    tab: 'policies',
    isComplete: Boolean(
      d.designRevisions?.trim() &&
      d.devRevisions?.trim()
    ),
    missingDetail: 'Set design and development revision rounds'
  },
  {
    id: 17,
    title: '17. Change Request Policy',
    tab: 'policies',
    isComplete: Boolean(d.changeRequestPolicy?.trim()),
    missingDetail: 'Define change request review process'
  },
  {
    id: 18,
    title: '18. Client Responsibilities',
    tab: 'policies',
    isComplete: Boolean(
      d.clientResponsibilities?.length > 0 &&
      d.clientResponsibilities.some(c => c.trim())
    ),
    missingDetail: 'List client responsibilities and asset inputs'
  },
  {
    id: 19,
    title: '19. Testing & Quality Assurance',
    tab: 'policies',
    isComplete: Boolean(d.qaProcess?.trim()),
    missingDetail: 'Specify QA testing and UAT process'
  },
  {
    id: 20,
    title: '20. Bug vs Change Request Policy',
    tab: 'policies',
    isComplete: Boolean(d.bugVsChangePolicy?.trim()),
    missingDetail: 'Define distinction between bug fixes and change requests'
  },
  {
    id: 21,
    title: '21. Client Approval & Review Window',
    tab: 'policies',
    isComplete: Boolean(d.approvalFeedbackDays?.trim()),
    missingDetail: 'Specify approval review feedback window (in days)'
  },
  {
    id: 22,
    title: '22. Post-Launch Support',
    tab: 'policies',
    isComplete: Boolean(
      d.supportPeriod?.trim() &&
      d.includedSupport?.length > 0 &&
      d.includedSupport.some(s => s.trim())
    ),
    missingDetail: 'Specify warranty period and included support items'
  },
  {
    id: 23,
    title: '23. Hosting, Domain & Third-Party Costs',
    tab: 'policies',
    isComplete: Boolean(d.hostingDomainNotes?.trim()),
    missingDetail: 'Clarify hosting, domain, and third-party fee terms'
  },
  {
    id: 24,
    title: '24. Intellectual Property & Ownership',
    tab: 'policies',
    isComplete: Boolean(d.ipOwnershipNotes?.trim()),
    missingDetail: 'Specify IP transfer and ownership terms'
  },
  {
    id: 25,
    title: '25. Confidentiality',
    tab: 'policies',
    isComplete: Boolean(d.confidentialityNotes?.trim()),
    missingDetail: 'Specify confidentiality obligations'
  },
  {
    id: 26,
    title: '26. Content Responsibility',
    tab: 'policies',
    isComplete: Boolean(d.contentResponsibilityNotes?.trim()),
    missingDetail: 'Specify content copyright liability notes'
  },
  {
    id: 27,
    title: '27. Data & Backups',
    tab: 'policies',
    isComplete: Boolean(
      d.backupProvider?.trim() &&
      d.backupFrequency?.trim()
    ),
    missingDetail: 'Specify backup provider and frequency'
  },
  {
    id: 28,
    title: '28. Project Delays / Pause Policy',
    tab: 'policies',
    isComplete: Boolean(
      d.delayThresholdDays?.trim() &&
      d.delayPolicyNotes?.trim()
    ),
    missingDetail: 'Set delay threshold days and pause policy'
  },
  {
    id: 29,
    title: '29. Cancellation & Refund Policy',
    tab: 'policies',
    isComplete: Boolean(d.cancellationPolicyNotes?.trim()),
    missingDetail: 'Specify cancellation policy'
  },
  {
    id: 30,
    title: '30. Limitations & Exclusions',
    tab: 'policies',
    isComplete: Boolean(
      d.limitations?.length > 0 &&
      d.limitations.some(l => l.trim())
    ),
    missingDetail: 'List project limitations and non-guarantees'
  },
  {
    id: 31,
    title: '31. Out-of-Scope Work',
    tab: 'policies',
    isComplete: Boolean(
      d.outOfScope?.length > 0 &&
      d.outOfScope.some(o => o.trim())
    ),
    missingDetail: 'List explicitly excluded out-of-scope work'
  },
  {
    id: 32,
    title: '32. Final Handover Deliverables',
    tab: 'policies',
    isComplete: Boolean(
      d.finalHandoverItems?.length > 0 &&
      d.finalHandoverItems.some(h => h.trim())
    ),
    missingDetail: 'Specify handover items and credentials release'
  },
  {
    id: 33,
    title: '33. Signatures & Document Approval',
    tab: 'signoff',
    isComplete: Boolean(
      d.clientSignoff?.company?.trim() &&
      d.providerSignoff?.company?.trim() &&
      d.documentApproval?.status?.trim()
    ),
    missingDetail: 'Fill signatory companies and document status'
  }
];

export const InteractiveForm: React.FC<InteractiveFormProps> = ({ data, onChange }) => {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('header');
  const [summaryFilter, setSummaryFilter] = useState<'all' | 'incomplete' | 'complete'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSetTab = (e: any) => {
      if (e.detail) setActiveTab(e.detail);
    };
    window.addEventListener('SET_ACTIVE_TAB', handleSetTab);
    return () => window.removeEventListener('SET_ACTIVE_TAB', handleSetTab);
  }, []);

  // Reset scroll position when activeTab changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
    if (sidebarRef.current) {
      const activeBtn = sidebarRef.current.querySelector(`button[data-tab-id="${activeTab}"]`) as HTMLElement;
      if (activeBtn) {
        const container = sidebarRef.current;
        const offsetTop = activeBtn.offsetTop - container.offsetTop;
        container.scrollTo({ top: offsetTop - 40, behavior: 'smooth' });
      }
    }
  }, [activeTab]);

  const wordCount = useMemo(() => {
    const md = prdToMarkdown(data);
    return md.trim().split(/\s+/).filter(w => w.length > 0).length;
  }, [data]);

  const audits = getSectionAudits(data);
  const completedCount = audits.filter(a => a.isComplete).length;
  const incompleteCount = audits.length - completedCount;
  const completionPercentage = Math.round((completedCount / audits.length) * 100);

  const nextMissingAudit = audits.find(a => !a.isComplete);

  const handleJumpToNextMissing = () => {
    if (nextMissingAudit) {
      setActiveTab(nextMissingAudit.tab as any);
      setTimeout(() => {
        const el = document.getElementById(`section-card-${nextMissingAudit.id}`);
        if (el && scrollContainerRef.current) {
          // Scroll the internal container instead of the whole window
          const container = scrollContainerRef.current;
          const offsetTop = el.offsetTop - container.offsetTop;
          container.scrollTo({ top: offsetTop - 20, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleJumpToNextMissing();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextMissingAudit]);

  const handleAutoFillAllMissing = async () => {
    setIsAutoFilling(true);
    try {
      const updated = { ...data };
      if (!updated.projectName) updated.projectName = 'NexCommerce Marketplace';
      if (!updated.clientName) updated.clientName = 'Aura Retail Pvt Ltd';
      if (!updated.serviceProvider) updated.serviceProvider = 'DevCraft Studio';
      if (!updated.projectCost) updated.projectCost = '4,50,000';
      if (!updated.currencySymbol) updated.currencySymbol = '₹';
      if (!updated.estimatedTimeline) updated.estimatedTimeline = '6 Weeks';
      if (!updated.projectDescription) {
        updated.projectDescription = 'NexCommerce Marketplace is a next-generation multi-vendor e-commerce platform featuring AI-driven product recommendations, automated inventory syncing, real-time analytics, and instant checkout.';
      }
      if (!updated.projectObjectives || updated.projectObjectives.length === 0 || !updated.projectObjectives.some(o => o.trim())) {
        updated.projectObjectives = [
          'Enable seamless multi-vendor onboarding and automated catalog management.',
          'Provide hyper-fast sub-100ms product search and dynamic filtering.',
          'Ensure 99.99% uptime with scalable cloud infrastructure and PCI-DSS compliance.'
        ];
      }
      if (!updated.features || updated.features.length === 0 || !updated.features.some(f => f.feature?.trim())) {
        updated.features = [
          { id: '1', feature: 'AI Product Recommendations', priority: 'High', description: 'Personalized product feeds using real-time user browsing behavior.' },
          { id: '2', feature: 'Multi-Currency Checkout', priority: 'High', description: 'Support for international payment gateways and localized currencies.' },
          { id: '3', feature: 'Vendor Analytics Dashboard', priority: 'Medium', description: 'Comprehensive visual metrics for sales, inventory, and payout tracking.' }
        ];
      }
      if (!updated.pages || updated.pages.length === 0 || !updated.pages.some(p => p.trim())) {
        updated.pages = ['Storefront Home', 'Product Detail Page', 'Multi-Vendor Dashboard', 'Checkout & Payment', 'Admin Portal'];
      }
      onChange(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAutoFilling(false);
    }
  };


  const updateField = <K extends keyof PRDData>(key: K, value: PRDData[K]) => {
    onChange({ ...data, [key]: value });
  };

  const updateNestedField = (parent: keyof PRDData, childKey: string, value: unknown) => {
    const parentObj = (data[parent] || {}) as Record<string, unknown>;
    onChange({
      ...data,
      [parent]: {
        ...parentObj,
        [childKey]: value
      }
    });
  };

  // Helper for AI refining a section

  // Feature Helpers
  const addFeature = () => {
    const nextNum = (data.features.length + 1).toString().padStart(2, '0');
    const newFeat: FeatureItem = {
      id: `F-${nextNum}`,
      feature: '',
      description: '',
      priority: 'High'
    };
    updateField('features', [...data.features, newFeat]);
  };

  const removeFeature = (index: number) => {
    const updated = data.features.filter((_, idx) => idx !== index);
    updateField('features', updated);
  };

  const updateFeature = (index: number, key: keyof FeatureItem, value: string) => {
    const updated = [...data.features];
    updated[index] = { ...updated[index], [key]: value };
    updateField('features', updated);
  };

  // Timeline Helpers
  const addTimelinePhase = () => {
    const newPhase: TimelinePhase = { phase: '', duration: '5 Days' };
    updateField('timelinePhases', [...data.timelinePhases, newPhase]);
  };

  const removeTimelinePhase = (index: number) => {
    const updated = data.timelinePhases.filter((_, idx) => idx !== index);
    updateField('timelinePhases', updated);
  };

  // Payment Helpers
  const addPaymentMilestone = () => {
    const newMilestone: PaymentMilestone = { percentage: '20%', milestone: 'Milestone', description: 'Description' };
    updateField('paymentStructure', [...data.paymentStructure, newMilestone]);
  };

  const removePaymentMilestone = (index: number) => {
    const updated = data.paymentStructure.filter((_, idx) => idx !== index);
    updateField('paymentStructure', updated);
  };

  // List Item Helpers
  const handleListChange = (key: keyof PRDData, index: number, value: string) => {
    const arr = [...(data[key] as string[])];
    arr[index] = value;
    updateField(key, arr as PRDData[typeof key]);
  };

  const addListItem = (key: keyof PRDData, defaultValue = '') => {
    const arr = [...(data[key] as string[]), defaultValue];
    updateField(key, arr as PRDData[typeof key]);
  };

  const removeListItem = (key: keyof PRDData, index: number) => {
    const arr = (data[key] as string[]).filter((_, i) => i !== index);
    updateField(key, arr as PRDData[typeof key]);
  };

  const [isAuditExpanded, setIsAuditExpanded] = useState(false);

  const tabs = [
    { id: 'header', label: '0. Header & Basic Terms', icon: FileCheck2 },
    { id: 'overview', label: '1 & 2. Overview & Platforms', icon: Layers },
    { id: 'features', label: '3 & 4. Features & Pages', icon: ListPlus },
    { id: 'roles', label: '5 & 6. Roles & Flows', icon: UserCheck },
    { id: 'design', label: '7 & 8. Design & Tech Stack', icon: Palette },
    { id: 'timeline', label: '14 & 15. Timeline & Pricing', icon: DollarSign },
    { id: 'policies', label: '16 - 32. Policies & Support', icon: Shield },
    { id: 'signoff', label: '33. Signatures & Approval', icon: Clock },
    { id: 'audit', label: 'Quality Audit Summary', icon: CheckCircle2 }
  ];

  return (
    <div id="prd-editor-top" className={`bg-white dark:bg-[#161616] border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-neutral-100 shadow-md rounded-xl overflow-hidden w-full min-w-0 no-print flex flex-col ${isFocusMode ? "fixed inset-0 z-[200]" : "h-[calc(100vh-240px)] min-h-[500px]"}`}>
      {isFocusMode && (
        <div className="sticky top-0 z-[210] flex justify-between items-center p-4 bg-[#EFECE7]/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-4">
            <h2 className="font-serif font-bold text-lg text-[#1A1A1A] dark:text-[#F4F1EE]">Focus Mode</h2>
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="bg-white dark:bg-white/5 border border-black/20 dark:border-white/20 text-xs font-bold text-black/80 dark:text-white/80 p-1.5 outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>
          <button onClick={() => setIsFocusMode(false)} className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-wider text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white transition-colors bg-white dark:bg-white/5 px-3 py-1.5 border border-black/20 dark:border-white/20">
            <Minimize2 className="w-4 h-4" /> Exit
          </button>
        </div>
      )}
      
      {/* Vertical Sidebar + Content Layout */}
      <div className={`flex flex-1 min-h-0 ${isFocusMode ? 'flex-col overflow-y-auto' : 'overflow-hidden'}`}>

        {/* LEFT: Vertical Tab Sidebar (hidden in focus mode) */}
        {!isFocusMode && (
          <div className="flex flex-col w-[52px] sm:w-44 shrink-0 bg-neutral-50 dark:bg-black/20 border-r border-neutral-200 dark:border-white/10 overflow-y-auto">
            <div className="flex flex-col gap-0.5 p-1.5 sm:p-2 flex-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const tabAudits = audits.filter(a => a.tab === tab.id);
                const tabCompleted = tabAudits.filter(a => a.isComplete).length;
                const tabTotal = tabAudits.length;
                const isTabComplete = tabTotal > 0 && tabCompleted === tabTotal;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    title={tab.label}
                    className={`group flex items-center gap-2.5 w-full px-2 py-2.5 rounded-lg transition-all text-left ${
                      isActive
                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                        : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:block text-[10px] font-bold uppercase tracking-wide leading-tight flex-1">{tab.label}</span>
                    {tabTotal > 0 && (
                      <span className={`hidden sm:flex shrink-0 text-[8px] font-mono font-bold items-center justify-center w-5 h-5 rounded-full ${
                        isTabComplete
                          ? isActive ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black' : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                          : isActive ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                      }`}>
                        {isTabComplete ? '✓' : `${tabCompleted}`}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Focus Mode Button at bottom */}
            <div className="p-1.5 sm:p-2 border-t border-neutral-200 dark:border-white/10">
              <button
                onClick={() => setIsFocusMode(true)}
                className="flex items-center gap-2.5 w-full px-2 py-2.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white transition-colors"
                title="Enter Focus Mode"
              >
                <Maximize2 className="w-4 h-4 shrink-0" />
                <span className="hidden sm:block text-[10px] font-bold uppercase tracking-wide">Focus</span>
              </button>
            </div>
          </div>
        )}

          {/* RIGHT: Tab Content (always renders) */}
          <div ref={scrollContainerRef} className={`flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 ${isFocusMode ? 'max-w-4xl mx-auto w-full' : ''}`}>
        
        {/* TAB 0: HEADER & OVERVIEW */}
        {activeTab === 'header' && (
          <div className="space-y-6 animate-fade-in">
            {/* Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black/80 dark:text-white/80 mb-1">Project Name</label>
                <input
                  type="text"
                  value={data.projectName}
                  onChange={(e) => updateField('projectName', e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black/80 dark:text-white/80 mb-1">Client / Company Name</label>
                <input
                  type="text"
                  value={data.clientName}
                  onChange={(e) => updateField('clientName', e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black/80 dark:text-white/80 mb-1">Service Provider</label>
                <input
                  type="text"
                  value={data.serviceProvider}
                  onChange={(e) => updateField('serviceProvider', e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black/80 dark:text-white/80 mb-1">Document Version</label>
                <input
                  type="text"
                  value={data.docVersion}
                  onChange={(e) => updateField('docVersion', e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black/80 dark:text-white/80 mb-1">Date (DD/MM/YYYY)</label>
                <input
                  type="text"
                  value={data.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black/80 dark:text-white/80 mb-1">Currency</label>
                <input
                  type="text"
                  value={data.currencySymbol}
                  onChange={(e) => updateField('currencySymbol', e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20 text-center"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black/80 dark:text-white/80 mb-1">Total Project Cost</label>
                <input
                  type="text"
                  value={data.projectCost}
                  onChange={(e) => updateField('projectCost', e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black/80 dark:text-white/80 mb-1">Estimated Timeline</label>
                <input
                  type="text"
                  value={data.estimatedTimeline}
                  onChange={(e) => updateField('estimatedTimeline', e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 1 & 2: OVERVIEW & PLATFORMS */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* 1.1 Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90">1.1 Project Description</h3>
                  <AIQuickFill field="projectDescription" schemaDescription="string" data={data} onUpdate={(val) => updateField('projectDescription', val)} title="Project Description" />
                </div>
              </div>
              <textarea
                value={data.projectDescription}
                onChange={(e) => updateField('projectDescription', e.target.value)}
                rows={4}
                className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg focus:border-black dark:border-white/30 p-3 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
              />
            </div>

            {/* 1.2 Objectives */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90">1.2 Project Objectives</label>
<AIQuickFill field="projectObjectives" schemaDescription="Array of strings" data={data} onUpdate={(val) => updateField('projectObjectives', val)} title="Project Objectives" />
                </div>
                <button
                  type="button"
                  onClick={() => addListItem('projectObjectives', 'New clear objective')}
                  className="text-xs text-black dark:text-white font-semibold hover:underline flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Objective</span>
                </button>
              </div>
              <div className="space-y-2">
                {data.projectObjectives.map((obj, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="text-black/40 dark:text-white/40 text-xs font-mono w-4">{idx + 1}.</span>
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) => handleListChange('projectObjectives', idx, e.target.value)}
                      className="flex-1 bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg focus:border-black dark:border-white/30 p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem('projectObjectives', idx)}
                      className="text-black/40 dark:text-white/40 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 1.3 Target Users */}
            <div className="border-t border-black dark:border-white/10 pt-4">
              <div className="flex items-center gap-2"><label className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90 block mb-2">1.3 Target Users</label><AIQuickFill field="targetUsers" schemaDescription="Object with keys: primary, secondary, admin (all strings)" data={data} onUpdate={(val) => updateField('targetUsers', val)} title="Target Users" /></div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 block mb-1">Primary Users</span>
                  <input
                    type="text"
                    value={data.targetUsers.primary}
                    onChange={(e) => updateNestedField('targetUsers', 'primary', e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg focus:border-black dark:border-white/30 p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 block mb-1">Secondary Users</span>
                  <input
                    type="text"
                    value={data.targetUsers.secondary}
                    onChange={(e) => updateNestedField('targetUsers', 'secondary', e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg focus:border-black dark:border-white/30 p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 block mb-1">Admin Users</span>
                  <input
                    type="text"
                    value={data.targetUsers.admin}
                    onChange={(e) => updateNestedField('targetUsers', 'admin', e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg focus:border-black dark:border-white/30 p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                  />
                </div>
              </div>
            </div>

            {/* 2. PROJECT SCOPE - Platforms */}
            <div className="border-t border-black dark:border-white/10 pt-4">
              <label className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90 block mb-2">2. Included Platforms (Checkboxes)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white dark:bg-white/5 p-3 border border-black dark:border-white/10">
                {[
                  { key: 'website', label: 'Website' },
                  { key: 'webApp', label: 'Web Application' },
                  { key: 'adminPanel', label: 'Admin Panel' },
                  { key: 'androidApp', label: 'Android Application' },
                  { key: 'iosApp', label: 'iOS Application' },
                  { key: 'apiBackend', label: 'API / Backend' }
                ].map((item) => (
                  <label key={item.key} className="flex items-center space-x-2 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(data.includedPlatforms[item.key as keyof typeof data.includedPlatforms])}
                      onChange={(e) => updateNestedField('includedPlatforms', item.key, e.target.checked)}
                      className="accent-black focus:ring-black"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
              <div className="mt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 block mb-1">Other Platform (Optional)</span>
                <input
                  type="text"
                  value={data.includedPlatforms.other}
                  onChange={(e) => updateNestedField('includedPlatforms', 'other', e.target.value)}
                  placeholder="e.g. Chrome Browser Extension"
                  className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg focus:border-black dark:border-white/30 p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3 & 4: FEATURES & PAGES */}
        {activeTab === 'features' && (
          <div className="space-y-6 animate-fade-in">
            {/* 3. Features Table Builder */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2"><h3 className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90">3. Features &amp; Functional Requirements</h3><AIQuickFill field="features" schemaDescription="Array of objects {id: string, feature: string, description: string, priority: 'High'|'Medium'|'Low'}" data={data} onUpdate={(val) => updateField('features', val)} title="Features" /></div>
                  <p className="text-[11px] text-black/70 dark:text-white/70">Add, edit, or prioritize key system features</p>
                </div>
                <button
                  type="button"
                  onClick={addFeature}
                  className="bg-black dark:bg-white text-white dark:text-[#121212] hover:bg-black dark:hover:bg-white/80 px-3 py-1.5 text-xs font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Feature</span>
                </button>
              </div>

              <div className="space-y-3">
                {data.features.map((f, idx) => (
                  <div key={idx} className="bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-3 text-sm space-y-2">
                    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
                      <input
                        type="text"
                        value={f.id}
                        onChange={(e) => updateFeature(idx, 'id', e.target.value)}
                        className="w-16 bg-neutral-50 dark:bg-white/5 border border-black dark:border-white/10 font-mono text-black dark:text-white font-bold px-2 py-1 outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20 text-xs"
                      />
                      <input
                        type="text"
                        value={f.feature}
                        onChange={(e) => updateFeature(idx, 'feature', e.target.value)}
                        placeholder="Feature Name"
                        className="flex-1 bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg px-2 py-1 font-semibold text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20 text-xs"
                      />
                      <select
                        value={f.priority}
                        onChange={(e) => updateFeature(idx, 'priority', e.target.value as 'High' | 'Medium' | 'Low')}
                        className="bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg text-[#1A1A1A] dark:text-[#F4F1EE] px-2 py-1 font-semibold text-xs outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="text-black/40 dark:text-white/40 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      value={f.description}
                      onChange={(e) => updateFeature(idx, 'description', e.target.value)}
                      placeholder="Feature functional behavior & details..."
                      rows={2}
                      className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-[#1A1A1A] dark:text-[#F4F1EE] text-xs outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Pages / Screens */}
            <div className="border-t border-black dark:border-white/10 pt-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><h3 className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90">4. Pages / Screens List</h3><AIQuickFill field="pages" schemaDescription="Array of strings representing page names" data={data} onUpdate={(val) => updateField('pages', val)} title="Pages" /></div>
                <button
                  type="button"
                  onClick={() => addListItem('pages', 'New Screen')}
                  className="text-xs text-black dark:text-white font-semibold hover:underline flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Page</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.pages.map((p, idx) => (
                  <div key={idx} className="flex items-center space-x-2 bg-white dark:bg-white/5 p-2 border border-black dark:border-white/10">
                    <span className="text-black/40 dark:text-white/40 text-xs font-mono w-5">{idx + 1}.</span>
                    <input
                      type="text"
                      value={p}
                      onChange={(e) => handleListChange('pages', idx, e.target.value)}
                      className="flex-1 bg-transparent text-xs text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem('pages', idx)}
                      className="text-black/40 dark:text-white/40 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5 & 6: ROLES & FLOWS */}
        {activeTab === 'roles' && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-2"><h3 className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90">5. User Roles &amp; Permissions</h3><AIQuickFill field="userRoles" schemaDescription="Object with keys: guest, registeredUser, admin, superAdmin (all strings)" data={data} onUpdate={(val) => updateField('userRoles', val)} title="User Roles & Permissions" /></div>
            <div className="space-y-3">
              {[
                { key: 'guest', label: 'Guest Role Permissions' },
                { key: 'registeredUser', label: 'Registered User Role Permissions' },
                { key: 'admin', label: 'Admin Role Permissions' },
                { key: 'superAdmin', label: 'Super Admin Role Permissions' }
              ].map((role) => (
                <div key={role.key}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1">{role.label}</label>
                  <textarea
                    value={data.userRoles[role.key as keyof typeof data.userRoles]}
                    onChange={(e) => updateNestedField('userRoles', role.key, e.target.value)}
                    rows={2}
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                  />
                </div>
              ))}
            </div>

            <div className="border-t border-black dark:border-white/10 pt-4">
              <div className="flex items-center gap-2 mb-3"><h3 className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90">6. User Workflows</h3><AIQuickFill field="userFlows" schemaDescription="Object with keys: registration, primaryProductFlow, adminFlow (all strings)" data={data} onUpdate={(val) => updateField('userFlows', val)} title="User Workflows" /></div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1">Registration Flow</label>
                  <input
                    type="text"
                    value={data.userFlows.registration}
                    onChange={(e) => updateNestedField('userFlows', 'registration', e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg font-mono text-xs text-[#1A1A1A] dark:text-[#F4F1EE] p-2.5 outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1">Primary Product Flow</label>
                  <input
                    type="text"
                    value={data.userFlows.primaryProductFlow}
                    onChange={(e) => updateNestedField('userFlows', 'primaryProductFlow', e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg font-mono text-xs text-[#1A1A1A] dark:text-[#F4F1EE] p-2.5 outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1">Admin Flow</label>
                  <input
                    type="text"
                    value={data.userFlows.adminFlow}
                    onChange={(e) => updateNestedField('userFlows', 'adminFlow', e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg font-mono text-xs text-[#1A1A1A] dark:text-[#F4F1EE] p-2.5 outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7 & 8: DESIGN & TECH STACK */}
        {activeTab === 'design' && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-2"><h3 className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90">7. UI/UX &amp; Design Requirements</h3><AIQuickFill field="design" schemaDescription="Object with keys: style, primaryColor, secondaryColor, typography, referenceWebsites (all strings)" data={data} onUpdate={(val) => updateField('design', val)} title="UI/UX & Design" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1">Visual Style</label>
                <input
                  type="text"
                  value={data.design.style}
                  onChange={(e) => updateNestedField('design', 'style', e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1">Primary Color</label>
                <input
                  type="text"
                  value={data.design.primaryColor}
                  onChange={(e) => updateNestedField('design', 'primaryColor', e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1">Secondary Color</label>
                <input
                  type="text"
                  value={data.design.secondaryColor}
                  onChange={(e) => updateNestedField('design', 'secondaryColor', e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1">Typography Font</label>
                <input
                  type="text"
                  value={data.design.typography}
                  onChange={(e) => updateNestedField('design', 'typography', e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1">Reference Websites / Apps</label>
                <input
                  type="text"
                  value={data.design.referenceWebsites}
                  onChange={(e) => updateNestedField('design', 'referenceWebsites', e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                />
              </div>
            </div>

            <div className="border-t border-black dark:border-white/10 pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center gap-2"><h3 className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90">8. Technical Architecture Stack</h3><AIQuickFill field="techStack" schemaDescription="Object with keys: frontend, backend, database, authentication, storage, hosting, analytics (all strings)" data={data} onUpdate={(val) => updateField('techStack', val)} title="Tech Stack" /></div>

                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'frontend', label: 'Frontend Framework' },
                  { key: 'backend', label: 'Backend API' },
                  { key: 'database', label: 'Database' },
                  { key: 'authentication', label: 'Authentication' },
                  { key: 'storage', label: 'Cloud Storage' },
                  { key: 'hosting', label: 'Hosting Provider' },
                  { key: 'analytics', label: 'Analytics' }
                ].map((item) => (
                  <div key={item.key}>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1">{item.label}</label>
                    <input
                      type="text"
                      value={data.techStack[item.key as keyof typeof data.techStack]}
                      onChange={(e) => updateNestedField('techStack', item.key, e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 14 & 15: TIMELINE & PRICING */}
        {activeTab === 'timeline' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><h3 className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90">14. Timeline Phase Breakdown</h3><AIQuickFill field="timelinePhases" schemaDescription="Array of objects {phase: string, duration: string}" data={data} onUpdate={(val) => updateField('timelinePhases', val)} title="Timeline Phase Breakdown" /></div>
                <button
                  type="button"
                  onClick={addTimelinePhase}
                  className="bg-black dark:bg-white text-white dark:text-[#121212] hover:bg-black dark:hover:bg-white/80 px-2.5 py-1 text-xs font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Phase</span>
                </button>
              </div>

              <div className="space-y-2">
                {data.timelinePhases.map((t, idx) => (
                  <div key={idx} className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-white dark:bg-white/5 p-2 border border-black dark:border-white/10">
                    <input
                      type="text"
                      value={t.phase}
                      onChange={(e) => {
                        const updated = [...data.timelinePhases];
                        updated[idx].phase = e.target.value;
                        updateField('timelinePhases', updated);
                      }}
                      placeholder="Phase Name"
                      className="flex-1 min-w-[120px] bg-transparent text-xs text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20 font-medium"
                    />
                    <input
                      type="text"
                      value={t.duration}
                      onChange={(e) => {
                        const updated = [...data.timelinePhases];
                        updated[idx].duration = e.target.value;
                        updateField('timelinePhases', updated);
                      }}
                      placeholder="e.g. 5 Days"
                      className="w-24 bg-neutral-50 dark:bg-white/5 border border-black dark:border-white/10 text-black dark:text-white text-right px-2 py-1 font-mono text-xs outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                    />
                    <button
                      type="button"
                      onClick={() => removeTimelinePhase(idx)}
                      className="text-black/40 dark:text-white/40 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-black dark:border-white/10 pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><h3 className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90">15. Payment Milestones</h3><AIQuickFill field="paymentStructure" schemaDescription="Array of objects {percentage: string, milestone: string, description: string}" data={data} onUpdate={(val) => updateField('paymentStructure', val)} title="Payment Milestones" /></div>
                <button
                  type="button"
                  onClick={addPaymentMilestone}
                  className="bg-black dark:bg-white text-white dark:text-[#121212] hover:bg-black dark:hover:bg-white/80 px-2.5 py-1 text-xs font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Milestone</span>
                </button>
              </div>

              <div className="space-y-3">
                {data.paymentStructure.map((p, idx) => (
                  <div key={idx} className="bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-3 space-y-2">
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                      <input
                        type="text"
                        value={p.percentage}
                        onChange={(e) => {
                          const updated = [...data.paymentStructure];
                          updated[idx].percentage = e.target.value;
                          updateField('paymentStructure', updated);
                        }}
                        className="w-16 shrink-0 bg-neutral-50 dark:bg-white/5 border border-black dark:border-white/10 font-bold text-black dark:text-white px-2 py-1 text-center text-xs outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                      />
                      <input
                        type="text"
                        value={p.milestone}
                        onChange={(e) => {
                          const updated = [...data.paymentStructure];
                          updated[idx].milestone = e.target.value;
                          updateField('paymentStructure', updated);
                        }}
                        className="flex-1 min-w-[120px] bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg text-[#1A1A1A] dark:text-[#F4F1EE] font-semibold px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                      />
                      <button
                        type="button"
                        onClick={() => removePaymentMilestone(idx)}
                        className="text-black/40 dark:text-white/40 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={p.description}
                      onChange={(e) => {
                        const updated = [...data.paymentStructure];
                        updated[idx].description = e.target.value;
                        updateField('paymentStructure', updated);
                      }}
                      className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 16-32: POLICIES & SUPPORT */}
        {activeTab === 'policies' && (
          <div className="space-y-5 animate-fade-in">
            
            {/* 10. Security Practices */}
            <div className="mb-6 pb-6 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90">10. Security Practices &amp; Policy</h3>
                  <AIQuickFill 
                    field="securityPractices" 
                    schemaDescription="Array of strings" 
                    data={data} 
                    onUpdate={(val) => updateField('securityPractices', val)} 
                    title="Security Policy" 
                  />
                </div>
                <button
                  type="button"
                  onClick={() => addListItem('securityPractices', 'New Security Practice')}
                  className="text-xs text-black dark:text-white font-semibold hover:underline flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Rule</span>
                </button>
              </div>
              
              <div className="space-y-2">
                {data.securityPractices?.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleListChange('securityPractices', idx, e.target.value)}
                      className="flex-1 bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem('securityPractices', idx)}
                      className="p-2 text-black/40 hover:text-red-500 dark:text-white/40 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <h3 className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90">Policies, Warranty &amp; Exclusions</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1">Design Revision Rounds</label>
                <input
                  type="text"
                  value={data.designRevisions}
                  onChange={(e) => updateField('designRevisions', e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1">Development Revision Rounds</label>
                <input
                  type="text"
                  value={data.devRevisions}
                  onChange={(e) => updateField('devRevisions', e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1">Post-Launch Support Period</label>
              <input
                type="text"
                value={data.supportPeriod}
                onChange={(e) => updateField('supportPeriod', e.target.value)}
                className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] font-semibold outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                placeholder="30 Days"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90">31. Out-Of-Scope Exclusions</label>
                <button
                  type="button"
                  onClick={() => addListItem('outOfScope', 'New exclusion')}
                  className="text-xs text-black dark:text-white font-semibold hover:underline flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </div>
              <div className="space-y-2">
                {data.outOfScope.map((o, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={o}
                      onChange={(e) => handleListChange('outOfScope', idx, e.target.value)}
                      className="flex-1 bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem('outOfScope', idx)}
                      className="text-black/40 dark:text-white/40 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Legal Clauses Toggle */}
            <div className="pt-4 border-t border-black dark:border-white/10">
              <div className="flex items-center gap-2"><h3 className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90 mb-3">Additional Legal Clauses (Optional)</h3><AIQuickFill field="additionalLegalClauses" schemaDescription="Object with keys: nda, ipAssignment, nonCompete, termination (all booleans)" data={data} onUpdate={(val) => updateField('additionalLegalClauses', val)} title="Additional Legal Clauses" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.additionalLegalClauses?.nda || false}
                    onChange={(e) => updateField('additionalLegalClauses', Object.assign({ nda: false, ipAssignment: false, nonCompete: false, termination: false }, data.additionalLegalClauses, { nda: e.target.checked }))}
                    className="mt-1 accent-black"
                  />
                  <div>
                    <span className="block text-xs font-bold text-[#1A1A1A] dark:text-[#F4F1EE]">Non-Disclosure Agreement (NDA)</span>
                    <span className="block text-[10px] text-black/70 dark:text-white/70">Confidentiality clause for sensitive information.</span>
                  </div>
                </label>
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.additionalLegalClauses?.ipAssignment || false}
                    onChange={(e) => updateField('additionalLegalClauses', Object.assign({ nda: false, ipAssignment: false, nonCompete: false, termination: false }, data.additionalLegalClauses, { ipAssignment: e.target.checked }))}
                    className="mt-1 accent-black"
                  />
                  <div>
                    <span className="block text-xs font-bold text-[#1A1A1A] dark:text-[#F4F1EE]">IP Assignment</span>
                    <span className="block text-[10px] text-black/70 dark:text-white/70">Transfers IP ownership to client upon final payment.</span>
                  </div>
                </label>
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.additionalLegalClauses?.nonCompete || false}
                    onChange={(e) => updateField('additionalLegalClauses', Object.assign({ nda: false, ipAssignment: false, nonCompete: false, termination: false }, data.additionalLegalClauses, { nonCompete: e.target.checked }))}
                    className="mt-1 accent-black"
                  />
                  <div>
                    <span className="block text-xs font-bold text-[#1A1A1A] dark:text-[#F4F1EE]">Non-Compete</span>
                    <span className="block text-[10px] text-black/70 dark:text-white/70">Restricts building an exact replica for competitors.</span>
                  </div>
                </label>
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.additionalLegalClauses?.termination || false}
                    onChange={(e) => updateField('additionalLegalClauses', Object.assign({ nda: false, ipAssignment: false, nonCompete: false, termination: false }, data.additionalLegalClauses, { termination: e.target.checked }))}
                    className="mt-1 accent-black"
                  />
                  <div>
                    <span className="block text-xs font-bold text-[#1A1A1A] dark:text-[#F4F1EE]">Termination Terms</span>
                    <span className="block text-[10px] text-black/70 dark:text-white/70">14-day notice and prorated payment agreement.</span>
                  </div>
                </label>
              </div>
            </div>

          </div>
        )}

        {/* TAB 33: SIGNATURES & APPROVAL */}
        {activeTab === 'signoff' && (
          <div className="space-y-5 animate-fade-in">
            <h3 className="text-xs font-bold uppercase tracking-wider text-black/90 dark:text-white/90">33. Final Sign-Off &amp; Document Approval</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-white/5 p-4 border border-black dark:border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-black dark:text-white uppercase tracking-wider">Client Signatory</h4>
                <div>
                  <label className="block text-[10px] text-black/70 dark:text-white/70 mb-1">Client Name</label>
                  <input
                    type="text"
                    value={data.clientSignoff.name}
                    onChange={(e) => updateNestedField('clientSignoff', 'name', e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-black/70 dark:text-white/70 mb-1">Company</label>
                  <input
                    type="text"
                    value={data.clientSignoff.company}
                    onChange={(e) => updateNestedField('clientSignoff', 'company', e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-black/70 dark:text-white/70 mb-1">Signature Date</label>
                  <input
                    type="text"
                    value={data.clientSignoff.signatureDate}
                    onChange={(e) => updateNestedField('clientSignoff', 'signatureDate', e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20 mb-3"
                  />
                  <SignatureCapture 
                    label="Client" 
                    value={data.clientSignoff.signatureDataUrl} 
                    onChange={(val) => updateNestedField('clientSignoff', 'signatureDataUrl', val)} 
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-white/5 p-4 border border-black dark:border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-black dark:text-white uppercase tracking-wider">Service Provider Signatory</h4>
                <div>
                  <label className="block text-[10px] text-black/70 dark:text-white/70 mb-1">Provider Name</label>
                  <input
                    type="text"
                    value={data.providerSignoff.name}
                    onChange={(e) => updateNestedField('providerSignoff', 'name', e.target.value)}
                    placeholder="e.g. Vikram Patel"
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-black/70 dark:text-white/70 mb-1">Company</label>
                  <input
                    type="text"
                    value={data.providerSignoff.company}
                    onChange={(e) => updateNestedField('providerSignoff', 'company', e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-black/70 dark:text-white/70 mb-1">Signature Date</label>
                  <input
                    type="text"
                    value={data.providerSignoff.signatureDate}
                    onChange={(e) => updateNestedField('providerSignoff', 'signatureDate', e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20 mb-3"
                  />
                  <SignatureCapture 
                    label="Provider" 
                    value={data.providerSignoff.signatureDataUrl} 
                    onChange={(val) => updateNestedField('providerSignoff', 'signatureDataUrl', val)} 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-white/5 p-4 border border-black dark:border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-black dark:text-white uppercase tracking-wider">Document Status &amp; Approval Dates</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-black/70 dark:text-white/70 mb-1">Approval Status</label>
                  <select
                    value={data.documentApproval.status}
                    onChange={(e) => updateNestedField('documentApproval', 'status', e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg text-black dark:text-white font-bold p-2.5 text-sm outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-black/70 dark:text-white/70 mb-1">Project Start Date</label>
                  <input
                    type="text"
                    value={data.documentApproval.projectStartDate}
                    onChange={(e) => updateNestedField('documentApproval', 'projectStartDate', e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-black/70 dark:text-white/70 mb-1">Expected Delivery Date</label>
                  <input
                    type="text"
                    value={data.documentApproval.expectedDeliveryDate}
                    onChange={(e) => updateNestedField('documentApproval', 'expectedDeliveryDate', e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg p-2.5 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
              {/* =========================================
          PRD SECTION COMPLETION AUDIT & SUMMARY
         ========================================= */}
      <div id="prd-audit-summary" className="bg-neutral-50 dark:bg-white/5 border-t border-neutral-200 dark:border-white/10 p-4 sm:p-5 mt-10 rounded-xl space-y-4">
        
        {/* Header Bar with Toggle & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-black/10 dark:border-white/10">
          <div 
            className="flex items-center space-x-2 cursor-pointer select-none group" 
            onClick={() => {
              if (activeTab !== 'audit') setIsAuditExpanded(!isAuditExpanded);
            }}
          >
            <span className="bg-black dark:bg-white text-white dark:text-[#121212] px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest font-bold rounded-xs">
              Quality Audit
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-[#1A1A1A] dark:text-[#F4F1EE] uppercase tracking-wider font-sans group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              PRD Section Completion Summary
            </h3>
            <span className="text-xs font-mono font-bold text-neutral-500 dark:text-neutral-400">
              ({completedCount} / {audits.length})
            </span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {activeTab !== 'audit' && (
              <button
                type="button"
                onClick={() => setIsAuditExpanded(!isAuditExpanded)}
                className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white dark:bg-white/10 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-white/20 hover:bg-neutral-100 dark:hover:bg-white/20 transition-all rounded-md flex items-center space-x-1.5"
              >
                <span>{isAuditExpanded ? 'Hide Details' : 'Show Details'}</span>
                {isAuditExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
            {activeTab !== 'audit' ? (
              <button
                type="button"
                onClick={() => setActiveTab('audit')}
                className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-all rounded-md"
              >
                Full Audit Tab →
              </button>
            ) : (
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-sm">
                Dedicated Audit Mode
              </span>
            )}
          </div>
        </div>

        {/* Collapsible / Tab Content Body */}
        {(isAuditExpanded || activeTab === 'audit') && (
          <div className="space-y-5 pt-2 animate-fade-in">
            {/* Header Description & Overall Metric */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-4">
              <div>
                <p className="text-xs text-black/80 dark:text-white/80">
                  Real-time completeness verification across all 33 required PRD document sections.
                </p>
              </div>

              <div className="flex items-center space-x-3 bg-white dark:bg-white/5 border border-black/15 dark:border-white/15 px-4 py-2.5 shadow-2xs shrink-0 rounded-lg">
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-[#1A1A1A] dark:text-[#F4F1EE]">
                    {completedCount} / {audits.length} Sections
                  </div>
                  <div className="text-[10px] text-black/70 dark:text-white/70 uppercase tracking-wider font-medium">
                    {completionPercentage === 100
                      ? '100% Complete'
                      : `${incompleteCount} Missing Section${incompleteCount > 1 ? 's' : ''}`}
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                  completionPercentage === 100 
                    ? 'bg-black dark:bg-white text-white dark:text-[#121212]' 
                    : completionPercentage >= 80 
                    ? 'bg-emerald-800 text-white dark:text-[#121212]' 
                    : 'bg-amber-600 text-white dark:text-[#121212]'
                }`}>
                  {completionPercentage}%
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] uppercase font-bold text-black/80 dark:text-white/80 tracking-wider font-mono">
                <span>Overall Completeness</span>
                <span>{completedCount} of {audits.length} Sections Filled ({completionPercentage}%)</span>
              </div>
              <div className="w-full h-2.5 bg-black/10 dark:bg-white/10 border border-black dark:border-white/20 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    completionPercentage === 100 ? 'bg-black dark:bg-white' : completionPercentage >= 80 ? 'bg-emerald-700' : 'bg-amber-600'
                  }`}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Filter Controls & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setSummaryFilter('all')}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-colors rounded-md ${
                    summaryFilter === 'all'
                      ? 'bg-black dark:bg-white text-white dark:text-[#121212] border-black dark:border-white/30'
                      : 'bg-white dark:bg-white/5 text-black/90 dark:text-white/90 border-black/15 dark:border-white/15 hover:border-black dark:hover:border-white/30'
                  }`}
                >
                  All Sections ({audits.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSummaryFilter('incomplete')}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-colors flex items-center space-x-1.5 rounded-md ${
                    summaryFilter === 'incomplete'
                      ? 'bg-amber-600 text-white border-amber-700'
                      : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:border-amber-500/50'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Missing ({incompleteCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSummaryFilter('complete')}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-colors flex items-center space-x-1.5 rounded-md ${
                    summaryFilter === 'complete'
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:border-emerald-500/50'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Completed ({completedCount})</span>
                </button>
                {incompleteCount > 0 && (
                  <button
                    type="button"
                    onClick={handleAutoFillAllMissing}
                    disabled={isAutoFilling}
                    className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-md shadow-xs flex items-center space-x-1.5 disabled:opacity-50 transition-all ml-1 shrink-0"
                  >
                    {isAutoFilling ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Auto-Filling...</>
                    ) : (
                      <><Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" /> Auto-Fill Missing with AI</>
                    )}
                  </button>
                )}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-black/40 dark:text-white/40" />
                <input
                  type="text"
                  placeholder="Filter section title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-white/5 border border-black dark:border-white/20 focus:border-black dark:border-white/30 pl-8 pr-3 py-1.5 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20 font-sans rounded-md"
                />
              </div>
            </div>

            {/* Section Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {audits
                .filter((audit) => {
                  if (summaryFilter === 'incomplete') return !audit.isComplete;
                  if (summaryFilter === 'complete') return audit.isComplete;
                  return true;
                })
                .filter((audit) => {
                  if (!searchQuery.trim()) return true;
                  const q = searchQuery.toLowerCase();
                  return (
                    audit.title.toLowerCase().includes(q) ||
                    (audit.missingDetail && audit.missingDetail.toLowerCase().includes(q))
                  );
                })
                .map((audit) => (
                  <div
                    key={audit.id}
                    className={`p-3 bg-white dark:bg-white/5 border rounded-lg transition flex flex-col justify-between ${
                      audit.isComplete
                        ? 'border-neutral-200 dark:border-white/10 hover:border-black dark:hover:border-white/40'
                        : 'border-amber-400 bg-amber-50/30 dark:bg-amber-950/20 hover:border-amber-600'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-[#1A1A1A] dark:text-[#F4F1EE] line-clamp-1">
                          {audit.title}
                        </span>
                        {audit.isComplete ? (
                          <span className="shrink-0 text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold px-1.5 py-0.5 uppercase tracking-wider flex items-center space-x-1 font-mono rounded-xs">
                            <Check className="w-3 h-3 inline" />
                            <span>Filled</span>
                          </span>
                        ) : (
                          <span className="shrink-0 text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-bold px-1.5 py-0.5 uppercase tracking-wider flex items-center space-x-1 font-mono rounded-xs">
                            <AlertTriangle className="w-3.5 h-3.5 inline" />
                            <span>Empty</span>
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-black/80 dark:text-white/80 mt-1.5 min-h-[32px] line-clamp-2">
                        {audit.isComplete
                          ? 'Section requirement satisfied and validated.'
                          : audit.missingDetail || 'Missing required details.'}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-2 min-w-0">
                      <span className="text-[9px] font-mono text-black/40 dark:text-white/40 uppercase tracking-wider truncate">
                        Tab: {tabs.find((t) => t.id === audit.tab)?.label.split('.')[0] || audit.tab}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab(audit.tab);
                        }}
                        className={`text-[10px] shrink-0 font-bold uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center space-x-1 transition-colors ${
                          audit.isComplete
                            ? 'text-black/80 dark:text-white/80 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-[#121212] border border-neutral-300 dark:border-white/20'
                            : 'bg-black dark:bg-white text-white dark:text-[#121212] hover:bg-neutral-800 dark:hover:bg-white/80'
                        }`}
                      >
                        <span>{audit.isComplete ? 'Edit Section' : 'Fix Field'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

      </div>
    </div>
  </div>

      {/* Editor Word Count Footer */}
      <div className="bg-white dark:bg-white/5 border-t border-black dark:border-white/10 px-4 py-3 flex flex-wrap items-center justify-between no-print sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-black/80 dark:text-white/80">Live Word Count Tracker</span>
        </div>
        <div className="flex items-center space-x-3 mt-2 sm:mt-0">
          <div className="text-[10px] text-black/70 dark:text-white/70 font-medium hidden sm:block">
            Monitors PRD & Legal Agreement Length
          </div>
          <span className="bg-white dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-[#F4F1EE] border border-black dark:border-white/10 px-3 py-1 text-xs font-mono font-bold tracking-wider">
            {wordCount.toLocaleString()} WORDS
          </span>
        </div>
      </div>

      {/* Floating Action Pill: Jump to Next Incomplete Section */}
      {nextMissingAudit && (
        <button
          type="button"
          onClick={handleJumpToNextMissing}
          className="fixed bottom-16 right-6 z-[90] bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-full shadow-2xl flex items-center space-x-2 transition-all transform hover:scale-105 active:scale-95 border border-white/20 dark:border-black/20"
          title="Jump to Next Incomplete Section (Alt+N)"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
          <span>Next Missing: {nextMissingAudit.title.split('.')[0]}. {nextMissingAudit.title.split('.')[1]}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
