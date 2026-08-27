import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { InternshipWeeklyLog, WeeklyLogStatus } from '../../../types/internship';
import { Calendar, Plus, X, Sparkles, BookOpen, AlertCircle, TrendingUp } from 'lucide-react';

interface WeeklyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (log: Omit<InternshipWeeklyLog, 'id' | 'submittedAt'>) => void;
  nextWeekNumber: number;
}

export const WeeklyLogModal: React.FC<WeeklyLogModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  nextWeekNumber
}) => {
  const [weekNumber, setWeekNumber] = useState(nextWeekNumber);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [workSummary, setWorkSummary] = useState('');
  const [skillsPracticed, setSkillsPracticed] = useState<string[]>(['TypeScript', 'React']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [challengesFaced, setChallengesFaced] = useState('');
  const [nextWeekPlan, setNextWeekPlan] = useState('');

  React.useEffect(() => {
    setWeekNumber(nextWeekNumber);
  }, [nextWeekNumber, isOpen]);

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (newSkillInput.trim() && !skillsPracticed.includes(newSkillInput.trim())) {
      setSkillsPracticed([...skillsPracticed, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkillsPracticed(skillsPracticed.filter((s) => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workSummary.trim()) return;

    onSubmit({
      weekNumber: Number(weekNumber),
      startDate,
      endDate,
      workSummary: workSummary.trim(),
      skillsPracticed,
      challengesFaced: challengesFaced.trim(),
      nextWeekPlan: nextWeekPlan.trim(),
      status: 'Submitted'
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Submit Week ${weekNumber} Progress Log`}
      description="Chronicle technical milestones achieved, practical skills exercised, hurdles encountered, and upcoming sprint goals."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Week Number
            </label>
            <input
              type="number"
              min={1}
              required
              value={weekNumber}
              onChange={(e) => setWeekNumber(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Sprint Start Date
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Sprint End Date
            </label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Weekly Summary of Work & Deliverables *
          </label>
          <textarea
            rows={3}
            required
            value={workSummary}
            onChange={(e) => setWorkSummary(e.target.value)}
            placeholder="Describe features shipped, code authored, architectural designs reviewed, and integration points completed this week..."
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Skills & Technologies Actively Practiced
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {skillsPracticed.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-indigo-900 dark:hover:text-indigo-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="Add skill (e.g., Docker, Kafka, Redis, gRPC) and press Enter"
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={Plus}
              onClick={handleAddSkill}
              className="text-xs"
            >
              Add
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1 text-amber-700 dark:text-amber-400">
              <AlertCircle className="w-3.5 h-3.5" />
              Key Challenges & Blockers Encountered
            </label>
            <textarea
              rows={2}
              value={challengesFaced}
              onChange={(e) => setChallengesFaced(e.target.value)}
              placeholder="State any architectural uncertainties, environment setup bottlenecks, or upstream dependency delays..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1 text-indigo-700 dark:text-indigo-400">
              <TrendingUp className="w-3.5 h-3.5" />
              Goals & Action Items for Next Week
            </label>
            <textarea
              rows={2}
              value={nextWeekPlan}
              onChange={(e) => setNextWeekPlan(e.target.value)}
              placeholder="Outline specific milestones, PRs to open, benchmark tests to run, or pairing sessions planned..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            Submit Weekly Log for Mentor Review
          </Button>
        </div>
      </form>
    </Modal>
  );
};
