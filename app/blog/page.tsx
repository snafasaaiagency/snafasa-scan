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
    slug: "how-to-extract-text-from-scanned-pdf",
    title: "How to Extract Text from a Scanned PDF Page for Free",
    excerpt:
      "Stuck with a scanned PDF document that won't let you select or copy text? Here is how to quickly extract editable text without installing expensive software.",
    date: "July 20, 2025",
    readTime: "4 min read",
    category: "Tutorials",
  },
  {
    slug: "ocr-best-practices-document-photography",
    title: "Best Practices for Photographing Documents for High-Accuracy OCR",
    excerpt:
      "Lighting, angle, and contrast matter. Discover simple camera and phone photography tricks to boost optical character recognition accuracy up to 99%.",
    date: "July 18, 2025",
    readTime: "5 min read",
    category: "Guides",
  },
  {
    slug: "free-vs-paid-ocr-tools-comparison",
    title: "Browser-Based Local OCR vs Cloud APIs: Privacy, Speed & Cost Compared",
    excerpt:
      "Why client-side WebAssembly OCR engines like Tesseract.js are changing document privacy and why you shouldn't pay monthly for basic text recognition.",
    date: "July 12, 2025",
    readTime: "6 min read",
    category: "Analysis",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="mx-auto max-w-5xl">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
