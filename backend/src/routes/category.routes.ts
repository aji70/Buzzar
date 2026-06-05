import { FastifyInstance } from 'fastify';
import { CategoryService, CreateCategoryDto } from '../services/category.service';
import { authMiddleware } from '../middleware/auth';
import { redis } from '../config/redis';

const TREE_CACHE_KEY = 'categories:tree';
const TREE_CACHE_TTL = 60 * 60 * 24; // 24 hours

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

  // Public tree endpoint with 24h Redis cache
  fastify.get('/categories/tree', {
    schema: {
      tags: ['Categories'],
      description: 'Full category hierarchy (category > subcategory > children). Cached 24h.',
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              slug: { type: 'string' },
              description: { type: 'string', nullable: true },
              imageUrl: { type: 'string', nullable: true },
              order: { type: 'integer' },
              isActive: { type: 'boolean' },
              children: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    slug: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    imageUrl: { type: 'string', nullable: true },
                    order: { type: 'integer' },
                    isActive: { type: 'boolean' },
                    children: { type: 'array', items: { type: 'object', additionalProperties: true } },
                  },
                },
              },
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    const cached = await redis.get(TREE_CACHE_KEY);
    if (cached) {
      return reply.header('X-Cache', 'HIT').send(JSON.parse(cached));
    }
    const tree = await categoryService.findAll();
    await redis.setex(TREE_CACHE_KEY, TREE_CACHE_TTL, JSON.stringify(tree));
    reply.header('X-Cache', 'MISS').send(tree);
  });

  fastify.post<{ Body: CreateCategoryDto }>('/categories', {
    preHandler: authMiddleware,
    schema: {
      tags: ['Categories'],
      security: [{ bearerAuth: [] }],
      body: { ...categoryBodySchema, required: ['title'] },
    },
  }, async (request, reply) => {
    try {
      const result = await categoryService.create(request.body);
      await redis.del(TREE_CACHE_KEY);
      reply.code(201).send(result);
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });

  fastify.get('/categories', {
    preHandler: authMiddleware,
    schema: { tags: ['Categories'], security: [{ bearerAuth: [] }] },
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
      const result = await categoryService.update(request.params.id, request.body);
      await redis.del(TREE_CACHE_KEY);
      reply.send(result);
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
      await redis.del(TREE_CACHE_KEY);
      reply.code(204).send();
    } catch (error: any) {
      reply.code(404).send({ error: error.message });
    }
  });
}
