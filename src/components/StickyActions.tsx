"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

/**
 * Compact mobile action bar. Hidden while a form field has focus (so it never
 * sits over the on-screen keyboard) and when the visitor is already at a form.
 */
export function StickyActions() {
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const isField = (el: EventTarget | null) =>
      el instanceof HTMLElement && el.matches("input, textarea, select, [contenteditable]");
    const onIn = (e: FocusEvent) => isField(e.target) && setHidden(true);
    const onOut = () => setTimeout(() => setHidden(isField(document.activeElement)), 50);
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);

    const forms = document.querySelectorAll("[data-lead-form]");
    let visibleForms = 0;
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) visibleForms += en.isIntersecting ? 1 : -1;
      document.documentElement.dataset.formInView = visibleForms > 0 ? "1" : "0";
    });
    forms.forEach((f) => io.observe(f));
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
      io.disconnect();
      document.documentElement.dataset.formInView = "0";
    };
  }, [pathname]);

  return (
    <div className="sticky-actions" data-hidden={hidden ? "1" : "0"}>
      <Link
        href="/tender-preparation#quote-form"
        className="btn btn-primary btn-sm"
        onClick={() => track("preparation_cta_clicked", { location: "mobile_bar" })}
      >
        Get a quote
      </Link>
      <Link
        href="/tender-sourcing#sourcing-form"
        className="btn btn-secondary btn-sm"
        onClick={() => track("sourcing_interest_started", { location: "mobile_bar" })}
      >
        Find tenders
      </Link>
    </div>
  );
}
