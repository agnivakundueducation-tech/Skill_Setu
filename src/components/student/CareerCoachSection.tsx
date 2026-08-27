import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  generateCareerPlan,
  calculateNextBestAction,
  AVAILABLE_CAREER_ROLES
} from '../../services/careerCoachService';
import { buildStudentContext } from '../../services/setuContextService';
import { DEMO_CAREER_PLAN } from '../../data/demoCareerPlan';
import {
  CareerActionPlan,
  PlanDuration,
  CareerTask,
  TaskType,
  TaskPriority,
  OpportunityReadinessEvaluation
} from '../../types/careerCoach';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import {
  Sparkles,
  Target,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Zap,
  TrendingUp,
  GitCompare,
  Briefcase,
  Compass,
  Layers,
  Award,
  AlertTriangle,
  RefreshCw,
  BookOpen,
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  Code
} from 'lucide-react';

interface CareerCoachSectionProps {
  onNavigateTab: (tab: string) => void;
  onTakeAssessment?: (skillName?: string) => void;
  className?: string;
  defaultDuration?: PlanDuration;
}

export const CareerCoachSection: React.FC<CareerCoachSectionProps> = ({
  onNavigateTab,
  onTakeAssessment,
  className = '',
  defaultDuration = 30
}) => {
  const { appUser, isAuthenticated, isDemo, user } = useAuth();

  const [duration, setDuration] = useState<PlanDuration>(defaultDuration);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [plan, setPlan] = useState<CareerActionPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isInsufficientData, setIsInsufficientData] = useState<boolean>(false);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true
  });

  // Load completed tasks from local storage
  useEffect(() => {
    const storageKey = `skillsetu_career_tasks_${appUser?.uid || (isDemo ? 'demo' : 'guest')}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCompletedTasks(JSON.parse(saved));
      }
    } catch {
      // ignore storage errors
    }
  }, [appUser?.uid, isDemo]);

  const toggleTaskCompleted = (taskId: string) => {
    setCompletedTasks((prev) => {
      const updated = { ...prev, [taskId]: !prev[taskId] };
      const storageKey = `skillsetu_career_tasks_${appUser?.uid || (isDemo ? 'demo' : 'guest')}`;
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const loadCareerPlan = useCallback(async (forcedRole?: string, forcedDuration?: PlanDuration) => {
    setIsLoading(true);
    setError(null);
    setIsInsufficientData(false);

    const activeDuration = forcedDuration || duration;

    try {
      if (isDemo || !isAuthenticated) {
        // Use Demo Plan with requested duration
        const demoPlan = await generateCareerPlan(DEMO_CAREER_PLAN as any, {
          duration: activeDuration,
          customRole: forcedRole || selectedRole || 'Full-Stack Software Engineer',
          isDemo: true
        });
        setPlan(demoPlan);
        if (!selectedRole && demoPlan.targetRole) {
          setSelectedRole(demoPlan.targetRole);
        }
      } else {
        // Authenticated Student: Fetch real context
        const studentContext = await buildStudentContext(appUser?.uid, false);

        // Check if student has sufficient profile data
        const hasSkillData =
          (studentContext.skillIntelligence?.topSkills && studentContext.skillIntelligence.topSkills.length > 0) ||
          studentContext.assessment.hasCompletedAssessment ||
          (studentContext.skillIntelligence?.criticalGaps && studentContext.skillIntelligence.criticalGaps.length > 0);

        if (!hasSkillData && !isDemo) {
          setIsInsufficientData(true);
          setIsLoading(false);
          return;
        }

        const effectiveTargetRole = forcedRole || selectedRole || studentContext.career?.targetRole;

        const generated = await generateCareerPlan(studentContext, {
          duration: activeDuration,
          customRole: effectiveTargetRole,
          isDemo: false
        });

        setPlan(generated);
        if (!selectedRole && generated.targetRole) {
          setSelectedRole(generated.targetRole);
        }
      }
    } catch (err: any) {
      console.error('Failed to generate career plan:', err);
      setError('Career Coach is temporarily unavailable.');
    } finally {
      setIsLoading(false);
    }
  }, [appUser?.uid, duration, isAuthenticated, isDemo, selectedRole]);

  useEffect(() => {
    loadCareerPlan();
  }, [loadCareerPlan]);

  const handleDurationChange = (newDuration: PlanDuration) => {
    setDuration(newDuration);
    loadCareerPlan(selectedRole, newDuration);
  };

  const handleRoleChange = (newRole: string) => {
    setSelectedRole(newRole);
    loadCareerPlan(newRole, duration);
  };

  const toggleWeekExpand = (weekNumber: number) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [weekNumber]: !prev[weekNumber]
    }));
  };

  // Helper for task type badges
  const getTaskTypeBadge = (type: TaskType) => {
    switch (type) {
      case 'Learning':
        return <Badge variant="primary" size="sm">Learning</Badge>;
      case 'Practice':
        return <Badge variant="info" size="sm">Practice</Badge>;
      case 'Project':
        return <Badge variant="success" size="sm">Project</Badge>;
      case 'Portfolio':
        return <Badge variant="secondary" size="sm">Portfolio</Badge>;
      case 'Application':
        return <Badge variant="warning" size="sm">Application</Badge>;
      case 'Interview Preparation':
        return <Badge variant="danger" size="sm">Interview Prep</Badge>;
      case 'Networking':
        return <Badge variant="outline" size="sm">Networking</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{type}</Badge>;
    }
  };

  // Helper for priority badges
  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="danger" size="sm" dot>Critical</Badge>;
      case 'high':
        return <Badge variant="warning" size="sm" dot>High</Badge>;
      case 'medium':
        return <Badge variant="info" size="sm">Medium</Badge>;
      case 'low':
      default:
        return <Badge variant="neutral" size="sm">Low</Badge>;
    }
  };

  // Helper for readiness status badge
  const getReadinessStatusBadge = (status: OpportunityReadinessEvaluation) => {
    switch (status) {
      case 'READY':
        return <Badge variant="success" size="sm" dot>Ready to Apply</Badge>;
      case 'REASONABLE_TO_APPLY':
        return <Badge variant="warning" size="sm" dot>Reasonable to Apply</Badge>;
      case 'IMPROVE_FIRST':
        return <Badge variant="danger" size="sm" dot>Improve Skills First</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  // Map Setu action metadata to router tab
  const handleResourceAction = (actionType?: string, target?: string) => {
    switch (actionType) {
      case 'VIEW_SKILL_GAP':
        onNavigateTab('skill-gap');
        break;
      case 'VIEW_CAREER_ROADMAP':
        onNavigateTab('career-roadmap');
        break;
      case 'VIEW_OPPORTUNITIES':
        onNavigateTab('opportunities');
        break;
      case 'VIEW_INTERVENTIONS':
        onNavigateTab('interventions');
        break;
      case 'VIEW_PORTFOLIO':
        onNavigateTab('portfolio');
        break;
      case 'VIEW_APPLICATIONS':
        onNavigateTab('applications');
        break;
      case 'START_ASSESSMENT':
        if (onTakeAssessment) onTakeAssessment();
        else onNavigateTab('assessment');
        break;
      default:
        if (target?.includes('skill-gap')) onNavigateTab('skill-gap');
        else if (target?.includes('interventions')) onNavigateTab('interventions');
        else if (target?.includes('opportunities')) onNavigateTab('opportunities');
        else if (target?.includes('portfolio')) onNavigateTab('portfolio');
        else if (target?.includes('career-roadmap')) onNavigateTab('career-roadmap');
        else onNavigateTab('skill-gap');
    }
  };

  // Calculate task completion stats
  const allTasks: CareerTask[] = plan ? plan.weeklyPlan.flatMap((w) => w.tasks) : [];
  const totalTasksCount = allTasks.length;
  const completedTasksCount = allTasks.filter(
    (t) => completedTasks[t.taskId] || t.completed
  ).length;
  const completionPercentage =
    totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // -------------------------------------------------------------
  // Render: Loading State
  // -------------------------------------------------------------
  if (isLoading) {
    return (
      <Card variant="default" className={`p-8 border-indigo-200 dark:border-indigo-900 shadow-sm ${className}`}>
        <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner animate-pulse">
            <Sparkles className="w-7 h-7 animate-spin" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Setu is building your career plan...
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Analyzing your verified Skill DNA, industry requirement benchmarks, and high-impact interventions.
            </p>
          </div>
          <div className="w-48 pt-2">
            <ProgressBar value={65} color="indigo" size="sm" showValue={false} />
          </div>
        </div>
      </Card>
    );
  }

  // -------------------------------------------------------------
  // Render: Error State
  // -------------------------------------------------------------
  if (error) {
    return (
      <Card variant="default" className={`p-6 border-rose-200 dark:border-rose-900 bg-rose-50/30 dark:bg-rose-950/10 ${className}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {error}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                We could not synthesize your career plan at this moment. Please try again.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={RefreshCw}
            onClick={() => loadCareerPlan()}
            className="shrink-0"
          >
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  // -------------------------------------------------------------
  // Render: Insufficient Data State
  // -------------------------------------------------------------
  if (isInsufficientData) {
    return (
      <Card variant="default" className={`p-6 border-amber-200 dark:border-amber-900 bg-amber-50/30 dark:bg-amber-950/10 ${className}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  No sufficient profile data yet.
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 max-w-xl">
                To generate your personalized deterministic Career Plan, Setu requires your baseline diagnostic Skill DNA or target role selection.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <Button
              variant="primary"
              size="sm"
              leftIcon={Target}
              onClick={() => {
                if (onTakeAssessment) onTakeAssessment();
                else onNavigateTab('assessment');
              }}
              className="text-xs"
            >
              Complete Assessment
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadCareerPlan('Full-Stack Software Engineer')}
              className="text-xs"
            >
              Load Sample Track
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (!plan) return null;

  return (
    <div className={`space-y-6 animate-in fade-in duration-200 ${className}`}>
      {/* ------------------------------------------------------------- */}
      {/* Section 1: Main Career Coach Header Card                      */}
      {/* ------------------------------------------------------------- */}
      <Card variant="default" className="border-indigo-200/80 dark:border-indigo-900/60 shadow-xs overflow-hidden">
        {/* Top Gradient Banner */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Setu AI Career Coach</span>
                </div>

                {plan.isDemo ? (
                  <Badge variant="warning" size="sm" className="bg-amber-500/20 text-amber-200 border border-amber-400/30 font-bold">
                    Demonstration Career Plan
                  </Badge>
                ) : (
                  <Badge variant="success" size="sm" className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-bold">
                    Verified Live Student Context
                  </Badge>
                )}

                <span className="text-xs text-indigo-300 hidden sm:inline">•</span>
                <span className="text-xs text-indigo-200">
                  Deterministic Calibration
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex flex-wrap items-center gap-2.5">
                <span>Personalized Career Action Plan</span>
                <span className="text-sm font-normal text-indigo-200">
                  for <strong className="text-white font-semibold">{plan.targetRole}</strong>
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-indigo-200/90 max-w-3xl leading-relaxed">
                {plan.overallSummary}
              </p>
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={RefreshCw}
                onClick={() => loadCareerPlan()}
                className="text-xs text-white/90 hover:text-white hover:bg-white/10 border border-white/20"
              >
                Refresh Plan
              </Button>
            </div>
          </div>
        </div>

        {/* Sub-Header Key Metrics Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Target Role Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Career Target
            </label>
            <select
              value={selectedRole || plan.targetRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {AVAILABLE_CAREER_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Current Readiness */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span className="uppercase tracking-wider">Current Readiness</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {plan.readinessScore}%
              </span>
            </div>
            <ProgressBar
              value={plan.readinessScore}
              size="sm"
              color={plan.readinessScore >= 80 ? 'emerald' : plan.readinessScore >= 60 ? 'indigo' : 'amber'}
              showValue={false}
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>{plan.readinessTier}</span>
              <span>Top {100 - plan.readinessPercentile}% Percentile</span>
            </div>
          </div>

          {/* Plan Duration Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Plan Trajectory
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold text-center">
              {([30, 60, 90] as PlanDuration[]).map((d) => (
                <button
                  key={d}
                  onClick={() => handleDurationChange(d)}
                  className={`py-1.5 rounded-lg transition-all ${
                    duration === d
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>

          {/* Overall Plan Completion */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span className="uppercase tracking-wider">Tasks Completed</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {completedTasksCount} / {totalTasksCount} ({completionPercentage}%)
              </span>
            </div>
            <ProgressBar
              value={completionPercentage}
              size="sm"
              color="emerald"
              showValue={false}
            />
            <span className="text-[10px] text-slate-400 block truncate">
              Progress saved locally in session
            </span>
          </div>
        </div>

        {/* Readiness Explanation Narrative */}
        <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border-b border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
          <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong className="font-semibold text-indigo-900 dark:text-indigo-200">Readiness Calculation: </strong>
            {plan.readinessExplanation}
          </div>
        </div>
      </Card>

      {/* ------------------------------------------------------------- */}
      {/* Section 2: Next Best Action (Deterministic Callout)           */}
      {/* ------------------------------------------------------------- */}
      {plan.nextBestAction && (
        <Card
          variant="default"
          className="p-5 border-indigo-300 dark:border-indigo-800 bg-gradient-to-r from-indigo-50/90 via-white to-sky-50/70 dark:from-indigo-950/40 dark:via-slate-900 dark:to-sky-950/30 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0 font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                    Next Best Action
                  </span>
                  <Badge variant="primary" size="sm" className="font-semibold">
                    {plan.nextBestAction.badge}
                  </Badge>
                  <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800">
                    Urgency: {plan.nextBestAction.urgency}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  {plan.nextBestAction.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  {plan.nextBestAction.reason}
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              rightIcon={ArrowRight}
              className="text-xs whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 text-white self-stretch sm:self-center font-bold px-4 py-2"
              onClick={() => handleResourceAction(plan.nextBestAction.actionType, plan.nextBestAction.targetRoute)}
            >
              {plan.nextBestAction.actionLabel}
            </Button>
          </div>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Section 3: Strengths vs. Priority Skill Gaps Bento Grid       */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Your Strengths (4 Cols) */}
        <Card variant="default" className="lg:col-span-4 p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <CardTitle className="text-sm">Your Top Strengths</CardTitle>
              </div>
              <Badge variant="success" size="sm">
                Verified
              </Badge>
            </div>

            <div className="pt-3 space-y-2.5">
              {plan.strongSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-xs font-medium text-slate-800 dark:text-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">{skill}</span>
                </div>
              ))}

              {plan.skillsToMaintain.length > 0 && (
                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                    Skills to Maintain
                  </div>
                  <div className="space-y-1.5">
                    {plan.skillsToMaintain.map((skill, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span className="truncate">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              rightIcon={ArrowRight}
              className="w-full text-xs text-indigo-600 dark:text-indigo-400 justify-between p-0 h-auto font-semibold"
              onClick={() => onNavigateTab('skill-dna')}
            >
              <span>View Full Skill DNA Radar</span>
            </Button>
          </div>
        </Card>

        {/* Column 2: Top Priority Skill Gaps (8 Cols) */}
        <Card variant="default" className="lg:col-span-8 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <CardTitle className="text-sm">Priority Skill Gaps for {plan.targetRole}</CardTitle>
            </div>
            <span className="text-xs text-slate-400">
              Deterministic priority ranking
            </span>
          </div>

          <div className="space-y-3">
            {plan.priorities.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {item.skill}
                    </h4>
                    {getPriorityBadge(item.priority)}
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <div className="text-slate-500">
                      Level: <strong className="text-slate-900 dark:text-slate-100">{item.currentLevel}</strong> → Required: <strong className="text-indigo-600 dark:text-indigo-400">{item.requiredLevel}</strong>
                    </div>
                    <span className="font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200/60 dark:border-rose-900">
                      -{item.gap}% Deficit
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      Demand: {item.industryDemand}% {item.demandTrend}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
                  <p className="leading-relaxed sm:max-w-xl">
                    {item.reason}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    rightIcon={ArrowRight}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold p-0 h-auto self-end sm:self-center shrink-0"
                    onClick={() => onNavigateTab('skill-gap')}
                  >
                    View Skill Gap
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Section 4: 30 / 60 / 90 Days Action Plan Breakdown            */}
      {/* ------------------------------------------------------------- */}
      <Card variant="default" className="border-slate-200/80 dark:border-slate-800 shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <CardTitle className="text-base">{duration}-Day Action Plan Timeline</CardTitle>
            </div>
            <CardDescription className="mt-0.5">
              Grounded, realistic weekly milestones structured from Foundation → Practice → Project → Applications.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Plan Duration:</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
              {([30, 60, 90] as PlanDuration[]).map((d) => (
                <button
                  key={d}
                  onClick={() => handleDurationChange(d)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    duration === d
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-4">
          {plan.weeklyPlan.map((week) => {
            const isExpanded = expandedWeeks[week.weekNumber] ?? true;
            const weekTasks = week.tasks;
            const weekCompletedCount = weekTasks.filter(
              (t) => completedTasks[t.taskId] || t.completed
            ).length;
            const isAllWeekCompleted =
              weekTasks.length > 0 && weekCompletedCount === weekTasks.length;

            return (
              <div
                key={week.weekNumber}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden"
              >
                {/* Week Header */}
                <button
                  onClick={() => toggleWeekExpand(week.weekNumber)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isAllWeekCompleted
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      }`}
                    >
                      W{week.weekNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {week.title}
                        </h4>
                        <Badge variant="outline" size="sm" className="font-semibold text-[10px]">
                          {week.theme}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {week.focusSummary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500">
                      {weekCompletedCount} / {weekTasks.length} Done
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Week Tasks List */}
                {isExpanded && (
                  <div className="p-4 pt-1 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2.5">
                    {weekTasks.map((task) => {
                      const isTaskDone = completedTasks[task.taskId] || task.completed;
                      return (
                        <div
                          key={task.taskId}
                          className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isTaskDone
                              ? 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-200/60 dark:border-emerald-900/40 opacity-80'
                              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800'
                          }`}
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <button
                              onClick={() => toggleTaskCompleted(task.taskId)}
                              className="mt-0.5 shrink-0 text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                              {isTaskDone ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-400 hover:text-indigo-600" />
                              )}
                            </button>

                            <div className="space-y-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`text-xs font-bold ${
                                    isTaskDone
                                      ? 'line-through text-slate-500 dark:text-slate-400'
                                      : 'text-slate-900 dark:text-slate-100'
                                  }`}
                                >
                                  {task.title}
                                </span>
                                {getTaskTypeBadge(task.type)}
                                {getPriorityBadge(task.priority)}
                              </div>

                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                {task.description}
                              </p>

                              {task.currentLevel !== undefined && task.targetLevel !== undefined && (
                                <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 pt-0.5">
                                  <span>Skill Progression:</span>
                                  <span>{task.skill}</span>
                                  <span className="text-slate-400">({task.currentLevel} → {task.targetLevel})</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                              <Clock className="w-3 h-3" />
                              <span>{task.estimatedHours} hrs</span>
                            </div>

                            {task.linkedResource && (
                              <Button
                                variant="outline"
                                size="sm"
                                rightIcon={ArrowRight}
                                className="text-xs font-semibold py-1 px-2.5 h-auto"
                                onClick={() =>
                                  handleResourceAction(
                                    task.linkedResource?.actionType,
                                    task.linkedResource?.target
                                  )
                                }
                              >
                                {task.linkedResource.label}
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------- */}
      {/* Section 5: Interventions & Opportunities Integration Grid     */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Interventions */}
        <Card variant="default" className="p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <CardTitle className="text-sm">Recommended Interventions</CardTitle>
              </div>
              <Badge variant="primary" size="sm">
                Live Cohorts
              </Badge>
            </div>

            <div className="space-y-2.5">
              {plan.recommendedInterventions.map((intItem) => (
                <div
                  key={intItem.interventionId}
                  className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {intItem.title}
                      </h4>
                      {intItem.enrolled && (
                        <Badge variant="success" size="sm">
                          Enrolled
                        </Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>Target: <strong>{intItem.skillName}</strong></span>
                      {intItem.duration && <span>• {intItem.duration}</span>}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    rightIcon={ArrowRight}
                    className="text-xs font-semibold shrink-0"
                    onClick={() => onNavigateTab('interventions')}
                  >
                    View Intervention
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              rightIcon={ArrowRight}
              className="w-full text-xs text-indigo-600 dark:text-indigo-400 justify-between p-0 h-auto font-semibold"
              onClick={() => onNavigateTab('interventions')}
            >
              <span>Explore All Institutional Interventions</span>
            </Button>
          </div>
        </Card>

        {/* Recommended Matched Opportunities */}
        <Card variant="default" className="p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <CardTitle className="text-sm">Opportunities You Can Target</CardTitle>
              </div>
              <span className="text-xs text-slate-400">
                Verified Matching
              </span>
            </div>

            <div className="space-y-2.5">
              {plan.recommendedOpportunities.map((opp) => (
                <div
                  key={opp.opportunityId}
                  className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {opp.title}
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        {opp.company}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800">
                        {opp.matchScore}% Match
                      </span>
                      {getReadinessStatusBadge(opp.readinessStatus)}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {opp.rationale}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400 truncate max-w-[60%]">
                      Req: {opp.requiredSkills.join(', ')}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      rightIcon={ArrowRight}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold p-0 h-auto"
                      onClick={() => onNavigateTab('opportunities')}
                    >
                      View Opportunity
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              rightIcon={ArrowRight}
              className="w-full text-xs text-indigo-600 dark:text-indigo-400 justify-between p-0 h-auto font-semibold"
              onClick={() => onNavigateTab('opportunities')}
            >
              <span>Explore All Matched Opportunities</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Section 6: Portfolio Actions & Milestones                     */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Portfolio Actions (7 cols) */}
        <Card variant="default" className="lg:col-span-7 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <CardTitle className="text-sm">Portfolio Evidence Actions</CardTitle>
            </div>
            <Badge variant="outline" size="sm">
              Missing Proofs
            </Badge>
          </div>

          <div className="space-y-3">
            {plan.portfolioActions.map((action, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Skill: {action.skill}
                  </span>
                  <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
                    {action.missingEvidence}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {action.recommendation}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold truncate max-w-[70%]">
                    Suggested Project: {action.suggestedProjectTitle}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    rightIcon={ArrowRight}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold p-0 h-auto"
                    onClick={() => onNavigateTab('portfolio')}
                  >
                    View Portfolio
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Milestones (5 cols) */}
        <Card variant="default" className="lg:col-span-5 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <CardTitle className="text-sm">Key Career Milestones</CardTitle>
              </div>
              <Badge variant="success" size="sm">
                Target Impact
              </Badge>
            </div>

            <div className="space-y-2.5">
              {plan.milestones.map((ms) => (
                <div
                  key={ms.milestoneId}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {ms.title}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded">
                      Week {ms.targetWeek}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {ms.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              rightIcon={ArrowRight}
              className="w-full text-xs font-bold justify-center"
              onClick={() => onNavigateTab('career-roadmap')}
            >
              View Detailed AI Career Roadmap
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
