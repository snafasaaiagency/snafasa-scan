import type { Metadata } from "next";
import { APP_NAME, AGENCY_NAME, CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: `Refund Policy for ${APP_NAME} — understand how manual payment refunds work for our Payoneer-based payment system.`,
};

const LAST_UPDATED = "July 25, 2025";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-black mb-2" style={{ color: "var(--color-text-primary)" }}>
          Refund Policy
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--color-text-muted)" }}>
          Last updated: {LAST_UPDATED}
        </p>

        <div className="prose-snafasa">
          <p>
            This Refund Policy applies to all purchases made through <strong>{APP_NAME}</strong>, a product of{" "}
            <strong>{AGENCY_NAME}</strong>. Because our payment system uses a manual Payoneer verification flow,
            our refund process is also handled manually. We aim to be fair, prompt, and transparent.
          </p>

          <h2>1. How Payments Work</h2>
          <p>
            Payments are made via Payoneer using a shared payment link. After paying, you submit a screenshot of
            your confirmation along with a reference code. Our admin manually verifies the payment and activates
            your plan. This process typically takes a few hours, up to one business day.
          </p>
          <p>
            Because this is a manual process, the amount you pay must exactly match the price of the tier you
            selected. The UI clearly displays the required amount before you proceed to Payoneer.
          </p>

          <h2>2. Eligibility for Refunds</h2>
          <p>You are eligible for a full refund in the following circumstances:</p>
          <ul>
            <li>
              <strong>Payment verification failure:</strong> If your payment cannot be verified within 5 business
              days and your plan has not been activated.
            </li>
            <li>
              <strong>Duplicate payment:</strong> If you accidentally paid twice for the same tier.
            </li>
            <li>
              <strong>Wrong amount:</strong> If you paid an amount different from the stated tier price and your
              plan was not activated.
            </li>
            <li>
              <strong>Technical failure:</strong> If our service is fundamentally broken and we cannot resolve the
              issue within a reasonable time.
            </li>
          </ul>

          <h2>3. Non-Refundable Situations</h2>
          <p>Refunds will generally not be granted for:</p>
          <ul>
            <li>Dissatisfaction with OCR accuracy (accuracy is not guaranteed — see our Terms of Service)</li>
            <li>Change of mind after your plan has been activated and premium features were accessible</li>
            <li>Accounts terminated for violating our Terms of Service</li>
          </ul>

          <h2>4. How to Request a Refund</h2>
          <p>To request a refund:</p>
          <ol>
            <li>
              Email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with the subject line
              &ldquo;Refund Request — [Your Reference Code]&rdquo;.
            </li>
            <li>Include your order reference code (e.g., SNF-XXXXXX), Payoneer transaction ID, and the reason for the refund request.</li>
            <li>
              We will review your request within 3 business days and respond with a decision.
            </li>
          </ol>

          <h2>5. How Refunds Are Processed</h2>
          <p>
            Approved refunds are returned via the same Payoneer channel through which the original payment was
            made. Processing time depends on Payoneer&rsquo;s transfer timelines, typically 1–5 business days after
            approval.
          </p>

          <h2>6. Plan Downgrade on Refund</h2>
          <p>
            If a refund is approved after your premium plan was activated, your account will be downgraded to the
            Free plan upon refund completion.
          </p>

          <h2>7. Contact</h2>
          <p>
            For refund inquiries, contact us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We aim to respond within 1 business day.
          </p>
        </div>
      </div>
    </div>
  );
}
