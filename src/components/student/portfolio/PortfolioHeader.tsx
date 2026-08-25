import React from 'react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { StudentProfileData } from '../../../types/student';
import {
  Share2,
  Download,
  Mail,
  MapPin,
  Github,
  Linkedin,
  Globe,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

interface PortfolioHeaderProps {
  profile: StudentProfileData;
  onOpenShareModal: () => void;
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
}

const SECTION_TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'verified-skills', label: 'Verified Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'internships', label: 'Internships' },
  { id: 'achievements', label: 'Achievements' }
];

export const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({
  profile,
  onOpenShareModal,
  activeSection,
  onSelectSection
}) => {
  return (
    <div className="space-y-4">
      {/* Main Profile Showcase Card */}
      <Card
        variant="default"
        className="overflow-hidden border-slate-200/80 dark:border-slate-800 p-0 shadow-sm"
      >
        {/* Cover Photo / Banner with subtle gradient overlay */}
        <div className="relative h-44 sm:h-52 w-full bg-slate-900 overflow-hidden">
          <img
            src={profile.bannerUrl}
            alt="Portfolio Cover"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Top Floating Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>SkillSetu Verified Recruiter Passport</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                leftIcon={Share2}
                onClick={onOpenShareModal}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md"
              >
                Share Portfolio
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Info Container */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl ring-4 ring-white dark:ring-slate-900 overflow-hidden bg-slate-800 shadow-lg">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                {profile.openToWork && (
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ring-2 ring-white dark:ring-slate-900 flex items-center gap-1 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Open to Work
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    {profile.fullName}
                  </h1>
                  <Badge variant="primary" size="sm" className="font-bold">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-indigo-500" />
                    Tier-1 Industry Ready
                  </Badge>
                </div>
                <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  {profile.headline}
                </p>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {profile.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    Available {profile.availableFrom}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 self-start md:self-end shrink-0 pt-2 md:pt-0">
              <Button
                variant="outline"
                size="sm"
                leftIcon={Download}
                onClick={() => {
                  alert('Generating verified ATS-compliant resume PDF...');
                }}
              >
                Resume PDF
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={Share2}
                onClick={onOpenShareModal}
              >
                Share Portfolio
              </Button>
            </div>
          </div>

          {/* Social Links & Recruiter Quick Contacts */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>github.com/aaravsharma</span>
              </a>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <Linkedin className="w-4 h-4 text-blue-600" />
                <span>linkedin.com/in/aarav-sharma-dev</span>
              </a>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-slate-500" />
                <span>{profile.email}</span>
              </a>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Response time: &lt; 24 hrs</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Recruiter Section Jump Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 scrollbar-none shadow-xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 shrink-0 hidden sm:inline-block">
          Jump to:
        </span>
        {SECTION_TABS.map((tab) => {
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectSection(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
