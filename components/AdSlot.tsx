"use client";

import { useEffect, useRef } from "react";
import { APP_NAME } from "@/lib/config";

interface AdSlotProps {
  slotId?: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
}

// AdSense client publisher ID — replace after AdSense approval
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-XXXXXXXXXXXXXXXXX";

export default function AdSlot({ slotId = "1234567890", format = "auto", className }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;

    try {
      // AdSense push — only runs when script is loaded
      (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle =
        (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle || [];
      ((window as Window & { adsbygoogle?: unknown[] }).adsbygoogle as unknown[]).push({});
    } catch {
      // AdSense not loaded (dev/offline) — fail silently
    }
  }, []);

  if (ADSENSE_CLIENT === "ca-pub-XXXXXXXXXXXXXXXXX") {
    // Dev placeholder — never shown in production once real ID is added
    return (
      <div
        className={`flex items-center justify-center rounded-xl text-xs ${className ?? ""}`}
        style={{
          background: "var(--color-surface-3)",
          border: "1px dashed var(--color-border)",
          minHeight: 90,
          color: "var(--color-text-muted)",
        }}
      >
        Ad slot — Replace publisher ID in .env.local after AdSense approval
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
        aria-label={`Advertisement — ${APP_NAME}`}
      />
    </div>
  );
}
