"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar, MapPin } from "lucide-react";

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState({
    emailSchedules: true,
    emailVenue: true,
    pushSchedules: true,
    pushVenue: true,
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Notifications
          </CardTitle>
          <CardDescription>
            Manage your schedule update preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="space-y-0.5 min-w-0">
                <Label className="cursor-pointer">Email notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails about schedule changes and reminders
                </p>
              </div>
            </div>
            <Switch
              checked={notifications.emailSchedules}
              onCheckedChange={(checked) => {
                setNotifications((prev) => ({
                  ...prev,
                  emailSchedules: checked,
                }));
                toast.success("Preference updated", {
                  description: `Schedule emails ${checked ? "enabled" : "disabled"}.`,
                });
              }}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="space-y-0.5 min-w-0">
                <Label className="cursor-pointer">Push reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get push notifications before upcoming schedules
                </p>
              </div>
            </div>
            <Switch
              checked={notifications.pushSchedules}
              onCheckedChange={(checked) => {
                setNotifications((prev) => ({
                  ...prev,
                  pushSchedules: checked,
                }));
                toast.success("Preference updated", {
                  description: `Schedule reminders ${checked ? "enabled" : "disabled"}.`,
                });
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Venue Notifications
          </CardTitle>
          <CardDescription>
            Manage your venue alert preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="space-y-0.5 min-w-0">
                <Label className="cursor-pointer">Email notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about venue availability and changes
                </p>
              </div>
            </div>
            <Switch
              checked={notifications.emailVenue}
              onCheckedChange={(checked) => {
                setNotifications((prev) => ({
                  ...prev,
                  emailVenue: checked,
                }));
                toast.success("Preference updated", {
                  description: `Venue emails ${checked ? "enabled" : "disabled"}.`,
                });
              }}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="space-y-0.5 min-w-0">
                <Label className="cursor-pointer">Push alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Real-time updates about venue status
                </p>
              </div>
            </div>
            <Switch
              checked={notifications.pushVenue}
              onCheckedChange={(checked) => {
                setNotifications((prev) => ({
                  ...prev,
                  pushVenue: checked,
                }));
                toast.success("Preference updated", {
                  description: `Venue alerts ${checked ? "enabled" : "disabled"}.`,
                });
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
