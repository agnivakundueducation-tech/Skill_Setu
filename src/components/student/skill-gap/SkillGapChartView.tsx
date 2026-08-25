import React, { useState } from 'react';
import { SkillGapItem } from '../../../types/skillGap';
import { Card, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  BarChart3,
  Radar as RadarIcon,
  TrendingDown,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';

interface SkillGapChartViewProps {
  items: SkillGapItem[];
  onSelectSkill: (skill: SkillGapItem) => void;
}

export const SkillGapChartView: React.FC<SkillGapChartViewProps> = ({
  items,
  onSelectSkill
}) => {
  const [chartSubView, setChartSubView] = useState<'comparison' | 'gap_deficiency' | 'radar'>('comparison');

  // Prepare data for Recharts
  const comparisonData = items.map((item) => ({
    id: item.id,
    name: item.name,
    shortName: item.name.length > 14 ? `${item.name.substring(0, 12)}...` : item.name,
    currentLevel: item.currentLevel,
    requiredLevel: item.requiredLevel,
    gap: item.gap,
    priority: item.priority,
    indicatorColor: item.indicatorColor,
    recommendation: item.recommendation,
    category: item.category
  }));

  // Sorted by gap magnitude for deficiency chart
  const deficiencyData = [...comparisonData].sort((a, b) => b.gap - a.gap);

  // Radar data
  const radarData = items.map((item) => ({
    subject: item.name.length > 12 ? item.name.split(' ')[0] : item.name,
    fullName: item.name,
    current: item.currentLevel,
    required: item.requiredLevel,
    gap: item.gap,
    fullMark: 100
  }));

  const getBarColor = (color: 'red' | 'yellow' | 'green') => {
    if (color === 'red') return '#f43f5e'; // rose-500
    if (color === 'yellow') return '#f59e0b'; // amber-500
    return '#10b981'; // emerald-500
  };

  return (
    <div className="space-y-6">
      {/* Chart View Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            Skill Gap Visual Analytics
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interactive comparative visualizations analyzing student capabilities vs required industry standards
          </p>
        </div>

        {/* Sub-view switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setChartSubView('comparison')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              chartSubView === 'comparison'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Current vs Required
          </button>
          <button
            type="button"
            onClick={() => setChartSubView('gap_deficiency')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              chartSubView === 'gap_deficiency'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Gap Magnitude (Red/Yellow/Green)
          </button>
          <button
            type="button"
            onClick={() => setChartSubView('radar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              chartSubView === 'radar'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Radar Envelope
          </button>
        </div>
      </div>

      {/* 1. CURRENT VS REQUIRED COMPARATIVE GROUPED BAR CHART */}
      {chartSubView === 'comparison' && (
        <Card variant="default" className="p-6 border-slate-200/80 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                Comparative Competency Level vs Industry Benchmark
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                Side-by-side assessment showing student baseline alongside required hiring thresholds
              </CardDescription>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <span className="w-3 h-3 rounded-xs bg-slate-400 inline-block" />
                <span>Current Level</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                <span className="w-3 h-3 rounded-xs bg-indigo-600 inline-block" />
                <span>Required Level</span>
              </div>
            </div>
          </div>

          <div className="w-full mt-4" style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 15, right: 10, left: -20, bottom: 45 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis
                  dataKey="shortName"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  interval={0}
                  angle={-28}
                  textAnchor="end"
                  height={55}
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const rawItem = items.find((i) => i.id === data.id);
                      return (
                        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-2xl text-xs space-y-1.5 border border-slate-800 max-w-xs">
                          <div className="font-bold text-slate-100 text-sm">{data.name}</div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Current Level:</span>
                            <span className="font-bold text-slate-200">{data.currentLevel}/100</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-indigo-300">Required Benchmark:</span>
                            <span className="font-bold text-indigo-400">{data.requiredLevel}/100</span>
                          </div>
                          <div className="flex justify-between gap-4 pt-1 border-t border-slate-800">
                            <span className={data.gap > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                              {data.gap > 0 ? `Gap Deficiency: -${data.gap} pts` : 'Aligned / Ahead'}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                              {data.priority} Priority
                            </span>
                          </div>
                          <div className="text-[11px] text-amber-300 pt-1 leading-snug">
                            💡 {data.recommendation}
                          </div>
                          {rawItem && (
                            <button
                              type="button"
                              onClick={() => onSelectSkill(rawItem)}
                              className="mt-1 w-full py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-center font-semibold text-[11px] cursor-pointer"
                            >
                              Inspect Roadmap
                            </button>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="currentLevel" name="Current Level" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={22} />
                <Bar dataKey="requiredLevel" name="Required Level" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* 2. GAP DEFICIENCY MAGNITUDE CHART WITH RED/YELLOW/GREEN BARS */}
      {chartSubView === 'gap_deficiency' && (
        <Card variant="default" className="p-6 border-slate-200/80 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                Ranked Skill Gap Magnitude & Urgency Index
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                Categorized by Red (Critical &ge;25 pts), Yellow (Moderate 10-24 pts), and Green (Aligned &lt;10 pts)
              </CardDescription>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Critical Red</span>
              </div>
              <div className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Moderate Yellow</span>
              </div>
              <div className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Aligned Green</span>
              </div>
            </div>
          </div>

          <div className="w-full mt-4" style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deficiencyData} margin={{ top: 15, right: 10, left: -20, bottom: 45 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis
                  dataKey="shortName"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  interval={0}
                  angle={-28}
                  textAnchor="end"
                  height={55}
                />
                <YAxis domain={[0, 40]} tick={{ fontSize: 11, fill: '#64748b' }} label={{ value: 'Gap (pts)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const rawItem = items.find((i) => i.id === data.id);
                      return (
                        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-2xl text-xs space-y-1.5 border border-slate-800 max-w-xs">
                          <div className="font-bold text-slate-100">{data.name}</div>
                          <div className="text-rose-300 font-bold text-sm">
                            Gap: {data.gap > 0 ? `${data.gap} points needed` : '0 points (Aligned)'}
                          </div>
                          <div className="text-slate-300 text-[11px]">
                            Current: {data.currentLevel}/100 • Required: {data.requiredLevel}/100
                          </div>
                          <div className="text-[11px] text-amber-300 pt-1 leading-snug">
                            Action: {data.recommendation}
                          </div>
                          {rawItem && (
                            <button
                              type="button"
                              onClick={() => onSelectSkill(rawItem)}
                              className="mt-1 w-full py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-center font-semibold text-[11px] cursor-pointer"
                            >
                              Launch Action Plan
                            </button>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="gap" name="Gap (pts)" radius={[6, 6, 0, 0]} maxBarSize={28}>
                  {deficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.indicatorColor)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* 3. MULTIDIMENSIONAL RADAR ENVELOPE */}
      {chartSubView === 'radar' && (
        <Card variant="default" className="p-6 border-slate-200/80 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                Multidimensional Radar Gap Analysis
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                Visual boundary comparison: Current coverage polygon vs Industry requirement threshold
              </CardDescription>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 rounded-full bg-slate-400 inline-block" />
                <span>Current Profile</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
                <span>Industry Requirement</span>
              </div>
            </div>
          </div>

          <div className="w-full mt-4" style={{ height: 380 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#cbd5e1" className="dark:stroke-slate-800" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar
                  name="Industry Benchmark"
                  dataKey="required"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Radar
                  name="Student Current Level"
                  dataKey="current"
                  stroke="#0ea5e9"
                  fill="#0ea5e9"
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-800">
                          <div className="font-bold text-slate-100">{data.fullName}</div>
                          <div className="text-sky-300">Current: <strong>{data.current}/100</strong></div>
                          <div className="text-indigo-300">Required: <strong>{data.required}/100</strong></div>
                          <div className={data.gap > 0 ? 'text-rose-300 font-bold' : 'text-emerald-300 font-bold'}>
                            {data.gap > 0 ? `Gap: ${data.gap} pts` : 'Aligned / Ahead'}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
};
