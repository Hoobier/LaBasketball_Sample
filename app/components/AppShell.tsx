"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { useSettings } from "@/app/contexts/SettingsContext";
import { useCart } from "@/app/contexts/CartContext";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";
import CartSheet from "./CartSheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const shelllessRoutes = [
  "/login",
  "/signup",
  "/login/forgot-password",
  "/", // marketing landing page has its own nav/footer
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { settings } = useSettings();
  const isAuth = shelllessRoutes.includes(pathname);
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

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
        <header className="sticky top-0 z-30 flex h-12 items-center justify-end border-b bg-background px-4 md:px-6 gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Button>
          <NotificationBell />
        </header>
        {/* Page Content */}
        <main className="flex-1">{children}</main>
      </div>
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
      <Toaster position="top-right" richColors />
    </div>
  );
}
