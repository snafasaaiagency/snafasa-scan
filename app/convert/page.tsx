"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Languages,
  Wand2,
  AlertCircle,
  ImageIcon,
  RotateCcw,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

import UploadZone from "@/components/UploadZone";
import ResultsPanel from "@/components/ResultsPanel";
import HistoryPanel from "@/components/HistoryPanel";
import AdSlot from "@/components/AdSlot";
import { saveToHistory } from "@/lib/history";

import { useAuth } from "@/lib/auth-context";
import { extractText, type OcrResult } from "@/lib/ocr";
import {
  FREE_LANGUAGES,
  PREMIUM_LANGUAGES,
  FREE_TRIAL_CONVERSIONS,
  getTierDef,
} from "@/lib/config";
import { getTrialCount, incrementTrialCount, formatBytes } from "@/lib/utils";

type ConvertState = "idle" | "processing" | "done" | "error";

export default function ConvertPage() {
  const resultTextRef = useRef<string>("");
  const { user, profile } = useAuth();
  const plan = profile?.plan ?? "free";
  const tierDef = getTierDef(plan);

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [language, setLanguage] = useState("eng");

  // Conversion state
  const [state, setState] = useState<ConvertState>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<OcrResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Free trial gate
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false);

  const languages =
    plan === "free" ? FREE_LANGUAGES : PREMIUM_LANGUAGES;

  const handleFile = useCallback(
    (f: File) => {
      // Check free trial limit for unauthenticated users
      if (!user) {
        const count = getTrialCount();
        if (count >= FREE_TRIAL_CONVERSIONS) {
          setShowSignUpPrompt(true);
          return;
        }
      }
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setState("idle");
      setResult(null);
      setError(null);
    },
    [user]
  );

  const handleExtract = useCallback(async () => {
    if (!file) return;

    setState("processing");
    setProgress(0);
    setError(null);

    try {
      const ocrResult = await extractText(
        file,
        language,
        setProgress,
        tierDef.advancedEnhance
      );

      setResult(ocrResult);
      setState("done");

      // Save to local history
      saveToHistory({
        fileName: file.name,
        extractedText: ocrResult.text,
        formattedText: ocrResult.formattedText,
        wordCount: (ocrResult.formattedText || ocrResult.text).trim().split(/\s+/).length,
        charCount: (ocrResult.formattedText || ocrResult.text).length,
        confidence: ocrResult.confidence,
      });

      // Increment trial count for anonymous users
      if (!user) {
        const newCount = incrementTrialCount();
        if (newCount >= FREE_TRIAL_CONVERSIONS) {
          toast.custom((t) => (
            <div className={`card p-4 max-w-sm ${t.visible ? "animate-fade-in" : "opacity-0"}`}>
              <p className="font-semibold text-sm mb-1" style={{ color: "var(--color-text-primary)" }}>
                That&apos;s your {FREE_TRIAL_CONVERSIONS} free conversions!
              </p>
              <p className="text-sm mb-3" style={{ color: "var(--color-text-secondary)" }}>
                Create a free account to keep converting.
              </p>
              <Link href="/account?tab=signup" className="btn btn-primary btn-sm w-full">
                Create free account
              </Link>
            </div>
          ), { duration: 8000 });
        }
      }
    } catch (err) {
      setState("error");
      setError(
        (err as Error).message || "OCR failed. Please try a different image."
      );
    }
  }, [file, language, tierDef.advancedEnhance, user]);

  // Keep result text ref in sync for keyboard shortcut
  useEffect(() => {
    if (result) resultTextRef.current = result.formattedText || result.text;
  }, [result]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter → run OCR
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        if (file && state !== "processing" && state !== "done") {
          e.preventDefault();
          handleExtract();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [file, state, handleExtract]);

  const handleReset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setState("idle");
    setResult(null);
    setError(null);
    setProgress(0);
  };

  const showAd = plan === "free";

  return (
    <div className="min-h-screen pt-36 sm:pt-40 pb-20 px-4">
      <div className="mx-auto max-w-5xl">
        {/* Page header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black mb-3" style={{ color: "var(--color-text-primary)" }}>
            Image to Text Converter
          </h1>
          <p className="text-lg" style={{ color: "var(--color-text-secondary)" }}>
            Upload any image — your text is extracted privately in your browser.
          </p>
          {!user && (
            <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>
              {Math.max(0, FREE_TRIAL_CONVERSIONS - getTrialCount())} free trial conversion(s) remaining ·{" "}
              <Link href="/account" className="underline" style={{ color: "var(--color-primary-500)" }}>
                Sign up to unlock more
              </Link>
            </p>
          )}
        </div>

        {/* Sign-up prompt overlay */}
        {showSignUpPrompt && (
          <div className="card p-8 text-center mb-8 animate-scale-in"
            style={{ border: "2px solid var(--color-primary-300)", background: "var(--color-primary-50)" }}>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl mx-auto mb-4"
              style={{ background: "var(--color-primary-100)" }}>
              <AlertCircle className="h-7 w-7" style={{ color: "var(--color-primary-500)" }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>
              Free trial limit reached
            </h2>
            <p className="text-sm mb-5 max-w-md mx-auto" style={{ color: "var(--color-text-secondary)" }}>
              You&apos;ve used your {FREE_TRIAL_CONVERSIONS} free trial conversions. Create a free account to keep converting — it only takes seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/account?tab=signup" className="btn btn-primary">Create free account</Link>
              <Link href="/pricing" className="btn btn-outline">View premium plans</Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Upload + controls */}
          <div className="lg:col-span-2 space-y-5">
            {/* Upload zone (hidden when file is loaded) */}
            {!file && !showSignUpPrompt && (
              <UploadZone
                onFile={handleFile}
                maxSizeMb={tierDef.maxFileSizeMb}
                disabled={showSignUpPrompt}
              />
            )}

            {/* Image preview */}
            {file && preview && (
              <div className="card overflow-hidden animate-fade-in">
                <div
                  className="flex items-center justify-between px-4 py-3 border-b"
                  style={{ borderColor: "var(--color-border)", background: "var(--color-surface-2)" }}
                >
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" style={{ color: "var(--color-text-muted)" }} />
                    <span className="text-sm font-medium truncate max-w-48" style={{ color: "var(--color-text-primary)" }}>
                      {file.name}
                    </span>
                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {formatBytes(file.size)}
                    </span>
                  </div>
                  <button onClick={handleReset} className="btn btn-ghost btn-sm" aria-label="Remove image">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Image + scan animation */}
                <div className="relative">
                  <Image
                    src={preview}
                    alt="Uploaded image for OCR"
                    width={800}
                    height={500}
                    className="w-full object-contain max-h-80"
                    style={{ background: "var(--color-surface-2)" }}
                    unoptimized
                  />
                  {state === "processing" && (
                    <div className="absolute inset-0" style={{ background: "hsl(0 0% 0% / 0.35)" }}>
                      <div className="scan-line" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <div className="h-8 w-8 rounded-full border-3 border-white/30 border-t-white animate-spin" style={{ borderWidth: 3 }} />
                        <p className="text-white font-semibold text-sm">Processing… {progress}%</p>
                        <div className="w-48 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
                          <div className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${progress}%`, background: "var(--color-accent-500)" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Controls */}
            {file && state !== "done" && (
              <div className="card p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-end animate-fade-in">
                {/* Language selector */}
                <div className="flex-1">
                  <label className="flex items-center gap-1.5 text-sm font-medium mb-2"
                    style={{ color: "var(--color-text-secondary)" }}>
                    <Languages className="h-3.5 w-3.5" />
                    Document language
                    {plan === "free" && (
                      <span className="badge badge-muted text-xs ml-1">5 languages — upgrade for 20+</span>
                    )}
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="input"
                  >
                    {languages.map((l) => (
                      <option key={l.code} value={l.code}>{l.label}</option>
                    ))}
                  </select>
                </div>

                {/* Enhancement badge */}
                {tierDef.advancedEnhance && (
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm"
                    style={{ background: "hsl(243 75% 59% / 0.08)", color: "var(--color-primary-600)" }}>
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
                    <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Processing…</>
                  ) : (
                    <><Wand2 className="h-4 w-4" /> Extract text</>
                  )}
                </button>

                <button onClick={handleReset} className="btn btn-ghost btn-sm" aria-label="Reset">
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Error state */}
            {state === "error" && error && (
              <div className="card p-5 flex items-start gap-3 animate-fade-in"
                style={{ borderColor: "hsl(0 72% 51% / 0.3)", background: "hsl(0 72% 51% / 0.04)" }}>
                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" style={{ color: "var(--color-error)" }} />
                <div>
                  <p className="font-semibold text-sm mb-1" style={{ color: "var(--color-error)" }}>
                    Extraction failed
                  </p>
                  <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{error}</p>
                  <button onClick={handleExtract} className="btn btn-outline btn-sm mt-3">
                    Try again
                  </button>
                </div>
              </div>
            )}

            {/* Results */}
            {state === "done" && result && file && (
              <ResultsPanel
                result={result}
                fileName={file.name}
                plan={plan}
                onReset={handleReset}
              />
            )}

            {/* Conversion History */}
            <HistoryPanel />
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-5">
            {/* Ad slot — free users only */}
            {showAd && (
              <AdSlot
                slotId="1234567890"
                format="rectangle"
                className="w-full"
              />
            )}

            {/* Plan info card */}
            <div className="card p-5">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: "var(--color-text-muted)" }}>
                Your plan
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="badge badge-primary text-sm">
                  {plan === "free" ? "Free" : plan.replace("tier", "Tier ")}
                </span>
                {plan === "free" && (
                  <Link href="/pricing" className="text-xs font-medium underline"
                    style={{ color: "var(--color-primary-500)" }}>
                    Upgrade
                  </Link>
                )}
              </div>
              <ul className="space-y-2 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                <li>✓ Max file size: {tierDef.maxFileSizeMb} MB</li>
                <li>✓ Languages: {tierDef.languages}</li>
                <li>✓ Batch: {tierDef.maxImagesPerConversion === "unlimited" ? "Unlimited" : tierDef.maxImagesPerConversion} image(s)</li>
                <li>✓ Export: {tierDef.exportFormats.join(", ")}</li>
                {tierDef.cloudHistory && <li>✓ History saved</li>}
                {tierDef.advancedEnhance && <li>✓ Advanced enhancement</li>}
              </ul>
            </div>

            {/* Privacy badge */}
            <div className="card p-5 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl mx-auto mb-3"
                style={{ background: "hsl(142 72% 40% / 0.1)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5" style={{ color: "var(--color-success)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <p className="font-semibold text-sm mb-1" style={{ color: "var(--color-text-primary)" }}>
                Your privacy is protected
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                Zero images uploaded. OCR runs locally via WebAssembly — verifiable in DevTools → Network tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
