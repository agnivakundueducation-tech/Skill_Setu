import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { TrendingUp, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { CareerRoadmapData } from '../../../types/careerRoadmap';

interface ReadinessProjectionChartProps {
  roadmap: CareerRoadmapData;
  activePhaseId?: string;
  onSelectPhase?: (phaseId: string) => void;
}

export const ReadinessProjectionChart: React.FC<ReadinessProjectionChartProps> = ({
  roadmap,
  activePhaseId,
  onSelectPhase,
}) => {
  // Construct chronological data points for the projection graph
  const chartData = [
    {
      step: 'Current Baseline',
      phaseId: 'baseline',
      phaseNumber: 0,
      readiness: roadmap.currentReadiness, // 78%
      gain: 0,
      label: 'Current (78%)',
      status: 'Current Benchmark',
      description: 'Baseline assessed skill level'
    },
    ...roadmap.phases.map((p) => ({
      step: `Phase ${p.phaseNumber}`,
      phaseId: p.id,
      phaseNumber: p.phaseNumber,
      readiness: p.resultingReadiness,
      gain: p.estimatedReadinessIncrease,
      label: `${p.title} (+${p.estimatedReadinessIncrease}%)`,
      status: p.status === 'in-progress' ? 'In Progress' : p.status === 'completed' ? 'Completed' : 'Planned',
      description: p.title
    }))
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Estimated Readiness Progression by Phase
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visualizing step-by-step readiness increase after each roadmap milestone towards Software Engineer role.
          </p>
        </div>

        {/* Legend / Benchmarks */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Readiness Path</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-700 dark:text-emerald-300 font-medium">85% Tier-1 Cutoff</span>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-amber-700 dark:text-amber-300 font-medium">95%+ Top 5% Talent</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="readinessGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary, #6366f1)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-primary, #6366f1)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.15} />
            <XAxis
              dataKey="step"
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis
              domain={[60, 100]}
              ticks={[60, 70, 78, 85, 90, 95, 100]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1 z-50">
                      <div className="font-bold text-sm text-indigo-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        {data.step}: {data.description}
                      </div>
                      <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-700">
                        <span className="text-slate-300">Projected Readiness:</span>
                        <span className="font-bold text-white text-sm">{data.readiness}%</span>
                      </div>
                      {data.gain > 0 && (
                        <div className="flex items-center justify-between gap-4 text-emerald-400 font-semibold">
                          <span>Estimated Gain:</span>
                          <span>+{data.gain}%</span>
                        </div>
                      )}
                      <div className="text-[11px] text-slate-400 pt-0.5">
                        Status: <span className="text-slate-200">{data.status}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Reference Line for 85% Benchmark */}
            <ReferenceLine
              y={85}
              stroke="#10b981"
              strokeDasharray="4 4"
              label={{
                value: '85% Tier-1 Cutoff',
                position: 'insideTopRight',
                fill: '#10b981',
                fontSize: 10,
                fontWeight: 600
              }}
            />
            {/* Reference Line for 95% Benchmark */}
            <ReferenceLine
              y={95}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              label={{
                value: '95% Top Talent',
                position: 'insideTopRight',
                fill: '#f59e0b',
                fontSize: 10,
                fontWeight: 600
              }}
            />
            <Area
              type="monotone"
              dataKey="readiness"
              stroke="var(--color-primary, #6366f1)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#readinessGrad)"
              activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Phase Step Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        {chartData.map((item, idx) => {
          const isSelected = activePhaseId === item.phaseId;
          return (
            <button
              key={idx}
              onClick={() => item.phaseId !== 'baseline' && onSelectPhase && onSelectPhase(item.phaseId)}
              className={`p-2.5 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'bg-primary/10 border-primary shadow-sm'
                  : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="text-[10px] font-semibold text-slate-400 uppercase">
                {item.step}
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                {item.description}
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs font-extrabold text-primary">
                  {item.readiness}%
                </span>
                {item.gain > 0 ? (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-900/40 px-1.5 py-0.2 rounded">
                    +{item.gain}%
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400">Start</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
