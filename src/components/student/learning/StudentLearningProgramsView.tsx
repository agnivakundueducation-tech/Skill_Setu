import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  LearningProgram,
  StudentProgramEnrollment,
  LearningProgramType,
  ProgramDeliveryMode,
  ProgramDifficulty
} from '../../../types/learningProgram';
import { learningProgramService } from '../../../services/learningProgramService';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { ProgramDetailModal } from './ProgramDetailModal';
import { ProgramCertificateModal } from './ProgramCertificateModal';
import {
  GraduationCap,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  Building2,
  Calendar,
  ChevronRight,
  BookOpen,
  UserCheck,
  Star,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  BarChart2
} from 'lucide-react';

export const StudentLearningProgramsView: React.FC = () => {
  const { user, appUser, isDemo, isAuthenticated } = useAuth();

  // Active view tab: 'discover' | 'enrolled'
  const [activeTab, setActiveTab] = useState<'discover' | 'enrolled'>('discover');

  const [programs, setPrograms] = useState<LearningProgram[]>([]);
  const [myEnrollments, setMyEnrollments] = useState<StudentProgramEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Discovery Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [recommendedOnly, setRecommendedOnly] = useState(false);

  // Modals
  const [selectedProgramForDetail, setSelectedProgramForDetail] = useState<LearningProgram | null>(null);
  const [selectedEnrollmentForCert, setSelectedEnrollmentForCert] = useState<StudentProgramEnrollment | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const studentId = appUser?.uid || user?.id || 'demo-student-aayush';
  const studentName = appUser?.displayName || user?.name || 'Aayush Sharma';
  const studentEmail = appUser?.email || user?.email || 'aayush.sharma@example.edu';
  const studentAvatar = user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80';

  // Demo student skills to perform deterministic skill-gap matching
  const studentSkills = useMemo(() => {
    return (user as any)?.skills || ['Python', 'Docker', 'REST APIs', 'SQL', 'Git', 'Linux'];
  }, [user]);

  const studentSkillGaps = useMemo(() => {
    return ['Distributed Systems', 'Apache Kafka', 'Microservices', 'Kubernetes', 'Go (Golang)', 'CI/CD Pipelines'];
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const isDemoMode = isDemo || !isAuthenticated;
      const [progRes, enrRes] = await Promise.all([
        learningProgramService.getPrograms({ isDemo: isDemoMode }),
        learningProgramService.getStudentEnrollments(studentId, isDemoMode)
      ]);

      if (progRes.success) {
        setPrograms(progRes.data);
      }
      if (enrRes.success) {
        setMyEnrollments(enrRes.data);
      }
    } catch (err) {
      console.error('Failed to load learning program data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [studentId, isDemo, isAuthenticated]);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Map each program to its deterministic skill-gap match score & explanation
  const programsWithMatch = useMemo(() => {
    return programs.map((prog) => {
      const match = learningProgramService.calculateProgramSkillGapMatch(prog, studentSkills, studentSkillGaps);
      return {
        program: prog,
        match
      };
    });
  }, [programs, studentSkills, studentSkillGaps]);

  // Filtered Discovery programs
  const filteredPrograms = useMemo(() => {
    return programsWithMatch.filter(({ program, match }) => {
      if (selectedType !== 'All' && program.programType !== selectedType) return false;
      if (selectedMode !== 'All' && program.deliveryMode !== selectedMode) return false;
      if (selectedDifficulty !== 'All' && program.difficultyLevel !== selectedDifficulty) return false;
      if (recommendedOnly && !match.isRecommendedForSkillGap) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = program.title.toLowerCase().includes(q);
        const matchesOrg = program.organizationName.toLowerCase().includes(q);
        const matchesDomain = program.domain.toLowerCase().includes(q);
        const matchesSkills = program.targetSkills.some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesOrg && !matchesDomain && !matchesSkills) return false;
      }
      return true;
    });
  }, [programsWithMatch, selectedType, selectedMode, selectedDifficulty, recommendedOnly, searchQuery]);

  // Handle 1-click program enrollment
  const handleEnroll = async (prog: LearningProgram) => {
    setIsEnrolling(true);
    const isDemoMode = isDemo || !isAuthenticated;
    try {
      const res = await learningProgramService.enrollStudent(
        {
          program: prog,
          studentId,
          studentName,
          studentEmail,
          studentAvatar,
          institutionId: 'demo-inst-nit',
          institutionName: 'National Institute of Technology'
        },
        isDemoMode
      );

      if (res.success) {
        showToast('success', `Successfully enrolled in ${prog.title}`);
        await loadData();
        setSelectedProgramForDetail(null);
        setActiveTab('enrolled');
      } else {
        showToast('error', res.error || 'Failed to enroll');
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  // Handle module toggle for enrolled student
  const handleToggleModule = async (enrollmentId: string, moduleId: string) => {
    const isDemoMode = isDemo || !isAuthenticated;
    const res = await learningProgramService.toggleModuleCompletion(enrollmentId, moduleId, isDemoMode);
    if (res.success) {
      setMyEnrollments((prev) => prev.map((e) => (e.id === enrollmentId ? res.data : e)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div
          className={`p-3 rounded-2xl text-xs font-bold border flex items-center justify-between shadow-xs ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
          }`}
        >
          <span>{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 font-black text-sm">
            ×
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/50 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIH 26044 Industry Skill Development</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Industry Learning Programs & Micro-Credentials
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Bridge your identified skill gaps with training cohorts, workshops, and mentorship tracks published directly by enterprise tech partners.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shrink-0">
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'discover'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Discover Programs</span>
          </button>

          <button
            onClick={() => setActiveTab('enrolled')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'enrolled'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>My Enrolled ({myEnrollments.length})</span>
          </button>
        </div>
      </div>

      {/* DISCOVER TAB */}
      {activeTab === 'discover' && (
        <div className="space-y-4">
          {/* Search & Filter Controls */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by topic, skill (e.g. Kafka, Cloud), or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                <option value="All">All Formats</option>
                <option value="Training Program">Training Program</option>
                <option value="Certification Course">Certification Course</option>
                <option value="Workshop">Workshop</option>
                <option value="Mentorship Program">Mentorship Program</option>
                <option value="Masterclass">Masterclass</option>
                <option value="Bootcamp">Bootcamp</option>
              </select>

              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                <option value="All">All Modes</option>
                <option value="Online">Online</option>
                <option value="Hybrid">Hybrid</option>
                <option value="In-Person">In-Person</option>
              </select>

              <button
                onClick={() => setRecommendedOnly(!recommendedOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all shrink-0 ${
                  recommendedOnly
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Skill-Gap Recommendations</span>
              </button>
            </div>
          </div>

          {/* Program Cards Grid */}
          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-block w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-500 mt-2">Discovering industry programs...</p>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="text-center py-16 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <GraduationCap className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No matching learning programs found
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your search filters or clearing the skill-gap recommendation toggle.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPrograms.map(({ program, match }) => {
                const isEnrolled = myEnrollments.some((e) => e.programId === program.id);
                const userEnrollment = myEnrollments.find((e) => e.programId === program.id);

                return (
                  <Card
                    key={program.id}
                    variant="default"
                    className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-xs space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Top Badges & Match */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge variant="primary" size="sm" className="text-[10px]">
                            {program.programType}
                          </Badge>
                          <Badge variant="secondary" size="sm" className="text-[10px]">
                            {program.deliveryMode}
                          </Badge>
                          <Badge variant="default" size="sm" className="text-[10px]">
                            {program.difficultyLevel}
                          </Badge>
                        </div>

                        {match.isRecommendedForSkillGap && (
                          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>{match.matchScore}% Gap Match</span>
                          </div>
                        )}
                      </div>

                      {/* Title & Company */}
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                          {program.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {program.organizationName}
                          </span>
                          <span>•</span>
                          <span>{program.domain}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {program.description}
                      </p>

                      {/* Deterministic Explanation Snippet if matched */}
                      {match.isRecommendedForSkillGap && (
                        <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/60 text-[11px] text-amber-900 dark:text-amber-300">
                          {match.explanation}
                        </div>
                      )}

                      {/* Target Skills Tags */}
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Skills Taught:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {program.targetSkills.map((s, idx) => {
                            const isGap = studentSkillGaps.some((g) => g.toLowerCase() === s.toLowerCase());
                            return (
                              <span
                                key={idx}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                                  isGap
                                    ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300/60'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {s}
                                {isGap && ' ★'}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Footer Logistics & CTA */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {program.duration}
                        </span>
                        <span>•</span>
                        <span>{program.modules?.length || 0} Modules</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isEnrolled ? (
                          <Badge variant="success" size="sm">
                            Enrolled ({userEnrollment?.progressPercentage || 0}%)
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => setSelectedProgramForDetail(program)}
                            className="text-xs h-7 px-3"
                          >
                            Explore & Enroll
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MY ENROLLED PROGRAMS TAB */}
      {activeTab === 'enrolled' && (
        <div className="space-y-4">
          {myEnrollments.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <BookOpen className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
              <div className="text-base font-bold text-slate-800 dark:text-slate-200">
                You haven't enrolled in any industry learning tracks yet
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Explore recommended programs tailored to your target skill gaps and earn verified credentials on completion.
              </p>
              <Button variant="primary" size="sm" onClick={() => setActiveTab('discover')} leftIcon={Sparkles}>
                Browse Recommended Programs
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {myEnrollments.map((enr) => {
                const program = programs.find((p) => p.id === enr.programId);
                const isCompleted = enr.status === 'Completed';

                return (
                  <Card
                    key={enr.id}
                    variant="default"
                    className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant={isCompleted ? 'success' : enr.progressPercentage > 0 ? 'primary' : 'secondary'}
                            size="sm"
                          >
                            {enr.status}
                          </Badge>
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {enr.organizationName}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {enr.programTitle}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-slate-400">Track Progress</div>
                          <div className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                            {enr.progressPercentage}%
                          </div>
                        </div>

                        {enr.completionRecord?.certificateIssued && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => setSelectedEnrollmentForCert(enr)}
                            leftIcon={Award}
                            className="bg-amber-500 hover:bg-amber-600 text-white"
                          >
                            View Certificate
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Modules Checklist */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                        <span>Curriculum Modules & Self-Paced Checkpoints</span>
                        <span className="text-[11px] font-normal text-slate-500">
                          {enr.completedModuleIds.length} of {enr.totalModulesCount} completed
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {program?.modules?.map((mod) => {
                          const isDone = enr.completedModuleIds.includes(mod.id);
                          return (
                            <div
                              key={mod.id}
                              className={`p-3 rounded-xl border flex items-start justify-between gap-2.5 transition-all ${
                                isDone
                                  ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800'
                              }`}
                            >
                              <div className="space-y-0.5 min-w-0">
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                  <span>{mod.title}</span>
                                  {mod.duration && (
                                    <span className="text-[10px] text-slate-400 font-normal">
                                      ({mod.duration})
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 line-clamp-1">{mod.description}</p>
                              </div>

                              <button
                                onClick={() => handleToggleModule(enr.id, mod.id)}
                                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition-colors ${
                                  isDone
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300'
                                }`}
                                title={isDone ? 'Mark module incomplete' : 'Mark module complete'}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{isDone ? 'Done' : 'Mark'}</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Mentor Feedback Appraisal if available */}
                    {enr.mentorFeedback && (
                      <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <UserCheck className="w-4 h-4 text-indigo-600" />
                            <span>Industry Mentor Review — {enr.mentorFeedback.mentorName} ({enr.mentorFeedback.mentorTitle || 'Lead Architect'})</span>
                          </div>
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{enr.mentorFeedback.technicalRating}/5 Competency</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900">
                          "{enr.mentorFeedback.feedbackText}"
                        </p>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Program Detail & Enrollment Modal */}
      {selectedProgramForDetail && (
        <ProgramDetailModal
          isOpen={Boolean(selectedProgramForDetail)}
          onClose={() => setSelectedProgramForDetail(null)}
          program={selectedProgramForDetail}
          matchExplanation={
            programsWithMatch.find((pm) => pm.program.id === selectedProgramForDetail.id)?.match
          }
          isEnrolled={myEnrollments.some((e) => e.programId === selectedProgramForDetail.id)}
          enrollment={myEnrollments.find((e) => e.programId === selectedProgramForDetail.id)}
          onEnroll={handleEnroll}
          isEnrolling={isEnrolling}
        />
      )}

      {/* Program Certificate Modal */}
      {selectedEnrollmentForCert && (
        <ProgramCertificateModal
          isOpen={Boolean(selectedEnrollmentForCert)}
          onClose={() => setSelectedEnrollmentForCert(null)}
          enrollment={selectedEnrollmentForCert}
        />
      )}
    </div>
  );
};
