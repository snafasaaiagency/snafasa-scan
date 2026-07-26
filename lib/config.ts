// ──────────────────────────────────────────────────────────────
// Snafasa Scan — Central Configuration
// Change APP_NAME here once and it propagates everywhere.
// ──────────────────────────────────────────────────────────────

export const APP_NAME = "Snafasa Scan";
export const APP_TAGLINE = "Extract text from any image — instantly, privately, free";
export const AGENCY_NAME = "Snafasa AI Agency";
export const AGENCY_WEBSITE = "https://snafasa.com";

export const PAYONEER_LINK =
  "https://link.payoneer.com/Token?t=9BF7AD9D5D78434092BD9E7D58456CE0&src=wpl";

export const CONTACT_EMAIL = "snafasaaiagency@gmail.com";

// Free trial threshold for unauthenticated users before prompting sign-up
export const FREE_TRIAL_CONVERSIONS = 3;

// Language options
export interface LanguageOption {
  code: string; // Tesseract 3-letter code
  label: string; // Display name
  native: string;
}

export const FREE_LANGUAGES: LanguageOption[] = [
  { code: "eng", label: "English", native: "English" },
  { code: "spa", label: "Spanish", native: "Español" },
  { code: "fra", label: "French", native: "Français" },
  { code: "deu", label: "German", native: "Deutsch" },
  { code: "ara", label: "Arabic", native: "العربية" },
];

export const PREMIUM_LANGUAGES: LanguageOption[] = [
  ...FREE_LANGUAGES,
  { code: "zho", label: "Chinese (Simplified)", native: "中文" },
  { code: "hin", label: "Hindi", native: "हिन्दी" },
  { code: "jpn", label: "Japanese", native: "日本語" },
  { code: "rus", label: "Russian", native: "Русский" },
  { code: "por", label: "Portuguese", native: "Português" },
  { code: "ita", label: "Italian", native: "Italiano" },
  { code: "nld", label: "Dutch", native: "Nederlands" },
  { code: "pol", label: "Polish", native: "Polski" },
  { code: "tur", label: "Turkish", native: "Türkçe" },
  { code: "kor", label: "Korean", native: "한국어" },
  { code: "swe", label: "Swedish", native: "Svenska" },
  { code: "ind", label: "Indonesian", native: "Bahasa Indonesia" },
  { code: "ukr", label: "Ukrainian", native: "Українська" },
  { code: "ces", label: "Czech", native: "Čeština" },
  { code: "ron", label: "Romanian", native: "Română" },
];

export type PlanId = "free" | "tier1" | "tier2" | "tier3" | "tier4";
export type UserRole = "user" | "admin";
export type PaymentStatus = "awaiting_payment" | "submitted" | "approved" | "rejected";

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

// Payoneer-compliant Pricing Tiers ($25, $30, $35)
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
    priceUsd: 25,
    priceLabel: "$25 one-time",
    description: "For users needing higher file limits & CSV exports.",
    maxImagesPerConversion: 10,
    maxFileSizeMb: 25,
    languages: "20+",
    exportFormats: ["TXT", "DOCX", "PDF", "CSV"],
    cloudHistory: false,
    advancedEnhance: true,
    prioritySupport: false,
  },
  {
    id: "tier2",
    name: "Standard",
    priceUsd: 30,
    priceLabel: "$30 one-time",
    description: "Most popular for students & working professionals.",
    maxImagesPerConversion: 25,
    maxFileSizeMb: 50,
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
    priceUsd: 35,
    priceLabel: "$35 one-time",
    description: "For power users processing multi-page documents.",
    maxImagesPerConversion: 50,
    maxFileSizeMb: 100,
    languages: "20+",
    exportFormats: ["TXT", "DOCX", "PDF", "CSV", "ZIP"],
    cloudHistory: true,
    advancedEnhance: true,
    prioritySupport: true,
  },
  {
    id: "tier4",
    name: "Business",
    priceUsd: 50,
    priceLabel: "$50 one-time",
    description: "Unlimited batch conversion for agency workflow.",
    maxImagesPerConversion: "unlimited",
    maxFileSizeMb: 250,
    languages: "20+",
    exportFormats: ["TXT", "DOCX", "PDF", "CSV", "ZIP"],
    cloudHistory: true,
    advancedEnhance: true,
    prioritySupport: true,
  },
];

export function getTierDef(planId: PlanId): TierDef {
  return TIERS.find((t) => t.id === planId) ?? TIERS[0];
}
