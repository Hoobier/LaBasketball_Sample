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
import { Textarea } from "@/components/ui/textarea";
import { Camera, Save } from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  phone: z.string().optional(),
  bio: z.string().max(200, "Bio must be 200 characters or less").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileTab() {
  const [profileErrors, setProfileErrors] = useState<
    Partial<Record<keyof ProfileFormData, string>>
  >({});

  const [profile, setProfile] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
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

  return (
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
  );
}
