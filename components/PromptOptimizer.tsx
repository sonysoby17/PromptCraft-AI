import React, { useState, useEffect } from 'react';
import { OptimizerHistoryItem } from '../types';
import { optimizePrompt } from '../services/geminiService';
import { PromptResult } from './PromptResult';
import { SparklesIcon, RefreshIcon, HistoryIcon, TrashIcon } from './ui/Icons';

export const PromptOptimizer: React.FC = () => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<OptimizerHistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('promptCraft_optimizer_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  const saveToHistory = (original: string, optimized: string) => {
    const newItem: OptimizerHistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      originalPrompt: original,
      result: optimized
    };
    
    // Keep last 10 items
    const updatedHistory = [newItem, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('promptCraft_optimizer_history', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your optimization history?")) {
      setHistory([]);
      localStorage.removeItem('promptCraft_optimizer_history');
    }
  };

  const loadHistoryItem = (item: OptimizerHistoryItem) => {
    setInputPrompt(item.originalPrompt);
    setResult(item.result);
    setError(null);
  };

  const handleOptimize = async () => {
    if (!inputPrompt.trim()) {
      setError("Please enter a prompt to optimize.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult('');
    
    try {
      const optimized = await optimizePrompt(inputPrompt);
      setResult(optimized);
      saveToHistory(inputPrompt, optimized);
    } catch (e) {
      setError("Optimization failed. Please check your API connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center md:justify-start gap-2">
          <SparklesIcon className="w-6 h-6 text-purple-500" />
          Prompt Optimizer
        </h2>
        <p className="text-slate-500 mt-2">
          Turn vague ideas into powerful instructions using Chain of Thought and advanced techniques.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-purple-500 transition-all">
          <textarea
            className="w-full p-4 h-32 outline-none resize-none rounded-lg text-slate-700"
            placeholder="Paste your rough draft here... (e.g., 'Write a blog post about coffee')"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
          />
          <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex justify-between items-center rounded-b-lg">
             <span className="text-xs text-slate-400 font-medium">
               {inputPrompt.length} characters
             </span>
             <button
              onClick={handleOptimize}
              disabled={loading}
              className={`py-2 px-6 rounded-lg font-semibold text-white shadow-md transition-all flex items-center gap-2
                ${loading 
                  ? 'bg-purple-300 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700 hover:shadow-purple-500/30'
                }`}
            >
              {loading ? (
                 <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : <RefreshIcon className="w-4 h-4" />}
              Optimize
            </button>
          </div>
        </div>

        {error && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center">
              {error}
            </div>
        )}

        {result && (
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Optimization Result</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>
            <PromptResult content={result} title="Optimized & Analyzed" />
          </div>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
               <HistoryIcon className="w-4 h-4 text-slate-400" />
               <h3 className="text-sm font-semibold text-slate-600">Recent Optimizations</h3>
               <div className="h-px bg-slate-200 flex-1"></div>
               <button onClick={clearHistory} className="text-slate-400 hover:text-red-500 transition-colors" title="Clear History">
                  <TrashIcon className="w-4 h-4" />
               </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadHistoryItem(item)}
                  className="text-left bg-white border border-slate-200 p-4 rounded-lg hover:shadow-md hover:border-purple-200 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Draft</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 line-clamp-2 font-medium mb-1">{item.originalPrompt}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};