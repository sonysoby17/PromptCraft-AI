import React, { useState, useEffect } from 'react';
import { PromptParts, BuilderHistoryItem } from '../types';
import { generateSuperPrompt } from '../services/geminiService';
import { PromptResult } from './PromptResult';
import { WrenchIcon, SparklesIcon, HistoryIcon, TrashIcon } from './ui/Icons';

export const PromptBuilder: React.FC = () => {
  const [inputs, setInputs] = useState<PromptParts>({
    role: '',
    task: '',
    context: '',
    format: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<BuilderHistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('promptCraft_builder_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  const saveToHistory = (newInputs: PromptParts, newResult: string) => {
    const newItem: BuilderHistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      inputs: { ...newInputs },
      result: newResult
    };
    
    // Keep last 10 items
    const updatedHistory = [newItem, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('promptCraft_builder_history', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your generation history?")) {
      setHistory([]);
      localStorage.removeItem('promptCraft_builder_history');
    }
  };

  const loadHistoryItem = (item: BuilderHistoryItem) => {
    setInputs(item.inputs);
    setResult(item.result);
    setError(null);
  };

  const handleChange = (field: keyof PromptParts, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleBuild = async () => {
    if (!inputs.role || !inputs.task) {
      setError("Role and Task are required fields.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult('');
    
    try {
      const generatedPrompt = await generateSuperPrompt(inputs);
      setResult(generatedPrompt);
      saveToHistory(inputs, generatedPrompt);
    } catch (e) {
      setError("Something went wrong with the AI generation. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center md:justify-start gap-2">
          <WrenchIcon className="w-6 h-6 text-indigo-500" />
          Prompt Builder
        </h2>
        <p className="text-slate-500 mt-2">
          Define the core components, and let Gemini structure the perfect prompt for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Role / Persona <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="e.g. Senior Python Developer, Marketing Guru"
              value={inputs.role}
              onChange={(e) => handleChange('role', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Task / Objective <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-24 resize-none"
              placeholder="What do you want the AI to do? e.g. Explain asyncio to a junior dev."
              value={inputs.task}
              onChange={(e) => handleChange('task', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Context / Constraints
            </label>
            <textarea
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-24 resize-none"
              placeholder="Any background info? e.g. Limit to 300 words, no technical jargon."
              value={inputs.context}
              onChange={(e) => handleChange('context', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Output Format
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="e.g. Markdown, JSON, Bullet points"
              value={inputs.format}
              onChange={(e) => handleChange('format', e.target.value)}
            />
          </div>

          <button
            onClick={handleBuild}
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2
              ${loading 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30'
              }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Constructing...
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
                Build Super Prompt
              </>
            )}
          </button>
          
          {error && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex-1 bg-slate-100 rounded-xl border border-slate-200 p-6 flex flex-col min-h-[400px]">
             {result ? (
               <div className="animate-fade-in">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Generated Super Prompt</h3>
                  <PromptResult content={result} title="Copy Ready Prompt" />
               </div>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
                 <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                   <SparklesIcon className="w-8 h-8 text-slate-400" />
                 </div>
                 <p className="text-center">Your generated prompt will appear here.</p>
               </div>
             )}
          </div>

          {/* History Section */}
          {history.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                 <h3 className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                   <HistoryIcon className="w-4 h-4" /> Recent Generations
                 </h3>
                 <button onClick={clearHistory} className="text-slate-400 hover:text-red-500 transition-colors" title="Clear History">
                   <TrashIcon className="w-4 h-4" />
                 </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadHistoryItem(item)}
                    className="w-full text-left p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                  >
                    <div className="flex justify-between items-start">
                       <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-1 inline-block">
                         {item.inputs.role}
                       </span>
                       <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                         {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{item.inputs.task}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};