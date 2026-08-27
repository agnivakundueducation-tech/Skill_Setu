import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROLES } from '../data/mockData';
import { UserRole } from '../types';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Modal } from '../components/ui/Modal';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { DynamicIcon } from '../components/common/IconRenderer';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2,
  CheckCircle2,
  Layers,
  ChevronRight,
  ExternalLink,
  Laptop,
  GraduationCap,
  Building2,
  BookOpenCheck,
  Landmark,
  Compass
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { sihShowcaseService } from '../services/sihShowcaseService';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { continueAsDemo, setRole, isAuthenticated, currentRole } = useAuth();
  const [activeRoleTab, setActiveRoleTab] = useState<UserRole>('student');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const handleStartShowcase = () => {
    if (isAuthenticated) {
      navigate(`/dashboard/${currentRole}`);
      return;
    }
    sihShowcaseService.resetShowcase();
    setRole('industry');
    continueAsDemo('industry');
    navigate('/dashboard/industry');
  };

  const handleLaunchRole = (roleKey: UserRole) => {
    if (isAuthenticated) {
      // Authenticated users are safely routed to their authorized dashboard
      navigate(`/dashboard/${currentRole}`);
    } else {
      setRole(roleKey);
      navigate('/login', {
        state: {
          from: { pathname: `/dashboard/${roleKey}` },
          role: roleKey
        }
      });
    }
  };

  const roleKeys: UserRole[] = ['student', 'industry', 'academician', 'institution'];
  const activeRoleData = ROLES[activeRoleTab];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                SkillSetu <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">AI</span>
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:block">
                Industry-Academia Collaborative Intelligence
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#ecosystem" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Ecosystem
            </a>
            <a href="#architecture" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              UI Architecture
            </a>
            <a href="#roles-preview" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Roles & Personas
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/login')}
              className="hidden sm:inline-flex"
            >
              Sign In
            </Button>
            <Button
              variant="accent"
              size="sm"
              rightIcon={ArrowRight}
              onClick={() => navigate('/roles')}
            >
              Explore Roles
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/10 via-sky-500/10 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Higher Education & Enterprise Bridge</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 max-w-4xl mx-auto leading-[1.15]">
            Unifying <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500">Students</span>, Industry, Faculty & Institutions with AI
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            SkillSetu AI bridges academia with real-world industry demands. Real-time skill gap calibration, verifiable credentials, and collaborative problem-solving.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="accent"
              rightIcon={ArrowRight}
              onClick={handleStartShowcase}
              className="w-full sm:w-auto bg-linear-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:from-indigo-700 hover:to-sky-600 shadow-lg shadow-indigo-500/25"
            >
              <Sparkles className="w-5 h-5 mr-1 text-amber-300" />
              Launch SIH 2026 Showcase (3-5 min)
            </Button>
            <Button
              size="lg"
              variant="outline"
              leftIcon={Laptop}
              onClick={() => navigate('/roles')}
              className="w-full sm:w-auto"
            >
              Select Stakeholder Role
            </Button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card variant="glass" className="p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">45k+</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Student Learners</div>
            </Card>
            <Card variant="glass" className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">380+</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Industry Partners</div>
            </Card>
            <Card variant="glass" className="p-4 text-center">
              <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">4.8k+</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Academic Mentors</div>
            </Card>
            <Card variant="glass" className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">180+</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Accredited Universities</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Ecosystem Architecture & Narrative Visualization */}
      <section id="ecosystem" className="py-20 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unified Collaborative Intelligence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              The SkillSetu 4-Pillar Ecosystem
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-3 text-base sm:text-lg">
              Breaking institutional silos by connecting learners, educators, universities, and enterprise talent pipelines through calibrated skill intelligence.
            </p>
          </div>

          {/* Connected Stakeholders Visual Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Student Pillar */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-950 shadow-2xs hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Pillar 01</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Students</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Adaptive AI Skill DNA analysis, gap calibration, proctored assessments, and precision internship matching.
              </p>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Personalized DNA</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Industry Pillar */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-950 shadow-2xs hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Pillar 02</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Industry Partners</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Pre-calibrated talent discovery, explainable candidate matching, live project challenges, and faculty R&D sponsorships.
              </p>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Talent Intelligence</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Academician Pillar */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-sky-950 shadow-2xs hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <BookOpenCheck className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">Pillar 03</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Academicians</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Cohort skill intelligence, early intervention alerts, syllabus modernization recommendations, and research grant bridges.
              </p>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400">
                <span>Cohort Analytics</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Institution Pillar */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-950 shadow-2xs hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Landmark className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Pillar 04</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Institutions</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Executive placement readiness metrics, department-level employability audits, NAAC/NIRF accreditation compliance, and ROI.
              </p>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
                <span>Executive Command</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Central Intelligent Bridge Banner */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-xl border border-indigo-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-indigo-300 animate-pulse" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">SkillSetu AI Engine & Real-Time Sync Layer</h4>
                <p className="text-xs sm:text-sm text-indigo-200/80 mt-0.5">
                  Continuous vector embedding alignment between curriculum syllabi, student competencies, and dynamic market vacancies.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="accent"
                size="sm"
                onClick={handleStartShowcase}
                className="bg-white text-indigo-950 hover:bg-indigo-50 font-semibold"
              >
                Experience Live Flow
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Role Switcher & Interactive Preview Section */}
      <section id="roles-preview" className="py-16 bg-white dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="primary" size="md" className="mb-3">
              Multi-Persona Architecture
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Tailored Workspaces for Every Stakeholder
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
              SkillSetu AI dynamically configures navigational hierarchies, analytical metrics, and toolsets based on the active role.
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {roleKeys.map((key) => {
              const role = ROLES[key];
              const isActive = activeRoleTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveRoleTab(key)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <DynamicIcon name={role.iconName} className="w-4 h-4" />
                  <span>{role.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Role Showcase Card */}
          <Card variant="elevated" className="overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8">
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeRoleData.color.light}`}>
                      <DynamicIcon name={activeRoleData.iconName} className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {activeRoleData.title} Workspace
                      </h3>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        {activeRoleData.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                    {activeRoleData.description}
                  </p>

                  <div className="space-y-2.5 mb-8">
                    {activeRoleData.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="primary"
                    rightIcon={ArrowRight}
                    onClick={() => handleLaunchRole(activeRoleTab)}
                  >
                    {isAuthenticated
                      ? (activeRoleTab === currentRole ? `Launch ${activeRoleData.title} Dashboard` : `Go to My Dashboard (${ROLES[currentRole]?.title})`)
                      : `Launch ${activeRoleData.title} Dashboard`}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/roles')}
                  >
                    Compare All Roles
                  </Button>
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950/60 rounded-xl p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                      Key Metrics Sample
                    </span>
                    <Badge variant="success" size="sm" dot>Live Sync</Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-3 my-4">
                    {activeRoleData.stats.map((st, i) => (
                      <div key={i} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{st.label}</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{st.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/70 dark:border-slate-800/80">
                    <ProgressBar
                      value={activeRoleTab === 'student' ? 78 : activeRoleTab === 'industry' ? 94 : activeRoleTab === 'academician' ? 88 : 96}
                      label="Workspace Readiness Index"
                      color={activeRoleTab === 'student' ? 'indigo' : activeRoleTab === 'industry' ? 'emerald' : activeRoleTab === 'academician' ? 'sky' : 'amber'}
                    />
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Pre-configured foundation with modular router dispatch
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Reusable UI Components Architecture Section */}
      <section id="architecture" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="primary" size="md" className="mb-3">
              Design System Foundation
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Modular, Production-Ready UI Primitives
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
              Engineered with clean TypeScript interfaces, accessible states, and seamless light/dark mode transitions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card Preview */}
            <Card variant="bordered" className="p-6">
              <div className="flex items-center gap-2.5 mb-4 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                <Layers className="w-4 h-4" />
                <span>Card & Containers</span>
              </div>
              <h4 className="font-semibold text-base text-slate-900 dark:text-slate-100">Card Primitive</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Supports default, elevated, glass, and interactive variants with modular CardHeader, CardTitle, and CardFooter.
              </p>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 font-mono">
                &lt;Card variant="interactive" isHoverable /&gt;
              </div>
            </Card>

            {/* Badges & Progress */}
            <Card variant="bordered" className="p-6">
              <div className="flex items-center gap-2.5 mb-4 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                <Zap className="w-4 h-4" />
                <span>Badges & Progress</span>
              </div>
              <h4 className="font-semibold text-base text-slate-900 dark:text-slate-100">Status & Metrics</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Semantic color palettes, dot indicators, custom sizes, and animated progress percentages.
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success" dot>Active</Badge>
                <Badge variant="warning">In-Review</Badge>
              </div>
            </Card>

            {/* Modal & Buttons */}
            <Card variant="bordered" className="p-6">
              <div className="flex items-center gap-2.5 mb-4 text-sky-600 dark:text-sky-400 font-semibold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Modals & Buttons</span>
              </div>
              <h4 className="font-semibold text-base text-slate-900 dark:text-slate-100">Overlay & Actions</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Accessible dialogs with ESC-dismiss, backdrop blur, spring animations, and multi-state buttons.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsDemoModalOpen(true)}
                className="w-full"
              >
                Trigger Modal Preview
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* System Overview Modal */}
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        size="lg"
        title="SkillSetu AI Architecture Overview"
        description="Foundation blueprint built with React 19, TypeScript, and Tailwind CSS."
        footer={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsDemoModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary" size="sm" onClick={() => { setIsDemoModalOpen(false); navigate('/roles'); }}>
              Go to Role Selection
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 py-2">
          <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-200/60 dark:border-indigo-800 text-xs">
            <strong className="text-indigo-900 dark:text-indigo-200 block mb-1">Architecture Highlights:</strong>
            <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
              <li>Responsive Desktop Sidebar + Mobile Drawer</li>
              <li>Independent Light / Dark mode persistence</li>
              <li>4 Specialized Role routing workspaces</li>
              <li>Clean separation of UI, Layout, Context, and Mock Data layers</li>
            </ul>
          </div>
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100 block mb-1">Ready to explore?</span>
            Select your persona to enter the respective placeholder dashboard.
          </div>
        </div>
      </Modal>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
              S
            </div>
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              SkillSetu AI Foundation
            </span>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400">
            Enterprise Higher Education & Skill Development Ecosystem
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link to="/roles" className="hover:text-indigo-600 dark:hover:text-indigo-400">Roles</Link>
            <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400">Sign In</Link>
            <Link to="/dashboard/student" className="hover:text-indigo-600 dark:hover:text-indigo-400">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
