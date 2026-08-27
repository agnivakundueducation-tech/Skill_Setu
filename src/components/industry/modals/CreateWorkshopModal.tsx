import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { WorkshopPosting } from '../../../types/industry';
import {
  Presentation,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Plus,
  X,
  Sparkles,
  Award
} from 'lucide-react';

interface CreateWorkshopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateWorkshop: (workshop: WorkshopPosting) => void;
}

export const CreateWorkshopModal: React.FC<CreateWorkshopModalProps> = ({
  isOpen,
  onClose,
  onCreateWorkshop
}) => {
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('Elena Vance');
  const [instructorRole, setInstructorRole] = useState('Principal Platform Architect, NovaCore Technologies');
  const [date, setDate] = useState('Sep 15, 2026');
  const [time, setTime] = useState('4:00 PM - 6:30 PM IST');
  const [duration, setDuration] = useState('2.5 Hours Masterclass');
  const [platform, setPlatform] = useState<WorkshopPosting['platform']>('Virtual (SkillSetu Live)');
  const [targetAudience, setTargetAudience] = useState('Pre-final & Final Year Students, Backend Developers');
  const [capacity, setCapacity] = useState(500);
  const [prereqInput, setPrereqInput] = useState('');
  const [agendaInput, setAgendaInput] = useState('');
  const [prerequisites, setPrerequisites] = useState<string[]>([
    'Basic Go / C++ syntax',
    'Docker desktop installed',
    'Basic knowledge of REST APIs and Concurrency'
  ]);
  const [agenda, setAgenda] = useState<string[]>([
    'Introduction to distributed event architectures',
    'Hands-on lab: Redis Streams consumer groups',
    'Live debugging & performance profiling session',
    'Q&A and direct internship fast-track code challenge'
  ]);
  const [certificateIssued, setCertificateIssued] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddPrereq = () => {
    if (prereqInput.trim() && !prerequisites.includes(prereqInput.trim())) {
      setPrerequisites([...prerequisites, prereqInput.trim()]);
      setPrereqInput('');
    }
  };

  const handleRemovePrereq = (item: string) => {
    setPrerequisites(prerequisites.filter((p) => p !== item));
  };

  const handleAddAgenda = () => {
    if (agendaInput.trim() && !agenda.includes(agendaInput.trim())) {
      setAgenda([...agenda, agendaInput.trim()]);
      setAgendaInput('');
    }
  };

  const handleRemoveAgenda = (item: string) => {
    setAgenda(agenda.filter((a) => a !== item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newWorkshop: WorkshopPosting = {
        id: `ws-${Date.now()}`,
        title: title.trim(),
        instructor: instructor.trim(),
        instructorRole: instructorRole.trim(),
        instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
        date,
        time,
        duration,
        platform,
        targetAudience,
        registeredCount: 0,
        capacity: Number(capacity),
        status: 'upcoming',
        prerequisites,
        agenda,
        certificateIssued
      };

      onCreateWorkshop(newWorkshop);
      setIsSubmitting(false);
      onClose();
      // Reset form
      setTitle('');
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Host Technical Workshop & Masterclass"
      description="Schedule live interactive engineering masterclasses, campus lab bootcamps, and direct talent interaction sessions."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Workshop Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Workshop / Masterclass Title *
          </label>
          <div className="relative">
            <Presentation className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              placeholder="e.g. Architecting Sub-10ms Distributed Microservices with Go & Redis"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Instructor Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Speaker / Lead Engineer
            </label>
            <input
              type="text"
              required
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              placeholder="e.g. Elena Vance"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Designation & Company
            </label>
            <input
              type="text"
              value={instructorRole}
              onChange={(e) => setInstructorRole(e.target.value)}
              placeholder="e.g. Principal Platform Architect"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Date, Time & Platform */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Session Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Sep 15, 2026"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Time (IST)
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 4:00 PM - 6:30 PM"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Platform / Mode
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as any)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="Virtual (SkillSetu Live)">Virtual (SkillSetu Live)</option>
              <option value="Campus Lab (In-Person)">Campus Lab (In-Person)</option>
              <option value="Hybrid Masterclass">Hybrid Masterclass</option>
            </select>
          </div>
        </div>

        {/* Capacity & Target Audience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Seat Capacity
            </label>
            <div className="relative">
              <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                min="10"
                max="2000"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Target Audience
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Computer Science Seniors, Backend Aspirants"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Agenda Outline */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Key Agenda Topics
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add agenda topic..."
              value={agendaInput}
              onChange={(e) => setAgendaInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddAgenda();
                }
              }}
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={Plus}
              onClick={handleAddAgenda}
            >
              Add
            </Button>
          </div>

          <div className="space-y-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            {agenda.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveAgenda(item)}
                  className="text-slate-400 hover:text-rose-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Certificate Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Issue SkillSetu Verified Attendance Certificate
              </div>
              <div className="text-[11px] text-slate-500">
                Attendees receive a verifiable credential added to their digital portfolio upon session completion.
              </div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={certificateIssued}
            onChange={(e) => setCertificateIssued(e.target.checked)}
            className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={CheckCircle2}
          >
            Publish Workshop Event
          </Button>
        </div>
      </form>
    </Modal>
  );
};
