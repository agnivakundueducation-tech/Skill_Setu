import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { InternshipFinalEvaluation, InternshipVerifiedSkill } from '../../../types/internship';
import { Award, CheckCircle2, Star, ShieldCheck, Briefcase, Plus, X, Sparkles } from 'lucide-react';

interface FinalEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (evaluation: Omit<InternshipFinalEvaluation, 'id' | 'evaluatedAt'>) => void;
  internName: string;
  defaultEvaluatorName?: string;
  defaultEvaluatorRole?: string;
}

export const FinalEvaluationModal: React.FC<FinalEvaluationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  internName,
  defaultEvaluatorName = 'Industry Evaluation Lead',
  defaultEvaluatorRole = 'VP of Engineering / Mentorship Director'
}) => {
  const [evaluatedBy, setEvaluatedBy] = useState(defaultEvaluatorName);
  const [evaluatorRole, setEvaluatorRole] = useState(defaultEvaluatorRole);
  const [overallRating, setOverallRating] = useState<number>(5);
  const [technicalProficiencyScore, setTechnicalProficiencyScore] = useState<number>(95);
  const [domainKnowledgeScore, setDomainKnowledgeScore] = useState<number>(92);
  const [collaborationScore, setCollaborationScore] = useState<number>(94);
  const [problemSolvingScore, setProblemSolvingScore] = useState<number>(96);
  const [recommendationForPPO, setRecommendationForPPO] = useState<boolean>(true);
  const [ppoDetails, setPpoDetails] = useState<string>(
    'Full-Time SDE-1 Offer Recommended. Candidate demonstrated exceptional engineering rigor and culture fit.'
  );
  const [detailedSummary, setDetailedSummary] = useState<string>(
    `${internName} has completed the engineering internship with distinction, demonstrating high technical competence and architectural excellence.`
  );

  const [skillsVerified, setSkillsVerified] = useState<InternshipVerifiedSkill[]>([
    {
      skillId: 'tech-core',
      skillName: 'Core Engineering & System Design',
      verifiedLevel: 95,
      evidenceTag: 'Architected and shipped production microservices with <15ms latency'
    },
    {
      skillId: 'tech-devops',
      skillName: 'Cloud Infrastructure & DevOps',
      verifiedLevel: 90,
      evidenceTag: 'Implemented automated CI/CD and telemetry pipelines'
    }
  ]);

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(90);
  const [newSkillEvidence, setNewSkillEvidence] = useState('');

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkillsVerified([
      ...skillsVerified,
      {
        skillId: `skill-${Date.now()}`,
        skillName: newSkillName.trim(),
        verifiedLevel: Number(newSkillLevel),
        evidenceTag: newSkillEvidence.trim() || 'Verified via Internship Milestones'
      }
    ]);
    setNewSkillName('');
    setNewSkillEvidence('');
  };

  const handleRemoveSkill = (skillId: string) => {
    setSkillsVerified(skillsVerified.filter((s) => s.skillId !== skillId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailedSummary.trim()) return;

    onSubmit({
      evaluatedBy,
      evaluatorRole,
      overallRating,
      technicalProficiencyScore: Number(technicalProficiencyScore),
      domainKnowledgeScore: Number(domainKnowledgeScore),
      collaborationScore: Number(collaborationScore),
      problemSolvingScore: Number(problemSolvingScore),
      recommendationForPPO,
      ppoDetails: recommendationForPPO ? ppoDetails.trim() : undefined,
      detailedSummary: detailedSummary.trim(),
      skillsVerified
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Final Performance Evaluation & Pre-Placement Assessment`}
      description={`Conduct comprehensive capstone assessment and verify competency mastery for ${internName}.`}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Evaluator Name
            </label>
            <input
              type="text"
              required
              value={evaluatedBy}
              onChange={(e) => setEvaluatedBy(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Evaluator Title / Position
            </label>
            <input
              type="text"
              required
              value={evaluatorRole}
              onChange={(e) => setEvaluatorRole(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* 4 Quantitative Dimension Scores */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Quantitative Competency Scores (0 - 100)
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Overall Rating:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setOverallRating(s)}
                    className={`p-0.5 ${s <= overallRating ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700'}`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Technical Mastery
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={technicalProficiencyScore}
                onChange={(e) => setTechnicalProficiencyScore(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Domain Knowledge
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={domainKnowledgeScore}
                onChange={(e) => setDomainKnowledgeScore(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Collaboration & Team
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={collaborationScore}
                onChange={(e) => setCollaborationScore(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Problem Solving
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={problemSolvingScore}
                onChange={(e) => setProblemSolvingScore(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400"
              />
            </div>
          </div>
        </div>

        {/* PPO Recommendation Section */}
        <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                Pre-Placement Offer (PPO) Recommendation
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={recommendationForPPO}
                onChange={(e) => setRecommendationForPPO(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {recommendationForPPO && (
            <textarea
              rows={2}
              value={ppoDetails}
              onChange={(e) => setPpoDetails(e.target.value)}
              placeholder="Specify full-time offer role, track, CTC details, or placement terms..."
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
          )}
        </div>

        {/* Executive Summary */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Comprehensive Executive Evaluation Summary *
          </label>
          <textarea
            rows={3}
            required
            value={detailedSummary}
            onChange={(e) => setDetailedSummary(e.target.value)}
            placeholder="Detailed assessment of capstone impact, technical mastery, and future potential..."
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Verified Skill Endorsements */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            Verified Skill Endorsements for Career Passport
          </label>

          <div className="space-y-1.5 mb-2.5">
            {skillsVerified.map((sk) => (
              <div
                key={sk.skillId}
                className="flex items-center justify-between p-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
              >
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    {sk.skillName}
                    <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[10px]">
                      {sk.verifiedLevel}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{sk.evidenceTag}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(sk.skillId)}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="Skill Name (e.g. Docker, Kafka)"
              className="sm:col-span-2 px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            />
            <input
              type="number"
              min={0}
              max={100}
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(Number(e.target.value))}
              placeholder="Level %"
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            />
            <Button type="button" size="sm" variant="outline" onClick={handleAddSkill}>
              <Plus className="w-3 h-3 mr-1" /> Add Skill
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            Save Final Evaluation
          </Button>
        </div>
      </form>
    </Modal>
  );
};
