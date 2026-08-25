import React, { useState, useEffect } from 'react';
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
  Layers
} from 'lucide-react';

interface AcademicianDashboardViewProps {
  userUid?: string;
  isDemo?: boolean;
}

export const AcademicianDashboardView: React.FC<AcademicianDashboardViewProps> = ({
  userUid = 'demo_academician_01',
  isDemo = true
}) => {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'recommended' | 'my-collaborations' | 'profile'>('marketplace');
  const [collaborations, setCollaborations] = useState<CollaborationOpportunity[]>([]);
  const [facultyProfile, setFacultyProfile] = useState<FacultyProfile | null>(null);
  const [applications, setApplications] = useState<CollaborationApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
            onClick={() => setActiveTab('marketplace')}
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
            onClick={() => setActiveTab('my-collaborations')}
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
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Faculty Passport</span>
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
    </div>
  );
};
