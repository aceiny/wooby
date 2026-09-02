import internalAPI from './client';
import type { Account } from '@/types/api.types';
import { mockAccountsApi } from './mock/mock-data';
import { banksApi } from './banks';

export const accountsApi = {
  /**
   * Fetch accounts from backend GET /api/accounts
   */
  getAccounts: async (): Promise<Account[]> => {
    try {
      const res = await internalAPI.get<Account[]>('/accounts');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      // Fallback if backend has connections but no accounts yet
      const connections = await banksApi.getConnections();
      return mockAccountsApi.getAccounts(connections);
    } catch {
      const connections = await banksApi.getConnections().catch(() => []);
      return mockAccountsApi.getAccounts(connections);
    }
  },

  /**
   * Fetch a single account by ID from backend GET /api/accounts/{id}
   */
  getAccount: async (id: string | number): Promise<Account> => {
    try {
      const res = await internalAPI.get<Account>(`/accounts/${id}`);
      return res.data;
    } catch {
      const connections = await banksApi.getConnections().catch(() => []);
      return mockAccountsApi.getAccount(String(id), connections);
    }
  },
};
