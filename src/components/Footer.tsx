import Link from "next/link";
import { site, whatsappDisplay, whatsappLink } from "@/config/site";
import { NAV } from "@/config/content";
import { WhatsAppLink } from "./WhatsAppLink";

export function Footer() {
  const c = site.contact;
  const wa = whatsappLink();
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <p className="footer-name">{site.name}</p>
          <p className="muted">{site.founderLine}</p>
          <p className="muted small">
            Tender sourcing, expert-reviewed preparation and optional printing support for businesses in Kenya. We do not
            guarantee eligibility or award; the procuring entity evaluates every bid.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="footer-heading">Services</p>
          <ul>
            {NAV.filter((n) => !n.href.includes("#")).map((n) => (
              <li key={n.href}>
                <Link href={n.href}>{n.label}</Link>
              </li>
            ))}
            <li><Link href="/privacy">Privacy notice</Link></li>
            <li><Link href="/terms">Service terms</Link></li>
          </ul>
        </nav>
        <div>
          <p className="footer-heading">Contact</p>
          <ul>
            {c.email && <li><a href={`mailto:${c.email}`}>{c.email}</a></li>}
            {c.phone && <li><a href={`tel:${c.phone}`}>{c.phone}</a></li>}
            {wa && <li><WhatsAppLink location="footer">WhatsApp {whatsappDisplay()}</WhatsAppLink></li>}
            {c.hours && <li className="muted">{c.hours}</li>}
            {c.registeredAddress && <li className="muted">{c.registeredAddress}</li>}
            <li><Link href="/contact">Send a request online</Link></li>
          </ul>
        </div>
      </div>
      <div className="wrap footer-base small muted">
        © {year} {site.legalEntity ?? site.name}
      </div>
    </footer>
  );
}
