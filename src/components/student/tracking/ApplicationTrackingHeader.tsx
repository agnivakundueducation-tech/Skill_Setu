import React from 'react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { ApplicationStatus } from '../../../types/student';
import {
  Send,
  Kanban,
  ListTree,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface ApplicationTrackingHeaderProps {
  viewMode: 'timeline' | 'kanban';
  onViewModeChange: (mode: 'timeline' | 'kanban') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: 'all' | ApplicationStatus;
  onStatusFilterChange: (status: 'all' | ApplicationStatus) => void;
  onOpenAddModal: () => void;
  onExploreOpportunities: () => void;
  statusCounts: Record<ApplicationStatus, number>;
  totalCount: number;
}

const STATUS_CONFIG: { status: ApplicationStatus; label: string; color: string; bg: string; border: string; text: string }[] = [
  { status: 'Applied', label: 'Applied', color: 'sky', bg: 'bg-sky-50 dark:bg-sky-950/50', border: 'border-sky-200 dark:border-sky-800', text: 'text-sky-700 dark:text-sky-300' },
  { status: 'Shortlisted', label: 'Shortlisted', color: 'indigo', bg: 'bg-indigo-50 dark:bg-indigo-950/50', border: 'border-indigo-200 dark:border-indigo-800', text: 'text-indigo-700 dark:text-indigo-300' },
  { status: 'Assessment', label: 'Assessment', color: 'amber', bg: 'bg-amber-50 dark:bg-amber-950/50', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-300' },
  { status: 'Interview', label: 'Interview', color: 'teal', bg: 'bg-teal-50 dark:bg-teal-950/50', border: 'border-teal-200 dark:border-teal-800', text: 'text-teal-700 dark:text-teal-300' },
  { status: 'Selected', label: 'Selected', color: 'emerald', bg: 'bg-emerald-50 dark:bg-emerald-950/50', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-300' },
  { status: 'Rejected', label: 'Rejected', color: 'rose', bg: 'bg-rose-50 dark:bg-rose-950/50', border: 'border-rose-200 dark:border-rose-800', text: 'text-rose-700 dark:text-rose-300' },
];

export const ApplicationTrackingHeader: React.FC<ApplicationTrackingHeaderProps> = ({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onOpenAddModal,
  onExploreOpportunities,
  statusCounts,
  totalCount
}) => {
  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Send className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Application Lifecycle Tracker
            </span>
            <Badge variant="primary" size="sm" className="ml-1 font-semibold">
              {totalCount} Total Applications
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Application Tracking Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
            Monitor real-time hiring stages, assessment deadlines, interview rounds, and offer packages across all 6 verified recruitment milestones.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            leftIcon={Plus}
            onClick={onOpenAddModal}
            className="text-xs font-medium"
          >
            Track Application
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={Sparkles}
            onClick={onExploreOpportunities}
            className="text-xs font-medium"
          >
            Explore Opportunities
          </Button>
        </div>
      </div>

      {/* 6 Status Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {STATUS_CONFIG.map((cfg) => {
          const count = statusCounts[cfg.status] || 0;
          const isSelected = statusFilter === cfg.status;
          return (
            <button
              key={cfg.status}
              type="button"
              onClick={() => onStatusFilterChange(isSelected ? 'all' : cfg.status)}
              className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? `${cfg.bg} ${cfg.border} ring-2 ring-indigo-500/30 dark:ring-indigo-400/30 shadow-xs`
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  {cfg.label}
                </span>
                <span className={`w-2 h-2 rounded-full ${
                  cfg.status === 'Applied' ? 'bg-sky-500' :
                  cfg.status === 'Shortlisted' ? 'bg-indigo-500' :
                  cfg.status === 'Assessment' ? 'bg-amber-500' :
                  cfg.status === 'Interview' ? 'bg-teal-500' :
                  cfg.status === 'Selected' ? 'bg-emerald-500' : 'bg-rose-500'
                }`} />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {count}
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  {totalCount > 0 ? `${Math.round((count / totalCount) * 100)}%` : '0%'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Controls & View Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        {/* Search & Filter */}
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company or role..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {statusFilter !== 'all' && (
            <button
              onClick={() => onStatusFilterChange('all')}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Clear Filter ({statusFilter})
            </button>
          )}
        </div>

        {/* View Mode Toggle: Timeline View vs Kanban View */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onViewModeChange('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'timeline'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ListTree className="w-3.5 h-3.5" />
            <span>Timeline View</span>
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'kanban'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban View</span>
          </button>
        </div>
      </div>
    </div>
  );
};
