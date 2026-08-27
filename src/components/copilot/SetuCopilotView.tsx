import React, { useState } from 'react';
import { SetuCopilotChat } from './SetuCopilotChat';
import { CareerCoachSection } from '../student/CareerCoachSection';
import { DEFAULT_COPILOT_CONTEXT } from '../../services/copilotService';
import { Sparkles, MessageSquare, Compass, ShieldCheck, Zap } from 'lucide-react';

interface SetuCopilotViewProps {
  onNavigateTab?: (tab: string) => void;
  onTakeAssessment?: (skillName?: string) => void;
}

export const SetuCopilotView: React.FC<SetuCopilotViewProps> = ({
  onNavigateTab = () => {},
  onTakeAssessment
}) => {
  const [activeViewMode, setActiveViewMode] = useState<'chat' | 'plan'>('chat');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Setu Copilot & Career Coach
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200/60 dark:border-indigo-800">
              AI Career Intelligence
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Deterministic career readiness forecasting, personalized 30/60/90-day action plans, and real-time guidance.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveViewMode('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeViewMode === 'chat'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Copilot Chat</span>
            </button>
            <button
              onClick={() => setActiveViewMode('plan')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeViewMode === 'plan'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Career Action Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode Content */}
      {activeViewMode === 'chat' ? (
        <div className="h-[calc(100vh-230px)] min-h-[580px] w-full rounded-2xl shadow-sm">
          <SetuCopilotChat
            context={DEFAULT_COPILOT_CONTEXT}
            showCloseButton={false}
            className="h-full"
          />
        </div>
      ) : (
        <CareerCoachSection
          onNavigateTab={onNavigateTab}
          onTakeAssessment={onTakeAssessment}
        />
      )}
    </div>
  );
};
