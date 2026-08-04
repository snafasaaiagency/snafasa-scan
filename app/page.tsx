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
  CheckCircle2,
  Check,
  X as XIcon,
} from "lucide-react";
import { APP_NAME, APP_TAGLINE } from "@/lib/config";
import StatsCounter from "@/components/StatsCounter";
import FaqAccordion from "@/components/FaqAccordion";

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
    q: "Is Snafasa Scan really free?",
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
    color: "#7c3aed",
  },
  {
    text: "Our team scans business cards and receipts using the batch mode. It saves hours of manual typing.",
    author: "Marco L.",
    role: "Operations manager",
    stars: 5,
    color: "#0284c7",
  },
  {
    text: "Finally a free OCR tool that isn't plastered with popups or paywalled after one use. The privacy angle is a genuine selling point.",
    author: "Sam T.",
    role: "Freelance designer",
    stars: 5,
    color: "#059669",
  },
];

// Competitor comparison data
const COMPARISON = {
  tools: ["Snafasa Scan", "Google Docs OCR", "Adobe Acrobat", "imagetotext.info"],
  features: [
    {
      label: "100% Private (no upload)",
      values: [true, false, false, false],
    },
    {
      label: "Free to use",
      values: [true, true, false, true],
    },
    {
      label: "No account required",
      values: [true, false, false, true],
    },
    {
      label: "Table detection",
      values: [true, false, true, false],
    },
    {
      label: "20+ languages",
      values: [true, true, true, false],
    },
    {
      label: "Export to .docx / .pdf",
      values: [true, false, true, false],
    },
    {
      label: "Works offline",
      values: [true, false, false, false],
    },
    {
      label: "One-time lifetime pricing",
      values: [true, false, false, false],
    },
  ],
};

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
            Convert image to text — 100% Free
            <ChevronRight className="h-4 w-4" />
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

      {/* ── Animated Statistics ───────────────────────────────── */}
      <section className="py-20 px-4" style={{ background: "var(--color-surface-2)" }}>
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-primary-500)" }}>
              Trusted worldwide
            </p>
            <h2 className="text-3xl font-black" style={{ color: "var(--color-text-primary)" }}>
              By the numbers
            </h2>
          </div>
          <StatsCounter />
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="py-24 px-4">
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
      <section className="py-24 px-4" style={{ background: "var(--color-surface-2)" }}>
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-primary-500)" }}>
              Why Snafasa Scan
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

      {/* ── Competitor Comparison ─────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-primary-500)" }}>
              How we compare
            </p>
            <h2 className="text-4xl font-black mb-4" style={{ color: "var(--color-text-primary)" }}>
              Snafasa Scan vs the rest
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
              See why thousands of users choose Snafasa Scan over other OCR tools.
            </p>
            <div className="section-divider mt-6" />
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "var(--color-surface-2)", borderBottom: "2px solid var(--color-border)" }}>
                    <th className="text-left px-5 py-4 font-semibold" style={{ color: "var(--color-text-muted)", minWidth: "200px" }}>
                      Feature
                    </th>
                    {COMPARISON.tools.map((tool, i) => (
                      <th key={tool} className="px-4 py-4 font-bold text-center" style={{
                        color: i === 0 ? "var(--color-primary-600)" : "var(--color-text-secondary)",
                        background: i === 0 ? "var(--color-primary-50)" : undefined,
                        borderLeft: "1px solid var(--color-border)",
                        minWidth: "130px",
                      }}>
                        {i === 0 && (
                          <span className="block text-xs font-bold px-2 py-0.5 rounded-full mb-1 mx-auto w-fit"
                            style={{ background: "var(--color-primary-100)", color: "var(--color-primary-700)" }}>
                            ✦ Best Choice
                          </span>
                        )}
                        {tool}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.features.map((feature, fi) => (
                    <tr
                      key={feature.label}
                      style={{
                        borderBottom: "1px solid var(--color-border)",
                        background: fi % 2 === 0 ? "transparent" : "var(--color-surface-1)",
                      }}
                    >
                      <td className="px-5 py-3.5 font-medium text-sm" style={{ color: "var(--color-text-primary)" }}>
                        {feature.label}
                      </td>
                      {feature.values.map((val, i) => (
                        <td key={i} className="px-4 py-3.5 text-center"
                          style={{ background: i === 0 ? "var(--color-primary-50)" : undefined, borderLeft: "1px solid var(--color-border)" }}>
                          {val ? (
                            <Check className="h-5 w-5 mx-auto" style={{ color: "var(--color-success)" }} />
                          ) : (
                            <XIcon className="h-4 w-4 mx-auto" style={{ color: "var(--color-text-muted)", opacity: 0.4 }} />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/convert" className="btn btn-primary btn-lg">
              <Scan className="h-5 w-5" />
              Try Snafasa Scan free — no account needed
            </Link>
          </div>
        </div>
      </section>

      {/* ── 100% Free banner ───────────────────────────────────── */}
      <section className="py-20 px-4" style={{ background: "var(--color-surface-2)" }}>
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--color-primary-500)" }}>
            100% Free Forever
          </p>
          <h2 className="text-4xl font-black mb-4" style={{ color: "var(--color-text-primary)" }}>
            All Features Unlocked — No Paid Plans, No Subscriptions
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: "var(--color-text-secondary)" }}>
            Extract text in over 20 languages, export to Word, PDF, CSV, or TXT, and enhance low-resolution images — completely free.
          </p>
          <Link href="/convert" className="btn btn-primary btn-lg">
            <Scan className="h-5 w-5" />
            Start converting now
          </Link>
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
              <div key={t.author} className="card p-7 hover:-translate-y-1 transition-all duration-300">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <svg key={i} className="h-4 w-4 fill-current" style={{ color: "var(--color-accent-500)" }} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--color-text-secondary)" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                {/* Author with avatar */}
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ background: t.color }}
                  >
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>{t.author}</p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{t.role}</p>
                  </div>
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
          <FaqAccordion items={FAQ} />
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
