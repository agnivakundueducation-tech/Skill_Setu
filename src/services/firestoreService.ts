/**
 * Cloud Firestore Service Abstraction
 * 
 * Provides unified access to Firestore documents & subcollections for SkillSetu AI.
 * Handles Student Profiles, Assessments, and Skill DNA persistence with resilient
 * offline caching and strict isolation for Demo Mode.
 */

import {
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  updateDoc
} from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from '../lib/firebase';
import {
  FirestoreCollectionName,
  FIRESTORE_COLLECTIONS,
  FirestoreDocument,
  FirestoreQueryFilter,
  ServiceResponse
} from '../types/firebase';
import {
  PersistedSkillProfile,
  StudentAssessmentRecord,
  StudentFirestoreProfile
} from './skillService';
import {
  STUDENT_READINESS_DATA,
  STUDENT_SKILLS_ASSESSED,
  STUDENT_OPPORTUNITIES,
  STUDENT_ACTIVE_APPLICATIONS
} from '../data/studentData';
import { DEFAULT_SOFTWARE_ENGINEER_ROADMAP } from '../data/careerRoadmapData';
import { STUDENT_PORTFOLIO_PROFILE } from '../data/studentPortfolioData';
import { INITIAL_INSTITUTION_METRICS, SKILL_DEMAND_READINESS_DATA } from '../data/institutionData';
import { INITIAL_INDUSTRY_JOBS } from '../data/industryData';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function isOfflineOrNetworkError(error: unknown): boolean {
  if (!error) return false;
  const message = (error instanceof Error ? error.message : String(error)).toLowerCase();
  const code = (error as { code?: string })?.code || '';
  return (
    message.includes('offline') ||
    message.includes('unavailable') ||
    message.includes('network') ||
    message.includes('failed to get document because the client is offline') ||
    code === 'unavailable' ||
    code === 'deadline-exceeded' ||
    code === 'failed-precondition'
  );
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const message = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: message,
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified ?? null,
      isAnonymous: auth?.currentUser?.isAnonymous ?? null,
      tenantId: auth?.currentUser?.tenantId ?? null,
      providerInfo: auth?.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email || null
      })) || []
    },
    operationType,
    path
  };
  console.error('[SkillSetu Firestore Error]', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

class FirestoreService {
  /**
   * Checks if live Cloud Firestore connection is active and ready.
   */
  public isLiveFirestoreAvailable(): boolean {
    return Boolean(isFirebaseConfigured && db);
  }

  // ==========================================
  // STUDENT PROFILE & READINESS
  // ==========================================

  /**
   * Retrieves student profile document from /students/{uid}
   */
  public async getStudentProfile(uid: string): Promise<ServiceResponse<StudentFirestoreProfile | null>> {
    if (!uid || uid.startsWith('demo-')) {
      return {
        success: true,
        data: null,
        fromMock: true,
        timestamp: new Date().toISOString()
      };
    }

    // Check localStorage cache first for fast recovery
    let cachedProfile: StudentFirestoreProfile | null = null;
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(`skillsetu_student_doc_${uid}`);
        if (raw) cachedProfile = JSON.parse(raw);
      }
    } catch {}

    if (!this.isLiveFirestoreAvailable() || !db) {
      return {
        success: true,
        data: cachedProfile,
        fromMock: true,
        timestamp: new Date().toISOString()
      };
    }

    const docPath = `students/${uid}`;
    try {
      const docRef = doc(db, 'students', uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as StudentFirestoreProfile;
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem(`skillsetu_student_doc_${uid}`, JSON.stringify(data));
          }
        } catch {}
        return {
          success: true,
          data,
          fromMock: false,
          timestamp: new Date().toISOString()
        };
      }

      return {
        success: true,
        data: cachedProfile,
        fromMock: false,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      if (isOfflineOrNetworkError(error)) {
        return {
          success: true,
          data: cachedProfile,
          fromMock: true,
          timestamp: new Date().toISOString()
        };
      }
      console.error('[FirestoreService] getStudentProfile error:', error);
      return {
        success: false,
        data: cachedProfile,
        fromMock: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve student profile from Firestore',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Saves or merges student profile to /students/{uid}
   */
  public async saveStudentProfile(
    uid: string,
    profile: Partial<StudentFirestoreProfile>
  ): Promise<ServiceResponse<StudentFirestoreProfile>> {
    const nowIso = new Date().toISOString();
    const studentData: StudentFirestoreProfile = {
      uid,
      fullName: profile.fullName || 'Student User',
      email: profile.email || '',
      institution: profile.institution || '',
      department: profile.department || '',
      degree: profile.degree || 'B.Tech Computer Science & Engineering',
      graduationYear: profile.graduationYear || '2027',
      careerGoal: profile.careerGoal || 'Full-Stack Software Engineering',
      careerInterests: profile.careerInterests || ['AI & Machine Learning', 'SaaS & Enterprise Tools'],
      readinessScore: profile.readinessScore ?? 0,
      profileCompletion: profile.profileCompletion ?? 85,
      updatedAt: nowIso
    };

    // Always update local cache first
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`skillsetu_student_doc_${uid}`, JSON.stringify(studentData));
      }
    } catch {}

    if (!this.isLiveFirestoreAvailable() || !db || uid.startsWith('demo-')) {
      return {
        success: true,
        data: studentData,
        fromMock: true,
        timestamp: nowIso
      };
    }

    const docPath = `students/${uid}`;
    try {
      const docRef = doc(db, 'students', uid);
      await setDoc(docRef, studentData, { merge: true });

      return {
        success: true,
        data: studentData,
        fromMock: false,
        timestamp: nowIso
      };
    } catch (error) {
      if (isOfflineOrNetworkError(error)) {
        return {
          success: true,
          data: studentData,
          fromMock: true,
          timestamp: nowIso
        };
      }
      console.error('[FirestoreService] saveStudentProfile error:', error);
      return {
        success: false,
        data: studentData,
        fromMock: false,
        error: error instanceof Error ? error.message : 'Failed to save student profile to Firestore',
        timestamp: nowIso
      };
    }
  }

  /**
   * Updates only the student readiness score in /students/{uid}
   */
  public async updateStudentReadiness(uid: string, readinessScore: number): Promise<ServiceResponse<boolean>> {
    const nowIso = new Date().toISOString();

    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(`skillsetu_student_doc_${uid}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.readinessScore = readinessScore;
          parsed.updatedAt = nowIso;
          localStorage.setItem(`skillsetu_student_doc_${uid}`, JSON.stringify(parsed));
        }
      }
    } catch {}

    if (!this.isLiveFirestoreAvailable() || !db || uid.startsWith('demo-')) {
      return {
        success: true,
        data: true,
        fromMock: true,
        timestamp: nowIso
      };
    }

    const docPath = `students/${uid}`;
    try {
      const docRef = doc(db, 'students', uid);
      await setDoc(docRef, { readinessScore, updatedAt: nowIso }, { merge: true });

      return {
        success: true,
        data: true,
        fromMock: false,
        timestamp: nowIso
      };
    } catch (error) {
      if (isOfflineOrNetworkError(error)) {
        return {
          success: true,
          data: true,
          fromMock: true,
          timestamp: nowIso
        };
      }
      console.error('[FirestoreService] updateStudentReadiness error:', error);
      return {
        success: false,
        data: false,
        fromMock: false,
        error: error instanceof Error ? error.message : 'Failed to update student readiness in Firestore',
        timestamp: nowIso
      };
    }
  }

  // ==========================================
  // ASSESSMENTS SUBCOLLECTION (/students/{uid}/assessments/{assessmentId})
  // ==========================================

  /**
   * Saves a completed student assessment to /students/{uid}/assessments/{assessmentId}
   * Also keeps the parent /students/{uid} document in sync with the latest readiness score.
   */
  public async saveAssessment(
    uid: string,
    assessment: StudentAssessmentRecord
  ): Promise<ServiceResponse<StudentAssessmentRecord>> {
    const nowIso = new Date().toISOString();
    const record: StudentAssessmentRecord = {
      ...assessment,
      uid,
      completedAt: assessment.completedAt || nowIso
    };

    // Cache locally for resilient hydration and offline recovery
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`skillsetu_latest_assessment_${uid}`, JSON.stringify(record));
        const historyRaw = localStorage.getItem(`skillsetu_assessment_history_${uid}`);
        const history: StudentAssessmentRecord[] = historyRaw ? JSON.parse(historyRaw) : [];
        const existingIdx = history.findIndex((h) => h.assessmentId === record.assessmentId);
        if (existingIdx >= 0) {
          history[existingIdx] = record;
        } else {
          history.unshift(record);
        }
        localStorage.setItem(`skillsetu_assessment_history_${uid}`, JSON.stringify(history));
      }
    } catch {}

    // Demo Mode bypass
    if (!this.isLiveFirestoreAvailable() || !db || uid.startsWith('demo-')) {
      return {
        success: true,
        data: record,
        fromMock: true,
        timestamp: nowIso
      };
    }

    const docPath = `students/${uid}/assessments/${record.assessmentId}`;
    try {
      // 1. Write to assessment subcollection
      const assessmentDocRef = doc(db, 'students', uid, 'assessments', record.assessmentId);
      await setDoc(assessmentDocRef, record, { merge: true });

      // 2. Ensure parent student doc is updated with latest readiness
      const studentDocRef = doc(db, 'students', uid);
      await setDoc(
        studentDocRef,
        {
          readinessScore: record.readinessScore,
          careerGoal: record.careerGoal || 'Full-Stack Software Engineering',
          updatedAt: nowIso
        },
        { merge: true }
      );

      return {
        success: true,
        data: record,
        fromMock: false,
        timestamp: nowIso
      };
    } catch (error) {
      if (isOfflineOrNetworkError(error)) {
        return {
          success: true,
          data: record,
          fromMock: true,
          timestamp: nowIso
        };
      }
      console.error('[FirestoreService] saveAssessment error:', error);
      return {
        success: false,
        data: record,
        fromMock: false,
        error: error instanceof Error ? error.message : 'Failed to save assessment to Firestore',
        timestamp: nowIso
      };
    }
  }

  /**
   * Retrieves the latest assessment record for a student
   */
  public async getLatestAssessment(uid: string): Promise<ServiceResponse<StudentAssessmentRecord | null>> {
    if (!uid || uid.startsWith('demo-')) {
      return {
        success: true,
        data: null,
        fromMock: true,
        timestamp: new Date().toISOString()
      };
    }

    let cachedAssessment: StudentAssessmentRecord | null = null;
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(`skillsetu_latest_assessment_${uid}`);
        if (raw) cachedAssessment = JSON.parse(raw);
      }
    } catch {}

    if (!this.isLiveFirestoreAvailable() || !db) {
      return {
        success: true,
        data: cachedAssessment,
        fromMock: true,
        timestamp: new Date().toISOString()
      };
    }

    const colPath = `students/${uid}/assessments`;
    try {
      const colRef = collection(db, 'students', uid, 'assessments');
      const q = query(colRef, orderBy('completedAt', 'desc'), limit(1));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const data = snap.docs[0].data() as StudentAssessmentRecord;
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem(`skillsetu_latest_assessment_${uid}`, JSON.stringify(data));
          }
        } catch {}
        return {
          success: true,
          data,
          fromMock: false,
          timestamp: new Date().toISOString()
        };
      }

      return {
        success: true,
        data: cachedAssessment,
        fromMock: false,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      if (isOfflineOrNetworkError(error)) {
        return {
          success: true,
          data: cachedAssessment,
          fromMock: true,
          timestamp: new Date().toISOString()
        };
      }
      console.error('[FirestoreService] getLatestAssessment error:', error);
      return {
        success: false,
        data: cachedAssessment,
        fromMock: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve assessment from Firestore',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Retrieves the assessment history for a student
   */
  public async getAssessmentHistory(uid: string): Promise<ServiceResponse<StudentAssessmentRecord[]>> {
    if (!uid || uid.startsWith('demo-')) {
      return {
        success: true,
        data: [],
        fromMock: true,
        timestamp: new Date().toISOString()
      };
    }

    let cachedHistory: StudentAssessmentRecord[] = [];
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(`skillsetu_assessment_history_${uid}`);
        if (raw) cachedHistory = JSON.parse(raw);
      }
    } catch {}

    if (!this.isLiveFirestoreAvailable() || !db) {
      return {
        success: true,
        data: cachedHistory,
        fromMock: true,
        timestamp: new Date().toISOString()
      };
    }

    const colPath = `students/${uid}/assessments`;
    try {
      const colRef = collection(db, 'students', uid, 'assessments');
      const q = query(colRef, orderBy('completedAt', 'desc'));
      const snap = await getDocs(q);

      const items: StudentAssessmentRecord[] = [];
      snap.forEach((d) => items.push(d.data() as StudentAssessmentRecord));

      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(`skillsetu_assessment_history_${uid}`, JSON.stringify(items));
        }
      } catch {}

      return {
        success: true,
        data: items,
        fromMock: false,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      if (isOfflineOrNetworkError(error)) {
        return {
          success: true,
          data: cachedHistory,
          fromMock: true,
          timestamp: new Date().toISOString()
        };
      }
      console.error('[FirestoreService] getAssessmentHistory error:', error);
      return {
        success: false,
        data: cachedHistory,
        fromMock: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve assessment history from Firestore',
        timestamp: new Date().toISOString()
      };
    }
  }

  // ==========================================
  // SKILL DNA / SKILL PROFILE (/students/{uid}/skillProfile/current)
  // ==========================================

  /**
   * Saves the calculated Skill DNA profile to /students/{uid}/skillProfile/current
   * and syncs high-level readiness to the parent /students/{uid} document.
   */
  public async saveSkillProfile(
    uid: string,
    skillProfile: PersistedSkillProfile
  ): Promise<ServiceResponse<PersistedSkillProfile>> {
    const nowIso = new Date().toISOString();
    const profileToWrite: PersistedSkillProfile = {
      ...skillProfile,
      uid,
      updatedAt: nowIso
    };

    // Cache locally first
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`skillsetu_skill_profile_${uid}`, JSON.stringify(profileToWrite));
      }
    } catch {}

    if (!this.isLiveFirestoreAvailable() || !db || uid.startsWith('demo-')) {
      return {
        success: true,
        data: profileToWrite,
        fromMock: true,
        timestamp: nowIso
      };
    }

    const docPath = `students/${uid}/skillProfile/current`;
    try {
      const profileDocRef = doc(db, 'students', uid, 'skillProfile', 'current');
      await setDoc(profileDocRef, profileToWrite, { merge: true });

      // Also ensure parent /students/{uid} doc records updated readiness
      const studentDocRef = doc(db, 'students', uid);
      await setDoc(
        studentDocRef,
        {
          readinessScore: profileToWrite.overallReadiness,
          updatedAt: nowIso
        },
        { merge: true }
      );

      return {
        success: true,
        data: profileToWrite,
        fromMock: false,
        timestamp: nowIso
      };
    } catch (error) {
      if (isOfflineOrNetworkError(error)) {
        return {
          success: true,
          data: profileToWrite,
          fromMock: true,
          timestamp: nowIso
        };
      }
      console.error('[FirestoreService] saveSkillProfile error:', error);
      return {
        success: false,
        data: profileToWrite,
        fromMock: false,
        error: error instanceof Error ? error.message : 'Failed to save skill profile to Firestore',
        timestamp: nowIso
      };
    }
  }

  /**
   * Retrieves the persisted Skill DNA profile from /students/{uid}/skillProfile/current
   */
  public async getSkillProfile(uid: string): Promise<ServiceResponse<PersistedSkillProfile | null>> {
    if (!uid || uid.startsWith('demo-')) {
      return {
        success: true,
        data: null,
        fromMock: true,
        timestamp: new Date().toISOString()
      };
    }

    let cachedSkillProfile: PersistedSkillProfile | null = null;
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(`skillsetu_skill_profile_${uid}`);
        if (raw) cachedSkillProfile = JSON.parse(raw);
      }
    } catch {}

    if (!this.isLiveFirestoreAvailable() || !db) {
      return {
        success: true,
        data: cachedSkillProfile,
        fromMock: true,
        timestamp: new Date().toISOString()
      };
    }

    const docPath = `students/${uid}/skillProfile/current`;
    try {
      const docRef = doc(db, 'students', uid, 'skillProfile', 'current');
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data() as PersistedSkillProfile;
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem(`skillsetu_skill_profile_${uid}`, JSON.stringify(data));
          }
        } catch {}
        return {
          success: true,
          data,
          fromMock: false,
          timestamp: new Date().toISOString()
        };
      }

      return {
        success: true,
        data: cachedSkillProfile,
        fromMock: false,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      if (isOfflineOrNetworkError(error)) {
        return {
          success: true,
          data: cachedSkillProfile,
          fromMock: true,
          timestamp: new Date().toISOString()
        };
      }
      console.error('[FirestoreService] getSkillProfile error:', error);
      return {
        success: false,
        data: cachedSkillProfile,
        fromMock: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve skill profile from Firestore',
        timestamp: new Date().toISOString()
      };
    }
  }

  // ==========================================
  // GENERIC HELPERS & MOCK FALLBACKS
  // ==========================================

  public async getDocument<T = Record<string, unknown>>(
    collectionName: FirestoreCollectionName,
    id: string
  ): Promise<ServiceResponse<FirestoreDocument<T>>> {
    const mockDoc = this.getMockDocument<T>(collectionName, id);
    return {
      success: true,
      data: mockDoc,
      fromMock: true,
      timestamp: new Date().toISOString()
    };
  }

  public async getCollection<T = Record<string, unknown>>(
    collectionName: FirestoreCollectionName,
    _filters?: FirestoreQueryFilter[]
  ): Promise<ServiceResponse<FirestoreDocument<T>[]>> {
    const mockDocs = this.getMockCollection<T>(collectionName);
    return {
      success: true,
      data: mockDocs,
      fromMock: true,
      timestamp: new Date().toISOString()
    };
  }

  public async setDocument<T = Record<string, unknown>>(
    collectionName: FirestoreCollectionName,
    id: string,
    data: T
  ): Promise<ServiceResponse<FirestoreDocument<T>>> {
    const docItem: FirestoreDocument<T> = {
      id,
      data,
      updatedAt: new Date().toISOString()
    };

    return {
      success: true,
      data: docItem,
      fromMock: !this.isLiveFirestoreAvailable(),
      timestamp: new Date().toISOString()
    };
  }

  public async updateDocument<T = Record<string, unknown>>(
    _collectionName: FirestoreCollectionName,
    id: string,
    partialData: Partial<T>
  ): Promise<ServiceResponse<FirestoreDocument<T>>> {
    return {
      success: true,
      data: {
        id,
        data: partialData as T,
        updatedAt: new Date().toISOString()
      },
      fromMock: !this.isLiveFirestoreAvailable(),
      timestamp: new Date().toISOString()
    };
  }

  public async deleteDocument(
    _collectionName: FirestoreCollectionName,
    id: string
  ): Promise<ServiceResponse<string>> {
    return {
      success: true,
      data: id,
      fromMock: !this.isLiveFirestoreAvailable(),
      timestamp: new Date().toISOString()
    };
  }

  private getMockDocument<T>(collectionName: FirestoreCollectionName, id: string): FirestoreDocument<T> {
    let payload: unknown = {};

    switch (collectionName) {
      case FIRESTORE_COLLECTIONS.STUDENTS:
        payload = STUDENT_READINESS_DATA;
        break;
      case FIRESTORE_COLLECTIONS.PORTFOLIOS:
        payload = STUDENT_PORTFOLIO_PROFILE;
        break;
      case FIRESTORE_COLLECTIONS.INSTITUTIONS:
        payload = INITIAL_INSTITUTION_METRICS;
        break;
      default:
        payload = { id, name: `Mock ${collectionName} document` };
    }

    return {
      id,
      data: payload as T,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: new Date().toISOString()
    };
  }

  private getMockCollection<T>(collectionName: FirestoreCollectionName): FirestoreDocument<T>[] {
    let items: unknown[] = [];

    switch (collectionName) {
      case FIRESTORE_COLLECTIONS.SKILLS:
        items = STUDENT_SKILLS_ASSESSED;
        break;
      case FIRESTORE_COLLECTIONS.OPPORTUNITIES:
        items = STUDENT_OPPORTUNITIES;
        break;
      case FIRESTORE_COLLECTIONS.APPLICATIONS:
        items = STUDENT_ACTIVE_APPLICATIONS;
        break;
      case FIRESTORE_COLLECTIONS.CAREER_ROADMAPS:
        items = [DEFAULT_SOFTWARE_ENGINEER_ROADMAP];
        break;
      case FIRESTORE_COLLECTIONS.ANALYTICS:
        items = [INITIAL_INSTITUTION_METRICS, INITIAL_INDUSTRY_JOBS, SKILL_DEMAND_READINESS_DATA];
        break;
      default:
        items = [{ id: 'mock-1' }, { id: 'mock-2' }];
    }

    return items.map((item, index) => ({
      id: (item as any)?.id || `mock-${collectionName}-${index}`,
      data: item as T,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: new Date().toISOString()
    }));
  }
}

export const firestoreService = new FirestoreService();
export default firestoreService;
