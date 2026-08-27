import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { IndustryCandidate } from '../../types/industry';
import {
  FileSpreadsheet,
  Star,
  Zap,
  CheckCircle2,
  Clock,
  Calendar,
  Search,
  Filter,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface ApplicationsPipelineSectionProps {
  candidates: IndustryCandidate[];
  onSelectCandidate: (candidate: IndustryCandidate) => void;
  onToggleShortlist: (candidateId: string) => void;
  onUpdateStatus?: (candidateId: string, status: NonNullable<IndustryCandidate['appliedFor']>['status']) => void;
}

export const ApplicationsPipelineSection: React.FC<ApplicationsPipelineSectionProps> = ({
  candidates,
  onSelectCandidate,
  onToggleShortlist,
  onUpdateStatus
}) => {
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const stages = [
    { id: 'all', label: 'All Applications', count: candidates.length },
    { id: 'New', label: 'New Inflow', count: candidates.filter((c) => c.appliedFor?.status === 'New').length },
    { id: 'Under Review', label: 'Under Review', count: candidates.filter((c) => c.appliedFor?.status === 'Under Review').length },
    { id: 'Shortlisted', label: 'Shortlisted', count: candidates.filter((c) => c.appliedFor?.status === 'Shortlisted' || c.isShortlisted).length },
    { id: 'Interview Scheduled', label: 'Interviews', count: candidates.filter((c) => c.appliedFor?.status === 'Interview Scheduled' || c.appliedFor?.status === 'Technical Round').length }
  ];

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      searchQuery === '' ||
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.targetRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.institution.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedStage === 'all') return true;
    if (selectedStage === 'Shortlisted') return c.isShortlisted || c.appliedFor?.status === 'Shortlisted';
    if (selectedStage === 'Interview Scheduled') return c.appliedFor?.status === 'Interview Scheduled' || c.appliedFor?.status === 'Technical Round';
    return c.appliedFor?.status === selectedStage;
  });

  return (
    <div className="space-y-4">
      {/* Search & Pipeline Stages Filter */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search applicant by candidate name, role, or university..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
            <span>Showing {filteredCandidates.length} applicants</span>
          </div>
        </div>

        {/* Stage Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
          {stages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedStage === stage.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <span>{stage.label}</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
                selectedStage === stage.id
                  ? 'bg-indigo-700 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {stage.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table / Cards */}
      <div className="space-y-3">
        {filteredCandidates.map((candidate) => (
          <Card
            key={candidate.id}
            variant="default"
            className="p-4 sm:p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Candidate & Role Info */}
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 border-2 border-indigo-500/20 shrink-0">
                <img
                  src={candidate.avatarUrl}
                  alt={candidate.fullName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4
                    onClick={() => onSelectCandidate(candidate)}
                    className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 cursor-pointer"
                  >
                    {candidate.fullName}
                  </h4>
                  {candidate.isShortlisted && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                      Shortlisted
                    </span>
                  )}
                  <Badge variant="primary" size="sm" className="text-[10px]">
                    {candidate.appliedFor?.status || 'Under Review'}
                  </Badge>
                </div>

                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                  Applied for: {candidate.appliedFor?.jobTitle || candidate.targetRole}
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 mt-1">
                  <span>{candidate.institution}</span>
                  <span>•</span>
                  <span>CGPA {candidate.cgpa}</span>
                  <span>•</span>
                  <span>Applied on {candidate.appliedFor?.appliedDate || 'Aug 16, 2026'}</span>
                </div>
              </div>
            </div>

            {/* Skills & Match Score & Actions */}
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between md:justify-end gap-3 shrink-0">
              {/* Match Score */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
                <Zap className="w-3.5 h-3.5" />
                <span className="text-xs font-black">{candidate.matchScore}% Match</span>
              </div>

              {/* Shortlist star */}
              <button
                type="button"
                onClick={() => onToggleShortlist(candidate.id)}
                className={`p-2 rounded-xl border transition-all ${
                  candidate.isShortlisted
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-600 dark:text-amber-400'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500'
                }`}
                title={candidate.isShortlisted ? 'Remove shortlist' : 'Shortlist'}
              >
                <Star className={`w-4 h-4 ${candidate.isShortlisted ? 'fill-amber-500' : ''}`} />
              </button>

              {/* View candidate detail */}
              <Button
                variant="primary"
                size="sm"
                onClick={() => onSelectCandidate(candidate)}
                className="text-xs"
              >
                Audit & Interview
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
