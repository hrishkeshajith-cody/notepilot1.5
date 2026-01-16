
import React, { useState, useEffect } from 'react';
import { generateStudyPack } from './services/gemini';
import { InputForm } from './components/InputForm';
import { Quiz } from './components/Quiz';
import { Flashcard } from './components/Flashcard';
import { AuthPage } from './components/AuthPage';
import { LandingPage } from './components/LandingPage';
import { Sidebar } from './components/Sidebar';
import { MindMap } from './components/MindMap';
import { Visuals } from './components/Visuals';
import { ImportantQuestions } from './components/ImportantQuestions';
import { ThemeCustomizer } from './components/ThemeCustomizer';
import { ChatBot } from './components/ChatBot';
import { UserInput, AppStatus, StoredStudyPack, User, GeneratedImage, AppTheme, AppFont, AppShape } from './types';
import { LayoutDashboard, FileText, Book, Layers, BrainCircuit, ChevronRight, ChevronLeft, Menu, ArrowLeft, Lightbulb, ChevronDown, Palette, Sparkles, HelpCircle } from 'lucide-react';

type Tab = 'summary' | 'notes' | 'terms' | 'questions' | 'flashcards' | 'quiz' | 'mindmap' | 'visuals';
type ViewState = 'LANDING' | 'AUTH' | 'THEME_PICKER' | 'DASHBOARD' | 'CREATE' | 'VIEW_PACK';

export default function App() {
  // --- State ---
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('LANDING');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<AppTheme>('default');
  const [currentFont, setCurrentFont] = useState<AppFont>('Inter');
  const [currentShape, setCurrentShape] = useState<AppShape>('default');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  
  // App Logic State
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [activePack, setActivePack] = useState<StoredStudyPack | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('summary');
  const [error, setError] = useState<string | null>(null);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);

  // Chat Context state
  const [chatContext, setChatContext] = useState<string | undefined>(undefined);

  // Data Persistence State
  const [savedPacks, setSavedPacks] = useState<StoredStudyPack[]>([]);
  const [packImages, setPackImages] = useState<Record<string, GeneratedImage[]>>({});

  // Expanded states for accordions
  const [expandedNotes, setExpandedNotes] = useState<Record<number, boolean>>({});
  const [expandedTerms, setExpandedTerms] = useState<Record<number, boolean>>({});

  // --- Effects ---
  
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', currentTheme);
    root.style.setProperty('--font-family', currentFont);
    
    let radius = '12px';
    if (currentShape === 'sharp') radius = '4px';
    if (currentShape === 'rounded') radius = '24px';
    root.style.setProperty('--radius', radius);
  }, [currentTheme, currentFont, currentShape]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleCustomizationChange = (updates: { theme?: AppTheme; font?: AppFont; shape?: AppShape }) => {
    if (updates.theme) setCurrentTheme(updates.theme);
    if (updates.font) setCurrentFont(updates.font);
    if (updates.shape) setCurrentShape(updates.shape);

    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('ssp_user', JSON.stringify(updatedUser));
    }
  };

  useEffect(() => {
    const storedUserRaw = localStorage.getItem('ssp_user');
    if (storedUserRaw) {
      const storedUser = JSON.parse(storedUserRaw) as User;
      setUser(storedUser);
      if (storedUser.theme) setCurrentTheme(storedUser.theme);
      if (storedUser.font) setCurrentFont(storedUser.font);
      if (storedUser.shape) setCurrentShape(storedUser.shape);
      setView('CREATE');
    } else {
      setView('LANDING');
    }
  }, []);

  useEffect(() => {
    if (user && user.email) {
      const storageKey = `ssp_packs_${user.email}`;
      const imgKey = `ssp_images_${user.email}`;
      const storedPacks = localStorage.getItem(storageKey);
      const storedImages = localStorage.getItem(imgKey);

      if (storedPacks) {
        try { setSavedPacks(JSON.parse(storedPacks)); } catch (e) { setSavedPacks([]); }
      } else { setSavedPacks([]); }

      if (storedImages) {
        try { setPackImages(JSON.parse(storedImages)); } catch (e) { setPackImages({}); }
      }
    }
  }, [user]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    if (newUser.theme) {
      setCurrentTheme(newUser.theme);
      if (newUser.font) setCurrentFont(newUser.font);
      if (newUser.shape) setCurrentShape(newUser.shape);
      localStorage.setItem('ssp_user', JSON.stringify(newUser));
      setView('CREATE');
    } else {
      setView('THEME_PICKER');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ssp_user');
    setView('LANDING');
    setActivePack(null);
    setStatus(AppStatus.IDLE);
    setSavedPacks([]);
    setCurrentTheme('default');
    setCurrentFont('Inter');
    setCurrentShape('default');
  };

  const handleCreateNew = () => {
    setView('CREATE');
    setStatus(AppStatus.IDLE);
    setActivePack(null);
    setError(null);
    setSidebarOpen(false);
  };

  const handleOpenPack = (pack: StoredStudyPack) => {
    setActivePack(pack);
    setView('VIEW_PACK');
    setStatus(AppStatus.SUCCESS);
    setActiveTab('summary');
    setCurrentFlashcardIndex(0);
    setExpandedNotes({});
    setExpandedTerms({});
    setSidebarOpen(false);
  };

  const handleGenerate = async (input: UserInput) => {
    if (!user) return;
    setStatus(AppStatus.GENERATING);
    setError(null);
    try {
      const result = await generateStudyPack(input);
      const newPack: StoredStudyPack = { ...result, id: crypto.randomUUID(), createdAt: Date.now() };
      let updatedPacks = [newPack, ...savedPacks];
      const storageKey = `ssp_packs_${user.email}`;
      try { localStorage.setItem(storageKey, JSON.stringify(updatedPacks)); } catch (e) { console.error("Storage error", e); }
      setSavedPacks(updatedPacks);
      setActivePack(newPack);
      setStatus(AppStatus.SUCCESS);
      setView('VIEW_PACK');
      setActiveTab('summary');
      setCurrentFlashcardIndex(0);
      setExpandedNotes({});
      setExpandedTerms({});
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate study pack.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleImageGenerated = (image: GeneratedImage) => {
    if (!user || !activePack) return;
    const currentImages = packImages[activePack.id] || [];
    const newImages = [image, ...currentImages];
    const newPackImages = { ...packImages, [activePack.id]: newImages };
    setPackImages(newPackImages);
    localStorage.setItem(`ssp_images_${user.email}`, JSON.stringify(newPackImages));
  };

  const handleAskAI = (context: string) => {
    setChatContext(context);
  };

  const toggleNote = (idx: number) => {
    setExpandedNotes(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleTerm = (idx: number) => {
    setExpandedTerms(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const renderContent = () => {
    if (!activePack) return null;

    switch (activeTab) {
      case 'summary':
        return (
          <div className="space-y-6 animate-fade-in pb-12">
            <div className={`bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm relative overflow-hidden group ${currentTheme === 'original' ? 'bg-theme-gradient text-white border-none' : 'border-l-4 border-l-primary'}`}>
               <button 
                  onClick={() => handleAskAI(`Summary: ${activePack.summary.tl_dr}`)}
                  className={`absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 shadow-lg rounded-full text-[10px] font-bold uppercase tracking-wider hover:scale-105 transition-all opacity-0 group-hover:opacity-100 ${currentTheme === 'original' ? 'bg-white text-[#7C5DFA] border-none' : 'bg-white dark:bg-zinc-800 border border-theme text-theme'}`}
               >
                 <Sparkles className="w-3 h-3" />
                 Ask AI
               </button>

               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
               <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className={`w-6 h-6 ${currentTheme === 'original' ? 'text-white' : 'text-theme'}`} />
                  <h3 className={`text-xl font-bold ${currentTheme === 'original' ? 'text-white' : 'text-theme'}`}>TL;DR</h3>
               </div>
               <p className={`text-lg leading-relaxed relative z-10 ${currentTheme === 'original' ? 'text-white/90' : 'text-zinc-700 dark:text-zinc-300'}`}>
                 {activePack.summary.tl_dr}
               </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                 <div className="p-1 rounded-full bg-primary/10 text-theme">
                    <div className="w-4 h-4 rounded-full border-2 border-current"></div>
                 </div>
                 <h3 className="text-xl font-bold text-theme">Key Takeaways</h3>
              </div>
              <div className="space-y-4">
                {activePack.summary.important_points.map((point, idx) => (
                  <div key={idx} className="flex gap-4 group relative">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed pt-1 flex-1">{point}</p>
                    <button 
                       onClick={() => handleAskAI(`Study Point: ${point}`)}
                       className="p-1 text-theme opacity-0 group-hover:opacity-100 transition-opacity"
                       title="Ask AI about this"
                    >
                       <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className="space-y-6 animate-fade-in pb-12">
             <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-theme" />
                <h3 className="font-bold text-lg text-theme">Detailed Notes ({activePack.notes.length} sections)</h3>
             </div>
             <div className="grid gap-4">
               {activePack.notes?.map((section, idx) => {
                 const isExpanded = expandedNotes[idx] !== false;
                 return (
                   <div key={idx} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm relative group">
                      <button 
                        onClick={() => toggleNote(idx)}
                        className="w-full flex items-center justify-between p-6 bg-zinc-50/50 dark:bg-zinc-900 hover:bg-zinc-100/50 dark:hover:bg-zinc-800 transition-colors text-left"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-theme flex items-center justify-center font-bold text-sm">
                               {idx + 1}
                            </div>
                            <h4 className="text-lg font-bold text-theme">{section.title}</h4>
                         </div>
                         <ChevronDown className={`w-5 h-5 text-theme transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAskAI(`Note Section "${section.title}": ${section.content}`); }}
                        className="absolute top-6 right-16 z-10 flex items-center gap-1 px-2 py-1 bg-white dark:bg-zinc-800 border border-theme rounded-lg text-[9px] font-bold text-theme opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                         <Sparkles className="w-3 h-3" />
                         Doubt?
                      </button>

                      {isExpanded && (
                        <div className="px-6 pb-6 pt-2 pl-[4.5rem]">
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap border-l-2 border-primary/20 pl-4">
                                {section.content}
                            </p>
                        </div>
                      )}
                   </div>
                 );
               })}
             </div>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-4 animate-fade-in pb-12">
            <div className="flex items-center gap-2 mb-4">
                <Book className="w-5 h-5 text-theme" />
                <h3 className="font-bold text-lg text-theme">Key Terms ({activePack.key_terms.length})</h3>
             </div>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800">
                {activePack.key_terms.map((term, idx) => {
                  const isExpanded = expandedTerms[idx];
                  return (
                    <div key={idx} className="group relative">
                        <button 
                           onClick={() => toggleTerm(idx)}
                           className="w-full flex items-center justify-between p-5 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                        >
                           <span className="font-bold text-theme">{term.term}</span>
                           <ChevronDown className={`w-5 h-5 text-theme transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <button 
                           onClick={(e) => { e.stopPropagation(); handleAskAI(`Term: "${term.term}". Meaning: ${term.meaning}`); }}
                           className="absolute top-5 right-12 z-10 p-1.5 text-theme opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                           <Sparkles className="w-4 h-4" />
                        </button>

                        {isExpanded && (
                           <div className="px-5 pb-5 pt-0">
                              <p className="text-zinc-600 dark:text-zinc-400 mb-2">{term.meaning}</p>
                              {term.example && (
                                <p className="text-sm text-zinc-400 italic">Ex: "{term.example}"</p>
                              )}
                           </div>
                        )}
                    </div>
                  );
                })}
            </div>
          </div>
        );

      case 'questions':
        return (
          <ImportantQuestions 
            data={activePack.important_questions} 
            onAskAI={handleAskAI} 
          />
        );

      case 'flashcards':
        return (
          <div className="animate-fade-in max-w-4xl mx-auto pb-12">
             <div className="flex items-center gap-2 mb-6">
                <Layers className="w-5 h-5 text-theme" />
                <h3 className="font-bold text-lg text-theme">Flashcards</h3>
             </div>
             <Flashcard 
                key={currentFlashcardIndex} 
                card={activePack.flashcards[currentFlashcardIndex]} 
                onAskAI={handleAskAI}
              />
            <div className="flex items-center justify-between mt-8 max-w-sm mx-auto">
              <button 
                onClick={() => setCurrentFlashcardIndex(prev => Math.max(0, prev - 1))}
                disabled={currentFlashcardIndex === 0}
                className="w-12 h-12 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                 {activePack.flashcards.map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 h-2 rounded-full transition-colors ${i === currentFlashcardIndex ? 'bg-primary' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                    />
                 ))}
              </div>
              <button 
                onClick={() => setCurrentFlashcardIndex(prev => Math.min(activePack.flashcards.length - 1, prev + 1))}
                disabled={currentFlashcardIndex === activePack.flashcards.length - 1}
                className="w-12 h-12 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
             <div className="text-center mt-4 text-theme font-mono text-sm">
                {currentFlashcardIndex + 1} / {activePack.flashcards.length}
             </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="animate-fade-in pb-12">
            <Quiz 
              questions={activePack.quiz.questions} 
              instructions={activePack.quiz.instructions} 
              onAskAI={handleAskAI}
            />
          </div>
        );
      
      case 'mindmap':
        return (
            <div className="animate-fade-in pb-12">
                {activePack.mind_map ? (
                    <MindMap data={activePack.mind_map} />
                ) : (
                    <div className="text-center py-12 text-zinc-400">No Mind Map available.</div>
                )}
            </div>
        );
      
      case 'visuals':
        return (
           <div className="animate-fade-in pb-12">
              <Visuals 
                 initialPrompt={`Educational illustration about ${activePack.meta.chapter_title}`}
                 images={packImages[activePack.id] || []}
                 onImageGenerated={handleImageGenerated}
              />
           </div>
        );
      default:
        return null;
    }
  };

  if (view === 'LANDING') {
    return (
      <LandingPage 
        onGetStarted={() => setView('AUTH')}
        onLogin={() => setView('AUTH')}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
    );
  }

  if (view === 'AUTH') {
    return <AuthPage onLogin={handleLogin} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />;
  }

  if (view === 'THEME_PICKER') {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6">
        <div className="max-w-xl w-full">
           <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight">Personalize Your Learning</h1>
              <p className="text-zinc-500">Pick an aesthetic that helps you focus. You can change this anytime.</p>
           </div>
           <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-xl">
              <ThemeCustomizer 
                currentTheme={currentTheme} 
                currentFont={currentFont}
                currentShape={currentShape}
                onChange={handleCustomizationChange}
                compact={false}
              />
              <button 
                onClick={() => setView('CREATE')}
                className="w-full mt-10 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
              >
                Let's Get Started
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black transition-colors duration-300 flex font-sans">
      {user && (
        <ChatBot 
           initialContext={chatContext} 
           onClose={() => setChatContext(undefined)} 
        />
      )}

      {user && (
         <div className="hidden md:block">
           <Sidebar 
             user={user}
             packs={savedPacks}
             onLogout={handleLogout}
             isDarkMode={isDarkMode}
             toggleTheme={toggleTheme}
             onCreateNew={handleCreateNew}
             onOpenPack={handleOpenPack}
             activeView={view}
             onOpenCustomizer={() => setIsThemeModalOpen(true)}
           />
         </div>
      )}

      {isThemeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-8 relative">
              <button 
                onClick={() => setIsThemeModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                 <ChevronDown className="w-6 h-6 rotate-90" />
              </button>
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Palette className="w-5 h-5 text-theme" />
                 </div>
                 <h2 className="text-2xl font-bold tracking-tight text-theme">Customize Appearance</h2>
              </div>
              <ThemeCustomizer 
                 currentTheme={currentTheme} 
                 currentFont={currentFont}
                 currentShape={currentShape}
                 onChange={handleCustomizationChange}
                 compact={true}
              />
           </div>
        </div>
      )}

      <main className={`flex-1 transition-all duration-300 ${user ? 'md:ml-64' : ''}`}>
        
        {user && (
          <div className="md:hidden p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur z-30">
             <span className="font-bold text-xl text-theme">Notepilot</span>
             <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-theme">
                <Menu className="w-6 h-6" />
             </button>
          </div>
        )}

        {sidebarOpen && user && (
           <div className="fixed inset-0 z-50 md:hidden flex">
              <div className="w-64 h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
                  <Sidebar 
                    user={user}
                    packs={savedPacks}
                    onLogout={handleLogout}
                    isDarkMode={isDarkMode}
                    toggleTheme={toggleTheme}
                    onCreateNew={() => { handleCreateNew(); setSidebarOpen(false); }}
                    onOpenPack={(p) => { handleOpenPack(p); setSidebarOpen(false); }}
                    activeView={view}
                    onOpenCustomizer={() => { setIsThemeModalOpen(true); setSidebarOpen(false); }}
                  />
              </div>
              <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
           </div>
        )}

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {view === 'CREATE' && (
            <div className="animate-fade-in">
               {status === AppStatus.ERROR && error && (
                <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl flex items-center gap-3">
                  <p>{error}</p>
                </div>
              )}
               <InputForm onSubmit={handleGenerate} isLoading={status === AppStatus.GENERATING} />
            </div>
          )}

          {view === 'VIEW_PACK' && activePack && (
            <div className="animate-fade-in space-y-8">
               <div>
                  <button 
                     onClick={() => setView('CREATE')} 
                     className="flex items-center gap-2 text-theme hover:opacity-80 mb-6 transition-colors"
                  >
                     <ArrowLeft className="w-4 h-4" />
                     <span className="text-sm font-medium">Create New Pack</span>
                  </button>

                  <h1 className="text-4xl font-extrabold text-theme mb-4 tracking-tight capitalize">
                     {activePack.meta.chapter_title}
                  </h1>

                  <div className="flex flex-wrap gap-2">
                     <span className="px-3 py-1 rounded-full bg-primary/10 text-theme text-sm font-bold border border-primary/20">
                        {activePack.meta.grade}
                     </span>
                     <span className="px-3 py-1 rounded-full bg-primary/5 text-theme text-sm font-bold border border-primary/20">
                        {activePack.meta.subject}
                     </span>
                     <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-bold">
                        {activePack.meta.language}
                     </span>
                  </div>
               </div>

               <div className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl inline-flex flex-wrap gap-1">
                  {[
                     { id: 'summary', icon: LayoutDashboard, label: 'Summary' },
                     { id: 'notes', icon: FileText, label: 'Notes' },
                     { id: 'terms', icon: Book, label: 'Terms' },
                     { id: 'questions', icon: HelpCircle, label: 'Questions' },
                     { id: 'flashcards', icon: Layers, label: 'Cards' },
                     { id: 'quiz', icon: BrainCircuit, label: 'Quiz' },
                  ].map(tab => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all
                           ${activeTab === tab.id 
                              ? 'bg-white dark:bg-zinc-800 text-theme shadow-sm' 
                              : 'text-zinc-500 hover:text-theme hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'}`}
                     >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                     </button>
                  ))}
               </div>

               <div className="min-h-[500px] mt-4">
                  {renderContent()}
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
