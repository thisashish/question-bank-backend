import { Request, Response, NextFunction } from 'express';

export const validateQuestionStep1 = (req: Request, res: Response, next: NextFunction) => {
  const { title, type, difficulty, category, visibility, author, authorEmail } = req.body;

  if (!title || title.trim().length < 5) {
    return res.status(400).json({ 
      success: false,
      error: 'Question title must be at least 5 characters long' 
    });
  }

  if (!type) {
    return res.status(400).json({ 
      success: false,
      error: 'Question type is required' 
    });
  }

  const validTypes = ['Single Choice MCQ', 'Multiple Choice', 'True/False', 'Descriptive', 'Match Following'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid question type' 
    });
  }

  const validDifficulties = ['Easy', 'Medium', 'Hard'];
  if (!difficulty || !validDifficulties.includes(difficulty)) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid difficulty level' 
    });
  }

  if (!category || category.trim().length === 0) {
    return res.status(400).json({ 
      success: false,
      error: 'Category is required' 
    });
  }

  const validVisibility = ['Public', 'Private', 'Shared', 'Draft'];
  if (!visibility || !validVisibility.includes(visibility)) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid visibility setting' 
    });
  }

  if (!author || author.trim().length === 0) {
    return res.status(400).json({ 
      success: false,
      error: 'Author is required' 
    });
  }

  if (!authorEmail || !/^\S+@\S+\.\S+$/.test(authorEmail)) {
    return res.status(400).json({ 
      success: false,
      error: 'Valid author email is required' 
    });
  }

  next();
};

export const validateQuestionStep2 = (req: Request, res: Response, next: NextFunction) => {
  const { content, type, options, matchPairs, correctAnswer } = req.body;

  if (!content || content.trim().length < 10) {
    return res.status(400).json({ 
      success: false,
      error: 'Question content must be at least 10 characters long' 
    });
  }

  if (type === 'Single Choice MCQ' || type === 'Multiple Choice') {
    if (!options || options.length < 2) {
      return res.status(400).json({ 
        success: false,
        error: 'At least 2 options are required for MCQ questions' 
      });
    }
    if (!correctAnswer) {
      return res.status(400).json({ 
        success: false,
        error: 'Correct answer is required for MCQ questions' 
      });
    }
  }

  if (type === 'Match Following') {
    if (!matchPairs || matchPairs.length < 2) {
      return res.status(400).json({ 
        success: false,
        error: 'At least 2 match pairs are required for Match Following questions' 
      });
    }
  }

  if (type === 'True/False' && !correctAnswer) {
    return res.status(400).json({ 
      success: false,
      error: 'Correct answer is required for True/False questions' 
    });
  }

  next();
};

export const validateQuestionStep3 = (req: Request, res: Response, next: NextFunction) => {
  const { points, estimatedTime } = req.body;

  if (!points || points < 0) {
    return res.status(400).json({ 
      success: false,
      error: 'Points are required and must be non-negative' 
    });
  }

  if (!estimatedTime || estimatedTime < 0) {
    return res.status(400).json({ 
      success: false,
      error: 'Estimated time is required and must be non-negative' 
    });
  }

  if (req.body.negativeMarks && req.body.negativeMarks < 0) {
    return res.status(400).json({ 
      success: false,
      error: 'Negative marks must be non-negative' 
    });
  }

  next();
};

export const validateCompleteQuestion = [
  validateQuestionStep1,
  validateQuestionStep2,
  validateQuestionStep3
];