"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { useSettings } from "@/app/contexts/SettingsContext";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";

const authRoutes = ["/login", "/signup", "/login/forgot-password"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { settings } = useSettings();
  const isAuth = authRoutes.includes(pathname);

  if (isAuth) {
    return (
      <>
        {children}
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col md:flex-row",
        settings.compactView && "compact-view",
        !settings.animations && "reduce-animations"
      )}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-12 items-center justify-end border-b bg-background px-4 md:px-6">
          <NotificationBell />
        </header>
        {/* Page Content */}
        <main className="flex-1">{children}</main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
