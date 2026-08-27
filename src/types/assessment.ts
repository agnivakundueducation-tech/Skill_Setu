export type StepId =
  | 'career-interests'
  | 'technical-skills'
  | 'soft-skills'
  | 'aptitude-assessment'
  | 'career-preferences'
  | 'summary';

export interface AssessmentStepConfig {
  id: StepId;
  stepNumber: number;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
}

export interface CareerInterestsAnswers {
  primaryDomain: string;
  industrySectors: string[];
  excitementFactors: string[];
  problemSolvingPassion: number; // 1 to 10
  workVelocity: string;
}

export interface TechnicalSkillsAnswers {
  primaryLanguages: string[];
  frontendRating: number; // 1 to 5
  backendRating: number; // 1 to 5
  databaseRating: number; // 1 to 5
  cloudDevOpsRating: number; // 1 to 5
  dsaRating: number; // 1 to 5
  systemDesignRating: number; // 1 to 5
  practicalExperienceScore: number; // 0 to 100
  preferredArchitecture: string;
}

export interface SoftSkillsAnswers {
  communicationRating: number; // 1 to 5
  problemDecompositionRating: number; // 1 to 5
  teamCollaborationRating: number; // 1 to 5
  codeReviewRating: number; // 1 to 5
  adaptabilityRating: number; // 1 to 5
  conflictResolutionRating: number; // 1 to 5
  stressManagementScore: number; // 1 to 10
  leadershipStyle: string;
}

export interface AptitudeAnswers {
  answers: Record<string, number>; // questionId -> selected option index
  quantitativeScore: number; // 0 to 100
  logicalScore: number; // 0 to 100
  verbalScore: number; // 0 to 100
  totalScore: number; // 0 to 100
  strengths: string[];
  weaknesses: string[];
  completedAt?: string;
}

export interface CareerPreferencesAnswers {
  workMode: string;
  companyStage: string;
  compensationBand: string;
  primaryCareerDriver: string;
  weeklyUpskillingHours: number; // 2 to 30 hrs
}

export interface AssessmentFormState {
  careerInterests: CareerInterestsAnswers;
  technicalSkills: TechnicalSkillsAnswers;
  softSkills: SoftSkillsAnswers;
  aptitude: AptitudeAnswers;
  careerPreferences: CareerPreferencesAnswers;
}

export interface DimensionScore {
  domain: string;
  score: number; // 0 to 100
  benchmark: number; // 0 to 100
}

export interface SkillGapItem {
  skill: string;
  category: 'Technical' | 'Architecture' | 'Cloud' | 'Soft Skills' | 'Leadership';
  currentLevel: string;
  targetLevel: string;
  gapSeverity: 'Critical' | 'Moderate' | 'Minor';
  recommendedAction: string;
  suggestedModule: string;
}

export interface RecommendedRoleItem {
  id: string;
  title: string;
  matchScore: number; // 0 to 100
  marketDemand: 'Extremely High' | 'High' | 'Moderate';
  salaryRange: string;
  description: string;
  keyMatchingSkills: string[];
  growthPotential: string;
}

export interface AssessmentResult {
  completedAt: string;
  readinessScore: number; // 0 to 100
  percentileRank: number; // e.g. 96
  tierLabel: 'Tier-1 Industry Ready' | 'Enterprise Capable' | 'Foundation Building' | 'High-Growth Contender';
  executiveSummary: string;
  aptitudeScore?: number;
  quantitativeScore?: number;
  logicalScore?: number;
  verbalScore?: number;
  aptitudeStrengths?: string[];
  aptitudeWeaknesses?: string[];
  aptitudeCompletedAt?: string;
  dimensionScores: DimensionScore[];
  strengths: {
    title: string;
    description: string;
    badge: string;
    scoreVal?: number;
  }[];
  weaknesses: {
    title: string;
    description: string;
    impact: 'High' | 'Medium' | 'Low';
    remedy: string;
  }[];
  skillGaps: SkillGapItem[];
  recommendedRoles: RecommendedRoleItem[];
  recommendedLearningTrack: {
    title: string;
    duration: string;
    modulesCount: number;
    description: string;
  };
}
