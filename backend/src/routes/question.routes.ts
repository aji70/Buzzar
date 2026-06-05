import { FastifyInstance } from 'fastify';
import { QuestionService, CreateQuestionDto } from '../services/question.service';
import { LLMService, GenerateQuestionsOptions } from '../services/llm.service';
import { authMiddleware } from '../middleware/auth';
import { QuestionType, QuestionDifficulty } from '../entities/Question';

export async function questionRoutes(fastify: FastifyInstance) {
  const questionService = new QuestionService();
  const llmService = new LLMService();

  fastify.post<{ Body: GenerateQuestionsOptions }>('/questions/generate', {
    preHandler: authMiddleware,
    schema: {
      tags: ['Questions'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['category_id', 'number_of_questions'],
        properties: {
          category_id: { type: 'string' },
          number_of_questions: { type: 'integer', minimum: 1, maximum: 50 },
          type: { type: 'string', enum: [...Object.values(QuestionType), null], nullable: true },
          difficulty: { type: 'string', enum: [...Object.values(QuestionDifficulty), null], nullable: true },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            count: { type: 'integer' },
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string' },
                  question: { type: 'string' },
                  answer_options: { type: 'array', items: { type: 'string' } },
                  answer: { type: 'string' },
                  hint: { type: 'string' },
                  image_url: { type: 'string' },
                  difficulty: { type: 'string' },
                  points: { type: 'integer' },
                },
              },
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    try {
      const questions = await llmService.generateQuestions(request.body);
      reply.send({ count: questions.length, questions });
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });

  fastify.post<{ Body: CreateQuestionDto }>('/questions', {
    preHandler: authMiddleware,
    schema: {
      tags: ['Questions'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['type', 'question', 'answer'],
        properties: {
          type: { type: 'string', enum: Object.values(QuestionType) },
          question: { type: 'string' },
          answer: { type: 'string' },
          answerOptions: { type: 'object' },
          imageUrl: { type: 'string' },
          hint: { type: 'string' },
          categoryId: { type: 'string' },
        },
      },
    },
  }, async (request, reply) => {
    try {
      const question = await questionService.create(request.body);
      reply.code(201).send(question);
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });

  fastify.post<{ Body: { questions: CreateQuestionDto[] } }>('/questions/bulk', {
    preHandler: authMiddleware,
    schema: {
      tags: ['Questions'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['questions'],
        properties: {
          questions: {
            type: 'array',
            items: {
              type: 'object',
              required: ['type', 'question', 'answer'],
              properties: {
                type: { type: 'string', enum: Object.values(QuestionType) },
                question: { type: 'string' },
                answer: { type: 'string' },
                answerOptions: { type: 'object' },
                imageUrl: { type: 'string' },
                hint: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    try {
      const questions = await questionService.bulkCreate(request.body.questions);
      reply.code(201).send({ count: questions.length, questions });
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });

  fastify.post('/questions/bulk/csv', {
    preHandler: authMiddleware,
    schema: {
      tags: ['Questions'],
      security: [{ bearerAuth: [] }],
      consumes: ['text/csv'],
    },
  }, async (request, reply) => {
    try {
      const csvContent = await request.body as string;
      const parsed = questionService.parseCsv(csvContent);
      const questions = await questionService.bulkCreate(parsed);
      reply.code(201).send({ count: questions.length, questions });
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });

  fastify.get<{ Querystring: { limit?: number; offset?: number } }>('/questions', {
    preHandler: authMiddleware,
    schema: {
      tags: ['Questions'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'integer', default: 50 },
          offset: { type: 'integer', default: 0 },
        },
      },
    },
  }, async (request, reply) => {
    const { limit = 50, offset = 0 } = request.query;
    const questions = await questionService.findAll(limit, offset);
    reply.send(questions);
  });

  fastify.get<{ Params: { id: string } }>('/questions/:id', {
    preHandler: authMiddleware,
    schema: {
      tags: ['Questions'],
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    try {
      const question = await questionService.findById(request.params.id);
      reply.send(question);
    } catch (error: any) {
      reply.code(404).send({ error: error.message });
    }
  });

  fastify.put<{ Params: { id: string }; Body: Partial<CreateQuestionDto> }>('/questions/:id', {
    preHandler: authMiddleware,
    schema: {
      tags: ['Questions'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: Object.values(QuestionType) },
          question: { type: 'string' },
          answer: { type: 'string' },
          answerOptions: { type: 'object' },
          imageUrl: { type: 'string' },
          hint: { type: 'string' },
        },
      },
    },
  }, async (request, reply) => {
    try {
      const question = await questionService.update(request.params.id, request.body);
      reply.send(question);
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });

  fastify.delete<{ Params: { id: string } }>('/questions/:id', {
    preHandler: authMiddleware,
    schema: {
      tags: ['Questions'],
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    try {
      await questionService.delete(request.params.id);
      reply.code(204).send();
    } catch (error: any) {
      reply.code(404).send({ error: error.message });
    }
  });
}
