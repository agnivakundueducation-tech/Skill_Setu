import React, { useState, useMemo } from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Opportunity } from '../../../types/student';
import {
  calculateDeterministicOpportunityMatch,
  DeterministicMatchResult
} from '../../../utils/deterministicScoring';
import { PersistedSkillProfile } from '../../../services/skillService';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  Send,
  Bookmark,
  Share2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Briefcase,
  DollarSign,
  Users,
  GraduationCap,
  ListChecks,
  Gift,
  RotateCcw,
  Sliders,
  TrendingUp,
  Award,
  Zap,
  Info,
  Check,
  Flame
} from 'lucide-react';

interface OpportunityDetailsViewProps {
  opportunity: Opportunity;
  onBack: () => void;
  onApply: (opportunity: Opportunity) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (oppId: string) => void;
  studentProfile?: PersistedSkillProfile | null;
  isDemo?: boolean;
  onNavigateToAssessment?: () => void;
}

export const OpportunityDetailsView: React.FC<OpportunityDetailsViewProps> = ({
  opportunity,
  onBack,
  onApply,
  isBookmarked = false,
  onToggleBookmark,
  studentProfile,
  isDemo = false,
  onNavigateToAssessment
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'pipeline' | 'company'>('overview');
  
  // Interactive deterministic simulation overrides
  const [simulationOverrides, setSimulationOverrides] = useState<Record<string, number>>({});
  const [isSimulating, setIsSimulating] = useState(false);

  // Deterministic scoring calculation
  const matchResult: DeterministicMatchResult = useMemo(() => {
    return calculateDeterministicOpportunityMatch(
      opportunity,
      isSimulating ? simulationOverrides : undefined,
      studentProfile,
      isDemo
    );
  }, [opportunity, isSimulating, simulationOverrides, studentProfile, isDemo]);

  const isUnassessed = !isDemo && (!studentProfile?.skills || Object.keys(studentProfile.skills).length === 0);

  // Handle sharing link
  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Toggle simulation for a specific skill
  const handleToggleSkillSimulation = (skillName: string, targetScore: number) => {
    setIsSimulating(true);
    setSimulationOverrides((prev) => {
      const current = prev[skillName];
      if (current === targetScore) {
        const next = { ...prev };
        delete next[skillName];
        if (Object.keys(next).length === 0) {
          setIsSimulating(false);
        }
        return next;
      }
      return {
        ...prev,
        [skillName]: targetScore
      };
    });
  };

  const handleResetSimulation = () => {
    setSimulationOverrides({});
    setIsSimulating(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700';
    if (score >= 75) return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700';
    return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={ArrowLeft}
            onClick={onBack}
            className="text-xs font-semibold"
          >
            Back to Marketplace
          </Button>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span>Marketplace</span>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-xs">
              {opportunity.company}
            </span>
            <span>/</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold truncate max-w-xs">
              {opportunity.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleBookmark && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={Bookmark}
              onClick={() => onToggleBookmark(opportunity.id)}
              className="text-xs"
            >
              {isBookmarked ? 'Saved to Bookmarks' : 'Bookmark'}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            leftIcon={Share2}
            onClick={handleShare}
            className="text-xs"
          >
            {copied ? 'Link Copied!' : 'Share'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            rightIcon={Send}
            onClick={() => onApply(opportunity)}
            className="text-xs px-5 shadow-xs"
          >
            Apply Now
          </Button>
        </div>
      </div>

      {/* Main Role Hero Header */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-900 text-white p-6 sm:p-8 shadow-md">
        {opportunity.companyBanner && (
          <img
            src={opportunity.companyBanner}
            alt="Company banner"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay pointer-events-none"
          />
        )}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <img
              src={opportunity.companyLogo}
              alt={opportunity.company}
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-white/20 bg-white shadow-md shrink-0"
            />
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 bg-indigo-500/20 px-2.5 py-1 rounded-lg border border-indigo-400/30">
                  <Building2 className="w-3.5 h-3.5" />
                  {opportunity.company}
                </span>
                <span className="text-white/40">•</span>
                <span className="text-xs text-slate-300 font-medium">
                  {opportunity.industry || 'Tech & Engineering'}
                </span>
                {opportunity.featured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    <Sparkles className="w-3 h-3 text-amber-300" /> Featured Hiring Partner
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {opportunity.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {opportunity.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  {opportunity.type} ({opportunity.mode})
                </span>
                {opportunity.duration && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      {opportunity.duration}
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  {opportunity.stipend}
                </span>
              </div>
            </div>
          </div>

          {/* Match Score Display Block */}
          <div className="flex flex-col items-start lg:items-end justify-center gap-2 bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 shrink-0">
            <div className="text-left lg:text-right">
              <div className="text-[11px] uppercase tracking-wider text-indigo-200 font-bold flex items-center gap-1 lg:justify-end">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Deterministic Match Score</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                {isUnassessed ? (
                  <span className="text-xl sm:text-2xl font-bold text-amber-300">
                    Pending Assessment
                  </span>
                ) : (
                  <>
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                      {matchResult.matchScore}%
                    </span>
                    <span className="text-xs text-indigo-200 font-semibold">
                      / 100 Compatibility
                    </span>
                  </>
                )}
              </div>
            </div>

            {isSimulating && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-400/30">
                <Zap className="w-3 h-3" />
                <span>Simulation Active</span>
              </div>
            )}

            <div className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isUnassessed ? 'Assessment Required' : 'Verified Direct Fast-Track Status'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DETERMINISTIC SKILL COMPATIBILITY ENGINE SECTION (MATCHED, PARTIAL, MISSING) */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Award className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Skill DNA Compatibility Breakdown
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Calculated using mathematical rule-based weighting across required core competencies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isSimulating ? (
              <Button
                variant="outline"
                size="sm"
                leftIcon={RotateCcw}
                onClick={handleResetSimulation}
                className="text-xs text-amber-600 border-amber-300 hover:bg-amber-50"
              >
                Reset Simulation
              </Button>
            ) : (
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                Deterministic Model • No AI
              </span>
            )}
          </div>
        </div>

        {/* 3-Column Grid: Matched Skills (✓), Partial Skills (△), Missing Skills (✕) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Matched Skills Column */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black">
                    ✓
                  </div>
                  <span>Matched Skills ({matchResult.matchedCount})</span>
                </div>
                <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                  100% Weight
                </span>
              </div>

              <div className="space-y-2">
                {matchResult.matchedSkills.length > 0 ? (
                  matchResult.matchedSkills.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-800/40 flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                          ✓
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {skill.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {skill.level}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {skill.candidateScore}/100
                        </span>
                        <span className="text-[10px] text-emerald-600/70 block">
                          Verified
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-slate-400 italic">
                    No fully matched skills yet.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 text-[11px] text-emerald-800 dark:text-emerald-300/80 flex items-center gap-1.5 border-t border-emerald-200/60 dark:border-emerald-800/40">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Full compatibility credit awarded toward match score.</span>
            </div>
          </div>

          {/* Partial Skills Column */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300">
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black">
                    △
                  </div>
                  <span>Partial Skills ({matchResult.partialCount})</span>
                </div>
                <span className="text-[11px] font-extrabold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                  50% Credit
                </span>
              </div>

              <div className="space-y-2">
                {matchResult.partialSkills.length > 0 ? (
                  matchResult.partialSkills.map((skill) => {
                    const isSimulated = simulationOverrides[skill.name] === 85;
                    return (
                      <div
                        key={skill.name}
                        className={`p-2.5 rounded-xl bg-white dark:bg-slate-900 border transition-all ${
                          isSimulated
                            ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                            : 'border-amber-200/80 dark:border-amber-800/40'
                        } flex items-center justify-between gap-2 shadow-2xs`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-amber-500 font-bold text-sm">
                            △
                          </span>
                          <div>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              {skill.name}
                            </div>
                            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                              {skill.level} ({skill.candidateScore}/100)
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleSkillSimulation(skill.name, 85)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            isSimulated
                              ? 'bg-indigo-600 text-white'
                              : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 hover:bg-amber-200'
                          }`}
                          title="Simulate mastering this skill"
                        >
                          {isSimulated ? 'Simulated ✓' : `+${skill.potentialGainPercent}% Gain`}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-3 text-center text-xs text-slate-400 italic">
                    No partial skill gaps identified.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 text-[11px] text-amber-800 dark:text-amber-300/80 flex items-center gap-1.5 border-t border-amber-200/60 dark:border-amber-800/40">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Foundational competency verified; advance to master tier for maximum score.</span>
            </div>
          </div>

          {/* Missing Skills Column */}
          <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-800/60 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-rose-900 dark:text-rose-300">
                  <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-black">
                    ✕
                  </div>
                  <span>Missing Skills ({matchResult.missingCount})</span>
                </div>
                <span className="text-[11px] font-extrabold text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded-full">
                  0% Credit
                </span>
              </div>

              <div className="space-y-2">
                {matchResult.missingSkills.length > 0 ? (
                  matchResult.missingSkills.map((skill) => {
                    const isSimulated = simulationOverrides[skill.name] === 85;
                    return (
                      <div
                        key={skill.name}
                        className={`p-2.5 rounded-xl bg-white dark:bg-slate-900 border transition-all ${
                          isSimulated
                            ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                            : 'border-rose-200/80 dark:border-rose-800/40'
                        } flex items-center justify-between gap-2 shadow-2xs`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-rose-600 dark:text-rose-400 font-bold text-sm">
                            ✕
                          </span>
                          <div>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              {skill.name}
                            </div>
                            <div className="text-[10px] text-rose-500 font-medium">
                              Unassessed / Needs Practice
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleSkillSimulation(skill.name, 85)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            isSimulated
                              ? 'bg-indigo-600 text-white'
                              : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 hover:bg-rose-200'
                          }`}
                          title="Simulate acquiring this skill"
                        >
                          {isSimulated ? 'Simulated ✓' : `+${skill.potentialGainPercent}% Gain`}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-3 text-center text-xs text-slate-400 italic">
                    Zero missing skills! Perfect requirement coverage.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 text-[11px] text-rose-800 dark:text-rose-300/80 flex items-center gap-1.5 border-t border-rose-200/60 dark:border-rose-800/40">
              <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>Prioritize these modules in your Skill Assessment roadmap.</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DETERMINISTIC EXPLANATIONS SECTION (EXACT FORMAT) */}
        {/* ========================================================================= */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-200">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Deterministic Impact Explanations</span>
          </div>

          <div className="space-y-2">
            {matchResult.explanations.map((explanation, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/50"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="leading-relaxed">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {explanation}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
            <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>
              All percentages are computed directly from required skill weights ({Math.round(100 / (opportunity.skillsRequired.length || 1))}% per requirement). No subjective or random variables applied.
            </span>
          </div>
        </div>
      </div>

      {/* Detail Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Role Overview & Responsibilities
        </button>
        <button
          onClick={() => setActiveTab('requirements')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'requirements'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Candidate Eligibility & Perks
        </button>
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'pipeline'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Fast-Track Recruitment Timeline
        </button>
        <button
          onClick={() => setActiveTab('company')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'company'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          About {opportunity.company}
        </button>
      </div>

      {/* Tab Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <Card variant="default" className="p-6 border-slate-200/80 dark:border-slate-800 space-y-5">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  About the Opportunity
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {opportunity.description}
                </p>
              </div>

              {opportunity.responsibilities && opportunity.responsibilities.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Key Responsibilities & Deliverables
                  </h3>
                  <ul className="space-y-2.5">
                    {opportunity.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          )}

          {activeTab === 'requirements' && (
            <Card variant="default" className="p-6 border-slate-200/80 dark:border-slate-800 space-y-5">
              {opportunity.requirements && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Candidate Prerequisites & Engineering Criteria
                  </h3>
                  <ul className="space-y-2.5">
                    {opportunity.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {opportunity.perks && (
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-amber-500" />
                    Exclusive Benefits & Relocation Perks
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {opportunity.perks.map((perk, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5 text-xs"
                      >
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {perk}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {activeTab === 'pipeline' && (
            <Card variant="default" className="p-6 border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Verified Fast-Track Recruitment Stages
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Candidates with Skill DNA compatibility scores over 80% bypass general resume filters and enter directly into stage 2.
              </p>

              <div className="space-y-3 pt-2">
                {(opportunity.hiringProcess || [
                  'Skill DNA Assessment Verification',
                  'Technical Architecture Problem Solving Pairing',
                  'Engineering Team & Leadership Discussion',
                  'Offer Letter Release & Co-op Onboarding'
                ]).map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3.5">
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                      {idx + 1}
                    </div>
                    <div className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                      <span>{step}</span>
                      <span className="text-[10px] text-slate-400 font-normal">Stage {idx + 1} of 4</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'company' && (
            <Card variant="default" className="p-6 border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={opportunity.companyLogo}
                  alt={opportunity.company}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 bg-white"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {opportunity.company}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {opportunity.industry || 'Enterprise Technology'} • {opportunity.location}
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {opportunity.company} is an active industry partner of the SkillSetu Collaborative Intelligence Network, offering verified hiring pathways, faculty-mentored capstones, and direct talent pipeline integration.
              </p>
            </Card>
          )}
        </div>

        {/* Right 1 Col: Quick Metadata Card & Apply CTA */}
        <div className="space-y-4">
          <Card variant="default" className="p-5 border-slate-200/80 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Role Snapshot
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Compensation:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{opportunity.stipend}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Application Deadline:</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {opportunity.deadline}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Available Seats:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {opportunity.openings} Openings ({opportunity.applicantsCount} Applied)
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Experience Level:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {opportunity.experienceLevel || 'College / Early Career'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Verified Partner:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  MoU Active
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                className="w-full text-xs font-bold"
                rightIcon={Send}
                onClick={() => onApply(opportunity)}
              >
                Apply via Verified Fast-Track
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
