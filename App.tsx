import React, { useState } from 'react';
import { AppMode } from './types';
import { PromptBuilder } from './components/PromptBuilder';
import { PromptOptimizer } from './components/PromptOptimizer';
import { TemplateLibrary } from './components/TemplateLibrary';
import { WrenchIcon, SparklesIcon, LibraryIcon } from './components/ui/Icons';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.BUILDER);

  const renderContent = () => {
    switch (mode) {
      case AppMode.BUILDER:
        return <PromptBuilder />;
      case AppMode.OPTIMIZER:
        return <PromptOptimizer />;
      case AppMode.LIBRARY:
        return <TemplateLibrary />;
      default:
        return <PromptBuilder />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header / Nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
               P
             </div>
             <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 hidden sm:block">
               PromptCraft AI
             </h1>
          </div>

          <nav className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setMode(AppMode.BUILDER)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                ${mode === AppMode.BUILDER 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <WrenchIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Builder</span>
            </button>
            <button
              onClick={() => setMode(AppMode.OPTIMIZER)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                ${mode === AppMode.OPTIMIZER 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <SparklesIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Optimizer</span>
            </button>
            <button
              onClick={() => setMode(AppMode.LIBRARY)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                ${mode === AppMode.LIBRARY 
                  ? 'bg-white text-teal-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <LibraryIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Library</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="animate-fade-in py-6">
          {renderContent()}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} PromptCraft AI. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;