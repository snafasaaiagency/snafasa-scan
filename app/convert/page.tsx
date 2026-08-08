"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Languages,
  Wand2,
  AlertCircle,
  ImageIcon,
  RotateCcw,
  X,
  Plus,
  Trash2,
  Layers,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

import UploadZone from "@/components/UploadZone";
import ResultsPanel, { type BatchResultItem } from "@/components/ResultsPanel";
import HistoryPanel from "@/components/HistoryPanel";
import AdSlot from "@/components/AdSlot";
import { saveToHistory } from "@/lib/history";

import { useAuth } from "@/lib/auth-context";
import { extractText, type OcrResult } from "@/lib/ocr";
import { FREE_LANGUAGES, getTierDef } from "@/lib/config";
import { formatBytes } from "@/lib/utils";

type ConvertState = "idle" | "processing" | "done" | "error";

interface FilePreview {
  id: string;
  file: File;
  url: string;
}

export default function ConvertPage() {
  const resultTextRef = useRef<string>("");
  const addFilesInputRef = useRef<HTMLInputElement>(null);
  const { profile } = useAuth();
  const plan = profile?.plan ?? "free";
  const tierDef = getTierDef(plan);

  // Multi-File state
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [language, setLanguage] = useState("eng");

  // Conversion state
  const [state, setState] = useState<ConvertState>("idle");
  const [progress, setProgress] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [batchResults, setBatchResults] = useState<BatchResultItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const languages = FREE_LANGUAGES;

  // Cleanup object URLs when component unmounts or previews change
  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const handleFiles = useCallback((newFiles: File[]) => {
    if (!newFiles.length) return;
    const newItems: FilePreview[] = newFiles.map((f) => ({
      id: `${f.name}-${Date.now()}-${Math.random()}`,
      file: f,
      url: URL.createObjectURL(f),
    }));

    setPreviews((prev) => [...prev, ...newItems]);
    setState("idle");
    setBatchResults([]);
    setError(null);
    toast.success(`Added ${newFiles.length} image(s) to queue.`);
  }, []);

  const handleSingleFile = useCallback(
    (f: File) => {
      handleFiles([f]);
    },
    [handleFiles]
  );

  const removeFile = useCallback((index: number) => {
    setPreviews((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleReset = () => {
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews([]);
    setState("idle");
    setBatchResults([]);
    setError(null);
    setProgress(0);
    setCurrentFileIndex(0);
  };

  const handleExtract = useCallback(async () => {
    if (!previews.length) return;

    setState("processing");
    setProgress(0);
    setError(null);
    setBatchResults([]);

    const accumulatedResults: BatchResultItem[] = [];

    try {
      for (let i = 0; i < previews.length; i++) {
        setCurrentFileIndex(i);
        const item = previews[i];

        const ocrResult = await extractText(
          item.file,
          language,
          (filePct) => {
            const overallPct = Math.round(
              (i / previews.length) * 100 + filePct / previews.length
            );
            setProgress(overallPct);
          },
          tierDef.advancedEnhance
        );

        const batchItem: BatchResultItem = {
          fileName: item.file.name,
          result: ocrResult,
        };

        accumulatedResults.push(batchItem);

        // Save each item to local history
        saveToHistory({
          fileName: item.file.name,
          extractedText: ocrResult.text,
          formattedText: ocrResult.formattedText,
          wordCount: (ocrResult.formattedText || ocrResult.text)
            .trim()
            .split(/\s+/).length,
          charCount: (ocrResult.formattedText || ocrResult.text).length,
          confidence: ocrResult.confidence,
        });
      }

      setBatchResults(accumulatedResults);
      setState("done");
      toast.success(
        `Successfully converted ${accumulatedResults.length} image(s) to text!`
      );
    } catch (err) {
      setState("error");
      setError(
        (err as Error).message ||
          "OCR failed for one or more images. Please try again."
      );
    }
  }, [previews, language, tierDef.advancedEnhance]);

  // Keep result text ref in sync for keyboard shortcut
  useEffect(() => {
    if (batchResults.length > 0) {
      resultTextRef.current = batchResults
        .map((b) => b.result.formattedText || b.result.text)
        .join("\n\n");
    }
  }, [batchResults]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter → run OCR
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        if (previews.length > 0 && state !== "processing" && state !== "done") {
          e.preventDefault();
          handleExtract();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previews.length, state, handleExtract]);

  const handleAddMoreClick = () => {
    addFilesInputRef.current?.click();
  };

  const handleAddMoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const added = Array.from(e.target.files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (added.length) handleFiles(added);
    }
    e.target.value = "";
  };

  const totalBytes = previews.reduce((acc, p) => acc + p.file.size, 0);

  return (
    <div className="min-h-screen pt-36 sm:pt-40 pb-20 px-4">
      <div className="mx-auto max-w-5xl">
        {/* Page header */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl font-black mb-3"
            style={{ color: "var(--color-text-primary)" }}
          >
            Multiple Image to Text Converter
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Upload 1 or multiple images — 100% free, unlimited, batch OCR directly in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Upload + controls */}
          <div className="lg:col-span-2 space-y-5">
            {/* Upload zone (shown when no previews exist) */}
            {previews.length === 0 && (
              <UploadZone
                onFiles={handleFiles}
                onFile={handleSingleFile}
                maxSizeMb={tierDef.maxFileSizeMb}
                multiple={true}
              />
            )}

            {/* Multi-Image Queue Gallery */}
            {previews.length > 0 && (
              <div className="card overflow-hidden animate-fade-in p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b" style={{ borderColor: "var(--color-border)" }}>
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5" style={{ color: "var(--color-primary-500)" }} />
                    <span className="font-bold text-sm" style={{ color: "var(--color-text-primary)" }}>
                      Image Queue ({previews.length} {previews.length === 1 ? "image" : "images"})
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: "var(--color-surface-3)", color: "var(--color-text-muted)" }}>
                      {formatBytes(totalBytes)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {state !== "processing" && (
                      <>
                        <button
                          type="button"
                          onClick={handleAddMoreClick}
                          className="btn btn-outline btn-xs gap-1"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Images
                        </button>
                        <button
                          type="button"
                          onClick={handleReset}
                          className="btn btn-ghost btn-xs text-error gap-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Clear All
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Hidden add files input */}
                <input
                  ref={addFilesInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleAddMoreChange}
                />

                {/* Grid of uploaded thumbnails */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-1">
                  {previews.map((p, idx) => (
                    <div
                      key={p.id}
                      className="group relative rounded-xl overflow-hidden border transition-all hover:shadow-md flex flex-col"
                      style={{
                        borderColor:
                          state === "processing" && currentFileIndex === idx
                            ? "var(--color-primary-500)"
                            : "var(--color-border)",
                        background: "var(--color-surface-2)",
                      }}
                    >
                      {/* Image Thumbnail */}
                      <div className="relative aspect-4/3 w-full bg-black/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.url}
                          alt={p.file.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Order tag */}
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                          #{idx + 1}
                        </span>

                        {/* Remove button */}
                        {state !== "processing" && state !== "done" && (
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600/80 hover:bg-red-600 text-white transition-opacity opacity-80 group-hover:opacity-100"
                            aria-label="Remove image"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}

                        {/* Active converting spinner overlay */}
                        {state === "processing" && currentFileIndex === idx && (
                          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-1 text-center text-white">
                            <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin mb-1" />
                            <span className="text-[10px] font-bold">Scanning...</span>
                          </div>
                        )}
                      </div>

                      {/* File Details */}
                      <div className="p-2 text-left border-t text-[11px]" style={{ borderColor: "var(--color-border)" }}>
                        <p className="font-semibold truncate" style={{ color: "var(--color-text-primary)" }} title={p.file.name}>
                          {p.file.name}
                        </p>
                        <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                          {formatBytes(p.file.size)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Overall Processing Progress bar */}
                {state === "processing" && (
                  <div className="mt-4 pt-3 border-t space-y-2" style={{ borderColor: "var(--color-border)" }}>
                    <div className="flex items-center justify-between text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>
                      <span>
                        Processing Image {currentFileIndex + 1} of {previews.length}: {previews[currentFileIndex]?.file.name}
                      </span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--color-surface-3)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%`, background: "var(--color-primary-500)" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Controls Bar */}
            {previews.length > 0 && state !== "done" && (
              <div className="card p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-end animate-fade-in">
                {/* Language selector */}
                <div className="flex-1">
                  <label
                    className="flex items-center gap-1.5 text-sm font-medium mb-2"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    <Languages className="h-3.5 w-3.5" />
                    Document language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="input"
                    disabled={state === "processing"}
                  >
                    {languages.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Enhancement badge */}
                {tierDef.advancedEnhance && (
                  <div
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm"
                    style={{
                      background: "hsl(243 75% 59% / 0.08)",
                      color: "var(--color-primary-600)",
                    }}
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    Advanced enhancement on
                  </div>
                )}

                {/* Extract button */}
                <button
                  onClick={handleExtract}
                  disabled={state === "processing"}
                  className="btn btn-primary"
                >
                  {state === "processing" ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Converting {previews.length} image(s)...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" /> Extract Text ({previews.length})
                    </>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  disabled={state === "processing"}
                  className="btn btn-ghost btn-sm"
                  aria-label="Reset"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Error state */}
            {state === "error" && error && (
              <div
                className="card p-5 flex items-start gap-3 animate-fade-in"
                style={{
                  borderColor: "hsl(0 72% 51% / 0.3)",
                  background: "hsl(0 72% 51% / 0.04)",
                }}
              >
                <AlertCircle
                  className="h-5 w-5 mt-0.5 shrink-0"
                  style={{ color: "var(--color-error)" }}
                />
                <div>
                  <p
                    className="font-semibold text-sm mb-1"
                    style={{ color: "var(--color-error)" }}
                  >
                    Extraction failed
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {error}
                  </p>
                  <button
                    onClick={handleExtract}
                    className="btn btn-outline btn-sm mt-3"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {/* Results */}
            {state === "done" && batchResults.length > 0 && (
              <ResultsPanel
                batchResults={batchResults}
                plan={plan}
                onReset={handleReset}
              />
            )}

            {/* Conversion History */}
            <HistoryPanel />
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-5">
            {/* Ad slot */}
            <AdSlot slotId="1234567890" format="rectangle" className="w-full" />

            {/* Plan info card */}
            <div className="card p-5">
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: "var(--color-text-muted)" }}
              >
                Your plan
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="badge badge-primary text-sm">
                  100% Free Plan
                </span>
              </div>
              <ul
                className="space-y-2 text-xs"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <li>✓ Max file size: {tierDef.maxFileSizeMb} MB</li>
                <li>✓ Multi-image batch support: Unlimited</li>
                <li>✓ Export formats: TXT, DOCX, PDF, CSV, ZIP</li>
                <li>✓ 100% Private local processing</li>
              </ul>
            </div>

            {/* Privacy badge */}
            <div className="card p-5 text-center">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl mx-auto mb-3"
                style={{ background: "hsl(142 72% 40% / 0.1)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                  style={{ color: "var(--color-success)" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                  />
                </svg>
              </div>
              <p
                className="font-semibold text-sm mb-1"
                style={{ color: "var(--color-text-primary)" }}
              >
                Your privacy is protected
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--color-text-muted)" }}
              >
                Zero images uploaded. Batch OCR runs locally via WebAssembly — verifiable in DevTools → Network tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

