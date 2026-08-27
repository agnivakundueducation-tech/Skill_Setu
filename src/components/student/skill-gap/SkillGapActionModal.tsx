import React, { useState } from 'react';
import { SkillGapItem } from '../../../types/skillGap';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { ProgressBar } from '../../ui/ProgressBar';
import {
  X,
  Sparkles,
  Target,
  BookOpen,
  FolderGit2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Clock,
  ArrowRight,
  Zap,
  Layers,
  Award
} from 'lucide-react';

interface SkillGapActionModalProps {
  skill: SkillGapItem | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunchAssessment?: (skillName: string) => void;
}

export const SkillGapActionModal: React.FC<SkillGapActionModalProps> = ({
  skill,
  isOpen,
  onClose,
  onLaunchAssessment
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showEnrolledToast, setShowEnrolledToast] = useState(false);

  if (!isOpen || !skill) return null;

  const toggleStep = (idx: number) => {
    if (completedSteps.includes(idx)) {
      setCompletedSteps(completedSteps.filter((i) => i !== idx));
    } else {
      setCompletedSteps([...completedSteps, idx]);
    }
  };

  const handleEnrollRoadmap = () => {
    setShowEnrolledToast(true);
    setTimeout(() => setShowEnrolledToast(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Enrolled Toast */}
      {showEnrolledToast && (
        <div className="fixed top-6 right-6 z-60 bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-indigo-500/40 flex items-center gap-3 animate-in slide-in-from-top-5 duration-200">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">Enrolled in {skill.name} Roadmap!</div>
            <div className="text-[11px] text-slate-400">Milestones added to your active study plan.</div>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                skill.indicatorColor === 'red'
                  ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                  : skill.indicatorColor === 'yellow'
                  ? 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                  : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              <Target className="w-6 h-6" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {skill.name} Gap Analysis & Closing Action Plan
                </h2>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    skill.indicatorColor === 'red'
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      : skill.indicatorColor === 'yellow'
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {skill.priority} Priority
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {skill.subcategory} • Market Demand Score: <strong className="text-indigo-600 dark:text-indigo-400">{skill.marketDemandScore}/100</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Metrics Snapshot */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-center">
            {/* Current */}
            <div className="p-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Current Level
              </span>
              <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-0.5">
                {skill.currentLevel}
                <span className="text-xs font-normal text-slate-400">/100</span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Active Competency</span>
            </div>

            {/* Required */}
            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-2xs border border-indigo-100 dark:border-indigo-900/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                Industry Required
              </span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                {skill.requiredLevel}
                <span className="text-xs font-normal text-indigo-400">/100</span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Target Benchmark</span>
            </div>

            {/* Gap */}
            <div className="p-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Deficiency Gap
              </span>
              <div
                className={`text-2xl font-black mt-0.5 ${
                  skill.indicatorColor === 'red'
                    ? 'text-rose-600 dark:text-rose-400'
                    : skill.indicatorColor === 'yellow'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {skill.gap > 0 ? `-${skill.gap} pts` : '0 (Aligned)'}
              </div>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                {skill.hiringImpact}
              </span>
            </div>
          </div>

          {/* Primary Recommendation Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              skill.indicatorColor === 'red'
                ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50'
                : skill.indicatorColor === 'yellow'
                ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50'
                : 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50'
            }`}
          >
            <Sparkles
              className={`w-5 h-5 shrink-0 mt-0.5 ${
                skill.indicatorColor === 'red'
                  ? 'text-rose-600'
                  : skill.indicatorColor === 'yellow'
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}
            />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                Prescribed Recommendation:
              </span>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                {skill.recommendation}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Closing this gap will lift your total match index by approximately <strong className="text-indigo-600 dark:text-indigo-400">+{Math.round(skill.gap * 0.4)}%</strong> for high-tier engineering listings.
              </p>
            </div>
          </div>

          {/* Step-by-Step Action Roadmap */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-500" />
                Step-by-Step Action Checklist ({completedSteps.length}/{skill.detailedActionPlan.length} Completed)
              </h3>
              <span className="text-xs text-slate-500">Click step to mark done</span>
            </div>

            <div className="space-y-2.5">
              {skill.detailedActionPlan.map((step, idx) => {
                const isChecked = completedSteps.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs mt-0.5 ${
                        isChecked
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {isChecked ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div className="flex-1">
                      <p
                        className={`text-xs font-medium leading-relaxed ${
                          isChecked
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended Industry Resources & Courses */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-500" />
              Accredited Learning Resources & Certifications
            </h3>

            <div className="space-y-2">
              {skill.recommendedResources.map((res) => (
                <div
                  key={res.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {res.title}
                      </span>
                      {res.isIndustryStandard && (
                        <Badge variant="primary" size="sm">
                          Standard
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{res.provider}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {res.duration}
                      </span>
                      <span>•</span>
                      <span>{res.level}</span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="text-xs whitespace-nowrap self-end sm:self-center">
                    Start Learning
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Capstone Project */}
          {skill.recommendedProject && (
            <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                  <FolderGit2 className="w-4 h-4" />
                  Recommended Capstone Proof Project
                </h4>
                <Badge variant="primary" size="sm">
                  {skill.recommendedProject.estimatedHours}
                </Badge>
              </div>

              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {skill.recommendedProject.title}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {skill.recommendedProject.description}
              </p>

              <div className="pt-2 flex items-center justify-between text-[11px] text-indigo-700 dark:text-indigo-400 font-semibold border-t border-indigo-100 dark:border-indigo-900/40">
                <span>Deliverable: {skill.recommendedProject.deliverable}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{skill.recommendedProject.outcome}</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/30">
          <Button variant="outline" size="sm" onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {skill.assessmentSkillName && onLaunchAssessment && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={Sparkles}
                className="w-full sm:w-auto text-xs"
                onClick={() => {
                  onClose();
                  onLaunchAssessment(skill.assessmentSkillName!);
                }}
              >
                Launch Assessment
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              leftIcon={Zap}
              className="w-full sm:w-auto text-xs"
              onClick={handleEnrollRoadmap}
            >
              Enroll in Action Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
