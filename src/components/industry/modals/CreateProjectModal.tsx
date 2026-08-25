import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { LiveProjectPosting } from '../../../types/industry';
import {
  FileCode2,
  Trophy,
  Calendar,
  Layers,
  CheckCircle2,
  Plus,
  X,
  Sparkles,
  UserCheck
} from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: LiveProjectPosting) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<LiveProjectPosting['category']>('Distributed Systems');
  const [problemStatement, setProblemStatement] = useState('');
  const [bountyOrGrant, setBountyOrGrant] = useState('₹1,50,000 Cash Grant + Direct PPO Interviews');
  const [duration, setDuration] = useState('4 Weeks (Milestone-based)');
  const [mentorName, setMentorName] = useState('Elena Vance');
  const [mentorRole, setMentorRole] = useState('Principal Platform Architect, NovaCore');
  const [techInput, setTechInput] = useState('');
  const [deliverableInput, setDeliverableInput] = useState('');
  const [requiredTechStack, setRequiredTechStack] = useState<string[]>([
    'Go',
    'WebSockets',
    'Redis Streams',
    'Docker'
  ]);
  const [deliverables, setDeliverables] = useState<string[]>([
    'Working Docker Compose cluster with p99 latency benchmarks',
    'Automated integration and chaos test suite',
    'Comprehensive architecture design document (RFC)'
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTech = () => {
    if (techInput.trim() && !requiredTechStack.includes(techInput.trim())) {
      setRequiredTechStack([...requiredTechStack, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setRequiredTechStack(requiredTechStack.filter((t) => t !== tech));
  };

  const handleAddDeliverable = () => {
    if (deliverableInput.trim() && !deliverables.includes(deliverableInput.trim())) {
      setDeliverables([...deliverables, deliverableInput.trim()]);
      setDeliverableInput('');
    }
  };

  const handleRemoveDeliverable = (deliv: string) => {
    setDeliverables(deliverables.filter((d) => d !== deliv));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !problemStatement.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newProject: LiveProjectPosting = {
        id: `proj-${Date.now()}`,
        title: title.trim(),
        category,
        problemStatement: problemStatement.trim(),
        bountyOrGrant,
        duration,
        status: 'active',
        postedDate: 'Just now',
        deadline: '30 Days from now',
        submissionsCount: 0,
        shortlistedCount: 0,
        deliverables,
        requiredTechStack,
        mentorLead: {
          name: mentorName,
          role: mentorRole,
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
        }
      };

      onCreateProject(newProject);
      setIsSubmitting(false);
      onClose();
      // Reset form
      setTitle('');
      setProblemStatement('');
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Live Industry Project / Problem Statement"
      description="Sponsor a practical engineering challenge for student cohorts with verified bounties, code review, and hiring fast-tracks."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Project Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Problem Statement Title *
          </label>
          <div className="relative">
            <FileCode2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              placeholder="e.g. High-Throughput Sub-10ms Edge WebSocket Protocol Gateway"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Category & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Engineering Domain / Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="Distributed Systems">Distributed Systems & Concurrency</option>
              <option value="AI & LLMs">AI, RAG & Vector Retrieval</option>
              <option value="Cloud Infrastructure">Cloud Infrastructure & Kubernetes</option>
              <option value="Frontend Architecture">Frontend Architecture & Design Systems</option>
              <option value="Cybersecurity">Cybersecurity & Zero-Trust IAM</option>
              <option value="Mobile & IoT">Mobile & IoT Edge Systems</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Project Timeline / Duration
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 4 Weeks (Milestone-based)"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Problem Statement Details */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Problem Statement Specification *
          </label>
          <textarea
            rows={3}
            required
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            placeholder="Explain the real-world engineering challenge, baseline metrics, failure scenarios, and expected outcomes..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        {/* Bounty / Prize & Mentor Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Bounty / Cash Grant & Incentives
            </label>
            <div className="relative">
              <Trophy className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
              <input
                type="text"
                value={bountyOrGrant}
                onChange={(e) => setBountyOrGrant(e.target.value)}
                placeholder="e.g. ₹1,50,000 Cash Grant + Direct PPO"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Mentor Lead
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
                placeholder="e.g. Elena Vance (Principal Architect)"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Required Tech Stack */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Recommended Tech Stack
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add technology (e.g. Go, Redis, WebSockets)..."
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTech();
                }
              }}
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={Plus}
              onClick={handleAddTech}
            >
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            {requiredTechStack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60"
              >
                <span>{tech}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTech(tech)}
                  className="hover:text-rose-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Deliverables Checklist */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Required Milestone Deliverables
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add key deliverable (e.g. Benchmark report under 50k RPS)..."
              value={deliverableInput}
              onChange={(e) => setDeliverableInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddDeliverable();
                }
              }}
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={Plus}
              onClick={handleAddDeliverable}
            >
              Add
            </Button>
          </div>

          <div className="space-y-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            {deliverables.map((deliv, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{deliv}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDeliverable(deliv)}
                  className="text-slate-400 hover:text-rose-500 p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
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
            Publish Live Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};
