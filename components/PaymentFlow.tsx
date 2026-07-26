"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Copy,
  CheckCircle2,
  Clock,
  Shield,
  ExternalLink,
  AlertCircle,
  CheckCheck,
  X,
} from "lucide-react";
import {
  createPendingPayment,
  submitPaymentProof,
  subscribeToPaymentStatus,
} from "@/lib/payments";
import { useAuth } from "@/lib/auth-context";
import { PAYONEER_LINK, TIERS, type PlanId } from "@/lib/config";
import { copyToClipboard } from "@/lib/utils";

interface PaymentFlowProps {
  tierId: PlanId;
  onComplete?: () => void;
}

type Step = "instructions" | "form" | "pending" | "approved" | "rejected";

export default function PaymentFlow({ tierId, onComplete }: PaymentFlowProps) {
  const { user, profile } = useAuth();
  const tier = TIERS.find((t) => t.id === tierId)!;

  const [step, setStep] = useState<Step>("instructions");
  const [docId, setDocId] = useState<string | null>(null);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Form state
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Step 1: create payment record
  const handleStart = async () => {
    if (!user || !profile) return;
    const { docId: id, referenceCode: code } = await createPendingPayment(
      user.uid,
      profile.email,
      tierId,
      tier.priceUsd
    );
    setDocId(id);
    setReferenceCode(code);
    setStep("form");
  };

  // Real-time status subscription
  useEffect(() => {
    if (!docId) return;
    const unsub = subscribeToPaymentStatus(docId, (status) => {
      if (status === "approved") { setStep("approved"); onComplete?.(); }
      if (status === "rejected") setStep("rejected");
    });
    return unsub;
  }, [docId, onComplete]);

  const handleCopyRef = async () => {
    if (!referenceCode) return;
    await copyToClipboard(referenceCode);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!transactionId.trim()) { setFormError("Please enter your Payoneer transaction ID / payment reference."); return; }
    if (!docId || !referenceCode || !user) return;

    setSubmitting(true);
    try {
      await submitPaymentProof(docId, user.uid, referenceCode, transactionId.trim());
      setStep("pending");
    } catch {
      setFormError("Submission failed. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render by step ─────────────────────────────────────────────
  if (step === "approved") {
    return (
      <div className="card p-8 text-center animate-scale-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-full mx-auto mb-4"
          style={{ background: "hsl(142 72% 40% / 0.12)" }}>
          <CheckCheck className="h-8 w-8" style={{ color: "var(--color-success)" }} />
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>
          You&rsquo;re upgraded! 🎉
        </h3>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Your account has been upgraded to <strong>{tier.name}</strong>. Enjoy all premium features!
        </p>
      </div>
    );
  }

  if (step === "rejected") {
    return (
      <div className="card p-8 text-center animate-scale-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-full mx-auto mb-4"
          style={{ background: "hsl(0 72% 51% / 0.08)" }}>
          <X className="h-8 w-8" style={{ color: "var(--color-error)" }} />
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>
          Payment could not be verified
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
          Our admin could not verify your payment transaction ID. Please double-check your reference code, or contact support.
        </p>
        <button onClick={() => setStep("instructions")} className="btn btn-outline">
          Try again
        </button>
      </div>
    );
  }

  if (step === "pending") {
    return (
      <div className="card p-8 text-center animate-scale-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-full mx-auto mb-4 animate-pulse-glow"
          style={{ background: "var(--color-primary-100)" }}>
          <Clock className="h-8 w-8" style={{ color: "var(--color-primary-500)" }} />
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>
          Payment submitted!
        </h3>
        <p className="text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>
          We&rsquo;re reviewing your payment reference. This typically takes <strong>a few hours</strong> (up to 1 business day).
          You&rsquo;ll see your plan update automatically on this page once approved — no need to refresh.
        </p>
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          Reference: <code className="font-mono font-bold">{referenceCode}</code>
        </p>
      </div>
    );
  }

  if (step === "instructions") {
    return (
      <div className="card p-6 animate-fade-in">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
            style={{ background: "var(--color-primary-100)" }}>
            <Shield className="h-5 w-5" style={{ color: "var(--color-primary-500)" }} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1" style={{ color: "var(--color-text-primary)" }}>
              Get {tier.name} — {tier.priceLabel}
            </h3>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Secure manual payment via Payoneer. One-time charge, lifetime access.
            </p>
          </div>
        </div>

        {/* Amount box */}
        <div className="rounded-xl p-5 mb-5 text-center"
          style={{ background: "var(--color-primary-50)", border: "2px solid var(--color-primary-200)" }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1"
            style={{ color: "var(--color-primary-600)" }}>Amount to pay</p>
          <p className="text-5xl font-black" style={{ color: "var(--color-primary-700)" }}>
            ${tier.priceUsd}<span className="text-2xl"> USD</span>
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--color-primary-600)" }}>
            ⚠️ Enter exactly this amount on Payoneer
          </p>
        </div>

        <p className="text-sm mb-5" style={{ color: "var(--color-text-secondary)" }}>
          Steps: Click below → Pay exactly <strong>${tier.priceUsd} USD</strong> on Payoneer → Come back and click &ldquo;I&rsquo;ve paid&rdquo;.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={PAYONEER_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary flex-1"
          >
            <ExternalLink className="h-4 w-4" />
            Pay ${tier.priceUsd} via Payoneer
          </a>
          <button onClick={handleStart} className="btn btn-outline flex-1">
            I&rsquo;ve paid → Submit transaction ID
          </button>
        </div>

        <p className="text-xs mt-4 text-center" style={{ color: "var(--color-text-muted)" }}>
          QR code for Payoneer payment link:
        </p>
        <div className="flex justify-center mt-2">
          <Image
            src="/payoneer-qr.png"
            alt="Payoneer payment QR code"
            width={140}
            height={140}
            className="rounded-lg"
          />
        </div>
      </div>
    );
  }

  // step === "form"
  return (
    <div className="card p-6 animate-fade-in">
      <h3 className="font-bold text-lg mb-1" style={{ color: "var(--color-text-primary)" }}>
        Submit payment proof
      </h3>
      <p className="text-sm mb-5" style={{ color: "var(--color-text-secondary)" }}>
        Enter your Payoneer transaction ID or payment reference number.
      </p>

      {/* Reference code */}
      {referenceCode && (
        <div className="rounded-xl p-4 mb-5"
          style={{ background: "var(--color-surface-3)", border: "1px solid var(--color-border)" }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1"
            style={{ color: "var(--color-text-muted)" }}>Your order reference code</p>
          <div className="flex items-center gap-3">
            <code className="text-xl font-mono font-black tracking-widest flex-1"
              style={{ color: "var(--color-primary-500)" }}>
              {referenceCode}
            </code>
            <button onClick={handleCopyRef} className="btn btn-ghost btn-sm">
              {copiedRef ? <CheckCircle2 className="h-4 w-4" style={{ color: "var(--color-success)" }} /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
            Include this in the Payoneer payment note/description if possible.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transaction ID */}
        <div>
          <label className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--color-text-secondary)" }}>
            Payoneer transaction ID / payment reference number
          </label>
          <input
            className="input"
            type="text"
            placeholder="e.g. 123456789 or Payoneer Email/Ref"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            required
          />
        </div>

        {/* Form error */}
        {formError && (
          <div className="flex items-start gap-2 p-3 rounded-lg"
            style={{ background: "hsl(0 72% 51% / 0.08)", border: "1px solid hsl(0 72% 51% / 0.2)" }}>
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--color-error)" }} />
            <p className="text-sm" style={{ color: "var(--color-error)" }}>{formError}</p>
          </div>
        )}

        {/* Submit */}
        <button type="submit" disabled={submitting} className="btn btn-primary w-full">
          {submitting ? (
            <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <><CheckCircle2 className="h-4 w-4" /> Submit payment reference</>
          )}
        </button>

        <p className="text-xs text-center" style={{ color: "var(--color-text-muted)" }}>
          Approval typically takes a few hours. You&rsquo;ll see your plan update automatically.
        </p>
      </form>
    </div>
  );
}
