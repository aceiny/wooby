"use client";

import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { fDate } from "@/lib/utils/time-utills";
import { getBankConfig } from "@/lib/bank-config";
import type { Transaction } from "@/types/api.types";

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export function TransactionTable({ transactions, isLoading }: TransactionTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card">
        <div className="hidden border-b border-border px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid sm:grid-cols-12 sm:gap-4">
          <div className="sm:col-span-5">Merchant / Label</div>
          <div className="sm:col-span-3">Bank & Account</div>
          <div className="sm:col-span-2">Date</div>
          <div className="text-right sm:col-span-2">Amount</div>
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
                <div className="space-y-1.5">
                  <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                </div>
              </div>
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
          <ArrowLeftRight className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">No transactions found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your search query or filter parameters.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Desktop Table Header */}
      <div className="hidden border-b border-border bg-muted/30 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid sm:grid-cols-12 sm:gap-4">
        <div className="sm:col-span-5">Merchant</div>
        <div className="sm:col-span-3">Bank</div>
        <div className="sm:col-span-2">Date</div>
        <div className="text-right sm:col-span-2">Amount</div>
      </div>

      {/* List / Table Rows */}
      <div className="divide-y divide-border">
        {transactions.map((txn, i) => {
          const isCredit = txn.type === "credit";
          const bank = getBankConfig(txn.institution_slug);

          return (
            <motion.div
              key={txn.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02, duration: 0.2 }}
              className="flex flex-col gap-2 p-4 transition-colors hover:bg-accent/30 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4 sm:px-6 sm:py-3.5"
            >
              {/* Merchant / Category */}
              <div className="flex items-center gap-3 sm:col-span-5">
                <div
                  className={cn(
                    "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-sm font-semibold",
                    isCredit
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isCredit ? (
                    <ArrowDownLeft className="h-4 w-4" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{txn.merchant}</p>
                  {txn.category && (
                    <p className="text-xs capitalize text-muted-foreground/70">{txn.category}</p>
                  )}
                </div>
              </div>

              {/* Bank badge */}
              <div className="flex items-center gap-1.5 sm:col-span-3">
                {bank && (
                  <div className="flex items-center gap-1.5 rounded-md bg-muted/60 px-2 py-1 text-xs font-medium text-muted-foreground">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: bank.color }}
                    />
                    <span>{bank.shortName}</span>
                  </div>
                )}
              </div>

              {/* Date */}
              <div className="text-xs text-muted-foreground sm:col-span-2">
                {fDate(txn.date, "MMM DD, YYYY")}
              </div>

              {/* Amount */}
              <div className="text-right sm:col-span-2">
                <span
                  className={cn(
                    "text-sm font-semibold tabular-nums",
                    isCredit
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-foreground"
                  )}
                >
                  {isCredit ? "+" : ""}{formatEur(txn.amount)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function formatEur(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(Math.abs(amount));
}
