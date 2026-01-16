
export type AppTheme = 'default' | 'emerald' | 'violet' | 'rose' | 'amber' | 'original';
export type AppFont = 'Inter' | 'Playfair Display' | 'JetBrains Mono' | 'Quicksand';
export type AppShape = 'sharp' | 'default' | 'rounded';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  difficulty: string;
}

export interface FlashcardItem {
  q: string;
  a: string;
}

export interface KeyTerm {
  term: string;
  meaning: string;
  example: string;
}

export interface NoteSection {
  title: string;
  content: string;
}

export interface MindMapData {
  mermaidCode: string;
}

export interface QuestionWithSolution {
  question: string;
  solution: string;
}

export interface ImportantQuestionsData {
  one_mark: QuestionWithSolution[];
  three_mark: QuestionWithSolution[];
  five_mark: QuestionWithSolution[];
}

export interface StudyPackData {
  meta: {
    subject: string;
    grade: string;
    chapter_title: string;
    language: string;
  };
  summary: {
    tl_dr: string;
    important_points: string[];
  };
  notes: NoteSection[];
  key_terms: KeyTerm[];
  flashcards: FlashcardItem[];
  important_questions: ImportantQuestionsData;
  quiz: {
    instructions: string;
    questions: QuizQuestion[];
  };
  mind_map?: MindMapData;
}

export interface StoredStudyPack extends StudyPackData {
  id: string;
  createdAt: number;
}

export interface UserInput {
  grade: string;
  subject: string;
  chapterTitle: string;
  language: string;
  chapterText: string;
  pdfData?: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface User {
  name: string;
  email: string;
  theme?: AppTheme;
  font?: AppFont;
  shape?: AppShape;
}

export type ImageSize = '1K' | '2K' | '4K';

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  size: ImageSize;
  createdAt: number;
}
