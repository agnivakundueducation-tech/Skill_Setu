import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import {
  InternshipRecord,
  InternshipMilestone,
  InternshipWeeklyLog,
  InternshipFeedback,
  InternshipFinalEvaluation,
  InternshipCompletionRecord,
  InternshipReportDocument,
  InternshipStatus
} from '../types/internship';
import { INITIAL_DEMO_INTERNSHIPS } from '../data/internshipData';
import { ApplicationRecord } from '../types/application';
import { isOfflineOrNetworkError } from './firestoreService';
import { storageService } from './storageService';
import { documentService } from './documentService';

export interface InternshipServiceResult<T> {
  success: boolean;
  data: T;
  fromMock?: boolean;
  error?: string;
}

const LOCAL_INTERNSHIPS_KEY = 'skillsetu_local_internships_v1';

function loadLocalInternships(isDemo = true): InternshipRecord[] {
  if (typeof window === 'undefined') return isDemo ? INITIAL_DEMO_INTERNSHIPS : [];
  try {
    const raw = localStorage.getItem(LOCAL_INTERNSHIPS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Fallback
  }
  return isDemo ? INITIAL_DEMO_INTERNSHIPS : [];
}

function saveLocalInternships(data: InternshipRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_INTERNSHIPS_KEY, JSON.stringify(data));
  } catch {
    // Fallback
  }
}

/**
 * Calculates current progress percentage dynamically based on approved milestones
 */
export function calculateInternshipProgress(milestones: InternshipMilestone[]): number {
  if (!milestones || milestones.length === 0) return 0;
  const approved = milestones.filter((m) => m.status === 'Approved').length;
  const inProgress = milestones.filter((m) => m.status === 'In Progress' || m.status === 'Submitted').length;
  
  // Weight approved milestones as 1.0, submitted/in progress as 0.35
  const weighted = approved * 1.0 + inProgress * 0.35;
  const pct = Math.round((weighted / milestones.length) * 100);
  return Math.min(100, Math.max(0, pct));
}

/**
 * Retrieve all internships for a student
 */
export async function getStudentInternships(
  studentId: string,
  isDemo = false
): Promise<InternshipServiceResult<InternshipRecord[]>> {
  if (isDemo) {
    const local = loadLocalInternships(true);
    const studentInternships = local.filter(
      (item) => item.studentId === studentId || studentId === 'demo-student-id' || item.studentEmail === 'aarav.sharma@skillsetu.demo'
    );
    return {
      success: true,
      data: studentInternships,
      fromMock: true
    };
  }

  if (!db) {
    return {
      success: false,
      data: [],
      fromMock: false,
      error: 'Database not initialized'
    };
  }

  try {
    const internshipsRef = collection(db, 'internships');
    const q = query(internshipsRef, where('studentId', '==', studentId));
    const snapshot = await getDocs(q);

    const results: InternshipRecord[] = [];
    snapshot.forEach((docSnap) => {
      if (docSnap.exists()) {
        results.push({
          ...(docSnap.data() as InternshipRecord),
          id: docSnap.id
        });
      }
    });

    if (results.length > 0) {
      saveLocalInternships(results);
    }

    return {
      success: true,
      data: results,
      fromMock: false
    };
  } catch (error) {
    // Fallback to local cache if network is offline
    if (isOfflineOrNetworkError(error)) {
      const local = loadLocalInternships(true);
      return {
        success: true,
        data: local.filter((i) => i.studentId === studentId),
        fromMock: true
      };
    }
    console.error('[InternshipService] getStudentInternships error:', error);
    return {
      success: false,
      data: [],
      fromMock: false,
      error: error instanceof Error ? error.message : 'Failed to fetch student internships from Firestore'
    };
  }
}

/**
 * Retrieve all internships posted by or mentored by an Industry user
 */
export async function getIndustryInternships(
  industryUid: string,
  isDemo = false
): Promise<InternshipServiceResult<InternshipRecord[]>> {
  if (isDemo) {
    const local = loadLocalInternships(true);
    const industryInternships = local.filter(
      (item) => item.postedBy === industryUid || industryUid.startsWith('ind_') || industryUid.startsWith('demo-industry')
    );
    return {
      success: true,
      data: industryInternships,
      fromMock: true
    };
  }

  if (!db) {
    return {
      success: false,
      data: [],
      fromMock: false,
      error: 'Database not initialized'
    };
  }

  try {
    const internshipsRef = collection(db, 'internships');
    const q = query(internshipsRef, where('postedBy', '==', industryUid));
    const snapshot = await getDocs(q);

    const results: InternshipRecord[] = [];
    snapshot.forEach((docSnap) => {
      if (docSnap.exists()) {
        results.push({
          ...(docSnap.data() as InternshipRecord),
          id: docSnap.id
        });
      }
    });

    return {
      success: true,
      data: results,
      fromMock: false
    };
  } catch (error) {
    console.error('[InternshipService] getIndustryInternships error:', error);
    return {
      success: false,
      data: [],
      fromMock: false,
      error: error instanceof Error ? error.message : 'Failed to fetch industry internships'
    };
  }
}

/**
 * Retrieve a single internship record by ID
 */
export async function getInternshipById(
  internshipId: string,
  isDemo = false
): Promise<InternshipServiceResult<InternshipRecord | null>> {
  if (isDemo) {
    const local = loadLocalInternships(true);
    const found = local.find((i) => i.id === internshipId) || null;
    return {
      success: true,
      data: found,
      fromMock: true
    };
  }

  if (!db) {
    return {
      success: false,
      data: null,
      fromMock: false,
      error: 'Database not initialized'
    };
  }

  try {
    const docRef = doc(db, 'internships', internshipId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return {
        success: true,
        data: {
          ...(snap.data() as InternshipRecord),
          id: snap.id
        },
        fromMock: false
      };
    }

    return {
      success: false,
      data: null,
      fromMock: false,
      error: 'Internship record not found'
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      fromMock: false,
      error: error instanceof Error ? error.message : 'Error fetching internship record'
    };
  }
}

/**
 * Create a new Internship record from a Selected Application
 */
export async function createInternshipFromApplication(params: {
  application: ApplicationRecord;
  mentorInfo?: {
    name: string;
    title: string;
    email: string;
    avatar?: string;
    department?: string;
  };
  startDate?: string;
  endDate?: string;
  milestones?: InternshipMilestone[];
  isDemo?: boolean;
}): Promise<InternshipServiceResult<InternshipRecord>> {
  const {
    application,
    mentorInfo,
    startDate = new Date().toISOString().split('T')[0],
    endDate = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    milestones = [
      {
        id: `ms-${Date.now()}-1`,
        title: 'Phase 1: Environment Setup, Architecture Review & Baseline Spec',
        description: 'Complete codebase walkthrough, setup containerized dev environment, and submit architecture plan.',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'In Progress'
      },
      {
        id: `ms-${Date.now()}-2`,
        title: 'Phase 2: Core Feature Implementation & Unit Testing',
        description: 'Implement core modules and achieve >= 85% code coverage.',
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Pending'
      },
      {
        id: `ms-${Date.now()}-3`,
        title: 'Phase 3: Integration, Benchmarking & Staging Verification',
        description: 'Execute end-to-end integration tests and latency benchmarking.',
        dueDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Pending'
      },
      {
        id: `ms-${Date.now()}-4`,
        title: 'Phase 4: Capstone Delivery, Documentation & Final Evaluation',
        description: 'Deliver final engineering capstone, comprehensive documentation, and executive presentation.',
        dueDate: endDate,
        status: 'Pending'
      }
    ],
    isDemo = false
  } = params;

  const nowIso = new Date().toISOString();
  const internshipId = `internship-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  const newRecord: InternshipRecord = {
    id: internshipId,
    applicationId: application.applicationId,
    opportunityId: application.opportunityId,
    studentId: application.studentId,
    studentName: application.studentName || 'Student Intern',
    studentEmail: application.studentEmail || '',
    studentAvatar: application.studentAvatar,
    studentInstitution: application.studentInstitution || 'Verified Engineering College',
    studentDegree: application.studentDegree || 'B.Tech / Equivalent',
    companyName: application.companyName,
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80',
    roleTitle: application.opportunityTitle,
    department: 'Engineering & Innovation Cohort',
    workMode: (application.workMode as any) || 'Hybrid',
    location: application.location || 'Bengaluru, India',
    stipend: application.stipend || '₹40,000 / month',
    startDate,
    endDate,
    status: 'Active',
    mentor: mentorInfo
      ? {
          id: `mentor-${Date.now()}`,
          name: mentorInfo.name,
          title: mentorInfo.title,
          email: mentorInfo.email,
          avatar: mentorInfo.avatar,
          department: mentorInfo.department || 'Engineering'
        }
      : {
          id: 'mentor-default',
          name: 'Industry Lead Mentor',
          title: 'Senior Engineering Manager',
          email: 'mentor@industry.partner.com',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
          department: 'Core Engineering'
        },
    progressPercentage: 10,
    milestones,
    weeklyLogs: [],
    mentorFeedbacks: [],
    postedBy: application.postedBy,
    createdAt: nowIso,
    updatedAt: nowIso
  };

  if (isDemo || !db) {
    const local = loadLocalInternships(true);
    saveLocalInternships([newRecord, ...local]);
    return {
      success: true,
      data: newRecord,
      fromMock: true
    };
  }

  try {
    const docRef = doc(db, 'internships', internshipId);
    await setDoc(docRef, newRecord);

    const local = loadLocalInternships();
    saveLocalInternships([newRecord, ...local]);

    return {
      success: true,
      data: newRecord,
      fromMock: false
    };
  } catch (error) {
    console.error('[InternshipService] createInternshipFromApplication error:', error);
    return {
      success: false,
      data: newRecord,
      fromMock: false,
      error: error instanceof Error ? error.message : 'Failed to create internship in Firestore'
    };
  }
}

/**
 * Add or update an internship milestone
 */
export async function addOrUpdateMilestone(
  internshipId: string,
  milestone: InternshipMilestone,
  isDemo = false
): Promise<InternshipServiceResult<InternshipRecord>> {
  const nowIso = new Date().toISOString();

  const updateLocal = () => {
    const local = loadLocalInternships(true);
    const target = local.find((i) => i.id === internshipId);
    if (!target) throw new Error('Internship not found');

    const existingIdx = target.milestones.findIndex((m) => m.id === milestone.id);
    let updatedMilestones: InternshipMilestone[];
    if (existingIdx >= 0) {
      updatedMilestones = [...target.milestones];
      updatedMilestones[existingIdx] = { ...milestone };
    } else {
      updatedMilestones = [...target.milestones, milestone];
    }

    const progressPercentage = calculateInternshipProgress(updatedMilestones);
    const updatedRecord: InternshipRecord = {
      ...target,
      milestones: updatedMilestones,
      progressPercentage,
      updatedAt: nowIso
    };

    const newLocal = local.map((i) => (i.id === internshipId ? updatedRecord : i));
    saveLocalInternships(newLocal);
    return updatedRecord;
  };

  if (isDemo || !db) {
    try {
      const updated = updateLocal();
      return { success: true, data: updated, fromMock: true };
    } catch (e: any) {
      return { success: false, data: null as any, fromMock: true, error: e.message };
    }
  }

  try {
    const updated = updateLocal();
    const docRef = doc(db, 'internships', internshipId);
    await updateDoc(docRef, {
      milestones: updated.milestones,
      progressPercentage: updated.progressPercentage,
      updatedAt: nowIso
    });

    return { success: true, data: updated, fromMock: false };
  } catch (error) {
    console.error('[InternshipService] addOrUpdateMilestone error:', error);
    return {
      success: false,
      data: null as any,
      fromMock: false,
      error: error instanceof Error ? error.message : 'Failed to update milestone'
    };
  }
}

/**
 * Add a weekly progress log (Student action)
 */
export async function addWeeklyLog(
  internshipId: string,
  log: Omit<InternshipWeeklyLog, 'id' | 'submittedAt'>,
  isDemo = false
): Promise<InternshipServiceResult<InternshipRecord>> {
  const nowIso = new Date().toISOString();
  const logId = `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  const newLog: InternshipWeeklyLog = {
    ...log,
    id: logId,
    submittedAt: nowIso
  };

  const updateLocal = () => {
    const local = loadLocalInternships(true);
    const target = local.find((i) => i.id === internshipId);
    if (!target) throw new Error('Internship not found');

    const updatedLogs = [newLog, ...target.weeklyLogs];
    const updatedRecord: InternshipRecord = {
      ...target,
      weeklyLogs: updatedLogs,
      updatedAt: nowIso
    };

    const newLocal = local.map((i) => (i.id === internshipId ? updatedRecord : i));
    saveLocalInternships(newLocal);
    return updatedRecord;
  };

  if (isDemo || !db) {
    try {
      const updated = updateLocal();
      return { success: true, data: updated, fromMock: true };
    } catch (e: any) {
      return { success: false, data: null as any, fromMock: true, error: e.message };
    }
  }

  try {
    const updated = updateLocal();
    const docRef = doc(db, 'internships', internshipId);
    await updateDoc(docRef, {
      weeklyLogs: updated.weeklyLogs,
      updatedAt: nowIso
    });
    return { success: true, data: updated, fromMock: false };
  } catch (error) {
    return {
      success: false,
      data: null as any,
      fromMock: false,
      error: error instanceof Error ? error.message : 'Failed to add weekly log'
    };
  }
}

/**
 * Add review remarks to a weekly log (Mentor action)
 */
export async function reviewWeeklyLog(
  internshipId: string,
  logId: string,
  mentorRemarks: string,
  isDemo = false
): Promise<InternshipServiceResult<InternshipRecord>> {
  const nowIso = new Date().toISOString();

  const updateLocal = () => {
    const local = loadLocalInternships(true);
    const target = local.find((i) => i.id === internshipId);
    if (!target) throw new Error('Internship not found');

    const updatedLogs = target.weeklyLogs.map((l) =>
      l.id === logId
        ? {
            ...l,
            status: 'Reviewed' as const,
            mentorRemarks,
            mentorReviewedAt: nowIso
          }
        : l
    );

    const updatedRecord: InternshipRecord = {
      ...target,
      weeklyLogs: updatedLogs,
      updatedAt: nowIso
    };

    const newLocal = local.map((i) => (i.id === internshipId ? updatedRecord : i));
    saveLocalInternships(newLocal);
    return updatedRecord;
  };

  if (isDemo || !db) {
    try {
      const updated = updateLocal();
      return { success: true, data: updated, fromMock: true };
    } catch (e: any) {
      return { success: false, data: null as any, fromMock: true, error: e.message };
    }
  }

  try {
    const updated = updateLocal();
    const docRef = doc(db, 'internships', internshipId);
    await updateDoc(docRef, {
      weeklyLogs: updated.weeklyLogs,
      updatedAt: nowIso
    });
    return { success: true, data: updated, fromMock: false };
  } catch (error) {
    return {
      success: false,
      data: null as any,
      fromMock: false,
      error: error instanceof Error ? error.message : 'Failed to review weekly log'
    };
  }
}

/**
 * Add Mentor Feedback (Mentor action)
 */
export async function addMentorFeedback(
  internshipId: string,
  feedback: Omit<InternshipFeedback, 'id' | 'date'>,
  isDemo = false
): Promise<InternshipServiceResult<InternshipRecord>> {
  const nowIso = new Date().toISOString();
  const feedbackId = `fb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  const newFeedback: InternshipFeedback = {
    ...feedback,
    id: feedbackId,
    date: nowIso.split('T')[0]
  };

  const updateLocal = () => {
    const local = loadLocalInternships(true);
    const target = local.find((i) => i.id === internshipId);
    if (!target) throw new Error('Internship not found');

    const updatedFeedbacks = [newFeedback, ...target.mentorFeedbacks];
    const updatedRecord: InternshipRecord = {
      ...target,
      mentorFeedbacks: updatedFeedbacks,
      updatedAt: nowIso
    };

    const newLocal = local.map((i) => (i.id === internshipId ? updatedRecord : i));
    saveLocalInternships(newLocal);
    return updatedRecord;
  };

  if (isDemo || !db) {
    try {
      const updated = updateLocal();
      return { success: true, data: updated, fromMock: true };
    } catch (e: any) {
      return { success: false, data: null as any, fromMock: true, error: e.message };
    }
  }

  try {
    const updated = updateLocal();
    const docRef = doc(db, 'internships', internshipId);
    await updateDoc(docRef, {
      mentorFeedbacks: updated.mentorFeedbacks,
      updatedAt: nowIso
    });
    return { success: true, data: updated, fromMock: false };
  } catch (error) {
    return {
      success: false,
      data: null as any,
      fromMock: false,
      error: error instanceof Error ? error.message : 'Failed to add mentor feedback'
    };
  }
}

/**
 * Submit Final Evaluation & Pre-Placement Offer (PPO) Decision (Mentor/Recruiter action)
 */
export async function submitFinalEvaluation(
  internshipId: string,
  evaluation: Omit<InternshipFinalEvaluation, 'id' | 'evaluatedAt'>,
  isDemo = false
): Promise<InternshipServiceResult<InternshipRecord>> {
  const nowIso = new Date().toISOString();
  const evalId = `eval-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  const finalEvaluation: InternshipFinalEvaluation = {
    ...evaluation,
    id: evalId,
    evaluatedAt: nowIso
  };

  const updateLocal = () => {
    const local = loadLocalInternships(true);
    const target = local.find((i) => i.id === internshipId);
    if (!target) throw new Error('Internship not found');

    const updatedRecord: InternshipRecord = {
      ...target,
      status: 'Under Evaluation',
      finalEvaluation,
      updatedAt: nowIso
    };

    const newLocal = local.map((i) => (i.id === internshipId ? updatedRecord : i));
    saveLocalInternships(newLocal);
    return updatedRecord;
  };

  if (isDemo || !db) {
    try {
      const updated = updateLocal();
      return { success: true, data: updated, fromMock: true };
    } catch (e: any) {
      return { success: false, data: null as any, fromMock: true, error: e.message };
    }
  }

  try {
    const updated = updateLocal();
    const docRef = doc(db, 'internships', internshipId);
    await updateDoc(docRef, {
      status: 'Under Evaluation',
      finalEvaluation,
      updatedAt: nowIso
    });
    return { success: true, data: updated, fromMock: false };
  } catch (error) {
    return {
      success: false,
      data: null as any,
      fromMock: false,
      error: error instanceof Error ? error.message : 'Failed to submit final evaluation'
    };
  }
}

/**
 * Issue Cryptographically Verifiable Completion Certificate (Industry Partner Action)
 */
export async function issueCompletionCertificate(
  internshipId: string,
  completionData: {
    signatoryName: string;
    signatoryTitle: string;
    honorsTag?: 'Distinction' | 'Merit' | 'Excellence in Innovation';
    skillsEndorsed: string[];
  },
  isDemo = false
): Promise<InternshipServiceResult<InternshipRecord>> {
  const nowIso = new Date().toISOString();
  const certId = `SETU-CERT-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const verificationHash = `SETU-INT-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}-VERIFIED`;

  const updateLocal = () => {
    const local = loadLocalInternships(true);
    const target = local.find((i) => i.id === internshipId);
    if (!target) throw new Error('Internship not found');

    const completionRecord: InternshipCompletionRecord = {
      certificateId: certId,
      issueDate: nowIso.split('T')[0],
      issuedBy: `${target.companyName} & SkillSetu National Credential Registry`,
      companyName: target.companyName,
      signatoryName: completionData.signatoryName,
      signatoryTitle: completionData.signatoryTitle,
      verificationHash,
      verificationUrl: `https://skillsetu.ai/verify/${verificationHash}`,
      status: 'Verified',
      honorsTag: completionData.honorsTag || 'Distinction',
      skillsEndorsed: completionData.skillsEndorsed
    };

    const updatedRecord: InternshipRecord = {
      ...target,
      status: 'Completed',
      progressPercentage: 100,
      completionRecord,
      updatedAt: nowIso
    };

    const newLocal = local.map((i) => (i.id === internshipId ? updatedRecord : i));
    saveLocalInternships(newLocal);
    return updatedRecord;
  };

  if (isDemo || !db) {
    try {
      const updated = updateLocal();
      if (updated.completionRecord) {
        documentService.syncCertificateAsDocument(
          {
            ownerId: updated.studentId,
            ownerName: updated.studentName,
            certificateTitle: `${updated.roleTitle} Internship Completion Certificate`,
            issuer: updated.companyName,
            certificateId: updated.completionRecord.certificateId,
            verificationHash: updated.completionRecord.verificationHash,
            issueDate: updated.completionRecord.issueDate,
            skillsEndorsed: updated.completionRecord.skillsEndorsed,
            source: 'Internship Lifecycle'
          },
          true
        ).catch(() => {});
      }
      return { success: true, data: updated, fromMock: true };
    } catch (e: any) {
      return { success: false, data: null as any, fromMock: true, error: e.message };
    }
  }

  try {
    const updated = updateLocal();
    const docRef = doc(db, 'internships', internshipId);
    await updateDoc(docRef, {
      status: 'Completed',
      progressPercentage: 100,
      completionRecord: updated.completionRecord,
      updatedAt: nowIso
    });
    if (updated.completionRecord) {
      documentService.syncCertificateAsDocument(
        {
          ownerId: updated.studentId,
          ownerName: updated.studentName,
          certificateTitle: `${updated.roleTitle} Internship Completion Certificate`,
          issuer: updated.companyName,
          certificateId: updated.completionRecord.certificateId,
          verificationHash: updated.completionRecord.verificationHash,
          issueDate: updated.completionRecord.issueDate,
          skillsEndorsed: updated.completionRecord.skillsEndorsed,
          source: 'Internship Lifecycle'
        },
        false
      ).catch(() => {});
    }
    return { success: true, data: updated, fromMock: false };
  } catch (error) {
    return {
      success: false,
      data: null as any,
      fromMock: false,
      error: error instanceof Error ? error.message : 'Failed to issue completion certificate'
    };
  }
}

/**
 * Upload and link final internship report document
 */
export async function uploadInternshipReport(
  internshipId: string,
  file: File,
  isDemo = false
): Promise<InternshipServiceResult<InternshipRecord>> {
  const nowIso = new Date().toISOString();

  // Handle upload via storage service
  const uploadRes = await storageService.uploadFile({
    path: `internships/${internshipId}/reports`,
    file,
    isDemo
  });

  const reportDoc: InternshipReportDocument = {
    id: `doc-${Date.now()}`,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type || 'application/pdf',
    downloadUrl: uploadRes.data?.downloadUrl || `https://skillsetu.demo/reports/${file.name}`,
    uploadedAt: nowIso,
    storageProvider: uploadRes.fromMock ? 'Local Sandbox / Object Blob' : 'Firebase Storage'
  };

  const updateLocal = () => {
    const local = loadLocalInternships(true);
    const target = local.find((i) => i.id === internshipId);
    if (!target) throw new Error('Internship not found');

    const updatedRecord: InternshipRecord = {
      ...target,
      finalReportDocument: reportDoc,
      updatedAt: nowIso
    };

    const newLocal = local.map((i) => (i.id === internshipId ? updatedRecord : i));
    saveLocalInternships(newLocal);
    return updatedRecord;
  };

  if (isDemo || !db) {
    try {
      const updated = updateLocal();
      documentService.syncInternshipReportAsDocument(
        {
          ownerId: updated.studentId,
          ownerName: updated.studentName,
          internshipId: updated.id,
          internshipTitle: updated.roleTitle,
          companyName: updated.companyName,
          file
        },
        true
      ).catch(() => {});
      return { success: true, data: updated, fromMock: true };
    } catch (e: any) {
      return { success: false, data: null as any, fromMock: true, error: e.message };
    }
  }

  try {
    const updated = updateLocal();
    const docRef = doc(db, 'internships', internshipId);
    await updateDoc(docRef, {
      finalReportDocument: reportDoc,
      updatedAt: nowIso
    });
    documentService.syncInternshipReportAsDocument(
      {
        ownerId: updated.studentId,
        ownerName: updated.studentName,
        internshipId: updated.id,
        internshipTitle: updated.roleTitle,
        companyName: updated.companyName,
        file
      },
      false
    ).catch(() => {});
    return { success: true, data: updated, fromMock: false };
  } catch (error) {
    return {
      success: false,
      data: null as any,
      fromMock: false,
      error: error instanceof Error ? error.message : 'Failed to upload report'
    };
  }
}
