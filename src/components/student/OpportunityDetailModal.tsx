import React, { useState, useMemo } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Opportunity } from '../../types/student';
import {
  calculateDeterministicOpportunityMatch,
  DeterministicMatchResult
} from '../../utils/deterministicScoring';
import { PersistedSkillProfile } from '../../services/skillService';
import {
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  DollarSign,
  Users,
  Bookmark,
  Share2,
  ShieldCheck,
  Send,
  ExternalLink,
  Gift,
  ListChecks,
  GraduationCap,
  AlertTriangle,
  Info,
  Maximize2
} from 'lucide-react';

interface OpportunityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity | null;
  onApply: (opportunity: Opportunity) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (oppId: string) => void;
  onOpenFullView?: (opportunity: Opportunity) => void;
  studentProfile?: PersistedSkillProfile | null;
  isDemo?: boolean;
  onNavigateToAssessment?: () => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  isOpen,
  onClose,
  opportunity,
  onApply,
  isBookmarked = false,
  onToggleBookmark,
  onOpenFullView,
  studentProfile,
  isDemo = false,
  onNavigateToAssessment
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'hiring-pipeline'>('overview');

  const matchResult: DeterministicMatchResult | null = useMemo(() => {
    if (!opportunity) return null;
    return calculateDeterministicOpportunityMatch(opportunity, undefined, studentProfile, isDemo);
  }, [opportunity, studentProfile, isDemo]);

  if (!opportunity || !matchResult) return null;

  const isUnassessed = !isDemo && (!studentProfile?.skills || Object.keys(studentProfile.skills).length === 0);

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="xl"
    >
      <div className="space-y-6">
        {/* Company Header Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-900 text-white p-6">
          {opportunity.companyBanner && (
            <img
              src={opportunity.companyBanner}
              alt="Company banner"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay pointer-events-none"
            />
          )}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <img
                src={opportunity.companyLogo}
                alt={opportunity.company}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/20 bg-white shadow-md shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {opportunity.company}
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-xs text-slate-300">{opportunity.industry || 'Tech & Engineering'}</span>
                  {opportunity.featured && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      <Sparkles className="w-3 h-3 text-amber-300" /> Featured Partner
                    </span>
                  )}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {opportunity.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    {opportunity.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                    {opportunity.type} ({opportunity.mode})
                  </span>
                  {opportunity.duration && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        {opportunity.duration}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Match Score Badge */}
            <div className="flex md:flex-col items-center md:items-end justify-between gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10 shrink-0">
              <div className="text-left md:text-right">
                <div className="text-[11px] uppercase tracking-wider text-indigo-200 font-semibold">
                  Deterministic Match Score
                </div>
                <div className="text-2xl font-extrabold text-white flex items-center md:justify-end gap-1.5">
                  {isUnassessed ? (
                    <span className="text-sm font-semibold text-amber-300">Pending Assessment</span>
                  ) : (
                    <>
                      <span>{matchResult.matchScore}%</span>
                      <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300/30" />
                    </>
                  )}
                </div>
              </div>
              <div className="text-[11px] text-emerald-300 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isUnassessed ? 'Assessment Required' : 'Verified Fast-Track Status'}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Stipend / CTC</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {opportunity.stipend}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Application Deadline</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              {opportunity.deadline}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Open Positions</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              {opportunity.openings} Openings ({opportunity.applicantsCount} Applied)
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Experience Level</span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              {opportunity.experienceLevel || 'College / Early Career'}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DETERMINISTIC SKILL COMPATIBILITY BREAKDOWN (MATCHED, PARTIAL, MISSING) */}
        {/* ========================================================================= */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Deterministic Skill Compatibility
              </h4>
              <p className="text-[11px] text-slate-500">
                Rule-based deterministic evaluation across {matchResult.totalSkillsCount} required competencies.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
              Score: {matchResult.matchScore}%
            </span>
          </div>

          {/* 3 Categories: Matched, Partial, Missing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Matched Skills */}
            <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
              <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center justify-between text-[11px] uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <span className="font-black text-emerald-600">✓</span> Matched ({matchResult.matchedCount})
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">100%</span>
              </div>
              <div className="space-y-1.5">
                {matchResult.matchedSkills.length > 0 ? (
                  matchResult.matchedSkills.map((s) => (
                    <div
                      key={s.name}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium flex items-center justify-between text-xs"
                    >
                      <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
                        <span className="font-bold">✓</span> {s.name}
                      </span>
                      <span className="text-[10px] text-slate-400">{s.candidateScore}/100</span>
                    </div>
                  ))
                ) : (
                  <span className="text-slate-400 italic text-[11px]">None</span>
                )}
              </div>
            </div>

            {/* Partial Skills */}
            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2">
              <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between text-[11px] uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <span className="font-black text-amber-600">△</span> Partial ({matchResult.partialCount})
                </span>
                <span className="text-amber-700 dark:text-amber-400 font-extrabold">50%</span>
              </div>
              <div className="space-y-1.5">
                {matchResult.partialSkills.length > 0 ? (
                  matchResult.partialSkills.map((s) => (
                    <div
                      key={s.name}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium flex items-center justify-between text-xs"
                    >
                      <span className="flex items-center gap-1 text-amber-700 dark:text-amber-300">
                        <span className="font-bold">△</span> {s.name}
                      </span>
                      <span className="text-[10px] text-amber-600 font-bold">+{s.potentialGainPercent}%</span>
                    </div>
                  ))
                ) : (
                  <span className="text-slate-400 italic text-[11px]">None</span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 space-y-2">
              <div className="font-bold text-rose-900 dark:text-rose-300 flex items-center justify-between text-[11px] uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <span className="font-black text-rose-600">✕</span> Missing ({matchResult.missingCount})
                </span>
                <span className="text-rose-700 dark:text-rose-400 font-extrabold">0%</span>
              </div>
              <div className="space-y-1.5">
                {matchResult.missingSkills.length > 0 ? (
                  matchResult.missingSkills.map((s) => (
                    <div
                      key={s.name}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium flex items-center justify-between text-xs"
                    >
                      <span className="flex items-center gap-1 text-rose-700 dark:text-rose-300">
                        <span className="font-bold">✕</span> {s.name}
                      </span>
                      <span className="text-[10px] text-rose-600 font-bold">+{s.potentialGainPercent}%</span>
                    </div>
                  ))
                ) : (
                  <span className="text-slate-400 italic text-[11px]">None</span>
                )}
              </div>
            </div>
          </div>

          {/* Deterministic Explanations Callout */}
          <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 space-y-1.5">
            <div className="text-[11px] font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Deterministic Explanation:</span>
            </div>
            <div className="space-y-1">
              {matchResult.explanations.map((exp, i) => (
                <div key={i} className="text-xs text-slate-700 dark:text-slate-200 font-medium pl-2 border-l-2 border-indigo-400">
                  {exp}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Role Overview & Responsibilities
          </button>
          <button
            onClick={() => setActiveTab('requirements')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'requirements'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Eligibility & Perks
          </button>
          <button
            onClick={() => setActiveTab('hiring-pipeline')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'hiring-pipeline'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Recruitment Process
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-5 text-slate-700 dark:text-slate-300 text-xs">
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                About the Opportunity
              </h4>
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                {opportunity.description}
              </p>
            </div>

            {opportunity.responsibilities && opportunity.responsibilities.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Key Responsibilities
                </h4>
                <ul className="space-y-2">
                  {opportunity.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'requirements' && (
          <div className="space-y-5 text-slate-700 dark:text-slate-300 text-xs">
            {opportunity.requirements && (
              <div className="space-y-2.5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Candidate Eligibility & Requirements
                </h4>
                <ul className="space-y-2">
                  {opportunity.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {opportunity.perks && (
              <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-500" />
                  Exclusive Benefits & Perks
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {opportunity.perks.map((perk, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'hiring-pipeline' && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Verified Fast-Track Recruitment Timeline
              </h4>
              <div className="space-y-3">
                {(opportunity.hiringProcess || [
                  'Verified Skill DNA Assessment Screening',
                  'Technical Problem Solving & Project Review',
                  'Architecture & Team Fitment Discussion',
                  'Offer Letter & Onboarding Verification'
                ]).map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium text-slate-800 dark:text-slate-200">
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onToggleBookmark && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                leftIcon={Bookmark}
                onClick={() => onToggleBookmark(opportunity.id)}
              >
                {isBookmarked ? 'Saved to Bookmarks' : 'Bookmark'}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              leftIcon={Share2}
              onClick={handleShare}
            >
              {copied ? 'Link Copied!' : 'Share'}
            </Button>
            {onOpenFullView && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-indigo-600 dark:text-indigo-400"
                leftIcon={Maximize2}
                onClick={() => {
                  onClose();
                  onOpenFullView(opportunity);
                }}
              >
                Open Full View
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="text-xs px-6"
              rightIcon={Send}
              onClick={() => {
                onClose();
                onApply(opportunity);
              }}
            >
              Apply Now (Verified Fast-Track)
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
