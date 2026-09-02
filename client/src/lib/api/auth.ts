import { internalAPI } from './client';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types/api.types';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await internalAPI.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await internalAPI.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  logout: async (): Promise<void> => {
    await internalAPI.post('/auth/logout');
  },

  me: async (): Promise<User> => {
    const res = await internalAPI.get<User>('/auth/me');
    return res.data;
  },
};
