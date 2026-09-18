"use client";

import { useState, useEffect } from "react";
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
import { Camera, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileTab() {
  const { token, user: authUser, login } = useAuth();
  const [profileErrors, setProfileErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState<ProfileFormData>({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.user) {
        setProfile({
          name: data.user.name || "",
          email: data.user.email || "",
        });
      }
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field: keyof ProfileFormData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    if (profileErrors[field]) {
      setProfileErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
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

    setSaving(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(result.data),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Failed to update profile");
        return;
      }

      if (authUser) {
        login(token!, { ...authUser, name: result.data.name, email: result.data.email });
      }

      toast.success("Profile updated", {
        description: "Your profile has been saved successfully.",
      });
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const initials = profile.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
              {initials}
            </div>
            <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-accent">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="text-center">
            <p className="font-medium">{profile.name}</p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            {authUser?.role && (
              <p className="text-xs text-muted-foreground mt-1 capitalize">
                Role: {authUser.role}
              </p>
            )}
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
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
                className={profileErrors.name ? "border-destructive" : ""}
              />
              {profileErrors.name && (
                <p className="text-sm text-destructive">{profileErrors.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange("email", e.target.value)}
                className={profileErrors.email ? "border-destructive" : ""}
              />
              {profileErrors.email && (
                <p className="text-sm text-destructive">{profileErrors.email}</p>
              )}
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
