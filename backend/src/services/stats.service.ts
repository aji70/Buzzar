import { AppDataSource } from '../config/database';
import { GameParticipant, ParticipantStatus } from '../entities/GameParticipant';
import { GameMode, GameStatus } from '../entities/GameSession';

export class StatsService {
  private participantRepo = AppDataSource.getRepository(GameParticipant);

  async getHistory(
    userId: string,
    opts: { mode?: GameMode; limit?: number; offset?: number } = {},
  ) {
    const { mode, limit = 20, offset = 0 } = opts;

    const qb = this.participantRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.session', 'session')
      .where('p.userId = :userId', { userId })
      .andWhere('session.status = :status', { status: GameStatus.FINISHED })
      .orderBy('p.joinedAt', 'DESC')
      .take(limit)
      .skip(offset);

    if (mode) qb.andWhere('session.mode = :mode', { mode });

    const [rows, total] = await qb.getManyAndCount();

    return {
      total,
      limit,
      offset,
      games: rows.map(p => ({
        sessionId:   p.sessionId,
        mode:        p.session?.mode,
        status:      p.session?.status,
        score:       p.score,
        position:    p.position,
        rankAchieved: p.rankAchieved,
        totalQuestions: p.session?.totalQuestions,
        playedAt:    p.joinedAt,
      })),
    };
  }

  async getStats(userId: string) {
    const rows = await this.participantRepo
      .createQueryBuilder('p')
      .leftJoin('p.session', 'session')
      .select([
        'session.mode            AS mode',
        'COUNT(*)::int           AS games_played',
        'SUM(CASE WHEN p.position = 1 THEN 1 ELSE 0 END)::int AS wins',
        'MAX(p.score)            AS best_score',
        'ROUND(AVG(p.score))::int AS avg_score',
        'MAX(p.streak)           AS best_streak',
        // accuracy from answers
      ])
      .where('p.userId = :userId', { userId })
      .andWhere('session.status = :status', { status: GameStatus.FINISHED })
      .groupBy('session.mode')
      .getRawMany();

    // Per-mode answer accuracy
    const accuracyRows = await AppDataSource.query(
      `SELECT s.mode,
              COUNT(*)::int                                             AS total_answers,
              SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END)::int       AS correct_answers
       FROM   game_answers a
       JOIN   game_participants p ON p.id = a.participant_id
       JOIN   game_sessions s     ON s.id = p.session_id
       WHERE  p.user_id = $1
         AND  s.status  = 'finished'
       GROUP  BY s.mode`,
      [userId],
    );

    const accuracyByMode: Record<string, { total: number; correct: number }> = {};
    for (const r of accuracyRows) {
      accuracyByMode[r.mode] = { total: r.total_answers, correct: r.correct_answers };
    }

    const byMode = rows.map(r => {
      const acc = accuracyByMode[r.mode] ?? { total: 0, correct: 0 };
      return {
        mode:         r.mode,
        gamesPlayed:  r.games_played,
        wins:         r.wins,
        winRate:      r.games_played > 0 ? +(r.wins / r.games_played * 100).toFixed(1) : 0,
        bestScore:    r.best_score,
        avgScore:     r.avg_score,
        bestStreak:   r.best_streak,
        accuracy:     acc.total > 0 ? +(acc.correct / acc.total * 100).toFixed(1) : 0,
      };
    });

    // Totals across all modes
    const totals = byMode.reduce(
      (acc, m) => ({
        gamesPlayed: acc.gamesPlayed + m.gamesPlayed,
        wins:        acc.wins + m.wins,
      }),
      { gamesPlayed: 0, wins: 0 },
    );

    return { totals, byMode };
  }
}
