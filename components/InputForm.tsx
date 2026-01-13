import React, { useState, useRef } from 'react';
import { UserInput } from '../types';
import { Upload, X, FileType, Sparkles, ChevronDown, GraduationCap, Zap, Globe, FileText, CheckCircle } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserInput>({
    grade: '',
    subject: '',
    chapterTitle: '',
    language: 'English',
    chapterText: '',
    pdfData: undefined
  });

  const [pdfFile, setPdfFile] = useState<{name: string, data: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setPdfFile({ name: file.name, data: base64Data });
        setFormData(prev => ({ ...prev, pdfData: base64Data, chapterText: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setPdfFile(null);
    setFormData(prev => ({ ...prev, pdfData: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const isFormValid = formData.grade && formData.subject && formData.chapterTitle && (formData.chapterText || pdfFile);

  const grades = ['Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'College'];
  const languages = ['English', 'Spanish', 'French', 'Hindi', 'German', 'Chinese'];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pt-8 pb-20">
      <div className="text-center mb-12">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black mb-4 border border-primary/20 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Generation
         </div>
         <h1 className="text-5xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tighter mb-4 leading-none">
            Put your grades on <br/>
            <span className="text-gradient">autopilot</span>
         </h1>
         <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto font-medium">
            Paste your chapter text or upload a PDF and get AI-generated summaries, flashcards, key terms, and quizzes.
         </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
           <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                 <GraduationCap className="w-4 h-4 text-primary" />
                 Grade
              </label>
              <div className="relative">
                 <select
                    value={formData.grade}
                    onChange={e => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full appearance-none px-5 py-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 focus:ring-2 focus:ring-primary outline-none text-zinc-900 dark:text-zinc-100 transition-all font-bold"
                 >
                    <option value="" disabled>Select grade</option>
                    {grades.map(g => <option key={g} value={g}>{g}</option>)}
                 </select>
                 <ChevronDown className="absolute right-4 top-4.5 w-5 h-5 text-zinc-400 pointer-events-none" />
              </div>
           </div>
           
           <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                 <Zap className="w-4 h-4 text-primary" />
                 Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Science, History, Math"
                className="w-full px-5 py-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 focus:ring-2 focus:ring-primary outline-none text-zinc-900 dark:text-zinc-100 transition-all placeholder:text-zinc-300 font-bold"
              />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
           <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                 <FileText className="w-4 h-4 text-primary" />
                 Chapter Title
              </label>
              <input
                type="text"
                value={formData.chapterTitle}
                onChange={e => setFormData({ ...formData, chapterTitle: e.target.value })}
                placeholder="e.g., Photosynthesis, World War II"
                className="w-full px-5 py-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 focus:ring-2 focus:ring-primary outline-none text-zinc-900 dark:text-zinc-100 transition-all placeholder:text-zinc-300 font-bold"
              />
           </div>
           
           <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                 <Globe className="w-4 h-4 text-primary" />
                 Language
              </label>
              <div className="relative">
                 <select
                    value={formData.language}
                    onChange={e => setFormData({ ...formData, language: e.target.value })}
                    className="w-full appearance-none px-5 py-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 focus:ring-2 focus:ring-primary outline-none text-zinc-900 dark:text-zinc-100 transition-all font-bold"
                 >
                    {languages.map(l => <option key={l} value={l}>{l}</option>)}
                 </select>
                 <ChevronDown className="absolute right-4 top-4.5 w-5 h-5 text-zinc-400 pointer-events-none" />
              </div>
           </div>
        </div>

        <div className="mb-8 space-y-3">
           <label className="flex items-center gap-2 text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
               <Upload className="w-4 h-4 text-primary" />
               Upload PDF (optional)
           </label>
           
           {!pdfFile ? (
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="border-2 border-dashed border-zinc-100 dark:border-zinc-800 hover:border-primary bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl p-10 text-center cursor-pointer transition-all group"
             >
                <div className="w-14 h-14 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-zinc-100 dark:border-zinc-800 group-hover:scale-110 transition-transform text-primary">
                   <Upload className="w-6 h-6" />
                </div>
                <p className="text-base font-bold text-zinc-700 dark:text-zinc-300">Drop your PDF here or click to browse</p>
                <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-widest">Max 10MB • PDF files only</p>
             </div>
           ) : (
             <div className="flex items-center justify-between p-5 bg-accent/5 border border-accent/20 rounded-2xl">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-accent/20">
                       <FileType className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                       <p className="text-sm font-black text-zinc-900 dark:text-zinc-100">{pdfFile.name}</p>
                       <div className="flex items-center gap-1.5 mt-0.5">
                          <CheckCircle className="w-3.5 h-3.5 text-accent" />
                          <p className="text-[10px] font-black text-accent uppercase tracking-widest">Attached Successfully</p>
                       </div>
                    </div>
                 </div>
                 <button onClick={clearFile} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400">
                    <X className="w-5 h-5" />
                 </button>
             </div>
           )}
           <input 
              type="file" 
              ref={fileInputRef}
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
          />
        </div>

        <div className="mb-10 space-y-3">
           <label className="flex items-center gap-2 text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
               <FileText className="w-4 h-4 text-primary" />
               Chapter Text
           </label>
           <textarea
              value={formData.chapterText}
              onChange={(e) => setFormData({ ...formData, chapterText: e.target.value })}
              placeholder="Paste the chapter text here or upload a PDF above (minimum 50 characters)..."
              rows={8}
              className="w-full px-5 py-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 focus:ring-2 focus:ring-primary outline-none text-zinc-900 dark:text-zinc-100 transition-all placeholder:text-zinc-300 font-bold resize-none"
           />
           <div className="flex justify-between items-center px-1">
             <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Text Content</div>
             <div className={`text-[10px] font-black uppercase tracking-widest ${formData.chapterText.length > 50 ? 'text-accent' : 'text-zinc-400'}`}>
               {formData.chapterText.length} characters
             </div>
           </div>
        </div>

        <button
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid}
            className={`w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all shadow-xl
                ${isLoading || !isFormValid
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-100 dark:border-zinc-700 shadow-none' 
                    : 'bg-primary text-primary-foreground hover:opacity-95 shadow-primary/30'}`}
        >
            <Sparkles className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Generating Study Pack...' : 'Generate Study Pack'}
        </button>

      </div>
    </div>
  );
};