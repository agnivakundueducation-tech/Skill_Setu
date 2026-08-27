/**
 * Firebase Integration Types & Interfaces
 * 
 * Defines comprehensive contracts for Firebase Authentication, Cloud Firestore,
 * and Firebase Storage services with resilient mock-data fallback awareness.
 */

import { UserRole } from './index';

/**
 * Standard Firebase Configuration Structure
 */
export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

/**
 * Firebase Runtime Initialization & Availability Status
 */
export interface FirebaseStatus {
  isConfigured: boolean;
  isInitialized: boolean;
  hasAuth: boolean;
  hasFirestore: boolean;
  hasStorage: boolean;
  projectId?: string;
  mode: 'live' | 'mock_fallback';
  reason?: string;
}

/**
 * Normalized Authentication User Profile
 */
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  institutionId?: string;
  department?: string;
  createdAt?: string | Date;
  lastLoginAt?: string | Date;
  emailVerified: boolean;
  isAnonymous: boolean;
}

/**
 * Stored Firestore User Profile Document Schema
 */
export interface UserProfileDoc {
  uid: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  profileCompleted: boolean;
  department?: string;
  institution?: string;
  photoURL?: string;
}

/**
 * Authentication State Representation
 */
export interface AuthState {
  user: AppUser | null;
  userProfile: UserProfileDoc | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemo: boolean;
  error: string | null;
  mode: 'live' | 'mock';
}

/**
 * Credentials for Email/Password Sign In
 */
export interface SignInCredentials {
  email: string;
  password?: string;
  role?: UserRole;
}

/**
 * User Registration Parameters
 */
export interface SignUpParameters {
  email: string;
  password?: string;
  displayName: string;
  role: UserRole;
  institution?: string;
  department?: string;
}

/**
 * Canonical Firestore Collection Names across SkillSetu AI
 */
export const FIRESTORE_COLLECTIONS = {
  USERS: 'users',
  STUDENTS: 'students',
  SKILLS: 'skills',
  ASSESSMENTS: 'assessments',
  CAREER_ROADMAPS: 'career_roadmaps',
  OPPORTUNITIES: 'opportunities',
  APPLICATIONS: 'applications',
  PORTFOLIOS: 'portfolios',
  INSTITUTIONS: 'institutions',
  ANALYTICS: 'analytics',
  COPILOT_CHATS: 'copilot_chats'
} as const;

export type FirestoreCollectionName = typeof FIRESTORE_COLLECTIONS[keyof typeof FIRESTORE_COLLECTIONS];

/**
 * Generic Firestore Document Envelope
 */
export interface FirestoreDocument<T = Record<string, unknown>> {
  id: string;
  data: T;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

/**
 * Query Filter Descriptor for Firestore Service
 */
export interface FirestoreQueryFilter {
  field: string;
  operator: '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'in' | 'array-contains-any';
  value: unknown;
}

/**
 * Service Operation Result with Resilient Error Handling
 */
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
  timeoutWarning?: boolean;
  fromMock?: boolean;
  timestamp: string;
}

/**
 * File Storage Upload Options
 */
export interface StorageUploadOptions {
  path: string;
  file: File | Blob;
  customMetadata?: Record<string, string>;
  onProgress?: (progress: number) => void;
}

/**
 * File Storage Upload Result
 */
export interface StorageUploadResult {
  downloadUrl: string;
  fullPath: string;
  name: string;
  size: number;
  contentType?: string;
  createdAt: string;
}
