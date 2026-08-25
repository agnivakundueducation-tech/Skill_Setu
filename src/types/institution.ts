export interface InstitutionSummaryMetrics {
  totalStudents: number;
  totalStudentsGrowth: string;
  studentsAssessed: number;
  assessedPercentage: number;
  assessedGrowth: string;
  placementReady: number;
  placementReadyPercentage: number;
  placementReadyGrowth: string;
  internshipsSecured: number;
  internshipsPercentage: number;
  internshipsGrowth: string;
  placementsCompleted: number;
  placementsPercentage: number;
  placementsGrowth: string;
  averageSalaryCTC: string;
  highestPackage: string;
}

export type SkillCategoryType = 'AI/ML' | 'Cloud' | 'Cybersecurity' | 'DSA' | 'Data Analytics';

export interface SubSkillDiagnostic {
  name: string;
  readinessScore: number;
  industryWeight: number;
  status: 'critical_gap' | 'moderate_gap' | 'aligned';
}

export interface SkillDemandReadinessItem {
  id: string;
  skill: SkillCategoryType;
  industryDemand: number; // e.g. 92%
  studentReadiness: number; // e.g. 64%
  gap: number; // e.g. -28%
  gapSeverity: 'critical' | 'moderate' | 'minimal';
  hiringOpeningsVolume: number;
  averageBenchmarkScore: number;
  topCompaniesHiring: string[];
  subskills: SubSkillDiagnostic[];
  keyMissingConcepts: string[];
  suggestedAction: string;
}

export interface DepartmentSkillHeatmapRow {
  departmentCode: string;
  departmentName: string;
  studentCount: number;
  assessedCount: number;
  placementReadyCount: number;
  scores: {
    'AI/ML': number;
    'Cloud': number;
    'Cybersecurity': number;
    'DSA': number;
    'Data Analytics': number;
  };
  overallAverage: number;
}

export interface SemesterProgressionHeatmapRow {
  semester: string;
  cohortYear: string;
  studentCount: number;
  stageLabel: string;
  scores: {
    'AI/ML': number;
    'Cloud': number;
    'Cybersecurity': number;
    'DSA': number;
    'Data Analytics': number;
  };
  placementReadinessRate: number;
}

export interface PlacementTierItem {
  id: string;
  tier: string;
  title: string;
  packageRange: string;
  studentCount: number;
  percentage: number;
  color: string;
  keyRequirements: string[];
}

export interface AICurriculumRecommendation {
  id: string;
  title: string;
  category: 'curriculum' | 'labs' | 'faculty' | 'industry_partner' | 'electives';
  targetSkill: SkillCategoryType | 'Multi-Disciplinary';
  urgency: 'critical' | 'high' | 'medium';
  projectedGapReduction: string; // e.g. "+18% Readiness"
  summary: string;
  detailedProposal: string;
  affectedSemesters: string[];
  creditsChange: string;
  suggestedIndustryPartners: string[];
  labModulesToEmbed: string[];
  facultyUpskillingPlan: string;
  status: 'proposed' | 'under_review' | 'approved' | 'implemented';
  naacNbaCriteriaAlignment: string;
}
