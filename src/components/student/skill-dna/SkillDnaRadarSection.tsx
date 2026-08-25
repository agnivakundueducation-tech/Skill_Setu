import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { SkillDnaItem } from '../../../types/skillDna';
import { Card, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Dna, ShieldCheck, Sparkles, Layers, CheckCircle2, TrendingUp, Info } from 'lucide-react';

interface SkillDnaRadarSectionProps {
  skills: SkillDnaItem[];
  onSelectSkill?: (skill: SkillDnaItem) => void;
}

export const SkillDnaRadarSection: React.FC<SkillDnaRadarSectionProps> = ({
  skills,
  onSelectSkill
}) => {
  const [radarFilter, setRadarFilter] = useState<'all' | 'technical' | 'professional'>('all');
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [showCurrentScore, setShowCurrentScore] = useState(true);

  // Filter skills based on selected view
  const activeSkills = skills.filter((item) => {
    if (radarFilter === 'technical') return item.category === 'technical';
    if (radarFilter === 'professional') return item.category === 'professional';
    return true;
  });

  const radarData = activeSkills.map((item) => ({
    subject: item.name,
    verificationScore: item.verificationScore,
    currentScore: item.currentScore,
    benchmark: item.industryBenchmark,
    evidenceCount: item.evidenceCount,
    category: item.category,
    fullMark: 100
  }));

  // Calculate averages
  const avgVerification = Math.round(
    activeSkills.reduce((acc, s) => acc + s.verificationScore, 0) / activeSkills.length
  );
  const avgCurrent = Math.round(
    activeSkills.reduce((acc, s) => acc + s.currentScore, 0) / activeSkills.length
  );
  const avgBenchmark = Math.round(
    activeSkills.reduce((acc, s) => acc + s.industryBenchmark, 0) / activeSkills.length
  );

  return (
    <Card variant="default" className="p-6 border-slate-200/80 dark:border-slate-800">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Dna className="w-4 h-4" />
            </span>
            <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              Multidimensional Competency Radar
            </CardTitle>
            <Badge variant="primary" size="sm">
              {radarFilter === 'all'
                ? '11 Dimensions'
                : radarFilter === 'technical'
                ? '7 Technical Pillars'
                : '4 Professional Pillars'}
            </Badge>
          </div>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Compare AI-verified scores against active scores and Tier-1 industry hiring baselines
          </CardDescription>
        </div>

        {/* View mode toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            <button
              type="button"
              onClick={() => setRadarFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                radarFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              All (11)
            </button>
            <button
              type="button"
              onClick={() => setRadarFilter('technical')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                radarFilter === 'technical'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Technical (7)
            </button>
            <button
              type="button"
              onClick={() => setRadarFilter('professional')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                radarFilter === 'professional'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Professional (4)
            </button>
          </div>
        </div>
      </div>

      {/* Main Radar Layout: Chart + Summary Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-center">
        {/* Radar Chart Display */}
        <div className="lg:col-span-8 w-full" style={{ minHeight: 340 }}>
          <ResponsiveContainer width="100%" height={340}>
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-800" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
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
                    const delta = dataPoint.verificationScore - dataPoint.benchmark;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-800 min-w-[200px]">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1">
                          <span className="font-bold text-slate-100">{dataPoint.subject}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-300 font-medium capitalize">
                            {dataPoint.category}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-indigo-300">
                          <span>Verification Score:</span>
                          <span className="font-bold">{dataPoint.verificationScore}/100</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Current Score:</span>
                          <span className="font-semibold">{dataPoint.currentScore}/100</span>
                        </div>
                        <div className="flex items-center justify-between text-emerald-300">
                          <span>Industry Baseline:</span>
                          <span className="font-semibold">{dataPoint.benchmark}/100</span>
                        </div>
                        <div className="flex items-center justify-between text-amber-300 pt-1 border-t border-slate-800/80">
                          <span>Evidence Artifacts:</span>
                          <span className="font-bold">{dataPoint.evidenceCount} items</span>
                        </div>
                        <div className="text-[11px] text-emerald-400 font-medium mt-1">
                          +{delta} pts above industry standard
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {showBenchmark && (
                <Radar
                  name="Industry Baseline"
                  dataKey="benchmark"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.12}
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                />
              )}

              {showCurrentScore && (
                <Radar
                  name="Current Score"
                  dataKey="currentScore"
                  stroke="#94a3b8"
                  fill="#94a3b8"
                  fillOpacity={0.18}
                  strokeDasharray="2 2"
                  strokeWidth={1.5}
                />
              )}

              <Radar
                name="Verification Score"
                dataKey="verificationScore"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.45}
                strokeWidth={2.5}
              />
            </RadarChart>
          </ResponsiveContainer>

          {/* Interactive Legend Toggles */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs mt-2">
            <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
              <span className="w-3 h-3 rounded-xs bg-indigo-600 inline-block shadow-xs" />
              <span>Verification Score ({avgVerification}/100)</span>
            </div>

            <button
              type="button"
              onClick={() => setShowCurrentScore(!showCurrentScore)}
              className={`flex items-center gap-1.5 font-medium transition-opacity cursor-pointer ${
                showCurrentScore ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 line-through opacity-60'
              }`}
            >
              <span className="w-3 h-3 rounded-xs bg-slate-400 inline-block border border-dashed border-slate-500" />
              <span>Current Score ({avgCurrent}/100)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowBenchmark(!showBenchmark)}
              className={`flex items-center gap-1.5 font-medium transition-opacity cursor-pointer ${
                showBenchmark ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 line-through opacity-60'
              }`}
            >
              <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block border border-dashed border-emerald-600" />
              <span>Industry Baseline ({avgBenchmark}/100)</span>
            </button>
          </div>
        </div>

        {/* Side KPI Breakdown Panel */}
        <div className="lg:col-span-4 space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">Dimension Insights</span>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
              +{avgVerification - avgBenchmark} pts over Baseline
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Top Peak Dimension</span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Web Development (98/100)
                </span>
              </div>
              <Badge variant="success" size="sm">Top 1%</Badge>
            </div>

            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Highest Growth Edge</span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  AI/ML & RAG (+20% YoY)
                </span>
              </div>
              <Badge variant="primary" size="sm">Trending</Badge>
            </div>

            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Core Professional Pillar</span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Problem Solving (97/100)
                </span>
              </div>
              <Badge variant="default" size="sm">99th Percentile</Badge>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5 leading-relaxed">
            <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
            <span>
              Radar vector points are computed from 47 cryptographically verified evidence artifacts and continuous proctored assessments.
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
