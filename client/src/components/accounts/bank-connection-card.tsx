"use client";

import { motion } from 'framer-motion';
import { RefreshCw, Unplug, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@heroui/react';
import Link from 'next/link';
import { extractErrorMessage } from '@/lib/utils/error.utils';
import { getBankConfig } from '@/lib/bank-config';
import { fToNow } from '@/lib/utils/time-utills';
import { SyncStatus } from './sync-status';
import { useSyncBank, useDisconnectBank } from '@/hooks/use-accounts';
import { APP_PATHS } from '@/shared/constants/paths';
import type { BankConnection, Account } from '@/types/api.types';
import { ConnectionStatus } from '@/types/api.types';

interface BankConnectionCardProps {
  connection: BankConnection;
  accounts: Account[];
  index?: number;
}

export function BankConnectionCard({ connection, accounts = [], index = 0 }: BankConnectionCardProps) {
  const bank = getBankConfig(connection.institution.slug);
  const syncMutation = useSyncBank();
  const disconnectMutation = useDisconnectBank();

  const totalBalance = (accounts || []).reduce((sum, acc) => {
    const val = typeof acc.balance === 'number' ? acc.balance : parseFloat(acc.balance as any) || 0;
    return sum + val;
  }, 0);

  const isSyncing = syncMutation.isPending || connection.status === ConnectionStatus.SYNCING;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      {/* Bank header with brand color accent */}
      <div className="relative px-5 pt-5 pb-4">
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: bank?.color || '#6366f1' }}
        />
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: bank?.color || '#6366f1' }}
            >
              {bank?.shortName?.charAt(0) || connection.institution.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-foreground">{bank?.name || connection.institution.name}</p>
              <p className="text-xs text-muted-foreground">
                {accounts.length} account{accounts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <SyncStatus status={isSyncing ? ConnectionStatus.SYNCING : connection.status} />
        </div>

        {/* Balance */}
        <div className="mt-4">
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {formatEur(totalBalance)}
          </p>
        </div>

        {/* Last synced */}
        {connection.last_synced_at && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Last synced {fToNow(connection.last_synced_at)}</span>
          </div>
        )}

        {/* Sync error */}
        {syncMutation.isError && (
          <div className="mt-2 rounded-md bg-destructive/10 px-3 py-2">
            <p className="text-xs text-destructive">
              {extractErrorMessage(syncMutation.error, "Sync failed. Please try again.")}
            </p>
          </div>
        )}

        {/* Disconnect error */}
        {disconnectMutation.isError && (
          <div className="mt-2 rounded-md bg-destructive/10 px-3 py-2">
            <p className="text-xs text-destructive">
              {extractErrorMessage(disconnectMutation.error, "Failed to disconnect bank. Please try again.")}
            </p>
          </div>
        )}
      </div>

      {/* Account list */}
      {accounts.length > 0 && (
        <div className="border-t border-border">
          {accounts.map((account) => {
            const accBalance = typeof account.balance === 'number' ? account.balance : parseFloat(account.balance as any) || 0;
            return (
              <Link
                key={account.id}
                href={`${APP_PATHS.ACCOUNTS}/${account.id}`}
                className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-accent/30"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{account.name}</p>
                  <p className="text-xs capitalize text-muted-foreground">{account.type.replace('_', ' ')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold tabular-nums text-foreground">
                    {formatEur(accBalance)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-border px-5 py-3">
        <Button
          size="sm"
          variant="flat"
          isLoading={isSyncing}
          onPress={() => syncMutation.mutate(connection.id)}
          startContent={!isSyncing ? <RefreshCw className="h-3.5 w-3.5" /> : undefined}
          className="text-xs"
        >
          {isSyncing ? 'Syncing...' : 'Sync'}
        </Button>
        <Button
          size="sm"
          variant="flat"
          color="danger"
          isLoading={disconnectMutation.isPending}
          onPress={() => disconnectMutation.mutate(connection.id)}
          startContent={!disconnectMutation.isPending ? <Unplug className="h-3.5 w-3.5" /> : undefined}
          className="text-xs"
        >
          Disconnect
        </Button>
      </div>
    </motion.div>
  );
}

export function BankConnectionCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 animate-pulse rounded-xl bg-muted" />
        <div className="space-y-1.5">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="mt-4 h-7 w-28 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-3 w-36 animate-pulse rounded bg-muted" />
      <div className="mt-4 flex gap-2 border-t border-border pt-3">
        <div className="h-8 w-16 animate-pulse rounded bg-muted" />
        <div className="h-8 w-24 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

function formatEur(amount: number | string): string {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  const validNum = isNaN(num) ? 0 : num;
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(validNum);
}
