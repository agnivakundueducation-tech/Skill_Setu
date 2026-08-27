import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { ProgressBar } from '../../ui/ProgressBar';
import { SkillsAssessedSection } from '../SkillsAssessedSection';
import { MultiStepAssessment } from '../../assessment/MultiStepAssessment';
import {
  Target,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  Award,
  Play,
  Flame,
  ShieldCheck,
  Brain,
  Code,
  Layers,
  Compass,
  FileCheck
} from 'lucide-react';

interface SkillAssessmentViewProps {
  onStartAssessment?: (skillName?: string) => void;
  onExploreOpportunities?: (roleTitle?: string) => void;
}

export const SkillAssessmentView: React.FC<SkillAssessmentViewProps> = ({
  onStartAssessment,
  onExploreOpportunities
}) => {
  const [viewMode, setViewMode] = useState<'multistep' | 'tracks'>('multistep');

  const assessmentTracks = [
    {
      id: 'trk-1',
      title: 'React 19 & Concurrent Architecture',
      category: 'Frontend Engineering',
      duration: '25 Mins',
      difficulty: 'Advanced',
      questionsCount: 15,
      questionsType: 'Adaptive Scenario + Code Snippets',
      icon: Code,
      badge: 'High Industry Demand',
      color: 'indigo'
    },
    {
      id: 'trk-2',
      title: 'Distributed Caching & High-Throughput APIs',
      category: 'System Architecture',
      duration: '30 Mins',
      difficulty: 'Hard',
      questionsCount: 18,
      questionsType: 'System Design + Redis/Kafka Scenarios',
      icon: Zap,
      badge: 'NovaCore Partner Track',
      color: 'emerald'
    },
    {
      id: 'trk-3',
      title: 'Vector Databases, Embeddings & RAG Optimization',
      category: 'AI & Data Engineering',
      duration: '20 Mins',
      difficulty: 'Advanced',
      questionsCount: 12,
      questionsType: 'Vector Search + LLM Prompt Benchmarks',
      icon: Brain,
      badge: 'Trending Tier-1',
      color: 'sky'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Toggle between Comprehensive Multi-Step Assessment and Track Catalog */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              SkillSetu AI Adaptive Assessment Engine
              <Badge variant="primary" size="sm">
                6-Step Comprehensive Evaluation
              </Badge>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete the structured multi-step evaluation to generate your verified readiness matrix.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl self-stretch sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('multistep')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              viewMode === 'multistep'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Step Assessment</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('tracks')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              viewMode === 'tracks'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tracks & Catalog</span>
          </button>
        </div>
      </div>

      {/* Render View Mode */}
      {viewMode === 'multistep' ? (
        <MultiStepAssessment
          onExploreRoles={onExploreOpportunities}
          onCompleteAssessment={(res) => {
            console.log('Assessment completed successfully:', res);
          }}
        />
      ) : (
        <div className="space-y-6">
          {/* Top Banner */}
          <Card variant="gradient" className="p-6 border-indigo-200 dark:border-indigo-900 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                    Adaptive Proctored Tracks
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Specialized Technical Track Catalog
                </h2>
                <p className="text-sm text-indigo-100/80 leading-relaxed">
                  Validate domain-specific competencies with deep-dive timed coding benchmarks. Completed certifications are cryptographically signed and added to your Skill DNA.
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                leftIcon={Play}
                className="bg-white hover:bg-slate-100 text-indigo-900 font-bold shadow-lg shrink-0"
                onClick={() => setViewMode('multistep')}
              >
                Launch Multi-Step Evaluation
              </Button>
            </div>
          </Card>

          {/* Recommended Live Assessment Tracks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                Featured Certification & Assessment Tracks
              </h3>
              <span className="text-xs text-slate-400">3 Available Now</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {assessmentTracks.map((track) => (
                <Card
                  key={track.id}
                  variant="default"
                  className="p-5 border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-800 transition-all hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {track.category}
                      </span>
                      <Badge variant="primary" size="sm">
                        {track.badge}
                      </Badge>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {track.title}
                    </h4>

                    <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 my-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Duration:
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{track.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Difficulty:</span>
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">{track.difficulty}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Questions:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{track.questionsCount} items</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      leftIcon={Play}
                      onClick={() => {
                        if (onStartAssessment) {
                          onStartAssessment(track.title);
                        } else {
                          setViewMode('multistep');
                        }
                      }}
                    >
                      Start Track Test
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Comprehensive Skills Assessed Registry */}
          <SkillsAssessedSection
            onTakeAssessment={(skill) => {
              if (onStartAssessment) {
                onStartAssessment(skill);
              } else {
                setViewMode('multistep');
              }
            }}
          />
        </div>
      )}
    </div>
  );
};
