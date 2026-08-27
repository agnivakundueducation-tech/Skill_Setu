import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { StudentProject } from '../../../types/student';
import {
  FolderGit2,
  Github,
  ExternalLink,
  Star,
  CheckCircle2,
  Award,
  Sparkles,
  Layers,
  Activity
} from 'lucide-react';

interface ProjectsSectionProps {
  projects: StudentProject[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  return (
    <div id="projects" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Verified Projects & Architecture Artifacts
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Open-source repositories evaluated on architectural rigor, latency benchmarks, and code maintainability
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          {projects.length} Verified Repositories
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            variant="default"
            className="overflow-hidden border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-md"
          >
            <div>
              {/* Thumbnail Image Banner */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-md border border-white/10">
                    {project.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-950/80 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 backdrop-blur-md">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{project.verifiedStatus}</span>
                </div>
              </div>

              <div className="p-5 space-y-3.5">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {project.title}
                    </h4>
                    {project.starsCount && (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-900/60 shrink-0">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {project.starsCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {project.tagline}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Key Technical Metrics Chips */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                    {project.metrics.map((metric, mIdx) => (
                      <div key={mIdx} className="text-center">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          {metric.label}
                        </div>
                        <div className="text-xs font-black text-slate-900 dark:text-slate-100">
                          {metric.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills Tags */}
                <div className="space-y-1">
                  <div className="flex flex-wrap gap-1.5">
                    {project.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Links & Footer */}
            <div className="px-5 pb-5 pt-0 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 pt-3">
              <div className="text-[11px] text-slate-400">
                {project.industryPartner ? (
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    {project.industryPartner}
                  </span>
                ) : (
                  <span>Completed {project.completedDate}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                    title="View GitHub Repository"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {project.liveDemoUrl && (
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-bold transition-colors"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
