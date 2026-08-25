import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { CollaborationMatchResult } from '../../types/collaboration';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Building2,
  Compass,
  Cpu,
  Target
} from 'lucide-react';

interface ExplainableCollaborationMatchProps {
  matchResult: CollaborationMatchResult;
  collaborationTitle?: string;
}

export const ExplainableCollaborationMatch: React.FC<ExplainableCollaborationMatchProps> = ({
  matchResult,
  collaborationTitle
}) => {
  const {
    overallMatch,
    matchedExpertise,
    partialExpertise,
    missingExpertise,
    researchAlignment,
    collaborationTypeMatch,
    workModeMatch,
    explanation,
    breakdown
  } = matchResult;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
    if (score >= 70) return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800';
    if (score >= 50) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
    return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
  };

  return (
    <Card
      variant="default"
      className="p-5 rounded-2xl border-indigo-100 dark:border-indigo-950/80 bg-gradient-to-b from-indigo-50/30 to-transparent dark:from-indigo-950/20 space-y-4"
    >
      {/* Header with Title & Overall Match */}
      <div className="flex items-center justify-between gap-3 border-b border-indigo-100 dark:border-indigo-900/50 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              Why this collaboration matches you
            </h4>
            <p className="text-[11px] text-slate-500">
              Deterministic match based on verified faculty expertise, research interests, and preferred types
            </p>
          </div>
        </div>

        <div className={`px-3 py-1.5 rounded-xl border text-center font-black ${getScoreColor(overallMatch)}`}>
          <div className="text-base leading-none">{overallMatch}%</div>
          <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">Match Score</div>
        </div>
      </div>

      {/* Narrative Explanation */}
      <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
        {explanation}
      </div>

      {/* 4-Quadrant Alignment & Gaps Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {/* Matched Expertise */}
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Matched Expertise ({matchedExpertise.length})
            </span>
            <span className="text-[11px] text-slate-400">Weight: 60%</span>
          </div>

          {matchedExpertise.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {matchedExpertise.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic">No direct competency overlap identified.</p>
          )}
        </div>

        {/* Research Alignment */}
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
            <span className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400">
              <BookOpen className="w-3.5 h-3.5" />
              Research Alignment ({researchAlignment.length})
            </span>
            <span className="text-[11px] text-slate-400">Weight: 20%</span>
          </div>

          {researchAlignment.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {researchAlignment.map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-medium"
                >
                  <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                  {topic}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic">General research compatibility.</p>
          )}
        </div>

        {/* Preference Alignment */}
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
            <span className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400">
              <Compass className="w-3.5 h-3.5" />
              Preference & Mode Alignment
            </span>
            <span className="text-[11px] text-slate-400">Weight: 20%</span>
          </div>

          <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              {collaborationTypeMatch ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-slate-700 inline-block shrink-0" />
              )}
              <span>Collaboration Type: {collaborationTypeMatch ? 'Matches your preferred formats' : 'Compatible'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {workModeMatch ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              )}
              <span>Work Mode: {workModeMatch ? 'Well aligned with faculty schedule' : 'Requires relocation / travel'}</span>
            </div>
          </div>
        </div>

        {/* Gaps / Unmatched Competencies */}
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
            <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              Potential Divergence ({missingExpertise.length})
            </span>
            <span className="text-[11px] text-slate-400">Consider in proposal</span>
          </div>

          {missingExpertise.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {missingExpertise.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium"
                >
                  <span className="text-amber-600">△</span>
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Zero identified gaps across all mandatory requirements.
            </p>
          )}
        </div>
      </div>

      {/* Breakdown Progress Bars */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Deterministic Scoring Breakdown
        </span>
        <div className="space-y-2">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Domain Expertise ({breakdown.weights.expertise}%)</span>
              <strong className="text-slate-900 dark:text-slate-100">{breakdown.expertiseScore}/100</strong>
            </div>
            <ProgressBar value={breakdown.expertiseScore} max={100} color="indigo" size="sm" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Research Alignment ({breakdown.weights.research}%)</span>
              <strong className="text-slate-900 dark:text-slate-100">{breakdown.researchScore}/100</strong>
            </div>
            <ProgressBar value={breakdown.researchScore} max={100} color="sky" size="sm" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Collaboration Type & Format ({breakdown.weights.type}%)</span>
              <strong className="text-slate-900 dark:text-slate-100">{breakdown.typeScore}/100</strong>
            </div>
            <ProgressBar value={breakdown.typeScore} max={100} color="emerald" size="sm" />
          </div>
        </div>
      </div>
    </Card>
  );
};
