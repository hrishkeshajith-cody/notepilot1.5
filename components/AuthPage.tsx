
import React, { useState } from 'react';
import { User } from '../types';
import { ArrowRight, Lock, Mail, User as UserIcon, Moon, Sun, GraduationCap, Sparkles } from 'lucide-react';

interface AuthPageProps {
  onLogin: (user: User) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, toggleTheme, isDarkMode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name: formData.name || 'Student',
      email: formData.email
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 transition-colors relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

      <button 
        onClick={toggleTheme} 
        className="absolute top-6 right-6 p-2 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors z-10"
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden relative z-10 animate-fade-in">
        {/* Header */}
        <div className="p-10 text-center border-b border-zinc-50 dark:border-zinc-800">
          <div className="w-16 h-16 bg-theme-gradient rounded-[20px] mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary/20">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">
            Welcome to <span className="text-gradient">Notepilot</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
            Your AI-powered study journey starts here.
          </p>
        </div>

        {/* Form Section */}
        <div className="p-10">
          <div className="flex gap-2 mb-10 bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-2xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                isLogin ? 'bg-white dark:bg-zinc-700 shadow-sm text-primary' : 'text-zinc-500'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                !isLogin ? 'bg-white dark:bg-zinc-700 shadow-sm text-primary' : 'text-zinc-500'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1">
                <div className="relative">
                  <UserIcon className="absolute left-4 top-4 w-5 h-5 text-zinc-400" />
                  <input
                    type="text"
                    required={!isLogin}
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all text-zinc-900 dark:text-zinc-100 font-bold placeholder:text-zinc-400"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <div className="relative">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-zinc-400" />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all text-zinc-900 dark:text-zinc-100 font-bold placeholder:text-zinc-400"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-4 top-4 w-5 h-5 text-zinc-400" />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary outline-none transition-all text-zinc-900 dark:text-zinc-100 font-bold placeholder:text-zinc-400"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-theme-gradient hover:opacity-95 text-white font-black py-4.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 shadow-xl shadow-primary/20"
            >
              {isLogin ? 'Continue' : 'Create Account'}
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 justify-center mt-6 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
               <Sparkles className="w-3.5 h-3.5 text-accent" />
               Secure AI Study Environment
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
