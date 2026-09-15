"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard,
  CalendarCheck,
  Calendar,
  MapPin,
  Settings,
  LogOut,
  Menu,
  Trophy,
  X,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Available Slot", href: "/available-slot", icon: CalendarCheck },
  { name: "Schedules", href: "/schedules", icon: Calendar },
  { name: "Venue", href: "/venue", icon: MapPin },
  { name: "Products", href: "/products", icon: ShoppingBag },
  { name: "Settings", href: "/settings", icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    setLogoutOpen(false);
    toast.success("Logged out successfully", {
      description: "You have been signed out of your account.",
    });
    setTimeout(() => router.push("/login"), 500);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Trophy className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold">LaBasketball</span>
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <Separator />

      <div className="flex items-center gap-2 p-3">
        <ThemeToggle />
        <Button
          variant="ghost"
          className="flex-1 justify-start gap-3 text-muted-foreground"
          onClick={() => setLogoutOpen(true)}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You will need to sign in again
              to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background px-4 md:hidden">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Trophy className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold">LaBasketball</span>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transition-transform duration-200 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden h-screen w-64 shrink-0 border-r bg-sidebar text-sidebar-foreground md:block md:sticky md:top-0">
        <SidebarContent />
      </aside>
    </>
  );
}
