import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { STUDENT_ACTIVE_APPLICATIONS } from '../../data/studentData';
import { Send, Clock, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';

interface ApplicationsCardProps {
  onViewAll?: () => void;
  onSelectApplication?: (id: string) => void;
}

export const ApplicationsCard: React.FC<ApplicationsCardProps> = ({
  onViewAll,
  onSelectApplication
}) => {
  const applications = STUDENT_ACTIVE_APPLICATIONS;
  const urgentApp = applications.find(a => a.status === 'urgent') || applications[0];
  const offerCount = applications.filter(a => a.currentStage === 'Selected').length;
  const interviewCount = applications.filter(a => a.currentStage === 'Interview').length;

  return (
    <Card variant="default" className="relative overflow-hidden p-5 flex flex-col justify-between border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Send className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Applications
            </span>
          </div>
          {offerCount > 0 ? (
            <Badge variant="success" size="sm" dot>
              {offerCount} Offer Released
            </Badge>
          ) : (
            <Badge variant="primary" size="sm">
              {applications.length} Active
            </Badge>
          )}
        </div>

        {/* Big Count Display */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {applications.length}
          </span>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            In Pipeline
          </span>
          <div className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" />
            {interviewCount} In Interviews
          </div>
        </div>

        {/* Urgent Stage Callout */}
        {urgentApp && (
          <div className="p-3 my-2 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 space-y-1.5">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {urgentApp.company}
              </span>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100/80 dark:bg-indigo-900/60 px-1.5 py-0.5 rounded">
                Stage {urgentApp.stageStep}/5
              </span>
            </div>
            <div className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate">
              {urgentApp.roleTitle}
            </div>
            <div className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span className="truncate">Next: {urgentApp.nextStepTitle || 'Review Stage'}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          rightIcon={ChevronRight}
          onClick={onViewAll}
        >
          Track All Pipeline
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-indigo-600 dark:text-indigo-400"
          onClick={() => onSelectApplication && urgentApp && onSelectApplication(urgentApp.id)}
        >
          Prep Round
        </Button>
      </div>
    </Card>
  );
};
