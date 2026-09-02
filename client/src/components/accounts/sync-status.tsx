"use client";

import { CheckCircle, RefreshCw, AlertTriangle, XCircle, Unplug, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConnectionStatus } from '@/types/api.types';

interface SyncStatusProps {
  status: ConnectionStatus;
  className?: string;
}

const statusConfig: Record<ConnectionStatus, {
  label: string;
  icon: typeof CheckCircle;
  colorClass: string;
  bgClass: string;
}> = {
  [ConnectionStatus.ACTIVE]: {
    label: 'Connected',
    icon: CheckCircle,
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-500/10',
  },
  [ConnectionStatus.SYNCING]: {
    label: 'Syncing...',
    icon: RefreshCw,
    colorClass: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-500/10',
  },
  [ConnectionStatus.AUTH_REQUIRED]: {
    label: 'Authentication required',
    icon: AlertTriangle,
    colorClass: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-500/10',
  },
  [ConnectionStatus.ERROR]: {
    label: 'Error',
    icon: XCircle,
    colorClass: 'text-red-600 dark:text-red-400',
    bgClass: 'bg-red-500/10',
  },
  [ConnectionStatus.DISCONNECTED]: {
    label: 'Disconnected',
    icon: Unplug,
    colorClass: 'text-muted-foreground',
    bgClass: 'bg-muted',
  },
};

export function SyncStatus({ status, className }: SyncStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const isSyncing = status === ConnectionStatus.SYNCING;

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className={cn('flex h-5 w-5 items-center justify-center rounded-full', config.bgClass)}>
        <Icon className={cn('h-3 w-3', config.colorClass, isSyncing && 'animate-spin')} />
      </div>
      <span className={cn('text-xs font-medium', config.colorClass)}>
        {config.label}
      </span>
    </div>
  );
}
