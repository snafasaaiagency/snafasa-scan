import type { Metadata } from "next";
import { APP_NAME, AGENCY_NAME, CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: `Refund Policy for ${APP_NAME}. ${APP_NAME} is 100% free with no paid subscriptions or charges.`,
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-black mb-2" style={{ color: "var(--color-text-primary)" }}>
          Refund Policy
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--color-text-muted)" }}>
          Last updated: August 2026
        </p>

        <div className="prose-snafasa space-y-4">
          <p>
            <strong>{APP_NAME}</strong> (a product of <strong>{AGENCY_NAME}</strong>) is a <strong>100% free service</strong>.
          </p>

          <h2>1. No Charges or Subscriptions</h2>
          <p>
            All features on {APP_NAME} — including multi-language OCR, image enhancement, Word/PDF export, and cloud history — are provided completely free of charge. We do not accept payments, credit cards, or subscription fees.
          </p>

          <h2>2. No Refunds Required</h2>
          <p>
            Because users are never charged for using {APP_NAME}, refund requests are not applicable.
          </p>

          <h2>3. Questions & Support</h2>
          <p>
            If you have any questions or feedback about our free service, please contact us anytime at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
