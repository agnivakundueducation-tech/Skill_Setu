import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { PlacementTierItem, InstitutionSummaryMetrics } from '../../types/institution';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import {
  TrendingUp,
  Award,
  Briefcase,
  GraduationCap,
  Building2,
  CheckCircle2,
  DollarSign,
  Users
} from 'lucide-react';

interface PlacementReadinessAnalyticsProps {
  metrics: InstitutionSummaryMetrics;
  tiers: PlacementTierItem[];
}

export const PlacementReadinessAnalytics: React.FC<PlacementReadinessAnalyticsProps> = ({
  metrics,
  tiers
}) => {
  // Pie chart data
  const pieData = tiers.map((tier) => ({
    name: tier.tier,
    value: tier.studentCount,
    color: tier.id === 'tier_dream' ? '#10b981' : tier.id === 'tier_core' ? '#6366f1' : '#38bdf8'
  }));

  // Funnel progression data
  const funnelStages = [
    { stage: 'Total Eligible Enrolled', count: metrics.totalStudents, percentage: 100, color: 'bg-slate-400' },
    { stage: 'Skills & Aptitude Assessed', count: metrics.studentsAssessed, percentage: metrics.assessedPercentage, color: 'bg-sky-500' },
    { stage: 'Placement Benchmark Ready', count: metrics.placementReady, percentage: metrics.placementReadyPercentage, color: 'bg-amber-500' },
    { stage: 'Industry Internships Secured', count: metrics.internshipsSecured, percentage: metrics.internshipsPercentage, color: 'bg-indigo-600' },
    { stage: 'Final Offers & Placements', count: metrics.placementsCompleted, percentage: metrics.placementsPercentage, color: 'bg-emerald-600' }
  ];

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Placement Readiness Tiers & Recruitment Funnel
          </h2>
          <p className="text-xs text-slate-500">
            Conversion analytics tracking cohort progression from baseline skill assessment to Tier-1 product offers.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            Avg CTC: {metrics.averageSalaryCTC}
          </span>
          <span>•</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            Highest: {metrics.highestPackage}
          </span>
        </div>
      </div>

      {/* Funnel & Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recruitment Conversion Funnel */}
        <Card
          variant="default"
          className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-4"
        >
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Campus Recruitment Pipeline Conversion
            </h3>
            <p className="text-xs text-slate-500">
              Step-by-step conversion from enrollment to confirmed placement offer
            </p>
          </div>

          <div className="space-y-3">
            {funnelStages.map((stage, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {stage.stage}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {stage.count.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-400">({stage.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stage.color}`}
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Tier Distribution Pie / Card */}
        <Card
          variant="default"
          className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Placement Tier Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                Segmented by salary bracket and technical assessment difficulty
              </p>
            </div>
            <Badge variant="success" size="sm">
              2,890 Ready
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2"
              >
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 truncate">
                  {tier.tier}
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {tier.studentCount}
                </div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {tier.packageRange}
                </div>
                <div className="text-[10px] text-slate-500">
                  {tier.percentage}% of placement cohort
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Key Requirements for Tier-1 Super Dream:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tiers[0].keyRequirements.map((req, rIdx) => (
                <span
                  key={rIdx}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60"
                >
                  ✓ {req}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
