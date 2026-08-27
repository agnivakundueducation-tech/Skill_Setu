import React from 'react';
import { X, BookOpen, ExternalLink, CheckCircle2, Award, Clock, ArrowRight, Code2 } from 'lucide-react';
import { RoadmapMilestoneTask, RoadmapPhase } from '../../../types/careerRoadmap';

interface RoadmapResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: RoadmapMilestoneTask | null;
  phase: RoadmapPhase | null;
  onMarkTaskCompleted: (phaseId: string, taskId: string) => void;
}

export const RoadmapResourceModal: React.FC<RoadmapResourceModalProps> = ({
  isOpen,
  onClose,
  task,
  phase,
  onMarkTaskCompleted,
}) => {
  if (!isOpen || !task || !phase) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-primary tracking-wider">
                Phase {phase.phaseNumber}: {phase.title}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {task.resourceTitle || task.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Milestone Objective
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {task.title}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {task.description}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Estimated Effort:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {task.duration || '2-4 hours'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Target Role Impact:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                +{phase.estimatedReadinessIncrease}% phase contribution
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Status:</span>
              <span className={`font-semibold ${task.completed ? 'text-emerald-600' : 'text-amber-500'}`}>
                {task.completed ? 'Completed' : 'Pending Action'}
              </span>
            </div>
          </div>

          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-xl text-xs text-indigo-900 dark:text-indigo-200">
            💡 <strong>SkillSetu Verification Tip:</strong> Completing this task and uploading your deliverable or completing the assessment in the sandbox will auto-verify your skill badge.
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onMarkTaskCompleted(phase.id, task.id);
              onClose();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              task.completed
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{task.completed ? 'Mark Incomplete' : 'Mark as Completed'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold flex items-center gap-1"
          >
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
