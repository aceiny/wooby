"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Landmark,
  ArrowLeftRight,
  Settings,
  CreditCard,
  LogOut,
  X,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_PATHS } from "@/shared/constants/paths";
import { useLogout } from "@/hooks/use-auth";
import { useUIStore } from "@/stores/ui.store";

const navigation = [
  {
    name: "Dashboard",
    href: APP_PATHS.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    name: "Accounts",
    href: APP_PATHS.ACCOUNTS,
    icon: CreditCard,
  },
  {
    name: "Transactions",
    href: APP_PATHS.TRANSACTIONS,
    icon: ArrowLeftRight,
  },
  {
    name: "Settings",
    href: APP_PATHS.SETTINGS,
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar, toggleSidebar } = useUIStore();
  const logoutMutation = useLogout();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 ease-in-out lg:relative lg:z-auto lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
          <Link
            href={APP_PATHS.DASHBOARD}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Landmark className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-semibold tracking-tight text-sidebar-foreground">
              Wooby
            </span>
          </Link>

          {/* Close button (mobile) / Collapse button (desktop) */}
          <button
            onClick={() => {
              if (window.innerWidth < 1024) {
                closeSidebar();
              } else {
                toggleSidebar();
              }
            }}
            className="flex h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <X className="h-4 w-4 lg:hidden" />
            <ChevronLeft className="hidden h-4 w-4 lg:block" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
            Menu
          </p>
          {navigation.map((item) => {
            const isActive =
              item.href === APP_PATHS.DASHBOARD
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) closeSidebar();
                }}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-sidebar-primary"
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}
                <item.icon
                  className={cn(
                    "h-4 w-4 flex-shrink-0 transition-colors",
                    isActive
                      ? "text-sidebar-primary"
                      : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/70"
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <span>{logoutMutation.isPending ? "Signing out..." : "Sign out"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
