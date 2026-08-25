import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { JobPosting } from '../../types/industry';
import {
  Briefcase,
  GraduationCap,
  Users,
  MapPin,
  Clock,
  DollarSign,
  Plus,
  CheckCircle2,
  PauseCircle,
  XCircle,
  Eye,
  SlidersHorizontal,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ActiveListingsSectionProps {
  jobs: JobPosting[];
  internships: JobPosting[];
  onOpenPostJob: () => void;
  onOpenPostInternship: () => void;
  onViewCandidatesForJob?: (jobId: string) => void;
}

export const ActiveListingsSection: React.FC<ActiveListingsSectionProps> = ({
  jobs,
  internships,
  onOpenPostJob,
  onOpenPostInternship,
  onViewCandidatesForJob
}) => {
  const [filterType, setFilterType] = useState<'all' | 'jobs' | 'internships'>('all');

  const combinedListings = [
    ...(filterType === 'internships' ? [] : jobs),
    ...(filterType === 'jobs' ? [] : internships)
  ];

  return (
    <div className="space-y-4">
      {/* Top Header & Actions Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            All Openings ({jobs.length + internships.length})
          </button>
          <button
            onClick={() => setFilterType('jobs')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterType === 'jobs'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Active Jobs ({jobs.length})</span>
          </button>
          <button
            onClick={() => setFilterType('internships')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterType === 'internships'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Active Internships ({internships.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={Plus}
            onClick={onOpenPostInternship}
            className="text-xs"
          >
            Post Internship
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={Plus}
            onClick={onOpenPostJob}
            className="text-xs"
          >
            Post Job
          </Button>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {combinedListings.map((listing) => (
          <Card
            key={listing.id}
            variant="default"
            className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-600 transition-all hover:shadow-md space-y-4"
          >
            <div className="space-y-3">
              {/* Header Badge Row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={listing.type === 'internship' ? 'success' : 'primary'}
                    size="sm"
                    className="capitalize text-[10px]"
                  >
                    {listing.type === 'internship' ? 'Paid Internship' : 'Full-Time Job'}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-500">
                    {listing.department}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 capitalize">
                    {listing.status}
                  </span>
                </div>
              </div>

              {/* Title & Compensation */}
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 transition-colors">
                  {listing.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    {listing.salaryOrStipend}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {listing.location}
                  </span>
                  {listing.duration && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {listing.duration}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                {listing.description}
              </p>

              {/* Required Skills Chips */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Required Skill Compatibility:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {listing.requiredSkills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Pipeline Metrics Bar & Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold">Applicants</div>
                  <div className="text-sm font-black text-slate-900 dark:text-slate-100">
                    {listing.applicantsCount}
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/40">
                  <div className="text-[10px] text-amber-600 font-bold">Shortlisted</div>
                  <div className="text-sm font-black text-amber-600 dark:text-amber-400">
                    {listing.shortlistedCount}
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-900/40">
                  <div className="text-[10px] text-indigo-600 font-bold">Interviewing</div>
                  <div className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                    {listing.interviewingCount}
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/40">
                  <div className="text-[10px] text-emerald-600 font-bold">Hired</div>
                  <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {listing.hiredCount}/{listing.openSlots}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[11px] text-slate-400">
                  Posted {listing.postedDate} • Deadline {listing.deadline}
                </span>

                {onViewCandidatesForJob && (
                  <button
                    type="button"
                    onClick={() => onViewCandidatesForJob(listing.id)}
                    className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>View Talent Matches</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
