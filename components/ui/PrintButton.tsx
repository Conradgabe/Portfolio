"use client";

import { Printer } from "lucide-react";

/** Triggers the browser print dialog → "Save as PDF" for an on-brand résumé export. */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 border border-line-strong bg-accent/10 px-3.5 py-2 font-mono text-[13px] text-ink transition-colors hover:bg-accent/20"
    >
      <Printer size={14} /> download PDF
    </button>
  );
}
