'use client';
import React from 'react';
import { PRDData } from '@/types/prd';
import { getSectionAudits } from '@/components/InteractiveForm';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Target, DollarSign, LayoutDashboard, Layers } from 'lucide-react';
import { BudgetAllocationChart } from '@/components/BudgetAllocationChart';

interface InsightsDashboardProps {
  data: PRDData;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B']; // Vibrant modern colors for charts

export const InsightsDashboard: React.FC<InsightsDashboardProps> = ({ data }) => {
  // Completion metrics
  const audits = getSectionAudits(data);
  const completedCount = audits.filter(a => a.isComplete).length;
  const completionPercentage = audits.length > 0 ? Math.round((completedCount / audits.length) * 100) : 0;

  // Feature Distribution
  const features = data.features || [];
  const highPriority = features.filter(f => f.priority === 'High').length;
  const mediumPriority = features.filter(f => f.priority === 'Medium').length;
  const lowPriority = features.filter(f => f.priority === 'Low').length;

  const featureData = [
    { name: 'High Priority', count: highPriority },
    { name: 'Medium Priority', count: mediumPriority },
    { name: 'Low Priority', count: lowPriority },
  ];

  // Timeline & Cost estimates
  const costString = data.projectCost ? data.projectCost.toString().replace(/[^0-9.]/g, '') : '0';
  const parsedCost = parseFloat(costString);
  const formattedCost = isNaN(parsedCost) ? 'N/A' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parsedCost).replace('$', data.currencySymbol || '$');

  return (
    <div className="w-full min-h-[calc(100vh-200px)] p-0">
      <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-black/10 dark:border-white/10">
        <LayoutDashboard className="w-6 h-6 text-black dark:text-white" />
        <h2 className="font-serif font-bold text-xl text-[#1A1A1A] dark:text-[#F4F1EE] uppercase tracking-wider">
          Project Insights
        </h2>
      </div>

      {/* Metrics Grid — responsive: 1 col → 2 col → 4 col */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-[#1A1A1A] p-5 border border-black/10 dark:border-white/15 rounded-xl flex flex-col items-center text-center shadow-xs">
          <div className="flex items-center justify-center gap-2 mb-3 text-black/60 dark:text-white/60">
            <Target className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Completion</span>
          </div>
          <div className="text-5xl font-bold text-black dark:text-white mb-1">
            {completionPercentage}%
          </div>
          <div className="text-xs text-black/50 dark:text-white/50">
            {completedCount} of {audits.length} sections
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1A1A] p-5 border border-black/10 dark:border-white/15 rounded-xl flex flex-col items-center text-center shadow-xs">
          <div className="flex items-center justify-center gap-2 mb-3 text-black/60 dark:text-white/60">
            <DollarSign className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Est. Cost</span>
          </div>
          <div className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-1 truncate w-full text-center">
            {formattedCost}
          </div>
          <div className="text-xs text-black/50 dark:text-white/50 truncate w-full">
            {data.currencySymbol || '$'}{data.projectCost || '0'}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1A1A] p-5 border border-black/10 dark:border-white/15 rounded-xl flex flex-col items-center text-center shadow-xs">
          <div className="flex items-center justify-center gap-2 mb-3 text-black/60 dark:text-white/60">
            <Layers className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Features</span>
          </div>
          <div className="text-5xl font-bold text-black dark:text-white mb-1">
            {features.length}
          </div>
          <div className="text-xs text-black/50 dark:text-white/50">
            Across {data.pages?.length || 0} screens/pages
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1A1A] p-5 border border-black/10 dark:border-white/15 rounded-xl flex flex-col items-center text-center shadow-xs">
          <div className="flex items-center justify-center gap-2 mb-3 text-black/60 dark:text-white/60">
            <Target className="w-5 h-5 text-amber-500" />
            <span className="text-[11px] font-bold uppercase tracking-wider">High Priority</span>
          </div>
          <div className="text-5xl font-bold text-amber-500 mb-1">
            {features.filter(f => f.priority === 'High').length}
          </div>
          <div className="text-xs text-black/50 dark:text-white/50">
            High-priority features
          </div>
        </div>
      </div>

      {/* Budget Allocation — full width */}
      <div className="mb-8">
        <BudgetAllocationChart data={data} />
      </div>

      {/* Charts Row — side by side on lg, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Priority Chart */}
        <div className="bg-white dark:bg-[#1A1A1A] p-6 border border-black/10 dark:border-white/15 rounded-xl shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-[#F4F1EE] mb-6 text-center border-b border-black/10 dark:border-white/10 pb-3">
            Feature Distribution by Priority
          </h3>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={featureData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={115}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {featureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--tooltip-bg, #1A1A1A)', color: '#F4F1EE', border: '1px solid rgba(255,255,255,0.2)', fontSize: '12px', borderRadius: '4px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Bar Chart */}
        <div className="bg-white dark:bg-[#1A1A1A] p-6 border border-black/10 dark:border-white/15 rounded-xl shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-[#F4F1EE] mb-6 text-center border-b border-black/10 dark:border-white/10 pb-3">
            Priority Breakdown
          </h3>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.2)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'currentColor' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'currentColor' }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'var(--tooltip-bg, #1A1A1A)', color: '#F4F1EE', border: '1px solid rgba(255,255,255,0.2)', fontSize: '12px', borderRadius: '4px' }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
