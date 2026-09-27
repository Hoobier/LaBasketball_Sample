"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import CartSheet from "@/app/components/CartSheet";
import { useAuth } from "@/app/contexts/AuthContext";
import { useCart } from "@/app/contexts/CartContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Courts", href: "#courts" },
  { label: "Gear", href: "#gear" },
  { label: "Venues", href: "#venues" },
  { label: "Membership", href: "#membership" },
];

// Hydration-safe "mounted" detection (server renders false, client true)
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function LandingNav() {
  const { token } = useAuth();
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
        {/* Brand */}
<Link href="/" className="flex items-center gap-2.5">
            <span className="font-display text-lg uppercase tracking-wide max-[400px]:hidden">
              L.A Basketball
            </span>
        </Link>

        {/* Center links */}
        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-court text-[10px] font-bold text-black">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Button>

          {mounted && token ? (
            <Button nativeButton={false} render={<Link href="/dashboard" />} className="hidden sm:inline-flex">
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                nativeButton={false}
                render={<Link href="/login" />}
                className="hidden sm:inline-flex"
              >
                Sign in
              </Button>
              <Button nativeButton={false} render={<Link href="/signup" />} className="bg-court text-black hover:bg-court/90">
                Join
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-border/60 bg-background px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {link.label}
              </a>
            ))}
            {mounted && token ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:hidden"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:hidden"
              >
                Sign in
              </Link>
            )}
          </div>
        </nav>
      )}

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}
