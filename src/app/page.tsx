"use client";
// FRONTEND page: only @mgpl-diagnostics/client is used here. The backend (/api/mgpl) renders.
import { useRef, useState } from "react";
import type { ReportDesign, ReportVariant, SampleInfo } from "@mgpl-diagnostics/client";
import { HtmlFrame, useAsync, useReportHtml, type HtmlFrameHandle } from "@mgpl-diagnostics/client/react";
import { Nav } from "@/components/Nav";
import { Segmented } from "@/components/Segmented";
import { openPdf, savePdf } from "@/components/pdf-actions";
import { mgpl } from "@/lib/mgpl";

const GROUPS: { key: SampleInfo["group"]; label: string }[] = [
  { key: "design", label: "From the Word designs" },
  { key: "template", label: "More tests" },
  { key: "profile", label: "Profiles" },
];

export default function ReportsPage() {
  const samples = useAsync(() => mgpl.reports.samples(), "samples");
  const [sample, setSample] = useState("cbc");
  const [variant, setVariant] = useState<ReportVariant>("header");
  const [design, setDesign] = useState<ReportDesign>("sidebar");
  const request = { sample, variant, design };
  const preview = useReportHtml(mgpl, request);
  const frame = useRef<HtmlFrameHandle>(null);
  const current = samples.data?.find((s) => s.id === sample);

  return (
    <>
      <Nav active="/" />
      <div className="app">
        <aside className="sidebar">
          {samples.error && <p className="error">{samples.error.message}</p>}
          {GROUPS.map((g) => (
            <nav key={g.key} aria-label={g.label}>
              <h2>{g.label}</h2>
              {samples.data
                ?.filter((s) => s.group === g.key)
                .map((s) => (
                  <button key={s.id} className="navitem" aria-current={s.id === sample ? "page" : undefined} onClick={() => setSample(s.id)}>
                    {s.label}
                  </button>
                ))}
            </nav>
          ))}
        </aside>
        <main className="main">
          <div className="toolbar">
            <Segmented value={design} onChange={setDesign} options={[["sidebar", "Navy Sidebar"], ["classic", "Classic"]]} label="Design" />
            <Segmented value={variant} onChange={setVariant} options={[["header", "Header"], ["non-header", "Non-header"]]} label="Variant" />
            <span className="spacer" />
            <button className="btn secondary" onClick={() => frame.current?.print()}>
              Print
            </button>
            <button className="btn secondary" onClick={() => openPdf(() => mgpl.reports.pdf(request))}>
              Open PDF
            </button>
            <button className="btn" onClick={() => savePdf(() => mgpl.reports.pdf(request), `${sample}-${design}-${variant}.pdf`)}>
              Download PDF
            </button>
            <div className="meta">
              {current ? `${current.label} · ${current.source}` : " "}
              {preview.loading && " · rendering…"}
            </div>
          </div>
          {preview.error && <p className="error">{preview.error.message}</p>}
          <div className="preview">{preview.data && <HtmlFrame ref={frame} html={preview.data} title="Report preview" />}</div>
        </main>
      </div>
    </>
  );
}
