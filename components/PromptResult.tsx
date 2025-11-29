import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './ui/Icons';

interface PromptResultProps {
  content: string;
  title?: string;
}

export const PromptResult: React.FC<PromptResultProps> = ({ content, title = "Result" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!content) return null;

  return (
    <div className="mt-8 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-fade-in-up">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <h3 className="font-semibold text-slate-700">{title}</h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy Prompt"}
        </button>
      </div>
      <div className="p-4 bg-slate-50">
        <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono bg-white p-4 rounded-lg border border-slate-200 overflow-x-auto">
          {content}
        </pre>
      </div>
    </div>
  );
};