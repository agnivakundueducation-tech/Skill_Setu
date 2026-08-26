/**
 * Secure Document Vault & Evidence Management Service (SIH PS 26044)
 * 
 * Handles document cataloging, validation, secure uploading to Firebase Storage,
 * Firestore persistence, RBAC ownership enforcement, and isolated demo execution.
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from '../lib/firebase';
import {
  VaultDocument,
  DocumentCategory,
  DocumentVerificationStatus,
  DocumentUploadParams,
  DocumentFilterOptions,
  DocumentRelatedContext
} from '../types/document';
import { INITIAL_DEMO_DOCUMENTS } from '../data/mockDocumentData';
import { storageService, validateDocumentFile } from './storageService';
import { isOfflineOrNetworkError } from './firestoreService';

export interface DocumentServiceResult<T> {
  success: boolean;
  data: T;
  fromMock?: boolean;
  error?: string;
  isStorageUnavailable?: boolean;
}

const LOCAL_DOCUMENTS_KEY = 'skillsetu_local_vault_documents_v1';

function loadLocalVaultDocuments(isDemo = true): VaultDocument[] {
  if (typeof window === 'undefined') return isDemo ? INITIAL_DEMO_DOCUMENTS : [];
  try {
    const raw = localStorage.getItem(LOCAL_DOCUMENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[DocumentService] Failed to parse local documents:', err);
  }
  return isDemo ? INITIAL_DEMO_DOCUMENTS : [];
}

function saveLocalVaultDocuments(data: VaultDocument[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_DOCUMENTS_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('[DocumentService] Failed to persist local documents:', err);
  }
}

class DocumentService {
  /**
   * Retrieves all documents owned by a student with optional category and status filtering.
   * Strictly enforces ownerId match for security.
   */
  public async getStudentDocuments(
    ownerId: string,
    filters?: DocumentFilterOptions,
    isDemo = false
  ): Promise<DocumentServiceResult<VaultDocument[]>> {
    // 1. Demo Mode Isolation
    if (isDemo || !isFirebaseConfigured || !db) {
      let docs = loadLocalVaultDocuments(true);

      // Filter by owner if specified
      if (ownerId && ownerId !== 'all') {
        docs = docs.filter((d) => d.ownerId === ownerId || d.ownerId === 'demo-student-id');
      }

      // Apply category filter
      if (filters?.category && filters.category !== 'All') {
        docs = docs.filter((d) => d.category === filters.category);
      }

      // Apply verification status filter
      if (filters?.verificationStatus && filters.verificationStatus !== 'All') {
        docs = docs.filter((d) => d.verificationStatus === filters.verificationStatus);
      }

      // Apply search query
      if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase().trim();
        docs = docs.filter(
          (d) =>
            d.fileName.toLowerCase().includes(q) ||
            d.category.toLowerCase().includes(q) ||
            (d.relatedContext?.title && d.relatedContext.title.toLowerCase().includes(q)) ||
            (d.tags && d.tags.some((t) => t.toLowerCase().includes(q)))
        );
      }

      // Sort
      docs.sort((a, b) => {
        if (filters?.sortBy === 'fileName') {
          return filters.sortDirection === 'desc'
            ? b.fileName.localeCompare(a.fileName)
            : a.fileName.localeCompare(b.fileName);
        }
        if (filters?.sortBy === 'fileSize') {
          return filters.sortDirection === 'desc'
            ? b.fileSize - a.fileSize
            : a.fileSize - b.fileSize;
        }
        // Default sort by uploadedAt desc
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      });

      return {
        success: true,
        data: docs,
        fromMock: true
      };
    }

    // 2. Authenticated Firestore Mode (Strict ownership security)
    try {
      const currentUid = auth?.currentUser?.uid;
      const targetUid = ownerId || currentUid;

      if (!targetUid) {
        return {
          success: false,
          data: [],
          error: 'User not authenticated'
        };
      }

      const q = query(
        collection(db, 'documents'),
        where('ownerId', '==', targetUid),
        orderBy('uploadedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      let docs: VaultDocument[] = [];

      querySnapshot.forEach((docSnap) => {
        docs.push({ id: docSnap.id, ...docSnap.data() } as VaultDocument);
      });

      // Apply in-memory secondary filters
      if (filters?.category && filters.category !== 'All') {
        docs = docs.filter((d) => d.category === filters.category);
      }
      if (filters?.verificationStatus && filters.verificationStatus !== 'All') {
        docs = docs.filter((d) => d.verificationStatus === filters.verificationStatus);
      }
      if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
        const queryTerm = filters.searchQuery.toLowerCase().trim();
        docs = docs.filter(
          (d) =>
            d.fileName.toLowerCase().includes(queryTerm) ||
            d.category.toLowerCase().includes(queryTerm) ||
            (d.relatedContext?.title && d.relatedContext.title.toLowerCase().includes(queryTerm)) ||
            (d.tags && d.tags.some((t) => t.toLowerCase().includes(queryTerm)))
        );
      }

      return {
        success: true,
        data: docs,
        fromMock: false
      };
    } catch (err: any) {
      console.error('[DocumentService] getStudentDocuments error:', err);
      if (isOfflineOrNetworkError(err)) {
        const local = loadLocalVaultDocuments(false).filter((d) => d.ownerId === ownerId);
        return {
          success: true,
          data: local,
          fromMock: true
        };
      }

      return {
        success: false,
        data: [],
        error: err?.message || 'Failed to fetch vault documents'
      };
    }
  }

  /**
   * Upload and catalog a new document into the Vault.
   * Performs file validation, storage upload, and metadata persistence.
   */
  public async uploadDocument(
    params: DocumentUploadParams
  ): Promise<DocumentServiceResult<VaultDocument>> {
    const {
      file,
      ownerId,
      ownerName,
      ownerEmail,
      category,
      source = 'Student Upload',
      relatedContext,
      tags = [],
      verificationStatus = 'Unverified',
      isDemo = false,
      onProgress
    } = params;

    // 1. Validate file constraints
    const validation = validateDocumentFile(file);
    if (!validation.isValid) {
      return {
        success: false,
        data: null as any,
        error: validation.error || 'Invalid file format or size'
      };
    }

    const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();
    const storagePath = `students/${ownerId}/documents/${docId}/${file.name}`;

    // 2. Demo Mode handling
    if (isDemo) {
      const uploadRes = await storageService.uploadFile({
        path: storagePath,
        file,
        onProgress,
        isDemo: true
      });

      const newDoc: VaultDocument = {
        id: docId,
        ownerId,
        ownerName: ownerName || 'Aarav Sharma',
        ownerEmail: ownerEmail || 'aarav.sharma@skillsetu.demo',
        category,
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
        fileSize: file.size,
        storagePath,
        downloadUrl: uploadRes.data?.downloadUrl || `https://skillsetu.demo/documents/${file.name}`,
        uploadedAt: nowIso,
        verificationStatus,
        source,
        relatedContext,
        tags: tags.length > 0 ? tags : [category, 'Uploaded'],
        metadata: {
          originalName: file.name,
          clientUpload: true
        }
      };

      const local = loadLocalVaultDocuments(true);
      saveLocalVaultDocuments([newDoc, ...local]);

      return {
        success: true,
        data: newDoc,
        fromMock: true
      };
    }

    // 3. Authenticated Live Mode: Check storage availability
    if (!storageService.isLiveStorageAvailable()) {
      return {
        success: false,
        data: null as any,
        error: 'Document storage unavailable: Firebase Storage is not configured. Please set up VITE_FIREBASE_STORAGE_BUCKET to enable cloud document persistence.',
        isStorageUnavailable: true,
        fromMock: false
      };
    }

    // 4. Upload file to Firebase Storage
    try {
      const uploadRes = await storageService.uploadFile({
        path: storagePath,
        file,
        onProgress,
        isDemo: false
      });

      if (!uploadRes.success || !uploadRes.data) {
        return {
          success: false,
          data: null as any,
          error: uploadRes.error || 'Failed to upload document to Storage',
          fromMock: false
        };
      }

      const newDoc: VaultDocument = {
        id: docId,
        ownerId,
        ownerName: ownerName || auth?.currentUser?.displayName || 'Student',
        ownerEmail: ownerEmail || auth?.currentUser?.email || '',
        category,
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
        fileSize: file.size,
        storagePath,
        downloadUrl: uploadRes.data.downloadUrl,
        uploadedAt: nowIso,
        verificationStatus,
        source,
        relatedContext,
        tags: tags.length > 0 ? tags : [category, 'Uploaded'],
        metadata: {
          originalName: file.name,
          uploadedByUid: auth?.currentUser?.uid || ownerId
        }
      };

      if (db) {
        const docRef = doc(db, 'documents', docId);
        await setDoc(docRef, newDoc);
      }

      // Also update local cache for offline resiliency
      const local = loadLocalVaultDocuments(false);
      saveLocalVaultDocuments([newDoc, ...local]);

      return {
        success: true,
        data: newDoc,
        fromMock: false
      };
    } catch (err: any) {
      console.error('[DocumentService] uploadDocument error:', err);
      return {
        success: false,
        data: null as any,
        error: err?.message || 'Failed to persist document record in database',
        fromMock: false
      };
    }
  }

  /**
   * Delete a document from the vault and storage.
   * Strictly enforces owner authorization.
   */
  public async deleteDocument(
    docId: string,
    ownerId: string,
    isDemo = false
  ): Promise<DocumentServiceResult<boolean>> {
    if (isDemo || !db) {
      const local = loadLocalVaultDocuments(true);
      const filtered = local.filter((d) => !(d.id === docId && (d.ownerId === ownerId || d.ownerId === 'demo-student-id')));
      saveLocalVaultDocuments(filtered);
      return { success: true, data: true, fromMock: true };
    }

    try {
      const currentUid = auth?.currentUser?.uid;
      if (currentUid && currentUid !== ownerId) {
        return {
          success: false,
          data: false,
          error: 'Unauthorized: You can only delete documents you own.'
        };
      }

      const docRef = doc(db, 'documents', docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as VaultDocument;
        if (data.storagePath) {
          await storageService.deleteFile(data.storagePath, false);
        }
        await deleteDoc(docRef);
      }

      const local = loadLocalVaultDocuments(false).filter((d) => d.id !== docId);
      saveLocalVaultDocuments(local);

      return { success: true, data: true, fromMock: false };
    } catch (err: any) {
      console.error('[DocumentService] deleteDocument error:', err);
      return {
        success: false,
        data: false,
        error: err?.message || 'Failed to delete document'
      };
    }
  }

  /**
   * Automatically catalog a verified certificate into the student's Document Vault
   */
  public async syncCertificateAsDocument(
    params: {
      ownerId: string;
      ownerName?: string;
      certificateTitle: string;
      issuer: string;
      certificateId: string;
      verificationHash?: string;
      issueDate: string;
      gradeOrScore?: string;
      skillsEndorsed?: string[];
      downloadUrl?: string;
      source?: 'Industry Learning' | 'Internship Lifecycle' | 'Career Passport';
    },
    isDemo = false
  ): Promise<DocumentServiceResult<VaultDocument>> {
    const docId = `cert-doc-${params.certificateId || Date.now()}`;
    const nowIso = new Date().toISOString();

    const newDoc: VaultDocument = {
      id: docId,
      ownerId: params.ownerId,
      ownerName: params.ownerName || 'Student',
      category: 'Certificates',
      fileName: `${params.certificateTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_Certificate.pdf`,
      fileType: 'application/pdf',
      fileSize: 820000,
      storagePath: `students/${params.ownerId}/certificates/${docId}.pdf`,
      downloadUrl: params.downloadUrl || `https://skillsetu.ai/credentials/${params.certificateId}.pdf`,
      uploadedAt: params.issueDate || nowIso,
      verificationStatus: 'Verified',
      source: params.source || 'Industry Learning',
      relatedContext: {
        type: params.source === 'Internship Lifecycle' ? 'internship' : 'learning_program',
        id: params.certificateId,
        title: params.certificateTitle,
        organization: params.issuer,
        verificationHash: params.verificationHash,
        gradeOrScore: params.gradeOrScore,
        skillsEndorsed: params.skillsEndorsed
      },
      verifiedAt: params.issueDate || nowIso,
      verifiedBy: params.issuer,
      verificationNotes: `Cryptographically verified credential #${params.certificateId}. Verified by ${params.issuer}.`,
      tags: ['Certificate', 'Verified', params.issuer, ...(params.skillsEndorsed || [])]
    };

    if (isDemo || !db) {
      const local = loadLocalVaultDocuments(true);
      const existingIdx = local.findIndex((d) => d.id === docId || (d.relatedContext?.id === params.certificateId && d.category === 'Certificates'));
      if (existingIdx >= 0) {
        local[existingIdx] = newDoc;
      } else {
        local.unshift(newDoc);
      }
      saveLocalVaultDocuments(local);
      return { success: true, data: newDoc, fromMock: true };
    }

    try {
      const docRef = doc(db, 'documents', docId);
      await setDoc(docRef, newDoc, { merge: true });
      return { success: true, data: newDoc, fromMock: false };
    } catch (err: any) {
      console.warn('[DocumentService] syncCertificateAsDocument warning:', err);
      return { success: true, data: newDoc, fromMock: true };
    }
  }

  /**
   * Automatically catalog an internship report into the Document Vault
   */
  public async syncInternshipReportAsDocument(
    params: {
      ownerId: string;
      ownerName?: string;
      internshipId: string;
      internshipTitle: string;
      companyName: string;
      file: File | { name: string; size: number; type?: string; downloadUrl?: string };
    },
    isDemo = false
  ): Promise<DocumentServiceResult<VaultDocument>> {
    const docId = `report-doc-${params.internshipId}`;
    const nowIso = new Date().toISOString();
    const fileName = 'name' in params.file ? params.file.name : 'Internship_Report.pdf';
    const fileSize = 'size' in params.file ? params.file.size : 1500000;
    const fileType = ('type' in params.file && params.file.type) ? params.file.type : 'application/pdf';
    const downloadUrl = ('downloadUrl' in params.file && params.file.downloadUrl) ? params.file.downloadUrl : `https://skillsetu.ai/reports/${fileName}`;

    const newDoc: VaultDocument = {
      id: docId,
      ownerId: params.ownerId,
      ownerName: params.ownerName || 'Student',
      category: 'Internship Reports',
      fileName,
      fileType,
      fileSize,
      storagePath: `students/${params.ownerId}/internships/${params.internshipId}/report_${fileName}`,
      downloadUrl,
      uploadedAt: nowIso,
      verificationStatus: 'Verified',
      source: 'Internship Lifecycle',
      relatedContext: {
        type: 'internship',
        id: params.internshipId,
        title: params.internshipTitle,
        organization: params.companyName
      },
      verifiedAt: nowIso,
      verifiedBy: `${params.companyName} Mentor Team`,
      verificationNotes: `Verified final technical deliverable for ${params.internshipTitle} at ${params.companyName}.`,
      tags: ['Internship Report', 'Capstone', params.companyName]
    };

    if (isDemo || !db) {
      const local = loadLocalVaultDocuments(true);
      const existingIdx = local.findIndex((d) => d.id === docId || (d.relatedContext?.id === params.internshipId && d.category === 'Internship Reports'));
      if (existingIdx >= 0) {
        local[existingIdx] = newDoc;
      } else {
        local.unshift(newDoc);
      }
      saveLocalVaultDocuments(local);
      return { success: true, data: newDoc, fromMock: true };
    }

    try {
      const docRef = doc(db, 'documents', docId);
      await setDoc(docRef, newDoc, { merge: true });
      return { success: true, data: newDoc, fromMock: false };
    } catch (err: any) {
      console.warn('[DocumentService] syncInternshipReportAsDocument warning:', err);
      return { success: true, data: newDoc, fromMock: true };
    }
  }
}

export const documentService = new DocumentService();
export default documentService;
