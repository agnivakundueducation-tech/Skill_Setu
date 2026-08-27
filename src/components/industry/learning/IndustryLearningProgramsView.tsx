import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  LearningProgram,
  StudentProgramEnrollment,
  LearningProgramType
} from '../../../types/learningProgram';
import { learningProgramService } from '../../../services/learningProgramService';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { CreateEditProgramModal } from './CreateEditProgramModal';
import { ProgramParticipantsModal } from './ProgramParticipantsModal';
import { ProgramMentorFeedbackModal } from './ProgramMentorFeedbackModal';
import { IssueProgramCertificateModal } from './IssueProgramCertificateModal';
import {
  GraduationCap,
  Sparkles,
  Plus,
  Search,
  Filter,
  Users,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  TrendingUp,
  BarChart2,
  FileCode2,
  BookOpen,
  Eye,
  Edit3,
  MoreVertical,
  Activity,
  AlertCircle
} from 'lucide-react';

export const IndustryLearningProgramsView: React.FC = () => {
  const { user, appUser, isDemo, isAuthenticated } = useAuth();
  const [programs, setPrograms] = useState<LearningProgram[]>([]);
  const [allEnrollments, setAllEnrollments] = useState<StudentProgramEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<LearningProgram | null>(null);
  const [inspectProgramForRoster, setInspectProgramForRoster] = useState<LearningProgram | null>(null);
  const [selectedEnrollmentForFeedback, setSelectedEnrollmentForFeedback] = useState<StudentProgramEnrollment | null>(null);
  const [selectedEnrollmentForCert, setSelectedEnrollmentForCert] = useState<StudentProgramEnrollment | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const organizationId = appUser?.institutionId || user?.id || 'demo-industry-apex';
  const organizationName = appUser?.displayName || user?.organization || 'Apex Cloud Systems';

  const loadData = async () => {
    setIsLoading(true);
    try {
      const isDemoMode = isDemo || !isAuthenticated;
      const [progRes, enrRes] = await Promise.all([
        learningProgramService.getPrograms({
          organizationId,
          isDemo: isDemoMode
        }),
        learningProgramService.getOrganizationEnrollments(organizationId, isDemoMode)
      ]);

      if (progRes.success) {
        setPrograms(progRes.data);
      }
      if (enrRes.success) {
        setAllEnrollments(enrRes.data);
      }
    } catch (err: any) {
      console.error('Error loading industry programs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [organizationId, isDemo, isAuthenticated]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Analytics computed deterministically from real records
  const analytics = useMemo(() => {
    const totalPrograms = programs.length;
    const activePrograms = programs.filter((p) => p.status === 'published' || p.status === 'in_progress').length;
    const totalEnrolled = allEnrollments.length;
    const completedStudents = allEnrollments.filter((e) => e.status === 'Completed').length;
    const completionRate = totalEnrolled > 0 ? Math.round((completedStudents / totalEnrolled) * 100) : 0;
    const certificatesIssued = allEnrollments.filter((e) => e.completionRecord?.certificateIssued).length;

    // Skill domains breakdown
    const domainCounts: Record<string, number> = {};
    programs.forEach((p) => {
      domainCounts[p.domain] = (domainCounts[p.domain] || 0) + 1;
    });

    return {
      totalPrograms,
      activePrograms,
      totalEnrolled,
      completedStudents,
      completionRate,
      certificatesIssued,
      domainCounts
    };
  }, [programs, allEnrollments]);

  // Filtered programs
  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      if (selectedType !== 'All' && p.programType !== selectedType) return false;
      if (selectedStatus !== 'All' && p.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDomain = p.domain.toLowerCase().includes(q);
        const matchesSkills = p.targetSkills.some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDomain && !matchesSkills) return false;
      }
      return true;
    });
  }, [programs, selectedType, selectedStatus, searchQuery]);

  // Handlers
  const handleSaveProgram = async (payload: any): Promise<boolean> => {
    const isDemoMode = isDemo || !isAuthenticated;
    if (editingProgram) {
      const res = await learningProgramService.updateProgram(editingProgram.id, payload, isDemoMode);
      if (res.success) {
        showNotification('success', `Updated "${payload.title}" successfully`);
        loadData();
        return true;
      } else {
        showNotification('error', res.error || 'Failed to update program');
        return false;
      }
    } else {
      const res = await learningProgramService.createProgram(payload, isDemoMode);
      if (res.success) {
        showNotification('success', `Published "${payload.title}" successfully`);
        loadData();
        return true;
      } else {
        showNotification('error', res.error || 'Failed to publish program');
        return false;
      }
    }
  };

  const handleToggleModule = async (enrollmentId: string, moduleId: string) => {
    const isDemoMode = isDemo || !isAuthenticated;
    const res = await learningProgramService.toggleModuleCompletion(enrollmentId, moduleId, isDemoMode);
    if (res.success) {
      setAllEnrollments((prev) => prev.map((e) => (e.id === enrollmentId ? res.data : e)));
    }
  };

  const handleSubmitFeedback = async (
    enrollmentId: string,
    feedback: {
      mentorName: string;
      mentorTitle?: string;
      feedbackText: string;
      technicalRating: number;
      practicalRating: number;
    }
  ): Promise<boolean> => {
    const isDemoMode = isDemo || !isAuthenticated;
    const res = await learningProgramService.submitMentorFeedback(enrollmentId, feedback, isDemoMode);
    if (res.success) {
      showNotification('success', 'Mentor appraisal recorded successfully');
      setAllEnrollments((prev) => prev.map((e) => (e.id === enrollmentId ? res.data : e)));
      return true;
    } else {
      showNotification('error', res.error || 'Failed to submit appraisal');
      return false;
    }
  };

  const handleIssueCertificate = async (
    enrollmentId: string,
    params: {
      signatoryName: string;
      signatoryTitle: string;
      achievedSkills: string[];
      gradeOrDistinction: 'Distinction' | 'Merit' | 'Passed';
    }
  ): Promise<boolean> => {
    const isDemoMode = isDemo || !isAuthenticated;
    const res = await learningProgramService.issueProgramCertificate(enrollmentId, params, isDemoMode);
    if (res.success) {
      showNotification('success', 'Official certificate minted & verified');
      setAllEnrollments((prev) => prev.map((e) => (e.id === enrollmentId ? res.data : e)));
      return true;
    } else {
      showNotification('error', res.error || 'Failed to issue certificate');
      return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3 rounded-2xl text-xs font-bold border flex items-center justify-between shadow-xs transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2 font-black text-sm">
            ×
          </button>
        </div>
      )}

      {/* Top Header Banner & Publishing Action */}
      <div className="p-5 rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/50 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Enterprise Upskilling & Pre-Hire Incubation</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">
            Industry Learning Programs & Certification Academy
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Publish structured training tracks, enterprise certification courses, workshops, and mentorship cohorts to upskill student candidates before recruitment screening.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={Plus}
          onClick={() => {
            setEditingProgram(null);
            setIsCreateModalOpen(true);
          }}
          className="shadow-lg bg-indigo-600 hover:bg-indigo-500 text-white shrink-0"
        >
          Publish New Program
        </Button>
      </div>

      {/* Analytics KPI Metric Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card variant="default" className="p-4 rounded-2xl border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Programs</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {analytics.activePrograms}
            </span>
            <span className="text-[11px] text-slate-400">
              / {analytics.totalPrograms} total
            </span>
          </div>
        </Card>

        <Card variant="default" className="p-4 rounded-2xl border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Enrolled Students</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {analytics.totalEnrolled}
            </span>
            <span className="text-[11px] text-slate-400">active trainees</span>
          </div>
        </Card>

        <Card variant="default" className="p-4 rounded-2xl border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completion Rate</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {analytics.completionRate}%
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold">
              {analytics.completedStudents} certified
            </span>
          </div>
        </Card>

        <Card variant="default" className="p-4 rounded-2xl border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Credentials Issued</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {analytics.certificatesIssued}
            </span>
            <span className="text-[11px] text-slate-400">cryptographically verified</span>
          </div>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search programs by title, skill, domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            <option value="All">All Program Types</option>
            <option value="Training Program">Training Program</option>
            <option value="Certification Course">Certification Course</option>
            <option value="Workshop">Workshop</option>
            <option value="Mentorship Program">Mentorship Program</option>
            <option value="Masterclass">Masterclass</option>
            <option value="Bootcamp">Bootcamp</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            <option value="All">All Statuses</option>
            <option value="published">Published</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Programs List */}
      {isLoading ? (
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 mt-2">Loading learning programs...</p>
        </div>
      ) : filteredPrograms.length === 0 ? (
        <div className="text-center py-16 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <GraduationCap className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
          <div className="text-base font-bold text-slate-800 dark:text-slate-200">
            No Learning Programs Found
          </div>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Publish your first industry training cohort, workshop, or mentorship track to start upskilling prospective student candidates.
          </p>
          <Button
            variant="primary"
            size="sm"
            leftIcon={Plus}
            onClick={() => {
              setEditingProgram(null);
              setIsCreateModalOpen(true);
            }}
          >
            Create Learning Program
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredPrograms.map((program) => {
            const programEnrollments = allEnrollments.filter((e) => e.programId === program.id);
            const completedCount = programEnrollments.filter((e) => e.status === 'Completed').length;
            const avgProgress =
              programEnrollments.length > 0
                ? Math.round(
                    programEnrollments.reduce((sum, e) => sum + (e.progressPercentage || 0), 0) /
                      programEnrollments.length
                  )
                : 0;

            return (
              <Card
                key={program.id}
                variant="default"
                className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-xs space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="primary" size="sm" className="text-[10px]">
                        {program.programType}
                      </Badge>
                      <Badge variant="secondary" size="sm" className="text-[10px]">
                        {program.deliveryMode}
                      </Badge>
                      <Badge
                        variant={
                          program.status === 'published'
                            ? 'success'
                            : program.status === 'in_progress'
                            ? 'primary'
                            : 'secondary'
                        }
                        size="sm"
                        className="text-[10px] capitalize"
                      >
                        {program.status}
                      </Badge>
                    </div>

                    {program.certificationInfo?.isOffered && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/60">
                        <Award className="w-3 h-3" />
                        Verifiable Cert
                      </span>
                    )}
                  </div>

                  {/* Program Title & Domain */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {program.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{program.domain}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {program.description}
                  </p>

                  {/* Target Skills Tags */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Target Competencies:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {program.targetSkills.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Logistics & Modules count */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 grid grid-cols-3 gap-2 text-[11px]">
                    <div>
                      <div className="text-slate-400">Duration</div>
                      <div className="font-bold text-slate-900 dark:text-white truncate">
                        {program.duration}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400">Curriculum</div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {program.modules?.length || 0} Modules
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400">Cohort Progress</div>
                      <div className="font-bold text-indigo-600 dark:text-indigo-400">
                        {avgProgress}% avg
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Mentor & Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        program.mentorInfo?.avatarUrl ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
                      }
                      alt={program.mentorInfo?.name || 'Mentor'}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      {program.mentorInfo?.name || 'Assigned Mentor'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingProgram(program);
                        setIsCreateModalOpen(true);
                      }}
                      className="text-xs h-7 px-2"
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => setInspectProgramForRoster(program)}
                      className="text-xs h-7 px-2.5"
                    >
                      <Users className="w-3.5 h-3.5 mr-1" />
                      Roster ({programEnrollments.length})
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal: Create or Edit Learning Program */}
      <CreateEditProgramModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingProgram(null);
        }}
        onSaveProgram={handleSaveProgram}
        editingProgram={editingProgram}
        organizationName={organizationName}
        organizationId={organizationId}
      />

      {/* Modal: View Participants Roster & Progression */}
      {inspectProgramForRoster && (
        <ProgramParticipantsModal
          isOpen={Boolean(inspectProgramForRoster)}
          onClose={() => setInspectProgramForRoster(null)}
          program={inspectProgramForRoster}
          enrollments={allEnrollments.filter((e) => e.programId === inspectProgramForRoster.id)}
          onOpenFeedback={(enr) => setSelectedEnrollmentForFeedback(enr)}
          onOpenCertificate={(enr) => setSelectedEnrollmentForCert(enr)}
          onToggleModule={handleToggleModule}
        />
      )}

      {/* Modal: Record Mentor Feedback */}
      <ProgramMentorFeedbackModal
        isOpen={Boolean(selectedEnrollmentForFeedback)}
        onClose={() => setSelectedEnrollmentForFeedback(null)}
        enrollment={selectedEnrollmentForFeedback}
        onSubmitFeedback={handleSubmitFeedback}
        defaultMentorName={user?.name || appUser?.displayName || 'Dr. Vikramaditya Sen'}
      />

      {/* Modal: Issue Program Certificate */}
      <IssueProgramCertificateModal
        isOpen={Boolean(selectedEnrollmentForCert)}
        onClose={() => setSelectedEnrollmentForCert(null)}
        enrollment={selectedEnrollmentForCert}
        onIssueCertificate={handleIssueCertificate}
        defaultSignatoryName={user?.name || appUser?.displayName || 'Dr. Vikramaditya Sen'}
      />
    </div>
  );
};
