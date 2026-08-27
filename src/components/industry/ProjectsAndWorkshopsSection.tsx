import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LiveProjectPosting, WorkshopPosting } from '../../types/industry';
import {
  FileCode2,
  Presentation,
  Plus,
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface ProjectsAndWorkshopsSectionProps {
  projects: LiveProjectPosting[];
  workshops: WorkshopPosting[];
  onOpenCreateProject: () => void;
  onOpenCreateWorkshop: () => void;
}

export const ProjectsAndWorkshopsSection: React.FC<ProjectsAndWorkshopsSectionProps> = ({
  projects,
  workshops,
  onOpenCreateProject,
  onOpenCreateWorkshop
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'workshops'>('projects');

  return (
    <div className="space-y-4">
      {/* Tab Switcher & Quick Actions */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'projects'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Live Industry Projects ({projects.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('workshops')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'workshops'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Workshops & Masterclasses ({workshops.length})</span>
          </button>
        </div>

        <div>
          {activeTab === 'projects' ? (
            <Button
              variant="primary"
              size="sm"
              leftIcon={Plus}
              onClick={onOpenCreateProject}
              className="text-xs"
            >
              Create Live Project
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              leftIcon={Plus}
              onClick={onOpenCreateWorkshop}
              className="text-xs"
            >
              Create Workshop
            </Button>
          )}
        </div>
      </div>

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Card
              key={project.id}
              variant="default"
              className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-600 transition-all hover:shadow-md space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="primary" size="sm" className="text-[10px]">
                    {project.category}
                  </Badge>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" />
                    {project.bountyOrGrant}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Duration: {project.duration}</span>
                    <span>•</span>
                    <span>Deadline: {project.deadline}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {project.problemStatement}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.requiredTechStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Key Deliverables list */}
                <div className="space-y-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Key Deliverables
                  </div>
                  {project.deliverables.map((deliv, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span className="line-clamp-1">{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Mentor & Submissions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <img
                    src={project.mentorLead.avatar}
                    alt={project.mentorLead.name}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    Mentor: {project.mentorLead.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                  <Users className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{project.submissionsCount} Submissions</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Workshops Tab */}
      {activeTab === 'workshops' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {workshops.map((workshop) => (
            <Card
              key={workshop.id}
              variant="default"
              className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-600 transition-all hover:shadow-md space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="primary" size="sm" className="text-[10px]">
                    {workshop.platform}
                  </Badge>
                  {workshop.certificateIssued && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200/60">
                      <Award className="w-3 h-3" />
                      Verifiable Certificate
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {workshop.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      {workshop.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {workshop.time} ({workshop.duration})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                  <img
                    src={workshop.instructorAvatar}
                    alt={workshop.instructor}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {workshop.instructor}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {workshop.instructorRole}
                    </div>
                  </div>
                </div>

                {/* Prerequisites */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Target Audience & Prerequisites:
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {workshop.targetAudience}
                  </div>
                </div>
              </div>

              {/* Bottom Registration & Seats Capacity */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{
                        width: `${Math.min(100, (workshop.registeredCount / workshop.capacity) * 100)}%`
                      }}
                    />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {workshop.registeredCount}/{workshop.capacity} Registered
                  </span>
                </div>

                <Badge variant="success" size="sm">
                  Registration Open
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
