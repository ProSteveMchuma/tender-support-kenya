"use client";
import Link from "next/link";
import { track, type AnalyticsEvent } from "@/lib/analytics";
import { Icon } from "./Icon";

export function CtaLink({
  href,
  children,
  variant = "primary",
  event,
  location,
  arrow = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "link";
  event?: AnalyticsEvent;
  location: string;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`btn btn-${variant} ${className}`}
      onClick={() => event && track(event, { location })}
    >
      <span>{children}</span>
      {arrow && <Icon name="arrow" size={18} />}
    </Link>
  );
}
