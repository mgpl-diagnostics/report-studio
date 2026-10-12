import Link from "next/link";
import { INVOICE_SAMPLES, InvoiceDocument } from "@mgpl-diagnostics/invoice-kit";
import type { ReportVariant } from "@mgpl-diagnostics/report-kit";
import { PrintButton } from "../PrintButton";

export const metadata = { title: "Invoices — MGPL Report Studio" };
type Search = Promise<{ sample?: string; variant?: string }>;

export default async function InvoicePage({ searchParams }: { searchParams: Search }) {
  const q = await searchParams;
  const sample = INVOICE_SAMPLES.find((s) => s.id === q.sample) ?? INVOICE_SAMPLES[0];
  const variant: ReportVariant = q.variant === "non-header" ? "non-header" : "header";
  const href = (id: string, v: ReportVariant) => `/invoice?sample=${id}&variant=${v}`;
  const pdf = `/api/invoice-pdf?sample=${sample.id}&variant=${variant}`;
  return (
    <div className="app">
      <aside className="sidebar">
        <h1>MGPL Report Studio</h1>
        <p>
          <Link href="/">← Reports</Link>
        </p>
        <nav aria-label="Invoices">
          <h2>Invoices</h2>
          {INVOICE_SAMPLES.map((s) => (
            <Link key={s.id} href={href(s.id, variant)} aria-current={s.id === sample.id ? "page" : undefined}>
              {s.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="main">
        <div className="toolbar">
          <div className="seg" role="group" aria-label="Variant">
            <Link href={href(sample.id, "header")} aria-current={variant === "header"}>
              Header
            </Link>
            <Link href={href(sample.id, "non-header")} aria-current={variant === "non-header"}>
              Non-header
            </Link>
          </div>
          <span className="spacer" />
          <PrintButton />
          <a className="btn secondary" href={pdf} target="_blank" rel="noreferrer">
            Open PDF
          </a>
          <a className="btn" href={`${pdf}&download=1`}>
            Download PDF
          </a>
          <div className="meta">
            {sample.invoice.invoiceNo} · {sample.label} · sample prices — edit the price list in invoice-kit
          </div>
        </div>
        <div className="preview">
          <InvoiceDocument invoice={sample.invoice} variant={variant} />
        </div>
      </main>
    </div>
  );
}
