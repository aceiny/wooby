"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getBankConfig } from '@/lib/bank-config';
import { fToNow } from '@/lib/utils/time-utills';
import { APP_PATHS } from '@/shared/constants/paths';
import type { Account } from '@/types/api.types';

interface AccountCardProps {
  account: Account;
  index?: number;
}

export function AccountCard({ account, index = 0 }: AccountCardProps) {
  const bank = getBankConfig(account.institution_slug);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        href={`${APP_PATHS.ACCOUNTS}/${account.id}`}
        className="group block rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/20 hover:shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Bank icon */}
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: bank?.color || '#6366f1' }}
            >
              {bank?.shortName?.charAt(0) || '?'}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{bank?.name || 'Unknown'}</p>
              <p className="text-xs text-muted-foreground">{account.name}</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xl font-bold tracking-tight text-foreground">
            {formatEur(account.balance)}
          </p>
          <p className="text-xs text-muted-foreground">{account.currency}</p>
        </div>

        {account.last_synced_at && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground/70">
            <Clock className="h-3 w-3" />
            <span>Synced {fToNow(account.last_synced_at)}</span>
          </div>
        )}
      </Link>
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

/** Skeleton placeholder */
export function AccountCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-20 animate-pulse rounded bg-muted" />
          <div className="h-3 w-28 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="mt-4 space-y-1.5">
        <div className="h-6 w-24 animate-pulse rounded bg-muted" />
        <div className="h-3 w-10 animate-pulse rounded bg-muted" />
      </div>
      <div className="mt-3 h-3 w-32 animate-pulse rounded bg-muted" />
    </div>
  );
}
