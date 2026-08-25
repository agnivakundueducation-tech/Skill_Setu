import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  Layers,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  Calendar,
  Compass,
  FileCode2,
  Zap,
  BookOpen
} from 'lucide-react';
import { CareerRoadmapHeader } from '../career-roadmap/CareerRoadmapHeader';
import { ReadinessProjectionChart } from '../career-roadmap/ReadinessProjectionChart';
import { CareerRoadmapTimeline } from '../career-roadmap/CareerRoadmapTimeline';
import { AiRoadmapAdvisorModal } from '../career-roadmap/AiRoadmapAdvisorModal';
import { RoadmapResourceModal } from '../career-roadmap/RoadmapResourceModal';
import { DEFAULT_SOFTWARE_ENGINEER_ROADMAP, CAREER_GOAL_PRESETS } from '../../../data/careerRoadmapData';
import { CareerRoadmapData, RoadmapPhase, RoadmapMilestoneTask } from '../../../types/careerRoadmap';

interface CareerRoadmapViewProps {
  onNavigateTab?: (tabId: string) => void;
  onOpenAssessmentModal?: () => void;
}

export const CareerRoadmapView: React.FC<CareerRoadmapViewProps> = ({
  onNavigateTab,
  onOpenAssessmentModal,
}) => {
  const [roadmap, setRoadmap] = useState<CareerRoadmapData>(DEFAULT_SOFTWARE_ENGINEER_ROADMAP);
  const [activeGoal, setActiveGoal] = useState<string>('Software Engineer');
  const [expandedPhaseIds, setExpandedPhaseIds] = useState<string[]>(['phase-1', 'phase-2']);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in-progress' | 'upcoming' | 'completed'>('all');

  // Modals state
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<RoadmapMilestoneTask | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<RoadmapPhase | null>(null);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);

  // Calculate task counts and dynamic readiness
  const totalTasks = roadmap.phases.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = roadmap.phases.reduce(
    (acc, p) => acc + p.tasks.filter((t) => t.completed).length,
    0
  );

  // Live dynamic calculation: baseline (78) + weighted portion of gain based on completed tasks
  const maxGain = roadmap.projectedFinalReadiness - roadmap.currentReadiness; // 20%
  const taskRatio = completedTasks / Math.max(totalTasks, 1);
  const liveCalculatedReadiness = Math.round(roadmap.currentReadiness + taskRatio * maxGain);

  // Toggle single task completion
  const handleToggleTask = (phaseId: string, taskId: string) => {
    setRoadmap((prev) => ({
      ...prev,
      phases: prev.phases.map((p) => {
        if (p.id === phaseId) {
          const updatedTasks = p.tasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          );
          const allDone = updatedTasks.every((t) => t.completed);
          return {
            ...p,
            tasks: updatedTasks,
            status: allDone ? 'completed' : p.status === 'completed' ? 'in-progress' : p.status
          };
        }
        return p;
      })
    }));
  };

  // Toggle expand for single phase
  const handleToggleExpand = (phaseId: string) => {
    setExpandedPhaseIds((prev) =>
      prev.includes(phaseId) ? prev.filter((id) => id !== phaseId) : [...prev, phaseId]
    );
  };

  // Switch Goal
  const handleGoalChange = (newGoal: string) => {
    setActiveGoal(newGoal);
    const preset = CAREER_GOAL_PRESETS.find((p) => p.name === newGoal);
    if (preset) {
      setRoadmap((prev) => ({
        ...prev,
        careerGoal: preset.name,
        goalDescription: preset.description,
        currentReadiness: preset.readiness
      }));
    }
  };

  // Open resource modal
  const handleOpenResource = (task: RoadmapMilestoneTask, phase: RoadmapPhase) => {
    setSelectedTask(task);
    setSelectedPhase(phase);
    setIsResourceModalOpen(true);
  };

  // Phase CTA Launch action
  const handleLaunchPhaseAction = (phase: RoadmapPhase) => {
    if (phase.phaseNumber === 1) {
      // Launch DSA / Assessment
      if (onOpenAssessmentModal) {
        onOpenAssessmentModal();
      } else if (onNavigateTab) {
        onNavigateTab('assessment');
      }
    } else if (phase.phaseNumber === 2 || phase.phaseNumber === 4) {
      // Navigate to Portfolio / Projects
      if (onNavigateTab) onNavigateTab('portfolio');
    } else if (phase.phaseNumber === 3) {
      // Skill Gap or Assessment
      if (onNavigateTab) onNavigateTab('skill-gap');
    } else if (phase.phaseNumber === 5) {
      // Opportunities
      if (onNavigateTab) onNavigateTab('opportunities');
    }
  };

  // Filter phases by search query or status
  const filteredPhases = roadmap.phases.filter((phase) => {
    const matchesSearch =
      searchQuery === '' ||
      phase.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phase.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phase.skillsCovered.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      phase.tasks.some((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'in-progress' && phase.status === 'in-progress') ||
      (statusFilter === 'upcoming' && phase.status === 'upcoming') ||
      (statusFilter === 'completed' && phase.status === 'completed');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Section: Career Goal (Software Engineer) & Current Readiness (78%) */}
      <CareerRoadmapHeader
        roadmap={roadmap}
        activeGoal={activeGoal}
        onGoalChange={handleGoalChange}
        onOpenAdvisor={() => setIsAdvisorOpen(true)}
        completedTasksCount={completedTasks}
        totalTasksCount={totalTasks}
        calculatedCurrentReadiness={liveCalculatedReadiness}
      />

      {/* 2. Visual Step Progression Chart (78% -> 83% -> 87% -> 91% -> 95% -> 98%) */}
      <ReadinessProjectionChart
        roadmap={roadmap}
        activePhaseId={expandedPhaseIds[0]}
        onSelectPhase={(phaseId) => {
          if (!expandedPhaseIds.includes(phaseId)) {
            setExpandedPhaseIds([phaseId]);
          }
          const el = document.getElementById(`phase-${phaseId}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }}
      />

      {/* 3. Search and View Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search phases, DSA, React, Cloud..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-400 font-medium hidden md:inline">Filter:</span>
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/80 dark:border-slate-700/80">
            {(['all', 'in-progress', 'upcoming', 'completed'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  statusFilter === filter
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {filter === 'all' ? 'All Phases' : filter.replace('-', ' ')}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => {
              if (expandedPhaseIds.length === roadmap.phases.length) {
                setExpandedPhaseIds([]);
              } else {
                setExpandedPhaseIds(roadmap.phases.map((p) => p.id));
              }
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {expandedPhaseIds.length === roadmap.phases.length ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      </div>

      {/* 4. Timeline UI: Phase 1 to Phase 5 with Step Progression */}
      <CareerRoadmapTimeline
        phases={filteredPhases}
        onToggleTask={handleToggleTask}
        expandedPhaseIds={expandedPhaseIds}
        onToggleExpand={handleToggleExpand}
        onOpenResource={handleOpenResource}
        onLaunchPhaseAction={handleLaunchPhaseAction}
      />

      {/* 5. Modals */}
      <AiRoadmapAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        roadmap={roadmap}
        calculatedReadiness={liveCalculatedReadiness}
      />

      <RoadmapResourceModal
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        task={selectedTask}
        phase={selectedPhase}
        onMarkTaskCompleted={handleToggleTask}
      />
    </div>
  );
};
