import React, { useState, useEffect, useCallback } from 'react';
import { ActiveApplication, ApplicationStatus } from '../../../types/student';
import { STUDENT_ACTIVE_APPLICATIONS } from '../../../data/studentData';
import { ApplicationTrackingHeader } from '../tracking/ApplicationTrackingHeader';
import { ApplicationTimelineView } from '../tracking/ApplicationTimelineView';
import { ApplicationKanbanView } from '../tracking/ApplicationKanbanView';
import { AddApplicationModal } from '../tracking/AddApplicationModal';
import { ApplicationDetailsDrawer } from '../tracking/ApplicationDetailsDrawer';
import { StudentInterviewsTab } from '../tracking/StudentInterviewsTab';
import { StudentOffersTab } from '../tracking/StudentOffersTab';
import { useAuth } from '../../../context/AuthContext';
import {
  getStudentApplications,
  withdrawApplication,
  updateApplicationStatus
} from '../../../services/applicationService';
import { ApplicationRecord } from '../../../types/application';
import {
  FileSpreadsheet,
  Calendar,
  DollarSign,
  Award,
  Sparkles,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

interface ApplicationsViewProps {
  onSelectApplication?: (app: ActiveApplication) => void;
  onExploreOpportunities?: () => void;
  onNavigateToPassport?: () => void;
}

const STORAGE_KEY = 'skillsetu_student_applications_v2';

function mapRecordToActiveApp(rec: ApplicationRecord): ActiveApplication {
  const stageMapping: Record<string, ApplicationStatus> = {
    'Applied': 'Applied',
    'Under Review': 'Shortlisted',
    'Shortlisted': 'Shortlisted',
    'Interview': 'Interview',
    'Interview Scheduled': 'Interview',
    'Interview Completed': 'Interview',
    'Offer': 'Selected',
    'Accepted': 'Selected',
    'Declined': 'Rejected',
    'Selected': 'Selected',
    'Rejected': 'Rejected',
    'Withdrawn': 'Rejected'
  };

  const currentStage = stageMapping[rec.status] || 'Applied';
  const stageStep =
    currentStage === 'Applied' ? 1 :
    currentStage === 'Shortlisted' ? 2 :
    currentStage === 'Assessment' ? 3 :
    currentStage === 'Interview' ? 4 : 5;

  const appliedFormattedDate = rec.appliedAt
    ? new Date(rec.appliedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    : 'Recently';

  return {
    id: rec.applicationId,
    company: rec.companyName || 'Verified Employer',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    roleTitle: rec.opportunityTitle || 'Software Engineer',
    location: rec.location || 'Bengaluru, India',
    workType: ((rec.workMode === 'Remote' || rec.workMode === 'On-site') ? rec.workMode : 'Hybrid'),
    employmentType: ((rec.opportunityType === 'Full-Time' || rec.opportunityType === 'Full-time') ? 'Full-time' : 'Internship'),
    appliedDate: appliedFormattedDate,
    currentStage,
    stageStep,
    totalSteps: 5,
    matchScore: rec.matchScoreAtApplication || 85,
    stipendOrSalary: rec.stipend || '₹45,000 / month',
    status: (rec.status === 'Selected' || rec.status === 'Offer' || rec.status === 'Accepted') ? 'offer' : rec.status === 'Rejected' || rec.status === 'Withdrawn' || rec.status === 'Declined' ? 'rejected' : 'active',
    nextStepTitle:
      rec.status === 'Interview Scheduled' ? 'Technical Interview Scheduled' :
      rec.status === 'Interview Completed' ? 'Evaluation Submitted' :
      rec.status === 'Offer' ? 'Offer Letter Awaiting Decision' :
      rec.status === 'Accepted' ? 'Placement Verified' :
      rec.status === 'Withdrawn' ? 'Application Withdrawn' : 'Recruiter Profile Review',
    nextStepDeadline: 'In Progress',
    notes: rec.recruiterNotes || 'Evaluation performed with deterministic Skill DNA matching.',
    timelineHistory: [
      {
        id: `tl-1-${rec.applicationId}`,
        stage: 'Applied',
        title: 'Application Transmitted',
        date: appliedFormattedDate,
        description: 'Profile snapshot and verified Skill DNA passport submitted.',
        completed: true,
        current: rec.status === 'Applied'
      },
      ...(rec.status !== 'Applied' ? [{
        id: `tl-2-${rec.applicationId}`,
        stage: currentStage,
        title: rec.status === 'Withdrawn' ? 'Application Withdrawn' : `Status: ${rec.status}`,
        date: new Date(rec.updatedAt || rec.appliedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        description: rec.recruiterNotes || `Application transitioned to ${rec.status}.`,
        completed: true,
        current: true
      }] : [])
    ]
  };
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  onSelectApplication,
  onExploreOpportunities,
  onNavigateToPassport
}) => {
  const { appUser, isAuthenticated, isDemo } = useAuth();

  // Sub-tab selection: Pipeline vs Interviews Hub vs Offers & Placements
  const [activeSection, setActiveSection] = useState<'pipeline' | 'interviews' | 'offers'>('pipeline');
  const [viewMode, setViewMode] = useState<'timeline' | 'kanban'>('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatus>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAppForDrawer, setSelectedAppForDrawer] = useState<ActiveApplication | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize applications state
  const [applications, setApplications] = useState<ActiveApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return STUDENT_ACTIVE_APPLICATIONS;
  });

  // Load applications from service
  const loadApplications = useCallback(async () => {
    const studentId = (isAuthenticated && !isDemo && appUser?.uid) ? appUser.uid : 'usr_std_01';
    setIsLoading(true);
    try {
      const res = await getStudentApplications(studentId, isDemo || !isAuthenticated);
      if (res.success && res.data && res.data.length > 0) {
        const mapped = res.data.map(mapRecordToActiveApp);
        setApplications(mapped);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
      }
    } catch (err) {
      console.warn('[ApplicationsView] Could not load student applications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [appUser, isAuthenticated, isDemo]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch {
      // Ignore storage errors
    }
  }, [applications]);

  // Compute status counts across the 6 statuses
  const statusCounts: Record<ApplicationStatus, number> = {
    Applied: 0,
    Shortlisted: 0,
    Assessment: 0,
    Interview: 0,
    Selected: 0,
    Rejected: 0
  };

  applications.forEach((app) => {
    if (statusCounts[app.currentStage] !== undefined) {
      statusCounts[app.currentStage]++;
    }
  });

  // Filter applications by search and status
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.notes && app.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || app.currentStage === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Withdraw application handler
  const handleWithdrawApplication = async (id: string) => {
    const studentId = (isAuthenticated && !isDemo && appUser?.uid) ? appUser.uid : 'usr_std_01';
    try {
      await withdrawApplication(id, studentId, isDemo || !isAuthenticated);
      setApplications((prev) =>
        prev.map((app) => {
          if (app.id === id) {
            return {
              ...app,
              currentStage: 'Rejected' as ApplicationStatus,
              status: 'rejected',
              nextStepTitle: 'Application Withdrawn',
              notes: 'Application withdrawn by student.'
            };
          }
          return app;
        })
      );
    } catch (err) {
      console.error('[ApplicationsView] Withdraw error:', err);
    }
  };

  // Update status handler
  const handleUpdateStatus = (id: string, newStatus: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const updatedTimeline = app.timelineHistory ? [...app.timelineHistory] : [];
          const stageStep =
            newStatus === 'Applied'
              ? 1
              : newStatus === 'Shortlisted'
              ? 2
              : newStatus === 'Assessment'
              ? 3
              : newStatus === 'Interview'
              ? 4
              : 5;

          const updatedApp: ActiveApplication = {
            ...app,
            currentStage: newStatus,
            stageStep,
            status: newStatus === 'Selected' ? 'offer' : newStatus === 'Rejected' ? 'rejected' : 'active',
            timelineHistory: [
              ...updatedTimeline,
              {
                id: `t-${Date.now()}`,
                stage: newStatus,
                title: `Stage transitioned to ${newStatus}`,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                description: `Candidate progressed to ${newStatus} milestone.`,
                completed: true,
                current: true
              }
            ]
          };

          if (selectedAppForDrawer && selectedAppForDrawer.id === id) {
            setSelectedAppForDrawer(updatedApp);
          }

          return updatedApp;
        }
        return app;
      })
    );
  };

  // Add new application
  const handleAddApplication = (newApp: ActiveApplication) => {
    setApplications((prev) => [newApp, ...prev]);
  };

  // Handle drawer selection
  const handleSelectApp = (app: ActiveApplication) => {
    setSelectedAppForDrawer(app);
    if (onSelectApplication) {
      onSelectApplication(app);
    }
  };

  // Handle notes and next step edit
  const handleUpdateNotes = (
    id: string,
    notes: string,
    nextStepTitle: string,
    nextStepDeadline: string
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const updated = {
            ...app,
            notes,
            nextStepTitle,
            nextStepDeadline
          };
          if (selectedAppForDrawer && selectedAppForDrawer.id === id) {
            setSelectedAppForDrawer(updated);
          }
          return updated;
        }
        return app;
      })
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Sub-Hub Switcher Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 w-fit">
        <button
          onClick={() => setActiveSection('pipeline')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'pipeline'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
          <span>Applications Pipeline</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            {applications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSection('interviews')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'interviews'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-sky-600" />
          <span>Interviews Hub</span>
        </button>

        <button
          onClick={() => setActiveSection('offers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'offers'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          <span>Offers & Placements</span>
        </button>
      </div>

      {/* Section 1: Pipeline */}
      {activeSection === 'pipeline' && (
        <div className="space-y-6">
          <ApplicationTrackingHeader
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onExploreOpportunities={onExploreOpportunities || (() => {})}
            statusCounts={statusCounts}
            totalCount={applications.length}
          />

          {viewMode === 'timeline' ? (
            <ApplicationTimelineView
              applications={filteredApplications}
              onSelectApplication={handleSelectApp}
              onUpdateStatus={handleUpdateStatus}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          ) : (
            <ApplicationKanbanView
              applications={filteredApplications}
              onSelectApplication={handleSelectApp}
              onUpdateStatus={handleUpdateStatus}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          )}
        </div>
      )}

      {/* Section 2: Interviews Hub */}
      {activeSection === 'interviews' && (
        <StudentInterviewsTab onScheduleRefresh={loadApplications} />
      )}

      {/* Section 3: Offers & Placements */}
      {activeSection === 'offers' && (
        <StudentOffersTab onNavigateToPassport={onNavigateToPassport} />
      )}

      {/* Add Application Modal */}
      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddApplication={handleAddApplication}
      />

      {/* Application Details Drawer Modal */}
      <ApplicationDetailsDrawer
        isOpen={!!selectedAppForDrawer}
        onClose={() => setSelectedAppForDrawer(null)}
        application={selectedAppForDrawer}
        onUpdateStatus={handleUpdateStatus}
        onUpdateNotes={handleUpdateNotes}
        onWithdrawApplication={handleWithdrawApplication}
      />
    </div>
  );
};
