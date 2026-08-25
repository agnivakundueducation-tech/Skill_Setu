import React, { useState, useEffect, useCallback } from 'react';
import { ActiveApplication, ApplicationStatus } from '../../../types/student';
import { STUDENT_ACTIVE_APPLICATIONS } from '../../../data/studentData';
import { ApplicationTrackingHeader } from '../tracking/ApplicationTrackingHeader';
import { ApplicationTimelineView } from '../tracking/ApplicationTimelineView';
import { ApplicationKanbanView } from '../tracking/ApplicationKanbanView';
import { AddApplicationModal } from '../tracking/AddApplicationModal';
import { ApplicationDetailsDrawer } from '../tracking/ApplicationDetailsDrawer';
import { useAuth } from '../../../context/AuthContext';
import {
  getStudentApplications,
  withdrawApplication,
  updateApplicationStatus
} from '../../../services/applicationService';
import { ApplicationRecord } from '../../../types/application';

interface ApplicationsViewProps {
  onSelectApplication?: (app: ActiveApplication) => void;
  onExploreOpportunities?: () => void;
}

const STORAGE_KEY = 'skillsetu_student_applications_v2';

function mapRecordToActiveApp(rec: ApplicationRecord): ActiveApplication {
  const stageMapping: Record<string, ApplicationStatus> = {
    'Applied': 'Applied',
    'Under Review': 'Shortlisted',
    'Shortlisted': 'Shortlisted',
    'Interview': 'Interview',
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
    status: rec.status === 'Selected' ? 'offer' : rec.status === 'Rejected' || rec.status === 'Withdrawn' ? 'rejected' : 'active',
    nextStepTitle: rec.status === 'Withdrawn' ? 'Application Withdrawn' : 'Recruiter Profile Review',
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
        title: rec.status === 'Withdrawn' ? 'Application Withdrawn' : `Status Updated to ${rec.status}`,
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
  onExploreOpportunities
}) => {
  const { appUser, isAuthenticated, isDemo } = useAuth();
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
    const studentId = (isAuthenticated && !isDemo && appUser?.uid) ? appUser.uid : 'demo-student-id';
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
    const studentId = (isAuthenticated && !isDemo && appUser?.uid) ? appUser.uid : 'demo-student-id';
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
      {/* Application Tracking Header & Toolbar */}
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

      {/* Main Views: Timeline View vs Kanban View */}
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
