import React from 'react';
import { AssessmentFormState } from '../../types/assessment';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Compass,
  Code2,
  Users,
  Briefcase,
  Sparkles,
  Edit3,
  CheckCircle2,
  Brain,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface Step5AssessmentSummaryProps {
  formData: AssessmentFormState;
  onEditStep: (stepIndex: number) => void;
  onSubmit: () => void;
  isAnalyzing: boolean;
}

export const Step5AssessmentSummary: React.FC<Step5AssessmentSummaryProps> = ({
  formData,
  onEditStep,
  onSubmit,
  isAnalyzing
}) => {
  const { careerInterests, technicalSkills, softSkills, careerPreferences } = formData;

  return (
    <div className="space-y-6">
      {/* AI Processing Ready Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 space-y-3 relative overflow-hidden shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/40 text-indigo-200 border border-indigo-400/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-300" />
                Step 5 of 5 • Pre-Flight Verification
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Assessment Summary & Readiness Synthesis
            </h3>
            <p className="text-xs text-indigo-200/80 max-w-2xl leading-relaxed">
              Review your responses below. Once submitted, our AI engine will generate your multidimensional Career Readiness Score, uncover hidden strengths, benchmark skill gaps, and match tailored high-growth roles.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            isLoading={isAnalyzing}
            leftIcon={Brain}
            onClick={onSubmit}
            className="bg-white hover:bg-slate-100 text-indigo-900 font-bold shadow-lg shrink-0 w-full sm:w-auto"
          >
            {isAnalyzing ? 'Analyzing Responses...' : 'Generate AI Analysis Report'}
          </Button>
        </div>
      </div>

      {/* Grid of Summarized Step Answers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1 Summary */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  1. Career Interests & Focus
                </h4>
              </div>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={Edit3}
                className="text-xs text-indigo-600 dark:text-indigo-400 p-1.5 h-auto"
                onClick={() => onEditStep(0)}
              >
                Edit
              </Button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Primary Focus:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {careerInterests.primaryDomain}
                </span>
              </div>

              <div>
                <span className="text-slate-400 text-[11px] block">Industry Sectors:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {careerInterests.industrySectors.map((sector) => (
                    <Badge key={sector} variant="default" size="sm">
                      {sector}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px] block">Problem Solving:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {careerInterests.problemSolvingPassion}/10 Level
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Cadence:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block">
                    {careerInterests.workVelocity}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 Summary */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <Code2 className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  2. Technical Skills & Architecture
                </h4>
              </div>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={Edit3}
                className="text-xs text-indigo-600 dark:text-indigo-400 p-1.5 h-auto"
                onClick={() => onEditStep(1)}
              >
                Edit
              </Button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Active Stack:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {technicalSkills.primaryLanguages.map((lang) => (
                    <Badge key={lang} variant="primary" size="sm">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-1 text-[11px]">
                <div className="p-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                  <span className="text-slate-400 text-[10px] block">Frontend</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{technicalSkills.frontendRating}/5</span>
                </div>
                <div className="p-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                  <span className="text-slate-400 text-[10px] block">Backend</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{technicalSkills.backendRating}/5</span>
                </div>
                <div className="p-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                  <span className="text-slate-400 text-[10px] block">Sys Design</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{technicalSkills.systemDesignRating}/5</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] block">Architecture Pattern:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block">
                  {technicalSkills.preferredArchitecture}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 Summary */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  3. Soft Skills & Execution
                </h4>
              </div>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={Edit3}
                className="text-xs text-indigo-600 dark:text-indigo-400 p-1.5 h-auto"
                onClick={() => onEditStep(2)}
              >
                Edit
              </Button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Leadership Archetype:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {softSkills.leadershipStyle}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-slate-400 text-[10px] block">Communication:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {softSkills.communicationRating}/5 Star Level
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Decomposition:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {softSkills.problemDecompositionRating}/5 Star Level
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Team Collaboration:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {softSkills.teamCollaborationRating}/5 Star Level
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Stress Resilience:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {softSkills.stressManagementScore}/10 Resilience
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 Summary */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  4. Preferences & Growth
                </h4>
              </div>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={Edit3}
                className="text-xs text-indigo-600 dark:text-indigo-400 p-1.5 h-auto"
                onClick={() => onEditStep(3)}
              >
                Edit
              </Button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 text-[10px] block">Work Mode:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {careerPreferences.workMode}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Target Band:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {careerPreferences.compensationBand}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] block">Target Company Maturity:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 block truncate">
                  {careerPreferences.companyStage}
                </span>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 text-[10px] block">Weekly Upskilling Dedication:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {careerPreferences.weeklyUpskillingHours} Hours / Week
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Trigger Card */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-slate-100">
              Ready for Evaluation.
            </span>{' '}
            All required modules completed. Ready to synthesize report.
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          isLoading={isAnalyzing}
          leftIcon={Sparkles}
          onClick={onSubmit}
          className="w-full sm:w-auto"
        >
          {isAnalyzing ? 'Running AI Engine...' : 'Run SkillSetu AI Analysis'}
        </Button>
      </div>
    </div>
  );
};
