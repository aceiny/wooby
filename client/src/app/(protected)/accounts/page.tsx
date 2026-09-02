"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@heroui/react';
import { Plus } from 'lucide-react';
import { useConnections, useAccounts } from '@/hooks/use-accounts';
import { BankConnectionCard, BankConnectionCardSkeleton } from '@/components/accounts/bank-connection-card';
import { ConnectBankModal } from '@/components/accounts/connect-bank-modal';
import { ConnectCTA } from '@/components/dashboard/connect-cta';

function AccountsContent() {
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const searchParams = useSearchParams();
  const { data: connections, isLoading: connectionsLoading } = useConnections();
  const { data: accounts, isLoading: accountsLoading } = useAccounts();

  useEffect(() => {
    if (searchParams.get('connect') === 'true') {
      setIsConnectOpen(true);
    }
  }, [searchParams]);

  const isLoading = connectionsLoading || accountsLoading;
  const hasConnections = connections && connections.length > 0;

  // Group accounts by connection_id
  const accountsByConnection = (accounts || []).reduce<Record<number, typeof accounts>>(
    (acc, account) => {
      if (!account) return acc;
      const key = account.connection_id;
      if (!acc[key]) acc[key] = [];
      acc[key]!.push(account);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Accounts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your connected bank accounts
          </p>
        </div>
        {hasConnections && (
          <Button
            color="primary"
            startContent={<Plus className="h-4 w-4" />}
            onPress={() => setIsConnectOpen(true)}
          >
            Connect a bank
          </Button>
        )}
      </div>

      {/* Connections list */}
      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <BankConnectionCardSkeleton key={i} />
          ))}
        </div>
      ) : hasConnections ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {connections.map((connection, i) => (
            <BankConnectionCard
              key={connection.id}
              connection={connection}
              accounts={accountsByConnection[connection.id] || []}
              index={i}
            />
          ))}
        </div>
      ) : (
        <ConnectCTA onConnect={() => setIsConnectOpen(true)} />
      )}

      {/* Connect bank modal */}
      <ConnectBankModal
        isOpen={isConnectOpen}
        onClose={() => setIsConnectOpen(false)}
      />
    </div>
  );
}

export default function AccountsPage() {
  return (
    <Suspense fallback={
      <div className="grid gap-6 lg:grid-cols-2">
        <BankConnectionCardSkeleton />
        <BankConnectionCardSkeleton />
      </div>
    }>
      <AccountsContent />
    </Suspense>
  );
}
