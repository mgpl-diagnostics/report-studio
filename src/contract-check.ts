// Compile-time check that the client's contract types match what the backend kits accept/return.
// `npm run typecheck` fails here if the client and the kits drift apart.
import type * as C from "@mgpl-diagnostics/client";
import type * as I from "@mgpl-diagnostics/invoice-kit";
import type * as K from "@mgpl-diagnostics/report-kit";

type Assert<T extends true> = T;
type Extends<A, B> = [A] extends [B] ? true : false;

// what the client sends must be accepted by the server
export type PatientIn = Assert<Extends<C.Patient, K.Patient>>;
export type InvoiceIn = Assert<Extends<C.InvoiceInput, I.BuildInvoiceInput>>;
export type PaymentIn = Assert<Extends<C.Payment, I.Payment>>;
export type ItemIn = Assert<Extends<C.InvoiceItem, I.InvoiceItem>>;
export type VariantIn = Assert<Extends<C.ReportVariant, K.ReportVariant>>;
export type DesignIn = Assert<Extends<C.ReportDesign, K.ReportDesign>>;
// what the server returns must satisfy the client's types
export type CatalogOut = Assert<Extends<K.TemplateCatalog, C.TemplateCatalog>>;
export type TotalsOut = Assert<Extends<ReturnType<typeof I.invoiceTotalsJson>, C.InvoiceTotals>>;
export type SampleOut = Assert<Extends<K.SampleInfo, C.SampleInfo>>;
