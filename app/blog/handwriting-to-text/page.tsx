import type { Metadata } from "next";
import Link from "next/link";
import { PenLine, Clock, ChevronRight, Scan } from "lucide-react";
import { APP_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: `Convert Handwriting to Text Free Online | ${APP_NAME}`,
  description: "Turn handwritten notes, letters, and documents into editable digital text using free AI-powered OCR. Works in your browser — no app required.",
};

export default function BlogHandwritingToText() {
  return (
    <article className="py-24 px-4">
      <div className="mx-auto max-w-2xl">
        <nav className="flex items-center gap-2 text-xs mb-8" style={{ color: "var(--color-text-muted)" }}>
          <Link href="/blog" className="hover:underline">Blog</Link>
          <ChevronRight className="h-3 w-3" />
          <span>Handwriting to Text</span>
        </nav>

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge badge-primary flex items-center gap-1.5">
              <PenLine className="h-3.5 w-3.5" /> How-to
            </span>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
              <Clock className="h-3.5 w-3.5" /> 5 min read
            </span>
          </div>
          <h1 className="text-4xl font-black mb-4 leading-tight" style={{ color: "var(--color-text-primary)" }}>
            Convert Handwriting to Text Free Online (2025 Guide)
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            Converting handwritten notes, letters, or journals to digital text is now possible with free browser-based OCR tools. Here&apos;s how to get the best results.
          </p>
        </div>

        <div className="space-y-8" style={{ color: "var(--color-text-secondary)" }}>
          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>Is handwriting OCR accurate?</h2>
            <p className="leading-relaxed">
              Accuracy depends heavily on handwriting clarity and image quality. With modern engines like Tesseract (which powers Snafasa Scan), you can expect:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>85–95%</strong> accuracy for neat, printed handwriting</li>
              <li><strong>60–75%</strong> accuracy for cursive or flowing handwriting</li>
              <li><strong>40–65%</strong> for very stylized or hurried handwriting</li>
            </ul>
            <p className="mt-3">The key insight: image pre-processing is often more important than the OCR engine itself.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>How to maximize handwriting OCR accuracy</h2>
            <div className="space-y-4">
              <div className="card p-5">
                <h3 className="font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>📸 Step 1: Take a great photo</h3>
                <ul className="list-disc pl-4 space-y-1 text-sm">
                  <li>Use bright, even lighting — avoid desk lamps that cast shadows</li>
                  <li>Hold your phone directly above the page (not at an angle)</li>
                  <li>Ensure the entire page fits within frame with a small border</li>
                  <li>Use a white or light background paper</li>
                </ul>
              </div>
              <div className="card p-5">
                <h3 className="font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>🎨 Step 2: Enhance before OCR</h3>
                <ul className="list-disc pl-4 space-y-1 text-sm">
                  <li>In Snafasa Scan, use <strong>Contrast: 130–160%</strong> for light ink</li>
                  <li>Use <strong>Brightness: 110–130%</strong> if the paper appears gray</li>
                  <li>Enable <strong>Sharpness: 30–50</strong> for slightly blurred text</li>
                </ul>
              </div>
              <div className="card p-5">
                <h3 className="font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>✏️ Step 3: Edit the result</h3>
                <p className="text-sm">The extracted text is fully editable. Click any word in the result panel to correct it before copying or exporting.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>Popular handwriting-to-text use cases</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Student notes → searchable Notion/Obsidian database</li>
              <li>Old family letters → digital archive</li>
              <li>Filled-in paper forms → digital records</li>
              <li>Whiteboard photos → meeting notes</li>
              <li>Recipe cards → shareable digital formats</li>
            </ul>
          </section>

          <div className="card p-8 text-center mt-10" style={{ background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))" }}>
            <h3 className="text-2xl font-black text-white mb-3">Convert handwriting to text free</h3>
            <p className="text-white/80 mb-5">Private, instant, no account needed.</p>
            <Link href="/convert" className="btn btn-accent btn-lg">
              <Scan className="h-4 w-4" />
              Try handwriting OCR
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
