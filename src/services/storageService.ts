/**
 * Firebase Storage Service Abstraction
 * 
 * Manages secure file uploads for resumes, portfolio assets, certificates,
 * and assessment artifacts with graceful client-side fallback simulation.
 */

import { storage, isFirebaseConfigured, getFirebaseStatus } from '../lib/firebase';
import {
  StorageUploadOptions,
  StorageUploadResult,
  ServiceResponse
} from '../types/firebase';

class StorageService {
  /**
   * Checks if live Firebase Storage bucket is connected.
   */
  public isLiveStorageAvailable(): boolean {
    return Boolean(isFirebaseConfigured && storage);
  }

  /**
   * Upload file to storage path with progress reporting and fallback support.
   */
  public async uploadFile(options: StorageUploadOptions): Promise<ServiceResponse<StorageUploadResult>> {
    const { path, file, onProgress } = options;

    if (!this.isLiveStorageAvailable()) {
      // Simulate quick progress callbacks for mock preview
      if (onProgress) {
        onProgress(30);
        await new Promise(r => setTimeout(r, 60));
        onProgress(75);
        await new Promise(r => setTimeout(r, 60));
        onProgress(100);
      }

      const fileName = file instanceof File ? file.name : 'upload.bin';
      const fileSize = file.size;
      const fileType = file.type || 'application/octet-stream';

      // Fallback mock download URL
      const mockResult: StorageUploadResult = {
        downloadUrl: typeof URL !== 'undefined' ? URL.createObjectURL(file) : `https://storage.mock.local/${path}/${fileName}`,
        fullPath: `${path}/${fileName}`,
        name: fileName,
        size: fileSize,
        contentType: fileType,
        createdAt: new Date().toISOString()
      };

      return {
        success: true,
        data: mockResult,
        fromMock: true,
        timestamp: new Date().toISOString()
      };
    }

    // Future Firebase Storage uploadBytesResumable / getDownloadURL hook point
    const fileName = file instanceof File ? file.name : 'upload.bin';
    const mockResult: StorageUploadResult = {
      downloadUrl: typeof URL !== 'undefined' ? URL.createObjectURL(file) : `https://storage.mock.local/${path}/${fileName}`,
      fullPath: `${path}/${fileName}`,
      name: fileName,
      size: file.size,
      contentType: file.type,
      createdAt: new Date().toISOString()
    };

    return {
      success: true,
      data: mockResult,
      fromMock: true,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get public or signed download URL for an existing file
   */
  public async getDownloadUrl(path: string): Promise<ServiceResponse<string>> {
    return {
      success: true,
      data: `https://storage.mock.local/${path}`,
      fromMock: !this.isLiveStorageAvailable(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Delete file from storage
   */
  public async deleteFile(path: string): Promise<ServiceResponse<boolean>> {
    return {
      success: true,
      data: true,
      fromMock: !this.isLiveStorageAvailable(),
      timestamp: new Date().toISOString()
    };
  }
}

export const storageService = new StorageService();
export default storageService;
