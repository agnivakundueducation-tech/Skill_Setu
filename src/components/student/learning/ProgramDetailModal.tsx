import React from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import {
  LearningProgram,
  ProgramMatchExplanation,
  StudentProgramEnrollment
} from '../../../types/learningProgram';
import {
  GraduationCap,
  Sparkles,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  UserCheck,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface ProgramDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: LearningProgram | null;
  matchExplanation?: ProgramMatchExplanation | null;
  isEnrolled: boolean;
  enrollment?: StudentProgramEnrollment | null;
  onEnroll: (program: LearningProgram) => Promise<void>;
  isEnrolling?: boolean;
}

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  isOpen,
  onClose,
  program,
  matchExplanation,
  isEnrolled,
  enrollment,
  onEnroll,
  isEnrolling = false
}) => {
  if (!program) return null;

  const isCapacityFull = program.capacity > 0 && program.enrolledCount >= program.capacity;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={program.title} size="xl">
      <div className="space-y-5 p-1 max-h-[75vh] overflow-y-auto pr-2">
        {/* Top Header Card */}
        <div className="p-4 rounded-2xl bg-linear-to-r from-slate-50 to-indigo-50/50 dark:from-slate-800/80 dark:to-indigo-950/40 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {program.organizationLogo ? (
              <img
                src={program.organizationLogo}
                alt={program.organizationName}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="primary" size="sm">
                  {program.programType}
                </Badge>
                <Badge variant="secondary" size="sm">
                  {program.deliveryMode}
                </Badge>
                <Badge variant="default" size="sm">
                  {program.difficultyLevel}
                </Badge>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {program.organizationName}
              </h3>
              <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                {program.domain}
              </div>
            </div>
          </div>

          <div className="text-right flex flex-col sm:items-end gap-1">
            <span className="text-xs font-semibold text-slate-500">Cohort Seats</span>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {program.enrolledCount} / {program.capacity} Enrolled
            </div>
            {isCapacityFull && (
              <span className="text-[11px] font-bold text-rose-500">Cohort Full</span>
            )}
          </div>
        </div>

        {/* Skill Gap Recommendation Banner (Deterministic) */}
        {matchExplanation && matchExplanation.isRecommendedForSkillGap && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <span>Recommended for your skill gap</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] bg-amber-200/60 dark:bg-amber-900 text-amber-800 dark:text-amber-200 font-black">
                  {matchExplanation.matchScore}% Compatibility
                </span>
              </div>
              <p className="text-amber-800 dark:text-amber-300/90 leading-relaxed">
                {matchExplanation.explanation}
              </p>
            </div>
          </div>
        )}

        {/* Overview Description */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            About This Learning Track
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {program.description}
          </p>
          {program.stipendOrGrant && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Program Grant / Benefit: {program.stipendOrGrant}</span>
            </div>
          )}
        </div>

        {/* Key Metrics Logistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-400">Duration</span>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">
              {program.duration}
            </div>
          </div>
          <div>
            <span className="text-slate-400">Timeline</span>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">
              {program.startDate} to {program.endDate}
            </div>
          </div>
          <div>
            <span className="text-slate-400">Curriculum</span>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">
              {program.modules?.length || 0} Modules
            </div>
          </div>
          <div>
            <span className="text-slate-400">Credential</span>
            <div className="font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {program.certificationInfo?.isOffered ? 'Enterprise Cert' : 'Participation Record'}
            </div>
          </div>
        </div>

        {/* Target Skills & Prerequisites */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Target Skills You Will Acquire</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {program.targetSkills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Prerequisites & Background</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {program.prerequisiteSkills && program.prerequisiteSkills.length > 0 ? (
                program.prerequisiteSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">No prerequisites required. Open to all students.</span>
              )}
            </div>
          </div>
        </div>

        {/* Modules Syllabus */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Curriculum Syllabus & Milestones ({program.modules?.length || 0})</span>
          </div>

          <div className="space-y-2">
            {program.modules &&
              program.modules.map((mod, index) => (
                <div
                  key={mod.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {mod.title}
                      </span>
                      {mod.duration && (
                        <span className="text-[10px] text-slate-400 font-medium">({mod.duration})</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {mod.description}
                    </p>
                    {mod.deliverable && (
                      <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Deliverable: {mod.deliverable}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Industry Mentor Lead */}
        {program.mentorInfo && (
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
            <img
              src={
                program.mentorInfo.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
              }
              alt={program.mentorInfo.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Industry Mentor: {program.mentorInfo.name}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {program.mentorInfo.title} • {program.mentorInfo.company || program.organizationName}
              </div>
              {program.mentorInfo.bio && (
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                  {program.mentorInfo.bio}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Footer Enrollment Action */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isEnrolling}>
            Close
          </Button>

          {isEnrolled ? (
            <div className="flex items-center gap-2">
              <Badge variant="success" size="md">
                Enrolled ({enrollment?.progressPercentage || 0}% Progress)
              </Badge>
              <Button variant="secondary" size="sm" onClick={onClose}>
                View in My Programs
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              disabled={isCapacityFull || isEnrolling}
              onClick={() => onEnroll(program)}
              leftIcon={GraduationCap}
            >
              {isEnrolling ? 'Enrolling...' : isCapacityFull ? 'Capacity Full' : 'Enroll in Program'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
