import React from 'react';
import { CareerInterestsAnswers } from '../../types/assessment';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Compass, CheckCircle2, Sparkles, Flame, Layers } from 'lucide-react';

interface Step1CareerInterestsProps {
  data: CareerInterestsAnswers;
  onChange: (updated: Partial<CareerInterestsAnswers>) => void;
}

const PRIMARY_DOMAINS = [
  {
    id: 'Full-Stack Software Engineering',
    title: 'Full-Stack Software Engineering',
    desc: 'End-to-end web apps, modern frontend systems, responsive APIs, and scalable databases.'
  },
  {
    id: 'AI, Machine Learning & LLM Systems',
    title: 'AI, Machine Learning & LLM Systems',
    desc: 'Retrieval Augmented Generation (RAG), vector embeddings, agentic workflows, and model integration.'
  },
  {
    id: 'Cloud Platform & Distributed Systems',
    title: 'Cloud Platform & Distributed Systems',
    desc: 'High-throughput microservices, Kubernetes clusters, event streams (Kafka), and cloud infra.'
  },
  {
    id: 'Frontend Engineering & Design Systems',
    title: 'Frontend Engineering & Design Systems',
    desc: 'React 19 concurrent architectures, web vitals, accessible design systems, and rich micro-interactions.'
  },
  {
    id: 'Cybersecurity & Cloud Defense',
    title: 'Cybersecurity & Cloud Defense',
    desc: 'Zero-trust networks, cryptographically secure APIs, vulnerability auditing, and identity auth.'
  }
];

const SECTORS_LIST = [
  'SaaS & Enterprise Tools',
  'AI & Machine Learning',
  'FinTech & Banking',
  'HealthTech & Bio-Informatics',
  'Developer Infrastructure & Tooling',
  'E-Commerce & High-Frequency Retail',
  'EdTech & Continuous Learning',
  'ClimateTech & Clean Energy'
];

const EXCITEMENT_FACTORS_LIST = [
  'Architecting High-Throughput Distributed Systems',
  'Crafting Intuitive & Accessible UI Experiences',
  'AI & LLM Orchestration & Agentic Pipelines',
  'Database Optimization & Ultra-Low Latency Caching',
  'End-to-End Product Ownership & User Impact',
  'Open-Source Collaboration & Developer Community',
  'Automated CI/CD & Cloud Infrastructure as Code'
];

const VELOCITY_OPTIONS = [
  {
    id: 'Rapid Iteration & Prototyping',
    title: 'Rapid Prototyping & Fast Turnaround',
    desc: 'Thrives in fast-paced environments shipping daily updates and validating MVPs.'
  },
  {
    id: 'Balanced High Velocity & Architectural Rigor',
    title: 'Balanced Velocity & Solid Architecture',
    desc: 'Harmonious blend of rapid feature delivery with robust unit testing and type safety.'
  },
  {
    id: 'Methodical Deep Systems Engineering',
    title: 'Methodical Deep Systems Engineering',
    desc: 'Prefers thorough RFCs, formal benchmarking, low-level optimization, and zero downtime.'
  }
];

export const Step1CareerInterests: React.FC<Step1CareerInterestsProps> = ({
  data,
  onChange
}) => {
  const toggleSector = (sector: string) => {
    const current = [...data.industrySectors];
    const index = current.indexOf(sector);
    if (index > -1) {
      if (current.length > 1) {
        current.splice(index, 1);
      }
    } else {
      current.push(sector);
    }
    onChange({ industrySectors: current });
  };

  const toggleExcitement = (factor: string) => {
    const current = [...data.excitementFactors];
    const index = current.indexOf(factor);
    if (index > -1) {
      if (current.length > 1) {
        current.splice(index, 1);
      }
    } else {
      current.push(factor);
    }
    onChange({ excitementFactors: current });
  };

  return (
    <div className="space-y-6">
      {/* 1. Primary Career Domain (Radio) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            1. Primary Career Focus & Engineering Discipline <span className="text-rose-500">*</span>
          </label>
          <span className="text-xs text-slate-400">Select one core trajectory</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRIMARY_DOMAINS.map((domain) => {
            const isSelected = data.primaryDomain === domain.id;
            return (
              <button
                key={domain.id}
                type="button"
                onClick={() => onChange({ primaryDomain: domain.id })}
                className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>

                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {domain.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {domain.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Industry Sectors of Interest (Multiple Choice Pills) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            2. Industry Sectors of High Interest <span className="text-rose-500">*</span>
          </label>
          <span className="text-xs text-slate-400">Multi-select (Select at least 1)</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {SECTORS_LIST.map((sector) => {
            const isSelected = data.industrySectors.includes(sector);
            return (
              <button
                key={sector}
                type="button"
                onClick={() => toggleSector(sector)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{sector}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Core Excitement Factors (Multiple Choice) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            3. What Drives & Excites You in Engineering?
          </label>
          <span className="text-xs text-slate-400">Select top motivations</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {EXCITEMENT_FACTORS_LIST.map((factor) => {
            const isSelected = data.excitementFactors.includes(factor);
            return (
              <button
                key={factor}
                type="button"
                onClick={() => toggleExcitement(factor)}
                className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{factor}</span>
                {isSelected ? (
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-md border border-slate-300 dark:border-slate-700 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Problem-Solving Passion & Complexity Comfort (Slider) */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500" />
            4. Passion & Appetite for Open-Ended Problem Solving
          </label>
          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md self-start sm:self-auto">
            Level {data.problemSolvingPassion} / 10 ({data.problemSolvingPassion >= 8 ? 'High Tenacity' : data.problemSolvingPassion >= 5 ? 'Balanced' : 'Structured Focus'})
          </span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          How energized do you feel when tackling complex bugs, undocumented APIs, or zero-to-one architectural challenges?
        </p>

        <div className="space-y-1 pt-1">
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={data.problemSolvingPassion}
            onChange={(e) => onChange({ problemSolvingPassion: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-1">
            <span>1 - Prefer Clear Step-by-Step Specs</span>
            <span>5 - Balanced Problem Solver</span>
            <span>10 - Crave High Ambiguity & Deep R&D</span>
          </div>
        </div>
      </div>

      {/* 5. Work Velocity Preference (Radio) */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-900 dark:text-slate-100 block">
          5. Ideal Development Velocity & Engineering Cadence <span className="text-rose-500">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {VELOCITY_OPTIONS.map((option) => {
            const isSelected = data.workVelocity === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onChange({ workVelocity: option.id })}
                className={`p-3.5 rounded-xl border text-left transition-all space-y-1.5 cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isSelected && <div className="w-1 h-1 rounded-full bg-white" />}
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {option.title}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {option.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
