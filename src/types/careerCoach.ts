import { SetuActionType, SetuActionMetadata } from './setu';

export type PlanDuration = 30 | 60 | 90;

export type TaskType = 
  | 'Learning'
  | 'Practice'
  | 'Project'
  | 'Portfolio'
  | 'Application'
  | 'Interview Preparation'
  | 'Networking';

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

export type OpportunityReadinessEvaluation = 'READY' | 'REASONABLE_TO_APPLY' | 'IMPROVE_FIRST';

export interface CareerTask {
  taskId: string;
  title: string;
  description: string;
  skill: string;
  estimatedHours: number;
  type: TaskType;
  priority: TaskPriority;
  completed: boolean;
  linkedResource?: {
    label: string;
    actionType: SetuActionType;
    target: string;
  };
  currentLevel?: number;
  targetLevel?: number;
}

export interface WeeklyPlan {
  weekNumber: number;
  title: string;
  theme: string;
  focusSummary: string;
  tasks: CareerTask[];
}

export interface CareerPriority {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  industryDemand: number;
  demandTrend?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  priorityScore: number;
}

export interface RecommendedSkillPlan {
  skillName: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  category: 'technical' | 'professional';
  estimatedWeeksToClose: number;
  primaryAction: string;
}

export interface RecommendedInterventionItem {
  interventionId: string;
  title: string;
  skillName: string;
  type: string;
  provider?: string;
  duration?: string;
  enrolled?: boolean;
}

export interface RecommendedProjectItem {
  title: string;
  skill: string;
  description: string;
  expectedOutcome: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  portfolioRelevance: string;
}

export interface OpportunityReadinessItem {
  opportunityId: string;
  title: string;
  company: string;
  matchScore: number;
  requiredSkills: string[];
  readinessStatus: OpportunityReadinessEvaluation;
  rationale: string;
  missingKeySkills: string[];
}

export interface PortfolioActionItem {
  skill: string;
  existingEvidenceCount: number;
  missingEvidence: string;
  recommendation: string;
  suggestedProjectTitle: string;
}

export interface CareerMilestone {
  milestoneId: string;
  title: string;
  targetWeek: number;
  completed: boolean;
  impact: string;
}

export interface NextBestAction {
  title: string;
  reason: string;
  category: 'intervention' | 'learning' | 'portfolio' | 'application' | 'assessment';
  actionLabel: string;
  actionType: SetuActionType;
  targetRoute: string;
  urgency: 'Immediate' | 'This Week' | 'Next Step';
  badge: string;
}

export interface OpportunityAdvice {
  opportunityId: string;
  title: string;
  company: string;
  matchScore: number;
  status: OpportunityReadinessEvaluation;
  summary: string;
  matchedSkills: string[];
  gapsToAddress: string[];
  prepActions: string[];
  interviewTips: string[];
}

export interface CareerActionPlan {
  planId: string;
  generatedAt: string;
  isDemo: boolean;
  targetRole: string;
  readinessScore: number;
  readinessTier: string;
  readinessPercentile: number;
  readinessExplanation: string;
  overallSummary: string;
  strongSkills: string[];
  skillsToMaintain: string[];
  emergingSkills: string[];
  priorities: CareerPriority[];
  duration: PlanDuration;
  weeklyPlan: WeeklyPlan[];
  recommendedSkills: RecommendedSkillPlan[];
  recommendedInterventions: RecommendedInterventionItem[];
  recommendedProjects: RecommendedProjectItem[];
  recommendedOpportunities: OpportunityReadinessItem[];
  portfolioActions: PortfolioActionItem[];
  milestones: CareerMilestone[];
  nextBestAction: NextBestAction;
  aiExplanation?: string;
  requiresRoleSelection?: boolean;
}
