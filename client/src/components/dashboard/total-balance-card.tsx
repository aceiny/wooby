"use client";

import { motion } from 'framer-motion';
import { Wallet, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Account } from '@/types/api.types';

interface TotalBalanceCardProps {
  accounts: Account[];
  isLoading?: boolean;
}

export function TotalBalanceCard({ accounts, isLoading }: TotalBalanceCardProps) {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const accountCount = accounts.length;

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
        <div className="space-y-3">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-10 w-48 animate-pulse rounded bg-muted" />
          <div className="h-3 w-32 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 lg:p-8"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent" />
      
      <div className="relative">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Wallet className="h-4 w-4" />
          <span className="text-sm font-medium">Total Balance</span>
        </div>

        <div className="mt-2">
          <span className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            {formatEur(totalBalance)}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>{accountCount} account{accountCount !== 1 ? 's' : ''} connected</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function formatEur(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount);
}
