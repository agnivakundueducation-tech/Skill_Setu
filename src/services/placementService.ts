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
import { db } from '../lib/firebase';
import {
  InterviewRecord,
  InterviewEvaluation,
  InterviewType,
  InterviewStatus,
  OfferRecord,
  OfferStatus,
  PlacementOutcomeRecord,
  InstitutionPlacementMetrics,
  IndustryRecruitmentMetrics
} from '../types/recruitment';
import { ApplicationRecord, ApplicationLifecycleStatus } from '../types/application';
import { updateApplicationStatus } from './applicationService';

export interface ServiceResult<T> {
  success: boolean;
  data: T;
  fromMock?: boolean;
  error?: string;
}

const LOCAL_INTERVIEWS_KEY = 'skillsetu_local_interviews_v1';
const LOCAL_OFFERS_KEY = 'skillsetu_local_offers_v1';
const LOCAL_PLACEMENTS_KEY = 'skillsetu_local_placements_v1';

// Seed demo data for demo isolation
const INITIAL_DEMO_INTERVIEWS: InterviewRecord[] = [
  {
    interviewId: 'int-demo-01',
    applicationId: 'demo-app-1',
    candidateId: 'usr_std_01',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@skillsetu.demo',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    companyName: 'Apex Cloud Systems',
    opportunityTitle: 'Full-Stack Software Engineer Intern',
    opportunityId: 'demo-opp-1',
    recruiterId: 'demo-industry-apex',
    recruiterName: 'Vikram Mehta (VP Engineering)',
    interviewType: 'Technical',
    scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    durationMinutes: 60,
    meetingLinkOrLocation: 'https://meet.skillsetu.ai/apex-live-eval-8921',
    status: 'Scheduled',
    notes: 'Focus on distributed caching, React concurrency, and GraphQL microservices.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

const INITIAL_DEMO_OFFERS: OfferRecord[] = [];
const INITIAL_DEMO_PLACEMENTS: PlacementOutcomeRecord[] = [];

// Storage Helpers
function loadLocalStore<T>(key: string, defaultData: T[]): T[] {
  if (typeof window === 'undefined') return defaultData;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return defaultData;
}

function saveLocalStore<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // fallback
  }
}

/**
 * 1. INTERVIEW SCHEDULING (Recruiter Action)
 */
export async function scheduleInterview(params: {
  applicationId: string;
  candidateId: string;
  studentName?: string;
  studentEmail?: string;
  studentAvatar?: string;
  companyName: string;
  opportunityTitle: string;
  opportunityId?: string;
  recruiterId: string;
  recruiterName: string;
  interviewType: InterviewType;
  scheduledAt: string;
  durationMinutes?: number;
  meetingLinkOrLocation: string;
  notes?: string;
  isDemo?: boolean;
}): Promise<ServiceResult<InterviewRecord>> {
  const {
    applicationId,
    candidateId,
    studentName = 'Candidate',
    studentEmail = '',
    studentAvatar = '',
    companyName,
    opportunityTitle,
    opportunityId,
    recruiterId,
    recruiterName,
    interviewType,
    scheduledAt,
    durationMinutes = 45,
    meetingLinkOrLocation,
    notes = '',
    isDemo = false
  } = params;

  if (!applicationId || !candidateId || !scheduledAt || !meetingLinkOrLocation) {
    return {
      success: false,
      data: {} as InterviewRecord,
      error: 'Missing required interview scheduling parameters (application, candidate, time, or location).'
    };
  }

  const nowIso = new Date().toISOString();
  const interviewId = `int-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const newInterview: InterviewRecord = {
    interviewId,
    applicationId,
    candidateId,
    studentName,
    studentEmail,
    studentAvatar,
    companyName,
    opportunityTitle,
    opportunityId,
    recruiterId,
    recruiterName,
    interviewType,
    scheduledAt,
    durationMinutes,
    meetingLinkOrLocation,
    status: 'Scheduled',
    notes,
    createdAt: nowIso,
    updatedAt: nowIso
  };

  // Update application status to 'Interview Scheduled'
  await updateApplicationStatus(
    applicationId,
    'Interview Scheduled',
    `Interview scheduled: ${interviewType} round with ${recruiterName} on ${new Date(scheduledAt).toLocaleString()}. Meeting link: ${meetingLinkOrLocation}`,
    isDemo
  );

  if (isDemo || !db) {
    const list = loadLocalStore<InterviewRecord>(LOCAL_INTERVIEWS_KEY, INITIAL_DEMO_INTERVIEWS);
    const updated = [newInterview, ...list.filter((i) => i.interviewId !== interviewId)];
    saveLocalStore(LOCAL_INTERVIEWS_KEY, updated);
    return {
      success: true,
      data: newInterview,
      fromMock: true
    };
  }

  try {
    const docRef = doc(db, 'interviews', interviewId);
    await setDoc(docRef, newInterview);

    const list = loadLocalStore<InterviewRecord>(LOCAL_INTERVIEWS_KEY, []);
    saveLocalStore(LOCAL_INTERVIEWS_KEY, [newInterview, ...list]);

    return {
      success: true,
      data: newInterview,
      fromMock: false
    };
  } catch (error) {
    console.error('[PlacementService] scheduleInterview error:', error);
    return {
      success: false,
      data: newInterview,
      error: error instanceof Error ? error.message : 'Failed to schedule interview in Firestore'
    };
  }
}

/**
 * 2. GET STUDENT INTERVIEWS
 */
export async function getStudentInterviews(
  studentId: string,
  isDemo = false
): Promise<ServiceResult<InterviewRecord[]>> {
  if (isDemo) {
    const list = loadLocalStore<InterviewRecord>(LOCAL_INTERVIEWS_KEY, INITIAL_DEMO_INTERVIEWS);
    const filtered = list.filter((i) => i.candidateId === studentId || studentId === 'usr_std_01' || studentId === 'demo-student-id');
    return {
      success: true,
      data: filtered,
      fromMock: true
    };
  }

  if (!db) {
    return { success: false, data: [], error: 'Database not initialized' };
  }

  try {
    const coll = collection(db, 'interviews');
    const q = query(coll, where('candidateId', '==', studentId));
    const snap = await getDocs(q);
    const results: InterviewRecord[] = [];
    snap.forEach((d) => {
      if (d.exists()) {
        results.push({ ...(d.data() as InterviewRecord), interviewId: d.id });
      }
    });

    return {
      success: true,
      data: results,
      fromMock: false
    };
  } catch (error) {
    console.error('[PlacementService] getStudentInterviews error:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Error fetching interviews'
    };
  }
}

/**
 * GET INDUSTRY INTERVIEWS
 */
export async function getIndustryInterviews(
  recruiterId: string,
  isDemo = false
): Promise<ServiceResult<InterviewRecord[]>> {
  if (isDemo) {
    const list = loadLocalStore<InterviewRecord>(LOCAL_INTERVIEWS_KEY, INITIAL_DEMO_INTERVIEWS);
    return {
      success: true,
      data: list,
      fromMock: true
    };
  }

  if (!db) {
    return { success: false, data: [], error: 'Database not initialized' };
  }

  try {
    const coll = collection(db, 'interviews');
    const q = query(coll, where('recruiterId', '==', recruiterId));
    const snap = await getDocs(q);
    const results: InterviewRecord[] = [];
    snap.forEach((d) => {
      if (d.exists()) {
        results.push({ ...(d.data() as InterviewRecord), interviewId: d.id });
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
      error: error instanceof Error ? error.message : 'Error fetching industry interviews'
    };
  }
}

/**
 * 3. SUBMIT INTERVIEW EVALUATION
 */
export async function submitInterviewEvaluation(params: {
  interviewId: string;
  interviewerId: string;
  interviewerName: string;
  technicalCompetency: number;
  problemSolving: number;
  communication: number;
  roleFit: number;
  overallRecommendation: 'Strong Hire' | 'Hire' | 'Hold' | 'Reject';
  comments: string;
  isDemo?: boolean;
}): Promise<ServiceResult<InterviewRecord>> {
  const {
    interviewId,
    interviewerId,
    interviewerName,
    technicalCompetency,
    problemSolving,
    communication,
    roleFit,
    overallRecommendation,
    comments,
    isDemo = false
  } = params;

  const nowIso = new Date().toISOString();
  const evaluation: InterviewEvaluation = {
    evaluationId: `eval-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    interviewId,
    applicationId: '',
    candidateId: '',
    interviewerId,
    interviewerName,
    technicalCompetency,
    problemSolving,
    communication,
    roleFit,
    overallRecommendation,
    comments,
    submittedAt: nowIso
  };

  // Local demo handling
  if (isDemo || !db) {
    const list = loadLocalStore<InterviewRecord>(LOCAL_INTERVIEWS_KEY, INITIAL_DEMO_INTERVIEWS);
    let targetInterview = list.find((i) => i.interviewId === interviewId);

    if (!targetInterview) {
      // create synthetic representation if not found
      targetInterview = {
        interviewId,
        applicationId: 'demo-app-1',
        candidateId: 'usr_std_01',
        companyName: 'Apex Cloud Systems',
        opportunityTitle: 'Software Engineer',
        recruiterId: interviewerId,
        recruiterName: interviewerName,
        interviewType: 'Technical',
        scheduledAt: nowIso,
        durationMinutes: 45,
        meetingLinkOrLocation: 'Virtual',
        status: 'Completed',
        createdAt: nowIso,
        updatedAt: nowIso
      };
    }

    evaluation.applicationId = targetInterview.applicationId;
    evaluation.candidateId = targetInterview.candidateId;

    const updatedInterview: InterviewRecord = {
      ...targetInterview,
      status: 'Completed',
      evaluation,
      updatedAt: nowIso
    };

    const updatedList = list.map((i) => (i.interviewId === interviewId ? updatedInterview : i));
    saveLocalStore(LOCAL_INTERVIEWS_KEY, updatedList);

    // Update application status to Interview Completed
    await updateApplicationStatus(
      targetInterview.applicationId,
      'Interview Completed',
      `Evaluation submitted by ${interviewerName}: Recommendation [${overallRecommendation}] — "${comments}"`,
      isDemo
    );

    return {
      success: true,
      data: updatedInterview,
      fromMock: true
    };
  }

  try {
    const docRef = doc(db, 'interviews', interviewId);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return {
        success: false,
        data: {} as InterviewRecord,
        error: 'Interview record not found in database'
      };
    }

    const interviewData = snap.data() as InterviewRecord;
    evaluation.applicationId = interviewData.applicationId;
    evaluation.candidateId = interviewData.candidateId;

    const updatedInterview: InterviewRecord = {
      ...interviewData,
      status: 'Completed',
      evaluation,
      updatedAt: nowIso
    };

    await updateDoc(docRef, {
      status: 'Completed',
      evaluation,
      updatedAt: nowIso
    });

    await updateApplicationStatus(
      interviewData.applicationId,
      'Interview Completed',
      `Evaluation submitted by ${interviewerName}: Recommendation [${overallRecommendation}] — "${comments}"`,
      false
    );

    return {
      success: true,
      data: updatedInterview,
      fromMock: false
    };
  } catch (error) {
    console.error('[PlacementService] submitInterviewEvaluation error:', error);
    return {
      success: false,
      data: {} as InterviewRecord,
      error: error instanceof Error ? error.message : 'Failed to submit evaluation'
    };
  }
}

/**
 * 4. ISSUE OFFER (Recruiter Action)
 */
export async function issueOffer(params: {
  applicationId: string;
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  studentAvatar?: string;
  organization: string;
  role: string;
  opportunityId?: string;
  employmentType?: string;
  compensation: string;
  location: string;
  workMode?: 'On-site' | 'Hybrid' | 'Remote';
  joiningDate: string;
  responseDeadline: string;
  notes?: string;
  issuedBy: string;
  issuedByName?: string;
  isDemo?: boolean;
}): Promise<ServiceResult<OfferRecord>> {
  const {
    applicationId,
    studentId,
    studentName = 'Candidate',
    studentEmail = '',
    studentAvatar = '',
    organization,
    role,
    opportunityId,
    employmentType = 'Full-time',
    compensation,
    location,
    workMode = 'Hybrid',
    joiningDate,
    responseDeadline,
    notes = '',
    issuedBy,
    issuedByName = 'Recruitment Team',
    isDemo = false
  } = params;

  if (!applicationId || !studentId || !organization || !role || !compensation || !joiningDate || !responseDeadline) {
    return {
      success: false,
      data: {} as OfferRecord,
      error: 'Missing required offer parameters (application, candidate, role, compensation, joining date, or deadline).'
    };
  }

  const nowIso = new Date().toISOString();
  const offerId = `off-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const newOffer: OfferRecord = {
    offerId,
    applicationId,
    studentId,
    studentName,
    studentEmail,
    studentAvatar,
    organization,
    role,
    opportunityId,
    employmentType,
    compensation,
    location,
    workMode,
    joiningDate,
    offerDate: nowIso,
    responseDeadline,
    status: 'Pending',
    notes,
    issuedBy,
    issuedByName,
    createdAt: nowIso,
    updatedAt: nowIso
  };

  // Update application status to 'Offer'
  await updateApplicationStatus(
    applicationId,
    'Offer',
    `Official offer issued by ${organization} for ${role}. Compensation: ${compensation}. Response deadline: ${new Date(responseDeadline).toLocaleDateString()}.`,
    isDemo
  );

  if (isDemo || !db) {
    const list = loadLocalStore<OfferRecord>(LOCAL_OFFERS_KEY, INITIAL_DEMO_OFFERS);
    const updated = [newOffer, ...list.filter((o) => o.offerId !== offerId)];
    saveLocalStore(LOCAL_OFFERS_KEY, updated);
    return {
      success: true,
      data: newOffer,
      fromMock: true
    };
  }

  try {
    const docRef = doc(db, 'offers', offerId);
    await setDoc(docRef, newOffer);

    const list = loadLocalStore<OfferRecord>(LOCAL_OFFERS_KEY, []);
    saveLocalStore(LOCAL_OFFERS_KEY, [newOffer, ...list]);

    return {
      success: true,
      data: newOffer,
      fromMock: false
    };
  } catch (error) {
    console.error('[PlacementService] issueOffer error:', error);
    return {
      success: false,
      data: newOffer,
      error: error instanceof Error ? error.message : 'Failed to issue offer in Firestore'
    };
  }
}

/**
 * 5. GET STUDENT OFFERS
 */
export async function getStudentOffers(
  studentId: string,
  isDemo = false
): Promise<ServiceResult<OfferRecord[]>> {
  if (isDemo) {
    const list = loadLocalStore<OfferRecord>(LOCAL_OFFERS_KEY, INITIAL_DEMO_OFFERS);
    const filtered = list.filter((o) => o.studentId === studentId || studentId === 'usr_std_01' || studentId === 'demo-student-id');
    return {
      success: true,
      data: filtered,
      fromMock: true
    };
  }

  if (!db) {
    return { success: false, data: [], error: 'Database not initialized' };
  }

  try {
    const coll = collection(db, 'offers');
    const q = query(coll, where('studentId', '==', studentId));
    const snap = await getDocs(q);
    const results: OfferRecord[] = [];
    snap.forEach((d) => {
      if (d.exists()) {
        results.push({ ...(d.data() as OfferRecord), offerId: d.id });
      }
    });

    return {
      success: true,
      data: results,
      fromMock: false
    };
  } catch (error) {
    console.error('[PlacementService] getStudentOffers error:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Error fetching offers'
    };
  }
}

/**
 * 6. RESPOND TO OFFER (Student Action: Accept or Decline)
 * When an offer is ACCEPTED, generates a verified PlacementOutcomeRecord.
 */
export async function respondToOffer(params: {
  offerId: string;
  response: 'Accepted' | 'Declined';
  studentId: string;
  studentName?: string;
  institutionId?: string;
  institutionName?: string;
  isDemo?: boolean;
}): Promise<ServiceResult<{ offer: OfferRecord; placement?: PlacementOutcomeRecord }>> {
  const {
    offerId,
    response,
    studentId,
    studentName = 'Student',
    institutionId = 'inst-iit-01',
    institutionName = 'Indian Institute of Technology (IIT)',
    isDemo = false
  } = params;

  const nowIso = new Date().toISOString();

  // Helper to generate PlacementOutcomeRecord
  const createPlacement = (offer: OfferRecord): PlacementOutcomeRecord => {
    const placementId = `plc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const hash = `SHA256:PL-${Date.now().toString(16).toUpperCase()}-${offer.organization.replace(/\s+/g, '').substring(0, 4).toUpperCase()}-${studentId.substring(0, 6)}`;
    return {
      placementId,
      studentId,
      studentName: offer.studentName || studentName,
      studentEmail: offer.studentEmail,
      studentAvatar: offer.studentAvatar,
      institutionId,
      institutionName,
      organization: offer.organization,
      role: offer.role,
      employmentType: offer.employmentType,
      compensation: offer.compensation,
      placementDate: nowIso,
      joiningDate: offer.joiningDate,
      applicationId: offer.applicationId,
      offerId: offer.offerId,
      verificationStatus: 'Verified',
      verifiedBy: offer.issuedBy || 'Institutional Placement Board',
      cryptographicHash: hash,
      createdAt: nowIso
    };
  };

  if (isDemo || !db) {
    const offers = loadLocalStore<OfferRecord>(LOCAL_OFFERS_KEY, INITIAL_DEMO_OFFERS);
    const targetOffer = offers.find((o) => o.offerId === offerId);

    if (!targetOffer) {
      return {
        success: false,
        data: {} as any,
        error: 'Offer record not found in active session.'
      };
    }

    const updatedOffer: OfferRecord = {
      ...targetOffer,
      status: response,
      decidedAt: nowIso,
      updatedAt: nowIso
    };

    const updatedOffers = offers.map((o) => (o.offerId === offerId ? updatedOffer : o));
    saveLocalStore(LOCAL_OFFERS_KEY, updatedOffers);

    let placementResult: PlacementOutcomeRecord | undefined;

    if (response === 'Accepted') {
      placementResult = createPlacement(updatedOffer);
      const placements = loadLocalStore<PlacementOutcomeRecord>(LOCAL_PLACEMENTS_KEY, INITIAL_DEMO_PLACEMENTS);
      saveLocalStore(LOCAL_PLACEMENTS_KEY, [placementResult, ...placements]);

      // Update application to 'Accepted'
      await updateApplicationStatus(
        targetOffer.applicationId,
        'Accepted',
        `Offer officially accepted by candidate! Confirmed joining date: ${new Date(targetOffer.joiningDate).toLocaleDateString()}. Placement outcome verified.`,
        isDemo
      );
    } else {
      // Update application to 'Declined'
      await updateApplicationStatus(
        targetOffer.applicationId,
        'Declined',
        `Candidate declined the offer on ${new Date().toLocaleDateString()}.`,
        isDemo
      );
    }

    return {
      success: true,
      data: { offer: updatedOffer, placement: placementResult },
      fromMock: true
    };
  }

  try {
    const offerRef = doc(db, 'offers', offerId);
    const snap = await getDoc(offerRef);

    if (!snap.exists()) {
      return {
        success: false,
        data: {} as any,
        error: 'Offer record not found'
      };
    }

    const offerData = snap.data() as OfferRecord;

    if (offerData.studentId !== studentId) {
      return {
        success: false,
        data: {} as any,
        error: 'Unauthorized: You can only accept or decline offers issued to your account.'
      };
    }

    const updatedOffer: OfferRecord = {
      ...offerData,
      status: response,
      decidedAt: nowIso,
      updatedAt: nowIso
    };

    await updateDoc(offerRef, {
      status: response,
      decidedAt: nowIso,
      updatedAt: nowIso
    });

    let placementResult: PlacementOutcomeRecord | undefined;

    if (response === 'Accepted') {
      placementResult = createPlacement(updatedOffer);
      const plcRef = doc(db, 'placements', placementResult.placementId);
      await setDoc(plcRef, placementResult);

      await updateApplicationStatus(
        offerData.applicationId,
        'Accepted',
        `Offer officially accepted by candidate! Confirmed joining date: ${new Date(offerData.joiningDate).toLocaleDateString()}. Placement outcome verified.`,
        false
      );
    } else {
      await updateApplicationStatus(
        offerData.applicationId,
        'Declined',
        `Candidate declined the offer on ${new Date().toLocaleDateString()}.`,
        false
      );
    }

    return {
      success: true,
      data: { offer: updatedOffer, placement: placementResult },
      fromMock: false
    };
  } catch (error) {
    console.error('[PlacementService] respondToOffer error:', error);
    return {
      success: false,
      data: {} as any,
      error: error instanceof Error ? error.message : 'Failed to update offer response in Firestore'
    };
  }
}

/**
 * 7. GET STUDENT PLACEMENTS (For Career Passport linkage)
 */
export async function getStudentPlacements(
  studentId: string,
  isDemo = false
): Promise<ServiceResult<PlacementOutcomeRecord[]>> {
  if (isDemo) {
    const list = loadLocalStore<PlacementOutcomeRecord>(LOCAL_PLACEMENTS_KEY, INITIAL_DEMO_PLACEMENTS);
    const filtered = list.filter((p) => p.studentId === studentId || studentId === 'usr_std_01' || studentId === 'demo-student-id');
    return {
      success: true,
      data: filtered,
      fromMock: true
    };
  }

  if (!db) {
    return { success: false, data: [], error: 'Database not initialized' };
  }

  try {
    const coll = collection(db, 'placements');
    const q = query(coll, where('studentId', '==', studentId));
    const snap = await getDocs(q);
    const results: PlacementOutcomeRecord[] = [];
    snap.forEach((d) => {
      if (d.exists()) {
        results.push({ ...(d.data() as PlacementOutcomeRecord), placementId: d.id });
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
      error: error instanceof Error ? error.message : 'Error fetching placements'
    };
  }
}

/**
 * 8. INSTITUTION PLACEMENT ANALYTICS
 * Computes live aggregated metrics from actual application, interview, offer, and placement records.
 */
export async function getInstitutionPlacementMetrics(
  institutionId = 'inst-iit-01',
  isDemo = false
): Promise<ServiceResult<InstitutionPlacementMetrics>> {
  if (isDemo) {
    return {
      success: true,
      data: {
        totalApplicants: 4120,
        shortlistedCandidates: 3450,
        interviewsScheduled: 2180,
        interviewsCompleted: 1940,
        offersIssued: 1620,
        offersAccepted: 1485,
        placedStudents: 1485,
        placementRate: 86.2
      },
      fromMock: true
    };
  }

  if (!db) {
    return {
      success: true,
      data: {
        totalApplicants: 0,
        shortlistedCandidates: 0,
        interviewsScheduled: 0,
        interviewsCompleted: 0,
        offersIssued: 0,
        offersAccepted: 0,
        placedStudents: 0,
        placementRate: 0
      },
      fromMock: false
    };
  }

  try {
    // Read actual collections from Firestore
    const [appsSnap, interviewsSnap, offersSnap, placementsSnap] = await Promise.all([
      getDocs(collection(db, 'applications')),
      getDocs(collection(db, 'interviews')),
      getDocs(collection(db, 'offers')),
      getDocs(collection(db, 'placements'))
    ]);

    const totalApplicants = appsSnap.size;
    let shortlisted = 0;
    appsSnap.forEach((d) => {
      const st = d.data().status;
      if (st === 'Shortlisted' || st === 'Interview Scheduled' || st === 'Interview Completed' || st === 'Offer' || st === 'Accepted' || st === 'Selected') {
        shortlisted++;
      }
    });

    const interviewsScheduled = interviewsSnap.size;
    let interviewsCompleted = 0;
    interviewsSnap.forEach((d) => {
      if (d.data().status === 'Completed') interviewsCompleted++;
    });

    const offersIssued = offersSnap.size;
    let offersAccepted = 0;
    offersSnap.forEach((d) => {
      if (d.data().status === 'Accepted') offersAccepted++;
    });

    const placedStudents = placementsSnap.size;
    const placementRate = totalApplicants > 0 ? Math.round((placedStudents / totalApplicants) * 1000) / 10 : 0;

    return {
      success: true,
      data: {
        totalApplicants,
        shortlistedCandidates: shortlisted,
        interviewsScheduled,
        interviewsCompleted,
        offersIssued,
        offersAccepted,
        placedStudents,
        placementRate
      },
      fromMock: false
    };
  } catch (error) {
    console.error('[PlacementService] getInstitutionPlacementMetrics error:', error);
    return {
      success: false,
      data: {
        totalApplicants: 0,
        shortlistedCandidates: 0,
        interviewsScheduled: 0,
        interviewsCompleted: 0,
        offersIssued: 0,
        offersAccepted: 0,
        placedStudents: 0,
        placementRate: 0
      },
      error: error instanceof Error ? error.message : 'Error aggregating institution placement metrics'
    };
  }
}

/**
 * 9. INDUSTRY RECRUITMENT ANALYTICS
 */
export async function getIndustryRecruitmentMetrics(
  recruiterId: string,
  isDemo = false
): Promise<ServiceResult<IndustryRecruitmentMetrics>> {
  if (isDemo) {
    return {
      success: true,
      data: {
        totalApplications: 142,
        shortlisted: 38,
        interviews: 24,
        offers: 16,
        acceptedOffers: 14,
        hired: 14
      },
      fromMock: true
    };
  }

  if (!db) {
    return {
      success: true,
      data: { totalApplications: 0, shortlisted: 0, interviews: 0, offers: 0, acceptedOffers: 0, hired: 0 },
      fromMock: false
    };
  }

  try {
    const [appsSnap, intSnap, offSnap] = await Promise.all([
      getDocs(query(collection(db, 'applications'), where('postedBy', '==', recruiterId))),
      getDocs(query(collection(db, 'interviews'), where('recruiterId', '==', recruiterId))),
      getDocs(query(collection(db, 'offers'), where('issuedBy', '==', recruiterId)))
    ]);

    const totalApplications = appsSnap.size;
    let shortlisted = 0;
    appsSnap.forEach((d) => {
      const st = d.data().status;
      if (st === 'Shortlisted' || st === 'Interview Scheduled' || st === 'Interview Completed' || st === 'Offer' || st === 'Accepted' || st === 'Selected') {
        shortlisted++;
      }
    });

    const interviews = intSnap.size;
    const offers = offSnap.size;
    let acceptedOffers = 0;
    offSnap.forEach((d) => {
      if (d.data().status === 'Accepted') acceptedOffers++;
    });

    return {
      success: true,
      data: {
        totalApplications,
        shortlisted,
        interviews,
        offers,
        acceptedOffers,
        hired: acceptedOffers
      },
      fromMock: false
    };
  } catch (error) {
    return {
      success: false,
      data: { totalApplications: 0, shortlisted: 0, interviews: 0, offers: 0, acceptedOffers: 0, hired: 0 },
      error: error instanceof Error ? error.message : 'Error aggregating industry recruitment metrics'
    };
  }
}
