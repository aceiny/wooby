import internalAPI from './client';
import type { Transaction, TransactionFilters, PaginatedResponse } from '@/types/api.types';
import { mockTransactionsApi } from './mock/mock-data';

export const transactionsApi = {
  getTransactions: async (filters?: TransactionFilters): Promise<PaginatedResponse<Transaction>> => {
    try {
      const res = await internalAPI.get<Transaction[]>('/transactions');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        let items = res.data;
        if (filters?.account_id) {
          items = items.filter((t) => String(t.account_id) === String(filters.account_id));
        }
        return {
          items,
          total: items.length,
          page: 1,
          page_size: items.length,
          total_pages: 1,
        };
      }
      return mockTransactionsApi.getTransactions(filters);
    } catch {
      return mockTransactionsApi.getTransactions(filters);
    }
  },

  getTransaction: async (id: string | number): Promise<Transaction> => {
    try {
      const res = await internalAPI.get<Transaction>(`/transactions/${id}`);
      return res.data;
    } catch {
      return mockTransactionsApi.getTransaction(String(id));
    }
  },
};
