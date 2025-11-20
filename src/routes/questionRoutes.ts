import { Router } from 'express';
import { QuestionController } from '../controllers/questionController';
import { validateCompleteQuestion } from '../middleware/validation';

const router = Router();
const questionController = new QuestionController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       required:
 *         - title
 *         - type
 *         - difficulty
 *         - category
 *         - visibility
 *         - author
 *         - authorEmail
 *         - content
 *         - points
 *         - estimatedTime
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated question ID
 *         title:
 *           type: string
 *           description: Question title
 *           minLength: 5
 *         type:
 *           type: string
 *           enum: [Single Choice MCQ, Multiple Choice, True/False, Descriptive, Match Following]
 *         difficulty:
 *           type: string
 *           enum: [Easy, Medium, Hard]
 *         category:
 *           type: string
 *         visibility:
 *           type: string
 *           enum: [Public, Private, Shared, Draft]
 *         author:
 *           type: string
 *         authorEmail:
 *           type: string
 *           format: email
 *         content:
 *           type: string
 *           minLength: 10
 *         points:
 *           type: number
 *           minimum: 0
 *         estimatedTime:
 *           type: number
 *           minimum: 0
 */

/**
 * @swagger
 * /api/questions:
 *   post:
 *     summary: Create a new question
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       201:
 *         description: Question created successfully
 *       400:
 *         description: Validation error
 */
router.post('/questions', validateCompleteQuestion, questionController.createQuestion);

/**
 * @swagger
 * /api/questions:
 *   get:
 *     summary: Get all questions
 *     tags: [Questions]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Questions retrieved successfully
 */
router.get('/questions', questionController.getQuestions);

/**
 * @swagger
 * /api/questions/stats:
 *   get:
 *     summary: Get question statistics
 *     tags: [Questions]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/questions/stats', questionController.getQuestionStats);

/**
 * @swagger
 * /api/questions/{id}:
 *   get:
 *     summary: Get question by ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question retrieved successfully
 *       404:
 *         description: Question not found
 */
router.get('/questions/:id', questionController.getQuestionById);

/**
 * @swagger
 * /api/questions/{id}:
 *   put:
 *     summary: Update a question
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       404:
 *         description: Question not found
 */
router.put('/questions/:id', questionController.updateQuestion);

/**
 * @swagger
 * /api/questions/{id}:
 *   delete:
 *     summary: Delete a question
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *       404:
 *         description: Question not found
 */
router.delete('/questions/:id', questionController.deleteQuestion);

export default router;