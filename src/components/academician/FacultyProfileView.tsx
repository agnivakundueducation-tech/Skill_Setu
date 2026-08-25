import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import {
  FacultyProfile,
  CollaborationType,
  VerifiedFacultyExperience
} from '../../types/collaboration';
import {
  User,
  Building2,
  GraduationCap,
  Sparkles,
  Award,
  CheckCircle2,
  Plus,
  X,
  Save,
  BookOpen,
  Calendar,
  ShieldCheck,
  Briefcase,
  MapPin,
  Clock
} from 'lucide-react';

interface FacultyProfileViewProps {
  profile: FacultyProfile;
  onUpdateProfile: (updates: Partial<FacultyProfile>) => Promise<{ success: boolean; error?: string }>;
}

const ALL_COLLAB_TYPES: CollaborationType[] = [
  'Faculty Internship',
  'Research Collaboration',
  'FDP',
  'Live Project',
  'Consultancy',
  'Guest Lecture',
  'Mentorship',
  'Industrial Training',
  'Innovation Challenge'
];

export const FacultyProfileView: React.FC<FacultyProfileViewProps> = ({
  profile,
  onUpdateProfile
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Form State
  const [fullName, setFullName] = useState(profile.fullName);
  const [designation, setDesignation] = useState(profile.designation);
  const [department, setDepartment] = useState(profile.department);
  const [institution, setInstitution] = useState(profile.institution);
  const [location, setLocation] = useState(profile.location || '');
  const [yearsOfExperience, setYearsOfExperience] = useState(profile.yearsOfExperience || 10);
  const [expertise, setExpertise] = useState<string[]>(profile.expertise || []);
  const [researchInterests, setResearchInterests] = useState<string[]>(profile.researchInterests || []);
  const [preferredTypes, setPreferredTypes] = useState<CollaborationType[]>(profile.preferredCollaborationTypes || []);

  // Tag inputs
  const [newExpertiseTag, setNewExpertiseTag] = useState('');
  const [newResearchTag, setNewResearchTag] = useState('');

  const handleAddExpertise = () => {
    if (newExpertiseTag.trim() && !expertise.includes(newExpertiseTag.trim())) {
      setExpertise([...expertise, newExpertiseTag.trim()]);
      setNewExpertiseTag('');
    }
  };

  const handleRemoveExpertise = (tag: string) => {
    setExpertise(expertise.filter(t => t !== tag));
  };

  const handleAddResearch = () => {
    if (newResearchTag.trim() && !researchInterests.includes(newResearchTag.trim())) {
      setResearchInterests([...researchInterests, newResearchTag.trim()]);
      setNewResearchTag('');
    }
  };

  const handleRemoveResearch = (tag: string) => {
    setResearchInterests(researchInterests.filter(t => t !== tag));
  };

  const handleToggleCollabType = (type: CollaborationType) => {
    if (preferredTypes.includes(type)) {
      setPreferredTypes(preferredTypes.filter(t => t !== type));
    } else {
      setPreferredTypes([...preferredTypes, type]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const updates: Partial<FacultyProfile> = {
      fullName,
      designation,
      department,
      institution,
      location,
      yearsOfExperience: Number(yearsOfExperience),
      expertise,
      researchInterests,
      preferredCollaborationTypes: preferredTypes,
      profileCompletion: Math.min(100, 50 + (expertise.length > 3 ? 20 : 10) + (researchInterests.length > 2 ? 15 : 5) + (preferredTypes.length > 2 ? 15 : 5))
    };

    const res = await onUpdateProfile(updates);
    setIsSaving(false);
    if (res.success) {
      setIsEditing(false);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Profile Overview */}
      <Card
        variant="default"
        className="p-6 rounded-2xl border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white space-y-5"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/40 border border-indigo-400/40 text-indigo-200 flex items-center justify-center font-black text-2xl shadow-inner shrink-0">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{profile.fullName}</h2>
                <Badge variant="emerald" size="sm">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Verified Faculty
                </Badge>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                {profile.designation} • {profile.department}
              </p>
              <p className="text-xs text-slate-400">
                {profile.institution}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSave}
                  isLoading={isSaving}
                  leftIcon={Save}
                >
                  Save Profile
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-white border-indigo-400/40 hover:bg-indigo-900/50"
              >
                Edit Faculty Profile
              </Button>
            )}
          </div>
        </div>

        {/* Profile Completion Indicator */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-indigo-200 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Collaboration Match Profile Completeness
            </span>
            <span className="font-bold text-white">{profile.profileCompletion || 92}%</span>
          </div>
          <ProgressBar value={profile.profileCompletion || 92} max={100} color="indigo" size="sm" />
        </div>
      </Card>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Faculty profile and expertise keywords updated successfully! Match scores have recalculated.</span>
        </div>
      )}

      {/* Profile Details & Keywords Form / View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Competencies, Research, and Types */}
        <div className="lg:col-span-2 space-y-5">
          {/* Domain Expertise */}
          <Card variant="default" className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Technical & Pedagogical Expertise</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Primary competencies used for 60% of deterministic opportunity matching
                </p>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newExpertiseTag}
                  onChange={(e) => setNewExpertiseTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExpertise())}
                  placeholder="Add skill (e.g. Machine Learning, Cloud, VLSI)..."
                  className="flex-1 px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
                <Button size="sm" variant="outline" onClick={handleAddExpertise} leftIcon={Plus}>
                  Add
                </Button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {expertise.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                  {tag}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveExpertise(tag)}
                      className="ml-1 text-indigo-400 hover:text-indigo-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </Card>

          {/* Research Interests */}
          <Card variant="default" className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>Research Interests & Lab Domains</span>
              </h3>
              <p className="text-xs text-slate-500">
                Active research themes evaluated for 20% of research collaboration alignment
              </p>
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newResearchTag}
                  onChange={(e) => setNewResearchTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResearch())}
                  placeholder="Add research topic (e.g. Federated Learning, Generative AI)..."
                  className="flex-1 px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
                <Button size="sm" variant="outline" onClick={handleAddResearch} leftIcon={Plus}>
                  Add
                </Button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {researchInterests.map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                  {topic}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveResearch(topic)}
                      className="ml-1 text-sky-400 hover:text-sky-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </Card>

          {/* Preferred Collaboration Types */}
          <Card variant="default" className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>Preferred Collaboration Formats</span>
              </h3>
              <p className="text-xs text-slate-500">
                Select the engagement modes you are actively interested in taking on
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {ALL_COLLAB_TYPES.map((type) => {
                const isSelected = preferredTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    disabled={!isEditing}
                    onClick={() => handleToggleCollabType(type)}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-left border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    } ${!isEditing ? 'cursor-default' : 'hover:border-emerald-400'}`}
                  >
                    <span className="truncate">{type}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Col: Affiliation & Verified Experience (Passport) */}
        <div className="space-y-5">
          {/* Institutional Affiliation Card */}
          <Card variant="default" className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Academic Affiliation</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block font-semibold">Institution</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{profile.institution}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-semibold">Department</span>
                <p className="font-semibold text-slate-700 dark:text-slate-300">{profile.department}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-semibold">Designation</span>
                <p className="font-semibold text-slate-700 dark:text-slate-300">{profile.designation}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">Location</span>
                  <p className="font-medium text-slate-700 dark:text-slate-300">{profile.location || 'Bengaluru, India'}</p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">Experience</span>
                  <p className="font-medium text-slate-700 dark:text-slate-300">{profile.yearsOfExperience || 10} Years</p>
                </div>
              </div>
            </div>
          </Card>

          {/* ========================================================================= */}
          {/* VERIFIED FACULTY EXPERIENCE (FACULTY PASSPORT) */}
          {/* ========================================================================= */}
          <Card
            variant="default"
            className="p-5 rounded-2xl border-indigo-100 dark:border-indigo-950/80 bg-gradient-to-b from-indigo-50/30 to-transparent dark:from-indigo-950/20 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Faculty Passport</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Cryptographically verifiable record of completed industry engagements
                </p>
              </div>
            </div>

            {profile.verifiedExperiences && profile.verifiedExperiences.length > 0 ? (
              <div className="space-y-3">
                {profile.verifiedExperiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {exp.title}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 block">
                          {exp.industry} • {exp.collaborationType}
                        </span>
                      </div>
                      <Badge variant="emerald" size="sm">
                        ✓ Verified
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {exp.outcome}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span>Completed: {exp.completedDate}</span>
                      <span>Duration: {exp.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 text-xs text-slate-500">
                No completed collaborations recorded yet. When you complete an industry engagement, the partner verification will automatically log into your Faculty Passport.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
