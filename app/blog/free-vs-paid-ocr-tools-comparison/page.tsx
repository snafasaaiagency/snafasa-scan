import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Scan } from "lucide-react";
import { APP_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: "Browser-Based Local OCR vs Cloud APIs: Privacy, Speed & Cost",
  description: "Comparing client-side WebAssembly OCR engines to hosted cloud APIs in terms of cost, security, and performance.",
};

export default function Article3() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <article className="mx-auto max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-medium mb-6 hover:underline" style={{ color: "var(--color-primary-500)" }}>
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <span className="badge badge-primary mb-3">Analysis</span>
        <h1 className="text-4xl font-black mb-4 leading-tight" style={{ color: "var(--color-text-primary)" }}>
          Browser-Based Local OCR vs Cloud APIs: Privacy, Speed & Cost Compared
        </h1>

        <div className="flex items-center gap-4 text-sm mb-8 pb-6 border-b" style={{ color: "var(--color-text-muted)", borderColor: "var(--color-border)" }}>
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> July 12, 2025</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 6 min read</span>
        </div>

        <div className="prose-snafasa">
          <p>
            When choosing an online OCR service, users are typically confronted with two models: cloud-hosted APIs (like Google Cloud Vision or ABBYY) or client-side WebAssembly solutions (like Tesseract.js in {APP_NAME}).
          </p>

          <h2>1. Privacy & Security</h2>
          <p>
            Traditional SaaS OCR solutions upload your image file to a remote cloud server. Even if the service promises not to store your files, transmitting unencrypted image data across networks introduces third-party risk. In contrast, local WebAssembly execution guarantees that no image byte ever leaves your browser sandbox.
          </p>

          <h2>2. Pricing Models</h2>
          <p>
            Cloud OCR services incur per-request server costs (metered by API calls), which forces software vendors to lock basic features behind expensive monthly subscriptions. Local browser execution eliminates server compute costs completely, allowing services like {APP_NAME} to offer unlimited free conversions without recurring monthly fees.
          </p>

          <h2>3. Feature Comparison Table</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--color-border)" }}>
                  <th className="py-2 px-3">Feature</th>
                  <th className="py-2 px-3">Local WASM OCR ({APP_NAME})</th>
                  <th className="py-2 px-3">Cloud OCR Services</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b" style={{ borderColor: "var(--color-border)" }}>
                  <td className="py-2 px-3 font-semibold">Data Privacy</td>
                  <td className="py-2 px-3 text-emerald-600 font-medium">100% Private (No upload)</td>
                  <td className="py-2 px-3 text-amber-600">Uploaded to third-party server</td>
                </tr>
                <tr className="border-b" style={{ borderColor: "var(--color-border)" }}>
                  <td className="py-2 px-3 font-semibold">Subscription Cost</td>
                  <td className="py-2 px-3 text-emerald-600 font-medium">$0 Free / One-time lifetime options</td>
                  <td className="py-2 px-3 text-rose-600">$10–$50 / month recurring</td>
                </tr>
                <tr className="border-b" style={{ borderColor: "var(--color-border)" }}>
                  <td className="py-2 px-3 font-semibold">Offline Capable</td>
                  <td className="py-2 px-3 text-emerald-600 font-medium">Yes (once loaded)</td>
                  <td className="py-2 px-3 text-rose-600">No (requires internet connection)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 p-8 card rounded-2xl text-center" style={{ background: "var(--color-surface-2)" }}>
          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>Experience Private Browser OCR</h3>
          <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>Zero data upload. Fast, accurate, and completely free to start.</p>
          <Link href="/convert" className="btn btn-primary">
            <Scan className="h-4 w-4" /> Try {APP_NAME}
          </Link>
        </div>
      </article>
    </div>
  );
}
