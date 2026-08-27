import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { STUDENT_PROJECTS } from '../../data/studentData';
import { Briefcase, Star, Github, ExternalLink, ChevronRight, CheckCircle2 } from 'lucide-react';

interface ProjectsCardProps {
  onViewAll?: () => void;
  onSelectProject?: (id: string) => void;
}

export const ProjectsCard: React.FC<ProjectsCardProps> = ({
  onViewAll,
  onSelectProject
}) => {
  const projects = STUDENT_PROJECTS;
  const topProject = projects[0];
  const totalStars = projects.reduce((acc, p) => acc + (p.starsCount || 0), 0);

  return (
    <Card variant="default" className="relative overflow-hidden p-5 flex flex-col justify-between border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-600/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Projects
            </span>
          </div>
          <Badge variant="warning" size="sm">
            4 Verified
          </Badge>
        </div>

        {/* Big Count Display */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {projects.length}
          </span>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Live Builds
          </span>
          <span className="ml-auto flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
            {totalStars} GitHub Stars
          </span>
        </div>

        {/* Top Featured Project */}
        {topProject && (
          <div className="p-3 my-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {topProject.title}
              </span>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Score {topProject.mentorFeedbackScore}/100
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
              {topProject.tagline}
            </div>
            <div className="flex flex-wrap gap-1 pt-0.5">
              {topProject.skills.slice(0, 3).map(skill => (
                <span
                  key={skill}
                  className="text-[9px] font-medium bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          rightIcon={ChevronRight}
          onClick={onViewAll}
        >
          View Portfolio (4)
        </Button>
        {topProject && (
          <a
            href={topProject.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="View GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>
        )}
      </div>
    </Card>
  );
};
