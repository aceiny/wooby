"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/react";
import { Mail, Lock, User } from "lucide-react";
import { registerSchema, type RegisterFormData } from "@/schema/auth.schema";
import { useRegister } from "@/hooks/use-auth";
import { Form, Field } from "@/components/common/form";

export default function RegisterPage() {
  const registerMutation = useRegister();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Get started with Wooby — connect your banks in minutes
        </p>
      </div>

      {/* Error message */}
      {registerMutation.isError && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
          <p className="text-sm text-destructive">
            {registerMutation.error instanceof Error
              ? registerMutation.error.message
              : "Registration failed. Please try again."}
          </p>
        </div>
      )}

      {/* Form */}
      <Form form={form} onSubmit={onSubmit} className="space-y-4">
        <Field.Input
          name="name"
          type="text"
          label="Full name"
          placeholder="John Doe"
          variant="bordered"
          size="lg"
          startContent={
            <User className="pointer-events-none h-4 w-4 flex-shrink-0 text-muted-foreground" />
          }
          classNames={{
            inputWrapper: "h-12",
          }}
        />

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
          placeholder="At least 8 characters"
          variant="bordered"
          size="lg"
          startContent={
            <Lock className="pointer-events-none h-4 w-4 flex-shrink-0 text-muted-foreground" />
          }
          classNames={{
            inputWrapper: "h-12",
          }}
        />

        <Field.Input
          name="password_confirmation"
          type="password"
          label="Confirm password"
          placeholder="Re-enter your password"
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
          isLoading={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Creating account..." : "Create account"}
        </Button>
      </Form>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground">
        By creating an account, you agree to our{" "}
        <span className="underline underline-offset-2">Terms of Service</span>{" "}
        and{" "}
        <span className="underline underline-offset-2">Privacy Policy</span>.
      </p>
    </div>
  );
}
