"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
}

const STATS: Stat[] = [
  { value: 10, suffix: "M+", label: "Images Converted" },
  { value: 20, suffix: "+", label: "Languages Supported" },
  { value: 99.9, suffix: "%", label: "Uptime Guaranteed" },
  { value: 0, suffix: " bytes", label: "Uploaded to Server", prefix: "" },
];

function useCountUp(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || target === 0) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(target % 1 !== 0 ? 1 : 0)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

function StatCard({ stat, active }: { stat: Stat; active: boolean }) {
  const count = useCountUp(stat.value, 1800, active);
  const display = stat.value === 0 ? "0" : stat.value % 1 !== 0 ? count.toFixed(1) : Math.round(count).toLocaleString();

  return (
    <div
      className="card p-8 text-center group hover:-translate-y-2 transition-all duration-300"
      style={{ borderTop: "3px solid var(--color-primary-400)" }}
    >
      <p
        className="text-4xl sm:text-5xl font-black mb-2 tabular-nums"
        style={{ color: "var(--color-primary-500)", fontFamily: "Space Grotesk, sans-serif" }}
      >
        {stat.prefix ?? ""}{display}{stat.suffix}
      </p>
      <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
        {stat.label}
      </p>
    </div>
  );
}

export default function StatsCounter() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {STATS.map((stat) => (
        <StatCard key={stat.label} stat={stat} active={active} />
      ))}
    </div>
  );
}
