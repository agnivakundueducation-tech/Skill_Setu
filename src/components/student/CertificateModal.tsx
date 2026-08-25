import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Certification } from '../../types/student';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Download,
  Copy,
  ExternalLink,
  Sparkles,
  QrCode
} from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certification | null;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  certificate
}) => {
  if (!certificate) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(certificate.credentialId);
    alert('Credential ID copied to clipboard!');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verified Micro-Credential Passport"
      description="Cryptographically signed certificate minted via SkillSetu AI Verification Engine."
      size="lg"
    >
      <div className="space-y-6">
        {/* Certificate Canvas Mock */}
        <div className="p-6 sm:p-8 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 bg-gradient-to-b from-white via-indigo-50/20 to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900 relative shadow-inner text-center space-y-4">
          {/* Header Seal */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <img
                src={certificate.issuerLogo}
                alt={certificate.issuer}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{certificate.issuer}</div>
                <div className="text-[10px] text-slate-400">Accredited Academic & Industry Partner</div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Certificate
            </div>
          </div>

          <div className="py-2 space-y-1">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
              This certifies that
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Aarav Sharma
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              has successfully demonstrated high-proficiency mastery and met all evaluation criteria for
            </p>
            <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 pt-1">
              {certificate.title}
            </h3>
            {certificate.gradeScore && (
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Graduated with {certificate.gradeScore}
              </p>
            )}
          </div>

          {/* Validated Skills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
            {certificate.skills.map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Footer credentials */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <div className="text-left font-mono text-[10px]">
              <div>Credential ID: {certificate.credentialId}</div>
              <div>Issue Date: {certificate.issueDate} ({certificate.expiryDate || 'No Expiration'})</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500">SkillSetu AI Verified ID</span>
            </div>
          </div>
        </div>

        {/* Blockchain proof details */}
        {certificate.blockchainHash && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between gap-3">
            <div className="truncate">
              <span className="text-slate-400 font-medium">On-chain Verification Hash: </span>
              <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">
                {certificate.blockchainHash}
              </span>
            </div>
            <button
              onClick={handleCopyId}
              className="p-1 text-slate-400 hover:text-indigo-600 shrink-0"
              title="Copy Credential ID"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="sm" leftIcon={Share2} onClick={() => alert('Shareable link copied!')}>
            Share to LinkedIn
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={Download}
              onClick={() => alert('Downloading official PDF certificate...')}
            >
              Download PDF
            </Button>
            <Button variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
