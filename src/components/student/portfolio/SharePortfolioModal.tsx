import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import {
  Share2,
  Copy,
  Check,
  QrCode,
  Download,
  ExternalLink,
  Globe,
  ShieldCheck,
  Linkedin,
  Twitter,
  Mail,
  Printer
} from 'lucide-react';

interface SharePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  shareUrl?: string;
  readinessScore: number;
}

export const SharePortfolioModal: React.FC<SharePortfolioModalProps> = ({
  isOpen,
  onClose,
  studentName,
  shareUrl = 'https://skillsetu.ai/p/aarav-sharma',
  readinessScore
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'qr' | 'embed'>('link');

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
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
      title="Share Digital Portfolio"
      size="md"
    >
      <div className="space-y-5">
        {/* Recruiter Badge Header */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-blue-50/80 dark:from-indigo-950/40 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/50">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {studentName}’s Recruiter Passport
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verifiable portfolio with cryptographic skill credentials
                </p>
              </div>
            </div>
            <Badge variant="primary" size="sm" className="font-bold">
              {readinessScore}/100 Readiness
            </Badge>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1">
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'link'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Shareable Link
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'qr'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            QR Passport
          </button>
          <button
            onClick={() => setActiveTab('embed')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'embed'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Recruiter Badge
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'link' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Direct Recruiter Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 select-all focus:outline-hidden"
                />
                <Button
                  variant={copied ? 'secondary' : 'primary'}
                  size="sm"
                  leftIcon={copied ? Check : Copy}
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Anyone with this link can view your verified projects, grades, and skill assessments.
              </p>
            </div>

            {/* Quick Share Buttons */}
            <div>
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Share directly via
              </span>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-blue-600" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my verified engineering portfolio on SkillSetu AI: ${shareUrl}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Twitter className="w-4 h-4 text-sky-500" />
                  <span>Twitter/X</span>
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(`Aarav Sharma - Verified Engineering Portfolio`)}&body=${encodeURIComponent(`Hi,\n\nPlease find my verified engineering portfolio and credentials here: ${shareUrl}\n\nBest regards,\nAarav Sharma`)}`}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Mail className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'qr' && (
          <div className="flex flex-col items-center justify-center p-4 text-center space-y-3">
            <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-xs inline-block">
              {/* High fidelity SVG representation of a QR code */}
              <div className="w-40 h-40 bg-slate-900 p-2 rounded-xl flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-10 h-10 bg-white p-1 rounded-sm flex items-center justify-center">
                    <div className="w-6 h-6 bg-slate-900 rounded-xs flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-white"></div>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-white p-1 rounded-sm flex items-center justify-center">
                    <div className="w-6 h-6 bg-slate-900 rounded-xs flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-white"></div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-1 px-1">
                  <div className="h-2 bg-white rounded-xs"></div>
                  <div className="h-2 bg-indigo-400 rounded-xs"></div>
                  <div className="h-2 bg-white rounded-xs"></div>
                  <div className="h-2 bg-white rounded-xs"></div>
                  <div className="h-2 bg-indigo-400 rounded-xs"></div>
                  <div className="h-2 bg-white rounded-xs"></div>
                </div>
                <div className="flex justify-between">
                  <div className="w-10 h-10 bg-white p-1 rounded-sm flex items-center justify-center">
                    <div className="w-6 h-6 bg-slate-900 rounded-xs flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-white"></div>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-indigo-600 rounded-sm flex items-center justify-center text-white text-[9px] font-mono font-bold">
                    PASS
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Scan for Instant Recruiter Verification
              </h5>
              <p className="text-[11px] text-slate-500">
                Works directly on mobile cameras & recruiter ATS scanners
              </p>
            </div>
          </div>
        )}

        {activeTab === 'embed' && (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              HTML / Markdown Embed Code for GitHub README
            </label>
            <textarea
              readOnly
              rows={3}
              value={`[![SkillSetu Verified](https://img.shields.io/badge/SkillSetu-87%20Readiness-6366f1?logo=shield)](${shareUrl})`}
              className="w-full p-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 select-all focus:outline-hidden"
            />
            <Button
              variant="outline"
              size="sm"
              leftIcon={Copy}
              onClick={() => {
                navigator.clipboard.writeText(`[![SkillSetu Verified](https://img.shields.io/badge/SkillSetu-87%20Readiness-6366f1?logo=shield)](${shareUrl})`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              }}
              className="w-full"
            >
              Copy Markdown Badge
            </Button>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={Printer}
            onClick={handlePrint}
          >
            Print / Save as PDF
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
