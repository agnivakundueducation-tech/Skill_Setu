import React, { useState } from 'react';
import { SkillDnaItem, EvidenceArtifact } from '../../../types/skillDna';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { ProgressBar } from '../../ui/ProgressBar';
import {
  Code2,
  Boxes,
  Database,
  Globe,
  Cloud,
  Brain,
  ShieldCheck,
  MessageSquare,
  Users,
  Award,
  Zap,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowUpRight
} from 'lucide-react';

interface SkillDnaCardProps {
  skill: SkillDnaItem;
  onViewEvidence: (skill: SkillDnaItem, artifact?: EvidenceArtifact) => void;
  onVerifySkill: (skill: SkillDnaItem) => void;
}

// Icon mapping helper
const getSkillIcon = (iconName: string) => {
  switch (iconName) {
    case 'Code2':
      return Code2;
    case 'Boxes':
      return Boxes;
    case 'Database':
      return Database;
    case 'Globe':
      return Globe;
    case 'Cloud':
      return Cloud;
    case 'Brain':
      return Brain;
    case 'ShieldCheck':
      return ShieldCheck;
    case 'MessageSquare':
      return MessageSquare;
    case 'Users':
      return Users;
    case 'Award':
      return Award;
    case 'Zap':
      return Zap;
    default:
      return Sparkles;
  }
};

export const SkillDnaCard: React.FC<SkillDnaCardProps> = ({
  skill,
  onViewEvidence,
  onVerifySkill
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = getSkillIcon(skill.iconName);

  const delta = skill.verificationScore - skill.industryBenchmark;

  return (
    <Card
      variant="default"
      className="p-5 border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-800 transition-all hover:shadow-md group relative overflow-hidden"
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 transition-transform group-hover:scale-105 ${
                skill.category === 'technical'
                  ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50'
                  : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {skill.name}
                </h3>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                    skill.category === 'technical'
                      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {skill.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {skill.subcategory}
              </p>
            </div>
          </div>

          <Badge variant={skill.level === 'Master' ? 'success' : 'primary'} size="sm">
            {skill.level}
          </Badge>
        </div>

        {/* Core Metric Highlights Grid (Current Score, Verification Score, Evidence Count) */}
        <div className="grid grid-cols-3 gap-2 p-3 my-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 text-center">
          {/* Current Score */}
          <div className="flex flex-col items-center justify-center p-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Current
            </span>
            <div className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">
              {skill.currentScore}
              <span className="text-[10px] font-normal text-slate-400">/100</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Self/Active</span>
          </div>

          {/* Verification Score */}
          <div className="flex flex-col items-center justify-center p-1 bg-white dark:bg-slate-900 rounded-lg shadow-2xs border border-indigo-100 dark:border-indigo-900/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5" />
              Verified
            </span>
            <div className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {skill.verificationScore}
              <span className="text-[10px] font-normal text-indigo-400">/100</span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" />
              +{skill.growthChange}%
            </span>
          </div>

          {/* Evidence Count */}
          <button
            type="button"
            onClick={() => onViewEvidence(skill)}
            className="flex flex-col items-center justify-center p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
            title="Click to view verified evidence list"
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Evidence
            </span>
            <div className="text-sm font-extrabold text-amber-600 dark:text-amber-400 mt-0.5 flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5" />
              {skill.evidenceCount}
            </div>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 underline font-medium">
              Artifacts
            </span>
          </button>
        </div>

        {/* Progress Indicators */}
        <div className="space-y-2 my-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-indigo-500" />
                Verified Index:
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {skill.verificationScore}%
              </span>
            </div>
            <ProgressBar
              value={skill.verificationScore}
              color={skill.verificationScore >= 90 ? 'indigo' : 'emerald'}
              size="sm"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Active Competency:</span>
              <span className="font-semibold">{skill.currentScore}%</span>
            </div>
            <ProgressBar
              value={skill.currentScore}
              color="slate"
              size="xs"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
            <span>Benchmark: {skill.industryBenchmark}%</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              +{delta} pts vs Industry
            </span>
          </div>
        </div>

        {/* Actionable Gap & Target Pathway */}
        <div className="p-3 my-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Target Pathway</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              skill.verificationScore >= skill.industryBenchmark
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
            }`}>
              {skill.verificationScore >= skill.industryBenchmark ? 'Target Achieved' : `Gap: -${Math.abs(delta)} pts`}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center text-[11px]">
            <div className="p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="block text-[10px] text-slate-400">Current</span>
              <strong className="font-bold text-slate-800 dark:text-slate-200">{skill.verificationScore}%</strong>
            </div>
            <div className="p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="block text-[10px] text-slate-400">Target</span>
              <strong className="font-bold text-indigo-600 dark:text-indigo-400">{skill.industryBenchmark}%</strong>
            </div>
            <div className="p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="block text-[10px] text-slate-400">Next Action</span>
              <strong className="font-bold text-slate-700 dark:text-slate-300 text-[10px] truncate block">
                {skill.verificationScore >= skill.industryBenchmark ? 'Certified' : 'Assess'}
              </strong>
            </div>
          </div>
        </div>

        {/* Key Competencies Tags */}
        <div className="space-y-1.5 my-3">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Assessed Competencies:
          </span>
          <div className="flex flex-wrap gap-1">
            {skill.keyCompetencies.slice(0, 3).map((comp, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
              >
                {comp}
              </span>
            ))}
            {skill.keyCompetencies.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                +{skill.keyCompetencies.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Expandable Evidence Preview */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-amber-500" />
                Verified Evidence Proofs ({skill.evidenceList.length})
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {skill.evidenceList.map((artifact) => (
                <div
                  key={artifact.id}
                  onClick={() => onViewEvidence(skill, artifact)}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 hover:border-indigo-300 transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {artifact.title}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 shrink-0 font-medium">
                      {artifact.verificationBadge}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {artifact.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>{artifact.date}</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {artifact.scoreOrMetric}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 cursor-pointer transition-colors"
        >
          {isExpanded ? (
            <>
              <span>Hide Details</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>{skill.evidenceCount} Proofs</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs px-2.5 py-1"
            onClick={() => onViewEvidence(skill)}
          >
            Proof Vault
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={Sparkles}
            className="text-xs px-3 py-1"
            onClick={() => onVerifySkill(skill)}
          >
            Verify
          </Button>
        </div>
      </div>
    </Card>
  );
};
