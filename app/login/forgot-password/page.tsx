"use client";

import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail } from "lucide-react";
import AuthShell from "@/app/components/auth/AuthShell";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [errors, setErrors] = useState<Partial<Record<keyof ForgotPasswordFormData, string>>>({});
  const [formData, setFormData] = useState<ForgotPasswordFormData>({ email: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof ForgotPasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = forgotPasswordSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ForgotPasswordFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ForgotPasswordFormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AuthShell
        eyebrow="Recovery"
        title={"Check\nyour inbox"}
        tagline="We sent a password reset link to get you back on the court."
      >
        <div>
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-court">
            <Mail className="h-6 w-6 text-black" />
          </div>
          <h2 className="font-display text-4xl uppercase sm:text-5xl">
            Check your email
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            We sent a password reset link to{" "}
            <span className="font-semibold text-foreground">
              {formData.email}
            </span>
            .
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or try again.
          </p>

          <div className="mt-8 space-y-4">
            <Button
              variant="outline"
              className="h-11 w-full rounded-full"
              onClick={() => {
                setSubmitted(false);
                setFormData({ email: "" });
              }}
            >
              Try again
            </Button>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-court"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Recovery"
      title={"Reset\nyour game"}
      tagline="Enter your email and we'll send you a reset link to get you back on the court."
    >
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-court">
          Forgot password
        </p>
        <h2 className="font-display text-4xl uppercase sm:text-5xl">
          Find your way back
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`h-11 rounded-xl px-4 ${errors.email ? "border-destructive" : ""}`}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>
          <Button
            type="submit"
            className="h-11 w-full rounded-full bg-court text-sm font-bold uppercase tracking-wide text-black hover:bg-court/90"
          >
            Send reset link
          </Button>
        </form>

        <Link
          href="/login"
          className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-court"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </AuthShell>
  );
}
