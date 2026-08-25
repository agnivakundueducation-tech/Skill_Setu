import React from 'react';
import { ASSESSMENT_STEPS } from '../../data/assessmentData';
import { StepId } from '../../types/assessment';
import { Check, Compass, Code, Users, Briefcase, Sparkles } from 'lucide-react';

interface AssessmentProgressIndicatorProps {
  currentStepIndex: number; // 0 to 4
  onSelectStep?: (index: number) => void;
  completedSteps?: number[];
}

export const AssessmentProgressIndicator: React.FC<AssessmentProgressIndicatorProps> = ({
  currentStepIndex,
  onSelectStep,
  completedSteps = []
}) => {
  const steps = ASSESSMENT_STEPS;
  const progressPercent = Math.round(((currentStepIndex) / (steps.length - 1)) * 100);

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return Compass;
      case 'Code':
        return Code;
      case 'Users':
        return Users;
      case 'Briefcase':
        return Briefcase;
      case 'Sparkles':
      default:
        return Sparkles;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Meta info */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <span className="text-slate-400">•</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {steps[currentStepIndex].title}
          </span>
        </div>
        <span className="font-mono text-slate-500 font-medium">
          {progressPercent}% Completed
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-600 to-sky-500 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Stepper Buttons for Desktop / Tablet */}
      <div className="grid grid-cols-5 gap-2 pt-1">
        {steps.map((step, index) => {
          const Icon = getStepIcon(step.iconName);
          const isCurrent = index === currentStepIndex;
          const isCompleted = index < currentStepIndex || completedSteps.includes(index);
          const isClickable = onSelectStep !== undefined;

          return (
            <button
              key={step.id}
              type="button"
              disabled={!isClickable}
              onClick={() => onSelectStep && onSelectStep(index)}
              className={`flex flex-col sm:flex-row items-center gap-2 p-2.5 rounded-xl text-left transition-all text-xs ${
                isCurrent
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 font-bold shadow-xs ring-1 ring-indigo-500/20'
                  : isCompleted
                  ? 'bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer'
                  : 'bg-transparent border border-transparent text-slate-400 dark:text-slate-600 cursor-default'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : index + 1}
              </div>

              <div className="hidden md:block truncate">
                <div className="text-[11px] font-bold leading-tight truncate">
                  {step.shortTitle}
                </div>
                <div className="text-[9px] text-slate-400 dark:text-slate-500 truncate">
                  Step {step.stepNumber}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
