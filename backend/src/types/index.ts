import { FastifyRequest } from 'fastify';

export interface AuthRequest extends FastifyRequest {
  user?: {
    id: string;
    email: string;
  };
}

export interface RegisterBody {
  email: string;
  password: string;
  name?: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface UpdateProfileBody {
  name?: string;
  email?: string;
}

export interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}
