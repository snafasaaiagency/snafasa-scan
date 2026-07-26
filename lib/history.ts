export interface HistoryItem {
  id: string;
  fileName: string;
  extractedText: string;
  formattedText?: string;
  wordCount: number;
  charCount: number;
  confidence: number;
  timestamp: number;
}

const HISTORY_KEY = "snafasa_ocr_history_v1";
const MAX_HISTORY = 5;

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(item: Omit<HistoryItem, "id" | "timestamp">): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getHistory();
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    const updated = [newItem, ...current.filter((i) => i.fileName !== item.fileName)].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Ignore error
  }
}
