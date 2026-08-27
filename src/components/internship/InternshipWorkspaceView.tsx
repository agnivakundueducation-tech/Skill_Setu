import React, { useState, useEffect } from 'react';
import {
  InternshipRecord,
  InternshipMilestone,
  InternshipWeeklyLog,
  InternshipFeedback,
  InternshipFinalEvaluation
} from '../../types/internship';
import {
  getStudentInternships,
  addOrUpdateMilestone,
  addWeeklyLog,
  addMentorFeedback,
  submitFinalEvaluation,
  issueCompletionCertificate,
  uploadInternshipReport,
  calculateInternshipProgress
} from '../../services/internshipService';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MilestoneModal } from './modals/MilestoneModal';
import { WeeklyLogModal } from './modals/WeeklyLogModal';
import { MentorFeedbackModal } from './modals/MentorFeedbackModal';
import { FinalEvaluationModal } from './modals/FinalEvaluationModal';
import { CertificatePreviewModal } from './modals/CertificatePreviewModal';
import { UploadReportModal } from './modals/UploadReportModal';
import {
  Briefcase,
  Calendar,
  MapPin,
  Building,
  CheckCircle2,
  Clock,
  Award,
  Star,
  FileText,
  UserCheck,
  TrendingUp,
  Plus,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Download,
  Share2,
  QrCode,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  FileCheck,
  UploadCloud
} from 'lucide-react';

interface InternshipWorkspaceViewProps {
  initialInternshipId?: string;
  onBack?: () => void;
  isMentorView?: boolean;
}

export const InternshipWorkspaceView: React.FC<InternshipWorkspaceViewProps> = ({
  initialInternshipId,
  onBack,
  isMentorView = false
}) => {
  const { user, appUser, isDemo } = useAuth();
  const [internships, setInternships] = useState<InternshipRecord[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<InternshipRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'milestones' | 'logs' | 'feedback' | 'evaluation' | 'certificate' | 'report'>('milestones');
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<InternshipMilestone | null>(null);

  const [isWeeklyLogModalOpen, setIsWeeklyLogModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isUploadReportModalOpen, setIsUploadReportModalOpen] = useState(false);

  // Load internships
  const fetchInternships = async () => {
    setIsLoading(true);
    try {
      const studentId = user?.id || appUser?.uid || 'demo-student-id';
      const res = await getStudentInternships(studentId, isDemo);
      if (res.success && res.data.length > 0) {
        setInternships(res.data);
        if (initialInternshipId) {
          const match = res.data.find((i) => i.id === initialInternshipId);
          setSelectedInternship(match || res.data[0]);
        } else if (!selectedInternship) {
          setSelectedInternship(res.data[0]);
        } else {
          // Re-sync current selection
          const refreshed = res.data.find((i) => i.id === selectedInternship.id);
          if (refreshed) setSelectedInternship(refreshed);
        }
      }
    } catch (e) {
      console.error('[InternshipWorkspace] Load failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [user?.id, appUser?.uid, isDemo, initialInternshipId]);

  if (isLoading && internships.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-medium">Loading Internship Workspace...</p>
      </div>
    );
  }

  if (internships.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
          No Active Internships Found
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
          Once your application is selected by an industry partner or you start an active cohort, your full milestone tracking and mentorship portal will appear here.
        </p>
        {onBack && (
          <Button variant="outline" size="sm" onClick={onBack} leftIcon={ArrowLeft}>
            Back to Applications
          </Button>
        )}
      </div>
    );
  }

  const current = selectedInternship || internships[0];
  const progressPct = calculateInternshipProgress(current.milestones);

  // Handlers
  const handleSaveMilestone = async (milestone: InternshipMilestone) => {
    const res = await addOrUpdateMilestone(current.id, milestone, isDemo);
    if (res.success && res.data) {
      setSelectedInternship(res.data);
      setInternships((prev) => prev.map((i) => (i.id === current.id ? res.data : i)));
    }
  };

  const handleSaveWeeklyLog = async (log: Omit<InternshipWeeklyLog, 'id' | 'submittedAt'>) => {
    const res = await addWeeklyLog(current.id, log, isDemo);
    if (res.success && res.data) {
      setSelectedInternship(res.data);
      setInternships((prev) => prev.map((i) => (i.id === current.id ? res.data : i)));
    }
  };

  const handleSaveFeedback = async (feedback: Omit<InternshipFeedback, 'id' | 'date'>) => {
    const res = await addMentorFeedback(current.id, feedback, isDemo);
    if (res.success && res.data) {
      setSelectedInternship(res.data);
      setInternships((prev) => prev.map((i) => (i.id === current.id ? res.data : i)));
    }
  };

  const handleSaveFinalEvaluation = async (evaluation: Omit<InternshipFinalEvaluation, 'id' | 'evaluatedAt'>) => {
    const res = await submitFinalEvaluation(current.id, evaluation, isDemo);
    if (res.success && res.data) {
      setSelectedInternship(res.data);
      setInternships((prev) => prev.map((i) => (i.id === current.id ? res.data : i)));
    }
  };

  const handleIssueCertificate = async () => {
    const res = await issueCompletionCertificate(
      current.id,
      {
        signatoryName: current.mentor?.name || 'Industry Evaluation Lead',
        signatoryTitle: current.mentor?.title || 'VP of Engineering',
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

  const handleUploadReport = async (file: File) => {
    const res = await uploadInternshipReport(current.id, file, isDemo);
    if (res.success && res.data) {
      setSelectedInternship(res.data);
      setInternships((prev) => prev.map((i) => (i.id === current.id ? res.data : i)));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Bar with Back action and Cohort Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} leftIcon={ArrowLeft} className="text-xs">
              Back
            </Button>
          )}
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Student Internship Lifecycle & Mentorship Hub
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified sprint progress, milestone deliverables, continuous mentor feedback, and credential certification.
            </p>
          </div>
        </div>

        {/* Multi-internship Selector if student has more than one */}
        {internships.length > 1 && (
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {internships.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedInternship(item)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  current.id === item.id
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {item.companyName.split(' ')[0]} ({item.status})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Internship Header Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  current.status === 'Completed'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : current.status === 'Active'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                ● {current.status} Lifecycle
              </span>
              <span className="text-xs text-slate-300 font-mono">
                {current.department}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {current.roleTitle}
              </h2>
              <div className="text-sm font-semibold text-amber-300 flex items-center gap-2 mt-0.5">
                <Building className="w-4 h-4" />
                {current.companyName}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {current.location} ({current.workMode})
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {current.startDate} → {current.endDate}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                Stipend: {current.stipend}
              </span>
            </div>
          </div>

          {/* Right Column: Mentor Profile & Live Progress Dial */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-slate-700/60 pt-4 lg:pt-0 lg:pl-6">
            {/* Mentor Info */}
            <div className="flex items-center gap-3">
              <img
                src={current.mentor?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'}
                alt={current.mentor?.name}
                className="w-11 h-11 rounded-xl object-cover border-2 border-indigo-400/40 shrink-0"
              />
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Assigned Industry Mentor</div>
                <div className="text-xs font-bold text-white">{current.mentor?.name}</div>
                <div className="text-[11px] text-indigo-300">{current.mentor?.title}</div>
              </div>
            </div>

            {/* Live Progress Bar */}
            <div className="w-full sm:w-56 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Sprint Completion</span>
                <span className="text-amber-300 font-mono">{progressPct}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                ></div>
              </div>
              <div className="text-[10px] text-slate-400 text-right font-mono">
                {current.milestones.filter((m) => m.status === 'Approved').length} of {current.milestones.length} Milestones Approved
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('milestones')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'milestones'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Milestones & Sprints ({current.milestones.length})
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'logs'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Weekly Progress Logs ({current.weeklyLogs.length})
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'feedback'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Star className="w-4 h-4" />
          Mentor Reviews ({current.mentorFeedbacks.length})
        </button>

        <button
          onClick={() => setActiveTab('evaluation')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'evaluation'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Final Capstone & PPO
          {current.finalEvaluation?.recommendationForPPO && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('certificate')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'certificate'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          Verified Credential
          {current.completionRecord && (
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              Verified
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'report'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Internship Report
        </button>
      </div>

      {/* Tab 1: Milestones & Sprints */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Milestone Deliverables & Sprint Breakdown
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track deliverables, submit repository links, and receive mentor approval scores.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={Plus}
              onClick={() => {
                setEditingMilestone(null);
                setIsMilestoneModalOpen(true);
              }}
              className="text-xs"
            >
              Add Milestone
            </Button>
          </div>

          <div className="space-y-3">
            {current.milestones.map((ms, idx) => (
              <div
                key={ms.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                        ms.status === 'Approved'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : ms.status === 'Submitted'
                          ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {ms.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        {ms.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        ms.status === 'Approved'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : ms.status === 'Submitted'
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                          : ms.status === 'In Progress'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {ms.status}
                    </span>

                    {ms.score !== undefined && (
                      <span className="px-2 py-1 rounded-lg text-xs font-black bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {ms.score}/100
                      </span>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingMilestone(ms);
                        setIsMilestoneModalOpen(true);
                      }}
                      className="text-xs py-1 h-auto"
                    >
                      Edit / Submit
                    </Button>
                  </div>
                </div>

                {/* Submissions & Feedback row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Due: <span className="font-semibold text-slate-700 dark:text-slate-300">{ms.dueDate}</span></span>
                    {ms.deliverableUrl && (
                      <a
                        href={ms.deliverableUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline ml-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Deliverable PR
                      </a>
                    )}
                  </div>

                  {ms.mentorFeedback && (
                    <div className="text-slate-600 dark:text-slate-400 italic">
                      <span className="font-bold not-italic text-slate-700 dark:text-slate-300">Mentor Note: </span>
                      "{ms.mentorFeedback}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Weekly Progress Logs */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Weekly Sprint Progress Logs
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Weekly documentation of code shipped, tech stack exercises, challenges, and mentor remarks.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={Plus}
              onClick={() => setIsWeeklyLogModalOpen(true)}
              className="text-xs"
            >
              Submit Weekly Log
            </Button>
          </div>

          {current.weeklyLogs.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-600 dark:text-slate-400">No weekly progress logs recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {current.weeklyLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                        Week {log.weekNumber}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {log.startDate} → {log.endDate}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        log.status === 'Reviewed'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {log.status === 'Reviewed' ? '✓ Reviewed by Mentor' : '⏳ Awaiting Review'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                    {log.workSummary}
                  </p>

                  {/* Skills tags */}
                  {log.skillsPracticed && log.skillsPracticed.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-500">Skills Practiced:</span>
                      {log.skillsPracticed.map((sk) => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Challenges & Next steps */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    {log.challengesFaced && (
                      <div className="p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40">
                        <div className="font-bold text-amber-900 dark:text-amber-300 mb-0.5">Challenges Overcome</div>
                        <div className="text-amber-800 dark:text-amber-400">{log.challengesFaced}</div>
                      </div>
                    )}

                    {log.nextWeekPlan && (
                      <div className="p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/40">
                        <div className="font-bold text-indigo-900 dark:text-indigo-300 mb-0.5">Upcoming Week Target</div>
                        <div className="text-indigo-800 dark:text-indigo-400">{log.nextWeekPlan}</div>
                      </div>
                    )}
                  </div>

                  {/* Mentor remarks */}
                  {log.mentorRemarks && (
                    <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-xs">
                      <div className="font-bold text-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Mentor Feedback:
                      </div>
                      <div className="text-emerald-900 dark:text-emerald-200 italic mt-0.5">
                        "{log.mentorRemarks}"
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Mentor Reviews & Feedback */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Continuous Mentor Evaluations & Feedback
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Regular reviews on technical capability, initiative, and professional communication.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={Plus}
              onClick={() => setIsFeedbackModalOpen(true)}
              className="text-xs"
            >
              Add Mentor Review
            </Button>
          </div>

          {current.mentorFeedbacks.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Star className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-600 dark:text-slate-400">No mentor feedback reviews recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {current.mentorFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {fb.stage}
                      </span>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                        Evaluated by {fb.mentorName} ({fb.mentorRole})
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {fb.date}
                    </span>
                  </div>

                  {/* 3 Rating cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Technical Rigor</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="flex text-amber-500">
                          {Array.from({ length: fb.technicalRating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-slate-100">{fb.technicalRating}/5</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Soft Skills & Comms</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="flex text-amber-500">
                          {Array.from({ length: fb.softSkillsRating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-slate-100">{fb.softSkillsRating}/5</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Initiative & Autonomy</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="flex text-amber-500">
                          {Array.from({ length: fb.initiativeRating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-slate-100">{fb.initiativeRating}/5</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl">
                    "{fb.summaryComments}"
                  </p>

                  {/* Strengths & Improvements */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {fb.strengthsObserved && fb.strengthsObserved.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Key Strengths
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                          {fb.strengthsObserved.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {fb.areasForImprovement && fb.areasForImprovement.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Recommended Next Focus Areas
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                          {fb.areasForImprovement.map((imp, idx) => (
                            <li key={idx}>{imp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Final Evaluation & PPO */}
      {activeTab === 'evaluation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Final Capstone Evaluation & Pre-Placement Assessment
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comprehensive performance review and full-time hiring recommendation.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={TrendingUp}
              onClick={() => setIsEvaluationModalOpen(true)}
              className="text-xs"
            >
              {current.finalEvaluation ? 'Update Evaluation' : 'Conduct Final Evaluation'}
            </Button>
          </div>

          {!current.finalEvaluation ? (
            <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <Award className="w-10 h-10 text-indigo-400 mx-auto" />
              <div className="max-w-md mx-auto">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Final Evaluation Pending
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upon completion of all core milestones and capstone presentation, the industry mentor will submit the final performance scores and PPO recommendation.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              {/* PPO Recommendation Callout */}
              {current.finalEvaluation.recommendationForPPO && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-emerald-950 dark:text-emerald-200 uppercase tracking-wider">
                      Pre-Placement Offer (PPO) Recommended!
                    </div>
                    <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-300 mt-0.5">
                      {current.finalEvaluation.ppoDetails || 'Full-time employment offer extended based on exceptional internship performance.'}
                    </p>
                  </div>
                </div>
              )}

              {/* 4 Quantitative Scores */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Technical Rigor</div>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                    {current.finalEvaluation.technicalProficiencyScore}%
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Domain Knowledge</div>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                    {current.finalEvaluation.domainKnowledgeScore}%
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Collaboration</div>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                    {current.finalEvaluation.collaborationScore}%
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Problem Solving</div>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                    {current.finalEvaluation.problemSolvingScore}%
                  </div>
                </div>
              </div>

              {/* Detailed Summary */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                  Executive Evaluation Summary
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  {current.finalEvaluation.detailedSummary}
                </p>
              </div>

              {/* Verified Competencies */}
              {current.finalEvaluation.skillsVerified && current.finalEvaluation.skillsVerified.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Verified Skill DNA Competencies (Synchronized with Career Passport)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {current.finalEvaluation.skillsVerified.map((sk) => (
                      <div
                        key={sk.skillId}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{sk.skillName}</span>
                          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {sk.verifiedLevel}% Mastery
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {sk.evidenceTag}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Issue Certificate Action if not issued */}
              {!current.completionRecord && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={Award}
                    onClick={handleIssueCertificate}
                    className="text-xs"
                  >
                    Issue Cryptographically Verified Completion Certificate
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Verified Credential & Certificate */}
      {activeTab === 'certificate' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Verified Internship Completion Credential
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official certificate with cryptographic hash verification registered on SkillSetu ledger.
              </p>
            </div>
            {current.completionRecord ? (
              <Button
                variant="primary"
                size="sm"
                leftIcon={Award}
                onClick={() => setIsCertificateModalOpen(true)}
                className="text-xs"
              >
                View Official Certificate
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                leftIcon={Award}
                onClick={handleIssueCertificate}
                className="text-xs"
              >
                Generate & Issue Certificate
              </Button>
            )}
          </div>

          {!current.completionRecord ? (
            <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <ShieldCheck className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Certificate will be generated once final capstone milestones and mentor evaluations are complete.
              </p>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-lg space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-amber-300 uppercase tracking-widest">
                      SkillSetu Verified Credential
                    </div>
                    <h4 className="text-base font-bold text-white">
                      {current.roleTitle} — {current.companyName}
                    </h4>
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    ✓ Verified on Ledger
                  </span>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    Issued: {current.completionRecord.issueDate}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="text-[11px] text-slate-400 font-mono">Signatory</div>
                  <div className="font-bold text-white">{current.completionRecord.signatoryName}</div>
                  <div className="text-slate-300">{current.completionRecord.signatoryTitle}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="text-[11px] text-slate-400 font-mono">Cryptographic Verification Hash</div>
                  <div className="font-mono text-xs font-bold text-emerald-400 break-all">
                    {current.completionRecord.verificationHash}
                  </div>
                  <div className="text-[10px] text-slate-400">Honors: {current.completionRecord.honorsTag || 'Distinction'}</div>
                </div>
              </div>

              {/* Endorsed Skills */}
              {current.completionRecord.skillsEndorsed && current.completionRecord.skillsEndorsed.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Endorsed Skills & Competencies
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {current.completionRecord.skillsEndorsed.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-900/50 text-indigo-200 border border-indigo-700/50"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={Award}
                  onClick={() => setIsCertificateModalOpen(true)}
                  className="text-xs"
                >
                  Open Full Certificate Preview & Print
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Internship Final Capstone Report */}
      {activeTab === 'report' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Final Capstone Report & Technical Documentation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload and manage your final engineering report, architecture documentation, or capstone slides.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={UploadCloud}
              onClick={() => setIsUploadReportModalOpen(true)}
              className="text-xs"
            >
              {current.finalReportDocument ? 'Replace Report' : 'Upload Report'}
            </Button>
          </div>

          {!current.finalReportDocument ? (
            <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                No capstone report uploaded yet. Click above to attach your final technical report.
              </p>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {current.finalReportDocument.fileName}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>Size: {(current.finalReportDocument.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                    <span>•</span>
                    <span>Uploaded: {current.finalReportDocument.uploadedAt.split('T')[0]}</span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {current.finalReportDocument.storageProvider}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={current.finalReportDocument.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={current.finalReportDocument.fileName}
                >
                  <Button variant="outline" size="sm" leftIcon={Download} className="text-xs">
                    Download Document
                  </Button>
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUploadReportModalOpen(true)}
                  className="text-xs"
                >
                  Upload Revision
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODALS */}
      <MilestoneModal
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        onSubmit={handleSaveMilestone}
        initialMilestone={editingMilestone}
        isMentor={isMentorView}
      />

      <WeeklyLogModal
        isOpen={isWeeklyLogModalOpen}
        onClose={() => setIsWeeklyLogModalOpen(false)}
        onSubmit={handleSaveWeeklyLog}
        nextWeekNumber={current.weeklyLogs.length + 1}
      />

      <MentorFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={handleSaveFeedback}
        defaultMentorName={current.mentor?.name}
        defaultMentorRole={current.mentor?.title}
      />

      <FinalEvaluationModal
        isOpen={isEvaluationModalOpen}
        onClose={() => setIsEvaluationModalOpen(false)}
        onSubmit={handleSaveFinalEvaluation}
        internName={current.studentName}
        defaultEvaluatorName={current.mentor?.name}
        defaultEvaluatorRole={current.mentor?.title}
      />

      {current.completionRecord && (
        <CertificatePreviewModal
          isOpen={isCertificateModalOpen}
          onClose={() => setIsCertificateModalOpen(false)}
          internship={current}
        />
      )}

      <UploadReportModal
        isOpen={isUploadReportModalOpen}
        onClose={() => setIsUploadReportModalOpen(false)}
        onUpload={handleUploadReport}
        currentFileName={current.finalReportDocument?.fileName}
      />
    </div>
  );
};
