import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize, Move, AlertCircle } from 'lucide-react';
import { MindMapData } from '../types';
import { MermaidDiagram } from './MermaidDiagram';

interface MindMapProps {
  data: MindMapData;
}

export const MindMap: React.FC<MindMapProps> = ({ data }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    resetView();
  }, [data]);

  if (!data.mermaidCode) {
     return (
        <div className="h-96 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-400">
           <AlertCircle className="w-10 h-10 mb-2" />
           <p>No map data.</p>
        </div>
     );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden h-[600px] relative flex flex-col">
       {/* Toolbar */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <button onClick={() => setScale(s => Math.min(s + 0.2, 3))} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400">
          <ZoomIn className="w-5 h-5" />
        </button>
        <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400">
          <ZoomOut className="w-5 h-5" />
        </button>
        <button onClick={resetView} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400">
          <Maximize className="w-5 h-5" />
        </button>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden bg-zinc-50 dark:bg-zinc-950 cursor-move relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={(e) => {
            if (e.ctrlKey || e.metaKey) {
              const delta = -e.deltaY * 0.001;
              setScale(s => Math.min(Math.max(0.5, s + delta), 3));
            }
        }}
      >
        <div 
            className="w-full h-full flex items-center justify-center transition-transform duration-75 ease-out origin-center"
            style={{ 
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            }}
        >
            <div className="min-w-[800px] min-h-[600px] flex items-center justify-center opacity-80 dark:opacity-90 dark:filter dark:invert">
              <MermaidDiagram chartCode={data.mermaidCode} />
            </div>
        </div>
      </div>
    </div>
  );
};
