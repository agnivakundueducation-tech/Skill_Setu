import React, { useState, useEffect } from 'react';
import {
  Zap,
  CheckCircle2,
  Calendar,
  Building2,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  Clock,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  FileText
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Intervention,
  InterventionEnrollment,
  InterventionRecommendation
} from '../../types/intervention';
import { interventionService } from '../../services/interventionService';

interface StudentInterventionsViewProps {
  studentId?: string;
  studentName?: string;
  studentEmail?: string;
  institutionId?: string;
  isDemo?: boolean;
}

export const StudentInterventionsView: React.FC<StudentInterventionsViewProps> = ({
  studentId = 'student_001',
  studentName = 'Aarav Sharma',
  studentEmail = 'aarav.sharma@nit.ac.in',
  institutionId = 'inst_nit',
  isDemo = true
}) => {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [enrollments, setEnrollments] = useState<InterventionEnrollment[]>([]);
  const [recommendations, setRecommendations] = useState<InterventionRecommendation[]>([]);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [assessmentModal, setAssessmentModal] = useState<InterventionEnrollment | null>(null);
  const [testScoreInput, setTestScoreInput] = useState<number>(67);
  const [studentFeedback, setStudentFeedback] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [studentId, institutionId, isDemo]);

  const loadData = async () => {
    const [intRes, enrRes, recRes] = await Promise.all([
      interventionService.getInterventions({ institutionId, isDemo }),
      interventionService.getStudentEnrollments(studentId, isDemo),
      interventionService.getRecommendations(undefined, isDemo)
    ]);

    if (intRes.success) setInterventions(intRes.data);
    if (enrRes.success) setEnrollments(enrRes.data);
    if (recRes.success) setRecommendations(recRes.data);
  };

  const handleEnroll = async (intervention: Intervention) => {
    setIsLoading(true);
    const res = await interventionService.enrollStudent(
      {
        interventionId: intervention.interventionId,
        interventionTitle: intervention.title,
        interventionType: intervention.interventionType,
        skillName: intervention.skillName,
        studentId,
        studentName,
        studentEmail,
        institutionId,
        preSkillLevel: intervention.preAvgScore || 41
      },
      isDemo
    );
    setIsLoading(false);
    setSelectedIntervention(null);

    if (res.success) {
      setNotification(`Successfully enrolled in "${intervention.title}"!`);
      setTimeout(() => setNotification(null), 4000);
      loadData();
    } else {
      setNotification(res.error || 'Failed to enroll');
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleCompleteAssessment = async () => {
    if (!assessmentModal) return;
    setIsLoading(true);

    const res = await interventionService.completePostAssessment(
      assessmentModal.enrollmentId,
      Number(testScoreInput),
      studentFeedback,
      isDemo
    );
    setIsLoading(false);
    setAssessmentModal(null);

    if (res.success) {
      const delta = (res.data?.postSkillLevel || 0) - (res.data?.preSkillLevel || 0);
      setNotification(`Post-assessment completed! Verified score gain: +${delta} points.`);
      setTimeout(() => setNotification(null), 5000);
      loadData();
    }
  };

  const isEnrolled = (interventionId: string) => {
    return enrollments.some((e) => e.interventionId === interventionId);
  };

  return (
    <div className="space-y-6" id="student-skill-development-hub">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden border border-indigo-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                Targeted Skill Accelerators & Industry Interventions
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Recommended Skill Development
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Personalized programs curated by your institution and industry partners to close high-demand skill gaps and elevate your career readiness.
            </p>
          </div>
        </div>

        {notification && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* SECTION 1: MY ENROLLED PROGRAMS & POST-ASSESSMENTS */}
      {enrollments.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              My Enrolled Interventions & Progress
            </h3>
            <span className="text-xs text-slate-500 font-medium">{enrollments.length} Active Tracks</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrollments.map((enr) => {
              const isCompleted = enr.status === 'Completed';

              return (
                <Card
                  key={enr.enrollmentId}
                  className={`p-5 border transition-all ${
                    isCompleted
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-indigo-200 bg-white'
                  } shadow-xs`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block">
                        {enr.interventionType} • {enr.skillName}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5">{enr.interventionTitle}</h4>
                    </div>
                    {isCompleted ? (
                      <Badge variant="emerald" size="sm">Completed & Verified</Badge>
                    ) : (
                      <Badge variant="primary" size="sm">In Progress</Badge>
                    )}
                  </div>

                  {/* Pre vs Post Assessment Card */}
                  <div className="my-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-[10px] text-slate-500">Baseline Score</div>
                        <div className="text-base font-bold text-slate-800">{enr.preSkillLevel}</div>
                      </div>
                      <div className="border-x border-slate-200">
                        <div className="text-[10px] text-slate-500">Post Score</div>
                        <div className="text-base font-bold text-indigo-600">
                          {enr.postSkillLevel !== undefined ? enr.postSkillLevel : '—'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">Improvement</div>
                        <div className="text-base font-bold text-emerald-600">
                          {enr.improvement !== undefined ? `+${enr.improvement}` : 'Pending'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500">
                      Enrolled: {enr.enrolledAt ? new Date(enr.enrolledAt).toLocaleDateString() : 'Active'}
                    </span>

                    {!isCompleted ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setAssessmentModal(enr);
                          setTestScoreInput(Math.min(100, enr.preSkillLevel + 26));
                        }}
                      >
                        <Award className="w-3.5 h-3.5 mr-1" />
                        Take Post-Assessment
                      </Button>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Outcome Stamped (+{enr.improvement} pts)
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: RECOMMENDED SKILL DEVELOPMENT (GAP-MATCHED) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Available Institutional Programs
            </h3>
            <p className="text-xs text-slate-500">
              Direct programs tailored for high industry demand and career readiness.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interventions.map((intItem) => {
            const enrolled = isEnrolled(intItem.interventionId);

            return (
              <Card
                key={intItem.interventionId}
                className="p-5 bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="indigo" size="sm">{intItem.interventionType}</Badge>
                    <span className="text-xs font-semibold text-slate-600">{intItem.skillName}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mb-1.5">{intItem.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">{intItem.description}</p>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1 mb-3">
                    <div className="text-slate-600 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                      Partner: <strong>{intItem.partnerIndustryName || 'Institution Lab Track'}</strong>
                    </div>
                    <div className="text-slate-600 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Duration: <strong>{intItem.startDate} to {intItem.endDate}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500">
                    Seats: {intItem.enrolledCount || 0} / {intItem.capacity}
                  </span>

                  {enrolled ? (
                    <Badge variant="emerald" size="sm">
                      <CheckCircle2 className="w-3 h-3 mr-1 inline" /> Enrolled
                    </Badge>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedIntervention(intItem)}
                    >
                      View Program
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* MODAL: VIEW PROGRAM & ENROLL */}
      {selectedIntervention && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full p-6 bg-white shadow-2xl rounded-3xl animate-fadeIn border border-slate-200">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <Badge variant="indigo" size="sm" className="mb-1">{selectedIntervention.interventionType}</Badge>
                <h3 className="text-lg font-bold text-slate-900">{selectedIntervention.title}</h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">{selectedIntervention.skillName}</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {selectedIntervention.description}
            </p>

            <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs mb-4">
              <div>
                <span className="text-slate-500 block">Industry Sponsor & Mentors:</span>
                <strong className="text-slate-800">{selectedIntervention.partnerIndustryName || 'Institution Engineering Center'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Schedule:</span>
                <strong className="text-slate-800">{selectedIntervention.startDate} to {selectedIntervention.endDate}</strong>
              </div>
              {selectedIntervention.industryResponsibilities && (
                <div>
                  <span className="text-slate-500 block">Industry Commitment:</span>
                  <p className="text-slate-700 italic">{selectedIntervention.industryResponsibilities}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedIntervention(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={isLoading}
                onClick={() => handleEnroll(selectedIntervention)}
              >
                Enroll in Program
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL: TAKE POST-ASSESSMENT */}
      {assessmentModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6 bg-white shadow-2xl rounded-3xl animate-fadeIn border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Post-Intervention Assessment</h3>
            <p className="text-xs text-slate-500 mb-4">
              Program: <strong>{assessmentModal.interventionTitle}</strong> ({assessmentModal.skillName})
            </p>

            <div className="space-y-4">
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900 space-y-1">
                <div>Baseline Pre-Skill Score: <strong>{assessmentModal.preSkillLevel} / 100</strong></div>
                <div className="text-[11px] text-indigo-700">
                  Completing this post-assessment measures your exact skill delta and stamps a verified credential on your Skill DNA profile.
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assessed Post-Program Score (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={testScoreInput}
                  onChange={(e) => setTestScoreInput(Number(e.target.value))}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                />
                <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                  Projected Gain: +{Math.max(0, testScoreInput - assessmentModal.preSkillLevel)} Points
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Program Feedback & Learnings (Optional)
                </label>
                <textarea
                  rows={3}
                  value={studentFeedback}
                  onChange={(e) => setStudentFeedback(e.target.value)}
                  placeholder="Share what you built, lab experiences, and mentor feedback..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <Button variant="ghost" size="sm" onClick={() => setAssessmentModal(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={isLoading}
                onClick={handleCompleteAssessment}
              >
                Submit & Record Gain
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
