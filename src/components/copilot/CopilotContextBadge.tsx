import React from 'react';
import { CopilotContext } from '../../types/copilot';
import { Target, Zap, CheckCircle2 } from 'lucide-react';

interface CopilotContextBadgeProps {
  context: CopilotContext;
  onRefresh?: () => void;
  className?: string;
}

export const CopilotContextBadge: React.FC<CopilotContextBadgeProps> = ({
  context,
  className = ''
}) => {
  return (
    <div className={`p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 text-xs ${className}`}>
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
          <Target className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">
              {context.targetRole}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-medium">
              Live Profile Synced
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded-md">
          <Zap className="w-3 h-3" />
          <span>{context.readinessScore}% Ready</span>
        </div>
      </div>
    </div>
  );
};
