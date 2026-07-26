"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { APP_NAME, AGENCY_NAME } from "@/lib/config";

const FOOTER_LINKS = {
  Product: [
    { href: "/convert", label: "Convert Image" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
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
  return (
    <footer
      className="border-t mt-20"
      style={{
        borderColor: "var(--color-border)",
        background: "var(--color-surface-2)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-lg mb-3">
              <Image
                src="/logo.svg"
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
            <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
              A product of{" "}
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
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-current"
              aria-label="GitHub"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
