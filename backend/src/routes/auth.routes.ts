import { FastifyInstance } from 'fastify';
import { AuthService } from '../services/auth.service';
import { authMiddleware } from '../middleware/auth';
import { AuthRequest, RegisterBody, LoginBody, UpdateProfileBody, ChangePasswordBody } from '../types';

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService();

  fastify.post<{ Body: RegisterBody }>('/register', {
    schema: {
      tags: ['Auth'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          name: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string', nullable: true },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
              },
            },
            token: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    try {
      const { email, password, name } = request.body;
      const result = await authService.register(email, password, name);
      reply.send(result);
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });

  fastify.post<{ Body: LoginBody }>('/login', {
    schema: {
      tags: ['Auth'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string', nullable: true },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
              },
            },
            token: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    try {
      const { email, password } = request.body;
      const result = await authService.login(email, password);
      reply.send(result);
    } catch (error: any) {
      reply.code(401).send({ error: error.message });
    }
  });

  fastify.post('/logout', {
    preHandler: authMiddleware,
    schema: {
      tags: ['Auth'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const token = request.headers.authorization?.substring(7) || '';
    await authService.logout(token);
    reply.send({ message: 'Logged out successfully' });
  });

  fastify.get('/profile', {
    preHandler: authMiddleware,
    schema: {
      tags: ['Auth'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string', nullable: true },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    try {
      const userId = (request as AuthRequest).user!.id;
      const profile = await authService.getProfile(userId);
      reply.send(profile);
    } catch (error: any) {
      reply.code(404).send({ error: error.message });
    }
  });

  fastify.put<{ Body: UpdateProfileBody }>('/profile', {
    preHandler: authMiddleware,
    schema: {
      tags: ['Auth'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string', nullable: true },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    try {
      const userId = (request as AuthRequest).user!.id;
      const { name, email } = request.body;
      const updated = await authService.updateProfile(userId, name, email);
      reply.send(updated);
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });

  fastify.post<{ Body: ChangePasswordBody }>('/change-password', {
    preHandler: authMiddleware,
    schema: {
      tags: ['Auth'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['currentPassword', 'newPassword'],
        properties: {
          currentPassword: { type: 'string' },
          newPassword: { type: 'string', minLength: 6 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    try {
      const userId = (request as AuthRequest).user!.id;
      const { currentPassword, newPassword } = request.body;
      await authService.changePassword(userId, currentPassword, newPassword);
      reply.send({ message: 'Password changed successfully' });
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  });
}
