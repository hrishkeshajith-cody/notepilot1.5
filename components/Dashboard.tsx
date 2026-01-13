import React from 'react';
import { StoredStudyPack, User } from '../types';
import { Search, ArrowUp, Plus, Box, FileText, BookOpen, Layers, BrainCircuit } from 'lucide-react';

interface DashboardProps {
  user: User;
  packs: StoredStudyPack[];
  onCreateNew: () => void;
  onOpenPack: (pack: StoredStudyPack) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, packs, onCreateNew, onOpenPack }) => {
  const sortedPacks = [...packs].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="max-w-5xl mx-auto py-8 animate-fade-in text-zinc-900 dark:text-zinc-100 font-sans">
      
      {/* Search Bar */}
      <div className="relative mb-12 max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search your knowledge base..." 
          className="w-full pl-14 pr-14 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all text-base"
        />
        <button className="absolute inset-y-2 right-2 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
          <ArrowUp className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>

      {/* Greeting and Features Section */}
      <div className="mb-20 text-center">
        <div className="mb-10">
           <h1 className="text-4xl md:text-6xl font-normal tracking-tight mb-4">
             Let's learn, <span className="font-semibold text-primary">{user.name.split(' ')[0]}</span>
           </h1>
           <p className="text-zinc-500 dark:text-zinc-400 text-lg">
             Explore the features Notepilot has to offer
           </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto px-4">
           <FeatureCard icon={<FileText className="w-5 h-5" />} label="Smart Summaries" />
           <FeatureCard icon={<BookOpen className="w-5 h-5" />} label="Key Terms" />
           <FeatureCard icon={<Layers className="w-5 h-5" />} label="Flashcards" />
           <FeatureCard icon={<BrainCircuit className="w-5 h-5" />} label="Practice Quiz" />
        </div>
      </div>

      {/* Study Packs Section */}
      <div className="px-4 md:px-0">
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-xl font-bold tracking-tight">Your Study Packs</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPacks.length > 0 ? (
             sortedPacks.map((pack) => (
                <div 
                  key={pack.id}
                  onClick={() => onOpenPack(pack)}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 cursor-pointer hover:border-primary hover:shadow-lg transition-all group flex flex-col h-48 justify-between"
                >
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                        <Box className="w-5 h-5" />
                     </div>
                     <div className="min-w-0">
                        <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-tight mb-1">{pack.meta.chapter_title}</h3>
                        <p className="text-xs font-medium text-zinc-500 truncate">{pack.meta.subject} • {pack.meta.grade}</p>
                     </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-2">
                     <span className="font-medium bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded-md">{new Date(pack.createdAt).toLocaleDateString()}</span>
                     <span className="flex items-center gap-1 group-hover:text-primary transition-colors font-bold">Open <ArrowUp className="w-3 h-3 rotate-45" /></span>
                  </div>
                </div>
             ))
          ) : (
             <div className="col-span-full py-16 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50">
                <p className="text-zinc-500 mb-4 font-medium">You haven't created any study packs yet.</p>
                <button 
                  onClick={onCreateNew}
                  className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-sm hover:opacity-90 transition-opacity"
                >
                  Create your first pack
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center gap-3 hover:border-primary hover:shadow-lg transition-all cursor-default group h-32">
     <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
       {icon}
     </div>
     <span className="font-bold text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{label}</span>
  </div>
);