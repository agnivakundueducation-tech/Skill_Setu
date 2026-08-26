import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Opportunity } from '../../types/student';
import { useAuth } from '../../context/AuthContext';
import { applyToOpportunity } from '../../services/applicationService';
import { calculateOpportunityMatch } from '../../services/matchingService';
import { documentService } from '../../services/documentService';
import { VaultDocument } from '../../types/document';
import { OpportunityRecord } from '../../types/opportunity';
import {
  CheckCircle2,
  Building2,
  MapPin,
  Sparkles,
  ShieldCheck,
  Send,
  FileCheck,
  Briefcase,
  FileText,
  Calendar,
  Clock,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  FolderArchive
} from 'lucide-react';

interface OpportunityApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity | null;
  onAppliedSuccess?: (oppId: string) => void;
  onNavigateToApplications?: () => void;
}

export const OpportunityApplyModal: React.FC<OpportunityApplyModalProps> = ({
  isOpen,
  onClose,
  opportunity,
  onAppliedSuccess,
  onNavigateToApplications
}) => {
  const { appUser, isAuthenticated, isDemo } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [coverNote, setCoverNote] = useState('');
  const [resumeType, setResumeType] = useState<'verified-passport' | 'vault-resume'>('verified-passport');
  const [selectedVaultDocId, setSelectedVaultDocId] = useState<string>('');
  const [vaultResumes, setVaultResumes] = useState<VaultDocument[]>([]);
  const [availability, setAvailability] = useState('Immediate / Next 2 Weeks');
  const [applicationId, setApplicationId] = useState('');

  const isDemoActive = isDemo || !isAuthenticated;
  const currentStudentId = (isAuthenticated && !isDemo && appUser?.uid) ? appUser.uid : 'usr_std_01';

  useEffect(() => {
    if (isOpen) {
      documentService.getStudentDocuments(currentStudentId, { category: 'Resume' }, isDemoActive)
        .then(res => {
          if (res.success && res.data && res.data.length > 0) {
            setVaultResumes(res.data);
            setSelectedVaultDocId(res.data[0].id);
          }
        })
        .catch(err => console.error('Failed to load vault resumes:', err));
    }
  }, [isOpen, currentStudentId, isDemoActive]);

  if (!opportunity) return null;

  const handleGeneratePitch = () => {
    const skillsList = (opportunity.skillsRequired || []).slice(0, 3).join(', ');
    setCoverNote(
      `Hi ${opportunity.company} Talent Team! I am thrilled to apply for the ${opportunity.title} role. With a verified Skill DNA score and evaluated strengths in ${skillsList}, I have built production-grade systems and demonstrated hands-on technical proficiency. I look forward to contributing directly to your team!`
    );
  };

  const handleApply = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const studentId = currentStudentId;
    const studentName = appUser?.displayName || 'Aarav Sharma';
    const studentEmail = appUser?.email || 'student@skillsetu.ai';
    const studentInstitution = (appUser as any)?.institutionName || (appUser as any)?.university || 'Indian Institute of Technology (IIT)';
    const studentDegree = (appUser as any)?.degree || 'B.Tech Computer Science & Engineering';

    // Selected resume URL
    let chosenResumeURL = 'https://skillsetu.ai/verified-passports/student';
    if (resumeType === 'vault-resume') {
      const found = vaultResumes.find(r => r.id === selectedVaultDocId);
      if (found?.fileURL) {
        chosenResumeURL = found.fileURL;
      }
    }

    // Convert Opportunity to OpportunityRecord for the service
    const oppRecord: OpportunityRecord = {
      opportunityId: opportunity.id,
      title: opportunity.title,
      companyName: opportunity.company,
      companyLogo: opportunity.companyLogo,
      opportunityType: opportunity.type as any || 'Internship',
      description: opportunity.description,
      location: opportunity.location,
      workMode: opportunity.mode as any || 'Hybrid',
      duration: opportunity.duration || '6 Months',
      stipend: opportunity.stipend,
      applicationDeadline: opportunity.deadlineDate || opportunity.deadline,
      requiredSkills: opportunity.requiredSkills || (opportunity.skillsRequired || []).map((s) => ({
        skillId: s.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        skillName: s,
        requiredLevel: 75,
        importance: 'required'
      })),
      preferredSkills: opportunity.preferredSkills || [],
      eligibility: opportunity.eligibility || 'B.Tech / MCA / Equivalent',
      experienceLevel: opportunity.experienceLevel || 'Fresher / Student',
      domain: opportunity.domain || 'Engineering',
      postedBy: opportunity.postedBy || 'demo-industry-partner',
      institutionVisibility: ['all'],
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Calculate frozen explainable match score
    const matchResult = calculateOpportunityMatch(oppRecord);

    try {
      const res = await applyToOpportunity({
        studentId,
        studentName,
        studentEmail,
        studentInstitution,
        studentDegree,
        opportunity: oppRecord,
        matchResult,
        resumeURL: chosenResumeURL,
        coverLetter: coverNote.trim(),
        isDemo: isDemoActive
      });

      if (res.success && res.data) {
        setApplicationId(res.data.applicationId);
        setIsSuccess(true);
        if (onAppliedSuccess) {
          onAppliedSuccess(opportunity.id);
        }
      } else {
        setErrorMessage(res.error || 'You have already applied to this opportunity.');
      }
    } catch (err: any) {
      console.error('[OpportunityApplyModal] Apply error:', err);
      setErrorMessage(err?.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setErrorMessage(null);
    setCoverNote('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isSuccess ? 'Application Transmitted Successfully!' : 'Verified 1-Click Application'}
      description={
        isSuccess
          ? 'Your verified profile and Skill DNA passport have been securely submitted to the company talent portal.'
          : `Fast-track submission for ${opportunity.title} at ${opportunity.company}`
      }
      size="lg"
    >
      {!isSuccess ? (
        <div className="space-y-4">
          {/* Error Banner if duplicate or failure */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <span className="font-bold block">Application Status:</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Company & Role Summary */}
          <div className="flex items-start justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-3.5">
              <img
                src={opportunity.companyLogo}
                alt={opportunity.company}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0 bg-white"
              />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {opportunity.title}
                </h4>
                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {opportunity.company}
                  </span>
                  <span>•</span>
                  <span>{opportunity.location} ({opportunity.mode})</span>
                  <span>•</span>
                  <span>{opportunity.type}</span>
                </div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {opportunity.stipend}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                <Sparkles className="w-3 h-3" />
                {opportunity.matchScore}% Match
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">Deadline: {opportunity.deadline}</span>
            </div>
          </div>

          {/* Verified DNA Passport Attachment Card */}
          <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 space-y-2.5 text-xs">
            <div className="flex items-center justify-between font-bold text-indigo-950 dark:text-indigo-200">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>SkillSetu Verified Fast-Track Credentials Attached:</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider bg-indigo-200/60 dark:bg-indigo-800/60 text-indigo-900 dark:text-indigo-200 px-2 py-0.5 rounded">
                Tier-1 Pre-Qualified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Readiness Score</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Tier-1 Evaluated</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Skill DNA Passport</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Deterministic Match</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Identity Status</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Institutional Auth</span>
                </div>
              </div>
            </div>
          </div>

          {/* Application Profile Options */}
          <div className="space-y-3 pt-1">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Select Application Profile / Resume</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label
                  onClick={() => setResumeType('verified-passport')}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    resumeType === 'verified-passport'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 ring-1 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="resumeType"
                    checked={resumeType === 'verified-passport'}
                    onChange={() => setResumeType('verified-passport')}
                    className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="font-bold block flex items-center gap-1">
                      SkillSetu Verified Passport
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Live verified Skill DNA profile, assessment badges & verified projects.
                    </span>
                  </div>
                </label>

                <label
                  onClick={() => setResumeType('vault-resume')}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    resumeType === 'vault-resume'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 ring-1 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="resumeType"
                    checked={resumeType === 'vault-resume'}
                    onChange={() => setResumeType('vault-resume')}
                    className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="font-bold block flex items-center gap-1">
                      Document Vault Resume
                      <FolderArchive className="w-3 h-3 text-indigo-600" />
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Attach verified ATS resume from your Secure Evidence Vault.
                    </span>
                  </div>
                </label>
              </div>

              {resumeType === 'vault-resume' && (
                <div className="mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Choose Vault Document:
                  </label>
                  {vaultResumes.length > 0 ? (
                    <select
                      value={selectedVaultDocId}
                      onChange={(e) => setSelectedVaultDocId(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1.5"
                    >
                      {vaultResumes.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.title} ({doc.fileName} — {Math.round(doc.fileSize / 1024)} KB)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 py-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>No resumes found in Vault. Default Master Resume will be attached.</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Earliest Availability / Start Date:
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-3 py-2"
                >
                  <option value="Immediate / Next 2 Weeks">Immediate / Next 2 Weeks</option>
                  <option value="Summer 2026 (June - August)">Summer 2026 (June - August)</option>
                  <option value="Fall 2026 (September onwards)">Fall 2026 (September onwards)</option>
                  <option value="Flexible / Negotiable">Flexible / Negotiable</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Applicant Email:
                </label>
                <input
                  type="text"
                  disabled
                  value={appUser?.email || 'aarav.sharma@skillsetu.demo'}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-2 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Custom Pitch / Cover Note */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Custom Pitch / Cover Note (Optional):
                </label>
                <button
                  type="button"
                  onClick={handleGeneratePitch}
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Auto-Craft Tailored Pitch
                </button>
              </div>
              <textarea
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Add a brief note highlighting your passion or relevant project experience for this role..."
                rows={3}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" onClick={handleClose} className="text-xs">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="text-xs px-5"
              leftIcon={Send}
              loading={isSubmitting}
              onClick={handleApply}
            >
              Confirm & Fast-Track Apply
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-5 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Priority Application Dispatched
            </span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Applied to {opportunity.company}!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Application ID: <strong className="text-slate-800 dark:text-slate-200">{applicationId}</strong>. Your match score of <strong className="text-indigo-600 dark:text-indigo-400">{opportunity.matchScore}%</strong> has been recorded and submitted to the recruiter dashboard.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto text-left space-y-1.5">
            <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Next Milestone:
            </div>
            <p className="text-[11px] text-slate-500">
              Recruiter screening will complete within <strong>48 hours</strong>. You can monitor lifecycle progress directly in your Applications Tracker.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={handleClose} className="text-xs">
              Back to Marketplace
            </Button>
            {onNavigateToApplications && (
              <Button
                variant="primary"
                size="sm"
                className="text-xs"
                rightIcon={ArrowRight}
                onClick={() => {
                  handleClose();
                  onNavigateToApplications();
                }}
              >
                Track in Active Applications
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
