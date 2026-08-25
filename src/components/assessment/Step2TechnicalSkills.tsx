import React from 'react';
import { TechnicalSkillsAnswers } from '../../types/assessment';
import { RatingInput } from './RatingInput';
import { Code2, Server, Database, Cloud, Binary, Cpu, CheckCircle2, Wrench } from 'lucide-react';

interface Step2TechnicalSkillsProps {
  data: TechnicalSkillsAnswers;
  onChange: (updated: Partial<TechnicalSkillsAnswers>) => void;
}

const PROGRAMMING_LANGUAGES = [
  'TypeScript',
  'JavaScript (ES2024)',
  'Python',
  'Go (Golang)',
  'Rust',
  'Java',
  'C++',
  'SQL / PostgreSQL',
  'Kotlin / Swift'
];

const ARCHITECTURE_STYLES = [
  {
    id: 'Event-Driven Microservices & Cloud-Native',
    title: 'Event-Driven Microservices',
    desc: 'Decoupled services communicating via Kafka / RabbitMQ and gRPC with independent scaling.'
  },
  {
    id: 'Modular Monolith with Domain-Driven Design',
    title: 'Modular Clean Monolith',
    desc: 'High velocity single deployment artifact with strictly partitioned domain boundaries.'
  },
  {
    id: 'Serverless, Edge & JAMstack Architecture',
    title: 'Serverless & Edge Infrastructure',
    desc: 'Stateless edge lambdas, CDN caching, and managed backend-as-a-service primitives.'
  },
  {
    id: 'Hybrid Distributed Systems & CQRS',
    title: 'Hybrid Distributed Systems & CQRS',
    desc: 'Command Query Responsibility Segregation with read-replicas and vector search nodes.'
  }
];

export const Step2TechnicalSkills: React.FC<Step2TechnicalSkillsProps> = ({
  data,
  onChange
}) => {
  const toggleLanguage = (lang: string) => {
    const current = [...data.primaryLanguages];
    const index = current.indexOf(lang);
    if (index > -1) {
      if (current.length > 1) {
        current.splice(index, 1);
      }
    } else {
      current.push(lang);
    }
    onChange({ primaryLanguages: current });
  };

  return (
    <div className="space-y-6">
      {/* 1. Core Programming Languages (Multiple Choice) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            1. Core Programming Languages & Environments <span className="text-rose-500">*</span>
          </label>
          <span className="text-xs text-slate-400">Select all you actively use</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PROGRAMMING_LANGUAGES.map((lang) => {
            const isSelected = data.primaryLanguages.includes(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLanguage(lang)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{lang}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Technical Domain Proficiency (Ratings 1-5) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            2. Self-Assessment Across Core Technical Disciplines <span className="text-rose-500">*</span>
          </label>
          <span className="text-xs text-slate-400">1 (Novice) to 5 (Expert)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <RatingInput
            label="Frontend & Modern UI Engineering"
            sublabel="React 19, TypeScript, state management, accessibility & web vitals"
            value={data.frontendRating}
            onChange={(val) => onChange({ frontendRating: val })}
          />

          <RatingInput
            label="Backend APIs & Microservices"
            sublabel="Node/Express/Go APIs, gRPC, authentication, middleware, concurrency"
            value={data.backendRating}
            onChange={(val) => onChange({ backendRating: val })}
          />

          <RatingInput
            label="Databases & Data Modeling"
            sublabel="PostgreSQL, indexing, Redis caching, schema design & query tuning"
            value={data.databaseRating}
            onChange={(val) => onChange({ databaseRating: val })}
          />

          <RatingInput
            label="Cloud Infrastructure & DevOps"
            sublabel="Docker, Kubernetes, GitHub Actions CI/CD, AWS/GCP services"
            value={data.cloudDevOpsRating}
            onChange={(val) => onChange({ cloudDevOpsRating: val })}
          />

          <RatingInput
            label="Data Structures & Algorithmic Rigor"
            sublabel="Trees, graphs, dynamic programming, space-time complexity analysis"
            value={data.dsaRating}
            onChange={(val) => onChange({ dsaRating: val })}
          />

          <RatingInput
            label="System Design & Distributed Scalability"
            sublabel="CAP theorem, load balancing, message queues, rate limiting, idempotency"
            value={data.systemDesignRating}
            onChange={(val) => onChange({ systemDesignRating: val })}
          />
        </div>
      </div>

      {/* 3. Practical Project Experience & Codebase Maturity (Slider) */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            3. Hands-on Project Depth & Real-World Codebase Exposure
          </label>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md self-start sm:self-auto">
            {data.practicalExperienceScore}% Readiness Index
          </span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Estimate your aggregate experience building non-trivial applications, handling error states, writing tests, and managing Git collaborative workflows.
        </p>

        <div className="space-y-1 pt-1">
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={data.practicalExperienceScore}
            onChange={(e) => onChange({ practicalExperienceScore: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-1">
            <span>10% - Tutorial Code / Toy Scripts</span>
            <span>50% - Medium Full-Stack Apps</span>
            <span>100% - Production Deployments & Scaled APIs</span>
          </div>
        </div>
      </div>

      {/* 4. Preferred Architecture Style (Radio) */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-900 dark:text-slate-100 block">
          4. Preferred Architectural Pattern <span className="text-rose-500">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ARCHITECTURE_STYLES.map((style) => {
            const isSelected = data.preferredArchitecture === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onChange({ preferredArchitecture: style.id })}
                className={`p-3.5 rounded-xl border text-left transition-all space-y-1 cursor-pointer ${
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
                    {style.title}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {style.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
