import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-hero">
      <div className="wrap narrow">
        <p className="kicker">Page not found</p>
        <h1>We could not find that page</h1>
        <p className="lede">The link may be out of date. You can start from the home page or send us a request.</p>
        <div className="hero-actions">
          <Link className="btn btn-primary" href="/">Go to the home page</Link>
          <Link className="btn btn-secondary" href="/contact">Contact us</Link>
        </div>
      </div>
    </section>
  );
}
