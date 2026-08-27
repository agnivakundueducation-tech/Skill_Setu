import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import {
  CollaborationApplication,
  CollaborationApplicationStatus
} from '../../types/collaboration';
import {
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Eye,
  XCircle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Award
} from 'lucide-react';

interface MyCollaborationsViewProps {
  applications: CollaborationApplication[];
  onWithdrawApplication: (applicationId: string) => Promise<{ success: boolean; error?: string }>;
  onRefresh: () => void;
  isLoading?: boolean;
}

const LIFECYCLE_STAGES: CollaborationApplicationStatus[] = [
  'Submitted',
  'Under Review',
  'Shortlisted',
  'Accepted',
  'Completed'
];

export const MyCollaborationsView: React.FC<MyCollaborationsViewProps> = ({
  applications,
  onWithdrawApplication,
  onRefresh,
  isLoading = false
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [inspectApp, setInspectApp] = useState<CollaborationApplication | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const filteredApplications = applications.filter((app) => {
    if (selectedStatus === 'All') return true;
    if (selectedStatus === 'Active') {
      return ['Submitted', 'Under Review', 'Shortlisted', 'Accepted'].includes(app.status);
    }
    if (selectedStatus === 'Completed') return app.status === 'Completed';
    if (selectedStatus === 'Withdrawn') return app.status === 'Withdrawn' || app.status === 'Rejected';
    return app.status === selectedStatus;
  });

  const getStatusBadge = (status: CollaborationApplicationStatus) => {
    switch (status) {
      case 'Submitted':
        return <Badge variant="neutral" size="sm">Submitted</Badge>;
      case 'Under Review':
        return <Badge variant="sky" size="sm">Under Review</Badge>;
      case 'Shortlisted':
        return <Badge variant="indigo" size="sm">Shortlisted</Badge>;
      case 'Accepted':
        return <Badge variant="success" size="sm">Accepted & Active</Badge>;
      case 'Completed':
        return <Badge variant="emerald" size="sm">Completed & Verified</Badge>;
      case 'Withdrawn':
        return <Badge variant="warning" size="sm">Withdrawn</Badge>;
      case 'Rejected':
        return <Badge variant="danger" size="sm">Not Selected</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  const getStageIndex = (status: CollaborationApplicationStatus) => {
    const idx = LIFECYCLE_STAGES.indexOf(status);
    return idx !== -1 ? idx : 0;
  };

  const handleWithdraw = async (applicationId: string) => {
    if (!window.confirm('Are you sure you want to withdraw this collaboration proposal?')) {
      return;
    }
    setIsWithdrawing(true);
    await onWithdrawApplication(applicationId);
    setIsWithdrawing(false);
    if (inspectApp?.applicationId === applicationId) {
      setInspectApp(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <span>My Collaboration Applications & Engagements</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Track real-time proposal status, industry review stages, and verified completion milestones.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-stretch sm:self-center overflow-x-auto">
          {['All', 'Active', 'Completed', 'Withdrawn'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedStatus(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === tab
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="space-y-4">
          {filteredApplications.map((app) => {
            const currentStageIdx = getStageIndex(app.status);
            const isTerminal = app.status === 'Withdrawn' || app.status === 'Rejected';

            return (
              <Card
                key={app.applicationId}
                variant="default"
                className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/80 transition-all space-y-4"
              >
                {/* Header: Title, Partner, Status */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {app.industryName}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-xs text-slate-500">{app.collaborationType}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {app.collaborationTitle}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                    {getStatusBadge(app.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={Eye}
                      onClick={() => setInspectApp(app)}
                      className="text-xs"
                    >
                      View Proposal
                    </Button>
                  </div>
                </div>

                {/* Proposal Summary Snippet */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Proposal: {app.proposal.proposalTitle}
                  </span>
                  <p className="line-clamp-2 leading-relaxed text-slate-500">
                    {app.proposal.summary}
                  </p>
                </div>

                {/* Visual Lifecycle Progress Bar (if not withdrawn/rejected) */}
                {!isTerminal ? (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="grid grid-cols-5 gap-2">
                      {LIFECYCLE_STAGES.map((stage, idx) => {
                        const isDone = idx <= currentStageIdx;
                        const isCurrent = idx === currentStageIdx;

                        return (
                          <div key={stage} className="space-y-1.5 text-center">
                            <div
                              className={`h-1.5 rounded-full transition-all ${
                                isDone
                                  ? 'bg-indigo-600 dark:bg-indigo-500'
                                  : 'bg-slate-100 dark:bg-slate-800'
                              }`}
                            />
                            <span
                              className={`text-[10px] font-semibold block truncate ${
                                isCurrent
                                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                                  : isDone
                                  ? 'text-slate-700 dark:text-slate-300'
                                  : 'text-slate-400 dark:text-slate-600'
                              }`}
                            >
                              {stage}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
                    <span>Application is {app.status.toLowerCase()}.</span>
                    {app.industryNotes && <span className="italic">Note: {app.industryNotes}</span>}
                  </div>
                )}

                {/* Footer Metadata */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>
                    Submitted on: <strong>{new Date(app.submittedAt).toLocaleDateString()}</strong>
                  </span>
                  <span>
                    Deterministic Match Score: <strong className="text-slate-600 dark:text-slate-300">{app.matchScoreAtApplication}%</strong>
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No collaborations in this view
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You haven't submitted proposals under this category yet. Explore the Marketplace to find opportunities matching your research and expertise.
          </p>
        </div>
      )}

      {/* Inspect Proposal Modal */}
      {inspectApp && (
        <Modal
          isOpen={Boolean(inspectApp)}
          onClose={() => setInspectApp(null)}
          title="Collaboration Proposal Details"
          size="lg"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {inspectApp.industryName}
                </span>
                {getStatusBadge(inspectApp.status)}
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {inspectApp.collaborationTitle}
              </h4>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                  Proposal Title
                </span>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {inspectApp.proposal.proposalTitle}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                  Summary & Methodology
                </span>
                <p className="leading-relaxed whitespace-pre-line p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  {inspectApp.proposal.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                    Expected Outcomes
                  </span>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {inspectApp.proposal.expectedOutcome || 'Standard faculty immersion deliverables'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                    Estimated Duration
                  </span>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {inspectApp.proposal.estimatedDuration || 'As advertised'}
                  </p>
                </div>
              </div>

              {inspectApp.industryNotes && (
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 space-y-1">
                  <span className="font-bold block text-xs">Industry Feedback / Notes</span>
                  <p className="text-xs leading-relaxed">{inspectApp.industryNotes}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              {['Submitted', 'Under Review', 'Shortlisted'].includes(inspectApp.status) ? (
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={XCircle}
                  onClick={() => handleWithdraw(inspectApp.applicationId)}
                  isLoading={isWithdrawing}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  Withdraw Proposal
                </Button>
              ) : (
                <div />
              )}

              <Button variant="primary" size="sm" onClick={() => setInspectApp(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
