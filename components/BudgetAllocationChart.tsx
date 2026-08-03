'use client';

import React from 'react';
import { PRDData } from '@/types/prd';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

interface BudgetAllocationChartProps {
  data: PRDData;
}

const SLICE_COLORS = [
  '#0F172A', // Slate 900
  '#334155', // Slate 700
  '#475569', // Slate 600
  '#64748B', // Slate 500
  '#94A3B8', // Slate 400
  '#CBD5E1', // Slate 300
];

const DARK_SLICE_COLORS = [
  '#F8FAFC', // Slate 50
  '#E2E8F0', // Slate 200
  '#CBD5E1', // Slate 300
  '#94A3B8', // Slate 400
  '#64748B', // Slate 500
  '#475569', // Slate 600
];

export const BudgetAllocationChart: React.FC<BudgetAllocationChartProps> = ({ data }) => {
  const costString = data.projectCost ? data.projectCost.toString().replace(/[^0-9.]/g, '') : '0';
  const totalCost = parseFloat(costString) || 0;
  const currency = data.currencySymbol || '$';

  // Helper to convert phase duration text into approximate relative days
  const parseDurationDays = (durationStr: string): number => {
    if (!durationStr) return 1;
    const lower = durationStr.toLowerCase();
    const num = parseFloat(lower.replace(/[^0-9.]/g, '')) || 1;
    if (lower.includes('week')) return num * 7;
    if (lower.includes('month')) return num * 30;
    return num;
  };

  const phases = data.timelinePhases && data.timelinePhases.length > 0
    ? data.timelinePhases
    : [
        { phase: 'Requirements & Planning', duration: '5 Days' },
        { phase: 'UI/UX Design', duration: '7 Days' },
        { phase: 'Frontend & Backend', duration: '18 Days' },
        { phase: 'Testing & QA', duration: '5 Days' },
        { phase: 'Deployment & Handover', duration: '7 Days' },
      ];

  const phaseDaysList = phases.map(p => ({
    name: p.phase,
    duration: p.duration,
    days: parseDurationDays(p.duration),
  }));

  const totalDays = phaseDaysList.reduce((acc, p) => acc + p.days, 0) || 1;

  const budgetData = phaseDaysList.map(p => {
    const ratio = p.days / totalDays;
    const amount = Math.round(ratio * totalCost);
    const percentage = Math.round(ratio * 100);
    return {
      name: p.name,
      duration: p.duration,
      value: amount > 0 ? amount : percentage,
      amount,
      percentage,
      formattedAmount: totalCost > 0
        ? `${currency}${new Intl.NumberFormat('en-US').format(amount)}`
        : `${percentage}%`,
    };
  });

  return (
    <div className="bg-white dark:bg-[#1E1E1E] p-6 border border-black dark:border-white/20">
      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3 mb-6">
        <div className="flex items-center space-x-2">
          <PieChartIcon className="w-4 h-4 text-black dark:text-white" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-[#F4F1EE]">
            Budget Allocation Across Development Phases
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70 px-2.5 py-1 border border-black/10 dark:border-white/10">
          Total: {currency}{totalCost > 0 ? new Intl.NumberFormat('en-US').format(totalCost) : data.projectCost || '0'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Pie Chart */}
        <div className="md:col-span-7 h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={budgetData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
              >
                {budgetData.map((entry, index) => (
                  <Cell
                    key={`budget-cell-${index}`}
                    fill={SLICE_COLORS[index % SLICE_COLORS.length]}
                    className="dark:hidden"
                  />
                ))}
                {budgetData.map((entry, index) => (
                  <Cell
                    key={`budget-dark-cell-${index}`}
                    fill={DARK_SLICE_COLORS[index % DARK_SLICE_COLORS.length]}
                    className="hidden dark:block"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, name: any, item: any) => [
                  item.payload.formattedAmount,
                  `${name} (${item.payload.percentage}%)`
                ]}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #000',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown List */}
        <div className="md:col-span-5 space-y-2 max-h-[280px] overflow-y-auto pr-1">
          {budgetData.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 border border-black/10 dark:border-white/10 bg-[#FAFAFA] dark:bg-[#121212] text-[11px]"
            >
              <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                <span
                  className="w-3 h-3 shrink-0 rounded-none border border-black/20 dark:border-white/20"
                  style={{
                    backgroundColor: SLICE_COLORS[idx % SLICE_COLORS.length],
                  }}
                />
                <span className="font-bold text-black dark:text-white truncate" title={item.name}>
                  {item.name}
                </span>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono font-bold text-black dark:text-white">
                  {item.formattedAmount}
                </div>
                <div className="text-[9px] text-black/50 dark:text-white/50">
                  {item.percentage}% • {item.duration}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
