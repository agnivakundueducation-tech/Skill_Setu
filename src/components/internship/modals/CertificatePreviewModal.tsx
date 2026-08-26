import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { InternshipRecord } from '../../../types/internship';
import {
  Award,
  CheckCircle2,
  ShieldCheck,
  Download,
  Printer,
  Share2,
  Copy,
  ExternalLink,
  QrCode,
  Building,
  Check
} from 'lucide-react';

interface CertificatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  internship: InternshipRecord;
}

export const CertificatePreviewModal: React.FC<CertificatePreviewModalProps> = ({
  isOpen,
  onClose,
  internship
}) => {
  const [copied, setCopied] = useState(false);
  const completion = internship.completionRecord;

  if (!completion) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(completion.verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Verified Internship Credential"
      description="National SkillSetu Cryptographically Signed Verification Certificate"
      size="xl"
    >
      <div className="space-y-4 pt-1">
        {/* Printable Official Certificate Container */}
        <div
          id="official-internship-certificate"
          className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white border-4 border-amber-500/30 shadow-2xl overflow-hidden"
        >
          {/* Subtle Background Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
            <ShieldCheck className="w-96 h-96 text-white" />
          </div>

          {/* Top Header */}
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center font-black text-xl text-white shadow-lg">
                SS
              </div>
              <div>
                <div className="text-xs font-mono tracking-widest text-amber-400 uppercase">
                  SkillSetu AI National Credential Registry
                </div>
                <div className="text-lg font-bold text-white tracking-tight">
                  Certificate of Internship Excellence
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                VERIFIED CREDENTIAL
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">
                ID: {completion.certificateId}
              </div>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="text-center space-y-4 my-6">
            <p className="text-xs tracking-wider text-slate-300 uppercase font-medium">
              This is proudly presented to
            </p>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-100 tracking-tight">
              {internship.studentName}
            </h2>
            <p className="text-xs text-slate-300">
              of <span className="font-semibold text-slate-100">{internship.studentInstitution}</span> ({internship.studentDegree})
            </p>

            <div className="max-w-xl mx-auto text-xs text-slate-300 leading-relaxed py-2">
              for successfully completing a comprehensive engineering internship as{' '}
              <span className="font-bold text-amber-300">{internship.roleTitle}</span> at{' '}
              <span className="font-bold text-white">{internship.companyName}</span> from{' '}
              <span className="font-mono text-slate-200">{internship.startDate}</span> to{' '}
              <span className="font-mono text-slate-200">{internship.endDate}</span> with{' '}
              <span className="font-bold text-amber-400">{completion.honorsTag || 'Distinction'}</span>.
            </div>

            {/* Endorsed Skills */}
            {completion.skillsEndorsed && completion.skillsEndorsed.length > 0 && (
              <div className="pt-2">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-mono mb-2">
                  Verified Competencies & Industry Endorsements
                </div>
                <div className="flex flex-wrap justify-center gap-1.5 max-w-lg mx-auto">
                  {completion.skillsEndorsed.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800/80 text-amber-200 border border-slate-700/80"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Signatories & Verification Hash Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-700/60 items-end">
            <div>
              <div className="font-serif italic text-amber-200 text-sm">{completion.signatoryName}</div>
              <div className="text-[11px] text-slate-400">{completion.signatoryTitle}</div>
              <div className="text-[10px] text-slate-500 font-mono">{internship.companyName}</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-xl bg-white/10 p-2 border border-slate-700 flex items-center justify-center mb-1">
                <QrCode className="w-12 h-12 text-slate-200" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Scan for Instant Ledger Verification</div>
            </div>

            <div className="sm:text-right">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Cryptographic Hash</div>
              <div className="text-xs font-mono font-bold text-emerald-400 break-all">
                {completion.verificationHash}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Issued: {completion.issueDate}</div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={copied ? Check : Copy}
              onClick={handleCopyLink}
              className="text-xs"
            >
              {copied ? 'Verification Link Copied!' : 'Copy Verification Link'}
            </Button>
            <a
              href={completion.verificationUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium px-2 py-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Public Ledger View
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" leftIcon={Printer} onClick={handlePrint} className="text-xs">
              Print Certificate
            </Button>
            <Button variant="primary" size="sm" leftIcon={Download} onClick={handlePrint} className="text-xs">
              Download PDF Credential
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
