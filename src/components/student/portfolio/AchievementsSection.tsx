import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { AchievementEntry } from '../../../types/student';
import {
  Trophy,
  Award,
  Medal,
  GitMerge,
  BookOpen,
  Cloud,
  ExternalLink,
  Calendar,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface AchievementsSectionProps {
  achievements: AchievementEntry[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  achievements
}) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'Hackathon':
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'Competitive Programming':
        return <Award className="w-5 h-5 text-indigo-500" />;
      case 'Academic':
        return <Medal className="w-5 h-5 text-emerald-500" />;
      case 'Open Source':
        return <GitMerge className="w-5 h-5 text-purple-500" />;
      case 'Fellowship':
        return <Cloud className="w-5 h-5 text-sky-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-500" />;
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'Hackathon':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Competitive Programming':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'Academic':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Open Source':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div id="achievements" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Honors, Hackathons & Key Achievements
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Competitive programming benchmarks, national hackathons, research publications, and open-source milestones
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          {achievements.length} Accolades
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((ach) => (
          <Card
            key={ach.id}
            variant="default"
            className="border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all p-5 flex flex-col justify-between shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                  {getIcon(ach.category)}
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getCategoryBadgeColor(ach.category)}`}>
                  {ach.category}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {ach.title}
                </h4>
                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {ach.issuer}
                </div>
              </div>

              {/* Metric Callout */}
              {ach.metric && (
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500 text-[11px]">Rank / Metric:</span>
                  <span className="text-slate-900 dark:text-slate-100 font-mono">
                    {ach.metric}
                  </span>
                </div>
              )}

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {ach.description}
              </p>
            </div>

            {/* Footer */}
            <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {ach.date}
              </span>

              {ach.link && (
                <a
                  href={ach.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <span>Verify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
