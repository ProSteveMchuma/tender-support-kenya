import type { Metadata, Viewport } from "next";
import { Newsreader, Public_Sans } from "next/font/google";
import { site } from "@/config/site";
import { checkReadiness, hasLeadDestination, isIndexable } from "@/lib/readiness";
import { siteUrl } from "@/lib/seo";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PreviewNotice } from "@/components/PreviewNotice";
import { StickyActions } from "@/components/StickyActions";
import { AttributionCapture } from "@/components/AttributionCapture";
import "./globals.css";

const display = Newsreader({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600"], display: "swap" });
const body = Public_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

// Guard: production mode cannot ship while readiness checks fail.
if (site.productionMode) {
  const r = checkReadiness(site, process.env);
  if (!r.ready && process.env.NEXT_PHASE === "phase-production-build") {
    throw new Error(
      "productionMode is true but readiness checks fail: " + r.items.filter((i) => !i.ok).map((i) => i.label).join("; "),
    );
  }
}

const indexable = isIndexable(site, process.env);
const base = siteUrl();

export const metadata: Metadata = {
  ...(base ? { metadataBase: new URL(base) } : {}),
  title: { default: `${site.name} | Tender sourcing and bid preparation in Kenya`, template: `%s | ${site.name}` },
  description: site.shortDescription,
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = { themeColor: "#f7f3ea", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <html lang="en-KE" className={`${display.variable} ${body.variable}`}>
      <head>
        {plausible && indexable && (
          <script defer data-domain={plausible} src="https://plausible.io/js/script.tagged-events.js" />
        )}
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <PreviewNotice formsLive={hasLeadDestination(process.env)} />
        <Header />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
        <StickyActions />
        <AttributionCapture />
      </body>
    </html>
  );
}
