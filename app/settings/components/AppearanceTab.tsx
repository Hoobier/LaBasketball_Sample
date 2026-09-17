"use client";

import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/app/contexts/SettingsContext";

export default function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const { settings, updateSetting } = useSettings();

  return (
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
              checked={settings.compactView}
              onCheckedChange={(checked) => {
                updateSetting("compactView", checked);
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
              checked={settings.animations}
              onCheckedChange={(checked) => {
                updateSetting("animations", checked);
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
              checked={settings.sidebarCollapsed}
              onCheckedChange={(checked) => {
                updateSetting("sidebarCollapsed", checked);
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
                onClick={() => {
                  updateSetting("sidebarPosition", "left");
                  toast.success("Layout updated", {
                    description: "Sidebar set to left side.",
                  });
                }}
                className={
                  settings.sidebarPosition === "left"
                    ? "flex h-20 items-center justify-center rounded-lg border-2 border-primary bg-primary/5 text-sm font-medium"
                    : "flex h-20 items-center justify-center rounded-lg border text-sm font-medium text-muted-foreground hover:bg-accent"
                }
              >
                Left
              </button>
              <button
                onClick={() => {
                  updateSetting("sidebarPosition", "right");
                  toast.success("Layout updated", {
                    description: "Sidebar set to right side.",
                  });
                }}
                className={
                  settings.sidebarPosition === "right"
                    ? "flex h-20 items-center justify-center rounded-lg border-2 border-primary bg-primary/5 text-sm font-medium"
                    : "flex h-20 items-center justify-center rounded-lg border text-sm font-medium text-muted-foreground hover:bg-accent"
                }
              >
                Right
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
