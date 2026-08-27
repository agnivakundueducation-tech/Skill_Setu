import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  InstitutionSummaryMetrics,
  SkillDemandReadinessItem,
  DepartmentSkillHeatmapRow,
  AICurriculumRecommendation,
  PlacementTierItem
} from '../../types/institution';
import { Intervention, InterventionImpact } from '../../types/intervention';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Award,
  BookOpen,
  Building2,
  Layers,
  GraduationCap,
  Sparkles,
  BarChart3,
  Calendar
} from 'lucide-react';

interface InstitutionReportsViewProps {
  metrics: InstitutionSummaryMetrics;
  skillsData: SkillDemandReadinessItem[];
  departmentData: DepartmentSkillHeatmapRow[];
  recommendations: AICurriculumRecommendation[];
  tiersData: PlacementTierItem[];
  interventions: Intervention[];
  academicYear: string;
  selectedDepartment: string;
  institutionName?: string;
  isDemo?: boolean;
}

export const InstitutionReportsView: React.FC<InstitutionReportsViewProps> = ({
  metrics,
  skillsData,
  departmentData,
  recommendations,
  tiersData,
  interventions,
  academicYear,
  selectedDepartment,
  institutionName = 'Apex Institute of Technology & Research',
  isDemo = false
}) => {
  const [activeReportSection, setActiveReportSection] = useState<'all' | 'readiness' | 'demand' | 'curriculum' | 'interventions' | 'placement'>('all');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const reportData = {
      institution: institutionName,
      academicYear,
      departmentScope: selectedDepartment,
      generatedAt: new Date().toISOString(),
      governanceFramework: 'NAAC OBE Criterion 2 & NBA Criterion 3/4 Aligned',
      executiveSummary: metrics,
      skillDemandAndReadiness: skillsData,
      departmentAttainment: departmentData,
      curriculumGapDirectives: recommendations,
      activeAndCompletedInterventions: interventions,
      placementReadinessTiers: tiersData
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${institutionName.replace(/\s+/g, '_')}_OBE_Accreditation_Report_${academicYear}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Category,Metric/Domain,Industry Demand (%),Student Readiness (%),Gap (pts),Priority / Status\n';
    
    skillsData.forEach(s => {
      csvContent += `Skill Competency,"${s.skill}",${s.industryDemand},${s.studentReadiness},${s.gap},"${s.gapSeverity.toUpperCase()}"\n`;
    });

    interventions.forEach(i => {
      csvContent += `Intervention,"${i.title}",-,-,${i.measuredImprovement ? `+${i.measuredImprovement}` : 'Pending'},"${i.status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Institutional_OBE_Analytics_${academicYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6" id="institution-reports-view">
      {/* Top Banner & Export Actions */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950/80 to-slate-900 text-white shadow-xl relative overflow-hidden border border-indigo-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                NAAC OBE & NBA Criteria 2-4 Governance
              </span>
              {isDemo && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  Demonstration Dataset
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Institutional Reports & Accreditation Analytics
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              Consolidated outcome-based education (OBE) summaries, industry demand deltas, curriculum gap actions, and verified intervention ROI for Academic Council & Accreditation audits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={Printer}
              onClick={handlePrint}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
            >
              Print Report
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={Download}
              onClick={handleDownloadCSV}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
            >
              Download CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={FileText}
              onClick={handleDownloadJSON}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
            >
              Export Full Accreditation JSON
            </Button>
          </div>
        </div>
      </div>

      {/* Section Filter Pills */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveReportSection('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeReportSection === 'all'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          Comprehensive Audit (All Modules)
        </button>
        <button
          onClick={() => setActiveReportSection('readiness')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeReportSection === 'readiness'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          1. Skill Readiness Summary
        </button>
        <button
          onClick={() => setActiveReportSection('demand')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeReportSection === 'demand'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          2. Industry Demand Summary
        </button>
        <button
          onClick={() => setActiveReportSection('curriculum')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeReportSection === 'curriculum'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          3. Curriculum Gaps & Actions
        </button>
        <button
          onClick={() => setActiveReportSection('interventions')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeReportSection === 'interventions'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          4. Intervention Outcomes & ROI
        </button>
        <button
          onClick={() => setActiveReportSection('placement')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeReportSection === 'placement'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          5. Placement Readiness Tiers
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. SKILL READINESS & INSTITUTION EXECUTIVE SUMMARY */}
      {/* ========================================================================= */}
      {(activeReportSection === 'all' || activeReportSection === 'readiness') && (
        <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Executive Skill Readiness Summary
                </h3>
                <p className="text-xs text-slate-500">
                  Cohort Year: {academicYear} • Scope: {selectedDepartment === 'all' ? 'All Engineering Departments' : selectedDepartment}
                </p>
              </div>
            </div>
            <Badge variant="indigo" size="sm">
              NAAC Criterion 2.6
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <div className="text-xs text-slate-500 font-medium">Total Students</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {metrics.totalStudents.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400">{metrics.totalStudentsGrowth}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <div className="text-xs text-slate-500 font-medium">Assessed Candidates</div>
              <div className="text-xl font-bold text-sky-600 dark:text-sky-400 mt-1">
                {metrics.studentsAssessed.toLocaleString()} ({metrics.assessedPercentage}%)
              </div>
              <div className="text-[11px] text-sky-500">{metrics.assessedGrowth}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <div className="text-xs text-slate-500 font-medium">Placement Benchmark Cleared</div>
              <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {metrics.placementReady.toLocaleString()} ({metrics.placementReadyPercentage}%)
              </div>
              <div className="text-[11px] text-amber-500">Tier-1/2 Ready</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <div className="text-xs text-slate-500 font-medium">Verified Placements Completed</div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {metrics.placementsCompleted.toLocaleString()} ({metrics.placementsPercentage}%)
              </div>
              <div className="text-[11px] text-emerald-500">Avg CTC: {metrics.averageSalaryCTC}</div>
            </div>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 2. INDUSTRY DEMAND VS READINESS MATRIX */}
      {/* ========================================================================= */}
      {(activeReportSection === 'all' || activeReportSection === 'demand') && (
        <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Industry Demand vs. Student Readiness Diagnostic
                </h3>
                <p className="text-xs text-slate-500">
                  Deterministic delta benchmarking student assessment results against live hiring requirements.
                </p>
              </div>
            </div>
            <Badge variant="warning" size="sm">
              NBA Criterion 3.1
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Skill Competency Domain</th>
                  <th className="p-3 text-center">Industry Demand Index</th>
                  <th className="p-3 text-center">Cohort Readiness Index</th>
                  <th className="p-3 text-center">Deficit Gap</th>
                  <th className="p-3 text-center">Severity Priority</th>
                  <th className="p-3">Primary Action Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {skillsData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                      {item.skill}
                      <span className="text-[11px] text-slate-400 block font-normal">
                        {item.hiringOpeningsVolume} hiring openings
                      </span>
                    </td>
                    <td className="p-3 text-center font-semibold text-indigo-600 dark:text-indigo-400">
                      {item.industryDemand}%
                    </td>
                    <td className="p-3 text-center font-semibold text-slate-800 dark:text-slate-200">
                      {item.studentReadiness}%
                    </td>
                    <td className="p-3 text-center font-bold text-rose-600 dark:text-rose-400">
                      {item.gap}%
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.gapSeverity === 'critical'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {item.gapSeverity.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">
                      {item.suggestedAction}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 3. CURRICULUM GAPS & ACTIONS */}
      {/* ========================================================================= */}
      {(activeReportSection === 'all' || activeReportSection === 'curriculum') && (
        <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Curriculum Modernization & Syllabus Gap Directives
                </h3>
                <p className="text-xs text-slate-500">
                  Board of Studies (BoS) recommendations for academic syllabus alignment.
                </p>
              </div>
            </div>
            <Badge variant="default" size="sm">
              OBE Curriculum Alignment
            </Badge>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col md:flex-row md:items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1 max-w-3xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {rec.title}
                    </span>
                    <Badge variant="primary" size="sm">
                      {rec.targetSkill}
                    </Badge>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      Expected Gain: {rec.projectedGapReduction}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {rec.summary}
                  </p>
                  <div className="text-[11px] text-slate-500 pt-1">
                    Affected Semesters: <strong>{rec.affectedSemesters.join(', ')}</strong> • Credits: <strong>{rec.creditsChange}</strong>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 capitalize">
                    Status: {rec.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 4. INTERVENTION OUTCOMES & MEASURED ROI */}
      {/* ========================================================================= */}
      {(activeReportSection === 'all' || activeReportSection === 'interventions') && (
        <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Institutional Interventions & Recorded Skill Gains
                </h3>
                <p className="text-xs text-slate-500">
                  Targeted co-mentored programs bridging measured student competencies with industry mentors.
                </p>
              </div>
            </div>
            <Badge variant="success" size="sm">
              Pre vs. Post Attainment
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Intervention Program</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Industry Partner</th>
                  <th className="p-3 text-center">Enrollment</th>
                  <th className="p-3 text-center">Baseline Pre-Score</th>
                  <th className="p-3 text-center">Evaluated Post-Score</th>
                  <th className="p-3 text-center">Recorded Skill Gain</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {interventions.map((item) => (
                  <tr key={item.interventionId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                      {item.title}
                      <span className="text-[11px] text-slate-400 block font-normal">
                        Track: {item.skillName}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{item.interventionType}</td>
                    <td className="p-3 text-slate-800 dark:text-slate-200">{item.partnerIndustryName || 'Pending Assignment'}</td>
                    <td className="p-3 text-center font-semibold text-indigo-600 dark:text-indigo-400">
                      {item.enrolledCount || 0} / {item.capacity}
                    </td>
                    <td className="p-3 text-center text-slate-600 dark:text-slate-400">
                      {item.preAvgScore !== undefined ? item.preAvgScore : 'N/A'}
                    </td>
                    <td className="p-3 text-center text-slate-800 dark:text-slate-200 font-bold">
                      {item.postAvgScore !== undefined ? item.postAvgScore : 'Pending'}
                    </td>
                    <td className="p-3 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      {item.measuredImprovement !== undefined ? (
                        <span>+{item.measuredImprovement} pts</span>
                      ) : (
                        <span className="text-slate-400 font-normal">Impact measurement pending</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 5. PLACEMENT READINESS TIERS */}
      {/* ========================================================================= */}
      {(activeReportSection === 'all' || activeReportSection === 'placement') && (
        <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Placement Readiness Tier Breakdown & Compensation Projections
                </h3>
                <p className="text-xs text-slate-500">
                  Student distribution across compensation brackets based on verified skill competencies.
                </p>
              </div>
            </div>
            <Badge variant="info" size="sm">
              Placement Cell Intelligence
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tiersData.map((tier) => (
              <div
                key={tier.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{tier.title}</span>
                  <span className="font-black text-indigo-600 dark:text-indigo-400">{tier.packageRange}</span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {tier.studentCount.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-slate-500">({tier.percentage}% of cohort)</span>
                </div>
                <div className="space-y-1 pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-semibold text-slate-500 block">Key Skill Requirements:</span>
                  <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                    {tier.keyRequirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
