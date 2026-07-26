"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={item.q}
            className="card overflow-hidden transition-all duration-200"
            style={{
              borderColor: isOpen ? "var(--color-primary-300)" : "var(--color-border)",
              boxShadow: isOpen ? "0 0 0 1px var(--color-primary-200)" : undefined,
            }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex items-center justify-between w-full px-6 py-4 text-left gap-4"
              aria-expanded={isOpen}
            >
              <span
                className="font-semibold text-sm sm:text-base leading-snug"
                style={{ color: isOpen ? "var(--color-primary-600)" : "var(--color-text-primary)" }}
              >
                {item.q}
              </span>
              <ChevronDown
                className="h-4 w-4 shrink-0 transition-transform duration-300"
                style={{
                  color: "var(--color-text-muted)",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {/* Animated content panel */}
            <div
              style={{
                maxHeight: isOpen ? "400px" : "0px",
                overflow: "hidden",
                transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <p
                className="px-6 pb-5 text-sm leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
