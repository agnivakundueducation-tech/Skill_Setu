import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  CollaborationOpportunity,
  FacultyProfile,
  CollaborationProposal,
  CollaborationMatchResult
} from '../../types/collaboration';
import { ExplainableCollaborationMatch } from './ExplainableCollaborationMatch';
import {
  Building2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  BookOpen,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react';

interface CollaborationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  collaboration: CollaborationOpportunity | null;
  facultyProfile: FacultyProfile | null;
  matchResult: CollaborationMatchResult | null;
  onSubmitApplication: (
    collaboration: CollaborationOpportunity,
    proposal: CollaborationProposal,
    matchResult: CollaborationMatchResult
  ) => Promise<{ success: boolean; error?: string }>;
  isAlreadyApplied?: boolean;
}

export const CollaborationDetailModal: React.FC<CollaborationDetailModalProps> = ({
  isOpen,
  onClose,
  collaboration,
  facultyProfile,
  matchResult,
  onSubmitApplication,
  isAlreadyApplied = false
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'apply'>('overview');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Proposal Form State
  const [proposalTitle, setProposalTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [relevantExpertiseStr, setRelevantExpertiseStr] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  // Prepopulate proposal fields when modal opens
  React.useEffect(() => {
    if (collaboration && facultyProfile) {
      setProposalTitle(`Faculty Collaboration: ${collaboration.title}`);
      setEstimatedDuration(collaboration.duration || '6 Weeks');
      setRelevantExpertiseStr((facultyProfile.expertise || []).slice(0, 4).join(', '));
      setExpectedOutcome('Accredited curriculum enhancement, joint technical paper, and research artifact creation.');
      setSubmitSuccess(false);
      setErrorMessage(null);
      setActiveTab('overview');
    }
  }, [collaboration, facultyProfile]);

  if (!collaboration || !matchResult) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) {
      setErrorMessage('Please provide a brief proposal summary or pedagogical intent.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const proposal: CollaborationProposal = {
      proposalTitle: proposalTitle.trim(),
      summary: summary.trim(),
      relevantExpertise: relevantExpertiseStr
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      expectedOutcome: expectedOutcome.trim(),
      estimatedDuration: estimatedDuration.trim(),
      additionalRequirements: additionalRequirements.trim() || undefined
    };

    const res = await onSubmitApplication(collaboration, proposal, matchResult);
    setIsSubmitting(false);

    if (res.success) {
      setSubmitSuccess(true);
    } else {
      setErrorMessage(res.error || 'Failed to submit proposal. Please check your connection.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={collaboration.title}
      size="xl"
    >
      <div className="space-y-5">
        {/* Top Header Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  {collaboration.industryName}
                </span>
                <Badge variant="primary" size="sm">
                  {collaboration.collaborationType}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Location: {collaboration.location} ({collaboration.workMode}) • Cap: {collaboration.capacity} seats
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <div className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
              {matchResult.overallMatch}% Match
            </div>
          </div>
        </div>

        {/* Tab switcher: Overview vs Apply */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Opportunity Details & Match Telemetry</span>
          </button>

          {!isAlreadyApplied && !submitSuccess && (
            <button
              onClick={() => setActiveTab('apply')}
              className={`pb-2.5 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'apply'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Submit Proposal & Apply</span>
            </button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & EXPLAINABLE MATCH */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Description & Target Audience */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Program Description & Industry Context
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {collaboration.description}
              </p>
            </div>

            {/* Specific Type Details (e.g. FDP topics, guest lecture speaker, live project statement) */}
            {collaboration.topics && (
              <div className="p-3.5 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/60 space-y-2">
                <span className="text-xs font-bold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  Key Program Modules & Topics
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-sky-800 dark:text-sky-300">
                  {collaboration.topics.map((t, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {collaboration.speakerName && (
              <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-1 text-xs">
                <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  Distinguished Speaker
                </span>
                <p className="text-amber-800 dark:text-amber-300 font-semibold">{collaboration.speakerName}</p>
                <p className="text-amber-700 dark:text-amber-400">{collaboration.speakerDesignation}</p>
              </div>
            )}

            {collaboration.problemStatement && (
              <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 space-y-1 text-xs">
                <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  Industry Live Problem Statement
                </span>
                <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed">{collaboration.problemStatement}</p>
                {collaboration.industryMentor && (
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 pt-1">
                    Industry Mentor: <strong>{collaboration.industryMentor}</strong> • Student Cohort Size: {collaboration.studentTeamSize || 4}
                  </p>
                )}
              </div>
            )}

            {collaboration.fundingSupport && (
              <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  <strong>Financial & Resource Support:</strong> {collaboration.fundingSupport}
                </span>
              </div>
            )}

            {/* Explainable Matching Telemetry */}
            <ExplainableCollaborationMatch matchResult={matchResult} collaborationTitle={collaboration.title} />

            {/* Application Action Footer */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Application Deadline: <strong>{collaboration.applicationDeadline}</strong>
              </div>

              {isAlreadyApplied ? (
                <Badge variant="success" size="md">
                  ✓ Already Applied
                </Badge>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={Send}
                  onClick={() => setActiveTab('apply')}
                >
                  Proceed to Proposal Application
                </Button>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PROPOSAL APPLICATION FORM */}
        {/* ========================================================================= */}
        {activeTab === 'apply' && (
          <div>
            {submitSuccess ? (
              <div className="p-6 text-center space-y-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-100">
                  Proposal Submitted Successfully!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto leading-relaxed">
                  Your collaboration application and technical proposal have been securely dispatched to <strong>{collaboration.industryName}</strong>. You can monitor the review progress in your My Collaborations tracker.
                </p>
                <div className="pt-2">
                  <Button variant="outline" size="sm" onClick={onClose}>
                    Close Window
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Proposal Title / Topic *
                    </label>
                    <input
                      type="text"
                      value={proposalTitle}
                      onChange={(e) => setProposalTitle(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Estimated Duration
                    </label>
                    <input
                      type="text"
                      value={estimatedDuration}
                      onChange={(e) => setEstimatedDuration(e.target.value)}
                      placeholder="e.g. 6 Weeks / 5 Days"
                      className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Faculty Relevant Competencies & Expertise (comma separated)
                  </label>
                  <input
                    type="text"
                    value={relevantExpertiseStr}
                    onChange={(e) => setRelevantExpertiseStr(e.target.value)}
                    placeholder="Machine Learning, Python, PyTorch, Cloud"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Proposal Summary & Pedagogical Objectives *
                  </label>
                  <textarea
                    rows={4}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    required
                    placeholder="Briefly describe your methodology, research alignment, or pedagogical objectives for this collaboration..."
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Expected Outcomes & Deliverables
                  </label>
                  <textarea
                    rows={2}
                    value={expectedOutcome}
                    onChange={(e) => setExpectedOutcome(e.target.value)}
                    placeholder="e.g. 1 Research paper, revised laboratory syllabus, student capstone mentor cohort..."
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Additional Requirements or Compute Needs (Optional)
                  </label>
                  <input
                    type="text"
                    value={additionalRequirements}
                    onChange={(e) => setAdditionalRequirements(e.target.value)}
                    placeholder="e.g. Access to cloud GPU instances, specific EDA tool licenses..."
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('overview')}
                  >
                    Back to Overview
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isSubmitting}
                    rightIcon={Send}
                  >
                    Submit Proposal to {collaboration.industryName}
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
