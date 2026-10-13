"use client";
// Open/download helpers. A tab is opened synchronously (inside the click) so popup blockers allow it,
// then pointed at the PDF once the backend returns it.
import { downloadBlob } from "@mgpl-diagnostics/client";

export async function openPdf(load: () => Promise<Blob>) {
  const tab = window.open("", "_blank");
  try {
    const blob = await load();
    const url = URL.createObjectURL(blob);
    if (tab) tab.location.href = url;
    else window.location.href = url;
    setTimeout(() => URL.revokeObjectURL(url), 120_000);
  } catch (e) {
    tab?.close();
    alert((e as Error).message);
  }
}

export async function savePdf(load: () => Promise<Blob>, fileName: string) {
  try {
    downloadBlob(await load(), fileName);
  } catch (e) {
    alert((e as Error).message);
  }
}
