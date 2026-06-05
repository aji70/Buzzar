import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
} from 'typeorm';

@Entity('badges')
export class Badge {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** Unique machine key, e.g. "first_win", "elo_1200" */
  @Column({ type: 'varchar', unique: true })
  key!: string;

  /** Display name, e.g. "First Sting" */
  @Column({ type: 'varchar' })
  name!: string;

  /** Short title shown on profile, e.g. "🏆 Hive Champion" */
  @Column({ type: 'varchar' })
  title!: string;

  /** Icon identifier / emoji / URL */
  @Column({ type: 'varchar' })
  icon!: string;

  /** Long description / flavour text */
  @Column({ type: 'text' })
  body!: string;

  /** Perks/benefits described as a JSON array of strings */
  @Column({ type: 'jsonb', default: [] })
  benefits!: string[];

  /** Rarity tier for UI styling */
  @Column({ type: 'varchar', default: 'common' })
  rarity!: 'common' | 'rare' | 'epic' | 'legendary';

  @CreateDateColumn()
  createdAt!: Date;
}
