import React, { useEffect, useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { STUDENT_OPPORTUNITIES } from '../../data/studentData';
import { Compass, Sparkles, ArrowUpRight, Building2, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { firestoreService } from '../../services/firestoreService';
import { PersistedSkillProfile } from '../../services/skillService';
import { calculateDeterministicOpportunityMatch } from '../../utils/deterministicScoring';

interface OpportunitiesCardProps {
  onViewAll?: () => void;
  onSelectOpportunity?: (id: string) => void;
}

export const OpportunitiesCard: React.FC<OpportunitiesCardProps> = ({
  onViewAll,
  onSelectOpportunity
}) => {
  const { appUser, user, isAuthenticated, isDemo } = useAuth();
  const [skillProfile, setSkillProfile] = useState<PersistedSkillProfile | null>(null);

  const userId = appUser?.uid || user?.id;

  useEffect(() => {
    let isMounted = true;
    if (userId && !isDemo) {
      firestoreService.getSkillProfile(userId).then((res) => {
        if (isMounted && res.success && res.data) {
          setSkillProfile(res.data);
        }
      }).catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, [userId, isDemo]);

  const opportunities = STUDENT_OPPORTUNITIES;
  const isUnassessed = !isDemo && (!skillProfile?.skills || Object.keys(skillProfile.skills).length === 0);

  const calculatedOpportunities = useMemo(() => {
    return opportunities.map((opp) => {
      const match = calculateDeterministicOpportunityMatch(
        opp,
        undefined,
        skillProfile,
        isDemo || !isAuthenticated
      );
      return {
        ...opp,
        calculatedScore: match.matchScore
      };
    });
  }, [opportunities, skillProfile, isDemo, isAuthenticated]);

  const topOpportunity = calculatedOpportunities[0];
  const highMatchCount = isUnassessed ? 0 : calculatedOpportunities.filter((o) => o.calculatedScore >= 90).length;

  return (
    <Card variant="default" className="relative overflow-hidden p-5 flex flex-col justify-between border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-600/10 dark:bg-sky-400/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Opportunities
            </span>
          </div>
          <Badge variant="primary" size="sm">
            {opportunities.length} Openings
          </Badge>
        </div>

        {/* Big Count Display */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {opportunities.length}
          </span>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Open Roles
          </span>
          <span className="ml-auto text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-full">
            {isUnassessed ? 'Assessment Required' : `${highMatchCount} High Match (>90%)`}
          </span>
        </div>

        {/* Top featured opportunity snapshot */}
        {topOpportunity && (
          <div className="p-3 my-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {topOpportunity.title}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isUnassessed
                  ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950'
                  : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950'
              }`}>
                {isUnassessed ? 'Pending Assessment' : `${topOpportunity.calculatedScore}% Match`}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {topOpportunity.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {topOpportunity.mode}
              </span>
            </div>
            <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              {topOpportunity.stipend}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          rightIcon={ArrowUpRight}
          onClick={onViewAll}
        >
          Browse Marketplace ({opportunities.length})
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="text-xs"
          onClick={() => onSelectOpportunity && topOpportunity && onSelectOpportunity(topOpportunity.id)}
        >
          Quick Apply
        </Button>
      </div>
    </Card>
  );
};

