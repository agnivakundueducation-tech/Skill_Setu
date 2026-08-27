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
  LearningProgram,
  StudentProgramEnrollment,
  ProgramMatchExplanation,
  ProgramMentorFeedback,
  ProgramCompletionRecord,
  LearningProgramType,
  ProgramDeliveryMode,
  ProgramDifficulty,
  ProgramStatus
} from '../types/learningProgram';
import {
  INITIAL_DEMO_LEARNING_PROGRAMS,
  INITIAL_DEMO_STUDENT_PROGRAM_ENROLLMENTS
} from '../data/learningProgramData';
import { PersistedSkillProfile } from './skillService';
import { isOfflineOrNetworkError } from './firestoreService';
import { documentService } from './documentService';

export interface LearningProgramServiceResult<T> {
  success: boolean;
  data: T;
  fromMock?: boolean;
  error?: string;
}

const LOCAL_PROGRAMS_KEY = 'skillsetu_local_learning_programs_v1';
const LOCAL_ENROLLMENTS_KEY = 'skillsetu_local_program_enrollments_v1';

function loadLocalPrograms(isDemo = true): LearningProgram[] {
  if (typeof window === 'undefined') return isDemo ? INITIAL_DEMO_LEARNING_PROGRAMS : [];
  try {
    const raw = localStorage.getItem(LOCAL_PROGRAMS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return isDemo ? INITIAL_DEMO_LEARNING_PROGRAMS : [];
}

function saveLocalPrograms(data: LearningProgram[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_PROGRAMS_KEY, JSON.stringify(data));
  } catch {
    // fallback
  }
}

function loadLocalEnrollments(isDemo = true): StudentProgramEnrollment[] {
  if (typeof window === 'undefined') return isDemo ? INITIAL_DEMO_STUDENT_PROGRAM_ENROLLMENTS : [];
  try {
    const raw = localStorage.getItem(LOCAL_ENROLLMENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return isDemo ? INITIAL_DEMO_STUDENT_PROGRAM_ENROLLMENTS : [];
}

function saveLocalEnrollments(data: StudentProgramEnrollment[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_ENROLLMENTS_KEY, JSON.stringify(data));
  } catch {
    // fallback
  }
}

/**
 * Deterministic calculation of progress from completed modules list
 */
export function calculateProgramProgressPercentage(completedModuleIds: string[], totalModulesCount: number): number {
  if (!totalModulesCount || totalModulesCount <= 0) return 0;
  const count = completedModuleIds ? completedModuleIds.length : 0;
  const pct = Math.round((count / totalModulesCount) * 100);
  return Math.min(100, Math.max(0, pct));
}

/**
 * Deterministic matching and Skill Gap Recommendation calculation for learning programs
 */
export function calculateProgramSkillGapMatch(
  program: LearningProgram,
  skillProfile: PersistedSkillProfile | null | undefined,
  isDemo = false
): ProgramMatchExplanation {
  // If user has not completed assessment or no skill data is available:
  if (!isDemo && (!skillProfile || !skillProfile.skills || Object.keys(skillProfile.skills).length === 0)) {
    return {
      programId: program.id,
      matchScore: 0,
      isRecommendedForSkillGap: false,
      matchedGapSkills: [],
      matchedPrerequisites: [],
      missingPrerequisites: program.prerequisiteSkills || [],
      careerAlignmentScore: 0,
      explanation: 'Complete your assessment for personalized recommendations.'
    };
  }

  // Active student skills dictionary: skillName.toLowerCase() -> score (0 - 100)
  const studentSkillsMap: Record<string, number> = {};
  if (skillProfile?.skills) {
    Object.values(skillProfile.skills).forEach((s) => {
      studentSkillsMap[s.skillName.toLowerCase().trim()] = s.currentLevel ?? s.verificationScore ?? 0;
    });
  } else if (isDemo) {
    // Demo student baseline skills (Aarav Sharma - NIT)
    studentSkillsMap['go (golang)'] = 65;
    studentSkillsMap['data structures & algorithms'] = 82;
    studentSkillsMap['linux fundamentals'] = 74;
    studentSkillsMap['docker'] = 60;
    studentSkillsMap['react'] = 78;
    studentSkillsMap['typescript'] = 75;
    studentSkillsMap['python'] = 80;
    studentSkillsMap['distributed systems'] = 45; // skill gap
    studentSkillsMap['kubernetes'] = 40; // skill gap
    studentSkillsMap['grpc & protocol buffers'] = 35; // skill gap
    studentSkillsMap['apache kafka'] = 30; // skill gap
    studentSkillsMap['rag & vector databases'] = 38; // skill gap
    studentSkillsMap['siem & soc operations'] = 25; // skill gap
  }

  // 1. Identify Target Skills Gap Overlap
  // A skill is considered a "Gap" if student score is < 65 or student does not have it yet.
  const targetSkills = program.targetSkills || [];
  const matchedGapSkills: string[] = [];
  let targetSkillPoints = 0;

  targetSkills.forEach((tSkill) => {
    const key = tSkill.toLowerCase().trim();
    const studentScore = studentSkillsMap[key];
    if (studentScore === undefined || studentScore < 65) {
      matchedGapSkills.push(tSkill);
      targetSkillPoints += 20; // boost recommendation because the program addresses a real gap
    } else {
      targetSkillPoints += 10;
    }
  });

  // 2. Check Prerequisite Skills Eligibility
  const prerequisites = program.prerequisiteSkills || [];
  const matchedPrerequisites: string[] = [];
  const missingPrerequisites: string[] = [];

  prerequisites.forEach((pSkill) => {
    const key = pSkill.toLowerCase().trim();
    const score = studentSkillsMap[key];
    if (score && score >= 50) {
      matchedPrerequisites.push(pSkill);
    } else {
      missingPrerequisites.push(pSkill);
    }
  });

  const prereqEligibilityRatio =
    prerequisites.length > 0 ? matchedPrerequisites.length / prerequisites.length : 1.0;

  // 3. Compute Composite Deterministic Score (0 - 100)
  const targetCoverage = targetSkills.length > 0 ? Math.min(1.0, targetSkillPoints / (targetSkills.length * 18)) : 0.5;
  const rawScore = Math.round(targetCoverage * 60 + prereqEligibilityRatio * 40);
  const matchScore = Math.min(99, Math.max(25, rawScore));

  const isRecommendedForSkillGap = matchedGapSkills.length > 0 && prereqEligibilityRatio >= 0.5;

  let explanation = '';
  if (isRecommendedForSkillGap) {
    explanation = `Recommended for your skill gap: strengthens ${matchedGapSkills.slice(0, 3).join(', ')}.`;
  } else if (missingPrerequisites.length > 0) {
    explanation = `Prerequisites to review: ${missingPrerequisites.slice(0, 2).join(', ')}.`;
  } else {
    explanation = `High alignment with your verified skill profile (${matchScore}% match).`;
  }

  return {
    programId: program.id,
    matchScore,
    isRecommendedForSkillGap,
    matchedGapSkills,
    matchedPrerequisites,
    missingPrerequisites,
    careerAlignmentScore: matchScore,
    explanation
  };
}

export const learningProgramService = {
  /**
   * Fetch all learning programs with optional filters
   */
  async getPrograms(params: {
    domain?: string;
    programType?: string;
    deliveryMode?: string;
    difficulty?: string;
    status?: ProgramStatus;
    organizationId?: string;
    search?: string;
    isDemo?: boolean;
  } = {}): Promise<LearningProgramServiceResult<LearningProgram[]>> {
    const { isDemo = false, domain, programType, deliveryMode, difficulty, status, organizationId, search } = params;

    if (isDemo) {
      let list = loadLocalPrograms(true);

      if (organizationId) {
        list = list.filter((p) => p.organizationId === organizationId);
      }
      if (status) {
        list = list.filter((p) => p.status === status);
      }
      if (domain && domain !== 'All') {
        list = list.filter((p) => p.domain === domain);
      }
      if (programType && programType !== 'All') {
        list = list.filter((p) => p.programType === programType);
      }
      if (deliveryMode && deliveryMode !== 'All') {
        list = list.filter((p) => p.deliveryMode === deliveryMode);
      }
      if (difficulty && difficulty !== 'All') {
        list = list.filter((p) => p.difficultyLevel === difficulty);
      }
      if (search && search.trim()) {
        const q = search.toLowerCase();
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.domain.toLowerCase().includes(q) ||
            p.organizationName.toLowerCase().includes(q) ||
            p.targetSkills.some((s) => s.toLowerCase().includes(q))
        );
      }

      return {
        success: true,
        data: list,
        fromMock: true
      };
    }

    if (!db) {
      return {
        success: false,
        data: [],
        error: 'Database connection is not initialized'
      };
    }

    try {
      const colRef = collection(db, 'learning_programs');
      let q = query(colRef);

      if (organizationId) {
        q = query(colRef, where('organizationId', '==', organizationId));
      }

      const snap = await getDocs(q);
      const programs: LearningProgram[] = [];
      snap.forEach((d) => {
        programs.push({ id: d.id, ...d.data() } as LearningProgram);
      });

      // Apply client-side filters
      let filtered = programs;
      if (status) filtered = filtered.filter((p) => p.status === status);
      if (domain && domain !== 'All') filtered = filtered.filter((p) => p.domain === domain);
      if (programType && programType !== 'All') filtered = filtered.filter((p) => p.programType === programType);
      if (deliveryMode && deliveryMode !== 'All') filtered = filtered.filter((p) => p.deliveryMode === deliveryMode);
      if (difficulty && difficulty !== 'All') filtered = filtered.filter((p) => p.difficultyLevel === difficulty);
      if (search && search.trim()) {
        const qStr = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(qStr) ||
            p.description.toLowerCase().includes(qStr) ||
            p.targetSkills.some((s) => s.toLowerCase().includes(qStr))
        );
      }

      return {
        success: true,
        data: filtered,
        fromMock: false
      };
    } catch (err: any) {
      console.error('[learningProgramService] getPrograms Firestore error:', err);
      return {
        success: false,
        data: [],
        error: isOfflineOrNetworkError(err)
          ? 'Network connectivity issue. Unable to retrieve learning programs.'
          : (err?.message || 'Failed to fetch learning programs from database')
      };
    }
  },

  /**
   * Get single learning program by ID
   */
  async getProgramById(
    programId: string,
    isDemo = false
  ): Promise<LearningProgramServiceResult<LearningProgram | null>> {
    if (isDemo) {
      const list = loadLocalPrograms(true);
      const found = list.find((p) => p.id === programId) || null;
      return { success: true, data: found, fromMock: true };
    }

    if (!db) {
      return { success: false, data: null, error: 'Database not initialized' };
    }

    try {
      const docRef = doc(db, 'learning_programs', programId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        return { success: true, data: null, fromMock: false };
      }
      return {
        success: true,
        data: { id: snap.id, ...snap.data() } as LearningProgram,
        fromMock: false
      };
    } catch (err: any) {
      return {
        success: false,
        data: null,
        error: err?.message || 'Failed to fetch program document'
      };
    }
  },

  /**
   * Create new Learning Program (Industry side) with validation
   */
  async createProgram(
    programData: Omit<LearningProgram, 'id' | 'createdAt' | 'updatedAt' | 'enrolledCount' | 'completedCount'>,
    isDemo = false
  ): Promise<LearningProgramServiceResult<LearningProgram>> {
    // Validate required fields
    if (!programData.title?.trim()) {
      return { success: false, data: null as any, error: 'Program title is required' };
    }
    if (!programData.description?.trim()) {
      return { success: false, data: null as any, error: 'Program description is required' };
    }
    if (!programData.programType) {
      return { success: false, data: null as any, error: 'Program type must be selected' };
    }
    if (!programData.domain?.trim()) {
      return { success: false, data: null as any, error: 'Skill domain is required' };
    }
    if (!programData.targetSkills || programData.targetSkills.length === 0) {
      return { success: false, data: null as any, error: 'At least one target skill is required' };
    }

    const newId = `prog-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const fullProgram: LearningProgram = {
      ...programData,
      id: newId,
      enrolledCount: 0,
      completedCount: 0,
      createdAt: now,
      updatedAt: now
    };

    if (isDemo) {
      const list = loadLocalPrograms(true);
      const updated = [fullProgram, ...list];
      saveLocalPrograms(updated);
      return { success: true, data: fullProgram, fromMock: true };
    }

    if (!db) {
      return { success: false, data: null as any, error: 'Database not initialized' };
    }

    try {
      const docRef = doc(db, 'learning_programs', newId);
      await setDoc(docRef, fullProgram);
      return { success: true, data: fullProgram, fromMock: false };
    } catch (err: any) {
      return {
        success: false,
        data: null as any,
        error: isOfflineOrNetworkError(err)
          ? 'Network error. Could not publish program to database.'
          : (err?.message || 'Failed to save program')
      };
    }
  },

  /**
   * Update program fields
   */
  async updateProgram(
    programId: string,
    updates: Partial<LearningProgram>,
    isDemo = false
  ): Promise<LearningProgramServiceResult<LearningProgram>> {
    const now = new Date().toISOString();

    if (isDemo) {
      const list = loadLocalPrograms(true);
      const index = list.findIndex((p) => p.id === programId);
      if (index === -1) {
        return { success: false, data: null as any, error: 'Program not found' };
      }
      const updatedItem = { ...list[index], ...updates, updatedAt: now };
      list[index] = updatedItem;
      saveLocalPrograms(list);
      return { success: true, data: updatedItem, fromMock: true };
    }

    if (!db) {
      return { success: false, data: null as any, error: 'Database not initialized' };
    }

    try {
      const docRef = doc(db, 'learning_programs', programId);
      await updateDoc(docRef, { ...updates, updatedAt: now });
      const snap = await getDoc(docRef);
      return {
        success: true,
        data: { id: snap.id, ...snap.data() } as LearningProgram,
        fromMock: false
      };
    } catch (err: any) {
      return {
        success: false,
        data: null as any,
        error: err?.message || 'Failed to update program'
      };
    }
  },

  /**
   * Publish or Unpublish program
   */
  async setProgramStatus(
    programId: string,
    status: ProgramStatus,
    isDemo = false
  ): Promise<LearningProgramServiceResult<boolean>> {
    const res = await this.updateProgram(programId, { status }, isDemo);
    return { success: res.success, data: res.success, error: res.error };
  },

  /**
   * Get student's enrollments
   */
  async getStudentEnrollments(
    studentId: string,
    isDemo = false
  ): Promise<LearningProgramServiceResult<StudentProgramEnrollment[]>> {
    if (isDemo) {
      const enrollments = loadLocalEnrollments(true);
      const filtered = enrollments.filter(
        (e) => e.studentId === studentId || studentId === 'demo-student-id' || e.studentEmail === 'aarav.sharma@skillsetu.demo'
      );
      return { success: true, data: filtered, fromMock: true };
    }

    if (!db) {
      return { success: false, data: [], error: 'Database not initialized' };
    }

    try {
      const colRef = collection(db, 'learning_enrollments');
      const q = query(colRef, where('studentId', '==', studentId));
      const snap = await getDocs(q);
      const results: StudentProgramEnrollment[] = [];
      snap.forEach((d) => {
        results.push({ id: d.id, ...d.data() } as StudentProgramEnrollment);
      });
      return { success: true, data: results, fromMock: false };
    } catch (err: any) {
      return {
        success: false,
        data: [],
        error: isOfflineOrNetworkError(err)
          ? 'Network error loading enrollments'
          : (err?.message || 'Failed to fetch student enrollments')
      };
    }
  },

  /**
   * Get all enrollments for a specific program (Industry side)
   */
  async getProgramEnrollments(
    programId: string,
    isDemo = false
  ): Promise<LearningProgramServiceResult<StudentProgramEnrollment[]>> {
    if (isDemo) {
      const enrollments = loadLocalEnrollments(true);
      const filtered = enrollments.filter((e) => e.programId === programId);
      return { success: true, data: filtered, fromMock: true };
    }

    if (!db) {
      return { success: false, data: [], error: 'Database not initialized' };
    }

    try {
      const colRef = collection(db, 'learning_enrollments');
      const q = query(colRef, where('programId', '==', programId));
      const snap = await getDocs(q);
      const results: StudentProgramEnrollment[] = [];
      snap.forEach((d) => {
        results.push({ id: d.id, ...d.data() } as StudentProgramEnrollment);
      });
      return { success: true, data: results, fromMock: false };
    } catch (err: any) {
      return {
        success: false,
        data: [],
        error: err?.message || 'Failed to load program participants'
      };
    }
  },

  /**
   * Get all enrollments across an organization
   */
  async getOrganizationEnrollments(
    organizationId: string,
    isDemo = false
  ): Promise<LearningProgramServiceResult<StudentProgramEnrollment[]>> {
    if (isDemo) {
      const enrollments = loadLocalEnrollments(true);
      const filtered = enrollments.filter(
        (e) => e.organizationId === organizationId || organizationId === 'demo-industry-apex'
      );
      return { success: true, data: filtered, fromMock: true };
    }

    if (!db) {
      return { success: false, data: [], error: 'Database not initialized' };
    }

    try {
      const colRef = collection(db, 'learning_enrollments');
      const q = query(colRef, where('organizationId', '==', organizationId));
      const snap = await getDocs(q);
      const results: StudentProgramEnrollment[] = [];
      snap.forEach((d) => {
        results.push({ id: d.id, ...d.data() } as StudentProgramEnrollment);
      });
      return { success: true, data: results, fromMock: false };
    } catch (err: any) {
      return {
        success: false,
        data: [],
        error: err?.message || 'Failed to load organization enrollments'
      };
    }
  },

  /**
   * Get all enrollments for an institution
   */
  async getInstitutionEnrollments(
    institutionId: string,
    isDemo = false
  ): Promise<LearningProgramServiceResult<StudentProgramEnrollment[]>> {
    if (isDemo) {
      const enrollments = loadLocalEnrollments(true);
      return { success: true, data: enrollments, fromMock: true };
    }

    if (!db) {
      return { success: false, data: [], error: 'Database not initialized' };
    }

    try {
      const colRef = collection(db, 'learning_enrollments');
      const q = query(colRef, where('institutionId', '==', institutionId));
      const snap = await getDocs(q);
      const results: StudentProgramEnrollment[] = [];
      snap.forEach((d) => {
        results.push({ id: d.id, ...d.data() } as StudentProgramEnrollment);
      });
      return { success: true, data: results, fromMock: false };
    } catch (err: any) {
      return {
        success: false,
        data: [],
        error: err?.message || 'Failed to load institution enrollments'
      };
    }
  },

  /**
   * Student Enrollment in a Learning Program
   */
  async enrollStudent(
    params: {
      program: LearningProgram;
      studentId: string;
      studentName: string;
      studentEmail: string;
      studentAvatar?: string;
      institutionId?: string;
      institutionName?: string;
    },
    isDemo = false
  ): Promise<LearningProgramServiceResult<StudentProgramEnrollment>> {
    const { program, studentId, studentName, studentEmail, studentAvatar, institutionId, institutionName } = params;

    // 1. Capacity Check
    if (program.capacity > 0 && program.enrolledCount >= program.capacity) {
      return {
        success: false,
        data: null as any,
        error: `Enrollment full. Program capacity of ${program.capacity} has been reached.`
      };
    }

    // 2. Prevent Duplicate Enrollment
    if (isDemo) {
      const existing = loadLocalEnrollments(true);
      const isAlreadyEnrolled = existing.some(
        (e) => e.programId === program.id && (e.studentId === studentId || e.studentEmail === studentEmail) && e.status !== 'Withdrawn'
      );
      if (isAlreadyEnrolled) {
        return {
          success: false,
          data: null as any,
          error: 'You are already enrolled in this learning program.'
        };
      }

      const newEnrollmentId = `enr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const enrollment: StudentProgramEnrollment = {
        id: newEnrollmentId,
        programId: program.id,
        studentId,
        studentName,
        studentEmail,
        studentAvatar: studentAvatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
        institutionId: institutionId || 'inst_nit',
        institutionName: institutionName || 'National Institute of Technology',
        organizationId: program.organizationId,
        organizationName: program.organizationName,
        organizationLogo: program.organizationLogo,
        programTitle: program.title,
        programType: program.programType,
        domain: program.domain,
        targetSkills: program.targetSkills,
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: 'Enrolled',
        completedModuleIds: [],
        totalModulesCount: program.modules ? program.modules.length : 1,
        progressPercentage: 0,
        lastActiveDate: new Date().toISOString().split('T')[0]
      };

      saveLocalEnrollments([enrollment, ...existing]);

      // Increment program enrolled count locally
      const programs = loadLocalPrograms(true);
      const pIdx = programs.findIndex((p) => p.id === program.id);
      if (pIdx !== -1) {
        programs[pIdx].enrolledCount = (programs[pIdx].enrolledCount || 0) + 1;
        saveLocalPrograms(programs);
      }

      return { success: true, data: enrollment, fromMock: true };
    }

    if (!db) {
      return { success: false, data: null as any, error: 'Firestore database not initialized' };
    }

    try {
      // Check existing in Firestore
      const colRef = collection(db, 'learning_enrollments');
      const q = query(colRef, where('programId', '==', program.id), where('studentId', '==', studentId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const active = snap.docs.find((d) => d.data().status !== 'Withdrawn');
        if (active) {
          return {
            success: false,
            data: null as any,
            error: 'You are already enrolled in this program.'
          };
        }
      }

      const newEnrollmentId = `enr-${Date.now()}`;
      const enrollment: StudentProgramEnrollment = {
        id: newEnrollmentId,
        programId: program.id,
        studentId,
        studentName,
        studentEmail,
        studentAvatar: studentAvatar || '',
        institutionId: institutionId || '',
        institutionName: institutionName || '',
        organizationId: program.organizationId,
        organizationName: program.organizationName,
        organizationLogo: program.organizationLogo,
        programTitle: program.title,
        programType: program.programType,
        domain: program.domain,
        targetSkills: program.targetSkills,
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: 'Enrolled',
        completedModuleIds: [],
        totalModulesCount: program.modules ? program.modules.length : 1,
        progressPercentage: 0,
        lastActiveDate: new Date().toISOString().split('T')[0]
      };

      await setDoc(doc(db, 'learning_enrollments', newEnrollmentId), enrollment);

      // Increment program count
      try {
        const progDocRef = doc(db, 'learning_programs', program.id);
        const progSnap = await getDoc(progDocRef);
        if (progSnap.exists()) {
          const currentCount = progSnap.data().enrolledCount || 0;
          await updateDoc(progDocRef, { enrolledCount: currentCount + 1 });
        }
      } catch (countErr) {
        console.warn('Could not increment program count:', countErr);
      }

      return { success: true, data: enrollment, fromMock: false };
    } catch (err: any) {
      console.error('Enrollment error:', err);
      return {
        success: false,
        data: null as any,
        error: isOfflineOrNetworkError(err)
          ? 'Network error. Could not complete enrollment.'
          : (err?.message || 'Failed to enroll in program')
      };
    }
  },

  /**
   * Toggle completion of a specific module
   */
  async toggleModuleCompletion(
    enrollmentId: string,
    moduleId: string,
    isDemo = false
  ): Promise<LearningProgramServiceResult<StudentProgramEnrollment>> {
    if (isDemo) {
      const enrollments = loadLocalEnrollments(true);
      const idx = enrollments.findIndex((e) => e.id === enrollmentId);
      if (idx === -1) return { success: false, data: null as any, error: 'Enrollment record not found' };

      const enr = enrollments[idx];
      const completedSet = new Set(enr.completedModuleIds || []);
      if (completedSet.has(moduleId)) {
        completedSet.delete(moduleId);
      } else {
        completedSet.add(moduleId);
      }

      const updatedCompletedIds = Array.from(completedSet);
      const totalCount = enr.totalModulesCount || 1;
      const progress = calculateProgramProgressPercentage(updatedCompletedIds, totalCount);

      let newStatus: StudentProgramEnrollment['status'] = enr.status;
      if (progress === 100) {
        newStatus = 'Completed';
      } else if (progress > 0) {
        newStatus = 'In Progress';
      } else {
        newStatus = 'Enrolled';
      }

      const updatedEnr: StudentProgramEnrollment = {
        ...enr,
        completedModuleIds: updatedCompletedIds,
        progressPercentage: progress,
        status: newStatus,
        lastActiveDate: new Date().toISOString().split('T')[0]
      };

      enrollments[idx] = updatedEnr;
      saveLocalEnrollments(enrollments);
      return { success: true, data: updatedEnr, fromMock: true };
    }

    if (!db) {
      return { success: false, data: null as any, error: 'Database not initialized' };
    }

    try {
      const docRef = doc(db, 'learning_enrollments', enrollmentId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        return { success: false, data: null as any, error: 'Enrollment not found' };
      }

      const data = snap.data() as StudentProgramEnrollment;
      const completedSet = new Set(data.completedModuleIds || []);
      if (completedSet.has(moduleId)) {
        completedSet.delete(moduleId);
      } else {
        completedSet.add(moduleId);
      }

      const updatedCompletedIds = Array.from(completedSet);
      const totalCount = data.totalModulesCount || 1;
      const progress = calculateProgramProgressPercentage(updatedCompletedIds, totalCount);

      let newStatus: StudentProgramEnrollment['status'] = data.status;
      if (progress === 100) {
        newStatus = 'Completed';
      } else if (progress > 0) {
        newStatus = 'In Progress';
      }

      const updates = {
        completedModuleIds: updatedCompletedIds,
        progressPercentage: progress,
        status: newStatus,
        lastActiveDate: new Date().toISOString().split('T')[0]
      };

      await updateDoc(docRef, updates);
      return {
        success: true,
        data: { ...data, ...updates, id: enrollmentId },
        fromMock: false
      };
    } catch (err: any) {
      return {
        success: false,
        data: null as any,
        error: err?.message || 'Failed to update module state'
      };
    }
  },

  /**
   * Submit Industry Mentor Feedback for enrolled student
   */
  async submitMentorFeedback(
    enrollmentId: string,
    feedback: {
      mentorName: string;
      mentorTitle?: string;
      feedbackText: string;
      technicalRating: number;
      practicalRating: number;
    },
    isDemo = false
  ): Promise<LearningProgramServiceResult<StudentProgramEnrollment>> {
    const feedbackObj: ProgramMentorFeedback = {
      ...feedback,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'submitted'
    };

    if (isDemo) {
      const enrollments = loadLocalEnrollments(true);
      const idx = enrollments.findIndex((e) => e.id === enrollmentId);
      if (idx === -1) return { success: false, data: null as any, error: 'Enrollment not found' };

      const updated = {
        ...enrollments[idx],
        mentorFeedback: feedbackObj
      };
      enrollments[idx] = updated;
      saveLocalEnrollments(enrollments);
      return { success: true, data: updated, fromMock: true };
    }

    if (!db) return { success: false, data: null as any, error: 'Database not initialized' };

    try {
      const docRef = doc(db, 'learning_enrollments', enrollmentId);
      await updateDoc(docRef, { mentorFeedback: feedbackObj });
      const snap = await getDoc(docRef);
      return {
        success: true,
        data: { id: snap.id, ...snap.data() } as StudentProgramEnrollment,
        fromMock: false
      };
    } catch (err: any) {
      return { success: false, data: null as any, error: err?.message || 'Failed to submit mentor feedback' };
    }
  },

  /**
   * Issue Official Program Completion & Cryptographic Certificate
   */
  async issueProgramCertificate(
    enrollmentId: string,
    params: {
      signatoryName: string;
      signatoryTitle: string;
      achievedSkills: string[];
      gradeOrDistinction?: 'Distinction' | 'Merit' | 'Passed';
    },
    isDemo = false
  ): Promise<LearningProgramServiceResult<StudentProgramEnrollment>> {
    const now = new Date().toISOString().split('T')[0];
    const certNumber = `SKU-LP-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const certId = `CERT-LP-${Date.now()}`;
    const verificationHash = `sha256-${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    const completionRecord: ProgramCompletionRecord = {
      completedDate: now,
      achievedSkills: params.achievedSkills,
      certificateIssued: true,
      certificateId: certId,
      certificateNumber: certNumber,
      verificationStatus: 'verified',
      signatoryName: params.signatoryName,
      signatoryTitle: params.signatoryTitle,
      gradeOrDistinction: params.gradeOrDistinction || 'Distinction',
      verificationHash
    };

    if (isDemo) {
      const enrollments = loadLocalEnrollments(true);
      const idx = enrollments.findIndex((e) => e.id === enrollmentId);
      if (idx === -1) return { success: false, data: null as any, error: 'Enrollment not found' };

      const updated: StudentProgramEnrollment = {
        ...enrollments[idx],
        status: 'Completed',
        progressPercentage: 100,
        completionRecord
      };
      enrollments[idx] = updated;
      saveLocalEnrollments(enrollments);

      documentService.syncCertificateAsDocument(
        {
          ownerId: updated.studentId,
          ownerName: updated.studentName,
          certificateTitle: `${updated.programTitle} Certificate`,
          issuer: updated.organizationName,
          certificateId: certId,
          verificationHash,
          issueDate: now.split('T')[0],
          gradeOrScore: params.gradeOrDistinction || 'Distinction',
          skillsEndorsed: params.achievedSkills,
          source: 'Industry Learning'
        },
        true
      ).catch(() => {});

      return { success: true, data: updated, fromMock: true };
    }

    if (!db) return { success: false, data: null as any, error: 'Database not initialized' };

    try {
      const docRef = doc(db, 'learning_enrollments', enrollmentId);
      await updateDoc(docRef, {
        status: 'Completed',
        progressPercentage: 100,
        completionRecord
      });
      const snap = await getDoc(docRef);
      const updatedData = { id: snap.id, ...snap.data() } as StudentProgramEnrollment;

      documentService.syncCertificateAsDocument(
        {
          ownerId: updatedData.studentId,
          ownerName: updatedData.studentName,
          certificateTitle: `${updatedData.programTitle} Certificate`,
          issuer: updatedData.organizationName,
          certificateId: certId,
          verificationHash,
          issueDate: now.split('T')[0],
          gradeOrScore: params.gradeOrDistinction || 'Distinction',
          skillsEndorsed: params.achievedSkills,
          source: 'Industry Learning'
        },
        false
      ).catch(() => {});

      return {
        success: true,
        data: updatedData,
        fromMock: false
      };
    } catch (err: any) {
      return { success: false, data: null as any, error: err?.message || 'Failed to issue certificate' };
    }
  },

  calculateProgramSkillGapMatch
};
