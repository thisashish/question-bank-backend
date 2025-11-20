export interface QuestionStep1 {
  title: string;
  type: 'Single Choice MCQ' | 'Multiple Choice' | 'True/False' | 'Descriptive' | 'Match Following';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  visibility: 'Public' | 'Private' | 'Shared' | 'Draft';
  author: string;
  authorEmail: string;
  tags: string[];
}

export interface MatchPair {
  columnA: string;
  columnB: string;
}

export interface QuestionStep2 {
  content: string;
  options?: string[];
  correctAnswer?: string | string[];
  matchPairs?: MatchPair[];
  correctMatches?: { [key: string]: string };
}

export interface QuestionStep3 {
  points: number;
  estimatedTime: number;
  negativeMarks?: number;
  explanation?: string;
  authorNotes?: string;
}

export interface CreateQuestionRequest extends QuestionStep1, QuestionStep2, QuestionStep3 {}

export interface UpdateQuestionRequest extends Partial<CreateQuestionRequest> {
  isPublished?: boolean;
  updatedAt?: Date;
}

export interface QuestionFilters {
  category?: string;
  difficulty?: string;
  visibility?: string;
  author?: string;
  type?: string;
  tags?: string[];
  isPublished?: boolean;
  myQuestionsOnly?: boolean;
  authorEmail?: string;
}