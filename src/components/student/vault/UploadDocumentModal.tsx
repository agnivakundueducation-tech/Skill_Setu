import React, { useState, useRef } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import {
  DocumentCategory,
  DOCUMENT_CATEGORIES,
  DocumentUploadParams,
  VaultDocument
} from '../../../types/document';
import { documentService } from '../../../services/documentService';
import { storageService, MAX_DOCUMENT_FILE_SIZE_BYTES } from '../../../services/storageService';
import { useAuth } from '../../../context/AuthContext';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
  FileCheck,
  ShieldCheck,
  Award,
  BookOpen,
  FolderArchive,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newDoc: VaultDocument) => void;
  defaultCategory?: DocumentCategory;
}

const CATEGORY_ICONS: Record<DocumentCategory, React.ComponentType<{ className?: string }>> = {
  'Resume': FileText,
  'Certificates': Award,
  'Internship Reports': FileCheck,
  'Academic Records': BookOpen,
  'Project Evidence': Sparkles,
  'Other Supporting Documents': FolderArchive
};

const CATEGORY_DESCRIPTIONS: Record<DocumentCategory, string> = {
  'Resume': 'Master resume, role-tailored CVs, or verified Career Passport exports',
  'Certificates': 'Accredited certificates, micro-credentials, and industry qualifications',
  'Internship Reports': 'Capstone project reports, weekly milestone archives, and completion theses',
  'Academic Records': 'University transcripts, semester marksheets, and degree certificates',
  'Project Evidence': 'Technical whitepapers, architecture designs, and benchmark reports',
  'Other Supporting Documents': 'Letters of recommendation, hackathon awards, and extracurricular records'
};

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultCategory = 'Resume'
}) => {
  const { user, appUser, isAuthenticated, isDemo } = useAuth();
  const [category, setCategory] = useState<DocumentCategory>(defaultCategory);
  const [file, setFile] = useState<File | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [contextTitle, setContextTitle] = useState('');
  const [contextOrg, setContextOrg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isStorageLive = storageService.isLiveStorageAvailable();
  const isDemoActive = isDemo || !isAuthenticated;

  const validateFile = (selectedFile: File): boolean => {
    setErrorMessage(null);
    if (!selectedFile) return false;

    // Check size limit
    if (selectedFile.size > MAX_DOCUMENT_FILE_SIZE_BYTES) {
      setErrorMessage(`File size (${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 15 MB limit.`);
      return false;
    }

    if (selectedFile.size === 0) {
      setErrorMessage('The selected file is empty (0 bytes).');
      return false;
    }

    // Supported formats
    const validExtensions = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.webp'];
    const lowerName = selectedFile.name.toLowerCase();
    const hasValidExt = validExtensions.some((ext) => lowerName.endsWith(ext));

    if (!hasValidExt) {
      setErrorMessage('Unsupported file format. Please upload a PDF, DOCX, TXT, or Image (JPG/PNG).');
      return false;
    }

    return true;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      if (validateFile(selected)) {
        setFile(selected);
      }
    }
  };

  const handleResetForm = () => {
    setFile(null);
    setTagsInput('');
    setContextTitle('');
    setContextOrg('');
    setUploadProgress(0);
    setErrorMessage(null);
    setIsUploading(false);
  };

  const handleClose = () => {
    handleResetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    setUploadProgress(10);

    const ownerId = (isAuthenticated && !isDemo && appUser?.uid) ? appUser.uid : (user?.id || 'demo-student-id');
    const ownerName = appUser?.displayName || user?.name || 'Aarav Sharma';
    const ownerEmail = appUser?.email || user?.email || 'aarav.sharma@skillsetu.demo';

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const uploadParams: DocumentUploadParams = {
      file,
      ownerId,
      ownerName,
      ownerEmail,
      category,
      source: 'Student Upload',
      tags,
      verificationStatus: 'Pending Verification',
      isDemo: isDemoActive,
      onProgress: (p) => setUploadProgress(p)
    };

    if (contextTitle.trim()) {
      uploadParams.relatedContext = {
        type: category === 'Internship Reports' ? 'internship' : category === 'Certificates' ? 'learning_program' : 'general',
        title: contextTitle.trim(),
        organization: contextOrg.trim() || undefined
      };
    }

    try {
      const res = await documentService.uploadDocument(uploadParams);

      if (res.success && res.data) {
        onSuccess(res.data);
        handleClose();
      } else {
        setErrorMessage(res.error || 'Failed to upload document.');
      }
    } catch (err: any) {
      console.error('[UploadDocumentModal] Error:', err);
      setErrorMessage(err?.message || 'Unexpected upload error.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Upload Secure Document to Vault"
      description="Add verified credentials, transcripts, capstone reports, or master resumes."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Storage availability info */}
        {!isStorageLive && !isDemoActive && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <span className="font-bold">Document storage unavailable</span>
              <p className="mt-0.5 text-[11px] text-amber-700 dark:text-amber-400">
                Live Firebase Storage bucket is not configured. Uploading requires active storage configuration.
              </p>
            </div>
          </div>
        )}

        {isDemoActive && (
          <div className="p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/60 text-xs text-indigo-800 dark:text-indigo-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-[11px] font-medium">Demo Mode: Uploads are sandbox-isolated and never leak to live storage.</span>
            </div>
            <Badge variant="primary" size="sm">Isolated Sandbox</Badge>
          </div>
        )}

        {/* Category Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Document Category <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DOCUMENT_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat];
              const isSelected = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <div className="min-w-0">
                    <span className="text-xs font-bold block truncate">{cat}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-400 shrink-0" />
            {CATEGORY_DESCRIPTIONS[category]}
          </p>
        </div>

        {/* File Dropzone */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Select Document File <span className="text-red-500">*</span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.webp"
            className="hidden"
          />

          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/60 scale-[0.99]'
                  : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-900/50'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Click to browse or drag & drop file here
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Supported: PDF, DOCX, TXT, JPG, PNG (Max 15 MB)
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type || 'Document'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                title="Remove selected file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Optional Context Linking */}
        <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Context Linking (Optional)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Associated Course / Project / Internship
              </label>
              <input
                type="text"
                value={contextTitle}
                onChange={(e) => setContextTitle(e.target.value)}
                placeholder="e.g. Distributed Systems Capstone"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Issuing Organization / Institution
              </label>
              <input
                type="text"
                value={contextOrg}
                onChange={(e) => setContextOrg(e.target.value)}
                placeholder="e.g. Apex Cloud Systems / NIT"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Verified, Full-Stack, Capstone"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Progress bar if uploading */}
        {isUploading && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span>Encrypting & uploading document...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!file || isUploading || (!isStorageLive && !isDemoActive)}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>Upload to Vault</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
