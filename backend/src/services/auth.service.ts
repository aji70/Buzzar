import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { redis } from '../config/redis';
import { User } from '../entities/User';
import { env } from '../config/env';

const JWT_SECRET = env.jwt.secret;
const JWT_EXPIRES_IN = env.jwt.expiresIn;

export class AuthService {
  private userRepo = AppDataSource.getRepository(User);

  async register(email: string, password: string, name?: string) {
    const exists = await this.userRepo.findOne({ where: { email } });
    if (exists) throw new Error('Email already registered');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, password: hashedPassword, name });
    await this.userRepo.save(user);

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token: this.generateToken(user.id, user.email) };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token: this.generateToken(user.id, user.email) };
  }

  async logout(token: string) {
    try {
      const decoded = jwt.decode(token) as { exp?: number } | null;
      const ttl = decoded?.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 60 * 60 * 24 * 7;
      if (ttl > 0) await redis.setex(`blacklist:${token}`, ttl, '1');
    } catch {
      // ignore invalid tokens on logout
    }
  }

  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: string, name?: string, email?: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    if (email && email !== user.email) {
      const exists = await this.userRepo.findOne({ where: { email } });
      if (exists) throw new Error('Email already in use');
      user.email = email;
    }

    if (name !== undefined) user.name = name;
    await this.userRepo.save(user);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    if (!(await bcrypt.compare(currentPassword, user.password))) {
      throw new Error('Current password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepo.save(user);
  }

  async verifyToken(token: string): Promise<{ id: string; email: string } | null> {
    const blacklisted = await redis.get(`blacklist:${token}`);
    if (blacklisted) return null;

    try {
      const payload = jwt.verify(token, JWT_SECRET) as { sub: string; email: string };
      return { id: payload.sub, email: payload.email };
    } catch {
      return null;
    }
  }

  private generateToken(userId: string, email: string): string {
    return jwt.sign({ sub: userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
  }
}
