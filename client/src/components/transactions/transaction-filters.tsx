"use client";

import { Search, X } from "lucide-react";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import { SUPPORTED_BANKS } from "@/lib/bank-config";
import type { Account } from "@/types/api.types";

interface TransactionFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  institution: string;
  onInstitutionChange: (value: string) => void;
  accountId: string;
  onAccountChange: (value: string) => void;
  accounts: Account[];
  onReset: () => void;
}

export function TransactionFiltersBar({
  search,
  onSearchChange,
  institution,
  onInstitutionChange,
  accountId,
  onAccountChange,
  accounts,
  onReset,
}: TransactionFiltersProps) {
  const hasActiveFilters = Boolean(search || institution || accountId);

  // Filter accounts by selected institution if any
  const filteredAccounts = institution
    ? accounts.filter((a) => a.institution_slug === institution)
    : accounts;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="w-full sm:max-w-xs">
          <Input
            value={search}
            onValueChange={onSearchChange}
            placeholder="Search transactions..."
            variant="bordered"
            size="sm"
            startContent={<Search className="h-4 w-4 text-muted-foreground" />}
            isClearable
            onClear={() => onSearchChange("")}
            classNames={{
              inputWrapper: "h-9",
            }}
          />
        </div>

        {/* Institution filter */}
        <div className="w-full sm:w-44">
          <Select
            selectedKeys={institution ? [institution] : []}
            onChange={(e) => onInstitutionChange(e.target.value)}
            placeholder="All banks"
            variant="bordered"
            size="sm"
            aria-label="Filter by bank"
            classNames={{
              trigger: "h-9",
            }}
          >
            {SUPPORTED_BANKS.map((bank) => (
              <SelectItem key={bank.slug} textValue={bank.name}>
                <div className="flex items-center gap-2">
                  <span className="text-xs">{bank.icon}</span>
                  <span>{bank.name}</span>
                </div>
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Account filter */}
        <div className="w-full sm:w-48">
          <Select
            selectedKeys={accountId ? [accountId] : []}
            onChange={(e) => onAccountChange(e.target.value)}
            placeholder="All accounts"
            variant="bordered"
            size="sm"
            aria-label="Filter by account"
            classNames={{
              trigger: "h-9",
            }}
          >
            {filteredAccounts.map((acc) => (
              <SelectItem key={acc.id} textValue={acc.name}>
                {acc.name}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Reset button */}
        {hasActiveFilters && (
          <Button
            size="sm"
            variant="flat"
            onPress={onReset}
            startContent={<X className="h-3.5 w-3.5" />}
            className="h-9 px-3 text-xs"
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
