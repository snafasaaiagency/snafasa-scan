"use client";

import { useState } from "react";
import { History, Copy, Trash2, CheckCircle2, ChevronRight, FileText } from "lucide-react";
import { getHistory, clearHistory, type HistoryItem } from "@/lib/history";
import { copyToClipboard } from "@/lib/utils";

interface HistoryPanelProps {
  onSelect?: (text: string) => void;
}

export default function HistoryPanel({ onSelect }: HistoryPanelProps) {
  const [items, setItems] = useState<HistoryItem[]>(() => getHistory());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (items.length === 0) return null;

  const handleClear = () => {
    clearHistory();
    setItems([]);
  };

  const handleCopy = async (id: string, text: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="card p-5 mt-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4 border-b pb-3" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-2">
          <History className="h-4 w-4" style={{ color: "var(--color-primary-500)" }} />
          <h3 className="font-bold text-sm" style={{ color: "var(--color-text-primary)" }}>
            Recent Conversions (Last {items.length})
          </h3>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center gap-1 text-xs btn-ghost px-2 py-1 rounded"
          style={{ color: "var(--color-text-muted)" }}
        >
          <Trash2 className="h-3 w-3" /> Clear
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-xl border text-xs gap-3 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ borderColor: "var(--color-border)", background: "var(--color-surface-2)" }}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <FileText className="h-4 w-4 shrink-0" style={{ color: "var(--color-primary-500)" }} />
              <div className="truncate">
                <p className="font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>
                  {item.fileName}
                </p>
                <p style={{ color: "var(--color-text-muted)" }}>
                  {item.wordCount} words · {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleCopy(item.id, item.formattedText || item.extractedText)}
                className="btn btn-outline btn-sm px-2.5 py-1 text-xs"
              >
                {copiedId === item.id ? (
                  <><CheckCircle2 className="h-3 w-3" /> Copied</>
                ) : (
                  <><Copy className="h-3 w-3" /> Copy</>
                )}
              </button>

              {onSelect && (
                <button
                  type="button"
                  onClick={() => onSelect(item.formattedText || item.extractedText)}
                  className="btn btn-ghost btn-sm p-1"
                  title="View result"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
