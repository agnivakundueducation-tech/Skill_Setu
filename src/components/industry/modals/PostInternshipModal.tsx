import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { JobPosting } from '../../../types/industry';
import {
  GraduationCap,
  Building2,
  MapPin,
  DollarSign,
  Users,
  CheckCircle2,
  Plus,
  X,
  Calendar,
  Sparkles
} from 'lucide-react';

interface PostInternshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostInternship: (internship: JobPosting) => void;
}

export const PostInternshipModal: React.FC<PostInternshipModalProps> = ({
  isOpen,
  onClose,
  onPostInternship
}) => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Core Infrastructure & Systems');
  const [location, setLocation] = useState('Bengaluru, India (Hybrid)');
  const [workType, setWorkType] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [stipend, setStipend] = useState('₹45,000 / month + PPO Opportunity');
  const [duration, setDuration] = useState('6 Months (Full-Time)');
  const [openSlots, setOpenSlots] = useState(5);
  const [minMatchScore, setMinMatchScore] = useState(75);
  const [description, setDescription] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>([
    'Go',
    'TypeScript',
    'Redis Streams',
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
      const newInternship: JobPosting = {
        id: `intern-${Date.now()}`,
        title: title.trim(),
        type: 'internship',
        department,
        location,
        workType,
        salaryOrStipend: stipend,
        duration,
        openSlots: Number(openSlots),
        experienceLevel: 'Pre-Final / Final Year',
        status: 'active',
        postedDate: 'Just now',
        deadline: '30 Days from now',
        description: description.trim() || `Join our ${title} cohort to gain intensive practical experience, work on production codebases, and earn direct PPO opportunities.`,
        requiredSkills,
        preferredSkills: ['Git', 'Microservices', 'Clean Code'],
        minMatchScore: Number(minMatchScore),
        applicantsCount: 0,
        shortlistedCount: 0,
        interviewingCount: 0,
        hiredCount: 0
      };

      onPostInternship(newInternship);
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
      title="Post Industry Internship & Cohort"
      description="Launch a paid industry micro-internship or structured 6-month graduate program with mentor guidance."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Internship Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Internship Program Title *
          </label>
          <div className="relative">
            <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              placeholder="e.g. Distributed Systems & Cloud Platform Engineering Intern"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Department & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Department / Lab Group
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Core Infrastructure"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Internship Duration
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="6 Months (Full-Time)">6 Months (Full-Time + PPO)</option>
                <option value="3 Months (Summer Intensive)">3 Months (Summer Intensive)</option>
                <option value="2 Months (Micro-Internship)">2 Months (Micro-Internship)</option>
                <option value="1 Year (Graduate Co-Op)">1 Year (Graduate Co-Op)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Work Mode & Monthly Stipend */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Monthly Stipend + Perks
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
                placeholder="e.g. ₹45,000 / month + PPO Opportunity"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Cohort Open Slots & Match Threshold */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Cohort Intake Capacity (Slots)
            </label>
            <div className="relative">
              <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                min="1"
                max="100"
                value={openSlots}
                onChange={(e) => setOpenSlots(Number(e.target.value))}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Min. Match Score Filter
              </label>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                {minMatchScore}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="90"
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
            Key Assessment Skills Required
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add skill (e.g. React, TypeScript, Go)..."
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

        {/* Internship Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Internship Learning Roadmap & Project Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the capstone deliverables, 1-on-1 mentorship, and evaluation criteria..."
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
            Publish Internship Program
          </Button>
        </div>
      </form>
    </Modal>
  );
};
