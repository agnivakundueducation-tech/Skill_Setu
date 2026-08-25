import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import {
  calculateSkillDemand,
  calculateDemandVsReadiness,
  generateInstitutionRecommendations,
  generateDemandSnapshot,
  getHistoricalSnapshots
} from '../../services/demandService';
import { getOpportunities } from '../../services/opportunityService';
import { useAuth } from '../../context/AuthContext';
import { OpportunityRecord } from '../../types/opportunity';
import {
  SkillDemand,
  SkillDemandSnapshot,
  SkillDemandVsReadiness,
  InstitutionRecommendation,
  MatrixQuadrant
} from '../../types/demand';
import { DEMO_OPPORTUNITIES } from '../../data/demoOpportunities';
import {
  DEMO_SKILL_DEMANDS,
  DEMO_DEMAND_VS_READINESS,
  DEMO_INSTITUTION_RECOMMENDATIONS,
  DEMO_HISTORICAL_SNAPSHOTS
} from '../../data/demoDemandData';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Cloud,
  Shield,
  Code2,
  Database,
  Layers,
  Sparkles,
  Camera,
  History,
  ArrowUpRight,
  HelpCircle,
  Briefcase,
  Lightbulb,
  Building2,
  ChevronRight,
  Filter,
  RefreshCw
} from 'lucide-react';

interface IndustrySkillDemandSectionProps {
  onOpenAiRecommendationsForSkill?: (skillName: string) => void;
}

export const IndustrySkillDemandSection: React.FC<IndustrySkillDemandSectionProps> = ({
  onOpenAiRecommendationsForSkill
}) => {
  const { isAuthenticated, isDemo, appUser } = useAuth();
  const [opportunities, setOpportunities] = useState<OpportunityRecord[]>(DEMO_OPPORTUNITIES);
  const [snapshots, setSnapshots] = useState<SkillDemandSnapshot[]>(DEMO_HISTORICAL_SNAPSHOTS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSnapshotting, setIsSnapshotting] = useState<boolean>(false);
  const [snapshotToast, setSnapshotToast] = useState<string | null>(null);

  // Filters
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedQuadrant, setSelectedQuadrant] = useState<MatrixQuadrant | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string>('All');

  // Load opportunities & historical snapshots
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [oppRes, snapRes] = await Promise.all([
        getOpportunities({ isDemo: isDemo || !isAuthenticated }),
        getHistoricalSnapshots(isDemo || !isAuthenticated)
      ]);

      if (oppRes.success && oppRes.data && oppRes.data.length > 0) {
        setOpportunities(oppRes.data);
      } else {
        setOpportunities(DEMO_OPPORTUNITIES);
      }

      if (snapRes.success && snapRes.data && snapRes.data.length > 0) {
        setSnapshots(snapRes.data);
      } else {
        setSnapshots(DEMO_HISTORICAL_SNAPSHOTS);
      }
    } catch (err) {
      console.warn('[IndustrySkillDemandSection] Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isDemo]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered opportunities based on domain/type
  const activeOpportunities = useMemo(() => {
    return opportunities.filter((o) => {
      if (o.status && o.status !== 'active') return false;
      if (selectedDomain !== 'All' && o.domain !== selectedDomain) return false;
      if (selectedType !== 'All' && o.opportunityType !== selectedType) return false;
      return true;
    });
  }, [opportunities, selectedDomain, selectedType]);

  // Unique domains and types for filters
  const domainOptions = useMemo(() => {
    const set = new Set<string>(['All']);
    opportunities.forEach((o) => {
      if (o.domain) set.add(o.domain);
    });
    return Array.from(set);
  }, [opportunities]);

  const typeOptions = useMemo(() => {
    const set = new Set<string>(['All']);
    opportunities.forEach((o) => {
      if (o.opportunityType) set.add(o.opportunityType);
    });
    return Array.from(set);
  }, [opportunities]);

  // Compute Skill Demand & Demand vs Readiness
  const skillDemands = useMemo<SkillDemand[]>(() => {
    if (activeOpportunities.length === 0) {
      return isDemo || !isAuthenticated ? DEMO_SKILL_DEMANDS : [];
    }
    return calculateSkillDemand(activeOpportunities, snapshots);
  }, [activeOpportunities, snapshots, isDemo, isAuthenticated]);

  const demandVsReadinessList = useMemo<SkillDemandVsReadiness[]>(() => {
    if (skillDemands.length === 0) {
      return isDemo || !isAuthenticated ? DEMO_DEMAND_VS_READINESS : [];
    }
    return calculateDemandVsReadiness(skillDemands);
  }, [skillDemands, isDemo, isAuthenticated]);

  // Compute Deterministic Recommendations
  const recommendations = useMemo<InstitutionRecommendation[]>(() => {
    if (demandVsReadinessList.length === 0) {
      return isDemo || !isAuthenticated ? DEMO_INSTITUTION_RECOMMENDATIONS : [];
    }
    return generateInstitutionRecommendations(demandVsReadinessList);
  }, [demandVsReadinessList, isDemo, isAuthenticated]);

  // Filtered by quadrant
  const filteredMatrixItems = useMemo(() => {
    if (selectedQuadrant === 'all') return demandVsReadinessList;
    return demandVsReadinessList.filter((item) => item.matrixQuadrant === selectedQuadrant);
  }, [demandVsReadinessList, selectedQuadrant]);

  // Handler for Generating a new Snapshot
  const handleCreateSnapshot = async () => {
    setIsSnapshotting(true);
    try {
      const res = await generateDemandSnapshot(
        opportunities,
        isDemo || !isAuthenticated,
        appUser?.uid || 'institutional-lead'
      );
      if (res.success && res.data) {
        setSnapshots((prev) => [...prev, res.data!]);
        setSnapshotToast(
          `Demand snapshot recorded successfully (${res.data.totalOpportunities} active postings analyzed).`
        );
        setTimeout(() => setSnapshotToast(null), 4000);
      }
    } catch (err) {
      console.error('Failed to create snapshot:', err);
    } finally {
      setIsSnapshotting(false);
    }
  };

  // Icon mapping
  const getSkillIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('ai') || lower.includes('ml')) return Brain;
    if (lower.includes('cloud')) return Cloud;
    if (lower.includes('sec')) return Shield;
    if (lower.includes('data') || lower.includes('sql')) return Database;
    return Code2;
  };

  // Trend Badge
  const renderTrendBadge = (trend: SkillDemand['trend']) => {
    switch (trend) {
      case 'rising':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            Rising (+10%+)
          </span>
        );
      case 'declining':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-300 dark:border-rose-800">
            <TrendingDown className="w-3 h-3 text-rose-600" />
            Declining
          </span>
        );
      case 'stable':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-300 dark:border-slate-700">
            <Minus className="w-3 h-3 text-slate-500" />
            Stable (±10%)
          </span>
        );
      case 'insufficient-data':
      default:
        return (
          <span
            title="Trend requires at least two historical snapshots"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800"
          >
            <HelpCircle className="w-3 h-3 text-slate-400" />
            Baseline Snapshot
          </span>
        );
    }
  };

  // Quadrant color helper
  const getQuadrantInfo = (quadrant: MatrixQuadrant) => {
    switch (quadrant) {
      case 'urgent_development':
        return {
          title: 'Urgent Skill Development',
          badge: 'High Demand / Low Readiness',
          badgeVariant: 'danger' as const,
          borderColor: 'border-rose-300 dark:border-rose-900',
          bgHighlight: 'bg-rose-50/50 dark:bg-rose-950/20'
        };
      case 'maintain':
        return {
          title: 'Maintain & Scale',
          badge: 'High Demand / High Readiness',
          badgeVariant: 'success' as const,
          borderColor: 'border-emerald-300 dark:border-emerald-900',
          bgHighlight: 'bg-emerald-50/50 dark:bg-emerald-950/20'
        };
      case 'opportunity_expansion':
        return {
          title: 'Opportunity Expansion',
          badge: 'Low Demand / High Readiness',
          badgeVariant: 'info' as const,
          borderColor: 'border-blue-300 dark:border-blue-900',
          bgHighlight: 'bg-blue-50/50 dark:bg-blue-950/20'
        };
      case 'lower_priority':
      default:
        return {
          title: 'Lower Priority',
          badge: 'Low Demand / Low Readiness',
          badgeVariant: 'neutral' as const,
          borderColor: 'border-slate-300 dark:border-slate-800',
          bgHighlight: 'bg-slate-50 dark:bg-slate-900/40'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {snapshotToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between text-xs animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold">Snapshot Recorded:</span>
            <span>{snapshotToast}</span>
          </div>
        </div>
      )}

      {/* Header Banner with Source Transparency & Snapshot Action */}
      <div className="p-5 rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950/80 to-slate-900 text-white border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Industry Skill Demand Intelligence
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              {isDemo || !isAuthenticated
                ? 'Demo Dataset (8 Postings)'
                : `Live Platform Data (${activeOpportunities.length} Active Postings)`}
            </span>
          </div>
          <p className="text-xs text-indigo-200/80 mt-1 max-w-2xl">
            Deterministic aggregation of industry job requirements matched against verified student cohort assessment profiles.
            Mathematical scoring without black-box estimation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={isSnapshotting ? RefreshCw : Camera}
            onClick={handleCreateSnapshot}
            disabled={isSnapshotting}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs shadow-xs"
          >
            {isSnapshotting ? 'Saving...' : 'Record Demand Snapshot'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={RefreshCw}
            onClick={loadData}
            disabled={isLoading}
            className="bg-transparent text-white border-white/20 hover:bg-white/10 text-xs"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Controls Bar: Domain & Opportunity Type Filter */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-700 dark:text-slate-300">Filter Postings:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Domain:</span>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-indigo-500"
            >
              {domainOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-indigo-500"
            >
              {typeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="text-[11px] text-slate-400 pl-2 border-l border-slate-200 dark:border-slate-800">
            Analyzing {activeOpportunities.length} opportunities
          </div>
        </div>
      </div>

      {/* SECTION 1: Top Industry Skills (Horizontal Bar Chart + Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Horizontal Bar Chart of Top Skills */}
        <Card
          variant="default"
          className="lg:col-span-7 p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BarChart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Top Demanded Skills in Active Postings
              </h3>
              <p className="text-xs text-slate-500">
                Frequency percentage of skills required across active opportunities
              </p>
            </div>
            <Badge variant="primary" size="sm">
              Ranked by Demand
            </Badge>
          </div>

          {/* Recharts Horizontal Bar Chart */}
          <div className="h-64 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={skillDemands.slice(0, 7)}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                barSize={18}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" opacity={0.6} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="skillName"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as SkillDemand;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
                          <p className="font-bold text-sm text-indigo-300">{item.skillName}</p>
                          <p>
                            <span className="text-slate-400">Industry Demand: </span>
                            <span className="font-bold text-white">{item.demandPercentage}%</span>
                          </p>
                          <p>
                            <span className="text-slate-400">Occurrences: </span>
                            <span>{item.opportunityCount} of {activeOpportunities.length} opportunities</span>
                          </p>
                          <p>
                            <span className="text-slate-400">Avg Required Level: </span>
                            <span>{item.averageRequiredLevel} / 100</span>
                          </p>
                          <p>
                            <span className="text-slate-400">Category: </span>
                            <span>{item.category}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="demandPercentage" radius={[0, 6, 6, 0]}>
                  {skillDemands.slice(0, 7).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.demandPercentage >= 50
                          ? '#4f46e5'
                          : entry.demandPercentage >= 35
                          ? '#6366f1'
                          : '#818cf8'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Demanded Skills List with Trend Badges */}
        <Card
          variant="default"
          className="lg:col-span-5 p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Skill Demand & Trend Registry
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              {snapshots.length > 1 ? `${snapshots.length} Snapshots` : 'Initial Baseline'}
            </span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {skillDemands.slice(0, 6).map((skill, idx) => {
              const Icon = getSkillIcon(skill.skillName);
              return (
                <div
                  key={skill.skillId}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-xs hover:border-indigo-400 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 text-[11px] font-bold text-slate-400">#{idx + 1}</span>
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                        {skill.skillName}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {skill.opportunityCount} postings • Benchmark: {skill.averageRequiredLevel}/100
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="font-black text-indigo-600 dark:text-indigo-400 text-xs">
                      {skill.demandPercentage}%
                    </span>
                    {renderTrendBadge(skill.trend)}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* SECTION 2: 4-Quadrant Priority Matrix */}
      <Card variant="default" className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Industry Demand vs Student Readiness: 4-Quadrant Priority Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Categorizes competencies to guide urgent curriculum interventions versus career placement acceleration
            </p>
          </div>

          {/* Filter Quadrants */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold">
            <button
              onClick={() => setSelectedQuadrant('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedQuadrant === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All Matrix
            </button>
            <button
              onClick={() => setSelectedQuadrant('urgent_development')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedQuadrant === 'urgent_development'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Urgent Development
            </button>
            <button
              onClick={() => setSelectedQuadrant('maintain')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedQuadrant === 'maintain'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Maintain
            </button>
            <button
              onClick={() => setSelectedQuadrant('opportunity_expansion')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedQuadrant === 'opportunity_expansion'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Opportunity Expansion
            </button>
          </div>
        </div>

        {/* 4 Quadrants Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(
            [
              'urgent_development',
              'maintain',
              'opportunity_expansion',
              'lower_priority'
            ] as MatrixQuadrant[]
          ).map((quadrantKey) => {
            const info = getQuadrantInfo(quadrantKey);
            const items = demandVsReadinessList.filter((i) => i.matrixQuadrant === quadrantKey);

            if (selectedQuadrant !== 'all' && selectedQuadrant !== quadrantKey) {
              return null;
            }

            return (
              <div
                key={quadrantKey}
                className={`p-4 rounded-2xl border ${info.borderColor} ${info.bgHighlight} space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {info.title}
                    </span>
                    <p className="text-[10px] text-slate-500">{info.badge}</p>
                  </div>
                  <Badge variant={info.badgeVariant} size="sm">
                    {items.length} Skills
                  </Badge>
                </div>

                <div className="space-y-2">
                  {items.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic py-2">
                      No skills currently mapped to this quadrant.
                    </p>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.skillId}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            {item.skillName}
                            {item.gapSeverity === 'critical' && (
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                            )}
                          </span>
                          <span className="font-extrabold text-slate-700 dark:text-slate-300">
                            Demand: {item.demandPercentage}% • Gap: -{item.gap} pts
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-0.5">
                          <div>
                            Industry Required: <strong className="text-slate-800 dark:text-slate-200">{item.averageRequiredLevel}</strong>
                          </div>
                          <div>
                            Cohort Readiness: <strong className="text-slate-800 dark:text-slate-200">{item.averageStudentReadiness}</strong>
                          </div>
                        </div>

                        <p className="text-[10px] text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-1.5 leading-relaxed">
                          {item.explanation}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* SECTION 3: Curriculum & Skill Gaps Detailed Table */}
      <Card variant="default" className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              Curriculum & Skill Gaps Intelligence Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Identifies where institutional curriculum and student cohort readiness diverge from live market expectations
            </p>
          </div>
          <Badge variant="neutral" size="sm">
            {demandVsReadinessList.length} Total Competencies Analyzed
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[11px] font-semibold">
                <th className="pb-2.5 font-bold">Skill Competency</th>
                <th className="pb-2.5 font-bold">Category</th>
                <th className="pb-2.5 font-bold">Industry Demand</th>
                <th className="pb-2.5 font-bold">Cohort Readiness</th>
                <th className="pb-2.5 font-bold">Required Benchmark</th>
                <th className="pb-2.5 font-bold">Competency Gap</th>
                <th className="pb-2.5 font-bold">Priority</th>
                <th className="pb-2.5 font-bold">Action Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {demandVsReadinessList.map((item) => (
                <tr key={item.skillId} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 font-bold text-slate-900 dark:text-slate-100">
                    {item.skillName}
                  </td>
                  <td className="py-3 text-slate-500">
                    {item.category}
                  </td>
                  <td className="py-3">
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                      {item.demandPercentage}%
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      ({item.opportunityCount} jobs)
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {item.averageStudentReadiness}
                    </span>
                    <span className="text-[10px] text-slate-400">/100</span>
                  </td>
                  <td className="py-3 text-slate-700 dark:text-slate-300 font-semibold">
                    {item.averageRequiredLevel}/100
                  </td>
                  <td className="py-3">
                    {item.gap > 0 ? (
                      <span className={`font-bold ${item.gap >= 20 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        -{item.gap} pts
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-bold">Aligned</span>
                    )}
                  </td>
                  <td className="py-3">
                    <Badge
                      variant={
                        item.priority === 'Critical'
                          ? 'danger'
                          : item.priority === 'High'
                          ? 'warning'
                          : item.priority === 'Moderate'
                          ? 'info'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {item.priority}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => onOpenAiRecommendationsForSkill?.(item.skillName)}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      Inspect Blueprint →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* SECTION 4: Actionable Deterministic Recommendations */}
      <Card variant="default" className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Deterministic Institutional Recommendations
            </h3>
            <p className="text-xs text-slate-500">
              Direct mathematical rationale linking opportunity requirements with actionable curriculum updates
            </p>
          </div>
          <Badge variant="warning" size="sm">
            {recommendations.length} Actionable Directives
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 hover:border-amber-400 transition-all shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <Badge
                    variant={rec.priority === 'Critical' ? 'danger' : rec.priority === 'High' ? 'warning' : 'info'}
                    size="sm"
                  >
                    {rec.priority} Priority
                  </Badge>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-1">
                    {rec.title}
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                  {rec.suggestedTimeline}
                </span>
              </div>

              {/* Explainable Mathematical Rationale */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1.5">
                <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  <span className="font-bold text-slate-900 dark:text-slate-100">Mathematical Rationale: </span>
                  {rec.reason}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-semibold pt-1 border-t border-slate-200/50 dark:border-slate-800">
                  <span>Demand: <strong>{rec.metricSnapshot.demandPercentage}%</strong></span>
                  <span>Readiness: <strong>{rec.metricSnapshot.studentReadiness}</strong></span>
                  <span>Required: <strong>{rec.metricSnapshot.requiredLevel}</strong></span>
                  <span>Gap: <strong className="text-rose-600">-{rec.metricSnapshot.gap} pts</strong></span>
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">Recommended Action:</p>
                <p className="leading-relaxed">{rec.recommendedAction}</p>
              </div>

              {rec.targetDepartment && (
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  Target: <strong>{rec.targetDepartment}</strong>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
