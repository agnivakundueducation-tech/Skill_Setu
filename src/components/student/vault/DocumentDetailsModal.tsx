import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import {
  VaultDocument,
  DocumentCategory
} from '../../../types/document';
import {
  FileText,
  Award,
  FileCheck,
  BookOpen,
  FolderArchive,
  Sparkles,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Download,
  ExternalLink,
  Trash2,
  Copy,
  Check,
  Building2,
  Calendar,
  Lock,
  QrCode,
  Tag
} from 'lucide-react';

interface DocumentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: VaultDocument | null;
  onDeleteRequest?: (doc: VaultDocument) => void;
}

const CATEGORY_ICONS: Record<DocumentCategory, React.ComponentType<{ className?: string }>> = {
  'Resume': FileText,
  'Certificates': Award,
  'Internship Reports': FileCheck,
  'Academic Records': BookOpen,
  'Project Evidence': Sparkles,
  'Other Supporting Documents': FolderArchive
};

export const DocumentDetailsModal: React.FC<DocumentDetailsModalProps> = ({
  isOpen,
  onClose,
  document: doc,
  onDeleteRequest
}) => {
  const [copiedHash, setCopiedHash] = useState(false);

  if (!doc) return null;

  const CategoryIcon = CATEGORY_ICONS[doc.category] || FileText;

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const formatDate = (isoString: string): string => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const getVerificationStatusBadge = () => {
    switch (doc.verificationStatus) {
      case 'Verified':
        return (
          <Badge variant="success" size="sm" className="flex items-center gap-1 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Credential
          </Badge>
        );
      case 'Pending Verification':
        return (
          <Badge variant="warning" size="sm" className="flex items-center gap-1 font-bold">
            <Clock className="w-3.5 h-3.5" />
            Pending Verification
          </Badge>
        );
      case 'Rejected':
        return (
          <Badge variant="danger" size="sm" className="flex items-center gap-1 font-bold">
            <XCircle className="w-3.5 h-3.5" />
            Verification Declined
          </Badge>
        );
      case 'Unverified':
      default:
        return (
          <Badge variant="secondary" size="sm" className="flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Unverified Document
          </Badge>
        );
    }
  };

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleOpenDocument = () => {
    if (doc.downloadUrl) {
      window.open(doc.downloadUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Secure Vault Document Details"
      description="Cryptographic provenance and context evidence record"
      size="lg"
    >
      <div className="space-y-5 pt-2">
        {/* Document Header Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <CategoryIcon className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                {doc.fileName}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{doc.category}</span>
                <span>•</span>
                <span className="font-mono">{formatFileSize(doc.fileSize)}</span>
                <span>•</span>
                <span>{doc.fileType}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            {getVerificationStatusBadge()}
          </div>
        </div>

        {/* Core Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">
              Uploaded At
            </span>
            <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDate(doc.uploadedAt)}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">
              Origin & Source
            </span>
            <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-medium">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{doc.source}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">
              Document ID
            </span>
            <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-mono text-[11px]">
              <span className="truncate">{doc.id}</span>
              <button
                onClick={() => handleCopyHash(doc.id)}
                className="text-slate-400 hover:text-indigo-600 p-1"
                title="Copy Document ID"
              >
                {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">
              Storage Reference Path
            </span>
            <div className="text-slate-700 dark:text-slate-300 font-mono text-[11px] truncate" title={doc.storagePath}>
              {doc.storagePath}
            </div>
          </div>
        </div>

        {/* Associated Context Details if available */}
        {doc.relatedContext && (
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Linked Workflow Context
              </span>
              <Badge variant="primary" size="sm" className="capitalize">
                {doc.relatedContext.type.replace('_', ' ')}
              </Badge>
            </div>

            <div className="space-y-1 text-xs">
              {doc.relatedContext.title && (
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {doc.relatedContext.title}
                </div>
              )}
              {doc.relatedContext.organization && (
                <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Organization: <span className="font-semibold text-slate-800 dark:text-slate-200">{doc.relatedContext.organization}</span>
                </div>
              )}
              {doc.relatedContext.gradeOrScore && (
                <div className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                  Evaluation: <span className="font-bold">{doc.relatedContext.gradeOrScore}</span>
                </div>
              )}
            </div>

            {/* Cryptographic hash if available */}
            {doc.relatedContext.verificationHash && (
              <div className="mt-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 truncate">
                  <Lock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="text-slate-500 shrink-0">Hash:</span>
                  <span className="font-bold text-indigo-700 dark:text-indigo-300 truncate">
                    {doc.relatedContext.verificationHash}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyHash(doc.relatedContext!.verificationHash!)}
                  className="text-slate-400 hover:text-indigo-600 p-1 shrink-0"
                  title="Copy verification hash"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Verification Record Details */}
        {doc.verificationStatus === 'Verified' && (
          <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1.5 text-xs text-emerald-900 dark:text-emerald-200">
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Verified by {doc.verifiedBy || 'SkillSetu National Credential Registry'}
              </span>
              {doc.verifiedAt && <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">{formatDate(doc.verifiedAt)}</span>}
            </div>
            {doc.verificationNotes && (
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300/90 leading-relaxed">
                {doc.verificationNotes}
              </p>
            )}
          </div>
        )}

        {/* Tags */}
        {doc.tags && doc.tags.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Document Tags
            </span>
            <div className="flex flex-wrap gap-1.5">
              {doc.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1"
                >
                  <Tag className="w-3 h-3 text-slate-400" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div>
            {onDeleteRequest && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteRequest(doc)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 border-red-200 dark:border-red-900/50 flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Delete Document
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
            {doc.downloadUrl && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenDocument}
                className="flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Open / Download
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
