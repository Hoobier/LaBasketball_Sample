"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  User,
  Shield,
  Bell,
  Palette,
  CreditCard,
  AlertTriangle,
  Camera,
  Key,
  Smartphone,
  Mail,
  Globe,
  Clock,
  Save,
} from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  phone: z.string().optional(),
  bio: z.string().max(200, "Bio must be 200 characters or less").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

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

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [profileErrors, setProfileErrors] = useState<
    Partial<Record<keyof ProfileFormData, string>>
  >({});
  const [passwordErrors, setPasswordErrors] = useState<
    Partial<Record<keyof PasswordFormData, string>>
  >({});

  const [profile, setProfile] = useState<ProfileFormData>({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1 234 567 890",
    bio: "Basketball enthusiast and team coach.",
  });

  const [passwords, setPasswords] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailBookings: true,
    smsBookings: false,
    weeklySummary: true,
    marketing: false,
    securityAlerts: true,
    teamUpdates: true,
  });

  const [appearance, setAppearance] = useState({
    compactView: false,
    sidebarCollapsed: false,
    animations: true,
  });

  const handleProfileChange = (
    field: keyof ProfileFormData,
    value: string
  ) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    if (profileErrors[field]) {
      setProfileErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePasswordChange = (
    field: keyof PasswordFormData,
    value: string
  ) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const result = profileSchema.safeParse(profile);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ProfileFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ProfileFormData;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setProfileErrors(fieldErrors);
      return;
    }
    toast.success("Profile updated", {
      description: "Your profile has been saved successfully.",
    });
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
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Manage your account, preferences, and security settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList variant="line" className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="profile">
            <User className="mr-1.5 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-1.5 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-1.5 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="mr-1.5 h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="mr-1.5 h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Avatar Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
                <CardDescription>Your public avatar</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted text-3xl font-bold">
                    {profile.firstName[0]}
                    {profile.lastName[0]}
                  </div>
                  <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-accent">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-center">
                  <p className="font-medium">
                    {profile.firstName} {profile.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {profile.email}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Camera className="mr-2 h-4 w-4" />
                  Change Photo
                </Button>
              </CardContent>
            </Card>

            {/* Profile Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) =>
                          handleProfileChange("firstName", e.target.value)
                        }
                        className={profileErrors.firstName ? "border-destructive" : ""}
                      />
                      {profileErrors.firstName && (
                        <p className="text-sm text-destructive">
                          {profileErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) =>
                          handleProfileChange("lastName", e.target.value)
                        }
                        className={profileErrors.lastName ? "border-destructive" : ""}
                      />
                      {profileErrors.lastName && (
                        <p className="text-sm text-destructive">
                          {profileErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        handleProfileChange("email", e.target.value)
                      }
                      className={profileErrors.email ? "border-destructive" : ""}
                    />
                    {profileErrors.email && (
                      <p className="text-sm text-destructive">
                        {profileErrors.email}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) =>
                        handleProfileChange("phone", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={profile.bio}
                      onChange={(e) =>
                        handleProfileChange("bio", e.target.value)
                      }
                      className={profileErrors.bio ? "border-destructive" : ""}
                    />
                    {profileErrors.bio && (
                      <p className="text-sm text-destructive">
                        {profileErrors.bio}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {profile.bio?.length || 0}/200 characters
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Save Profile
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6">
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
                  {[
                    {
                      device: "MacBook Pro",
                      location: "San Francisco, CA",
                      time: "Active now",
                      current: true,
                    },
                    {
                      device: "iPhone 15",
                      location: "San Francisco, CA",
                      time: "2 hours ago",
                      current: false,
                    },
                  ].map((session, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">
                          {session.device}
                          {session.current && (
                            <span className="ml-2 text-xs text-green-600">
                              (Current)
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {session.location} &middot; {session.time}
                        </p>
                      </div>
                      {!session.current && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() =>
                            toast.success("Session revoked", {
                              description: `Session for ${session.device} has been ended.`,
                            })
                          }
                        >
                          Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Notifications
                </CardTitle>
                <CardDescription>
                  Choose what emails you receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    key: "emailBookings" as const,
                    label: "Booking confirmations",
                    description: "Receive email when a booking is confirmed",
                  },
                  {
                    key: "weeklySummary" as const,
                    label: "Weekly summary",
                    description: "Get a weekly report of all activities",
                  },
                  {
                    key: "marketing" as const,
                    label: "Marketing emails",
                    description: "News about features and promotions",
                  },
                  {
                    key: "teamUpdates" as const,
                    label: "Team updates",
                    description: "Notifications about your team activity",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <Label className="cursor-pointer">{item.label}</Label>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <Switch
                      checked={notifications[item.key]}
                      onCheckedChange={(checked) => {
                        setNotifications((prev) => ({
                          ...prev,
                          [item.key]: checked,
                        }));
                        toast.success("Preference updated", {
                          description: `${item.label} ${checked ? "enabled" : "disabled"}.`,
                        });
                      }}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Push & SMS Notifications
                </CardTitle>
                <CardDescription>
                  Configure mobile and SMS alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    key: "smsBookings" as const,
                    label: "SMS alerts",
                    description: "Get text messages for important updates",
                  },
                  {
                    key: "securityAlerts" as const,
                    label: "Security alerts",
                    description: "Get notified of suspicious activity",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <Label className="cursor-pointer">{item.label}</Label>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <Switch
                      checked={notifications[item.key]}
                      onCheckedChange={(checked) => {
                        setNotifications((prev) => ({
                          ...prev,
                          [item.key]: checked,
                        }));
                        toast.success("Preference updated", {
                          description: `${item.label} ${checked ? "enabled" : "disabled"}.`,
                        });
                      }}
                    />
                  </div>
                ))}

                <Separator className="my-2" />

                <div className="rounded-lg border bg-muted/50 p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Quiet Hours</p>
                      <p className="text-sm text-muted-foreground">
                        No notifications from 10:00 PM to 8:00 AM
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Customize the look and feel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 min-w-0">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use dark theme across the application
                    </p>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => {
                      setTheme(checked ? "dark" : "light");
                      toast.success("Theme updated", {
                        description: `Dark mode ${checked ? "enabled" : "disabled"}.`,
                      });
                    }}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 min-w-0">
                    <Label>Compact View</Label>
                    <p className="text-sm text-muted-foreground">
                      Reduce spacing for more content on screen
                    </p>
                  </div>
                  <Switch
                    checked={appearance.compactView}
                    onCheckedChange={(checked) => {
                      setAppearance((prev) => ({
                        ...prev,
                        compactView: checked,
                      }));
                      toast.success("View updated", {
                        description: `Compact view ${checked ? "enabled" : "disabled"}.`,
                      });
                    }}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 min-w-0">
                    <Label>Animations</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable transitions and motion effects
                    </p>
                  </div>
                  <Switch
                    checked={appearance.animations}
                    onCheckedChange={(checked) => {
                      setAppearance((prev) => ({
                        ...prev,
                        animations: checked,
                      }));
                      toast.success("Preference updated", {
                        description: `Animations ${checked ? "enabled" : "disabled"}.`,
                      });
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Layout</CardTitle>
                <CardDescription>Customize the interface layout</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5 min-w-0">
                    <Label>Collapsed Sidebar</Label>
                    <p className="text-sm text-muted-foreground">
                      Show only icons in the sidebar
                    </p>
                  </div>
                  <Switch
                    checked={appearance.sidebarCollapsed}
                    onCheckedChange={(checked) => {
                      setAppearance((prev) => ({
                        ...prev,
                        sidebarCollapsed: checked,
                      }));
                      toast.success("Layout updated", {
                        description: `Sidebar ${checked ? "collapsed" : "expanded"}.`,
                      });
                    }}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Sidebar Position</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        toast.success("Layout updated", {
                          description: "Sidebar set to left side.",
                        })
                      }
                      className="flex h-20 items-center justify-center rounded-lg border-2 border-primary bg-primary/5 text-sm font-medium"
                    >
                      Left
                    </button>
                    <button
                      onClick={() =>
                        toast.info("Coming soon", {
                          description: "Right sidebar will be available soon.",
                        })
                      }
                      className="flex h-20 items-center justify-center rounded-lg border text-sm font-medium text-muted-foreground hover:bg-accent"
                    >
                      Right
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>Manage your subscription and billing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-semibold">Pro Plan</p>
                      <p className="text-sm text-muted-foreground">
                        Full access to all features
                      </p>
                    </div>
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      Active
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-medium">₱29/month</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Next billing</p>
                      <p className="font-medium">Oct 15, 2026</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment method</p>
                      <p className="font-medium">Visa ****4242</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() =>
                      toast.info("Coming soon", {
                        description: "Plan management will be available soon.",
                      })
                    }
                  >
                    Change Plan
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      toast.info("Coming soon", {
                        description:
                          "Invoice download will be available soon.",
                      })
                    }
                  >
                    Download Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage</CardTitle>
                <CardDescription>Your current usage this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Bookings", used: 48, limit: 100, unit: "bookings" },
                  { label: "Products", used: 12, limit: 50, unit: "items" },
                  { label: "Team Members", used: 5, limit: 10, unit: "members" },
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium">
                        {item.used}/{item.limit} {item.unit}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width: `${Math.min((item.used / item.limit) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Danger Zone - Always visible at bottom */}
      <Card className="mt-8 border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This will permanently delete your account and all associated data.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                setDeleteOpen(false);
                toast.success("Account deleted", {
                  description: "Your account has been permanently deleted.",
                });
              }}
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
