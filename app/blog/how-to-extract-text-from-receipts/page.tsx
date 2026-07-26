import type { Metadata } from "next";
import Link from "next/link";
import { Receipt, Clock, ChevronRight, Scan } from "lucide-react";
import { APP_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: `How to Extract Text from Receipts & Invoices | ${APP_NAME}`,
  description: "Learn how to digitize receipts, invoices, and expense documents using free OCR technology. Save time on bookkeeping and expense tracking.",
};

export default function BlogReceiptOcr() {
  return (
    <article className="py-24 px-4">
      <div className="mx-auto max-w-2xl">
        <nav className="flex items-center gap-2 text-xs mb-8" style={{ color: "var(--color-text-muted)" }}>
          <Link href="/blog" className="hover:underline">Blog</Link>
          <ChevronRight className="h-3 w-3" />
          <span>Receipt OCR</span>
        </nav>

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge badge-primary flex items-center gap-1.5">
              <Receipt className="h-3.5 w-3.5" /> Finance
            </span>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
              <Clock className="h-3.5 w-3.5" /> 4 min read
            </span>
          </div>
          <h1 className="text-4xl font-black mb-4 leading-tight" style={{ color: "var(--color-text-primary)" }}>
            How to Extract Text from Receipts & Invoices (Free OCR Guide)
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            Stop manually typing receipt data into spreadsheets. Free OCR tools can extract text from receipts in seconds — and some even detect table structure automatically.
          </p>
        </div>

        <div className="space-y-8" style={{ color: "var(--color-text-secondary)" }}>
          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>Why receipt OCR matters</h2>
            <p className="leading-relaxed">
              Small business owners, freelancers, and finance teams spend hours every month manually entering receipt data. A study found that manual data entry has an error rate of up to 4%. OCR technology eliminates both the time cost and the errors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>Step 1: Photograph the receipt properly</h2>
            <p className="leading-relaxed">For best OCR accuracy on receipts:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Lay the receipt flat on a contrasting surface (white on dark, or dark on white)</li>
              <li>Use good lighting — avoid shadows and glare</li>
              <li>Ensure the entire receipt is within frame</li>
              <li>Hold your phone steady or use a scanner app</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>Step 2: Boost contrast before OCR</h2>
            <p className="leading-relaxed">
              Receipts are often printed on thermal paper with faded text. Before running OCR, use the <strong>Brightness & Contrast sliders</strong> in Snafasa Scan to enhance visibility. Setting contrast to 130–150% often dramatically improves accuracy on faded thermal receipts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>Step 3: Extract as table or CSV</h2>
            <p className="leading-relaxed">
              When Snafasa Scan detects a tabular layout (like a line-item receipt), it automatically switches to <strong>Table View</strong>. You can then export directly to <strong>.csv</strong> and open in Excel or Google Sheets — perfect for expense reporting.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>Step 4: Export and file</h2>
            <p className="leading-relaxed">
              Export your extracted receipt data as .txt, .csv, or .docx. Batch conversion (multiple receipts at once) is available on Pro and Business tiers, making it easy to process a month&apos;s worth of receipts in one session.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>Privacy: your receipts are sensitive</h2>
            <p className="leading-relaxed">
              Unlike many OCR services that upload your images to their servers, Snafasa Scan processes everything <strong>100% in your browser</strong>. Your receipt images — which may contain account numbers, purchase details, and business information — never leave your device.
            </p>
          </section>

          <div className="card p-8 text-center mt-10" style={{ background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))" }}>
            <h3 className="text-2xl font-black text-white mb-3">Try receipt OCR for free</h3>
            <p className="text-white/80 mb-5">No uploads. No account. Just fast, private text extraction.</p>
            <Link href="/convert" className="btn btn-accent btn-lg">
              <Scan className="h-4 w-4" />
              Convert a receipt now
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
