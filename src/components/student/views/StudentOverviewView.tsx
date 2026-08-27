import React, { useState, useEffect, useCallback } from 'react';
import { ReadinessScoreCard } from '../ReadinessScoreCard';
import { OpportunitiesCard } from '../OpportunitiesCard';
import { ApplicationsCard } from '../ApplicationsCard';
import { ProjectsCard } from '../ProjectsCard';
import { ReadinessTrendChart } from '../ReadinessTrendChart';
import { SkillDnaRadarChart } from '../SkillDnaRadarChart';
import { SkillsAssessedSection } from '../SkillsAssessedSection';
import { ActiveApplicationsSection } from '../ActiveApplicationsSection';
import { CertificationsSection } from '../CertificationsSection';
import { InDemandSkillsSection } from '../InDemandSkillsSection';
import { CareerCoachSection } from '../CareerCoachSection';
import { Card, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { STUDENT_READINESS_DATA } from '../../../data/studentData';
import { ActiveApplication, Certification } from '../../../types/student';
import { useAuth } from '../../../context/AuthContext';
import {
  firestoreService,
  PersistedSkillProfile,
  StudentFirestoreProfile
} from '../../../services';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Target,
  Send,
  Briefcase,
  Layers,
  Compass,
  GitCompare,
  AlertTriangle,
  MapPin,
  Clock,
  Brain
} from 'lucide-react';

interface StudentOverviewViewProps {
  onNavigateTab: (tab: string) => void;
  onTakeAssessment: (skillName?: string) => void;
  onSelectApplication: (app: ActiveApplication) => void;
  onSelectCertification: (cert: Certification) => void;
  onSelectOpportunity: (oppId: string) => void;
}

export const StudentOverviewView: React.FC<StudentOverviewViewProps> = ({
  onNavigateTab,
  onTakeAssessment,
  onSelectApplication,
  onSelectCertification,
  onSelectOpportunity
}) => {
  const { appUser, isAuthenticated, isDemo } = useAuth();
  const [skillProfile, setSkillProfile] = useState<PersistedSkillProfile | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentFirestoreProfile | null>(null);
  const [hasAssessed, setHasAssessed] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    if (isAuthenticated && !isDemo && appUser?.uid) {
      try {
        const [profileRes, studentRes] = await Promise.all([
          firestoreService.getSkillProfile(appUser.uid),
          firestoreService.getStudentProfile(appUser.uid)
        ]);

        if (profileRes.success && profileRes.data) {
          setSkillProfile(profileRes.data);
          setHasAssessed(true);
        } else {
          // Check localStorage fallback
          const raw = localStorage.getItem(`skillsetu_skill_profile_${appUser.uid}`);
          if (raw) {
            try {
              setSkillProfile(JSON.parse(raw));
              setHasAssessed(true);
            } catch {
              setHasAssessed(false);
            }
          } else {
            setHasAssessed(false);
          }
        }

        if (studentRes.success && studentRes.data) {
          setStudentProfile(studentRes.data);
        }
      } catch (err) {
        console.error('Failed to load overview data from Firestore:', err);
      }
    } else {
      setHasAssessed(true);
      setSkillProfile(null);
    }
  }, [isAuthenticated, isDemo, appUser?.uid]);

  useEffect(() => {
    loadData();
    const handleStorage = () => loadData();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [loadData]);

  const defaultReadiness = STUDENT_READINESS_DATA;
  const currentReadiness = (isAuthenticated && !isDemo && skillProfile)
    ? skillProfile.overallReadiness
    : defaultReadiness.overallScore;

  const criticalGapsCount = (isAuthenticated && !isDemo && skillProfile)
    ? skillProfile.criticalGapsCount
    : 2;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Four Key Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReadinessScoreCard
          overallScore={currentReadiness}
          isAssessed={isAuthenticated && !isDemo ? hasAssessed : true}
          targetRole={studentProfile?.careerGoal || (skillProfile ? 'Assessed Engineering Track' : undefined)}
          onTakeAssessment={() => onTakeAssessment()}
          onViewDetails={() => onNavigateTab('skill-dna')}
        />
        <OpportunitiesCard
          onViewAll={() => onNavigateTab('opportunities')}
          onSelectOpportunity={onSelectOpportunity}
        />
        <ApplicationsCard
          onViewAll={() => onNavigateTab('applications')}
          onSelectApplication={(id) => onNavigateTab('applications')}
        />
        <ProjectsCard
          onViewAll={() => onNavigateTab('portfolio')}
        />
      </div>

      {/* 1.5. Skill Gap Urgent Action Banner */}
      <Card
        variant="default"
        className="p-4 sm:p-5 border-rose-200/80 dark:border-rose-900/50 bg-gradient-to-r from-rose-50/70 via-white to-amber-50/50 dark:from-rose-950/30 dark:via-slate-900 dark:to-amber-950/20 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold shrink-0 border border-rose-200 dark:border-rose-800">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                  Target Role Gap Alert
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                  {criticalGapsCount} Critical Red Gaps
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Cloud Computing & Cybersecurity require certification & project evidence to reach Tier-1 benchmark.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            rightIcon={ArrowRight}
            className="text-xs whitespace-nowrap bg-rose-600 hover:bg-rose-700 text-white self-stretch sm:self-center"
            onClick={() => onNavigateTab('skill-gap')}
          >
            Open Skill Gap Analysis
          </Button>
        </div>
      </Card>

      {/* 1.6. Setu AI Career Coach Action Plan */}
      <CareerCoachSection
        onNavigateTab={onNavigateTab}
        onTakeAssessment={onTakeAssessment}
      />

      {/* 1.8. AI Career Roadmap Preview Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-700/50 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                <Sparkles className="w-3 h-3 text-amber-300" />
                AI Career Roadmap
              </span>
              <span className="text-xs text-indigo-300">•</span>
              <span className="text-xs text-indigo-300">Goal: <strong>Software Engineer</strong></span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              From 78% Current Readiness → 98% Job-Ready in 5 Phases
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-indigo-200">
              <span className="flex items-center gap-1 font-medium bg-indigo-800/40 px-2 py-0.5 rounded border border-indigo-700/50">
                P1: Improve DSA (+5%)
              </span>
              <span className="text-indigo-400">→</span>
              <span className="flex items-center gap-1 font-medium bg-indigo-800/40 px-2 py-0.5 rounded border border-indigo-700/50">
                P2: Build React Project (+4%)
              </span>
              <span className="text-indigo-400">→</span>
              <span className="flex items-center gap-1 font-medium bg-indigo-800/40 px-2 py-0.5 rounded border border-indigo-700/50">
                P3: Learn Cloud Deployment (+4%)
              </span>
              <span className="text-indigo-400">→</span>
              <span className="flex items-center gap-1 font-medium bg-indigo-800/40 px-2 py-0.5 rounded border border-indigo-700/50">
                P4: Industry Project (+4%)
              </span>
              <span className="text-indigo-400">→</span>
              <span className="flex items-center gap-1 font-medium bg-indigo-800/40 px-2 py-0.5 rounded border border-indigo-700/50">
                P5: Apply for Internship (+3%)
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('career-roadmap')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 self-start lg:self-center"
          >
            <span>Open AI Career Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1.9. In-Demand Skills in Industry Live Signals */}
      <InDemandSkillsSection
        onTakeAssessment={(skill) => onTakeAssessment(skill)}
        onExploreOpportunities={() => onNavigateTab('opportunities')}
        onNavigateRoadmap={() => onNavigateTab('career-roadmap')}
      />

      {/* 2. Primary Analytics Dual-Chart Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card variant="default" className="lg:col-span-7 p-6 border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <ReadinessTrendChart height={280} />
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Historical percentile growth: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">+18.5% over 6 months</strong></span>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-indigo-600 dark:text-indigo-400 p-0 h-auto font-semibold"
              rightIcon={ArrowRight}
              onClick={() => onNavigateTab('skill-dna')}
            >
              Analyze Skill DNA
            </Button>
          </div>
        </Card>

        <Card variant="default" className="lg:col-span-5 p-6 border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <SkillDnaRadarChart height={280} />
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Target Role: <strong className="text-slate-800 dark:text-slate-200">{defaultReadiness.targetRoleMatch}% Match</strong></span>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-indigo-600 dark:text-indigo-400 p-0 h-auto font-semibold"
              rightIcon={ArrowRight}
              onClick={() => onNavigateTab('assessment')}
            >
              Take Assessment
            </Button>
          </div>
        </Card>
      </div>

      {/* 3. Skills Assessed Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Skills Assessed
            </h3>
            <p className="text-xs text-slate-500">
              Verified competencies verified via AI proctoring and industry benchmarks
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            rightIcon={ArrowRight}
            onClick={() => onNavigateTab('assessment')}
          >
            Assessment Center
          </Button>
        </div>

        <SkillsAssessedSection onTakeAssessment={onTakeAssessment} />
      </div>

      {/* 4. Active Applications Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Active Applications
            </h3>
            <p className="text-xs text-slate-500">
              Direct pipeline status across hiring partners and summer micro-internships
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            rightIcon={ArrowRight}
            onClick={() => onNavigateTab('applications')}
          >
            Manage Pipeline
          </Button>
        </div>

        <ActiveApplicationsSection
          onSelectApplication={onSelectApplication}
          onExploreOpportunities={() => onNavigateTab('opportunities')}
        />
      </div>

      {/* 5. Certifications Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              Certifications & Credentials
            </h3>
            <p className="text-xs text-slate-500">
              Blockchain-backed micro-credentials and accredited certificates
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            rightIcon={ArrowRight}
            onClick={() => onNavigateTab('portfolio')}
          >
            View Full Passport
          </Button>
        </div>

        <CertificationsSection onViewCertificate={onSelectCertification} />
      </div>
    </div>
  );
};
