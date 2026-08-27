import React from 'react';
import { SkillDnaItem, SkillDnaOverallMetrics } from '../../../types/skillDna';
import { Card, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { ProgressBar } from '../../ui/ProgressBar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';
import {
  TrendingUp,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  BarChart3,
  CheckCircle2,
  FileCheck,
  Target
} from 'lucide-react';

interface SkillDnaAnalyticsMatrixProps {
  skills: SkillDnaItem[];
  metrics: SkillDnaOverallMetrics;
}

export const SkillDnaAnalyticsMatrix: React.FC<SkillDnaAnalyticsMatrixProps> = ({
  skills,
  metrics
}) => {
  // Comparative bar data
  const comparisonData = skills.map((s) => ({
    name: s.name,
    verifiedScore: s.verificationScore,
    currentScore: s.currentScore,
    benchmark: s.industryBenchmark,
    variance: s.verificationScore - s.currentScore,
    category: s.category
  }));

  // Evidence type aggregation
  const evidenceTypeCounts = skills.reduce(
    (acc, skill) => {
      skill.evidenceList.forEach((ev) => {
        if (ev.type === 'project') acc.projects += 1;
        else if (ev.type === 'certification') acc.certifications += 1;
        else if (ev.type === 'assessment' || ev.type === 'code_benchmark') acc.assessments += 1;
        else if (ev.type === 'peer_review') acc.peerReviews += 1;
      });
      return acc;
    },
    { projects: 0, certifications: 0, assessments: 0, peerReviews: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Comparative Score Variance Visualizer */}
      <Card variant="default" className="p-6 border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <BarChart3 className="w-4 h-4" />
              </span>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                Comparative Skill Alignment & Verification Delta
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Side-by-side analysis of Verified Scores vs Active/Current Competencies across all 11 disciplines
            </CardDescription>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
              <span className="w-3 h-3 rounded-xs bg-indigo-600 inline-block" />
              <span>Verified Score</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
              <span className="w-3 h-3 rounded-xs bg-slate-300 dark:bg-slate-700 inline-block" />
              <span>Current Score</span>
            </div>
          </div>
        </div>

        {/* Recharts Grouped Bar Chart */}
        <div className="w-full mt-4" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#64748b' }}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={50}
              />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-800">
                        <div className="font-bold text-slate-100">{data.name}</div>
                        <div className="text-indigo-300">Verified: <strong>{data.verifiedScore}/100</strong></div>
                        <div className="text-slate-300">Current: <strong>{data.currentScore}/100</strong></div>
                        <div className="text-emerald-300">Industry Target: <strong>{data.benchmark}/100</strong></div>
                        <div className="text-[11px] text-amber-300 pt-1 border-t border-slate-800">
                          Verification Lift: +{data.variance} pts
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="verifiedScore" name="Verified Score" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="currentScore" name="Current Score" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Analytics Breakdown Grid: Evidence Distribution + Category Strengths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Evidence Distribution */}
        <Card variant="default" className="p-5 border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Evidence Portfolio Composition
              </h4>
            </div>
            <Badge variant="primary" size="sm">
              {metrics.totalEvidenceCount} Total Proofs
            </Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-700 dark:text-slate-300">Open Source & Production Projects</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{evidenceTypeCounts.projects} items (36%)</span>
              </div>
              <ProgressBar value={36} color="indigo" size="sm" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-700 dark:text-slate-300">Proctored Coding Benchmarks & AI Tests</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{evidenceTypeCounts.assessments} items (34%)</span>
              </div>
              <ProgressBar value={34} color="emerald" size="sm" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-700 dark:text-slate-300">Industry & Academic Certifications</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{evidenceTypeCounts.certifications} items (15%)</span>
              </div>
              <ProgressBar value={15} color="amber" size="sm" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span className="text-slate-700 dark:text-slate-300">Peer Reviews & Faculty Endorsements</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{evidenceTypeCounts.peerReviews} items (15%)</span>
              </div>
              <ProgressBar value={15} color="sky" size="sm" />
            </div>
          </div>
        </Card>

        {/* Technical vs Professional Competency Split */}
        <Card variant="default" className="p-5 border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Pillar Equilibrium & Confidence
              </h4>
            </div>
            <Badge variant="success" size="sm">
              {metrics.verificationConfidence}% Confidence
            </Badge>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between">
              <div>
                <span className="font-bold text-indigo-900 dark:text-indigo-200 block text-xs">
                  Technical Pillars Average (7 Disciplines)
                </span>
                <span className="text-[11px] text-indigo-700/80 dark:text-indigo-400">
                  Programming, DSA, Database, Web, Cloud, AI/ML, Security
                </span>
              </div>
              <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                {metrics.technicalAverage}/100
              </span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-900 dark:text-emerald-200 block text-xs">
                  Professional Pillars Average (4 Disciplines)
                </span>
                <span className="text-[11px] text-emerald-700/80 dark:text-emerald-400">
                  Communication, Teamwork, Leadership, Problem Solving
                </span>
              </div>
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                {metrics.professionalAverage}/100
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Candidate profile exhibits balanced equilibrium across hard engineering depth and professional leadership agility, exceeding Tier-1 standard hiring thresholds.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
