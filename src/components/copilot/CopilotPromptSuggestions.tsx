import React from 'react';
import { CopilotPromptTemplate } from '../../types/copilot';
import { UserRole } from '../../types';
import { getPromptTemplatesForRole } from '../../services/copilotService';
import { Target, Sparkles, Briefcase, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface CopilotPromptSuggestionsProps {
  role?: UserRole;
  onSelectPrompt: (promptText: string) => void;
  className?: string;
}

export const CopilotPromptSuggestions: React.FC<CopilotPromptSuggestionsProps> = ({
  role = 'student',
  onSelectPrompt,
  className = ''
}) => {
  const effectiveRole: UserRole = (role as UserRole) || 'student';
  const promptTemplates = getPromptTemplatesForRole(effectiveRole);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Target':
        return <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'Briefcase':
        return <Briefcase className="w-4 h-4 text-emerald-500" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          Example Questions ({role.charAt(0).toUpperCase() + role.slice(1)})
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          Click to ask instantly
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {promptTemplates.map((q) => (
          <button
            key={q.id}
            onClick={() => onSelectPrompt(q.prompt)}
            className="p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all text-left group flex items-start justify-between gap-2.5 shadow-2xs cursor-pointer"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {getIcon(q.icon)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                  {q.prompt}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {q.description}
                </div>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
};

