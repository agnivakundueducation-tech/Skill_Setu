import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { SIH_SHOWCASE_STEPS } from '../../data/sihShowcaseData';
import { ShowcaseStep } from '../../types/showcase';
import { UserRole } from '../../types';
import {
  Briefcase,
  Building2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Bot,
  Zap,
  Award,
  ChevronRight
} from 'lucide-react';

interface SihDemoFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStepIndex: number;
  onSelectStep: (stepIndex: number) => void;
}

export const SihDemoFlowModal: React.FC<SihDemoFlowModalProps> = ({
  isOpen,
  onClose,
  currentStepIndex,
  onSelectStep
}) => {
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'industry':
        return <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'institution':
        return <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'academician':
        return <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'student':
      default:
        return <Zap className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'industry':
        return 'success';
      case 'institution':
        return 'warning';
      case 'academician':
        return 'indigo';
      case 'student':
      default:
        return 'primary';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="SIH 2026 — End-to-End Cross-Role Ecosystem Flow"
      description="Interactive 9-Step Demo Journey illustrating how SkillSetu unifies Industry, Institutions, Faculty, and Students into a verified closed-loop talent lifecycle."
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Click any step to switch workspace persona and deep-link directly into the view.</span>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Flow Map
          </Button>
        </div>
      }
    >
      <div className="space-y-4 py-2">
        {/* Visual Progress Loop Banner */}
        <div className="p-4 rounded-2xl bg-linear-to-r from-indigo-900/90 via-slate-900 to-indigo-950 text-white border border-indigo-500/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                  SIH 2026 Showcase Map
                </span>
                <span className="text-xs text-indigo-200">
                  Step {currentStepIndex + 1} of {SIH_SHOWCASE_STEPS.length} Active
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Unified Stakeholder Closed Loop
              </h3>
            </div>

            <div className="text-right sm:text-right">
              <span className="text-[11px] text-indigo-300 block">Demonstration Time</span>
              <span className="text-sm font-black text-amber-400">3 – 5 Minutes</span>
            </div>
          </div>
        </div>

        {/* 9 Step Connected Timeline Cards */}
        <div className="space-y-2.5 max-h-[58vh] overflow-y-auto pr-1">
          {SIH_SHOWCASE_STEPS.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;

            return (
              <div
                key={step.id}
                onClick={() => {
                  onSelectStep(idx);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-500/40 shadow-sm'
                    : isCompleted
                    ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/20 hover:border-emerald-400'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Step Number Badge */}
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={getRoleBadgeVariant(step.role) as any} size="sm">
                          <span className="flex items-center gap-1">
                            {getRoleIcon(step.role)}
                            {step.roleTitle}
                          </span>
                        </Badge>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {step.title}
                        </h4>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 animate-pulse">
                            Current View
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {step.contextExplanation}
                      </p>

                      <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {step.entityName}
                        </span>
                        <span>•</span>
                        <span>{step.route}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-center">
                    <Button
                      variant={isActive ? 'primary' : 'outline'}
                      size="sm"
                      className="text-xs"
                      rightIcon={ChevronRight}
                    >
                      {isActive ? 'Active View' : 'Go to Step'}
                    </Button>
                  </div>
                </div>

                {/* Key Metrics Snapshot */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
                  {step.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="bg-slate-50/80 dark:bg-slate-800/60 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block truncate">{m.label}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate block">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
