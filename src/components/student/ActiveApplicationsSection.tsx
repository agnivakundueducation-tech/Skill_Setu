import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { STUDENT_ACTIVE_APPLICATIONS } from '../../data/studentData';
import { ActiveApplication, ApplicationStage } from '../../types/student';
import {
  Send,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  DollarSign,
  User,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Search
} from 'lucide-react';

interface ActiveApplicationsSectionProps {
  onSelectApplication?: (application: ActiveApplication) => void;
  onExploreOpportunities?: () => void;
}

export const ActiveApplicationsSection: React.FC<ActiveApplicationsSectionProps> = ({
  onSelectApplication,
  onExploreOpportunities
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'interview' | 'offer' | 'assessment'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const applications = STUDENT_ACTIVE_APPLICATIONS.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.roleTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const stageStr = app.currentStage as string;
    if (statusFilter === 'interview') return matchesSearch && (stageStr === 'Interview' || stageStr.includes('Interview'));
    if (statusFilter === 'offer') return matchesSearch && (stageStr === 'Selected' || stageStr === 'Offer Received');
    if (statusFilter === 'assessment') return matchesSearch && (stageStr === 'Assessment' || stageStr.includes('Assessment'));
    return matchesSearch;
  });

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'Selected':
      case 'Offer Received':
        return <Badge variant="success" size="sm" dot>Selected / Offer</Badge>;
      case 'Interview':
      case 'System Design Interview':
      case 'Culture & HR':
        return <Badge variant="primary" size="sm" dot>Interview Stage</Badge>;
      case 'Assessment':
      case 'Technical Assessment':
        return <Badge variant="warning" size="sm" dot>Assessment</Badge>;
      case 'Shortlisted':
        return <Badge variant="info" size="sm" dot>Shortlisted</Badge>;
      case 'Rejected':
        return <Badge variant="danger" size="sm" dot>Rejected</Badge>;
      case 'Screening':
      case 'Applied':
      default:
        return <Badge variant="neutral" size="sm" dot>Applied</Badge>;
    }
  };

  const STAGES_LIST: ApplicationStage[] = [
    'Applied',
    'Screening',
    'Technical Assessment',
    'System Design Interview',
    'Offer Received'
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Send className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Application Lifecycle Tracker
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {STUDENT_ACTIVE_APPLICATIONS.length} Active Enterprise Applications
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track hiring rounds, upcoming interview schedules, assessment tasks, and offer packages
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={Sparkles}
          onClick={onExploreOpportunities}
          className="shrink-0"
        >
          Explore More Opportunities
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company or role title..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Quick status tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            All Applications ({STUDENT_ACTIVE_APPLICATIONS.length})
          </button>
          <button
            onClick={() => setStatusFilter('offer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === 'offer'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            Offers (1)
          </button>
          <button
            onClick={() => setStatusFilter('interview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === 'interview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
            }`}
          >
            Interviews (2)
          </button>
          <button
            onClick={() => setStatusFilter('assessment')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === 'assessment'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 border border-slate-200 dark:border-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40'
            }`}
          >
            Assessments (2)
          </button>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((app) => (
          <Card
            key={app.id}
            variant="default"
            className="p-5 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-md"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              {/* Company & Role info */}
              <div className="flex items-start gap-3.5">
                <img
                  src={app.companyLogo}
                  alt={app.company}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {app.roleTitle}
                    </h3>
                    {getStageBadge(app.currentStage)}
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded-full">
                      {app.matchScore}% Match
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {app.company}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {app.location}
                    </span>
                    <span>•</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                      {app.stipendOrSalary}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action and deadline callout */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-end lg:self-center shrink-0">
                {app.nextStepDeadline && (
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Next Step Deadline
                    </div>
                    <div className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 sm:justify-end">
                      <Clock className="w-3.5 h-3.5" />
                      {app.nextStepDeadline}
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  rightIcon={ChevronRight}
                  onClick={() => onSelectApplication && onSelectApplication(app)}
                >
                  View Details
                </Button>
              </div>
            </div>

            {/* Visual 5-Stage Stepper */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Hiring Progress: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{app.currentStage}</span>
                </span>
                <span className="text-[11px] font-medium">Applied on {app.appliedDate}</span>
              </div>

              {/* Stepper track */}
              <div className="grid grid-cols-5 gap-2">
                {STAGES_LIST.map((stageName, index) => {
                  const stepNumber = index + 1;
                  const isCompleted = stepNumber < app.stageStep;
                  const isCurrent = stepNumber === app.stageStep;
                  const isPending = stepNumber > app.stageStep;

                  return (
                    <div key={stageName} className="space-y-1.5">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isCompleted
                            ? 'bg-emerald-500'
                            : isCurrent
                            ? 'bg-indigo-600 ring-2 ring-indigo-400/30'
                            : 'bg-slate-100 dark:bg-slate-800'
                        }`}
                      />
                      <div className="hidden sm:block">
                        <div
                          className={`text-[10px] truncate font-medium ${
                            isCurrent
                              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                              : isCompleted
                              ? 'text-slate-700 dark:text-slate-300'
                              : 'text-slate-400'
                          }`}
                        >
                          {stageName}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recruiter / Prep note highlight */}
              <div className="mt-2 text-xs bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Notes:</span>
                  <span className="truncate">{app.notes}</span>
                </div>
                {app.recruiterContact && (
                  <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                    Recruiter: {app.recruiterContact.name} ({app.recruiterContact.email})
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
