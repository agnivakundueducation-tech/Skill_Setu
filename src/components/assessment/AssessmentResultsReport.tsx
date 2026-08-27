import React, { useState } from 'react';
import { AssessmentResult } from '../../types/assessment';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import {
  Trophy,
  Sparkles,
  Award,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Download,
  Share2,
  CheckCircle2,
  Briefcase,
  Target,
  Layers,
  ChevronRight,
  BookOpen,
  Zap,
  Star,
  Brain,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip
} from 'recharts';

interface AssessmentResultsReportProps {
  result: AssessmentResult;
  onRetake: () => void;
  onExploreRoles?: (roleTitle: string) => void;
  onSaveToProfile?: () => void;
}

export const AssessmentResultsReport: React.FC<AssessmentResultsReportProps> = ({
  result,
  onRetake,
  onExploreRoles,
  onSaveToProfile
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'gaps' | 'roles' | 'action-plan'>('overview');
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case 'Tier-1 Industry Ready':
        return 'emerald';
      case 'Enterprise Capable':
        return 'primary';
      case 'High-Growth Contender':
        return 'sky';
      default:
        return 'warning';
    }
  };

  const getGapSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'danger';
      case 'Moderate':
        return 'warning';
      default:
        return 'info';
    }
  };

  // Prepare radar chart data
  const radarData = result.dimensionScores.map((dim) => ({
    subject: dim.domain,
    Candidate: dim.score,
    Benchmark: dim.benchmark,
    fullMark: 100
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <Card variant="gradient" className="p-6 border-indigo-200 dark:border-indigo-900 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={getTierBadgeVariant(result.tierLabel)} size="sm">
                <Trophy className="w-3.5 h-3.5 mr-1" />
                {result.tierLabel}
              </Badge>
              <span className="text-xs text-indigo-200/70 font-mono">
                Evaluated: {result.completedAt}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              SkillSetu AI Career Readiness Report
            </h1>
            <p className="text-sm text-indigo-100/80 max-w-2xl leading-relaxed">
              {result.executiveSummary}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={RotateCcw}
              onClick={onRetake}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
            >
              Retake Assessment
            </Button>

            <Button
              variant="secondary"
              size="sm"
              leftIcon={Share2}
              onClick={handleShare}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
            >
              {isCopied ? 'Link Copied!' : 'Share Matrix'}
            </Button>

            {onSaveToProfile && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={CheckCircle2}
                onClick={onSaveToProfile}
                className="bg-white hover:bg-slate-100 text-indigo-900 font-bold text-xs"
              >
                Sync to Skill DNA
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Main Score Metrics & Radar Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Overall Readiness Score Card */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Overall Readiness Benchmark
              </span>
              <Badge variant="emerald" size="sm">
                Top {100 - result.percentileRank}% Globally
              </Badge>
            </div>

            {/* Circular / Large Score presentation */}
            <div className="flex items-baseline gap-3 my-4">
              <span className="text-6xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tracking-tight">
                {result.readinessScore}
              </span>
              <div className="text-slate-400 font-mono">
                <span className="text-2xl font-bold">/ 100</span>
                <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  +14% vs. Average Grad
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your comprehensive score reflects strong algorithmic rigor, solid frontend foundations, and proactive cross-functional collaboration.
            </p>
          </div>

          {/* Dimension Breakdown Bars */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <span>Dimension Breakdown</span>
              <span className="text-[10px] text-slate-400 font-normal">Candidate vs Benchmark</span>
            </h4>

            <div className="space-y-2.5">
              {result.dimensionScores.map((dim) => (
                <div key={dim.domain} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 dark:text-slate-300 text-[11px] truncate">
                      {dim.domain}
                    </span>
                    <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
                      {dim.score}%
                    </span>
                  </div>
                  <ProgressBar
                    value={dim.score}
                    size="sm"
                    variant={dim.score >= 80 ? 'success' : dim.score >= 65 ? 'primary' : 'warning'}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Radar Chart Visualization */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Multidimensional Competency Radar
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visualizing your profile against corporate hiring benchmarks
              </p>
            </div>
            <Badge variant="primary" size="sm">
              AI Vector Analysis
            </Badge>
          </div>

          <div className="h-64 sm:h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#94a3b8" strokeOpacity={0.25} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: '#94a3b8', fontSize: 9 }}
                />
                <Radar
                  name="Your Profile"
                  dataKey="Candidate"
                  stroke="#4f46e5"
                  fill="#6366f1"
                  fillOpacity={0.45}
                />
                <Radar
                  name="Industry Benchmark"
                  dataKey="Benchmark"
                  stroke="#94a3b8"
                  fill="#cbd5e1"
                  fillOpacity={0.2}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center gap-3 text-xs text-indigo-900 dark:text-indigo-200">
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>
              Highest delta in <strong>Frontend UI Craft</strong> (+15% vs Benchmark) and <strong>Problem Decomposition</strong> (+12%).
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation for Detailed Breakdown */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          Strengths & Weaknesses
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gaps')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'gaps'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Skill Gaps Matrix ({result.skillGaps.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('roles')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'roles'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Recommended Roles ({result.recommendedRoles.length})
        </button>
      </div>

      {/* Tab 1: Strengths & Weaknesses */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Key Strengths */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Verified Core Strengths
            </h3>

            <div className="space-y-3">
              {result.strengths.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5 hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h4>
                    <Badge variant="emerald" size="sm">
                      {item.badge}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses & Growth Areas */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Target Growth Areas & Weaknesses
            </h3>

            <div className="space-y-3">
              {result.weaknesses.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2 hover:border-amber-200 dark:hover:border-amber-900/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h4>
                    <Badge variant={item.impact === 'High' ? 'danger' : 'warning'} size="sm">
                      {item.impact} Priority
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="p-2.5 bg-amber-50/70 dark:bg-amber-950/40 rounded-lg border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-300">
                    <strong>Actionable Remedy:</strong> {item.remedy}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Skill Gaps Matrix */}
      {activeTab === 'gaps' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Actionable Skill Gap Matrix
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Identified gaps between current proficiency and corporate hiring bars
              </p>
            </div>
            <Badge variant="primary" size="sm">
              {result.skillGaps.length} Target Gaps
            </Badge>
          </div>

          <div className="space-y-3">
            {result.skillGaps.map((gap, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={getGapSeverityVariant(gap.gapSeverity)} size="sm">
                      {gap.gapSeverity} Gap
                    </Badge>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {gap.skill}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                    {gap.category}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                      Current Assessed State
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {gap.currentLevel}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-bold uppercase tracking-wider">
                      Target Enterprise Bar
                    </span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                      {gap.targetLevel}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Recommended Action:</span>{' '}
                    {gap.recommendedAction}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={BookOpen}
                    className="text-xs shrink-0 self-start sm:self-auto"
                  >
                    {gap.suggestedModule}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Recommended Roles */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Curated AI Role Matches
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Positions matched based on your technical ratings, problem solving style, and career drivers
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.recommendedRoles.map((role) => (
              <div
                key={role.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-800 transition-all space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {role.title}
                      </h4>
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {role.salaryRange}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 font-mono leading-none">
                        {role.matchScore}%
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Match</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {role.description}
                  </p>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-1">
                      Key Required Skills:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {role.keyMatchingSkills.map((sk) => (
                        <Badge key={sk} variant="default" size="sm">
                          {sk}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                    {role.growthPotential}
                  </span>

                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={ArrowRight}
                    className="text-xs"
                    onClick={() => onExploreRoles && onExploreRoles(role.title)}
                  >
                    View Openings
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Fast-Track Learning Sprint Card */}
      <Card variant="gradient" className="p-5 border-slate-200 dark:border-slate-800 bg-slate-900 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Recommended Upskilling Track
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">
              {result.recommendedLearningTrack.title}
            </h4>
            <p className="text-xs text-slate-300 max-w-xl">
              {result.recommendedLearningTrack.description} • <strong>{result.recommendedLearningTrack.duration}</strong>
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0"
          >
            Start Learning Sprint
          </Button>
        </div>
      </Card>
    </div>
  );
};
