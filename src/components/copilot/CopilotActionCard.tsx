import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionCardData } from '../../types/copilot';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Target,
  Sparkles,
  Briefcase,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface CopilotActionCardProps {
  card: ActionCardData;
  onActionClick?: (actionType: string, payload?: string) => void;
}

export const CopilotActionCard: React.FC<CopilotActionCardProps> = ({
  card,
  onActionClick
}) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (!card.primaryAction) return;

    if (onActionClick) {
      onActionClick(card.primaryAction.actionType, card.primaryAction.payload);
    }

    if (card.primaryAction.actionType === 'navigate' && card.primaryAction.payload) {
      navigate(card.primaryAction.payload);
    }
  };

  const getIcon = () => {
    switch (card.type) {
      case 'role_readiness':
        return <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'learning_path':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'internship_match':
        return <Briefcase className="w-4 h-4 text-emerald-500" />;
      case 'skill_gap':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      default:
        return <BookOpen className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="mt-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all hover:border-indigo-200 dark:hover:border-indigo-900/60">
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
            {getIcon()}
          </div>
          <div>
            <h5 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
              {card.title}
            </h5>
            {card.subtitle && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {card.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {card.metrics && card.metrics.length > 0 && (
        <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
          {card.metrics.map((m, idx) => (
            <div key={idx} className="text-center">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                {m.label}
              </span>
              <span className={`text-xs font-bold ${
                m.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                m.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' :
                m.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                m.color === 'rose' ? 'text-rose-600 dark:text-rose-400' :
                'text-slate-900 dark:text-slate-100'
              }`}>
                {m.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {card.tags && card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {card.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {card.primaryAction && (
        <button
          onClick={handleAction}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <span>{card.primaryAction.label}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
