"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  defaultTab?: "signin" | "signup";
  onSuccess?: () => void;
  embedded?: boolean;
}

export default function AuthModal({
  defaultTab = "signin",
  onSuccess,
  embedded = false,
}: AuthModalProps) {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (tab === "signin") {
        await signIn(email, password);
      } else {
        if (!name.trim()) { setError("Please enter your name."); setLoading(false); return; }
        await signUp(email, password, name.trim());
      }
      onSuccess?.();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "Authentication failed.";
      if (msg.includes("invalid-credential") || msg.includes("wrong-password")) {
        setError("Incorrect email or password.");
      } else if (msg.includes("user-not-found")) {
        setError("No account found with that email. Sign up instead?");
      } else if (msg.includes("email-already-in-use")) {
        setError("An account with this email already exists. Sign in instead?");
      } else if (msg.includes("weak-password")) {
        setError("Password must be at least 6 characters.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      onSuccess?.();
    } catch (err: unknown) {
      setError((err as { message?: string })?.message ?? "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const containerClass = embedded
    ? "w-full"
    : "card w-full max-w-md mx-auto p-8 animate-scale-in";

  return (
    <div className={containerClass}>
      {/* Tabs */}
      <div
        className="flex rounded-xl p-1 mb-6"
        style={{ background: "var(--color-surface-3)" }}
      >
        {(["signin", "signup"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setError(null); }}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-semibold transition-all",
              tab === t
                ? "text-white shadow-sm"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            )}
            style={tab === t ? { background: "var(--color-primary-500)" } : {}}
          >
            {t === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      {/* Google */}
      <button
        onClick={handleGoogle}
        disabled={loading}
        className="btn w-full mb-4"
        style={{
          background: "var(--color-surface-2)",
          border: "1.5px solid var(--color-border)",
          color: "var(--color-text-primary)",
        }}
      >
        <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <hr className="flex-1" style={{ borderColor: "var(--color-border)" }} />
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>or</span>
        <hr className="flex-1" style={{ borderColor: "var(--color-border)" }} />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {tab === "signup" && (
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
              Full name
            </label>
            <input
              className="input"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
            Email address
          </label>
          <input
            className="input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete={tab === "signin" ? "email" : "new-email"}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
            Password
          </label>
          <div className="relative">
            <input
              className="input pr-10"
              type={showPw ? "text" : "password"}
              placeholder={tab === "signup" ? "Min. 6 characters" : "Your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={tab === "signin" ? "current-password" : "new-password"}
              minLength={6}
              required
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--color-text-muted)" }}
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm p-3 rounded-lg animate-fade-in"
            style={{ background: "hsl(0 72% 51% / 0.08)", color: "var(--color-error)", border: "1px solid hsl(0 72% 51% / 0.2)" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? (
            <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : tab === "signin" ? (
            <><LogIn className="h-4 w-4" /> Sign in</>
          ) : (
            <><UserPlus className="h-4 w-4" /> Create free account</>
          )}
        </button>
      </form>
    </div>
  );
}
