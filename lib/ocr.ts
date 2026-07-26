// lib/ocr.ts — Ultra-fast GPU-accelerated Tesseract.js wrapper + Canvas pipeline
// ALL image processing runs client-side inside the browser. Zero image bytes leave the device.

import type { Worker } from "tesseract.js";

let tesseractWorker: Worker | null = null;
let workerLanguage = "";

/**
 * Lazy-loads and caches the Tesseract.js WebAssembly worker.
 */
export async function getWorker(
  language: string,
  onLoggerProgress?: (pct: number) => void
): Promise<Worker> {
  const { createWorker } = await import("tesseract.js");

  if (tesseractWorker && workerLanguage === language) {
    return tesseractWorker;
  }

  // Terminate existing worker if switching languages
  if (tesseractWorker) {
    await tesseractWorker.terminate();
    tesseractWorker = null;
  }

  const worker = await createWorker(language, 1, {
    logger: (m) => {
      if (m.status === "loading tesseract core" || m.status === "loading language traineddata") {
        onLoggerProgress?.(Math.round(20 + (m.progress || 0) * 30));
      } else if (m.status === "recognizing text") {
        onLoggerProgress?.(Math.round(50 + (m.progress || 0) * 45));
      }
    },
    workerPath: "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js",
    langPath: "https://tessdata.projectnaptha.com/4.0.0",
    corePath: "https://cdn.jsdelivr.net/npm/tesseract.js-core@5/tesseract-core.wasm.js",
  });

  tesseractWorker = worker;
  workerLanguage = language;
  return worker;
}

export async function terminateWorker(): Promise<void> {
  if (tesseractWorker) {
    await tesseractWorker.terminate();
    tesseractWorker = null;
    workerLanguage = "";
  }
}

export interface ProcessOptions {
  grayscale?: boolean;
  contrast?: number;
  advancedEnhance?: boolean;
}

/**
 * GPU-accelerated hardware pre-processing using Canvas filters.
 * Replaces slow CPU pixel loops with native GPU rendering for instant execution.
 */
export async function preprocessImage(
  file: File,
  options: ProcessOptions = {}
): Promise<Blob> {
  const { grayscale = true, contrast = 120, advancedEnhance = false } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        // Only scale up if original image is small (under 1200px) to prevent unnecessary canvas bloating
        let targetW = img.width;
        let targetH = img.height;
        if (img.width < 1200) {
          const scale = advancedEnhance ? 2 : 1.5;
          targetW = Math.round(img.width * scale);
          targetH = Math.round(img.height * scale);
        }

        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          URL.revokeObjectURL(url);
          resolve(file); // fallback to original file if canvas context unavailable
          return;
        }

        // Apply native GPU-accelerated CSS filters for sub-millisecond execution
        const filters: string[] = [];
        if (grayscale) filters.push("grayscale(100%)");
        if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
        if (advancedEnhance) filters.push("brightness(105%)");

        if (filters.length > 0) {
          ctx.filter = filters.join(" ");
        }

        ctx.drawImage(img, 0, 0, targetW, targetH);

        URL.revokeObjectURL(url);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else resolve(file);
          },
          "image/png"
        );
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for processing"));
    };

    img.src = url;
  });
}

export interface OcrResult {
  text: string;
  confidence: number;
  processingMs: number;
}

export async function extractText(
  file: File,
  language: string,
  onProgress?: (pct: number) => void,
  advancedEnhance = false
): Promise<OcrResult> {
  const start = Date.now();

  onProgress?.(10);

  // Instant GPU pre-processing
  const processedBlob = await preprocessImage(file, {
    grayscale: true,
    contrast: advancedEnhance ? 135 : 120,
    advancedEnhance,
  });

  onProgress?.(20);

  // Fetch or retrieve cached Tesseract WASM worker with live logger progress
  const worker = await getWorker(language, onProgress);

  const processedFile = new File([processedBlob], file.name, { type: "image/png" });

  const result = await worker.recognize(
    processedFile,
    {},
    {
      text: true,
      blocks: false,
      hocr: false,
      tsv: false,
    }
  );

  onProgress?.(100);

  return {
    text: result.data.text.trim(),
    confidence: Math.round(result.data.confidence),
    processingMs: Date.now() - start,
  };
}
