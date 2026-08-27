import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import {
  CollaborationOpportunity,
  CollaborationApplication,
  CollaborationOutcome,
  CollaborationType,
  CollaborationStatus,
  CollaborationApplicationStatus
} from '../../types/collaboration';
import { collaborationService } from '../../services/collaborationService';
import {
  Building2,
  Plus,
  Users,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  FileText,
  Award,
  Filter,
  Eye,
  Edit,
  Trash2,
  Send,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

interface IndustryCollaborationsViewProps {
  industryId?: string;
  industryName?: string;
  isDemo?: boolean;
}

const COLLAB_TYPES: CollaborationType[] = [
  'Faculty Internship',
  'Research Collaboration',
  'FDP',
  'Live Project',
  'Consultancy',
  'Guest Lecture',
  'Mentorship',
  'Industrial Training',
  'Innovation Challenge'
];

export const IndustryCollaborationsView: React.FC<IndustryCollaborationsViewProps> = ({
  industryId = 'ind_novacore',
  industryName = 'NovaCore Technologies Inc.',
  isDemo = true
}) => {
  const [collaborations, setCollaborations] = useState<CollaborationOpportunity[]>([]);
  const [applications, setApplications] = useState<CollaborationApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [reviewApplication, setReviewApplication] = useState<CollaborationApplication | null>(null);
  const [recordOutcomeCollab, setRecordOutcomeCollab] = useState<CollaborationOpportunity | null>(null);

  // Filter State
  const [filterType, setFilterType] = useState<string>('All');

  // Form State for Creating Collaboration
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<CollaborationType>('Faculty Internship');
  const [formDescription, setFormDescription] = useState('');
  const [formTargetAudience, setFormTargetAudience] = useState('');
  const [formRequiredExpertise, setFormRequiredExpertise] = useState('');
  const [formPreferredExpertise, setFormPreferredExpertise] = useState('');
  const [formLocation, setFormLocation] = useState('Bengaluru, India');
  const [formWorkMode, setFormWorkMode] = useState<'Remote' | 'On-Site' | 'Hybrid'>('Hybrid');
  const [formDuration, setFormDuration] = useState('6 Weeks');
  const [formDeadline, setFormDeadline] = useState('2026-05-30');
  const [formCapacity, setFormCapacity] = useState(6);
  const [formFunding, setFormFunding] = useState('Stipend provided + research compute');

  // Form State for Outcome Recording
  const [outcomeParticipants, setOutcomeParticipants] = useState(4);
  const [outcomeSkills, setOutcomeSkills] = useState('PyTorch, LLM Optimization, Quantization');
  const [outcomeResearch, setOutcomeResearch] = useState('Joint conference paper submitted to IEEE');
  const [outcomeProject, setOutcomeProject] = useState('Optimized real-time inference latency by 40%');
  const [outcomeFeedback, setOutcomeFeedback] = useState('Faculty displayed exceptional depth in systems research.');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [collabRes, appRes] = await Promise.all([
        collaborationService.getCollaborations({ isDemo, industryId }),
        collaborationService.getApplicationsForIndustry(industryId, isDemo)
      ]);

      if (collabRes.success) setCollaborations(collabRes.data);
      if (appRes.success) setApplications(appRes.data);
    } catch (err) {
      console.error('Error loading industry collaborations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [industryId, isDemo]);

  const handleCreateCollaboration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newCollabData: Omit<CollaborationOpportunity, 'collaborationId' | 'createdAt' | 'updatedAt'> = {
      title: formTitle.trim(),
      description: formDescription.trim(),
      collaborationType: formType,
      industryId,
      industryName,
      targetAudience: formTargetAudience.trim() || 'Faculty members & researchers in Computer Science & AI',
      requiredExpertise: formRequiredExpertise.split(',').map(s => s.trim()).filter(Boolean),
      preferredExpertise: formPreferredExpertise.split(',').map(s => s.trim()).filter(Boolean),
      location: formLocation.trim(),
      workMode: formWorkMode,
      duration: formDuration.trim(),
      startDate: '2026-06-01',
      endDate: '2026-07-15',
      applicationDeadline: formDeadline,
      capacity: Number(formCapacity),
      status: 'Open',
      createdBy: industryId,
      fundingSupport: formFunding.trim() || undefined
    };

    const res = await collaborationService.createCollaboration(newCollabData, isDemo);
    if (res.success && res.data) {
      setCollaborations([res.data, ...collaborations]);
      setIsCreateModalOpen(false);
      // Reset form
      setFormTitle('');
      setFormDescription('');
      setFormRequiredExpertise('');
      setFormPreferredExpertise('');
    }
  };

  const handleUpdateApplicationStatus = async (
    applicationId: string,
    status: CollaborationApplicationStatus,
    notes?: string
  ) => {
    await collaborationService.updateApplicationStatus(applicationId, status, notes, isDemo);
    setApplications(apps =>
      apps.map(a => (a.applicationId === applicationId ? { ...a, status, industryNotes: notes || a.industryNotes } : a))
    );
    setReviewApplication(null);
  };

  const handleRecordOutcomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordOutcomeCollab) return;

    const outcomeData = {
      collaborationId: recordOutcomeCollab.collaborationId,
      collaborationTitle: recordOutcomeCollab.title,
      collaborationType: recordOutcomeCollab.collaborationType,
      recordedBy: industryId,
      recordedByName: industryName,
      participants: Number(outcomeParticipants),
      skillsDeveloped: outcomeSkills.split(',').map(s => s.trim()).filter(Boolean),
      researchOutput: outcomeResearch.trim(),
      projectOutcome: outcomeProject.trim(),
      certification: true,
      industryFeedback: outcomeFeedback.trim()
    };

    await collaborationService.recordCollaborationOutcome(
      recordOutcomeCollab.collaborationId,
      outcomeData,
      isDemo
    );

    setCollaborations(collabs =>
      collabs.map(c => (c.collaborationId === recordOutcomeCollab.collaborationId ? { ...c, status: 'Completed' } : c))
    );
    setRecordOutcomeCollab(null);
  };

  const activeCount = collaborations.filter(c => c.status === 'Open' || c.status === 'In Progress').length;
  const completedCount = collaborations.filter(c => c.status === 'Completed').length;
  const totalProposals = applications.length;
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted' || a.status === 'Accepted').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-indigo-500/30 text-indigo-200 border border-indigo-500/40">
              Industry Collaboration Directorate
            </span>
            <span className="text-xs text-slate-400">• {industryName}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">
            Academia–Industry Engagement & Faculty Immersion
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200/90 max-w-2xl leading-relaxed">
            Publish research grants, faculty internships, FDP keynotes, and live industrial capstones. Review incoming academician proposals with transparent deterministic skill matching.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
          className="shrink-0"
        >
          Post New Collaboration
        </Button>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="default" className="p-4 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Programs</span>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{activeCount}</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Open to Faculty</span>
        </Card>

        <Card variant="default" className="p-4 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Proposals Received</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{totalProposals}</div>
          <span className="text-[11px] text-slate-500">From verified faculty</span>
        </Card>

        <Card variant="default" className="p-4 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Shortlisted / Accepted</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{shortlistedCount}</div>
          <span className="text-[11px] text-slate-500">Active cohorts</span>
        </Card>

        <Card variant="default" className="p-4 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed Engagements</span>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{completedCount}</div>
          <span className="text-[11px] text-indigo-500 font-medium">Verified in Passports</span>
        </Card>
      </div>

      {/* Grid: Published Collaborations & Incoming Proposals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Published Opportunities */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Published Programs ({collaborations.length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {collaborations.map((collab) => {
              const collabApps = applications.filter(a => a.collaborationId === collab.collaborationId);

              return (
                <Card
                  key={collab.collaborationId}
                  variant="default"
                  className="p-4 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="primary" size="sm">
                          {collab.collaborationType}
                        </Badge>
                        <Badge
                          variant={collab.status === 'Open' ? 'success' : collab.status === 'Completed' ? 'emerald' : 'neutral'}
                          size="sm"
                        >
                          {collab.status}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                        {collab.title}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block">
                        {collabApps.length} Proposals
                      </span>
                      <span className="text-[10px] text-slate-400">Cap: {collab.capacity} seats</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {collab.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>Deadline: <strong>{collab.applicationDeadline}</strong></span>
                    <div className="flex items-center gap-2">
                      {collab.status !== 'Completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={Award}
                          onClick={() => setRecordOutcomeCollab(collab)}
                          className="text-[11px] py-1 h-auto"
                        >
                          Record Outcome
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: Incoming Faculty Proposals to Review */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Faculty Proposals & Review ({applications.length})</span>
          </h3>

          <div className="space-y-3">
            {applications.map((app) => (
              <Card
                key={app.applicationId}
                variant="default"
                className="p-4 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {app.academicianName}
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      {app.academicianDesignation} • {app.academicianInstitution}
                    </p>
                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 block mt-0.5">
                      Applied for: {app.collaborationTitle}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {app.matchScoreAtApplication}% Match
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-600 dark:text-slate-300">
                  <strong className="block text-slate-800 dark:text-slate-200">Proposal: {app.proposal.proposalTitle}</strong>
                  <p className="line-clamp-2 mt-0.5">{app.proposal.summary}</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Badge variant="sky" size="sm">{app.status}</Badge>

                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={Eye}
                    onClick={() => setReviewApplication(app)}
                    className="text-xs py-1 h-auto"
                  >
                    Review Proposal
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CREATE COLLABORATION MODAL */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Academia-Industry Collaboration Opportunity"
          size="lg"
        >
          <form onSubmit={handleCreateCollaboration} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Program Title *</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
                placeholder="e.g. Faculty Summer Immersion in Large Scale Distributed AI"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Collaboration Type *</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                >
                  {COLLAB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Work Mode</label>
                <select
                  value={formWorkMode}
                  onChange={(e) => setFormWorkMode(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                  <option value="On-Site">On-Site</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description & Objectives *</label>
              <textarea
                rows={3}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                required
                placeholder="Detail the scope of research, industrial training, or project deliverables..."
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Required Skills (60% match weight)</label>
                <input
                  type="text"
                  value={formRequiredExpertise}
                  onChange={(e) => setFormRequiredExpertise(e.target.value)}
                  placeholder="Machine Learning, Python, Cloud..."
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Preferred Skills</label>
                <input
                  type="text"
                  value={formPreferredExpertise}
                  onChange={(e) => setFormPreferredExpertise(e.target.value)}
                  placeholder="PyTorch, Kubernetes, ROS2..."
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Duration</label>
                <input
                  type="text"
                  value={formDuration}
                  onChange={(e) => setFormDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Application Deadline</label>
                <input
                  type="date"
                  value={formDeadline}
                  onChange={(e) => setFormDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Capacity (Seats)</label>
                <input
                  type="number"
                  value={formCapacity}
                  onChange={(e) => setFormCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" leftIcon={Send}>
                Publish to Collaboration Hub
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* REVIEW PROPOSAL MODAL */}
      {reviewApplication && (
        <Modal
          isOpen={Boolean(reviewApplication)}
          onClose={() => setReviewApplication(null)}
          title="Review Faculty Collaboration Proposal"
          size="lg"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {reviewApplication.academicianName}
                </h4>
                <p className="text-xs text-slate-500">
                  {reviewApplication.academicianDesignation} • {reviewApplication.academicianInstitution}
                </p>
              </div>
              <div className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-black">
                {reviewApplication.matchScoreAtApplication}% Match Score
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider block">Proposal Title</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                {reviewApplication.proposal.proposalTitle}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider block">Methodology & Summary</span>
              <p className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                {reviewApplication.proposal.summary}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider block">Expected Deliverables</span>
              <p className="text-slate-700 dark:text-slate-300">
                {reviewApplication.proposal.expectedOutcome}
              </p>
            </div>

            {/* Status Update Actions */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateApplicationStatus(reviewApplication.applicationId, 'Rejected', 'Application not selected at this time.')}
                className="text-rose-600 hover:bg-rose-50"
              >
                Decline
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateApplicationStatus(reviewApplication.applicationId, 'Shortlisted', 'Proposal shortlisted for technical discussion.')}
                >
                  Shortlist Faculty
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={CheckCircle2}
                  onClick={() => handleUpdateApplicationStatus(reviewApplication.applicationId, 'Accepted', 'Accepted into the industry collaboration cohort.')}
                >
                  Accept Proposal & Enroll
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* RECORD OUTCOME MODAL */}
      {recordOutcomeCollab && (
        <Modal
          isOpen={Boolean(recordOutcomeCollab)}
          onClose={() => setRecordOutcomeCollab(null)}
          title="Record Collaboration Outcome & Verify Experience"
          size="lg"
        >
          <form onSubmit={handleRecordOutcomeSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200">
              Recording an outcome will officially conclude <strong>{recordOutcomeCollab.title}</strong> and issue verified credential entries into the participating faculty's passport.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Faculty Cohort Size</label>
                <input
                  type="number"
                  value={outcomeParticipants}
                  onChange={(e) => setOutcomeParticipants(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Skills & Tech Developed</label>
                <input
                  type="text"
                  value={outcomeSkills}
                  onChange={(e) => setOutcomeSkills(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Research & IP Output</label>
              <input
                type="text"
                value={outcomeResearch}
                onChange={(e) => setOutcomeResearch(e.target.value)}
                placeholder="e.g. Joint IEEE paper, patent co-filing..."
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Industrial Project Impact</label>
              <textarea
                rows={2}
                value={outcomeProject}
                onChange={(e) => setOutcomeProject(e.target.value)}
                placeholder="Detail business or engineering impact delivered..."
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Industry Partner Feedback</label>
              <textarea
                rows={2}
                value={outcomeFeedback}
                onChange={(e) => setOutcomeFeedback(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setRecordOutcomeCollab(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" leftIcon={Award}>
                Finalize & Issue Verification
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
