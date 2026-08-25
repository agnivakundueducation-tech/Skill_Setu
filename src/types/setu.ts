import { UserRole } from './index';

export type SetuRole = UserRole;

/**
 * Compact, Privacy-Safe Student Context for Setu AI
 */
export interface StudentSetuContext {
  identity: {
    role: 'student';
    name: string;
    institution: string;
    department: string;
    degree: string;
    graduationYear: string;
    cgpa?: string;
  };
  career: {
    targetRole: string;
    careerInterests: string[];
    preferredWorkMode: string;
    preferredLocation: string;
    openToWork: boolean;
  };
  skillIntelligence: {
    readinessScore: number;
    percentile: number;
    tier: string;
    topSkills: { name: string; score: number; level: string; demand: string }[];
    criticalGaps: { name: string; currentLevel: number; requiredLevel: number; gap: number; priority: string }[];
  };
  assessment: {
    hasCompletedAssessment: boolean;
    latestAssessmentDate?: string;
    strengths: string[];
    weaknesses: string[];
    recommendedRoles: string[];
  };
  opportunities: {
    topMatched: {
      opportunityId: string;
      title: string;
      company: string;
      domain: string;
      requiredSkills: string[];
      matchScore: number;
      deadline: string;
      type: string;
    }[];
  };
  applications: {
    totalActive: number;
    recentApplications: {
      applicationId: string;
      opportunityTitle: string;
      company: string;
      matchScore: number;
      status: string;
      appliedAt: string;
    }[];
  };
  industryDemand: {
    topDemandedSkills: { name: string; demandPercentage: number; trend: string }[];
  };
  interventions: {
    enrolled: {
      interventionId: string;
      title: string;
      skillName: string;
      status: string;
      completionStatus?: string;
      preSkillLevel: number;
      postSkillLevel?: number;
      measuredImprovement?: number;
    }[];
    recommended: {
      interventionId: string;
      title: string;
      skillName: string;
      type: string;
      targetCohort: string;
    }[];
  };
  portfolio: {
    projectsCount: number;
    topProjects: { title: string; techStack: string[]; highlight: string }[];
    certifications: { title: string; issuer: string; verified: boolean }[];
    internships: { company: string; role: string; duration: string }[];
    achievements: string[];
  };
}

/**
 * Compact, Privacy-Safe Industry Context for Setu AI
 */
export interface IndustrySetuContext {
  organization: {
    role: 'industry';
    companyName: string;
    industryDomain: string;
    location: string;
    description: string;
    verifiedPartner: boolean;
  };
  opportunities: {
    totalPosted: number;
    activeCount: number;
    postedOpportunities: {
      opportunityId: string;
      title: string;
      type: string;
      requiredSkills: string[];
      preferredSkills: string[];
      status: string;
      applicantsCount: number;
      deadline: string;
    }[];
  };
  applicantsSummary: {
    totalApplicantsAcrossJobs: number;
    topMatches: {
      opportunityTitle: string;
      candidateName: string;
      institution: string;
      matchScore: number;
      matchedSkills: string[];
      skillGaps: string[];
      status: string;
    }[];
  };
  demandIntelligence: {
    domainSkillPriorities: { skill: string; marketDemand: number; priority: string }[];
  };
  collaborations: {
    activeCollaborationsCount: number;
    collaborationsList: {
      collaborationId: string;
      title: string;
      type: string;
      partnerInstitution: string;
      status: string;
      expertiseRequirements: string[];
    }[];
  };
  interventions: {
    mentoringInterventions: {
      interventionId: string;
      title: string;
      institutionName: string;
      skillName: string;
      mentorName?: string;
      enrolledCount: number;
    }[];
  };
}

/**
 * Compact, Privacy-Safe Academician / Faculty Context for Setu AI
 */
export interface AcademicianSetuContext {
  profile: {
    role: 'academician';
    facultyName: string;
    institution: string;
    department: string;
    designation: string;
    expertise: string[];
    researchInterests: string[];
    passportScore: number;
  };
  collaborations: {
    recommended: {
      collaborationId: string;
      title: string;
      company: string;
      type: string;
      matchScore: number;
      requiredExpertise: string[];
    }[];
    appliedOrActive: {
      collaborationId: string;
      title: string;
      company: string;
      type: string;
      status: string;
      appliedAt?: string;
    }[];
    completedCount: number;
  };
  fdp: {
    availablePrograms: { id: string; title: string; provider: string; domain: string; duration: string }[];
    appliedPrograms: { id: string; title: string; status: string }[];
    completedCount: number;
  };
  mentorship: {
    activeMentorships: { programTitle: string; cohort: string; studentsCount: number }[];
  };
  research: {
    industrySponsoredProjects: { title: string; sponsorCompany: string; status: string }[];
  };
}

/**
 * Compact, Privacy-Safe Institutional Intelligence Context for Setu AI
 */
export interface InstitutionSetuContext {
  institution: {
    role: 'institution';
    institutionName: string;
    departments: string[];
    accreditationStatus: string;
    totalStudents: number;
  };
  studentIntelligence: {
    studentsRepresentedCount: number;
    averageReadinessScore: number;
    readinessTierDistribution: { tier: string; percentage: number }[];
    criticalSkillGaps: { skill: string; studentAvgLevel: number; industryRequirement: number; gap: number }[];
    curriculumGaps: { skill: string; coverage: 'Covered' | 'Partially Covered' | 'Not Covered'; priority: string }[];
  };
  industryDemand: {
    topDemandedSkills: { skill: string; demandIndex: number; trend: string }[];
    quadrantOverview: { highDemandLowReadiness: string[]; highDemandHighReadiness: string[] };
  };
  interventions: {
    proposedCount: number;
    approvedCount: number;
    activeCount: number;
    completedCount: number;
    programs: {
      interventionId: string;
      title: string;
      skillName: string;
      type: string;
      status: string;
      enrolledCount: number;
      measuredImprovement?: number;
    }[];
  };
  impact: {
    averageMeasuredSkillGain: number;
    overallCompletionRate: number;
    partnerEnterprisesCount: number;
    verifiedPlacementsCount?: number;
  };
}

/**
 * Unified Context Container
 */
export interface UnifiedSetuContext {
  role: SetuRole;
  uid?: string;
  isDemo: boolean;
  generatedAt: string;
  dataCompletenessScore: number;
  student?: StudentSetuContext;
  industry?: IndustrySetuContext;
  academician?: AcademicianSetuContext;
  institution?: InstitutionSetuContext;
  flags?: string[];
}

/**
 * Parameter input for Setu AI queries
 */
export interface AskSetuParams {
  query: string;
  role: SetuRole;
  uid?: string;
  isDemo?: boolean;
  chatHistory?: { role: 'user' | 'assistant' | 'system'; content: string }[];
  customContext?: Partial<UnifiedSetuContext>;
  preferredModel?: string;
}

export type SetuActionType = 
  | 'VIEW_SKILL_GAP'
  | 'VIEW_OPPORTUNITIES'
  | 'VIEW_CAREER_ROADMAP'
  | 'VIEW_APPLICATIONS'
  | 'VIEW_INTERVENTIONS'
  | 'VIEW_COLLABORATIONS'
  | 'VIEW_PORTFOLIO'
  | 'VIEW_INSTITUTION_ANALYTICS'
  | 'VIEW_INDUSTRY_CANDIDATES';

export interface SetuActionMetadata {
  label: string;
  actionType: SetuActionType;
  target: string;
  parameters?: Record<string, any>;
}

/**
 * Structured, Evidence-Based Response from Setu AI
 */
export interface SetuAIResponse {
  directAnswer: string;
  why: string;
  recommendedActions: string[];
  relevantPlatformData: { label: string; value: string | number; badge?: string }[];
  fullFormattedContent: string;
  suggestedFollowUps: string[];
  role: SetuRole;
  isDemo: boolean;
  isFallback: boolean;
  modelUsed: string;
  groundingDataAvailable: boolean;
  contextSummary?: string;
  actions?: SetuActionMetadata[];
  error?: string;
}
