/**
 * Firebase Storage Service Abstraction & Document Validation (SIH PS 26044)
 * 
 * Manages secure file uploads to Firebase Storage when configured,
 * with honest "Document storage unavailable" reporting for authenticated users
 * when Storage is unconfigured, and strictly isolated local object URLs for Demo mode.
 */

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { storage, isFirebaseConfigured, firebaseConfig } from '../lib/firebase';
import {
  StorageUploadOptions,
  StorageUploadResult,
  ServiceResponse
} from '../types/firebase';
import { DocumentValidationResult } from '../types/document';

// Maximum allowed document size: 15 MB
export const MAX_DOCUMENT_FILE_SIZE_BYTES = 15 * 1024 * 1024;

// Allowed file MIME types and file extensions
export const ALLOWED_DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/webp'
];

export const ALLOWED_DOCUMENT_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.txt',
  '.jpg',
  '.jpeg',
  '.png',
  '.webp'
];

/**
 * Validates document format, size, and metadata
 */
export function validateDocumentFile(file: File): DocumentValidationResult {
  if (!file) {
    return { isValid: false, error: 'No file selected for upload.' };
  }

  // Size validation
  if (file.size > MAX_DOCUMENT_FILE_SIZE_BYTES) {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `File size (${sizeInMb} MB) exceeds maximum allowed limit of 15 MB.`
    };
  }

  if (file.size === 0) {
    return { isValid: false, error: 'The selected file is empty (0 bytes).' };
  }

  // Extension & MIME validation
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_DOCUMENT_EXTENSIONS.some((ext) => fileName.endsWith(ext));
  const hasValidMime = file.type ? ALLOWED_DOCUMENT_MIME_TYPES.includes(file.type.toLowerCase()) : false;

  if (!hasValidExtension && !hasValidMime) {
    return {
      isValid: false,
      error: 'Unsupported file format. Supported formats: PDF, DOC, DOCX, TXT, JPG/JPEG, PNG, WEBP.'
    };
  }

  return { isValid: true, detectedType: file.type || 'application/octet-stream' };
}

export interface ExtendedUploadOptions extends StorageUploadOptions {
  isDemo?: boolean;
}

class StorageService {
  /**
   * Checks if live Firebase Storage bucket is properly connected and initialized.
   */
  public isLiveStorageAvailable(): boolean {
    return Boolean(
      isFirebaseConfigured &&
      storage &&
      firebaseConfig.storageBucket &&
      firebaseConfig.storageBucket.trim() !== ''
    );
  }

  /**
   * Upload file to storage path.
   * If live Firebase Storage is active, uses uploadBytesResumable.
   * If Storage is unconfigured and user is authenticated, returns honest unavailable error.
   * If Demo mode is explicitly active, uses isolated local object URL.
   */
  public async uploadFile(options: ExtendedUploadOptions): Promise<ServiceResponse<StorageUploadResult>> {
    const { path, file, onProgress, isDemo = false } = options;

    // 1. Validate file constraints first
    if (file instanceof File) {
      const validation = validateDocumentFile(file);
      if (!validation.isValid) {
        return {
          success: false,
          data: null as any,
          error: validation.error || 'Invalid file',
          timestamp: new Date().toISOString()
        };
      }
    }

    // 2. Demo Mode Isolation
    if (isDemo) {
      if (onProgress) {
        onProgress(30);
        await new Promise((r) => setTimeout(r, 80));
        onProgress(70);
        await new Promise((r) => setTimeout(r, 80));
        onProgress(100);
      }

      const fileName = file instanceof File ? file.name : 'document.pdf';
      const fileSize = file.size;
      const fileType = file.type || 'application/pdf';
      const downloadUrl = typeof URL !== 'undefined' ? URL.createObjectURL(file) : `https://storage.demo.local/${path}/${fileName}`;

      const demoResult: StorageUploadResult = {
        downloadUrl,
        fullPath: `demo/${path}/${fileName}`,
        name: fileName,
        size: fileSize,
        contentType: fileType,
        createdAt: new Date().toISOString()
      };

      return {
        success: true,
        data: demoResult,
        fromMock: true,
        timestamp: new Date().toISOString()
      };
    }

    // 3. Authenticated Live Mode: Check if live Firebase Storage is available
    if (!this.isLiveStorageAvailable() || !storage) {
      return {
        success: false,
        data: null as any,
        error: 'Document storage unavailable: Firebase Storage bucket is not configured or offline. Please verify Firebase Storage settings in .env.',
        fromMock: false,
        timestamp: new Date().toISOString()
      };
    }

    // 4. Perform real upload to Firebase Storage
    try {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type || 'application/octet-stream'
      });

      return new Promise((resolve) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            if (onProgress && snapshot.totalBytes > 0) {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              onProgress(progress);
            }
          },
          (uploadError) => {
            console.error('[StorageService] Upload error:', uploadError);
            resolve({
              success: false,
              data: null as any,
              error: `Upload failed: ${uploadError.message}`,
              fromMock: false,
              timestamp: new Date().toISOString()
            });
          },
          async () => {
            try {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              const result: StorageUploadResult = {
                downloadUrl,
                fullPath: path,
                name: file instanceof File ? file.name : 'document',
                size: file.size,
                contentType: file.type || 'application/octet-stream',
                createdAt: new Date().toISOString()
              };
              resolve({
                success: true,
                data: result,
                fromMock: false,
                timestamp: new Date().toISOString()
              });
            } catch (err: any) {
              resolve({
                success: false,
                data: null as any,
                error: `Failed to retrieve download URL: ${err?.message || 'Unknown error'}`,
                fromMock: false,
                timestamp: new Date().toISOString()
              });
            }
          }
        );
      });
    } catch (err: any) {
      console.error('[StorageService] Initialization error during upload:', err);
      return {
        success: false,
        data: null as any,
        error: err?.message || 'Storage upload error',
        fromMock: false,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Delete file from storage path
   */
  public async deleteFile(path: string, isDemo = false): Promise<ServiceResponse<boolean>> {
    if (isDemo || !this.isLiveStorageAvailable() || !storage) {
      return {
        success: true,
        data: true,
        fromMock: true,
        timestamp: new Date().toISOString()
      };
    }

    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      return {
        success: true,
        data: true,
        fromMock: false,
        timestamp: new Date().toISOString()
      };
    } catch (err: any) {
      console.error('[StorageService] Delete error:', err);
      return {
        success: false,
        data: false,
        error: err?.message || 'Failed to delete file from storage',
        fromMock: false,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export const storageService = new StorageService();
export default storageService;
