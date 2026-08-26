import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES, ROLE_METRICS, ROLE_ACTIVITIES } from '../data/mockData';
import { UserRole } from '../types';
import { ActiveApplication, Certification, Opportunity } from '../types/student';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Modal } from '../components/ui/Modal';
import { RoleBadge } from '../components/common/RoleBadge';
import { DynamicIcon } from '../components/common/IconRenderer';

// Student Specific Dashboard Views & Modals
import { StudentOverviewView } from '../components/student/views/StudentOverviewView';
import { SkillAssessmentView } from '../components/student/views/SkillAssessmentView';
import { SkillDnaView } from '../components/student/views/SkillDnaView';
import { SkillGapView } from '../components/student/views/SkillGapView';
import { CareerRoadmapView } from '../components/student/views/CareerRoadmapView';
import { OpportunitiesView } from '../components/student/views/OpportunitiesView';
import { ApplicationsView } from '../components/student/views/ApplicationsView';
import { InternshipWorkspaceView } from '../components/internship/InternshipWorkspaceView';
import { StudentLearningProgramsView } from '../components/student/learning/StudentLearningProgramsView';
import { PortfolioView } from '../components/student/views/PortfolioView';
import { DocumentVaultView } from '../components/student/vault/DocumentVaultView';
import { StudentInterventionsView } from '../components/student/StudentInterventionsView';
import { SetuCopilotView } from '../components/copilot/SetuCopilotView';
import { CareerCoachSection } from '../components/student/CareerCoachSection';
import { AssessmentModal } from '../components/student/AssessmentModal';
import { CertificateModal } from '../components/student/CertificateModal';
import { ApplicationDetailModal } from '../components/student/ApplicationDetailModal';
import { OpportunityApplyModal } from '../components/student/OpportunityApplyModal';
import { STUDENT_OPPORTUNITIES } from '../data/studentData';
import { IndustryDashboardView } from '../components/industry/IndustryDashboardView';
import { InstitutionCommandCenterView } from '../components/institution/InstitutionCommandCenterView';
import { AcademicianDashboardView } from '../components/academician/AcademicianDashboardView';

import {
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink,
  ChevronRight,
  Layers,
  ArrowRight,
  TrendingUp,
  Download,
  Share2,
  LayoutDashboard,
  Target,
  Dna,
  GitCompare,
  MapPin,
  Compass,
  Send,
  Briefcase,
  Zap,
  GraduationCap,
  FolderArchive
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { role: routeRole } = useParams<{ role?: string }>();
  const { currentRole, setRole, user, appUser, isDemo, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Generic demo modal state (for non-student actions)
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [modalActionType, setModalActionType] = useState<'create' | 'export' | 'detail'>('detail');

  // Student specific modals state
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [assessmentSkillName, setAssessmentSkillName] = useState<string>('React 19 & Architecture');
  const [selectedCertificate, setSelectedCertificate] = useState<Certification | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<ActiveApplication | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  // Synchronize route role with Auth context if valid
  const effectiveRole: UserRole = (routeRole && ['student', 'industry', 'academician', 'institution'].includes(routeRole))
    ? (routeRole as UserRole)
    : currentRole;

  useEffect(() => {
    if (routeRole && ['student', 'industry', 'academician', 'institution'].includes(routeRole) && routeRole !== currentRole) {
      setRole(routeRole as UserRole);
    }
  }, [routeRole, currentRole, setRole]);

  // Determine active student sub-tab from path
  const getActiveStudentTab = (): string => {
    const path = location.pathname;
    if (path.includes('/career-coach') || path.includes('/coach')) return 'career-coach';
    if (path.includes('/copilot')) return 'copilot';
    if (path.includes('/career-roadmap') || path.includes('/roadmap')) return 'career-roadmap';
    if (path.includes('/learning-programs') || path.includes('/learning') || path.includes('/programs')) return 'learning-programs';
    if (path.includes('/assessment')) return 'assessment';
    if (path.includes('/skill-gap') || path.includes('/gap')) return 'skill-gap';
    if (path.includes('/skill-dna') || path.includes('/skills')) return 'skill-dna';
    if (path.includes('/opportunities') || path.includes('/careers')) return 'opportunities';
    if (path.includes('/interventions') || path.includes('/intervene')) return 'interventions';
    if (path.includes('/applications')) return 'applications';
    if (path.includes('/internship') || path.includes('/internships') || path.includes('/lifecycle')) return 'internships';
    if (path.includes('/vault') || path.includes('/documents') || path.includes('/evidence')) return 'vault';
    if (path.includes('/portfolio') || path.includes('/projects') || path.includes('/credentials')) return 'portfolio';
    return 'dashboard';
  };

  const activeStudentTab = getActiveStudentTab();

  const handleStudentTabChange = (tabId: string) => {
    if (tabId === 'dashboard') {
      navigate('/dashboard/student');
    } else {
      navigate(`/dashboard/student/${tabId}`);
    }
  };

  const handleOpenAssessment = (skillName?: string) => {
    if (skillName) setAssessmentSkillName(skillName);
    setIsAssessmentModalOpen(true);
  };

  const handleOpenOpportunityApply = (oppOrId: Opportunity | string) => {
    if (typeof oppOrId === 'string') {
      const found = STUDENT_OPPORTUNITIES.find(o => o.id === oppOrId) || STUDENT_OPPORTUNITIES[0];
      setSelectedOpportunity(found);
    } else {
      setSelectedOpportunity(oppOrId);
    }
  };

  const roleInfo = ROLES[effectiveRole] || ROLES.student;
  const metrics = ROLE_METRICS[effectiveRole] || ROLE_METRICS.student;
  const activities = ROLE_ACTIVITIES[effectiveRole] || ROLE_ACTIVITIES.student;

  const handleOpenActionModal = (type: 'create' | 'export' | 'detail') => {
    if (effectiveRole === 'student' && type === 'create') {
      handleOpenAssessment();
      return;
    }
    setModalActionType(type);
    setIsDemoModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success" size="sm" dot>Completed</Badge>;
      case 'in-progress':
        return <Badge variant="primary" size="sm" dot>In Progress</Badge>;
      case 'urgent':
        return <Badge variant="danger" size="sm" dot>Urgent Action</Badge>;
      case 'pending':
      default:
        return <Badge variant="warning" size="sm" dot>Pending</Badge>;
    }
  };

  const studentNavigationTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'career-coach', label: 'Career Coach', icon: Compass, badge: '30-90 Day Plan' },
    { id: 'copilot', label: 'Setu Copilot', icon: Sparkles, badge: 'AI Copilot' },
    { id: 'career-roadmap', label: 'AI Career Roadmap', icon: MapPin, badge: '78% → 98%' },
    { id: 'learning-programs', label: 'Industry Learning', icon: GraduationCap, badge: 'Certificates' },
    { id: 'assessment', label: 'Skill Assessment', icon: Target, badge: 'AI Ready' },
    { id: 'skill-dna', label: 'Skill DNA', icon: Dna, badge: '87/100' },
    { id: 'skill-gap', label: 'Skill Gap', icon: GitCompare, badge: 'Action Plan' },
    { id: 'interventions', label: 'Interventions', icon: Zap, badge: 'Skill Boost' },
    { id: 'opportunities', label: 'Opportunities', icon: Compass, badge: '14 Matched' },
    { id: 'applications', label: 'Applications', icon: Send, badge: '6 Active' },
    { id: 'internships', label: 'Internship Lifecycle', icon: CheckCircle2, badge: 'Active Cohort' },
    { id: 'vault', label: 'Document Vault', icon: FolderArchive, badge: 'Secure' },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RoleBadge role={effectiveRole} size="sm" />
            <span className="text-xs text-slate-400 font-medium">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {user.organization || 'Verified Enterprise Workspace'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <span>{roleInfo.title} Hub</span>
            <Badge variant="primary" size="sm" className="hidden sm:inline-flex">
              v1.0 Production
            </Badge>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {roleInfo.description}
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={Download}
            onClick={() => handleOpenActionModal('export')}
          >
            Export Report
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={Plus}
            onClick={() => handleOpenActionModal('create')}
          >
            {effectiveRole === 'student' ? 'New Skill Assessment' : effectiveRole === 'industry' ? 'Post Challenge' : effectiveRole === 'academician' ? 'Add Syllabus Module' : 'Initiate MoU'}
          </Button>
        </div>
      </div>

      {/* Role Notice Callout */}
      <div className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${roleInfo.color.light} ${roleInfo.color.border}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/80 dark:bg-slate-900/80 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Active Persona: {roleInfo.title}
            </div>
            <div className="text-xs opacity-80">
              Routing dynamically synchronized to <code className="font-mono bg-white/60 dark:bg-slate-900/60 px-1 py-0.5 rounded text-[11px]">/dashboard/{effectiveRole}</code>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/roles')}
            className="text-xs font-semibold"
          >
            Switch Persona
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STUDENT ROLE WORKSPACE */}
      {/* ========================================================================= */}
      {effectiveRole === 'student' ? (
        <div className="space-y-6">
          {/* Quick Sub-Navigation Tab Bar for Students */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80 dark:border-slate-800 scrollbar-none">
            {studentNavigationTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeStudentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleStudentTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sub-view switcher */}
          {activeStudentTab === 'dashboard' && (
            <StudentOverviewView
              onNavigateTab={handleStudentTabChange}
              onTakeAssessment={handleOpenAssessment}
              onSelectApplication={(app) => setSelectedApplication(app)}
              onSelectCertification={(cert) => setSelectedCertificate(cert)}
              onSelectOpportunity={handleOpenOpportunityApply}
            />
          )}

          {activeStudentTab === 'career-coach' && (
            <CareerCoachSection
              onNavigateTab={handleStudentTabChange}
              onTakeAssessment={handleOpenAssessment}
            />
          )}

          {activeStudentTab === 'copilot' && (
            <SetuCopilotView
              onNavigateTab={handleStudentTabChange}
              onTakeAssessment={handleOpenAssessment}
            />
          )}

          {activeStudentTab === 'career-roadmap' && (
            <CareerRoadmapView
              onNavigateTab={handleStudentTabChange}
              onOpenAssessmentModal={() => handleOpenAssessment('Data Structures & Algorithms')}
            />
          )}

          {activeStudentTab === 'learning-programs' && (
            <StudentLearningProgramsView />
          )}

          {activeStudentTab === 'assessment' && (
            <SkillAssessmentView
              onStartAssessment={handleOpenAssessment}
              onExploreOpportunities={() => handleStudentTabChange('opportunities')}
            />
          )}

          {activeStudentTab === 'skill-dna' && (
            <SkillDnaView
              onTakeAssessment={handleOpenAssessment}
              onExploreOpportunities={() => handleStudentTabChange('opportunities')}
            />
          )}

          {activeStudentTab === 'skill-gap' && (
            <SkillGapView
              onTakeAssessment={handleOpenAssessment}
              onExploreOpportunities={() => handleStudentTabChange('opportunities')}
            />
          )}

          {activeStudentTab === 'interventions' && (
            <StudentInterventionsView
              studentId={user.id}
              studentName={user.name}
              studentEmail={user.email}
              institutionId={appUser?.institutionId || 'inst_nit'}
              isDemo={isDemo || !isAuthenticated}
            />
          )}

          {activeStudentTab === 'opportunities' && (
            <OpportunitiesView
              onApplyOpportunity={handleOpenOpportunityApply}
              onNavigateToApplications={() => handleStudentTabChange('applications')}
              onNavigateToAssessment={() => handleStudentTabChange('assessment')}
            />
          )}

          {activeStudentTab === 'applications' && (
            <ApplicationsView
              onSelectApplication={(app) => setSelectedApplication(app)}
              onExploreOpportunities={() => handleStudentTabChange('opportunities')}
            />
          )}

          {activeStudentTab === 'internships' && (
            <InternshipWorkspaceView
              onBack={() => handleStudentTabChange('applications')}
            />
          )}

          {activeStudentTab === 'vault' && (
            <DocumentVaultView />
          )}

          {activeStudentTab === 'portfolio' && (
            <PortfolioView
              onViewCertificate={(cert) => setSelectedCertificate(cert)}
            />
          )}
        </div>
      ) : effectiveRole === 'industry' ? (
        /* ========================================================================= */
        /* INDUSTRY ROLE WORKSPACE */
        /* ========================================================================= */
        <IndustryDashboardView />
      ) : effectiveRole === 'institution' ? (
        /* ========================================================================= */
        /* INSTITUTION COMMAND CENTER WORKSPACE */
        /* ========================================================================= */
        <InstitutionCommandCenterView />
      ) : effectiveRole === 'academician' ? (
        /* ========================================================================= */
        /* ACADEMICIAN COLLABORATION HUB & PASSPORT WORKSPACE */
        /* ========================================================================= */
        <AcademicianDashboardView
          userUid={appUser?.uid || 'demo_academician_01'}
          isDemo={isDemo || !isAuthenticated}
        />
      ) : (
        /* Non-student generic role dashboard fallback */
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <Card key={metric.id} variant="default" className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[80%]">
                      {metric.title}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                      <DynamicIcon name={metric.icon} className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    {metric.value}
                  </div>
                </div>

                
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  {metric.change && (
                    <span
                      className={`font-semibold flex items-center gap-0.5 ${
                        metric.changeType === 'increase'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : metric.changeType === 'decrease'
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {metric.changeType === 'increase' && <ArrowUpRight className="w-3.5 h-3.5" />}
                      {metric.changeType === 'decrease' && <ArrowDownRight className="w-3.5 h-3.5" />}
                      {metric.change}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 truncate max-w-[60%] text-right">
                    {metric.description}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* Analytical Progress & Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card variant="default">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-base">Competency Benchmark Index</CardTitle>
                    <CardDescription>Real-time telemetry and ecosystem alignment</CardDescription>
                  </div>
                  <Badge variant="primary" size="sm">Live AI Calibration</Badge>
                </CardHeader>

                <CardContent className="space-y-4 pt-2">
                  <div className="space-y-3">
                    <ProgressBar
                      value={effectiveRole === 'academician' ? 89 : 95}
                      label="Industry & Practical Ecosystem Alignment"
                      color="indigo"
                      size="md"
                    />
                    <ProgressBar
                      value={effectiveRole === 'academician' ? 94 : 91}
                      label="Active Project Completion Yield"
                      color="emerald"
                      size="md"
                    />
                    <ProgressBar
                      value={effectiveRole === 'academician' ? 86 : 98}
                      label="Verification & Credential Validation Rate"
                      color="sky"
                      size="md"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activities List */}
            <div className="space-y-6">
              <Card variant="default">
                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <CardTitle className="text-base">Ecosystem Feed</CardTitle>
                  <CardDescription>Verified telemetry logs</CardDescription>
                </CardHeader>
                <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
                  {activities.map((act) => (
                    <div key={act.id} className="p-4 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                          {act.tag}
                        </span>
                        {getStatusBadge(act.status)}
                      </div>
                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {act.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {act.subtitle}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}
      <AssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        skillName={assessmentSkillName}
      />
      <CertificateModal
        isOpen={selectedCertificate !== null}
        onClose={() => setSelectedCertificate(null)}
        certificate={selectedCertificate}
      />
      <ApplicationDetailModal
        isOpen={selectedApplication !== null}
        onClose={() => setSelectedApplication(null)}
        application={selectedApplication}
      />

      <OpportunityApplyModal
        isOpen={selectedOpportunity !== null}
        onClose={() => setSelectedOpportunity(null)}
        opportunity={selectedOpportunity}
        onNavigateToApplications={() => handleStudentTabChange('applications')}
      />
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title={
          modalActionType === 'create'
            ? `New ${roleInfo.title} Action`
            : modalActionType === 'export'
            ? 'Export Analytics Report'
            : 'Detailed Competency Matrix'
        }
        description="SkillSetu AI Verified Module"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            This module has executed the request with certified zero-knowledge proofs.
          </p>
          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" onClick={() => setIsDemoModalOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
