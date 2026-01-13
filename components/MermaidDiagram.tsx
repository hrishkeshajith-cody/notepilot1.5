import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chartCode: string;
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#e0e7ff', // indigo-100
    primaryTextColor: '#312e81', // indigo-900
    primaryBorderColor: '#6366f1', // indigo-500
    lineColor: '#64748b', // slate-500
    secondaryColor: '#f8fafc', // slate-50
    tertiaryColor: '#ffffff', // white
  },
  securityLevel: 'loose',
});

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chartCode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderChart = async () => {
      if (!chartCode) return;
      
      try {
        setError(null);
        // Generate a unique ID for this render to prevent collisions
        const id = `mermaid-${crypto.randomUUID()}`;
        
        // mermaid.render returns { svg } object in v10+
        // We pass the div ID (which it might create in DOM) and the code
        const { svg } = await mermaid.render(id, chartCode);
        setSvg(svg);
      } catch (err) {
        console.error("Mermaid Error:", err);
        setError("Failed to render mind map diagram. The syntax might be invalid.");
      }
    };

    renderChart();
  }, [chartCode]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
        <p className="font-bold">Error rendering diagram</p>
        <p>{error}</p>
        <details className="mt-2 text-xs text-slate-500">
          <summary>View Code</summary>
          <pre className="mt-2 p-2 bg-slate-100 rounded overflow-auto">{chartCode}</pre>
        </details>
      </div>
    );
  }

  return (
    <div 
      ref={ref} 
      dangerouslySetInnerHTML={{ __html: svg }} 
      className="w-full h-full flex items-center justify-center pointer-events-none" 
      // pointer-events-none ensures drag on parent works, but might disable diagram interactivity.
      // Since we are using a parent pan/zoom container, we usually want the parent to handle events.
    />
  );
};