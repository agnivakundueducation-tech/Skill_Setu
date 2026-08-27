import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { MOCK_ASSESSMENT_QUESTIONS } from '../../data/studentData';
import { Sparkles, CheckCircle2, XCircle, Award, Timer, ArrowRight, RefreshCw } from 'lucide-react';

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillName?: string;
  onCompleteScore?: (newScore: number) => void;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  isOpen,
  onClose,
  skillName = 'React 19 & Architecture',
  onCompleteScore
}) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [questions, setQuestions] = useState(() => shuffleQuestions());

  const currentQuestion = questions[currentQuestionIdx];

  function shuffleQuestions() {
    const shuffled = [...MOCK_ASSESSMENT_QUESTIONS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 10);
  }

  useEffect(() => {
    if (isOpen) {
      setQuestions(shuffleQuestions());
      setCurrentQuestionIdx(0);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setScore(0);
      setIsFinished(false);
    }
  }, [isOpen]);

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx + 1 < questions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
      if (onCompleteScore) {
        const finalCorrect = score + (selectedOption === currentQuestion.correctAnswer ? 1 : 0);
        onCompleteScore(Math.round((finalCorrect / questions.length) * 100));
      }
    }
  };

  const handleReset = () => {
    setQuestions(shuffleQuestions());
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isFinished ? 'Skill Assessment Completed!' : `AI Adaptive Assessment: ${skillName}`}
      description={
        isFinished
          ? 'Your verified score has been computed by the SkillSetu AI engine.'
          : `Question ${currentQuestionIdx + 1} of ${questions.length} • Adaptive Difficulty`
      }
      size="lg"
    >
      {!isFinished ? (
        <div className="space-y-5">
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Progress: {currentQuestionIdx + 1}/{questions.length}</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                Difficulty: {currentQuestion.difficulty}
              </span>
            </div>
            <ProgressBar
              value={((currentQuestionIdx + 1) / questions.length) * 100}
              color="indigo"
              size="sm"
            />
          </div>

          {/* Question card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <Badge variant="primary" size="sm">
                {currentQuestion.category}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Timer className="w-3.5 h-3.5" />
                <span>Timer Active</span>
              </div>
            </div>

            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
              {currentQuestion.question}
            </p>

            {currentQuestion.codeSnippet && (
              <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto border border-slate-800">
                <code>{currentQuestion.codeSnippet}</code>
              </pre>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuestion.correctAnswer;
              let optionClass = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800';

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  optionClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20';
                } else if (isSelected && !isCorrect) {
                  optionClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/20';
                }
              } else if (isSelected) {
                optionClass = 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-start gap-3 ${optionClass}`}
                >
                  <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if submitted */}
          {isAnswerSubmitted && (
            <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs space-y-1">
              <span className="font-bold text-indigo-900 dark:text-indigo-200">
                AI Knowledge Note:
              </span>
              <p className="text-slate-700 dark:text-slate-300">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel Test
            </Button>
            {!isAnswerSubmitted ? (
              <Button
                variant="primary"
                size="sm"
                disabled={selectedOption === null}
                onClick={handleSubmitAnswer}
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                rightIcon={ArrowRight}
                onClick={handleNextQuestion}
              >
                {currentQuestionIdx + 1 < questions.length ? 'Next Question' : 'View Results'}
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Completed Results View */
        <div className="text-center py-6 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Score Verified: {Math.round((score / questions.length) * 100)}/100
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your verified mastery badge for <strong className="text-slate-800 dark:text-slate-200">{skillName}</strong> has been updated on your public Skill DNA passport.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 max-w-md mx-auto grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="text-slate-400">Correct</div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                {score} / {questions.length}
              </div>
            </div>
            <div>
              <div className="text-slate-400">Percentile</div>
              <div className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                Top 4%
              </div>
            </div>
            <div>
              <div className="text-slate-400">Status</div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Verified
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="outline" size="sm" leftIcon={RefreshCw} onClick={handleReset}>
              Retake Test
            </Button>
            <Button variant="primary" size="sm" onClick={onClose}>
              Update Profile Matrix
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
