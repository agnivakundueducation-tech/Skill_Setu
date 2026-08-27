import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { InternshipMilestone, MilestoneStatus } from '../../../types/internship';
import { Calendar, CheckCircle2, Link2, FileText, Target } from 'lucide-react';

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (milestone: InternshipMilestone) => void;
  initialMilestone?: InternshipMilestone | null;
  isMentor?: boolean;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialMilestone,
  isMentor = false
}) => {
  const [title, setTitle] = useState(initialMilestone?.title || '');
  const [description, setDescription] = useState(initialMilestone?.description || '');
  const [dueDate, setDueDate] = useState(initialMilestone?.dueDate || new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<MilestoneStatus>(initialMilestone?.status || 'Pending');
  const [deliverableUrl, setDeliverableUrl] = useState(initialMilestone?.deliverableUrl || '');
  const [mentorFeedback, setMentorFeedback] = useState(initialMilestone?.mentorFeedback || '');
  const [score, setScore] = useState<number | undefined>(initialMilestone?.score || undefined);

  // Sync when initialMilestone changes
  React.useEffect(() => {
    if (initialMilestone) {
      setTitle(initialMilestone.title);
      setDescription(initialMilestone.description);
      setDueDate(initialMilestone.dueDate);
      setStatus(initialMilestone.status);
      setDeliverableUrl(initialMilestone.deliverableUrl || '');
      setMentorFeedback(initialMilestone.mentorFeedback || '');
      setScore(initialMilestone.score);
    } else {
      setTitle('');
      setDescription('');
      setDueDate(new Date().toISOString().split('T')[0]);
      setStatus('Pending');
      setDeliverableUrl('');
      setMentorFeedback('');
      setScore(undefined);
    }
  }, [initialMilestone, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const milestone: InternshipMilestone = {
      id: initialMilestone?.id || `ms-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      dueDate,
      status,
      deliverableUrl: deliverableUrl.trim() || undefined,
      submittedAt: (status === 'Submitted' || status === 'Approved') ? (initialMilestone?.submittedAt || new Date().toISOString()) : undefined,
      completedAt: status === 'Approved' ? (initialMilestone?.completedAt || new Date().toISOString()) : undefined,
      mentorFeedback: mentorFeedback.trim() || undefined,
      score: score !== undefined ? Number(score) : undefined
    };

    onSubmit(milestone);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialMilestone ? 'Edit Internship Milestone' : 'Add New Internship Milestone'}
      description="Define clear deliverables, target timelines, and submission links for structured sprint tracking."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Milestone Title & Sprint Scope *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Sprint 1-2: Microservices Auth & Database Layer"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Detailed Technical Requirements & Acceptance Criteria *
          </label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Outline required features, latency benchmarks, unit test thresholds, and architectural deliverables..."
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Due Date / Target Sprint Deadline
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Milestone Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as MilestoneStatus)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="Pending">Pending (Not Started)</option>
              <option value="In Progress">In Progress (Active Work)</option>
              <option value="Submitted">Submitted (Ready for Mentor Review)</option>
              <option value="Approved">Approved (Verified Complete)</option>
              <option value="Blocked">Blocked / Requires Assistance</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Deliverable Link (GitHub PR, Figma, Deployed Sandbox)
          </label>
          <div className="relative">
            <Link2 className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="url"
              value={deliverableUrl}
              onChange={(e) => setDeliverableUrl(e.target.value)}
              placeholder="https://github.com/org/repo/pull/12"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Mentor Specific Grading Section */}
        {isMentor && (
          <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
            <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mentor Review & Scoring (Industry Mentor Action)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mentor Feedback Notes
                </label>
                <input
                  type="text"
                  value={mentorFeedback}
                  onChange={(e) => setMentorFeedback(e.target.value)}
                  placeholder="e.g. Code passed all benchmark tests; clean architecture."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Score (0-100)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={score ?? ''}
                  onChange={(e) => setScore(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="e.g. 95"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            {initialMilestone ? 'Save Milestone Changes' : 'Create Milestone'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
