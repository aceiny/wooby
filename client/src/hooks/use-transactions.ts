import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '@/lib/api/transactions';
import type { TransactionFilters } from '@/types/api.types';

export const TRANSACTIONS_QUERY_KEY = ['transactions'] as const;

export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: [...TRANSACTIONS_QUERY_KEY, filters],
    queryFn: () => transactionsApi.getTransactions(filters),
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: [...TRANSACTIONS_QUERY_KEY, id],
    queryFn: () => transactionsApi.getTransaction(id),
    enabled: !!id,
  });
}
