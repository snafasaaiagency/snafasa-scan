// ──────────────────────────────────────────────────────────────
// Snafasa Scan — Central Configuration
// Change APP_NAME here once and it propagates everywhere.
// ──────────────────────────────────────────────────────────────

export const APP_NAME = "Snafasa Scan";
export const APP_TAGLINE = "Extract text from any image — instantly, privately, free";
export const AGENCY_NAME = "Snafasa AI Agency";
export const AGENCY_WEBSITE = "https://snafasa.com";

export const CONTACT_EMAIL = "snafasaaiagency@gmail.com";

// Free trial threshold for unauthenticated users before prompting sign-up
export const FREE_TRIAL_CONVERSIONS = 3;

// Language options
export interface LanguageOption {
  code: string; // Tesseract 3-letter code
  label: string; // Display name
  native: string;
}

export const ALL_LANGUAGES: LanguageOption[] = [
  { code: "eng", label: "English", native: "English" },
  { code: "spa", label: "Spanish", native: "Español" },
  { code: "fra", label: "French", native: "Français" },
  { code: "deu", label: "German", native: "Deutsch" },
  { code: "ara", label: "Arabic", native: "العربية" },
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

export const FREE_LANGUAGES: LanguageOption[] = ALL_LANGUAGES;
export const PREMIUM_LANGUAGES: LanguageOption[] = ALL_LANGUAGES;

export type PlanId = "free";
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
  languages: string;
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
    priceLabel: "100% Free",
    description: "Full-featured image-to-text extraction for everyone.",
    maxImagesPerConversion: 50,
    maxFileSizeMb: 100,
    languages: "20+",
    exportFormats: ["TXT", "DOCX", "PDF", "CSV", "ZIP"],
    cloudHistory: true,
    advancedEnhance: true,
    prioritySupport: true,
  },
];

export function getTierDef(_planId?: string): TierDef {
  return TIERS[0];
}
