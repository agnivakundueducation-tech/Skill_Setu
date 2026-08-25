import { SetuActionMetadata, SetuActionType } from './setu';

export type CopilotRole = 'user' | 'assistant' | 'system';

export interface ActionCardData {
  type: 'role_readiness' | 'skill_gap' | 'internship_match' | 'learning_path' | 'assessment_prompt';
  title: string;
  subtitle?: string;
  metrics?: { label: string; value: string; color?: string }[];
  tags?: string[];
  primaryAction?: {
    label: string;
    actionType: 'navigate' | 'start_assessment' | 'apply_opportunity' | 'view_gap' | SetuActionType;
    payload?: string;
  };
}

export interface CopilotMessage {
  id: string;
  role: CopilotRole;
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  actionCard?: ActionCardData;
  actions?: SetuActionMetadata[];
  suggestedFollowUps?: string[];
  isError?: boolean;
  error?: string;
  lastUserQuery?: string;
}

export interface CopilotContext {
  studentName: string;
  currentRole: string;
  targetRole: string;
  readinessScore: number;
  percentile: number;
  topSkills: { name: string; score: number }[];
  criticalGaps: { name: string; gap: number }[];
  matchedInternships: { company: string; role: string; matchScore: number }[];
  institution: string;
  department: string;
}

export interface CopilotPromptTemplate {
  id: string;
  title: string;
  prompt: string;
  category: 'readiness' | 'learning' | 'internship' | 'skills' | 'general';
  icon: string;
  description: string;
  highlight?: boolean;
}
