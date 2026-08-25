import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ActiveApplication } from '../../types/student';
import {
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  User,
  Mail,
  FileText,
  Briefcase,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface ApplicationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ActiveApplication | null;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  isOpen,
  onClose,
  application
}) => {
  if (!application) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${application.company} • Application Dossier`}
      description={`Tracking status for ${application.roleTitle}`}
      size="lg"
    >
      <div className="space-y-5">
        {/* Top Info Banner */}
        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <img
            src={application.companyLogo}
            alt={application.company}
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
          />
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {application.roleTitle}
              </h3>
              <Badge variant="primary" size="sm">
                {application.employmentType}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
              <span>{application.company}</span>
              <span>•</span>
              <span>{application.location}</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{application.stipendOrSalary}</span>
            </div>
          </div>
        </div>

        {/* Current Round & Next Step Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/30 space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Current Hiring Stage
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              {application.currentStage} (Step {application.stageStep}/{application.totalSteps})
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Next Action Deadline
            </div>
            <div className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {application.nextStepDeadline || 'Pending Recruiter Update'}
            </div>
          </div>
        </div>

        {/* Notes and feedback */}
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Internal Pipeline Notes & AI Feedback:
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {application.notes}
          </div>
        </div>

        {/* Recruiter Details */}
        {application.recruiterContact && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {application.recruiterContact.name}
                </div>
                <div className="text-slate-500 text-[11px]">
                  {application.recruiterContact.role}
                </div>
              </div>
            </div>
            <a
              href={`mailto:${application.recruiterContact.email}`}
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
            >
              <Mail className="w-3.5 h-3.5" />
              {application.recruiterContact.email}
            </a>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={() => alert('Interview prep kit loaded with mock questions!')}>
            Launch Interview Prep Simulator
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
