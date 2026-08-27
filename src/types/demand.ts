export type DemandTrend = 'rising' | 'stable' | 'declining' | 'insufficient-data';
export type DemandPriority = 'Critical' | 'High' | 'Moderate' | 'Low';
export type MatrixQuadrant = 'maintain' | 'urgent_development' | 'opportunity_expansion' | 'lower_priority';
export type RecommendationType =
  | 'curriculum_expansion'
  | 'advanced_projects'
  | 'industry_workshop'
  | 'certification_pathway'
  | 'monitoring'
  | 'placement_drive';

export interface SkillDemand {
  skillId: string;
  skillName: string;
  category: string;
  opportunityCount: number;
  demandPercentage: number; // e.g. 78 (%)
  averageRequiredLevel: number; // 0 - 100
  domains: Record<string, number>; // Domain name -> count
  opportunityTypes: Record<string, number>; // Internship -> count, Full-Time -> count
  trend: DemandTrend;
  priority: DemandPriority;
  sampleRoles?: string[];
}

export interface SkillDemandSnapshot {
  snapshotId: string;
  generatedAt: string; // ISO String
  totalOpportunities: number;
  skills: Record<string, SkillDemand>;
  generatedBy?: string;
  snapshotLabel?: string;
}

export interface SkillDemandVsReadiness {
  skillId: string;
  skillName: string;
  category: string;
  demandPercentage: number;
  opportunityCount: number;
  averageRequiredLevel: number;
  averageStudentReadiness: number;
  gap: number; // requiredLevel - averageStudentReadiness
  gapSeverity: 'critical' | 'moderate' | 'minimal';
  matrixQuadrant: MatrixQuadrant;
  priority: DemandPriority;
  explanation: string;
  trend: DemandTrend;
}

export interface InstitutionRecommendation {
  id: string;
  skillName: string;
  title: string;
  type: RecommendationType;
  priority: DemandPriority;
  reason: string; // Deterministic mathematical rationale
  recommendedAction: string;
  metricSnapshot: {
    demandPercentage: number;
    studentReadiness: number;
    requiredLevel: number;
    gap: number;
    opportunityCount: number;
  };
  suggestedTimeline: string;
  targetDepartment?: string;
}

export interface StudentDemandSignal {
  skillName: string;
  category: string;
  demandPercentage: number;
  demandLevel: 'Critical' | 'High' | 'Moderate' | 'Emerging';
  opportunityCount: number;
  yourScore: number;
  requiredLevel: number;
  gap: number;
  isGap: boolean;
  priority: DemandPriority;
  topRoles: string[];
}

export interface IndustryTalentDemandSignal {
  totalActivePostingsAnalyzed: number;
  mostDemandedSkills: {
    skillName: string;
    category: string;
    opportunityCount: number;
    demandPercentage: number;
    avgRequiredLevel: number;
  }[];
  platformCandidateReadiness: {
    skillName: string;
    avgReadiness: number;
    benchmarkRequired: number;
    talentAvailabilityLevel: 'High' | 'Moderate' | 'Scarce';
  }[];
  largestCandidateGaps: {
    skillName: string;
    demandPercentage: number;
    avgRequired: number;
    avgCandidateLevel: number;
    talentDeficit: number;
  }[];
}

export interface DemandFilterParams {
  domain?: string;
  opportunityType?: string;
  category?: string;
  minDemand?: number;
  sortBy?: 'demand' | 'gap' | 'readiness' | 'alphabetical';
}
