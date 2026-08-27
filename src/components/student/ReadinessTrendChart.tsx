import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { STUDENT_READINESS_DATA } from '../../data/studentData';

interface ReadinessTrendChartProps {
  className?: string;
  height?: number;
}

export const ReadinessTrendChart: React.FC<ReadinessTrendChartProps> = ({
  className = '',
  height = 260
}) => {
  const data = STUDENT_READINESS_DATA.historicalTrends;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Readiness Trajectory vs. Industry Benchmark
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            6-month continuous skill assessment score progression
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <span>Your Score (87)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Industry Benchmark (76)</span>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorStudent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorIndustry" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis
              domain={[50, 100]}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-800">
                      <div className="font-bold text-slate-200 border-b border-slate-700 pb-1">{label} 2026</div>
                      <div className="flex items-center justify-between gap-4 text-indigo-300 font-semibold">
                        <span>Aarav's Score:</span>
                        <span>{payload[0].value} / 100</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-emerald-300">
                        <span>Industry Benchmark:</span>
                        <span>{payload[1].value} / 100</span>
                      </div>
                      {payload[2] && (
                        <div className="flex items-center justify-between gap-4 text-slate-400">
                          <span>Peer Average:</span>
                          <span>{payload[2].value} / 100</span>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="readinessScore"
              name="Your Score"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorStudent)"
              activeDot={{ r: 6, fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="industryBenchmark"
              name="Industry Benchmark"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#colorIndustry)"
            />
            <Area
              type="monotone"
              dataKey="peerAverage"
              name="Peer Average"
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="2 2"
              fill="transparent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
