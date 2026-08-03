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

const COLORS = ['#1A1A1A', '#666666', '#B3B3B3']; // Dark theme colors
const DARK_COLORS = ['#F4F1EE', '#A3A3A3', '#525252']; // Light theme colors to contrast with dark mode

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
  // Attempt to parse project cost to a number
  const costString = data.projectCost ? data.projectCost.toString().replace(/[^0-9.]/g, '') : '0';
  const parsedCost = parseFloat(costString);
  const formattedCost = isNaN(parsedCost) ? 'N/A' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parsedCost).replace('$', data.currencySymbol || '$');

  return (
    <div className="bg-[#F4F1EE] dark:bg-[#121212] border border-black dark:border-white/10 shadow-sm p-4 md:p-8 min-h-[calc(100vh-80px)] overflow-y-auto">
      <div className="flex items-center space-x-2 mb-8 border-b border-black dark:border-white/20 pb-4">
        <LayoutDashboard className="w-6 h-6 text-black dark:text-white" />
        <h2 className="font-serif font-bold text-xl text-[#1A1A1A] dark:text-[#F4F1EE] uppercase tracking-wider">
          Project Insights
        </h2>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-[#1E1E1E] p-6 border border-black dark:border-white/20 flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-2 mb-3 text-black/60 dark:text-white/60">
            <Target className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Completion</span>
          </div>
          <div className="text-4xl font-bold text-black dark:text-white mb-2">
            {completionPercentage}%
          </div>
          <div className="text-xs text-black/50 dark:text-white/50">
            {completedCount} of {audits.length} sections completed
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] p-6 border border-black dark:border-white/20 flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-2 mb-3 text-black/60 dark:text-white/60">
            <DollarSign className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Est. Cost</span>
          </div>
          <div className="text-4xl font-bold text-black dark:text-white mb-2">
            {formattedCost}
          </div>
          <div className="text-xs text-black/50 dark:text-white/50 truncate">
            {data.currencySymbol || '$'}{data.projectCost || '0'}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] p-6 border border-black dark:border-white/20 flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-2 mb-3 text-black/60 dark:text-white/60">
            <Layers className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Features</span>
          </div>
          <div className="text-4xl font-bold text-black dark:text-white mb-2">
            {features.length}
          </div>
          <div className="text-xs text-black/50 dark:text-white/50">
            Across {data.pages?.length || 0} screens/pages
          </div>
        </div>
      </div>

      {/* Budget Allocation Across Development Phases */}
      <div className="mb-8">
        <BudgetAllocationChart data={data} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feature Priority Chart */}
        <div className="bg-white dark:bg-[#1E1E1E] p-6 border border-black dark:border-white/20">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-[#F4F1EE] mb-6 text-center border-b border-black/10 dark:border-white/10 pb-3">
            Feature Distribution
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={featureData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {featureData.map((entry, index) => (
                    <Cell key={`cell-\${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #000', fontSize: '12px' }}
                  itemStyle={{ color: '#000' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Bar Chart (Alternative View) */}
        <div className="bg-white dark:bg-[#1E1E1E] p-6 border border-black dark:border-white/20">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-[#F4F1EE] mb-6 text-center border-b border-black/10 dark:border-white/10 pb-3">
            Priority Breakdown
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #000', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#1A1A1A" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
