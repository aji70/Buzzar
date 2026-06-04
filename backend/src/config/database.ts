import { DataSource } from 'typeorm';
import { env } from './env';
import { User } from '../entities/User';
import { Question } from '../entities/Question';
import { Category } from '../entities/Category';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.name,
  synchronize: env.nodeEnv === 'development',
  logging: env.nodeEnv === 'development',
  entities: [User, Question, Category],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});
