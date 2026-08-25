import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { JobPosting } from '../../../types/industry';
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Users,
  CheckCircle2,
  Plus,
  X,
  Target,
  Sparkles,
  Layers
} from 'lucide-react';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostJob: (job: JobPosting) => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({
  isOpen,
  onClose,
  onPostJob
}) => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Platform Engineering');
  const [location, setLocation] = useState('Bengaluru, India (Hybrid)');
  const [workType, setWorkType] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [salaryOrStipend, setSalaryOrStipend] = useState('₹18,00,000 - ₹24,00,000 / yr');
  const [openSlots, setOpenSlots] = useState(3);
  const [experienceLevel, setExperienceLevel] = useState<JobPosting['experienceLevel']>('Entry Level / 0-1 yrs');
  const [minMatchScore, setMinMatchScore] = useState(80);
  const [description, setDescription] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>([
    'TypeScript',
    'Go',
    'Redis',
    'PostgreSQL',
    'Docker'
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSkill = () => {
    if (skillInput.trim() && !requiredSkills.includes(skillInput.trim())) {
      setRequiredSkills([...requiredSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || requiredSkills.length === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newJob: JobPosting = {
        id: `job-${Date.now()}`,
        title: title.trim(),
        type: 'job',
        department,
        location,
        workType,
        salaryOrStipend,
        openSlots: Number(openSlots),
        experienceLevel,
        status: 'active',
        postedDate: 'Just now',
        deadline: '30 Days from now',
        description: description.trim() || `We are hiring a ${title} to join our high-impact team. Work on distributed architecture and scalable modern applications.`,
        requiredSkills,
        preferredSkills: ['Kubernetes', 'CI/CD', 'System Design'],
        minMatchScore: Number(minMatchScore),
        applicantsCount: 0,
        shortlistedCount: 0,
        interviewingCount: 0,
        hiredCount: 0
      };

      onPostJob(newJob);
      setIsSubmitting(false);
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Publish Full-Time Job Opening"
      description="List a verified job opportunity with deterministic skill requirements and AI candidate compatibility filtering."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Job Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Job Title *
          </label>
          <div className="relative">
            <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              placeholder="e.g. Distributed Systems Engineer / Senior Frontend Architect"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Department & Work Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Department / Team
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Platform Engineering / AI Labs"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Work Mode
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Remote', 'Hybrid', 'On-site'] as const).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setWorkType(type)}
                  className={`py-2 text-xs font-bold rounded-xl transition-all border ${
                    workType === type
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Location & Compensation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru, India"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Annual CTC Range
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={salaryOrStipend}
                onChange={(e) => setSalaryOrStipend(e.target.value)}
                placeholder="e.g. ₹18,00,000 - ₹24,00,000 / yr"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Open Slots & Minimum Match Score Threshold */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Open Positions
            </label>
            <div className="relative">
              <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                min="1"
                max="50"
                value={openSlots}
                onChange={(e) => setOpenSlots(Number(e.target.value))}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Min. Match Score Threshold
              </label>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                {minMatchScore}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={minMatchScore}
              onChange={(e) => setMinMatchScore(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        {/* Required Skills Chips */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Required Technical Skills (Used for Match Scoring)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add skill (e.g. Go, Redis, Docker)..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={Plus}
              onClick={handleAddSkill}
            >
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 min-h-[44px]">
            {requiredSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Role Overview & Core Responsibilities
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Outline the architectural stack, day-to-day responsibilities, and team mission..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={CheckCircle2}
          >
            Publish Job Listing
          </Button>
        </div>
      </form>
    </Modal>
  );
};
