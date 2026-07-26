// lib/ocr.ts — Tesseract.js wrapper + Canvas pre-processing pipeline
// ALL image processing runs client-side. No image bytes ever leave the browser.

import type { Worker } from "tesseract.js";

let tesseractWorker: Worker | null = null;
let workerLanguage = "";

// ── Lazy-load the Tesseract worker ───────────────────────────────
// Called only when user actually uploads an image, so it never blocks first paint.
export async function getWorker(language: string): Promise<Worker> {
  const { createWorker } = await import("tesseract.js");

  if (tesseractWorker && workerLanguage === language) {
    return tesseractWorker;
  }

  // Terminate existing worker if language changed
  if (tesseractWorker) {
    await tesseractWorker.terminate();
    tesseractWorker = null;
  }

  const worker = await createWorker(language, 1, {
    logger: () => {}, // suppress verbose logs in production
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

// ── Canvas image pre-processing pipeline ─────────────────────────
// Returns a processed Blob ready for Tesseract — never uploaded anywhere.
export interface ProcessOptions {
  grayscale?: boolean;
  contrast?: number; // 0–100 (default 50)
  sharpen?: boolean;
  scale?: number; // upscale small images for better OCR (default 1.5)
}

export async function preprocessImage(
  file: File,
  options: ProcessOptions = {}
): Promise<Blob> {
  const {
    grayscale = true,
    contrast = 60,
    sharpen = true,
    scale = 1.5,
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const targetW = Math.min(img.width * scale, 3000);
        const targetH = Math.min(img.height * scale, 3000);
        canvas.width = targetW;
        canvas.height = targetH;

        const ctx = canvas.getContext("2d")!;

        // Draw at scaled size
        ctx.drawImage(img, 0, 0, targetW, targetH);

        if (grayscale) {
          applyGrayscale(ctx, targetW, targetH);
        }

        if (contrast > 0) {
          applyContrast(ctx, targetW, targetH, contrast);
        }

        if (sharpen) {
          applySharpen(ctx, targetW, targetH);
        }

        URL.revokeObjectURL(url);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas toBlob returned null"));
        }, "image/png");
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for preprocessing"));
    };

    img.src = url;
  });
}

function applyGrayscale(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const luma = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    data[i] = data[i + 1] = data[i + 2] = luma;
  }
  ctx.putImageData(imageData, 0, 0);
}

function applyContrast(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  amount: number
): void {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  const factor = (259 * (amount + 255)) / (255 * (259 - amount));
  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp(factor * (data[i] - 128) + 128);
    data[i + 1] = clamp(factor * (data[i + 1] - 128) + 128);
    data[i + 2] = clamp(factor * (data[i + 2] - 128) + 128);
  }
  ctx.putImageData(imageData, 0, 0);
}

function applySharpen(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
  const side = 3;
  const half = Math.floor(side / 2);
  const output = new Uint8ClampedArray(data);

  for (let y = half; y < h - half; y++) {
    for (let x = half; x < w - half; x++) {
      let r = 0, g = 0, b = 0;
      for (let ky = 0; ky < side; ky++) {
        for (let kx = 0; kx < side; kx++) {
          const px = ((y + ky - half) * w + (x + kx - half)) * 4;
          const kv = kernel[ky * side + kx];
          r += data[px] * kv;
          g += data[px + 1] * kv;
          b += data[px + 2] * kv;
        }
      }
      const idx = (y * w + x) * 4;
      output[idx] = clamp(r);
      output[idx + 1] = clamp(g);
      output[idx + 2] = clamp(b);
    }
  }
  ctx.putImageData(new ImageData(output, w, h), 0, 0);
}

function clamp(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}

// ── Main OCR function ─────────────────────────────────────────────
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

  onProgress?.(5);

  // Pre-process image client-side
  const processedBlob = await preprocessImage(file, {
    grayscale: true,
    contrast: advancedEnhance ? 75 : 60,
    sharpen: advancedEnhance,
    scale: advancedEnhance ? 2 : 1.5,
  });

  onProgress?.(20);

  const worker = await getWorker(language);

  onProgress?.(35);

  const processedFile = new File([processedBlob], file.name, { type: "image/png" });
  const result = await worker.recognize(processedFile, {}, {
    text: true,
    blocks: false,
    hocr: false,
    tsv: false,
  });

  onProgress?.(100);

  return {
    text: result.data.text.trim(),
    confidence: Math.round(result.data.confidence),
    processingMs: Date.now() - start,
  };
}
