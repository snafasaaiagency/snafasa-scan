"use client";

import React, { useCallback, useRef, useState } from "react";
import { Upload, Image as ImageIcon, Camera, Clipboard, X } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";

interface UploadZoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
  accept?: string;
  maxSizeMb?: number;
  className?: string;
}

export default function UploadZone({
  onFile,
  disabled = false,
  accept = "image/*",
  maxSizeMb = 5,
  className,
}: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      setError(null);

      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file (JPG, PNG, WebP, TIFF, BMP).");
        return;
      }

      const maxBytes = maxSizeMb * 1024 * 1024;
      if (file.size > maxBytes) {
        setError(`File too large. Maximum allowed size is ${maxSizeMb} MB. Your file is ${formatBytes(file.size)}.`);
        return;
      }

      onFile(file);
    },
    [maxSizeMb, onFile]
  );

  // Drag handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // Paste handler (Ctrl+V)
  const onPaste = useCallback(
    (e: React.ClipboardEvent) => {
      if (disabled) return;
      const items = Array.from(e.clipboardData.items);
      const imageItem = items.find((item) => item.type.startsWith("image/"));
      if (imageItem) {
        const file = imageItem.getAsFile();
        if (file) processFile(file);
      }
    },
    [disabled, processFile]
  );

  // Click to browse
  const onClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  // File input change
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset so the same file can be re-selected
    e.target.value = "";
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Drop zone */}
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
              background: dragging
                ? "var(--color-primary-100)"
                : "var(--color-surface-3)",
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
          {dragging ? "Drop your image here" : "Drag & drop an image"}
        </p>
        <p className="text-sm mb-5" style={{ color: "var(--color-text-muted)" }}>
          or click to browse · paste with Ctrl+V
        </p>

        {/* Action chips */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-secondary)",
              background: "var(--color-surface)",
            }}
          >
            <ImageIcon className="h-3 w-3" />
            JPG, PNG, WebP, TIFF
          </span>
          <label
            htmlFor="camera-input"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-all"
            style={{
              borderColor: "var(--color-primary-300)",
              color: "var(--color-primary-600)",
              background: "var(--color-primary-50)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Camera className="h-3 w-3" />
            Use Camera
          </label>
          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-secondary)",
              background: "var(--color-surface)",
            }}
          >
            <Clipboard className="h-3 w-3" />
            Max {maxSizeMb} MB
          </span>
        </div>

        {/* Hidden file input (browse) */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onChange}
          aria-hidden="true"
        />

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
