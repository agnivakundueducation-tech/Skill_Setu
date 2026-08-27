import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  INITIAL_INSTITUTION_METRICS,
  SKILL_DEMAND_READINESS_DATA,
  DEPARTMENT_HEATMAP_DATA,
  SEMESTER_PROGRESSION_HEATMAP_DATA,
  PLACEMENT_TIERS_DATA,
  INITIAL_AI_RECOMMENDATIONS
} from '../../data/institutionData';
import {
  InstitutionSummaryMetrics,
  SkillDemandReadinessItem,
  DepartmentSkillHeatmapRow,
  SemesterProgressionHeatmapRow,
  PlacementTierItem,
  AICurriculumRecommendation
} from '../../types/institution';
import { Intervention } from '../../types/intervention';
import { interventionService } from '../../services/interventionService';
import { InstitutionHeader } from './InstitutionHeader';
import { InstitutionMetricsCards } from './InstitutionMetricsCards';
import { DemandReadinessAnalytics } from './DemandReadinessAnalytics';
import { SkillHeatmapsSection } from './SkillHeatmapsSection';
import { AICurriculumRecommendations } from './AICurriculumRecommendations';
import { PlacementReadinessAnalytics } from './PlacementReadinessAnalytics';
import { InstitutionCollaborationAnalyticsView } from './InstitutionCollaborationAnalyticsView';
import { InstitutionalInterventionCenterView } from './InstitutionalInterventionCenterView';
import { InstitutionReportsView } from './InstitutionReportsView';
import { SkillDetailModal } from './modals/SkillDetailModal';
import { CurriculumBlueprintModal } from './modals/CurriculumBlueprintModal';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  TrendingUp,
  Brain,
  Cloud,
  Shield,
  Code2,
  Database,
  Sparkles,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Zap,
  Building2,
  FileText
} from 'lucide-react';

interface InstitutionCommandCenterViewProps {
  initialTab?: string;
}

export const InstitutionCommandCenterView: React.FC<InstitutionCommandCenterViewProps> = ({
  initialTab = 'command_center'
}) => {
  const { appUser, isDemo, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromPath = (): string => {
    const path = location.pathname;
    if (path.includes('/interventions')) return 'intervention_center';
    if (path.includes('/collaborations')) return 'collaboration_analytics';
    if (path.includes('/demand-readiness') || path.includes('/accreditation')) return 'demand_readiness';
    if (path.includes('/heatmaps') || path.includes('/departments')) return 'skill_heatmaps';
    if (path.includes('/ai-recommendations')) return 'ai_recommendations';
    if (path.includes('/placements')) return 'placement_analytics';
    if (path.includes('/reports') || path.includes('/governance')) return 'reports';
    return initialTab || 'command_center';
  };

  const [activeTab, setActiveTab] = useState<string>(getTabFromPath());
  const [selectedCohort, setSelectedCohort] = useState<string>('2025-2026');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'command_center' || tabId === 'overview') {
      navigate('/dashboard/institution');
    } else if (tabId === 'intervention_center') {
      navigate('/dashboard/institution/interventions');
    } else if (tabId === 'collaboration_analytics') {
      navigate('/dashboard/institution/collaborations');
    } else if (tabId === 'demand_readiness') {
      navigate('/dashboard/institution/demand-readiness');
    } else if (tabId === 'skill_heatmaps') {
      navigate('/dashboard/institution/heatmaps');
    } else if (tabId === 'ai_recommendations') {
      navigate('/dashboard/institution/ai-recommendations');
    } else if (tabId === 'placement_analytics') {
      navigate('/dashboard/institution/placements');
    } else if (tabId === 'reports') {
      navigate('/dashboard/institution/reports');
    } else {
      navigate(`/dashboard/institution/${tabId}`);
    }
  };

  // Core Data State
  const [metrics, setMetrics] = useState<InstitutionSummaryMetrics>(INITIAL_INSTITUTION_METRICS);
  const [skillsData, setSkillsData] = useState<SkillDemandReadinessItem[]>(SKILL_DEMAND_READINESS_DATA);
  const [departmentData, setDepartmentData] = useState<DepartmentSkillHeatmapRow[]>(DEPARTMENT_HEATMAP_DATA);
  const [semesterData, setSemesterData] = useState<SemesterProgressionHeatmapRow[]>(SEMESTER_PROGRESSION_HEATMAP_DATA);
  const [tiersData, setTiersData] = useState<PlacementTierItem[]>(PLACEMENT_TIERS_DATA);
  const [recommendations, setRecommendations] = useState<AICurriculumRecommendation[]>(INITIAL_AI_RECOMMENDATIONS);
  const [interventions, setInterventions] = useState<Intervention[]>([]);

  // Modals & Inspection State
  const [selectedSkillForDetail, setSelectedSkillForDetail] = useState<SkillDemandReadinessItem | null>(null);
  const [selectedBlueprintRecommendation, setSelectedBlueprintRecommendation] = useState<AICurriculumRecommendation | null>(null);
  const [isAiAuditing, setIsAiAuditing] = useState(false);
  const [auditSuccessBanner, setAuditSuccessBanner] = useState(false);
  const [targetSkillFilterForAi, setTargetSkillFilterForAi] = useState<string>('all');

  // Load interventions on mount or context change
  useEffect(() => {
    loadInterventionsData();
  }, [isDemo, isAuthenticated, appUser]);

  const loadInterventionsData = async () => {
    const institutionId = appUser?.institutionId || 'inst_nit';
    const isDemoMode = isDemo || !isAuthenticated;
    const res = await interventionService.getInterventions({ institutionId, isDemo: isDemoMode });
    if (res.success && res.data) {
      setInterventions(res.data);
    }
  };

  // Handlers
  const handleUpdateRecommendationStatus = (
    id: string,
    newStatus: AICurriculumRecommendation['status']
  ) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status: newStatus } : rec))
    );
  };

  const handleTriggerAiAudit = () => {
    setIsAiAuditing(true);
    setTimeout(() => {
      setIsAiAuditing(false);
      setAuditSuccessBanner(true);
      setTimeout(() => setAuditSuccessBanner(false), 4000);
    }, 1200);
  };

  const handleOpenAiForSkill = (skillName: string) => {
    setTargetSkillFilterForAi(skillName);
    setActiveTab('ai_recommendations');
  };

  const handleExportReport = () => {
    const reportData = {
      institution: 'Apex Institute of Technology & Research',
      academicYear: selectedCohort,
      department: selectedDepartment,
      summary: metrics,
      skillGapMatrix: skillsData.map(s => ({
        skill: s.skill,
        industryDemand: s.industryDemand,
        studentReadiness: s.studentReadiness,
        gap: s.gap
      })),
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Apex_OBE_Accreditation_Report_${selectedCohort}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Sub-Tabs */}
      <InstitutionHeader
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        selectedCohort={selectedCohort}
        onChangeCohort={setSelectedCohort}
        selectedDepartment={selectedDepartment}
        onChangeDepartment={setSelectedDepartment}
        onExportReport={handleExportReport}
        onTriggerAiAudit={handleTriggerAiAudit}
        isAiAuditing={isAiAuditing}
      />

      {/* Audit Success Toast Notification */}
      {auditSuccessBanner && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between text-xs animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold">AI Curriculum Audit Complete:</span>
            <span>Analyzed 4,120 assessed students across 5 engineering departments. 5 syllabus modernization blueprints synthesized.</span>
          </div>
          <button
            onClick={() => handleTabChange('ai_recommendations')}
            className="font-bold underline text-emerald-700 dark:text-emerald-300 hover:text-emerald-900"
          >
            View Proposals →
          </button>
        </div>
      )}

      {/* 5 Key Metric Cards (Total Students, Students Assessed, Placement Ready, Internships, Placements) */}
      <InstitutionMetricsCards
        metrics={metrics}
        onSelectMetricDrilldown={(key) => {
          if (key === 'placements' || key === 'internships' || key === 'placement_ready') {
            handleTabChange('placement_analytics');
          } else if (key === 'students_assessed') {
            handleTabChange('demand_readiness');
          }
        }}
      />

      {/* TAB 1: Command Center Overview */}
      {activeTab === 'command_center' && (
        <div className="space-y-6">
          {/* Institutional Action Center (Step 11) */}
          <Card className="p-5 bg-linear-to-r from-amber-500/10 via-indigo-500/10 to-transparent border border-amber-500/20 dark:border-amber-500/10 rounded-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300">
                    <Zap className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Institution Action Center & Critical Alerts
                  </h3>
                  <Badge variant="warning" size="sm">4 Priority Actions</Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Real-time intelligence signals requiring academic council or placement intervention.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTabChange('intervention_center')}
                  className="text-xs border-amber-300 dark:border-amber-700 hover:bg-amber-100/50"
                >
                  <Zap className="w-3.5 h-3.5 mr-1 text-amber-600" />
                  Launch Skill Intervention
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleTabChange('reports')}
                  className="text-xs bg-amber-600 hover:bg-amber-500"
                >
                  <FileText className="w-3.5 h-3.5 mr-1" />
                  Accreditation Report
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs">
              <div
                onClick={() => handleTabChange('intervention_center')}
                className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-amber-400 transition-all space-y-1"
              >
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Cloud & Distributed Gaps</span>
                  <span className="text-rose-600 font-black">35 pt deficit</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  48% industry demand vs 35% student readiness. Recommended: Weekend hands-on workshop.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('ai_recommendations')}
                className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-amber-400 transition-all space-y-1"
              >
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Curriculum Coverage</span>
                  <span className="text-amber-600 font-black">3 gaps</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  Docker and SOC Operations have 0% formal syllabus coverage. Update curriculum blueprints.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('demand_readiness')}
                className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-amber-400 transition-all space-y-1"
              >
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Assessment Target</span>
                  <span className="text-sky-600 font-black">85.8% Complete</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  4,120 of 4,800 students assessed. EEE and ECE departments have 14% remaining.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('intervention_center')}
                className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-amber-400 transition-all space-y-1"
              >
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Industry Co-Mentorship</span>
                  <span className="text-emerald-600 font-black">2 Partners</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  NovaCore and CyberGuard active. 1 co-mentored program pending outcome evaluation.
                </p>
              </div>
            </div>
          </Card>

          {/* Main 2-Column Showcase: Demand vs Readiness Snapshot + AI Priority Proposals */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Demand vs Readiness Analytics Snapshot */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    Industry Demand vs Student Readiness Snapshot
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time delta for AI/ML, Cloud, Cybersecurity, DSA, and Data Analytics.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  rightIcon={ArrowRight}
                  onClick={() => setActiveTab('demand_readiness')}
                  className="text-xs"
                >
                  Full Analytics
                </Button>
              </div>

              {/* Mini List of 5 Skills */}
              <div className="space-y-2.5">
                {skillsData.map((item) => {
                  const isCritical = item.gapSeverity === 'critical';

                  return (
                    <Card
                      key={item.id}
                      variant="default"
                      onClick={() => setSelectedSkillForDetail(item)}
                      className="p-3.5 rounded-2xl border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 transition-all cursor-pointer hover:shadow-xs space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {item.skill}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            ({item.hiringOpeningsVolume} jobs)
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                            Demand: {item.industryDemand}%
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            Readiness: {item.studentReadiness}%
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                              isCritical
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                          >
                            {item.gap}% Gap
                          </span>
                        </div>
                      </div>

                      {/* Visual Dual Progress Track */}
                      <div className="space-y-1">
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                          <div
                            className="h-full bg-emerald-500 rounded-l-full"
                            style={{ width: `${item.studentReadiness}%` }}
                            title={`Readiness: ${item.studentReadiness}%`}
                          />
                          <div
                            className="h-full bg-rose-400/80"
                            style={{ width: `${Math.abs(item.gap)}%` }}
                            title={`Gap: ${item.gap}%`}
                          />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Right: AI Curriculum Engine Quick Interventions */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    AI Recommended Interventions
                  </h3>
                  <p className="text-xs text-slate-500">
                    High-impact syllabus fixes to close student readiness gap.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  rightIcon={ArrowRight}
                  onClick={() => setActiveTab('ai_recommendations')}
                  className="text-xs"
                >
                  View All ({recommendations.length})
                </Button>
              </div>

              <div className="space-y-3">
                {recommendations.slice(0, 3).map((rec) => (
                  <Card
                    key={rec.id}
                    variant="default"
                    className="p-4 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-2 hover:border-amber-400 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="primary" size="sm" className="text-[10px]">
                        {rec.targetSkill}
                      </Badge>
                      <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                        {rec.projectedGapReduction}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {rec.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {rec.summary}
                    </p>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{rec.creditsChange}</span>
                      <button
                        onClick={() => setSelectedBlueprintRecommendation(rec)}
                        className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
                      >
                        Inspect Blueprint →
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Department & Semester Heatmap Preview */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Cross-Departmental Skill Competency Heatmap
                </h3>
                <p className="text-xs text-slate-500">
                  OBE Outcome Assessment matrix mapping CSE, AIDS, IT, ECE, EEE cohorts.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                rightIcon={ArrowRight}
                onClick={() => setActiveTab('skill_heatmaps')}
                className="text-xs"
              >
                Open Full Matrix
              </Button>
            </div>

            <SkillHeatmapsSection
              departmentData={departmentData}
              semesterData={semesterData}
              onOpenAiRecommendation={handleOpenAiForSkill}
            />
          </div>

          {/* Section: Placement & Internship Funnel */}
          <div className="pt-2">
            <PlacementReadinessAnalytics metrics={metrics} tiers={tiersData} />
          </div>
        </div>
      )}

      {/* TAB: Institutional Intervention Center (Phase 14D-B & 15-D-1) */}
      {activeTab === 'intervention_center' && (
        <div className="space-y-4">
          <InstitutionalInterventionCenterView
            institutionId={appUser?.institutionId || 'inst_nit'}
            isDemo={isDemo || !isAuthenticated}
            onNavigateTab={setActiveTab}
          />
        </div>
      )}

      {/* TAB: Collaboration Analytics & Faculty Immersion */}
      {activeTab === 'collaboration_analytics' && (
        <div className="space-y-4">
          <InstitutionCollaborationAnalyticsView
            institutionId={appUser?.institutionId || 'inst_nit'}
            isDemo={isDemo || !isAuthenticated}
          />
        </div>
      )}

      {/* TAB 2: Full Demand vs Readiness Analytics */}
      {activeTab === 'demand_readiness' && (
        <div className="space-y-4">
          <DemandReadinessAnalytics
            skillsData={skillsData}
            onSelectSkill={(skill) => setSelectedSkillForDetail(skill)}
            onOpenAiRecommendationsForSkill={handleOpenAiForSkill}
          />
        </div>
      )}

      {/* TAB 3: Competency Heatmaps */}
      {activeTab === 'skill_heatmaps' && (
        <div className="space-y-4">
          <SkillHeatmapsSection
            departmentData={departmentData}
            semesterData={semesterData}
            onOpenAiRecommendation={handleOpenAiForSkill}
          />
        </div>
      )}

      {/* TAB 4: AI Recommendations Engine */}
      {activeTab === 'ai_recommendations' && (
        <div className="space-y-4">
          <AICurriculumRecommendations
            recommendations={recommendations}
            onUpdateStatus={handleUpdateRecommendationStatus}
            onOpenBlueprintModal={(rec) => setSelectedBlueprintRecommendation(rec)}
            onRegenerateAi={handleTriggerAiAudit}
            isRegenerating={isAiAuditing}
            selectedSkillFilter={targetSkillFilterForAi}
          />
        </div>
      )}

      {/* TAB 5: Placement & Internships Funnel */}
      {activeTab === 'placement_analytics' && (
        <div className="space-y-4">
          <PlacementReadinessAnalytics metrics={metrics} tiers={tiersData} />
        </div>
      )}

      {/* TAB 6: Reports & Accreditation (Step 12) */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <InstitutionReportsView
            metrics={metrics}
            skillsData={skillsData}
            departmentData={departmentData}
            recommendations={recommendations}
            tiersData={tiersData}
            interventions={interventions}
            academicYear={selectedCohort}
            selectedDepartment={selectedDepartment}
            institutionName={appUser?.displayName || 'Apex Institute of Technology & Research'}
            isDemo={isDemo || !isAuthenticated}
          />
        </div>
      )}

      {/* Modals */}
      <SkillDetailModal
        skill={selectedSkillForDetail}
        isOpen={!!selectedSkillForDetail}
        onClose={() => setSelectedSkillForDetail(null)}
        onOpenAiRecommendation={handleOpenAiForSkill}
      />

      <CurriculumBlueprintModal
        recommendation={selectedBlueprintRecommendation}
        isOpen={!!selectedBlueprintRecommendation}
        onClose={() => setSelectedBlueprintRecommendation(null)}
        onApprove={(id) => handleUpdateRecommendationStatus(id, 'approved')}
      />
    </div>
  );
};
