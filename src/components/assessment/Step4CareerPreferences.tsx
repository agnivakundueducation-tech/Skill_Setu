import React from 'react';
import { CareerPreferencesAnswers } from '../../types/assessment';
import { Briefcase, Building2, DollarSign, Target, Clock, Laptop, Home, Building } from 'lucide-react';

interface Step4CareerPreferencesProps {
  data: CareerPreferencesAnswers;
  onChange: (updated: Partial<CareerPreferencesAnswers>) => void;
}

const WORK_MODES = [
  {
    id: 'Remote-First (Global / Anywhere)',
    title: 'Remote-First',
    desc: 'Asynchronous workflows, written RFCs, autonomy from anywhere.',
    icon: Laptop
  },
  {
    id: 'Hybrid (1-2 days collaborative)',
    title: 'Hybrid Collaborative',
    desc: '1-2 days in-office for architectural whiteboarding & team sprints.',
    icon: Home
  },
  {
    id: 'On-site Office Campus',
    title: 'On-site Campus',
    desc: 'High in-person mentorship, pair programming, and campus culture.',
    icon: Building
  }
];

const COMPANY_STAGES = [
  {
    id: 'Seed to Series A Startup (<25 Engineers)',
    title: 'Early-Stage Startup (<25 Eng)',
    desc: 'Generalist wearing many hats, massive equity upside, 0-to-1 build speed.'
  },
  {
    id: 'High-Growth Tech Scaleup (Series B - Pre-IPO)',
    title: 'High-Growth Scaleup (Series B - Pre-IPO)',
    desc: 'Hyper-scaling infrastructure, clear mentorship paths, proven product-market fit.'
  },
  {
    id: 'Global Enterprise & Tier-1 Big Tech',
    title: 'Global Tech Enterprise & Big Tech',
    desc: 'Massive scale systems (100M+ users), structured leveling, top compensation.'
  },
  {
    id: 'Open Source Labs & AI Research Org',
    title: 'Open Source & AI Research Labs',
    desc: 'Cutting-edge foundational tooling, public codebases, academic rigor.'
  }
];

const COMPENSATION_BANDS = [
  { id: '$45,000 - $70,000 / yr (Associate / Intern)', label: '$45k - $70k', sub: 'Early Associate / Paid Fellow' },
  { id: '$70,000 - $100,000 / yr (Junior SWE)', label: '$70k - $100k', sub: 'Junior Software Engineer' },
  { id: '$100,000 - $135,000 / yr (Mid-Level SWE)', label: '$100k - $135k', sub: 'Mid-Level Full-Stack SWE' },
  { id: '$135,000 - $175,000+ / yr (Senior / Specialist)', label: '$135k - $175k+', sub: 'Senior / High-Demand Specialist' }
];

const CAREER_DRIVERS = [
  {
    id: 'Accelerated Technical Mentorship & High-Impact Ownership',
    title: 'Deep Mentorship & Impact',
    desc: 'Working closely alongside Principal Engineers on critical product primitives.'
  },
  {
    id: 'Top-Tier Market Compensation & Equity Growth',
    title: 'Maximized Total Compensation',
    desc: 'Competitive base salary, performance bonuses, and valuable equity grants.'
  },
  {
    id: 'Next-Gen AI & State-of-the-Art Toolchain Exploration',
    title: 'Modern AI Stack Exploration',
    desc: 'Building with frontier models, vector search, and cutting-edge paradigms.'
  },
  {
    id: 'Sustainable Work-Life Harmony & Autonomy',
    title: 'Sustainable Work-Life Balance',
    desc: 'Healthy pacing, predictable sprint cycles, and strong respect for personal time.'
  }
];

export const Step4CareerPreferences: React.FC<Step4CareerPreferencesProps> = ({
  data,
  onChange
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Preferred Work Mode (Radio Cards) */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          1. Desired Workplace Model <span className="text-rose-500">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {WORK_MODES.map((mode) => {
            const isSelected = data.workMode === mode.id;
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onChange({ workMode: mode.id })}
                className={`p-4 rounded-xl border text-left transition-all space-y-2 cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isSelected && <div className="w-1 h-1 rounded-full bg-white" />}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {mode.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                    {mode.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Target Company Stage (Radio) */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          2. Target Organization Maturity & Stage <span className="text-rose-500">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {COMPANY_STAGES.map((stage) => {
            const isSelected = data.companyStage === stage.id;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => onChange({ companyStage: stage.id })}
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
                    {stage.title}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {stage.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Expected Compensation Band (Radio) */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          3. Target Annual Compensation Band <span className="text-rose-500">*</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {COMPENSATION_BANDS.map((band) => {
            const isSelected = data.compensationBand.startsWith(band.label);
            return (
              <button
                key={band.id}
                type="button"
                onClick={() => onChange({ compensationBand: band.id })}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20 text-emerald-900 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-xs font-bold font-mono">{band.label}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {band.sub}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Primary Career Driver (Radio) */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          4. Primary Decision Driver in Next Opportunity <span className="text-rose-500">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CAREER_DRIVERS.map((driver) => {
            const isSelected = data.primaryCareerDriver.startsWith(driver.title);
            return (
              <button
                key={driver.id}
                type="button"
                onClick={() => onChange({ primaryCareerDriver: driver.id })}
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
                    {driver.title}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {driver.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Weekly Dedicated Upskilling Hours (Slider) */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            5. Weekly Time Dedicated to Deliberate Practice & Upskilling
          </label>
          <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-md self-start sm:self-auto">
            {data.weeklyUpskillingHours} Hours / Week
          </span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          How many hours per week do you invest in hands-on coding labs, reading RFCs, architecture challenges, or certifications?
        </p>

        <div className="space-y-1 pt-1">
          <input
            type="range"
            min={2}
            max={30}
            step={2}
            value={data.weeklyUpskillingHours}
            onChange={(e) => onChange({ weeklyUpskillingHours: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-1">
            <span>2 hrs/wk (Casual review)</span>
            <span>12 hrs/wk (Steady growth)</span>
            <span>30+ hrs/wk (Accelerated bootcamp speed)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
