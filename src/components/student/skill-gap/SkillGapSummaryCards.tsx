import React from 'react';
import { SkillGapOverviewStats, CareerPathRole } from '../../../types/skillGap';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { ProgressBar } from '../../ui/ProgressBar';
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Target,
  Briefcase,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

interface SkillGapSummaryCardsProps {
  stats: SkillGapOverviewStats;
  targetRoles: CareerPathRole[];
  selectedRoleId: string;
  onSelectRole: (roleId: string) => void;
  onFilterStatus?: (status: 'all' | 'critical' | 'moderate' | 'aligned') => void;
  selectedFilterStatus?: string;
  onTakeAction?: () => void;
}

export const SkillGapSummaryCards: React.FC<SkillGapSummaryCardsProps> = ({
  stats,
  targetRoles,
  selectedRoleId,
  onSelectRole,
  onFilterStatus,
  selectedFilterStatus = 'all',
  onTakeAction
}) => {
  const currentRole = targetRoles.find((r) => r.id === selectedRoleId) || targetRoles[0];

  return (
    <div className="space-y-4">
      {/* Top Target Benchmark Selection Bar */}
      <Card variant="default" className="p-4 sm:p-5 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Industry Benchmark:
                </span>
                <Badge variant="primary" size="sm">
                  {currentRole.industryDemand} Demand
                </Badge>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  Avg Comp: {currentRole.avgSalary}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentRole.description}
              </p>
            </div>
          </div>

          {/* Role Selector Dropdown / Pills */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Role Benchmark:</span>
            <select
              value={selectedRoleId}
              onChange={(e) => onSelectRole(e.target.value)}
              aria-label="Target Role Benchmark"
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-2xs"
            >
              {targetRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* 4-Column Indicator Breakdown Grid (Red / Yellow / Green / Overall Readiness) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* RED: Critical Gaps */}
        <div
          onClick={() => onFilterStatus && onFilterStatus(selectedFilterStatus === 'critical' ? 'all' : 'critical')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            selectedFilterStatus === 'critical'
              ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 shadow-md ring-2 ring-rose-400/30'
              : 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-900/50 hover:border-rose-300 dark:hover:border-rose-800 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                Critical Gaps
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              High Priority
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div className="text-3xl font-black text-rose-600 dark:text-rose-400">
              {stats.criticalGapsCount}
              <span className="text-xs font-medium text-slate-400 ml-1">/ {stats.totalSkills} skills</span>
            </div>
            <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-0.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Gap &ge; 25 pts
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-1">
            Top focus: <strong className="text-rose-600 dark:text-rose-400">{stats.topPrioritySkill}</strong>
          </p>

          <div className="mt-3 pt-2 border-t border-rose-100 dark:border-rose-900/40 text-[11px] text-rose-600 dark:text-rose-400 font-semibold flex items-center justify-between">
            <span>Filter Red Items</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* YELLOW: Moderate Gaps */}
        <div
          onClick={() => onFilterStatus && onFilterStatus(selectedFilterStatus === 'moderate' ? 'all' : 'moderate')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            selectedFilterStatus === 'moderate'
              ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 shadow-md ring-2 ring-amber-400/30'
              : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/50 hover:border-amber-300 dark:hover:border-amber-800 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Moderate Gaps
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Medium Priority
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
              {stats.moderateGapsCount}
              <span className="text-xs font-medium text-slate-400 ml-1">/ {stats.totalSkills} skills</span>
            </div>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-0.5">
              <AlertCircle className="w-3.5 h-3.5" />
              10-24 pts gap
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-1">
            Requires targeted project labs & practice
          </p>

          <div className="mt-3 pt-2 border-t border-amber-100 dark:border-amber-900/40 text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center justify-between">
            <span>Filter Yellow Items</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* GREEN: Aligned & Mastered */}
        <div
          onClick={() => onFilterStatus && onFilterStatus(selectedFilterStatus === 'aligned' ? 'all' : 'aligned')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            selectedFilterStatus === 'aligned'
              ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 shadow-md ring-2 ring-emerald-400/30'
              : 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Industry Aligned
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Low / Mastered
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.alignedCount}
              <span className="text-xs font-medium text-slate-400 ml-1">/ {stats.totalSkills} skills</span>
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              &lt; 10 pts / Exceeds
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-1">
            Meets or exceeds hiring threshold
          </p>

          <div className="mt-3 pt-2 border-t border-emerald-100 dark:border-emerald-900/40 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-between">
            <span>Filter Green Items</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Overall Benchmark Match / Readiness Index */}
        <div className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/70 via-white to-sky-50/70 dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                Target Match Index
              </span>
              <Badge variant="primary" size="sm">
                Overall Score
              </Badge>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {stats.readinessPercentage}%
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Avg Gap: <strong>{stats.overallGapIndex} pts</strong>
              </span>
            </div>

            <div className="mt-2 space-y-1">
              <ProgressBar
                value={stats.readinessPercentage}
                color={stats.readinessPercentage >= 80 ? 'emerald' : 'indigo'}
                size="sm"
              />
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">Current: <strong>{stats.averageCurrentLevel}</strong> / Req: <strong>{stats.averageRequiredLevel}</strong></span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">Active Pipeline</span>
          </div>
        </div>
      </div>
    </div>
  );
};
