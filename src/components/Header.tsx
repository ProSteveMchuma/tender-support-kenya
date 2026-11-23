"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/config/site";
import { CTA, NAV } from "@/config/content";
import { track } from "@/lib/analytics";
import { Icon } from "./Icon";

/** Pages without the request form send the header CTA to /contact. */
export function quoteHref(pathname: string) {
  return ["/privacy", "/terms"].includes(pathname) ? "/contact#quote-form" : "#quote-form";
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header" data-scrolled={scrolled ? "1" : "0"} data-open={open ? "1" : "0"}>
      <div className="wrap header-row">
        <Link href="/" className="wordmark" aria-label={`${site.name}, home`}>
          <span className="wordmark-mark" aria-hidden="true">
            <svg viewBox="0 0 28 28" width="26" height="26">
              <rect x="1" y="1" width="26" height="26" rx="8" fill="var(--navy)" />
              <path d="M9 9h8M9 13h8M9 17h5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="19.5" cy="18.5" r="4" fill="var(--teal-bright)" />
              <path d="m17.8 18.5 1.2 1.2 2.2-2.3" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>{site.name}</span>
        </Link>

        <nav aria-label="Main" className="nav-desktop">
          <ul>
            {NAV.filter((n) => n.short !== "Contact").map((n) => (
              <li key={n.href}>
                <Link href={n.href} aria-current={pathname === n.href ? "page" : undefined}>{n.short}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href={quoteHref(pathname)}
          className="btn btn-primary btn-sm header-cta"
          onClick={() => track("preparation_cta_clicked", { location: "header" })}
        >
          {CTA.primary}
        </Link>

        <button
          ref={btn}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>

      <nav id="mobile-nav" aria-label="Main" className="nav-mobile" hidden={!open}>
        <ul className="wrap">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link href={n.href} aria-current={pathname === n.href ? "page" : undefined} onClick={() => setOpen(false)}>
                {n.label}
                <Icon name="arrow" size={18} />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
