import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { InstitutionSummaryMetrics } from '../../types/institution';
import {
  Users,
  CheckSquare,
  Sparkles,
  Briefcase,
  GraduationCap,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Target
} from 'lucide-react';

interface InstitutionMetricsCardsProps {
  metrics: InstitutionSummaryMetrics;
  onSelectMetricDrilldown?: (metricKey: string) => void;
}

export const InstitutionMetricsCards: React.FC<InstitutionMetricsCardsProps> = ({
  metrics,
  onSelectMetricDrilldown
}) => {
  const cards = [
    {
      id: 'total_students',
      label: 'Total Students',
      value: metrics.totalStudents.toLocaleString(),
      subtext: metrics.totalStudentsGrowth,
      icon: Users,
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/50',
      borderColor: 'hover:border-indigo-400 dark:hover:border-indigo-600',
      badge: 'All Cohorts (Y1-Y4)',
      badgeVariant: 'primary' as const,
      progress: 100,
      progressLabel: 'Enrolled Strength',
      progressColor: 'indigo' as const
    },
    {
      id: 'students_assessed',
      label: 'Students Assessed',
      value: metrics.studentsAssessed.toLocaleString(),
      subtext: `${metrics.assessedPercentage}% of total cohort`,
      icon: CheckSquare,
      iconColor: 'text-sky-600 dark:text-sky-400',
      bgColor: 'bg-sky-50 dark:bg-sky-950/50',
      borderColor: 'hover:border-sky-400 dark:hover:border-sky-600',
      badge: metrics.assessedGrowth,
      badgeVariant: 'info' as const,
      progress: metrics.assessedPercentage,
      progressLabel: 'Assessment Coverage',
      progressColor: 'sky' as const
    },
    {
      id: 'placement_ready',
      label: 'Placement Ready',
      value: metrics.placementReady.toLocaleString(),
      subtext: `${metrics.placementReadyPercentage}% benchmark clearance`,
      icon: Target,
      iconColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/50',
      borderColor: 'hover:border-amber-400 dark:hover:border-amber-600',
      badge: 'Tier-1/2 Ready',
      badgeVariant: 'warning' as const,
      progress: metrics.placementReadyPercentage,
      progressLabel: 'Readiness Index',
      progressColor: 'amber' as const
    },
    {
      id: 'internships',
      label: 'Internships Secured',
      value: metrics.internshipsSecured.toLocaleString(),
      subtext: `${metrics.internshipsPercentage}% active conversion`,
      icon: Briefcase,
      iconColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/50',
      borderColor: 'hover:border-purple-400 dark:hover:border-purple-600',
      badge: metrics.internshipsGrowth,
      badgeVariant: 'default' as const,
      progress: metrics.internshipsPercentage,
      progressLabel: 'Internship Rate',
      progressColor: 'purple' as const
    },
    {
      id: 'placements',
      label: 'Placements Completed',
      value: metrics.placementsCompleted.toLocaleString(),
      subtext: `Avg: ${metrics.averageSalaryCTC} • Max: ${metrics.highestPackage}`,
      icon: GraduationCap,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
      borderColor: 'hover:border-emerald-400 dark:hover:border-emerald-600',
      badge: `${metrics.placementsPercentage}% Placed`,
      badgeVariant: 'success' as const,
      progress: metrics.placementsPercentage,
      progressLabel: 'Placement Yield',
      progressColor: 'emerald' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.id}
            variant="default"
            onClick={() => onSelectMetricDrilldown?.(card.id)}
            className={`p-4 rounded-2xl border-slate-200/80 dark:border-slate-800 transition-all cursor-pointer hover:shadow-md ${card.borderColor} flex flex-col justify-between space-y-3 group`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div
                  className={`w-9 h-9 rounded-xl ${card.bgColor} ${card.iconColor} flex items-center justify-center group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <Badge variant={card.badgeVariant} size="sm" className="text-[10px] font-bold">
                  {card.badge}
                </Badge>
              </div>

              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {card.label}
              </div>
              <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">
                {card.value}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {card.subtext}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span>{card.progressLabel}</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {card.progress}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    card.progressColor === 'indigo'
                      ? 'bg-indigo-600'
                      : card.progressColor === 'sky'
                      ? 'bg-sky-500'
                      : card.progressColor === 'amber'
                      ? 'bg-amber-500'
                      : card.progressColor === 'purple'
                      ? 'bg-purple-600'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, card.progress)}%` }}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
