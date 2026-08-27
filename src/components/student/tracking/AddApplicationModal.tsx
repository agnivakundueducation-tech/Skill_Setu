import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { ActiveApplication, ApplicationStatus } from '../../../types/student';
import {
  Building2,
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  FileText,
  User,
  Mail,
  Send,
  Sparkles
} from 'lucide-react';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddApplication: (app: ActiveApplication) => void;
}

const DEFAULT_COMPANY_LOGOS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=120&auto=format&fit=crop&q=80'
];

export const AddApplicationModal: React.FC<AddApplicationModalProps> = ({
  isOpen,
  onClose,
  onAddApplication
}) => {
  const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

  const [company, setCompany] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [currentStage, setCurrentStage] = useState<ApplicationStatus>('Applied');
  const [nextStepTitle, setNextStepTitle] = useState('Resume & Portfolio Review');
  const [nextStepDeadline, setNextStepDeadline] = useState('Aug 30, 2026');
  const [appliedDate, setAppliedDate] = useState(todayStr);
  const [stipendOrSalary, setStipendOrSalary] = useState('₹18,00,000 / annum CTC');
  const [location, setLocation] = useState('Bengaluru, India (Hybrid)');
  const [workType, setWorkType] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [employmentType, setEmploymentType] = useState<'Full-time' | 'Internship' | 'Micro-Internship' | 'Co-op' | 'Part-time'>('Full-time');
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !roleTitle.trim()) return;

    const randomLogo = DEFAULT_COMPANY_LOGOS[Math.floor(Math.random() * DEFAULT_COMPANY_LOGOS.length)];

    const newApp: ActiveApplication = {
      id: `app-custom-${Date.now()}`,
      company: company.trim(),
      companyLogo: randomLogo,
      roleTitle: roleTitle.trim(),
      location: location.trim() || 'Remote',
      workType,
      employmentType,
      appliedDate: appliedDate.trim() || todayStr,
      currentStage,
      stageStep: currentStage === 'Applied' ? 1 : currentStage === 'Shortlisted' ? 2 : currentStage === 'Assessment' ? 3 : currentStage === 'Interview' ? 4 : 5,
      totalSteps: 5,
      matchScore: 90,
      stipendOrSalary: stipendOrSalary.trim() || 'Competitive Compensation',
      nextStepTitle: nextStepTitle.trim() || 'Application In Review',
      nextStepDeadline: nextStepDeadline.trim(),
      recruiterContact: recruiterName.trim() ? {
        name: recruiterName.trim(),
        role: 'Talent Acquisition',
        email: recruiterEmail.trim() || 'recruiter@company.com'
      } : undefined,
      notes: notes.trim() || 'Self-tracked application via SkillSetu Lifecycle Tracker.',
      status: currentStage === 'Selected' ? 'offer' : currentStage === 'Rejected' ? 'rejected' : 'active',
      timelineHistory: [
        {
          id: `t-add-${Date.now()}`,
          stage: currentStage,
          title: `Application Logged (${currentStage})`,
          date: appliedDate || todayStr,
          description: `Tracked in SkillSetu Application Pipeline`,
          completed: true,
          current: true
        }
      ]
    };

    onAddApplication(newApp);
    // Reset form
    setCompany('');
    setRoleTitle('');
    setCurrentStage('Applied');
    setNotes('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Track New Application"
      description="Add an on-campus or off-campus role to your pipeline tracker"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company & Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Company Name *
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Google, Microsoft, Startup"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Role Title *
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Software Engineer, Frontend Intern"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Current Status & Application Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Current Status *
            </label>
            <select
              value={currentStage}
              onChange={(e) => setCurrentStage(e.target.value as ApplicationStatus)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
            >
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Assessment">Assessment</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Application Date *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Aug 21, 2026"
                value={appliedDate}
                onChange={(e) => setAppliedDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Next Step & Next Step Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Next Step Title *
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Technical Coding Round on Aug 28"
                value={nextStepTitle}
                onChange={(e) => setNextStepTitle(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Next Step Deadline (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Aug 28, 2026 • 04:00 PM"
              value={nextStepDeadline}
              onChange={(e) => setNextStepDeadline(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Stipend & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Compensation / Stipend
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. ₹80,000 / mo"
                value={stipendOrSalary}
                onChange={(e) => setStipendOrSalary(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Work Mode
            </label>
            <select
              value={workType}
              onChange={(e) => setWorkType(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Employment Type
            </label>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Micro-Internship">Micro-Internship</option>
              <option value="Co-op">Co-op</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>
        </div>

        {/* Recruiter & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Recruiter Name & Email (Optional)
            </label>
            <div className="space-y-1.5">
              <input
                type="text"
                placeholder="Recruiter Name"
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
              />
              <input
                type="email"
                placeholder="recruiter@company.com"
                value={recruiterEmail}
                onChange={(e) => setRecruiterEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Notes & Interview Feedback
            </label>
            <textarea
              rows={3}
              placeholder="Add key highlights, referral details, or round notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" leftIcon={Send}>
            Add to Pipeline
          </Button>
        </div>
      </form>
    </Modal>
  );
};
