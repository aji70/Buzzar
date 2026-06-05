import { FastifyInstance } from 'fastify';
import { GameService } from '../services/game.service';
import { StatsService } from '../services/stats.service';
import { GameMode } from '../entities/GameSession';
import { QuestionDifficulty, QuestionType } from '../entities/Question';
import { authMiddleware } from '../middleware/auth';
import { AuthRequest } from '../types';

interface CreateGameBody {
  mode: GameMode;
  categoryId?: string;
  totalQuestions?: number;
  timePerQuestion?: number;
  maxPlayers?: number;
  difficulty?: QuestionDifficulty;
  type?: QuestionType;
}

export async function gameRoutes(fastify: FastifyInstance) {
  const svc = new GameService();
  const stats = new StatsService();

  const uid = (req: any) => (req as AuthRequest).user!.id;

  // ── Create session ────────────────────────────────────────────────────────
  fastify.post<{ Body: CreateGameBody }>('/games', {
    preHandler: authMiddleware,
    schema: {
      tags: ['Games'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['mode'],
        properties: {
          mode: { type: 'string', enum: Object.values(GameMode) },
          categoryId: { type: 'string' },
          totalQuestions: { type: 'integer', minimum: 1, maximum: 50, default: 10 },
          timePerQuestion: { type: 'integer', minimum: 5, maximum: 120, default: 30 },
          maxPlayers: { type: 'integer', minimum: 2, maximum: 50 },
          difficulty: { type: 'string', enum: Object.values(QuestionDifficulty) },
          type: { type: 'string', enum: Object.values(QuestionType) },
        },
      },
    },
  }, async (req, reply) => {
    try {
      const session = await svc.createSession({
        mode: req.body.mode,
        categoryId: req.body.categoryId,
        totalQuestions: req.body.totalQuestions,
        timePerQuestion: req.body.timePerQuestion,
        maxPlayers: req.body.maxPlayers,
        difficulty: req.body.difficulty,
        type: req.body.type,
        hostId: uid(req),
      });
      reply.code(201).send(session);
    } catch (e: any) { reply.code(400).send({ error: e.message }); }
  });

  // ── Join by code ──────────────────────────────────────────────────────────
  fastify.post<{ Body: { joinCode: string } }>('/games/join', {
    preHandler: authMiddleware,
    schema: {
      tags: ['Games'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['joinCode'],
        properties: { joinCode: { type: 'string' } },
      },
    },
  }, async (req, reply) => {
    try {
      const participant = await svc.joinByCode(req.body.joinCode.toUpperCase(), uid(req));
      reply.send(participant);
    } catch (e: any) { reply.code(400).send({ error: e.message }); }
  });

  // ── Start session ─────────────────────────────────────────────────────────
  fastify.post<{ Params: { id: string } }>('/games/:id/start', {
    preHandler: authMiddleware,
    schema: { tags: ['Games'], security: [{ bearerAuth: [] }] },
  }, async (req, reply) => {
    try {
      reply.send(await svc.startSession(req.params.id, uid(req)));
    } catch (e: any) { reply.code(400).send({ error: e.message }); }
  });

  // ── Get session state ─────────────────────────────────────────────────────
  fastify.get<{ Params: { id: string } }>('/games/:id', {
    preHandler: authMiddleware,
    schema: { tags: ['Games'], security: [{ bearerAuth: [] }] },
  }, async (req, reply) => {
    try {
      reply.send(await svc.getSessionState(req.params.id));
    } catch (e: any) { reply.code(404).send({ error: e.message }); }
  });

  // ── Get current question ──────────────────────────────────────────────────
  fastify.get<{ Params: { id: string } }>('/games/:id/question', {
    preHandler: authMiddleware,
    schema: { tags: ['Games'], security: [{ bearerAuth: [] }] },
  }, async (req, reply) => {
    try {
      reply.send(await svc.getCurrentQuestion(req.params.id, uid(req)));
    } catch (e: any) { reply.code(400).send({ error: e.message }); }
  });

  // ── Submit answer ─────────────────────────────────────────────────────────
  fastify.post<{ Params: { id: string }; Body: { answer: string } }>('/games/:id/answer', {
    preHandler: authMiddleware,
    schema: {
      tags: ['Games'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['answer'],
        properties: { answer: { type: 'string' } },
      },
    },
  }, async (req, reply) => {
    try {
      reply.send(await svc.submitAnswer(req.params.id, uid(req), req.body.answer));
    } catch (e: any) { reply.code(400).send({ error: e.message }); }
  });

  // ── Advance question (host) ───────────────────────────────────────────────
  fastify.post<{ Params: { id: string } }>('/games/:id/next', {
    preHandler: authMiddleware,
    schema: { tags: ['Games'], security: [{ bearerAuth: [] }] },
  }, async (req, reply) => {
    try {
      reply.send(await svc.advanceQuestion(req.params.id, uid(req)));
    } catch (e: any) { reply.code(400).send({ error: e.message }); }
  });

  // ── Results / leaderboard ─────────────────────────────────────────────────
  fastify.get<{ Params: { id: string } }>('/games/:id/results', {
    preHandler: authMiddleware,
    schema: { tags: ['Games'], security: [{ bearerAuth: [] }] },
  }, async (req, reply) => {
    try {
      reply.send(await svc.getResults(req.params.id));
    } catch (e: any) { reply.code(404).send({ error: e.message }); }
  });

  // ── Cancel session (host) ─────────────────────────────────────────────────
  fastify.delete<{ Params: { id: string } }>('/games/:id', {
    preHandler: authMiddleware,
    schema: { tags: ['Games'], security: [{ bearerAuth: [] }] },
  }, async (req, reply) => {
    try {
      reply.send(await svc.cancelSession(req.params.id, uid(req)));
    } catch (e: any) { reply.code(400).send({ error: e.message }); }
  });

  // ── Leave session ─────────────────────────────────────────────────────────
  fastify.post<{ Params: { id: string } }>('/games/:id/leave', {
    preHandler: authMiddleware,
    schema: { tags: ['Games'], security: [{ bearerAuth: [] }] },
  }, async (req, reply) => {
    try {
      reply.send(await svc.leaveSession(req.params.id, uid(req)));
    } catch (e: any) { reply.code(400).send({ error: e.message }); }
  });

  // ── My game history ───────────────────────────────────────────────────────
  fastify.get('/games', {
    preHandler: authMiddleware,
    schema: { tags: ['Games'], security: [{ bearerAuth: [] }] },
  }, async (req, reply) => {
    reply.send(await svc.getUserSessions(uid(req)));
  });

  // ── History (paginated, filterable by mode) ───────────────────────────────
  fastify.get('/games/history', {
    preHandler: authMiddleware,
    schema: {
      tags: ['Games'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          mode:   { type: 'string', enum: Object.values(GameMode) },
          limit:  { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          offset: { type: 'integer', minimum: 0, default: 0 },
        },
      },
    },
  }, async (req: any, reply) => {
    const { mode, limit, offset } = req.query as any;
    reply.send(await stats.getHistory(uid(req), { mode, limit, offset }));
  });

  // ── Aggregated stats ──────────────────────────────────────────────────────
  fastify.get('/games/stats', {
    preHandler: authMiddleware,
    schema: { tags: ['Games'], security: [{ bearerAuth: [] }] },
  }, async (req, reply) => {
    reply.send(await stats.getStats(uid(req)));
  });

  // ── Another user's history (public) ──────────────────────────────────────
  fastify.get<{ Params: { userId: string } }>('/games/history/:userId', {
    preHandler: authMiddleware,
    schema: {
      tags: ['Games'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          mode:   { type: 'string', enum: Object.values(GameMode) },
          limit:  { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          offset: { type: 'integer', minimum: 0, default: 0 },
        },
      },
    },
  }, async (req: any, reply) => {
    const { mode, limit, offset } = req.query as any;
    reply.send(await stats.getHistory(req.params.userId, { mode, limit, offset }));
  });

  // ── Another user's stats (public) ────────────────────────────────────────
  fastify.get<{ Params: { userId: string } }>('/games/stats/:userId', {
    preHandler: authMiddleware,
    schema: { tags: ['Games'], security: [{ bearerAuth: [] }] },
  }, async (req, reply) => {
    reply.send(await stats.getStats(req.params.userId));
  });
}
