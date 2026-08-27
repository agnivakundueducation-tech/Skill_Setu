import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
  Briefcase,
  GraduationCap,
  FileSpreadsheet,
  Star,
  ArrowUpRight,
  TrendingUp,
  Users,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface MetricsOverviewProps {
  activeJobsCount: number;
  activeInternshipsCount: number;
  totalApplicationsCount: number;
  shortlistedCount: number;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  activeJobsCount,
  activeInternshipsCount,
  totalApplicationsCount,
  shortlistedCount,
  activeTab,
  onSelectTab
}) => {
  const metricCards = [
    {
      id: 'jobs',
      title: 'Active Jobs',
      value: activeJobsCount,
      subtext: '4 Departments • 11 Open Slots',
      change: '+2 this week',
      isPositive: true,
      icon: Briefcase,
      color: 'indigo',
      badge: 'Full-Time Roles',
      targetTab: 'jobs'
    },
    {
      id: 'internships',
      title: 'Active Internships',
      value: activeInternshipsCount,
      subtext: '14 Cohort Slots • 6-mo PPO',
      change: '+1 new program',
      isPositive: true,
      icon: GraduationCap,
      color: 'emerald',
      badge: 'Paid Cohorts',
      targetTab: 'internships'
    },
    {
      id: 'applications',
      title: 'Applications',
      value: totalApplicationsCount,
      subtext: '34 Under Review • 18 New',
      change: '+24% inflow',
      isPositive: true,
      icon: FileSpreadsheet,
      color: 'sky',
      badge: 'Live ATS Inflow',
      targetTab: 'applications'
    },
    {
      id: 'shortlisted',
      title: 'Shortlisted Candidates',
      value: shortlistedCount,
      subtext: 'Avg Match Score 93.4%',
      change: '6 Interviews Queued',
      isPositive: true,
      icon: Star,
      color: 'amber',
      badge: 'Top Tier Talent',
      targetTab: 'candidates'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeTab === card.targetTab;

        return (
          <Card
            key={card.id}
            variant="default"
            onClick={() => onSelectTab(card.targetTab)}
            className={`p-5 flex flex-col justify-between cursor-pointer transition-all border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md ${
              isSelected
                ? 'ring-2 ring-indigo-500/50 bg-indigo-50/20 dark:bg-indigo-950/20'
                : 'shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {card.title}
                </span>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    card.color === 'indigo'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                      : card.color === 'emerald'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      : card.color === 'sky'
                      ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {card.value}
                </div>
                <Badge
                  variant={card.color === 'amber' ? 'warning' : 'primary'}
                  size="sm"
                  className="text-[10px]"
                >
                  {card.badge}
                </Badge>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {card.subtext}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {card.change}
              </span>

              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                View & Manage →
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
