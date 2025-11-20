import { Request, Response } from 'express';
import { QuestionService } from '../services/questionService';
import { CreateQuestionRequest, UpdateQuestionRequest, QuestionFilters } from '../types/question';

const questionService = new QuestionService();

export class QuestionController {
  
  async createQuestion(req: Request, res: Response) {
    try {
      const questionData: CreateQuestionRequest = req.body;
      const question = await questionService.createQuestion(questionData);
      res.status(201).json({
        success: true,
        message: 'Question created successfully',
        data: question
      });
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors
        });
      }
      res.status(500).json({
        success: false,
        error: 'Failed to create question'
      });
    }
  }

  async getQuestions(req: Request, res: Response) {
    try {
      const filters: QuestionFilters = {
        category: req.query.category as string,
        difficulty: req.query.difficulty as string,
        visibility: req.query.visibility as string,
        type: req.query.type as string,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
        isPublished: req.query.isPublished ? req.query.isPublished === 'true' : undefined,
        myQuestionsOnly: req.query.myQuestionsOnly === 'true',
        authorEmail: req.query.authorEmail as string
      };

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (page < 1) {
        return res.status(400).json({
          success: false,
          error: 'Page must be greater than 0'
        });
      }

      if (limit < 1 || limit > 100) {
        return res.status(400).json({
          success: false,
          error: 'Limit must be between 1 and 100'
        });
      }

      const result = await questionService.getQuestions(filters, page, limit);
      
      res.json({
        success: true,
        message: 'Questions retrieved successfully',
        data: result.questions,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch questions'
      });
    }
  }

  async getQuestionById(req: Request, res: Response) {
    try {
      const question = await questionService.getQuestionById(req.params.id);
      if (!question) {
        return res.status(404).json({
          success: false,
          error: 'Question not found'
        });
      }
      res.json({
        success: true,
        message: 'Question retrieved successfully',
        data: question
      });
    } catch (error: any) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid question ID format'
        });
      }
      res.status(500).json({
        success: false,
        error: 'Failed to fetch question'
      });
    }
  }

  async updateQuestion(req: Request, res: Response) {
    try {
      const updateData: UpdateQuestionRequest = req.body;
      
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No fields to update'
        });
      }

      const question = await questionService.updateQuestion(req.params.id, updateData);
      if (!question) {
        return res.status(404).json({
          success: false,
          error: 'Question not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Question updated successfully',
        data: question
      });
    } catch (error: any) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid question ID format'
        });
      }
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors
        });
      }
      res.status(500).json({
        success: false,
        error: 'Failed to update question'
      });
    }
  }

  async deleteQuestion(req: Request, res: Response) {
    try {
      const success = await questionService.deleteQuestion(req.params.id);
      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Question not found'
        });
      }
      res.status(200).json({
        success: true,
        message: 'Question deleted successfully'
      });
    } catch (error: any) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid question ID format'
        });
      }
      res.status(500).json({
        success: false,
        error: 'Failed to delete question'
      });
    }
  }

  async getQuestionStats(req: Request, res: Response) {
    try {
      const stats = await questionService.getQuestionStats();
      res.json({
        success: true,
        message: 'Statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch statistics'
      });
    }
  }

  async getCategories(req: Request, res: Response) {
    try {
      const categories = await questionService.getCategories();
      res.json({
        success: true,
        message: 'Categories retrieved successfully',
        data: categories
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch categories'
      });
    }
  }

  async getTags(req: Request, res: Response) {
    try {
      const tags = await questionService.getTags();
      res.json({
        success: true,
        message: 'Tags retrieved successfully',
        data: tags
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch tags'
      });
    }
  }
}