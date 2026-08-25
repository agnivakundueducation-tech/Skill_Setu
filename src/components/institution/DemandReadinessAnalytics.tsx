import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { SkillDemandReadinessItem } from '../../types/institution';
import { IndustrySkillDemandSection } from './IndustrySkillDemandSection';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Cloud,
  Shield,
  Code2,
  Database,
  Building2,
  ArrowRight,
  Sparkles,
  Info,
  ChevronRight,
  BarChart3,
  Layers
} from 'lucide-react';

interface DemandReadinessAnalyticsProps {
  skillsData: SkillDemandReadinessItem[];
  onSelectSkill: (skill: SkillDemandReadinessItem) => void;
  onOpenAiRecommendationsForSkill: (skillName: string) => void;
}

export const DemandReadinessAnalytics: React.FC<DemandReadinessAnalyticsProps> = ({
  skillsData,
  onSelectSkill,
  onOpenAiRecommendationsForSkill
}) => {
  const [activeViewMode, setActiveViewMode] = useState<'demand_intelligence' | 'chart' | 'radar' | 'cards'>('demand_intelligence');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'critical' | 'minimal'>('all');

  const getSkillIcon = (skill: string) => {
    switch (skill) {
      case 'AI/ML':
        return Brain;
      case 'Cloud':
        return Cloud;
      case 'Cybersecurity':
        return Shield;
      case 'DSA':
        return Code2;
      case 'Data Analytics':
        return Database;
      default:
        return Code2;
    }
  };

  const filteredSkills = skillsData.filter((item) => {
    if (selectedFilter === 'critical') return item.gapSeverity === 'critical';
    if (selectedFilter === 'minimal') return item.gapSeverity === 'minimal';
    return true;
  });

  // Recharts formatted data
  const chartData = skillsData.map((s) => ({
    name: s.skill,
    'Industry Demand': s.industryDemand,
    'Student Readiness': s.studentReadiness,
    Gap: Math.abs(s.gap),
    openings: s.hiringOpeningsVolume
  }));

  const radarData = skillsData.map((s) => ({
    subject: s.skill,
    Demand: s.industryDemand,
    Readiness: s.studentReadiness,
    fullMark: 100
  }));

  return (
    <div className="space-y-5">
      {/* Top Header & Visual View Mode Switcher */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Industry Demand vs Student Readiness Analytics
            </h2>
            <Badge variant="warning" size="sm">
              5 Core Tech Domains
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time algorithmic delta comparing 4,800+ student assessments with live industry hiring criteria.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveViewMode('demand_intelligence')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeViewMode === 'demand_intelligence'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Demand Intelligence
          </button>
          <button
            onClick={() => setActiveViewMode('chart')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeViewMode === 'chart'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Bar Comparison
          </button>
          <button
            onClick={() => setActiveViewMode('radar')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeViewMode === 'radar'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Radar Alignment
          </button>
          <button
            onClick={() => setActiveViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeViewMode === 'cards'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Diagnostic Cards
          </button>
        </div>
      </div>

      {/* Demand Intelligence View (Phase 14C-C Core Engine) */}
      {activeViewMode === 'demand_intelligence' && (
        <IndustrySkillDemandSection
          onOpenAiRecommendationsForSkill={onOpenAiRecommendationsForSkill}
        />
      )}

      {/* Primary Chart Visualizations */}
      {activeViewMode === 'chart' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card
            variant="default"
            className="lg:col-span-2 p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Domain-Wise Demand vs Readiness Delta
                </h3>
                <p className="text-xs text-slate-500">
                  Percentage benchmark of Industry Requirement vs Cohort Competency Score
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-indigo-600" />
                  <span className="text-slate-600 dark:text-slate-400">Industry Demand</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-400">Student Readiness</span>
                </span>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  barSize={24}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const demand = Number(payload[0]?.value) || 0;
                        const readiness = Number(payload[1]?.value) || 0;
                        const gapVal = demand - readiness;
                        return (
                          <div className="p-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700">
                            <div className="font-bold text-amber-300 text-sm">{label}</div>
                            <div className="flex items-center justify-between gap-4 text-indigo-200">
                              <span>Industry Demand:</span>
                              <span className="font-bold text-white">{demand}%</span>
                            </div>
                            <div className="flex items-center justify-between gap-4 text-emerald-200">
                              <span>Student Readiness:</span>
                              <span className="font-bold text-white">{readiness}%</span>
                            </div>
                            <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-700 font-bold">
                              <span className="text-rose-300">Competency Gap:</span>
                              <span className="text-rose-400">-{gapVal}%</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="Industry Demand"
                    fill="#4f46e5"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="Student Readiness"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Quick Summary Highlights */}
          <Card
            variant="default"
            className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Critical Gap Summary
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                  3 Urgent Deficits
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Immediate curriculum interventions required to meet upcoming placement season requirements.
              </p>

              <div className="space-y-2.5">
                <div className="p-2.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-300">
                    <span>Cybersecurity</span>
                    <span>-38% Gap</span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    Readiness: 48% vs Demand: 86% • SOC & SIEM tools missing.
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-300">
                    <span>Cloud Architecture</span>
                    <span>-33% Gap</span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    Readiness: 56% vs Demand: 89% • Kubernetes & Terraform IaC.
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-300">
                    <span>AI / Machine Learning</span>
                    <span>-32% Gap</span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    Readiness: 62% vs Demand: 94% • GenAI & RAG pipelines needed.
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              leftIcon={Sparkles}
              rightIcon={ChevronRight}
              onClick={() => onOpenAiRecommendationsForSkill('AI/ML')}
              className="w-full text-xs text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/50"
            >
              Generate AI Syllabus Revision Plan
            </Button>
          </Card>
        </div>
      )}

      {/* Radar Alignment View */}
      {activeViewMode === 'radar' && (
        <Card
          variant="default"
          className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Institutional Competency Radar Overlay
              </h3>
              <p className="text-xs text-slate-500">
                Overlaying campus-wide cohort capability polygon with industry benchmark threshold.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-slate-600 dark:text-slate-400">Industry Target (100-pt Scale)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-400">Student Cohort Score</span>
              </span>
            </div>
          </div>

          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={12} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" />
                <Radar
                  name="Industry Demand"
                  dataKey="Demand"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.25}
                />
                <Radar
                  name="Student Readiness"
                  dataKey="Readiness"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.35}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* 5 Core Skill Cards Matrix (AI/ML, Cloud, Cybersecurity, DSA, Data Analytics) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Detailed Breakdown across 5 Targeted Skills
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                selectedFilter === 'all'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All (5)
            </button>
            <button
              onClick={() => setSelectedFilter('critical')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                selectedFilter === 'critical'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-500 hover:text-rose-600'
              }`}
            >
              Critical Gaps (3)
            </button>
            <button
              onClick={() => setSelectedFilter('minimal')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                selectedFilter === 'minimal'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-500 hover:text-emerald-600'
              }`}
            >
              Well Aligned (2)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((item) => {
            const Icon = getSkillIcon(item.skill);
            const isCritical = item.gapSeverity === 'critical';

            return (
              <Card
                key={item.id}
                variant="default"
                className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-amber-400 dark:hover:border-amber-600 transition-all hover:shadow-md space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Domain Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isCritical
                            ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60'
                            : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                          {item.skill}
                        </h3>
                        <span className="text-[11px] text-slate-500">
                          {item.hiringOpeningsVolume} Active Openings
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        isCritical
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                      }`}
                    >
                      {item.gap}% Gap
                    </span>
                  </div>

                  {/* Industry Demand vs Student Readiness Bar Comparison */}
                  <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-600 dark:text-slate-400">
                          Industry Demand
                        </span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {item.industryDemand}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-600"
                          style={{ width: `${item.industryDemand}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-600 dark:text-slate-400">
                          Student Readiness
                        </span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {item.studentReadiness}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isCritical ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${item.studentReadiness}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sub-skill diagnostics list */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Key Deficiency Breakdown:
                    </div>
                    {item.subskills.slice(0, 3).map((sub, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400"
                      >
                        <span className="truncate max-w-[70%]">{sub.name}</span>
                        <span
                          className={`text-[11px] font-bold ${
                            sub.status === 'critical_gap'
                              ? 'text-rose-600 dark:text-rose-400'
                              : sub.status === 'moderate_gap'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {sub.readinessScore}% ready
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectSkill(item)}
                    className="text-xs flex-1"
                  >
                    View Diagnostics
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={Sparkles}
                    onClick={() => onOpenAiRecommendationsForSkill(item.skill)}
                    className="text-xs bg-amber-600 hover:bg-amber-500 border-none"
                  >
                    AI Action
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
