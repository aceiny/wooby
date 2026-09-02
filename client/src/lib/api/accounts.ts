import type { Account } from '@/types/api.types';
import { mockAccountsApi } from './mock/mock-data';
import { banksApi } from './banks';

export const accountsApi = {
  getAccounts: async (): Promise<Account[]> => {
    try {
      const connections = await banksApi.getConnections();
      return mockAccountsApi.getAccounts(connections);
    } catch {
      return mockAccountsApi.getAccounts();
    }
  },

  getAccount: async (id: string): Promise<Account> => {
    try {
      const connections = await banksApi.getConnections();
      return mockAccountsApi.getAccount(id, connections);
    } catch {
      return mockAccountsApi.getAccount(id);
    }
  },
};
