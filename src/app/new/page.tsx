"use client";
// FRONTEND page: a result-entry form generated from GET /templates, with a live backend preview.
// Shows how an app builds its own UI on @mgpl-diagnostics/client — the kits never render this form.
import { useEffect, useMemo, useRef, useState } from "react";
import type { Patient, ReportRequest, ReportVariant, Results, TemplateInfo } from "@mgpl-diagnostics/client";
import { HtmlFrame, useReportHtml, useTemplates, type HtmlFrameHandle } from "@mgpl-diagnostics/client/react";
import { Nav } from "@/components/Nav";
import { openPdf, savePdf } from "@/components/pdf-actions";
import { Segmented } from "@/components/Segmented";
import { mgpl } from "@/lib/mgpl";

const EMPTY_PATIENT: Patient = { title: "Mr", name: "", age: "", sex: "Male", patientId: "", refDoctor: "Self", sampleId: "" };

/** debounce a value so the preview doesn't re-render on every keystroke */
function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return v;
}

export default function NewReportPage() {
  const catalog = useTemplates(mgpl);
  const [patient, setPatient] = useState<Patient>(EMPTY_PATIENT);
  const [selected, setSelected] = useState<string[]>(["cbc"]);
  const [results, setResults] = useState<Record<string, Results>>({});
  const [variant, setVariant] = useState<ReportVariant>("header");
  const frame = useRef<HtmlFrameHandle>(null);

  // /new?demo fills the form with fictional data (used for screenshots and demos)
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("demo")) return;
    setPatient({ title: "Mrs", name: "Kavita Sharma", age: "32", sex: "Female", patientId: "MGPL1025", refDoctor: "Self", sampleId: "S2610120398" });
    setSelected(["hb", "blood-sugar"]);
    setResults({ hb: { hb: "10.8" }, "blood-sugar": { bsf: "96", bspp: "182" } });
  }, []);

  const byCategory = useMemo(() => {
    const m = new Map<string, TemplateInfo[]>();
    for (const t of catalog.data?.templates ?? []) m.set(t.category ?? "Other", [...(m.get(t.category ?? "Other") ?? []), t]);
    return [...m.entries()];
  }, [catalog.data]);

  const ready = patient.name.trim() && String(patient.age).trim() && selected.length > 0;
  const request: ReportRequest | null = ready
    ? { patient: { ...patient, age: Number(patient.age) || patient.age }, tests: selected.map((id) => ({ template: id, results: results[id] ?? {} })), variant }
    : null;
  const debounced = useDebounced(request, 600);
  const preview = useReportHtml(mgpl, debounced);

  const setField = (tpl: string, key: string, value: string) => setResults((r) => ({ ...r, [tpl]: { ...r[tpl], [key]: value } }));
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const p = (k: keyof Patient) => ({
    value: String(patient[k] ?? ""),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setPatient({ ...patient, [k]: e.target.value }),
  });

  return (
    <>
      <Nav active="/new" />
      <div className="app builder">
        <aside className="sidebar form">
          <h2>Patient</h2>
          <div className="grid2">
            <label>
              Title
              <select {...p("title")}>
                {["Mr", "Mrs", "Ms", "Master", "Ku", "Baby"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label>
              Name
              <input {...p("name")} placeholder="Full name" />
            </label>
            <label>
              Age
              <input {...p("age")} inputMode="numeric" placeholder="Years" />
            </label>
            <label>
              Sex
              <select {...p("sex")}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Patient ID
              <input {...p("patientId")} placeholder="MGPL1234" />
            </label>
            <label>
              Sample ID
              <input {...p("sampleId")} />
            </label>
            <label className="wide">
              Ref. doctor
              <input {...p("refDoctor")} />
            </label>
          </div>

          <h2>Tests</h2>
          {catalog.error && <p className="error">{catalog.error.message}</p>}
          {byCategory.map(([cat, tpls]) => (
            <details key={cat} open={cat === "Hematology"}>
              <summary>{cat}</summary>
              {tpls.map((t) => (
                <label key={t.id} className="check">
                  <input type="checkbox" checked={selected.includes(t.id)} onChange={() => toggle(t.id)} /> {t.name}
                </label>
              ))}
            </details>
          ))}

          {selected.map((id) => {
            const t = catalog.data?.templates.find((x) => x.id === id);
            if (!t) return null;
            return (
              <fieldset key={id}>
                <legend>{t.name}</legend>
                {t.fields.map((f) => (
                  <label key={f.key} className="result">
                    <span>{f.label}</span>
                    <input value={String(results[id]?.[f.key] ?? "")} onChange={(e) => setField(id, f.key, e.target.value)} placeholder={Array.isArray(f.range) ? f.range[0] : f.range} />
                    <small>{f.unit}</small>
                  </label>
                ))}
              </fieldset>
            );
          })}
        </aside>

        <main className="main">
          <div className="toolbar">
            <Segmented value={variant} onChange={setVariant} options={[["header", "Header"], ["non-header", "Non-header"]]} label="Variant" />
            <span className="spacer" />
            <button className="btn secondary" disabled={!request} onClick={() => frame.current?.print()}>
              Print
            </button>
            <button className="btn secondary" disabled={!request} onClick={() => request && openPdf(() => mgpl.reports.pdf(request))}>
              Open PDF
            </button>
            <button className="btn" disabled={!request} onClick={() => request && savePdf(() => mgpl.reports.pdf(request), `${patient.patientId || "report"}.pdf`)}>
              Download PDF
            </button>
            <div className="meta">{!request ? "Enter name, age and pick at least one test" : preview.loading ? "rendering…" : "Live preview — rendered by the backend"}</div>
          </div>
          {preview.error && <p className="error">{preview.error.message}</p>}
          <div className="preview">{debounced && preview.data && <HtmlFrame ref={frame} html={preview.data} title="Report preview" />}</div>
        </main>
      </div>
    </>
  );
}
