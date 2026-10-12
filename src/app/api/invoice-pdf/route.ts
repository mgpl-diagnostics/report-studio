import type { NextRequest } from "next/server";
import { INVOICE_SAMPLES, type Invoice } from "@mgpl-diagnostics/invoice-kit";
import { renderInvoicePdf } from "@mgpl-diagnostics/invoice-kit/pdf";
import type { ReportVariant } from "@mgpl-diagnostics/report-kit";

export const runtime = "nodejs";

const variantOf = (v: unknown): ReportVariant => (v === "non-header" ? "non-header" : "header");

function pdfResponse(pdf: Buffer, fileName: string, download: boolean) {
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${fileName.replace(/[^\w.-]+/g, "_")}"`,
      "Cache-Control": "no-store",
    },
  });
}

/** GET /api/invoice-pdf?sample=paid&variant=header[&download=1] — demo invoices */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const s = INVOICE_SAMPLES.find((x) => x.id === (q.get("sample") ?? "paid"));
  if (!s) return new Response("Unknown sample", { status: 404 });
  const variant = variantOf(q.get("variant"));
  return pdfResponse(await renderInvoicePdf({ invoice: s.invoice, variant }), `${s.invoice.invoiceNo}-${variant}.pdf`, q.get("download") === "1");
}

/** POST /api/invoice-pdf  body: { invoice: Invoice, variant?: "header" | "non-header" } */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as { invoice?: Invoice; variant?: ReportVariant };
  if (!body.invoice?.invoiceNo || !Array.isArray(body.invoice.items)) {
    return new Response("Body must be { invoice: { invoiceNo, patient, items, … }, variant }", { status: 400 });
  }
  const variant = variantOf(body.variant);
  return pdfResponse(await renderInvoicePdf({ invoice: body.invoice, variant }), `${body.invoice.invoiceNo}.pdf`, true);
}
