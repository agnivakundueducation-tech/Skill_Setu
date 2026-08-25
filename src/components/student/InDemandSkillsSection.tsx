import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { useAuth } from '../../context/AuthContext';
import { getOpportunities } from '../../services/opportunityService';
import { getStudentDemandSignals } from '../../services/demandService';
import { firestoreService, PersistedSkillProfile } from '../../services';
import { StudentDemandSignal } from '../../types/demand';
import { DEMO_STUDENT_DEMAND_SIGNALS } from '../../data/demoDemandData';
import { DEMO_OPPORTUNITIES } from '../../data/demoOpportunities';
import { OpportunityRecord } from '../../types/opportunity';
import {
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Briefcase,
  Target,
  Brain,
  Layers
} from 'lucide-react';

interface InDemandSkillsSectionProps {
  onTakeAssessment: (skillName?: string) => void;
  onExploreOpportunities: () => void;
  onNavigateRoadmap?: () => void;
}

export const InDemandSkillsSection: React.FC<InDemandSkillsSectionProps> = ({
  onTakeAssessment,
  onExploreOpportunities,
  onNavigateRoadmap
}) => {
  const { isAuthenticated, isDemo, appUser } = useAuth();
  const [opportunities, setOpportunities] = useState<OpportunityRecord[]>(DEMO_OPPORTUNITIES);
  const [skillProfile, setSkillProfile] = useState<PersistedSkillProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [oppRes, profileRes] = await Promise.all([
          getOpportunities({ isDemo: isDemo || !isAuthenticated }),
          isAuthenticated && !isDemo && appUser?.uid
            ? firestoreService.getSkillProfile(appUser.uid)
            : Promise.resolve({ success: false, data: undefined })
        ]);

        if (isMounted) {
          if (oppRes.success && oppRes.data && oppRes.data.length > 0) {
            setOpportunities(oppRes.data);
          }
          if (profileRes.success && profileRes.data) {
            setSkillProfile(profileRes.data);
          }
        }
      } catch (err) {
        console.warn('Could not fetch student demand signals:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isDemo, appUser?.uid]);

  // Construct student score map
  const studentScores = useMemo<Record<string, number>>(() => {
    if (skillProfile && skillProfile.skills) {
      const map: Record<string, number> = {};
      for (const [k, v] of Object.entries(skillProfile.skills)) {
        const item = v as { verifiedScore?: number; score?: number } | undefined;
        map[k.toLowerCase()] = item?.verifiedScore || item?.score || 50;
      }
      return map;
    }
    // Default demo student profile scores
    return {
      python: 78,
      dsa: 74,
      database: 76,
      sql: 76,
      cloud: 51,
      aiml: 62,
      cybersecurity: 48,
      webdev: 78,
      problemsolving: 75
    };
  }, [skillProfile]);

  // Compute live signals
  const signals = useMemo<StudentDemandSignal[]>(() => {
    return getStudentDemandSignals(opportunities, studentScores, isDemo || !isAuthenticated);
  }, [opportunities, studentScores, isDemo, isAuthenticated]);

  return (
    <Card
      variant="default"
      className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-4"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              In-Demand Skills in Industry
            </h3>
            <Badge variant="primary" size="sm">
              Live Hiring Signals
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time market requirements across active internships and jobs matched against your verified Skill DNA.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          rightIcon={ArrowRight}
          onClick={onExploreOpportunities}
          className="text-xs self-start sm:self-center"
        >
          View All Opportunities
        </Button>
      </div>

      {/* Grid of In-Demand Skill Signals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
        {signals.slice(0, 6).map((signal) => {
          const isAligned = signal.yourScore >= signal.requiredLevel;
          const isCritical = signal.isGap && signal.gap >= 15;

          return (
            <div
              key={signal.skillName}
              className={`p-3.5 rounded-xl border transition-all text-xs space-y-2.5 flex flex-col justify-between ${
                isCritical
                  ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                  : isAligned
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {/* Card Top: Skill Name & Demand Badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {signal.skillName}
                    </span>
                    {isAligned ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">{signal.category}</span>
                </div>

                <div className="text-right">
                  <span className="font-black text-indigo-600 dark:text-indigo-400 text-xs">
                    {signal.demandPercentage}% Demand
                  </span>
                  <p className="text-[10px] text-slate-400">
                    {signal.opportunityCount} active {signal.opportunityCount === 1 ? 'role' : 'roles'}
                  </p>
                </div>
              </div>

              {/* Progress: Your Score vs Required Level */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    Your Score: <strong className="text-slate-900 dark:text-slate-100">{signal.yourScore}</strong>
                  </span>
                  <span className="text-slate-500">
                    Industry Target: <strong className="text-slate-900 dark:text-slate-100">{signal.requiredLevel}</strong>
                  </span>
                </div>

                <ProgressBar
                  value={signal.yourScore}
                  max={100}
                  variant={isAligned ? 'success' : isCritical ? 'danger' : 'warning'}
                  size="sm"
                />
              </div>

              {/* Explainable Short Suggestion */}
              <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-2">
                {isAligned ? (
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                    {signal.skillName} appears in {signal.demandPercentage}% of opportunities. Your readiness is {signal.yourScore}. <strong>Well aligned</strong>.
                  </span>
                ) : (
                  <span className="text-slate-700 dark:text-slate-300">
                    {signal.skillName} appears in {signal.demandPercentage}% of roles. Bridging this <strong>{signal.gap}-pt gap</strong> unlocks qualified matching.
                  </span>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-1">
                {signal.isGap ? (
                  <button
                    onClick={() => onTakeAssessment(signal.skillName)}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Assess / Bridge Gap</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    onClick={onExploreOpportunities}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-[11px] flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>View Matching Jobs</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
