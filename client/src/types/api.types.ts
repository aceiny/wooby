// ============================================================
// API Types — Aligned with backend schemas
// ============================================================

// User (matches backend UserResponse)
export interface User {
  id: number;
  name: string;
  email: string;
}

// Institution (matches backend InstitutionResponse)
export interface Institution {
  id?: number;
  name: string;
  description: string;
  slug: string;
}

// Connection status enum (matches backend ConnectionStatus)
export enum ConnectionStatus {
  ACTIVE = 'active',
  SYNCING = 'syncing',
  AUTH_REQUIRED = 'auth_required',
  ERROR = 'error',
  DISCONNECTED = 'disconnected',
}

// BankConnection (matches backend BankConnectionResponse)
export interface BankConnection {
  id: number;
  institution: Institution;
  status: ConnectionStatus;
  last_synced_at: string | null;
  created_at: string;
}

// Account (frontend model — no backend endpoint yet)
export interface Account {
  id: string;
  connection_id: number;
  institution_slug: string;
  name: string;
  type: 'checking' | 'savings' | 'credit_card' | 'investment';
  iban?: string;
  currency: string;
  balance: number;
  last_synced_at: string | null;
}

// Transaction (frontend model — no backend endpoint yet)
export interface Transaction {
  id: string;
  account_id: string;
  institution_slug: string;
  merchant: string;
  category?: string;
  amount: number;
  currency: string;
  date: string;
  type: 'debit' | 'credit';
}

// Filter/pagination types
export interface TransactionFilters {
  search?: string;
  institution_slug?: string;
  account_id?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
}
