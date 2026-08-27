import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { StudentProgramEnrollment } from '../../../types/learningProgram';
import { Star, MessageSquare, UserCheck, CheckCircle2 } from 'lucide-react';

interface ProgramMentorFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrollment: StudentProgramEnrollment | null;
  onSubmitFeedback: (enrollmentId: string, feedback: {
    mentorName: string;
    mentorTitle?: string;
    feedbackText: string;
    technicalRating: number;
    practicalRating: number;
  }) => Promise<boolean>;
  defaultMentorName?: string;
  defaultMentorTitle?: string;
}

export const ProgramMentorFeedbackModal: React.FC<ProgramMentorFeedbackModalProps> = ({
  isOpen,
  onClose,
  enrollment,
  onSubmitFeedback,
  defaultMentorName = 'Dr. Vikramaditya Sen',
  defaultMentorTitle = 'Principal Distributed Architect'
}) => {
  const [mentorName, setMentorName] = useState(defaultMentorName);
  const [mentorTitle, setMentorTitle] = useState(defaultMentorTitle);
  const [feedbackText, setFeedbackText] = useState(
    enrollment?.mentorFeedback?.feedbackText ||
      'Demonstrated rigorous analytical execution in protocol contracts and modular design. Highly proactive during live lab sessions.'
  );
  const [technicalRating, setTechnicalRating] = useState<number>(enrollment?.mentorFeedback?.technicalRating || 5);
  const [practicalRating, setPracticalRating] = useState<number>(enrollment?.mentorFeedback?.practicalRating || 5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!enrollment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsSubmitting(true);
    try {
      const ok = await onSubmitFeedback(enrollment.id, {
        mentorName: mentorName.trim(),
        mentorTitle: mentorTitle.trim(),
        feedbackText: feedbackText.trim(),
        technicalRating,
        practicalRating
      });
      if (ok) onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Submit Mentor Feedback: ${enrollment.studentName}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-1">
        <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800 flex items-center gap-3">
          <img
            src={enrollment.studentAvatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80'}
            alt={enrollment.studentName}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-cover border border-indigo-200"
          />
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {enrollment.studentName}
            </div>
            <div className="text-[11px] text-slate-500">
              {enrollment.programTitle} • {enrollment.progressPercentage}% Progress ({enrollment.completedModuleIds.length}/{enrollment.totalModulesCount} Modules)
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Mentor Signatory Name
            </label>
            <input
              type="text"
              value={mentorName}
              onChange={(e) => setMentorName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Mentor Designation
            </label>
            <input
              type="text"
              value={mentorTitle}
              onChange={(e) => setMentorTitle(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Ratings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Technical Competency</span>
              <span className="text-indigo-600 font-bold">{technicalRating}/5</span>
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setTechnicalRating(star)}
                  className={`p-1 rounded-md transition-colors ${
                    star <= technicalRating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'
                  }`}
                >
                  <Star className="w-5 h-5 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Practical Execution</span>
              <span className="text-indigo-600 font-bold">{practicalRating}/5</span>
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setPracticalRating(star)}
                  className={`p-1 rounded-md transition-colors ${
                    star <= practicalRating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'
                  }`}
                >
                  <Star className="w-5 h-5 fill-current" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Text */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Qualitative Mentor Feedback & Observations *
          </label>
          <textarea
            rows={4}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Describe student's project execution, architecture comprehension, lab participation, and strengths..."
            className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            required
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={isSubmitting} leftIcon={CheckCircle2}>
            {isSubmitting ? 'Submitting...' : 'Record Mentor Appraisal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
