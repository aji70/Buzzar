import { FastifyInstance } from 'fastify';
import { EloService } from '../services/elo.service';
import { authMiddleware } from '../middleware/auth';
import { AuthRequest } from '../types';
import { AppDataSource } from '../config/database';
import { Badge } from '../entities/Badge';

export async function rankingRoutes(fastify: FastifyInstance) {
  const svc = new EloService();
  const uid = (req: any) => (req as AuthRequest).user!.id;

  // ── Global leaderboard ────────────────────────────────────────────────────
  fastify.get('/ranking/leaderboard', {
    preHandler: authMiddleware,
    schema: {
      tags: ['Ranking'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          limit:  { type: 'integer', minimum: 1, maximum: 100, default: 50 },
          offset: { type: 'integer', minimum: 0, default: 0 },
        },
      },
    },
  }, async (req: any, reply) => {
    const { limit = 50, offset = 0 } = req.query as any;
    const rows = await svc.getGlobalLeaderboard(limit, offset);
    reply.send(rows.map((e, i) => ({
      rank:        offset + i + 1,
      userId:      e.userId,
      name:        (e.user as any)?.name ?? (e.user as any)?.email,
      rating:      e.rating,
      gamesPlayed: e.gamesPlayed,
      wins:        e.wins,
    })));
  });

  // ── My ELO + badges ───────────────────────────────────────────────────────
  fastify.get('/ranking/me', {
    preHandler: authMiddleware,
    schema: { tags: ['Ranking'], security: [{ bearerAuth: [] }] },
  }, async (req, reply) => {
    reply.send(await svc.getUserProfile(uid(req)));
  });

  // ── Any user's ELO + badges ───────────────────────────────────────────────
  fastify.get<{ Params: { userId: string } }>('/ranking/users/:userId', {
    preHandler: authMiddleware,
    schema: { tags: ['Ranking'], security: [{ bearerAuth: [] }] },
  }, async (req, reply) => {
    try {
      reply.send(await svc.getUserProfile(req.params.userId));
    } catch (e: any) { reply.code(404).send({ error: e.message }); }
  });

  // ── All badge definitions ─────────────────────────────────────────────────
  fastify.get('/ranking/badges', {
    preHandler: authMiddleware,
    schema: { tags: ['Ranking'], security: [{ bearerAuth: [] }] },
  }, async (_req, reply) => {
    const badges = await AppDataSource.getRepository(Badge).find({ order: { createdAt: 'ASC' } });
    reply.send(badges);
  });
}
