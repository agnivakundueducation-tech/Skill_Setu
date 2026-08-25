export type PhaseStatus = 'in-progress' | 'upcoming' | 'completed';

export interface RoadmapMilestoneTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  resourceLink?: string;
  resourceTitle?: string;
  duration?: string;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string; // e.g. "Improve DSA", "Build React Project", etc.
  subtitle: string;
  description: string;
  status: PhaseStatus;
  estimatedReadinessIncrease: number; // e.g. +5%
  resultingReadiness: number; // e.g. 83%
  durationWeeks: string;
  iconName: string;
  skillsCovered: string[];
  tasks: RoadmapMilestoneTask[];
  recommendedProjects?: {
    title: string;
    description: string;
    deliverable: string;
  }[];
  certificationsOrLabs?: {
    title: string;
    provider: string;
    level: string;
  }[];
  hiringImpact: string;
}

export interface CareerRoadmapData {
  careerGoal: string; // e.g. "Software Engineer"
  goalDescription: string;
  currentReadiness: number; // 78%
  projectedFinalReadiness: number; // 98%
  totalPhases: number;
  estimatedTotalWeeks: string;
  lastUpdated: string;
  phases: RoadmapPhase[];
}
