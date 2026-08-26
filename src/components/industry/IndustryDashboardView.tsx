import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createOpportunity } from '../../services/opportunityService';
import {
  INITIAL_INDUSTRY_JOBS,
  INITIAL_INDUSTRY_INTERNSHIPS,
  INITIAL_INDUSTRY_CANDIDATES,
  INITIAL_INDUSTRY_PROJECTS,
  INITIAL_INDUSTRY_WORKSHOPS
} from '../../data/industryData';
import {
  JobPosting,
  LiveProjectPosting,
  WorkshopPosting,
  IndustryCandidate
} from '../../types/industry';
import { IndustryHeader } from './IndustryHeader';
import { MetricsOverview } from './MetricsOverview';
import { CandidateList } from './CandidateList';
import { CandidateDetailModal } from './CandidateDetailModal';
import { ActiveListingsSection } from './ActiveListingsSection';
import { ApplicationsPipelineSection } from './ApplicationsPipelineSection';
import { ProjectsAndWorkshopsSection } from './ProjectsAndWorkshopsSection';
import { IndustryCollaborationsView } from './IndustryCollaborationsView';
import { IndustryInterventionParticipationView } from './IndustryInterventionParticipationView';
import { IndustryInternshipCohortView } from '../internship/IndustryInternshipCohortView';
import { IndustryLearningProgramsView } from './learning/IndustryLearningProgramsView';
import { PostJobModal } from './modals/PostJobModal';
import { PostInternshipModal } from './modals/PostInternshipModal';
import { CreateProjectModal } from './modals/CreateProjectModal';
import { CreateWorkshopModal } from './modals/CreateWorkshopModal';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  Users,
  Briefcase,
  GraduationCap,
  Star,
  FileSpreadsheet,
  FileCode2,
  Presentation,
  Plus,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp
} from 'lucide-react';

interface IndustryDashboardViewProps {
  initialTab?: string;
}

export const IndustryDashboardView: React.FC<IndustryDashboardViewProps> = ({
  initialTab = 'overview'
}) => {
  const { appUser, isAuthenticated, isDemo } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Core State
  const [jobs, setJobs] = useState<JobPosting[]>(INITIAL_INDUSTRY_JOBS);
  const [internships, setInternships] = useState<JobPosting[]>(INITIAL_INDUSTRY_INTERNSHIPS);
  const [candidates, setCandidates] = useState<IndustryCandidate[]>(INITIAL_INDUSTRY_CANDIDATES);
  const [projects, setProjects] = useState<LiveProjectPosting[]>(INITIAL_INDUSTRY_PROJECTS);
  const [workshops, setWorkshops] = useState<WorkshopPosting[]>(INITIAL_INDUSTRY_WORKSHOPS);

  // Modals state
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isPostInternshipOpen, setIsPostInternshipOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateWorkshopOpen, setIsCreateWorkshopOpen] = useState(false);

  // Selected candidate detail modal
  const [selectedCandidate, setSelectedCandidate] = useState<IndustryCandidate | null>(null);

  // Calculated Metrics
  const activeJobsCount = jobs.filter((j) => j.status === 'active').length;
  const activeInternshipsCount = internships.filter((i) => i.status === 'active').length;
  const totalApplicationsCount = candidates.length * 48; // Aggregate applicant volume
  const shortlistedCandidates = candidates.filter((c) => c.isShortlisted);
  const shortlistedCount = shortlistedCandidates.length;

  // Handlers
  const handleToggleShortlist = (candidateId: string) => {
    setCandidates((prev) =>
      prev.map((cand) =>
        cand.id === candidateId ? { ...cand, isShortlisted: !cand.isShortlisted } : cand
      )
    );
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate((prev) =>
        prev ? { ...prev, isShortlisted: !prev.isShortlisted } : null
      );
    }
  };

  const handleUpdateCandidateStatus = (
    candidateId: string,
    newStatus: NonNullable<IndustryCandidate['appliedFor']>['status']
  ) => {
    setCandidates((prev) =>
      prev.map((cand) => {
        if (cand.id === candidateId) {
          return {
            ...cand,
            appliedFor: cand.appliedFor
              ? { ...cand.appliedFor, status: newStatus }
              : undefined
          };
        }
        return cand;
      })
    );
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          appliedFor: prev.appliedFor ? { ...prev.appliedFor, status: newStatus } : undefined
        };
      });
    }
  };

  const handleAddJob = async (newJob: JobPosting) => {
    setJobs((prev) => [newJob, ...prev]);

    // Persist as opportunity record
    try {
      const postedBy = (isAuthenticated && !isDemo && appUser?.uid) ? appUser.uid : 'demo-industry-partner';
      await createOpportunity({
        title: newJob.title,
        companyName: appUser?.displayName || 'Enterprise Cloud Systems',
        companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
        opportunityType: 'Full-Time',
        description: newJob.description,
        location: newJob.location,
        workMode: newJob.workType || 'Hybrid',
        duration: 'Full-time',
        stipend: newJob.salaryOrStipend,
        applicationDeadline: '30 Days from now',
        requiredSkills: newJob.requiredSkills.map((s) => ({
          skillId: s.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          skillName: s,
          requiredLevel: 75,
          importance: 'required'
        })),
        preferredSkills: (newJob.preferredSkills || []).map((s) => ({
          skillId: s.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          skillName: s,
          requiredLevel: 65,
          importance: 'preferred'
        })),
        eligibility: 'B.Tech / MCA / Equivalent',
        experienceLevel: newJob.experienceLevel || 'Entry Level / 0-1 yrs',
        domain: newJob.department || 'Engineering',
        postedBy,
        institutionVisibility: ['all'],
        status: 'active'
      }, isDemo || !isAuthenticated);
    } catch (err) {
      console.warn('[IndustryDashboardView] Failed to persist job opportunity:', err);
    }
  };

  const handleAddInternship = async (newInternship: JobPosting) => {
    setInternships((prev) => [newInternship, ...prev]);

    // Persist as opportunity record
    try {
      const postedBy = (isAuthenticated && !isDemo && appUser?.uid) ? appUser.uid : 'demo-industry-partner';
      await createOpportunity({
        title: newInternship.title,
        companyName: appUser?.displayName || 'NextGen Tech Innovations',
        companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80',
        opportunityType: 'Internship',
        description: newInternship.description,
        location: newInternship.location,
        workMode: newInternship.workType || 'Hybrid',
        duration: '6 Months',
        stipend: newInternship.salaryOrStipend,
        applicationDeadline: '21 Days from now',
        requiredSkills: newInternship.requiredSkills.map((s) => ({
          skillId: s.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          skillName: s,
          requiredLevel: 70,
          importance: 'required'
        })),
        preferredSkills: (newInternship.preferredSkills || []).map((s) => ({
          skillId: s.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          skillName: s,
          requiredLevel: 60,
          importance: 'preferred'
        })),
        eligibility: 'Pre-final & Final Year Students',
        experienceLevel: newInternship.experienceLevel || 'Fresher / Student',
        domain: newInternship.department || 'Engineering',
        postedBy,
        institutionVisibility: ['all'],
        status: 'active'
      }, isDemo || !isAuthenticated);
    } catch (err) {
      console.warn('[IndustryDashboardView] Failed to persist internship opportunity:', err);
    }
  };

  const handleAddProject = (newProject: LiveProjectPosting) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const handleAddWorkshop = (newWorkshop: WorkshopPosting) => {
    setWorkshops((prev) => [newWorkshop, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Primary Industry Header Banner & Action Triggers */}
      <IndustryHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenPostJob={() => setIsPostJobOpen(true)}
        onOpenPostInternship={() => setIsPostInternshipOpen(true)}
        onOpenCreateProject={() => setIsCreateProjectOpen(true)}
        onOpenCreateWorkshop={() => setIsCreateWorkshopOpen(true)}
        shortlistedCount={shortlistedCount}
      />

      {/* 4 Key Display Metrics Cards */}
      <MetricsOverview
        activeJobsCount={activeJobsCount}
        activeInternshipsCount={activeInternshipsCount}
        totalApplicationsCount={totalApplicationsCount}
        shortlistedCount={shortlistedCount}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Tab 1: Overview Dashboard */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Action Cards Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setIsPostJobOpen(true)}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left hover:border-indigo-400 dark:hover:border-indigo-600 transition-all group shadow-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                <span>+ Post Job</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Full-Time Opening</div>
            </button>

            <button
              onClick={() => setIsPostInternshipOpen(true)}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left hover:border-emerald-400 dark:hover:border-emerald-600 transition-all group shadow-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                <span>+ Post Internship</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Paid 6-Mo Cohort</div>
            </button>

            <button
              onClick={() => setIsCreateProjectOpen(true)}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left hover:border-sky-400 dark:hover:border-sky-600 transition-all group shadow-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <FileCode2 className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                <span>+ Live Project</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Sponsor Grant / Bounty</div>
            </button>

            <button
              onClick={() => setIsCreateWorkshopOpen(true)}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left hover:border-amber-400 dark:hover:border-amber-600 transition-all group shadow-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Presentation className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                <span>+ Workshop</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Host Masterclass</div>
            </button>
          </div>

          {/* Section: Top Matched Candidates Showcase */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Top Matched Candidate Talent Pool
                </h2>
                <p className="text-xs text-slate-500">
                  Pre-screened candidates ranked by Match Score, verified Skills, GitHub Projects, and Certifications.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                rightIcon={ArrowRight}
                onClick={() => setActiveTab('candidates')}
                className="text-xs"
              >
                View All Talent ({candidates.length})
              </Button>
            </div>

            <CandidateList
              candidates={candidates}
              onToggleShortlist={handleToggleShortlist}
              onSelectCandidate={(cand) => setSelectedCandidate(cand)}
            />
          </div>

          {/* Section: Active Openings & Live Opportunities Preview */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Active Jobs & Internship Cohorts
                </h2>
                <p className="text-xs text-slate-500">
                  Live recruitment pipelines across Platform Engineering, AI Labs, and Cloud Infrastructure.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                rightIcon={ArrowRight}
                onClick={() => setActiveTab('jobs')}
                className="text-xs"
              >
                Manage All Openings
              </Button>
            </div>

            <ActiveListingsSection
              jobs={jobs.slice(0, 2)}
              internships={internships.slice(0, 2)}
              onOpenPostJob={() => setIsPostJobOpen(true)}
              onOpenPostInternship={() => setIsPostInternshipOpen(true)}
              onViewCandidatesForJob={() => setActiveTab('candidates')}
            />
          </div>
        </div>
      )}

      {/* Tab 2: Full Candidates List & Shortlist */}
      {activeTab === 'candidates' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Recruiter Candidate Database & Match Explorer
            </h2>
            <p className="text-xs text-slate-500">
              Filter by Match Score (&ge;90%, &ge;80%), verified skills, repository deliverables, and industry certifications.
            </p>
          </div>

          <CandidateList
            candidates={candidates}
            onToggleShortlist={handleToggleShortlist}
            onSelectCandidate={(cand) => setSelectedCandidate(cand)}
          />
        </div>
      )}

      {/* Tab: Academic Interventions & Mentorship Responsibilities (Phase 14D-B) */}
      {activeTab === 'interventions' && (
        <IndustryInterventionParticipationView
          industryId={appUser?.uid || 'ind_novacore'}
          industryName={appUser?.displayName || 'NovaCore Technologies Inc.'}
          isDemo={isDemo || !isAuthenticated}
        />
      )}

      {/* Tab: Faculty Collaborations Hub */}
      {activeTab === 'collaborations' && (
        <IndustryCollaborationsView
          industryId={appUser?.uid || 'ind_novacore'}
          industryName={appUser?.displayName || 'NovaCore Technologies Inc.'}
          isDemo={isDemo || !isAuthenticated}
        />
      )}

      {/* Tab: Industry Learning Programs & Skill Development */}
      {activeTab === 'learning_programs' && (
        <IndustryLearningProgramsView />
      )}

      {/* Tab: Intern Cohorts & Mentorship Hub */}
      {activeTab === 'cohorts' && (
        <IndustryInternshipCohortView />
      )}

      {/* Tab 3: Active Jobs & Internships */}
      {activeTab === 'jobs' || activeTab === 'internships' ? (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Active Job Openings & Internship Cohorts
            </h2>
            <p className="text-xs text-slate-500">
              Manage live job postings, applicant inflow, stipend tiers, and automated compatibility screening rules.
            </p>
          </div>

          <ActiveListingsSection
            jobs={jobs}
            internships={internships}
            onOpenPostJob={() => setIsPostJobOpen(true)}
            onOpenPostInternship={() => setIsPostInternshipOpen(true)}
            onViewCandidatesForJob={() => setActiveTab('candidates')}
          />
        </div>
      ) : null}

      {/* Tab 4: Applications ATS */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Applications Inflow & ATS Pipeline
            </h2>
            <p className="text-xs text-slate-500">
              Track candidate progression across application stages, review verified test submissions, and schedule live rounds.
            </p>
          </div>

          <ApplicationsPipelineSection
            candidates={candidates}
            onSelectCandidate={(cand) => setSelectedCandidate(cand)}
            onToggleShortlist={handleToggleShortlist}
            onUpdateStatus={handleUpdateCandidateStatus}
          />
        </div>
      )}

      {/* Tab 5: Live Projects & Workshops */}
      {activeTab === 'projects_workshops' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Industry Live Projects & Campus Masterclasses
            </h2>
            <p className="text-xs text-slate-500">
              Sponsor engineering challenge bounties and schedule technical masterclasses to engage prospective graduates.
            </p>
          </div>

          <ProjectsAndWorkshopsSection
            projects={projects}
            workshops={workshops}
            onOpenCreateProject={() => setIsCreateProjectOpen(true)}
            onOpenCreateWorkshop={() => setIsCreateWorkshopOpen(true)}
          />
        </div>
      )}

      {/* Action Modals */}
      <PostJobModal
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
        onPostJob={handleAddJob}
      />

      <PostInternshipModal
        isOpen={isPostInternshipOpen}
        onClose={() => setIsPostInternshipOpen(false)}
        onPostInternship={handleAddInternship}
      />

      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onCreateProject={handleAddProject}
      />

      <CreateWorkshopModal
        isOpen={isCreateWorkshopOpen}
        onClose={() => setIsCreateWorkshopOpen(false)}
        onCreateWorkshop={handleAddWorkshop}
      />

      {/* Candidate Detailed Audit & Interview Modal */}
      <CandidateDetailModal
        candidate={selectedCandidate}
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onToggleShortlist={handleToggleShortlist}
        onUpdateStatus={handleUpdateCandidateStatus}
      />
    </div>
  );
};
