import { FastifyInstance } from 'fastify';
import { QuestionService, CreateQuestionDto } from '../services/question.service';
import { authMiddleware } from '../middleware/auth';
import { QuestionType } from '../entities/Question';

export async function questionRoutes(fastify: FastifyInstance) {
  const questionService = new QuestionService();

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
