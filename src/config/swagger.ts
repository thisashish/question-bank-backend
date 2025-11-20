import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Question Bank API',
      version: '1.0.0',
      description: 'API for managing exam questions and question bank with multi-step form support',
      contact: {
        name: 'API Support',
        email: 'support@questionbank.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://question-bank-backend-wxs3.onrender.com',
        description: 'Production server'
      }
    ],
    components: {
      schemas: {
        Question: {
          type: 'object',
          required: [
            'title', 
            'type', 
            'difficulty', 
            'category', 
            'visibility', 
            'author', 
            'authorEmail', 
            'content',
            'points',
            'estimatedTime'
          ],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated question ID',
              example: '650a1b2c5f8d7c001a8b4567'
            },
            title: {
              type: 'string',
              description: 'Question title (min 5 characters)',
              example: 'Basic Algebra Problem',
              minLength: 5
            },
            type: {
              type: 'string',
              enum: ['Single Choice MCQ', 'Multiple Choice', 'True/False', 'Descriptive', 'Match Following'],
              description: 'Type of question'
            },
            difficulty: {
              type: 'string',
              enum: ['Easy', 'Medium', 'Hard'],
              description: 'Difficulty level'
            },
            category: {
              type: 'string',
              description: 'Question category',
              example: 'Mathematics'
            },
            visibility: {
              type: 'string',
              enum: ['Public', 'Private', 'Shared', 'Draft'],
              description: 'Visibility setting'
            },
            author: {
              type: 'string',
              description: 'Author name',
              example: 'John Doe'
            },
            authorEmail: {
              type: 'string',
              format: 'email',
              description: 'Author email',
              example: 'john.doe@example.com'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Question tags',
              example: ['algebra', 'equations']
            },
            content: {
              type: 'string',
              description: 'Question content (min 10 characters)',
              example: 'Solve for x: 2x + 5 = 15',
              minLength: 10
            },
            options: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Answer options for MCQ',
              example: ['x = 5', 'x = 10', 'x = 7.5', 'x = 2.5']
            },
            matchPairs: {
              type: 'array',
              description: 'Match pairs for Match Following questions',
              items: {
                type: 'object',
                properties: {
                  columnA: {
                    type: 'string',
                    example: 'Force'
                  },
                  columnB: {
                    type: 'string',
                    example: 'Mass times acceleration'
                  }
                }
              }
            },
            correctAnswer: {
              type: 'string',
              description: 'Correct answer for single choice questions',
              example: 'x = 5'
            },
            correctMatches: {
              type: 'object',
              description: 'Correct matches for Match Following questions',
              example: {
                "1": "A",
                "2": "B"
              }
            },
            points: {
              type: 'number',
              description: 'Points for the question',
              example: 1,
              minimum: 0
            },
            estimatedTime: {
              type: 'number',
              description: 'Estimated time in minutes',
              example: 5,
              minimum: 0
            },
            negativeMarks: {
              type: 'number',
              description: 'Negative marks for wrong answer',
              example: 0.5,
              minimum: 0
            },
            explanation: {
              type: 'string',
              description: 'Explanation for the correct answer',
              example: 'To solve 2x + 5 = 15, subtract 5 from both sides and then divide by 2.'
            },
            authorNotes: {
              type: 'string',
              description: 'Notes for other authors or reviewers',
              example: 'This question tests basic algebraic manipulation skills.'
            },
            isPublished: {
              type: 'boolean',
              description: 'Publication status',
              default: false
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        QuestionList: {
          type: 'object',
          properties: {
            questions: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Question'
              }
            },
            total: {
              type: 'integer',
              description: 'Total number of questions',
              example: 25
            }
          }
        },
        QuestionStats: {
          type: 'object',
          properties: {
            total: {
              type: 'integer',
              description: 'Total questions count',
              example: 25
            },
            published: {
              type: 'integer',
              description: 'Published questions count',
              example: 15
            },
            draft: {
              type: 'integer',
              description: 'Draft questions count',
              example: 10
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      },
      parameters: {
        QuestionId: {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'Question ID',
          example: '650a1b2c5f8d7c001a8b4567'
        },
        Page: {
          in: 'query',
          name: 'page',
          schema: {
            type: 'integer',
            default: 1,
            minimum: 1
          },
          description: 'Page number for pagination'
        },
        Limit: {
          in: 'query',
          name: 'limit',
          schema: {
            type: 'integer',
            default: 10,
            minimum: 1,
            maximum: 100
          },
          description: 'Number of items per page'
        },
        Category: {
          in: 'query',
          name: 'category',
          schema: {
            type: 'string'
          },
          description: 'Filter by category',
          example: 'Mathematics'
        },
        Difficulty: {
          in: 'query',
          name: 'difficulty',
          schema: {
            type: 'string',
            enum: ['Easy', 'Medium', 'Hard']
          },
          description: 'Filter by difficulty level'
        },
        Visibility: {
          in: 'query',
          name: 'visibility',
          schema: {
            type: 'string',
            enum: ['Public', 'Private', 'Shared', 'Draft']
          },
          description: 'Filter by visibility'
        },
        QuestionType: {
          in: 'query',
          name: 'type',
          schema: {
            type: 'string',
            enum: ['Single Choice MCQ', 'Multiple Choice', 'True/False', 'Descriptive', 'Match Following']
          },
          description: 'Filter by question type'
        },
        Tags: {
          in: 'query',
          name: 'tags',
          schema: {
            type: 'string'
          },
          description: 'Comma-separated tags for filtering',
          example: 'algebra,equations'
        },
        IsPublished: {
          in: 'query',
          name: 'isPublished',
          schema: {
            type: 'boolean'
          },
          description: 'Filter by publication status'
        },
        MyQuestionsOnly: {
          in: 'query',
          name: 'myQuestionsOnly',
          schema: {
            type: 'boolean'
          },
          description: 'Show only questions created by the current user'
        },
        AuthorEmail: {
          in: 'query',
          name: 'authorEmail',
          schema: {
            type: 'string',
            format: 'email'
          },
          description: 'Author email for filtering (required when myQuestionsOnly is true)'
        }
      },
      responses: {
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              examples: {
                titleTooShort: {
                  summary: 'Title too short',
                  value: {
                    error: 'Question title must be at least 5 characters long'
                  }
                },
                contentTooShort: {
                  summary: 'Content too short',
                  value: {
                    error: 'Question content must be at least 10 characters long'
                  }
                }
              }
            }
          }
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: 'Question not found'
              }
            }
          }
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: 'Internal server error'
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Question Bank API Documentation'
  }));
};