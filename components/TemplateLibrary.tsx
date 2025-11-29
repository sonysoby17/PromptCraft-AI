import React, { useState } from 'react';
import { Template } from '../types';
import { LibraryIcon, CopyIcon, CheckIcon } from './ui/Icons';

const TEMPLATES: Template[] = [
  {
    id: '1',
    title: 'Code Refactoring Expert',
    category: 'Coding',
    description: 'A persona for cleaning up code, improving performance, and adhering to SOLID principles.',
    content: 'Act as a Senior Software Architect. Review the following code snippet. Your goal is to: 1. Identify anti-patterns. 2. Refactor for readability and performance. 3. Ensure adherence to SOLID principles. 4. Add comments explaining complex logic. \n\n[Insert Code Here]'
  },
  {
    id: '2',
    title: 'Blog Post Generator (SEO)',
    category: 'Writing',
    description: 'Creates engaging, SEO-optimized blog posts with proper H-tags and keyword density.',
    content: 'Act as an SEO Content Specialist. Write a blog post about [Topic]. \nRequirements:\n- Tone: Engaging and informative.\n- Structure: Introduction, 3-5 H2 subheadings, Conclusion.\n- SEO: Include keywords [Keyword1, Keyword2].\n- Length: 1000 words.'
  },
  {
    id: '3',
    title: 'Data Analysis Assistant',
    category: 'Analysis',
    description: 'Helps interpret CSV data or JSON output and find trends.',
    content: 'Act as a Data Scientist. I will provide a dataset below. Please:\n1. Summarize the key trends.\n2. Identify any anomalies.\n3. Suggest 3 visualizations that would best represent this data.\n\nDataset: [Insert Data]'
  },
  {
    id: '4',
    title: 'ELI5 (Explain Like I\'m 5)',
    category: 'Education',
    description: 'Simplifies complex topics for beginners or children.',
    content: 'Act as a Kindergarten Teacher. Explain the concept of [Topic] to me. Use simple analogies, avoid jargon, and keep the tone encouraging and fun.'
  },
  {
    id: '5',
    title: 'Unit Test Writer',
    category: 'Coding',
    description: 'Generates comprehensive unit tests for a given function.',
    content: 'Act as a QA Engineer. Write a comprehensive suite of unit tests for the following function using [Framework, e.g., Jest/Pytest]. Include positive cases, edge cases, and error handling scenarios.\n\nFunction: [Insert Function]'
  }
];

export const TemplateLibrary: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('All');

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTemplates = filter === 'All' 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category === filter);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center md:justify-start gap-2">
            <LibraryIcon className="w-6 h-6 text-teal-500" />
            Template Library
          </h2>
          <p className="text-slate-500 mt-2">
            Curated gold-standard prompts for instant use.
          </p>
        </div>
        
        <div className="flex gap-2 p-1 bg-slate-100 rounded-lg overflow-x-auto max-w-full">
          {['All', 'Coding', 'Writing', 'Analysis', 'Education'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap
                ${filter === cat 
                  ? 'bg-white text-teal-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="flex justify-between items-start mb-3">
              <span className={`px-2 py-1 rounded text-xs font-semibold
                ${template.category === 'Coding' ? 'bg-blue-100 text-blue-700' :
                  template.category === 'Writing' ? 'bg-purple-100 text-purple-700' :
                  template.category === 'Analysis' ? 'bg-orange-100 text-orange-700' :
                  'bg-green-100 text-green-700'
                }`}>
                {template.category}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{template.title}</h3>
            <p className="text-slate-600 text-sm mb-6 flex-grow">{template.description}</p>
            
            <button
              onClick={() => handleCopy(template.content, template.id)}
              className={`w-full py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all border
                ${copiedId === template.id 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
            >
              {copiedId === template.id ? (
                <>
                  <CheckIcon className="w-4 h-4" /> Copied
                </>
              ) : (
                <>
                  <CopyIcon className="w-4 h-4" /> Copy Template
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};