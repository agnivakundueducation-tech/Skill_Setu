import React from 'react';
import { 
  Target, 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  ArrowUpRight, 
  Share2, 
  Download, 
  RefreshCw,
  Award,
  ChevronDown
} from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { CareerRoadmapData } from '../../../types/careerRoadmap';
import { CAREER_GOAL_PRESETS } from '../../../data/careerRoadmapData';

interface CareerRoadmapHeaderProps {
  roadmap: CareerRoadmapData;
  activeGoal: string;
  onGoalChange: (goalName: string) => void;
  onOpenAdvisor: () => void;
  completedTasksCount: number;
  totalTasksCount: number;
  calculatedCurrentReadiness: number;
}

export const CareerRoadmapHeader: React.FC<CareerRoadmapHeaderProps> = ({
  roadmap,
  activeGoal,
  onGoalChange,
  onOpenAdvisor,
  completedTasksCount,
  totalTasksCount,
  calculatedCurrentReadiness,
}) => {
  const [showGoalDropdown, setShowGoalDropdown] = React.useState(false);
  const netIncrease = roadmap.projectedFinalReadiness - roadmap.currentReadiness;
  const progressPercent = Math.round((completedTasksCount / Math.max(totalTasksCount, 1)) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
      {/* Background ambient gradient accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Top bar: AI Title & Action controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                SkillSetu AI Career Engine
              </span>
              <span className="text-xs text-slate-400 font-medium">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Updated Today
              </span>
              <Badge variant="success" size="sm" dot>Active Milestone Plan</Badge>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
              <span>AI Career Roadmap</span>
              <span className="text-slate-400 font-normal text-lg sm:text-xl">/</span>
              <span className="text-primary">{roadmap.careerGoal}</span>
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              {roadmap.goalDescription}
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenAdvisor}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white text-sm font-semibold shadow-md shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Career Advisor</span>
            </button>
            <button 
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors"
              title="Export Roadmap PDF"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Primary Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Career Goal with Switcher */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-4.5 relative group">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-primary" />
                Target Career Goal
              </span>
              <div className="relative">
                <button
                  onClick={() => setShowGoalDropdown(!showGoalDropdown)}
                  className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-0.5 px-1.5 py-0.5 rounded hover:bg-primary/10 transition-colors"
                >
                  <span>Switch</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showGoalDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 p-1.5">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase px-2 py-1">
                      Choose Benchmark Goal
                    </div>
                    {CAREER_GOAL_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => {
                          onGoalChange(preset.name);
                          setShowGoalDropdown(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          preset.name === activeGoal
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div>
                          <div className="font-medium">{preset.name}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[170px]">{preset.description}</div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500">{preset.readiness}%</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <span>{roadmap.careerGoal}</span>
            </div>
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Targeting Tier-1 Tech SDE Placements</span>
            </div>
          </div>

          {/* Card 2: Current Readiness (Explicitly 78% with live interactive calculation) */}
          <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/30 dark:from-indigo-950/20 dark:to-slate-800/60 border border-indigo-200/80 dark:border-indigo-900/60 rounded-xl p-4.5">
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Current Readiness
              </span>
              <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold rounded-full">
                Baseline
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-indigo-950 dark:text-indigo-100 tracking-tight">
                {calculatedCurrentReadiness}%
              </span>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {calculatedCurrentReadiness > roadmap.currentReadiness ? `(+${calculatedCurrentReadiness - roadmap.currentReadiness}% live gain)` : 'Verified'}
              </span>
            </div>
            <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${calculatedCurrentReadiness}%` }}
              />
            </div>
          </div>

          {/* Card 3: Projected Final Readiness */}
          <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/20 dark:to-slate-800/60 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl p-4.5">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Projected Readiness
              </span>
              <span className="text-xs px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold rounded-full">
                +{netIncrease}% Total Lift
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-950 dark:text-emerald-100 tracking-tight">
                {roadmap.projectedFinalReadiness}%
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Job & Internship Ready
              </span>
            </div>
            <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${roadmap.projectedFinalReadiness}%` }}
              />
            </div>
          </div>

          {/* Card 4: Roadmap Milestones Progress */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-4.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Milestones Completion
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {completedTasksCount} / {totalTasksCount}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {progressPercent}%
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {roadmap.totalPhases} Key Phases
              </span>
            </div>
            <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
