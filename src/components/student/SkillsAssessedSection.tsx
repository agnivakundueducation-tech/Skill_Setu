import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { STUDENT_SKILLS_ASSESSED } from '../../data/studentData';
import { SkillAssessed } from '../../types/student';
import {
  Target,
  Search,
  Sparkles,
  TrendingUp,
  Award,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Layers,
  ThumbsUp,
  FolderGit2,
  Calendar
} from 'lucide-react';

interface SkillsAssessedSectionProps {
  onTakeAssessment?: (skillName?: string) => void;
}

export const SkillsAssessedSection: React.FC<SkillsAssessedSectionProps> = ({
  onTakeAssessment
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'score' | 'growth' | 'recent'>('score');

  const categories = ['All', 'Frontend', 'Backend', 'Cloud & DevOps', 'AI & Data', 'System Design', 'Soft Skills'];

  const filteredSkills = useMemo(() => {
    return STUDENT_SKILLS_ASSESSED.filter((skill) => {
      const matchesSearch =
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.verifiedBy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'growth') return b.growth - a.growth;
      return new Date(b.lastAssessed).getTime() - new Date(a.lastAssessed).getTime();
    });
  }, [searchQuery, selectedCategory, sortBy]);

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'Expert':
        return 'success';
      case 'Advanced':
        return 'primary';
      case 'Intermediate':
        return 'info';
      default:
        return 'default';
    }
  };

  const averageScore = Math.round(
    STUDENT_SKILLS_ASSESSED.reduce((acc, s) => acc + s.score, 0) / STUDENT_SKILLS_ASSESSED.length
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Target className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Skills Assessed Registry
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {STUDENT_SKILLS_ASSESSED.length} Verified Competencies ({averageScore}% Avg Mastery)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Evaluated via AI adaptive challenges, proctored code benchmarks, and industry sponsor labs
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={Sparkles}
          onClick={() => onTakeAssessment && onTakeAssessment()}
          className="shrink-0"
        >
          Assess New Skill
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified skills, tech stacks, or issuers..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="text-xs text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="score">Highest Mastery</option>
            <option value="growth">Highest Growth</option>
            <option value="recent">Recently Assessed</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            {cat}
            {cat !== 'All' && (
              <span className="ml-1.5 opacity-70 text-[10px]">
                ({STUDENT_SKILLS_ASSESSED.filter(s => s.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <Card
            key={skill.id}
            variant="default"
            className="p-5 flex flex-col justify-between border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all hover:shadow-md group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {skill.category}
                </span>
                <Badge variant={getLevelBadgeVariant(skill.level) as any} size="sm">
                  {skill.level}
                </Badge>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {skill.name}
              </h4>

              {/* Score Bar */}
              <div className="space-y-1.5 my-3">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-500 dark:text-slate-400">Mastery Index</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                      +{skill.growth}%
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {skill.score}/100
                    </span>
                  </div>
                </div>
                <ProgressBar
                  value={skill.score}
                  color={skill.score >= 90 ? 'emerald' : skill.score >= 80 ? 'indigo' : 'amber'}
                  size="sm"
                />
              </div>

              {/* Verification & Issuer */}
              <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="w-3 h-3 text-indigo-500" />
                    {skill.verificationBadge}
                  </span>
                  <span className="text-[10px] text-slate-400">{skill.assessmentType}</span>
                </div>
                <div className="truncate text-slate-500">
                  By: {skill.verifiedBy}
                </div>
              </div>

              {/* Related projects preview */}
              {skill.relatedProjects && skill.relatedProjects.length > 0 && (
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <FolderGit2 className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">
                    In: {skill.relatedProjects.join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />
                  {skill.endorsements}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {skill.lastAssessed}
                </span>
              </div>
              <button
                onClick={() => onTakeAssessment && onTakeAssessment(skill.name)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
              >
                Re-assess
              </button>
            </div>
          </Card>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <Target className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">No skills found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or select another category filter to explore verified skills.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};
