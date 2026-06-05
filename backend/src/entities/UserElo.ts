import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from './User';

@Entity('user_elo')
export class UserElo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'int', default: 1000 })
  rating!: number;

  /** Total Hive Master games played */
  @Column({ type: 'int', default: 0 })
  gamesPlayed!: number;

  /** Hive Master games won (ranked #1) */
  @Column({ type: 'int', default: 0 })
  wins!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
