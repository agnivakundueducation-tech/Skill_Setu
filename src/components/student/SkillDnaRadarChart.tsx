import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { STUDENT_READINESS_DATA } from '../../data/studentData';

interface SkillDnaRadarChartProps {
  className?: string;
  height?: number;
}

export const SkillDnaRadarChart: React.FC<SkillDnaRadarChartProps> = ({
  className = '',
  height = 270
}) => {
  const data = STUDENT_READINESS_DATA.scoreBreakdown.map((item) => ({
    subject: item.domain,
    score: item.score,
    benchmark: item.benchmark,
    fullMark: 100
  }));

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Multidimensional Skill DNA Matrix
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Competency depth mapped across 6 engineering pillars
          </p>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-800" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              stroke="#cbd5e1"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs space-y-1 border border-slate-800">
                      <div className="font-bold text-slate-100">{dataPoint.subject}</div>
                      <div className="text-indigo-300 font-semibold">Your Score: {dataPoint.score}/100</div>
                      <div className="text-emerald-300">Industry Requirement: {dataPoint.benchmark}/100</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Radar
              name="Industry Baseline"
              dataKey="benchmark"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.15}
              strokeDasharray="3 3"
            />
            <Radar
              name="Aarav's Skill DNA"
              dataKey="score"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.45}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-5 text-xs text-slate-600 dark:text-slate-400 mt-1">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600"></span>
          <span>Verified Skill Profile</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
          <span>Tier-1 Target Spec</span>
        </div>
      </div>
    </div>
  );
};
