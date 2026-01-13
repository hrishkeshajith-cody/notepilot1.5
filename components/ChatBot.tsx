import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, Sparkles, Brain, Baby, Zap } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatWithAI } from '../services/gemini';

interface ChatBotProps {
  initialContext?: string;
  onClose?: () => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ initialContext, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialContext) {
      setIsOpen(true);
      setMessages([
        { role: 'model', text: `I see you have a doubt about this specific part. How can I help clarify it for you?` }
      ]);
    }
  }, [initialContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAI(textToSend, initialContext, messages);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const QuickAction = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:border-primary transition-all hover:text-primary shadow-sm"
    >
      <Icon className="w-3 h-3" />
      {label}
    </button>
  );

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center hover:scale-110 transition-transform animate-blob group"
        >
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center border border-primary">
            <Sparkles className="w-3 h-3 text-primary" />
          </div>
          <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        </button>
      ) : (
        <div className="w-[380px] h-[550px] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl flex flex-col border border-zinc-200 dark:border-zinc-800 animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">Notepilot AI</h3>
                <p className="text-[10px] opacity-80 uppercase tracking-widest">Always Learning</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 dark:bg-zinc-950/50 scrollbar-hide">
            {messages.length === 0 && (
              <div className="text-center py-10 px-6">
                <Brain className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <p className="text-zinc-500 text-sm italic">Hello! I'm your AI tutor. Ask me anything about your study materials.</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                    : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-4 py-2 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></div>
                   <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></div>
                   <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-3 flex flex-wrap gap-2 border-t border-zinc-100 dark:border-zinc-800">
             <QuickAction icon={Baby} label="Explain like I'm 5" onClick={() => handleSend("Can you explain this like I'm 5 years old?")} />
             <QuickAction icon={Zap} label="Simplify" onClick={() => handleSend("Please simplify this explanation for me.")} />
             <QuickAction icon={Sparkles} label="Give Example" onClick={() => handleSend("Could you provide a real-world example of this?")} />
          </div>

          {/* Input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2"
          >
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a doubt..."
              className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none outline-none px-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-primary transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg disabled:opacity-50 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};