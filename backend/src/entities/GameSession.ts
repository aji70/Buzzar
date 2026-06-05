import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { User } from './User';

export enum GameMode {
  HIVE_MASTER = 'hive_master',
  HIVE_ON_FIRE = 'hive_on_fire',
  HIVE_WAR = 'hive_war',
}

export enum GameStatus {
  WAITING   = 'waiting',    // lobby open
  ACTIVE    = 'active',     // in progress
  FINISHED  = 'finished',   // completed
  CANCELLED = 'cancelled',  // abandoned / expired
}

export enum HiveMasterRank {
  WORKER_BEE     = 'Worker Bee',
  SCOUT_BEE      = 'Scout Bee',
  GUARD_BEE      = 'Guard Bee',
  QUEENS_ASSISTANT = "Queen's Assistant",
  HIVE_MASTER    = 'Hive Master',
}

@Entity('game_sessions')
export class GameSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: GameMode })
  mode!: GameMode;

  @Column({ type: 'enum', enum: GameStatus, default: GameStatus.WAITING })
  status!: GameStatus;

  /** 6-character uppercase join code for Hive On Fire / Hive War */
  @Column({ type: 'varchar', length: 6, nullable: true, unique: true })
  joinCode!: string | null;

  /** Host user (creator) */
  @Column({ type: 'uuid' })
  hostId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hostId' })
  host!: User;

  /** Category filter — null means all categories */
  @Column({ type: 'uuid', nullable: true })
  categoryId!: string | null;

  /** Total questions per session */
  @Column({ type: 'int', default: 10 })
  totalQuestions!: number;

  /** Seconds per question (Hive On Fire / Hive War) */
  @Column({ type: 'int', default: 30 })
  timePerQuestion!: number;

  /** Max players (Hive War: 2–4, Hive On Fire: up to 50) */
  @Column({ type: 'int', default: 4 })
  maxPlayers!: number;

  /** Ordered list of question IDs for this session */
  @Column({ type: 'jsonb', default: [] })
  questionIds!: string[];

  /** Index of the currently active question */
  @Column({ type: 'int', default: 0 })
  currentQuestionIndex!: number;

  /** When the current question started (for timer enforcement) */
  @Column({ type: 'timestamptz', nullable: true })
  questionStartedAt!: Date | null;

  @OneToMany('GameParticipant', 'session')
  participants!: any[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
