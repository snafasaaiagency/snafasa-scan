// lib/firebase.ts — Firebase client SDK (no Storage)
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY            ?? "AIzaSyA78Iz11rbYecsrW9mgMwx7BEAUJFueYPA",
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN        ?? "snafasa-scan.firebaseapp.com",
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID         ?? "snafasa-scan",
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET     ?? "snafasa-scan.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "532071871328",
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID             ?? "1:532071871328:web:f16957a6179ce7f4af2405",
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID     ?? "G-5VWKPH0LD1",
};

// Prevent duplicate initialization in Next.js SSR / hot-reload
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth: Auth = (() => {
  try { return getAuth(app); } catch { return {} as Auth; }
})();

export const db: Firestore = (() => {
  try { return getFirestore(app); } catch { return {} as Firestore; }
})();

// ── Analytics — browser-only ──────────────────────────────────────
let _analytics: Analytics | null = null;

export async function getAnalyticsInstance(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (_analytics) return _analytics;
  try {
    if (await isSupported()) _analytics = getAnalytics(app);
  } catch { /* blocked by adblocker */ }
  return _analytics;
}

import { logEvent } from "firebase/analytics";
export async function logAnalyticsEvent(
  eventName: string,
  params?: Record<string, unknown>
): Promise<void> {
  const analytics = await getAnalyticsInstance();
  if (analytics) {
    try { logEvent(analytics, eventName, params); } catch { /* ignore */ }
  }
}
