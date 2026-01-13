import React, { useState } from 'react';
import { FlashcardItem } from '../types';
import { Repeat, ChevronLeft, ChevronRight, RotateCw, Sparkles } from 'lucide-react';

interface FlashcardProps {
  card: FlashcardItem;
  onAskAI?: (context: string) => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({ card, onAskAI }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full relative">
      {/* Ask AI Tag */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onAskAI?.(`Flashcard Question: ${card.q}. Answer: ${card.a}`);
        }}
        className="absolute -top-3 -right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-800 border border-theme shadow-lg rounded-full text-[10px] font-bold uppercase tracking-wider text-theme hover:scale-105 transition-all"
      >
        <Sparkles className="w-3 h-3" />
        Ask AI
      </button>

      <div 
        className="group perspective-1000 w-full h-[400px] cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full text-center transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front (Question) - Theme Background */}
          <div className="absolute w-full h-full backface-hidden bg-primary rounded-2xl shadow-xl flex flex-col items-center justify-center p-12 text-primary-foreground">
            <span className="text-white/60 text-sm font-medium mb-4 uppercase tracking-widest">Question</span>
            <h3 className="text-2xl md:text-3xl font-bold leading-tight">{card.q}</h3>
            <div className="absolute bottom-8 text-white/60 text-sm flex items-center gap-2">
               Click to flip
            </div>
          </div>

          {/* Back (Answer) - White Background with Theme Accents */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center p-12">
            <span className="text-zinc-400 text-sm font-medium mb-4 uppercase tracking-widest">Answer</span>
            <p className="text-xl md:text-2xl font-medium text-zinc-800 dark:text-zinc-100 leading-relaxed">{card.a}</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <button 
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <RotateCw className="w-4 h-4" />
          Flip Card
        </button>
      </div>
    </div>
  );
};