
import React, { useState } from 'react';
import { ImportantQuestionsData, QuestionWithSolution } from '../types';
import { HelpCircle, ChevronDown, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';

interface ImportantQuestionsProps {
  data: ImportantQuestionsData;
  onAskAI?: (context: string) => void;
}

export const ImportantQuestions: React.FC<ImportantQuestionsProps> = ({ data, onAskAI }) => {
  const [activeMarkTab, setActiveMarkTab] = useState<'1' | '3' | '5'>('1');
  const [expandedIndices, setExpandedIndices] = useState<Record<string, boolean>>({});

  const toggleSolution = (index: number) => {
    const key = `${activeMarkTab}-${index}`;
    setExpandedIndices(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const currentQuestions = activeMarkTab === '1' 
    ? data.one_mark 
    : activeMarkTab === '3' 
      ? data.three_mark 
      : data.five_mark;

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-theme" />
          <h3 className="font-bold text-lg text-theme">Important Exam Questions</h3>
        </div>
        
        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl gap-1">
          {[
            { id: '1', label: '1 Mark' },
            { id: '3', label: '3 Marks' },
            { id: '5', label: '5 Marks' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveMarkTab(tab.id as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all
                ${activeMarkTab === tab.id 
                  ? 'bg-white dark:bg-zinc-700 text-theme shadow-sm' 
                  : 'text-zinc-500 hover:text-theme'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {currentQuestions && currentQuestions.length > 0 ? (
          currentQuestions.map((item, idx) => {
            const isExpanded = expandedIndices[`${activeMarkTab}-${idx}`];
            return (
              <div 
                key={idx} 
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm relative group"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex gap-4">
                      <span className="w-8 h-8 rounded-lg bg-primary/10 text-theme flex items-center justify-center font-bold text-sm shrink-0">
                        Q{idx + 1}
                      </span>
                      <h4 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 leading-tight pt-1">
                        {item.question}
                      </h4>
                    </div>
                    
                    <button 
                      onClick={() => onAskAI?.(`Question: ${item.question}. Solution provided: ${item.solution}`)}
                      className="p-1.5 text-theme opacity-0 group-hover:opacity-100 transition-opacity bg-primary/5 rounded-lg hover:bg-primary/10"
                      title="Ask AI about this question"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>

                  <button 
                    onClick={() => toggleSolution(idx)}
                    className={`flex items-center gap-2 text-sm font-bold transition-colors ${isExpanded ? 'text-theme' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'}`}
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    {isExpanded ? 'Hide Solution' : 'View Solution'}
                  </button>

                  {isExpanded && (
                    <div className="mt-6 pl-12 border-l-2 border-primary/20 animate-fade-in">
                       <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-accent" />
                          <span className="text-[10px] font-black text-accent uppercase tracking-widest">Model Solution</span>
                       </div>
                       <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
                          {item.solution}
                       </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400">
            <AlertCircle className="w-10 h-10 mx-auto mb-4 opacity-20" />
            <p className="font-medium">No questions generated for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
