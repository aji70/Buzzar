import { FastifyInstance } from 'fastify';
import { CategoryService, CreateCategoryDto } from '../services/category.service';
import { authMiddleware } from '../middleware/auth';

const categoryBodySchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    imageUrl: { type: 'string' },
    order: { type: 'integer', default: 0 },
    isActive: { type: 'boolean', default: true },
    parentId: { type: 'string' },
  },
};

export async function categoryRoutes(fastify: FastifyInstance) {
  const categoryService = new CategoryService();

  fastify.post<{ Body: CreateCategoryDto }>('/categories', {
    preHandler: authMiddleware,
    schema: {
      tags: ['Categories'],
      security: [{ bearerAuth: [] }],
      body: { ...categoryBodySchema, required: ['title'] },
    },
  }, async (request, reply) => {
    try {
      reply.code(201).send(await categoryService.create(request.body));
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });

  fastify.get('/categories', {
    preHandler: authMiddleware,
    schema: {
      tags: ['Categories'],
      security: [{ bearerAuth: [] }],
      description: 'Returns all root categories with nested subcategories (3 levels deep)',
    },
  }, async (request, reply) => {
    reply.send(await categoryService.findAll());
  });

  fastify.get<{ Params: { id: string } }>('/categories/:id', {
    preHandler: authMiddleware,
    schema: { tags: ['Categories'], security: [{ bearerAuth: [] }] },
  }, async (request, reply) => {
    try {
      reply.send(await categoryService.findById(request.params.id));
    } catch (error: any) {
      reply.code(404).send({ error: error.message });
    }
  });

  fastify.get<{ Params: { slug: string } }>('/categories/slug/:slug', {
    preHandler: authMiddleware,
    schema: { tags: ['Categories'], security: [{ bearerAuth: [] }] },
  }, async (request, reply) => {
    try {
      reply.send(await categoryService.findBySlug(request.params.slug));
    } catch (error: any) {
      reply.code(404).send({ error: error.message });
    }
  });

  fastify.put<{ Params: { id: string }; Body: Partial<CreateCategoryDto> }>('/categories/:id', {
    preHandler: authMiddleware,
    schema: {
      tags: ['Categories'],
      security: [{ bearerAuth: [] }],
      body: categoryBodySchema,
    },
  }, async (request, reply) => {
    try {
      reply.send(await categoryService.update(request.params.id, request.body));
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });

  fastify.delete<{ Params: { id: string } }>('/categories/:id', {
    preHandler: authMiddleware,
    schema: { tags: ['Categories'], security: [{ bearerAuth: [] }] },
  }, async (request, reply) => {
    try {
      await categoryService.delete(request.params.id);
      reply.code(204).send();
    } catch (error: any) {
      reply.code(404).send({ error: error.message });
    }
  });
}
