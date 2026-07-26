// lib/ocr.ts — Ultra-fast GPU-accelerated Tesseract.js wrapper + Layout/Table Engine
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
 * Prepares image for crisp OCR recognition.
 */
export async function preprocessImage(
  file: File,
  options: ProcessOptions = {}
): Promise<Blob> {
  const { grayscale = true, contrast = 125, advancedEnhance = false } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
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
          resolve(file);
          return;
        }

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

export interface TableData {
  isTable: boolean;
  rows: string[][];
  csvText: string;
  markdownText: string;
}

export interface OcrResult {
  text: string;
  formattedText: string;
  tableData: TableData;
  confidence: number;
  processingMs: number;
}

interface WordBox {
  text: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/**
 * Spatial Layout & Table Reconstruction Engine
 * Analyzes word positions (x, y bounding boxes) to reconstruct table columns,
 * aligned rows, CSV output, and formatted text exactly matching the image layout.
 */

interface RawWord {
  text: string;
  bbox: { x0: number; y0: number; x1: number; y1: number };
}

interface RawLine {
  words?: RawWord[];
}

interface RawData {
  text?: string;
  lines?: RawLine[];
}

function reconstructLayout(data: RawData): { formattedText: string; tableData: TableData } {
  const words: WordBox[] = [];

  // Collect all words with bounding boxes
  if (data.lines && Array.isArray(data.lines)) {
    data.lines.forEach((line) => {
      if (line.words && Array.isArray(line.words)) {
        line.words.forEach((w) => {
          if (w.text && w.text.trim()) {
            words.push({
              text: w.text.trim(),
              x0: w.bbox.x0,
              y0: w.bbox.y0,
              x1: w.bbox.x1,
              y1: w.bbox.y1,
            });
          }
        });
      }
    });
  }

  // Fallback to raw text if spatial word data is absent
  if (words.length === 0) {
    const rawText = data.text ? data.text.trim() : "";
    return {
      formattedText: rawText,
      tableData: {
        isTable: false,
        rows: [],
        csvText: "",
        markdownText: "",
      },
    };
  }

  // 1. Group words into horizontal lines by y-coordinate
  const lineGroups: WordBox[][] = [];
  const sortedWords = [...words].sort((a, b) => a.y0 - b.y0);

  sortedWords.forEach((word) => {
    const wordHeight = Math.max(10, word.y1 - word.y0);
    const yCenter = (word.y0 + word.y1) / 2;

    const matchedGroup = lineGroups.find((group) => {
      const groupY = group.reduce((sum, w) => sum + (w.y0 + w.y1) / 2, 0) / group.length;
      return Math.abs(yCenter - groupY) < wordHeight * 0.5;
    });

    if (matchedGroup) {
      matchedGroup.push(word);
    } else {
      lineGroups.push([word]);
    }
  });

  // Sort words in each line left-to-right by x0
  lineGroups.forEach((group) => group.sort((a, b) => a.x0 - b.x0));

  // 2. Column Detection: Identify horizontal cell gaps
  let totalGapSum = 0;
  let totalGapCount = 0;
  lineGroups.forEach((group) => {
    for (let i = 1; i < group.length; i++) {
      const gap = group[i].x0 - group[i - 1].x1;
      if (gap > 0) {
        totalGapSum += gap;
        totalGapCount++;
      }
    }
  });

  const avgGap = totalGapCount > 0 ? totalGapSum / totalGapCount : 15;
  const columnGapThreshold = Math.max(18, avgGap * 2.2);

  // 3. Extract Rows and Cells for each line
  const rawRows: string[][] = [];
  lineGroups.forEach((group) => {
    const rowCells: string[] = [];
    let currentCellWords: string[] = [];

    for (let i = 0; i < group.length; i++) {
      const curr = group[i];
      currentCellWords.push(curr.text);

      if (i < group.length - 1) {
        const next = group[i + 1];
        const gap = next.x0 - curr.x1;
        // If gap exceeds threshold, end current cell and start a new column cell
        if (gap >= columnGapThreshold) {
          rowCells.push(currentCellWords.join(" "));
          currentCellWords = [];
        }
      }
    }
    if (currentCellWords.length > 0) {
      rowCells.push(currentCellWords.join(" "));
    }

    if (rowCells.length > 0) {
      rawRows.push(rowCells);
    }
  });

  // 4. Detect Table Structure: If 2 or more rows have 2 or more columns
  const multiColRows = rawRows.filter((r) => r.length >= 2);
  const isTable = rawRows.length >= 2 && multiColRows.length >= Math.ceil(rawRows.length * 0.4);

  // Normalize column count across all rows for consistent table grid
  const maxCols = Math.max(...rawRows.map((r) => r.length), 1);
  const tableRows: string[][] = rawRows.map((r) => {
    const padded = [...r];
    while (padded.length < maxCols) padded.push("");
    return padded;
  });

  // 5. Generate CSV Format
  const csvText = tableRows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  // 6. Generate Markdown Table Format
  let markdownText = "";
  if (tableRows.length > 0) {
    const headers = tableRows[0];
    markdownText += `| ${headers.join(" | ")} |\n`;
    markdownText += `| ${headers.map(() => "---").join(" | ")} |\n`;
    tableRows.slice(1).forEach((row) => {
      markdownText += `| ${row.join(" | ")} |\n`;
    });
  }

  // 7. Generate Aligned Formatted Plain Text
  // Calculate maximum character width per column for clean monospaced alignment
  const colWidths: number[] = new Array(maxCols).fill(0);
  tableRows.forEach((row) => {
    row.forEach((cell, cIdx) => {
      colWidths[cIdx] = Math.max(colWidths[cIdx], cell.length);
    });
  });

  const formattedLines = tableRows.map((row) =>
    row.map((cell, cIdx) => cell.padEnd(colWidths[cIdx] + 3, " ")).join("")
  );
  const formattedText = formattedLines.join("\n");

  return {
    formattedText,
    tableData: {
      isTable,
      rows: tableRows,
      csvText,
      markdownText,
    },
  };
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

  // Fetch Tesseract WASM worker with progress logger
  const worker = await getWorker(language, onProgress);

  const processedFile = new File([processedBlob], file.name, { type: "image/png" });

  // Pass blocks: true & lines: true to retrieve complete spatial word coordinates
  const result = await worker.recognize(
    processedFile,
    {},
    {
      text: true,
      blocks: true,
      hocr: false,
      tsv: false,
    }
  );

  onProgress?.(90);

  // Run Spatial Layout & Table Reconstruction Engine
  const { formattedText, tableData } = reconstructLayout(result.data);

  onProgress?.(100);

  return {
    text: result.data.text.trim(),
    formattedText,
    tableData,
    confidence: Math.round(result.data.confidence),
    processingMs: Date.now() - start,
  };
}
