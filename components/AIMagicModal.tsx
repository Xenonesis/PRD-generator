'use client';

import React, { useState } from 'react';
import { Sparkles, X, Loader2, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { PRDData } from '@/types/prd';

interface AIMagicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (prd: PRDData) => void;
}

export const AIMagicModal: React.FC<AIMagicModalProps> = ({ isOpen, onClose, onGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [clientName, setClientName] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');
  const [projectCost, setProjectCost] = useState('');
  const [timeline, setTimeline] = useState('');
  const [industry, setIndustry] = useState('E-Commerce');
  const [tone, setTone] = useState('Professional');

  const [loading, setLoading] = useState(false);
  const [stepText, setStepText] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please provide a brief description of the project.');
      return;
    }

    setLoading(true);
    setError(null);
    setStepText('Analyzing project requirements...');

    try {
      setTimeout(() => setStepText('Generating 33 PRD sections & architecture...'), 1500);
      setTimeout(() => setStepText('Calculating timeline, payment structure & feature priorities...'), 3500);

      const res = await fetch('/api/gemini/generate-prd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          clientName,
          serviceProvider,
          projectCost,
          timeline,
          industry,
          tone
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate PRD.');
      }

      if (data.prd) {
        onGenerated(data.prd);
        onClose();
      } else {
        throw new Error('Invalid PRD format returned from AI.');
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Error generating PRD with AI';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'Artisanal Bakery E-Commerce with WhatsApp order tracking, Razorpay UPI, and inventory manager',
    'AI-powered Customer Support Ticketing System with auto-tagging, SLA metrics, and Slack bot',
    'Fitness & Workout Mobile App with live step tracking, meal plans, and trainer booking',
    'Real Estate Property Marketplace with virtual 360 tours, agent chat, and lead CRM'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 dark:bg-white/60 backdrop-blur-xs animate-fade-in no-print">
      <div className="bg-[#F4F1EE] dark:bg-[#121212] border border-black dark:border-white/30 text-[#1A1A1A] dark:text-[#F4F1EE] max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative overflow-y-auto max-h-[92vh]" style={{ overscrollBehavior: 'contain' }}>
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-black dark:bg-white" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black dark:border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-[#121212] flex items-center justify-center font-serif text-sm font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#1A1A1A] dark:text-[#F4F1EE] flex items-center gap-2">
                AI Magic PRD Generator
                <span className="text-[10px] bg-black/5 dark:bg-white/5 text-black dark:text-white border border-black dark:border-white/20 px-2 py-0.5 font-sans font-bold uppercase tracking-wider">Gemini 3.6</span>
              </h3>
              <p className="text-xs text-black/60 dark:text-white/60">Transform a project prompt into a complete 33-section PRD &amp; Agreement</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white p-1.5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-4 space-y-4 text-sm">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-700 font-bold ml-2">×</button>
            </div>
          )}

          {/* Prompt Box */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1.5 flex items-center justify-between">
              <span>Project Description or Client Prompt *</span>
              <span className="text-[10px] text-black/50 dark:text-white/50 font-normal normal-case">Describe your idea or paste client notes</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              rows={4}
              placeholder="e.g. Build a SaaS platform for doctors to schedule video appointments, generate digital prescription PDFs, accept online payments via Razorpay, and manage clinic staff..."
              className="w-full bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/10 focus:border-black dark:border-white/30 p-3 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] placeholder-black/30 outline-none transition"
            />
          </div>

          {/* Quick Prompts */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-black/50 dark:text-white/50 block mb-1.5">Or try a sample prompt:</span>
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(p)}
                  disabled={loading}
                  className="text-[11px] bg-[#EFECE7] dark:bg-[#1E1E1E] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-[#121212] border border-black dark:border-white/10 text-[#1A1A1A] dark:text-[#F4F1EE] px-2.5 py-1 text-left transition"
                >
                  {p.length > 55 ? p.substring(0, 55) + '...' : p}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">Client / Company Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                disabled={loading}
                placeholder="e.g. Acme Corp India"
                className="w-full bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/10 focus:border-black dark:border-white/30 px-3 py-1.5 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">Service Provider / Your Agency</label>
              <input
                type="text"
                value={serviceProvider}
                onChange={(e) => setServiceProvider(e.target.value)}
                disabled={loading}
                placeholder="e.g. DevCraft Solutions"
                className="w-full bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/10 focus:border-black dark:border-white/30 px-3 py-1.5 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">Target Budget (INR/USD)</label>
              <input
                type="text"
                value={projectCost}
                onChange={(e) => setProjectCost(e.target.value)}
                disabled={loading}
                placeholder="e.g. 5,00,000 or $8,000"
                className="w-full bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/10 focus:border-black dark:border-white/30 px-3 py-1.5 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">Target Timeline</label>
              <input
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                disabled={loading}
                placeholder="e.g. 6 Weeks"
                className="w-full bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/10 focus:border-black dark:border-white/30 px-3 py-1.5 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] outline-none"
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">Tone of Voice</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                disabled={loading}
                className="w-full bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/10 focus:border-black dark:border-white/30 px-3 py-1.5 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] outline-none"
              >
                <option value="Professional">Professional (Default)</option>
                <option value="Formal">Formal & Legal</option>
                <option value="Concise">Concise & Direct</option>
                <option value="Technical">Technical & Detailed</option>
                <option value="Persuasive">Persuasive & Sales-Oriented</option>
                <option value="Creative">Creative & Playful</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-black dark:border-white/10 flex items-center justify-between">
          <div className="text-xs text-black/60 dark:text-white/60">
            {loading ? (
              <span className="flex items-center text-black dark:text-white font-semibold animate-pulse">
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                {stepText}
              </span>
            ) : (
              <span className="flex items-center text-black/60 dark:text-white/60">
                <Zap className="w-3.5 h-3.5 mr-1 text-black dark:text-white" />
                Generates complete 33-section structure instantly
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition"
            >
              Cancel
            </button>

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="flex items-center space-x-1.5 bg-black dark:bg-white hover:bg-black dark:hover:bg-white/80 disabled:opacity-50 text-white dark:text-[#121212] px-5 py-2 text-xs font-bold uppercase tracking-wider shadow-sm transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating PRD...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Full PRD</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
