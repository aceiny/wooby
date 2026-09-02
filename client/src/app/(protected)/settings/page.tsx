"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useConnections } from "@/hooks/use-accounts";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getBankConfig } from "@/lib/bank-config";
import { User, Shield, Moon, Landmark } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { data: connections } = useConnections();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account preferences and connected institutions
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Profile */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Profile Information</h2>
              <p className="text-xs text-muted-foreground">Your personal account details</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="mt-0.5 text-sm font-medium text-foreground">{user?.name || "—"}</p>
            </div>
            <div className="rounded-lg bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">Email Address</p>
              <p className="mt-0.5 text-sm font-medium text-foreground">{user?.email || "—"}</p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Moon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Appearance</h2>
              <p className="text-xs text-muted-foreground">Customize how Wooby looks on your device</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-lg bg-muted/40 p-4">
            <div>
              <p className="text-sm font-medium text-foreground">Theme Mode</p>
              <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
            </div>
            <ThemeToggle variant="slide" />
          </div>
        </div>

        {/* Connected Institutions Summary */}
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Connected Institutions</h2>
              <p className="text-xs text-muted-foreground">Active bank integrations connected to your account</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {connections && connections.length > 0 ? (
              connections.map((conn) => {
                const bank = getBankConfig(conn.institution.slug);
                return (
                  <div key={conn.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
                        style={{ backgroundColor: bank?.color || "#6366f1" }}
                      >
                        {bank?.shortName?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{bank?.name || conn.institution.name}</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 capitalize">● {conn.status}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No bank accounts connected yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
