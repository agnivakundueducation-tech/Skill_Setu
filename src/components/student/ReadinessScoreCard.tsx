import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { STUDENT_READINESS_DATA } from '../../data/studentData';
import { TrendingUp, Sparkles, Target, ChevronRight, Award, CheckCircle2, AlertCircle } from 'lucide-react';

interface ReadinessScoreCardProps {
  onTakeAssessment?: () => void;
  onViewDetails?: () => void;
  overallScore?: number;
  tier?: string;
  percentile?: number;
  targetRole?: string;
  targetRoleMatch?: number;
  isAssessed?: boolean;
  profileCompletion?: number;
}

export const ReadinessScoreCard: React.FC<ReadinessScoreCardProps> = ({
  onTakeAssessment,
  onViewDetails,
  overallScore,
  tier,
  percentile,
  targetRole,
  targetRoleMatch,
  isAssessed = true,
  profileCompletion
}) => {
  const defaultData = STUDENT_READINESS_DATA;
  const score = overallScore !== undefined ? overallScore : defaultData.overallScore;
  const tierLabel = tier || (score >= 80 ? 'Tier 1: Job Ready' : score >= 65 ? 'Tier 2: Interview Eligible' : 'Tier 3: Early Readiness');
  const userPercentile = percentile !== undefined ? percentile : defaultData.percentile;
  const roleName = targetRole || defaultData.targetRole;
  const roleMatch = targetRoleMatch !== undefined ? targetRoleMatch : defaultData.targetRoleMatch;

  return (
    <Card variant="default" className="relative overflow-hidden p-5 flex flex-col justify-between border-indigo-200/70 dark:border-indigo-900/60 bg-gradient-to-br from-white via-indigo-50/20 to-white dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 shadow-xs hover:shadow-md transition-shadow">
      {/* Decorative ambient gradient */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Readiness Score
            </span>
          </div>
          <Badge variant={isAssessed ? "success" : "warning"} size="sm" dot>
            {isAssessed ? tierLabel : 'Assessment Needed'}
          </Badge>
        </div>

        {/* Big Score Display */}
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isAssessed ? score : '—'}
          </span>
          <span className="text-lg font-semibold text-slate-400 dark:text-slate-500">
            / 100
          </span>
          {isAssessed && (
            <span className="ml-auto flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{defaultData.monthlyChange}% MoM
            </span>
          )}
        </div>

        {/* Progress bar and percentile */}
        <div className="space-y-1.5 my-3">
          <ProgressBar value={isAssessed ? score : 0} color="indigo" size="md" />
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Benchmark: 76</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {isAssessed ? `Top ${100 - userPercentile}% Percentile` : 'Pending Evaluation'}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
          {isAssessed ? (
            <>Target Role: <strong className="text-slate-900 dark:text-slate-100">{roleName}</strong> ({roleMatch}% Match).</>
          ) : (
            <>Complete the adaptive skill assessment to unlock your Skill DNA.</>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
        <Button
          variant="primary"
          size="sm"
          className="flex-1 text-xs"
          leftIcon={Sparkles}
          onClick={onTakeAssessment}
        >
          {isAssessed ? 'Adaptive AI Test' : 'Take Assessment'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-slate-600 dark:text-slate-300"
          rightIcon={ChevronRight}
          onClick={onViewDetails}
        >
          Matrix
        </Button>
      </div>
    </Card>
  );
};
