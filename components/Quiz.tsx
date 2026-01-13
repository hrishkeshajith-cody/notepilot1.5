import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy, BrainCircuit, Sparkles } from 'lucide-react';

interface QuizProps {
  questions: QuizQuestion[];
  instructions: string;
  onAskAI?: (context: string) => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, instructions, onAskAI }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentQIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQuestion.correct_index) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(p => p + 1);
      setIsAnswered(false);
      setSelectedOption(null);
    } else {
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQIndex(0);
    setScore(0);
    setShowResults(false);
    setIsAnswered(false);
    setSelectedOption(null);
  };

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-12 text-center max-w-2xl mx-auto shadow-sm">
        <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600">
          <Trophy className="w-12 h-12" />
        </div>
        <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Quiz Complete!</h3>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">Here is how you performed on this chapter.</p>
        
        <div className="grid grid-cols-2 gap-4 mb-8 max-w-xs mx-auto">
           <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-2xl">
              <div className="text-3xl font-bold text-zinc-900 dark:text-white">{score}</div>
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Score</div>
           </div>
           <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-2xl">
              <div className="text-3xl font-bold text-zinc-900 dark:text-white">{percentage}%</div>
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Accuracy</div>
           </div>
        </div>

        <button 
          onClick={restartQuiz}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <RotateCcw className="w-5 h-5" />
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto relative">
      <div className="flex items-center justify-between mb-6">
         <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">Quiz</h3>
         </div>
         <div className="text-zinc-400 font-mono text-sm">
            {currentQIndex + 1} / {questions.length}
         </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm relative group">
        {/* Ask AI Tag */}
        <button 
          onClick={() => onAskAI?.(`Quiz Question: ${currentQuestion.question}. Options: ${currentQuestion.options.join(', ')}. Correct index: ${currentQuestion.correct_index}`)}
          className="absolute -top-3 -right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-800 border border-theme shadow-lg rounded-full text-[10px] font-bold uppercase tracking-wider text-theme hover:scale-105 transition-all"
        >
          <Sparkles className="w-3 h-3" />
          Ask AI
        </button>

        <div className="flex justify-between items-start mb-6">
           <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-snug max-w-3xl">
              {currentQuestion.question}
           </h3>
           <span className="shrink-0 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
              {currentQuestion.difficulty}
           </span>
        </div>
        
        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx);
            let btnClass = "w-full text-left p-4 rounded-xl border transition-all flex items-center group ";
            
            if (isAnswered) {
              if (idx === currentQuestion.correct_index) {
                btnClass += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200";
              } else if (idx === selectedOption) {
                btnClass += "border-red-300 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200";
              } else {
                btnClass += "border-zinc-200 dark:border-zinc-800 text-zinc-400 opacity-50";
              }
            } else {
              btnClass += "border-zinc-200 dark:border-zinc-800 hover:border-primary hover:shadow-md bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={btnClass}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm mr-4 transition-colors
                   ${isAnswered && idx === currentQuestion.correct_index ? 'bg-green-200 text-green-800' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}
                `}>
                   {letter}
                </div>
                <span className="font-medium flex-1">{option}</span>
                {isAnswered && idx === currentQuestion.correct_index && (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
                {isAnswered && idx === selectedOption && idx !== currentQuestion.correct_index && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </button>
            );
          })}
        </div>

        {isAnswered && (
            <div className="bg-theme-soft rounded-xl p-5 mb-6 flex gap-4 border border-theme/20">
               <div className="w-1 bg-primary rounded-full shrink-0"></div>
               <div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1 text-sm">Explanation</h4>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                     {currentQuestion.explanation}
                  </p>
               </div>
            </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={nextQuestion}
            disabled={!isAnswered}
            className={`flex items-center gap-2 py-3 px-8 rounded-xl font-bold transition-all shadow-lg
              ${isAnswered 
                ? 'bg-primary text-primary-foreground hover:opacity-90 hover:-translate-y-0.5' 
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed shadow-none'}`}
          >
            {currentQIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};