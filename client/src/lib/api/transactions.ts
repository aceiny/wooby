import type { Transaction, TransactionFilters, PaginatedResponse } from '@/types/api.types';
import { mockTransactionsApi } from './mock/mock-data';

// TODO: Replace mock implementations with real API calls when backend endpoints are ready
export const transactionsApi = {
  getTransactions: async (filters?: TransactionFilters): Promise<PaginatedResponse<Transaction>> => {
    return mockTransactionsApi.getTransactions(filters);
  },

  getTransaction: async (id: string): Promise<Transaction> => {
    return mockTransactionsApi.getTransaction(id);
  },
};
