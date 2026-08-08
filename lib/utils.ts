// lib/utils.ts — Shared utility helpers

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Format bytes to human-readable
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Format milliseconds to readable time
export function formatMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

// Truncate text for previews
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

// Generate unique reference code (e.g. SNF-A8K92F)
export function generateReferenceCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "SNF-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Download text as file
export function downloadTextFile(text: string, filename: string): void {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Copy to clipboard with fallback
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const success = document.execCommand("copy");
    document.body.removeChild(ta);
    return success;
  }
}

// Export text as .docx
export async function exportAsDocx(text: string, filename: string): Promise<void> {
  const { Document, Paragraph, TextRun, Packer } = await import("docx");
  const paragraphs = text.split("\n").map(
    (line) =>
      new Paragraph({
        children: [new TextRun(line)],
      })
  );
  const doc = new Document({ sections: [{ children: paragraphs }] });
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

// Export text as .pdf
export async function exportAsPdf(text: string, filename: string): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const margin = 15;
  const lineHeight = 7;
  const pageHeight = pdf.internal.pageSize.height;
  const usableHeight = pageHeight - margin * 2;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);

  const lines = pdf.splitTextToSize(text, pdf.internal.pageSize.width - margin * 2);
  let y = margin;
  for (const line of lines) {
    if (y + lineHeight > usableHeight) {
      pdf.addPage();
      y = margin;
    }
    pdf.text(line, margin, y);
    y += lineHeight;
  }

  pdf.save(`${filename}.pdf`);
}

// Export text as .csv
export function exportAsCsv(text: string, filename: string): void {
  const rows = text.split("\n").map((line) => [line.replace(/"/g, '""')]);
  const csv = rows.map((r) => `"${r[0]}"`).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Generate a date-stamped filename
export function timestampedFilename(base: string): string {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}_${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}`;
  return `${base}_${stamp}`;
}

// Free trial conversion count (local storage)
export const TRIAL_KEY = "sfs_trial_count";

export function getTrialCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(TRIAL_KEY) ?? "0", 10);
}

export function incrementTrialCount(): number {
  const next = getTrialCount() + 1;
  localStorage.setItem(TRIAL_KEY, String(next));
  return next;
}

// Export batch results as ZIP archive
export async function exportBatchAsZip(
  items: { fileName: string; text: string; formattedText?: string }[],
  zipFilename: string
): Promise<void> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  const combinedLines: string[] = [];
  items.forEach((item, index) => {
    const rawName = item.fileName.replace(/\.[^/.]+$/, "");
    const safeName = `image_${index + 1}_${rawName}.txt`;
    const content = item.formattedText || item.text;
    zip.file(safeName, content);

    combinedLines.push(`========================================`);
    combinedLines.push(`IMAGE ${index + 1}: ${item.fileName}`);
    combinedLines.push(`========================================\n`);
    combinedLines.push(content);
    combinedLines.push("\n\n");
  });

  zip.file("00_ALL_IMAGES_COMBINED.txt", combinedLines.join("\n"));

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${zipFilename}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}

