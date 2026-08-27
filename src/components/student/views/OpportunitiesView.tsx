import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { STUDENT_OPPORTUNITIES } from '../../../data/studentData';
import { Opportunity } from '../../../types/student';
import { OpportunityDetailModal } from '../OpportunityDetailModal';
import { OpportunityDetailsView } from './OpportunityDetailsView';
import { useAuth } from '../../../context/AuthContext';
import { getOpportunities } from '../../../services/opportunityService';
import { OpportunityRecord } from '../../../types/opportunity';
import { firestoreService } from '../../../services/firestoreService';
import { PersistedSkillProfile } from '../../../services/skillService';
import { calculateOpportunityMatch } from '../../../services/matchingService';
import {
  calculateDeterministicOpportunityMatch,
  resolveSkillData
} from '../../../utils/deterministicScoring';
import {
  Compass,
  Search,
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  Send,
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  SlidersHorizontal,
  Bookmark,
  BookmarkCheck,
  Eye,
  X,
  RotateCcw,
  TrendingUp,
  ShieldCheck,
  ArrowUpDown,
  Filter,
  DollarSign,
  GraduationCap
} from 'lucide-react';

interface OpportunitiesViewProps {
  onApplyOpportunity?: (opportunity: Opportunity) => void;
  onNavigateToApplications?: () => void;
  onNavigateToAssessment?: () => void;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  onApplyOpportunity,
  onNavigateToApplications,
  onNavigateToAssessment
}) => {
  const { appUser, user, isAuthenticated, isDemo } = useAuth();
  const [skillProfile, setSkillProfile] = useState<PersistedSkillProfile | null>(null);
  const [opportunitiesList, setOpportunitiesList] = useState<Opportunity[]>(STUDENT_OPPORTUNITIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [minMatchScore, setMinMatchScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'match' | 'deadline' | 'applicants' | 'recent'>('match');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set(['opp-1', 'opp-3']));
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);

  // Detail states: Modal vs Full Page View
  const [detailOpportunity, setDetailOpportunity] = useState<Opportunity | null>(null);
  const [fullViewOpportunity, setFullViewOpportunity] = useState<Opportunity | null>(null);

  const userId = appUser?.uid || user?.id;

  // 1. Fetch authenticated student's Skill Profile
  useEffect(() => {
    let isMounted = true;
    if (userId && !isDemo) {
      firestoreService.getSkillProfile(userId)
        .then((res) => {
          if (isMounted && res.success && res.data) {
            setSkillProfile(res.data);
          }
        })
        .catch((err) => console.warn('[OpportunitiesView] Error fetching skill profile:', err));
    }
    return () => {
      isMounted = false;
    };
  }, [userId, isDemo]);

  // 2. Fetch opportunities and calculate real match scores
  useEffect(() => {
    let isMounted = true;
    getOpportunities({ isDemo: isDemo || !isAuthenticated }).then((res) => {
      if (isMounted && res.success && res.data && res.data.length > 0) {
        // Map OpportunityRecords into Opportunity UI objects with real calculated match score
        const mappedRecords: Opportunity[] = res.data.map((rec) => {
          const calculated = calculateOpportunityMatch(rec, skillProfile, { isDemo: isDemo || !isAuthenticated });
          return {
            id: rec.opportunityId,
            title: rec.title,
            company: rec.companyName,
            companyLogo: rec.companyLogo,
            type: (rec.opportunityType as any) || 'Internship',
            location: rec.location,
            mode: (rec.workMode as any) || 'Hybrid',
            stipend: rec.stipend,
            deadline: rec.applicationDeadline,
            deadlineDate: rec.applicationDeadline,
            matchScore: calculated.overallMatch,
            applicantsCount: 12,
            openings: 2,
            postedDate: 'Recently',
            description: rec.description,
            skillsRequired: rec.requiredSkills.map((s) => s.skillName),
            requiredSkills: rec.requiredSkills,
            preferredSkills: rec.preferredSkills,
            eligibility: rec.eligibility,
            experienceLevel: rec.experienceLevel as any,
            domain: rec.domain,
            postedBy: rec.postedBy,
            responsibilities: [
              'Design and build high-reliability scalable features.',
              'Collaborate closely with engineering and cross-functional teams.'
            ],
            eligibilityDetails: [
              'B.Tech / MCA / Equivalent degree in relevant discipline.',
              'Demonstrated practical problem-solving capabilities.'
            ],
            perks: ['Industry Mentorship', 'Flexible Hours', 'Certificate of Completion']
          };
        });

        // Merge mappedRecords with STUDENT_OPPORTUNITIES (deduping by id)
        const existingIds = new Set(mappedRecords.map((m) => m.id));
        const remainingStatic = STUDENT_OPPORTUNITIES
          .filter((s) => !existingIds.has(s.id))
          .map((s) => {
            const calculated = calculateOpportunityMatch(s, skillProfile, { isDemo: isDemo || !isAuthenticated });
            return {
              ...s,
              matchScore: calculated.overallMatch
            };
          });

        setOpportunitiesList([...mappedRecords, ...remainingStatic]);
      }
    }).catch((err) => {
      console.warn('[OpportunitiesView] Error fetching opportunities:', err);
    });
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isDemo, skillProfile]);

  const isUnassessed = !isDemo && isAuthenticated && (!skillProfile?.skills || Object.keys(skillProfile.skills).length === 0);

  // Extract unique filter options from data
  const opportunityTypes = useMemo(() => {
    const set = new Set<string>(['All']);
    opportunitiesList.forEach((o) => set.add(o.type));
    return Array.from(set);
  }, [opportunitiesList]);

  const workModes = ['All', 'Remote', 'Hybrid', 'On-site'];

  const locations = useMemo(() => {
    const locs = new Set<string>(['All']);
    opportunitiesList.forEach((o) => {
      if (o.city) locs.add(o.city);
    });
    return Array.from(locs);
  }, [opportunitiesList]);

  const popularSkills = useMemo(() => {
    const skillCounts: Record<string, number> = {};
    opportunitiesList.forEach((o) => {
      o.skillsRequired?.forEach((s) => {
        skillCounts[s] = (skillCounts[s] || 0) + 1;
      });
    });
    return Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([s]) => s);
  }, [opportunitiesList]);

  // Filter and sort opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunitiesList.filter((opp) => {
      // Deterministic match calculation for consistent scoring
      const matchResult = calculateDeterministicOpportunityMatch(
        opp,
        undefined,
        skillProfile,
        isDemo || !isAuthenticated
      );
      const effectiveScore = matchResult.matchScore;

      // Search query filter (title, company, skills, description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(query);
        const matchesCompany = opp.company.toLowerCase().includes(query);
        const matchesDescription = opp.description.toLowerCase().includes(query);
        const matchesSkills = opp.skillsRequired.some((s) => s.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCompany && !matchesDescription && !matchesSkills) {
          return false;
        }
      }

      // Opportunity Type
      if (selectedType !== 'All' && opp.type !== selectedType) {
        return false;
      }

      // Work Mode
      if (selectedMode !== 'All' && opp.mode !== selectedMode) {
        return false;
      }

      // Location / City
      if (selectedLocation !== 'All' && opp.city !== selectedLocation) {
        return false;
      }

      // Skill Filter
      if (selectedSkill !== 'All' && !opp.skillsRequired.includes(selectedSkill)) {
        return false;
      }

      // Minimum Match Score Filter
      if (minMatchScore > 0 && effectiveScore < minMatchScore) {
        return false;
      }

      // Bookmarked filter
      if (showOnlyBookmarked && !bookmarkedIds.has(opp.id)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const scoreA = calculateDeterministicOpportunityMatch(
        a,
        undefined,
        skillProfile,
        isDemo || !isAuthenticated
      ).matchScore;
      const scoreB = calculateDeterministicOpportunityMatch(
        b,
        undefined,
        skillProfile,
        isDemo || !isAuthenticated
      ).matchScore;

      if (sortBy === 'match') {
        return scoreB - scoreA;
      }
      if (sortBy === 'applicants') {
        return a.applicantsCount - b.applicantsCount;
      }
      if (sortBy === 'deadline') {
        return (a.deadlineDate || a.deadline).localeCompare(b.deadlineDate || b.deadline);
      }
      return 0;
    });
  }, [
    opportunitiesList,
    skillProfile,
    isDemo,
    isAuthenticated,
    searchQuery,
    selectedType,
    selectedMode,
    selectedLocation,
    selectedSkill,
    minMatchScore,
    sortBy,
    showOnlyBookmarked,
    bookmarkedIds
  ]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedMode('All');
    setSelectedLocation('All');
    setSelectedSkill('All');
    setMinMatchScore(0);
    setSortBy('match');
    setShowOnlyBookmarked(false);
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedType !== 'All' ||
    selectedMode !== 'All' ||
    selectedLocation !== 'All' ||
    selectedSkill !== 'All' ||
    minMatchScore > 0 ||
    showOnlyBookmarked;

  // If a full view opportunity is selected, show Full Detail View
  if (fullViewOpportunity) {
    return (
      <OpportunityDetailsView
        opportunity={fullViewOpportunity}
        onBack={() => setFullViewOpportunity(null)}
        onApply={(opp) => {
          if (onApplyOpportunity) {
            onApplyOpportunity(opp);
          }
        }}
        isBookmarked={bookmarkedIds.has(fullViewOpportunity.id)}
        onToggleBookmark={toggleBookmark}
        studentProfile={skillProfile}
        isDemo={isDemo || !isAuthenticated}
        onNavigateToAssessment={onNavigateToAssessment}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Opportunities Marketplace</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time internships, hackathons, and research fellowships deterministically matched to your verified Skill DNA.
          </p>
        </div>

        {/* Top actions: View Applications & Bookmarks quick filter */}
        <div className="flex items-center gap-2.5">
          {onNavigateToApplications && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={Briefcase}
              onClick={onNavigateToApplications}
              className="text-xs"
            >
              My Applications
            </Button>
          )}

          <Button
            variant={showOnlyBookmarked ? 'primary' : 'outline'}
            size="sm"
            leftIcon={BookmarkCheck}
            onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
            className="text-xs"
          >
            {showOnlyBookmarked ? 'Showing Saved' : `Saved (${bookmarkedIds.size})`}
          </Button>
        </div>
      </div>

      {/* Unassessed Skill Profile Callout Banner */}
      {isUnassessed && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Complete your Skill Assessment to calculate opportunity matches</h4>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                Your deterministic skill DNA is required to evaluate compatibility scores and unlock fast-track job matching.
              </p>
            </div>
          </div>
          {onNavigateToAssessment && (
            <Button
              variant="primary"
              size="sm"
              onClick={onNavigateToAssessment}
              className="shrink-0 text-xs bg-amber-600 hover:bg-amber-700 text-white border-none shadow-xs"
            >
              Take Assessment
            </Button>
          )}
        </div>
      )}

      {/* Search and Primary Filters Bar */}
      <Card variant="default" className="p-4 space-y-4 border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, company, skills (e.g., Python, React)..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Opportunity Type Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {opportunityTypes.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Formats' : t}
                </option>
              ))}
            </select>

            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {workModes.map((m) => (
                <option key={m} value={m}>
                  {m === 'All' ? 'All Modes' : m}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
            >
              <option value="match">Highest Match %</option>
              <option value="deadline">Expiring Soon</option>
              <option value="applicants">Fewest Applicants</option>
            </select>
          </div>
        </div>

        {/* Popular Skills Quick-Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter by Skill:
          </span>
          <button
            onClick={() => setSelectedSkill('All')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedSkill === 'All'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Skills
          </button>
          {popularSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(selectedSkill === skill ? 'All' : skill)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedSkill === skill
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {skill}
            </button>
          ))}

          {/* Reset Filters Shortcut */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="ml-auto text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Clear Filters
            </button>
          )}
        </div>
      </Card>

      {/* Results Count & Active Status Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Showing {filteredOpportunities.length} of {opportunitiesList.length} opportunities
          </span>
          {hasActiveFilters && (
            <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full font-medium text-[11px]">
              Filtered
            </span>
          )}
        </div>

        {filteredOpportunities.length > 0 && (
          <div className="text-[11px] text-slate-400 hidden sm:block">
            Deterministic Skill Compatibility Engine • Fast-Track 1-Click Submissions
          </div>
        )}
      </div>

      {/* Opportunities Card Grid */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOpportunities.map((opp) => {
            const isBookmarked = bookmarkedIds.has(opp.id);
            const matchResult = calculateDeterministicOpportunityMatch(
              opp,
              undefined,
              skillProfile,
              isDemo || !isAuthenticated
            );
            const isHighMatch = matchResult.matchScore >= 90;

            return (
              <Card
                key={opp.id}
                variant="default"
                className="p-5 border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-700 transition-all hover:shadow-md flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Featured indicator banner */}
                {opp.featured && (
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
                    <div className="absolute transform rotate-45 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] font-extrabold py-0.5 right-[-35px] top-[18px] w-[120px] text-center shadow-xs">
                      FEATURED
                    </div>
                  </div>
                )}

                <div>
                  {/* Card Header: Company Logo, Name, Match Percentage, Bookmark */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={opp.companyLogo}
                        alt={opp.company}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0 bg-white shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" />
                            {opp.company}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] text-slate-400">{opp.type}</span>
                        </div>
                        <h3
                          onClick={() => setFullViewOpportunity(opp)}
                          className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 cursor-pointer"
                        >
                          {opp.title}
                        </h3>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isUnassessed ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending Assessment</span>
                        </div>
                      ) : (
                        <div
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-bold ${
                            isHighMatch
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                              : matchResult.matchScore >= 75
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
                              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{matchResult.matchScore}% Match</span>
                        </div>
                      )}

                      {/* Bookmark Button */}
                      <button
                        onClick={() => toggleBookmark(opp.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isBookmarked
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-500 border-amber-300'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-600'
                        }`}
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark opportunity'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Metadata Row: Location, Mode, Stipend, Deadline */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-indigo-500" />
                      {opp.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-indigo-500" />
                      {opp.mode}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {opp.stipend}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                      <Calendar className="w-3 h-3 text-rose-500" />
                      {opp.deadline}
                    </span>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                    {opp.description}
                  </p>

                  {/* Categorized Required Skills Indicators */}
                  {isUnassessed ? (
                    <div className="space-y-1.5 mb-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                        <span>Required skills: {opp.skillsRequired.join(', ')}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Complete assessment to calculate match
                        </span>
                        {onNavigateToAssessment && (
                          <button
                            onClick={onNavigateToAssessment}
                            className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            Take Assessment →
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        <span>Skills Match Breakdown:</span>
                        <span className="text-indigo-600 dark:text-indigo-400">
                          {matchResult.matchedCount} Matched • {matchResult.partialCount} Partial • {matchResult.missingCount} Missing
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {/* Render Matched Skills (✓) */}
                        {matchResult.matchedSkills.map((s) => (
                          <span
                            key={s.name}
                            className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          >
                            <span className="font-bold">✓</span>
                            <span>{s.name}</span>
                          </span>
                        ))}

                        {/* Render Partial Skills (△) */}
                        {matchResult.partialSkills.map((s) => (
                          <span
                            key={s.name}
                            className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                          >
                            <span className="font-bold">△</span>
                            <span>{s.name}</span>
                          </span>
                        ))}

                        {/* Render Missing Skills (✕) */}
                        {matchResult.missingSkills.map((s) => (
                          <span
                            key={s.name}
                            className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                          >
                            <span className="font-bold">✕</span>
                            <span>{s.name}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer: Applicants count + Action Buttons (View Details & Apply) */}
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Users className="w-3.5 h-3.5" />
                    <span>
                      {opp.applicantsCount} applicants ({opp.openings} {opp.openings === 1 ? 'seat' : 'seats'})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Details Action */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs px-2.5 py-1"
                      leftIcon={Eye}
                      onClick={() => setFullViewOpportunity(opp)}
                    >
                      View Details
                    </Button>

                    {/* Apply Action */}
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs px-3 py-1"
                      rightIcon={Send}
                      onClick={() => onApplyOpportunity && onApplyOpportunity(opp)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            No opportunities match your current filter selection
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, clearing specific skill criteria, or broadening your location preferences.
          </p>
          <div className="pt-2">
            <Button variant="primary" size="sm" onClick={handleResetFilters} className="text-xs">
              Reset All Filters
            </Button>
          </div>
        </div>
      )}

      {/* Opportunity Details Modal */}
      <OpportunityDetailModal
        isOpen={detailOpportunity !== null}
        onClose={() => setDetailOpportunity(null)}
        opportunity={detailOpportunity}
        isBookmarked={detailOpportunity ? bookmarkedIds.has(detailOpportunity.id) : false}
        onToggleBookmark={toggleBookmark}
        onOpenFullView={(opp) => setFullViewOpportunity(opp)}
        studentProfile={skillProfile}
        isDemo={isDemo || !isAuthenticated}
        onNavigateToAssessment={onNavigateToAssessment}
        onApply={(opp) => {
          if (onApplyOpportunity) {
            onApplyOpportunity(opp);
          }
        }}
      />
    </div>
  );
};
