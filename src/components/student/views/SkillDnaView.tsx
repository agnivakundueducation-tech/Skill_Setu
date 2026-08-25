import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { SkillDnaItem, SkillDnaOverallMetrics, EvidenceArtifact } from '../../../types/skillDna';
import { getComputedSkillDnaData } from '../../../data/skillDnaData';
import { useAuth } from '../../../context/AuthContext';
import {
  firestoreService,
  formatPersistedProfileToSkillDna,
  PersistedSkillProfile
} from '../../../services';
import { SkillDnaRadarSection } from '../skill-dna/SkillDnaRadarSection';
import { SkillDnaCard } from '../skill-dna/SkillDnaCard';
import { SkillDnaEvidenceModal } from '../skill-dna/SkillDnaEvidenceModal';
import { SkillDnaAnalyticsMatrix } from '../skill-dna/SkillDnaAnalyticsMatrix';
import { Card, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { ProgressBar } from '../../ui/ProgressBar';
import {
  Dna,
  ShieldCheck,
  Sparkles,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  CheckCircle2,
  FileCheck,
  Zap,
  TrendingUp,
  Brain,
  Code2,
  Layers,
  Award,
  Compass,
  FileText,
  Share2,
  ArrowRight,
  Clock
} from 'lucide-react';

interface SkillDnaViewProps {
  onTakeAssessment?: (skillName?: string) => void;
  onExploreOpportunities?: () => void;
}

export const SkillDnaView: React.FC<SkillDnaViewProps> = ({
  onTakeAssessment,
  onExploreOpportunities
}) => {
  const { appUser, isAuthenticated, isDemo } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasProfile, setHasProfile] = useState<boolean>(true);

  // Skill data state
  const [{ items: allSkills, metrics }, setSkillData] = useState(() => getComputedSkillDnaData());

  const loadData = useCallback(async () => {
    if (isAuthenticated && !isDemo && appUser?.uid) {
      setIsLoading(true);
      try {
        const res = await firestoreService.getSkillProfile(appUser.uid);
        if (res.success && res.data) {
          const formatted = formatPersistedProfileToSkillDna(res.data);
          setSkillData(formatted);
          setHasProfile(true);
        } else {
          // Check if local draft assessment exists
          const localProfileRaw = localStorage.getItem(`skillsetu_skill_profile_${appUser.uid}`);
          if (localProfileRaw) {
            try {
              const parsed: PersistedSkillProfile = JSON.parse(localProfileRaw);
              setSkillData(formatPersistedProfileToSkillDna(parsed));
              setHasProfile(true);
            } catch {
              setHasProfile(false);
            }
          } else {
            setHasProfile(false);
          }
        }
      } catch (err) {
        console.error('Failed to load skill profile from Firestore:', err);
        setHasProfile(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Demo Mode or unauthenticated: use deterministic mock computed data
      setSkillData(getComputedSkillDnaData());
      setHasProfile(true);
    }
  }, [isAuthenticated, isDemo, appUser?.uid]);

  // Listen to changes in localStorage or re-sync
  useEffect(() => {
    loadData();

    const handleStorageChange = () => {
      loadData();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadData]);

  // Filter & Search states
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'all' | 'technical' | 'professional'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'verified' | 'current' | 'evidence' | 'name'>('verified');

  // Modal states
  const [selectedSkillForEvidence, setSelectedSkillForEvidence] = useState<SkillDnaItem | null>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<EvidenceArtifact | null>(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [showExportToast, setShowExportToast] = useState(false);

  // Filtered & Sorted skills
  const filteredSkills = useMemo(() => {
    return allSkills
      .filter((skill) => {
        if (selectedCategoryTab !== 'all' && skill.category !== selectedCategoryTab) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = skill.name.toLowerCase().includes(q);
          const matchesSub = skill.subcategory?.toLowerCase().includes(q);
          const matchesComp = skill.keyCompetencies.some((c) => c.toLowerCase().includes(q));
          return matchesName || matchesSub || matchesComp;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'verified') return b.verificationScore - a.verificationScore;
        if (sortBy === 'current') return b.currentScore - a.currentScore;
        if (sortBy === 'evidence') return b.evidenceCount - a.evidenceCount;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [allSkills, selectedCategoryTab, searchQuery, sortBy]);

  const technicalSkills = useMemo(
    () => filteredSkills.filter((s) => s.category === 'technical'),
    [filteredSkills]
  );

  const professionalSkills = useMemo(
    () => filteredSkills.filter((s) => s.category === 'professional'),
    [filteredSkills]
  );

  const handleOpenEvidenceModal = (skill: SkillDnaItem, artifact?: EvidenceArtifact) => {
    setSelectedSkillForEvidence(skill);
    setSelectedArtifact(artifact || null);
    setIsEvidenceModalOpen(true);
  };

  const handleExportTranscript = () => {
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 4000);
  };

  // If authenticated student hasn't generated Skill DNA yet (Section 11)
  if (isAuthenticated && !isDemo && !isLoading && !hasProfile) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-200">
        <Card variant="default" className="p-8 sm:p-12 text-center border-indigo-200/80 dark:border-indigo-900/60 shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-6 border border-indigo-100 dark:border-indigo-900 shadow-xs">
            <Dna className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Your Skill DNA hasn&apos;t been generated yet.
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-8 leading-relaxed">
            Complete your comprehensive 5-step adaptive skill assessment to generate your verified Skill DNA matrix, benchmark your capabilities against industry standards, and discover personalized career pathways.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              leftIcon={Brain}
              rightIcon={ArrowRight}
              className="w-full sm:w-auto font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => onTakeAssessment && onTakeAssessment()}
            >
              Complete Skill Assessment
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {showExportToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-indigo-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Skill DNA Transcript Exported</p>
            <p className="text-[11px] text-slate-300">Cryptographically verifiable matrix PDF generated.</p>
          </div>
        </div>
      )}

      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0">
            <Dna className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Verified Skill DNA Architecture
              </h1>
              <Badge variant="primary" size="sm">
                {isAuthenticated && !isDemo ? 'Cloud Synchronized' : 'Interactive Prototype'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Multi-dimensional competency matrix benchmarked against 5,000+ verified engineering roles.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={Download}
            onClick={handleExportTranscript}
            className="text-xs text-slate-700 dark:text-slate-300"
          >
            Export Matrix
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={Brain}
            onClick={() => onTakeAssessment && onTakeAssessment()}
            className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Retake Assessment
          </Button>
        </div>
      </div>

      {/* Radar Section & Overall Readiness Metrics */}
      <SkillDnaRadarSection
        metrics={metrics}
        skills={allSkills}
        onTakeAssessment={onTakeAssessment}
        onExploreOpportunities={onExploreOpportunities}
      />

      {/* Category Tabs, Search & Sort Control Bar */}
      <Card variant="default" className="p-4 border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start">
            <button
              type="button"
              onClick={() => setSelectedCategoryTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategoryTab === 'all'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              All Skills ({allSkills.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategoryTab('technical')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategoryTab === 'technical'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Technical ({allSkills.filter((s) => s.category === 'technical').length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategoryTab('professional')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategoryTab === 'professional'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Professional ({allSkills.filter((s) => s.category === 'professional').length})
            </button>
          </div>

          {/* Search Input & Sort Dropdown */}
          <div className="flex items-center gap-2 flex-1 md:max-w-md justify-end">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search skills, competencies, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort skills by"
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="verified">Sort: Verification</option>
                <option value="current">Sort: Current Score</option>
                <option value="evidence">Sort: Evidence Count</option>
                <option value="name">Sort: Alphabetical</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* ======================= TECHNICAL SKILLS SECTION (7 Skills) ======================= */}
      {(selectedCategoryTab === 'all' || selectedCategoryTab === 'technical') && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  Technical Architecture & Engineering
                  <Badge variant="primary" size="sm">
                    7 Core Disciplines
                  </Badge>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Programming, Algorithms, Web Systems, Databases, Cloud Infrastructure, AI/ML, and Cybersecurity
                </p>
              </div>
            </div>

            <span className="text-xs text-slate-400">
              Avg Score: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{metrics.technicalAverage}/100</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technicalSkills.map((skill) => (
              <SkillDnaCard
                key={skill.id}
                skill={skill}
                onViewEvidence={handleOpenEvidenceModal}
                onVerifySkill={(s) => {
                  if (onTakeAssessment) {
                    onTakeAssessment(s.name);
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ======================= PROFESSIONAL SKILLS SECTION (4 Skills) ======================= */}
      {(selectedCategoryTab === 'all' || selectedCategoryTab === 'professional') && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  Professional & Leadership Skills
                  <Badge variant="success" size="sm">
                    4 Core Disciplines
                  </Badge>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Communication, Teamwork, Leadership, and Problem Solving
                </p>
              </div>
            </div>

            <span className="text-xs text-slate-400">
              Avg Score: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{metrics.professionalAverage}/100</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {professionalSkills.map((skill) => (
              <SkillDnaCard
                key={skill.id}
                skill={skill}
                onViewEvidence={handleOpenEvidenceModal}
                onVerifySkill={(s) => {
                  if (onTakeAssessment) {
                    onTakeAssessment(s.name);
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Professional Analytics Matrix Section */}
      <div className="pt-2">
        <SkillDnaAnalyticsMatrix skills={allSkills} metrics={metrics} />
      </div>

      {/* Evidence Inspection Modal */}
      <SkillDnaEvidenceModal
        isOpen={isEvidenceModalOpen}
        skill={selectedSkillForEvidence}
        selectedArtifact={selectedArtifact}
        onClose={() => setIsEvidenceModalOpen(false)}
        onTakeAssessment={(skillName) => {
          setIsEvidenceModalOpen(false);
          if (onTakeAssessment) {
            onTakeAssessment(skillName);
          }
        }}
      />
    </div>
  );
};
