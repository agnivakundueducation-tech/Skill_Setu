import React from 'react';
import { SoftSkillsAnswers } from '../../types/assessment';
import { RatingInput } from './RatingInput';
import { Users, HeartHandshake, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';

interface Step3SoftSkillsProps {
  data: SoftSkillsAnswers;
  onChange: (updated: Partial<SoftSkillsAnswers>) => void;
}

const LEADERSHIP_STYLES = [
  {
    id: 'Collaborative Driver & Quality Champion',
    title: 'Collaborative Driver & Quality Champion',
    desc: 'Brings cross-functional teams together, unblocks peers, and maintains high craft and testing standards.'
  },
  {
    id: 'Autonomous Deep-Work Specialist',
    title: 'Autonomous Deep-Work Specialist',
    desc: 'Excels at tackling complex, self-directed engineering challenges with minimal supervision.'
  },
  {
    id: 'Consensus Builder & Team Facilitator',
    title: 'Consensus Builder & Team Facilitator',
    desc: 'Synthesizes varying viewpoints, establishes engineering alignment, and prevents silos.'
  },
  {
    id: 'Product-Minded Pragmatic Builder',
    title: 'Product-Minded Pragmatic Builder',
    desc: 'Translates customer pain points directly into clean code, ruthlessly prioritizing high-impact deliverables.'
  }
];

export const Step3SoftSkills: React.FC<Step3SoftSkillsProps> = ({
  data,
  onChange
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Soft Skills Competency Ratings (1-5) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            1. Interpersonal, Collaboration & Execution Capabilities <span className="text-rose-500">*</span>
          </label>
          <span className="text-xs text-slate-400">1 (Novice) to 5 (Expert)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <RatingInput
            label="Technical Communication & Clarity"
            sublabel="Articulating technical design, writing clear PR descriptions & documentation"
            value={data.communicationRating}
            onChange={(val) => onChange({ communicationRating: val })}
          />

          <RatingInput
            label="Problem Decomposition & Structured Thinking"
            sublabel="Unpacking high-level requirements into incremental, testable engineering tasks"
            value={data.problemDecompositionRating}
            onChange={(val) => onChange({ problemDecompositionRating: val })}
          />

          <RatingInput
            label="Team Collaboration & Peer Empathy"
            sublabel="Active listening, pair programming, and cross-functional partner alignment"
            value={data.teamCollaborationRating}
            onChange={(val) => onChange({ teamCollaborationRating: val })}
          />

          <RatingInput
            label="Code Review Etiquette & Constructive Feedback"
            sublabel="Giving kind, actionable, and thorough feedback while gracefully receiving critiques"
            value={data.codeReviewRating}
            onChange={(val) => onChange({ codeReviewRating: val })}
          />

          <RatingInput
            label="Learning Agility & Fast Stack Adaptability"
            sublabel="Speed of picking up new languages, SDKs, or legacy systems productively"
            value={data.adaptabilityRating}
            onChange={(val) => onChange({ adaptabilityRating: val })}
          />

          <RatingInput
            label="Conflict Resolution & Objective Alignment"
            sublabel="Navigating engineering trade-offs and team disagreements with data and calm"
            value={data.conflictResolutionRating}
            onChange={(val) => onChange({ conflictResolutionRating: val })}
          />
        </div>
      </div>

      {/* 2. Stress & Deadline Management (Slider) */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            2. High-Pressure Pacing & Production Deadline Resilience
          </label>
          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-md self-start sm:self-auto">
            {data.stressManagementScore} / 10 Resilience Index
          </span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          How comfortably do you triage production emergencies, manage release dates, and maintain engineering composure under shifting priorities?
        </p>

        <div className="space-y-1 pt-1">
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={data.stressManagementScore}
            onChange={(e) => onChange({ stressManagementScore: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-1">
            <span>1 - Prefer Low-Pressure Structured Sprints</span>
            <span>5 - Solid Standard Sprint Pacing</span>
            <span>10 - Peak Composure in High-Stakes Launches</span>
          </div>
        </div>
      </div>

      {/* 3. Leadership & Collaboration Style (Radio) */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          3. Natural Working & Leadership Archetype <span className="text-rose-500">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LEADERSHIP_STYLES.map((style) => {
            const isSelected = data.leadershipStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onChange({ leadershipStyle: style.id })}
                className={`p-3.5 rounded-xl border text-left transition-all space-y-1 cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isSelected && <div className="w-1 h-1 rounded-full bg-white" />}
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {style.title}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {style.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
