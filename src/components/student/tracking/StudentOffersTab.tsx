import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { OfferRecord, PlacementOutcomeRecord } from '../../../types/recruitment';
import { getStudentOffers, getStudentPlacements } from '../../../services/placementService';
import { StudentOfferModal } from './StudentOfferModal';
import { useAuth } from '../../../context/AuthContext';
import {
  DollarSign,
  Building2,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
  ArrowRight,
  FileCheck,
  Award
} from 'lucide-react';

interface StudentOffersTabProps {
  onNavigateToPassport?: () => void;
}

export const StudentOffersTab: React.FC<StudentOffersTabProps> = ({
  onNavigateToPassport
}) => {
  const { appUser, isAuthenticated, isDemo } = useAuth();
  const [offers, setOffers] = useState<OfferRecord[]>([]);
  const [placements, setPlacements] = useState<PlacementOutcomeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<OfferRecord | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  const fetchOffersAndPlacements = async () => {
    setIsLoading(true);
    const studentId = (isAuthenticated && !isDemo && appUser?.uid) ? appUser.uid : 'usr_std_01';
    try {
      const [offersRes, placementsRes] = await Promise.all([
        getStudentOffers(studentId, isDemo || !isAuthenticated),
        getStudentPlacements(studentId, isDemo || !isAuthenticated)
      ]);
      if (offersRes.success) setOffers(offersRes.data);
      if (placementsRes.success) setPlacements(placementsRes.data);
    } catch (err) {
      console.error('[StudentOffersTab] Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffersAndPlacements();
  }, [appUser, isAuthenticated, isDemo]);

  const handleReviewOffer = (offer: OfferRecord) => {
    setSelectedOffer(offer);
    setIsOfferModalOpen(true);
  };

  const handleOfferResponded = (updatedOffer: OfferRecord) => {
    setOffers((prev) =>
      prev.map((o) => (o.offerId === updatedOffer.offerId ? updatedOffer : o))
    );
    fetchOffersAndPlacements();
  };

  return (
    <div className="space-y-6">
      {/* Verified Placement Outcomes Showcase */}
      {placements.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Verified Institutional Placement Outcomes ({placements.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {placements.map((plc) => (
              <Card
                key={plc.placementId}
                className="p-5 rounded-2xl bg-linear-to-br from-emerald-50/80 via-white to-indigo-50/50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-indigo-950/40 border-emerald-300 dark:border-emerald-800/80 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                          {plc.role}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                          Verified Hired
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {plc.organization} • {plc.employmentType}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200 dark:border-emerald-900/60 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Compensation</span>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {plc.compensation || 'Confirmed CTC'}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Confirmed Date</span>
                    <div className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      {new Date(plc.placementDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-100/50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-[11px] font-mono text-emerald-900 dark:text-emerald-200 truncate flex items-center justify-between gap-2">
                  <span className="truncate">Audit Hash: {plc.cryptographicHash}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </div>

                {onNavigateToPassport && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onNavigateToPassport}
                    rightIcon={ArrowRight}
                    className="w-full text-xs font-bold border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                  >
                    View Verified Milestone in Career Passport
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Offers List */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Corporate Offers & Term Sheets ({offers.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Binding job offers, PPO packages, and internship stipends issued by industry partners.
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="p-8 text-center text-xs text-slate-500">
            Loading offer letters...
          </div>
        )}

        {!isLoading && offers.length === 0 && placements.length === 0 && (
          <Card className="p-8 text-center border-dashed border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                No Offers Issued Yet
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Once you complete your technical interview evaluation rounds, official job offers and term sheets will appear here for your review.
              </p>
            </div>
          </Card>
        )}

        {!isLoading && offers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offers.map((off) => {
              const isPending = off.status === 'Pending';
              const isAccepted = off.status === 'Accepted';
              const isDeclined = off.status === 'Declined';

              return (
                <Card
                  key={off.offerId}
                  className="p-5 flex flex-col justify-between space-y-4 border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          {off.employmentType}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                          {off.role}
                        </h4>
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {off.organization}
                        </p>
                      </div>

                      <Badge
                        variant={isAccepted ? 'success' : isDeclined ? 'danger' : 'primary'}
                        size="sm"
                      >
                        {off.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Compensation</div>
                        <div className="font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                          {off.compensation}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Joining Date</div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                          {new Date(off.joiningDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Work Mode</div>
                        <div className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                          {off.workMode} • {off.location}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Response Deadline</div>
                        <div className="font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                          {new Date(off.responseDeadline).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">
                      {off.offerId}
                    </span>

                    <Button
                      variant={isPending ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleReviewOffer(off)}
                      className="text-xs"
                      rightIcon={ArrowRight}
                    >
                      {isPending ? 'Review & Decide' : 'View Offer Details'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Offer Response Modal */}
      <StudentOfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        offer={selectedOffer}
        onOfferResponded={handleOfferResponded}
        onNavigateToPassport={onNavigateToPassport}
      />
    </div>
  );
};
