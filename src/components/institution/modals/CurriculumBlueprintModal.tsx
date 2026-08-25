import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { AICurriculumRecommendation } from '../../../types/institution';
import {
  Sparkles,
  BookOpen,
  Cpu,
  Building2,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Download,
  Calendar,
  Layers,
  ArrowRight,
  FileCheck
} from 'lucide-react';

interface CurriculumBlueprintModalProps {
  recommendation: AICurriculumRecommendation | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
}

export const CurriculumBlueprintModal: React.FC<CurriculumBlueprintModalProps> = ({
  recommendation,
  isOpen,
  onClose,
  onApprove
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!recommendation) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }, 800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-2">
          <span>AI Curriculum Modernization Blueprint</span>
          <Badge variant="warning" size="sm">
            {recommendation.targetSkill}
          </Badge>
        </div>
      }
      description="Turnkey Academic Council & Board of Studies (BoS) Syllabus Revision Document"
    >
      <div className="space-y-4 pt-2">
        {/* Proposal Title Header */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 space-y-1.5">
          <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Executive BoS Proposal</span>
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
            {recommendation.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {recommendation.summary}
          </p>
        </div>

        {/* Key Metrics Strip */}
        <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 text-[11px]">Expected Impact:</span>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
              {recommendation.projectedGapReduction}
            </div>
          </div>
          <div>
            <span className="text-slate-500 text-[11px]">Credit Structure:</span>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
              {recommendation.creditsChange}
            </div>
          </div>
          <div>
            <span className="text-slate-500 text-[11px]">Target Cohorts:</span>
            <div className="font-bold text-indigo-600 dark:text-indigo-400 text-sm mt-0.5">
              {recommendation.affectedSemesters.join(', ')}
            </div>
          </div>
        </div>

        {/* Detailed Pedagogical Justification */}
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>Pedagogical Analysis & Industry Rationale</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            {recommendation.detailedProposal}
          </p>
        </div>

        {/* Laboratory Modules To Embed */}
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-500" />
            <span>Mandatory Hands-On Laboratory Exercises</span>
          </div>
          <div className="space-y-1.5">
            {recommendation.labModulesToEmbed.map((lab, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-2"
              >
                <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                  {idx + 1}
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{lab}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Faculty Enablement & Accreditation Alignment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
              <span>Faculty Enablement Plan</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              {recommendation.facultyUpskillingPlan}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
              <span>NAAC / NBA Accreditation Criteria</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              {recommendation.naacNbaCriteriaAlignment}
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={exportSuccess ? CheckCircle2 : Download}
            onClick={handleExport}
            disabled={isExporting}
            className="text-xs"
          >
            {isExporting ? 'Generating PDF...' : exportSuccess ? 'Downloaded NIRF Syllabus Doc' : 'Export BoS Syllabus PDF'}
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
              Close
            </Button>
            {recommendation.status !== 'approved' && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={FileCheck}
                onClick={() => {
                  onApprove(recommendation.id);
                  onClose();
                }}
                className="text-xs bg-emerald-600 hover:bg-emerald-500 border-none"
              >
                Approve for Next BoS Cycle
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
