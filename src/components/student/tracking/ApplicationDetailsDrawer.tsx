import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { ActiveApplication, ApplicationStatus } from '../../../types/student';
import {
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  Briefcase,
  DollarSign,
  AlertCircle,
  XCircle,
  ExternalLink,
  Sparkles,
  Edit3,
  Check
} from 'lucide-react';

interface ApplicationDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  application: ActiveApplication | null;
  onUpdateStatus: (id: string, newStatus: ApplicationStatus) => void;
  onUpdateNotes?: (id: string, notes: string, nextStepTitle: string, nextStepDeadline: string) => void;
  onWithdrawApplication?: (id: string) => void;
}

const STAGES_LIST: ApplicationStatus[] = [
  'Applied',
  'Shortlisted',
  'Assessment',
  'Interview',
  'Selected',
  'Rejected'
];

export const ApplicationDetailsDrawer: React.FC<ApplicationDetailsDrawerProps> = ({
  isOpen,
  onClose,
  application,
  onUpdateStatus,
  onUpdateNotes,
  onWithdrawApplication
}) => {
  if (!application) return null;

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState(application.notes);
  const [editedNextStep, setEditedNextStep] = useState(application.nextStepTitle || '');
  const [editedDeadline, setEditedDeadline] = useState(application.nextStepDeadline || '');

  const handleSaveEdits = () => {
    if (onUpdateNotes) {
      onUpdateNotes(application.id, editedNotes, editedNextStep, editedDeadline);
    }
    setIsEditingNotes(false);
  };

  const getStatusBadge = (stage: ApplicationStatus) => {
    switch (stage) {
      case 'Selected':
        return <Badge variant="success" size="sm" dot>Selected / Offer</Badge>;
      case 'Interview':
        return <Badge variant="primary" size="sm" dot>Interview Round</Badge>;
      case 'Assessment':
        return <Badge variant="warning" size="sm" dot>Assessment Due</Badge>;
      case 'Shortlisted':
        return <Badge variant="info" size="sm" dot>Shortlisted</Badge>;
      case 'Rejected':
        return <Badge variant="danger" size="sm" dot>Rejected</Badge>;
      case 'Applied':
      default:
        return <Badge variant="neutral" size="sm" dot>Applied</Badge>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${application.company} • Application Dossier`}
      description={`Lifecycle progression tracking for ${application.roleTitle}`}
      size="lg"
    >
      <div className="space-y-5">
        {/* Header Profile */}
        <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <img
            src={application.companyLogo}
            alt={application.company}
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0 shadow-xs"
          />
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {application.roleTitle}
              </h3>
              {getStatusBadge(application.currentStage)}
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900">
                {application.matchScore}% Match Score
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {application.company}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {application.location} ({application.workType})
              </span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-500" />
                {application.stipendOrSalary}
              </span>
            </div>
          </div>
        </div>

        {/* 5-Field Explicit Display Matrix (Company, Role, Current Status, Next Step, Application Date) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Company
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {application.company}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Role
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5 truncate">
              {application.roleTitle}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Current Status
            </div>
            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {application.currentStage}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Application Date
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-indigo-500" />
              {application.appliedDate}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Next Step & Target Date
            </div>
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5 truncate flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {application.nextStepTitle || 'Review Stage'} {application.nextStepDeadline && `(${application.nextStepDeadline})`}
            </div>
          </div>
        </div>

        {/* Change Status Fast-Track Switcher */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Update Pipeline Status:</span>
            <span className="text-[11px] text-slate-400">Select any stage to transition</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {STAGES_LIST.map((stage) => {
              const isCurrent = application.currentStage === stage;
              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => onUpdateStatus(application.id, stage)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    isCurrent
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs ring-2 ring-indigo-400/30'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {stage}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chronological History Log */}
        {application.timelineHistory && application.timelineHistory.length > 0 && (
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Recruitment Lifecycle History Log
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {application.timelineHistory.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                    item.current
                      ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800'
                      : item.completed
                      ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                      : 'bg-slate-50/30 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/50 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center mt-0.5 shrink-0 ${
                      item.completed ? 'bg-emerald-500 text-white' : item.current ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-600'
                    }`}>
                      {item.completed ? <Check className="w-2.5 h-2.5" /> : <span className="text-[8px] font-bold">{idx + 1}</span>}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recruiter Details */}
        {application.recruiterContact && (
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                {application.recruiterContact.name.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {application.recruiterContact.name}
                </div>
                <div className="text-[11px] text-slate-500">
                  {application.recruiterContact.role}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`mailto:${application.recruiterContact.email}`}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                {application.recruiterContact.email}
              </a>
            </div>
          </div>
        )}

        {/* Notes & Editable Next Step */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Candidate Notes & AI Feedback:
            </span>
            <button
              onClick={() => setIsEditingNotes(!isEditingNotes)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              {isEditingNotes ? 'Cancel Edit' : 'Edit Note & Next Step'}
            </button>
          </div>

          {isEditingNotes ? (
            <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Next Step Action
                </label>
                <input
                  type="text"
                  value={editedNextStep}
                  onChange={(e) => setEditedNextStep(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Target Deadline
                </label>
                <input
                  type="text"
                  value={editedDeadline}
                  onChange={(e) => setEditedDeadline(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 resize-none"
                />
              </div>

              <div className="flex justify-end pt-1">
                <Button size="sm" variant="primary" onClick={handleSaveEdits} className="text-xs">
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {application.notes || 'No candidate notes recorded.'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400">
          <span>Application Ref: #{application.id}</span>
          <div className="flex items-center gap-2">
            {onWithdrawApplication && application.currentStage !== ('Withdrawn' as any) && (
              <Button
                variant="outline"
                size="sm"
                className="text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs"
                onClick={() => {
                  if (window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
                    onWithdrawApplication(application.id);
                    onClose();
                  }
                }}
              >
                Withdraw Application
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onClose}>
              Close Dossier
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
