import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Card } from '../../ui/Card';
import {
  LearningProgram,
  StudentProgramEnrollment
} from '../../../types/learningProgram';
import {
  Users,
  CheckCircle2,
  Clock,
  Award,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Star,
  ExternalLink,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface ProgramParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: LearningProgram | null;
  enrollments: StudentProgramEnrollment[];
  onOpenFeedback: (enrollment: StudentProgramEnrollment) => void;
  onOpenCertificate: (enrollment: StudentProgramEnrollment) => void;
  onToggleModule: (enrollmentId: string, moduleId: string) => Promise<void>;
}

export const ProgramParticipantsModal: React.FC<ProgramParticipantsModalProps> = ({
  isOpen,
  onClose,
  program,
  enrollments,
  onOpenFeedback,
  onOpenCertificate,
  onToggleModule
}) => {
  const [selectedStudent, setSelectedStudent] = useState<StudentProgramEnrollment | null>(
    enrollments[0] || null
  );

  if (!program) return null;

  const currentStudent = selectedStudent || enrollments[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Roster & Progress: ${program.title}`}
      size="xl"
    >
      <div className="space-y-4 p-1">
        {/* Header Summary */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="sm">
              {program.programType}
            </Badge>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {program.domain}
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 font-semibold">
            <span>
              Enrolled: <strong className="text-slate-900 dark:text-white">{enrollments.length}</strong> / {program.capacity}
            </span>
            <span>
              Completed: <strong className="text-emerald-600">{enrollments.filter((e) => e.status === 'Completed').length}</strong>
            </span>
          </div>
        </div>

        {enrollments.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No students enrolled yet
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Students will appear here as soon as they discover and enroll in this program.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left: Participant Roster List */}
            <div className="md:col-span-5 space-y-2 max-h-[55vh] overflow-y-auto pr-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                Enrolled Students ({enrollments.length})
              </div>
              {enrollments.map((enr) => {
                const isSelected = currentStudent?.id === enr.id;
                return (
                  <button
                    key={enr.id}
                    onClick={() => setSelectedStudent(enr)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-700 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={enr.studentAvatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80'}
                        alt={enr.studentName}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {enr.studentName}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {enr.institutionName || 'NIT'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <Badge
                        variant={enr.status === 'Completed' ? 'success' : enr.progressPercentage > 0 ? 'primary' : 'secondary'}
                        size="sm"
                        className="text-[10px]"
                      >
                        {enr.progressPercentage}%
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: Detailed Participant Progression & Mentorship Controls */}
            {currentStudent && (
              <div className="md:col-span-7 space-y-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 max-h-[55vh] overflow-y-auto">
                {/* Student header info */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentStudent.studentAvatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80'}
                      alt={currentStudent.studentName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {currentStudent.studentName}
                      </h4>
                      <p className="text-xs text-slate-500">{currentStudent.studentEmail}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>Enrolled: {currentStudent.enrollmentDate}</span>
                        <span>•</span>
                        <span>Status: <strong className="text-slate-700 dark:text-slate-300">{currentStudent.status}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <div className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                      {currentStudent.progressPercentage}%
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {currentStudent.completedModuleIds.length}/{program.modules.length} Modules
                    </span>
                  </div>
                </div>

                {/* Module checklist */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Curriculum Deliverables</span>
                    <span className="text-[10px] font-normal">Click checkmark to toggle student module completion</span>
                  </div>

                  <div className="space-y-1.5">
                    {program.modules.map((mod) => {
                      const isCompleted = currentStudent.completedModuleIds.includes(mod.id);
                      return (
                        <div
                          key={mod.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                            isCompleted
                              ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800'
                          }`}
                        >
                          <div className="space-y-0.5 min-w-0">
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                              <span>{mod.title}</span>
                              {mod.duration && (
                                <span className="text-[10px] text-slate-400 font-normal">({mod.duration})</span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 line-clamp-1">{mod.description}</div>
                          </div>

                          <button
                            onClick={() => onToggleModule(currentStudent.id, mod.id)}
                            className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition-colors ${
                              isCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300'
                            }`}
                            title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isCompleted ? 'Done' : 'Mark'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mentor Feedback Status */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Industry Mentorship Appraisal</span>
                    </div>

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onOpenFeedback(currentStudent)}
                      className="text-xs h-7 px-2.5"
                    >
                      {currentStudent.mentorFeedback ? 'Update Appraisal' : 'Add Mentor Feedback'}
                    </Button>
                  </div>

                  {currentStudent.mentorFeedback ? (
                    <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                        <span>Mentor: {currentStudent.mentorFeedback.mentorName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          {currentStudent.mentorFeedback.technicalRating}/5 Technical
                        </span>
                      </div>
                      <p className="italic bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px]">
                        "{currentStudent.mentorFeedback.feedbackText}"
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      Mentor feedback pending
                    </p>
                  )}
                </div>

                {/* Certification / Completion Status */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>Verifiable Credential & Passport</span>
                    </div>

                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onOpenCertificate(currentStudent)}
                      disabled={currentStudent.status === 'Completed' && currentStudent.completionRecord?.certificateIssued}
                      className="text-xs h-7 px-2.5"
                    >
                      {currentStudent.completionRecord?.certificateIssued ? 'Certificate Issued' : 'Issue Certificate'}
                    </Button>
                  </div>

                  {currentStudent.completionRecord?.certificateIssued ? (
                    <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="font-bold">
                            Certificate issued ({currentStudent.completionRecord.gradeOrDistinction || 'Distinction'})
                          </div>
                          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                            {currentStudent.completionRecord.certificateNumber}
                          </div>
                        </div>
                      </div>
                      <Badge variant="success" size="sm">
                        Verified
                      </Badge>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      Certification pending (mark all modules and issue above)
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
