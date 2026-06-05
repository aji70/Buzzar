import 'dotenv/config';
import 'reflect-metadata';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { AppDataSource } from './config/database';
import { redis } from './config/redis';
import { env } from './config/env';
import { authRoutes } from './routes/auth.routes';
import { questionRoutes } from './routes/question.routes';
import { categoryRoutes } from './routes/category.routes';
import { gameRoutes } from './routes/game.routes';
import { rankingRoutes } from './routes/ranking.routes';
import { seedBadges } from './seeders/badge.seeder';

const fastify = Fastify({ logger: true });

async function start() {
  try {
    // Initialize database
    await AppDataSource.initialize();
    console.log('Database connected');

    // Seed badges (idempotent)
    await seedBadges();

    // Register plugins
    await fastify.register(cors);

    await fastify.register(swagger, {
      openapi: {
        info: {
          title: 'Buzzar API',
          version: '1.0.0',
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
    });

    await fastify.register(swaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: false,
      },
    });

    // Register routes
    await fastify.register(authRoutes, { prefix: '/api/auth' });
    await fastify.register(questionRoutes, { prefix: '/api' });
    await fastify.register(categoryRoutes, { prefix: '/api' });
    await fastify.register(gameRoutes, { prefix: '/api' });
    await fastify.register(rankingRoutes, { prefix: '/api' });

    // Health check
    fastify.get('/health', async () => ({ status: 'ok' }));

    // Start server
    await fastify.listen({ port: env.port, host: '0.0.0.0' });
    console.log(`Server running on port ${env.port}`);
    console.log(`Swagger docs available at http://localhost:${env.port}/docs`);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  await fastify.close();
  await AppDataSource.destroy();
  await redis.quit();
  process.exit(0);
});

start();
