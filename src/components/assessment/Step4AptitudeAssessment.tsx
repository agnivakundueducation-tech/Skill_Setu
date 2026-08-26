import React, { useState } from 'react';
import { AptitudeAnswers } from '../../types/assessment';
import { APTITUDE_QUESTIONS, evaluateAptitudeAnswers } from '../../data/aptitudeData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import {
  Brain,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Calculator,
  Compass,
  BookOpen,
  Award,
  Zap,
  Check
} from 'lucide-react';

interface Step4AptitudeAssessmentProps {
  data: AptitudeAnswers;
  onUpdate: (updated: Partial<AptitudeAnswers>) => void;
}

export const Step4AptitudeAssessment: React.FC<Step4AptitudeAssessmentProps> = ({
  data,
  onUpdate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Quantitative Aptitude' | 'Logical Reasoning' | 'Verbal Reasoning'>('All');
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});

  const answers = data.answers || {};

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    const newAnswers = {
      ...answers,
      [questionId]: optionIndex
    };

    const evaluation = evaluateAptitudeAnswers(newAnswers);

    onUpdate({
      answers: newAnswers,
      quantitativeScore: evaluation.quantitativeScore,
      logicalScore: evaluation.logicalScore,
      verbalScore: evaluation.verbalScore,
      totalScore: evaluation.totalScore,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      completedAt: new Date().toISOString()
    });
  };

  const toggleExplanation = (questionId: string) => {
    setRevealedExplanations((prev) => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const evaluation = evaluateAptitudeAnswers(answers);
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = APTITUDE_QUESTIONS.length;

  const filteredQuestions = selectedCategory === 'All'
    ? APTITUDE_QUESTIONS
    : APTITUDE_QUESTIONS.filter((q) => q.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900/90 via-slate-900 to-indigo-950 text-white border border-indigo-500/30 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center font-bold shrink-0">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  Step 4 of 6 • Cognitive Engine
                </span>
                <span className="text-xs text-indigo-200/80">Deterministic Scoring</span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Cognitive Aptitude & Logical Reasoning Evaluation
              </h3>
              <p className="text-xs text-indigo-200/80 mt-1 max-w-2xl">
                Assesses quantitative problem solving, formal deductive syllogisms, and technical verbal comprehension.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-indigo-950/60 px-4 py-2.5 rounded-xl border border-indigo-800/60 shrink-0 self-stretch sm:self-auto justify-between sm:justify-start">
            <div className="text-right">
              <p className="text-[10px] text-indigo-300 uppercase font-semibold">Aptitude Score</p>
              <p className="text-xl font-extrabold text-amber-400">
                {answeredCount > 0 ? `${evaluation.totalScore}%` : 'Pending'}
              </p>
            </div>
            <div className="h-8 w-px bg-indigo-800/80 mx-1" />
            <div className="text-left">
              <p className="text-[10px] text-indigo-300 uppercase font-semibold">Answered</p>
              <p className="text-sm font-bold text-white">{answeredCount} / {totalQuestions}</p>
            </div>
          </div>
        </div>

        {/* Live Category Breakdown Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-indigo-800/50">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-indigo-900/40">
            <div className="flex items-center justify-between text-xs text-indigo-200 mb-1">
              <span className="flex items-center gap-1.5 font-semibold">
                <Calculator className="w-3.5 h-3.5 text-sky-400" />
                Quantitative Math
              </span>
              <span className="font-bold text-sky-300">{evaluation.quantitativeScore}%</span>
            </div>
            <ProgressBar value={evaluation.quantitativeScore} color="indigo" size="sm" />
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-indigo-900/40">
            <div className="flex items-center justify-between text-xs text-indigo-200 mb-1">
              <span className="flex items-center gap-1.5 font-semibold">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                Logical Reasoning
              </span>
              <span className="font-bold text-emerald-300">{evaluation.logicalScore}%</span>
            </div>
            <ProgressBar value={evaluation.logicalScore} color="emerald" size="sm" />
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-indigo-900/40">
            <div className="flex items-center justify-between text-xs text-indigo-200 mb-1">
              <span className="flex items-center gap-1.5 font-semibold">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                Verbal Reasoning
              </span>
              <span className="font-bold text-amber-300">{evaluation.verbalScore}%</span>
            </div>
            <ProgressBar value={evaluation.verbalScore} color="amber" size="sm" />
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {(['All', 'Quantitative Aptitude', 'Logical Reasoning', 'Verbal Reasoning'] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {cat === 'All' && <Sparkles className="w-3.5 h-3.5" />}
            {cat === 'Quantitative Aptitude' && <Calculator className="w-3.5 h-3.5" />}
            {cat === 'Logical Reasoning' && <Compass className="w-3.5 h-3.5" />}
            {cat === 'Verbal Reasoning' && <BookOpen className="w-3.5 h-3.5" />}
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, qIndex) => {
          const selectedOption = answers[q.id];
          const isAnswered = selectedOption !== undefined;
          const isCorrect = isAnswered && selectedOption === q.correctAnswer;
          const isExplanationOpen = revealedExplanations[q.id];

          return (
            <Card
              key={q.id}
              className={`p-5 transition-all border ${
                isAnswered
                  ? isCorrect
                    ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-200 dark:hover:border-indigo-900'
              }`}
            >
              <div className="flex flex-col gap-3">
                {/* Question Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {qIndex + 1}
                    </span>
                    <Badge variant={q.category === 'Quantitative Aptitude' ? 'primary' : q.category === 'Logical Reasoning' ? 'success' : 'warning'} size="sm">
                      {q.category}
                    </Badge>
                    <Badge variant="neutral" size="sm">
                      {q.difficulty}
                    </Badge>
                  </div>

                  {isAnswered && (
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Answer Recorded</span>
                    </div>
                  )}
                </div>

                {/* Question Text */}
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 whitespace-pre-line leading-relaxed">
                  {q.question}
                </p>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedOption === optIdx;
                    let optionClass = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';

                    if (isSelected) {
                      optionClass = 'border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20 font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-2.5 cursor-pointer ${optionClass}`}
                      >
                        <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1 leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Optional Explanation Toggle */}
                {isAnswered && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => toggleExplanation(q.id)}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{isExplanationOpen ? 'Hide Explanation' : 'View Logical Solution & Explanation'}</span>
                    </button>

                    {isExplanationOpen && (
                      <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                        <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          Correct Answer: Option {String.fromCharCode(65 + q.correctAnswer)} — {q.options[q.correctAnswer]}
                        </span>
                        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
