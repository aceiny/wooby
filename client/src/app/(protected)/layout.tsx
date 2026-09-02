"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useUser } from "@/hooks/use-auth";
import { useAuthStore } from "@/stores/auth.store";
import { APP_PATHS } from "@/shared/constants/paths";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: user, isLoading, isError } = useUser();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isError && !isAuthenticated) {
      router.replace(APP_PATHS.AUTH.LOGIN);
    }
  }, [isLoading, isError, isAuthenticated, router]);

  // Show loading skeleton while checking auth
  if (isLoading && !user) {
    return (
      <div className="flex min-h-screen">
        {/* Sidebar skeleton */}
        <div className="hidden w-[260px] border-r border-border bg-sidebar lg:block">
          <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          </div>
          <div className="space-y-2 px-3 py-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5"
              >
                <div className="h-4 w-4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>

        {/* Main skeleton */}
        <div className="flex flex-1 flex-col">
          <div className="flex h-16 items-center justify-between border-b border-border px-6">
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="flex-1 p-6">
            <div className="space-y-4">
              <div className="h-8 w-48 animate-pulse rounded bg-muted" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-36 animate-pulse rounded-xl bg-muted"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError && !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
