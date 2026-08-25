import React from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Landmark,
  ShieldCheck,
  Download,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  LayoutDashboard,
  BarChart3,
  Grid3X3,
  Lightbulb,
  TrendingUp,
  Filter,
  Calendar,
  CheckCircle2,
  Building2,
  Zap
} from 'lucide-react';

interface InstitutionHeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  selectedCohort: string;
  onChangeCohort: (cohort: string) => void;
  selectedDepartment: string;
  onChangeDepartment: (dept: string) => void;
  onExportReport: () => void;
  onTriggerAiAudit: () => void;
  isAiAuditing: boolean;
}

export const InstitutionHeader: React.FC<InstitutionHeaderProps> = ({
  activeTab,
  onSelectTab,
  selectedCohort,
  onChangeCohort,
  selectedDepartment,
  onChangeDepartment,
  onExportReport,
  onTriggerAiAudit,
  isAiAuditing
}) => {
  const tabs = [
    { id: 'command_center', label: 'Command Center Overview', icon: LayoutDashboard },
    { id: 'intervention_center', label: 'Intervention Engine', icon: Zap, badge: 'Closed-Loop' },
    { id: 'collaboration_analytics', label: 'Faculty & Industry R&D', icon: Building2, badge: '14D-A' },
    { id: 'demand_readiness', label: 'Demand vs Readiness Analytics', icon: BarChart3, badge: '5 Core Skills' },
    { id: 'skill_heatmaps', label: 'Competency Heatmaps', icon: Grid3X3 },
    { id: 'ai_recommendations', label: 'AI Curriculum Recommendations', icon: Lightbulb, badge: 'AI Engine' },
    { id: 'placement_analytics', label: 'Placement & Internships Funnel', icon: TrendingUp }
  ];

  return (
    <div className="space-y-4">
      {/* Institutional Top Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-slate-900 via-amber-950/70 to-slate-900 text-white shadow-xl relative overflow-hidden border border-amber-500/20">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-inner">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    Apex Institute of Technology & Research
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    NAAC A++ & NBA Tier-1 Accredited
                  </span>
                </div>
                <p className="text-xs text-amber-200/80">
                  Institution Command Center • Directorate of Career Readiness, Outcome-Based Education (OBE) & Placement Governance
                </p>
              </div>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={Download}
              onClick={onExportReport}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs shadow-xs"
            >
              Export NIRF / NAAC Report
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={isAiAuditing ? RefreshCw : Sparkles}
              onClick={onTriggerAiAudit}
              disabled={isAiAuditing}
              className="bg-amber-600 hover:bg-amber-500 text-white border-transparent text-xs shadow-md font-bold"
            >
              {isAiAuditing ? 'Auditing Curriculum...' : 'Run AI Curriculum Audit'}
            </Button>
          </div>
        </div>

        {/* Dynamic Filters Bar */}
        <div className="relative z-10 mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="text-amber-200/80 text-[11px] font-medium">Academic Year:</span>
              <select
                value={selectedCohort}
                onChange={(e) => onChangeCohort(e.target.value)}
                className="bg-slate-900/80 border border-amber-400/30 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                <option value="2025-2026">2025-2026 (Active Cycle)</option>
                <option value="2024-2025">2024-2025 (Previous Cohort)</option>
                <option value="2026-2027">2026-2027 (Projected Cohort)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="text-amber-200/80 text-[11px] font-medium">Department:</span>
              <select
                value={selectedDepartment}
                onChange={(e) => onChangeDepartment(e.target.value)}
                className="bg-slate-900/80 border border-amber-400/30 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                <option value="all">All Engineering Departments (CSE, AIDS, IT, ECE, EEE)</option>
                <option value="CSE">Computer Science & Engineering (CSE)</option>
                <option value="AIDS">AI & Data Science (AIDS)</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="ECE">Electronics & Communication (ECE)</option>
                <option value="EEE">Electrical & Electronics (EEE)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-amber-200/70">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Real-time LMS & Assessment Engine Synced
            </span>
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
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    isActive
                      ? 'bg-amber-800 text-white'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  }`}
                >
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
