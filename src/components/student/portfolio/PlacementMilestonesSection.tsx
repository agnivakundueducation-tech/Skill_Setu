import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { PlacementOutcomeRecord } from '../../../types/recruitment';
import { getStudentPlacements } from '../../../services/placementService';
import { useAuth } from '../../../context/AuthContext';
import {
  Award,
  Building2,
  Calendar,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface PlacementMilestonesSectionProps {
  studentId?: string;
}

export const PlacementMilestonesSection: React.FC<PlacementMilestonesSectionProps> = ({
  studentId: propStudentId
}) => {
  const { appUser, isAuthenticated, isDemo } = useAuth();
  const [placements, setPlacements] = useState<PlacementOutcomeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPlacements = async () => {
      setIsLoading(true);
      const studentId = propStudentId || ((isAuthenticated && !isDemo && appUser?.uid) ? appUser.uid : 'usr_std_01');
      try {
        const res = await getStudentPlacements(studentId, isDemo || !isAuthenticated);
        if (res.success) {
          setPlacements(res.data);
        }
      } catch (err) {
        console.error('[PlacementMilestonesSection] Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlacements();
  }, [propStudentId, appUser, isAuthenticated, isDemo]);

  if (isLoading || placements.length === 0) {
    return null; // Silent if no placements yet so portfolio stays clean
  }

  return (
    <Card className="p-6 border-emerald-200 dark:border-emerald-800/80 bg-linear-to-br from-emerald-50/50 via-white to-indigo-50/30 dark:from-emerald-950/30 dark:via-slate-900 dark:to-indigo-950/20 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Verified Campus Placement Outcomes ({placements.length})
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Cryptographically Sealed
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Accredited institutional recruitment outcomes and verified corporate offers.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {placements.map((plc) => (
          <div
            key={plc.placementId}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-emerald-200 dark:border-emerald-900 space-y-3 shadow-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {plc.role}
                </h4>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {plc.organization} • {plc.employmentType}
                </p>
              </div>

              <Badge variant="success" size="sm">
                Verified
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Compensation</span>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {plc.compensation || 'Confirmed CTC'}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Placement Date</span>
                <div className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {new Date(plc.placementDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-900/40 text-[10px] font-mono text-emerald-800 dark:text-emerald-300 truncate flex items-center justify-between gap-2">
              <span className="truncate">Hash: {plc.cryptographicHash}</span>
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
