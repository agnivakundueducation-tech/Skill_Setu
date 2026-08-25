export type InterventionType =
  | 'Industry Workshop'
  | 'Faculty Development Program'
  | 'Certification Pathway'
  | 'Industry Mentorship'
  | 'Live Industry Project'
  | 'Guest Lecture'
  | 'Bootcamp'
  | 'Curriculum Module'
  | 'Research Project';

export type InterventionPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type InterventionStatus =
  | 'Proposed'
  | 'Approved'
  | 'Scheduled'
  | 'Active'
  | 'Completed'
  | 'Evaluated';

export type InterventionEnrollmentStatus =
  | 'Enrolled'
  | 'In_Progress'
  | 'In Progress'
  | 'Completed'
  | 'Withdrawn'
  | 'Dropped';

export type EnrollmentCompletionStatus = 'Pending' | 'Passed' | 'Distinction' | 'Dropped';

export type CurriculumCoverage = 'Covered' | 'Partially Covered' | 'Not Covered';

export interface InstitutionSkillGap {
  skillId: string;
  skillName: string;
  category?: 'technical' | 'professional' | 'domain';
  industryDemand: number; // e.g. 48% (percentage of active opportunities or demand index)
  averageStudentLevel: number; // 0 - 100
  industryRequiredLevel: number; // 0 - 100
  readinessGap: number; // industryRequiredLevel - averageStudentLevel
  affectedStudents: number; // count of students with gap < required
  totalAssessedStudents: number;
  demandPriority: 'High' | 'Moderate' | 'Low' | 'Emerging';
  interventionPriority: InterventionPriority;
  curriculumCoverage: CurriculumCoverage;
  facultyReadinessScore?: number; // 0 - 100
  explanation: string;
}

export interface InterventionRecommendation {
  recommendationId: string;
  skillId: string;
  skillName: string;
  priority: InterventionPriority;
  reason: string; // Transparent explainable statement with visible numbers
  interventionType: InterventionType;
  title: string;
  description: string;
  targetAudience: string;
  expectedSkillImprovement: string;
  estimatedDuration: string;
  industryAlignment: string;
  requiredResources: string[];
  suggestedIndustryExpertise: string[];
  recommendedAction: string;
  status: 'Proposed' | 'Approved' | 'Dismissed';
  createdAt: string;
  updatedAt: string;
}

export interface Intervention {
  interventionId: string;
  institutionId: string;
  institutionName: string;
  skillId: string;
  skillName: string;
  recommendationId?: string;
  interventionType: InterventionType;
  title: string;
  description: string;
  partnerIndustryId?: string;
  partnerIndustryName?: string;
  assignedMentorsCount?: number;
  industryResponsibilities?: string;
  startDate: string;
  endDate: string;
  capacity: number;
  enrolledCount: number;
  completedCount: number;
  status: InterventionStatus;
  preAvgScore?: number;
  postAvgScore?: number;
  measuredImprovement?: number;
  outcomesSummary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InterventionEnrollment {
  enrollmentId: string;
  interventionId: string;
  interventionTitle: string;
  interventionType: InterventionType;
  skillName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  institutionId: string;
  status: InterventionEnrollmentStatus;
  enrolledAt: string;
  completionStatus?: EnrollmentCompletionStatus;
  completedAt?: string;
  preSkillLevel: number;
  postSkillLevel?: number;
  improvement?: number;
  assessmentDate?: string;
  outcomeScore?: number;
  feedback?: string;
}

export interface InterventionImpact {
  interventionId: string;
  interventionTitle: string;
  interventionType: InterventionType;
  participants: number;
  completionRate: number; // percentage 0 - 100
  averageSkillImprovement: number; // delta +X
  placementConversion: number | null; // percentage or null if insufficient platform data
  internshipConversion: number | null; // percentage or null if insufficient platform data
  industryFeedbackScore: number | null; // 0.0 - 5.0
  beforeAvgScore: number;
  afterAvgScore: number;
}

export interface CurriculumAlignmentItem {
  skillId: string;
  skillName: string;
  industryDemand: number;
  studentReadiness: number;
  curriculumCoverage: CurriculumCoverage;
  priority: InterventionPriority;
  recommendedAction: string;
}

export interface InstitutionalInterventionMetrics {
  industryAlignedSkills: number;
  criticalSkillGaps: number;
  activeInterventions: number;
  studentsEnrolled: number;
  averageSkillImprovement: number | null;
  industryParticipation: number;
  completedInterventions: number;
}
