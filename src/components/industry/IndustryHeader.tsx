import React from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Building2,
  Briefcase,
  GraduationCap,
  FileCode2,
  Presentation,
  Plus,
  Users,
  Star,
  ShieldCheck,
  Sparkles,
  LayoutDashboard,
  FileSpreadsheet,
  Zap
} from 'lucide-react';

interface IndustryHeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenPostJob: () => void;
  onOpenPostInternship: () => void;
  onOpenCreateProject: () => void;
  onOpenCreateWorkshop: () => void;
  shortlistedCount: number;
}

export const IndustryHeader: React.FC<IndustryHeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenPostJob,
  onOpenPostInternship,
  onOpenCreateProject,
  onOpenCreateWorkshop,
  shortlistedCount
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'interventions', label: 'Academic Interventions', icon: Zap, badge: 'Mentorship' },
    { id: 'collaborations', label: 'Faculty Collaborations Hub', icon: Building2, badge: '14D-A' },
    { id: 'candidates', label: `Candidates & Talent Pool`, icon: Users, badge: shortlistedCount > 0 ? `${shortlistedCount} starred` : undefined },
    { id: 'jobs', label: 'Active Jobs & Internships', icon: Briefcase },
    { id: 'applications', label: 'Applications ATS', icon: FileSpreadsheet },
    { id: 'projects_workshops', label: 'Live Projects & Workshops', icon: FileCode2 }
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner & Quick Action Buttons */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-white">
                <Building2 className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    NovaCore Technologies
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    Verified Industry Partner
                  </span>
                </div>
                <p className="text-xs text-indigo-200/80">
                  Talent Acquisition, Campus Co-Ops & Industry Problem Statements
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Trigger Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={Briefcase}
              onClick={onOpenPostJob}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs shadow-xs"
            >
              Post Job
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={GraduationCap}
              onClick={onOpenPostInternship}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs shadow-xs"
            >
              Post Internship
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={FileCode2}
              onClick={onOpenCreateProject}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs shadow-xs"
            >
              Create Live Project
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={Presentation}
              onClick={onOpenCreateWorkshop}
              className="bg-indigo-600 hover:bg-indigo-500 text-white border-transparent text-xs shadow-md"
            >
              Create Workshop
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-1 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-indigo-800 text-white' : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
