"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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
  Share2,
  Code2,
  BookOpen,
} from "lucide-react";
import { cn, copyToClipboard, downloadTextFile, exportAsDocx, exportAsPdf, exportAsCsv, exportBatchAsZip, timestampedFilename, formatMs } from "@/lib/utils";
import type { OcrResult } from "@/lib/ocr";
import type { PlanId } from "@/lib/config";
import { getTierDef } from "@/lib/config";

export interface BatchResultItem {
  fileName: string;
  result: OcrResult;
}

interface ResultsPanelProps {
  result?: OcrResult;
  fileName?: string;
  batchResults?: BatchResultItem[];
  plan: PlanId;
  onReset: () => void;
}

type ViewMode = "formatted" | "table" | "raw";

// Simple language detection by script/character ranges
function detectLanguage(text: string): { label: string; emoji: string } | null {
  if (!text || text.trim().length < 10) return null;
  const arabicCount = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const chineseCount = (text.match(/[\u4E00-\u9FFF]/g) || []).length;
  const cyrillicCount = (text.match(/[\u0400-\u04FF]/g) || []).length;
  const hindiCount = (text.match(/[\u0900-\u097F]/g) || []).length;
  const japaneseCount = (text.match(/[\u3040-\u30FF]/g) || []).length;
  const total = text.replace(/\s/g, "").length || 1;
  if (arabicCount / total > 0.2) return { label: "Arabic", emoji: "🌍" };
  if (chineseCount / total > 0.2) return { label: "Chinese", emoji: "🌏" };
  if (cyrillicCount / total > 0.15) return { label: "Russian/Cyrillic", emoji: "🌍" };
  if (hindiCount / total > 0.15) return { label: "Hindi", emoji: "🌏" };
  if (japaneseCount / total > 0.15) return { label: "Japanese", emoji: "🌏" };
  const latinCount = (text.match(/[a-zA-Z]/g) || []).length;
  if (latinCount / total > 0.3) return { label: "English", emoji: "🌐" };
  return null;
}

// Text → Markdown: preserve lines as paragraphs/headers
function toMarkdown(text: string): string {
  return text
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (trimmed.length < 60 && trimmed === trimmed.toUpperCase() && trimmed.length > 3) {
        return `## ${trimmed}`;
      }
      return trimmed;
    })
    .join("\n");
}

// Table rows → HTML table
function toHtmlTable(rows: string[][]): string {
  if (!rows.length) return "";
  const header = rows[0].map((c) => `<th>${c}</th>`).join("");
  const body = rows
    .slice(1)
    .map((row) => `<tr>${row.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("\n");
  return `<table>\n  <thead>\n    <tr>${header}</tr>\n  </thead>\n  <tbody>\n    ${body}\n  </tbody>\n</table>`;
}

// Confetti burst using CSS
function triggerConfetti() {
  const container = document.createElement("div");
  container.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;`;
  document.body.appendChild(container);
  const colors = ["#0284c7", "#7c3aed", "#00d8f6", "#f59e0b", "#10b981", "#ef4444"];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement("div");
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 10 + 6;
    const left = Math.random() * 100;
    const delay = Math.random() * 0.8;
    const duration = Math.random() * 1.5 + 1.5;
    el.style.cssText = `
      position:absolute; width:${size}px; height:${size}px;
      background:${color}; border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
      left:${left}%; top:-20px; opacity:1;
      animation: confettiFall ${duration}s ease-in ${delay}s forwards;
    `;
    container.appendChild(el);
  }
  if (!document.getElementById("confetti-style")) {
    const style = document.createElement("style");
    style.id = "confetti-style";
    style.textContent = `@keyframes confettiFall {
      0% { transform: translateY(0) rotate(0deg); opacity:1; }
      100% { transform: translateY(110vh) rotate(720deg); opacity:0; }
    }`;
    document.head.appendChild(style);
  }
  setTimeout(() => container.remove(), 3500);
}

export default function ResultsPanel({ result, fileName, batchResults, plan, onReset }: ResultsPanelProps) {
  // Build normalized list of items
  const items: BatchResultItem[] = batchResults && batchResults.length > 0
    ? batchResults
    : result && fileName
    ? [{ fileName, result }]
    : [];

  const isBatch = items.length > 1;

  // Active item tab: -1 for Combined View (when batch), or 0..N-1
  const [activeTab, setActiveTab] = useState<number>(isBatch ? -1 : 0);
  const [copied, setCopied] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Active current result / text
  const currentItem = activeTab >= 0 ? items[activeTab] : null;
  
  // Helper to generate combined text for batch
  const generateCombinedText = useCallback(() => {
    return items
      .map(
        (item, idx) =>
          `========================================\n` +
          `IMAGE ${idx + 1}: ${item.fileName}\n` +
          `========================================\n\n` +
          (item.result.formattedText || item.result.text)
      )
      .join("\n\n");
  }, [items]);

  const [editableText, setEditableText] = useState<string>(() => {
    if (activeTab === -1 && isBatch) {
      return generateCombinedText();
    }
    const currentRes = items[activeTab > -1 ? activeTab : 0]?.result;
    return currentRes?.formattedText || currentRes?.text || "";
  });

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const currentRes = items[activeTab > -1 ? activeTab : 0]?.result;
    return currentRes?.tableData?.isTable && currentRes.tableData.rows.length > 0 ? "table" : "formatted";
  });

  const [tableRows, setTableRows] = useState<string[][]>(() => {
    const currentRes = items[activeTab > -1 ? activeTab : 0]?.result;
    return currentRes?.tableData?.rows || [];
  });

  // When active tab changes, update text and table state
  useEffect(() => {
    if (activeTab === -1 && isBatch) {
      setEditableText(generateCombinedText());
      setTableRows([]);
      setViewMode("formatted");
    } else if (items[activeTab]) {
      const res = items[activeTab].result;
      setEditableText(res.formattedText || res.text);
      setTableRows(res.tableData?.rows || []);
      if (res.tableData?.isTable && res.tableData.rows.length > 0) {
        setViewMode("table");
      } else {
        setViewMode("formatted");
      }
    }
  }, [activeTab, isBatch, items, generateCombinedText]);

  const baseName = timestampedFilename(
    isBatch
      ? "snafasascan_batch"
      : items[0]?.fileName
      ? items[0].fileName.replace(/\.[^.]+$/, "")
      : "snafasascan_result"
  );

  const wordCount = editableText.trim() ? editableText.trim().split(/\s+/).length : 0;
  const charCount = editableText.length;
  const readingTimeMin = Math.max(1, Math.round(wordCount / 200));
  const hasTable = tableRows.length > 0;
  const detectedLang = detectLanguage(editableText);

  // Confidence & Ms calculations
  const confidence = activeTab === -1 && isBatch
    ? Math.round(items.reduce((acc, i) => acc + i.result.confidence, 0) / items.length)
    : currentItem?.result.confidence ?? items[0]?.result.confidence ?? 100;

  const totalMs = activeTab === -1 && isBatch
    ? items.reduce((acc, i) => acc + i.result.processingMs, 0)
    : currentItem?.result.processingMs ?? items[0]?.result.processingMs ?? 0;

  // Confetti on first conversion
  useEffect(() => {
    const CONFETTI_KEY = "snafasa_confetti_done";
    if (!localStorage.getItem(CONFETTI_KEY)) {
      localStorage.setItem(CONFETTI_KEY, "1");
      triggerConfetti();
    }
  }, []);

  const handleCopy = useCallback(async () => {
    let textToCopy = editableText;
    if (viewMode === "table" && tableRows.length > 0) {
      textToCopy = tableRows
        .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
        .join("\n");
    }
    const ok = await copyToClipboard(textToCopy);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [editableText, viewMode, tableRows]);

  const handleCopyMarkdown = useCallback(async () => {
    const md = toMarkdown(editableText);
    const ok = await copyToClipboard(md);
    if (ok) {
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    }
  }, [editableText]);

  const handleCopyHtml = useCallback(async () => {
    const html = hasTable ? toHtmlTable(tableRows) : `<p>${editableText.replace(/\n/g, "</p>\n<p>")}</p>`;
    const ok = await copyToClipboard(html);
    if (ok) {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    }
  }, [editableText, hasTable, tableRows]);

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `Just extracted ${wordCount} words from ${items.length} image(s) using Snafasa Scan — free online OCR that works 100% in your browser! 🔍\n\nhttps://snafasa-scan.vercel.app`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank", "noopener,noreferrer,width=600,height=450");
  };

  const handleDownloadTxt = () => downloadTextFile(editableText, `${baseName}.txt`);
  const handleDownloadDocx = () => exportAsDocx(editableText, baseName);
  const handleDownloadPdf = () => exportAsPdf(editableText, baseName);
  const handleDownloadCsv = () => {
    if (tableRows.length > 0) {
      const csvStr = tableRows
        .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
        .join("\n");
      downloadTextFile(csvStr, `${baseName}.csv`);
    } else {
      exportAsCsv(editableText, baseName);
    }
  };

  const handleDownloadZip = async () => {
    await exportBatchAsZip(
      items.map((i) => ({
        fileName: i.fileName,
        text: i.result.text,
        formattedText: i.result.formattedText,
      })),
      baseName
    );
  };

  const handleTableCellChange = (rIdx: number, cIdx: number, val: string) => {
    const updated = tableRows.map((row, r) =>
      r === rIdx ? row.map((cell, c) => (c === cIdx ? val : cell)) : row
    );
    setTableRows(updated);
    const updatedCsv = updated
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    setEditableText(updatedCsv);
  };

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
              {isBatch
                ? `${items.length} Images Converted Successfully`
                : hasTable
                ? "Table & Layout Extracted"
                : "Text Extracted Successfully"}
            </p>
            <p className="text-xs flex flex-wrap items-center gap-2" style={{ color: "var(--color-text-muted)" }}>
              <span>{wordCount} words · {charCount} chars</span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                ~{readingTimeMin} min read
              </span>
              {detectedLang && (
                <span className="flex items-center gap-1 font-medium" style={{ color: "var(--color-primary-500)" }}>
                  {detectedLang.emoji} {detectedLang.label} detected
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Confidence badge */}
          <span
            className={cn(
              "badge text-xs",
              confidence >= 80 ? "badge-success" : confidence >= 60 ? "badge-warning" : "badge-error"
            )}
          >
            <Zap className="h-2.5 w-2.5" />
            {confidence}% {isBatch && activeTab === -1 ? "avg confidence" : "confidence"}
          </span>
          <span className="badge badge-muted text-xs">
            {formatMs(totalMs)}
          </span>
        </div>
      </div>

      {/* Batch Image Selection Tabs (if multiple images uploaded) */}
      {isBatch && (
        <div
          className="flex items-center gap-1.5 px-5 py-2.5 border-b overflow-x-auto text-xs scrollbar-none"
          style={{ borderColor: "var(--color-border)", background: "var(--color-surface-3)" }}
        >
          <span className="font-semibold text-muted-foreground mr-1 shrink-0" style={{ color: "var(--color-text-muted)" }}>
            Select View:
          </span>
          <button
            type="button"
            onClick={() => setActiveTab(-1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-bold shrink-0"
            style={{
              background: activeTab === -1 ? "var(--color-primary-500)" : "var(--color-surface)",
              color: activeTab === -1 ? "#ffffff" : "var(--color-text-primary)",
              border: activeTab === -1 ? "1px solid var(--color-primary-600)" : "1px solid var(--color-border)",
            }}
          >
            <Archive className="h-3.5 w-3.5" />
            Combined View ({items.length} Images)
          </button>

          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTab(idx)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-semibold shrink-0 truncate max-w-44"
              style={{
                background: activeTab === idx ? "var(--color-primary-500)" : "var(--color-surface)",
                color: activeTab === idx ? "#ffffff" : "var(--color-text-primary)",
                border: activeTab === idx ? "1px solid var(--color-primary-600)" : "1px solid var(--color-border)",
              }}
              title={item.fileName}
            >
              <span>#{idx + 1}</span>
              <span className="truncate">{item.fileName}</span>
            </button>
          ))}
        </div>
      )}

      {/* View Mode Tabs (Formatted / Table / Plain) */}
      <div
        className="flex flex-wrap items-center gap-2 px-5 py-3 border-b text-xs font-medium"
        style={{ borderColor: "var(--color-border)", background: "var(--color-surface-1)" }}
      >
        <span style={{ color: "var(--color-text-muted)" }} className="mr-1 font-semibold">
          Format:
        </span>

        {hasTable && (
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-semibold"
            style={{
              background: viewMode === "table" ? "var(--color-primary-500)" : "var(--color-surface-3)",
              color: viewMode === "table" ? "#ffffff" : "var(--color-text-primary)",
              border: viewMode === "table" ? "1px solid var(--color-primary-600)" : "1px solid var(--color-border)",
            }}
          >
            <Grid className="h-3.5 w-3.5" />
            Table Grid ({tableRows.length} rows)
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            setViewMode("formatted");
            if (activeTab === -1 && isBatch) setEditableText(generateCombinedText());
            else if (currentItem) setEditableText(currentItem.result.formattedText || currentItem.result.text);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-semibold"
          style={{
            background: viewMode === "formatted" ? "var(--color-primary-500)" : "var(--color-surface-3)",
            color: viewMode === "formatted" ? "#ffffff" : "var(--color-text-primary)",
            border: viewMode === "formatted" ? "1px solid var(--color-primary-600)" : "1px solid var(--color-border)",
          }}
        >
          <AlignLeft className="h-3.5 w-3.5" />
          Formatted Layout
        </button>

        <button
          type="button"
          onClick={() => {
            setViewMode("raw");
            if (activeTab === -1 && isBatch) setEditableText(generateCombinedText());
            else if (currentItem) setEditableText(currentItem.result.text);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-semibold"
          style={{
            background: viewMode === "raw" ? "var(--color-primary-500)" : "var(--color-surface-3)",
            color: viewMode === "raw" ? "#ffffff" : "var(--color-text-primary)",
            border: viewMode === "raw" ? "1px solid var(--color-primary-600)" : "1px solid var(--color-border)",
          }}
        >
          <FileText className="h-3.5 w-3.5" />
          Plain Text
        </button>
      </div>

      {/* Content View Area */}
      <div className="p-5">
        {viewMode === "table" && hasTable ? (
          <div className="overflow-x-auto max-h-[500px] border rounded-xl" style={{ borderColor: "var(--color-border)" }}>
            <table className="w-full text-left text-xs border-collapse font-mono" style={{ background: "var(--color-surface-2)" }}>
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-3)" }}>
                  {tableRows[0]?.map((_, cIdx) => (
                    <th key={cIdx} className="p-3 font-bold border-r uppercase tracking-wider" style={{ borderColor: "var(--color-border)", color: "var(--color-primary-500)" }}>
                      Column {cIdx + 1}
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
                          className="w-full bg-transparent border-none outline-none text-xs p-1.5 focus:ring-1 focus:ring-primary-500 rounded font-medium"
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
                whiteSpace: "pre-wrap",
              }}
            />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
          <p>✏️ Click any text or table cell to edit before exporting.</p>
          {hasTable && (
            <p className="font-semibold flex items-center gap-1" style={{ color: "var(--color-success)" }}>
              <Grid className="h-3.5 w-3.5" /> Table layout structured & aligned automatically
            </p>
          )}
        </div>
      </div>

      {/* Action bar */}
      <div
        className="flex flex-wrap items-center gap-2 px-5 py-4 border-t"
        style={{ borderColor: "var(--color-border)", background: "var(--color-surface-2)" }}
      >
        {/* Copy plain */}
        <button
          onClick={handleCopy}
          className={cn("btn btn-primary btn-sm", copied && "opacity-80")}
        >
          {copied ? (
            <><CheckCircle2 className="h-3.5 w-3.5" /> Copied!</>
          ) : (
            <><Copy className="h-3.5 w-3.5" /> {isBatch && activeTab === -1 ? "Copy All Text" : viewMode === "table" ? "Copy CSV" : "Copy Text"}</>
          )}
        </button>

        {/* Copy as Markdown */}
        <button
          onClick={handleCopyMarkdown}
          className={cn("btn btn-outline btn-sm", copiedMd && "opacity-80")}
          title="Copy as Markdown"
        >
          {copiedMd ? (
            <><CheckCircle2 className="h-3.5 w-3.5" /> Copied!</>
          ) : (
            <><Code2 className="h-3.5 w-3.5" /> Markdown</>
          )}
        </button>

        {/* Copy as HTML */}
        <button
          onClick={handleCopyHtml}
          className={cn("btn btn-outline btn-sm", copiedHtml && "opacity-80")}
          title="Copy as HTML"
        >
          {copiedHtml ? (
            <><CheckCircle2 className="h-3.5 w-3.5" /> Copied!</>
          ) : (
            <><Code2 className="h-3.5 w-3.5" /> {hasTable ? "HTML Table" : "HTML"}</>
          )}
        </button>

        {/* Download .txt */}
        <button onClick={handleDownloadTxt} className="btn btn-outline btn-sm">
          <Download className="h-3.5 w-3.5" /> .txt
        </button>

        {/* Download CSV */}
        <button onClick={handleDownloadCsv} className="btn btn-outline btn-sm">
          <Table2 className="h-3.5 w-3.5" style={{ color: "var(--color-success)" }} />
          .csv
        </button>

        {/* Export dropdown */}
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
              className="absolute left-0 mt-2 w-48 card p-1 z-30 animate-scale-in"
              style={{ boxShadow: "var(--shadow-lg)" }}
            >
              <button
                onClick={() => { handleDownloadDocx(); setExportOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full text-left btn-ghost"
              >
                <FileType2 className="h-4 w-4" style={{ color: "var(--color-primary-500)" }} />
                Word (.docx)
              </button>
              <button
                onClick={() => { handleDownloadPdf(); setExportOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full text-left btn-ghost"
              >
                <FileText className="h-4 w-4" style={{ color: "hsl(0,80%,50%)" }} />
                PDF (.pdf)
              </button>
              {isBatch && (
                <button
                  onClick={() => { handleDownloadZip(); setExportOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full text-left btn-ghost font-semibold border-t mt-1 pt-2"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-primary-600)" }}
                >
                  <Archive className="h-4 w-4" />
                  Download ZIP Archive
                </button>
              )}
            </div>
          )}
        </div>

        {/* If batch, direct ZIP button */}
        {isBatch && (
          <button onClick={handleDownloadZip} className="btn btn-outline btn-sm" style={{ color: "var(--color-primary-600)", borderColor: "var(--color-primary-300)" }}>
            <Archive className="h-3.5 w-3.5" /> Download ZIP
          </button>
        )}

        {/* Share on Twitter */}
        <button
          onClick={handleShareTwitter}
          className="btn btn-outline btn-sm"
          title="Share on X (Twitter)"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Convert another */}
        <button onClick={onReset} className="btn btn-ghost btn-sm">
          <RefreshCw className="h-3.5 w-3.5" />
          Convert more
        </button>
      </div>
    </div>
  );
}

