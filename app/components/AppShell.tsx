"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import Sidebar from "./Sidebar";

const authRoutes = ["/login", "/signup"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
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
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <Toaster position="top-right" richColors />
    </div>
  );
}
