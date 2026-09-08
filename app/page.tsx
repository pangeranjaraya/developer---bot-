"use client";
import { useChat } from 'ai/react';
import { useState, useEffect, useRef } from 'react';
import { Send, Code2, BookOpen, Heart, Sparkles, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Home() {
  const [mode, setMode] = useState<'coding' | 'learning' | 'curhat'>('curhat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat', body: { mode },
  });

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const modes = [
    { id: 'coding', label: 'Koding', icon: <Code2 size={18} />, color: 'text-cyan-400 border-cyan-400 bg-cyan-400/10' },
    { id: 'learning', label: 'Belajar', icon: <BookOpen size={18} />, color: 'text-emerald-400 border-emerald-400 bg-emerald-400/10' },
    { id: 'curhat', label: 'Curhat', icon: <Heart size={18} />, color: 'text-purple-400 border-purple-400 bg-purple-400/10' },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2"><Sparkles className="text-indigo-500" /><h1 className="font-bold text-xl">Nexus<span className="text-indigo-500">AI</span></h1></div>
      </header>

      <div className="flex justify-center gap-3 p-4 bg-slate-900/50">
        {modes.map((m) => (
          <button key={m.id} onClick={() => setMode(m.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${mode === m.id ? `${m.color} shadow-lg` : 'border-slate-700 text-slate-400'}`}>
            {m.icon}<span className="text-sm font-medium">{m.label}</span>
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-3xl mx-auto w-full">
        {messages.length === 0 && <div className="text-center text-slate-500 mt-20"><p>Pilih mode dan mulai percakapan.</p></div>}
        
        {messages.map((m) => (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0"><Bot size={16} className="text-indigo-400" /></div>}
            
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'}`}>
              {m.content.split('```').map((part, index) => {
                if (index % 2 === 1) {
                  const lang = part.split('\n')[0];
                  const code = part.substring(lang.length);
                  return <SyntaxHighlighter key={index} language={lang} style={atomOneDark} customStyle={{ margin: '10px 0', borderRadius: '8px', fontSize: '0.8rem' }}>{code}</SyntaxHighlighter>;
                }
                return <span key={index} className="whitespace-pre-wrap">{part}</span>;
              })}
            </div>
            
            {m.role === 'user' && <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0"><User size={16} className="text-slate-400" /></div>}
          </motion.div>
        ))}
        {isLoading && <div className="flex justify-start"><div className="bg-slate-800 p-3 rounded-2xl border border-slate-700"><div className="flex gap-1"><span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span><span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></span><span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></span></div></div></div>}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-slate-950 border-t border-slate-800">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
          <input value={input} onChange={handleInputChange} placeholder={`Ketik pesan (${mode})...`} className="w-full bg-slate-900 text-slate-100 rounded-xl pl-4 pr-12 py-3 border border-slate-700 focus:outline-none focus:border-indigo-500 transition-all" />
          <button type="submit" disabled={isLoading} className="absolute right-2 top-2 p-1.5 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 disabled:opacity-50"><Send size={18} /></button>
        </form>
      </footer>
    </div>
  );
    }
