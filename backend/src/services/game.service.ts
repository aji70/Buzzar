import { AppDataSource } from '../config/database';
import { GameSession, GameMode, GameStatus, HiveMasterRank } from '../entities/GameSession';
import { GameParticipant, ParticipantStatus } from '../entities/GameParticipant';
import { GameAnswer } from '../entities/GameAnswer';
import { Question, QuestionType, QuestionDifficulty } from '../entities/Question';
import { EloService } from './elo.service';
import { LLMService } from './llm.service';

// ─── Scoring constants ────────────────────────────────────────────────────────
const BASE_POINTS = { easy: 1, medium: 2, hard: 3 };
const STREAK_MULTIPLIER = (streak: number) => streak >= 5 ? 3 : streak >= 3 ? 2 : 1;
// Speed bonus: up to 50% extra for answering in first 20% of allowed time
const speedBonus = (responseMs: number, timeLimitMs: number) =>
  responseMs <= timeLimitMs * 0.2 ? 0.5 : responseMs <= timeLimitMs * 0.5 ? 0.25 : 0;

// ─── Rank thresholds (Hive Master mode) ──────────────────────────────────────
const RANK_THRESHOLDS = [
  { min: 0,   rank: HiveMasterRank.WORKER_BEE },
  { min: 20,  rank: HiveMasterRank.SCOUT_BEE },
  { min: 50,  rank: HiveMasterRank.GUARD_BEE },
  { min: 100, rank: HiveMasterRank.QUEENS_ASSISTANT },
  { min: 200, rank: HiveMasterRank.HIVE_MASTER },
];

function resolveRank(score: number): HiveMasterRank {
  return [...RANK_THRESHOLDS].reverse().find(t => score >= t.min)!.rank;
}

function generateJoinCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * Always generate fresh questions via LLM, persist them, and return their IDs.
 */
async function resolveQuestions(
  categoryId: string | null,
  total: number,
  difficulty: QuestionDifficulty | null,
  type: QuestionType | null,
): Promise<string[]> {
  if (!categoryId) {
    throw new Error('A categoryId is required to generate questions for a game.');
  }

  const llm = new LLMService();
  const generated = await llm.generateQuestions({
    category_id: categoryId,
    number_of_questions: total,
    type,
    difficulty,
  });

  const qRepo = AppDataSource.getRepository(Question);
  const saved = await qRepo.save(
    generated.map(g =>
      qRepo.create({
        type:          g.type,
        question:      g.question,
        answer:        g.answer,
        answerOptions: g.answer_options
          ? Object.fromEntries(g.answer_options.map((o, i) => [String.fromCharCode(65 + i), o]))
          : null,
        imageUrl:   g.image_url,
        hint:       g.hint,
        difficulty: g.difficulty,
        points:     g.points,
        categoryId,
      }),
    ),
  );

  return saved.map(q => q.id);
}

export class GameService {
  private sessionRepo    = AppDataSource.getRepository(GameSession);
  private participantRepo = AppDataSource.getRepository(GameParticipant);
  private answerRepo     = AppDataSource.getRepository(GameAnswer);
  private questionRepo   = AppDataSource.getRepository(Question);
  private eloService     = new EloService();

  // ── Create session ──────────────────────────────────────────────────────────
  async createSession(opts: {
    mode: GameMode;
    hostId: string;
    categoryId?: string;
    totalQuestions?: number;
    timePerQuestion?: number;
    maxPlayers?: number;
    difficulty?: QuestionDifficulty;
    type?: QuestionType;
  }) {
    const {
      mode, hostId, categoryId,
      totalQuestions = 10, timePerQuestion = 30, maxPlayers,
    } = opts;

    // Hive Master defaults
    const difficulty = opts.difficulty ?? (mode === GameMode.HIVE_MASTER ? QuestionDifficulty.HARD : null);
    const type       = opts.type       ?? (mode === GameMode.HIVE_MASTER ? QuestionType.MULTICHOICE : null);

    const defaultMax = mode === GameMode.HIVE_ON_FIRE ? 50 : mode === GameMode.HIVE_WAR ? 4 : 1;
    const resolvedMax = maxPlayers ?? defaultMax;

    if (mode === GameMode.HIVE_WAR && (resolvedMax < 2 || resolvedMax > 4)) {
      throw new Error('Hive War requires 2–4 players');
    }

    const questionIds = await resolveQuestions(
      categoryId ?? null, totalQuestions, difficulty, type,
    );

    // Generate unique join code for multiplayer modes
    let joinCode: string | null = null;
    if (mode !== GameMode.HIVE_MASTER) {
      let attempts = 0;
      do {
        joinCode = generateJoinCode();
        const exists = await this.sessionRepo.findOne({ where: { joinCode } });
        if (!exists) break;
      } while (++attempts < 10);
    }

    const session = this.sessionRepo.create({
      mode, hostId, categoryId: categoryId ?? null,
      totalQuestions, timePerQuestion,
      maxPlayers: resolvedMax,
      joinCode,
      questionIds,
      status: mode === GameMode.HIVE_MASTER ? GameStatus.ACTIVE : GameStatus.WAITING,
    });
    await this.sessionRepo.save(session);

    // Auto-join host as participant
    await this.joinSession(session.id, hostId);

    return session;
  }

  // ── Join session by ID or join code ────────────────────────────────────────
  async joinSession(sessionId: string, userId: string) {
    const session = await this.sessionRepo.findOne({ where: { id: sessionId } });
    if (!session) throw new Error('Session not found');
    if (session.status === GameStatus.FINISHED) throw new Error('Game already finished');
    if (session.status === GameStatus.CANCELLED) throw new Error('Game was cancelled');

    const existing = await this.participantRepo.findOne({ where: { sessionId, userId } });
    if (existing) return existing; // idempotent re-join

    const count = await this.participantRepo.count({ where: { sessionId } });
    if (count >= session.maxPlayers) throw new Error('Game room is full');

    const participant = this.participantRepo.create({
      sessionId, userId, status: ParticipantStatus.JOINED,
    });
    return await this.participantRepo.save(participant);
  }

  async joinByCode(joinCode: string, userId: string) {
    const session = await this.sessionRepo.findOne({ where: { joinCode } });
    if (!session) throw new Error('Invalid join code');
    return this.joinSession(session.id, userId);
  }

  // ── Start session (host only, multiplayer) ──────────────────────────────────
  async startSession(sessionId: string, hostId: string) {
    const session = await this.sessionRepo.findOne({ where: { id: sessionId } });
    if (!session) throw new Error('Session not found');
    if (session.hostId !== hostId) throw new Error('Only the host can start the game');
    if (session.status !== GameStatus.WAITING) throw new Error('Game is not in waiting state');

    const count = await this.participantRepo.count({ where: { sessionId } });
    if (session.mode === GameMode.HIVE_WAR && count < 2) {
      throw new Error('Hive War requires at least 2 players');
    }

    session.status = GameStatus.ACTIVE;
    session.currentQuestionIndex = 0;
    session.questionStartedAt = new Date();
    await this.sessionRepo.save(session);

    await this.participantRepo.update({ sessionId }, { status: ParticipantStatus.ACTIVE });
    return session;
  }

  // ── Get current question for a session ─────────────────────────────────────
  async getCurrentQuestion(sessionId: string, userId: string) {
    const session = await this.getActiveSession(sessionId);
    const participant = await this.getActiveParticipant(sessionId, userId);

    if (participant.lastAnsweredIndex >= session.currentQuestionIndex) {
      return { waiting: true, message: 'Waiting for next question' };
    }

    const questionId = session.questionIds[session.currentQuestionIndex];
    const question = await this.questionRepo.findOne({ where: { id: questionId } });
    if (!question) throw new Error('Question not found');

    const elapsed = session.questionStartedAt
      ? Date.now() - session.questionStartedAt.getTime()
      : 0;
    const timeRemainingMs = Math.max(0, session.timePerQuestion * 1000 - elapsed);

    // Strip answer before sending to client
    const { answer, ...questionWithoutAnswer } = question;
    return { question: questionWithoutAnswer, timeRemainingMs, index: session.currentQuestionIndex };
  }

  // ── Submit answer ───────────────────────────────────────────────────────────
  async submitAnswer(sessionId: string, userId: string, submittedAnswer: string) {
    const session = await this.getActiveSession(sessionId);
    const participant = await this.getActiveParticipant(sessionId, userId);

    if (participant.lastAnsweredIndex >= session.currentQuestionIndex) {
      throw new Error('Already answered this question');
    }

    const questionId = session.questionIds[session.currentQuestionIndex];
    const question = await this.questionRepo.findOne({ where: { id: questionId } });
    if (!question) throw new Error('Question not found');

    // Enforce time limit
    const responseTimeMs = session.questionStartedAt
      ? Date.now() - session.questionStartedAt.getTime()
      : null;
    const timeLimitMs = session.timePerQuestion * 1000;
    if (responseTimeMs !== null && responseTimeMs > timeLimitMs + 2000) { // 2s grace
      throw new Error('Time expired for this question');
    }

    const isCorrect = submittedAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();

    // Calculate points
    let points = 0;
    if (isCorrect) {
      const base = BASE_POINTS[question.difficulty ?? 'medium'] ?? 2;
      const streakMult = STREAK_MULTIPLIER(participant.streak + 1);
      const speed = responseTimeMs !== null ? speedBonus(responseTimeMs, timeLimitMs) : 0;
      points = Math.round(base * streakMult * (1 + speed));
    }

    // Persist answer
    const gameAnswer = this.answerRepo.create({
      participantId: participant.id,
      questionId,
      answer: submittedAnswer,
      isCorrect,
      pointsEarned: points,
      responseTimeMs,
    });
    await this.answerRepo.save(gameAnswer);

    // Update participant
    participant.score += points;
    participant.streak = isCorrect ? participant.streak + 1 : 0;
    participant.lastAnsweredIndex = session.currentQuestionIndex;
    await this.participantRepo.save(participant);

    return { isCorrect, pointsEarned: points, score: participant.score, streak: participant.streak };
  }

  // ── Advance to next question (host or auto) ─────────────────────────────────
  async advanceQuestion(sessionId: string, hostId: string) {
    const session = await this.sessionRepo.findOne({ where: { id: sessionId } });
    if (!session) throw new Error('Session not found');
    if (session.hostId !== hostId) throw new Error('Only the host can advance questions');
    if (session.status !== GameStatus.ACTIVE) throw new Error('Game is not active');

    const nextIndex = session.currentQuestionIndex + 1;
    if (nextIndex >= session.totalQuestions) {
      return this.finishSession(sessionId);
    }

    session.currentQuestionIndex = nextIndex;
    session.questionStartedAt = new Date();
    await this.sessionRepo.save(session);
    return { currentQuestionIndex: nextIndex, total: session.totalQuestions };
  }

  // ── Finish session ──────────────────────────────────────────────────────────
  async finishSession(sessionId: string) {
    const session = await this.sessionRepo.findOne({ where: { id: sessionId } });
    if (!session) throw new Error('Session not found');
    if (session.status === GameStatus.FINISHED) return this.getResults(sessionId);

    session.status = GameStatus.FINISHED;
    await this.sessionRepo.save(session);

    // Assign final positions and ranks
    const participants = await this.participantRepo.find({
      where: { sessionId },
      order: { score: 'DESC' },
    });

    for (let i = 0; i < participants.length; i++) {
      participants[i].position = i + 1;
      participants[i].status = ParticipantStatus.FINISHED;
      if (session.mode === GameMode.HIVE_MASTER) {
        participants[i].rankAchieved = resolveRank(participants[i].score);
      }
    }
    await this.participantRepo.save(participants);

    // Update ELO ratings for Hive Master games
    if (session.mode === GameMode.HIVE_MASTER) {
      await this.eloService.processGameResult(
        participants.map(p => ({ userId: p.userId, position: p.position! })),
      );
    }

    return this.getResults(sessionId);
  }

  // ── Cancel session ──────────────────────────────────────────────────────────
  async cancelSession(sessionId: string, hostId: string) {
    const session = await this.sessionRepo.findOne({ where: { id: sessionId } });
    if (!session) throw new Error('Session not found');
    if (session.hostId !== hostId) throw new Error('Only the host can cancel the game');
    if (session.status === GameStatus.FINISHED) throw new Error('Cannot cancel a finished game');

    session.status = GameStatus.CANCELLED;
    await this.sessionRepo.save(session);
    await this.participantRepo.update({ sessionId }, { status: ParticipantStatus.ABANDONED });
    return { cancelled: true };
  }

  // ── Leave session ───────────────────────────────────────────────────────────
  async leaveSession(sessionId: string, userId: string) {
    const participant = await this.participantRepo.findOne({ where: { sessionId, userId } });
    if (!participant) throw new Error('Not in this session');

    participant.status = ParticipantStatus.ABANDONED;
    await this.participantRepo.save(participant);

    // If host leaves, cancel the game
    const session = await this.sessionRepo.findOne({ where: { id: sessionId } });
    if (session && session.hostId === userId && session.status !== GameStatus.FINISHED) {
      await this.cancelSession(sessionId, userId);
    }

    return { left: true };
  }

  // ── Results / leaderboard ───────────────────────────────────────────────────
  async getResults(sessionId: string) {
    const session = await this.sessionRepo.findOne({ where: { id: sessionId } });
    if (!session) throw new Error('Session not found');

    const participants = await this.participantRepo.find({
      where: { sessionId },
      relations: ['user'],
      order: { score: 'DESC' },
    });

    // Attach ELO ratings for Hive Master sessions
    let eloMap: Record<string, { rating: number }> = {};
    if (session.mode === GameMode.HIVE_MASTER) {
      const eloRecords = await this.eloService.getGlobalLeaderboard(1000, 0);
      eloMap = Object.fromEntries(eloRecords.map(e => [e.userId, { rating: e.rating }]));
    }

    return {
      sessionId,
      mode: session.mode,
      status: session.status,
      leaderboard: participants.map(p => ({
        position: p.position,
        userId: p.userId,
        name: (p.user as any)?.name ?? (p.user as any)?.email,
        score: p.score,
        streak: p.streak,
        rankAchieved: p.rankAchieved,
        status: p.status,
        ...(session.mode === GameMode.HIVE_MASTER && { eloRating: eloMap[p.userId]?.rating }),
      })),
    };
  }

  // ── Session state (for polling / WS sync) ───────────────────────────────────
  async getSessionState(sessionId: string) {
    const session = await this.sessionRepo.findOne({ where: { id: sessionId } });
    if (!session) throw new Error('Session not found');

    const participants = await this.participantRepo.find({
      where: { sessionId },
      relations: ['user'],
      order: { score: 'DESC' },
    });

    return {
      id: session.id,
      mode: session.mode,
      status: session.status,
      joinCode: session.joinCode,
      currentQuestionIndex: session.currentQuestionIndex,
      totalQuestions: session.totalQuestions,
      timePerQuestion: session.timePerQuestion,
      questionStartedAt: session.questionStartedAt,
      participants: participants.map(p => ({
        userId: p.userId,
        name: (p.user as any)?.name ?? (p.user as any)?.email,
        score: p.score,
        streak: p.streak,
        status: p.status,
        position: p.position,
      })),
    };
  }

  async getUserSessions(userId: string) {
    const participants = await this.participantRepo.find({
      where: { userId },
      relations: ['session'],
      order: { joinedAt: 'DESC' },
    });
    return participants.map(p => ({ ...p.session, myScore: p.score, myRank: p.rankAchieved, position: p.position }));
  }

  // ── Private helpers ─────────────────────────────────────────────────────────
  private async getActiveSession(sessionId: string) {
    const session = await this.sessionRepo.findOne({ where: { id: sessionId } });
    if (!session) throw new Error('Session not found');
    if (session.status !== GameStatus.ACTIVE) throw new Error('Game is not active');
    return session;
  }

  private async getActiveParticipant(sessionId: string, userId: string) {
    const participant = await this.participantRepo.findOne({ where: { sessionId, userId } });
    if (!participant) throw new Error('You are not in this session');
    if (participant.status === ParticipantStatus.ABANDONED) throw new Error('You have left this game');
    return participant;
  }
}
