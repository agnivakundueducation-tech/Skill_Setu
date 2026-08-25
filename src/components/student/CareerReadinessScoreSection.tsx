import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { STUDENT_READINESS_DATA } from '../../data/studentData';
import { ReadinessTrendChart } from './ReadinessTrendChart';
import { SkillDnaRadarChart } from './SkillDnaRadarChart';
import {
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';

interface CareerReadinessScoreSectionProps {
  onTakeAssessment?: () => void;
  onExploreOpportunities?: () => void;
}

export const CareerReadinessScoreSection: React.FC<CareerReadinessScoreSectionProps> = ({
  onTakeAssessment,
  onExploreOpportunities
}) => {
  const data = STUDENT_READINESS_DATA;

  return (
    <div className="space-y-6">
      {/* Top Banner with Score Gauge */}
      <Card variant="gradient" className="p-6 border-indigo-200 dark:border-indigo-900 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
                AI-Verified Index
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {data.tier}
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Career Readiness Score: {data.overallScore} / 100
            </h2>
            
            <p className="text-sm text-indigo-100/80 leading-relaxed">
              Your comprehensive competency evaluation places you in the <strong className="text-white">Top {100 - data.percentile}% percentile</strong> for <span className="text-indigo-200 underline decoration-indigo-400 decoration-wavy underline-offset-4">{data.targetRole}</span> roles.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <Button
              variant="primary"
              size="md"
              leftIcon={Sparkles}
              className="bg-white hover:bg-slate-100 text-indigo-900 font-bold shadow-lg shadow-indigo-950/40"
              onClick={onTakeAssessment}
            >
              Take Assessment
            </Button>
            <Button
              variant="outline"
              size="md"
              rightIcon={ArrowRight}
              className="border-indigo-400/40 text-white hover:bg-indigo-800/40"
              onClick={onExploreOpportunities}
            >
              Matched Roles
            </Button>
          </div>
        </div>
      </Card>

      {/* Dual Analytics Grid: Historical Trend + Skill DNA Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card variant="default" className="lg:col-span-7 p-6 border-slate-200/80 dark:border-slate-800">
          <ReadinessTrendChart height={280} />
        </Card>

        <Card variant="default" className="lg:col-span-5 p-6 border-slate-200/80 dark:border-slate-800">
          <SkillDnaRadarChart height={280} />
        </Card>
      </div>

      {/* Domain Breakdown Progress Bars */}
      <Card variant="default" className="p-6 border-slate-200/80 dark:border-slate-800">
        <CardHeader className="p-0 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Domain Competency Benchmarks
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluation breakdown against Tier-1 global technology hiring standards
              </CardDescription>
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Target Role Match: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{data.targetRoleMatch}%</span>
            </div>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {data.scoreBreakdown.map((item) => (
            <div key={item.domain} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {item.domain}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Benchmark: {item.benchmark}</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {item.score}/100
                  </span>
                </div>
              </div>
              <ProgressBar
                value={item.score}
                color={item.score >= 90 ? 'emerald' : item.score >= 80 ? 'indigo' : 'amber'}
                size="sm"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Key Strengths & Growth Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="default" className="p-5 border-emerald-200/70 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Verified Strengths
            </h4>
          </div>
          <ul className="space-y-2">
            {data.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card variant="default" className="p-5 border-amber-200/70 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Target Growth Milestones
            </h4>
          </div>
          <ul className="space-y-2">
            {data.growthOpportunities.map((growth, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{growth}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};
