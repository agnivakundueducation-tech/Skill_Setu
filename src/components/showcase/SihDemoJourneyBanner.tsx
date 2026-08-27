import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SIH_SHOWCASE_STEPS } from '../../data/sihShowcaseData';
import { sihShowcaseService } from '../../services/sihShowcaseService';
import { ShowcaseStep } from '../../types/showcase';
import { SihDemoFlowModal } from './SihDemoFlowModal';
import { SihDemoCompletionModal } from './SihDemoCompletionModal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Compass,
  Bot,
  RotateCcw,
  Maximize2,
  Minimize2,
  CheckCircle2,
  ArrowRight,
  Zap,
  Briefcase,
  Building2,
  GraduationCap,
  Layers,
  HelpCircle,
  X
} from 'lucide-react';

export const SihDemoJourneyBanner: React.FC = () => {
  const { currentRole, continueAsDemo, isDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [stepIndex, setStepIndex] = useState(() => sihShowcaseService.getCurrentStepIndex());
  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showExplainer, setShowExplainer] = useState(true);

  const steps = sihShowcaseService.getSteps();
  const currentStep = steps[stepIndex] || steps[0];

  useEffect(() => {
    const unsubscribe = sihShowcaseService.subscribe(() => {
      setStepIndex(sihShowcaseService.getCurrentStepIndex());
    });
    return () => unsubscribe();
  }, []);

  // Check if current route matches step route
  const isCurrentViewMatching = location.pathname.startsWith(currentStep.route);

  const handleNavigateToStep = (targetIndex: number) => {
    sihShowcaseService.setStepIndex(targetIndex);
    const step = steps[targetIndex];
    if (step) {
      if (currentRole !== step.role) {
        continueAsDemo(step.role);
      }
      navigate(step.route);
    }
  };

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      handleNavigateToStep(stepIndex + 1);
    } else {
      setIsCompletionModalOpen(true);
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      handleNavigateToStep(stepIndex - 1);
    }
  };

  const handleAskCopilot = () => {
    sihShowcaseService.triggerCopilotForCurrentStep();
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset the SIH Demo Journey to Step 1? This will not affect any authenticated database records.')) {
      sihShowcaseService.resetDemoSession(continueAsDemo);
      navigate(steps[0].route);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'industry':
        return <Briefcase className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'institution':
        return <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'academician':
        return <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
      case 'student':
      default:
        return <Zap className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
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

  // If minimized, render a compact floating pill at top right
  if (isMinimized) {
    return (
      <>
        <div className="mb-4 flex items-center justify-between p-2.5 px-4 rounded-2xl bg-indigo-900/90 text-white shadow-lg border border-indigo-500/30 text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>SIH Demo Journey:</span>
            </span>
            <span className="bg-indigo-950 px-2 py-0.5 rounded-lg border border-indigo-800 text-indigo-200 font-mono">
              Step {stepIndex + 1}/9: {currentStep.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavigateToStep(stepIndex)}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              Go to Step View
            </button>
            <button
              onClick={() => setIsFlowModalOpen(true)}
              className="p-1 rounded-lg hover:bg-indigo-800 text-indigo-200"
              title="Open Flow Map"
            >
              <Compass className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 rounded-lg hover:bg-indigo-800 text-indigo-200"
              title="Expand Demo Controller"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <SihDemoFlowModal
          isOpen={isFlowModalOpen}
          onClose={() => setIsFlowModalOpen(false)}
          currentStepIndex={stepIndex}
          onSelectStep={handleNavigateToStep}
        />
        <SihDemoCompletionModal
          isOpen={isCompletionModalOpen}
          onClose={() => setIsCompletionModalOpen(false)}
          onRestartShowcase={() => handleNavigateToStep(0)}
          onOpenPassport={() => handleNavigateToStep(8)}
        />
      </>
    );
  }

  return (
    <>
      <div className="mb-6 rounded-2xl bg-slate-900 text-white border border-indigo-500/30 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
        {/* Top Mini Control Header */}
        <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-black text-amber-400 text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIH 2026 DEMO JOURNEY</span>
            </span>
            <span className="text-slate-600 dark:text-slate-500">•</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              3–5 Min Cross-Role Closed Loop Orchestration
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsFlowModalOpen(true)}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
              title="View Complete 9-Step Ecosystem Flow Map"
            >
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>Flow Map</span>
            </button>

            <button
              onClick={handleResetDemo}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
              title="Reset Demo Session"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline">Reset</span>
            </button>

            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Minimize Banner"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step Progression Bar */}
        <div className="px-4 pt-3.5 pb-2 bg-slate-900/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-indigo-400">
              STEP {currentStep.stepNumber} OF {steps.length}:
            </span>
            <Badge variant={getRoleBadgeVariant(currentStep.role) as any} size="sm">
              <span className="flex items-center gap-1">
                {getRoleIcon(currentStep.role)}
                {currentStep.roleTitle}
              </span>
            </Badge>
            <h3 className="text-sm font-black text-white flex items-center gap-1.5">
              <span>{currentStep.title}</span>
            </h3>
          </div>

          {/* Step Pill Indicators */}
          <div className="flex items-center gap-1">
            {steps.map((s, idx) => {
              const isPast = idx < stepIndex;
              const isCurrent = idx === stepIndex;

              return (
                <button
                  key={s.id}
                  onClick={() => handleNavigateToStep(idx)}
                  className={`w-6 h-6 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center ${
                    isCurrent
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 scale-110'
                      : isPast
                      ? 'bg-emerald-700 text-white hover:bg-emerald-600'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={`Step ${idx + 1}: ${s.title}`}
                >
                  {isPast ? <CheckCircle2 className="w-3 h-3" /> : idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Narrative & Action Body */}
        <div className="p-4 bg-slate-900 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <div className="text-xs text-indigo-300 font-semibold flex items-center gap-2">
                <span>Active Target: {currentStep.entityName}</span>
                <span>•</span>
                <span className="text-slate-400 font-mono text-[11px]">{currentStep.route}</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                <span className="font-bold text-amber-300">Context: </span>
                {currentStep.contextExplanation}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAskCopilot}
                className="text-xs border-indigo-500/40 text-indigo-200 hover:bg-indigo-950/60 bg-indigo-950/30"
              >
                <Bot className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                Ask Setu
              </Button>

              <Button
                variant={isCurrentViewMatching ? 'outline' : 'primary'}
                size="sm"
                onClick={() => handleNavigateToStep(stepIndex)}
                className={`text-xs ${
                  !isCurrentViewMatching ? 'bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30' : ''
                }`}
              >
                {isCurrentViewMatching ? (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In View</span>
                  </span>
                ) : (
                  <span>{currentStep.actionLabel}</span>
                )}
              </Button>

              <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
                <button
                  disabled={stepIndex === 0}
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 transition-colors"
                  title="Previous Step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-xs"
                  title={stepIndex === steps.length - 1 ? 'Complete Showcase Journey' : 'Next Step'}
                >
                  <span>{stepIndex === steps.length - 1 ? 'Finish & Summary' : 'Next'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Why It Matters & Live Metrics */}
          {showExplainer && (
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5 max-w-2xl">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Why this step matters in SIH evaluation:
                </div>
                <p className="text-slate-300 text-[11px]">
                  {currentStep.whyItMatters}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                {currentStep.metrics.map((m, mIdx) => (
                  <div key={mIdx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">{m.label}</span>
                    <span className="font-bold text-amber-400 text-xs">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <SihDemoFlowModal
        isOpen={isFlowModalOpen}
        onClose={() => setIsFlowModalOpen(false)}
        currentStepIndex={stepIndex}
        onSelectStep={handleNavigateToStep}
      />

      <SihDemoCompletionModal
        isOpen={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
        onRestartShowcase={() => handleNavigateToStep(0)}
        onOpenPassport={() => handleNavigateToStep(8)}
      />
    </>
  );
};
