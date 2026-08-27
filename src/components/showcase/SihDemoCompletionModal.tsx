import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CLOSED_LOOP_NODES } from '../../data/sihShowcaseData';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Download,
  RotateCcw,
  ShieldCheck,
  Zap,
  Building2,
  Briefcase,
  GraduationCap
} from 'lucide-react';

interface SihDemoCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestartShowcase: () => void;
  onOpenPassport: () => void;
}

export const SihDemoCompletionModal: React.FC<SihDemoCompletionModalProps> = ({
  isOpen,
  onClose,
  onRestartShowcase,
  onOpenPassport
}) => {
  const handleDownloadSummary = () => {
    const summary = {
      project: 'SkillSetu AI — SIH 2026',
      theme: 'Closed-Loop Cross-Role Talent & Skill Intelligence Ecosystem',
      demonstrationResult: 'Completed all 9 validation steps successfully',
      ecosystemNodes: CLOSED_LOOP_NODES,
      measuredOutcomes: {
        industryDemandSignal: 'Extracted 18 verified requisitions across cloud-native domains',
        institutionReadinessDelta: 'Identified -35% cloud gap; closed by +28% post-intervention',
        facultyEmpowerment: 'Tier-1 faculty co-mentorship with 4 verified industry FDP credentials',
        studentCompetencyRadar: '87/100 verified readiness score; 96th percentile nationally',
        deterministicMatching: '96% explainable match without black-box hallucination',
        recruiterPipeline: 'Ranked candidate #1 of 48 with verified GitHub & test proof',
        closedLoopCareerPassport: '8 validated tamper-proof portfolio sections'
      },
      accreditationAlignment: ['NAAC Criterion 1 & 2', 'NBA Outcome-Based Education (OBE)', 'NIRF Research & Immersion'],
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillSetu_SIH2026_ClosedLoop_Showcase_Summary.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="SkillSetu Closed the Loop"
      description="All 4 ecosystem stakeholders are now synchronized with verified evidence, deterministic matching, and audited outcomes."
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={RotateCcw}
              onClick={() => {
                onRestartShowcase();
                onClose();
              }}
              className="text-xs"
            >
              Restart Showcase
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={Download}
              onClick={handleDownloadSummary}
              className="text-xs"
            >
              Export JSON Summary
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              rightIcon={ArrowRight}
              onClick={() => {
                onOpenPassport();
                onClose();
              }}
              className="text-xs bg-emerald-600 hover:bg-emerald-500"
            >
              View Verified Career Passport
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5 py-2">
        {/* Celebration Header Card */}
        <div className="p-5 rounded-2xl bg-linear-to-r from-emerald-950/90 via-slate-900 to-indigo-950 text-white border border-emerald-500/30">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 border border-emerald-400/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="success" size="sm">SIH 2026 Evaluation Ready</Badge>
                <span className="text-xs text-emerald-300">100% Verification Coverage</span>
              </div>
              <h3 className="text-base font-bold text-white">
                End-to-End Talent Supply Chain Validated
              </h3>
              <p className="text-xs text-slate-300">
                From live industry demand extraction to institutional curriculum intervention, faculty co-mentorship, verified Student Skill DNA, deterministic opportunity matching, and recruiter hiring.
              </p>
            </div>
          </div>
        </div>

        {/* 9-Node Closed Loop Visual Flow */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>The 9-Step Verification Loop</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {CLOSED_LOOP_NODES.map((node) => (
              <div
                key={node.step}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-[10px]">
                    {node.step}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {node.role}
                  </span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-xs">
                  {node.title}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {node.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Pillar Outcome Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block">Industry Gain</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">60% Faster</span>
            <span className="text-[10px] text-slate-500 block">Time to Hire</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block">Institution Delta</span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">+28% Gain</span>
            <span className="text-[10px] text-slate-500 block">Audited Pre/Post</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block">Faculty Mentorship</span>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">92/100</span>
            <span className="text-[10px] text-slate-500 block">Passport Score</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block">Student Placement</span>
            <span className="text-sm font-bold text-sky-600 dark:text-sky-400">96% Match</span>
            <span className="text-[10px] text-slate-500 block">Tier-1 Placed</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
