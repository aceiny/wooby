"use client";

import { useAccounts } from '@/hooks/use-accounts';
import { useTransactions } from '@/hooks/use-transactions';
import { TotalBalanceCard } from '@/components/dashboard/total-balance-card';
import { AccountCard, AccountCardSkeleton } from '@/components/dashboard/account-card';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { ConnectCTA } from '@/components/dashboard/connect-cta';

export default function DashboardPage() {
  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions({ page_size: 8 });

  const hasAccounts = accounts && accounts.length > 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your financial overview at a glance
        </p>
      </div>

      {/* Total balance */}
      <TotalBalanceCard
        accounts={accounts || []}
        isLoading={accountsLoading}
      />

      {/* Connected accounts or CTA */}
      {accountsLoading ? (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Connected Accounts</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <AccountCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : hasAccounts ? (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Connected Accounts</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {accounts.map((account, i) => (
              <AccountCard key={account.id} account={account} index={i} />
            ))}
          </div>
        </div>
      ) : (
        <ConnectCTA />
      )}

      {/* Recent transactions */}
      {(hasAccounts || transactionsLoading) && (
        <RecentTransactions
          transactions={transactionsData?.items || []}
          isLoading={transactionsLoading}
        />
      )}
    </div>
  );
}
