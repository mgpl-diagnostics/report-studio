"use client";
// FRONTEND page: blank letterhead from the backend (print it borderless to make stationery).
import { useRef } from "react";
import { HtmlFrame, useAsync, type HtmlFrameHandle } from "@mgpl-diagnostics/client/react";
import { Nav } from "@/components/Nav";
import { mgpl } from "@/lib/mgpl";

export default function LetterheadPage() {
  const html = useAsync(() => mgpl.reports.letterheadHtml(), "letterhead");
  const frame = useRef<HtmlFrameHandle>(null);
  return (
    <>
      <Nav active="/letterhead" />
      <main className="main">
        <div className="toolbar">
          <span className="spacer" />
          <button className="btn secondary" onClick={() => frame.current?.print()}>
            Print
          </button>
          <a className="btn secondary" href={mgpl.reports.letterheadUrl()} target="_blank" rel="noreferrer">
            Open PDF
          </a>
          <a className="btn" href={mgpl.reports.letterheadUrl(true)}>
            Download PDF
          </a>
          <div className="meta">Sidebar + header + footer only. Print with Borderless on; then print reports with the Non-header variant on it.</div>
        </div>
        {html.error && <p className="error">{html.error.message}</p>}
        <div className="preview">{html.data && <HtmlFrame ref={frame} html={html.data} title="Letterhead" />}</div>
      </main>
    </>
  );
}
