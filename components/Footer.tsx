"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowUp, Heart } from "lucide-react";
import { APP_NAME, AGENCY_NAME } from "@/lib/config";

const FOOTER_LINKS = {
  Product: [
    { href: "/convert", label: "Convert Image" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog & Guides" },
  ],
  Tools: [
    { href: "/tools/receipt-to-text", label: "Receipt to Text" },
    { href: "/tools/handwriting-to-text", label: "Handwriting OCR" },
    { href: "/tools/arabic-ocr", label: "Arabic OCR" },
    { href: "/tools/pdf-to-text", label: "PDF OCR" },
  ],
  Legal: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-of-service", label: "Terms of Service" },
    { href: "/refund-policy", label: "Refund Policy" },
  ],
  Support: [
    { href: "/contact", label: "Contact Us" },
    { href: "/account", label: "My Account" },
  ],
};

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="border-t mt-20"
      style={{
        borderColor: "var(--color-border)",
        background: "var(--color-surface-2)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-lg mb-3">
              <Image
                src="/icon.svg"
                alt={`${APP_NAME} logo`}
                width={30}
                height={30}
              />
              <span style={{ color: "var(--color-text-primary)", fontFamily: "Space Grotesk, sans-serif" }}>
                {APP_NAME}
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--color-text-muted)" }}>
              Extract text from any image, instantly and privately. Your images never leave your browser.
            </p>
            <p className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
              Made with <Heart className="h-3 w-3 text-red-500 fill-current" /> by{" "}
              <span style={{ color: "var(--color-primary-500)" }}>{AGENCY_NAME}</span>
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3
                className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: "var(--color-text-muted)" }}
              >
                {section}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        className="flex items-center gap-1 text-sm transition-colors"
                        style={{ color: "var(--color-text-secondary)" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-primary-500)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)")}
                      >
                        {link.label}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm transition-colors"
                        style={{ color: "var(--color-text-secondary)" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-primary-500)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)")}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t text-xs"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
        >
          <p>
            © {new Date().getFullYear()} {APP_NAME} · A product of{" "}
            <span style={{ color: "var(--color-text-secondary)" }}>{AGENCY_NAME}</span>
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: "var(--color-success)" }}
              />
              All systems operational
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-primary-500 transition-colors"
              aria-label="Back to top"
            >
              Back to top <ArrowUp className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
