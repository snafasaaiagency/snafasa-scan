import type { Metadata } from "next";
import { APP_NAME, AGENCY_NAME, CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${APP_NAME} — understand your rights and responsibilities when using our OCR service.`,
};

const LAST_UPDATED = "July 25, 2025";

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-black mb-2" style={{ color: "var(--color-text-primary)" }}>
          Terms of Service
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--color-text-muted)" }}>
          Last updated: {LAST_UPDATED}
        </p>

        <div className="prose-snafasa">
          <p>
            By accessing or using <strong>{APP_NAME}</strong> (&ldquo;the Service&rdquo;), a product of{" "}
            <strong>{AGENCY_NAME}</strong> (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), you agree to
            these Terms of Service. If you do not agree, please do not use the Service.
          </p>

          <h2>1. Description of Service</h2>
          <p>
            {APP_NAME} is a browser-based optical character recognition (OCR) tool that extracts text from
            images. All image processing occurs locally in your browser via WebAssembly (Tesseract.js). No image data
            is transmitted to our servers. We provide free and premium tiers with different features as described on
            the pricing page.
          </p>

          <h2>2. Accounts</h2>
          <p>
            You may use the free tier for up to three conversions without an account. To access more conversions or
            premium features, you must create an account with a valid email address. You are responsible for
            maintaining the security of your account credentials and for all activity under your account.
          </p>

          <h2>3. Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Process images that contain illegal content</li>
            <li>Attempt to reverse-engineer, scrape, or abuse the service infrastructure</li>
            <li>Create multiple accounts to circumvent free-tier limits</li>
            <li>Impersonate any person or entity</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>
          <p>
            Since OCR processing occurs entirely in your browser, the content of your images is not accessible to
            us. You are solely responsible for the images you process and the text you extract.
          </p>

          <h2>4. Premium Plans — Payments and Billing</h2>
          <p>
            All premium tiers are <strong>one-time, lifetime purchases</strong>. There are no recurring charges or
            automatic renewals. Payment is processed manually via Payoneer. Your plan is activated after manual
            verification of your payment by our admin team, which typically takes a few hours to one business day.
          </p>
          <p>
            Because payment verification is manual, we cannot guarantee instant activation. If your payment cannot
            be verified within 5 business days, please contact us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
          <p>
            Plan features are as described on the pricing page at the time of purchase. We reserve the right to
            modify features for future purchasers, but existing lifetime purchasers retain the features they paid
            for.
          </p>

          <h2>5. OCR Accuracy Disclaimer</h2>
          <p>
            <strong>
              OCR accuracy is not guaranteed and varies depending on image quality, font type, lighting conditions,
              and handwriting legibility.
            </strong>{" "}
            The Service is provided &ldquo;as is&rdquo; for informational and productivity purposes. Do not rely on
            extracted text for legally binding documents without manual verification.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            The {APP_NAME} name, logo, and website design are owned by {AGENCY_NAME}. The OCR engine (Tesseract.js)
            is open-source software licensed under the Apache 2.0 and MIT licenses. You retain all rights to images
            you upload and text you extract — we claim no ownership of your content.
          </p>

          <h2>7. Advertising</h2>
          <p>
            Free-tier users may see advertisements served by Google AdSense. We do not control the content of
            third-party advertisements. Premium users (Standard, Pro, Business plans) do not see ads.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, {AGENCY_NAME} shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages arising from your use of, or inability to use,
            the Service — including any inaccuracies in extracted text. Our total liability for any claim arising
            under these Terms shall not exceed the amount you paid for the relevant plan.
          </p>

          <h2>9. Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate these Terms. Lifetime plan holders
            whose accounts are terminated for Terms violations are not entitled to refunds.
          </p>

          <h2>10. Changes to Terms</h2>
          <p>
            We may update these Terms at any time. Material changes will be announced on the website. Continued use
            of the Service after changes constitutes acceptance of the updated Terms.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with applicable law. Any disputes shall be
            resolved through good-faith negotiation first, and then through appropriate legal channels if necessary.
          </p>

          <h2>12. Contact</h2>
          <p>
            For questions about these Terms, contact us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
