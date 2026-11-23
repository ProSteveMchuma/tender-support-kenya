"use client";
import { whatsappLink } from "@/config/site";
import { track } from "@/lib/analytics";

export function WhatsAppLink({ children, location, className }: { children: React.ReactNode; location: string; className?: string }) {
  const href = whatsappLink();
  if (!href) return null;
  return (
    <a href={href} className={className} rel="noopener noreferrer" target="_blank" onClick={() => track("whatsapp_clicked", { location })}>
      {children}
    </a>
  );
}
