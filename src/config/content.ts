/** Customer-facing copy that is reused across pages. */

export const CTA = {
  primary: "Get a tender preparation quote",
  secondary: "Find suitable tenders",
  printing: "Request printing support",
  security: "Get help with a tender security",
} as const;

export const HERO = {
  heading: "Find suitable tenders. Prepare your bid with expert support.",
  body: "Understand the opportunity, organise the required documents and get professional help preparing your submission. We support Kenyan businesses with tender sourcing, expert-reviewed preparation and optional printing for physical bids.",
  reassurance: "Clear scope. Expert review. Fees agreed before preparation begins.",
};

export const SERVICES = [
  {
    id: "sourcing",
    title: "Find suitable opportunities",
    body: "Tell us what your business supplies and where you operate. Register your interest in tailored tender sourcing and concise requirements briefs, so you can assess opportunities before committing to a bid.",
    cta: CTA.secondary,
    href: "/tender-sourcing#sourcing-form",
    more: "/tender-sourcing",
    icon: "search",
  },
  {
    id: "preparation",
    title: "Prepare your tender",
    body: "Already found an opportunity? Get help reviewing the requirements, organising supporting evidence, completing the prescribed forms and preparing a submission for expert review.",
    cta: CTA.primary,
    href: "/tender-preparation#quote-form",
    more: "/tender-preparation",
    icon: "document",
  },
  {
    id: "security",
    title: "Arrange your tender security",
    body: "Need a bid bond or bank guarantee? We read exactly what the tender requires, deal with your chosen bank or insurer on your behalf, and check the issued security matches before you submit.",
    cta: CTA.security,
    href: "/tender-security-support#quote-form",
    more: "/tender-security-support",
    icon: "shield",
  },
  {
    id: "printing",
    title: "Print and package your bid",
    body: "For physical submissions, request printing, binding and packaging to match the tender instructions. Delivery or submission assistance is scoped separately where available.",
    cta: CTA.printing,
    href: "/printing-and-submission-support#quote-form",
    more: "/printing-and-submission-support",
    icon: "print",
  },
] as const;

export const STEPS = [
  {
    title: "Share the opportunity",
    body: "Send the tender reference or official link, deadline and a short description of the help you need.",
  },
  {
    title: "Agree the scope",
    body: "We review the request, identify initial information gaps and provide a written quotation and proposed delivery schedule.",
  },
  {
    title: "Prepare and review",
    body: "You supply the required evidence; we prepare the agreed documents and check the work against the issued tender and relevant addenda.",
  },
  {
    title: "Approve and receive",
    body: "You review and approve the final package. Receive the agreed files, with physical preparation or submission assistance where separately arranged.",
  },
];

export const QUALITY_CONTROLS = [
  {
    title: "Work from the issued tender",
    body: "We prepare against the tender document as issued, together with any addenda or clarifications published for it.",
  },
  {
    title: "Preserve prescribed forms",
    body: "Forms the procuring entity prescribes are completed in their required format, not redesigned or replaced.",
  },
  {
    title: "Map claims to evidence",
    body: "Every statement about experience, capacity or compliance is tied to evidence you supply. Gaps are flagged, never filled with invented material.",
  },
  {
    title: "Check consistency and arithmetic",
    body: "Names, dates, references and figures are checked for consistency across documents, and financial schedules are checked for arithmetic.",
  },
  {
    title: "Expert review, then your approval",
    body: "An expert reviews the package before delivery, and nothing is final until you have reviewed and approved it.",
  },
];

export const AI_STATEMENT = "We use AI tools to assist internal preparation, with expert review before delivery.";

export const CONFIDENTIALITY = [
  "Your company’s documents are kept separate from other clients’ information and used only for your assignment.",
  "Access is limited to the people working on your request.",
  "We ask for supporting documents only after the scope is agreed, through a secure channel we confirm with you.",
];

export const FAQS = [
  {
    q: "Can you help with a tender I found elsewhere?",
    a: "Yes. Share the official tender link or reference, deadline and the support you need. We will assess the scope before quoting.",
  },
  {
    q: "Do I need to subscribe to sourcing before requesting preparation?",
    a: "No. You can request preparation for a specific tender independently. Sourcing and preparation are separate services.",
  },
  {
    q: "What does the preparation fee cover?",
    a: "Your quotation will specify the documents and work included, the review process, the delivery schedule and any separate charges. Fees depend on the assignment.",
  },
  {
    q: "Do you guarantee that I will win?",
    a: "No. The procuring entity evaluates and awards the tender. Our role is to help you prepare an evidence-supported submission against the issued requirements.",
  },
  {
    q: "What if some documents are missing?",
    a: "We identify gaps and explain what you need to provide. We do not invent experience, qualifications, certificates or supporting evidence.",
  },
  {
    q: "Do you use AI?",
    a: "We use AI tools to assist internal preparation. Expert review remains part of the service before documents are delivered.",
  },
  {
    q: "Can you provide the tender security for me?",
    a: "No. Tender and performance securities are issued by a bank, insurer or other institution the tender accepts, under its own approval, charges and any collateral it requires. We help you understand what the tender asks for, prepare the application and check the issued document matches the tender wording before you submit it.",
  },
  {
    q: "Can you print and submit the tender?",
    a: "Printing, binding and packaging can be quoted for physical bids. Any delivery or submission assistance must be agreed separately and follow the tender’s instructions.",
  },
  {
    q: "Can you handle an urgent deadline?",
    a: "Share the exact deadline and available documents. We will confirm whether the work is feasible before accepting it; submitting an inquiry does not reserve capacity.",
  },
];

/** Illustrative only. No real procuring entity, tender or deadline. */
export const SAMPLE_BRIEF = {
  title: "Supply and delivery of office furniture (example)",
  meta: [
    { label: "Procuring entity", value: "Example County Agency (fictional)" },
    { label: "Reference", value: "EXAMPLE/REF/001" },
    { label: "Closing time", value: "Shown in East Africa Time on a real brief" },
    { label: "Submission method", value: "As stated in the tender (e.g. e-procurement portal or physical)" },
  ],
  rows: [
    {
      requirement: "Valid tax compliance certificate",
      source: "Mandatory requirements, item 3 (example)",
      evidence: "Current certificate in the company’s name",
      action: "Client to confirm validity date",
    },
    {
      requirement: "Similar supply contracts in the last 3 years",
      source: "Technical evaluation, criterion 2 (example)",
      evidence: "Contracts, LPOs or completion letters",
      action: "Client to share two or more references",
    },
    {
      requirement: "Prescribed price schedule",
      source: "Section on price schedules (example)",
      evidence: "Completed schedule in the issued format",
      action: "Prepare and check arithmetic",
    },
    {
      requirement: "Bid security, if required",
      source: "Instructions to tenderers (example)",
      evidence: "Form and amount as specified",
      action: "Unknown: confirm in the issued document",
    },
  ],
};

export const NAV = [
  { href: "/tender-preparation", label: "Tender preparation", short: "Preparation" },
  { href: "/tender-sourcing", label: "Tender sourcing", short: "Sourcing" },
  { href: "/tender-security-support", label: "Tender security support", short: "Securities" },
  { href: "/printing-and-submission-support", label: "Printing and submission", short: "Printing" },
  { href: "/#pricing", label: "Pricing", short: "Pricing" },
  { href: "/contact", label: "Contact", short: "Contact" },
];

/** Select FAQs by the start of their question, in the given order. */
export function faqs(...starts: string[]) {
  return starts.map((s) => FAQS.find((f) => f.q.startsWith(s))!).filter(Boolean);
}

/** Plan positioning lines. Prices and inclusions live in src/config/site.ts. */
export const PLAN_COPY: Record<"starter" | "growth" | "pro", { forWho: string; whatsapp: string }> = {
  starter: { forWho: "For focused suppliers watching a few categories.", whatsapp: "Hello, I would like to ask about the TenderPro Starter plan." },
  growth: { forWho: "For businesses that bid every month.", whatsapp: "Hello, I would like to ask about the TenderPro Growth plan." },
  pro: { forWho: "For firms running a full bid pipeline.", whatsapp: "Hello, I would like to ask about the TenderPro Pro plan." },
};
