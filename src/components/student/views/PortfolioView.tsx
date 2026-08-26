import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import {
  STUDENT_PORTFOLIO_PROFILE,
  STUDENT_EDUCATION,
  STUDENT_INTERNSHIPS,
  STUDENT_ACHIEVEMENTS,
  STUDENT_CERTIFICATIONS,
  STUDENT_PROJECTS,
  STUDENT_SKILLS_ASSESSED
} from '../../../data/studentPortfolioData';
import { Certification } from '../../../types/student';
import { PortfolioHeader } from '../portfolio/PortfolioHeader';
import { ProfileSection } from '../portfolio/ProfileSection';
import { EducationSection } from '../portfolio/EducationSection';
import { SkillsSection } from '../portfolio/SkillsSection';
import { VerifiedSkillsSection } from '../portfolio/VerifiedSkillsSection';
import { ProjectsSection } from '../portfolio/ProjectsSection';
import { CertificationsPortfolioSection } from '../portfolio/CertificationsPortfolioSection';
import { InternshipsSection } from '../portfolio/InternshipsSection';
import { AchievementsSection } from '../portfolio/AchievementsSection';
import { PlacementMilestonesSection } from '../portfolio/PlacementMilestonesSection';
import { SharePortfolioModal } from '../portfolio/SharePortfolioModal';
import {
  Share2,
  Download,
  Eye,
  SlidersHorizontal,
  CheckCircle2,
  Sparkles,
  ArrowUp
} from 'lucide-react';

interface PortfolioViewProps {
  onViewCertificate?: (cert: Certification) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  onViewCertificate
}) => {
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'full' | 'executive'>('full');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSection('profile');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Top Banner & Profile Header */}
      <PortfolioHeader
        profile={STUDENT_PORTFOLIO_PROFILE}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        activeSection={activeSection}
        onSelectSection={scrollToSection}
      />

      {/* Recruiter Skim / View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
            Recruiter Layout View
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-xs text-slate-500">
            {viewMode === 'full' ? 'Displaying all 8 comprehensive sections' : 'Compact executive summary mode'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('full')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'full'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Full Portfolio
          </button>
          <button
            onClick={() => setViewMode('executive')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'executive'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Executive Summary
          </button>
        </div>
      </div>

      {/* 1. Profile Section */}
      <section id="profile" className="scroll-mt-6">
        <ProfileSection profile={STUDENT_PORTFOLIO_PROFILE} />
      </section>

      {/* 2. Education Section */}
      <section id="education" className="scroll-mt-6">
        <EducationSection education={STUDENT_EDUCATION} />
      </section>

      {/* 3. Skills Section */}
      <section id="skills" className="scroll-mt-6">
        <SkillsSection />
      </section>

      {/* 4. Verified Skills Section */}
      <section id="verified-skills" className="scroll-mt-6">
        <VerifiedSkillsSection verifiedSkills={STUDENT_SKILLS_ASSESSED} />
      </section>

      {/* 5. Projects Section */}
      <section id="projects" className="scroll-mt-6">
        <ProjectsSection projects={STUDENT_PROJECTS} />
      </section>

      {/* 6. Certifications Section */}
      <section id="certifications" className="scroll-mt-6">
        <CertificationsPortfolioSection
          certifications={STUDENT_CERTIFICATIONS}
          onViewCertificate={onViewCertificate}
        />
      </section>

      {/* 7. Internships Section */}
      <section id="internships" className="scroll-mt-6">
        <InternshipsSection internships={STUDENT_INTERNSHIPS} />
      </section>

      {/* 8. Achievements Section */}
      <section id="achievements" className="scroll-mt-6">
        <AchievementsSection achievements={STUDENT_ACHIEVEMENTS} />
      </section>

      {/* 9. Verified Placement Milestones Section */}
      <section id="placements" className="scroll-mt-6">
        <PlacementMilestonesSection />
      </section>

      {/* Floating Back to Top & Share CTA Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Profile verified & synced to SkillSetu Career Passport</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={ArrowUp}
            onClick={scrollToTop}
          >
            Back to Top
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={Share2}
            onClick={() => setIsShareModalOpen(true)}
          >
            Share Portfolio
          </Button>
        </div>
      </div>

      {/* Share Portfolio Modal */}
      <SharePortfolioModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        studentName={STUDENT_PORTFOLIO_PROFILE.fullName}
        readinessScore={STUDENT_PORTFOLIO_PROFILE.readinessScore}
      />
    </div>
  );
};
