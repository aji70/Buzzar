import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { User } from './User';
import { GameSession } from './GameSession';

export enum ParticipantStatus {
  JOINED    = 'joined',
  ACTIVE    = 'active',
  FINISHED  = 'finished',
  ABANDONED = 'abandoned',
}

@Entity('game_participants')
export class GameParticipant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  sessionId!: string;

  @ManyToOne(() => GameSession, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sessionId' })
  session!: GameSession;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'enum', enum: ParticipantStatus, default: ParticipantStatus.JOINED })
  status!: ParticipantStatus;

  @Column({ type: 'int', default: 0 })
  score!: number;

  /** Consecutive correct answers — drives Honey Rush multiplier */
  @Column({ type: 'int', default: 0 })
  streak!: number;

  /** Hive Master rank achieved at end of session */
  @Column({ type: 'varchar', nullable: true })
  rankAchieved!: string | null;

  /** Index of last answered question */
  @Column({ type: 'int', default: -1 })
  lastAnsweredIndex!: number;

  /** Final leaderboard position set at session end */
  @Column({ type: 'int', nullable: true })
  position!: number | null;

  @OneToMany('GameAnswer', 'participant')
  answers!: any[];

  @CreateDateColumn()
  joinedAt!: Date;
}
