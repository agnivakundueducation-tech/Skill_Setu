import React from 'react';
import {
  Boxes,
  Globe,
  Cloud,
  Briefcase,
  Award,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Check,
  BookOpen,
  Code2,
  FolderGit2,
  Rocket
} from 'lucide-react';
import { RoadmapPhase, RoadmapMilestoneTask } from '../../../types/careerRoadmap';
import { Badge } from '../../ui/Badge';

interface CareerRoadmapTimelineProps {
  phases: RoadmapPhase[];
  onToggleTask: (phaseId: string, taskId: string) => void;
  expandedPhaseIds: string[];
  onToggleExpand: (phaseId: string) => void;
  onOpenResource: (task: RoadmapMilestoneTask, phase: RoadmapPhase) => void;
  onLaunchPhaseAction: (phase: RoadmapPhase) => void;
}

export const CareerRoadmapTimeline: React.FC<CareerRoadmapTimelineProps> = ({
  phases,
  onToggleTask,
  expandedPhaseIds,
  onToggleExpand,
  onOpenResource,
  onLaunchPhaseAction
}) => {
  // Helper to resolve icon by phase iconName
  const renderPhaseIcon = (iconName: string, className: string = 'w-5 h-5') => {
    switch (iconName) {
      case 'Boxes':
        return <Boxes className={className} />;
      case 'Globe':
        return <Globe className={className} />;
      case 'Cloud':
        return <Cloud className={className} />;
      case 'Briefcase':
        return <Briefcase className={className} />;
      case 'Award':
      default:
        return <Award className={className} />;
    }
  };

  const getPhaseActionLabel = (phaseNumber: number) => {
    switch (phaseNumber) {
      case 1:
        return 'Launch DSA Practice Arena';
      case 2:
        return 'Explore React Project Blueprints';
      case 3:
        return 'Start Cloud Deployment Sandbox';
      case 4:
        return 'Browse Industry Problem Statements';
      case 5:
        return 'View 14 Matched Internships';
      default:
        return 'Start Phase Milestones';
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <span>Career Milestones Timeline</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                5 Phases to Software Engineer
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Complete tasks chronologically to systematically expand your Skill DNA and reach 98% industry readiness.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            Phase in progress
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            Upcoming
          </span>
        </div>
      </div>

      {/* Timeline Node Chain */}
      <div className="relative pl-4 sm:pl-8 border-l-2 border-slate-200 dark:border-slate-800 space-y-8 my-4 ml-3 sm:ml-4">
        {phases.map((phase, index) => {
          const isExpanded = expandedPhaseIds.includes(phase.id);
          const completedTasksInPhase = phase.tasks.filter((t) => t.completed).length;
          const allTasksCompleted = completedTasksInPhase === phase.tasks.length && phase.tasks.length > 0;
          const previousReadiness = phase.resultingReadiness - phase.estimatedReadinessIncrease;

          // Status colors and styling
          const isCurrentActive = phase.status === 'in-progress';
          const isCompleted = phase.status === 'completed' || allTasksCompleted;

          return (
            <div
              key={phase.id}
              id={`phase-${phase.id}`}
              className="relative group transition-all duration-200"
            >
              {/* Left Timeline Node Bullet Icon */}
              <div
                className={`absolute -left-[25px] sm:-left-[41px] top-4 w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md transition-all ${
                  isCompleted
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-950/60'
                    : isCurrentActive
                    ? 'bg-primary text-white ring-4 ring-primary/20 animate-pulse'
                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-2 border-slate-300 dark:border-slate-700'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <span>{phase.phaseNumber}</span>
                )}
              </div>

              {/* Main Phase Card */}
              <div
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 sm:p-6 shadow-sm transition-all duration-200 ${
                  isCurrentActive
                    ? 'border-primary/40 shadow-indigo-500/5 ring-1 ring-primary/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Phase Header Strip */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        Phase {phase.phaseNumber}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {phase.durationWeeks}
                      </span>
                      
                      {isCurrentActive && (
                        <Badge variant="primary" size="sm" dot>
                          Current Focus
                        </Badge>
                      )}
                      {isCompleted && (
                        <Badge variant="success" size="sm">
                          Completed
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                      <span>{phase.title}</span>
                    </h3>
                    <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
                      {phase.subtitle}
                    </div>

                    {/* Market Demand Prioritization Pill */}
                    {(() => {
                      const demandSignal = phase.phaseNumber === 3
                        ? { demand: 50, gap: 24, priority: 'Critical', label: 'Critical Market Priority (50% Demand × 24-pt Gap)' }
                        : phase.phaseNumber === 1
                        ? { demand: 38, gap: 14, priority: 'High', label: 'High Priority Gap (38% Industry Need × 14-pt Gap)' }
                        : phase.phaseNumber === 4
                        ? { demand: 40, gap: 18, priority: 'High', label: 'High Priority Track (40% Industry Need × 18-pt Gap)' }
                        : phase.phaseNumber === 2
                        ? { demand: 25, gap: 4, priority: 'Aligned', label: 'Aligned Competency (25% Demand • Low Gap)' }
                        : { demand: 75, gap: 0, priority: 'Target', label: '8 Active Opportunities Ready for Application' };

                      return (
                        <div className="pt-1 flex items-center gap-2 flex-wrap text-[11px]">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-semibold border ${
                            demandSignal.priority === 'Critical'
                              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                              : demandSignal.priority === 'High'
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                              : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                          }`}>
                            <TrendingUp className="w-3 h-3" />
                            {demandSignal.label}
                          </span>
                        </div>
                      );
                    })()}

                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                      {phase.description}
                    </p>
                  </div>

                  {/* Readiness Increase Badge / Callout */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl p-3 sm:px-4 sm:py-3 min-w-[190px]">
                    <div className="text-[11px] font-semibold uppercase text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Readiness Boost
                    </div>
                    <div className="text-right">
                      <div className="text-lg sm:text-xl font-extrabold text-emerald-950 dark:text-emerald-100">
                        +{phase.estimatedReadinessIncrease}%
                      </div>
                      <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                        {previousReadiness}% → <span className="font-bold">{phase.resultingReadiness}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Chips Strip */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
                    <Code2 className="w-3.5 h-3.5 text-slate-400" />
                    Target Skills:
                  </span>
                  {phase.skillsCovered.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Milestone Tasks Checklist */}
                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <span>Milestone Action Items ({completedTasksInPhase}/{phase.tasks.length} Completed)</span>
                    <button
                      onClick={() => onToggleExpand(phase.id)}
                      className="text-primary hover:text-primary/80 flex items-center gap-1 lowercase font-normal capitalize"
                    >
                      <span>{isExpanded ? 'Less Details' : 'More Details'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {phase.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                          task.completed
                            ? 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60 opacity-90'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <button
                          onClick={() => onToggleTask(phase.id, task.id)}
                          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            task.completed
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 dark:border-slate-600 hover:border-primary text-transparent'
                          }`}
                          title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span
                              className={`text-xs sm:text-sm font-semibold ${
                                task.completed
                                  ? 'line-through text-slate-400 dark:text-slate-500'
                                  : 'text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              {task.title}
                            </span>
                            {task.duration && (
                              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                                <Clock className="w-3 h-3" />
                                {task.duration}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                            {task.description}
                          </p>

                          {task.resourceTitle && (
                            <button
                              onClick={() => onOpenResource(task, phase)}
                              className="mt-1.5 inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                            >
                              <BookOpen className="w-3 h-3" />
                              <span>{task.resourceTitle}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expanded Detailed Section (Projects, Certifications, Hiring Impact) */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-150">
                    {/* Recommended Project Blueprint if available */}
                    {phase.recommendedProjects && phase.recommendedProjects.length > 0 && (
                      <div className="bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl p-3.5 space-y-1.5">
                        <div className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                          <FolderGit2 className="w-4 h-4 text-primary" />
                          Recommended Proof-of-Work Project
                        </div>
                        {phase.recommendedProjects.map((proj, pIdx) => (
                          <div key={pIdx}>
                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                              {proj.title}
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                              {proj.description}
                            </div>
                            <div className="text-[11px] font-medium text-primary mt-1">
                              Deliverable: {proj.deliverable}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Certifications or Labs */}
                    {phase.certificationsOrLabs && phase.certificationsOrLabs.length > 0 && (
                      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3.5 space-y-1.5">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-amber-500" />
                          Accredited Credential & Sandbox Lab
                        </div>
                        {phase.certificationsOrLabs.map((cert, cIdx) => (
                          <div key={cIdx} className="flex items-center justify-between text-xs">
                            <span className="text-slate-700 dark:text-slate-300 font-medium">
                              {cert.title}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300 font-semibold">
                              {cert.level}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Hiring Impact Note */}
                    <div className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 p-3 rounded-xl">
                      <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-amber-900 dark:text-amber-200">
                          Recruiter & Industry Impact:
                        </span>{' '}
                        {phase.hiringImpact}
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Action Button */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Target outcome: <strong className="text-slate-800 dark:text-slate-200">{phase.resultingReadiness}% overall readiness</strong>
                  </div>
                  <button
                    onClick={() => onLaunchPhaseAction(phase)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>{getPhaseActionLabel(phase.phaseNumber)}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
