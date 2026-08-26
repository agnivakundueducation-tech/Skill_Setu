/**
 * Secure Document Vault & Evidence Management Types (SIH PS 26044)
 */

export type DocumentCategory =
  | 'Resume'
  | 'Certificates'
  | 'Internship Reports'
  | 'Academic Records'
  | 'Project Evidence'
  | 'Other Supporting Documents';

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  'Resume',
  'Certificates',
  'Internship Reports',
  'Academic Records',
  'Project Evidence',
  'Other Supporting Documents'
];

export type DocumentVerificationStatus =
  | 'Unverified'
  | 'Pending Verification'
  | 'Verified'
  | 'Rejected';

export type DocumentSource =
  | 'Student Upload'
  | 'Internship Lifecycle'
  | 'Industry Learning'
  | 'Institutional Record'
  | 'Career Passport'
  | 'External Import';

export type DocumentContextType =
  | 'internship'
  | 'learning_program'
  | 'application'
  | 'opportunity'
  | 'project'
  | 'academic'
  | 'portfolio'
  | 'resume'
  | 'general';

export interface DocumentRelatedContext {
  type: DocumentContextType;
  id?: string;
  title?: string;
  organization?: string;
  verificationHash?: string;
  gradeOrScore?: string;
  skillsEndorsed?: string[];
}

export interface VaultDocument {
  id: string;
  ownerId: string;
  ownerName?: string;
  ownerEmail?: string;
  category: DocumentCategory;
  fileName: string;
  fileType: string;
  fileSize: number; // in bytes
  storagePath: string;
  downloadUrl?: string;
  uploadedAt: string;
  updatedAt?: string;
  verificationStatus: DocumentVerificationStatus;
  source: DocumentSource;
  relatedContext?: DocumentRelatedContext;
  verifiedAt?: string;
  verifiedBy?: string;
  verificationNotes?: string;
  tags?: string[];
  isArchived?: boolean;
  metadata?: Record<string, any>;
}

export interface DocumentUploadParams {
  file: File;
  ownerId: string;
  ownerName?: string;
  ownerEmail?: string;
  category: DocumentCategory;
  source?: DocumentSource;
  relatedContext?: DocumentRelatedContext;
  tags?: string[];
  verificationStatus?: DocumentVerificationStatus;
  isDemo?: boolean;
  onProgress?: (percent: number) => void;
}

export interface DocumentFilterOptions {
  category?: DocumentCategory | 'All';
  verificationStatus?: DocumentVerificationStatus | 'All';
  searchQuery?: string;
  contextType?: DocumentContextType | 'All';
  sortBy?: 'uploadedAt' | 'fileName' | 'fileSize';
  sortDirection?: 'asc' | 'desc';
}

export interface DocumentValidationResult {
  isValid: boolean;
  error?: string;
  detectedType?: string;
}
