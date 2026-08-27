import React from 'react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { ActiveApplication, ApplicationStatus } from '../../../types/student';
import {
  Building2,
  MapPin,
  Clock,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Plus,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Send,
  UserCheck,
  FileCheck,
  Award
} from 'lucide-react';

interface ApplicationKanbanViewProps {
  applications: ActiveApplication[];
  onSelectApplication: (app: ActiveApplication) => void;
  onUpdateStatus: (id: string, newStatus: ApplicationStatus) => void;
  onOpenAddModal: () => void;
}

interface ColumnDefinition {
  status: ApplicationStatus;
  title: string;
  badgeVariant: 'neutral' | 'info' | 'warning' | 'primary' | 'success' | 'danger';
  headerBg: string;
  headerBorder: string;
  badgeBg: string;
  icon: React.ReactNode;
}

const KANBAN_COLUMNS: ColumnDefinition[] = [
  {
    status: 'Applied',
    title: 'Applied',
    badgeVariant: 'neutral',
    headerBg: 'bg-sky-50 dark:bg-sky-950/40',
    headerBorder: 'border-sky-200 dark:border-sky-800/80',
    badgeBg: 'bg-sky-500',
    icon: <Send className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
  },
  {
    status: 'Shortlisted',
    title: 'Shortlisted',
    badgeVariant: 'info',
    headerBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    headerBorder: 'border-indigo-200 dark:border-indigo-800/80',
    badgeBg: 'bg-indigo-500',
    icon: <UserCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
  },
  {
    status: 'Assessment',
    title: 'Assessment',
    badgeVariant: 'warning',
    headerBg: 'bg-amber-50 dark:bg-amber-950/40',
    headerBorder: 'border-amber-200 dark:border-amber-800/80',
    badgeBg: 'bg-amber-500',
    icon: <FileCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
  },
  {
    status: 'Interview',
    title: 'Interview',
    badgeVariant: 'primary',
    headerBg: 'bg-teal-50 dark:bg-teal-950/40',
    headerBorder: 'border-teal-200 dark:border-teal-800/80',
    badgeBg: 'bg-teal-500',
    icon: <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
  },
  {
    status: 'Selected',
    title: 'Selected',
    badgeVariant: 'success',
    headerBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    headerBorder: 'border-emerald-200 dark:border-emerald-800/80',
    badgeBg: 'bg-emerald-500',
    icon: <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
  },
  {
    status: 'Rejected',
    title: 'Rejected',
    badgeVariant: 'danger',
    headerBg: 'bg-rose-50 dark:bg-rose-950/40',
    headerBorder: 'border-rose-200 dark:border-rose-800/80',
    badgeBg: 'bg-rose-500',
    icon: <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
  }
];

const ORDERED_STATUSES: ApplicationStatus[] = [
  'Applied',
  'Shortlisted',
  'Assessment',
  'Interview',
  'Selected'
];

export const ApplicationKanbanView: React.FC<ApplicationKanbanViewProps> = ({
  applications,
  onSelectApplication,
  onUpdateStatus,
  onOpenAddModal
}) => {
  const getNextStatus = (current: ApplicationStatus): ApplicationStatus | null => {
    if (current === 'Rejected') return 'Applied';
    const idx = ORDERED_STATUSES.indexOf(current);
    if (idx !== -1 && idx < ORDERED_STATUSES.length - 1) {
      return ORDERED_STATUSES[idx + 1];
    }
    return null;
  };

  const getPrevStatus = (current: ApplicationStatus): ApplicationStatus | null => {
    if (current === 'Rejected') return 'Applied';
    const idx = ORDERED_STATUSES.indexOf(current);
    if (idx > 0) {
      return ORDERED_STATUSES[idx - 1];
    }
    return null;
  };

  return (
    <div className="w-full overflow-x-auto pb-4">
      {/* 6 Columns Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 min-w-[1000px] xl:min-w-0">
        {KANBAN_COLUMNS.map((col) => {
          const colApps = applications.filter((app) => app.currentStage === col.status);

          return (
            <div
              key={col.status}
              className="flex flex-col rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 h-full min-h-[520px]"
            >
              {/* Column Header */}
              <div className={`p-3 rounded-t-2xl border-b ${col.headerBg} ${col.headerBorder} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-white dark:bg-slate-900 shadow-2xs">
                    {col.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {col.title}
                  </span>
                </div>

                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-2xs border border-slate-200/60 dark:border-slate-800">
                  {colApps.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="p-2.5 flex-1 space-y-2.5 overflow-y-auto max-h-[750px]">
                {colApps.length === 0 ? (
                  <div className="py-8 text-center px-2">
                    <p className="text-[11px] text-slate-400 font-medium italic">
                      No applications in {col.title}
                    </p>
                    {col.status === 'Applied' && (
                      <button
                        onClick={onOpenAddModal}
                        className="mt-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Track New
                      </button>
                    )}
                  </div>
                ) : (
                  colApps.map((app) => {
                    const prevStatus = getPrevStatus(app.currentStage);
                    const nextStatus = getNextStatus(app.currentStage);

                    return (
                      <div
                        key={app.id}
                        className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs hover:border-indigo-200 dark:hover:border-indigo-900 transition-all flex flex-col justify-between group"
                      >
                        {/* Company & Role */}
                        <div className="space-y-2.5">
                          <div className="flex items-start gap-2.5">
                            <img
                              src={app.companyLogo}
                              alt={app.company}
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {app.roleTitle}
                              </h4>
                              <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 truncate flex items-center gap-1 mt-0.5">
                                <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{app.company}</span>
                              </div>
                            </div>
                          </div>

                          {/* Current Status Badge & Match Score */}
                          <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                            <Badge variant={col.badgeVariant} size="sm" dot>
                              {app.currentStage}
                            </Badge>
                            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-100 dark:border-indigo-900">
                              {app.matchScore}% Match
                            </span>
                          </div>

                          {/* Next Step Box */}
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5 text-indigo-500" />
                                Next Step
                              </span>
                            </div>
                            <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight">
                              {app.nextStepTitle || 'Reviewing application dossier.'}
                            </div>
                            {app.nextStepDeadline && (
                              <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 pt-0.5">
                                {app.nextStepDeadline}
                              </div>
                            )}
                          </div>

                          {/* Application Date & Stipend */}
                          <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                              <Calendar className="w-3 h-3 text-indigo-500 shrink-0" />
                              <span>Applied: {app.appliedDate}</span>
                            </div>
                            <div className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 truncate">
                              {app.stipendOrSalary}
                            </div>
                          </div>
                        </div>

                        {/* Card Footer: Move Controls & Details Button */}
                        <div className="pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-1">
                          {/* Left / Right Move Buttons */}
                          <div className="flex items-center gap-1">
                            {prevStatus && (
                              <button
                                type="button"
                                title={`Move back to ${prevStatus}`}
                                onClick={() => onUpdateStatus(app.id, prevStatus)}
                                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {nextStatus && (
                              <button
                                type="button"
                                title={`Advance to ${nextStatus}`}
                                onClick={() => onUpdateStatus(app.id, nextStatus)}
                                className="p-1 rounded-md text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors font-bold"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {app.currentStage !== 'Rejected' && (
                              <button
                                type="button"
                                title="Mark as Rejected"
                                onClick={() => onUpdateStatus(app.id, 'Rejected')}
                                className="text-[10px] font-bold text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 px-1 py-0.5 rounded transition-colors"
                              >
                                ✕
                              </button>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => onSelectApplication(app)}
                            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            Details →
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
