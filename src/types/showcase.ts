import { UserRole } from './index';

export interface ShowcaseStep {
  stepNumber: number;
  id: string;
  role: UserRole;
  roleTitle: string;
  title: string;
  subtitle: string;
  entityName: string;
  route: string;
  targetTab?: string;
  contextExplanation: string;
  whyItMatters: string;
  copilotPrompt: string;
  metrics: {
    label: string;
    value: string | number;
    badge?: string;
  }[];
  keyTakeaway: string;
  actionLabel: string;
}

export interface ShowcaseState {
  currentStepIndex: number;
  isAutoPlay: boolean;
  completedSteps: number[];
  isClosedLoopModalOpen: boolean;
  isFlowModalOpen: boolean;
  isBannerMinimized: boolean;
}
