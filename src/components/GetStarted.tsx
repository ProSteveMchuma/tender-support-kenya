"use client";
import { useEffect, useState } from "react";
import { whatsappDisplay } from "@/config/site";
import type { QuoteService } from "@/lib/validation";
import { Icon } from "./Icon";
import { WhatsAppLink } from "./WhatsAppLink";
import { QuoteForm } from "./forms/QuoteForm";
import { SourcingForm } from "./forms/SourcingForm";

type Tab = "quote" | "sourcing";

/**
 * One calm place to start: a two-way switch between the quote request and
 * sourcing interest, one form on screen at a time.
 * #quote-form and #sourcing-form both land here and select the matching tab.
 */
export function GetStarted({
  defaultTab = "quote",
  defaultService,
  title = "Tell us what you need",
  intro = "It takes about two minutes. An official tender link is enough to start, and no account is needed.",
}: {
  defaultTab?: Tab;
  defaultService?: QuoteService;
  title?: string;
  intro?: string;
}) {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const wa = whatsappDisplay();

  useEffect(() => {
    const sync = () => {
      if (location.hash === "#sourcing-form") setTab("sourcing");
      if (location.hash === "#quote-form") setTab("quote");
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: "quote", label: "Get a quote" },
    { id: "sourcing", label: "Find tenders" },
  ];

  return (
    <section className="band get-started" aria-labelledby="get-started-h">
      <span id="quote-form" className="anchor" />
      <span id="sourcing-form" className="anchor" />
      <div className="wrap">
        <div className="section-head center-head">
          <h2 id="get-started-h">{title}</h2>
          <p className="lede">{intro}</p>
        </div>

        <div className="gs-card">
          <div className="gs-tabs" role="tablist" aria-label="Choose a request type">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                type="button"
                id={`tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`panel-${t.id}`}
                tabIndex={tab === t.id ? 0 : -1}
                onClick={() => setTab(t.id)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    const next = tab === "quote" ? "sourcing" : "quote";
                    setTab(next);
                    requestAnimationFrame(() => document.getElementById(`tab-${next}`)?.focus());
                  }
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="gs-panel">
            {tab === "quote" ? <QuoteForm defaultService={defaultService} /> : <SourcingForm />}
          </div>
        </div>

        {wa && (
          <p className="gs-alt">
            <Icon name="chat" size={18} /> Prefer to chat?{" "}
            <WhatsAppLink location="get_started">Message us on WhatsApp, {wa}</WhatsAppLink>
          </p>
        )}
      </div>
    </section>
  );
}
