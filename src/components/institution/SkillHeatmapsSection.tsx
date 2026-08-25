import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  DepartmentSkillHeatmapRow,
  SemesterProgressionHeatmapRow,
  SkillCategoryType
} from '../../types/institution';
import {
  Grid3X3,
  Layers,
  Sparkles,
  Info,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';

interface SkillHeatmapsSectionProps {
  departmentData: DepartmentSkillHeatmapRow[];
  semesterData: SemesterProgressionHeatmapRow[];
  onOpenAiRecommendation: (skillName: string) => void;
}

export const SkillHeatmapsSection: React.FC<SkillHeatmapsSectionProps> = ({
  departmentData,
  semesterData,
  onOpenAiRecommendation
}) => {
  const [activeHeatmapType, setActiveHeatmapType] = useState<'department' | 'semester'>('department');
  const [selectedCell, setSelectedCell] = useState<{
    entity: string;
    skill: SkillCategoryType;
    score: number;
    cohortSize: number;
    notes: string;
  } | null>({
    entity: 'CSE (Computer Science & Engineering)',
    skill: 'AI/ML',
    score: 74,
    cohortSize: 1540,
    notes: 'Strong in classical ML & basic neural nets, but deficit in Vector Databases and MLOps deployment pipelines.'
  });

  const skillsList: SkillCategoryType[] = [
    'AI/ML',
    'Cloud',
    'Cybersecurity',
    'DSA',
    'Data Analytics'
  ];

  // Helper for Heatmap Cell Color Class
  const getCellColorClass = (score: number) => {
    if (score >= 85) {
      return 'bg-emerald-600 text-white font-bold hover:ring-2 hover:ring-emerald-400';
    }
    if (score >= 70) {
      return 'bg-emerald-500/80 text-white font-semibold hover:ring-2 hover:ring-emerald-300';
    }
    if (score >= 55) {
      return 'bg-amber-500/80 text-white font-medium hover:ring-2 hover:ring-amber-300';
    }
    if (score >= 40) {
      return 'bg-rose-500/80 text-white font-medium hover:ring-2 hover:ring-rose-300';
    }
    return 'bg-rose-700 text-white font-medium hover:ring-2 hover:ring-rose-400';
  };

  const getCellLabel = (score: number) => {
    if (score >= 85) return 'Advanced';
    if (score >= 70) return 'Proficient';
    if (score >= 55) return 'Intermediate';
    if (score >= 40) return 'Basic Gap';
    return 'Critical Deficit';
  };

  return (
    <div className="space-y-5">
      {/* Header & Heatmap Selector */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Grid3X3 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Institutional Competency Heatmaps
            </h2>
            <Badge variant="primary" size="sm">
              Cross-Disciplinary OBE Matrix
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any cell to inspect cohort proficiency, sample size, and localized syllabus deficiencies.
          </p>
        </div>

        {/* Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveHeatmapType('department')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeHeatmapType === 'department'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Department Breakdown
          </button>
          <button
            onClick={() => setActiveHeatmapType('semester')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeHeatmapType === 'semester'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Semester Progression
          </button>
        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
        <span className="font-bold text-slate-700 dark:text-slate-300">
          Proficiency Scale (0 - 100):
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-emerald-600" />
            <span className="text-slate-600 dark:text-slate-400">&ge;85 (Advanced / Placement Ready)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-emerald-500/80" />
            <span className="text-slate-600 dark:text-slate-400">70 - 84 (Proficient)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-amber-500/80" />
            <span className="text-slate-600 dark:text-slate-400">55 - 69 (Intermediate Gap)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-rose-500/80" />
            <span className="text-slate-600 dark:text-slate-400">40 - 54 (High Deficit)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-rose-700" />
            <span className="text-slate-600 dark:text-slate-400">&lt;40 (Critical Void)</span>
          </span>
        </div>
      </div>

      {/* Main Heatmap Grid & Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Heatmap Table Grid */}
        <Card
          variant="default"
          className="lg:col-span-2 p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 overflow-x-auto space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {activeHeatmapType === 'department'
                ? 'Department vs Skill Competency Heatmap'
                : 'Semester-by-Semester Readiness Evolution'}
            </h3>
            <span className="text-[11px] text-slate-400">
              Interactive Matrix (Click cell to inspect)
            </span>
          </div>

          <table className="w-full text-left border-collapse min-w-[540px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">
                  {activeHeatmapType === 'department' ? 'Department' : 'Semester'}
                </th>
                {skillsList.map((skill) => (
                  <th key={skill} className="py-2.5 px-2 text-center">
                    {skill}
                  </th>
                ))}
                <th className="py-2.5 px-3 text-right">Avg Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              {activeHeatmapType === 'department' &&
                departmentData.map((dept) => (
                  <tr
                    key={dept.departmentCode}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {dept.departmentName}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {dept.assessedCount}/{dept.studentCount} Assessed
                      </div>
                    </td>

                    {skillsList.map((skill) => {
                      const score = dept.scores[skill];
                      const isSelected =
                        selectedCell?.entity.startsWith(dept.departmentCode) &&
                        selectedCell?.skill === skill;

                      return (
                        <td key={skill} className="py-2 px-1 text-center">
                          <button
                            onClick={() =>
                              setSelectedCell({
                                entity: `${dept.departmentCode} (${dept.departmentName})`,
                                skill,
                                score,
                                cohortSize: dept.assessedCount,
                                notes:
                                  score < 50
                                    ? `Urgent syllabus intervention required in ${skill} for ${dept.departmentCode}. Industry benchmark gap exceeds 35%.`
                                    : score < 70
                                    ? `Moderate gap in ${skill}. Laboratory modules require hands-on tooling updates.`
                                    : `High competency in ${skill}. Cohort well-positioned for Tier-1 recruitment.`
                              })
                            }
                            className={`w-full py-2.5 rounded-lg text-xs transition-all shadow-xs ${getCellColorClass(
                              score
                            )} ${isSelected ? 'ring-2 ring-amber-400 scale-95' : ''}`}
                          >
                            {score}%
                          </button>
                        </td>
                      );
                    })}

                    <td className="py-3 px-3 text-right font-black text-slate-900 dark:text-slate-100">
                      {dept.overallAverage}%
                    </td>
                  </tr>
                ))}

              {activeHeatmapType === 'semester' &&
                semesterData.map((sem) => (
                  <tr
                    key={sem.semester}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {sem.semester}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {sem.stageLabel}
                      </div>
                    </td>

                    {skillsList.map((skill) => {
                      const score = sem.scores[skill];
                      const isSelected =
                        selectedCell?.entity === sem.semester &&
                        selectedCell?.skill === skill;

                      return (
                        <td key={skill} className="py-2 px-1 text-center">
                          <button
                            onClick={() =>
                              setSelectedCell({
                                entity: `${sem.semester} (${sem.cohortYear})`,
                                skill,
                                score,
                                cohortSize: sem.studentCount,
                                notes:
                                  score < 50
                                    ? `Foundational stage in ${sem.semester}. Early micro-internship and sandbox labs will accelerate transition.`
                                    : `Advanced stage readiness (${score}%) leading to ${sem.placementReadinessRate}% placement clearance.`
                              })
                            }
                            className={`w-full py-2.5 rounded-lg text-xs transition-all shadow-xs ${getCellColorClass(
                              score
                            )} ${isSelected ? 'ring-2 ring-amber-400 scale-95' : ''}`}
                          >
                            {score}%
                          </button>
                        </td>
                      );
                    })}

                    <td className="py-3 px-3 text-right font-black text-emerald-600 dark:text-emerald-400">
                      {sem.placementReadinessRate}% Ready
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Card>

        {/* Selected Cell Inspector & Action Panel */}
        <Card
          variant="default"
          className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4"
        >
          {selectedCell ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Cell Diagnostics
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    selectedCell.score < 50
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : selectedCell.score < 70
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {getCellLabel(selectedCell.score)}
                </span>
              </div>

              <div>
                <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {selectedCell.skill}
                </div>
                <div className="text-xs text-slate-500">{selectedCell.entity}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Cohort Score:</span>
                  <span className="font-black text-slate-900 dark:text-slate-100 text-sm">
                    {selectedCell.score}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Assessed Students:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {selectedCell.cohortSize}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Industry Target:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    85% Benchmark
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  OBE Outcome Assessment:
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedCell.notes}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-400">
              Click any heatmap cell to inspect specific cohort metrics.
            </div>
          )}

          {selectedCell && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={Sparkles}
              onClick={() => onOpenAiRecommendation(selectedCell.skill)}
              className="w-full text-xs bg-amber-600 hover:bg-amber-500 border-none"
            >
              View AI Recommendation for {selectedCell.skill}
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
};
