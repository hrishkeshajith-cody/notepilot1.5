import React, { useState } from 'react';
import { GeneratedImage, ImageSize } from '../types';
import { generateStudyImage } from '../services/gemini';
import { Layers, Sparkles, Download, AlertTriangle, Key } from 'lucide-react';

interface VisualsProps {
  initialPrompt: string;
  images?: GeneratedImage[];
  onImageGenerated: (image: GeneratedImage) => void;
}

export const Visuals: React.FC<VisualsProps> = ({ initialPrompt, images = [], onImageGenerated }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [size, setSize] = useState<ImageSize>('1K');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsKey, setNeedsKey] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setNeedsKey(false);

    try {
      const win = window as any;
      if (win.aistudio) {
        const hasKey = await win.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          setNeedsKey(true);
          setIsLoading(false);
          return;
        }
      }

      const imageUrl = await generateStudyImage(prompt, size);
      
      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        url: imageUrl,
        prompt: prompt,
        size: size,
        createdAt: Date.now()
      };

      onImageGenerated(newImage);
    } catch (err: any) {
      if (err.message && err.message.includes("Requested entity was not found")) {
         setNeedsKey(true); 
      } else {
         setError("Generation failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeySelection = async () => {
    try {
      const win = window as any;
      if (win.aistudio) {
        await win.aistudio.openSelectKey();
        setNeedsKey(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Visuals Generator</h3>
        
        <div className="space-y-4">
          <div>
             <textarea 
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all text-zinc-900 dark:text-zinc-100"
               rows={2}
               placeholder="Describe image..."
             />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-end">
             <div className="flex-1">
                <div className="grid grid-cols-3 gap-2">
                  {(['1K', '2K', '4K'] as ImageSize[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`py-2 px-3 rounded-lg text-sm font-bold transition-all border
                        ${size === s 
                          ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' 
                          : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
             </div>
             
             <div className="flex-1">
                {needsKey ? (
                  <button
                    onClick={handleKeySelection}
                    className="w-full py-2 bg-zinc-900 text-white rounded-lg"
                  >
                    Select API Key
                  </button>
                ) : (
                  <button
                    onClick={handleGenerate}
                    disabled={isLoading || !prompt}
                    className={`w-full py-3 px-6 rounded-xl font-bold shadow-sm transition-all flex items-center justify-center gap-2 h-[50px]
                      ${isLoading || !prompt 
                        ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed' 
                        : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90'}`}
                  >
                    {isLoading ? 'Creating...' : 'Generate'}
                    {!isLoading && <Sparkles className="w-4 h-4" />}
                  </button>
                )}
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((img) => (
          <div key={img.id} className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative">
             <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 relative">
               <img src={img.url} alt={img.prompt} className="w-full h-full object-cover" />
             </div>
             <div className="p-4 flex justify-between items-center">
                 <span className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-1 rounded-full">{img.size}</span>
                 <a 
                   href={img.url} 
                   download={`notepilot-${img.createdAt}.png`}
                   className="text-zinc-900 dark:text-zinc-100 hover:underline text-xs font-bold flex items-center gap-1"
                 >
                   <Download className="w-3 h-3" />
                 </a>
             </div>
          </div>
        ))}
        {images.length === 0 && !isLoading && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-zinc-400 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <Layers className="w-8 h-8 mb-2" />
            <p>No visuals.</p>
          </div>
        )}
      </div>
    </div>
  );
};
