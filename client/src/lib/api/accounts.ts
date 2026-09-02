import internalAPI from './client';
import type { Account } from '@/types/api.types';

export const accountsApi = {
  /**
   * Fetch accounts from backend GET /api/accounts
   */
  getAccounts: async (): Promise<Account[]> => {
    try {
      const res = await internalAPI.get<Account[]>('/accounts');
      return res.data || [];
    } catch {
      return [];
    }
  },

  /**
   * Fetch a single account by ID from backend GET /api/accounts/{id}
   */
  getAccount: async (id: string | number): Promise<Account> => {
    const res = await internalAPI.get<Account>(`/accounts/${id}`);
    return res.data;
  },
};
