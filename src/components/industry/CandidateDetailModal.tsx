import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { IndustryCandidate } from '../../types/industry';
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
  TrendingUp,
  Clock,
  Sparkles,
  Send,
  MessageSquare
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
  const [interviewDate, setInterviewDate] = useState('2026-08-28T15:00');
  const [interviewType, setInterviewType] = useState('Technical Round 1 (System Design & Code)');
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'projects' | 'certifications' | 'schedule'>('overview');

  if (!candidate) return null;

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScheduling(true);
    setTimeout(() => {
      setIsScheduling(false);
      setScheduleSuccess(true);
      if (onUpdateStatus) {
        onUpdateStatus(candidate.id, 'Interview Scheduled');
      }
      setTimeout(() => {
        setScheduleSuccess(false);
        setActiveTab('overview');
      }, 1500);
    }, 600);
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
      title="Candidate Executive Profile & Compatibility Audit"
      description="Deep dive into verified project artifacts, cryptographic skill benchmarks, and AI compatibility scoring."
      size="xl"
    >
      <div className="space-y-6 pt-2">
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

          {/* Match Score Badge */}
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
          {(
            [
              { id: 'overview', label: 'Match Overview & Metrics', icon: Zap },
              { id: 'skills', label: `Skills (${candidate.skills.length})`, icon: ShieldCheck },
              { id: 'projects', label: `Projects (${candidate.projects.length})`, icon: FolderGit2 },
              { id: 'certifications', label: `Certifications (${candidate.certifications.length})`, icon: Award },
              { id: 'schedule', label: 'Schedule Interview', icon: Calendar }
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

        {/* Tab 1: Match Overview & Breakdown */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Match Breakdown Grid */}
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

            {/* Application Details */}
            {candidate.appliedFor && (
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                    Application For: {candidate.appliedFor.jobTitle}
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

            {/* Quick Contact & Telemetry Info */}
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

        {/* Tab 2: Verified Skills */}
        {activeTab === 'skills' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {candidate.skills.map((skill, sIdx) => (
                <div
                  key={sIdx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {skill.name}
                      </span>
                      {skill.verified && (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200/60">
                          <ShieldCheck className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                      {skill.score}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Proficiency: {skill.level}</span>
                    <span>Proctored Assessment Benchmark</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Verified Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            {candidate.projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {proj.title}
                      </h4>
                      {proj.starsCount && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/60">
                          <Star className="w-3 h-3 fill-amber-500" />
                          {proj.starsCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                      {proj.tagline}
                    </p>
                  </div>

                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold self-start sm:self-auto"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>View Codebase</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {proj.metrics && (
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Benchmark: </span>
                    {proj.metrics}
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
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
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                        {cert.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {cert.issuer}
                      </p>
                    </div>
                  </div>

                  <Badge variant="primary" size="sm" className="shrink-0">
                    {cert.badgeLevel}
                  </Badge>
                </div>

                {cert.gradeScore && (
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-1">
                    Evaluation: {cert.gradeScore}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Schedule Interview */}
        {activeTab === 'schedule' && (
          <form onSubmit={handleScheduleInterview} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-3.5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Schedule Direct Technical Interview
            </h4>
            <p className="text-xs text-slate-500">
              Sends an automated calendar invite and SkillSetu real-time coding sandbox link to {candidate.fullName}.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Interview Stage / Round
                </label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <option value="Technical Round 1 (System Design & Code)">Technical Round 1 (System Design & Code)</option>
                  <option value="Architectural Deep Dive & Live Pairing">Architectural Deep Dive & Live Pairing</option>
                  <option value="Engineering Manager & Culture Fit">Engineering Manager & Culture Fit</option>
                  <option value="Final Executive Offer Discussion">Final Executive Offer Discussion</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Date & Time Slot
                </label>
                <input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            {scheduleSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Interview successfully scheduled! Calendar invite and sandbox link dispatched to {candidate.email}.</span>
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
                  Confirm & Dispatch Invite
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
            {activeTab !== 'schedule' && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={Calendar}
                onClick={() => setActiveTab('schedule')}
              >
                Schedule Interview
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
