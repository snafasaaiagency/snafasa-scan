"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { APP_NAME } from "@/lib/config";
import { Shield, Users, CheckCircle2 } from "lucide-react";

export default function AdminPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || profile?.role !== "admin")) {
      router.replace("/");
    }
  }, [loading, user, profile, router]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 animate-spin"
          style={{ borderColor: "var(--color-primary-500)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (profile.role !== "admin") return null;

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "var(--color-primary-100)" }}>
            <Shield className="h-5 w-5" style={{ color: "var(--color-primary-500)" }} />
          </div>
          <div>
            <h1 className="text-2xl font-black" style={{ color: "var(--color-text-primary)" }}>
              {APP_NAME} Admin Dashboard
            </h1>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Signed in as {profile.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="h-6 w-6" style={{ color: "var(--color-success)" }} />
              <h2 className="font-bold text-lg" style={{ color: "var(--color-text-primary)" }}>
                100% Free Platform
              </h2>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              Snafasa Scan operate with all features unlocked for every user. No payment verification queues or manual approvals are needed.
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-6 w-6" style={{ color: "var(--color-primary-500)" }} />
              <h2 className="font-bold text-lg" style={{ color: "var(--color-text-primary)" }}>
                User Management
              </h2>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              All registered users automatically receive full access to 20+ OCR languages, image enhancement, and cloud history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
