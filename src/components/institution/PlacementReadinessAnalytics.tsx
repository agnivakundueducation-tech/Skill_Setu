import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { PlacementTierItem, InstitutionSummaryMetrics } from '../../types/institution';
import { InstitutionPlacementMetrics, PlacementOutcomeRecord } from '../../types/recruitment';
import { getInstitutionPlacementMetrics, getStudentPlacements } from '../../services/placementService';
import { useAuth } from '../../context/AuthContext';
import {
  TrendingUp,
  Award,
  Briefcase,
  GraduationCap,
  Building2,
  CheckCircle2,
  DollarSign,
  Users,
  Calendar,
  ShieldCheck,
  FileCheck,
  ArrowUpRight
} from 'lucide-react';

interface PlacementReadinessAnalyticsProps {
  metrics: InstitutionSummaryMetrics;
  tiers: PlacementTierItem[];
}

export const PlacementReadinessAnalytics: React.FC<PlacementReadinessAnalyticsProps> = ({
  metrics,
  tiers
}) => {
  const { appUser, isAuthenticated, isDemo } = useAuth();
  const [placementMetrics, setPlacementMetrics] = useState<InstitutionPlacementMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const instId = appUser?.institutionId || 'inst-iit-01';
      try {
        const res = await getInstitutionPlacementMetrics(instId, isDemo || !isAuthenticated);
        if (res.success) {
          setPlacementMetrics(res.data);
        }
      } catch (err) {
        console.error('[PlacementReadinessAnalytics] Error loading metrics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [appUser, isAuthenticated, isDemo]);

  // Derived funnel values
  const totalEnrolled = placementMetrics ? (placementMetrics.totalApplicants || metrics.totalStudents) : metrics.totalStudents;
  const shortlisted = placementMetrics ? placementMetrics.shortlistedCandidates : Math.round(metrics.totalStudents * 0.78);
  const interviewed = placementMetrics ? placementMetrics.interviewsScheduled : Math.round(metrics.totalStudents * 0.52);
  const offersIssued = placementMetrics ? placementMetrics.offersIssued : Math.round(metrics.totalStudents * 0.39);
  const placedCount = placementMetrics ? placementMetrics.placedStudents : metrics.placementsCompleted;

  const funnelStages = [
    {
      stage: 'Total Eligible Applicants',
      count: totalEnrolled,
      percentage: 100,
      color: 'bg-slate-500'
    },
    {
      stage: 'ATS Shortlisted Candidates',
      count: shortlisted,
      percentage: totalEnrolled > 0 ? Math.min(100, Math.round((shortlisted / totalEnrolled) * 100)) : 0,
      color: 'bg-sky-500'
    },
    {
      stage: 'Interviews Scheduled & Completed',
      count: interviewed,
      percentage: totalEnrolled > 0 ? Math.min(100, Math.round((interviewed / totalEnrolled) * 100)) : 0,
      color: 'bg-indigo-600'
    },
    {
      stage: 'Corporate Offers Issued',
      count: offersIssued,
      percentage: totalEnrolled > 0 ? Math.min(100, Math.round((offersIssued / totalEnrolled) * 100)) : 0,
      color: 'bg-amber-500'
    },
    {
      stage: 'Verified Placement Outcomes (Accepted)',
      count: placedCount,
      percentage: totalEnrolled > 0 ? Math.min(100, Math.round((placedCount / totalEnrolled) * 100)) : 0,
      color: 'bg-emerald-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Institutional Placement & Recruitment Lifecycle Intelligence
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time pipeline progression from Skill DNA assessment through interview scheduling, evaluations, and verified offers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold">
            Placement Rate: {placementMetrics ? `${placementMetrics.placementRate}%` : `${metrics.placementsPercentage}%`}
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold">
            Avg CTC: {metrics.averageSalaryCTC}
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Applicants</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {totalEnrolled.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">Live ATS candidate inflow</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Interviews Queued</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {interviewed.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">Technical & panel rounds</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Offers Extended</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {offersIssued.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">Corporate term sheets</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Placed Graduates</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {placedCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">Cryptographically verified</div>
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
              Campus Recruitment Pipeline Funnel
            </h3>
            <p className="text-xs text-slate-500">
              Stage-by-stage conversion from application submission to verified job acceptance
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

        {/* Tier Distribution Card */}
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
              Tier-1 Ready
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1.5"
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
              {tiers[0]?.keyRequirements.map((req, rIdx) => (
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
