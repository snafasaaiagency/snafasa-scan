"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { APP_NAME } from "@/lib/config";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/convert", label: "Convert" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return saved === "dark" || (!saved && prefersDark);
  });
  const [scrolled, setScrolled] = useState(false);

  // Sync class on mount
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "glass shadow-md py-2"
          : "bg-transparent py-4"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-xl"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          <Image
            src="/logo.png"
            alt={`${APP_NAME} logo`}
            width={38}
            height={38}
            priority
            className="rounded-xl shadow-md border border-white/10"
          />
          <span style={{ color: "var(--color-text-primary)" }}>
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: "var(--color-text-secondary)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
                (e.currentTarget as HTMLElement).style.background = "var(--color-surface-3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right controls */}
        <div className="hidden md:flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="btn btn-ghost btn-sm"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user && profile ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all"
                style={{ borderColor: "var(--color-border)", background: "var(--color-surface-2)" }}
              >
                <div
                  className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "var(--color-primary-500)" }}
                >
                  {(profile.displayName || profile.email)[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                  {profile.displayName || profile.email.split("@")[0]}
                </span>
                <ChevronDown className="h-3.5 w-3.5" style={{ color: "var(--color-text-muted)" }} />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 card animate-scale-in p-1 z-50"
                  style={{ boxShadow: "var(--shadow-lg)" }}
                >
                  <div className="px-3 py-2 border-b" style={{ borderColor: "var(--color-border)" }}>
                    <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Signed in as</p>
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>{profile.email}</p>
                    <span className="badge badge-primary mt-1">
                      {profile.plan === "free" ? "Free" : profile.plan.replace("tier", "Tier ")}
                    </span>
                  </div>
                  <Link href="/account" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors btn-ghost w-full text-left mt-1" onClick={() => setUserMenuOpen(false)}>
                    <User className="h-4 w-4" /> Account
                  </Link>
                  {profile.role === "admin" && (
                    <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors btn-ghost w-full text-left" onClick={() => setUserMenuOpen(false)}>
                      <Settings className="h-4 w-4" /> Admin
                    </Link>
                  )}
                  <button
                    onClick={() => { signOut(); setUserMenuOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full text-left transition-colors"
                    style={{ color: "var(--color-error)" }}
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/account" className="btn btn-ghost btn-sm">Sign in</Link>
              <Link href="/account?tab=signup" className="btn btn-primary btn-sm">Get started free</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={toggleDark} className="btn btn-ghost btn-sm" aria-label="Toggle dark mode">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="btn btn-ghost btn-sm"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden glass border-t animate-fade-in"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-4 py-3 rounded-lg text-sm font-medium"
                style={{ color: "var(--color-text-secondary)" }}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="border-t my-2" style={{ borderColor: "var(--color-border)" }} />
            {user ? (
              <>
                <Link href="/account" className="btn btn-outline w-full" onClick={() => setMenuOpen(false)}>Account</Link>
                <button onClick={() => { signOut(); setMenuOpen(false); }} className="btn btn-ghost w-full">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/account" className="btn btn-outline w-full" onClick={() => setMenuOpen(false)}>Sign in</Link>
                <Link href="/account?tab=signup" className="btn btn-primary w-full" onClick={() => setMenuOpen(false)}>Get started free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
