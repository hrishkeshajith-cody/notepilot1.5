import React from 'react';
import { 
  LogOut, 
  Moon, 
  Sun, 
  History,
  BookOpen,
  Plus,
  Search,
  Box,
  Palette,
  GraduationCap,
  ChevronLeft
} from 'lucide-react';
import { User, StoredStudyPack } from '../types';

interface SidebarProps {
  user: User;
  packs: StoredStudyPack[];
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onCreateNew: () => void;
  onOpenPack: (pack: StoredStudyPack) => void;
  activeView: string;
  onOpenCustomizer: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  packs, 
  onLogout, 
  isDarkMode, 
  toggleTheme,
  onCreateNew,
  onOpenPack,
  activeView,
  onOpenCustomizer
}) => {
  return (
    <div className="w-64 h-screen bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col fixed left-0 top-0 z-40 font-sans">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3 cursor-pointer" onClick={onCreateNew}>
              <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-theme leading-none mb-0.5">Notepilot</span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">AI Study Materials</span>
              </div>
           </div>
           <button className="text-zinc-300 hover:text-theme transition-colors">
              <ChevronLeft className="w-5 h-5" />
           </button>
        </div>

        {/* User Profile Info */}
        <div className="flex items-center gap-3 mb-8 p-1">
           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-theme font-black text-sm border border-primary/20">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
           </div>
           <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-theme truncate">{user.email}</span>
           </div>
        </div>

        {/* Dark Mode Toggle */}
        <button 
           onClick={toggleTheme}
           className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl transition-all shadow-sm mb-10 group"
        >
           <div className="flex items-center gap-3">
              {isDarkMode ? <Sun className="w-4 h-4 text-zinc-400" /> : <Moon className="w-4 h-4 text-zinc-400" />}
              <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">Dark mode</span>
           </div>
           <div className={`w-8 h-4 rounded-full relative transition-colors ${isDarkMode ? 'bg-primary' : 'bg-zinc-200'}`}>
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isDarkMode ? 'left-4.5' : 'left-0.5'}`} />
           </div>
        </button>

        {/* Menu Section */}
        <div className="space-y-1 mb-8">
           <div className="px-4 mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-theme" />
              <span className="text-[10px] font-black text-theme uppercase tracking-widest">Recent Study Packs</span>
           </div>
           
           <div className="space-y-1.5 max-h-[350px] overflow-y-auto px-1 custom-scrollbar">
             {packs.length > 0 ? (
               packs.slice(0, 10).map(pack => (
                <button 
                  key={pack.id}
                  onClick={() => onOpenPack(pack)}
                  className="w-full text-left p-3 rounded-xl transition-all hover:bg-white dark:hover:bg-zinc-900 group"
                >
                  <p className="text-sm font-extrabold text-theme truncate mb-0.5">{pack.meta.chapter_title}</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase">{pack.meta.subject} • {pack.meta.grade.replace('Grade ', '')}</p>
                </button>
              ))
             ) : (
                <div className="text-xs text-zinc-400 px-3 italic">No saved study packs yet</div>
             )}
           </div>
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-zinc-100 dark:border-zinc-800">
        <button 
           onClick={onOpenCustomizer}
           className="w-full flex items-center gap-3 px-4 py-3 text-primary bg-primary/5 rounded-xl transition-all font-bold text-sm mb-2 hover:bg-primary/10"
        >
           <Palette className="w-4 h-4" />
           Customize UI
        </button>
        <button 
           onClick={onLogout} 
           className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-red-500 rounded-xl transition-all text-sm font-bold group"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
};