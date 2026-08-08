import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { APP_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: "Blog — OCR Guides & Text Extraction Tips",
  description:
    "Learn best practices for photographing documents, extracting text from scanned PDFs, and understanding browser-based OCR technology.",
};

export const BLOG_POSTS = [
  {
    slug: "ultimate-guide-in-browser-wasm-ocr-privacy",
    title: "The Ultimate Guide to In-Browser WASM OCR: Document Privacy in 2026",
    excerpt: "Discover how client-side WebAssembly (WASM) Optical Character Recognition protects confidential documents while extracting text instantly for free.",
    date: "August 9, 2026",
    readTime: "7 min read (1,250 words)",
    category: "Privacy & Tech",
  },
  {
    slug: "ocr-for-students-study-tips",
    title: "OCR for Students: 5 Ways to Study Smarter in 2025",
    excerpt: "Discover how students use free OCR tools to digitize textbook pages, handwritten notes, and lecture slides — and save hours every week.",
    date: "July 26, 2025",
    readTime: "5 min read",
    category: "Students",
  },
  {
    slug: "how-to-extract-text-from-receipts",
    title: "How to Extract Text from Receipts & Invoices (Free OCR Guide)",
    excerpt: "Stop manually typing receipt data into spreadsheets. Learn how free OCR tools digitize receipts and export directly to CSV tables.",
    date: "July 25, 2025",
    readTime: "4 min read",
    category: "Finance",
  },
  {
    slug: "arabic-ocr-guide",
    title: "Arabic OCR: Extract Text from Arabic Images Online (Free)",
    excerpt: "Learn how right-to-left Arabic OCR works, how to handle cursive scripts, and get the highest accuracy on Arabic documents.",
    date: "July 24, 2025",
    readTime: "4 min read",
    category: "Languages",
  },
  {
    slug: "handwriting-to-text",
    title: "Convert Handwriting to Text Free Online (2025 Guide)",
    excerpt: "Turn handwritten notes, letters, and whiteboards into editable digital text using free AI-powered OCR with zero image uploads.",
    date: "July 23, 2025",
    readTime: "5 min read",
    category: "How-To",
  },
  {
    slug: "best-free-ocr-tools-2025",
    title: "7 Best Free OCR Tools in 2025 (In-Depth Comparison)",
    excerpt: "Comparing the top 7 free online OCR tools across privacy, speed, accuracy, and ease of use.",
    date: "July 22, 2025",
    readTime: "6 min read",
    category: "Roundup",
  },
  {
    slug: "how-to-extract-text-from-scanned-pdf",
    title: "How to Extract Text from a Scanned PDF Page for Free",
    excerpt: "Stuck with a scanned PDF document that won't let you select or copy text? Quickly extract editable text without expensive software.",
    date: "July 20, 2025",
    readTime: "4 min read",
    category: "Tutorials",
  },
  {
    slug: "ocr-best-practices-document-photography",
    title: "Best Practices for Photographing Documents for High-Accuracy OCR",
    excerpt: "Lighting, angle, and contrast matter. Discover simple camera and phone photography tricks to boost OCR accuracy up to 99%.",
    date: "July 18, 2025",
    readTime: "5 min read",
    category: "Guides",
  },
  {
    slug: "free-vs-paid-ocr-tools-comparison",
    title: "Browser-Based Local OCR vs Cloud APIs: Privacy, Speed & Cost Compared",
    excerpt: "Why client-side WebAssembly OCR engines like Tesseract.js are changing document privacy and saving you subscription fees.",
    date: "July 12, 2025",
    readTime: "6 min read",
    category: "Analysis",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-primary-500)" }}>
            {APP_NAME} Blog
          </p>
          <h1 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: "var(--color-text-primary)" }}>
            Guides, Tips & OCR Technology
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
            Master text extraction, digitize documents faster, and learn how private browser OCR works.
          </p>
          <div className="section-divider mt-6" />
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article key={post.slug} className="card p-6 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
                  <span className="badge badge-primary">{post.category}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </span>
                </div>
                <h2 className="font-bold text-xl mb-3 leading-snug group-hover:text-indigo-500 transition-colors" style={{ color: "var(--color-text-primary)" }}>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--color-text-secondary)" }}>
                  {post.excerpt}
                </p>
              </div>
              <div className="pt-4 border-t flex items-center justify-between text-xs" style={{ borderColor: "var(--color-border)" }}>
                <span className="flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
                  <Clock className="h-3 w-3" />
                  {post.readTime}
                </span>
                <Link href={`/blog/${post.slug}`} className="flex items-center gap-1 font-semibold hover:underline" style={{ color: "var(--color-primary-500)" }}>
                  Read article <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
