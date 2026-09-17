"use client";

import { useState } from "react";
import { toast } from "sonner";
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
  AlertTriangle,
  Trash2,
  Loader2,
} from "lucide-react";
import ProfileTab from "./components/ProfileTab";
import SecurityTab from "./components/SecurityTab";
import NotificationsTab from "./components/NotificationsTab";
import AppearanceTab from "./components/AppearanceTab";

export default function SettingsPage() {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const isDeleteEnabled = deleteConfirmText === "DELETE";

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
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <NotificationsTab />
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <AppearanceTab />
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

      <Dialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) {
            setDeleteConfirmText("");
            setIsDeleting(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <Trash2 className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <DialogTitle className="text-lg">Delete Account</DialogTitle>
                <DialogDescription>
                  This action is irreversible
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <p className="text-sm font-medium text-destructive">
                Warning: This cannot be undone
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Once you delete your account, the following data will be
                permanently removed:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-destructive/60" />
                  All your bookings and history
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-destructive/60" />
                  Products and inventory data
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-destructive/60" />
                  Team memberships and roles
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-destructive/60" />
                  Subscription and billing information
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deleteConfirm">
                Type <span className="font-mono font-semibold">DELETE</span> to
                confirm
              </Label>
              <Input
                id="deleteConfirm"
                placeholder="DELETE"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="border-destructive/30 focus-visible:ring-destructive/50"
                disabled={isDeleting}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />} disabled={isDeleting}>
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              disabled={!isDeleteEnabled || isDeleting}
              onClick={() => {
                setIsDeleting(true);
                setTimeout(() => {
                  setDeleteOpen(false);
                  setDeleteConfirmText("");
                  setIsDeleting(false);
                  toast.success("Account deleted", {
                    description: "Your account has been permanently deleted.",
                  });
                }, 1500);
              }}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
