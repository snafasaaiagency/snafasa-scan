import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock, ChevronRight, GraduationCap } from "lucide-react";
import { APP_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: `OCR for Students: 5 Ways to Study Smarter | ${APP_NAME}`,
  description: "Discover how students use free OCR tools to digitize textbook pages, handwritten notes, and lecture slides — and save hours every week.",
};

export default function BlogOcrForStudents() {
  return (
    <article className="py-24 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs mb-8" style={{ color: "var(--color-text-muted)" }}>
          <Link href="/blog" className="hover:underline">Blog</Link>
          <ChevronRight className="h-3 w-3" />
          <span>OCR for Students</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge badge-primary flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" /> Students
            </span>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
              <Clock className="h-3.5 w-3.5" /> 5 min read
            </span>
          </div>
          <h1 className="text-4xl font-black mb-4 leading-tight" style={{ color: "var(--color-text-primary)" }}>
            OCR for Students: 5 Ways to Study Smarter in 2025
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            Optical Character Recognition (OCR) isn&apos;t just a professional tool. Students worldwide are using it to save hours on note-taking, research, and exam prep.
          </p>
        </div>

        {/* Content */}
        <div className="prose-content space-y-8" style={{ color: "var(--color-text-secondary)" }}>
          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>
              1. Digitize Textbook Pages Instantly
            </h2>
            <p className="leading-relaxed">
              Instead of retyping entire pages from textbooks or printed handouts, take a photo with your phone and run it through an OCR tool. You&apos;ll get editable, searchable text in seconds. This is especially helpful for annotating PDFs or creating study flashcards.
            </p>
            <p className="leading-relaxed mt-3">
              <strong>Pro tip:</strong> Use <Link href="/convert" className="underline" style={{ color: "var(--color-primary-500)" }}>Snafasa Scan</Link> on mobile — tap &quot;Take Photo&quot; directly in the upload zone and the image is processed immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>
              2. Convert Handwritten Notes to Text
            </h2>
            <p className="leading-relaxed">
              Handwriting OCR has improved dramatically. Modern AI-based OCR tools can recognize neat handwriting with 70–85% accuracy. If your handwriting is clean and the image is well-lit, you&apos;ll get surprisingly good results.
            </p>
            <p className="leading-relaxed mt-3">
              For best results: photograph your notes in good lighting, use a plain white background, and try our <strong>Brightness + Contrast sliders</strong> before running OCR.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>
              3. Extract Text from Lecture Slides & Screenshots
            </h2>
            <p className="leading-relaxed">
              Professors often share slides as PDFs or image-locked presentations. Instead of copying quotes manually, screenshot the slide and paste it into Snafasa Scan with <strong>Ctrl+V</strong>. You&apos;ll get all the text extracted in under 5 seconds.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>
              4. Build a Personal Knowledge Base
            </h2>
            <p className="leading-relaxed">
              Use OCR output to populate note-taking apps like Notion, Obsidian, or Roam Research. Export your extracted text as <strong>.txt or .docx</strong> and import it directly. Over a semester, this can turn a box of scattered images into a fully searchable digital library.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>
              5. Multilingual Study Support
            </h2>
            <p className="leading-relaxed">
              Studying in a second language? OCR supports 20+ languages including Arabic, Chinese, French, German, Spanish, and Hindi. Extract text from foreign-language textbooks and then use a translation tool side-by-side.
            </p>
          </section>

          {/* CTA */}
          <div className="card p-8 text-center mt-10" style={{ background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))" }}>
            <h3 className="text-2xl font-black text-white mb-3">Start converting for free</h3>
            <p className="text-white/80 mb-5">No account needed. Your images stay private.</p>
            <Link href="/convert" className="btn btn-accent btn-lg">
              <BookOpen className="h-4 w-4" />
              Try Snafasa Scan now
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
