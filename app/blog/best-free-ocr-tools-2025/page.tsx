import type { Metadata } from "next";
import Link from "next/link";
import { Star, Clock, ChevronRight, Scan } from "lucide-react";
import { APP_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: `7 Best Free OCR Tools in 2025 (Compared) | ${APP_NAME}`,
  description: "Comprehensive comparison of the best free image to text OCR tools in 2025. Compare features, speed, accuracy, and privacy.",
};

export default function BlogBestOcrTools() {
  return (
    <article className="py-24 px-4">
      <div className="mx-auto max-w-2xl">
        <nav className="flex items-center gap-2 text-xs mb-8" style={{ color: "var(--color-text-muted)" }}>
          <Link href="/blog" className="hover:underline">Blog</Link>
          <ChevronRight className="h-3 w-3" />
          <span>Best Free OCR Tools</span>
        </nav>

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge badge-primary flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5" /> Roundup
            </span>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
              <Clock className="h-3.5 w-3.5" /> 6 min read
            </span>
          </div>
          <h1 className="text-4xl font-black mb-4 leading-tight" style={{ color: "var(--color-text-primary)" }}>
            7 Best Free OCR Tools in 2025 (In-Depth Comparison)
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            Looking for a fast, reliable, and private way to extract text from images? We evaluated the top 7 free online OCR tools in 2025 across accuracy, speed, privacy, and ease of use.
          </p>
        </div>

        <div className="space-y-8" style={{ color: "var(--color-text-secondary)" }}>
          <section className="card p-6" style={{ borderColor: "var(--color-primary-400)" }}>
            <span className="badge badge-primary mb-2">#1 Top Pick for Privacy & Speed</span>
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>1. Snafasa Scan</h2>
            <p className="leading-relaxed text-sm mb-3">
              <strong>Snafasa Scan</strong> sets a new benchmark for web-based OCR by running 100% locally in your browser via WebAssembly. Your images never get uploaded to any third-party server, guaranteeing absolute confidentiality.
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><strong>Pros:</strong> 100% private, no image uploads, instant pre-processing sliders, automatic table grid layout, free tier with no sign-up requirement.</li>
              <li><strong>Best for:</strong> Privacy-conscious users, students, accountants, and finance teams handling sensitive documents.</li>
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>2. Google Drive / Docs OCR</h2>
            <p className="leading-relaxed text-sm mb-3">
              Google Drive automatically performs OCR on uploaded images and PDFs when you open them in Google Docs.
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><strong>Pros:</strong> Highly accurate on clear printed documents, supports multiple languages.</li>
              <li><strong>Cons:</strong> Requires a Google account, uploads your files to Google servers, loses table formatting easily.</li>
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>3. ImageToText.info</h2>
            <p className="leading-relaxed text-sm mb-3">
              A dedicated web-based OCR utility popular for quick conversions.
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><strong>Pros:</strong> Simple interface, quick upload.</li>
              <li><strong>Cons:</strong> Ad-heavy interface, uploads files to cloud servers, strict daily limits on free accounts.</li>
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>4. PrePostSeo OCR</h2>
            <p className="leading-relaxed text-sm mb-3">
              Part of the PrePostSeo web tools suite for webmasters and content creators.
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><strong>Pros:</strong> Multiple file uploads allowed.</li>
              <li><strong>Cons:</strong> Frequent popups, limited pre-processing controls.</li>
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>5. Klippa OCR</h2>
            <p className="leading-relaxed text-sm mb-3">
              Focused on enterprise document processing and receipt management.
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><strong>Pros:</strong> Excellent structured data extraction for receipts.</li>
              <li><strong>Cons:</strong> Commercial tool requiring paid plans for regular use.</li>
            </ul>
          </section>

          <div className="card p-8 text-center mt-10" style={{ background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))" }}>
            <h3 className="text-2xl font-black text-white mb-3">Try #1 Pick: Snafasa Scan</h3>
            <p className="text-white/80 mb-5">100% Browser-based. No uploads. No sign-up required.</p>
            <Link href="/convert" className="btn btn-accent btn-lg">
              <Scan className="h-4 w-4" />
              Convert an image free
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
