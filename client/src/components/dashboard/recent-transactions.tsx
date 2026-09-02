"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fDate } from '@/lib/utils/time-utills';
import { getBankConfig } from '@/lib/bank-config';
import { APP_PATHS } from '@/shared/constants/paths';
import type { Transaction } from '@/types/api.types';

interface RecentTransactionsProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export function RecentTransactions({ transactions, isLoading }: RecentTransactionsProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="h-5 w-36 animate-pulse rounded bg-muted" />
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                </div>
              </div>
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">No transactions yet</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="rounded-xl border border-border bg-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">Recent Transactions</h3>
        <Link
          href={APP_PATHS.TRANSACTIONS}
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Transaction list */}
      <div className="divide-y divide-border">
        {transactions.slice(0, 8).map((txn, i) => {
          const isCredit = txn.type === 'credit';
          const bank = getBankConfig(txn.institution_slug);

          return (
            <div
              key={txn.id}
              className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-accent/30"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg',
                    isCredit
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {isCredit ? (
                    <ArrowDownLeft className="h-4 w-4" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{txn.merchant}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">{fDate(txn.date, 'MMM DD')}</span>
                    {bank && (
                      <>
                        <span className="text-xs text-muted-foreground/40">·</span>
                        <span className="text-xs text-muted-foreground">{bank.shortName}</span>
                      </>
                    )}
                    {txn.category && (
                      <>
                        <span className="text-xs text-muted-foreground/40">·</span>
                        <span className="text-xs capitalize text-muted-foreground/60">{txn.category}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <span
                className={cn(
                  'text-sm font-semibold tabular-nums',
                  isCredit
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-foreground'
                )}
              >
                {isCredit ? '+' : ''}{formatEur(txn.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function formatEur(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(Math.abs(amount));
}
