"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import { Upload, Image as ImageIcon, Camera, Clipboard, X, Keyboard, SunMedium, Contrast, Sparkles } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";

interface UploadZoneProps {
  onFiles?: (files: File[]) => void;
  onFile?: (file: File) => void;
  disabled?: boolean;
  accept?: string;
  maxSizeMb?: number;
  multiple?: boolean;
  className?: string;
}

interface EnhancementSettings {
  brightness: number; // 0–200, default 100
  contrast: number;   // 0–200, default 100
  sharpness: number;  // 0–100, default 0
}

const DEFAULT_SETTINGS: EnhancementSettings = { brightness: 100, contrast: 100, sharpness: 0 };

function applyEnhancements(file: File, settings: EnhancementSettings): Promise<File> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.filter = `brightness(${settings.brightness}%) contrast(${settings.contrast}%)`;
      ctx.drawImage(img, 0, 0);

      // Sharpness via unsharp mask convolution (simplified)
      if (settings.sharpness > 0) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const factor = settings.sharpness / 100;
        const kernel = [0, -factor, 0, -factor, 1 + 4 * factor, -factor, 0, -factor, 0];
        const w = canvas.width;
        const h = canvas.height;
        const output = new Uint8ClampedArray(data);
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            for (let c = 0; c < 3; c++) {
              const i = (y * w + x) * 4 + c;
              const sum =
                kernel[0] * data[((y-1)*w+(x-1))*4+c] + kernel[1] * data[((y-1)*w+x)*4+c] + kernel[2] * data[((y-1)*w+(x+1))*4+c] +
                kernel[3] * data[(y*w+(x-1))*4+c]     + kernel[4] * data[(y*w+x)*4+c]     + kernel[5] * data[(y*w+(x+1))*4+c] +
                kernel[6] * data[((y+1)*w+(x-1))*4+c] + kernel[7] * data[((y+1)*w+x)*4+c] + kernel[8] * data[((y+1)*w+(x+1))*4+c];
              output[i] = Math.min(255, Math.max(0, sum));
            }
          }
        }
        ctx.putImageData(new ImageData(output, w, h), 0, 0);
      }

      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (blob) resolve(new File([blob], file.name, { type: "image/png" }));
        else resolve(file);
      }, "image/png", 0.96);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

export default function UploadZone({
  onFiles,
  onFile,
  disabled = false,
  accept = "image/*",
  maxSizeMb = 500,
  multiple = true,
  className,
}: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [settings, setSettings] = useState<EnhancementSettings>(DEFAULT_SETTINGS);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clean up preview URL
  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const emitFiles = useCallback(
    (files: File[]) => {
      if (files.length === 0) return;
      if (onFiles) {
        onFiles(files);
      } else if (onFile) {
        onFile(files[0]);
      }
    },
    [onFiles, onFile]
  );

  const processFileList = useCallback(
    (fileList: FileList | File[]) => {
      setError(null);
      const rawFiles = Array.from(fileList);
      const validFiles: File[] = [];
      const maxBytes = maxSizeMb * 1024 * 1024;

      for (const f of rawFiles) {
        if (!f.type.startsWith("image/")) {
          setError(`"${f.name}" is not a supported image file (JPG, PNG, WebP, TIFF, BMP).`);
          return;
        }
        if (f.size > maxBytes) {
          setError(`"${f.name}" is too large. Maximum allowed size is ${maxSizeMb} MB.`);
          return;
        }
        validFiles.push(f);
      }

      if (validFiles.length === 0) return;

      // If single file and single mode requested, allow single file enhancement preview
      if (validFiles.length === 1 && !onFiles && onFile) {
        const url = URL.createObjectURL(validFiles[0]);
        setPreview(url);
        setPendingFile(validFiles[0]);
        setSettings(DEFAULT_SETTINGS);
      } else {
        emitFiles(validFiles);
      }
    },
    [maxSizeMb, emitFiles, onFiles, onFile]
  );

  const handleConfirmEnhancement = useCallback(async () => {
    if (!pendingFile) return;
    const needsProcessing =
      settings.brightness !== 100 || settings.contrast !== 100 || settings.sharpness !== 0;
    if (needsProcessing) {
      const enhanced = await applyEnhancements(pendingFile, settings);
      emitFiles([enhanced]);
    } else {
      emitFiles([pendingFile]);
    }
    setPreview(null);
    setPendingFile(null);
  }, [pendingFile, settings, emitFiles]);

  const handleCancelEnhancement = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setPendingFile(null);
    setSettings(DEFAULT_SETTINGS);
  };

  // Drag handlers
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); if (!disabled) setDragging(true); };
  const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setDragging(false); };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files?.length) {
      processFileList(e.dataTransfer.files);
    }
  };

  // Paste handler (Ctrl+V)
  const onPaste = useCallback(
    (e: React.ClipboardEvent) => {
      if (disabled) return;
      const items = Array.from(e.clipboardData.items);
      const imageItems = items.filter((item) => item.type.startsWith("image/"));
      const files: File[] = [];
      for (const item of imageItems) {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
      if (files.length > 0) {
        processFileList(files);
      }
    },
    [disabled, processFileList]
  );

  const onClick = () => { if (!disabled && !pendingFile) inputRef.current?.click(); };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      processFileList(e.target.files);
    }
    e.target.value = "";
  };

  // ── Enhancement UI (shown after file selected in single-file mode) ──────────────
  if (pendingFile && preview) {
    return (
      <div className={cn("w-full", className)}>
        <div className="card p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>
              🎨 Image Enhancement — adjust before converting
            </p>
            <button type="button" onClick={handleCancelEnhancement} className="btn btn-ghost btn-sm">
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>

          {/* Image preview */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-48 object-contain rounded-xl mb-5 border"
            style={{
              borderColor: "var(--color-border)",
              filter: `brightness(${settings.brightness}%) contrast(${settings.contrast}%)`,
            }}
          />

          {/* Sliders */}
          <div className="space-y-4">
            {/* Brightness */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>
                  <SunMedium className="h-3.5 w-3.5" /> Brightness
                </label>
                <span className="text-xs font-mono" style={{ color: "var(--color-primary-500)" }}>{settings.brightness}%</span>
              </div>
              <input
                type="range" min={50} max={200} value={settings.brightness}
                onChange={(e) => setSettings((s) => ({ ...s, brightness: Number(e.target.value) }))}
                className="w-full accent-[var(--color-primary-500)]"
              />
            </div>

            {/* Contrast */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>
                  <Contrast className="h-3.5 w-3.5" /> Contrast
                </label>
                <span className="text-xs font-mono" style={{ color: "var(--color-primary-500)" }}>{settings.contrast}%</span>
              </div>
              <input
                type="range" min={50} max={300} value={settings.contrast}
                onChange={(e) => setSettings((s) => ({ ...s, contrast: Number(e.target.value) }))}
                className="w-full accent-[var(--color-primary-500)]"
              />
            </div>

            {/* Sharpness */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>
                  <Sparkles className="h-3.5 w-3.5" /> Sharpness
                </label>
                <span className="text-xs font-mono" style={{ color: "var(--color-primary-500)" }}>{settings.sharpness}</span>
              </div>
              <input
                type="range" min={0} max={100} value={settings.sharpness}
                onChange={(e) => setSettings((s) => ({ ...s, sharpness: Number(e.target.value) }))}
                className="w-full accent-[var(--color-primary-500)]"
              />
            </div>
          </div>

          {/* Reset & Confirm */}
          <div className="flex gap-3 mt-5">
            <button
              type="button"
              onClick={() => setSettings(DEFAULT_SETTINGS)}
              className="btn btn-ghost btn-sm"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleConfirmEnhancement}
              className="btn btn-primary flex-1"
            >
              ✓ Convert Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Upload zone UI ───────────────────────────────────────────
  return (
    <div className={cn("w-full", className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload image: drag and drop, click to browse, or paste from clipboard"
        className={cn(
          "upload-zone flex flex-col items-center justify-center min-h-48 md:min-h-64 p-8 text-center transition-all focus-visible:outline-none",
          dragging && "drag-over",
          disabled && "opacity-60 cursor-not-allowed pointer-events-none"
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onPaste={onPaste}
        onClick={onClick}
        onKeyDown={(e) => e.key === "Enter" && onClick()}
      >
        {/* Icon cluster */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform"
            style={{
              background: dragging ? "var(--color-primary-100)" : "var(--color-surface-3)",
              transform: dragging ? "scale(1.1) rotate(-3deg)" : "scale(1)",
            }}
          >
            <Upload
              className="h-6 w-6 transition-colors"
              style={{ color: dragging ? "var(--color-primary-500)" : "var(--color-text-muted)" }}
            />
          </div>
        </div>

        <p
          className="text-lg font-semibold mb-1"
          style={{ color: dragging ? "var(--color-primary-500)" : "var(--color-text-primary)" }}
        >
          {dragging ? "Drop your images here" : "Drag & drop your images"}
        </p>
        <p className="text-sm mb-5" style={{ color: "var(--color-text-muted)" }}>
          {multiple ? "or click to browse · upload 1 or multiple images at once · paste with Ctrl+V" : "or click to browse · paste with Ctrl+V"}
        </p>

        {/* Action chips */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)", background: "var(--color-surface)" }}
          >
            <ImageIcon className="h-3 w-3" />
            JPG, PNG, WebP, TIFF, BMP
          </span>

          {multiple && (
            <span
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
              style={{ borderColor: "var(--color-primary-300)", color: "var(--color-primary-600)", background: "var(--color-primary-50)" }}
            >
              ✨ Batch Upload Enabled
            </span>
          )}

          {/* Mobile camera — more prominent */}
          <label
            htmlFor="camera-input"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border cursor-pointer transition-all hover:scale-105"
            style={{
              borderColor: "var(--color-primary-400)",
              color: "var(--color-primary-600)",
              background: "var(--color-primary-50)",
              boxShadow: "0 0 0 2px var(--color-primary-100)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Camera className="h-3.5 w-3.5" />
            📷 Take Photo
          </label>

          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)", background: "var(--color-surface)" }}
          >
            <Clipboard className="h-3 w-3" />
            Max {maxSizeMb} MB
          </span>
        </div>

        {/* Keyboard shortcuts hint */}
        <button
          type="button"
          className="flex items-center gap-1.5 mt-4 text-xs opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: "var(--color-text-muted)" }}
          onClick={(e) => { e.stopPropagation(); setShowShortcuts((v) => !v); }}
        >
          <Keyboard className="h-3 w-3" />
          Keyboard shortcuts
        </button>

        {showShortcuts && (
          <div className="mt-3 p-3 rounded-xl text-xs text-left grid grid-cols-2 gap-x-6 gap-y-1.5"
            style={{ background: "var(--color-surface-3)", color: "var(--color-text-secondary)" }}>
            <span><kbd className="px-1.5 py-0.5 rounded font-mono text-xs border" style={{ borderColor: "var(--color-border)" }}>Ctrl+V</kbd> Paste images</span>
            <span><kbd className="px-1.5 py-0.5 rounded font-mono text-xs border" style={{ borderColor: "var(--color-border)" }}>Ctrl+Enter</kbd> Run OCR</span>
            <span><kbd className="px-1.5 py-0.5 rounded font-mono text-xs border" style={{ borderColor: "var(--color-border)" }}>Ctrl+C</kbd> Copy result</span>
            <span><kbd className="px-1.5 py-0.5 rounded font-mono text-xs border" style={{ borderColor: "var(--color-border)" }}>Enter</kbd> Browse files</span>
          </div>
        )}

        {/* Hidden file input (browse) */}
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden" onChange={onChange} aria-hidden="true" />

        {/* Hidden camera input (mobile) */}
        <input
          id="camera-input"
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={onChange}
          aria-label="Take photo with camera"
        />
      </div>

      {/* Error message */}
      {error && (
        <div
          className="flex items-start gap-2 mt-3 p-3 rounded-lg animate-fade-in"
          style={{ background: "hsl(0 72% 51% / 0.08)", border: "1px solid hsl(0 72% 51% / 0.2)" }}
        >
          <X className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--color-error)" }} />
          <p className="text-sm" style={{ color: "var(--color-error)" }}>{error}</p>
        </div>
      )}
    </div>
  );
}
