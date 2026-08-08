import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { APP_NAME, APP_TAGLINE, getBaseUrl } from "@/lib/config";
import { Toaster } from "react-hot-toast";

const BASE_URL = getBaseUrl();
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: `%s | ${APP_NAME}`,
    default: `${APP_NAME} — ${APP_TAGLINE}`,
  },
  description:
    "Free online OCR tool. Extract text from images, photos, scanned documents, and screenshots instantly. Your images never leave your browser — 100% private.",
  keywords: [
    "image to text converter",
    "OCR online free",
    "extract text from photo",
    "convert screenshot to text",
    "online OCR",
    "scan document to text",
    "free text extraction",
    "SnafasaScan",
  ],
  authors: [{ name: "Snafasa AI Agency" }],
  creator: "Snafasa AI Agency",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description:
      "Free online OCR. Extract text from any image in seconds. Private, fast, no signup required for first 3 conversions.",
    images: [{ url: "/logo.svg", width: 800, height: 800, alt: APP_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description: "Free online OCR tool. Extract text from images instantly. 100% private — no image ever leaves your browser.",
    images: ["/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: BASE_URL },
  verification: {
    google: "TcR0Cyyp7dnvDDayr-aUTjnGwy8n-bdzgwLr1q0aBU4",
  },
};

// JSON-LD structured data — SoftwareApplication
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: APP_NAME,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free tier available",
  },
  description:
    "Browser-based OCR tool that extracts text from images privately. No image upload to servers — all processing happens in your browser via WebAssembly.",
  url: BASE_URL,
  author: { "@type": "Organization", name: "Snafasa AI Agency" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-5VWKPH0LD1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-5VWKPH0LD1');
          `}
        </Script>

        {/* Preconnect for Google Fonts (loaded in CSS) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Google AdSense — only load if publisher ID is set */}
        {ADSENSE_CLIENT && ADSENSE_CLIENT !== "ca-pub-XXXXXXXXXXXXXXXXX" && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        {/* Dark mode initialization — prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--color-surface)",
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-border)",
                borderRadius: "12px",
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: "14px",
              },
            }}
          />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
