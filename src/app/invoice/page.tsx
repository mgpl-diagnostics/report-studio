"use client";
// FRONTEND page: invoices rendered by the backend, shown with the studio's own UI.
import { useRef, useState } from "react";
import type { ReportVariant } from "@mgpl-diagnostics/client";
import { HtmlFrame, useAsync, useInvoiceHtml, type HtmlFrameHandle } from "@mgpl-diagnostics/client/react";
import { Nav } from "@/components/Nav";
import { openPdf, savePdf } from "@/components/pdf-actions";
import { Segmented } from "@/components/Segmented";
import { mgpl } from "@/lib/mgpl";

export default function InvoicePage() {
  const samples = useAsync(() => mgpl.invoices.samples(), "invoice-samples");
  const [sample, setSample] = useState("paid");
  const [variant, setVariant] = useState<ReportVariant>("header");
  const request = { sample, variant };
  const preview = useInvoiceHtml(mgpl, request);
  const frame = useRef<HtmlFrameHandle>(null);
  const current = samples.data?.find((s) => s.id === sample);
  return (
    <>
      <Nav active="/invoice" />
      <div className="app">
        <aside className="sidebar">
          <nav aria-label="Invoices">
            <h2>Sample invoices</h2>
            {samples.data?.map((s) => (
              <button key={s.id} className="navitem" aria-current={s.id === sample ? "page" : undefined} onClick={() => setSample(s.id)}>
                {s.label}
              </button>
            ))}
          </nav>
        </aside>
        <main className="main">
          <div className="toolbar">
            <Segmented value={variant} onChange={setVariant} options={[["header", "Header"], ["non-header", "Non-header"]]} label="Variant" />
            <span className="spacer" />
            <button className="btn secondary" onClick={() => frame.current?.print()}>
              Print
            </button>
            <button className="btn secondary" onClick={() => openPdf(() => mgpl.invoices.pdf(request))}>
              Open PDF
            </button>
            <button className="btn" onClick={() => savePdf(() => mgpl.invoices.pdf(request), `${current?.invoiceNo ?? sample}.pdf`.replace(/\//g, "-"))}>
              Download PDF
            </button>
            <div className="meta">
              {current?.invoiceNo} {current && `· ${current.label}`} · sample prices{preview.loading && " · rendering…"}
            </div>
          </div>
          {preview.error && <p className="error">{preview.error.message}</p>}
          <div className="preview">{preview.data && <HtmlFrame ref={frame} html={preview.data} title="Invoice preview" />}</div>
        </main>
      </div>
    </>
  );
}
