import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { InternshipFeedback } from '../../../types/internship';
import { Star, Award, CheckCircle2, MessageSquare, Plus, X, AlertCircle } from 'lucide-react';

interface MentorFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: Omit<InternshipFeedback, 'id' | 'date'>) => void;
  defaultMentorName?: string;
  defaultMentorRole?: string;
}

export const MentorFeedbackModal: React.FC<MentorFeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultMentorName = 'Lead Industry Mentor',
  defaultMentorRole = 'Principal Staff Engineer'
}) => {
  const [mentorName, setMentorName] = useState(defaultMentorName);
  const [mentorRole, setMentorRole] = useState(defaultMentorRole);
  const [stage, setStage] = useState<InternshipFeedback['stage']>('Milestone Check');
  const [technicalRating, setTechnicalRating] = useState<number>(5);
  const [softSkillsRating, setSoftSkillsRating] = useState<number>(5);
  const [initiativeRating, setInitiativeRating] = useState<number>(5);
  const [summaryComments, setSummaryComments] = useState('');
  
  const [strengths, setStrengths] = useState<string[]>([
    'Fast ramp-up on distributed systems architecture',
    'Rigorous unit testing and clean code documentation'
  ]);
  const [newStrength, setNewStrength] = useState('');

  const [improvements, setImprovements] = useState<string[]>([
    'Increase active participation in cross-team architectural reviews'
  ]);
  const [newImprovement, setNewImprovement] = useState('');

  const handleAddStrength = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (newStrength.trim()) {
      setStrengths([...strengths, newStrength.trim()]);
      setNewStrength('');
    }
  };

  const handleAddImprovement = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (newImprovement.trim()) {
      setImprovements([...improvements, newImprovement.trim()]);
      setNewImprovement('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summaryComments.trim()) return;

    onSubmit({
      mentorName,
      mentorRole,
      stage,
      technicalRating,
      softSkillsRating,
      initiativeRating,
      summaryComments: summaryComments.trim(),
      strengthsObserved: strengths,
      areasForImprovement: improvements
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Provide Structured Mentor Feedback"
      description="Record multi-dimensional evaluations, actionable technical feedback, and observable strengths."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Feedback Stage
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as InternshipFeedback['stage'])}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            >
              <option value="Milestone Check">Milestone Check</option>
              <option value="Mid-Term Review">Mid-Term Review</option>
              <option value="Sprint Review">Sprint Review</option>
              <option value="Weekly Standup">Weekly Standup</option>
              <option value="Ad-hoc">Ad-hoc</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Mentor Name
            </label>
            <input
              type="text"
              required
              value={mentorName}
              onChange={(e) => setMentorName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Mentor Role / Title
            </label>
            <input
              type="text"
              required
              value={mentorRole}
              onChange={(e) => setMentorRole(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* 3 Rating Dimensions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Technical Rigor</span>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{technicalRating}/5</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setTechnicalRating(star)}
                  className={`p-1 rounded-md transition-colors ${
                    star <= technicalRating
                      ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                      : 'text-slate-300 dark:text-slate-700'
                  }`}
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Soft Skills & Comms</span>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{softSkillsRating}/5</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSoftSkillsRating(star)}
                  className={`p-1 rounded-md transition-colors ${
                    star <= softSkillsRating
                      ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                      : 'text-slate-300 dark:text-slate-700'
                  }`}
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Initiative & Autonomy</span>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{initiativeRating}/5</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setInitiativeRating(star)}
                  className={`p-1 rounded-md transition-colors ${
                    star <= initiativeRating
                      ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                      : 'text-slate-300 dark:text-slate-700'
                  }`}
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Mentor Evaluation & Synthesis Comments *
          </label>
          <textarea
            rows={3}
            required
            value={summaryComments}
            onChange={(e) => setSummaryComments(e.target.value)}
            placeholder="Summarize the intern's trajectory, domain comprehension, code cleanliness, and milestone execution..."
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Observed Strengths & Highlights
            </label>
            <div className="space-y-1.5 mb-2">
              {strengths.map((str, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-2.5 py-1 text-xs rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40"
                >
                  <span className="truncate">{str}</span>
                  <button
                    type="button"
                    onClick={() => setStrengths(strengths.filter((_, i) => i !== idx))}
                    className="text-emerald-600 hover:text-emerald-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={newStrength}
                onChange={(e) => setNewStrength(e.target.value)}
                onKeyDown={handleAddStrength}
                placeholder="Add strength..."
                className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
              <Button type="button" size="sm" variant="outline" onClick={handleAddStrength}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Growth & Improvement Opportunities
            </label>
            <div className="space-y-1.5 mb-2">
              {improvements.map((imp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-2.5 py-1 text-xs rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/40"
                >
                  <span className="truncate">{imp}</span>
                  <button
                    type="button"
                    onClick={() => setImprovements(improvements.filter((_, i) => i !== idx))}
                    className="text-amber-600 hover:text-amber-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={newImprovement}
                onChange={(e) => setNewImprovement(e.target.value)}
                onKeyDown={handleAddImprovement}
                placeholder="Add growth area..."
                className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
              <Button type="button" size="sm" variant="outline" onClick={handleAddImprovement}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            Publish Mentor Feedback
          </Button>
        </div>
      </form>
    </Modal>
  );
};
