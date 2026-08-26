import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { InterviewRecord } from '../../../types/recruitment';
import { getStudentInterviews } from '../../../services/placementService';
import { useAuth } from '../../../context/AuthContext';
import {
  Calendar,
  Clock,
  Video,
  Building2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  MapPin,
  UserCheck
} from 'lucide-react';

interface StudentInterviewsTabProps {
  onScheduleRefresh?: () => void;
}

export const StudentInterviewsTab: React.FC<StudentInterviewsTabProps> = () => {
  const { appUser, isAuthenticated, isDemo } = useAuth();
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'Scheduled' | 'Completed'>('all');

  const fetchInterviews = async () => {
    setIsLoading(true);
    const studentId = (isAuthenticated && !isDemo && appUser?.uid) ? appUser.uid : 'usr_std_01';
    try {
      const res = await getStudentInterviews(studentId, isDemo || !isAuthenticated);
      if (res.success) {
        setInterviews(res.data);
      }
    } catch (err) {
      console.error('[StudentInterviewsTab] Error fetching interviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [appUser, isAuthenticated, isDemo]);

  const filteredInterviews = interviews.filter((int) => {
    if (activeFilter === 'all') return true;
    return int.status === activeFilter;
  });

  return (
    <div className="space-y-4">
      {/* Tab Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Direct Industry Interview Rounds ({interviews.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Technical coding rounds, panel interviews, and live recruitment pairing sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'Scheduled', 'Completed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === filter
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {filter === 'all' ? 'All Rounds' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="p-8 text-center text-xs text-slate-500">
          Loading scheduled interviews...
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredInterviews.length === 0 && (
        <Card className="p-8 text-center border-dashed border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              No Interviews in this filter
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              When recruiters review your Skill DNA match score and shortlist your application, interview invitations will appear directly in this hub.
            </p>
          </div>
        </Card>
      )}

      {/* Interviews Grid */}
      {!isLoading && filteredInterviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInterviews.map((int) => {
            const isCompleted = int.status === 'Completed';
            const scheduledDate = new Date(int.scheduledAt);
            const isUpcoming = scheduledDate > new Date() && !isCompleted;

            return (
              <Card
                key={int.interviewId}
                className="p-5 flex flex-col justify-between space-y-4 border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  {/* Top info */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {int.interviewType} Interview
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                        {int.opportunityTitle}
                      </h4>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {int.companyName}
                      </p>
                    </div>

                    <Badge
                      variant={isCompleted ? 'success' : isUpcoming ? 'primary' : 'warning'}
                      size="sm"
                    >
                      {int.status}
                    </Badge>
                  </div>

                  {/* Schedule Details */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Date & Time</div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-indigo-500" />
                        {scheduledDate.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {scheduledDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} ({int.durationMinutes} mins)
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Interviewer</div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 flex items-center gap-1 truncate">
                        <UserCheck className="w-3 h-3 text-emerald-500" />
                        {int.recruiterName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Corporate Recruiter
                      </div>
                    </div>
                  </div>

                  {/* Notes / Agenda */}
                  {int.notes && (
                    <div className="text-xs text-slate-600 dark:text-slate-400 bg-indigo-50/40 dark:bg-indigo-950/20 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">Preparation Agenda: </span>
                      {int.notes}
                    </div>
                  )}

                  {/* Evaluation Result if Completed */}
                  {int.evaluation && (
                    <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-300">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Evaluation Recommendation:
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px]">
                          {int.evaluation.overallRecommendation}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 italic">
                        "{int.evaluation.comments}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">
                    {int.interviewId}
                  </span>

                  {int.meetingLinkOrLocation.startsWith('http') ? (
                    <a
                      href={int.meetingLinkOrLocation}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Live Sandbox</span>
                      <ExternalLink className="w-3 h-3 opacity-75" />
                    </a>
                  ) : (
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      {int.meetingLinkOrLocation}
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
