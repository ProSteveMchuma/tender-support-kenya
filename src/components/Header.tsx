"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/config/site";
import { CTA, NAV } from "@/config/content";
import { track } from "@/lib/analytics";
import { Icon } from "./Icon";


export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);
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
    <header className="site-header">
      <div className="wrap header-row">
        <Link href="/" className="wordmark" aria-label={`${site.name}, home`}>
          <span className="wordmark-mark" aria-hidden="true">
            <svg viewBox="0 0 28 28" width="28" height="28">
              <rect x="4" y="3" width="17" height="22" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M8 10h9M8 14h9M8 18h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="21" cy="20" r="5" fill="var(--teal)" />
              <path d="m18.8 20 1.5 1.5 2.8-2.9" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>{site.name}</span>
        </Link>

        <nav aria-label="Main" className="nav-desktop">
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} aria-current={pathname === n.href ? "page" : undefined}>
                  {n.short}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/tender-preparation#quote-form"
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
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? "close" : "menu"} />
          <span>{open ? "Close" : "Menu"}</span>
        </button>
      </div>

      <nav id="mobile-nav" aria-label="Main" className="nav-mobile" hidden={!open}>
        <ul className="wrap">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link href={n.href} aria-current={pathname === n.href ? "page" : undefined} onClick={() => setOpen(false)}>
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
