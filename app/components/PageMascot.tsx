"use client";

import { Mascot } from "page-mascot";
import { cn } from "@/lib/utils";

interface PageMascotProps {
  /** "fixed" pins it to the viewport corner; "inline" sits it in the flow. */
  placement?: "fixed" | "inline";
  size?: number;
  className?: string;
}

export default function PageMascot({
  placement = "fixed",
  size = 120,
  className,
}: PageMascotProps) {
  const mascot = (
    <Mascot
      directions="/mascots/hoops-directions.svg"
      reactions="/mascots/hoops-reactions.svg"
      size={size}
      label="Hoops the L.A. Basketball mascot"
      className="drop-shadow-[0_18px_28px_rgba(0,0,0,0.45)]"
    />
  );

  if (placement === "inline") {
    return (
      <div className={cn("flex justify-center", className)}>{mascot}</div>
    );
  }

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center sm:justify-end sm:px-6",
        className
      )}
    >
      <div className="pointer-events-auto -mb-1 sm:-mb-2">{mascot}</div>
    </div>
  );
}