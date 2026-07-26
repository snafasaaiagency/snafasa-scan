"use client";

import { useState } from "react";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/config";
import { Mail, MessageSquare, Clock, Copy, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

const FAQ = [
  {
    q: "How long does payment verification take?",
    a: "We typically review and approve payments within a few hours. In rare cases it may take up to 1 business day.",
  },
  {
    q: "My payment was rejected — what do I do?",
    a: `Email us at ${CONTACT_EMAIL} with your order reference code (SNF-XXXXXX) and your Payoneer transaction ID. We will investigate and resolve it within 24 hours.`,
  },
  {
    q: "Can I get a refund?",
    a: "We offer refunds within 7 days of purchase if the product did not work as advertised. See our Refund Policy for full details.",
  },
  {
    q: "The OCR output is inaccurate — is that normal?",
    a: "OCR accuracy depends heavily on image quality. For best results, use clear, well-lit images with legible text. Our premium tiers include advanced image enhancement to improve accuracy.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. All OCR processing runs entirely in your browser using WebAssembly — your images are never uploaded to any server. We have no access to your files.",
  },
];

export default function ContactPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(CONTACT_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-4"
            style={{ background: "var(--color-primary-100)" }}>
            <MessageSquare className="h-7 w-7" style={{ color: "var(--color-primary-500)" }} />
          </div>
          <h1 className="text-4xl font-black mb-3" style={{ color: "var(--color-text-primary)" }}>
            Need Help? Contact Us
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
            If you encounter any issue, have a question, or need assistance with your payment, please email us directly and we will respond promptly!
          </p>
        </div>

        {/* Primary Email Card */}
        <div className="card p-8 mb-12 text-center relative overflow-hidden"
          style={{ background: "var(--color-surface-1)", border: "2px solid var(--color-primary-200)" }}>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl mx-auto mb-4"
            style={{ background: "var(--color-primary-100)" }}>
            <Mail className="h-8 w-8" style={{ color: "var(--color-primary-500)" }} />
          </div>

          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--color-primary-600)" }}>
            Official Support Email
          </p>

          <p className="text-2xl sm:text-3xl font-black font-mono mb-4 break-all" style={{ color: "var(--color-text-primary)" }}>
            {CONTACT_EMAIL}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <button
              onClick={handleCopy}
              className="btn btn-primary w-full sm:w-auto gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4" style={{ color: "var(--color-success)" }} />
                  Email Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Email Address
                </>
              )}
            </button>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="btn btn-outline w-full sm:w-auto gap-2"
            >
              <Mail className="h-4 w-4" />
              Open Email Client
            </a>
          </div>
        </div>

        {/* How to Get Support Guide */}
        <div className="card p-6 sm:p-8 mb-14">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "var(--color-text-primary)" }}>
            <ShieldCheck className="h-5 w-5" style={{ color: "var(--color-primary-500)" }} />
            How to Get Fast Support
          </h2>

          <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--color-text-secondary)" }}>
            When emailing us about an inquiry or issue, please include the following details so we can help you as quickly as possible:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold mb-2 text-white"
                style={{ background: "var(--color-primary-500)" }}>
                1
              </div>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--color-text-primary)" }}>
                Payment Issues
              </h3>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Include your order reference code (e.g., <code className="font-mono">SNF-XXXXXX</code>) and Payoneer transaction ID.
              </p>
            </div>

            <div className="p-4 rounded-xl" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold mb-2 text-white"
                style={{ background: "var(--color-primary-500)" }}>
                2
              </div>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--color-text-primary)" }}>
                Technical Bugs
              </h3>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Mention your device, browser (e.g., Chrome, Safari), and the error message you received.
              </p>
            </div>

            <div className="p-4 rounded-xl" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold mb-2 text-white"
                style={{ background: "var(--color-primary-500)" }}>
                3
              </div>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--color-text-primary)" }}>
                General Questions
              </h3>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Describe your question clearly and specify your account email address.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 p-4 rounded-xl"
            style={{ background: "var(--color-primary-50)", border: "1px solid var(--color-primary-200)" }}>
            <Clock className="h-5 w-5 shrink-0" style={{ color: "var(--color-primary-500)" }} />
            <p className="text-xs sm:text-sm" style={{ color: "var(--color-primary-700)" }}>
              <strong>Guaranteed Response:</strong> We review all support emails daily and will respond to you within <strong>24 hours</strong>.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-black mb-6 flex items-center gap-2" style={{ color: "var(--color-text-primary)" }}>
            <HelpCircle className="h-6 w-6" style={{ color: "var(--color-primary-500)" }} />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <div key={item.q} className="card p-6">
                <h3 className="font-bold mb-2 text-sm sm:text-base" style={{ color: "var(--color-text-primary)" }}>
                  {item.q}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Policy Footer Links */}
        <div className="flex flex-wrap justify-center gap-4 mt-12 text-sm"
          style={{ color: "var(--color-text-muted)" }}>
          <Link href="/refund-policy" style={{ color: "var(--color-primary-500)" }} className="hover:underline">
            Refund Policy
          </Link>
          <span>·</span>
          <Link href="/privacy-policy" style={{ color: "var(--color-primary-500)" }} className="hover:underline">
            Privacy Policy
          </Link>
          <span>·</span>
          <Link href="/terms-of-service" style={{ color: "var(--color-primary-500)" }} className="hover:underline">
            Terms of Service
          </Link>
        </div>

      </div>
    </div>
  );
}
