import React, { useState, useEffect } from 'react';
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  Award,
  BookOpen,
  Plus,
  BarChart3,
  Sliders,
  Filter,
  Check,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  HelpCircle,
  Clock,
  Flame,
  X,
  Target,
  ExternalLink,
  Eye
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  InstitutionSkillGap,
  InterventionRecommendation,
  Intervention,
  InterventionEnrollment,
  CurriculumCoverage,
  CurriculumAlignmentItem,
  InstitutionalInterventionMetrics,
  InterventionPriority,
  InterventionStatus,
  InterventionType
} from '../../types/intervention';
import {
  calculateInstitutionSkillGaps,
  generateInterventionRecommendations,
  getCurriculumAlignmentMatrix
} from '../../services/institutionInsightService';
import { interventionService } from '../../services/interventionService';
import {
  calculateInterventionImpact,
  calculateInstitutionalAggregatedMetrics
} from '../../services/interventionImpactService';

interface InstitutionalInterventionCenterViewProps {
  institutionId?: string;
  isDemo?: boolean;
  onNavigateTab?: (tab: string) => void;
}

export const InstitutionalInterventionCenterView: React.FC<InstitutionalInterventionCenterViewProps> = ({
  institutionId = 'inst_nit',
  isDemo = true,
  onNavigateTab
}) => {
  const [subTab, setSubTab] = useState<
    'gaps' | 'recommendations' | 'interventions' | 'curriculum' | 'impact' | 'industry_connection' | 'next_actions'
  >('gaps');

  // State management
  const [skillGaps, setSkillGaps] = useState<InstitutionSkillGap[]>([]);
  const [recommendations, setRecommendations] = useState<InterventionRecommendation[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [enrollments, setEnrollments] = useState<InterventionEnrollment[]>([]);
  const [curriculumAlignments, setCurriculumAlignments] = useState<CurriculumAlignmentItem[]>([]);
  const [metrics, setMetrics] = useState<InstitutionalInterventionMetrics | null>(null);

  // Modals / Interaction states
  const [selectedGap, setSelectedGap] = useState<InstitutionSkillGap | null>(null);
  const [selectedDetailIntervention, setSelectedDetailIntervention] = useState<Intervention | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    skillName: 'Cloud & Distributed Systems',
    interventionType: 'Industry Workshop' as InterventionType,
    targetCohort: '3rd Year Computer Science & IT',
    duration: '4 Weeks (Weekend Intensive)',
    expectedImprovement: '+25 points readiness',
    capacity: 60,
    startDate: '2026-03-01',
    endDate: '2026-03-28',
    description: '',
    preAvgScore: 42
  });

  const [assignPartnerModal, setAssignPartnerModal] = useState<Intervention | null>(null);
  const [partnerForm, setPartnerForm] = useState({
    partnerId: 'ind_novacore',
    partnerName: 'NovaCore Technologies Inc.',
    mentorsCount: 3,
    responsibilities: 'Provide 3 senior architects for weekly code reviews, technical workshops, and mock hiring evaluations.'
  });

  const [outcomeModal, setOutcomeModal] = useState<Intervention | null>(null);
  const [outcomeForm, setOutcomeForm] = useState({
    postAvgScore: 68,
    summary: 'Cohort evaluated successfully. Recorded post-assessment score verified through technical project assessment.'
  });

  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Load baseline & dynamic data
  useEffect(() => {
    loadData();
  }, [institutionId, isDemo]);

  const loadData = async () => {
    const coverageMap = interventionService.getCurriculumCoverage();
    const gaps = calculateInstitutionSkillGaps({ customCurriculumCoverage: coverageMap });
    setSkillGaps(gaps);

    const recsRes = await interventionService.getRecommendations(gaps, isDemo);
    if (recsRes.success) setRecommendations(recsRes.data);

    const intRes = await interventionService.getInterventions({ institutionId, isDemo });
    if (intRes.success) setInterventions(intRes.data);

    const curMatrix = getCurriculumAlignmentMatrix(coverageMap);
    setCurriculumAlignments(curMatrix);

    const allEnrollments: InterventionEnrollment[] = [];
    if (intRes.success && intRes.data.length > 0) {
      for (const item of intRes.data) {
        const enrRes = await interventionService.getInterventionEnrollments(item.interventionId, isDemo);
        if (enrRes.success) {
          allEnrollments.push(...enrRes.data);
        }
      }
    }
    setEnrollments(allEnrollments);

    const aggMetrics = calculateInstitutionalAggregatedMetrics(intRes.data || [], allEnrollments, isDemo);
    setMetrics(aggMetrics);
  };

  // Handle creating a new intervention
  const handleCreateIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.title.trim()) return;

    setIsActionLoading(true);
    const newIntervention: Omit<Intervention, 'interventionId' | 'createdAt' | 'updatedAt' | 'enrolledCount' | 'completedCount'> = {
      title: createForm.title.trim(),
      skillName: createForm.skillName,
      skillId: createForm.skillName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      institutionId,
      institutionName: 'Apex Institute of Technology & Research',
      interventionType: createForm.interventionType,
      description: createForm.description.trim() || `Targeted ${createForm.interventionType} designed to bridge the readiness gap in ${createForm.skillName} for ${createForm.targetCohort}.`,
      startDate: createForm.startDate,
      endDate: createForm.endDate,
      capacity: Number(createForm.capacity) || 50,
      status: 'Proposed',
      preAvgScore: Number(createForm.preAvgScore) || 40
    };

    const res = await interventionService.createIntervention(newIntervention, isDemo);
    setIsActionLoading(false);
    setShowCreateModal(false);

    if (res.success) {
      setActionSuccessMessage(`Intervention "${createForm.title}" created successfully!`);
      setCreateForm({
        title: '',
        skillName: 'Cloud & Distributed Systems',
        interventionType: 'Industry Workshop',
        targetCohort: '3rd Year Computer Science & IT',
        duration: '4 Weeks (Weekend Intensive)',
        expectedImprovement: '+25 points readiness',
        capacity: 60,
        startDate: '2026-03-01',
        endDate: '2026-03-28',
        description: '',
        preAvgScore: 42
      });
      setTimeout(() => setActionSuccessMessage(null), 4000);
      loadData();
    }
  };

  // Handle approving a recommendation
  const handleApproveRecommendation = async (rec: InterventionRecommendation) => {
    setIsActionLoading(true);
    const res = await interventionService.approveRecommendation(
      rec.recommendationId,
      institutionId,
      'Apex Institute of Technology & Research',
      isDemo
    );
    setIsActionLoading(false);

    if (res.success) {
      setActionSuccessMessage(`Intervention "${rec.title}" approved and scheduled!`);
      setTimeout(() => setActionSuccessMessage(null), 4000);
      loadData();
    }
  };

  // Handle assigning industry partner
  const handleSavePartnerAssignment = async () => {
    if (!assignPartnerModal) return;
    setIsActionLoading(true);
    const res = await interventionService.assignIndustryPartner(
      assignPartnerModal.interventionId,
      partnerForm.partnerId,
      partnerForm.partnerName,
      Number(partnerForm.mentorsCount),
      partnerForm.responsibilities,
      isDemo
    );
    setIsActionLoading(false);
    setAssignPartnerModal(null);

    if (res.success) {
      setActionSuccessMessage(`Industry partner ${partnerForm.partnerName} assigned successfully.`);
      setTimeout(() => setActionSuccessMessage(null), 4000);
      loadData();
    }
  };

  // Handle recording outcome
  const handleSaveOutcome = async () => {
    if (!outcomeModal) return;
    setIsActionLoading(true);
    const pre = outcomeModal.preAvgScore || 40;
    const delta = Math.max(0, outcomeForm.postAvgScore - pre);

    const res = await interventionService.updateInterventionStatus(
      outcomeModal.interventionId,
      'Evaluated',
      {
        postAvgScore: Number(outcomeForm.postAvgScore),
        measuredImprovement: delta,
        outcomesSummary: outcomeForm.summary,
        status: 'Evaluated'
      },
      isDemo
    );
    setIsActionLoading(false);
    setOutcomeModal(null);

    if (res.success) {
      setActionSuccessMessage(`Outcome evaluated and recorded: +${delta} points measured improvement.`);
      setTimeout(() => setActionSuccessMessage(null), 4000);
      loadData();
    }
  };

  // Handle changing curriculum coverage
  const handleCurriculumCoverageChange = (skillId: string, coverage: CurriculumCoverage) => {
    interventionService.updateCurriculumCoverage(skillId, coverage);
    const updatedCoverage = interventionService.getCurriculumCoverage();
    const updatedGaps = calculateInstitutionSkillGaps({ customCurriculumCoverage: updatedCoverage });
    setSkillGaps(updatedGaps);
    setCurriculumAlignments(getCurriculumAlignmentMatrix(updatedCoverage));

    // Re-generate recommendations based on new curriculum coverage
    const updatedRecs = generateInterventionRecommendations(updatedGaps);
    setRecommendations(updatedRecs);
  };

  const getPriorityBadge = (priority: InterventionPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return <Badge variant="danger" size="sm" className="font-semibold">🔴 Critical Priority</Badge>;
      case 'HIGH':
        return <Badge variant="warning" size="sm" className="font-semibold">🟠 High Priority</Badge>;
      case 'MEDIUM':
        return <Badge variant="indigo" size="sm" className="font-semibold">🟡 Medium Priority</Badge>;
      case 'LOW':
      default:
        return <Badge variant="success" size="sm" className="font-semibold">🟢 Low Gap / Aligned</Badge>;
    }
  };

  const getStatusBadge = (status: InterventionStatus) => {
    switch (status) {
      case 'Proposed':
        return <Badge variant="neutral" size="sm">Proposed</Badge>;
      case 'Approved':
        return <Badge variant="indigo" size="sm">Approved</Badge>;
      case 'Scheduled':
        return <Badge variant="warning" size="sm">Scheduled</Badge>;
      case 'Active':
        return <Badge variant="primary" size="sm">Active (In-Progress)</Badge>;
      case 'Completed':
        return <Badge variant="emerald" size="sm">Completed</Badge>;
      case 'Evaluated':
        return <Badge variant="success" size="sm">Evaluated & Verified</Badge>;
    }
  };

  return (
    <div className="space-y-6" id="institutional-intervention-center">
      {/* Top Banner with Closed-Loop Flow Indicator */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950/80 to-slate-900 text-white shadow-xl relative overflow-hidden border border-indigo-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                Institutional Intervention Engine • Closed-Loop Skill Pipeline
              </span>
              {isDemo && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Demonstration Dataset
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Institutional Intervention Center
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              Detect critical skill gaps between live industry demand and student readiness, trigger deterministic interventions, assign enterprise mentors, and measure before vs. after skill gains.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              leftIcon={Plus}
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
            >
              Create New Intervention
            </Button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {actionSuccessMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-sm flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <Card className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Aligned Skills</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {metrics?.industryAlignedSkills ?? 0}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
            <Check className="w-3 h-3" /> Industry mapped
          </div>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Critical Gaps</div>
          <div className="text-2xl font-bold text-rose-600 mt-1">
            {metrics?.criticalSkillGaps ?? 0}
          </div>
          <div className="text-[11px] text-rose-500 font-medium mt-0.5 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Requires action
          </div>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Active Programs</div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {metrics?.activeInterventions ?? 0}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
            Running cohorts
          </div>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Enrolled Students</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {metrics?.studentsEnrolled ?? 0}
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
            Active participants
          </div>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Avg Skill Gain</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {metrics?.averageSkillImprovement !== null && metrics?.averageSkillImprovement !== undefined
              ? `+${metrics.averageSkillImprovement}`
              : 'Pending'}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
            Recorded skill gain
          </div>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Industry Partners</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {metrics?.industryParticipation ?? 0}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
            Co-mentoring labs
          </div>
        </Card>

        <Card className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Evaluated</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {metrics?.completedInterventions ?? 0}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
            Evaluated cohorts
          </div>
        </Card>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setSubTab('gaps')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            subTab === 'gaps'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          Critical Skill Gaps ({skillGaps.filter((g) => g.interventionPriority === 'CRITICAL' || g.interventionPriority === 'HIGH').length})
        </button>

        <button
          onClick={() => setSubTab('recommendations')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            subTab === 'recommendations'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Recommended Interventions ({recommendations.length})
        </button>

        <button
          onClick={() => setSubTab('interventions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            subTab === 'interventions'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Active & Scheduled Programs ({interventions.length})
        </button>

        <button
          onClick={() => setSubTab('curriculum')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            subTab === 'curriculum'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Curriculum Alignment Config
        </button>

        <button
          onClick={() => setSubTab('impact')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            subTab === 'impact'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Before vs. After Impact Analysis
        </button>

        <button
          onClick={() => setSubTab('industry_connection')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            subTab === 'industry_connection'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          Industry Hiring Connections
        </button>

        <button
          onClick={() => setSubTab('next_actions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            subTab === 'next_actions'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Action Center & Decision Support
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. CRITICAL SKILL GAPS & PRIORITY CARDS */}
      {/* ========================================================================= */}
      {subTab === 'gaps' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Institutional Skill Gaps Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Deterministic calculation comparing live industry hiring requirements with assessed student readiness.
              </p>
            </div>
            <div className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              Total Cohort Evaluated: <strong>{isDemo ? '450 Assessed Candidates' : 'Live Platform Data'}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillGaps.map((gap) => {
              const isCritical = gap.interventionPriority === 'CRITICAL';
              const isHigh = gap.interventionPriority === 'HIGH';

              return (
                <Card
                  key={gap.skillId}
                  className={`p-5 transition-all border ${
                    isCritical
                      ? 'border-rose-300 bg-rose-50/30 dark:bg-rose-950/20 dark:border-rose-900'
                      : isHigh
                      ? 'border-amber-300 bg-amber-50/30 dark:bg-amber-950/20 dark:border-amber-900'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  } shadow-xs hover:shadow-md flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{gap.skillName}</h3>
                        <span className="text-xs text-slate-500 capitalize">{gap.category || 'Technical'} Discipline</span>
                      </div>
                      {getPriorityBadge(gap.interventionPriority)}
                    </div>

                    {/* Numeric Statistics Breakdown */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-800/70 rounded-xl p-2.5 mb-3 text-xs">
                      <div className="text-center">
                        <div className="text-[11px] text-slate-500 font-medium">Industry Demand</div>
                        <div className="text-base font-bold text-slate-900 dark:text-white">{gap.industryDemand}%</div>
                      </div>
                      <div className="text-center border-x border-slate-200 dark:border-slate-700">
                        <div className="text-[11px] text-slate-500 font-medium">Student Readiness</div>
                        <div className="text-base font-bold text-indigo-600 dark:text-indigo-400">{gap.averageStudentLevel}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[11px] text-slate-500 font-medium">Required Level</div>
                        <div className="text-base font-bold text-slate-800 dark:text-slate-200">{gap.industryRequiredLevel}%</div>
                      </div>
                    </div>

                    {/* Visual Gap Bar */}
                    <div className="space-y-1.5 mb-3">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-600 dark:text-slate-400">Readiness vs Industry Benchmark</span>
                        <span className={gap.readinessGap > 20 ? 'text-rose-600 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                          Gap: {gap.readinessGap} pts
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${gap.averageStudentLevel}%` }}
                        />
                        <div
                          className="absolute top-0 bottom-0 w-1 bg-rose-500"
                          style={{ left: `${gap.industryRequiredLevel}%` }}
                          title={`Required Threshold: ${gap.industryRequiredLevel}%`}
                        />
                      </div>
                    </div>

                    {/* Affected Students and Curriculum status */}
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-3">
                      <span>Affected Students: <strong>{gap.affectedStudents}</strong></span>
                      <span>Curriculum: <strong className="text-slate-800 dark:text-slate-200">{gap.curriculumCoverage}</strong></span>
                    </div>

                    {/* Plain English Reason Statement */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 leading-relaxed mb-4">
                      {gap.explanation}
                    </p>
                  </div>

                  <Button
                    variant={isCritical ? 'primary' : 'outline'}
                    size="sm"
                    className="w-full justify-center text-xs"
                    onClick={() => {
                      setSelectedGap(gap);
                      setSubTab('recommendations');
                    }}
                  >
                    View Recommended Interventions
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. EXPLAINABLE INTERVENTION RECOMMENDATIONS */}
      {/* ========================================================================= */}
      {subTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Explainable Intervention Recommendations
              </h2>
              <p className="text-xs text-slate-500">
                Deterministic suggestions matched to identified gap profiles. Each recommendation displays explicit underlying statistics.
              </p>
            </div>
            {selectedGap && (
              <button
                onClick={() => setSelectedGap(null)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                Clear filter ({selectedGap.skillName})
              </button>
            )}
          </div>

          <div className="space-y-4">
            {recommendations
              .filter((rec) => (!selectedGap ? true : rec.skillId === selectedGap.skillId))
              .map((rec) => (
                <Card key={rec.recommendationId} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {getPriorityBadge(rec.priority)}
                        <Badge variant="primary" size="sm" className="font-semibold">
                          {rec.interventionType}
                        </Badge>
                        <span className="text-xs text-slate-500">• Estimated: {rec.estimatedDuration}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{rec.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-4xl">{rec.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {rec.status === 'Approved' ? (
                        <Badge variant="success" size="md">
                          <CheckCircle2 className="w-4 h-4 mr-1 inline" />
                          Approved & Scheduled
                        </Badge>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={isActionLoading}
                          onClick={() => handleApproveRecommendation(rec)}
                          className="text-xs"
                        >
                          <Plus className="w-4 h-4 mr-1.5" />
                          Approve & Launch Program
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Explainable WHY Breakdown Box */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mb-4">
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                        WHY IS THIS RECOMMENDED?
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        "{rec.reason}"
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        RECOMMENDED ACTION
                      </div>
                      <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                        "{rec.recommendedAction}"
                      </p>
                    </div>
                  </div>

                  {/* Detailed Resource & Target Specs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-400 pt-2">
                    <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">Target Audience:</span>
                      {rec.targetAudience}
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">Expected Improvement:</span>
                      <strong className="text-emerald-700 dark:text-emerald-400">{rec.expectedSkillImprovement}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">Required Industry Mentorship:</span>
                      {rec.suggestedIndustryExpertise.join(', ')}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ACTIVE & SCHEDULED INTERVENTIONS LIFECYCLE */}
      {/* ========================================================================= */}
      {subTab === 'interventions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Intervention Lifecycle Management
              </h2>
              <p className="text-xs text-slate-500">
                Track programs from initial approval through industry scheduling, active student enrollment, and post-completion evaluation.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={Plus}
              onClick={() => setShowCreateModal(true)}
              className="text-xs"
            >
              Create Intervention
            </Button>
          </div>

          {interventions.length === 0 ? (
            <Card className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">No Interventions Recorded</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Launch a targeted skill intervention from AI recommendations or create a custom workshop.
              </p>
              <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-1.5" />
                Create First Intervention
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {interventions.map((item) => (
                <Card key={item.interventionId} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {getStatusBadge(item.status)}
                        <Badge variant="indigo" size="sm">{item.interventionType}</Badge>
                        <span className="text-xs text-slate-500">• Skill: <strong>{item.skillName}</strong></span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{item.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">{item.description}</p>
                    </div>

                    {/* Institution Lifecycle Actions */}
                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={Eye}
                        onClick={() => setSelectedDetailIntervention(item)}
                        className="text-xs"
                      >
                        Inspect Details
                      </Button>

                      {/* Assign Partner Button */}
                      {item.status === 'Approved' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setAssignPartnerModal(item)}
                          className="text-xs"
                        >
                          <Building2 className="w-4 h-4 mr-1.5" />
                          Assign Industry Partner
                        </Button>
                      )}

                      {/* Activate Button */}
                      {item.status === 'Scheduled' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={async () => {
                            await interventionService.updateInterventionStatus(item.interventionId, 'Active', {}, isDemo);
                            loadData();
                          }}
                          className="text-xs"
                        >
                          <Zap className="w-4 h-4 mr-1.5" />
                          Mark as Active
                        </Button>
                      )}

                      {/* Record Outcome / Complete Button */}
                      {(item.status === 'Active' || item.status === 'Completed') && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setOutcomeModal(item);
                            setOutcomeForm({
                              postAvgScore: item.postAvgScore || (item.preAvgScore ? item.preAvgScore + 25 : 68),
                              summary: item.outcomesSummary || 'Recorded verified post-intervention assessment delta.'
                            });
                          }}
                          className="text-xs bg-emerald-600 hover:bg-emerald-500"
                        >
                          <Award className="w-4 h-4 mr-1.5" />
                          Record Outcome & Evaluated Delta
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Status & Participation Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                    <div>
                      <span className="text-slate-500 block mb-0.5 font-medium">Partner Industry:</span>
                      <strong className="text-slate-900 dark:text-white flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        {item.partnerIndustryName || 'Not Assigned Yet'}
                      </strong>
                      {item.assignedMentorsCount ? (
                        <span className="text-slate-500 block mt-0.5">({item.assignedMentorsCount} mentors assigned)</span>
                      ) : null}
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-0.5 font-medium">Schedule Timeline:</span>
                      <strong className="text-slate-900 dark:text-white">{item.startDate} to {item.endDate}</strong>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-0.5 font-medium">Enrollment Capacity:</span>
                      <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{item.enrolledCount || 0} / {item.capacity} Enrolled</strong>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-0.5 font-medium">Measured Skill Gain:</span>
                      {item.measuredImprovement !== undefined ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          +{item.measuredImprovement} Points (Pre: {item.preAvgScore} → Post: {item.postAvgScore})
                        </span>
                      ) : (
                        <span className="text-slate-400">Impact measurement pending</span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CURRICULUM ALIGNMENT CONFIGURATION */}
      {/* ========================================================================= */}
      {subTab === 'curriculum' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Academic Curriculum Alignment Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Configure formal curriculum coverage across key industry competencies. Skills marked as "Not Covered" automatically trigger curriculum intervention modules.
              </p>
            </div>
          </div>

          <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Skill Domain</th>
                    <th className="p-4 text-center">Industry Demand</th>
                    <th className="p-4 text-center">Student Readiness</th>
                    <th className="p-4">Curriculum Coverage (Configurable)</th>
                    <th className="p-4">Intervention Priority</th>
                    <th className="p-4">Recommended Curriculum Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {curriculumAlignments.map((row) => (
                    <tr key={row.skillId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="p-4 font-bold text-slate-900 dark:text-slate-100">
                        {row.skillName}
                      </td>
                      <td className="p-4 text-center font-semibold text-slate-800 dark:text-slate-200">
                        {row.industryDemand}%
                      </td>
                      <td className="p-4 text-center font-semibold text-indigo-600 dark:text-indigo-400">
                        {row.studentReadiness}%
                      </td>
                      <td className="p-4">
                        <select
                          value={row.curriculumCoverage}
                          onChange={(e) =>
                            handleCurriculumCoverageChange(row.skillId, e.target.value as CurriculumCoverage)
                          }
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                        >
                          <option value="Covered">Covered in Syllabus</option>
                          <option value="Partially Covered">Partially Covered</option>
                          <option value="Not Covered">Not Covered in Syllabus</option>
                        </select>
                      </td>
                      <td className="p-4">
                        {getPriorityBadge(row.priority)}
                      </td>
                      <td className="p-4 text-xs text-slate-700 dark:text-slate-300 max-w-xs">
                        {row.recommendedAction}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. IMPACT & BEFORE VS. AFTER VISUALIZATION */}
      {/* ========================================================================= */}
      {subTab === 'impact' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Before vs. After Skill Impact Analysis
              </h2>
              <p className="text-xs text-slate-500">
                Recorded skill improvement verified from completed cohorts and post-intervention evaluations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {interventions
              .filter((i) => i.status === 'Completed' || i.status === 'Evaluated')
              .map((item) => {
                const impact = calculateInterventionImpact(item, enrollments);
                return (
                  <Card key={item.interventionId} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{item.title}</h3>
                      <Badge variant="emerald" size="sm">Verified Evaluation</Badge>
                    </div>

                    <div className="text-xs text-slate-500 mb-4">
                      Competency Track: <strong>{item.skillName}</strong> • Partner: <strong>{item.partnerIndustryName || 'Industry Partner'}</strong>
                    </div>

                    {/* Large Before vs After Graphic */}
                    <div className="grid grid-cols-3 gap-3 bg-linear-to-r from-slate-50 via-indigo-50/40 to-emerald-50/40 dark:from-slate-800 dark:via-indigo-950/40 dark:to-emerald-950/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center mb-4">
                      <div>
                        <div className="text-xs text-slate-500 font-medium">Before Program</div>
                        <div className="text-3xl font-extrabold text-slate-700 dark:text-slate-300 mt-1">{impact.beforeAvgScore}</div>
                        <div className="text-[11px] text-slate-400">Baseline Readiness</div>
                      </div>

                      <div className="flex flex-col items-center justify-center border-x border-slate-200 dark:border-slate-700">
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Recorded Skill Improvement</div>
                        <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">+{impact.averageSkillImprovement}</div>
                        <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">Measured Gain</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500 font-medium">After Program</div>
                        <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{impact.afterAvgScore}</div>
                        <div className="text-[11px] text-indigo-500">Post-Assessment</div>
                      </div>
                    </div>

                    {/* Operational Statistics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 dark:text-slate-400 py-3 border-y border-slate-200 dark:border-slate-700">
                      <div>
                        <span className="text-slate-400 block font-medium">Participants:</span>
                        <strong className="text-slate-800 dark:text-slate-200">{impact.participants} Students</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Completion Rate:</span>
                        <strong className="text-indigo-600 dark:text-indigo-400">{impact.completionRate}%</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Placement Conv.:</span>
                        <strong className="text-emerald-700 dark:text-emerald-400">
                          {impact.placementConversion !== null ? `${impact.placementConversion}%` : 'ROI measurement pending'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Industry Rating:</span>
                        <strong className="text-slate-800 dark:text-slate-200">
                          {impact.industryFeedbackScore !== null ? `⭐ ${impact.industryFeedbackScore} / 5.0` : 'Pending'}
                        </strong>
                      </div>
                    </div>

                    {/* Outcomes summary */}
                    {item.outcomesSummary && (
                      <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed">
                        {item.outcomesSummary}
                      </p>
                    )}
                  </Card>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. INDUSTRY CONNECTION & OPPORTUNITY ALIGNMENT */}
      {/* ========================================================================= */}
      {subTab === 'industry_connection' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Industry Hiring Connections & Demand Alignment
              </h2>
              <p className="text-xs text-slate-500">
                Active hiring partner linkages, enterprise requirements, and co-mentored intervention programs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">NovaCore Technologies Inc.</h3>
                    <span className="text-[11px] text-slate-400">Enterprise Cloud & Microservices</span>
                  </div>
                </div>
                <Badge variant="indigo" size="sm">Active Partner</Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Partnered for Cloud Computing & Distributed Systems. Assigned 3 senior architects for code reviews and lab mentoring.
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">Linked Openings: <strong>14 Opportunities</strong></span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">High Demand Track</span>
              </div>
            </Card>

            <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">CyberGuard Systems</h3>
                    <span className="text-[11px] text-slate-400">SOC & Threat Intelligence</span>
                  </div>
                </div>
                <Badge variant="warning" size="sm">Active Partner</Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Co-delivering Security Operations Center (SOC) bootcamps and simulated cyber threat incident response labs.
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">Linked Openings: <strong>9 Opportunities</strong></span>
                <span className="text-amber-600 dark:text-amber-400 font-semibold">Critical Need</span>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. INSTITUTION ACTION CENTER & DECISION SUPPORT */}
      {/* ========================================================================= */}
      {subTab === 'next_actions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Institutional Action Center & Decision Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Actionable institutional decisions referencing live demand signals, critical readiness deficits, and curriculum gaps.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Launch Cloud Computing Hands-On Workshop</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Based on 48% enterprise demand and an acute readiness gap of 35 points, schedule an industry-led infrastructure bootcamp.
                </p>
                <div className="pt-2">
                  <Button variant="outline" size="sm" onClick={() => setSubTab('recommendations')} className="text-xs">
                    Review Plan & Action
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Bridge Curriculum Coverage for Containerization</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Docker and Kubernetes currently have partial curriculum coverage with 42% industry demand. Adding a lab module will bridge readiness deficits.
                </p>
                <div className="pt-2">
                  <Button variant="outline" size="sm" onClick={() => setSubTab('curriculum')} className="text-xs">
                    Update Curriculum Module
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Assign Enterprise Mentors for Cybersecurity Range</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Student readiness in SOC operations is 32 against required 72. Assigning enterprise mentors will provide live incident simulation experience.
                </p>
                <div className="pt-2">
                  <Button variant="outline" size="sm" onClick={() => setSubTab('interventions')} className="text-xs">
                    Assign Industry Co-Mentors
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Introduce GenAI & Model Serving Certification</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Highest volume of hiring demand (62%). High-performing students can transition directly into premium tier-1 AI developer pathways.
                </p>
                <div className="pt-2">
                  <Button variant="outline" size="sm" onClick={() => setSubTab('recommendations')} className="text-xs">
                    View Live Capstones
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE NEW INTERVENTION */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <Card className="max-w-xl w-full p-6 bg-white dark:bg-slate-900 shadow-2xl rounded-3xl animate-fadeIn border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Targeted Skill Intervention</h3>
                <p className="text-xs text-slate-500">Configure a new co-mentored program to bridge institutional skill deficits.</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIntervention} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Intervention Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Applied Cloud Architecture & Kubernetes Mastery"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Skill Track</label>
                  <select
                    value={createForm.skillName}
                    onChange={(e) => setCreateForm({ ...createForm, skillName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="Cloud & Distributed Systems">Cloud & Distributed Systems</option>
                    <option value="GenAI & RAG Applications">GenAI & RAG Applications</option>
                    <option value="Cybersecurity & SOC Operations">Cybersecurity & SOC Operations</option>
                    <option value="Advanced Data Structures & Algorithms">Advanced DSA</option>
                    <option value="Data Analytics & Pipeline Engineering">Data Analytics</option>
                    <option value="DevOps & Container Orchestration">DevOps & Containers</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Intervention Type</label>
                  <select
                    value={createForm.interventionType}
                    onChange={(e) => setCreateForm({ ...createForm, interventionType: e.target.value as InterventionType })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="Industry Workshop">Industry Workshop</option>
                    <option value="Bootcamp">Bootcamp</option>
                    <option value="Faculty Development Program">Faculty Development Program</option>
                    <option value="Certification Pathway">Certification Pathway</option>
                    <option value="Industry Mentorship">Industry Mentorship</option>
                    <option value="Live Industry Project">Live Industry Project</option>
                    <option value="Curriculum Module">Curriculum Module</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Cohort</label>
                  <input
                    type="text"
                    value={createForm.targetCohort}
                    onChange={(e) => setCreateForm({ ...createForm, targetCohort: e.target.value })}
                    placeholder="e.g. 3rd Year CSE & IT Cohort"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Duration</label>
                  <input
                    type="text"
                    value={createForm.duration}
                    onChange={(e) => setCreateForm({ ...createForm, duration: e.target.value })}
                    placeholder="e.g. 4 Weeks (Weekend Intensive)"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Student Capacity</label>
                  <input
                    type="number"
                    min="1"
                    value={createForm.capacity}
                    onChange={(e) => setCreateForm({ ...createForm, capacity: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={createForm.startDate}
                    onChange={(e) => setCreateForm({ ...createForm, startDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                  <input
                    type="date"
                    value={createForm.endDate}
                    onChange={(e) => setCreateForm({ ...createForm, endDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Description & Learning Outcomes</label>
                <textarea
                  rows={3}
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Outline syllabus content, lab capstones, and industry mentor involvement..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isActionLoading}>
                  Create & Schedule Intervention
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: INTERVENTION DETAIL VIEW */}
      {/* ========================================================================= */}
      {selectedDetailIntervention && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full p-6 bg-white dark:bg-slate-900 shadow-2xl rounded-3xl animate-fadeIn border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {getStatusBadge(selectedDetailIntervention.status)}
                  <Badge variant="indigo" size="sm">{selectedDetailIntervention.interventionType}</Badge>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedDetailIntervention.title}</h3>
                <span className="text-xs text-slate-500">Skill Competency: {selectedDetailIntervention.skillName}</span>
              </div>
              <button
                onClick={() => setSelectedDetailIntervention(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {selectedDetailIntervention.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <span className="text-slate-500 block mb-0.5 font-medium">Timeline:</span>
                <strong className="text-slate-900 dark:text-white">{selectedDetailIntervention.startDate} to {selectedDetailIntervention.endDate}</strong>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5 font-medium">Enrollment:</span>
                <strong className="text-indigo-600 dark:text-indigo-400">{selectedDetailIntervention.enrolledCount || 0} / {selectedDetailIntervention.capacity} Students</strong>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5 font-medium">Industry Partner:</span>
                <strong className="text-slate-900 dark:text-white">{selectedDetailIntervention.partnerIndustryName || 'Pending Assignment'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5 font-medium">Skill Gain:</span>
                {selectedDetailIntervention.measuredImprovement !== undefined ? (
                  <strong className="text-emerald-600 dark:text-emerald-400">+{selectedDetailIntervention.measuredImprovement} pts</strong>
                ) : (
                  <span className="text-slate-400">Impact measurement pending</span>
                )}
              </div>
            </div>

            {selectedDetailIntervention.industryResponsibilities && (
              <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900 text-xs space-y-1">
                <span className="font-bold text-amber-900 dark:text-amber-300">Industry Partner Commitment:</span>
                <p className="text-amber-800 dark:text-amber-400 leading-relaxed">
                  {selectedDetailIntervention.industryResponsibilities}
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <Button variant="ghost" size="sm" onClick={() => setSelectedDetailIntervention(null)}>
                Close
              </Button>
              {selectedDetailIntervention.status === 'Approved' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setAssignPartnerModal(selectedDetailIntervention);
                    setSelectedDetailIntervention(null);
                  }}
                >
                  Assign Partner
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ASSIGN INDUSTRY PARTNER */}
      {/* ========================================================================= */}
      {assignPartnerModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6 bg-white dark:bg-slate-900 shadow-2xl rounded-3xl animate-fadeIn border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Assign Industry Partner</h3>
            <p className="text-xs text-slate-500 mb-4">
              Intervention: <strong>{assignPartnerModal.title}</strong>
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Industry Enterprise</label>
                <select
                  value={partnerForm.partnerId}
                  onChange={(e) => {
                    const id = e.target.value;
                    const name = id === 'ind_novacore' ? 'NovaCore Technologies Inc.' : 'CyberGuard Systems';
                    setPartnerForm({ ...partnerForm, partnerId: id, partnerName: name });
                  }}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="ind_novacore">NovaCore Technologies Inc.</option>
                  <option value="ind_cyberguard">CyberGuard Systems</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Mentors / Instructors Count</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={partnerForm.mentorsCount}
                  onChange={(e) => setPartnerForm({ ...partnerForm, mentorsCount: Number(e.target.value) })}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Industry Responsibilities & Deliverables</label>
                <textarea
                  rows={3}
                  value={partnerForm.responsibilities}
                  onChange={(e) => setPartnerForm({ ...partnerForm, responsibilities: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <Button variant="ghost" size="sm" onClick={() => setAssignPartnerModal(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" disabled={isActionLoading} onClick={handleSavePartnerAssignment}>
                Confirm Industry Assignment
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RECORD OUTCOME & POST-ASSESSMENT EVALUATION */}
      {/* ========================================================================= */}
      {outcomeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6 bg-white dark:bg-slate-900 shadow-2xl rounded-3xl animate-fadeIn border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Record Program Outcome</h3>
            <p className="text-xs text-slate-500 mb-4">
              Intervention: <strong>{outcomeModal.title}</strong>
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Post-Intervention Average Score (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={outcomeForm.postAvgScore}
                  onChange={(e) => setOutcomeForm({ ...outcomeForm, postAvgScore: Number(e.target.value) })}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Baseline Pre-Score was: <strong>{outcomeModal.preAvgScore || 40}</strong>. Recorded delta: +
                  {Math.max(0, outcomeForm.postAvgScore - (outcomeModal.preAvgScore || 40))}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Outcomes & Accreditation Summary</label>
                <textarea
                  rows={3}
                  value={outcomeForm.summary}
                  onChange={(e) => setOutcomeForm({ ...outcomeForm, summary: e.target.value })}
                  placeholder="Summarize cohort completion rate, project deliverables, and placement conversion..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <Button variant="ghost" size="sm" onClick={() => setOutcomeModal(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" disabled={isActionLoading} onClick={handleSaveOutcome}>
                Save Evaluated Outcomes
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
