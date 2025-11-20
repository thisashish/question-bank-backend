import Question, { IQuestion } from '../models/Question';
import { CreateQuestionRequest, UpdateQuestionRequest, QuestionFilters } from '../types/question';

export class QuestionService {
  async createQuestion(questionData: CreateQuestionRequest): Promise<IQuestion> {
    const question = new Question(questionData);
    return await question.save();
  }

  async getQuestions(filters: QuestionFilters, page: number = 1, limit: number = 10): Promise<{ questions: IQuestion[]; total: number }> {
    const query: any = {};
    
    if (filters.category) query.category = filters.category;
    if (filters.difficulty) query.difficulty = filters.difficulty;
    if (filters.visibility) query.visibility = filters.visibility;
    if (filters.type) query.type = filters.type;
    if (filters.tags && filters.tags.length > 0) query.tags = { $in: filters.tags };
    if (filters.isPublished !== undefined) query.isPublished = filters.isPublished;
    
    if (filters.myQuestionsOnly && filters.authorEmail) {
      query.authorEmail = filters.authorEmail;
    }

    const skip = (page - 1) * limit;
    
    const [questions, total] = await Promise.all([
      Question.find(query)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Question.countDocuments(query)
    ]);

    return { questions, total };
  }

  async getQuestionById(id: string): Promise<IQuestion | null> {
    return await Question.findById(id);
  }

  async updateQuestion(id: string, updateData: UpdateQuestionRequest): Promise<IQuestion | null> {
    const updateWithTimestamp = {
      ...updateData,
      updatedAt: new Date()
    };
    
    return await Question.findByIdAndUpdate(id, updateWithTimestamp, { 
      new: true,
      runValidators: true 
    });
  }

  async deleteQuestion(id: string): Promise<boolean> {
    const result = await Question.findByIdAndDelete(id);
    return result !== null;
  }

  async getQuestionStats(): Promise<{ total: number; published: number; draft: number }> {
    const [total, published, draft] = await Promise.all([
      Question.countDocuments(),
      Question.countDocuments({ isPublished: true }),
      Question.countDocuments({ isPublished: false })
    ]);

    return { total, published, draft };
  }

  async getCategories(): Promise<string[]> {
    const categories = await Question.distinct('category');
    return categories.filter(category => category !== null && category !== '');
  }

  async getTags(): Promise<string[]> {
    const tags = await Question.distinct('tags');
    return tags.filter(tag => tag !== null && tag !== '');
  }

  async getQuestionsByAuthor(email: string): Promise<IQuestion[]> {
    return await Question.find({ authorEmail: email })
      .sort({ updatedAt: -1 })
      .exec();
  }

  async publishQuestion(id: string): Promise<IQuestion | null> {
    return await Question.findByIdAndUpdate(
      id, 
      { 
        isPublished: true,
        updatedAt: new Date()
      }, 
      { new: true }
    );
  }

  async unpublishQuestion(id: string): Promise<IQuestion | null> {
    return await Question.findByIdAndUpdate(
      id, 
      { 
        isPublished: false,
        updatedAt: new Date()
      }, 
      { new: true }
    );
  }
}