"use client";

import { Menu, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuthStore } from "@/stores/auth.store";
import { useUIStore } from "@/stores/ui.store";
import { useLogout } from "@/hooks/use-auth";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/react";

export function Header() {
  const { user } = useAuthStore();
  const { openSidebar } = useUIStore();
  const logoutMutation = useLogout();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={openSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden lg:block">
          <h2 className="text-sm font-medium text-foreground">
            {getGreeting()},{" "}
            <span className="font-semibold">{user?.name?.split(" ")[0] || "there"}</span>
          </h2>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <ThemeToggle variant="click-small" />

        {/* Notifications */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* User menu */}
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90">
              {initials}
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="User actions" variant="flat">
            <DropdownSection showDivider>
              <DropdownItem key="profile" className="h-14 gap-2" isReadOnly>
                <p className="text-xs font-normal text-muted-foreground">Signed in as</p>
                <p className="text-sm font-medium text-foreground">{user?.email || user?.name}</p>
              </DropdownItem>
            </DropdownSection>
            <DropdownSection>
              <DropdownItem
                key="logout"
                color="danger"
                className="text-danger"
                onPress={() => logoutMutation.mutate()}
              >
                {logoutMutation.isPending ? "Signing out..." : "Sign out"}
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
