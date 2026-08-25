import React, { useState } from 'react';
import { SkillGapItem } from '../../../types/skillGap';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { ProgressBar } from '../../ui/ProgressBar';
import {
  Code2,
  Boxes,
  Database,
  Globe,
  Cloud,
  Brain,
  ShieldCheck,
  Zap,
  Layers,
  Award,
  MessageSquare,
  Users,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Target,
  FolderGit2
} from 'lucide-react';

interface SkillGapTableViewProps {
  items: SkillGapItem[];
  onSelectSkill: (skill: SkillGapItem) => void;
  onLaunchAssessment: (skillName: string) => void;
}

// Icon mapping helper
const getSkillIcon = (iconName: string) => {
  switch (iconName) {
    case 'Cloud':
      return Cloud;
    case 'ShieldCheck':
      return ShieldCheck;
    case 'Brain':
      return Brain;
    case 'Zap':
      return Zap;
    case 'Layers':
      return Layers;
    case 'Award':
      return Award;
    case 'MessageSquare':
      return MessageSquare;
    case 'Database':
      return Database;
    case 'Boxes':
      return Boxes;
    case 'Globe':
      return Globe;
    case 'Code2':
      return Code2;
    case 'Users':
      return Users;
    default:
      return Sparkles;
  }
};

export const SkillGapTableView: React.FC<SkillGapTableViewProps> = ({
  items,
  onSelectSkill,
  onLaunchAssessment
}) => {
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>('tech-cloud'); // Default expand Cloud Computing as showcase!

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSkillId(expandedSkillId === id ? null : id);
  };

  const getPriorityBadge = (priority: 'High' | 'Medium' | 'Low', color: 'red' | 'yellow' | 'green') => {
    if (color === 'red') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          High Priority
        </span>
      );
    }
    if (color === 'yellow') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Medium Priority
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Low (Aligned)
      </span>
    );
  };

  const getIndicatorStatus = (color: 'red' | 'yellow' | 'green', gap: number) => {
    if (color === 'red') {
      return (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500 shadow-xs shadow-rose-500/50 shrink-0" />
          <div>
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
              Critical Gap
            </div>
            <div className="text-[10px] text-slate-400">-{gap} pts needed</div>
          </div>
        </div>
      );
    }
    if (color === 'yellow') {
      return (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500 shadow-xs shadow-amber-500/50 shrink-0" />
          <div>
            <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
              Moderate Gap
            </div>
            <div className="text-[10px] text-slate-400">-{gap} pts needed</div>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50 shrink-0" />
        <div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            Aligned / Mastered
          </div>
          <div className="text-[10px] text-slate-400">Meets industry</div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-3.5 px-4">Skill & Discipline</th>
              <th className="py-3.5 px-4 text-center">Current Level</th>
              <th className="py-3.5 px-4 text-center">Required Level</th>
              <th className="py-3.5 px-4 text-center">Gap Delta</th>
              <th className="py-3.5 px-4">Priority & Indicator</th>
              <th className="py-3.5 px-4 min-w-[280px]">Actionable Recommendation</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {items.map((item) => {
              const Icon = getSkillIcon(item.iconName);
              const isExpanded = expandedSkillId === item.id;
              const isCloudShowcase = item.id === 'tech-cloud';

              return (
                <React.Fragment key={item.id}>
                  <tr
                    onClick={() => onSelectSkill(item)}
                    className={`transition-colors cursor-pointer group ${
                      isExpanded
                        ? 'bg-indigo-50/30 dark:bg-indigo-950/20'
                        : item.indicatorColor === 'red'
                        ? 'hover:bg-rose-50/30 dark:hover:bg-rose-950/10'
                        : item.indicatorColor === 'yellow'
                        ? 'hover:bg-amber-50/30 dark:hover:bg-amber-950/10'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Skill Name & Subcategory */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                            item.indicatorColor === 'red'
                              ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50'
                              : item.indicatorColor === 'yellow'
                              ? 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50'
                              : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {item.name}
                            </span>
                            {isCloudShowcase && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold">
                                Key Target
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {item.subcategory}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Current Level */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                          {item.currentLevel}
                          <span className="text-[10px] font-normal text-slate-400">/100</span>
                        </span>
                        <div className="w-16 mt-1">
                          <ProgressBar
                            value={item.currentLevel}
                            color={item.indicatorColor === 'red' ? 'rose' : item.indicatorColor === 'yellow' ? 'amber' : 'emerald'}
                            size="xs"
                          />
                        </div>
                      </div>
                    </td>

                    {/* Required Industry Level */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                          {item.requiredLevel}
                          <span className="text-[10px] font-normal text-indigo-400">/100</span>
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Benchmark</span>
                      </div>
                    </td>

                    {/* Gap Delta */}
                    <td className="py-4 px-4 text-center">
                      {item.gap > 0 ? (
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`text-sm font-black px-2.5 py-0.5 rounded-lg ${
                              item.indicatorColor === 'red'
                                ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                                : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            {item.gap} pts
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">Deficiency</span>
                        </div>
                      ) : (
                        <div className="inline-flex flex-col items-center">
                          <span className="text-sm font-black px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                            0 (Aligned)
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                            +{item.currentLevel - item.requiredLevel} ahead
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Priority & Indicator */}
                    <td className="py-4 px-4">
                      <div className="space-y-1.5">
                        {getPriorityBadge(item.priority, item.indicatorColor)}
                        {getIndicatorStatus(item.indicatorColor, item.gap)}
                      </div>
                    </td>

                    {/* Actionable Recommendation */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-start gap-1.5">
                          <Sparkles
                            className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                              item.indicatorColor === 'red'
                                ? 'text-rose-500'
                                : item.indicatorColor === 'yellow'
                                ? 'text-amber-500'
                                : 'text-emerald-500'
                            }`}
                          />
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                            {item.recommendation}
                          </p>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 pl-5">
                          {item.detailedActionPlan[0]}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => toggleExpand(item.id, e)}
                          className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                          title={isExpanded ? 'Hide Action Plan' : 'Expand Roadmap & Courses'}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        <Button
                          variant={item.indicatorColor === 'red' ? 'primary' : 'outline'}
                          size="sm"
                          className="text-xs px-2.5 py-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectSkill(item);
                          }}
                        >
                          Plan
                        </Button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Roadmap Drawer Row */}
                  {isExpanded && (
                    <tr className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800">
                      <td colSpan={7} className="p-4 sm:p-6">
                        <div className="space-y-4 max-w-5xl">
                          {/* Heading Banner */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800">
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-indigo-500" />
                                Actionable Closing Roadmap for {item.name}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Estimated time to close gap of {item.gap} points: <strong className="text-indigo-600 dark:text-indigo-400">3-4 weeks</strong> with high hiring impact.
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              {item.assessmentSkillName && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  leftIcon={Sparkles}
                                  className="text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onLaunchAssessment(item.assessmentSkillName!);
                                  }}
                                >
                                  Take {item.name} Assessment
                                </Button>
                              )}
                              <Button
                                variant="primary"
                                size="sm"
                                className="text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectSkill(item);
                                }}
                              >
                                View Complete Action Plan
                              </Button>
                            </div>
                          </div>

                          {/* 3 Step Action Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                            {item.detailedActionPlan.map((step, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1.5 shadow-2xs"
                              >
                                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                                  <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-[10px] border border-indigo-200 dark:border-indigo-800">
                                    {idx + 1}
                                  </span>
                                  <span>Step {idx + 1}</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                  {step}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Recommended Certifications & Capstone Project */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                            {/* Course / Certification */}
                            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                  <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                                  Recommended Industry Resource
                                </span>
                                <Badge variant="primary" size="sm">
                                  Industry Standard
                                </Badge>
                              </div>
                              {item.recommendedResources[0] && (
                                <div className="space-y-1">
                                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                    {item.recommendedResources[0].title}
                                  </div>
                                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                                    <span>{item.recommendedResources[0].provider}</span>
                                    <span>•</span>
                                    <span>{item.recommendedResources[0].duration}</span>
                                    <span>•</span>
                                    <span>{item.recommendedResources[0].level}</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Project Idea */}
                            {item.recommendedProject && (
                              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                    <FolderGit2 className="w-3.5 h-3.5 text-indigo-500" />
                                    Hands-on Capstone Proof
                                  </span>
                                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                    +{Math.min(20, item.gap)} pts Lift
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                    {item.recommendedProject.title}
                                  </div>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                                    {item.recommendedProject.description}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
