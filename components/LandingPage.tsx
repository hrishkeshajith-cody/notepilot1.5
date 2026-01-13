
import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Zap, ArrowRight, CheckCircle, FileText, Moon, Sun, BookOpen, Layers, BrainCircuit, GraduationCap } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, toggleTheme, isDarkMode }) => {
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFeaturesVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: <FileText className="w-6 h-6 text-white" />, title: "Smart Summaries", desc: "Get TL;DR and key takeaways from any chapter instantly", color: "bg-primary" },
    { icon: <BookOpen className="w-6 h-6 text-white" />, title: "Key Terms", desc: "Automatically extract and explain important vocabulary", color: "bg-primary" },
    { icon: <Layers className="w-6 h-6 text-white" />, title: "Interactive Flashcards", desc: "Flip cards for active recall and better retention", color: "bg-primary" },
    { icon: <BrainCircuit className="w-6 h-6 text-white" />, title: "Practice Quizzes", desc: "Test your knowledge with auto-generated questions", color: "bg-primary" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 transition-colors duration-300 font-sans selection:bg-primary selection:text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/20">
                 <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-black dark:text-white">Notepilot</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2 text-zinc-500 hover:text-black dark:hover:text-white transition-colors">
                 {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={onLogin}
                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Log In
              </button>
              <button 
                onClick={onGetStarted}
                className="bg-primary hover:opacity-90 text-primary-foreground px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-md active:scale-95"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-bold mb-8 uppercase tracking-wider">
          <Sparkles className="w-3 h-3" />
          <span>AI-Powered Study Materials</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-black dark:text-white leading-[1.1]">
          Transform any chapter into <br />
          <span className="text-gradient">study materials in seconds</span>
        </h1>
        
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Paste your textbook content and get AI-generated summaries, flashcards, key terms, and quizzes tailored to your grade level.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button 
            onClick={onGetStarted}
            className="w-full sm:w-auto px-10 py-4 bg-primary hover:opacity-90 text-primary-foreground text-lg font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 active:scale-95"
          >
            <Zap className="w-5 h-5 fill-current" />
            Start Free
          </button>
          <div className="flex items-center gap-2 text-sm text-zinc-400 font-medium">
            <CheckCircle className="w-4 h-4 text-accent" />
            No credit card required
          </div>
        </div>

        {/* Minimal Stats */}
        <div className="flex justify-center gap-12 max-w-4xl mx-auto py-8">
           <StatItem label="Grade Levels" value="K-12" icon={<GraduationCap className="w-5 h-5 text-primary" />} />
           <StatItem label="Generation Time" value="<30s" icon={<Zap className="w-5 h-5 text-primary" />} />
           <StatItem label="Free to Use" value="100%" icon={<Sparkles className="w-5 h-5 text-primary" />} />
        </div>
      </section>

      {/* Features Grid */}
      <section ref={featuresRef} className="py-24 bg-white dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-black dark:text-white mb-6 tracking-tight leading-tight">Everything you need to study smarter</h2>
            <p className="text-zinc-500 text-lg">Our AI analyzes your content and creates comprehensive study materials automatically</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureItem 
                key={index}
                icon={feature.icon}
                title={feature.title}
                desc={feature.desc}
                color={feature.color}
                isVisible={featuresVisible}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Value Prop */}
      <section className="py-24 bg-zinc-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                 <h2 className="text-4xl font-extrabold text-black dark:text-white mb-8 tracking-tight leading-tight">Why students love Notepilot</h2>
                 <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                    Our AI understands your grade level and creates materials that match your learning needs.
                 </p>
                 <ul className="space-y-4">
                    <BulletItem text="Grade-appropriate difficulty levels (1-12)" />
                    <BulletItem text="Multiple language support" />
                    <BulletItem text="Instant generation from any text" />
                    <BulletItem text="Interactive study tools" />
                    <BulletItem text="Track your quiz scores" />
                    <BulletItem text="No credit card required" />
                 </ul>
              </div>
              <div className="bg-theme-gradient rounded-3xl p-12 aspect-square flex flex-col items-center justify-center text-center text-white shadow-2xl relative group overflow-hidden">
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm group-hover:scale-110 transition-transform">
                     <BookOpen className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-extrabold mb-2">Study Smarter</h3>
                  <p className="text-white/80 font-medium">Not Harder</p>
              </div>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
         <div className="bg-theme-gradient rounded-[40px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative z-10">
               <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Ready to transform your study sessions?</h2>
               <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">Join thousands of students who are already studying smarter with AI-powered materials.</p>
               <button 
                  onClick={onGetStarted}
                  className="bg-white text-primary px-10 py-4 rounded-lg font-extrabold text-lg hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 mx-auto active:scale-95 shadow-lg"
               >
                  Get Started for Free
                  <ArrowRight className="w-5 h-5" />
               </button>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-zinc-500 text-sm">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-primary p-1.5 rounded-lg">
               <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-black dark:text-white">Notepilot</span>
          </div>
          <div className="text-zinc-400 font-medium">
             © {new Date().getFullYear()} Notepilot • Making learning easier
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureItem = ({ icon, title, desc, color, isVisible, index }: { icon: React.ReactNode, title: string, desc: string, color: string, isVisible: boolean, index: number }) => (
  <div 
    className={`p-8 rounded-xl bg-white dark:bg-black border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-700 ease-out transform
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
    `}
    style={{ transitionDelay: `${index * 150}ms` }}
  >
    <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-primary/20`}>
      {icon}
    </div>
    <h3 className="text-lg font-extrabold text-black dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
  </div>
);

const StatItem = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
   <div className="flex flex-col items-center gap-1">
      <div className="mb-2">{icon}</div>
      <div className="text-xl font-extrabold text-black dark:text-white leading-tight">{value}</div>
      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</div>
   </div>
);

const BulletItem = ({ text }: { text: string }) => (
   <li className="flex items-center gap-3">
      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
         <CheckCircle className="w-4 h-4 text-accent" />
      </div>
      <span className="font-bold text-zinc-700 dark:text-zinc-200 text-sm">{text}</span>
   </li>
);
