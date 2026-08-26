import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../data/mockData';
import { UserRole } from '../types';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { DynamicIcon } from '../components/common/IconRenderer';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  GraduationCap,
  Building2,
  BookOpenCheck,
  Landmark,
  ShieldCheck,
  Zap,
  Users
} from 'lucide-react';

import { sihShowcaseService } from '../services/sihShowcaseService';

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentRole, setRole, continueAsDemo } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole || 'student');

  const roleKeys: UserRole[] = ['student', 'industry', 'academician', 'institution'];

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleProceed = () => {
    setRole(selectedRole);
    continueAsDemo(selectedRole);
    navigate(`/dashboard/${selectedRole}`);
  };

  const handleStartGuidedShowcase = () => {
    sihShowcaseService.resetShowcase();
    setRole('industry');
    continueAsDemo('industry');
    navigate('/dashboard/industry');
  };

  const activeRoleData = ROLES[selectedRole];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between">
      {/* Top Header */}
      <header className="p-4 sm:p-6 flex items-center justify-between max-w-7xl w-full mx-auto">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white tracking-tight text-base">
            SkillSetu AI
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={ChevronLeft}
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </div>
      </header>

      {/* Main Role Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-center">
        {/* SIH Showcase Fast Track Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-linear-to-r from-indigo-900/90 via-slate-900 to-indigo-950 text-white border border-indigo-500/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0 border border-indigo-400/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  SIH 2026 Recommended
                </span>
                <span className="text-xs text-indigo-200">9 Connected Steps</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                Guided Cross-Role Showcase (3–5 Min Evaluation Journey)
              </h3>
            </div>
          </div>

          <Button
            size="sm"
            variant="accent"
            rightIcon={ArrowRight}
            onClick={handleStartGuidedShowcase}
            className="w-full sm:w-auto bg-linear-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 shrink-0"
          >
            Launch Guided Showcase
          </Button>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge variant="primary" size="md" className="mb-3">
            Persona Gateway
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Choose Your Ecosystem Role
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
            Select your stakeholder perspective to enter the customized workspace, analytics dashboard, and collaborative tools.
          </p>
        </div>

        {/* 4-Column Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {roleKeys.map((key) => {
            const role = ROLES[key];
            const isSelected = selectedRole === key;
            return (
              <Card
                key={key}
                onClick={() => handleSelectRole(key)}
                variant={isSelected ? 'elevated' : 'interactive'}
                className={`p-5 flex flex-col justify-between relative transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-indigo-600 border-indigo-600 dark:border-indigo-500 dark:ring-indigo-500 bg-white dark:bg-slate-900'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${role.color.light}`}>
                      <DynamicIcon name={role.iconName} className="w-6 h-6" />
                    </div>
                    {isSelected ? (
                      <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                        {role.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {role.title}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                    {role.subtitle}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
                    {role.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Top Capabilities
                  </div>
                  {role.features.slice(0, 2).map((feat, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Action Panel for Selected Role */}
        <Card variant="glass" className="p-6 max-w-4xl mx-auto w-full border border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${activeRoleData.color.light}`}>
                <DynamicIcon name={activeRoleData.iconName} className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Ready to enter:</span>
                  <Badge variant="primary" size="sm">{activeRoleData.title}</Badge>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  Launch {activeRoleData.title} Dashboard
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className="flex-1 sm:flex-initial"
              >
                Sign In Different Account
              </Button>
              <Button
                variant="accent"
                size="lg"
                rightIcon={ArrowRight}
                onClick={handleProceed}
                className="flex-1 sm:flex-initial"
              >
                Proceed to Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-slate-400 dark:text-slate-600">
        SkillSetu AI • Modular Multi-Tenant Enterprise Foundation
      </footer>
    </div>
  );
};
