import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { InstitutionCollaborationAnalytics } from '../../types/collaboration';
import { collaborationService } from '../../services/collaborationService';
import {
  Building2,
  Users,
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  BarChart3,
  TrendingUp,
  Cpu,
  Flame,
  ShieldCheck,
  Briefcase,
  FileText,
  CheckCircle2
} from 'lucide-react';

interface InstitutionCollaborationAnalyticsViewProps {
  institutionId?: string;
  isDemo?: boolean;
}

export const InstitutionCollaborationAnalyticsView: React.FC<InstitutionCollaborationAnalyticsViewProps> = ({
  institutionId = 'inst_nit',
  isDemo = true
}) => {
  const [analytics, setAnalytics] = useState<InstitutionCollaborationAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      const res = await collaborationService.getInstitutionCollaborationAnalytics(institutionId, isDemo);
      if (res.success && res.data) {
        setAnalytics(res.data);
      }
      setIsLoading(false);
    };
    fetchAnalytics();
  }, [institutionId, isDemo]);

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-indigo-500/30 text-indigo-200 border border-indigo-500/40">
              Institutional Intelligence & Accreditation
            </span>
            <span className="text-xs text-slate-400">• NAAC / NIRF / NBA Alignment</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">
            Academia–Industry Collaboration & Faculty Immersion Analytics
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
            Holistic, privacy-preserving analytics tracking faculty industry internships, joint R&D grants, FDP attendance, and verified capstone engagement across departments.
          </p>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="default" className="p-4 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Collaborations</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{analytics.activeCollaborations}</div>
          <span className="text-[11px] text-slate-500">Across 8 departments</span>
        </Card>

        <Card variant="default" className="p-4 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Faculty Participated</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{analytics.facultyParticipation}</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Verified in Passports</span>
        </Card>

        <Card variant="default" className="p-4 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Industry Partners</span>
          <div className="text-2xl font-black text-sky-600 dark:text-sky-400">{analytics.industryPartners}</div>
          <span className="text-[11px] text-slate-500">Tier-1 & Frontier Tech</span>
        </Card>

        <Card variant="default" className="p-4 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed & Certified</span>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{analytics.completedCollaborations}</div>
          <span className="text-[11px] text-indigo-500 font-medium">Formal outcome records</span>
        </Card>
      </div>

      {/* 4 Program Category Quick Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>Research & Grants</span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{analytics.researchCollaborations} Programs</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>FDP Attendance</span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{analytics.fdpParticipation} Hours / Faculty</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <GraduationCap className="w-4 h-4 text-amber-600" />
            <span>Guest Keynotes</span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{analytics.guestLectures} Keynotes</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Flame className="w-4 h-4 text-rose-600" />
            <span>Live Capstones</span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{analytics.liveProjects} Spon. Projects</div>
        </div>
      </div>

      {/* Deep Dives: Department Breakdown & Partner Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Department Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          <Card variant="default" className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <span>Faculty Industry Engagement by Department</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Progression towards institutional accreditation benchmarks
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              {analytics.departmentBreakdown.map((dept) => (
                <div key={dept.department} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{dept.department}</span>
                    <span className="text-slate-500">
                      <strong>{dept.count}</strong> Active • <strong>{dept.completed}</strong> Completed
                    </span>
                  </div>
                  <ProgressBar value={dept.count * 6} max={100} color="indigo" size="sm" />
                </div>
              ))}
            </div>
          </Card>

          {/* Top Partner Industries */}
          <Card variant="default" className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-600" />
              <span>Leading Enterprise & Industry Partners</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {analytics.topPartnerIndustries.map((partner) => (
                <div
                  key={partner.name}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs flex items-center justify-between"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{partner.name}</span>
                  <Badge variant="indigo" size="sm">{partner.count}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 5 Cols: Impact Metrics & Verified Skill Acquisition */}
        <div className="lg:col-span-5 space-y-4">
          <Card
            variant="default"
            className="p-5 rounded-2xl border-indigo-100 dark:border-indigo-950/80 bg-gradient-to-b from-indigo-50/30 to-transparent dark:from-indigo-950/20 space-y-4"
          >
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Aggregated Institutional Impact</span>
              </h3>
              <p className="text-xs text-slate-500">
                Verified outputs generated through industry immersions
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">Co-Authored Research Papers</span>
                <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                  {analytics.impactMetrics.researchOutputsCount} Publications
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">Faculty Certifications Issued</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  {analytics.impactMetrics.certificationsIssued} Issued
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400">Undergraduate Students Benefited</span>
                <span className="text-sm font-black text-sky-600 dark:text-sky-400">
                  {analytics.impactMetrics.studentInvolvementCount} Cohorts
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Top Emerging Skills Acquired by Faculty
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analytics.impactMetrics.skillsDeveloped.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
