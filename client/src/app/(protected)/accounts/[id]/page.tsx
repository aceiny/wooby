"use client";

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Clock, Hash, Globe, RefreshCw } from 'lucide-react';
import { Button } from '@heroui/react';
import { cn } from '@/lib/utils';
import { getBankConfig } from '@/lib/bank-config';
import { fToNow, fDate } from '@/lib/utils/time-utills';
import { useAccount } from '@/hooks/use-accounts';
import { useTransactions } from '@/hooks/use-transactions';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { APP_PATHS } from '@/shared/constants/paths';

export default function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: account, isLoading } = useAccount(id);
  const { data: transactionsData, isLoading: txnLoading } = useTransactions({
    account_id: id,
    page_size: 10,
  });

  const bank = account ? getBankConfig(account.institution_slug) : null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-32 animate-pulse rounded bg-muted" />
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 animate-pulse rounded-xl bg-muted" />
              <div className="space-y-2">
                <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              </div>
            </div>
            <div className="h-10 w-36 animate-pulse rounded bg-muted" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <p className="text-lg font-semibold text-foreground">Account not found</p>
        <p className="mt-1 text-sm text-muted-foreground">This account may have been disconnected.</p>
        <Button
          className="mt-4"
          variant="flat"
          onPress={() => router.push(APP_PATHS.ACCOUNTS)}
        >
          Back to accounts
        </Button>
      </div>
    );
  }

  const details = [
    { label: 'Account type', value: account.type.replace('_', ' '), icon: CreditCard },
    { label: 'Currency', value: account.currency, icon: Globe },
    ...(account.iban ? [{ label: 'IBAN', value: maskIban(account.iban), icon: Hash }] : []),
    ...(account.last_synced_at ? [{ label: 'Last synced', value: fToNow(account.last_synced_at), icon: Clock }] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.push(APP_PATHS.ACCOUNTS)}
        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to accounts
      </button>

      {/* Account header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-border bg-card overflow-hidden"
      >
        <div
          className="h-1.5"
          style={{ backgroundColor: bank?.color || '#6366f1' }}
        />
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white"
                style={{ backgroundColor: bank?.color || '#6366f1' }}
              >
                {bank?.shortName?.charAt(0) || '?'}
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{account.name}</p>
                <p className="text-sm text-muted-foreground">{bank?.name || 'Unknown bank'}</p>
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Current Balance</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
              {formatEur(account.balance)}
            </p>
          </div>

          {/* Details grid */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {details.map((detail) => (
              <div key={detail.label} className="rounded-lg bg-muted/50 px-4 py-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <detail.icon className="h-3 w-3" />
                  <span>{detail.label}</span>
                </div>
                <p className="mt-1 text-sm font-medium capitalize text-foreground">{detail.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Transactions for this account */}
      <RecentTransactions
        transactions={transactionsData?.items || []}
        isLoading={txnLoading}
      />
    </div>
  );
}

function maskIban(iban: string): string {
  const clean = iban.replace(/\s/g, '');
  if (clean.length <= 8) return clean;
  return `${clean.slice(0, 4)} •••• ${clean.slice(-4)}`;
}

function formatEur(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount);
}
