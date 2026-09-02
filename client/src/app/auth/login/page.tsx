"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/react";
import { Mail, Lock } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/schema/auth.schema";
import { useLogin } from "@/hooks/use-auth";
import { Form, Field } from "@/components/common/form";

export default function LoginPage() {
  const loginMutation = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      {/* Error message */}
      {loginMutation.isError && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
          <p className="text-sm text-destructive">
            {loginMutation.error instanceof Error
              ? loginMutation.error.message
              : "Invalid email or password. Please try again."}
          </p>
        </div>
      )}

      {/* Form */}
      <Form form={form} onSubmit={onSubmit} className="space-y-4">
        <Field.Input
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          variant="bordered"
          size="lg"
          startContent={
            <Mail className="pointer-events-none h-4 w-4 flex-shrink-0 text-muted-foreground" />
          }
          classNames={{
            inputWrapper: "h-12",
          }}
        />

        <Field.Input
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          variant="bordered"
          size="lg"
          startContent={
            <Lock className="pointer-events-none h-4 w-4 flex-shrink-0 text-muted-foreground" />
          }
          classNames={{
            inputWrapper: "h-12",
          }}
        />

        <Button
          type="submit"
          color="primary"
          size="lg"
          className="w-full font-medium"
          isLoading={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Signing in..." : "Sign in"}
        </Button>
      </Form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-3 text-muted-foreground">
            Supported banks
          </span>
        </div>
      </div>

      {/* Bank logos */}
      <div className="flex items-center justify-center gap-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0075EB]/10">
            <span className="text-sm font-bold text-[#0075EB]">R</span>
          </div>
          <span className="text-xs font-medium">Revolut</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#009A44]/10">
            <span className="text-sm font-bold text-[#009A44]">B</span>
          </div>
          <span className="text-xs font-medium">BNP Paribas</span>
        </div>
      </div>
    </div>
  );
}
