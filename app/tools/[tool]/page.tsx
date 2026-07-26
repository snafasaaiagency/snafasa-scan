import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Scan, CheckCircle2, Shield, Zap, Globe, ChevronRight } from "lucide-react";
import { APP_NAME } from "@/lib/config";

interface ToolConfig {
  slug: string;
  title: string;
  headline: string;
  description: string;
  features: string[];
  useCases: string[];
}

const TOOLS_DATA: Record<string, ToolConfig> = {
  "receipt-to-text": {
    slug: "receipt-to-text",
    title: "Free Receipt to Text Converter",
    headline: "Convert Receipts & Invoices to Editable Text or Excel",
    description: "Extract line items, dates, totals, and business details from physical receipts instantly. 100% private in your browser.",
    features: [
      "Auto-detect tabular row & column structures",
      "Export directly to CSV for Excel & accounting software",
      "Image contrast booster for faded thermal receipts",
      "100% offline & private processing",
    ],
    useCases: ["Business expense reports", "Tax document digitization", "Bookkeeping & accounting", "Personal spending tracking"],
  },
  "handwriting-to-text": {
    slug: "handwriting-to-text",
    title: "Free Handwriting to Text Converter",
    headline: "Turn Handwritten Notes & Letters into Digital Text",
    description: "AI-powered handwriting OCR engine converts handwritten pages, notebook notes, and whiteboard photos into editable text.",
    features: [
      "Optimized for cursive and block handwriting",
      "Live brightness, contrast, and sharpness pre-processing",
      "Export as TXT, Word (.docx), or PDF",
      "No file upload to external servers",
    ],
    useCases: ["Student lecture notes", "Whiteboard brainstorming sessions", "Historical family letters & journals", "Paper form digitization"],
  },
  "arabic-ocr": {
    slug: "arabic-ocr",
    title: "Free Arabic OCR Converter",
    headline: "Extract Arabic Text from Images Online",
    description: "Specialized OCR support for right-to-left Arabic script, connected typography, and diacritics.",
    features: [
      "Full support for right-to-left (RTL) layout",
      "High accuracy on Arabic books, documents, and news",
      "Browser-based speed via WebAssembly",
      "No account or subscription required",
    ],
    useCases: ["Arabic research papers & books", "Arabic receipts & contracts", "Language learning & translation prep", "Arabic social media screenshots"],
  },
  "pdf-to-text": {
    slug: "pdf-to-text",
    title: "Free Scanned PDF to Text OCR",
    headline: "Extract Text from Scanned PDF Images",
    description: "Easily extract non-selectable text from image-based scanned PDFs with instant accuracy.",
    features: [
      "Converts scanned PDF screenshots to plain text",
      "Preserves original line layout & formatting",
      "Fast 100% client-side conversion",
      "Export to DOCX, PDF, or TXT",
    ],
    useCases: ["Non-searchable legal contracts", "Archived government forms", "Scanned book pages & manuals", "E-book page extraction"],
  },
};

export function generateStaticParams() {
  return Object.keys(TOOLS_DATA).map((tool) => ({ tool }));
}

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const tool = TOOLS_DATA[resolvedParams.tool];
  if (!tool) return {};
  return {
    title: `${tool.title} | ${APP_NAME}`,
    description: tool.description,
  };
}

export default async function ToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const resolvedParams = await params;
  const tool = TOOLS_DATA[resolvedParams.tool];
  if (!tool) notFound();

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs mb-8" style={{ color: "var(--color-text-muted)" }}>
          <Link href="/" className="hover:underline">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span>Tools</span>
          <ChevronRight className="h-3 w-3" />
          <span>{tool.title}</span>
        </nav>

        {/* Hero header */}
        <div className="text-center mb-16">
          <span className="badge badge-primary mb-3">Specialized Tool</span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight" style={{ color: "var(--color-text-primary)" }}>
            {tool.headline}
          </h1>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            {tool.description}
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/convert" className="btn btn-primary btn-lg">
              <Scan className="h-5 w-5" />
              Use {tool.title} — Free
            </Link>
          </div>
        </div>

        {/* Features & Use cases */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Key Features */}
          <div className="card p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "var(--color-text-primary)" }}>
              <Zap className="h-5 w-5" style={{ color: "var(--color-primary-500)" }} />
              Key Features
            </h2>
            <ul className="space-y-3 text-sm">
              {tool.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--color-success)" }} />
                  <span style={{ color: "var(--color-text-secondary)" }}>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Use Cases */}
          <div className="card p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "var(--color-text-primary)" }}>
              <Globe className="h-5 w-5" style={{ color: "var(--color-primary-500)" }} />
              Common Use Cases
            </h2>
            <ul className="space-y-3 text-sm">
              {tool.useCases.map((uc) => (
                <li key={uc} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--color-primary-500)" }} />
                  <span style={{ color: "var(--color-text-secondary)" }}>{uc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Privacy Highlight Banner */}
        <div className="card p-8 text-center flex flex-col items-center" style={{ background: "var(--color-surface-2)" }}>
          <Shield className="h-10 w-10 mb-3" style={{ color: "var(--color-primary-500)" }} />
          <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>
            100% Private & Secure
          </h3>
          <p className="text-sm max-w-xl mb-6" style={{ color: "var(--color-text-secondary)" }}>
            Your images stay on your device. We use browser WebAssembly technology so your documents are processed locally without ever uploading to a cloud server.
          </p>
          <Link href="/convert" className="btn btn-primary">
            Start converting now
          </Link>
        </div>
      </div>
    </div>
  );
}
