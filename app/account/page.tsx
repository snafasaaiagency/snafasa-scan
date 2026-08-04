"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import AuthModal from "@/components/AuthModal";
import { APP_NAME } from "@/lib/config";
import {
  User,
  Mail,
  Calendar,
  Star,
  History,
  Crown,
  LogOut,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ConversionRecord {
  id: string;
  createdAt: Timestamp;
  language: string;
  sourceFileName: string;
  extractedTextPreview: string;
}

function AccountContent() {
  const { user, profile, signOut, loading } = useAuth();
  const params = useSearchParams();
  const router = useRouter();
  const defaultTab = params.get("tab") === "signup" ? "signup" : "signin";

  const [conversions, setConversions] = useState<ConversionRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Load conversion history for registered users
  useEffect(() => {
    if (!user || !profile) return;

    let ignore = false;
    setLoadingHistory(true);
    const load = async () => {
      try {
        const q = query(
          collection(db, "conversions"),
          where("uid", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        if (!ignore) {
          setConversions(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ConversionRecord)));
          setLoadingHistory(false);
        }
      } catch {
        if (!ignore) setLoadingHistory(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, [user, profile]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--color-primary-500)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  // Not signed in — show auth form
  if (!user || !profile) {
    return (
      <div className="min-h-screen pt-28 pb-20 px-4">
        <div className="mx-auto max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black mb-2" style={{ color: "var(--color-text-primary)" }}>
              Welcome to {APP_NAME}
            </h1>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Sign in or create a free account to access your dashboard.
            </p>
          </div>
          <AuthModal defaultTab={defaultTab as "signin" | "signup"} onSuccess={() => router.push("/account")} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-black mb-8" style={{ color: "var(--color-text-primary)" }}>
          My Account
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile card */}
          <div className="md:col-span-1 space-y-5">
            <div className="card p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-white text-2xl font-black mb-4"
                style={{ background: "var(--color-primary-500)" }}>
                {(profile.displayName || profile.email)[0].toUpperCase()}
              </div>
              <h2 className="font-bold text-lg mb-0.5" style={{ color: "var(--color-text-primary)" }}>
                {profile.displayName || "User"}
              </h2>

              <div className="space-y-2 mt-4 text-sm">
                <div className="flex items-center gap-2" style={{ color: "var(--color-text-secondary)" }}>
                  <Mail className="h-4 w-4" style={{ color: "var(--color-text-muted)" }} />
                  {profile.email}
                </div>
                <div className="flex items-center gap-2" style={{ color: "var(--color-text-secondary)" }}>
                  <Star className="h-4 w-4" style={{ color: "var(--color-text-muted)" }} />
                  100% Free Plan
                </div>
                {profile.role === "admin" && (
                  <div className="flex items-center gap-2" style={{ color: "var(--color-primary-500)" }}>
                    <Crown className="h-4 w-4" />
                    Admin
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-2">
                <Link href="/convert" className="btn btn-primary w-full btn-sm">
                  Convert image
                </Link>
                {profile.role === "admin" && (
                  <Link href="/admin" className="btn btn-outline w-full btn-sm">
                    Admin panel
                  </Link>
                )}
                <button onClick={signOut} className="btn btn-ghost w-full btn-sm">
                  <LogOut className="h-3.5 w-3.5" /> Sign out
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            {/* Current plan */}
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-3" style={{ color: "var(--color-text-primary)" }}>
                Plan & Features
              </h3>
              <div className="p-4 rounded-xl mb-3" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-base" style={{ color: "var(--color-text-primary)" }}>
                    Snafasa Scan Free Tier
                  </span>
                  <span className="badge badge-success">Unlimited Access</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  You have full access to all features: 20+ OCR languages, image enhancement, Word/PDF/CSV exports, and cloud conversion history.
                </p>
              </div>
            </div>

            {/* Conversion history */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg" style={{ color: "var(--color-text-primary)" }}>
                    Conversion History
                  </h3>
                  <History className="h-5 w-5" style={{ color: "var(--color-text-muted)" }} />
                </div>

                {loadingHistory ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => <div key={i} className="skeleton h-14 w-full" />)}
                  </div>
                ) : conversions.length === 0 ? (
                  <div className="text-center py-10">
                    <History className="h-10 w-10 mx-auto mb-3" style={{ color: "var(--color-text-muted)" }} />
                    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                      No conversions yet. <Link href="/convert" className="underline" style={{ color: "var(--color-primary-500)" }}>Convert an image</Link>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {conversions.map((c) => (
                      <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl"
                        style={{ background: "var(--color-surface-2)" }}>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0"
                          style={{ background: "var(--color-primary-100)" }}>
                          <User className="h-4 w-4" style={{ color: "var(--color-primary-500)" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: "var(--color-text-primary)" }}>
                            {c.sourceFileName}
                          </p>
                          <p className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>
                            {c.extractedTextPreview}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs shrink-0"
                          style={{ color: "var(--color-text-muted)" }}>
                          <Calendar className="h-3 w-3" />
                          {c.createdAt?.toDate().toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 animate-spin" style={{ borderColor: "var(--color-primary-500)", borderTopColor: "transparent" }} />
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}
