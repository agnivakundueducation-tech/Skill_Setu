import { SIH_SHOWCASE_STEPS } from '../data/sihShowcaseData';
import { ShowcaseStep } from '../types/showcase';
import { UserRole } from '../types';

class SihShowcaseService {
  private currentStepIndex = 0;
  private listeners: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const savedIndex = localStorage.getItem('sih-showcase-step');
      if (savedIndex !== null) {
        const parsed = parseInt(savedIndex, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < SIH_SHOWCASE_STEPS.length) {
          this.currentStepIndex = parsed;
        }
      }
    }
  }

  public getSteps(): ShowcaseStep[] {
    return SIH_SHOWCASE_STEPS;
  }

  public getCurrentStep(): ShowcaseStep {
    return SIH_SHOWCASE_STEPS[this.currentStepIndex] || SIH_SHOWCASE_STEPS[0];
  }

  public getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }

  public setStepIndex(index: number): void {
    if (index >= 0 && index < SIH_SHOWCASE_STEPS.length) {
      this.currentStepIndex = index;
      if (typeof window !== 'undefined') {
        localStorage.setItem('sih-showcase-step', String(index));
      }
      this.notifyListeners();
    }
  }

  public nextStep(): ShowcaseStep | null {
    if (this.currentStepIndex < SIH_SHOWCASE_STEPS.length - 1) {
      this.setStepIndex(this.currentStepIndex + 1);
      return this.getCurrentStep();
    }
    return null;
  }

  public prevStep(): ShowcaseStep | null {
    if (this.currentStepIndex > 0) {
      this.setStepIndex(this.currentStepIndex - 1);
      return this.getCurrentStep();
    }
    return null;
  }

  public resetShowcase(): void {
    this.setStepIndex(0);
  }

  public triggerCopilotForCurrentStep(customPrompt?: string): void {
    const step = this.getCurrentStep();
    const promptToSend = customPrompt || step.copilotPrompt;

    if (typeof window !== 'undefined') {
      // 1. Open the widget
      window.dispatchEvent(new CustomEvent('open-setu-copilot', { detail: { prompt: promptToSend } }));

      // 2. Transmit prompt to copilot chat
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('setu-copilot-prompt', {
          detail: {
            prompt: promptToSend,
            autoSend: true
          }
        }));
      }, 150);
    }
  }

  /**
   * Safe Demo Reset: Clears demo session state and resets to Step 1 without modifying authenticated Firestore data.
   */
  public resetDemoSession(setRoleCallback?: (role: UserRole) => void): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sih-showcase-step');
      localStorage.removeItem('skillsetu-demo-overrides');
    }
    this.currentStepIndex = 0;
    this.notifyListeners();

    if (setRoleCallback) {
      setRoleCallback('industry');
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sih-demo-reset-completed'));
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(l => {
      try {
        l();
      } catch (err) {
        console.error('Error in showcase listener:', err);
      }
    });
  }
}

export const sihShowcaseService = new SihShowcaseService();
