// ──────────────────────────────────────────────────────────────
// SnafasaScan — Central Configuration
// Change APP_NAME here once and it propagates everywhere.
// ──────────────────────────────────────────────────────────────

export const APP_NAME = "SnafasaScan";
export const APP_TAGLINE = "Extract text from any image — instantly, privately, free";
export const AGENCY_NAME = "Snafasa AI Agency";
export const AGENCY_WEBSITE = "https://snafasa.com";

export const PAYONEER_LINK =
  "https://link.payoneer.com/Token?t=9BF7AD9D5D78434092BD9E7D58456CE0&src=wpl";

export const CONTACT_EMAIL = "snafasaaiagency@gmail.com";

// ── Plan IDs ────────────────────────────────────────────────────
export type PlanId = "free" | "tier1" | "tier2" | "tier3" | "tier4";
export type UserRole = "user" | "admin";

// ── Payment status ───────────────────────────────────────────────
export type PaymentStatus =
  | "awaiting_payment"
  | "submitted"
  | "approved"
  | "rejected";

// ── Tier definitions ─────────────────────────────────────────────
export interface TierDef {
  id: PlanId;
  name: string;
  priceUsd: number;
  priceLabel: string;
  description: string;
  maxImagesPerConversion: number | "unlimited";
  maxFileSizeMb: number;
  languages: "5" | "20+";
  exportFormats: string[];
  cloudHistory: boolean;
  advancedEnhance: boolean;
  prioritySupport: boolean;
  badge?: string;
  highlighted?: boolean;
}

export const TIERS: TierDef[] = [
  {
    id: "free",
    name: "Free",
    priceUsd: 0,
    priceLabel: "Always free",
    description: "Perfect for quick, casual image-to-text extraction.",
    maxImagesPerConversion: 1,
    maxFileSizeMb: 5,
    languages: "5",
    exportFormats: ["TXT"],
    cloudHistory: false,
    advancedEnhance: false,
    prioritySupport: false,
  },
  {
    id: "tier1",
    name: "Starter",
    priceUsd: 4,
    priceLabel: "$4 one-time",
    description: "For users who need higher file limits & clean exports.",
    maxImagesPerConversion: 3,
    maxFileSizeMb: 15,
    languages: "20+",
    exportFormats: ["TXT", "DOCX", "PDF"],
    cloudHistory: false,
    advancedEnhance: true,
    prioritySupport: false,
  },
  {
    id: "tier2",
    name: "Standard",
    priceUsd: 9,
    priceLabel: "$9 one-time",
    description: "Most popular for students & professionals.",
    maxImagesPerConversion: 10,
    maxFileSizeMb: 25,
    languages: "20+",
    exportFormats: ["TXT", "DOCX", "PDF", "CSV"],
    cloudHistory: true,
    advancedEnhance: true,
    prioritySupport: false,
    badge: "Most Popular",
    highlighted: true,
  },
  {
    id: "tier3",
    name: "Pro",
    priceUsd: 19,
    priceLabel: "$19 one-time",
    description: "For power users processing multi-page documents.",
    maxImagesPerConversion: 25,
    maxFileSizeMb: 50,
    languages: "20+",
    exportFormats: ["TXT", "DOCX", "PDF", "CSV"],
    cloudHistory: true,
    advancedEnhance: true,
    prioritySupport: true,
  },
  {
    id: "tier4",
    name: "Business",
    priceUsd: 39,
    priceLabel: "$39 one-time",
    description: "Unlimited batch conversion for agency workflow.",
    maxImagesPerConversion: "unlimited",
    maxFileSizeMb: 100,
    languages: "20+",
    exportFormats: ["TXT", "DOCX", "PDF", "CSV"],
    cloudHistory: true,
    advancedEnhance: true,
    prioritySupport: true,
    badge: "Unlimited",
  },
];

export function getTierDef(planId: PlanId): TierDef {
  return TIERS.find((t) => t.id === planId) ?? TIERS[0];
}

// ── Free trial limit ─────────────────────────────────────────────
export const FREE_TRIAL_CONVERSIONS = 3;

// ── OCR Supported Languages ─────────────────────────────────────
export interface LanguageOption {
  code: string;
  label: string;
}

export const FREE_LANGUAGES: LanguageOption[] = [
  { code: "eng", label: "English" },
  { code: "spa", label: "Spanish" },
  { code: "fra", label: "French" },
  { code: "deu", label: "German" },
  { code: "por", label: "Portuguese" },
];

export const PREMIUM_LANGUAGES: LanguageOption[] = [
  ...FREE_LANGUAGES,
  { code: "ara", label: "Arabic" },
  { code: "chi_sim", label: "Chinese (Simplified)" },
  { code: "chi_tra", label: "Chinese (Traditional)" },
  { code: "hin", label: "Hindi" },
  { code: "ita", label: "Italian" },
  { code: "jpn", label: "Japanese" },
  { code: "kor", label: "Korean" },
  { code: "nld", label: "Dutch" },
  { code: "pol", label: "Polish" },
  { code: "rus", label: "Russian" },
  { code: "tur", label: "Turkish" },
  { code: "ukr", label: "Ukrainian" },
  { code: "vie", label: "Vietnamese" },
  { code: "swe", label: "Swedish" },
  { code: "ron", label: "Romanian" },
];
