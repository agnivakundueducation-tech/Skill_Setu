import React, { useState, useEffect } from 'react';
import {
  InternshipRecord,
  InternshipMilestone,
  InternshipWeeklyLog,
  InternshipFeedback,
  InternshipFinalEvaluation
} from '../../types/internship';
import {
  getIndustryInternships,
  addOrUpdateMilestone,
  reviewWeeklyLog,
  addMentorFeedback,
  submitFinalEvaluation,
  issueCompletionCertificate
} from '../../services/internshipService';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MilestoneModal } from './modals/MilestoneModal';
import { MentorFeedbackModal } from './modals/MentorFeedbackModal';
import { FinalEvaluationModal } from './modals/FinalEvaluationModal';
import { CertificatePreviewModal } from './modals/CertificatePreviewModal';
import {
  Users,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  Star,
  FileText,
  TrendingUp,
  Plus,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building,
  Search,
  Filter,
  MessageSquare
} from 'lucide-react';

export const IndustryInternshipCohortView: React.FC = () => {
  const { user, appUser, isDemo } = useAuth();
  const [internships, setInternships] = useState<InternshipRecord[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<InternshipRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<InternshipMilestone | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  const fetchInternships = async () => {
    setIsLoading(true);
    try {
      const industryUid = user?.id || appUser?.uid || 'demo-industry-apex';
      const res = await getIndustryInternships(industryUid, isDemo);
      if (res.success && res.data.length > 0) {
        setInternships(res.data);
        if (!selectedInternship) {
          setSelectedInternship(res.data[0]);
        } else {
          const match = res.data.find((i) => i.id === selectedInternship.id);
          if (match) setSelectedInternship(match);
        }
      }
    } catch (e) {
      console.error('[IndustryCohortView] Fetch failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [user?.id, appUser?.uid, isDemo]);

  const filteredInternships = internships.filter((item) => {
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.studentInstitution.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const current = selectedInternship || filteredInternships[0];

  // Actions
  const handleGradeMilestone = async (milestone: InternshipMilestone) => {
    if (!current) return;
    const res = await addOrUpdateMilestone(current.id, milestone, isDemo);
    if (res.success && res.data) {
      setSelectedInternship(res.data);
      setInternships((prev) => prev.map((i) => (i.id === current.id ? res.data : i)));
    }
  };

  const handleReviewLog = async (logId: string, remarks: string) => {
    if (!current || !remarks.trim()) return;
    const res = await reviewWeeklyLog(current.id, logId, remarks, isDemo);
    if (res.success && res.data) {
      setSelectedInternship(res.data);
      setInternships((prev) => prev.map((i) => (i.id === current.id ? res.data : i)));
    }
  };

  const handleSaveFeedback = async (feedback: Omit<InternshipFeedback, 'id' | 'date'>) => {
    if (!current) return;
    const res = await addMentorFeedback(current.id, feedback, isDemo);
    if (res.success && res.data) {
      setSelectedInternship(res.data);
      setInternships((prev) => prev.map((i) => (i.id === current.id ? res.data : i)));
    }
  };

  const handleSaveFinalEvaluation = async (evaluation: Omit<InternshipFinalEvaluation, 'id' | 'evaluatedAt'>) => {
    if (!current) return;
    const res = await submitFinalEvaluation(current.id, evaluation, isDemo);
    if (res.success && res.data) {
      setSelectedInternship(res.data);
      setInternships((prev) => prev.map((i) => (i.id === current.id ? res.data : i)));
    }
  };

  const handleIssueCertificate = async () => {
    if (!current) return;
    const res = await issueCompletionCertificate(
      current.id,
      {
        signatoryName: user?.name || appUser?.displayName || current.mentor?.name || 'VP of Engineering',
        signatoryTitle: current.mentor?.title || 'Principal Staff Mentor',
        honorsTag: 'Distinction',
        skillsEndorsed: current.milestones.map((m) => m.title.split(':')[0]).filter(Boolean)
      },
      isDemo
    );
    if (res.success && res.data) {
      setSelectedInternship(res.data);
      setInternships((prev) => prev.map((i) => (i.id === current.id ? res.data : i)));
      setIsCertificateModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Active Intern Cohorts & Mentorship Workspace
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor sprint progress, review weekly student submissions, conduct evaluations, and issue cryptographically verifiable credentials.
          </p>
        </div>

        {/* Quick Summary Badges */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
            {internships.filter((i) => i.status === 'Active').length} Active Interns
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            {internships.filter((i) => i.status === 'Completed').length} Certified Alumni
          </div>
        </div>
      </div>

      {/* Main Split Layout: Cohort List on Left (1/3), Selected Intern Management on Right (2/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Intern Search & Cohort Roster */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search intern name, role, institution..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center gap-1.5">
              {['all', 'Active', 'Completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-lg capitalize transition-all ${
                    statusFilter === status
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Intern Roster List */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredInternships.map((intern) => {
              const isSelected = current?.id === intern.id;
              return (
                <div
                  key={intern.id}
                  onClick={() => setSelectedInternship(intern)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500/60 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={intern.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={intern.studentName}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {intern.studentName}
                        </h4>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[170px]">
                          {intern.roleTitle}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        intern.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}
                    >
                      {intern.status}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Progress: <strong className="text-slate-800 dark:text-slate-200">{intern.progressPercentage}%</strong></span>
                    <span>{intern.milestones.filter((m) => m.status === 'Approved').length}/{intern.milestones.length} Milestones</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Intern Supervision Panel */}
        <div className="lg:col-span-8 space-y-4">
          {current ? (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              {/* Intern Details Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={current.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={current.studentName}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-indigo-500/30 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                        {current.studentName}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {current.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {current.roleTitle} • <span className="font-semibold text-slate-800 dark:text-slate-200">{current.studentInstitution}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Cohort: {current.startDate} → {current.endDate} • {current.stipend}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={Star}
                    onClick={() => setIsFeedbackModalOpen(true)}
                    className="text-xs"
                  >
                    Give Feedback
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={TrendingUp}
                    onClick={() => setIsEvaluationModalOpen(true)}
                    className="text-xs"
                  >
                    Final Evaluation
                  </Button>
                  {current.completionRecord ? (
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={Award}
                      onClick={() => setIsCertificateModalOpen(true)}
                      className="text-xs text-emerald-600 border-emerald-300 dark:border-emerald-800"
                    >
                      View Certificate
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={Award}
                      onClick={handleIssueCertificate}
                      className="text-xs"
                    >
                      Issue Certificate
                    </Button>
                  )}
                </div>
              </div>

              {/* Milestones Management Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    Milestones Review & Deliverable Grading
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={Plus}
                    onClick={() => {
                      setEditingMilestone(null);
                      setIsMilestoneModalOpen(true);
                    }}
                    className="text-xs py-1 h-auto"
                  >
                    Add Milestone
                  </Button>
                </div>

                <div className="space-y-2">
                  {current.milestones.map((ms, idx) => (
                    <div
                      key={ms.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-indigo-600 dark:text-indigo-400">#{idx + 1}</span>
                          <span className="font-bold text-slate-900 dark:text-slate-100">{ms.title}</span>
                          <span
                            className={`px-2 py-0.2 rounded-full text-[10px] font-semibold ${
                              ms.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : ms.status === 'Submitted'
                                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                            }`}
                          >
                            {ms.status}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                          {ms.description}
                        </p>
                        {ms.deliverableUrl && (
                          <div className="flex items-center gap-1.5 text-indigo-600 font-semibold text-[11px]">
                            <ExternalLink className="w-3 h-3" />
                            <a href={ms.deliverableUrl} target="_blank" rel="noreferrer" className="hover:underline">
                              {ms.deliverableUrl}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {ms.score !== undefined ? (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                            {ms.score}/100
                          </span>
                        ) : null}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingMilestone(ms);
                            setIsMilestoneModalOpen(true);
                          }}
                          className="text-xs py-1 h-auto"
                        >
                          Review & Grade
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Logs Stream & Mentor Reviews */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Recent Weekly Logs ({current.weeklyLogs.length})
                </h4>

                {current.weeklyLogs.length === 0 ? (
                  <p className="text-xs text-slate-500">No weekly progress logs submitted yet.</p>
                ) : (
                  <div className="space-y-2">
                    {current.weeklyLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-slate-100">Week {log.weekNumber}</span>
                            <span className="text-slate-500 font-mono text-[11px]">({log.startDate} → {log.endDate})</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              log.status === 'Reviewed'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {log.status}
                          </span>
                        </div>

                        <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                          {log.workSummary}
                        </p>

                        {/* Mentor quick review box if pending */}
                        {log.mentorRemarks ? (
                          <div className="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 text-[11px]">
                            <strong>Mentor Remarks:</strong> "{log.mentorRemarks}"
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="text"
                              placeholder="Add mentor feedback remarks for this week..."
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleReviewLog(log.id, (e.target as HTMLInputElement).value);
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }}
                              className="flex-1 px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                            />
                            <span className="text-[10px] text-slate-400">Press Enter to save</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500">Select an intern from the roster to review progress.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {current && (
        <>
          <MilestoneModal
            isOpen={isMilestoneModalOpen}
            onClose={() => setIsMilestoneModalOpen(false)}
            onSubmit={handleGradeMilestone}
            initialMilestone={editingMilestone}
            isMentor={true}
          />

          <MentorFeedbackModal
            isOpen={isFeedbackModalOpen}
            onClose={() => setIsFeedbackModalOpen(false)}
            onSubmit={handleSaveFeedback}
            defaultMentorName={user?.name || appUser?.displayName || current.mentor?.name}
            defaultMentorRole={current.mentor?.title}
          />

          <FinalEvaluationModal
            isOpen={isEvaluationModalOpen}
            onClose={() => setIsEvaluationModalOpen(false)}
            onSubmit={handleSaveFinalEvaluation}
            internName={current.studentName}
            defaultEvaluatorName={user?.name || appUser?.displayName || current.mentor?.name}
            defaultEvaluatorRole={current.mentor?.title}
          />

          {current.completionRecord && (
            <CertificatePreviewModal
              isOpen={isCertificateModalOpen}
              onClose={() => setIsCertificateModalOpen(false)}
              internship={current}
            />
          )}
        </>
      )}
    </div>
  );
};
