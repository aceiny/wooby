import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/auth.store';
import { APP_PATHS } from '@/shared/constants/paths';
import type { LoginRequest, RegisterRequest } from '@/types/api.types';

export const AUTH_QUERY_KEY = ['auth', 'user'] as const;

export function useUser() {
  const { setUser } = useAuthStore();

  return useQuery({
    queryKey: [...AUTH_QUERY_KEY],
    queryFn: async () => {
      const user = await authApi.me();
      setUser(user);
      return user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      useAuthStore.getState().setUser(response.user);
      queryClient.invalidateQueries({ queryKey: [...AUTH_QUERY_KEY] });
      router.push(APP_PATHS.DASHBOARD);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response) => {
      useAuthStore.getState().setUser(response.user);
      queryClient.invalidateQueries({ queryKey: [...AUTH_QUERY_KEY] });
      router.push(APP_PATHS.DASHBOARD);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      useAuthStore.getState().logout();
      queryClient.clear();
      router.push(APP_PATHS.AUTH.LOGIN);
    },
    onError: () => {
      useAuthStore.getState().logout();
      queryClient.clear();
      router.push(APP_PATHS.AUTH.LOGIN);
    },
  });
}
