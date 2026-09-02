"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Landmark, ArrowRight } from 'lucide-react';
import { Button } from '@heroui/react';
import { APP_PATHS } from '@/shared/constants/paths';
import { SUPPORTED_BANKS } from '@/lib/bank-config';

interface ConnectCTAProps {
  onConnect?: () => void;
}

export function ConnectCTA({ onConnect }: ConnectCTAProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center rounded-2xl border-2 border-dashed border-border bg-card/50 px-6 py-12 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <Landmark className="h-6 w-6 text-primary" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-foreground">
        Connect your first bank account
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Connect Revolut or BNP Paribas to start viewing your financial data in one unified dashboard.
      </p>

      {/* Bank options */}
      <div className="mt-6 flex items-center gap-3">
        {SUPPORTED_BANKS.map((bank) => (
          <div
            key={bank.slug}
            className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2"
          >
            <div
              className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold text-white"
              style={{ backgroundColor: bank.color }}
            >
              {bank.shortName.charAt(0)}
            </div>
            <span className="text-sm font-medium text-foreground">{bank.name}</span>
          </div>
        ))}
      </div>

      <div className="mt-6">
        {onConnect ? (
          <Button
            color="primary"
            size="lg"
            onPress={onConnect}
            endContent={<ArrowRight className="h-4 w-4" />}
          >
            Connect a bank
          </Button>
        ) : (
          <Link href={`${APP_PATHS.ACCOUNTS}?connect=true`}>
            <Button
              color="primary"
              size="lg"
              endContent={<ArrowRight className="h-4 w-4" />}
            >
              Connect a bank
            </Button>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
