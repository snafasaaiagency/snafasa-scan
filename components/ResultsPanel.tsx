"use client";

import { useState, useRef, useCallback } from "react";
import {
  Copy,
  Download,
  FileText,
  FileType2,
  Table2,
  Archive,
  CheckCircle2,
  RefreshCw,
  ChevronDown,
  Zap,
} from "lucide-react";
import { cn, copyToClipboard, downloadTextFile, exportAsDocx, exportAsPdf, exportAsCsv, timestampedFilename, formatMs } from "@/lib/utils";
import type { OcrResult } from "@/lib/ocr";
import type { PlanId } from "@/lib/config";
import { getTierDef } from "@/lib/config";

interface ResultsPanelProps {
  result: OcrResult;
  fileName: string;
  plan: PlanId;
  onReset: () => void;
}

export default function ResultsPanel({ result, fileName, plan, onReset }: ResultsPanelProps) {
  const [copied, setCopied] = useState(false);
  const [editableText, setEditableText] = useState(result.text);
  const [exportOpen, setExportOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const tier = getTierDef(plan);
  const baseName = timestampedFilename(fileName ? fileName.replace(/\.[^.]+$/, "") : "snafasascan_result");

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(editableText);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [editableText]);

  const handleDownloadTxt = () => downloadTextFile(editableText, `${baseName}.txt`);
  const handleDownloadDocx = () => exportAsDocx(editableText, baseName);
  const handleDownloadPdf = () => exportAsPdf(editableText, baseName);
  const handleDownloadCsv = () => exportAsCsv(editableText, baseName);

  const wordCount = editableText.trim() ? editableText.trim().split(/\s+/).length : 0;
  const charCount = editableText.length;

  return (
    <div className="card animate-fade-in overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "var(--color-border)", background: "var(--color-surface-2)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "hsl(142 72% 40% / 0.12)" }}
          >
            <CheckCircle2 className="h-4 w-4" style={{ color: "var(--color-success)" }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Text extracted successfully
            </p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {wordCount} words · {charCount} characters
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Confidence badge */}
          <span
            className={cn("badge text-xs", result.confidence >= 80 ? "badge-success" : result.confidence >= 60 ? "badge-warning" : "badge-error")}
          >
            <Zap className="h-2.5 w-2.5" />
            {result.confidence}% confidence
          </span>
          <span className="badge badge-muted text-xs">
            {formatMs(result.processingMs)}
          </span>
        </div>
      </div>

      {/* Editable text area */}
      <div className="relative p-5">
        <textarea
          ref={textareaRef}
          value={editableText}
          onChange={(e) => setEditableText(e.target.value)}
          className="textarea font-mono text-sm min-h-64"
          spellCheck={false}
          aria-label="Extracted text — editable"
          style={{ background: "var(--color-surface-2)", fontFamily: "ui-monospace, monospace" }}
        />
        <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
          ✏️ Text is editable — make corrections before exporting.
        </p>
      </div>

      {/* Action bar */}
      <div
        className="flex flex-wrap items-center gap-2 px-5 py-4 border-t"
        style={{ borderColor: "var(--color-border)", background: "var(--color-surface-2)" }}
      >
        {/* Copy */}
        <button
          onClick={handleCopy}
          className={cn("btn btn-primary btn-sm", copied && "opacity-80")}
        >
          {copied ? (
            <><CheckCircle2 className="h-3.5 w-3.5" /> Copied!</>
          ) : (
            <><Copy className="h-3.5 w-3.5" /> Copy text</>
          )}
        </button>

        {/* Download .txt */}
        <button onClick={handleDownloadTxt} className="btn btn-outline btn-sm">
          <Download className="h-3.5 w-3.5" /> .txt
        </button>

        {/* Export dropdown (premium) */}
        {(tier.exportFormats.includes(".docx") ||
          tier.exportFormats.includes(".pdf") ||
          tier.exportFormats.includes(".csv")) && (
          <div className="relative">
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="btn btn-outline btn-sm"
            >
              <FileText className="h-3.5 w-3.5" />
              Export
              <ChevronDown className="h-3 w-3" />
            </button>

            {exportOpen && (
              <div
                className="absolute left-0 mt-2 w-44 card p-1 z-30 animate-scale-in"
                style={{ boxShadow: "var(--shadow-lg)" }}
              >
                {tier.exportFormats.includes(".docx") && (
                  <button
                    onClick={() => { handleDownloadDocx(); setExportOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full text-left btn-ghost"
                  >
                    <FileType2 className="h-4 w-4" style={{ color: "var(--color-primary-500)" }} />
                    Word (.docx)
                  </button>
                )}
                {tier.exportFormats.includes(".pdf") && (
                  <button
                    onClick={() => { handleDownloadPdf(); setExportOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full text-left btn-ghost"
                  >
                    <FileText className="h-4 w-4" style={{ color: "hsl(0,80%,50%)" }} />
                    PDF (.pdf)
                  </button>
                )}
                {tier.exportFormats.includes(".csv") && (
                  <button
                    onClick={() => { handleDownloadCsv(); setExportOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full text-left btn-ghost"
                  >
                    <Table2 className="h-4 w-4" style={{ color: "var(--color-success)" }} />
                    CSV (.csv)
                  </button>
                )}
                {tier.exportFormats.includes(".zip") && (
                  <button
                    onClick={() => setExportOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full text-left btn-ghost"
                  >
                    <Archive className="h-4 w-4" style={{ color: "var(--color-accent-500)" }} />
                    ZIP archive
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Convert another */}
        <button onClick={onReset} className="btn btn-ghost btn-sm">
          <RefreshCw className="h-3.5 w-3.5" />
          Convert another
        </button>
      </div>
    </div>
  );
}
