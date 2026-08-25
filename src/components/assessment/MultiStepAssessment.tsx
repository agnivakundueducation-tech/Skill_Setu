import React, { useState, useEffect } from 'react';
import {
  AssessmentFormState,
  AssessmentResult,
  StepId
} from '../../types/assessment';
import {
  ASSESSMENT_STEPS,
  INITIAL_ASSESSMENT_STATE,
  generateMockAssessmentResult
} from '../../data/assessmentData';
import { useAuth } from '../../context/AuthContext';
import {
  firestoreService,
  computeSkillProfileFromAssessment,
  StudentAssessmentRecord
} from '../../services';
import { AssessmentProgressIndicator } from './AssessmentProgressIndicator';
import { Step1CareerInterests } from './Step1CareerInterests';
import { Step2TechnicalSkills } from './Step2TechnicalSkills';
import { Step3SoftSkills } from './Step3SoftSkills';
import { Step4CareerPreferences } from './Step4CareerPreferences';
import { Step5AssessmentSummary } from './Step5AssessmentSummary';
import { AssessmentResultsReport } from './AssessmentResultsReport';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  Brain,
  ShieldCheck,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface MultiStepAssessmentProps {
  onCompleteAssessment?: (result: AssessmentResult) => void;
  onExploreRoles?: (roleTitle: string) => void;
  initialStepIndex?: number;
}

const STORAGE_DRAFT_KEY = 'skillsetu_assessment_draft_v1';
const STORAGE_RESULT_KEY = 'skillsetu_assessment_result_v1';

export const MultiStepAssessment: React.FC<MultiStepAssessmentProps> = ({
  onCompleteAssessment,
  onExploreRoles,
  initialStepIndex = 0
}) => {
  const { appUser, isAuthenticated, isDemo } = useAuth();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(initialStepIndex);
  const [formData, setFormData] = useState<AssessmentFormState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DRAFT_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved assessment draft:', e);
    }
    return INITIAL_ASSESSMENT_STATE;
  });

  const [result, setResult] = useState<AssessmentResult | null>(() => {
    try {
      const savedResult = localStorage.getItem(STORAGE_RESULT_KEY);
      if (savedResult) {
        return JSON.parse(savedResult);
      }
    } catch (e) {
      console.error('Failed to parse saved assessment result:', e);
    }
    return null;
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<string>('');
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isRetryingSave, setIsRetryingSave] = useState(false);

  // Auto-persist draft to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(formData));
    } catch (e) {
      console.error('Failed to save assessment draft to localStorage:', e);
    }
  }, [formData]);

  const handleUpdateStep1 = (updated: Partial<AssessmentFormState['careerInterests']>) => {
    setFormData((prev) => ({
      ...prev,
      careerInterests: { ...prev.careerInterests, ...updated }
    }));
  };

  const handleUpdateStep2 = (updated: Partial<AssessmentFormState['technicalSkills']>) => {
    setFormData((prev) => ({
      ...prev,
      technicalSkills: { ...prev.technicalSkills, ...updated }
    }));
  };

  const handleUpdateStep3 = (updated: Partial<AssessmentFormState['softSkills']>) => {
    setFormData((prev) => ({
      ...prev,
      softSkills: { ...prev.softSkills, ...updated }
    }));
  };

  const handleUpdateStep4 = (updated: Partial<AssessmentFormState['careerPreferences']>) => {
    setFormData((prev) => ({
      ...prev,
      careerPreferences: { ...prev.careerPreferences, ...updated }
    }));
  };

  const handleNext = () => {
    if (currentStepIndex < ASSESSMENT_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToStep = (index: number) => {
    setCurrentStepIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveDraft = () => {
    try {
      localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(formData));
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2000);
    } catch (e) {
      console.error('Error saving draft:', e);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your assessment answers to defaults?')) {
      setFormData(INITIAL_ASSESSMENT_STATE);
      setResult(null);
      setSaveError(null);
      setCurrentStepIndex(0);
      try {
        localStorage.removeItem(STORAGE_DRAFT_KEY);
        localStorage.removeItem(STORAGE_RESULT_KEY);
      } catch (e) {
        console.error('Failed to clear storage:', e);
      }
    }
  };

  // Helper to persist generated result to Firestore for authenticated users
  const persistResultsToFirestore = async (
    generatedResult: AssessmentResult,
    targetFormData: AssessmentFormState
  ): Promise<boolean> => {
    if (!isAuthenticated || isDemo || !appUser?.uid) {
      // Demo mode or unauthenticated: bypass Firestore
      return true;
    }

    try {
      const uid = appUser.uid;
      const skillProfile = computeSkillProfileFromAssessment(uid, targetFormData);
      const assessmentRecord: StudentAssessmentRecord = {
        assessmentId: `assess-${Date.now()}`,
        uid,
        careerGoal: targetFormData.careerInterests.primaryDomain || 'Full-Stack Software Engineering',
        careerInterests: targetFormData.careerInterests,
        technicalResponses: targetFormData.technicalSkills,
        softSkillResponses: targetFormData.softSkills,
        aptitudeResponses: targetFormData.careerPreferences,
        readinessScore: generatedResult.readinessScore,
        percentileRank: generatedResult.percentileRank,
        tierLabel: generatedResult.tierLabel,
        strengths: generatedResult.strengths,
        weaknesses: generatedResult.weaknesses,
        skillGaps: generatedResult.skillGaps,
        recommendedRoles: generatedResult.recommendedRoles,
        completedAt: new Date().toISOString()
      };

      // Save to Firestore collections & subcollections in parallel
      await Promise.all([
        firestoreService.saveAssessment(uid, assessmentRecord),
        firestoreService.saveSkillProfile(uid, skillProfile),
        firestoreService.updateStudentReadiness(uid, generatedResult.readinessScore)
      ]);

      return true;
    } catch (error) {
      console.error('[SkillSetu] Failed to persist assessment to Firestore:', error);
      return false;
    }
  };

  const handleSubmitAssessment = () => {
    setIsAnalyzing(true);
    setSaveError(null);
    setAnalysisStage('Synthesizing career interests & technical ratings...');

    setTimeout(() => {
      setAnalysisStage('Benchmarking skills against industry baseline...');
    }, 450);

    setTimeout(() => {
      setAnalysisStage('Calculating Skill DNA matrix and readiness score...');
    }, 900);

    setTimeout(async () => {
      const generatedResult = generateMockAssessmentResult(formData);

      // Persist to Firestore if authenticated
      if (isAuthenticated && !isDemo && appUser?.uid) {
        setAnalysisStage('Saving verified Skill Profile to cloud...');
        const isSaved = await persistResultsToFirestore(generatedResult, formData);
        if (!isSaved) {
          setIsAnalyzing(false);
          setResult(generatedResult); // Keep local result available
          setSaveError("Your assessment was completed, but we couldn't save your results. Please try again.");
          try {
            localStorage.setItem(STORAGE_RESULT_KEY, JSON.stringify(generatedResult));
          } catch {}
          return;
        }
      }

      setResult(generatedResult);
      setIsAnalyzing(false);
      setSaveError(null);

      try {
        localStorage.setItem(STORAGE_RESULT_KEY, JSON.stringify(generatedResult));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('storage'));
        }
      } catch (e) {
        console.error('Failed to save assessment result:', e);
      }

      if (onCompleteAssessment) {
        onCompleteAssessment(generatedResult);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1400);
  };

  const handleRetrySave = async () => {
    if (!result) return;
    setIsRetryingSave(true);
    setSaveError(null);

    const isSaved = await persistResultsToFirestore(result, formData);
    setIsRetryingSave(false);

    if (isSaved) {
      setSaveError(null);
      try {
        localStorage.setItem(STORAGE_RESULT_KEY, JSON.stringify(result));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('storage'));
        }
      } catch {}
      if (onCompleteAssessment) {
        onCompleteAssessment(result);
      }
    } else {
      setSaveError("Your assessment was completed, but we couldn't save your results. Please try again.");
    }
  };

  const handleRetake = () => {
    setResult(null);
    setSaveError(null);
    setCurrentStepIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If result is already generated and user is not in review/re-edit mode, display the result
  if (result) {
    return (
      <div className="space-y-4">
        {/* Firestore Failure Banner with Retry Button (Section 10) */}
        {saveError && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <p className="text-xs sm:text-sm font-medium">
                {saveError}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={RefreshCw}
              isLoading={isRetryingSave}
              onClick={handleRetrySave}
              className="text-xs bg-white dark:bg-slate-900 border-amber-300 hover:bg-amber-100 text-amber-900 dark:text-amber-200 shrink-0 self-start sm:self-center"
            >
              Retry Saving
            </Button>
          </div>
        )}

        <AssessmentResultsReport
          result={result}
          onRetake={handleRetake}
          onExploreRoles={onExploreRoles}
          onSaveToProfile={() => {
            handleRetrySave();
          }}
        />
      </div>
    );
  }

  const currentStep = ASSESSMENT_STEPS[currentStepIndex];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Top Header Card */}
      <Card variant="default" className="p-5 border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                <Brain className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                Adaptive Skill Evaluation
              </span>
              <span className="text-xs text-slate-400 font-mono">5 Steps</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              SkillSetu Comprehensive Skill & Readiness Assessment
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentStep.description}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={Save}
              onClick={handleSaveDraft}
              className="text-xs text-slate-600 dark:text-slate-300"
            >
              {savedFeedback ? 'Draft Saved!' : 'Save Progress'}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              leftIcon={RotateCcw}
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <AssessmentProgressIndicator
          currentStepIndex={currentStepIndex}
          onSelectStep={handleJumpToStep}
        />
      </Card>

      {/* Main Step Form Body */}
      <Card variant="default" className="p-6 border-slate-200/80 dark:border-slate-800 shadow-sm relative">
        {/* Step 1: Career Interests */}
        {currentStepIndex === 0 && (
          <Step1CareerInterests
            data={formData.careerInterests}
            onChange={handleUpdateStep1}
          />
        )}

        {/* Step 2: Technical Skills */}
        {currentStepIndex === 1 && (
          <Step2TechnicalSkills
            data={formData.technicalSkills}
            onChange={handleUpdateStep2}
          />
        )}

        {/* Step 3: Soft Skills */}
        {currentStepIndex === 2 && (
          <Step3SoftSkills
            data={formData.softSkills}
            onChange={handleUpdateStep3}
          />
        )}

        {/* Step 4: Career Preferences */}
        {currentStepIndex === 3 && (
          <Step4CareerPreferences
            data={formData.careerPreferences}
            onChange={handleUpdateStep4}
          />
        )}

        {/* Step 5: Summary & Submission */}
        {currentStepIndex === 4 && (
          <Step5AssessmentSummary
            formData={formData}
            onEditStep={handleJumpToStep}
            onSubmit={handleSubmitAssessment}
            isAnalyzing={isAnalyzing}
          />
        )}

        {/* AI Loading Modal Overlay during final synthesis */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center p-6 text-white text-center z-50 animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center mb-4 animate-pulse">
              <Sparkles className="w-7 h-7 text-indigo-400 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              SkillSetu AI Engine Synthesizing
            </h3>
            <p className="text-xs text-indigo-200/90 font-mono max-w-md animate-pulse">
              {analysisStage}
            </p>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="md"
            leftIcon={ArrowLeft}
            disabled={currentStepIndex === 0 || isAnalyzing}
            onClick={handleBack}
            className="text-xs"
          >
            Previous Step
          </Button>

          <div className="flex items-center gap-2">
            {currentStepIndex < ASSESSMENT_STEPS.length - 1 ? (
              <Button
                variant="primary"
                size="md"
                rightIcon={ArrowRight}
                onClick={handleNext}
                className="text-xs font-bold"
              >
                Continue to Step {currentStepIndex + 2}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                leftIcon={Sparkles}
                isLoading={isAnalyzing}
                onClick={handleSubmitAssessment}
                className="text-xs font-bold bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700"
              >
                Submit & Generate AI Analysis
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
