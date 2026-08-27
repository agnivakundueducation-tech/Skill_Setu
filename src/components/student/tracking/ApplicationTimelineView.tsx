import React from 'react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { ActiveApplication, ApplicationStatus } from '../../../types/student';
import {
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  DollarSign,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Phone,
  Mail,
  User,
  Check,
  XCircle,
  ChevronDown
} from 'lucide-react';

interface ApplicationTimelineViewProps {
  applications: ActiveApplication[];
  onSelectApplication: (app: ActiveApplication) => void;
  onUpdateStatus: (id: string, newStatus: ApplicationStatus) => void;
  onOpenAddModal: () => void;
}

const STAGES_ORDER: ApplicationStatus[] = [
  'Applied',
  'Shortlisted',
  'Assessment',
  'Interview',
  'Selected'
];

const getStatusBadge = (status: ApplicationStatus) => {
  switch (status) {
    case 'Selected':
      return <Badge variant="success" size="sm" dot>Selected / Offer</Badge>;
    case 'Interview':
      return <Badge variant="primary" size="sm" dot>Interview Stage</Badge>;
    case 'Assessment':
      return <Badge variant="warning" size="sm" dot>Assessment Due</Badge>;
    case 'Shortlisted':
      return <Badge variant="info" size="sm" dot>Shortlisted</Badge>;
    case 'Rejected':
      return <Badge variant="danger" size="sm" dot>Rejected</Badge>;
    case 'Applied':
    default:
      return <Badge variant="neutral" size="sm" dot>Applied</Badge>;
  }
};

const getStageColor = (status: ApplicationStatus, isCompleted: boolean, isCurrent: boolean) => {
  if (status === 'Rejected') {
    return 'bg-rose-500 text-white border-rose-600';
  }
  if (isCompleted) {
    return 'bg-emerald-500 text-white border-emerald-600';
  }
  if (isCurrent) {
    switch (status) {
      case 'Applied':
        return 'bg-sky-500 text-white border-sky-600 ring-4 ring-sky-100 dark:ring-sky-950/60';
      case 'Shortlisted':
        return 'bg-indigo-600 text-white border-indigo-700 ring-4 ring-indigo-100 dark:ring-indigo-950/60';
      case 'Assessment':
        return 'bg-amber-500 text-white border-amber-600 ring-4 ring-amber-100 dark:ring-amber-950/60';
      case 'Interview':
        return 'bg-teal-600 text-white border-teal-700 ring-4 ring-teal-100 dark:ring-teal-950/60';
      case 'Selected':
        return 'bg-emerald-600 text-white border-emerald-700 ring-4 ring-emerald-100 dark:ring-emerald-950/60';
      default:
        return 'bg-slate-800 text-white border-slate-900';
    }
  }
  return 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700';
};

export const ApplicationTimelineView: React.FC<ApplicationTimelineViewProps> = ({
  applications,
  onSelectApplication,
  onUpdateStatus,
  onOpenAddModal
}) => {
  if (applications.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <Building2 className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No applications match your criteria</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Try clearing your search query or add a new offline application to start tracking.
        </p>
        <Button variant="outline" size="sm" onClick={onOpenAddModal} className="mt-4 text-xs">
          Track New Application
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => {
        const isRejected = app.currentStage === 'Rejected';
        const currentStageIndex = isRejected ? -1 : STAGES_ORDER.indexOf(app.currentStage);

        return (
          <Card
            key={app.id}
            variant="default"
            className="p-5 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
          >
            {/* Header section with Company, Role, Current Status, and Application Date */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-3.5">
                <img
                  src={app.companyLogo}
                  alt={app.company}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0 shadow-xs"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {app.roleTitle}
                    </h2>
                    {getStatusBadge(app.currentStage)}
                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900">
                      {app.matchScore}% Skill Match
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {app.company}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {app.location}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {app.stipendOrSalary}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-semibold">
                      <Calendar className="w-3 h-3 text-indigo-500" />
                      Applied: {app.appliedDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Selector & Dossier Button */}
              <div className="flex items-center gap-2 self-start shrink-0">
                <div className="relative">
                  <select
                    value={app.currentStage}
                    onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                    className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 pr-6 cursor-pointer appearance-none hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Applied">Status: Applied</option>
                    <option value="Shortlisted">Status: Shortlisted</option>
                    <option value="Assessment">Status: Assessment</option>
                    <option value="Interview">Status: Interview</option>
                    <option value="Selected">Status: Selected</option>
                    <option value="Rejected">Status: Rejected</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectApplication(app)}
                  className="text-xs"
                >
                  View Details
                </Button>
              </div>
            </div>

            {/* Stepper Timeline Progression */}
            <div className="py-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                <span>Recruitment Progression Pipeline</span>
                <span className="text-slate-500 dark:text-slate-400 font-semibold">
                  {isRejected ? 'Application Closed (Rejected)' : `Milestone Stage ${currentStageIndex + 1} of ${STAGES_ORDER.length}`}
                </span>
              </div>

              {/* Horizontal Milestone Stepper */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 relative">
                {STAGES_ORDER.map((stage, idx) => {
                  const isCompleted = !isRejected && idx < currentStageIndex;
                  const isCurrent = !isRejected && idx === currentStageIndex;
                  const isFuture = !isRejected && idx > currentStageIndex;

                  return (
                    <div
                      key={stage}
                      className={`relative p-2.5 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 ring-1 ring-indigo-500/20'
                          : isCompleted
                          ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                          : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/70 dark:border-slate-800 opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 ${getStageColor(
                            stage,
                            isCompleted,
                            isCurrent
                          )}`}
                        >
                          {isCompleted ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <span
                          className={`text-xs font-bold truncate ${
                            isCurrent
                              ? 'text-indigo-950 dark:text-indigo-200'
                              : isCompleted
                              ? 'text-emerald-900 dark:text-emerald-300'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {stage}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-500 dark:text-slate-400 pl-7">
                        {isCurrent ? (
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400">● Current Phase</span>
                        ) : isCompleted ? (
                          <span className="text-emerald-600 dark:text-emerald-400">✓ Completed</span>
                        ) : (
                          <span>Pending</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* If Rejected, show explicit alert */}
              {isRejected && (
                <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200">
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Application Status: Rejected. </span>
                    <span>{app.rejectionReason || 'Position filled or candidate did not meet current experience thresholds.'}</span>
                    {app.feedback && (
                      <p className="mt-1 text-[11px] text-rose-700 dark:text-rose-300">{app.feedback}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Next Step & Recruiter Callout Box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              {/* Next Step Highlight */}
              <div className="md:col-span-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Next Step</span>
                  </div>
                  {app.nextStepDeadline && (
                    <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                      Target: {app.nextStepDeadline}
                    </span>
                  )}
                </div>

                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {app.nextStepTitle || 'Reviewing candidate qualifications in pipeline.'}
                </div>

                {app.notes && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                    Note: {app.notes}
                  </p>
                )}
              </div>

              {/* Recruiter & Quick Action */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Recruiter Contact
                  </div>
                  {app.recruiterContact ? (
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {app.recruiterContact.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {app.recruiterContact.role}
                      </div>
                      <div className="text-[11px] text-indigo-600 dark:text-indigo-400 truncate font-medium mt-0.5">
                        {app.recruiterContact.email}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic">No assigned recruiter</div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-2">
                  <span className="text-[10px] font-medium text-slate-400">
                    Application ID: {app.id}
                  </span>
                  <button
                    onClick={() => onSelectApplication(app)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                  >
                    Details <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
