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
  ApplicationRecord,
  ApplicationLifecycleStatus
} from '../types/application';
import { OpportunityRecord } from '../types/opportunity';
import { ExplainableMatchResult } from './matchingService';
import { isOfflineOrNetworkError } from './firestoreService';

export interface ApplicationServiceResult<T> {
  success: boolean;
  data: T;
  fromMock?: boolean;
  error?: string;
}

const LOCAL_APPLICATIONS_KEY = 'skillsetu_local_applications_v1';

// Initial synthetic demo applications for Demo Mode
const INITIAL_DEMO_APPLICATIONS: ApplicationRecord[] = [
  {
    applicationId: 'demo-app-1',
    opportunityId: 'demo-opp-1',
    studentId: 'demo-student-id',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@skillsetu.demo',
    studentInstitution: 'Indian Institute of Technology (IIT)',
    studentDegree: 'B.Tech Computer Science & Engineering',
    companyName: 'Apex Cloud Systems (Demo Partner)',
    opportunityTitle: 'Full-Stack Software Engineer Intern',
    status: 'Shortlisted',
    matchScoreAtApplication: 88,
    requiredSkillMatch: 92,
    preferredSkillMatch: 80,
    matchedSkills: ['Python', 'SQL', 'DSA', 'React'],
    skillGaps: ['Docker'],
    resumeURL: 'https://skillsetu.demo/resumes/aarav_sharma_verified.pdf',
    coverLetter: 'Passionate about building scalable backend microservices and modern reactive interfaces.',
    appliedAt: '2026-08-10T14:20:00.000Z',
    updatedAt: '2026-08-18T10:30:00.000Z',
    recruiterNotes: 'Strong algorithmic fundamentals and high performance in adaptive coding evaluation.',
    postedBy: 'demo-industry-apex',
    location: 'Bengaluru, Karnataka, India',
    workMode: 'Hybrid',
    stipend: '₹45,000 / month',
    opportunityType: 'Internship'
  },
  {
    applicationId: 'demo-app-2',
    opportunityId: 'demo-opp-2',
    studentId: 'demo-student-id',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@skillsetu.demo',
    studentInstitution: 'Indian Institute of Technology (IIT)',
    studentDegree: 'B.Tech Computer Science & Engineering',
    companyName: 'NeuralMetrics Labs (Demo Partner)',
    opportunityTitle: 'Data Science & Machine Learning Intern',
    status: 'Under Review',
    matchScoreAtApplication: 82,
    requiredSkillMatch: 85,
    preferredSkillMatch: 75,
    matchedSkills: ['Python', 'AI/ML', 'Database'],
    skillGaps: ['Cloud Computing'],
    resumeURL: 'https://skillsetu.demo/resumes/aarav_sharma_verified.pdf',
    appliedAt: '2026-08-15T09:15:00.000Z',
    updatedAt: '2026-08-15T09:15:00.000Z',
    recruiterNotes: 'Application received and passed initial ATS benchmark filter.',
    postedBy: 'demo-industry-neural',
    location: 'Hyderabad, Telangana, India',
    workMode: 'Remote',
    stipend: '₹50,000 / month',
    opportunityType: 'Internship'
  }
];

function loadLocalApplications(isDemo = true): ApplicationRecord[] {
  if (typeof window === 'undefined') return isDemo ? INITIAL_DEMO_APPLICATIONS : [];
  try {
    const raw = localStorage.getItem(LOCAL_APPLICATIONS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Fallback
  }
  return isDemo ? INITIAL_DEMO_APPLICATIONS : [];
}

function saveLocalApplications(data: ApplicationRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_APPLICATIONS_KEY, JSON.stringify(data));
  } catch {
    // Fallback
  }
}

/**
 * Apply to an opportunity.
 * Verifies duplicate status, freezes match score snapshot, and records to Firestore.
 */
export async function applyToOpportunity(params: {
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  studentInstitution?: string;
  studentDegree?: string;
  studentAvatar?: string;
  opportunity: OpportunityRecord;
  matchResult: ExplainableMatchResult;
  resumeURL?: string;
  coverLetter?: string;
  isDemo?: boolean;
}): Promise<ApplicationServiceResult<ApplicationRecord>> {
  const {
    studentId,
    studentName = 'Student Applicant',
    studentEmail = '',
    studentInstitution = 'Verified Institution',
    studentDegree = 'B.Tech Computer Science',
    studentAvatar = '',
    opportunity,
    matchResult,
    resumeURL = 'https://skillsetu.ai/verified-profiles/student',
    coverLetter = '',
    isDemo = false
  } = params;

  // 1. DUPLICATE APPLICATION CHECK
  if (isDemo || !db) {
    const local = loadLocalApplications();
    const existing = local.find(
      (a) => a.studentId === studentId && a.opportunityId === opportunity.opportunityId && a.status !== 'Withdrawn'
    );
    if (existing) {
      return {
        success: false,
        data: existing,
        fromMock: true,
        error: 'You have already applied to this opportunity.'
      };
    }
  } else {
    try {
      const appsRef = collection(db, 'applications');
      const q = query(
        appsRef,
        where('studentId', '==', studentId),
        where('opportunityId', '==', opportunity.opportunityId)
      );
      const snap = await getDocs(q);
      const activeExisting = snap.docs.find((d) => d.data().status !== 'Withdrawn');
      if (activeExisting) {
        return {
          success: false,
          data: { ...(activeExisting.data() as ApplicationRecord), applicationId: activeExisting.id },
          fromMock: false,
          error: 'You have already applied to this opportunity.'
        };
      }
    } catch (checkError) {
      console.warn('[ApplicationService] Duplicate check caught error:', checkError);
    }
  }

  // 2. Prepare Application Record with frozen match score snapshot
  const nowIso = new Date().toISOString();
  const applicationId = `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const matchedSkillsList = matchResult.matchedSkills.map((s) => s.skillName);
  const skillGapsList = matchResult.skillGaps;

  const newApplication: ApplicationRecord = {
    applicationId,
    opportunityId: opportunity.opportunityId,
    studentId,
    studentName,
    studentEmail,
    studentInstitution,
    studentDegree,
    studentAvatar,
    companyName: opportunity.companyName,
    opportunityTitle: opportunity.title,
    status: 'Applied',
    matchScoreAtApplication: matchResult.overallMatch,
    requiredSkillMatch: matchResult.requiredSkillMatch,
    preferredSkillMatch: matchResult.preferredSkillMatch,
    matchedSkills: matchedSkillsList,
    skillGaps: skillGapsList,
    resumeURL,
    coverLetter,
    appliedAt: nowIso,
    updatedAt: nowIso,
    recruiterNotes: 'Application submitted successfully. Candidate profile evaluated by deterministic matching engine.',
    postedBy: opportunity.postedBy,
    location: opportunity.location,
    workMode: opportunity.workMode,
    stipend: opportunity.stipend,
    opportunityType: opportunity.opportunityType
  };

  // 3. Persist
  if (isDemo || !db) {
    const local = loadLocalApplications();
    saveLocalApplications([newApplication, ...local]);
    return {
      success: true,
      data: newApplication,
      fromMock: true
    };
  }

  try {
    const docRef = doc(db, 'applications', applicationId);
    await setDoc(docRef, newApplication);

    const local = loadLocalApplications();
    saveLocalApplications([newApplication, ...local]);

    return {
      success: true,
      data: newApplication,
      fromMock: false
    };
  } catch (error) {
    console.error('[ApplicationService] Error applying to opportunity:', error);
    return {
      success: false,
      data: newApplication,
      fromMock: false,
      error: error instanceof Error ? error.message : 'Failed to submit application to Firestore'
    };
  }
}

/**
 * Retrieve all applications for a student.
 */
export async function getStudentApplications(
  studentId: string,
  isDemo = false
): Promise<ApplicationServiceResult<ApplicationRecord[]>> {
  if (isDemo) {
    const local = loadLocalApplications(true);
    const studentApps = local.filter((a) => a.studentId === studentId || studentId === 'demo-student-id');
    return {
      success: true,
      data: studentApps,
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
    const appsRef = collection(db, 'applications');
    const q = query(appsRef, where('studentId', '==', studentId));
    const snapshot = await getDocs(q);

    const results: ApplicationRecord[] = [];
    snapshot.forEach((docSnap) => {
      if (docSnap.exists()) {
        results.push({
          ...(docSnap.data() as ApplicationRecord),
          applicationId: docSnap.id
        });
      }
    });

    // Update local cache
    if (results.length > 0) {
      saveLocalApplications(results);
    }

    return {
      success: true,
      data: results,
      fromMock: false
    };
  } catch (error) {
    console.error('[ApplicationService] getStudentApplications error:', error);
    return {
      success: false,
      data: [],
      fromMock: false,
      error: error instanceof Error ? error.message : 'Error fetching student applications from Firestore'
    };
  }
}

/**
 * Get a single application by ID
 */
export async function getApplicationById(
  applicationId: string,
  isDemo = false
): Promise<ApplicationServiceResult<ApplicationRecord | null>> {
  if (isDemo) {
    const local = loadLocalApplications(true);
    const found = local.find((a) => a.applicationId === applicationId) || null;
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
    const docRef = doc(db, 'applications', applicationId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return {
        success: true,
        data: {
          ...(snap.data() as ApplicationRecord),
          applicationId: snap.id
        },
        fromMock: false
      };
    }

    return {
      success: false,
      data: null,
      fromMock: false,
      error: 'Application not found'
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      fromMock: false,
      error: error instanceof Error ? error.message : 'Error fetching application'
    };
  }
}

/**
 * Withdraw an application (Student Action)
 */
export async function withdrawApplication(
  applicationId: string,
  studentId: string,
  isDemo = false
): Promise<ApplicationServiceResult<boolean>> {
  const nowIso = new Date().toISOString();

  if (isDemo) {
    const local = loadLocalApplications(true);
    const updated = local.map((a) =>
      a.applicationId === applicationId && (a.studentId === studentId || studentId === 'demo-student-id')
        ? { ...a, status: 'Withdrawn' as ApplicationLifecycleStatus, updatedAt: nowIso }
        : a
    );
    saveLocalApplications(updated);
    return {
      success: true,
      data: true,
      fromMock: true
    };
  }

  if (!db) {
    return {
      success: false,
      data: false,
      fromMock: false,
      error: 'Database not initialized'
    };
  }

  try {
    const docRef = doc(db, 'applications', applicationId);
    await updateDoc(docRef, {
      status: 'Withdrawn',
      updatedAt: nowIso
    });

    const local = loadLocalApplications(false);
    const updated = local.map((a) =>
      a.applicationId === applicationId
        ? { ...a, status: 'Withdrawn' as ApplicationLifecycleStatus, updatedAt: nowIso }
        : a
    );
    saveLocalApplications(updated);

    return {
      success: true,
      data: true,
      fromMock: false
    };
  } catch (error) {
    console.error('[ApplicationService] Withdraw error:', error);
    return {
      success: false,
      data: false,
      fromMock: false,
      error: error instanceof Error ? error.message : 'Failed to withdraw application'
    };
  }
}

/**
 * Get all applications for an Opportunity (Industry Recruiter view)
 */
export async function getOpportunityApplications(
  opportunityId: string,
  isDemo = false
): Promise<ApplicationServiceResult<ApplicationRecord[]>> {
  if (isDemo) {
    const local = loadLocalApplications(true);
    const apps = local.filter((a) => a.opportunityId === opportunityId);
    return {
      success: true,
      data: apps,
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
    const appsRef = collection(db, 'applications');
    const q = query(appsRef, where('opportunityId', '==', opportunityId));
    const snapshot = await getDocs(q);

    const results: ApplicationRecord[] = [];
    snapshot.forEach((docSnap) => {
      if (docSnap.exists()) {
        results.push({
          ...(docSnap.data() as ApplicationRecord),
          applicationId: docSnap.id
        });
      }
    });

    return {
      success: true,
      data: results,
      fromMock: false
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      fromMock: false,
      error: error instanceof Error ? error.message : 'Error fetching applications from Firestore'
    };
  }
}

/**
 * Get all applications for an Industry user's postings
 */
export async function getIndustryApplications(
  postedByUid: string,
  isDemo = false
): Promise<ApplicationServiceResult<ApplicationRecord[]>> {
  if (isDemo) {
    const local = loadLocalApplications(true);
    const apps = local.filter((a) => a.postedBy === postedByUid || a.postedBy?.startsWith('demo-industry'));
    return {
      success: true,
      data: apps,
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
    const appsRef = collection(db, 'applications');
    const q = query(appsRef, where('postedBy', '==', postedByUid));
    const snapshot = await getDocs(q);

    const results: ApplicationRecord[] = [];
    snapshot.forEach((docSnap) => {
      if (docSnap.exists()) {
        results.push({
          ...(docSnap.data() as ApplicationRecord),
          applicationId: docSnap.id
        });
      }
    });

    return {
      success: true,
      data: results,
      fromMock: false
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      fromMock: false,
      error: error instanceof Error ? error.message : 'Error fetching industry applications from Firestore'
    };
  }
}

/**
 * Update Application Status & Recruiter Notes (Industry Recruiter Action)
 */
export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationLifecycleStatus,
  recruiterNotes?: string,
  isDemo = false
): Promise<ApplicationServiceResult<boolean>> {
  const nowIso = new Date().toISOString();

  if (isDemo || !db) {
    const local = loadLocalApplications();
    const updated = local.map((a) =>
      a.applicationId === applicationId
        ? {
            ...a,
            status,
            recruiterNotes: recruiterNotes !== undefined ? recruiterNotes : a.recruiterNotes,
            updatedAt: nowIso
          }
        : a
    );
    saveLocalApplications(updated);
    return {
      success: true,
      data: true,
      fromMock: true
    };
  }

  try {
    const docRef = doc(db, 'applications', applicationId);
    const updatePayload: Record<string, unknown> = {
      status,
      updatedAt: nowIso
    };
    if (recruiterNotes !== undefined) {
      updatePayload.recruiterNotes = recruiterNotes;
    }

    await updateDoc(docRef, updatePayload);

    const local = loadLocalApplications();
    const updated = local.map((a) =>
      a.applicationId === applicationId
        ? {
            ...a,
            status,
            recruiterNotes: recruiterNotes !== undefined ? recruiterNotes : a.recruiterNotes,
            updatedAt: nowIso
          }
        : a
    );
    saveLocalApplications(updated);

    return {
      success: true,
      data: true,
      fromMock: false
    };
  } catch (error) {
    console.error('[ApplicationService] Error updating status:', error);
    return {
      success: false,
      data: false,
      fromMock: false,
      error: error instanceof Error ? error.message : 'Failed to update application status in Firestore'
    };
  }
}
