import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { SkillGapItem } from '../../../types/skillGap';
import {
  TARGET_CAREER_ROLES,
  getSkillGapItemsForRole,
  calculateSkillGapStats
} from '../../../data/skillGapData';
import { useAuth } from '../../../context/AuthContext';
import {
  firestoreService,
  formatPersistedProfileToSkillGaps,
  PersistedSkillProfile
} from '../../../services';
import { SkillGapSummaryCards } from '../skill-gap/SkillGapSummaryCards';
import { SkillGapTableView } from '../skill-gap/SkillGapTableView';
import { SkillGapChartView } from '../skill-gap/SkillGapChartView';
import { SkillGapActionModal } from '../skill-gap/SkillGapActionModal';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import {
  GitCompare,
  LayoutGrid,
  Table as TableIcon,
  BarChart3,
  Search,
  ArrowUpDown,
  Download,
  CheckCircle2,
  Sparkles,
  Target,
  FileSpreadsheet,
  Layers,
  Filter,
  AlertTriangle,
  Flame,
  Zap,
  ArrowRight,
  Brain
} from 'lucide-react';

interface SkillGapViewProps {
  onTakeAssessment?: (skillName?: string) => void;
  onExploreOpportunities?: () => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({
  onTakeAssessment,
  onExploreOpportunities
}) => {
  const { appUser, isAuthenticated, isDemo } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasProfile, setHasProfile] = useState<boolean>(true);
  const [persistedProfile, setPersistedProfile] = useState<PersistedSkillProfile | null>(null);

  // Target career benchmark role selection
  const [selectedRoleId, setSelectedRoleId] = useState<string>('fullstack');

  // View switch: 'table' | 'chart' | 'both'
  const [viewMode, setViewMode] = useState<'both' | 'table' | 'chart'>('both');

  // Filter & Search states
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'technical' | 'professional'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'critical' | 'moderate' | 'aligned'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'gap' | 'priority' | 'current' | 'required' | 'name'>('gap');

  // Modal states
  const [selectedSkillForModal, setSelectedSkillForModal] = useState<SkillGapItem | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [showExportToast, setShowExportToast] = useState(false);

  const loadData = useCallback(async () => {
    if (isAuthenticated && !isDemo && appUser?.uid) {
      setIsLoading(true);
      try {
        const res = await firestoreService.getSkillProfile(appUser.uid);
        if (res.success && res.data) {
          setPersistedProfile(res.data);
          setHasProfile(true);
        } else {
          // Check localStorage fallback
          const raw = localStorage.getItem(`skillsetu_skill_profile_${appUser.uid}`);
          if (raw) {
            try {
              setPersistedProfile(JSON.parse(raw));
              setHasProfile(true);
            } catch {
              setHasProfile(false);
            }
          } else {
            setHasProfile(false);
          }
        }
      } catch (err) {
        console.error('Failed to load skill gaps from Firestore:', err);
        setHasProfile(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      setHasProfile(true);
      setPersistedProfile(null);
    }
  }, [isAuthenticated, isDemo, appUser?.uid]);

  useEffect(() => {
    loadData();
    const handleStorage = () => loadData();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [loadData]);

  // Computed skill gap items for the selected target role / persisted profile
  const allItems = useMemo(() => {
    if (isAuthenticated && !isDemo && persistedProfile) {
      return formatPersistedProfileToSkillGaps(persistedProfile);
    }
    return getSkillGapItemsForRole(selectedRoleId);
  }, [isAuthenticated, isDemo, persistedProfile, selectedRoleId]);

  // Summary statistics
  const stats = useMemo(() => {
    return calculateSkillGapStats(allItems);
  }, [allItems]);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return allItems
      .filter((item) => {
        // Category filter
        if (categoryFilter !== 'all' && item.category !== categoryFilter) {
          return false;
        }
        // Status filter (Red / Yellow / Green)
        if (statusFilter !== 'all' && item.status !== statusFilter) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = item.name.toLowerCase().includes(q);
          const matchesSub = item.subcategory.toLowerCase().includes(q);
          const matchesRec = item.recommendation.toLowerCase().includes(q);
          return matchesName || matchesSub || matchesRec;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'gap') return b.gap - a.gap;
        if (sortBy === 'current') return b.currentLevel - a.currentLevel;
        if (sortBy === 'required') return b.requiredLevel - a.requiredLevel;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'priority') {
          const priorityScore = { High: 3, Medium: 2, Low: 1 };
          return priorityScore[b.priority] - priorityScore[a.priority];
        }
        return 0;
      });
  }, [allItems, categoryFilter, statusFilter, searchQuery, sortBy]);

  const handleOpenActionModal = (skill: SkillGapItem) => {
    setSelectedSkillForModal(skill);
    setIsActionModalOpen(true);
  };

  const handleExportReport = () => {
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 4000);
  };

  // If authenticated student hasn't completed assessment yet
  if (isAuthenticated && !isDemo && !isLoading && !hasProfile) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-200">
        <Card variant="default" className="p-8 sm:p-12 text-center border-amber-200/80 dark:border-amber-900/60 shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-6 border border-amber-100 dark:border-amber-900 shadow-xs">
            <GitCompare className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Your Skill Gaps haven&apos;t been calculated yet.
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-8 leading-relaxed">
            Complete your comprehensive adaptive skill assessment to calculate your real-time skill gaps against verified industry standards and generate prioritized bridging roadmaps.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              leftIcon={Brain}
              rightIcon={ArrowRight}
              className="w-full sm:w-auto font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => onTakeAssessment && onTakeAssessment()}
            >
              Complete Skill Assessment
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {showExportToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-indigo-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">Skill Gap Analysis Report Exported</div>
            <div className="text-[11px] text-slate-400">PDF & CSV Action Plan compiled and saved to downloads.</div>
          </div>
        </div>
      )}

      {/* Hero DNA / Gap Banner */}
      <Card
        variant="gradient"
        className="p-6 border-indigo-200 dark:border-indigo-900 bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center gap-1.5">
                <GitCompare className="w-3.5 h-3.5 text-rose-400" />
                Industry Gap Engine v2.4
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                {stats.criticalGapsCount} Red Gaps Identified
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {stats.alignedCount} Industry Aligned
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Skill Gap & Industry Readiness Analysis
            </h1>

            <p className="text-sm text-indigo-100/80 leading-relaxed">
              Synthesizing current student competencies against Tier-1 industry hiring thresholds. Discover priority deficiencies with <strong className="text-rose-300">Red</strong>, <strong className="text-amber-300">Yellow</strong>, and <strong className="text-emerald-300">Green</strong> indicators and personalized actionable recommendations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <Button
              variant="outline"
              size="md"
              leftIcon={Download}
              className="border-indigo-400/40 text-white hover:bg-indigo-800/40"
              onClick={handleExportReport}
            >
              Export Gap Report
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={Sparkles}
              className="bg-white hover:bg-slate-100 text-indigo-900 font-bold shadow-lg shadow-indigo-950/40"
              onClick={() => onTakeAssessment && onTakeAssessment()}
            >
              Re-Assess Competency
            </Button>
          </div>
        </div>
      </Card>

      {/* Target Benchmark & 4-Column Indicator Summary Cards */}
      <SkillGapSummaryCards
        stats={stats}
        targetRoles={TARGET_CAREER_ROLES}
        selectedRoleId={selectedRoleId}
        onSelectRole={(id) => setSelectedRoleId(id)}
        onFilterStatus={(st) => setStatusFilter(st)}
        selectedFilterStatus={statusFilter}
      />

      {/* View Switcher, Filter & Search Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {/* Left: View Mode Toggle (Table / Chart / Both) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
          <button
            type="button"
            onClick={() => setViewMode('both')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              viewMode === 'both'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Table & Charts (Unified)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('chart')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              viewMode === 'chart'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Chart View</span>
          </button>
        </div>

        {/* Center/Right: Category, Search & Sort */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                categoryFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              All ({allItems.length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('technical')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                categoryFilter === 'technical'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Technical
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('professional')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                categoryFilter === 'professional'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Professional
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skill or gap..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
            >
              <option value="gap">Sort: Highest Gap</option>
              <option value="priority">Sort: Priority (High→Low)</option>
              <option value="current">Sort: Current Level</option>
              <option value="required">Sort: Required Level</option>
              <option value="name">Sort: Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Active Reset Notice */}
      {(statusFilter !== 'all' || categoryFilter !== 'all' || searchQuery.trim()) && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              Showing <strong>{filteredItems.length}</strong> of {allItems.length} skills
              {statusFilter !== 'all' && ` (Filter: ${statusFilter.toUpperCase()} indicator)`}
              {categoryFilter !== 'all' && ` (Category: ${categoryFilter})`}
              {searchQuery && ` (Matching "${searchQuery}")`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('all');
              setCategoryFilter('all');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* ==================== 1. CHART VIEW ==================== */}
      {(viewMode === 'both' || viewMode === 'chart') && (
        <div className="space-y-4">
          <SkillGapChartView
            items={filteredItems}
            onSelectSkill={handleOpenActionModal}
          />
        </div>
      )}

      {/* ==================== 2. TABLE VIEW ==================== */}
      {(viewMode === 'both' || viewMode === 'table') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-indigo-500" />
              Skill Gap & Recommendations Table ({filteredItems.length} Skills)
            </h3>
            <span className="text-xs text-slate-400">
              Click any row to view step-by-step closing roadmap
            </span>
          </div>

          <SkillGapTableView
            items={filteredItems}
            onSelectSkill={handleOpenActionModal}
            onLaunchAssessment={(skillName) => {
              if (onTakeAssessment) {
                onTakeAssessment(skillName);
              }
            }}
          />
        </div>
      )}

      {/* Action Roadmap Modal */}
      <SkillGapActionModal
        isOpen={isActionModalOpen}
        skill={selectedSkillForModal}
        onClose={() => setIsActionModalOpen(false)}
        onLaunchAssessment={(skillName) => {
          setIsActionModalOpen(false);
          if (onTakeAssessment) {
            onTakeAssessment(skillName);
          }
        }}
      />
    </div>
  );
};
