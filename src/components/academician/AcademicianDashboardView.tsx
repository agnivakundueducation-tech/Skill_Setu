import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  CollaborationOpportunity,
  FacultyProfile,
  CollaborationApplication,
  CollaborationProposal,
  CollaborationMatchResult
} from '../../types/collaboration';
import { collaborationService } from '../../services/collaborationService';
import { CollaborationMarketplaceView } from './CollaborationMarketplaceView';
import { MyCollaborationsView } from './MyCollaborationsView';
import { FacultyProfileView } from './FacultyProfileView';
import {
  Building2,
  Sparkles,
  Compass,
  FileText,
  User,
  ShieldCheck,
  BookOpen,
  Flame,
  GraduationCap,
  Users,
  Award,
  Layers,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sliders,
  TrendingUp
} from 'lucide-react';

interface AcademicianDashboardViewProps {
  userUid?: string;
  isDemo?: boolean;
}

export const AcademicianDashboardView: React.FC<AcademicianDashboardViewProps> = ({
  userUid = 'demo_academician_01',
  isDemo = true
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromPath = (): 'marketplace' | 'my-collaborations' | 'profile' | 'curriculum' | 'cohorts' => {
    const path = location.pathname;
    if (path.includes('/my-collaborations') || path.includes('/proposals')) return 'my-collaborations';
    if (path.includes('/passport') || path.includes('/profile')) return 'profile';
    if (path.includes('/curriculum')) return 'curriculum';
    if (path.includes('/cohorts')) return 'cohorts';
    return 'marketplace';
  };

  const [activeTab, setActiveTab] = useState<'marketplace' | 'my-collaborations' | 'profile' | 'curriculum' | 'cohorts'>(getTabFromPath());
  const [collaborations, setCollaborations] = useState<CollaborationOpportunity[]>([]);
  const [facultyProfile, setFacultyProfile] = useState<FacultyProfile | null>(null);
  const [applications, setApplications] = useState<CollaborationApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const handleTabChange = (tab: 'marketplace' | 'my-collaborations' | 'profile' | 'curriculum' | 'cohorts') => {
    setActiveTab(tab);
    if (tab === 'marketplace') {
      navigate('/dashboard/academician');
    } else if (tab === 'profile') {
      navigate('/dashboard/academician/passport');
    } else {
      navigate(`/dashboard/academician/${tab}`);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [collabRes, profileRes, appsRes] = await Promise.all([
        collaborationService.getCollaborations({ isDemo }),
        collaborationService.getAcademicianProfile(userUid, isDemo),
        collaborationService.getApplicationsForAcademician(userUid, isDemo)
      ]);

      if (collabRes.success) setCollaborations(collabRes.data);
      if (profileRes.success) setFacultyProfile(profileRes.data);
      if (appsRes.success) setApplications(appsRes.data);
    } catch (err) {
      console.error('Failed to load academician collaboration hub data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userUid, isDemo]);

  const handleSubmitApplication = async (
    collaboration: CollaborationOpportunity,
    proposal: CollaborationProposal,
    matchResult: CollaborationMatchResult
  ) => {
    if (!facultyProfile) return { success: false, error: 'Faculty profile not loaded.' };

    const res = await collaborationService.submitCollaborationApplication(
      {
        collaborationId: collaboration.collaborationId,
        collaborationTitle: collaboration.title,
        collaborationType: collaboration.collaborationType,
        academicianId: facultyProfile.uid,
        academicianName: facultyProfile.fullName,
        academicianEmail: facultyProfile.email,
        academicianInstitution: facultyProfile.institution,
        academicianDepartment: facultyProfile.department,
        academicianDesignation: facultyProfile.designation,
        industryId: collaboration.industryId,
        industryName: collaboration.industryName,
        proposal,
        expertise: facultyProfile.expertise || [],
        matchScoreAtApplication: matchResult.overallMatch,
        matchExplanation: matchResult.explanation,
        status: 'Submitted'
      },
      isDemo
    );

    if (res.success && res.data) {
      setApplications([res.data, ...applications]);
      return { success: true };
    }
    return { success: false, error: res.error || 'Failed to submit proposal.' };
  };

  const handleWithdrawApplication = async (applicationId: string) => {
    const res = await collaborationService.withdrawApplication(applicationId, isDemo);
    if (res.success) {
      setApplications(apps =>
        apps.map(a => (a.applicationId === applicationId ? { ...a, status: 'Withdrawn' } : a))
      );
    }
    return res;
  };

  const handleUpdateProfile = async (updates: Partial<FacultyProfile>) => {
    if (!facultyProfile) return { success: false };
    const res = await collaborationService.updateAcademicianProfile(facultyProfile.uid, updates, isDemo);
    if (res.success && res.data) {
      setFacultyProfile(res.data);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const appliedCollaborationIds = applications
    .filter(a => a.status !== 'Withdrawn' && a.status !== 'Rejected')
    .map(a => a.collaborationId);

  return (
    <div className="space-y-6">
      {/* Top Level Nav Sub-header for Academician */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Academia–Industry Collaboration Hub</span>
              <Badge variant="indigo" size="sm">Phase 14D-A</Badge>
            </h1>
            <p className="text-xs text-slate-500">
              Verified faculty engagement, sponsored research, FDPs, and verified passport
            </p>
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 self-stretch sm:self-auto overflow-x-auto">
          <button
            onClick={() => handleTabChange('marketplace')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'marketplace'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Collaboration Hub</span>
          </button>

          <button
            onClick={() => handleTabChange('my-collaborations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'my-collaborations'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>My Collaborations</span>
            {applications.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-[10px] flex items-center justify-center font-bold">
                {applications.length}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabChange('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Faculty Passport</span>
          </button>

          <button
            onClick={() => handleTabChange('curriculum')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'curriculum'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curriculum Co-Design</span>
          </button>

          <button
            onClick={() => handleTabChange('cohorts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'cohorts'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Cohort Interventions</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'marketplace' && (
        <CollaborationMarketplaceView
          collaborations={collaborations}
          facultyProfile={facultyProfile}
          appliedCollaborationIds={appliedCollaborationIds}
          onSubmitApplication={handleSubmitApplication}
          onRefresh={loadData}
          isLoading={isLoading}
        />
      )}

      {activeTab === 'my-collaborations' && (
        <MyCollaborationsView
          applications={applications}
          onWithdrawApplication={handleWithdrawApplication}
          onRefresh={loadData}
          isLoading={isLoading}
        />
      )}

      {activeTab === 'profile' && facultyProfile && (
        <FacultyProfileView
          profile={facultyProfile}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-linear-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="indigo" size="sm">v2.4 Industry Calibrated</Badge>
                <span className="text-xs text-indigo-200">OBE & NAAC Compliant</span>
              </div>
              <h2 className="text-xl font-bold text-white">Curriculum Co-Design & Syllabus Calibration</h2>
              <p className="text-xs text-indigo-200/80 mt-1 max-w-2xl">
                Collaboratively update department coursework with real-time enterprise skill demands and industry benchmark micro-credentials.
              </p>
            </div>
            <Button
              variant="accent"
              size="sm"
              leftIcon={Sparkles}
              onClick={() => handleTabChange('marketplace')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              Find Industry Co-Designers
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="primary" size="sm">CSE-402</Badge>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">92% Industry Match</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Distributed Cloud Systems & Microservices</h3>
              <p className="text-xs text-slate-500">Co-designed with Amazon Web Services & Google Cloud partner mentors.</p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">4 Credits (3L + 1P)</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">Active Syllabus</span>
              </div>
            </Card>

            <Card className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="primary" size="sm">AIML-301</Badge>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">78% Match (Review Pending)</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Production LLMs & Antigravity Agent Workflows</h3>
              <p className="text-xs text-slate-500">Proposed module integrating Gemini 2.5 Flash SDK and RAG architectures.</p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">3 Credits (Theory + Lab)</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">BOS Review: March 2026</span>
              </div>
            </Card>

            <Card className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="primary" size="sm">CYBER-504</Badge>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">95% Industry Match</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Zero Trust Architecture & Enterprise IAM</h3>
              <p className="text-xs text-slate-500">Hands-on lab modules with SOC2 compliance and automated pentesting.</p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">4 Credits</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Certified by Palo Alto</span>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'cohorts' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="emerald" size="sm">Spring 2026 Live Cohort</Badge>
                <span className="text-xs text-emerald-300">Continuous Assessment</span>
              </div>
              <h2 className="text-xl font-bold text-white">Student Cohort Performance & Active Interventions</h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Track assigned mentees, evaluate capstone evidence artifacts, and dispatch micro-interventions to bridge competency gaps.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={Users}
              className="bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              Export Mentor Report
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 rounded-2xl text-center border-slate-200/80 dark:border-slate-800">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">42</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Assigned Student Mentees</div>
            </Card>
            <Card className="p-4 rounded-2xl text-center border-slate-200/80 dark:border-slate-800">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">89.4%</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Average Readiness Score</div>
            </Card>
            <Card className="p-4 rounded-2xl text-center border-slate-200/80 dark:border-slate-800">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">6</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Pending Capstone Reviews</div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};


