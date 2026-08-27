export type LearningProgramType =
  | 'Training Program'
  | 'Certification Course'
  | 'Workshop'
  | 'Mentorship Program'
  | 'Masterclass'
  | 'Bootcamp';

export type ProgramDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type ProgramDeliveryMode = 'Online' | 'Hybrid' | 'In-Person';

export type ProgramStatus = 'draft' | 'published' | 'in_progress' | 'completed' | 'archived';

export type ProgramEnrollmentStatus = 'Enrolled' | 'In Progress' | 'Completed' | 'Withdrawn';

export interface ProgramModule {
  id: string;
  order: number;
  title: string;
  description: string;
  duration?: string; // e.g. "3 Hours", "1 Week"
  skillsCovered?: string[];
  deliverable?: string;
}

export interface ProgramMentorInfo {
  name: string;
  title: string;
  avatarUrl?: string;
  email?: string;
  company?: string;
  bio?: string;
}

export interface ProgramCertificationInfo {
  isOffered: boolean;
  certificateTitle?: string;
  issuerName?: string;
  accreditationLevel?: 'Enterprise Foundation' | 'Associate Certified' | 'Professional Master' | 'Specialist';
  validity?: string;
}

export interface LearningProgram {
  id: string;
  organizationId: string;
  organizationName: string;
  organizationLogo?: string;
  title: string;
  description: string;
  programType: LearningProgramType;
  domain: string;
  prerequisiteSkills: string[];
  targetSkills: string[];
  difficultyLevel: ProgramDifficulty;
  deliveryMode: ProgramDeliveryMode;
  duration: string; // e.g. "6 Weeks", "40 Hours", "3 Days"
  startDate: string;
  endDate: string;
  capacity: number;
  enrolledCount: number;
  completedCount: number;
  mentorInfo?: ProgramMentorInfo;
  certificationInfo?: ProgramCertificationInfo;
  modules: ProgramModule[];
  status: ProgramStatus;
  stipendOrGrant?: string; // e.g. "Free for shortlisted students", "INR 15,000 Milestone Grant"
  locationDetails?: string; // for Hybrid/In-Person
  syllabusUrl?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramMentorFeedback {
  mentorName: string;
  mentorTitle?: string;
  feedbackText: string;
  technicalRating: number; // 1 to 5
  practicalRating: number; // 1 to 5
  submittedDate: string;
  status: 'pending' | 'submitted';
}

export interface ProgramCompletionRecord {
  completedDate: string;
  achievedSkills: string[];
  certificateIssued: boolean;
  certificateId?: string;
  certificateNumber?: string;
  verificationStatus: 'verified' | 'pending' | 'none';
  signatoryName?: string;
  signatoryTitle?: string;
  gradeOrDistinction?: 'Distinction' | 'Merit' | 'Passed';
  verificationHash?: string;
}

export interface StudentProgramEnrollment {
  id: string; // enrollmentId
  programId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  institutionId?: string;
  institutionName?: string;
  organizationId: string;
  organizationName: string;
  organizationLogo?: string;
  programTitle: string;
  programType: LearningProgramType;
  domain: string;
  targetSkills: string[];
  enrollmentDate: string;
  status: ProgramEnrollmentStatus;
  completedModuleIds: string[];
  totalModulesCount: number;
  progressPercentage: number; // dynamically computed
  lastActiveDate: string;
  mentorFeedback?: ProgramMentorFeedback;
  completionRecord?: ProgramCompletionRecord;
  notes?: string;
}

export interface ProgramMatchExplanation {
  programId: string;
  matchScore: number; // 0 - 100
  isRecommendedForSkillGap: boolean;
  matchedGapSkills: string[];
  matchedPrerequisites: string[];
  missingPrerequisites: string[];
  careerAlignmentScore: number;
  explanation: string;
}
