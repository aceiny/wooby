// ============================================================
// MOCK DATA & DYNAMIC SIMULATOR FOR ACCOUNTS & TRANSACTIONS
// ============================================================
import { ConnectionStatus } from '@/types/api.types';
import type { Institution, BankConnection, Account, Transaction, TransactionFilters } from '@/types/api.types';

export const MOCK_INSTITUTIONS: Institution[] = [
  { id: 1, name: 'Revolut', description: 'Digital banking and financial services', slug: 'revolut' },
  { id: 2, name: 'BNP Paribas', description: 'French international banking group', slug: 'bnp-paribas' }
];

export const MOCK_CONNECTIONS: BankConnection[] = [
  { id: 1, institution: MOCK_INSTITUTIONS[0], status: ConnectionStatus.ACTIVE, last_synced_at: new Date(Date.now() - 2 * 60000).toISOString(), created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 2, institution: MOCK_INSTITUTIONS[1], status: ConnectionStatus.ACTIVE, last_synced_at: new Date(Date.now() - 5 * 60000).toISOString(), created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() }
];

export const MOCK_ACCOUNTS: Account[] = [
  { id: 'acc-1', connection_id: 1, institution_slug: 'revolut', name: 'Personal Account', type: 'checking', iban: 'LT61 3250 0000 0000 0001', currency: 'EUR', balance: 2460.00, last_synced_at: MOCK_CONNECTIONS[0].last_synced_at },
  { id: 'acc-2', connection_id: 1, institution_slug: 'revolut', name: 'Savings Vault', type: 'savings', currency: 'EUR', balance: 850.00, last_synced_at: MOCK_CONNECTIONS[0].last_synced_at },
  { id: 'acc-3', connection_id: 2, institution_slug: 'bnp-paribas', name: 'Compte Courant', type: 'checking', iban: 'FR76 3000 4000 0300 0000 0123', currency: 'EUR', balance: 1823.42, last_synced_at: MOCK_CONNECTIONS[1].last_synced_at },
  { id: 'acc-4', connection_id: 2, institution_slug: 'bnp-paribas', name: 'Livret A', type: 'savings', currency: 'EUR', balance: 5200.00, last_synced_at: MOCK_CONNECTIONS[1].last_synced_at }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'txn-1', account_id: 'acc-3', institution_slug: 'bnp-paribas', merchant: 'Carrefour', category: 'groceries', amount: -42.30, currency: 'EUR', date: '2026-09-01T14:30:00Z', type: 'debit' },
  { id: 'txn-2', account_id: 'acc-1', institution_slug: 'revolut', merchant: 'Uber', category: 'transport', amount: -12.40, currency: 'EUR', date: '2026-08-31T09:15:00Z', type: 'debit' },
  { id: 'txn-3', account_id: 'acc-3', institution_slug: 'bnp-paribas', merchant: 'Salary - TechCorp', category: 'income', amount: 2850.00, currency: 'EUR', date: '2026-08-30T08:00:00Z', type: 'credit' },
  { id: 'txn-4', account_id: 'acc-1', institution_slug: 'revolut', merchant: 'Netflix', category: 'subscriptions', amount: -13.49, currency: 'EUR', date: '2026-08-29T10:00:00Z', type: 'debit' },
  { id: 'txn-5', account_id: 'acc-1', institution_slug: 'revolut', merchant: 'Spotify', category: 'subscriptions', amount: -9.99, currency: 'EUR', date: '2026-08-29T11:00:00Z', type: 'debit' },
  { id: 'txn-6', account_id: 'acc-3', institution_slug: 'bnp-paribas', merchant: 'Monoprix', category: 'groceries', amount: -28.75, currency: 'EUR', date: '2026-08-28T18:45:00Z', type: 'debit' },
  { id: 'txn-7', account_id: 'acc-1', institution_slug: 'revolut', merchant: 'SNCF', category: 'transport', amount: -45.00, currency: 'EUR', date: '2026-08-27T14:20:00Z', type: 'debit' },
  { id: 'txn-8', account_id: 'acc-1', institution_slug: 'revolut', merchant: 'Amazon', category: 'shopping', amount: -67.99, currency: 'EUR', date: '2026-08-27T16:10:00Z', type: 'debit' },
  { id: 'txn-9', account_id: 'acc-3', institution_slug: 'bnp-paribas', merchant: 'Boulangerie Paul', category: 'dining', amount: -8.50, currency: 'EUR', date: '2026-08-26T08:30:00Z', type: 'debit' },
  { id: 'txn-10', account_id: 'acc-3', institution_slug: 'bnp-paribas', merchant: 'EDF Electricity', category: 'housing', amount: -85.00, currency: 'EUR', date: '2026-08-25T09:00:00Z', type: 'debit' },
  { id: 'txn-11', account_id: 'acc-2', institution_slug: 'revolut', merchant: 'Savings Transfer', category: 'transfers', amount: 500.00, currency: 'EUR', date: '2026-08-25T10:00:00Z', type: 'credit' },
  { id: 'txn-12', account_id: 'acc-3', institution_slug: 'bnp-paribas', merchant: 'Rent', category: 'housing', amount: -950.00, currency: 'EUR', date: '2026-08-25T12:00:00Z', type: 'debit' },
  { id: 'txn-13', account_id: 'acc-3', institution_slug: 'bnp-paribas', merchant: 'Lidl', category: 'groceries', amount: -35.60, currency: 'EUR', date: '2026-08-24T17:30:00Z', type: 'debit' },
  { id: 'txn-14', account_id: 'acc-1', institution_slug: 'revolut', merchant: 'Revolut Transfer', category: 'transfers', amount: -500.00, currency: 'EUR', date: '2026-08-25T10:00:00Z', type: 'debit' },
  { id: 'txn-15', account_id: 'acc-1', institution_slug: 'revolut', merchant: 'Zara', category: 'shopping', amount: -89.90, currency: 'EUR', date: '2026-08-23T15:20:00Z', type: 'debit' },
  { id: 'txn-16', account_id: 'acc-1', institution_slug: 'revolut', merchant: 'Restaurant Le Petit', category: 'dining', amount: -42.00, currency: 'EUR', date: '2026-08-22T20:00:00Z', type: 'debit' },
  { id: 'txn-17', account_id: 'acc-3', institution_slug: 'bnp-paribas', merchant: 'Pharmacie', category: 'shopping', amount: -15.80, currency: 'EUR', date: '2026-08-22T10:45:00Z', type: 'debit' },
  { id: 'txn-18', account_id: 'acc-3', institution_slug: 'bnp-paribas', merchant: 'RATP Navigo', category: 'transport', amount: -84.10, currency: 'EUR', date: '2026-08-21T07:30:00Z', type: 'debit' },
  { id: 'txn-19', account_id: 'acc-1', institution_slug: 'revolut', merchant: 'Apple One', category: 'subscriptions', amount: -19.95, currency: 'EUR', date: '2026-08-20T11:20:00Z', type: 'debit' },
  { id: 'txn-20', account_id: 'acc-1', institution_slug: 'revolut', merchant: 'Fnac', category: 'shopping', amount: -34.99, currency: 'EUR', date: '2026-08-19T16:40:00Z', type: 'debit' },
];

const delay = (ms?: number) => new Promise(resolve => setTimeout(resolve, ms || Math.random() * 150 + 100));

export const mockAccountsApi = {
  getAccounts: async (connections?: BankConnection[]): Promise<Account[]> => {
    await delay();
    if (!connections || connections.length === 0) {
      return MOCK_ACCOUNTS;
    }

    const result: Account[] = [];

    for (const conn of connections) {
      const slug = conn.institution.slug;
      const connId = conn.id;

      if (slug === 'revolut') {
        result.push({
          id: `acc-revolut-${connId}-1`,
          connection_id: connId,
          institution_slug: 'revolut',
          name: 'Personal Account',
          type: 'checking',
          iban: `LT61 3250 ${String(connId).padStart(4, '0')} 0000 0001`,
          currency: 'EUR',
          balance: 2460.00,
          last_synced_at: conn.last_synced_at || conn.created_at,
        });
        result.push({
          id: `acc-revolut-${connId}-2`,
          connection_id: connId,
          institution_slug: 'revolut',
          name: 'Savings Vault',
          type: 'savings',
          currency: 'EUR',
          balance: 850.00,
          last_synced_at: conn.last_synced_at || conn.created_at,
        });
      } else if (slug === 'bnp-paribas') {
        result.push({
          id: `acc-bnp-${connId}-1`,
          connection_id: connId,
          institution_slug: 'bnp-paribas',
          name: 'Compte Courant',
          type: 'checking',
          iban: `FR76 3000 4000 ${String(connId).padStart(4, '0')} 0000 0123`,
          currency: 'EUR',
          balance: 1823.42,
          last_synced_at: conn.last_synced_at || conn.created_at,
        });
        result.push({
          id: `acc-bnp-${connId}-2`,
          connection_id: connId,
          institution_slug: 'bnp-paribas',
          name: 'Livret A',
          type: 'savings',
          currency: 'EUR',
          balance: 5200.00,
          last_synced_at: conn.last_synced_at || conn.created_at,
        });
      } else {
        result.push({
          id: `acc-gen-${connId}-1`,
          connection_id: connId,
          institution_slug: slug,
          name: 'Main Account',
          type: 'checking',
          currency: 'EUR',
          balance: 1500.00,
          last_synced_at: conn.last_synced_at || conn.created_at,
        });
      }
    }

    return result;
  },

  getAccount: async (id: string, connections?: BankConnection[]): Promise<Account> => {
    await delay();
    const all = await mockAccountsApi.getAccounts(connections);
    const account = all.find((a) => a.id === id) || MOCK_ACCOUNTS.find((a) => a.id === id);
    if (!account) throw new Error('Account not found');
    return account;
  },
};

export const mockTransactionsApi = {
  getTransactions: async (filters?: TransactionFilters) => {
    await delay();
    let filtered = [...MOCK_TRANSACTIONS];
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(t => (t.merchant || t.label || '').toLowerCase().includes(search) || (t.category?.toLowerCase().includes(search)));
    }
    if (filters?.institution_slug) {
      filtered = filtered.filter(t => t.institution_slug === filters.institution_slug);
    }
    if (filters?.account_id) {
      const accId = filters.account_id;
      filtered = filtered.filter(t =>
        t.account_id === accId ||
        (t.institution_slug === 'revolut' && accId.includes('revolut')) ||
        (t.institution_slug === 'bnp-paribas' && accId.includes('bnp'))
      );
    }
    if (filters?.date_from) {
      filtered = filtered.filter(t => t.date >= filters.date_from!);
    }
    if (filters?.date_to) {
      filtered = filtered.filter(t => t.date <= filters.date_to!);
    }
    
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const page = filters?.page || 1;
    const pageSize = filters?.page_size || 10;
    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);
    
    return {
      items: paged,
      total: filtered.length,
      page,
      page_size: pageSize,
      total_pages: Math.ceil(filtered.length / pageSize),
    };
  },
  getTransaction: async (id: string) => {
    await delay();
    const txn = MOCK_TRANSACTIONS.find(t => t.id === id);
    if (!txn) throw new Error('Transaction not found');
    return txn;
  },
};
