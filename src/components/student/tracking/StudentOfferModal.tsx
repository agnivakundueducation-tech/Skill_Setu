import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { OfferRecord } from '../../../types/recruitment';
import { respondToOffer } from '../../../services/placementService';
import { useAuth } from '../../../context/AuthContext';
import {
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface StudentOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: OfferRecord | null;
  onOfferResponded?: (offer: OfferRecord) => void;
  onNavigateToPassport?: () => void;
}

export const StudentOfferModal: React.FC<StudentOfferModalProps> = ({
  isOpen,
  onClose,
  offer,
  onOfferResponded,
  onNavigateToPassport
}) => {
  const { appUser, isAuthenticated, isDemo } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'decline' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [acceptedPlacementHash, setAcceptedPlacementHash] = useState<string | null>(null);

  if (!offer) return null;

  const handleRespond = async (response: 'Accepted' | 'Declined') => {
    setActionType(response === 'Accepted' ? 'accept' : 'decline');
    setIsProcessing(true);
    setErrorMessage(null);

    const studentId = (isAuthenticated && !isDemo && appUser?.uid) ? appUser.uid : 'usr_std_01';
    const studentName = appUser?.displayName || 'Aarav Sharma';

    try {
      const res = await respondToOffer({
        offerId: offer.offerId,
        response,
        studentId,
        studentName,
        isDemo: isDemo || !isAuthenticated
      });

      if (res.success && res.data.offer) {
        if (res.data.placement) {
          setAcceptedPlacementHash(res.data.placement.cryptographicHash);
        }
        if (onOfferResponded) {
          onOfferResponded(res.data.offer);
        }
      } else {
        setErrorMessage(res.error || 'Failed to process offer response');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isPending = offer.status === 'Pending';
  const isAccepted = offer.status === 'Accepted' || !!acceptedPlacementHash;
  const isDeclined = offer.status === 'Declined';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Employment Offer Letter & Term Sheet"
      description={`Issued by ${offer.organization} for ${offer.role}`}
      size="lg"
    >
      <div className="space-y-5 pt-2">
        {/* Banner */}
        <div className={`p-4 sm:p-5 rounded-2xl border flex items-start gap-4 ${
          isAccepted
            ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
            : isDeclined
            ? 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-800'
            : 'bg-linear-to-r from-indigo-50 to-emerald-50 dark:from-indigo-950/40 dark:to-emerald-950/40 border-indigo-200 dark:border-indigo-800'
        }`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
            isAccepted ? 'bg-emerald-600 text-white' : isDeclined ? 'bg-slate-600 text-white' : 'bg-indigo-600 text-white'
          }`}>
            {isAccepted ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : isDeclined ? (
              <XCircle className="w-6 h-6" />
            ) : (
              <DollarSign className="w-6 h-6" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {offer.role}
              </h3>
              <Badge variant={isAccepted ? 'success' : isDeclined ? 'danger' : 'primary'} size="sm">
                Offer Status: {acceptedPlacementHash ? 'Accepted' : offer.status}
              </Badge>
            </div>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {offer.organization} • {offer.employmentType}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Issued by {offer.issuedByName || 'Recruitment Board'} on {new Date(offer.offerDate || offer.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Offer Terms Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compensation Package</div>
            <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {offer.compensation}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Work Mode & Location</div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
              {offer.workMode} • {offer.location}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirmed Joining Date</div>
            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              {new Date(offer.joiningDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Response Deadline</div>
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-1">
              {new Date(offer.responseDeadline).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Offer ID & Reference</div>
            <div className="text-xs font-mono text-slate-700 dark:text-slate-300 mt-1 truncate">
              {offer.offerId}
            </div>
          </div>
        </div>

        {/* Notes & Terms */}
        {offer.notes && (
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-indigo-500" />
              Special Terms & Onboarding Notes
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {offer.notes}
            </p>
          </div>
        )}

        {/* Verified Placement Outcome Confirmation */}
        {(isAccepted || acceptedPlacementHash) && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Placement Outcome Registered!</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Your placement record has been committed to the institutional registry and linked directly to your Career Passport.
            </p>
            {acceptedPlacementHash && (
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 font-mono text-[11px] text-emerald-700 dark:text-emerald-300 truncate">
                {acceptedPlacementHash}
              </div>
            )}
            {onNavigateToPassport && (
              <div className="pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onNavigateToPassport();
                  }}
                  className="text-xs"
                  rightIcon={ArrowRight}
                >
                  View in Career Passport
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-400">
            {isPending && 'Please submit your decision before the deadline.'}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
            {isPending && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRespond('Declined')}
                  isLoading={isProcessing && actionType === 'decline'}
                  className="text-rose-600 hover:bg-rose-50 border-rose-200 dark:border-rose-900"
                >
                  Decline Offer
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleRespond('Accepted')}
                  isLoading={isProcessing && actionType === 'accept'}
                  leftIcon={CheckCircle2}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Accept Offer
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
