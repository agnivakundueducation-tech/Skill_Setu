import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AICurriculumRecommendation, SkillCategoryType } from '../../types/institution';
import {
  Sparkles,
  Lightbulb,
  CheckCircle2,
  Clock,
  Building2,
  BookOpen,
  Cpu,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  FileCheck,
  Zap,
  Download
} from 'lucide-react';

interface AICurriculumRecommendationsProps {
  recommendations: AICurriculumRecommendation[];
  onUpdateStatus: (id: string, newStatus: AICurriculumRecommendation['status']) => void;
  onOpenBlueprintModal: (rec: AICurriculumRecommendation) => void;
  onRegenerateAi: () => void;
  isRegenerating: boolean;
  selectedSkillFilter?: string;
}

export const AICurriculumRecommendations: React.FC<AICurriculumRecommendationsProps> = ({
  recommendations,
  onUpdateStatus,
  onOpenBlueprintModal,
  onRegenerateAi,
  isRegenerating,
  selectedSkillFilter
}) => {
  const [skillFilter, setSkillFilter] = useState<string>(selectedSkillFilter || 'all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [adoptedCount, setAdoptedCount] = useState<number>(1);

  const skillsList = ['all', 'AI/ML', 'Cloud', 'Cybersecurity', 'DSA', 'Data Analytics'];

  const filteredRecommendations = recommendations.filter((rec) => {
    if (skillFilter !== 'all' && rec.targetSkill !== skillFilter) return false;
    if (statusFilter !== 'all' && rec.status !== statusFilter) return false;
    return true;
  });

  const getUrgencyBadge = (urgency: AICurriculumRecommendation['urgency']) => {
    switch (urgency) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200/60">
            Critical Intervention
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200/60">
            High Priority
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200/60">
            Recommended
          </span>
        );
    }
  };
  const getStatusBadge = (status: AICurriculumRecommendation['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Approved by Dean
          </span>
        );
      case 'under_review':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center gap-1">
            <Clock className="w-3 h-3" /> In Syllabus Committee Review
          </span>
        );
      case 'implemented':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
            <FileCheck className="w-3 h-3" /> Live in 2025-26 Syllabus
          </span>
        );
      case 'proposed':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            AI Generated Proposal
          </span>
        );
    }
  };
  return (
    <div className="space-y-5">
      {/* Top Banner with AI Engine Trigger */}
      <div className="p-5 rounded-2xl bg-linear-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              AI Curriculum Modernization & Outcome Engine
            </h2>
            <Badge variant="warning" size="sm">
              NAAC OBE Compliant
            </Badge>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl">
            Generative pedagogical engine analyzing current industry job descriptions, hiring failure modes, and faculty bandwidth to construct turnkey syllabus revisions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={isRegenerating ? RefreshCw : Sparkles}
            onClick={onRegenerateAi}
            disabled={isRegenerating}
            className="text-xs bg-amber-600 hover:bg-amber-500 border-none font-bold"
          >
            {isRegenerating ? 'Analyzing Gap Signals...' : 'Re-synthesize AI Proposals'}
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-500">Filter by Skill:</span>
          {skillsList.map((skill) => (
            <button
              key={skill}
              onClick={() => setSkillFilter(skill)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                skillFilter === skill
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {skill === 'all' ? 'All Skills' : skill}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-2.5 py-1 border border-slate-200 dark:border-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="proposed">Proposed</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="implemented">Implemented</option>
          </select>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="space-y-4">
        {filteredRecommendations.map((rec) => (
          <Card
            key={rec.id}
            variant="default"
            className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 transition-all hover:shadow-md space-y-4"
          >
            {/* Header: Title & Badges */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="primary" size="sm" className="text-[10px]">
                    {rec.targetSkill}
                  </Badge>
                  {getUrgencyBadge(rec.urgency)}
                  {getStatusBadge(rec.status)}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {rec.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60">
                  {rec.projectedGapReduction}
                </span>
              </div>
            </div>

            {/* Summary & Justification */}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {rec.detailedProposal}
            </p>

            {/* 3 Pillars Grid: Labs to Embed, Partners, Faculty Plan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
              {/* Hands-on Labs */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                  <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Hands-on Lab Experiments</span>
                </div>
                <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                  {rec.labModulesToEmbed.map((lab, lIdx) => (
                    <li key={lIdx} className="flex items-start gap-1">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span className="line-clamp-1">{lab}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Industry Partners */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                  <Building2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Suggested Industry Partners</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {rec.suggestedIndustryPartners.map((partner, pIdx) => (
                    <span
                      key={pIdx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {partner}
                    </span>
                  ))}
                </div>
                <div className="text-[10px] text-slate-500">
                  Credits: {rec.creditsChange}
                </div>
              </div>

              {/* Faculty Upskilling & Accreditation */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Faculty Enablement</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                  {rec.facultyUpskillingPlan}
                </p>
                <div className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
                  {rec.naacNbaCriteriaAlignment}
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Approval Status:</span>
                <select
                  value={rec.status}
                  onChange={(e) =>
                    onUpdateStatus(
                      rec.id,
                      e.target.value as AICurriculumRecommendation['status']
                    )
                  }
                  className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="proposed">Proposed</option>
                  <option value="under_review">Mark Under Review</option>
                  <option value="approved">Approve Proposal</option>
                  <option value="implemented">Mark Implemented</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  rightIcon={ChevronRight}
                  onClick={() => onOpenBlueprintModal(rec)}
                  className="text-xs"
                >
                  View Full Syllabus Blueprint & NAAC Mapping
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
