import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { IndustryCandidate } from '../../types/industry';
import {
  Search,
  Filter,
  Star,
  ShieldCheck,
  FolderGit2,
  Award,
  Zap,
  ChevronRight,
  ExternalLink,
  Github,
  Calendar,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
  GraduationCap,
  Briefcase
} from 'lucide-react';

interface CandidateListProps {
  candidates: IndustryCandidate[];
  onToggleShortlist: (candidateId: string) => void;
  onSelectCandidate: (candidate: IndustryCandidate) => void;
  filterShortlistedOnly?: boolean;
}

export const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  onToggleShortlist,
  onSelectCandidate,
  filterShortlistedOnly = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScoreFilter, setSelectedScoreFilter] = useState<'all' | '90plus' | '80plus'>('all');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [isShortlistFilterActive, setIsShortlistFilterActive] = useState(filterShortlistedOnly);

  // Derive unique roles
  const roleOptions = useMemo(() => {
    const roles = Array.from(new Set(candidates.map((c) => c.targetRole)));
    return ['all', ...roles];
  }, [candidates]);

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((cand) => {
      // Search query filter
      const matchesSearch =
        searchQuery === '' ||
        cand.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cand.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cand.targetRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cand.skills.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        cand.projects.some((p) => p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      // Score filter
      let matchesScore = true;
      if (selectedScoreFilter === '90plus') {
        matchesScore = cand.matchScore >= 90;
      } else if (selectedScoreFilter === '80plus') {
        matchesScore = cand.matchScore >= 80;
      }

      // Role filter
      const matchesRole = selectedRoleFilter === 'all' || cand.targetRole === selectedRoleFilter;

      // Shortlisted filter
      const matchesShortlist = !isShortlistFilterActive || cand.isShortlisted;

      return matchesSearch && matchesScore && matchesRole && matchesShortlist;
    });
  }, [candidates, searchQuery, selectedScoreFilter, selectedRoleFilter, isShortlistFilterActive]);

  const getMatchScoreBadge = (score: number) => {
    if (score >= 90) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
          <Zap className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
          <span className="text-sm font-black">{score}% Match</span>
        </div>
      );
    }
    if (score >= 80) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
          <Zap className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-sm font-black">{score}% Match</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300">
        <Zap className="w-3.5 h-3.5 text-amber-500" />
        <span className="text-sm font-black">{score}% Match</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header & Filter Controls Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search talent by name, skill (Go, React, Redis), project, or university..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Shortlisted Toggle */}
            <button
              onClick={() => setIsShortlistFilterActive(!isShortlistFilterActive)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                isShortlistFilterActive
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isShortlistFilterActive ? 'fill-white' : ''}`} />
              <span>Shortlisted ({candidates.filter((c) => c.isShortlisted).length})</span>
            </button>

            {/* Score Threshold Filter */}
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-0.5 text-xs font-bold">
              <button
                onClick={() => setSelectedScoreFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedScoreFilter === 'all'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                All Scores
              </button>
              <button
                onClick={() => setSelectedScoreFilter('80plus')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedScoreFilter === '80plus'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                &ge; 80% Match
              </button>
              <button
                onClick={() => setSelectedScoreFilter('90plus')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedScoreFilter === '90plus'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                &ge; 90% Match
              </button>
            </div>
          </div>
        </div>

        {/* Roles Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Target Role:
          </span>
          {roleOptions.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRoleFilter(role)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedRoleFilter === role
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {role === 'all' ? 'All Roles' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Cards List */}
      {filteredCandidates.length === 0 ? (
        <Card variant="default" className="p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            No candidates matched your filter criteria
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or lowering the match score threshold to view more talent profiles.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedScoreFilter('all');
              setSelectedRoleFilter('all');
              setIsShortlistFilterActive(false);
            }}
          >
            Reset All Filters
          </Button>
        </Card>
      ) : (
        <div className="space-y-3.5">
          {filteredCandidates.map((candidate) => (
            <Card
              key={candidate.id}
              variant="default"
              className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all hover:shadow-md space-y-4"
            >
              {/* Top Row: Candidate Bio + Match Score + Action Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-13 h-13 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 border-2 border-indigo-500/20 shrink-0">
                    <img
                      src={candidate.avatarUrl}
                      alt={candidate.fullName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        onClick={() => onSelectCandidate(candidate)}
                        className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
                      >
                        {candidate.fullName}
                      </h3>

                      {candidate.isShortlisted && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          Shortlisted
                        </span>
                      )}

                      {candidate.appliedFor && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {candidate.appliedFor.jobType === 'internship' ? 'Internship Applicant' : 'Job Applicant'}
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {candidate.targetRole}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {candidate.institution}
                      </span>
                      <span>•</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">CGPA: {candidate.cgpa}</span>
                      <span>•</span>
                      <span>{candidate.graduationBatch}</span>
                    </div>
                  </div>
                </div>

                {/* Match Score & Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {getMatchScoreBadge(candidate.matchScore)}

                  <button
                    type="button"
                    onClick={() => onToggleShortlist(candidate.id)}
                    className={`p-2 rounded-xl border transition-all ${
                      candidate.isShortlisted
                        ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-600 dark:text-amber-400'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500'
                    }`}
                    title={candidate.isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
                  >
                    <Star className={`w-4 h-4 ${candidate.isShortlisted ? 'fill-amber-500' : ''}`} />
                  </button>

                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={ChevronRight}
                    onClick={() => onSelectCandidate(candidate)}
                    className="text-xs font-semibold"
                  >
                    View Candidate
                  </Button>
                </div>
              </div>

              {/* Middle Section: Skills & Compatibility Preview */}
              <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Verified Skills ({candidate.skills.length})
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Algorithmic compatibility verified
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700"
                    >
                      <span>{skill.name}</span>
                      {skill.verified && (
                        <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                      )}
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 ml-0.5">
                        {skill.score}%
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Row: Key Projects & Certifications Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {/* Projects Highlights */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <span className="flex items-center gap-1">
                      <FolderGit2 className="w-3.5 h-3.5 text-indigo-500" />
                      Key Projects ({candidate.projects.length})
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {candidate.projects.slice(0, 2).map((proj) => (
                      <div key={proj.id} className="text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                            {proj.title}
                            {proj.starsCount && (
                              <span className="text-[10px] text-amber-500 font-bold flex items-center">
                                ★ {proj.starsCount}
                              </span>
                            )}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {proj.tagline}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications Highlights */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      Verified Certifications ({candidate.certifications.length})
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {candidate.certifications.slice(0, 2).map((cert) => (
                      <div key={cert.id} className="text-xs">
                        <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                          <span className="truncate pr-2">{cert.title}</span>
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                            {cert.badgeLevel}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {cert.issuer} {cert.gradeScore && `• ${cert.gradeScore}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
