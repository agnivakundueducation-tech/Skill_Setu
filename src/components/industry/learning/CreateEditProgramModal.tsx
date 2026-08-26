import React, { useState, useEffect } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import {
  LearningProgram,
  LearningProgramType,
  ProgramDeliveryMode,
  ProgramDifficulty,
  ProgramModule
} from '../../../types/learningProgram';
import {
  GraduationCap,
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  Users,
  Award,
  Layers,
  CheckCircle2,
  BookOpen,
  MapPin,
  Clock,
  UserCheck
} from 'lucide-react';

interface CreateEditProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProgram: (programData: any) => Promise<boolean>;
  editingProgram?: LearningProgram | null;
  organizationName?: string;
  organizationId?: string;
}

const PROGRAM_TYPES: LearningProgramType[] = [
  'Training Program',
  'Certification Course',
  'Workshop',
  'Mentorship Program',
  'Masterclass',
  'Bootcamp'
];

const DIFFICULTY_LEVELS: ProgramDifficulty[] = ['Beginner', 'Intermediate', 'Advanced'];
const DELIVERY_MODES: ProgramDeliveryMode[] = ['Online', 'Hybrid', 'In-Person'];

export const CreateEditProgramModal: React.FC<CreateEditProgramModalProps> = ({
  isOpen,
  onClose,
  onSaveProgram,
  editingProgram,
  organizationName = 'Apex Cloud Systems',
  organizationId = 'demo-industry-apex'
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [programType, setProgramType] = useState<LearningProgramType>('Training Program');
  const [domain, setDomain] = useState('Cloud Architecture & Distributed Systems');
  const [difficultyLevel, setDifficultyLevel] = useState<ProgramDifficulty>('Intermediate');
  const [deliveryMode, setDeliveryMode] = useState<ProgramDeliveryMode>('Online');
  const [duration, setDuration] = useState('6 Weeks (80 Hours)');
  const [startDate, setStartDate] = useState('2026-09-15');
  const [endDate, setEndDate] = useState('2026-10-30');
  const [capacity, setCapacity] = useState<number>(60);
  const [stipendOrGrant, setStipendOrGrant] = useState('Free for shortlisted university students');
  const [locationDetails, setLocationDetails] = useState('');

  // Skills
  const [targetSkillInput, setTargetSkillInput] = useState('');
  const [targetSkills, setTargetSkills] = useState<string[]>([
    'Distributed Systems',
    'Microservices',
    'Apache Kafka'
  ]);
  const [prereqInput, setPrereqInput] = useState('');
  const [prerequisiteSkills, setPrerequisiteSkills] = useState<string[]>([
    'Go (Golang)',
    'Linux Fundamentals'
  ]);

  // Mentor Info
  const [mentorName, setMentorName] = useState('Dr. Vikramaditya Sen');
  const [mentorTitle, setMentorTitle] = useState('Principal Distributed Architect');
  const [mentorEmail, setMentorEmail] = useState('vikram.sen@apexcloud.io');

  // Certification Info
  const [isCertificateOffered, setIsCertificateOffered] = useState(true);
  const [certificateTitle, setCertificateTitle] = useState('Enterprise Certified Cloud Engineer');
  const [issuerName, setIssuerName] = useState('Apex Cloud Engineering Academy');

  // Modules / Milestones
  const [modules, setModules] = useState<ProgramModule[]>([
    {
      id: 'mod-1',
      order: 1,
      title: 'Module 1: Foundations & Architecture Baseline',
      description: 'Core concepts, protocol architecture, and dev environment initialization.',
      duration: '10 Hours'
    },
    {
      id: 'mod-2',
      order: 2,
      title: 'Module 2: High-Performance Pipelines & Streaming',
      description: 'Hands-on message queues, consumer synchronization, and benchmarks.',
      duration: '15 Hours'
    },
    {
      id: 'mod-3',
      order: 3,
      title: 'Module 3: Production Reliability & Capstone Defense',
      description: 'Fault tolerance simulation and final capstone code evaluation.',
      duration: '20 Hours'
    }
  ]);
  const [newModTitle, setNewModTitle] = useState('');
  const [newModDesc, setNewModDesc] = useState('');
  const [newModDuration, setNewModDuration] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (editingProgram) {
      setTitle(editingProgram.title);
      setDescription(editingProgram.description);
      setProgramType(editingProgram.programType);
      setDomain(editingProgram.domain);
      setDifficultyLevel(editingProgram.difficultyLevel);
      setDeliveryMode(editingProgram.deliveryMode);
      setDuration(editingProgram.duration);
      setStartDate(editingProgram.startDate);
      setEndDate(editingProgram.endDate);
      setCapacity(editingProgram.capacity);
      setStipendOrGrant(editingProgram.stipendOrGrant || '');
      setLocationDetails(editingProgram.locationDetails || '');
      setTargetSkills(editingProgram.targetSkills || []);
      setPrerequisiteSkills(editingProgram.prerequisiteSkills || []);
      if (editingProgram.mentorInfo) {
        setMentorName(editingProgram.mentorInfo.name || '');
        setMentorTitle(editingProgram.mentorInfo.title || '');
        setMentorEmail(editingProgram.mentorInfo.email || '');
      }
      if (editingProgram.certificationInfo) {
        setIsCertificateOffered(editingProgram.certificationInfo.isOffered);
        setCertificateTitle(editingProgram.certificationInfo.certificateTitle || '');
        setIssuerName(editingProgram.certificationInfo.issuerName || '');
      }
      if (editingProgram.modules && editingProgram.modules.length > 0) {
        setModules(editingProgram.modules);
      }
    }
  }, [editingProgram]);

  const handleAddTargetSkill = () => {
    if (targetSkillInput.trim() && !targetSkills.includes(targetSkillInput.trim())) {
      setTargetSkills([...targetSkills, targetSkillInput.trim()]);
      setTargetSkillInput('');
    }
  };

  const handleRemoveTargetSkill = (skill: string) => {
    setTargetSkills(targetSkills.filter((s) => s !== skill));
  };

  const handleAddPrereqSkill = () => {
    if (prereqInput.trim() && !prerequisiteSkills.includes(prereqInput.trim())) {
      setPrerequisiteSkills([...prerequisiteSkills, prereqInput.trim()]);
      setPrereqInput('');
    }
  };

  const handleRemovePrereqSkill = (skill: string) => {
    setPrerequisiteSkills(prerequisiteSkills.filter((s) => s !== skill));
  };

  const handleAddModule = () => {
    if (!newModTitle.trim()) return;
    const newMod: ProgramModule = {
      id: `mod-${Date.now()}`,
      order: modules.length + 1,
      title: newModTitle.trim(),
      description: newModDesc.trim() || 'Comprehensive module deliverables and code assignments.',
      duration: newModDuration.trim() || '10 Hours'
    };
    setModules([...modules, newMod]);
    setNewModTitle('');
    setNewModDesc('');
    setNewModDuration('');
  };

  const handleRemoveModule = (modId: string) => {
    const updated = modules.filter((m) => m.id !== modId).map((m, idx) => ({ ...m, order: idx + 1 }));
    setModules(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Program title is required');
      return;
    }
    if (!description.trim()) {
      setFormError('Description is required');
      return;
    }
    if (targetSkills.length === 0) {
      setFormError('Please add at least one target skill');
      return;
    }
    if (modules.length === 0) {
      setFormError('Please configure at least one curriculum module / milestone');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      organizationId,
      organizationName,
      title: title.trim(),
      description: description.trim(),
      programType,
      domain: domain.trim(),
      difficultyLevel,
      deliveryMode,
      duration: duration.trim(),
      startDate,
      endDate,
      capacity: Number(capacity) || 50,
      stipendOrGrant: stipendOrGrant.trim(),
      locationDetails: locationDetails.trim(),
      targetSkills,
      prerequisiteSkills,
      mentorInfo: {
        name: mentorName.trim(),
        title: mentorTitle.trim(),
        email: mentorEmail.trim(),
        company: organizationName
      },
      certificationInfo: {
        isOffered: isCertificateOffered,
        certificateTitle: isCertificateOffered ? certificateTitle.trim() : '',
        issuerName: isCertificateOffered ? issuerName.trim() : '',
        accreditationLevel: 'Specialist',
        validity: 'Lifetime'
      },
      modules,
      status: editingProgram?.status || 'published'
    };

    try {
      const ok = await onSaveProgram(payload);
      if (ok) {
        onClose();
      }
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save learning program');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingProgram ? 'Edit Industry Learning Program' : 'Publish Industry Learning Program'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 p-1 max-h-[75vh] overflow-y-auto pr-2">
        {formError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300">
            {formError}
          </div>
        )}

        {/* Section 1: Basic Information */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" />
            <span>Program Identity & Overview</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Program Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cloud-Native Distributed Systems & Microservices Residency"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Program Type *
              </label>
              <select
                value={programType}
                onChange={(e) => setProgramType(e.target.value as LearningProgramType)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                {PROGRAM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Skill Domain *
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. Cloud Architecture, AI/ML, DevOps"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Difficulty Level
              </label>
              <select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value as ProgramDifficulty)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                {DIFFICULTY_LEVELS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Program Description & Objectives *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe curriculum outcomes, engineering hands-on projects, and recruiter visibility opportunities..."
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-normal"
              required
            />
          </div>
        </div>

        {/* Section 2: Logistics & Schedule */}
        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>Format, Schedule & Capacity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Delivery Mode
              </label>
              <select
                value={deliveryMode}
                onChange={(e) => setDeliveryMode(e.target.value as ProgramDeliveryMode)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                {DELIVERY_MODES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 6 Weeks (80 Hours)"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Student Capacity
              </label>
              <input
                type="number"
                min={5}
                max={500}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Stipend / Grants / Benefits
              </label>
              <input
                type="text"
                value={stipendOrGrant}
                onChange={(e) => setStipendOrGrant(e.target.value)}
                placeholder="e.g. Free sponsorship, INR 15,000 Milestone Bounty"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {deliveryMode !== 'Online' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Location / Lab Details
                </label>
                <input
                  type="text"
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  placeholder="e.g. Innovation Campus, Whitefield, Bengaluru"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Target Skills & Prerequisites */}
        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Target Competencies & Skill Gap Objectives</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Target Skills Taught (Addresses Student Skill Gaps) *
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={targetSkillInput}
                onChange={(e) => setTargetSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTargetSkill();
                  }
                }}
                placeholder="Type skill & press Enter (e.g. Distributed Systems, Kafka, Next.js)"
                className="flex-1 px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
              <Button type="button" size="sm" variant="secondary" onClick={handleAddTargetSkill} className="text-xs">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {targetSkills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => handleRemoveTargetSkill(s)}
                    className="hover:text-rose-500 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Prerequisite Skills & Background
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={prereqInput}
                onChange={(e) => setPrereqInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPrereqSkill();
                  }
                }}
                placeholder="e.g. Go syntax, Linux CLI, Docker basics"
                className="flex-1 px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
              <Button type="button" size="sm" variant="secondary" onClick={handleAddPrereqSkill} className="text-xs">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {prerequisiteSkills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => handleRemovePrereqSkill(s)}
                    className="hover:text-rose-500 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Curriculum Modules / Milestones */}
        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            <span>Curriculum Modules & Progress Milestones ({modules.length})</span>
          </div>

          <div className="space-y-2">
            {modules.map((mod, index) => (
              <div
                key={mod.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-[10px] font-black flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {mod.title}
                    </span>
                    {mod.duration && (
                      <span className="text-[10px] text-slate-500 font-medium">({mod.duration})</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">{mod.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveModule(mod.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                  title="Remove module"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Add Next Module</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Module title (e.g. Module 4: Sharded Caching)"
                value={newModTitle}
                onChange={(e) => setNewModTitle(e.target.value)}
                className="sm:col-span-2 px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Duration (e.g. 15 Hours)"
                value={newModDuration}
                onChange={(e) => setNewModDuration(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <input
              type="text"
              placeholder="Key deliverable / description..."
              value={newModDesc}
              onChange={(e) => setNewModDesc(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
            <div className="flex justify-end">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleAddModule}
                leftIcon={Plus}
                className="text-xs"
              >
                Add Module
              </Button>
            </div>
          </div>
        </div>

        {/* Section 5: Industry Mentorship & Certificate */}
        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" />
            <span>Lead Industry Mentor & Certification</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mentor Name
              </label>
              <input
                type="text"
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
                placeholder="e.g. Dr. Vikramaditya Sen"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mentor Title / Role
              </label>
              <input
                type="text"
                value={mentorTitle}
                onChange={(e) => setMentorTitle(e.target.value)}
                placeholder="e.g. Principal Distributed Architect"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mentor Email
              </label>
              <input
                type="email"
                value={mentorEmail}
                onChange={(e) => setMentorEmail(e.target.value)}
                placeholder="e.g. vikram.sen@apexcloud.io"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Issue Verifiable Digital Certificate on Completion
                </span>
              </div>
              <input
                type="checkbox"
                checked={isCertificateOffered}
                onChange={(e) => setIsCertificateOffered(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded-sm focus:ring-indigo-500"
              />
            </div>

            {isCertificateOffered && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Official Certificate Title
                  </label>
                  <input
                    type="text"
                    value={certificateTitle}
                    onChange={(e) => setCertificateTitle(e.target.value)}
                    placeholder="e.g. Certified Cloud Distributed Systems Engineer"
                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Issuing Academy / Organization
                  </label>
                  <input
                    type="text"
                    value={issuerName}
                    onChange={(e) => setIssuerName(e.target.value)}
                    placeholder="e.g. Apex Cloud Engineering Institute"
                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={isSubmitting} leftIcon={CheckCircle2}>
            {isSubmitting ? 'Saving Program...' : editingProgram ? 'Update Program' : 'Publish Learning Program'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
