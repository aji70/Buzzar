import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn, Unique,
} from 'typeorm';
import { User } from './User';
import { Badge } from './Badge';

@Entity('user_badges')
@Unique(['userId', 'badgeId'])
export class UserBadge {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'uuid' })
  badgeId!: string;

  @ManyToOne(() => Badge, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'badgeId' })
  badge!: Badge;

  @CreateDateColumn()
  earnedAt!: Date;
}
