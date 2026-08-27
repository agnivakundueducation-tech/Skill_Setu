import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { StudentProgramEnrollment } from '../../../types/learningProgram';
import { Award, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';

interface IssueProgramCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrollment: StudentProgramEnrollment | null;
  onIssueCertificate: (enrollmentId: string, params: {
    signatoryName: string;
    signatoryTitle: string;
    achievedSkills: string[];
    gradeOrDistinction: 'Distinction' | 'Merit' | 'Passed';
  }) => Promise<boolean>;
  defaultSignatoryName?: string;
  defaultSignatoryTitle?: string;
}

export const IssueProgramCertificateModal: React.FC<IssueProgramCertificateModalProps> = ({
  isOpen,
  onClose,
  enrollment,
  onIssueCertificate,
  defaultSignatoryName = 'Dr. Vikramaditya Sen',
  defaultSignatoryTitle = 'VP of Engineering & Chief Architect'
}) => {
  const [signatoryName, setSignatoryName] = useState(defaultSignatoryName);
  const [signatoryTitle, setSignatoryTitle] = useState(defaultSignatoryTitle);
  const [gradeOrDistinction, setGradeOrDistinction] = useState<'Distinction' | 'Merit' | 'Passed'>('Distinction');
  const [skillInput, setSkillInput] = useState('');
  const [achievedSkills, setAchievedSkills] = useState<string[]>(
    enrollment?.targetSkills || ['Distributed Systems', 'Apache Kafka', 'gRPC & Protocol Buffers']
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!enrollment) return null;

  const handleAddSkill = () => {
    if (skillInput.trim() && !achievedSkills.includes(skillInput.trim())) {
      setAchievedSkills([...achievedSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setAchievedSkills(achievedSkills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signatoryName.trim()) return;

    setIsSubmitting(true);
    try {
      const ok = await onIssueCertificate(enrollment.id, {
        signatoryName: signatoryName.trim(),
        signatoryTitle: signatoryTitle.trim(),
        achievedSkills,
        gradeOrDistinction
      });
      if (ok) onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Issue Verified Credential: ${enrollment.studentName}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-1">
        <div className="p-3.5 rounded-2xl bg-linear-to-r from-amber-50 to-indigo-50 dark:from-amber-950/30 dark:to-indigo-950/30 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              Official Enterprise Certificate Issuance
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
              This credential will be cryptographically anchored to the student's Career Passport as verified evidence.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Authorized Signatory Name *
            </label>
            <input
              type="text"
              value={signatoryName}
              onChange={(e) => setSignatoryName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Signatory Title / Designation
            </label>
            <input
              type="text"
              value={signatoryTitle}
              onChange={(e) => setSignatoryTitle(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Honors / Distinction Tier
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Distinction', 'Merit', 'Passed'] as const).map((tier) => (
              <button
                type="button"
                key={tier}
                onClick={() => setGradeOrDistinction(tier)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  gradeOrDistinction === tier
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Endorsed & Certified Competencies
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add additional skill..."
              className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
            <Button type="button" size="sm" variant="secondary" onClick={handleAddSkill} className="text-xs">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {achievedSkills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              >
                <CheckCircle2 className="w-3 h-3" />
                {s}
                <button type="button" onClick={() => handleRemoveSkill(s)} className="hover:text-rose-500 ml-1">
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={isSubmitting} leftIcon={ShieldCheck}>
            {isSubmitting ? 'Signing & Minting...' : 'Sign & Issue Certificate'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
