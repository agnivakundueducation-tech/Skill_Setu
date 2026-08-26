export type InternshipStatus = 'Offered' | 'Active' | 'Under Evaluation' | 'Completed' | 'Terminated';

export type MilestoneStatus = 'Pending' | 'In Progress' | 'Submitted' | 'Approved' | 'Blocked';

export type WeeklyLogStatus = 'Draft' | 'Submitted' | 'Reviewed';

export interface InternshipMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: MilestoneStatus;
  deliverableUrl?: string;
  submittedAt?: string;
  completedAt?: string;
  mentorFeedback?: string;
  score?: number; // 0 - 100
}

export interface InternshipWeeklyLog {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  workSummary: string;
  skillsPracticed: string[];
  challengesFaced: string;
  nextWeekPlan: string;
  submittedAt: string;
  status: WeeklyLogStatus;
  mentorRemarks?: string;
  mentorReviewedAt?: string;
}

export interface InternshipFeedback {
  id: string;
  date: string;
  stage: 'Milestone Check' | 'Mid-Term Review' | 'Sprint Review' | 'Weekly Standup' | 'Ad-hoc';
  mentorName: string;
  mentorRole: string;
  technicalRating: number; // 1 to 5
  softSkillsRating: number; // 1 to 5
  initiativeRating: number; // 1 to 5
  summaryComments: string;
  strengthsObserved: string[];
  areasForImprovement: string[];
}

export interface InternshipVerifiedSkill {
  skillId: string;
  skillName: string;
  verifiedLevel: number; // 0 - 100
  evidenceTag: string;
}

export interface InternshipFinalEvaluation {
  id: string;
  evaluatedAt: string;
  evaluatedBy: string;
  evaluatorRole: string;
  overallRating: number; // 1 to 5
  technicalProficiencyScore: number; // 0 to 100
  domainKnowledgeScore: number; // 0 to 100
  collaborationScore: number; // 0 to 100
  problemSolvingScore: number; // 0 to 100
  recommendationForPPO: boolean;
  ppoDetails?: string;
  detailedSummary: string;
  skillsVerified: InternshipVerifiedSkill[];
}

export interface InternshipCompletionRecord {
  certificateId: string;
  issueDate: string;
  issuedBy: string;
  companyName: string;
  signatoryName: string;
  signatoryTitle: string;
  verificationHash: string; // Cryptographic Hash e.g. SETU-INT-2026-X9B2
  verificationUrl: string;
  status: 'Verified' | 'Pending Verification' | 'Revoked';
  honorsTag?: 'Distinction' | 'Merit' | 'Excellence in Innovation';
  skillsEndorsed: string[];
}

export interface InternshipReportDocument {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  downloadUrl: string;
  uploadedAt: string;
  storageProvider: string;
}

export interface InternshipMentor {
  id: string;
  name: string;
  title: string;
  email: string;
  avatar?: string;
  department?: string;
}

export interface InternshipRecord {
  id: string;
  applicationId: string;
  opportunityId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  studentInstitution: string;
  studentDegree: string;
  companyName: string;
  companyLogo?: string;
  roleTitle: string;
  department: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  location: string;
  stipend: string;
  startDate: string;
  endDate: string;
  status: InternshipStatus;
  mentor: InternshipMentor;
  progressPercentage: number;
  milestones: InternshipMilestone[];
  weeklyLogs: InternshipWeeklyLog[];
  mentorFeedbacks: InternshipFeedback[];
  finalEvaluation?: InternshipFinalEvaluation;
  completionRecord?: InternshipCompletionRecord;
  finalReportDocument?: InternshipReportDocument;
  postedBy: string; // Industry User UID
  createdAt: string;
  updatedAt: string;
}
