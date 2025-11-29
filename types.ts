export enum AppMode {
  BUILDER = 'BUILDER',
  OPTIMIZER = 'OPTIMIZER',
  LIBRARY = 'LIBRARY'
}

export interface PromptParts {
  role: string;
  task: string;
  context: string;
  format: string;
}

export interface Template {
  id: string;
  title: string;
  category: 'Coding' | 'Writing' | 'Analysis' | 'Education';
  description: string;
  content: string;
}

export interface GenerationResult {
  text: string;
  isError: boolean;
}

export interface BuilderHistoryItem {
  id: string;
  timestamp: number;
  inputs: PromptParts;
  result: string;
}

export interface OptimizerHistoryItem {
  id: string;
  timestamp: number;
  originalPrompt: string;
  result: string;
}