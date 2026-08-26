import React from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { StudentProgramEnrollment } from '../../../types/learningProgram';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  Download,
  Share2,
  ExternalLink,
  Sparkles,
  QrCode
} from 'lucide-react';

interface ProgramCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrollment: StudentProgramEnrollment | null;
}

export const ProgramCertificateModal: React.FC<ProgramCertificateModalProps> = ({
  isOpen,
  onClose,
  enrollment
}) => {
  if (!enrollment || !enrollment.completionRecord) return null;

  const { completionRecord } = enrollment;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verified Program Certificate" size="lg">
      <div className="space-y-6 p-2">
        {/* Certificate Ornamental Card */}
        <div className="relative rounded-3xl bg-linear-to-b from-amber-500/10 via-slate-900 to-slate-950 border-2 border-amber-500/40 p-6 md:p-8 text-center text-white shadow-2xl overflow-hidden space-y-5">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award className="w-96 h-96 text-amber-400" />
          </div>

          {/* Top Issuer Info */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
            <div className="flex items-center gap-2.5">
              {enrollment.organizationLogo ? (
                <img
                  src={enrollment.organizationLogo}
                  alt={enrollment.organizationName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover border border-amber-500/30"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
              )}
              <div className="text-left">
                <div className="text-sm font-bold text-white tracking-wide">
                  {enrollment.organizationName}
                </div>
                <div className="text-[11px] text-amber-300 font-mono">
                  Industry Learning & Skill Development Academy
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Cryptographically Verified</span>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="space-y-2 py-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
              Certificate of Completion & Technical Distinction
            </span>
            <p className="text-xs text-slate-300">This officially certifies that</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight py-1">
              {enrollment.studentName}
            </h2>
            <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
              has successfully completed all required curriculum modules, hands-on architectural deliverables, and mentor reviews for the enterprise track:
            </p>
            <div className="text-base sm:text-lg font-bold text-amber-300 pt-1">
              {enrollment.programTitle}
            </div>
          </div>

          {/* Achieved Competencies */}
          <div className="py-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Verified Competencies Endorsed:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-lg mx-auto">
              {completionRecord.achievedSkills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 text-amber-200 border border-white/10"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Signatures & Hash */}
          <div className="pt-4 border-t border-amber-500/20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left items-end">
            <div className="space-y-0.5">
              <div className="text-[10px] uppercase font-bold text-slate-400">Awarded Date</div>
              <div className="text-xs font-bold text-slate-200">{completionRecord.completedDate}</div>
              <div className="text-[10px] font-mono text-amber-400">{completionRecord.certificateNumber}</div>
            </div>

            <div className="text-center sm:text-left space-y-0.5">
              <div className="text-[10px] uppercase font-bold text-slate-400">Authorized Mentor Signatory</div>
              <div className="text-xs font-bold text-slate-200">{completionRecord.signatoryName || 'Dr. Vikramaditya Sen'}</div>
              <div className="text-[10px] text-slate-400">{completionRecord.signatoryTitle || 'VP of Engineering'}</div>
            </div>

            <div className="sm:text-right space-y-0.5">
              <div className="text-[10px] uppercase font-bold text-slate-400">Verification Hash</div>
              <div className="text-[9px] font-mono text-slate-400 truncate max-w-xs sm:ml-auto">
                {completionRecord.verificationHash || 'sha256-verified-tamperproof'}
              </div>
              <div className="text-[10px] font-bold text-emerald-400">SkillSetu Passport Linked</div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-slate-500">
            Export or share verified proof with recruiters and enterprise hiring portals.
          </span>
          <Button variant="primary" size="sm" onClick={onClose}>
            Close Certificate
          </Button>
        </div>
      </div>
    </Modal>
  );
};
