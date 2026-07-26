import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Scan } from "lucide-react";
import { APP_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: "Best Practices for Photographing Documents for High-Accuracy OCR",
  description: "Learn how lighting, angle, and image pre-processing dramatically improve optical character recognition accuracy.",
};

export default function Article2() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <article className="mx-auto max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-medium mb-6 hover:underline" style={{ color: "var(--color-primary-500)" }}>
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <span className="badge badge-primary mb-3">Guides</span>
        <h1 className="text-4xl font-black mb-4 leading-tight" style={{ color: "var(--color-text-primary)" }}>
          Best Practices for Photographing Documents for High-Accuracy OCR
        </h1>

        <div className="flex items-center gap-4 text-sm mb-8 pb-6 border-b" style={{ color: "var(--color-text-muted)", borderColor: "var(--color-border)" }}>
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> July 18, 2025</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 5 min read</span>
        </div>

        <div className="prose-snafasa">
          <p>
            Optical Character Recognition (OCR) algorithms rely on clear contrast between glyph shapes and background paper. A blurry, dim, or distorted photo can drop recognition accuracy from 98% down to 60%. Follow these simple guidelines to guarantee clean text outputs every time.
          </p>

          <h2>1. Ensure Even, Diffuse Lighting</h2>
          <p>
            Harsh direct shadows (such as your phone shadow cast over the page) confuse character segmentation routines. Position yourself near indirect natural window light or diffuse overhead lighting. Avoid using your camera flash directly overhead on glossy paper.
          </p>

          <h2>2. Shoot Directly Overhead (Parallel Lens to Page)</h2>
          <p>
            Keyhole or perspective distortion stretches letter proportions (making an &apos;o&apos; look squeezed). Hold your camera parallel to the document surface to prevent keystoning.
          </p>

          <h2>3. High Contrast & Sharp Focus</h2>
          <p>
            Ensure text is clearly dark against a bright light background. Tap to focus on the text before snapping the shot. High resolution (200+ DPI) ensures small serif fonts remain distinguishable.
          </p>

          <h2>4. Automatic Image Enhancement in {APP_NAME}</h2>
          <p>
            To help overcome imperfect real-world photos, {APP_NAME} automatically applies an advanced Canvas-based image pipeline before passing image bytes to Tesseract.js:
          </p>
          <ul>
            <li><strong>Grayscale Conversion:</strong> Removes chromatic noise and background tints.</li>
            <li><strong>Contrast Boosting:</strong> Enhances character edge definition.</li>
            <li><strong>Sharpening Filter:</strong> Sharpens blurred font edges.</li>
          </ul>
        </div>

        <div className="mt-12 p-8 card rounded-2xl text-center" style={{ background: "var(--color-surface-2)" }}>
          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>Test your photos right now</h3>
          <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>Instant client-side text extraction with automatic contrast enhancement.</p>
          <Link href="/convert" className="btn btn-primary">
            <Scan className="h-4 w-4" /> Try SnafasaScan Free
          </Link>
        </div>
      </article>
    </div>
  );
}
