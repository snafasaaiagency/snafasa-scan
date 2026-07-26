import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Scan,
  Upload,
  Cpu,
  Copy,
  Shield,
  Zap,
  Globe,
  Lock,
  ChevronRight,
  Star,
  CheckCircle2,
} from "lucide-react";
import { APP_NAME, APP_TAGLINE } from "@/lib/config";
import PricingGrid from "@/components/PricingCard";

export const metadata: Metadata = {
  title: `${APP_NAME} — Free Online OCR | Extract Text from Images`,
  description:
    "Free online OCR tool. Upload any image and extract text instantly. Your images never leave your browser — 100% private. No signup required for your first 3 conversions.",
};

const HOW_IT_WORKS = [
  {
    icon: <Upload className="h-7 w-7" />,
    title: "Upload your image",
    desc: "Drag & drop, click to browse, paste from clipboard, or take a photo on mobile. JPG, PNG, WebP, TIFF, BMP all supported.",
  },
  {
    icon: <Cpu className="h-7 w-7" />,
    title: "AI-powered OCR in your browser",
    desc: "Our advanced Tesseract OCR engine — running entirely in your browser via WebAssembly — processes the image with contrast boost and auto-enhancement. Nothing is uploaded.",
    highlight: true,
  },
  {
    icon: <Copy className="h-7 w-7" />,
    title: "Copy, edit & export",
    desc: "Get clean, editable text instantly. Copy to clipboard or export as .txt, .docx, .pdf, or .csv (premium tiers).",
  },
];

const FEATURES = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "100% Private",
    desc: "Your images never leave your device. All OCR runs locally via WebAssembly — verified by opening DevTools and watching the network tab.",
    accent: false,
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Blazing Fast",
    desc: "Advanced Canvas pre-processing (grayscale, contrast, sharpening) before OCR means higher accuracy without the wait.",
    accent: true,
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "20+ Languages",
    desc: "From English to Arabic, Chinese, Hindi, Japanese, Russian and more — support for over 20 languages in premium tiers.",
    accent: false,
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: "No Account Required",
    desc: "Start converting immediately — no sign-up gate. Create an account only when you're ready to unlock premium features.",
    accent: false,
  },
];

const FAQ = [
  {
    q: "Is SnafasaScan really free?",
    a: "Yes. The free tier lets you convert 1 image at a time with no cost and no credit card required. Your first 3 conversions don't even need a sign-up.",
  },
  {
    q: "Do my images get uploaded to your servers?",
    a: "No — never. All image processing runs directly in your browser using WebAssembly (Tesseract.js). You can verify this yourself by opening your browser's DevTools → Network tab and watching that no image data is sent anywhere.",
  },
  {
    q: "What image formats are supported?",
    a: "JPG, JPEG, PNG, WebP, TIFF, and BMP. On mobile you can also capture directly from your camera.",
  },
  {
    q: "Why are premium tiers a one-time payment, not a subscription?",
    a: "We believe you shouldn't be charged monthly for a utility tool you use occasionally. Pay once, use forever — we think that's fairer.",
  },
  {
    q: "How accurate is the OCR?",
    a: "For clean, well-lit printed text, accuracy is very high (90%+). For handwriting or low-contrast images, our pre-processing pipeline improves results significantly. Advanced enhancement is included in Standard, Pro, and Business tiers.",
  },
  {
    q: "Can I extract text from a PDF?",
    a: "Multi-page PDF support is available on the Pro and Business tiers. For the free and lower tiers, take a screenshot of the PDF page and convert that image.",
  },
];

const TESTIMONIALS = [
  {
    text: "I use this every week to digitize textbook pages. The accuracy is surprisingly good, and I love that my notes don't get uploaded anywhere.",
    author: "Aisha K.",
    role: "Graduate student",
    stars: 5,
  },
  {
    text: "Our team scans business cards and receipts using the batch mode. It saves hours of manual typing.",
    author: "Marco L.",
    role: "Operations manager",
    stars: 5,
  },
  {
    text: "Finally a free OCR tool that isn't plastered with popups or paywalled after one use. The privacy angle is a genuine selling point.",
    author: "Sam T.",
    role: "Freelance designer",
    stars: 5,
  },
];

export default function LandingPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero-gradient min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-fade-in"
          style={{ background: "var(--color-primary-100)", color: "var(--color-primary-700)", border: "1px solid var(--color-primary-200)" }}>
          <Image src="/icon.svg" alt={`${APP_NAME} logo`} width={20} height={20} />
          Images processed 100% in your browser — never uploaded
        </div>

        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-[1.05] animate-fade-in max-w-4xl"
          style={{ color: "var(--color-text-primary)", animationDelay: "0.1s" }}
        >
          Extract text from{" "}
          <span className="gradient-text">any image</span>
          <br />in seconds
        </h1>

        <p
          className="text-xl md:text-2xl mb-10 max-w-2xl leading-relaxed animate-fade-in"
          style={{ color: "var(--color-text-secondary)", animationDelay: "0.2s" }}
        >
          {APP_TAGLINE}. No signup, no uploads, no tracking. Just paste your image and go.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Link href="/convert" className="btn btn-primary btn-lg">
            <Scan className="h-5 w-5" />
            Convert image to text — free
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link href="/pricing" className="btn btn-outline btn-lg">
            View premium plans
          </Link>
        </div>

        {/* Trust chips */}
        <div className="flex flex-wrap justify-center gap-3 mt-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          {["No account needed", "No watermarks", "No image upload", "Works offline", "Open source OCR"].map((chip) => (
            <span key={chip} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}>
              <CheckCircle2 className="h-3 w-3" style={{ color: "var(--color-success)" }} />
              {chip}
            </span>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="py-24 px-4" style={{ background: "var(--color-surface-2)" }}>
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-primary-500)" }}>
              Simple process
            </p>
            <h2 className="text-4xl font-black mb-4" style={{ color: "var(--color-text-primary)" }}>
              How it works
            </h2>
            <div className="section-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className={`card p-8 relative overflow-hidden group transition-all duration-300 hover:-translate-y-2 ${step.highlight ? "border-primary" : ""}`}
                style={step.highlight ? { borderColor: "var(--color-primary-300)" } : {}}>
                {step.highlight && (
                  <div className="absolute inset-0 opacity-5" style={{ background: "var(--color-primary-500)" }} />
                )}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl mb-5 transition-transform group-hover:scale-110"
                  style={{ background: step.highlight ? "var(--color-primary-100)" : "var(--color-surface-3)", color: "var(--color-primary-500)" }}>
                  {step.icon}
                </div>
                <span className="text-5xl font-black mb-3 block" style={{ color: "var(--color-border)" }}>
                  0{i + 1}
                </span>
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/convert" className="btn btn-primary btn-lg">
              Try it now — it&apos;s free
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-primary-500)" }}>
              Why SnafasaScan
            </p>
            <h2 className="text-4xl font-black mb-4" style={{ color: "var(--color-text-primary)" }}>
              Built different
            </h2>
            <div className="section-divider" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((feat) => (
              <div key={feat.title} className="card p-7 flex gap-5 group hover:-translate-y-1 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: feat.accent ? "var(--color-primary-500)" : "var(--color-surface-3)", color: feat.accent ? "white" : "var(--color-primary-500)" }}>
                  {feat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1" style={{ color: "var(--color-text-primary)" }}>{feat.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing teaser ───────────────────────────────────── */}
      <section className="py-24 px-4" style={{ background: "var(--color-surface-2)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-primary-500)" }}>
              Simple, fair pricing
            </p>
            <h2 className="text-4xl font-black mb-4" style={{ color: "var(--color-text-primary)" }}>
              One-time payments, lifetime access
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
              No monthly subscriptions. Pay once for your tier and use it forever.
            </p>
            <div className="section-divider mt-6" />
          </div>
          <PricingGrid />
          <p className="text-center text-sm mt-8" style={{ color: "var(--color-text-muted)" }}>
            All premium tiers are one-time lifetime purchases — no recurring charges.{" "}
            <Link href="/pricing" className="underline" style={{ color: "var(--color-primary-500)" }}>
              Learn more about premium →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4" style={{ color: "var(--color-text-primary)" }}>
              Loved by users
            </h2>
            <div className="section-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.author} className="card p-7">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" style={{ color: "var(--color-accent-500)" }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--color-text-secondary)" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>{t.author}</p>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="py-24 px-4" style={{ background: "var(--color-surface-2)" }}>
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4" style={{ color: "var(--color-text-primary)" }}>
              Frequently asked questions
            </h2>
            <div className="section-divider" />
          </div>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <details key={item.q} className="card p-6 group">
                <summary className="flex items-center justify-between cursor-pointer list-none font-semibold"
                  style={{ color: "var(--color-text-primary)" }}>
                  {item.q}
                  <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90 shrink-0 ml-4"
                    style={{ color: "var(--color-text-muted)" }} />
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="card-elevated p-12 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))" }}
          >
            <div className="absolute inset-0 opacity-10"
              style={{ background: "radial-gradient(circle at 70% 30%, white, transparent 60%)" }} />
            <h2 className="text-4xl font-black text-white mb-4">
              Start extracting text now
            </h2>
            <p className="text-white/80 text-lg mb-8">
              No account needed. Your images stay private. Always free to start.
            </p>
            <Link href="/convert" className="btn btn-accent btn-lg">
              <Scan className="h-5 w-5" />
              Convert your first image — free
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
