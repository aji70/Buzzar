import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { GameParticipant } from './GameParticipant';
import { Question } from './Question';

@Entity('game_answers')
export class GameAnswer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  participantId!: string;

  @ManyToOne(() => GameParticipant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'participantId' })
  participant!: GameParticipant;

  @Column({ type: 'uuid' })
  questionId!: string;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionId' })
  question!: Question;

  @Column({ type: 'text' })
  answer!: string;

  @Column({ type: 'boolean' })
  isCorrect!: boolean;

  @Column({ type: 'int', default: 0 })
  pointsEarned!: number;

  @Column({ type: 'int', nullable: true })
  responseTimeMs!: number | null;

  @CreateDateColumn()
  answeredAt!: Date;
}
