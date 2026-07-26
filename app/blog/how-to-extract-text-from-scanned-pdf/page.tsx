import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Scan } from "lucide-react";
import { APP_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: "How to Extract Text from a Scanned PDF Page for Free",
  description: "Learn how to turn non-selectable scanned PDF pages into clean, editable text using browser-side OCR.",
};

export default function Article1() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <article className="mx-auto max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-medium mb-6 hover:underline" style={{ color: "var(--color-primary-500)" }}>
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <span className="badge badge-primary mb-3">Tutorials</span>
        <h1 className="text-4xl font-black mb-4 leading-tight" style={{ color: "var(--color-text-primary)" }}>
          How to Extract Text from a Scanned PDF Page for Free
        </h1>

        <div className="flex items-center gap-4 text-sm mb-8 pb-6 border-b" style={{ color: "var(--color-text-muted)", borderColor: "var(--color-border)" }}>
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> July 20, 2025</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 4 min read</span>
        </div>

        <div className="prose-snafasa">
          <p>
            Have you ever opened a PDF document only to realize you can&apos;t highlight, select, or copy any of the words? That usually happens when the PDF is made up of scanned image pages rather than digital text vectors.
          </p>

          <h2>Why Scanned PDFs Trap Your Text</h2>
          <p>
            When a paper document is digitized using a scanner or camera, the scanning software saves each page as a single bitmap image. Even though your eyes easily recognize words and sentences, your PDF viewer sees only a grid of dark and light pixels.
          </p>

          <h2>Step-by-Step: Extracting Text Privately</h2>
          <ol>
            <li>
              <strong>Take a screenshot of the PDF page:</strong> Open your PDF viewer and take a clean screenshot of the page containing the text you need (Windows: <code>Win + Shift + S</code>, Mac: <code>Cmd + Shift + 4</code>).
            </li>
            <li>
              <strong>Open {APP_NAME}:</strong> Navigate to our free <Link href="/convert">OCR Converter</Link>.
            </li>
            <li>
              <strong>Paste or Upload:</strong> Directly paste your screenshot with <code>Ctrl + V</code> (or <code>Cmd + V</code>), or drag the image into the dropzone.
            </li>
            <li>
              <strong>Extract:</strong> Select your language and click <strong>Extract Text</strong>. In milliseconds, WebAssembly-powered Tesseract OCR processes the image in your browser.
            </li>
            <li>
              <strong>Export:</strong> Edit, copy, or download your text as a <code>.txt</code>, <code>.docx</code>, or <code>.pdf</code> file.
            </li>
          </ol>

          <h2>Why Client-Side OCR Matters for Confidential PDFs</h2>
          <p>
            Many free online converter sites upload your PDF files to remote cloud servers. If your document contains medical records, legal contracts, or personal bank statements, uploading it to an unknown server poses a security risk. {APP_NAME} performs 100% of text recognition inside your browser. No image data is ever transmitted.
          </p>
        </div>

        <div className="mt-12 p-8 card rounded-2xl text-center" style={{ background: "var(--color-surface-2)" }}>
          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>Ready to convert your PDF screenshots?</h3>
          <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>No sign-up required. Try your first 3 conversions completely free.</p>
          <Link href="/convert" className="btn btn-primary">
            <Scan className="h-4 w-4" /> Open Converter
          </Link>
        </div>
      </article>
    </div>
  );
}
