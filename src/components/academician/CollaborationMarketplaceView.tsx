import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  CollaborationOpportunity,
  FacultyProfile,
  CollaborationType,
  CollaborationProposal,
  CollaborationMatchResult
} from '../../types/collaboration';
import { CollaborationCard } from './CollaborationCard';
import { CollaborationDetailModal } from './CollaborationDetailModal';
import { calculateCollaborationMatch } from '../../services/collaborationMatchingService';
import {
  Search,
  Filter,
  Sparkles,
  Building2,
  BookOpen,
  GraduationCap,
  Briefcase,
  Users,
  Compass,
  CheckCircle2,
  RefreshCw,
  Flame,
  Award,
  Cpu
} from 'lucide-react';

interface CollaborationMarketplaceViewProps {
  collaborations: CollaborationOpportunity[];
  facultyProfile: FacultyProfile | null;
  appliedCollaborationIds: string[];
  onSubmitApplication: (
    collaboration: CollaborationOpportunity,
    proposal: CollaborationProposal,
    matchResult: CollaborationMatchResult
  ) => Promise<{ success: boolean; error?: string }>;
  onRefresh: () => void;
  isLoading?: boolean;
}

const COLLABORATION_TYPES: { id: CollaborationType | 'All'; label: string; icon: any }[] = [
  { id: 'All', label: 'All Collaborations', icon: Compass },
  { id: 'Faculty Internship', label: 'Faculty Internships', icon: Briefcase },
  { id: 'Research Collaboration', label: 'Research & Grants', icon: Cpu },
  { id: 'FDP', label: 'FDP Programs', icon: BookOpen },
  { id: 'Live Project', label: 'Live Projects', icon: Flame },
  { id: 'Guest Lecture', label: 'Guest Lectures', icon: GraduationCap },
  { id: 'Mentorship', label: 'Mentorship', icon: Users },
  { id: 'Consultancy', label: 'Consultancy', icon: Award },
  { id: 'Industrial Training', label: 'Industrial Training', icon: Building2 },
  { id: 'Innovation Challenge', label: 'Challenges', icon: Sparkles }
];

export const CollaborationMarketplaceView: React.FC<CollaborationMarketplaceViewProps> = ({
  collaborations,
  facultyProfile,
  appliedCollaborationIds,
  onSubmitApplication,
  onRefresh,
  isLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<CollaborationType | 'All'>('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState<'All' | 'Remote' | 'Hybrid' | 'On-Site'>('All');
  const [sortBy, setSortBy] = useState<'match' | 'deadline' | 'newest'>('match');

  // Selected Collaboration for Detail Modal
  const [selectedCollab, setSelectedCollab] = useState<CollaborationOpportunity | null>(null);
  const [selectedMatchResult, setSelectedMatchResult] = useState<CollaborationMatchResult | null>(null);

  // Compute matches and filter/sort
  const processedCollaborations = useMemo(() => {
    return collaborations
      .map((collab) => {
        const matchResult = calculateCollaborationMatch(facultyProfile, collab);
        return {
          collab,
          matchResult
        };
      })
      .filter(({ collab }) => {
        // Type filter
        if (selectedType !== 'All' && collab.collaborationType !== selectedType) {
          return false;
        }
        // Work Mode filter
        if (selectedWorkMode !== 'All' && collab.workMode !== selectedWorkMode) {
          return false;
        }
        // Search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchTitle = collab.title.toLowerCase().includes(query);
          const matchDesc = collab.description.toLowerCase().includes(query);
          const matchInd = collab.industryName.toLowerCase().includes(query);
          const matchReq = collab.requiredExpertise.some(e => e.toLowerCase().includes(query));
          const matchPref = (collab.preferredExpertise || []).some(e => e.toLowerCase().includes(query));
          if (!matchTitle && !matchDesc && !matchInd && !matchReq && !matchPref) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'match') {
          return b.matchResult.overallMatch - a.matchResult.overallMatch;
        }
        if (sortBy === 'deadline') {
          return new Date(a.collab.applicationDeadline).getTime() - new Date(b.collab.applicationDeadline).getTime();
        }
        return new Date(b.collab.createdAt).getTime() - new Date(a.collab.createdAt).getTime();
      });
  }, [collaborations, facultyProfile, selectedType, selectedWorkMode, searchQuery, sortBy]);

  const handleSelectCollab = (collab: CollaborationOpportunity, matchResult: CollaborationMatchResult) => {
    setSelectedCollab(collab);
    setSelectedMatchResult(matchResult);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-850 to-slate-900 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academia–Industry Collaboration Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Explore Faculty Industry Immersion & R&D Opportunities
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
            Connect directly with leading tech and enterprise partners for faculty internships, sponsored research grants, FDP programs, guest lectures, and live capstone projects.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            isLoading={isLoading}
            leftIcon={RefreshCw}
            className="text-white border-indigo-700 hover:bg-indigo-800/50 bg-indigo-950/40"
          >
            Refresh Hub
          </Button>
        </div>
      </div>

      {/* Actionable Academician Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold shrink-0 mt-0.5">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300">Cohort Skill Alert</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-200/80 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200">18 Students</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                18 students in Semester 6 are below the target competency for Data Structures & Cloud Deployment.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 shrink-0 self-center">
            Needs Review
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/50 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">AI Collaboration Match</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-200/80 dark:bg-indigo-900/80 text-indigo-800 dark:text-indigo-200">94% Fit</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                2 sponsored research opportunities and 1 FDP program closely align with your verified faculty expertise.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 shrink-0 self-center">
            3 Matches
          </span>
        </div>
      </div>

      {/* Type Filter Pills Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {COLLABORATION_TYPES.map((typeObj) => {
          const Icon = typeObj.icon;
          const isSelected = selectedType === typeObj.id;
          return (
            <button
              key={typeObj.id}
              onClick={() => setSelectedType(typeObj.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{typeObj.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Refine Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, industry partner, or required skill (e.g. Generative AI, PyTorch, Cloud)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Work Mode Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Work Modes (Remote/Hybrid/On-Site)</option>
              <option value="Remote">Remote Only</option>
              <option value="Hybrid">Hybrid Engagement</option>
              <option value="On-Site">On-Site Immersion</option>
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="match">Sort: Highest Match Score First</option>
              <option value="deadline">Sort: Application Deadline (Soonest)</option>
              <option value="newest">Sort: Newly Published</option>
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span>
            Showing <strong>{processedCollaborations.length}</strong> available collaboration opportunities
          </span>

          {(searchQuery || selectedType !== 'All' || selectedWorkMode !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('All');
                setSelectedWorkMode('All');
              }}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Collaboration Cards Grid */}
      {processedCollaborations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {processedCollaborations.map(({ collab, matchResult }) => {
            const isApplied = appliedCollaborationIds.includes(collab.collaborationId);
            return (
              <CollaborationCard
                key={collab.collaborationId}
                collaboration={collab}
                facultyProfile={facultyProfile}
                onSelect={(c, m) => handleSelectCollab(c, m)}
                isApplied={isApplied}
                appliedStatus={isApplied ? 'Application Active' : undefined}
              />
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No matching collaborations found
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search terms or resetting the collaboration type filters to see all available industry opportunities.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedType('All');
              setSelectedWorkMode('All');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Collaboration Detail & Application Modal */}
      {selectedCollab && selectedMatchResult && (
        <CollaborationDetailModal
          isOpen={Boolean(selectedCollab)}
          onClose={() => {
            setSelectedCollab(null);
            setSelectedMatchResult(null);
          }}
          collaboration={selectedCollab}
          facultyProfile={facultyProfile}
          matchResult={selectedMatchResult}
          onSubmitApplication={onSubmitApplication}
          isAlreadyApplied={appliedCollaborationIds.includes(selectedCollab.collaborationId)}
        />
      )}
    </div>
  );
};
