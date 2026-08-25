import React from 'react';
import { SkillDnaItem, EvidenceArtifact } from '../../../types/skillDna';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import {
  X,
  ShieldCheck,
  FileCheck,
  ExternalLink,
  Award,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Link,
  Lock,
  GitBranch
} from 'lucide-react';

interface SkillDnaEvidenceModalProps {
  skill: SkillDnaItem | null;
  selectedArtifact?: EvidenceArtifact | null;
  isOpen: boolean;
  onClose: () => void;
  onTakeAssessment?: (skillName: string) => void;
}

export const SkillDnaEvidenceModal: React.FC<SkillDnaEvidenceModalProps> = ({
  skill,
  selectedArtifact,
  isOpen,
  onClose,
  onTakeAssessment
}) => {
  if (!isOpen || !skill) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                skill.category === 'technical'
                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                  : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {skill.name} Evidence & Verification Vault
                </h2>
                <Badge variant="primary" size="sm">
                  {skill.verificationScore}/100 Verified
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {skill.evidenceCount} cryptographically anchored evidence artifacts & proctored evaluations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Artifacts */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Snapshot Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                Verification Score
              </span>
              <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                {skill.verificationScore} / 100
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                Percentile Standing
              </span>
              <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Top {100 - skill.percentile}% Globally
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                Industry Benchmark
              </span>
              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                +{skill.verificationScore - skill.industryBenchmark} pts Delta
              </span>
            </div>
          </div>

          {/* Evidence List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-amber-500" />
              Verified Proof Artifacts ({skill.evidenceList.length})
            </h3>

            <div className="space-y-3">
              {skill.evidenceList.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="primary" size="sm">
                        {item.verificationBadge}
                      </Badge>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                        {item.scoreOrMetric}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                        Verified by: <strong className="text-slate-700 dark:text-slate-300">{item.verifiedBy}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                    </div>

                    {item.proofUrl && (
                      <a
                        href={item.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <span>Inspect External Proof</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/30">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={Sparkles}
            onClick={() => {
              onClose();
              if (onTakeAssessment) {
                onTakeAssessment(skill.name);
              }
            }}
          >
            Launch Proctored Assessment for {skill.name}
          </Button>
        </div>
      </div>
    </div>
  );
};
