import mongoose, { Schema, Document } from 'mongoose';

export interface IMatchPair {
  columnA: string;
  columnB: string;
}

export interface IQuestion extends Document {
  title: string;
  type: 'Single Choice MCQ' | 'Multiple Choice' | 'True/False' | 'Descriptive' | 'Match Following';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  visibility: 'Public' | 'Private' | 'Shared' | 'Draft';
  author: string;
  authorEmail: string;
  tags: string[];
  content: string;
  options?: string[];
  matchPairs?: IMatchPair[];
  correctAnswer?: string | string[];
  correctMatches?: { [key: string]: string };
  points: number;
  estimatedTime: number;
  negativeMarks?: number;
  explanation?: string;
  authorNotes?: string;
  isPublished: boolean;
  updatedAt: Date;
}

const MatchPairSchema: Schema = new Schema({
  columnA: { type: String, required: true },
  columnB: { type: String, required: true }
});

const QuestionSchema: Schema = new Schema({
  title: { type: String, required: true, minlength: 5 },
  type: { 
    type: String, 
    required: true,
    enum: ['Single Choice MCQ', 'Multiple Choice', 'True/False', 'Descriptive', 'Match Following']
  },
  difficulty: { 
    type: String, 
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  category: { type: String, required: true },
  visibility: { 
    type: String, 
    required: true,
    enum: ['Public', 'Private', 'Shared', 'Draft'],
    default: 'Draft'
  },
  author: { type: String, required: true },
  authorEmail: { type: String, required: true },
  tags: [{ type: String }],
  content: { type: String, required: true, minlength: 10 },
  options: [{ type: String }],
  matchPairs: [MatchPairSchema],
  correctAnswer: { type: Schema.Types.Mixed },
  correctMatches: { type: Schema.Types.Mixed },
  points: { type: Number, required: true, min: 0 },
  estimatedTime: { type: Number, required: true, min: 0 },
  negativeMarks: { type: Number, min: 0 },
  explanation: { type: String },
  authorNotes: { type: String },
  isPublished: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IQuestion>('Question', QuestionSchema);