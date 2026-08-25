import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { SkillAssessed } from '../../../types/student';
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  Sparkles,
  Calendar,
  Building2,
  ThumbsUp,
  FolderGit2,
  TrendingUp
} from 'lucide-react';

interface VerifiedSkillsSectionProps {
  verifiedSkills: SkillAssessed[];
}

export const VerifiedSkillsSection: React.FC<VerifiedSkillsSectionProps> = ({
  verifiedSkills
}) => {
  return (
    <div id="verified-skills" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Cryptographically Verified Skills & Credentials
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Assessed via proctored benchmarks, industry lab sandboxes, and enterprise partner evaluations
          </p>
        </div>

        <Badge variant="primary" size="sm" className="self-start sm:self-auto font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
          {verifiedSkills.length} Verified Credentials
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {verifiedSkills.map((skill) => (
          <Card
            key={skill.id}
            variant="default"
            className="border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800 transition-all p-5 flex flex-col justify-between shadow-xs relative overflow-hidden"
          >
            {/* Top Badge highlight */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                  {skill.category}
                </span>

                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{skill.verificationBadge}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {skill.name}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">Verified by {skill.verifiedBy}</span>
                </div>
              </div>

              {/* Score Metric Bar */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400">Assessment Score</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-sm font-black">
                    {skill.score}/100
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>Method: {skill.assessmentType}</span>
                  <span className="flex items-center gap-0.5 text-emerald-600">
                    <TrendingUp className="w-3 h-3" />
                    +{skill.growth}% growth
                  </span>
                </div>
              </div>

              {/* Related Projects */}
              {skill.relatedProjects && skill.relatedProjects.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <FolderGit2 className="w-3 h-3 text-slate-400" />
                    Demonstrated In
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {skill.relatedProjects.map((proj, pIdx) => (
                      <span
                        key={pIdx}
                        className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md"
                      >
                        {proj}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {skill.lastAssessed}
              </span>
              <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                <ThumbsUp className="w-3 h-3" />
                {skill.endorsements} endorsements
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
