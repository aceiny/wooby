"use client";

import { useState } from "react";
import { Pagination } from "@heroui/react";
import { useTransactions } from "@/hooks/use-transactions";
import { useAccounts } from "@/hooks/use-accounts";
import { TransactionFiltersBar } from "@/components/transactions/transaction-filters";
import { TransactionTable } from "@/components/transactions/transaction-table";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [institution, setInstitution] = useState("");
  const [accountId, setAccountId] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: accountsData } = useAccounts();
  const { data: transactionsData, isLoading } = useTransactions({
    search: search || undefined,
    institution_slug: institution || undefined,
    account_id: accountId || undefined,
    page,
    page_size: pageSize,
  });

  const handleReset = () => {
    setSearch("");
    setInstitution("");
    setAccountId("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Transactions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and search all transactions across your connected accounts
        </p>
      </div>

      {/* Filters */}
      <TransactionFiltersBar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        institution={institution}
        onInstitutionChange={(v) => {
          setInstitution(v);
          setPage(1);
        }}
        accountId={accountId}
        onAccountChange={(v) => {
          setAccountId(v);
          setPage(1);
        }}
        accounts={accountsData || []}
        onReset={handleReset}
      />

      {/* Transactions Table */}
      <TransactionTable
        transactions={transactionsData?.items || []}
        isLoading={isLoading}
      />

      {/* Pagination */}
      {transactionsData && transactionsData.total_pages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            Showing {((page - 1) * pageSize) + 1} to{" "}
            {Math.min(page * pageSize, transactionsData.total)} of{" "}
            {transactionsData.total} transactions
          </p>
          <Pagination
            total={transactionsData.total_pages}
            page={page}
            onChange={setPage}
            size="sm"
            variant="flat"
            showControls
          />
        </div>
      )}
    </div>
  );
}
