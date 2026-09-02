import { create } from 'zustand';

/* ----------------------------------------------------
  Types & Interfaces
---------------------------------------------------- */

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

/* ----------------------------------------------------
  Initial State
---------------------------------------------------- */

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // true until initial auth check completes
};

/* ----------------------------------------------------
  Zustand Store (in-memory only — no localStorage)
---------------------------------------------------- */

/**
 * Authentication store — in-memory only.
 * Auth state is verified by calling the BFF `/api/auth/me` endpoint.
 * JWT is stored in an HttpOnly cookie managed by the server.
 */
export const useAuthStore = create<AuthStore>()((set) => ({
  ...initialState,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  setLoading: (loading) =>
    set({ isLoading: loading }),

  logout: () =>
    set({ ...initialState, isLoading: false }),
}));

/* ----------------------------------------------------
  Selectors
---------------------------------------------------- */

export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectIsLoading = (state: AuthStore) => state.isLoading;
