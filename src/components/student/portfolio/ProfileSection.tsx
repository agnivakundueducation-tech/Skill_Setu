import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { StudentProfileData } from '../../../types/student';
import {
  User,
  Target,
  Sparkles,
  Award,
  Zap,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Code2
} from 'lucide-react';

interface ProfileSectionProps {
  profile: StudentProfileData;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ profile }) => {
  return (
    <div id="profile" className="space-y-6">
      {/* Key Metric Highlights Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {profile.keyStats.map((stat, idx) => (
          <Card
            key={idx}
            variant="default"
            className="p-4 border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
          >
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {stat.label}
            </div>
            <div className="my-2">
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                {stat.value}
              </div>
              <div className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                {stat.subtext}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bio & Candidate Fitment Overview */}
      <Card variant="default" className="border-slate-200/80 dark:border-slate-800">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base">Executive Profile & Engineering Focus</CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified candidate telemetry and career trajectory
              </p>
            </div>
          </div>
          <Badge variant="primary" size="sm">
            Recruiter Verified
          </Badge>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Main Bio Text */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Professional Summary
            </h4>
            <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
              {profile.bio}
            </p>
          </div>

          {/* Specialization & Target Role Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                <Target className="w-4 h-4" />
                <span>Primary Target Role</span>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {profile.targetRole}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Specialized in distributed caching (Redis/Kafka), concurrent microservices in Go & TypeScript, and accessible React UI architectures.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Recruiter Fit Highlights</span>
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Immediate availability for 6-month internships or full-time roles</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Proven sub-10ms distributed systems capstone architecture</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Top 1.8% LeetCode Knight ranking & 3x hackathon winner</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
