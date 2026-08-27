export type CollaborationType =
  | 'Faculty Internship'
  | 'Industrial Training'
  | 'FDP'
  | 'Research Collaboration'
  | 'Consultancy'
  | 'Guest Lecture'
  | 'Mentorship'
  | 'Live Project'
  | 'Innovation Challenge';

export type CollaborationWorkMode = 'Remote' | 'On-Site' | 'Hybrid';

export type CollaborationStatus =
  | 'Open'
  | 'Under Review'
  | 'In Progress'
  | 'Completed'
  | 'Closed';

export type CollaborationApplicationStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Shortlisted'
  | 'Accepted'
  | 'Rejected'
  | 'Withdrawn'
  | 'Completed';

export interface CollaborationOpportunity {
  collaborationId: string;
  title: string;
  description: string;
  collaborationType: CollaborationType;
  industryId: string;
  industryName: string;
  institutionId?: string;
  targetAudience: string;
  requiredExpertise: string[];
  preferredExpertise: string[];
  location: string;
  workMode: CollaborationWorkMode;
  duration: string;
  startDate: string;
  endDate: string;
  applicationDeadline: string;
  capacity: number;
  status: CollaborationStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;

  // Type-specific optional metadata
  topics?: string[];
  certificateOffered?: boolean;
  eligibility?: string;
  speakerName?: string;
  speakerDesignation?: string;
  lectureDate?: string;
  targetDepartment?: string;
  mentorName?: string;
  mentorshipFocus?: string[];
  mentorshipCapacity?: number;
  problemStatement?: string;
  studentTeamSize?: number;
  industryMentor?: string;
  deliverables?: string[];
  fundingSupport?: string;
  prizePool?: string;
  challengeTheme?: string;
}

export interface VerifiedFacultyExperience {
  id: string;
  collaborationId: string;
  title: string;
  industry: string;
  industryId: string;
  collaborationType: CollaborationType;
  duration: string;
  completedDate: string;
  expertise: string[];
  outcome: string;
  verificationStatus: 'Verified';
  certificateUrl?: string;
}

export interface FacultyProfile {
  uid: string;
  fullName: string;
  email?: string;
  institution: string;
  department: string;
  designation: string;
  expertise: string[];
  researchInterests: string[];
  skills: string[];
  preferredCollaborationTypes: CollaborationType[];
  yearsOfExperience: number;
  location: string;
  profileCompletion: number;
  verifiedExperiences?: VerifiedFacultyExperience[];
  updatedAt: string;
}

export interface CollaborationProposal {
  proposalTitle?: string;
  summary?: string;
  relevantExpertise?: string[];
  expectedOutcome?: string;
  estimatedDuration?: string;
  additionalRequirements?: string;
}

export interface CollaborationMatchBreakdown {
  expertiseScore: number;
  researchScore: number;
  typeScore: number;
  modeScore: number;
  weights: {
    expertise: number;
    research: number;
    type: number;
    mode: number;
  };
}

export interface CollaborationMatchResult {
  overallMatch: number;
  matchedExpertise: string[];
  partialExpertise: string[];
  missingExpertise: string[];
  researchAlignment: string[];
  collaborationTypeMatch: boolean;
  workModeMatch: boolean;
  explanation: string;
  breakdown: CollaborationMatchBreakdown;
}

export interface CollaborationApplication {
  applicationId: string;
  collaborationId: string;
  collaborationTitle?: string;
  collaborationType?: CollaborationType;
  academicianId: string;
  academicianName: string;
  academicianEmail?: string;
  academicianInstitution: string;
  academicianDepartment: string;
  academicianDesignation: string;
  institutionId?: string;
  industryId: string;
  industryName?: string;
  proposal: CollaborationProposal;
  expertise: string[];
  matchScoreAtApplication: number;
  matchExplanation?: string;
  matchBreakdown?: CollaborationMatchBreakdown;
  status: CollaborationApplicationStatus;
  industryNotes?: string;
  submittedAt: string;
  updatedAt: string;
}

export interface CollaborationOutcome {
  outcomeId: string;
  collaborationId: string;
  collaborationTitle?: string;
  collaborationType?: CollaborationType;
  recordedBy: string;
  recordedByName: string;
  recordedAt: string;
  participants: number;
  skillsDeveloped: string[];
  researchOutput?: string;
  projectOutcome?: string;
  certification: boolean;
  industryFeedback?: string;
  facultyFeedback?: string;
  studentInvolvement?: string;
  placementImpact?: string;
}

export interface InstitutionCollaborationAnalytics {
  activeCollaborations: number;
  facultyParticipation: number;
  industryPartners: number;
  researchCollaborations: number;
  fdpParticipation: number;
  guestLectures: number;
  liveProjects: number;
  completedCollaborations: number;
  topPartnerIndustries: { name: string; count: number }[];
  byTypeDistribution: { type: CollaborationType; count: number }[];
  departmentBreakdown: { department: string; count: number; completed: number }[];
  impactMetrics: {
    skillsDeveloped: string[];
    researchOutputsCount: number;
    certificationsIssued: number;
    studentInvolvementCount: number;
  };
}
