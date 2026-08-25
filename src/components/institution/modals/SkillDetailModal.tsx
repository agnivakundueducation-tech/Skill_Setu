import React from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { ProgressBar } from '../../ui/ProgressBar';
import { SkillDemandReadinessItem } from '../../../types/institution';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Cpu,
  BookOpen,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface SkillDetailModalProps {
  skill: SkillDemandReadinessItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAiRecommendation: (skillName: string) => void;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({
  skill,
  isOpen,
  onClose,
  onOpenAiRecommendation
}) => {
  if (!skill) return null;

  const isCritical = skill.gapSeverity === 'critical';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-2">
          <span>{skill.skill} Domain Diagnostics & Gap Analysis</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isCritical
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
            }`}
          >
            {skill.gap}% Gap
          </span>
        </div>
      }
      description={`Comprehensive audit for ${skill.skill} based on 4,850 assessed students and active hiring requirements.`}
    >
      <div className="space-y-4 pt-2">
        {/* Top Summary Metric Strip */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Industry Demand
            </div>
            <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
              {skill.industryDemand}%
            </div>
            <div className="text-[10px] text-slate-500">{skill.hiringOpeningsVolume} open jobs</div>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Student Readiness
            </div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {skill.studentReadiness}%
            </div>
            <div className="text-[10px] text-slate-500">Benchmark: {skill.averageBenchmarkScore}%</div>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Competency Gap
            </div>
            <div
              className={`text-xl font-black mt-0.5 ${
                isCritical ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {skill.gap}%
            </div>
            <div className="text-[10px] text-slate-500">
              {isCritical ? 'Requires Intervention' : 'Optimal Alignment'}
            </div>
          </div>
        </div>

        {/* Sub-Skill Readiness Diagnostic List */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center justify-between">
            <span>Sub-Topic Readiness Breakdown</span>
            <span className="text-[10px] text-slate-400">Target Industry Threshold: &ge;80%</span>
          </div>

          <div className="space-y-2.5">
            {skill.subskills.map((sub, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {sub.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">Weight: {sub.industryWeight}%</span>
                    <span
                      className={`text-xs font-bold ${
                        sub.status === 'critical_gap'
                          ? 'text-rose-600 dark:text-rose-400'
                          : sub.status === 'moderate_gap'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {sub.readinessScore}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      sub.status === 'critical_gap'
                        ? 'bg-rose-500'
                        : sub.status === 'moderate_gap'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${sub.readinessScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Missing Concepts in Current Curriculum */}
        <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Missing Pedagogical Concepts Identified by AI</span>
          </div>
          <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
            {skill.keyMissingConcepts.map((concept, cIdx) => (
              <li key={cIdx} className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>{concept}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Hiring Companies */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Top Hiring Partners for {skill.skill}:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skill.topCompaniesHiring.map((company, cIdx) => (
              <span
                key={cIdx}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {company}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={Sparkles}
            onClick={() => {
              onClose();
              onOpenAiRecommendation(skill.skill);
            }}
            className="text-xs bg-amber-600 hover:bg-amber-500 border-none"
          >
            Review AI Syllabus Action Plan
          </Button>
        </div>
      </div>
    </Modal>
  );
};
