"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { whatsappLink } from "@/config/site";
import { track } from "@/lib/analytics";
import { quoteHref } from "./Header";
import { Icon } from "./Icon";

/**
 * Compact mobile action bar. Hidden while a form field has focus (so it never
 * sits over the on-screen keyboard) and while a request form is on screen.
 */
export function StickyActions() {
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const wa = whatsappLink();

  useEffect(() => {
    const isField = (el: EventTarget | null) =>
      el instanceof HTMLElement && el.matches("input, textarea, select, [contenteditable]");
    const onIn = (e: FocusEvent) => isField(e.target) && setHidden(true);
    const onOut = () => setTimeout(() => setHidden(isField(document.activeElement)), 50);
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);

    // Hide the bar while the page's own actions (hero buttons or the form) are on screen.
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) en.isIntersecting ? seen.add(en.target) : seen.delete(en.target);
      document.documentElement.dataset.formInView = seen.size > 0 ? "1" : "0";
    });
    document.querySelectorAll(".gs-card, .hero-actions").forEach((f) => io.observe(f));
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
      io.disconnect();
      document.documentElement.dataset.formInView = "0";
    };
  }, [pathname]);

  return (
    <div className="sticky-actions" data-hidden={hidden ? "1" : "0"} data-single={wa ? "0" : "1"}>
      <Link
        href={quoteHref(pathname)}
        className="btn btn-primary btn-sm"
        onClick={() => track("preparation_cta_clicked", { location: "mobile_bar" })}
      >
        Get a quote
      </Link>
      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm"
          onClick={() => track("whatsapp_clicked", { location: "mobile_bar" })}
        >
          <Icon name="chat" size={18} /> WhatsApp
        </a>
      )}
    </div>
  );
}
