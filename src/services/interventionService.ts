import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  Intervention,
  InterventionEnrollment,
  InterventionRecommendation,
  InterventionStatus,
  InterventionEnrollmentStatus,
  EnrollmentCompletionStatus,
  CurriculumCoverage,
  InstitutionSkillGap
} from '../types/intervention';
import {
  DEMO_INTERVENTIONS,
  DEMO_INTERVENTION_ENROLLMENTS,
  DEMO_INTERVENTION_RECOMMENDATIONS,
  DEMO_CURRICULUM_ALIGNMENTS,
  DEMO_INSTITUTION_SKILL_GAPS
} from '../data/demoInterventions';
import { calculateInstitutionSkillGaps, generateInterventionRecommendations } from './institutionInsightService';

// In-memory store for interactive demo mutations
let inMemoryInterventions = [...DEMO_INTERVENTIONS];
let inMemoryEnrollments = [...DEMO_INTERVENTION_ENROLLMENTS];
let inMemoryRecommendations = [...DEMO_INTERVENTION_RECOMMENDATIONS];
let inMemoryCurriculumCoverage: Record<string, CurriculumCoverage> = {
  skill_cloud: 'Partially Covered',
  skill_docker: 'Not Covered',
  skill_aiml: 'Partially Covered',
  skill_cyber: 'Not Covered',
  skill_fullstack: 'Covered',
  skill_dsa: 'Covered'
};

export const interventionService = {
  // =========================================================================
  // 1. INTERVENTIONS CRUD & LIFECYCLE
  // =========================================================================

  /**
   * Fetches all interventions with optional status/institution filter
   */
  async getInterventions(options?: {
    institutionId?: string;
    status?: InterventionStatus | 'All';
    isDemo?: boolean;
  }): Promise<{ success: boolean; data: Intervention[]; error?: string }> {
    const isDemo = options?.isDemo ?? (!db);

    if (isDemo) {
      let results = [...inMemoryInterventions];
      if (options?.institutionId && options.institutionId !== 'all') {
        results = results.filter((i) => i.institutionId === options.institutionId);
      }
      if (options?.status && options.status !== 'All') {
        results = results.filter((i) => i.status === options.status);
      }
      return { success: true, data: results };
    }

    if (!db) {
      return { success: false, data: [], error: 'Database not initialized' };
    }

    try {
      const interventionsRef = collection(db, 'interventions');
      let q = query(interventionsRef, orderBy('createdAt', 'desc'));

      if (options?.institutionId && options.institutionId !== 'all') {
        q = query(interventionsRef, where('institutionId', '==', options.institutionId), orderBy('createdAt', 'desc'));
      }

      const snapshot = await getDocs(q);
      const interventions: Intervention[] = [];
      snapshot.forEach((docSnap) => {
        interventions.push({ ...(docSnap.data() as Intervention), interventionId: docSnap.id });
      });

      if (options?.status && options.status !== 'All') {
        return { success: true, data: interventions.filter((i) => i.status === options.status) };
      }

      return { success: true, data: interventions };
    } catch (err: any) {
      console.error('Firestore fetch failed for interventions:', err);
      return { success: false, error: err?.message || 'Failed to fetch interventions', data: [] };
    }
  },

  /**
   * Fetches a single intervention by ID
   */
  async getInterventionById(
    interventionId: string,
    isDemo?: boolean
  ): Promise<{ success: boolean; data?: Intervention; error?: string }> {
    if (isDemo || !db) {
      const item = inMemoryInterventions.find((i) => i.interventionId === interventionId);
      if (!item) return { success: false, error: 'Intervention not found' };
      return { success: true, data: item };
    }

    try {
      const docRef = doc(db, 'interventions', interventionId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        return { success: false, error: 'Intervention not found' };
      }
      return { success: true, data: { ...(docSnap.data() as Intervention), interventionId: docSnap.id } };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Error fetching intervention' };
    }
  },

  /**
   * Creates a new Intervention from recommendation or manual entry
   */
  async createIntervention(
    data: Omit<Intervention, 'interventionId' | 'createdAt' | 'updatedAt' | 'enrolledCount' | 'completedCount'>,
    isDemo?: boolean
  ): Promise<{ success: boolean; data?: Intervention; error?: string }> {
    const interventionId = `int_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();

    const newIntervention: Intervention = {
      ...data,
      interventionId,
      enrolledCount: 0,
      completedCount: 0,
      createdAt: now,
      updatedAt: now
    };

    if (isDemo || !db) {
      inMemoryInterventions.unshift(newIntervention);
      return { success: true, data: newIntervention };
    }

    try {
      const docRef = doc(db, 'interventions', interventionId);
      await setDoc(docRef, {
        ...newIntervention,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, data: newIntervention };
    } catch (err: any) {
      console.error('Failed to create intervention in Firestore:', err);
      return { success: false, error: err?.message || 'Failed to create intervention in Firestore' };
    }
  },

  /**
   * Updates intervention lifecycle state (Proposed -> Approved -> Scheduled -> Active -> Completed -> Evaluated)
   */
  async updateInterventionStatus(
    interventionId: string,
    status: InterventionStatus,
    updates?: Partial<Intervention>,
    isDemo?: boolean
  ): Promise<{ success: boolean; data?: Intervention; error?: string }> {
    const now = new Date().toISOString();

    if (isDemo || !db) {
      const index = inMemoryInterventions.findIndex((i) => i.interventionId === interventionId);
      if (index === -1) return { success: false, error: 'Intervention not found' };

      inMemoryInterventions[index] = {
        ...inMemoryInterventions[index],
        ...updates,
        status,
        updatedAt: now
      };
      return { success: true, data: inMemoryInterventions[index] };
    }

    try {
      const docRef = doc(db, 'interventions', interventionId);
      await updateDoc(docRef, {
        ...updates,
        status,
        updatedAt: serverTimestamp()
      });
      const updated = inMemoryInterventions.find((i) => i.interventionId === interventionId);
      return { success: true, data: updated };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  },

  /**
   * Assigns an industry partner to an approved intervention
   */
  async assignIndustryPartner(
    interventionId: string,
    partnerIndustryId: string,
    partnerIndustryName: string,
    mentorsCount: number,
    responsibilities: string,
    isDemo?: boolean
  ): Promise<{ success: boolean; data?: Intervention; error?: string }> {
    return this.updateInterventionStatus(
      interventionId,
      'Scheduled',
      {
        partnerIndustryId,
        partnerIndustryName,
        assignedMentorsCount: mentorsCount,
        industryResponsibilities: responsibilities
      },
      isDemo
    );
  },

  /**
   * Fetches interventions assigned to a specific industry partner
   */
  async getInterventionsForIndustry(
    industryId: string,
    isDemo?: boolean
  ): Promise<{ success: boolean; data: Intervention[]; error?: string }> {
    if (isDemo) {
      // In demo mode return items assigned to industry or mock novacore
      const list = inMemoryInterventions.filter(
        (i) => i.partnerIndustryId === industryId || industryId === 'ind_novacore' || !i.partnerIndustryId
      );
      return { success: true, data: list };
    }

    if (!db) {
      return { success: false, data: [], error: 'Database not initialized' };
    }

    try {
      const q = query(
        collection(db, 'interventions'),
        where('partnerIndustryId', '==', industryId)
      );
      const snap = await getDocs(q);
      const list: Intervention[] = [];
      snap.forEach((d) => list.push({ ...(d.data() as Intervention), interventionId: d.id }));
      return { success: true, data: list };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to fetch interventions for industry', data: [] };
    }
  },

  // =========================================================================
  // 2. STUDENT ENROLLMENT & POST-ASSESSMENT
  // =========================================================================

  /**
   * Enrolls a student into an intervention
   */
  async enrollStudent(
    enrollmentData: Omit<InterventionEnrollment, 'enrollmentId' | 'enrolledAt' | 'status'>,
    isDemo?: boolean
  ): Promise<{ success: boolean; data?: InterventionEnrollment; error?: string }> {
    const existing = inMemoryEnrollments.find(
      (e) => e.interventionId === enrollmentData.interventionId && e.studentId === enrollmentData.studentId
    );
    if (existing) {
      return { success: false, error: 'Student is already enrolled in this intervention.' };
    }

    const enrollmentId = `enr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();

    const newEnrollment: InterventionEnrollment = {
      ...enrollmentData,
      enrollmentId,
      status: 'Enrolled',
      enrolledAt: now,
      completionStatus: 'Pending'
    };

    if (isDemo) {
      inMemoryEnrollments.unshift(newEnrollment);
      // Increment intervention enrolled count
      const intIdx = inMemoryInterventions.findIndex((i) => i.interventionId === enrollmentData.interventionId);
      if (intIdx !== -1) {
        inMemoryInterventions[intIdx].enrolledCount = (inMemoryInterventions[intIdx].enrolledCount || 0) + 1;
      }
      return { success: true, data: newEnrollment };
    }

    if (!db) {
      return { success: false, error: 'Database not initialized' };
    }

    try {
      const docRef = doc(db, 'interventionEnrollments', enrollmentId);
      await setDoc(docRef, {
        ...newEnrollment,
        enrolledAt: serverTimestamp()
      });
      return { success: true, data: newEnrollment };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to enroll student in Firestore' };
    }
  },

  /**
   * Fetches all enrollments for a student
   */
  async getStudentEnrollments(
    studentId: string,
    isDemo?: boolean
  ): Promise<{ success: boolean; data: InterventionEnrollment[]; error?: string }> {
    if (isDemo) {
      const enrollments = inMemoryEnrollments.filter((e) => e.studentId === studentId || studentId === 'student_001');
      return { success: true, data: enrollments };
    }

    if (!db) {
      return { success: false, data: [], error: 'Database not initialized' };
    }

    try {
      const q = query(
        collection(db, 'interventionEnrollments'),
        where('studentId', '==', studentId)
      );
      const snap = await getDocs(q);
      const list: InterventionEnrollment[] = [];
      snap.forEach((d) => list.push({ ...(d.data() as InterventionEnrollment), enrollmentId: d.id }));
      return { success: true, data: list };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to fetch student enrollments', data: [] };
    }
  },

  /**
   * Fetches all enrollments for an intervention
   */
  async getInterventionEnrollments(
    interventionId: string,
    isDemo?: boolean
  ): Promise<{ success: boolean; data: InterventionEnrollment[]; error?: string }> {
    if (isDemo) {
      const list = inMemoryEnrollments.filter((e) => e.interventionId === interventionId);
      return { success: true, data: list };
    }

    if (!db) {
      return { success: false, data: [], error: 'Database not initialized' };
    }

    try {
      const q = query(
        collection(db, 'interventionEnrollments'),
        where('interventionId', '==', interventionId)
      );
      const snap = await getDocs(q);
      const list: InterventionEnrollment[] = [];
      snap.forEach((d) => list.push({ ...(d.data() as InterventionEnrollment), enrollmentId: d.id }));
      return { success: true, data: list };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to fetch intervention enrollments', data: [] };
    }
  },

  /**
   * Completes post-intervention assessment and records measurable skill improvement delta
   */
  async completePostAssessment(
    enrollmentId: string,
    postSkillLevel: number,
    feedback?: string,
    isDemo?: boolean
  ): Promise<{ success: boolean; data?: InterventionEnrollment; error?: string }> {
    const now = new Date().toISOString();

    if (isDemo || !db) {
      const index = inMemoryEnrollments.findIndex((e) => e.enrollmentId === enrollmentId);
      if (index === -1) return { success: false, error: 'Enrollment record not found' };

      const pre = inMemoryEnrollments[index].preSkillLevel || 40;
      const improvement = Math.max(0, postSkillLevel - pre);

      inMemoryEnrollments[index] = {
        ...inMemoryEnrollments[index],
        postSkillLevel,
        improvement,
        assessmentDate: now.split('T')[0],
        status: 'Completed',
        completionStatus: improvement >= 20 ? 'Distinction' : 'Passed',
        completedAt: now,
        outcomeScore: Math.min(100, Math.round(postSkillLevel * 1.1)),
        feedback: feedback || inMemoryEnrollments[index].feedback
      };

      // Also update intervention completion counts and averages
      const interventionId = inMemoryEnrollments[index].interventionId;
      const intIdx = inMemoryInterventions.findIndex((i) => i.interventionId === interventionId);
      if (intIdx !== -1) {
        inMemoryInterventions[intIdx].completedCount = (inMemoryInterventions[intIdx].completedCount || 0) + 1;
        inMemoryInterventions[intIdx].status = 'Evaluated';
        inMemoryInterventions[intIdx].postAvgScore = postSkillLevel;
        inMemoryInterventions[intIdx].measuredImprovement = improvement;
      }

      return { success: true, data: inMemoryEnrollments[index] };
    }

    try {
      const docRef = doc(db, 'interventionEnrollments', enrollmentId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return { success: false, error: 'Enrollment not found' };

      const current = snap.data() as InterventionEnrollment;
      const pre = current.preSkillLevel || 40;
      const improvement = Math.max(0, postSkillLevel - pre);

      const updateData = {
        postSkillLevel,
        improvement,
        assessmentDate: now.split('T')[0],
        status: 'Completed' as InterventionEnrollmentStatus,
        completionStatus: (improvement >= 20 ? 'Distinction' : 'Passed') as EnrollmentCompletionStatus,
        completedAt: serverTimestamp() as any,
        outcomeScore: Math.min(100, Math.round(postSkillLevel * 1.1)),
        feedback: feedback || current.feedback
      };

      await updateDoc(docRef, updateData);
      return { success: true, data: { ...current, ...updateData } };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  },

  // =========================================================================
  // 3. RECOMMENDATIONS & CURRICULUM CONFIGURATION
  // =========================================================================

  /**
   * Retrieves active recommendations for the institution
   */
  async getRecommendations(
    skillGaps?: InstitutionSkillGap[],
    isDemo?: boolean
  ): Promise<{ success: boolean; data: InterventionRecommendation[] }> {
    if (isDemo || !db) {
      if (skillGaps && skillGaps.length > 0) {
        const generated = generateInterventionRecommendations(skillGaps);
        inMemoryRecommendations = generated;
        return { success: true, data: generated };
      }
      return { success: true, data: inMemoryRecommendations };
    }

    // In live mode, generate recommendations based on live/calculated gaps
    const gaps = skillGaps || calculateInstitutionSkillGaps({ customCurriculumCoverage: inMemoryCurriculumCoverage });
    return { success: true, data: generateInterventionRecommendations(gaps) };
  },

  /**
   * Approves a recommendation and launches it as an active/scheduled intervention
   */
  async approveRecommendation(
    recommendationId: string,
    institutionId: string = 'inst_nit',
    institutionName: string = 'National Institute of Technology',
    isDemo?: boolean
  ): Promise<{ success: boolean; data?: Intervention; error?: string }> {
    const rec = inMemoryRecommendations.find((r) => r.recommendationId === recommendationId);
    if (!rec) return { success: false, error: 'Recommendation not found' };

    rec.status = 'Approved';

    // Create corresponding intervention
    const startDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
    const endDate = new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0];

    return this.createIntervention(
      {
        institutionId,
        institutionName,
        skillId: rec.skillId,
        skillName: rec.skillName,
        recommendationId: rec.recommendationId,
        interventionType: rec.interventionType,
        title: rec.title,
        description: rec.description,
        startDate,
        endDate,
        capacity: 40,
        status: 'Approved',
        preAvgScore: 40
      },
      isDemo
    );
  },

  /**
   * Configures institutional curriculum coverage for a skill ('Covered' | 'Partially Covered' | 'Not Covered')
   */
  updateCurriculumCoverage(
    skillId: string,
    coverage: CurriculumCoverage
  ): Record<string, CurriculumCoverage> {
    inMemoryCurriculumCoverage[skillId] = coverage;
    return { ...inMemoryCurriculumCoverage };
  },

  /**
   * Retrieves configured curriculum coverage map
   */
  getCurriculumCoverage(): Record<string, CurriculumCoverage> {
    return { ...inMemoryCurriculumCoverage };
  }
};
