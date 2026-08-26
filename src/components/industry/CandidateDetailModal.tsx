import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { IndustryCandidate } from '../../types/industry';
import { useAuth } from '../../context/AuthContext';
import {
  scheduleInterview,
  submitInterviewEvaluation,
  issueOffer
} from '../../services/placementService';
import { InterviewType, InterviewEvaluationRecommendation } from '../../types/recruitment';
import {
  User,
  Star,
  ShieldCheck,
  CheckCircle2,
  FolderGit2,
  Award,
  Calendar,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  ExternalLink,
  Github,
  Zap,
  Clock,
  Send,
  FileText,
  DollarSign,
  AlertCircle,
  FileCheck,
  Building2,
  Lock
} from 'lucide-react';

interface CandidateDetailModalProps {
  candidate: IndustryCandidate | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleShortlist: (candidateId: string) => void;
  onUpdateStatus?: (candidateId: string, newStatus: NonNullable<IndustryCandidate['appliedFor']>['status']) => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  isOpen,
  onClose,
  onToggleShortlist,
  onUpdateStatus
}) => {
  const { appUser, isAuthenticated, isDemo } = useAuth();

  // Active tab navigation
  const [activeTab, setActiveTab] = useState<
    'overview' | 'skills' | 'projects' | 'certifications' | 'vault' | 'schedule' | 'evaluate' | 'offer'
  >('overview');

  // Interview scheduling state
  const [interviewDate, setInterviewDate] = useState('2026-08-28T15:00');
  const [interviewType, setInterviewType] = useState<InterviewType>('Technical');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [meetingLocation, setMeetingLocation] = useState('https://meet.skillsetu.ai/eval-sandbox-8921');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  // Evaluation state
  const [techScore, setTechScore] = useState(4);
  const [probScore, setProbScore] = useState(5);
  const [commScore, setCommScore] = useState(4);
  const [fitScore, setFitScore] = useState(5);
  const [recommendation, setRecommendation] = useState<InterviewEvaluationRecommendation>('Strong Hire');
  const [evalComments, setEvalComments] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalSuccess, setEvalSuccess] = useState(false);
  const [evalError, setEvalError] = useState<string | null>(null);

  // Offer state
  const [offerRole, setOfferRole] = useState('');
  const [offerType, setOfferType] = useState('Full-time');
  const [offerCompensation, setOfferCompensation] = useState('₹14,50,000 / annum');
  const [offerLocation, setOfferLocation] = useState('Bengaluru, Karnataka');
  const [offerWorkMode, setOfferWorkMode] = useState<'On-site' | 'Hybrid' | 'Remote'>('Hybrid');
  const [joiningDate, setJoiningDate] = useState('2026-10-01');
  const [responseDeadline, setResponseDeadline] = useState('2026-09-15');
  const [offerNotes, setOfferNotes] = useState('');
  const [isIssuingOffer, setIsIssuingOffer] = useState(false);
  const [offerSuccess, setOfferSuccess] = useState(false);
  const [offerError, setOfferError] = useState<string | null>(null);

  if (!candidate) return null;

  // Handle Interview Scheduling
  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScheduling(true);
    setScheduleError(null);

    const recruiterId = (isAuthenticated && !isDemo && appUser?.uid) ? appUser.uid : 'demo-industry-apex';
    const recruiterName = appUser?.displayName || 'Apex Cloud Systems Recruitment Team';

    try {
      const res = await scheduleInterview({
        applicationId: candidate.appliedFor?.jobId ? `app-${candidate.appliedFor.jobId}-${candidate.id}` : `app-${candidate.id}`,
        candidateId: candidate.id,
        studentName: candidate.fullName,
        studentEmail: candidate.email,
        studentAvatar: candidate.avatarUrl,
        companyName: appUser?.displayName || 'Enterprise Cloud Systems',
        opportunityTitle: candidate.appliedFor?.jobTitle || candidate.targetRole,
        opportunityId: candidate.appliedFor?.jobId,
        recruiterId,
        recruiterName,
        interviewType,
        scheduledAt: interviewDate,
        durationMinutes,
        meetingLinkOrLocation: meetingLocation,
        notes: interviewNotes,
        isDemo: isDemo || !isAuthenticated
      });

      if (res.success) {
        setScheduleSuccess(true);
        if (onUpdateStatus) {
          onUpdateStatus(candidate.id, 'Interview Scheduled');
        }
        setTimeout(() => {
          setScheduleSuccess(false);
          setActiveTab('overview');
        }, 1500);
      } else {
        setScheduleError(res.error || 'Failed to schedule interview');
      }
    } catch (err) {
      setScheduleError(err instanceof Error ? err.message : 'Failed to schedule interview');
    } finally {
      setIsScheduling(false);
    }
  };

  // Handle Evaluation Submission
  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalComments.trim()) {
      setEvalError('Please provide qualitative comments for the evaluation audit.');
      return;
    }
    setIsEvaluating(true);
    setEvalError(null);

    const interviewerId = (isAuthenticated && !isDemo && appUser?.uid) ? appUser.uid : 'demo-industry-apex';
    const interviewerName = appUser?.displayName || 'Technical Interview Board';

    try {
      const res = await submitInterviewEvaluation({
        interviewId: `int-${candidate.id}`,
        interviewerId,
        interviewerName,
        technicalCompetency: techScore,
        problemSolving: probScore,
        communication: commScore,
        roleFit: fitScore,
        overallRecommendation: recommendation,
        comments: evalComments,
        isDemo: isDemo || !isAuthenticated
      });

      if (res.success) {
        setEvalSuccess(true);
        if (onUpdateStatus) {
          onUpdateStatus(candidate.id, 'Technical Round');
        }
        setTimeout(() => {
          setEvalSuccess(false);
          setActiveTab('overview');
        }, 1500);
      } else {
        setEvalError(res.error || 'Failed to submit evaluation');
      }
    } catch (err) {
      setEvalError(err instanceof Error ? err.message : 'Error submitting evaluation');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Handle Offer Issuance
  const handleIssueOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsIssuingOffer(true);
    setOfferError(null);

    const recruiterId = (isAuthenticated && !isDemo && appUser?.uid) ? appUser.uid : 'demo-industry-apex';
    const organizationName = appUser?.displayName || 'Apex Cloud Systems';

    try {
      const res = await issueOffer({
        applicationId: candidate.appliedFor?.jobId ? `app-${candidate.appliedFor.jobId}-${candidate.id}` : `app-${candidate.id}`,
        studentId: candidate.id,
        studentName: candidate.fullName,
        studentEmail: candidate.email,
        studentAvatar: candidate.avatarUrl,
        organization: organizationName,
        role: offerRole || candidate.appliedFor?.jobTitle || candidate.targetRole,
        opportunityId: candidate.appliedFor?.jobId,
        employmentType: offerType,
        compensation: offerCompensation,
        location: offerLocation,
        workMode: offerWorkMode,
        joiningDate,
        responseDeadline,
        notes: offerNotes,
        issuedBy: recruiterId,
        issuedByName: organizationName,
        isDemo: isDemo || !isAuthenticated
      });

      if (res.success) {
        setOfferSuccess(true);
        if (onUpdateStatus) {
          onUpdateStatus(candidate.id, 'Offered');
        }
        setTimeout(() => {
          setOfferSuccess(false);
          setActiveTab('overview');
        }, 1500);
      } else {
        setOfferError(res.error || 'Failed to issue offer');
      }
    } catch (err) {
      setOfferError(err instanceof Error ? err.message : 'Error issuing offer');
    } finally {
      setIsIssuingOffer(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
    if (score >= 80) return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800';
    return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Candidate Executive Profile & Recruitment Lifecycle Audit"
      description="Cryptographic Skill DNA benchmarks, verified Document Vault evidence, and integrated ATS evaluation."
      size="xl"
    >
      <div className="space-y-5 pt-2">
        {/* Candidate Top Header Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 border-2 border-indigo-500/30 shrink-0">
              <img
                src={candidate.avatarUrl}
                alt={candidate.fullName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {candidate.fullName}
                </h3>
                {candidate.isShortlisted && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    Shortlisted
                  </span>
                )}
                {candidate.appliedFor && (
                  <Badge variant="primary" size="sm">
                    {candidate.appliedFor.status}
                  </Badge>
                )}
              </div>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                {candidate.targetRole}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {candidate.institution}
                </span>
                <span>•</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">CGPA: {candidate.cgpa}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {candidate.location}
                </span>
              </div>
            </div>
          </div>

          {/* Match Score Badge & Quick Shortlist */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
            <div className={`p-3 rounded-2xl border text-center ${getScoreColor(candidate.matchScore)}`}>
              <div className="text-[10px] font-bold uppercase tracking-wider">
                Overall Compatibility
              </div>
              <div className="text-2xl font-black">
                {candidate.matchScore}%
              </div>
              <div className="text-[10px] opacity-80">
                AI Match Score
              </div>
            </div>

            <Button
              variant={candidate.isShortlisted ? 'primary' : 'outline'}
              size="sm"
              leftIcon={Star}
              onClick={() => onToggleShortlist(candidate.id)}
              className="text-xs"
            >
              {candidate.isShortlisted ? 'Shortlisted' : 'Shortlist Candidate'}
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-1 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Match & Profile', icon: Zap },
            { id: 'skills', label: `Skills (${candidate.skills.length})`, icon: ShieldCheck },
            { id: 'projects', label: `Projects (${candidate.projects.length})`, icon: FolderGit2 },
            { id: 'certifications', label: `Certificates (${candidate.certifications.length})`, icon: Award },
            { id: 'vault', label: 'Vault Dossier', icon: FileCheck },
            { id: 'schedule', label: '1. Schedule Interview', icon: Calendar },
            { id: 'evaluate', label: '2. Interview Evaluation', icon: Clock },
            { id: 'offer', label: '3. Issue Offer', icon: DollarSign }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Match Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Skill Alignment</div>
                <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {candidate.matchBreakdown.skillCompatibility}%
                </div>
                <div className="text-[10px] text-slate-500">Core tech overlap</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Project Rigor</div>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {candidate.matchBreakdown.projectRelevance}%
                </div>
                <div className="text-[10px] text-slate-500">Codebase telemetry</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Academic Standing</div>
                <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
                  {candidate.matchBreakdown.academicStanding}%
                </div>
                <div className="text-[10px] text-slate-500">GPA & coursework</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Assessment Index</div>
                <div className="text-xl font-black text-sky-600 dark:text-sky-400 mt-0.5">
                  {candidate.matchBreakdown.assessmentScore}%
                </div>
                <div className="text-[10px] text-slate-500">Proctored challenges</div>
              </div>
            </div>

            {candidate.appliedFor && (
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                    Application Target: {candidate.appliedFor.jobTitle}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    Applied on {candidate.appliedFor.appliedDate}
                  </span>
                </div>
                {candidate.appliedFor.notes && (
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Reviewer Notes: </span>
                    {candidate.appliedFor.notes}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Direct Contact</div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-indigo-500" />
                  <a href={`mailto:${candidate.email}`} className="hover:underline">{candidate.email}</a>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{candidate.phone}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Graduation & Batch</div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  {candidate.degree}
                </div>
                <div className="text-slate-500">
                  {candidate.graduationBatch} • {candidate.institution}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Skills */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {candidate.skills.map((skill, sIdx) => (
              <div
                key={sIdx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{skill.name}</span>
                    {skill.verified && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200/60">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{skill.score}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-600" style={{ width: `${skill.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-3">
            {candidate.projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{proj.title}</h4>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{proj.tagline}</p>
                  </div>
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
                    >
                      <Github className="w-3 h-3" />
                      <span>Codebase</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                {proj.metrics && (
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                    <span className="font-bold text-indigo-600">Benchmark: </span>{proj.metrics}
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.technologies.map((tech, tIdx) => (
                    <span key={tIdx} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Certifications */}
        {activeTab === 'certifications' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {candidate.certifications.map((cert) => (
              <div
                key={cert.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">{cert.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{cert.issuer}</p>
                    </div>
                  </div>
                  <Badge variant="primary" size="sm">{cert.badgeLevel}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Document Vault Dossier (RBAC-safe verified candidate documents) */}
        {activeTab === 'vault' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-start gap-3">
              <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-slate-100">Secure Candidate Application Dossier: </span>
                <span className="text-slate-600 dark:text-slate-400">
                  Only documents explicitly submitted by the student for this application and verified by institutional accreditation authorities are accessible. Private records remain securely protected.
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              {/* Document 1: Verified Resume */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span>Verified Master Technical Resume (PDF)</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        Verified
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      SHA256: 9f8a82d1e... • Submitted via Application Gateway
                    </div>
                  </div>
                </div>
                <a
                  href="https://skillsetu.demo/resumes/aarav_sharma_verified.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 flex items-center gap-1"
                >
                  <span>Inspect PDF</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Document 2: Career Passport Snapshot */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span>Cryptographic Career Passport & Skill DNA</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                        Blockchain Hash Verified
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Readiness Score: 88/100 • 8 Assessed Competencies
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Authenticated
                </span>
              </div>

              {/* Document 3: Academic Record */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Institutional Transcripts & Degree Attestation
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {candidate.institution} • CGPA {candidate.cgpa}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  Institutional Seal Attached
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Schedule Interview */}
        {activeTab === 'schedule' && (
          <form onSubmit={handleScheduleInterview} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Schedule Recruiter / Technical Interview
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Dispatches a direct calendar invite and SkillSetu coding sandbox link to {candidate.fullName}.
              </p>
            </div>

            {scheduleError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{scheduleError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Interview Type / Round
                </label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value as InterviewType)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <option value="Technical">Technical (Live Coding & Architecture)</option>
                  <option value="HR">HR (Culture Fit & Compensation)</option>
                  <option value="Managerial">Managerial (Leadership & Scenarios)</option>
                  <option value="Panel">Panel (Multi-Interviewer Evaluation)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Date & Time Slot (Local)
                </label>
                <input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="15"
                  max="180"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Meeting Link or Location
                </label>
                <input
                  type="text"
                  value={meetingLocation}
                  onChange={(e) => setMeetingLocation(e.target.value)}
                  placeholder="https://meet.skillsetu.ai/... or Campus Room 402"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Evaluation Notes / Focus Areas
              </label>
              <textarea
                value={interviewNotes}
                onChange={(e) => setInterviewNotes(e.target.value)}
                placeholder="E.g., Focus on distributed system reliability, TypeScript concurrency, and SQL schema design."
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            {scheduleSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Interview successfully scheduled! Record synchronized to ATS and candidate notified.</span>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isScheduling}
                  leftIcon={Send}
                >
                  Schedule & Dispatch Invite
                </Button>
              </div>
            )}
          </form>
        )}

        {/* Tab 7: Interview Evaluation */}
        {activeTab === 'evaluate' && (
          <form onSubmit={handleSubmitEvaluation} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Submit Post-Interview Evaluation & Rubric
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Record structured scores across competencies and issue your hiring recommendation.
              </p>
            </div>

            {evalError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{evalError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Technical Competency</span>
                  <span className="font-bold text-indigo-600">{techScore} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={techScore}
                  onChange={(e) => setTechScore(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Problem Solving & DSA</span>
                  <span className="font-bold text-indigo-600">{probScore} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={probScore}
                  onChange={(e) => setProbScore(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Communication & Clarity</span>
                  <span className="font-bold text-indigo-600">{commScore} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={commScore}
                  onChange={(e) => setCommScore(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Role Fit & Ownership</span>
                  <span className="font-bold text-indigo-600">{fitScore} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={fitScore}
                  onChange={(e) => setFitScore(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Overall Hiring Recommendation
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Strong Hire', 'Hire', 'Hold', 'Reject'] as const).map((rec) => (
                  <button
                    key={rec}
                    type="button"
                    onClick={() => setRecommendation(rec)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      recommendation === rec
                        ? rec === 'Strong Hire'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : rec === 'Hire'
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : rec === 'Hold'
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-rose-600 text-white border-rose-600'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {rec}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Interviewer Audit Comments
              </label>
              <textarea
                value={evalComments}
                onChange={(e) => setEvalComments(e.target.value)}
                placeholder="Detail technical strengths, code readability, architectural reasoning, and constructive feedback..."
                rows={3}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                required
              />
            </div>

            {evalSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Evaluation successfully committed! Status transitioned to Interview Completed.</span>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isEvaluating}
                  leftIcon={CheckCircle2}
                >
                  Submit Final Evaluation
                </Button>
              </div>
            )}
          </form>
        )}

        {/* Tab 8: Issue Offer */}
        {activeTab === 'offer' && (
          <form onSubmit={handleIssueOffer} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Issue Official Employment / Internship Offer
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Generates a binding offer letter record with compensation, joining terms, and response deadline.
              </p>
            </div>

            {offerError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{offerError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={offerRole || candidate.appliedFor?.jobTitle || candidate.targetRole}
                  onChange={(e) => setOfferRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Employment Type
                </label>
                <select
                  value={offerType}
                  onChange={(e) => setOfferType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <option value="Full-time">Full-time (Graduate Offer)</option>
                  <option value="Internship">Internship (Paid Cohort)</option>
                  <option value="Pre-Placement Offer (PPO)">Pre-Placement Offer (PPO)</option>
                  <option value="Contract">Direct Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Compensation (CTC / Stipend)
                </label>
                <input
                  type="text"
                  value={offerCompensation}
                  onChange={(e) => setOfferCompensation(e.target.value)}
                  placeholder="₹14,50,000 / annum or ₹50,000 / month"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Work Mode & Location
                </label>
                <div className="flex gap-2">
                  <select
                    value={offerWorkMode}
                    onChange={(e) => setOfferWorkMode(e.target.value as any)}
                    className="w-1/3 px-2 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                  </select>
                  <input
                    type="text"
                    value={offerLocation}
                    onChange={(e) => setOfferLocation(e.target.value)}
                    placeholder="Bengaluru, Karnataka"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Expected Joining Date
                </label>
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Candidate Response Deadline
                </label>
                <input
                  type="date"
                  value={responseDeadline}
                  onChange={(e) => setResponseDeadline(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Offer Letter Terms & Additional Notes
              </label>
              <textarea
                value={offerNotes}
                onChange={(e) => setOfferNotes(e.target.value)}
                placeholder="Signing bonus terms, relocation assistance, health insurance coverage, and team onboarding overview..."
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            {offerSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Offer officially issued and transmitted to candidate portal! Application status updated to Offer.</span>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isIssuingOffer}
                  leftIcon={DollarSign}
                >
                  Generate & Transmit Offer
                </Button>
              </div>
            )}
          </form>
        )}

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-400">
            Candidate ID: <span className="font-mono">{candidate.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
            {activeTab !== 'schedule' && activeTab !== 'evaluate' && activeTab !== 'offer' && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={Calendar}
                onClick={() => setActiveTab('schedule')}
              >
                Recruitment Actions
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
