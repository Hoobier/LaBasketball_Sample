"use client";

import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Key, Smartphone, Globe } from "lucide-react";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SecurityTab() {
  const [passwordErrors, setPasswordErrors] = useState<
    Partial<Record<keyof PasswordFormData, string>>
  >({});

  const [passwords, setPasswords] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (
    field: keyof PasswordFormData,
    value: string
  ) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    const result = passwordSchema.safeParse(passwords);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof PasswordFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof PasswordFormData;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setPasswordErrors(fieldErrors);
      return;
    }
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({});
    toast.success("Password changed", {
      description: "Your password has been updated successfully.",
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password regularly to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSave} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwords.currentPassword}
                onChange={(e) =>
                  handlePasswordChange("currentPassword", e.target.value)
                }
                className={
                  passwordErrors.currentPassword ? "border-destructive" : ""
                }
              />
              {passwordErrors.currentPassword && (
                <p className="text-sm text-destructive">
                  {passwordErrors.currentPassword}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={(e) =>
                  handlePasswordChange("newPassword", e.target.value)
                }
                className={
                  passwordErrors.newPassword ? "border-destructive" : ""
                }
              />
              {passwordErrors.newPassword && (
                <p className="text-sm text-destructive">
                  {passwordErrors.newPassword}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  handlePasswordChange("confirmPassword", e.target.value)
                }
                className={
                  passwordErrors.confirmPassword ? "border-destructive" : ""
                }
              />
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {passwordErrors.confirmPassword}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              <Key className="mr-2 h-4 w-4" />
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Auth & Sessions */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">
                  Authenticator App
                </p>
                <p className="text-sm text-muted-foreground">
                  Use an authenticator app to generate one-time codes
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.info("Coming soon", {
                    description:
                      "Two-factor authentication will be available soon.",
                  })
                }
              >
                Enable
              </Button>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">SMS Messages</p>
                <p className="text-sm text-muted-foreground">
                  Receive codes via text message
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.info("Coming soon", {
                    description:
                      "SMS verification will be available soon.",
                  })
                }
              >
                Enable
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Active Sessions
            </CardTitle>
            <CardDescription>
              Manage your logged-in devices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground text-center py-4">No active sessions</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
