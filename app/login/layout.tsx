import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - L.A Basketball",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
