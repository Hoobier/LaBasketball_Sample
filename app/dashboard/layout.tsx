import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard - L.A Basketball" };

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
