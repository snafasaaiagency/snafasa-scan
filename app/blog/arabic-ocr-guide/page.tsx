import type { Metadata } from "next";
import Link from "next/link";
import { Globe, Clock, ChevronRight, Scan } from "lucide-react";
import { APP_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: `Arabic OCR: Extract Text from Arabic Images Online Free | ${APP_NAME}`,
  description: "Free Arabic OCR tool. Extract text from Arabic images, documents, and screenshots instantly with high accuracy. Supports right-to-left text layout.",
};

export default function BlogArabicOcr() {
  return (
    <article className="py-24 px-4">
      <div className="mx-auto max-w-2xl">
        <nav className="flex items-center gap-2 text-xs mb-8" style={{ color: "var(--color-text-muted)" }}>
          <Link href="/blog" className="hover:underline">Blog</Link>
          <ChevronRight className="h-3 w-3" />
          <span>Arabic OCR</span>
        </nav>

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge badge-primary flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" /> Languages
            </span>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
              <Clock className="h-3.5 w-3.5" /> 4 min read
            </span>
          </div>
          <h1 className="text-4xl font-black mb-4 leading-tight" style={{ color: "var(--color-text-primary)" }}>
            Arabic OCR: Extract Text from Arabic Images Online (Free)
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            Arabic OCR presents unique challenges — right-to-left text, connected script, and diacritical marks. Here&apos;s how to get the best results using modern tools.
          </p>
        </div>

        <div className="space-y-8" style={{ color: "var(--color-text-secondary)" }}>
          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>Why Arabic OCR is different</h2>
            <p className="leading-relaxed">
              Arabic is a cursive script where letters connect differently based on their position in a word. Unlike Latin scripts, Arabic reads right-to-left, and includes optional diacritical marks (tashkeel) that change pronunciation and meaning. OCR engines must account for all of these features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>How to run Arabic OCR on Snafasa Scan</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Go to the <Link href="/convert" className="underline" style={{ color: "var(--color-primary-500)" }}>Convert page</Link></li>
              <li>Select <strong>Arabic (ara)</strong> from the language dropdown</li>
              <li>Upload your Arabic image (photo, screenshot, or scanned document)</li>
              <li>Optionally, boost <strong>Contrast</strong> to 120–140% for handwritten Arabic</li>
              <li>Click <strong>Extract Text</strong> — results appear in seconds</li>
            </ol>
            <p className="mt-3 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Note: Arabic language support requires a Standard tier or above.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>Tips for best Arabic OCR accuracy</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Use high-resolution images</strong> — at least 300 DPI if scanning documents</li>
              <li><strong>Avoid fonts with unusual styling</strong> — decorative Arabic fonts reduce accuracy</li>
              <li><strong>Enhance contrast first</strong> — use the brightness/contrast sliders to make text stand out</li>
              <li><strong>Flat, well-lit photos</strong> — shadows and angles reduce accuracy</li>
              <li><strong>Avoid mixed Arabic/English</strong> in a single image if possible — select the primary language</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>Common Arabic OCR use cases</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Digitizing Arabic books and academic papers</li>
              <li>Extracting text from Arabic newspaper clippings</li>
              <li>Converting Arabic handwritten notes to digital text</li>
              <li>Processing Arabic invoices and legal documents</li>
              <li>Translating Arabic content by first extracting the text</li>
            </ul>
          </section>

          <div className="card p-8 text-center mt-10" style={{ background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))" }}>
            <h3 className="text-2xl font-black text-white mb-3">Try Arabic OCR free</h3>
            <p className="text-white/80 mb-5">Private, fast, and browser-based. No uploads to any server.</p>
            <Link href="/convert" className="btn btn-accent btn-lg">
              <Scan className="h-4 w-4" />
              Extract Arabic text now
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
