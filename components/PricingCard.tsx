"use client";

import { useRouter } from "next/navigation";
import { Check, Star, Zap, Crown, Building2 } from "lucide-react";
import { TIERS, type PlanId, type TierDef } from "@/lib/config";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import Link from "next/link";

const TIER_ICONS: Record<PlanId, React.ReactNode> = {
  free:  <Zap className="h-5 w-5" />,
  tier1: <Star className="h-5 w-5" />,
  tier2: <Zap className="h-5 w-5" />,
  tier3: <Crown className="h-5 w-5" />,
  tier4: <Building2 className="h-5 w-5" />,
};

interface PricingCardProps {
  tier: TierDef;
  current?: boolean;
  /** Called when a paid tier CTA is clicked and user is signed in */
  onSelect?: (tierId: PlanId) => void;
}

export function PricingCard({ tier, current, onSelect }: PricingCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const isHighlighted = !!tier.highlighted;

  const handleClick = () => {
    if (!user) {
      // Not signed in → send to sign-up with redirect back here
      router.push(`/account?tab=signup&redirect=/pricing?tier=${tier.id}`);
      return;
    }
    if (tier.id === "free") return;
    onSelect?.(tier.id);
  };

  const features = [
    `${tier.maxImagesPerConversion === "unlimited" ? "Unlimited" : tier.maxImagesPerConversion} image${tier.maxImagesPerConversion === 1 ? "" : "s"} per conversion`,
    `Up to ${tier.maxFileSizeMb} MB per file`,
    `${tier.languages} languages`,
    `Export: ${tier.exportFormats.map((f) => `.${f.toLowerCase()}`).join(", ")}`,
    tier.cloudHistory && "Conversion history saved",
    tier.advancedEnhance && "Advanced image enhancement",
    tier.prioritySupport && "Priority support",
    !tier.highlighted && "Community support",
  ].filter(Boolean) as string[];

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300",
        isHighlighted
          ? "pricing-card-highlighted scale-105 z-10"
          : "card hover:shadow-lg hover:-translate-y-1"
      )}
    >
      {/* Popular badge */}
      {tier.badge && (
        <div className="absolute top-0 inset-x-0 flex justify-center">
          <span className="px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-b-lg"
            style={{ background: "var(--color-accent-500)", color: "hsl(30 50% 15%)" }}>
            {tier.badge}
          </span>
        </div>
      )}

      <div className="p-6 pt-8 flex flex-col flex-1">
        {/* Icon + name */}
        <div className={cn("flex items-center gap-2 mb-2", isHighlighted ? "text-white/80" : "")}
          style={{ color: isHighlighted ? undefined : "var(--color-primary-500)" }}>
          {TIER_ICONS[tier.id]}
          <span className="text-sm font-semibold uppercase tracking-wider">{tier.name}</span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <span className={cn("text-4xl font-black", isHighlighted ? "text-white" : "")}
            style={{ color: isHighlighted ? undefined : "var(--color-text-primary)" }}>
            {tier.priceUsd === 0 ? "Free" : `$${tier.priceUsd}`}
          </span>
          {tier.priceUsd > 0 && (
            <span className={cn("text-sm ml-1", isHighlighted ? "text-white/70" : "")}
              style={{ color: isHighlighted ? undefined : "var(--color-text-muted)" }}>
              one-time · lifetime
            </span>
          )}
        </div>

        <p className={cn("text-sm mb-6 leading-relaxed", isHighlighted ? "text-white/80" : "")}
          style={{ color: isHighlighted ? undefined : "var(--color-text-secondary)" }}>
          {tier.description}
        </p>

        {/* Features */}
        <ul className="space-y-2.5 mb-8 flex-1">
          {features.map((feat) => (
            <li key={feat} className="flex items-start gap-2">
              <Check
                className="h-4 w-4 mt-0.5 shrink-0"
                style={{ color: isHighlighted ? "var(--color-accent-400)" : "var(--color-success)" }}
              />
              <span className={cn("text-sm", isHighlighted ? "text-white/90" : "")}
                style={{ color: isHighlighted ? undefined : "var(--color-text-secondary)" }}>
                {feat}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        {current ? (
          <div className="btn w-full text-center" style={{ background: "var(--color-surface-3)", color: "var(--color-text-muted)", cursor: "default" }}>
            ✓ Current plan
          </div>
        ) : tier.id === "free" ? (
          <Link href="/convert" className={cn("btn w-full text-center", isHighlighted ? "btn-accent" : "btn-outline")}>
            Start for free
          </Link>
        ) : (
          <button
            onClick={handleClick}
            className={cn("btn w-full", isHighlighted ? "btn-accent" : "btn-primary")}
          >
            Get {tier.name} — {tier.priceLabel}
          </button>
        )}
      </div>
    </div>
  );
}

// Full pricing grid
export default function PricingGrid({
  userPlan,
  onSelect,
}: {
  userPlan?: PlanId;
  onSelect?: (tierId: PlanId) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
      {TIERS.map((tier) => (
        <PricingCard key={tier.id} tier={tier} current={userPlan === tier.id} onSelect={onSelect} />
      ))}
    </div>
  );
}
