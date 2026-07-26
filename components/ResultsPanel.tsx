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
  AlignLeft,
  Grid,
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

type ViewMode = "formatted" | "table" | "raw";

export default function ResultsPanel({ result, fileName, plan, onReset }: ResultsPanelProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(
    result.tableData.isTable ? "table" : "formatted"
  );
  const [editableText, setEditableText] = useState(result.formattedText || result.text);
  const [tableRows, setTableRows] = useState<string[][]>(result.tableData.rows || []);
  const [exportOpen, setExportOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const tier = getTierDef(plan);
  const baseName = timestampedFilename(fileName ? fileName.replace(/\.[^.]+$/, "") : "snafasascan_result");

  const handleCopy = useCallback(async () => {
    let textToCopy = editableText;
    if (viewMode === "table" && result.tableData.isTable) {
      textToCopy = result.tableData.csvText;
    }
    const ok = await copyToClipboard(textToCopy);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [editableText, viewMode, result.tableData]);

  const handleDownloadTxt = () => downloadTextFile(editableText, `${baseName}.txt`);
  const handleDownloadDocx = () => exportAsDocx(editableText, baseName);
  const handleDownloadPdf = () => exportAsPdf(editableText, baseName);
  const handleDownloadCsv = () => {
    if (result.tableData.isTable && result.tableData.csvText) {
      downloadTextFile(result.tableData.csvText, `${baseName}.csv`);
    } else {
      exportAsCsv(editableText, baseName);
    }
  };

  const handleTableCellChange = (rIdx: number, cIdx: number, val: string) => {
    const updated = tableRows.map((row, r) =>
      r === rIdx ? row.map((cell, c) => (c === cIdx ? val : cell)) : row
    );
    setTableRows(updated);
    // Update editable CSV text as well
    const updatedCsv = updated
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    setEditableText(updatedCsv);
  };

  const wordCount = editableText.trim() ? editableText.trim().split(/\s+/).length : 0;
  const charCount = editableText.length;

  return (
    <div className="card animate-fade-in overflow-hidden">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 py-4 border-b"
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
              {result.tableData.isTable ? "Table & Layout Extracted" : "Text Extracted Successfully"}
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

      {/* View Mode Tabs (Formatted Layout vs Interactive Table Grid vs Raw) */}
      <div
        className="flex items-center gap-2 px-5 py-2.5 border-b text-xs font-medium"
        style={{ borderColor: "var(--color-border)", background: "var(--color-surface-1)" }}
      >
        <span style={{ color: "var(--color-text-muted)" }} className="mr-2 hidden sm:inline">
          View Mode:
        </span>

        {result.tableData.isTable && (
          <button
            onClick={() => setViewMode("table")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all",
              viewMode === "table"
                ? "bg-primary-500 text-white font-bold shadow-sm"
                : "btn-ghost text-secondary"
            )}
          >
            <Grid className="h-3.5 w-3.5" />
            Table View ({tableRows.length} rows)
          </button>
        )}

        <button
          onClick={() => { setViewMode("formatted"); setEditableText(result.formattedText || result.text); }}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all",
            viewMode === "formatted"
              ? "bg-primary-500 text-white font-bold shadow-sm"
              : "btn-ghost text-secondary"
          )}
        >
          <AlignLeft className="h-3.5 w-3.5" />
          Formatted Layout
        </button>

        <button
          onClick={() => { setViewMode("raw"); setEditableText(result.text); }}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all",
            viewMode === "raw"
              ? "bg-primary-500 text-white font-bold shadow-sm"
              : "btn-ghost text-secondary"
          )}
        >
          <FileText className="h-3.5 w-3.5" />
          Plain Unformatted
        </button>
      </div>

      {/* Content View Area */}
      <div className="p-5">
        {viewMode === "table" && tableRows.length > 0 ? (
          <div className="overflow-x-auto max-h-[500px] border rounded-xl" style={{ borderColor: "var(--color-border)" }}>
            <table className="w-full text-left text-xs border-collapse font-mono" style={{ background: "var(--color-surface-2)" }}>
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-3)" }}>
                  {tableRows[0]?.map((_, cIdx) => (
                    <th key={cIdx} className="p-3 font-bold border-r uppercase tracking-wider" style={{ borderColor: "var(--color-border)", color: "var(--color-primary-500)" }}>
                      Col {cIdx + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-2 border-r min-w-[120px]" style={{ borderColor: "var(--color-border)" }}>
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => handleTableCellChange(rIdx, cIdx, e.target.value)}
                          className="w-full bg-transparent border-none outline-none text-xs p-1 focus:ring-1 focus:ring-primary-500 rounded"
                          style={{ color: "var(--color-text-primary)" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              className="textarea font-mono text-sm min-h-72 leading-relaxed"
              spellCheck={false}
              aria-label="Extracted text — editable"
              style={{
                background: "var(--color-surface-2)",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                whiteSpace: "pre",
              }}
            />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 mt-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
          <p>✏️ Click any text or table cell to edit before exporting.</p>
          {result.tableData.isTable && (
            <p className="font-semibold" style={{ color: "var(--color-success)" }}>
              📊 Table layout detected & structured automatically!
            </p>
          )}
        </div>
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
            <><Copy className="h-3.5 w-3.5" /> {viewMode === "table" ? "Copy CSV Table" : "Copy Text"}</>
          )}
        </button>

        {/* Download .txt */}
        <button onClick={handleDownloadTxt} className="btn btn-outline btn-sm">
          <Download className="h-3.5 w-3.5" /> .txt
        </button>

        {/* Download CSV */}
        <button onClick={handleDownloadCsv} className="btn btn-outline btn-sm">
          <Table2 className="h-3.5 w-3.5" style={{ color: "var(--color-success)" }} />
          .csv (Excel)
        </button>

        {/* Export dropdown (premium) */}
        {(tier.exportFormats.includes(".docx") ||
          tier.exportFormats.includes(".pdf")) && (
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
