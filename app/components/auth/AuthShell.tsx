import Link from "next/link";
import { cn } from "@/lib/utils";
import Basketball from "@/app/components/landing/Basketball";
import CourtBackdrop from "@/app/components/landing/CourtBackdrop";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  tagline: string;
  artSide?: "left" | "right";
  children: React.ReactNode;
}

function BrandMark({ dark }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span
        className={cn(
          "font-display text-lg uppercase tracking-wide",
          dark && "text-white"
        )}
      >
        L.A Basketball
      </span>
    </Link>
  );
}

export default function AuthShell({
  eyebrow,
  title,
  tagline,
  artSide = "left",
  children,
}: AuthShellProps) {
  const art = (
    <div className="relative hidden overflow-hidden bg-black lg:block">
      <CourtBackdrop />
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-court/25 blur-[110px]"
        aria-hidden="true"
      />

      <div className="relative flex h-full flex-col justify-between p-10">
        <BrandMark dark />

        <div>
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-court">
            <span className="h-px w-10 bg-court" />
            {eyebrow}
          </p>
          <h1 className="whitespace-pre-line font-display text-[clamp(2.5rem,4vw,4.5rem)] leading-[0.9] uppercase text-white">
            {title}
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
            {tagline}
          </p>
        </div>

        <div className="flex items-end justify-between">
          <p className="text-xs uppercase tracking-widest text-white/40">
            LA Basketball · Hoops · Gear
          </p>
          <Basketball className="h-auto w-24 animate-float" />
        </div>
      </div>
    </div>
  );

  const form = (
    <div className="relative flex min-h-svh flex-col p-6 sm:p-10">
      <div className="lg:hidden">
        <BrandMark />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="grid min-h-svh bg-background lg:grid-cols-2">
      {artSide === "left" ? (
        <>
          {art}
          {form}
        </>
      ) : (
        <>
          {form}
          {art}
        </>
      )}
    </div>
  );
}
