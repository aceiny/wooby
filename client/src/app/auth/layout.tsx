"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Landmark, Shield, TrendingUp, Wallet } from "lucide-react";
import { APP_PATHS } from "@/shared/constants/paths";

const features = [
  {
    icon: Wallet,
    title: "Unified Dashboard",
    description: "See all your bank accounts in one place",
  },
  {
    icon: TrendingUp,
    title: "Transaction Insights",
    description: "Track your spending across all institutions",
  },
  {
    icon: Shield,
    title: "Secure Connection",
    description: "Bank-grade encryption for your data",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === APP_PATHS.AUTH.LOGIN;

  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Branding */}
      <div className="relative hidden w-[480px] flex-shrink-0 overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between xl:w-[560px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.35_0.05_260)_0%,transparent_60%)] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(0.25_0.04_200)_0%,transparent_50%)] opacity-40" />

        <div className="relative z-10 flex flex-col justify-between h-full p-10 xl:p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
              <Landmark className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-primary-foreground">
              Wooby
            </span>
          </div>

          {/* Features */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary-foreground xl:text-4xl">
                Your finances,
                <br />
                unified.
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-primary-foreground/60 max-w-[340px]">
                Connect your bank accounts from Revolut, BNP Paribas, and more.
                See your complete financial picture in one dashboard.
              </p>
            </div>

            <div className="space-y-5">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10 backdrop-blur-sm">
                    <feature.icon className="h-4 w-4 text-primary-foreground/80" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary-foreground">
                      {feature.title}
                    </p>
                    <p className="text-xs text-primary-foreground/50">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-primary-foreground/30">
            © {new Date().getFullYear()} Wooby. Open Banking made simple.
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex flex-1 flex-col">
        {/* Top bar for mobile */}
        <div className="flex items-center justify-between px-6 py-4 lg:px-10 lg:py-6">
          <div className="flex items-center gap-2 lg:hidden">
            <Landmark className="h-5 w-5 text-foreground" />
            <span className="text-lg font-semibold tracking-tight">Wooby</span>
          </div>
          <div className="ml-auto">
            <Link
              href={isLogin ? APP_PATHS.AUTH.REGISTER : APP_PATHS.AUTH.LOGIN}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {isLogin ? "Create account" : "Sign in"}
            </Link>
          </div>
        </div>

        {/* Form content */}
        <div className="flex flex-1 items-center justify-center px-6 pb-12 lg:px-10">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-[400px]"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
