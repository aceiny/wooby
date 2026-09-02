import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { banksApi } from '@/lib/api/banks';
import { accountsApi } from '@/lib/api/accounts';
import type { BankConnection } from '@/types/api.types';

export const CONNECTIONS_QUERY_KEY = ['connections'] as const;
export const ACCOUNTS_QUERY_KEY = ['accounts'] as const;
export const INSTITUTIONS_QUERY_KEY = ['institutions'] as const;

export function useConnections() {
  return useQuery({
    queryKey: [...CONNECTIONS_QUERY_KEY],
    queryFn: () => banksApi.getConnections(),
  });
}

export function useConnection(id: number) {
  return useQuery({
    queryKey: [...CONNECTIONS_QUERY_KEY, id],
    queryFn: () => banksApi.getConnection(id),
    enabled: !!id,
  });
}

export function useAccounts() {
  return useQuery({
    queryKey: [...ACCOUNTS_QUERY_KEY],
    queryFn: () => accountsApi.getAccounts(),
  });
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: [...ACCOUNTS_QUERY_KEY, id],
    queryFn: () => accountsApi.getAccount(id),
    enabled: !!id,
  });
}

export function useInstitutions() {
  return useQuery({
    queryKey: [...INSTITUTIONS_QUERY_KEY],
    queryFn: () => banksApi.getInstitutions(),
  });
}

export function useConnectBank() {
  const queryClient = useQueryClient();
  return useMutation<BankConnection, Error, string | number>({
    mutationFn: (target: string | number) => banksApi.connect(target),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONNECTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
}

export function useDisconnectBank() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (connectionId: number) => banksApi.disconnect(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONNECTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
}

export function useSyncBank() {
  const queryClient = useQueryClient();
  return useMutation<BankConnection, Error, number>({
    mutationFn: (connectionId: number) => banksApi.sync(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONNECTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
}
