import { AppDataSource } from '../config/database';
import { UserElo } from '../entities/UserElo';
import { Badge } from '../entities/Badge';
import { UserBadge } from '../entities/UserBadge';

// ── ELO constants ─────────────────────────────────────────────────────────────
const K = 32;          // K-factor
const BASE_ELO = 1000; // Starting rating

/** Expected score for player A against player B */
function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

/**
 * Calculate new ELO ratings for a finished Hive Master game.
 * Positions are 1-indexed; lower position = better.
 * We use pairwise comparison (each player vs every other player).
 */
export function calculateEloChanges(
  players: { userId: string; rating: number; position: number }[],
): Record<string, number> {
  const deltas: Record<string, number> = {};
  players.forEach(p => (deltas[p.userId] = 0));

  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const a = players[i];
      const b = players[j];
      const actualA = a.position < b.position ? 1 : a.position === b.position ? 0.5 : 0;
      const actualB = 1 - actualA;
      const expA = expectedScore(a.rating, b.rating);
      const expB = expectedScore(b.rating, a.rating);
      deltas[a.userId] += K * (actualA - expA);
      deltas[b.userId] += K * (actualB - expB);
    }
  }

  // Round to integers, floor at -50 per game to prevent freefall
  return Object.fromEntries(
    Object.entries(deltas).map(([id, d]) => [id, Math.max(-50, Math.round(d))]),
  );
}

// ── Badge trigger rules ───────────────────────────────────────────────────────
interface BadgeTrigger {
  key: string;
  check: (elo: UserElo) => boolean;
}

const BADGE_TRIGGERS: BadgeTrigger[] = [
  { key: 'first_game',     check: e => e.gamesPlayed >= 1 },
  { key: 'first_win',      check: e => e.wins >= 1 },
  { key: 'wins_5',         check: e => e.wins >= 5 },
  { key: 'wins_25',        check: e => e.wins >= 25 },
  { key: 'wins_100',       check: e => e.wins >= 100 },
  { key: 'elo_1200',       check: e => e.rating >= 1200 },
  { key: 'elo_1500',       check: e => e.rating >= 1500 },
  { key: 'elo_2000',       check: e => e.rating >= 2000 },
  { key: 'games_10',       check: e => e.gamesPlayed >= 10 },
  { key: 'games_50',       check: e => e.gamesPlayed >= 50 },
];

// ── Service ───────────────────────────────────────────────────────────────────
export class EloService {
  private eloRepo       = AppDataSource.getRepository(UserElo);
  private badgeRepo     = AppDataSource.getRepository(Badge);
  private userBadgeRepo = AppDataSource.getRepository(UserBadge);

  /** Get or create ELO record for a user */
  async getOrCreate(userId: string): Promise<UserElo> {
    let elo = await this.eloRepo.findOne({ where: { userId } });
    if (!elo) {
      elo = this.eloRepo.create({ userId, rating: BASE_ELO });
      await this.eloRepo.save(elo);
    }
    return elo;
  }

  /**
   * Process ELO updates for a finished Hive Master session.
   * Returns map of userId → { newRating, delta, badgesEarned }
   */
  async processGameResult(
    results: { userId: string; position: number }[],
  ): Promise<Record<string, { newRating: number; delta: number; badgesEarned: string[] }>> {
    // Load / create ELO records
    const eloMap: Record<string, UserElo> = {};
    for (const r of results) {
      eloMap[r.userId] = await this.getOrCreate(r.userId);
    }

    const players = results.map(r => ({
      userId: r.userId,
      rating: eloMap[r.userId].rating,
      position: r.position,
    }));

    const deltas = calculateEloChanges(players);
    const output: Record<string, { newRating: number; delta: number; badgesEarned: string[] }> = {};

    for (const r of results) {
      const elo = eloMap[r.userId];
      const delta = deltas[r.userId];
      elo.rating = Math.max(100, elo.rating + delta); // floor at 100
      elo.gamesPlayed += 1;
      if (r.position === 1) elo.wins += 1;
      await this.eloRepo.save(elo);

      const earned = await this.checkAndAwardBadges(elo);
      output[r.userId] = { newRating: elo.rating, delta, badgesEarned: earned };
    }

    return output;
  }

  /** Check badge triggers and award any not yet earned. Returns newly earned badge keys. */
  async checkAndAwardBadges(elo: UserElo): Promise<string[]> {
    const triggered = BADGE_TRIGGERS.filter(t => t.check(elo)).map(t => t.key);
    if (triggered.length === 0) return [];

    // Get already-earned badges for this user
    const existing = await this.userBadgeRepo.find({
      where: { userId: elo.userId },
      relations: ['badge'],
    });
    const alreadyHas = new Set(existing.map(ub => ub.badge.key));

    const toAward = triggered.filter(k => !alreadyHas.has(k));
    if (toAward.length === 0) return [];

    const badges = await this.badgeRepo.find();
    const badgeByKey = Object.fromEntries(badges.map(b => [b.key, b]));

    const newUserBadges = toAward
      .filter(k => badgeByKey[k])
      .map(k => this.userBadgeRepo.create({ userId: elo.userId, badgeId: badgeByKey[k].id }));

    if (newUserBadges.length > 0) {
      await this.userBadgeRepo.save(newUserBadges);
    }

    return toAward.filter(k => badgeByKey[k]);
  }

  // ── Leaderboard ─────────────────────────────────────────────────────────────

  async getGlobalLeaderboard(limit = 100, offset = 0) {
    return this.eloRepo.find({
      relations: ['user'],
      order: { rating: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async getUserRank(userId: string): Promise<number | null> {
    const elo = await this.eloRepo.findOne({ where: { userId } });
    if (!elo) return null;
    const above = await this.eloRepo.count({
      where: {},
    });
    // Use raw query for rank position
    const result = await AppDataSource.getRepository(UserElo)
      .createQueryBuilder('e')
      .where('e.rating > :r OR (e.rating = :r AND e.userId < :uid)', { r: elo.rating, uid: userId })
      .getCount();
    return result + 1;
  }

  async getUserProfile(userId: string) {
    const elo = await this.getOrCreate(userId);
    const rank = await this.getUserRank(userId);
    const badges = await this.userBadgeRepo.find({
      where: { userId },
      relations: ['badge'],
      order: { earnedAt: 'DESC' },
    });
    return { elo, rank, badges };
  }
}
