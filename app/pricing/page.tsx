"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TIERS, type PlanId } from "@/lib/config";
import PricingGrid from "@/components/PricingCard";
import PaymentFlow from "@/components/PaymentFlow";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/config";

function PricingContent() {
  const params = useSearchParams();
  const urlTier = params.get("tier") as PlanId | null;
  const { user, profile } = useAuth();

  // selectedTier can be set by URL param OR by clicking a card
  const [selectedTier, setSelectedTier] = useState<PlanId | null>(
    urlTier && TIERS.find((t) => t.id === urlTier) ? urlTier : null
  );

  const handleSelectTier = (tierId: PlanId) => {
    setSelectedTier(tierId);
  };

  // ── Payment flow view ─────────────────────────────────────────
  if (selectedTier && user) {
    const tier = TIERS.find((t) => t.id === selectedTier)!;
    return (
      <div className="min-h-screen pt-28 pb-20 px-4">
        <div className="mx-auto max-w-lg">
          <button
            onClick={() => setSelectedTier(null)}
            className="flex items-center gap-2 btn btn-ghost btn-sm mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to pricing
          </button>

          <h1 className="text-3xl font-black mb-2" style={{ color: "var(--color-text-primary)" }}>
            Upgrade to {tier.name}
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--color-text-secondary)" }}>
            Complete your Payoneer payment and submit the transaction reference below.
          </p>

          <PaymentFlow tierId={selectedTier} onComplete={() => setSelectedTier(null)} />
        </div>
      </div>
    );
  }

  // ── Pricing grid view ─────────────────────────────────────────
  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--color-primary-500)" }}>
            Pricing
          </p>
          <h1 className="text-5xl font-black mb-4" style={{ color: "var(--color-text-primary)" }}>
            Simple, fair pricing
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-4" style={{ color: "var(--color-text-secondary)" }}>
            All premium tiers are <strong>one-time lifetime purchases</strong> — no monthly subscriptions, no auto-renewals.
          </p>
          <div className="section-divider" />
        </div>

        {/* Sign-in nudge if not logged in */}
        {!user && (
          <div className="mb-8 text-center p-4 rounded-2xl mx-auto max-w-lg"
            style={{ background: "var(--color-primary-50)", border: "1px solid var(--color-primary-200)" }}>
            <p className="text-sm" style={{ color: "var(--color-primary-700)" }}>
              <strong>Sign in first</strong> — clicking any paid plan will take you to sign up so we can link the payment to your account.
            </p>
          </div>
        )}

        {/* Pricing grid — pass onSelect callback */}
        <PricingGrid userPlan={profile?.plan} onSelect={handleSelectTier} />

        {/* How payment works */}
        <div className="mt-20 card p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-center" style={{ color: "var(--color-text-primary)" }}>
            How premium unlocking works
          </h2>
          <p className="text-sm text-center mb-8" style={{ color: "var(--color-text-secondary)" }}>
            We use a manual verification flow via Payoneer — secure and transparent.
          </p>

          <ol className="space-y-6">
            {[
              {
                n: "1",
                title: "Choose your tier and click &ldquo;Get&rdquo;",
                desc: "We generate a unique order reference code tied to your account.",
              },
              {
                n: "2",
                title: "Pay via Payoneer",
                desc: "Send the exact amount in USD via the Payoneer link. Include your reference code in the payment note if possible.",
              },
              {
                n: "3",
                title: "Submit your Payoneer Transaction ID",
                desc: "Enter the transaction reference number from your Payoneer payment confirmation.",
              },
              {
                n: "4",
                title: "Admin review (usually a few hours)",
                desc: "We manually verify the payment in our Payoneer dashboard. Your plan updates automatically — no refresh needed.",
              },
            ].map((step) => (
              <li key={step.n} className="flex gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full shrink-0 text-white font-bold text-sm"
                  style={{ background: "var(--color-primary-500)" }}>
                  {step.n}
                </div>
                <div>
                  <p className="font-semibold text-sm mb-0.5" style={{ color: "var(--color-text-primary)" }}
                    dangerouslySetInnerHTML={{ __html: step.title }} />
                  <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* FAQ footer */}
        <p className="text-center text-sm mt-8" style={{ color: "var(--color-text-muted)" }}>
          Questions?{" "}
          <Link href="/refund-policy" className="underline" style={{ color: "var(--color-primary-500)" }}>
            Read our refund policy
          </Link>{" "}
          or{" "}
          <Link href={`mailto:${CONTACT_EMAIL}`} className="underline" style={{ color: "var(--color-primary-500)" }}>
            contact support
          </Link>.
        </p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 animate-spin" style={{ borderColor: "var(--color-primary-500)", borderTopColor: "transparent" }} />
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}
