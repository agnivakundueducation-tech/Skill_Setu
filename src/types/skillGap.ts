export type GapStatus = 'critical' | 'moderate' | 'aligned';
export type PriorityLevel = 'High' | 'Medium' | 'Low';
export type SkillCategory = 'technical' | 'professional';

export interface RecommendedResource {
  id: string;
  title: string;
  provider: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'certification' | 'course' | 'hands-on-lab' | 'assessment';
  linkText?: string;
  isIndustryStandard?: boolean;
}

export interface RecommendedProject {
  title: string;
  description: string;
  estimatedHours: string;
  outcome: string;
  deliverable: string;
}

export interface SkillGapItem {
  id: string;
  name: string;
  category: SkillCategory;
  subcategory: string;
  iconName: string;
  currentLevel: number; // e.g. 45
  requiredLevel: number; // e.g. 80
  gap: number; // requiredLevel - currentLevel (e.g. 35)
  priority: PriorityLevel; // 'High' | 'Medium' | 'Low'
  status: GapStatus; // 'critical' | 'moderate' | 'aligned'
  indicatorColor: 'red' | 'yellow' | 'green';
  recommendation: string; // e.g. "Complete Cloud Foundations Certification."
  detailedActionPlan: string[];
  recommendedResources: RecommendedResource[];
  recommendedProject?: RecommendedProject;
  marketDemandScore: number; // 0-100
  hiringImpact: string;
  assessmentSkillName?: string;
}

export interface CareerPathRole {
  id: string;
  title: string;
  description: string;
  avgSalary: string;
  industryDemand: 'Very High' | 'High' | 'Moderate';
  skillRequirements: Record<string, number>; // skillId -> requiredLevel
}

export interface SkillGapOverviewStats {
  totalSkills: number;
  criticalGapsCount: number; // Red
  moderateGapsCount: number; // Yellow
  alignedCount: number; // Green
  averageCurrentLevel: number;
  averageRequiredLevel: number;
  overallGapIndex: number;
  topPrioritySkill: string;
  readinessPercentage: number;
}
